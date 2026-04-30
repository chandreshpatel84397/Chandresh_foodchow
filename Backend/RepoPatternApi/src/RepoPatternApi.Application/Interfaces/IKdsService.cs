using RepoPatternApi.Domain.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Application.Interfaces
{
        public interface IKdsService
        {
            Task<ApiBaseResponse> GetCategoriesAsync(long shopId);
            Task<ApiBaseResponse> GetTerminalsAsync(long shopId);
            Task<ApiBaseResponse> GetTerminalByIdAsync(long shopId, long terminalId);
            Task<ApiBaseResponse> CreateTerminalAsync(long shopId, string terminalName, string foodCategoryId);
            Task<ApiBaseResponse> UpdateTerminalAsync(long shopId, long terminalId, string terminalName, string foodCategoryId);
            Task<ApiBaseResponse> DeleteTerminalAsync(long shopId, long terminalId);

            Task<ApiBaseResponse> GetAllTerminalsForShopNewAsync(long shopId);
        }
    }

