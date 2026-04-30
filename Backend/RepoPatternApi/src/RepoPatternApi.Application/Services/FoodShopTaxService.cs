using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Application.Services
{
    public class FoodShopTaxService : IFoodShopTaxService
    {
        private readonly IFoodShopTaxRepository _repo;

        public FoodShopTaxService(IFoodShopTaxRepository repo)
        {
            _repo = repo;
        }

        public async Task<long> AddTaxAsync(FoodShopTaxDTO dto)
            => await _repo.AddTaxAsync(dto);

        public async Task<List<FoodShopTaxDTO>> GetAllTaxAsync()
            => await _repo.GetAllTaxAsync();

        public async Task UpdateTaxAsync(long id, FoodShopTaxDTO dto)
            => await _repo.UpdateTaxAsync(id, dto);

        public async Task DeleteTaxAsync(long id)
            => await _repo.DeleteTaxAsync(id);
    }
}