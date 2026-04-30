using RepoPatternApi.Domain.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Application.Interfaces
{
    public interface IFoodShopTaxRepository
    {
        Task<long> AddTaxAsync(FoodShopTaxDTO dto);
        Task<List<FoodShopTaxDTO>> GetAllTaxAsync();
        Task UpdateTaxAsync(long id, FoodShopTaxDTO dto);
        Task DeleteTaxAsync(long id);
    }
}