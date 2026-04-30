using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Application.Services
{
    public class FoodItemIngredientService
    {

        private readonly IFoodItemIngredientRepository _repo;


        public FoodItemIngredientService(IFoodItemIngredientRepository repo)
        {
            _repo = repo;
        }


        public async Task<IEnumerable<FoodItemIngredientDTO>> Get(long shop_id)
        {
            return await _repo.GetByShopId(shop_id);
        }


        public async Task<long> Insert(FoodItemIngredientDTO dto)
        {
            return await _repo.Insert(dto);
        }


        public async Task<bool> Update(FoodItemIngredientDTO dto)
        {
            return await _repo.Update(dto);
        }


        public async Task<bool> Delete(long ingredient_id, long shop_id)
        {
            return await _repo.Delete(ingredient_id, shop_id);
        }

    }
}