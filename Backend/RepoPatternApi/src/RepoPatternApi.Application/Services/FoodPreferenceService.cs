using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Threading.Tasks;


namespace RepoPatternApi.Application.Services
{
    public class FoodPreferenceService
    {
        private readonly IFoodPreferenceRepository _repo;

        public FoodPreferenceService(IFoodPreferenceRepository repo)
        {
            _repo = repo;
        }

        public Task<long> AddFoodPreference(FoodPreferenceCreateDto dto)
        {
            return _repo.AddFoodPreference(dto);
        }

        public Task<List<FoodPreferenceCreateDto>> GetFoodPreferences()
        {
            return _repo.GetFoodPreferences();
        }

        public Task<bool> DeleteFoodPreference(long preferenceId)
        {

            return _repo.DeleteFoodPreference(preferenceId);
        }

        public Task<bool> UpdateFoodPreference(long preferenceId, FoodPreferenceCreateDto dto)
        {
            return _repo.UpdateFoodPreference(preferenceId, dto);
        }
    }
}