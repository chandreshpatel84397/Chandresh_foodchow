using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Domain.DTO;
using System.Data.SqlClient;

namespace RepoPatternApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodCategoryController : ControllerBase
    {
        private readonly string conStr = "Server=localhost\\MSSQLSERVER02;Database=foodchow_new;Trusted_Connection=True;Encrypt=True;TrustServerCertificate=True";

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromForm] CreateFoodCategoryDTO dto, IFormFile? image)
        {
            using var con = new SqlConnection(conStr);
            await con.OpenAsync();

            string imagePath = "";

            if (image != null && image.Length > 0)
            {
                // ✅ 5MB limit
                if (image.Length > 5 * 1024 * 1024)
                    return BadRequest("Image size must be less than 5MB");

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                var ext = Path.GetExtension(image.FileName).ToLower();

                if (!allowedExtensions.Contains(ext))
                    return BadRequest("Invalid image format");

                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var fileName = Guid.NewGuid().ToString() + ext;
                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                imagePath = "/images/" + fileName;
            }

            var cmd = new SqlCommand(@"
INSERT INTO food_category
(cate_name, cate_image, cate_position, description, status)
VALUES (@cate_name, @cate_image, 0, '', @status)", con);

            cmd.Parameters.AddWithValue("@cate_name", dto.cate_name ?? "");
            cmd.Parameters.AddWithValue("@cate_image", imagePath);
            cmd.Parameters.AddWithValue("@status", dto.status);

            await cmd.ExecuteNonQueryAsync();

            return Ok();
        }

        // GET ALL
        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            var list = new List<object>();

            using var con = new SqlConnection(conStr);
            await con.OpenAsync();

            var cmd = new SqlCommand("SELECT * FROM food_category", con);
            var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new
                {
                    categoryId = reader["id"],
                    categoryName = reader["cate_name"],
                    categoryImage = reader["cate_image"],
                    categoryStatus = Convert.ToInt64(reader["status"]) == 1
                });
            }

            return Ok(list);
        }

        // GET BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            using var con = new SqlConnection(conStr);
            await con.OpenAsync();

            var cmd = new SqlCommand("SELECT * FROM food_category WHERE id=@id", con);
            cmd.Parameters.AddWithValue("@id", id);

            var reader = await cmd.ExecuteReaderAsync();

            if (!reader.HasRows) return NotFound();

            await reader.ReadAsync();

            return Ok(new
            {
                shop_id = reader["shop_id"],
                cate_name = reader["cate_name"],
                cate_image = reader["cate_image"],
                status = reader["status"]
            });
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(long id, [FromForm] CreateFoodCategoryDTO dto, IFormFile? image)
        {
            using var con = new SqlConnection(conStr);
            await con.OpenAsync();

            string imagePath = dto.cate_image ?? "";

            if (image != null && image.Length > 0)
            {
                // ✅ 5MB limit
                if (image.Length > 5 * 1024 * 1024)
                    return BadRequest("Image size must be less than 5MB");

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                var ext = Path.GetExtension(image.FileName).ToLower();

                if (!allowedExtensions.Contains(ext))
                    return BadRequest("Invalid image format");

                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var fileName = Guid.NewGuid().ToString() + ext;
                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                imagePath = "/images/" + fileName;
            }

            var cmd = new SqlCommand(@"
UPDATE food_category SET
cate_name=@cate_name,
cate_image=@cate_image,
status=@status
WHERE id=@id", con);

            cmd.Parameters.AddWithValue("@id", id);
            cmd.Parameters.AddWithValue("@cate_name", dto.cate_name ?? "");
            cmd.Parameters.AddWithValue("@cate_image", imagePath);
            cmd.Parameters.AddWithValue("@status", dto.status);

            await cmd.ExecuteNonQueryAsync();

            return Ok();
        }

        // DELETE
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            using var con = new SqlConnection(conStr);
            await con.OpenAsync();

            var cmd = new SqlCommand("DELETE FROM food_category WHERE id=@id", con);
            cmd.Parameters.AddWithValue("@id", id);

            await cmd.ExecuteNonQueryAsync();

            return Ok();
        }


        [HttpPatch("toggle/{id}")]
        public async Task<IActionResult> Toggle(long id)
        {
            using var con = new SqlConnection(conStr);
            await con.OpenAsync();

            var cmd = new SqlCommand(@"
        UPDATE food_category
        SET status = CASE WHEN status = 1 THEN 0 ELSE 1 END
        WHERE id = @id", con);

            cmd.Parameters.AddWithValue("@id", id);

            int rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
                return NotFound();

            return Ok();
        }
    }
}