using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using RepoPatternApi.Domain.DTO;
using RepoPatternApi.Services;

namespace RepoPatternApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuUploadController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public MenuUploadController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("upload-excel")]
        public async Task<IActionResult> UploadExcel(IFormFile file, [FromQuery] long shopId = 1)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { message = "No file uploaded" });

                var ext = Path.GetExtension(file.FileName).ToLower();
                if (ext != ".xls" && ext != ".xlsx")
                    return BadRequest(new { message = "Only Excel files allowed" });

                List<FoodItemCreateDto> items;
                List<string> errors;

                using (var stream = file.OpenReadStream())
                {
                    (items, errors) = ExcelMenuParser.Parse(stream, shopId);
                }

                if (items.Count == 0)
                    return BadRequest(new { message = "No valid data found", errors });

                int inserted = 0;

                using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                await conn.OpenAsync();

                foreach (var item in items)
                {
                    long cateId = 0;
                    string categoryName = item.note?.Trim() ?? "";

                    item.note = null;

                    if (!string.IsNullOrEmpty(categoryName))
                    {
                        var catCmd = new SqlCommand(
                            "SELECT TOP 1 id FROM food_category WHERE LOWER(cate_name)=LOWER(@name) AND shop_id=@shopId",
                            conn);

                        catCmd.Parameters.AddWithValue("@name", categoryName);
                        catCmd.Parameters.AddWithValue("@shopId", item.shop_id);

                        var result = await catCmd.ExecuteScalarAsync();

                        if (result != null)
                        {
                            cateId = Convert.ToInt64(result);
                        }
                        else
                        {
                            var insertCat = new SqlCommand(@"
                                INSERT INTO food_category (cate_name, shop_id, cate_position)
                                OUTPUT INSERTED.id
                                VALUES (@name, @shopId, 1)", conn);

                            insertCat.Parameters.AddWithValue("@name", categoryName);
                            insertCat.Parameters.AddWithValue("@shopId", item.shop_id);

                            cateId = Convert.ToInt64(await insertCat.ExecuteScalarAsync());
                        }
                    }

                    item.cate_id = cateId;

                    // Duplicate check
                    var checkItem = new SqlCommand(@"
                        SELECT COUNT(*) FROM food_item 
                        WHERE item_name=@name AND cate_id=@cateId AND shop_id=@shopId", conn);

                    checkItem.Parameters.AddWithValue("@name", item.item_name ?? "");
                    checkItem.Parameters.AddWithValue("@cateId", cateId);
                    checkItem.Parameters.AddWithValue("@shopId", item.shop_id);

                    int exists = (int)await checkItem.ExecuteScalarAsync();

                    if (exists > 0)
                        continue;

                    // ✅ FIX: Generate next item_id manually since column is not IDENTITY
                    var maxIdCmd = new SqlCommand(
                        "SELECT ISNULL(MAX(item_id), 0) + 1 FROM food_item", conn);
                    long nextItemId = Convert.ToInt64(await maxIdCmd.ExecuteScalarAsync());

                    // Insert item with explicit item_id
                    var insert = new SqlCommand(@"
                        INSERT INTO food_item
                        (item_id, cate_id, item_name, description, is_veg, is_alcohol, status, shop_id,
                         item_position, created_date, updated_date, ordering_method, open_price)
                        VALUES
                        (@item_id, @cate_id, @item_name, @description, @is_veg, @is_alcohol, @status, @shop_id,
                         @item_position, @created_date, @updated_date, @ordering_method, @open_price)", conn);

                    insert.Parameters.AddWithValue("@item_id", nextItemId);
                    insert.Parameters.AddWithValue("@cate_id", cateId);
                    insert.Parameters.AddWithValue("@item_name", item.item_name ?? "");
                    insert.Parameters.AddWithValue("@description", item.description ?? "");
                    insert.Parameters.AddWithValue("@is_veg", item.is_veg);
                    insert.Parameters.AddWithValue("@is_alcohol", item.is_alcohol);
                    insert.Parameters.AddWithValue("@status", item.status);
                    insert.Parameters.AddWithValue("@shop_id", item.shop_id);
                    insert.Parameters.AddWithValue("@item_position", item.item_position);
                    insert.Parameters.AddWithValue("@created_date", item.created_date ?? DateTime.UtcNow);
                    insert.Parameters.AddWithValue("@updated_date", item.updated_date ?? DateTime.UtcNow);
                    insert.Parameters.AddWithValue("@ordering_method", item.ordering_method ?? "NORMAL");
                    insert.Parameters.AddWithValue("@open_price", item.open_price);

                    await insert.ExecuteNonQueryAsync();
                    inserted++;
                }

                return Ok(new
                {
                    message = "Upload successful",
                    inserted,
                    total = items.Count,
                    errors
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Server error",
                    error = ex.Message
                });
            }
        }
    }
}