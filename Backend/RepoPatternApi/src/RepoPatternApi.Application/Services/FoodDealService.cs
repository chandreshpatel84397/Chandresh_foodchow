using System.Collections.Generic;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Services
{
    public class FoodDealService
    {
        private readonly IFoodDealRepository _repository;

        public FoodDealService(IFoodDealRepository repository)
        {
            _repository = repository;
        }

        public string CreateDeal(CreateFoodDealRequest model)
            => _repository.CreateDeal(model);

        public string UpdateDeal(long dealId, CreateFoodDealRequest model)
            => _repository.UpdateDeal(dealId, model);

        public string DeleteDeal(long dealId)
            => _repository.DeleteDeal(dealId);

        public List<CreateFoodDealRequest> GetAllDeals()
            => _repository.GetAllDeals();

        public CreateFoodDealRequest GetDealById(long dealId)
            => _repository.GetDealById(dealId);

        public string UpdateDealImage(long dealId, string dealImage)
            => _repository.UpdateDealImage(dealId, dealImage);

        public string UpdateDealStatus(long dealId, long status)
            => _repository.UpdateDealStatus(dealId, status);

        public List<object> GetDealTaxes(long dealId)
       => _repository.GetDealTaxes(dealId);

        public List<object> GetDealGroups(long dealId)
            => _repository.GetDealGroups(dealId);
    }
}