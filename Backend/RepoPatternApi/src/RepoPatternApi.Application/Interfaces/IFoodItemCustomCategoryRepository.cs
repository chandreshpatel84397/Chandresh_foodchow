using System.Collections.Generic;
using System.Threading.Tasks;
using RepoPatternApi.Domain.Entities;

namespace RepoPatternApi.Application.Interfaces
{
    public interface IFoodItemCustomCategoryRepository
    {
        Task AddAsync(FoodItemCustomCategory category);

        Task<List<FoodItemCustomCategory>> GetAllAsync(long shopId);
        Task UpdateAsync(FoodItemCustomCategory category);

        Task DeleteAsync(long customCatId);

        Task<FoodItemCustomCategory> GetByIdAsync(long id);



    }
}
