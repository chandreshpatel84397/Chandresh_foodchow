using RepoPatternApi.Domain.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Application.Interfaces
{
    public interface IKdsRepository
    {
        Task<List<FoodCategoryDto>> GetCategoryListForShopAsync(long shopId);
        Task<List<KdsTerminalDto>> GetAllTerminalsForShopAsync(long shopId);
        Task<KdsTerminalDto?> GetTerminalByIdAsync(long shopId, long terminalId);
        Task<bool> CreateTerminalAsync(long shopId, string terminalName, string foodCategoryId);
        Task<bool> UpdateTerminalAsync(long shopId, long terminalId, string terminalName, string foodCategoryId);
        Task<bool> DeleteTerminalAsync(long shopId, long terminalId);

        Task<List<Dictionary<string, object>>> GetAllTerminalsForShopNewAsync(long shopId);
    }
}

