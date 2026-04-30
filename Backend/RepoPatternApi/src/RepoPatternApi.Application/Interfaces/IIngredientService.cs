using RepoPatternApi.Domain.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Application.Interfaces
{
    public interface IIngredientService
    {
        Task<List<IngredientDTO>> GetAll(long shop_id);

        Task<IngredientDTO> GetById(long id);

        Task Insert(IngredientDTO dto);

        Task Update(IngredientDTO dto);

        Task Delete(long ingredient_id, long shop_id);
    }
}