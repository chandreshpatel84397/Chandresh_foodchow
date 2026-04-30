using Dapper;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Infrastructure.Repositories
{
    public class FoodItemIngredientRepository : IFoodItemIngredientRepository
    {

        private readonly IDbConnection _db;

        public FoodItemIngredientRepository(IDbConnection db)
        {
            _db = db;
        }


        // DISPLAY BY shop_id

        public async Task<IEnumerable<FoodItemIngredientDTO>> GetByShopId(long shop_id)
        {

            string query = @"

            SELECT *

            FROM food_item_ingredients

            WHERE shop_id=@shop_id

            ORDER BY ingredient_name";


            return await _db.QueryAsync<FoodItemIngredientDTO>(query,
            new { shop_id });

        }


        // INSERT

        public async Task<long> Insert(FoodItemIngredientDTO dto)
        {

            string query = @"

            INSERT INTO food_item_ingredients
            (

            ingredient_id,
            shop_id,
            ingredient_name,
            ingredient_category_id,
            is_size_available,
            is_veg,
            status,
            created_date,
            sold_out_flag

            )

            VALUES
            (

            @ingredient_id,
            @shop_id,
            @ingredient_name,
            @ingredient_category_id,
            @is_size_available,
            @is_veg,
            @status,
            GETDATE(),
            @sold_out_flag

            )";


            await _db.ExecuteAsync(query, dto);

            return dto.ingredient_id;

        }



        // UPDATE

        public async Task<bool> Update(FoodItemIngredientDTO dto)
        {

            string query = @"

            UPDATE food_item_ingredients

            SET

            ingredient_name=@ingredient_name,
            ingredient_category_id=@ingredient_category_id,
            is_size_available=@is_size_available,
            is_veg=@is_veg,
            status=@status,
            updated_date=GETDATE(),
            sold_out_flag=@sold_out_flag

            WHERE ingredient_id=@ingredient_id

            AND shop_id=@shop_id";


            int rows = await _db.ExecuteAsync(query, dto);

            return rows > 0;

        }



        // DELETE

        public async Task<bool> Delete(long ingredient_id, long shop_id)
        {

            string query = @"

            DELETE FROM food_item_ingredients

            WHERE ingredient_id=@ingredient_id

            AND shop_id=@shop_id";


            int rows = await _db.ExecuteAsync(query,
            new { ingredient_id, shop_id });


            return rows > 0;

        }

    }
}