using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.Entities;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
 

namespace RepoPatternApi.Application.Services
{
    public class FoodItemCustomCategoryService : IFoodItemCustomCategoryRepository
    {
        private readonly IConfiguration _configuration;

        public FoodItemCustomCategoryService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // INSERT
        public async Task AddAsync(FoodItemCustomCategory category)
        {
            string query = @"
                INSERT INTO food_item_custom_category
                ( shop_id, custom_cat_name, status, created_date, updated_date)
                VALUES
                (@shop_id, @custom_cat_name, @status, GETDATE(), NULL)
            ";

            using SqlConnection con =
                new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            using SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@custom_cat_id", category.custom_cat_id);
            cmd.Parameters.AddWithValue("@shop_id", category.shop_id);
            cmd.Parameters.AddWithValue("@custom_cat_name", category.custom_cat_name);
            cmd.Parameters.AddWithValue("@status", category.status);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }

        // GET ALL BY SHOP
        public async Task<List<FoodItemCustomCategory>> GetAllAsync(long shopId)
        {
            var list = new List<FoodItemCustomCategory>();

            string query = @"
                SELECT custom_cat_id,shop_id,custom_cat_name,status,created_date,updated_date
                FROM food_item_custom_category WHERE shop_id = @shop_id";

            using SqlConnection con =
                new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            using SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@shop_id", shopId);

            await con.OpenAsync();
            using SqlDataReader dr = await cmd.ExecuteReaderAsync();

            while (await dr.ReadAsync())
            {
                list.Add(new FoodItemCustomCategory
                {
                    custom_cat_id = Convert.ToInt64(dr["custom_cat_id"]),
                    shop_id = Convert.ToInt64(dr["shop_id"]),
                    custom_cat_name = dr["custom_cat_name"].ToString(),
                    status = Convert.ToInt64(dr["status"]),
                    created_date = dr["created_date"] == DBNull.Value ? null : Convert.ToDateTime(dr["created_date"]),
                    updated_date = dr["updated_date"] == DBNull.Value ? null : Convert.ToDateTime(dr["updated_date"])
                });
            }

            return list;
        }

        // UPDATE
        public async Task UpdateAsync(FoodItemCustomCategory category)
        {
            string query = @"
        UPDATE dbo.food_item_custom_category
        SET
            custom_cat_name = @custom_cat_name,
            status = @status,
            updated_date = GETDATE()
        WHERE custom_cat_id = @custom_cat_id
    ";

            using SqlConnection con =
                new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            using SqlCommand cmd = new SqlCommand(query, con);

            cmd.Parameters.AddWithValue("@custom_cat_id", category.custom_cat_id);
            cmd.Parameters.AddWithValue("@custom_cat_name", category.custom_cat_name);
            cmd.Parameters.AddWithValue("@status", category.status);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }

        // get by id 
        public async Task<FoodItemCustomCategory> GetByIdAsync(long id)
        {
            string query = @"
        SELECT custom_cat_id, shop_id, custom_cat_name, status
        FROM dbo.food_item_custom_category
        WHERE custom_cat_id = @id
    ";

            using SqlConnection con =
                new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            using SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@id", id);

            await con.OpenAsync();
            using SqlDataReader dr = await cmd.ExecuteReaderAsync();

            if (await dr.ReadAsync())
            {
                return new FoodItemCustomCategory
                {
                    custom_cat_id = Convert.ToInt64(dr["custom_cat_id"]),
                    shop_id = Convert.ToInt64(dr["shop_id"]),
                    custom_cat_name = dr["custom_cat_name"].ToString(),
                    status = Convert.ToInt64(dr["status"])
                };
            }

            return null;
        }






        // DELETE
        public async Task DeleteAsync(long customCatId)
        {
            string query = @"
        DELETE FROM dbo.food_item_custom_category
        WHERE custom_cat_id = @custom_cat_id
    ";

            using SqlConnection con =
                new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            using SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@custom_cat_id", customCatId);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }


    }



}
