using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Services
{
    public interface IFoodDealTypeRepository
    {
        List<DealTypeResponse> GetAllDealTypes();
    }
}
