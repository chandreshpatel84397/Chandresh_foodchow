using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Interfaces
{
    public interface IFoodItemIngredientRepository
    {

        Task<IEnumerable<FoodItemIngredientDTO>> GetByShopId(long shop_id);

        Task<long> Insert(FoodItemIngredientDTO dto);

        Task<bool> Update(FoodItemIngredientDTO dto);

        Task<bool> Delete(long ingredient_id, long shop_id);

    }
}