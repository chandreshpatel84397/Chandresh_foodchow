using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Infrastructure.Repositories
{
    public class FoodApplyTaxRepository : IFoodApplyTaxRepository
    {
        private readonly IConfiguration _config;

        public FoodApplyTaxRepository(IConfiguration config)
        {
            _config = config;
        }

        private SqlConnection GetConnection()
        {
            return new SqlConnection(_config.GetConnectionString("DefaultConnection"));
        }

        // ✅ FIXED: get price from food_item
        public async Task<double> GetItemPriceAsync(long size_id)
        {
            string query = "SELECT open_price FROM food_item WHERE item_id = @id";

            using var conn = GetConnection();
            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@id", size_id);

            await conn.OpenAsync();

            var result = await cmd.ExecuteScalarAsync();

            if (result == null || result == DBNull.Value)
                throw new Exception("Item price not found");

            return Convert.ToDouble(result);
        }

        public async Task<(double tax_percent, long tax_type)> GetTaxDetailsAsync(long tax_id)
        {
            string query = "SELECT tax_percentage, tax_type FROM food_shop_tax WHERE food_shop_tax_id = @taxid";

            using var conn = GetConnection();
            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@taxid", tax_id);

            await conn.OpenAsync();
            using var dr = await cmd.ExecuteReaderAsync();

            if (await dr.ReadAsync())
            {
                double percent = Convert.ToDouble(dr["tax_percentage"]);
                long type = Convert.ToInt64(dr["tax_type"]);

                return (percent, type);
            }

            throw new Exception("Tax not found");
        }

        public async Task<bool> IsTaxAlreadyAppliedAsync(long item_id, long size_id, long tax_id)
        {
            string query = @"SELECT COUNT(*) FROM food_sub_tax_amount
                             WHERE item_id=@item AND item_size_id=@size AND tax_id=@tax";

            using var conn = GetConnection();
            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@item", item_id);
            cmd.Parameters.AddWithValue("@size", size_id);
            cmd.Parameters.AddWithValue("@tax", tax_id);

            await conn.OpenAsync();

            int count = Convert.ToInt32(await cmd.ExecuteScalarAsync());

            return count > 0;
        }

        public async Task InsertAppliedTaxAsync(ApplyTaxDTO dto, double tax_amount, long tax_type)
        {
            string query = @"INSERT INTO food_sub_tax_amount
                (item_id, shop_id, item_size_id, tax_id, tax_amount, tax_type)
                VALUES (@item, @shop, @size, @tax, @amount, @type)";

            using var conn = GetConnection();
            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@item", dto.item_id);
            cmd.Parameters.AddWithValue("@shop", dto.shop_id);
            cmd.Parameters.AddWithValue("@size", dto.size_id); // mapped
            cmd.Parameters.AddWithValue("@tax", dto.tax_id);
            cmd.Parameters.AddWithValue("@amount", tax_amount);
            cmd.Parameters.AddWithValue("@type", tax_type);

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task<bool> RemoveAppliedTaxAsync(ApplyTaxDTO dto)
        {
            string query = @"DELETE FROM food_sub_tax_amount
                             WHERE item_id=@item AND item_size_id=@size AND tax_id=@tax";

            using var conn = GetConnection();
            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@item", dto.item_id);
            cmd.Parameters.AddWithValue("@size", dto.size_id);
            cmd.Parameters.AddWithValue("@tax", dto.tax_id);

            await conn.OpenAsync();

            int rows = await cmd.ExecuteNonQueryAsync();

            return rows > 0;
        }

        // ✅ AUTO CHECK SUPPORT
        public async Task<List<(long item_id, long size_id)>> GetAppliedTaxAsync(long tax_id)
        {
            string query = @"SELECT item_id, item_size_id
                             FROM food_sub_tax_amount
                             WHERE tax_id = @tax";

            using var conn = GetConnection();
            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@tax", tax_id);

            await conn.OpenAsync();

            var list = new List<(long, long)>();

            using var dr = await cmd.ExecuteReaderAsync();

            while (await dr.ReadAsync())
            {
                long item = Convert.ToInt64(dr["item_id"]);
                long size = Convert.ToInt64(dr["item_size_id"]);

                list.Add((item, size));
            }

            return list;
        }
    }
}