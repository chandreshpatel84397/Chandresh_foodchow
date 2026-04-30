using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Application.Services
{
    public class IngredientService : IIngredientService
    {
        private readonly IIngredientRepository _repo;

        public IngredientService(IIngredientRepository repo)
        {
            _repo = repo;
        }

        public Task<List<IngredientDTO>> GetAll(long shop_id)
        {
            return _repo.GetAll(shop_id);
        }

        public Task<IngredientDTO> GetById(long id)
        {
            return _repo.GetById(id);
        }

        public Task Insert(IngredientDTO dto)
        {
            return _repo.Insert(dto);
        }

        public Task Update(IngredientDTO dto)
        {
            return _repo.Update(dto);
        }

        public Task Delete(long ingredient_id, long shop_id)
        {
            return _repo.Delete(ingredient_id, shop_id);
        }
    }
}