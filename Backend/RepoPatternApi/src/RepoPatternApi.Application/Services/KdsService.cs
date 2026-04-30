

using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Services
{
    public class KdsService : IKdsService
    {
        private readonly IKdsRepository _repo;

        public KdsService(IKdsRepository repo)
        {
            _repo = repo;
        }

        public async Task<ApiBaseResponse> GetCategoriesAsync(long shopId)
        {
            try
            {
                var data = await _repo.GetCategoryListForShopAsync(shopId);
                return new ApiBaseResponse { Success = true, ResponseCode = 1, Message = "Categories fetched successfully", Data = data };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse { Success = false, ResponseCode = 0, Message = ex.Message };
            }
        }

        public async Task<ApiBaseResponse> GetTerminalsAsync(long shopId)
        {
            try
            {
                var data = await _repo.GetAllTerminalsForShopAsync(shopId);
                return new ApiBaseResponse { Success = true, ResponseCode = 1, Message = "Terminals fetched successfully", Data = data };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse { Success = false, ResponseCode = 0, Message = ex.Message };
            }
        }

        public async Task<ApiBaseResponse> GetTerminalByIdAsync(long shopId, long terminalId)
        {
            try
            {
                var data = await _repo.GetTerminalByIdAsync(shopId, terminalId);
                return new ApiBaseResponse { Success = true, ResponseCode = 1, Message = "Terminal fetched successfully", Data = data };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse { Success = false, ResponseCode = 0, Message = ex.Message };
            }
        }

        public async Task<ApiBaseResponse> CreateTerminalAsync(long shopId, string terminalName, string foodCategoryId)
        {
            try
            {
                var result = await _repo.CreateTerminalAsync(shopId, terminalName, foodCategoryId);
                return new ApiBaseResponse { Success = result, ResponseCode = result ? 1 : 0, Message = result ? "Terminal created successfully" : "Failed to create terminal" };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse { Success = false, ResponseCode = 0, Message = ex.Message };
            }
        }

        public async Task<ApiBaseResponse> UpdateTerminalAsync(long shopId, long terminalId, string terminalName, string foodCategoryId)
        {
            try
            {
                var result = await _repo.UpdateTerminalAsync(shopId, terminalId, terminalName, foodCategoryId);
                return new ApiBaseResponse { Success = result, ResponseCode = result ? 1 : 0, Message = result ? "Terminal updated successfully" : "Failed to update terminal" };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse { Success = false, ResponseCode = 0, Message = ex.Message };
            }
        }

        public async Task<ApiBaseResponse> DeleteTerminalAsync(long shopId, long terminalId)
        {
            try
            {
                var result = await _repo.DeleteTerminalAsync(shopId, terminalId);
                return new ApiBaseResponse { Success = result, ResponseCode = result ? 1 : 0, Message = result ? "Terminal deleted successfully" : "Failed to delete terminal" };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse { Success = false, ResponseCode = 0, Message = ex.Message };
            }
        }

        public async Task<ApiBaseResponse> GetAllTerminalsForShopNewAsync(long shopId)
        {
            try
            {
                var result = await _repo.GetAllTerminalsForShopNewAsync(shopId);
                var success = result?.Count > 0;
                return new ApiBaseResponse{Success = success,ResponseCode = success ? 1 : 0,Message = success ? "Terminals retrieved successfully" : "No terminals found",Data = result};
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse { Success = false, ResponseCode = 0, Message = ex.Message };
            }
        }
    }
}