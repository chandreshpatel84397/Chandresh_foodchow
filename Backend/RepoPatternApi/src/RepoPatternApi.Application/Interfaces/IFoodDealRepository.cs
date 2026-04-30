using System.Collections.Generic;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Interfaces
{
    public interface IFoodDealRepository
    {
        string CreateDeal(CreateFoodDealRequest model);
        string UpdateDeal(long dealId, CreateFoodDealRequest model);
        string DeleteDeal(long dealId);
        List<CreateFoodDealRequest> GetAllDeals();
        CreateFoodDealRequest GetDealById(long dealId);
        string UpdateDealImage(long dealId, string dealImage);
        string UpdateDealStatus(long dealId, long status);
        List<object> GetDealTaxes(long dealId);
        List<object> GetDealGroups(long dealId);
    }
}