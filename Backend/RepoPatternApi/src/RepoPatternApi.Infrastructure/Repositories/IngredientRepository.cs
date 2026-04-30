using Microsoft.Extensions.Configuration;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;
using RepoPatternApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Infrastructure.Repositories
{
    public class IngredientRepository : IIngredientRepository
    {
        private readonly IConfiguration _configuration;

        public IngredientRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private SqlConnection GetConnection()
        {
            return new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );
        }

        // DISPLAY LIST
        public async Task<List<IngredientDTO>> GetAll(long shop_id)
        {
            List<IngredientDTO> list = new List<IngredientDTO>();

            using (SqlConnection con = GetConnection())
            {
                string query = @"

                select
                i.ingredient_id,
                i.shop_id,
                i.ingredient_category_id,
                i.ingredient_name,
                s.price,
                i.is_veg,
                i.status

                from food_item_ingredients i

                left join food_item_ingredient_size s
                on i.ingredient_id = s.item_ingredient_id

                where i.shop_id = @shop_id
                ";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@shop_id", shop_id);

                await con.OpenAsync();

                SqlDataReader reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    list.Add(new IngredientDTO
                    {
                        ingredient_id = reader["ingredient_id"] != DBNull.Value ? Convert.ToInt64(reader["ingredient_id"]) : 0,
                        shop_id = reader["shop_id"] != DBNull.Value ? Convert.ToInt64(reader["shop_id"]) : 0,
                        ingredient_category_id = reader["ingredient_category_id"] != DBNull.Value ? Convert.ToInt64(reader["ingredient_category_id"]) : 0,
                        ingredient_name = reader["ingredient_name"]?.ToString() ?? "",
                        price = reader["price"] != DBNull.Value ? Convert.ToSingle(reader["price"]) : 0,
                        is_veg = reader["is_veg"] != DBNull.Value ? Convert.ToInt64(reader["is_veg"]) == 1 : false,
                        status = reader["status"] != DBNull.Value ? Convert.ToInt64(reader["status"]) == 1 : false
                    });
                }



                con.Close();
            }

            return list;
        }

        // SINGLE RECORD
        public async Task<IngredientDTO> GetById(long id)
        {
            IngredientDTO dto = new IngredientDTO();

            using (SqlConnection con = GetConnection())
            {
                string query = @"

                select
                i.ingredient_id,
                i.shop_id,
                i.ingredient_category_id,
                i.ingredient_name,
                s.price,
                i.is_veg,
                i.status

                from food_item_ingredients i

                left join food_item_ingredient_size s
                on i.ingredient_id = s.item_ingredient_id

                where i.ingredient_id = @id
                ";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@id", id);

                await con.OpenAsync();

                SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    dto.ingredient_id = Convert.ToInt64(reader["ingredient_id"]);

                    dto.shop_id = Convert.ToInt64(reader["shop_id"]);

                    dto.ingredient_category_id = Convert.ToInt64(reader["ingredient_category_id"]);

                    dto.ingredient_name = reader["ingredient_name"].ToString();

                    dto.price = Convert.ToSingle(reader["price"]);

                    dto.is_veg = Convert.ToInt64(reader["is_veg"]) == 1;

                    dto.status = Convert.ToInt64(reader["status"]) == 1;
                }

                con.Close();
            }

            return dto;
        }

        // INSERT
        public async Task Insert(IngredientDTO dto)
        {
            using (SqlConnection con = GetConnection())
            {
                await con.OpenAsync();

                SqlTransaction transaction = con.BeginTransaction();

                try
                {

                    string insertIngredient = @"

            DECLARE @newId BIGINT

            SELECT @newId =
            ISNULL(MAX(ingredient_id),0) + 1

            FROM food_item_ingredients


            INSERT INTO food_item_ingredients
            (
                ingredient_id,
                shop_id,
                ingredient_category_id,
                ingredient_name,
                is_size_available,
                is_veg,
                status,
                created_date,
                sold_out_flag
            )

            VALUES
            (
                @newId,
                @shop_id,
                @ingredient_category_id,
                @ingredient_name,
                0,
                @is_veg,
                @status,
                GETDATE(),
                0
            )

            SELECT @newId
            ";


                    SqlCommand cmd1 =
                    new SqlCommand(insertIngredient, con, transaction);


                    cmd1.Parameters.AddWithValue("@shop_id", dto.shop_id);

                    cmd1.Parameters.AddWithValue("@ingredient_category_id", dto.ingredient_category_id);

                    cmd1.Parameters.AddWithValue("@ingredient_name", dto.ingredient_name);

                    cmd1.Parameters.AddWithValue("@is_veg", dto.is_veg ? 1 : 0);

                    cmd1.Parameters.AddWithValue("@status", dto.status ? 1 : 0);


                    long ingredientId =
                    Convert.ToInt64(await cmd1.ExecuteScalarAsync());


                    string insertPrice = @"

            INSERT INTO food_item_ingredient_size
            (
                item_ingredient_id,
                price,
                created_date,
                status,
                sold_out
            )

            VALUES
            (
                @ingredientId,
                @price,
                GETDATE(),
                1,
                0
            )
            ";


                    SqlCommand cmd2 =
                    new SqlCommand(insertPrice, con, transaction);


                    cmd2.Parameters.AddWithValue("@ingredientId", ingredientId);

                    cmd2.Parameters.AddWithValue("@price", dto.price);


                    await cmd2.ExecuteNonQueryAsync();


                    transaction.Commit();
                }
                catch
                {
                    transaction.Rollback();

                    throw;
                }
            }
        }

        // UPDATE
        public async Task Update(IngredientDTO dto)
        {
            using (SqlConnection con = GetConnection())
            {
                await con.OpenAsync();

                SqlTransaction transaction = con.BeginTransaction();

                try
                {

                    string updateIngredient = @"

            update food_item_ingredients

            set
                ingredient_category_id = @ingredient_category_id,

                ingredient_name = @ingredient_name,

                is_veg = @is_veg,

                status = @status,

                updated_date = GETDATE()

            where ingredient_id = @ingredient_id
            and shop_id = @shop_id
            ";

                    SqlCommand cmd1 =
                    new SqlCommand(updateIngredient, con, transaction);


                    cmd1.Parameters.AddWithValue("@ingredient_id", dto.ingredient_id);

                    cmd1.Parameters.AddWithValue("@shop_id", dto.shop_id);

                    cmd1.Parameters.AddWithValue("@ingredient_category_id", dto.ingredient_category_id);

                    cmd1.Parameters.AddWithValue("@ingredient_name", dto.ingredient_name);

                    cmd1.Parameters.AddWithValue("@is_veg", dto.is_veg ? 1 : 0);

                    cmd1.Parameters.AddWithValue("@status", dto.status ? 1 : 0);


                    await cmd1.ExecuteNonQueryAsync();



                    string updatePrice = @"

            update food_item_ingredient_size

            set
                price = @price,

                updated_date = GETDATE()

            where item_ingredient_id = @ingredient_id
            ";


                    SqlCommand cmd2 =
                    new SqlCommand(updatePrice, con, transaction);


                    cmd2.Parameters.AddWithValue("@ingredient_id", dto.ingredient_id);

                    cmd2.Parameters.AddWithValue("@price", dto.price);


                    await cmd2.ExecuteNonQueryAsync();


                    transaction.Commit();

                }
                catch
                {
                    transaction.Rollback();

                    throw;
                }
            }
        }

        //delete
        public async Task Delete(long ingredient_id, long shop_id)
        {
            using (SqlConnection con = GetConnection())
            {
                await con.OpenAsync();

                // Delete from size table first
                string deleteSize = @"
            DELETE FROM food_item_ingredient_size 
            WHERE item_ingredient_id = @ingredient_id
        ";

                SqlCommand cmd1 = new SqlCommand(deleteSize, con);
                cmd1.Parameters.AddWithValue("@ingredient_id", ingredient_id);
                await cmd1.ExecuteNonQueryAsync();

                // Then delete from ingredients table
                string deleteIngredient = @"
            DELETE FROM food_item_ingredients 
            WHERE ingredient_id = @ingredient_id 
            AND shop_id = @shop_id
        ";

                SqlCommand cmd2 = new SqlCommand(deleteIngredient, con);
                cmd2.Parameters.AddWithValue("@ingredient_id", ingredient_id);
                cmd2.Parameters.AddWithValue("@shop_id", shop_id);
                await cmd2.ExecuteNonQueryAsync();

                con.Close();
            }
        }
    }
}