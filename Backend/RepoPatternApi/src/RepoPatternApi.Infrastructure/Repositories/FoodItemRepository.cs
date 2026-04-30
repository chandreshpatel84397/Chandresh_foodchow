using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;
using System.Net.Security;

namespace RepoPatternApi.Infrastructure.Repositories
{
    public class FoodItemRepository : IFoodItemRepository
    {
        private readonly IConfiguration _config;

        public FoodItemRepository(IConfiguration config)
        {
            _config = config;
        }

        public async Task<long> AddFoodItem(FoodItemCreateDto dto)
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();

            long itemId = long.Parse(
                DateTime.UtcNow.ToString("yyMMddHHmmss")
            );

            var sql = @"
            INSERT INTO food_item
            (
                item_id,
                cate_id,
                item_name,
                description,
                status,
                is_veg,
                non_veg_type,
                shop_id,   
                created_date
            )
            VALUES
            (
                @item_id,
                @cate_id,
                @item_name,
                @description,
                @status,
                @is_veg,
                @non_veg_type,
                @shop_id,
                GETDATE()
            )";

            await con.ExecuteAsync(sql, new
            {
                item_id = itemId,
                cate_id = dto.cate_id,
                item_name = dto.item_name,
                description = dto.description,
                status = dto.status,
                is_veg = dto.is_veg,
                shop_id = dto.shop_id,
                non_veg_type = dto.non_veg_type
            });

            return itemId;
        }

        public async Task<List<FoodItemCreateDto>> GetFoodItems()
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();

            var sql = @"
        SELECT 
            item_id,
            item_name,
            open_price,
            item_image
        FROM food_item ";

            var result = await con.QueryAsync<FoodItemCreateDto>(sql);

            return result.ToList();
        }

        public async Task<bool> DeleteFoodItem(long itemId)
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();

            var sql = @"
        DELETE FROM food_item
        WHERE item_id = @itemId
    ";

            var rows = await con.ExecuteAsync(sql, new { itemId });

            return rows > 0;
        }

        public async Task<bool> UpdateFoodItem(long itemId, FoodItemCreateDto dto)
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();

            var sql = @"
        UPDATE food_item
        SET
            item_name = @item_name,
            description = @description,
            item_image = @item_image,
            open_price = @open_price,
            status = @status,
            is_veg = @is_veg,
            non_veg_type = @non_veg_type,
            updated_date = GETDATE()
        WHERE item_id = @item_id
    ";

            var rows = await con.ExecuteAsync(sql, new
            {
                item_id = itemId,
                item_name = dto.item_name,
                description = dto.description,
                item_image = dto.item_image,
                open_price = dto.open_price,
                status = dto.status,
                is_veg = dto.is_veg,
                non_veg_type = dto.non_veg_type
            });

            return rows > 0;
        }

        public async Task<List<FoodItemCode>> GetItemNames(int categoryId)
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();
            var sql = @"
        SELECT 
            item_id,
            cate_id,
            item_name,
            open_price,
            item_image
        FROM food_item
        WHERE cate_id = @categoryId";

            var result = await con.QueryAsync<FoodItemCode>(sql, new
            {
                categoryId
            });

            return result.ToList();
        }

        public async Task<bool> UpdateItemCode(long itemId, string itemCode)
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();

            var sql = @"
        UPDATE food_item
        SET item_code = @item_code,
            updated_date = GETDATE()
        WHERE item_id = @item_id
    ";

            var rows = await con.ExecuteAsync(sql, new
            {
                item_id = itemId,
                item_code = itemCode
            });

            return rows > 0;
        }

        public async Task<bool> InsertItem(ItemInsert item)
        {
            long itemId = long.Parse(
    DateTime.UtcNow.ToString("yyMMddHHmm")
);
            using (SqlConnection conn = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string query = @"
        INSERT INTO food_item
        (item_id,cate_id, item_name, description, item_image, is_veg, non_veg_type, item_code, open_price,is_alcohol,status, created_date)
        VALUES
        (@item_id,@cate_id, @item_name, @description, @item_image, @is_veg, @non_veg_type, @item_code, @price,@is_alcohol,@status, GETDATE())";

                SqlCommand cmd = new SqlCommand(query, conn);

                cmd.Parameters.AddWithValue("@item_id", itemId);
                cmd.Parameters.AddWithValue("@cate_id", item.cate_id);
                cmd.Parameters.AddWithValue("@item_name", item.item_name);
                cmd.Parameters.AddWithValue("@description", item.description ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@item_image", item.item_image ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@is_veg", item.is_veg);
                cmd.Parameters.AddWithValue("@non_veg_type", item.non_veg_type);
                cmd.Parameters.AddWithValue("@item_code", item.item_code ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@price", item.price);
                cmd.Parameters.AddWithValue("@is_alcohol", item.is_alcohol);
                cmd.Parameters.AddWithValue("@status", item.status);

                await conn.OpenAsync();
                int rows = await cmd.ExecuteNonQueryAsync();

                return rows > 0;
            }
        }

        public async Task<bool> UpdateItem(long id, ItemInsert item)
        {
            using (SqlConnection conn = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string query = @"
        UPDATE food_item SET
            item_name = @item_name,
            description = @description,
            item_image = @item_image,
            is_veg = @is_veg,
            non_veg_type = @non_veg_type,
            item_code = @item_code,
            open_price = @price,
            is_alcohol = @is_alcohol
        WHERE item_id = @item_id";

                SqlCommand cmd = new SqlCommand(query, conn);

                cmd.Parameters.AddWithValue("@item_id", id);
                cmd.Parameters.AddWithValue("@item_name", item.item_name);
                cmd.Parameters.AddWithValue("@description", item.description ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@item_image", item.item_image ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@is_veg", item.is_veg);
                cmd.Parameters.AddWithValue("@non_veg_type", item.non_veg_type);
                cmd.Parameters.AddWithValue("@item_code", item.item_code ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@price", item.price);
                cmd.Parameters.AddWithValue("@is_alcohol", item.is_alcohol);

                await conn.OpenAsync();
                int rows = await cmd.ExecuteNonQueryAsync();

                return rows > 0;
            }
        }

        public async Task<List<ItemInsert>> GetItemList()
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();

            var sql = @"
SELECT item_id, item_name,item_image,  open_price AS price
FROM food_item";

            var result = await con.QueryAsync<ItemInsert>(sql);

            return result.ToList();
        }


        public async Task<ItemInsert> GetItemById(long id)
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();

            var sql = @"
SELECT 
    item_id, 
    item_name,
    description, 
    open_price AS price, 
    item_image,
    status,
    is_veg,
    non_veg_type,
    is_alcohol
FROM food_item
WHERE item_id = @id";

            var result = await con.QueryFirstOrDefaultAsync<ItemInsert>(sql, new { id });

            return result;
        }

        public async Task<bool> ToggleItemStatus(long item_id)
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();

            var sql = @"
UPDATE food_item
SET status = CASE 
                    WHEN status = 1 THEN 0 
                    ELSE 1 
                END
WHERE item_id = @item_id";

            var result = await con.ExecuteAsync(sql, new { item_id });

            return result > 0;
        }

        public async Task<List<ItemInsert>> GetItemByName(string itemName)
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();

            var sql = @"
SELECT item_id, item_name, item_image, open_price AS price
FROM food_item
WHERE item_name LIKE @item_name";

            var result = await con.QueryAsync<ItemInsert>(sql, new { item_name = $"%{itemName}%" });

            return result.ToList();
        }

        public async Task<bool> UpdateItemImage(long item_id, string item_image)
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();

            var sql = @"
UPDATE food_item
SET item_image = @item_image
WHERE item_id = @item_id";

            var result = await con.ExecuteAsync(sql, new { item_id, item_image });

            return result > 0;
        }
    }
}