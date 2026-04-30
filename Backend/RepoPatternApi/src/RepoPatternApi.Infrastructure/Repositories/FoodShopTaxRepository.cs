using Microsoft.Extensions.Configuration;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;
using System.Data.SqlClient;

namespace RepoPatternApi.Infrastructure.Repositories
{
    public class FoodShopTaxRepository : IFoodShopTaxRepository
    {
        private readonly IConfiguration _config;

        public FoodShopTaxRepository(IConfiguration config)
        {
            _config = config;
        }

        private SqlConnection GetConnection()
        {
            return new SqlConnection(_config.GetConnectionString("DefaultConnection"));
        }

        // ================= DUPLICATE CHECK =================
        private async Task<bool> TaxNameExistsAsync(string taxName, long? excludeId = null)
        {
            string query = excludeId.HasValue
                ? "SELECT COUNT(1) FROM food_shop_tax WHERE LOWER(TRIM(tax_name)) = LOWER(TRIM(@tax_name)) AND food_shop_tax_id != @excludeId"
                : "SELECT COUNT(1) FROM food_shop_tax WHERE LOWER(TRIM(tax_name)) = LOWER(TRIM(@tax_name))";

            using SqlConnection conn = GetConnection();
            using SqlCommand cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@tax_name", taxName ?? string.Empty);
            if (excludeId.HasValue)
                cmd.Parameters.AddWithValue("@excludeId", excludeId.Value);

            await conn.OpenAsync();
            var count = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(count) > 0;
        }

        // ================= ADD =================
        public async Task<long> AddTaxAsync(FoodShopTaxDTO dto)
        {
            // Duplicate check
            if (!string.IsNullOrWhiteSpace(dto.tax_name) && await TaxNameExistsAsync(dto.tax_name))
                throw new InvalidOperationException($"Tax with name '{dto.tax_name}' already exists.");

            string query = @"
                INSERT INTO food_shop_tax
                (food_country_tax_id, shop_id, tax_name, tax_percentage, is_active, tax_type, created_date)
                VALUES
                (@food_country_tax_id, @shop_id, @tax_name, @tax_percentage, @is_active, @tax_type, GETDATE());

                SELECT CAST(SCOPE_IDENTITY() AS BIGINT);
            ";

            using SqlConnection conn = GetConnection();
            using SqlCommand cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@food_country_tax_id", (object?)dto.food_country_tax_id ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@shop_id", (object?)dto.shop_id ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@tax_name", (object?)dto.tax_name ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@tax_percentage", (object?)dto.tax_percentage ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@is_active", (object?)dto.is_active ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@tax_type", (object?)dto.tax_type ?? DBNull.Value);

            await conn.OpenAsync();
            var insertedId = await cmd.ExecuteScalarAsync();

            return (insertedId != null && insertedId != DBNull.Value)
                ? Convert.ToInt64(insertedId)
                : 0;
        }

        // ================= GET ALL =================
        public async Task<List<FoodShopTaxDTO>> GetAllTaxAsync()
        {
            string query = "SELECT * FROM food_shop_tax ORDER BY created_date DESC";

            List<FoodShopTaxDTO> list = new();

            using SqlConnection conn = GetConnection();
            using SqlCommand cmd = new SqlCommand(query, conn);

            await conn.OpenAsync();
            using SqlDataReader reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new FoodShopTaxDTO
                {
                    food_shop_tax_id = reader.IsDBNull(reader.GetOrdinal("food_shop_tax_id"))
                        ? 0
                        : reader.GetInt64(reader.GetOrdinal("food_shop_tax_id")),

                    food_country_tax_id = reader.IsDBNull(reader.GetOrdinal("food_country_tax_id"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("food_country_tax_id")),

                    shop_id = reader.IsDBNull(reader.GetOrdinal("shop_id"))
                        ? null
                        : reader.GetInt64(reader.GetOrdinal("shop_id")),

                    tax_name = reader.IsDBNull(reader.GetOrdinal("tax_name"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("tax_name")),

                    tax_percentage = reader.IsDBNull(reader.GetOrdinal("tax_percentage"))
                        ? null
                        : Convert.ToDouble(reader["tax_percentage"]),

                    is_active = reader.IsDBNull(reader.GetOrdinal("is_active"))
                        ? null
                        : reader.GetBoolean(reader.GetOrdinal("is_active")),

                    tax_type = reader.IsDBNull(reader.GetOrdinal("tax_type"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("tax_type")),

                    created_date = reader.IsDBNull(reader.GetOrdinal("created_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("created_date")),

                    updated_date = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date"))
                });
            }

            return list;
        }

        // ================= UPDATE =================
        public async Task UpdateTaxAsync(long id, FoodShopTaxDTO dto)
        {
            // Duplicate check (exclude current record)
            if (!string.IsNullOrWhiteSpace(dto.tax_name) && await TaxNameExistsAsync(dto.tax_name, excludeId: id))
                throw new InvalidOperationException($"Tax with name '{dto.tax_name}' already exists.");

            string query = @"
                UPDATE food_shop_tax SET
                    food_country_tax_id = @food_country_tax_id,
                    shop_id             = @shop_id,
                    tax_name            = @tax_name,
                    tax_percentage      = @tax_percentage,
                    is_active           = @is_active,
                    tax_type            = @tax_type,
                    updated_date        = GETDATE()
                WHERE food_shop_tax_id = @id";

            using SqlConnection conn = GetConnection();
            using SqlCommand cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@id", id);
            cmd.Parameters.AddWithValue("@food_country_tax_id", (object?)dto.food_country_tax_id ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@shop_id", (object?)dto.shop_id ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@tax_name", (object?)dto.tax_name ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@tax_percentage", (object?)dto.tax_percentage ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@is_active", (object?)dto.is_active ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@tax_type", (object?)dto.tax_type ?? DBNull.Value);

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }

        // ================= DELETE =================
        public async Task DeleteTaxAsync(long id)
        {
            string deleteChildQuery = "DELETE FROM food_deals_tax WHERE tax_id = @id";
            string deleteParentQuery = "DELETE FROM food_shop_tax WHERE food_shop_tax_id = @id";

            using SqlConnection conn = GetConnection();
            await conn.OpenAsync();

            using SqlTransaction transaction = conn.BeginTransaction();

            try
            {
                using (SqlCommand childCmd = new SqlCommand(deleteChildQuery, conn, transaction))
                {
                    childCmd.Parameters.AddWithValue("@id", id);
                    await childCmd.ExecuteNonQueryAsync();
                }

                using (SqlCommand parentCmd = new SqlCommand(deleteParentQuery, conn, transaction))
                {
                    parentCmd.Parameters.AddWithValue("@id", id);
                    await parentCmd.ExecuteNonQueryAsync();
                }

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}