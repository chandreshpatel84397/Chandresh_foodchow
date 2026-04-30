using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Services
{
    public class FoodDealTypeService
    {
        private readonly IFoodDealTypeRepository _repository;

        public FoodDealTypeService(IFoodDealTypeRepository repository)
        {
            _repository = repository;
        }

        public List<DealTypeResponse> GetAllDealTypes()
        {
            return _repository.GetAllDealTypes();
        }
    }
}