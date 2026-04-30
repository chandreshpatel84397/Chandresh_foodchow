using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;
using RepoPatternApi.Infrastructure.Data;
using Microsoft.Data.SqlClient;
using System.Data;


namespace RepoPatternApi.Infrastructure.Repositories
{
    public class KdsRepository : IKdsRepository
    {
        public KdsRepository()
        {
        }

        public async Task<List<FoodCategoryDto>> GetCategoryListForShopAsync(long shopId)
        {
            var parameters = new[]
            {
                new SqlParameter("@shop_id", shopId)
            };

            return await DbStoredProcedureExecutor.ExecuteAsync(
                "KDS_GetCategoryListForShop",
                reader => new FoodCategoryDto
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    CateName = reader["cate_name"].ToString(),
                    CatePosition = reader.GetInt32(reader.GetOrdinal("cate_position")),
                    Status = reader.GetBoolean(reader.GetOrdinal("status"))
                },
                parameters
            );
        }
        //Without model
        public async Task<List<Dictionary<string, object>>> GetAllTerminalsForShopNewAsync(long shopId)
        {
            var parameters = new[]
            {
                new SqlParameter("@shop_id", shopId)
            };

            return await DbStoredProcedureExecutor.ExecuteDictionaryAsync("USP_Get_kds_terminals_setting", parameters);
        }

        //UsingModel 
        public async Task<List<KdsTerminalDto>> GetAllTerminalsForShopAsync(long shopId)
        {
            var parameters = new[]
            {
                new SqlParameter("@shop_id", shopId)
            };

            return await DbStoredProcedureExecutor.ExecuteAutoMapAsync<KdsTerminalDto>("USP_Get_kds_terminals_setting",parameters);
        }

        
        // OPTIMIZED USAGE in your repository:
     
            public async Task<KdsTerminalDto?> GetTerminalByIdAsync(long shopId, long terminalId)
            {
                var parameters = new[]
                {
            new SqlParameter("@shop_id", shopId),
            new SqlParameter("@terminal_id", terminalId)
        };

                // Simply call ExecuteAutoMapAsync - no manual mapping needed!
                return (await DbStoredProcedureExecutor.ExecuteAutoMapAsync<KdsTerminalDto>(
                    "USP_GetById_kds_terminals_setting",
                    parameters
                )).FirstOrDefault();
            }
        

        public async Task<bool> CreateTerminalAsync(long shopId, string terminalName, string foodCategoryId)
        {
            var parameters = new List<SqlParameter>
             {
                  new SqlParameter("@shop_id", SqlDbType.BigInt) { Value = shopId },
                  new SqlParameter("@terminal_name", SqlDbType.NVarChar, 100) { Value = terminalName },
                  new SqlParameter("@food_category_id", SqlDbType.VarChar, 100) { Value = foodCategoryId }
        };

            await DbStoredProcedureExecutor.ExecuteNonQueryAsync(
                "USP_Insert_kds_terminals_setting",
                parameters
            );

            return true;
        }


        public async Task<bool> UpdateTerminalAsync(long shopId, long terminalId, string terminalName, string foodCategoryId)
        {
            var parameters = new List<SqlParameter>
         {
              new SqlParameter("@shop_id", SqlDbType.BigInt) { Value = shopId },
              new SqlParameter("@terminal_id", SqlDbType.BigInt) { Value = terminalId },
              new SqlParameter("@terminal_name", SqlDbType.NVarChar, 100) { Value = terminalName },
              new SqlParameter("@food_category_id", SqlDbType.VarChar, 100) { Value = foodCategoryId }
         };

            await DbStoredProcedureExecutor.ExecuteNonQueryAsync(
                "USP_Update_kds_terminals_setting",
                parameters
            );

            return true;
        }


        public async Task<bool> DeleteTerminalAsync(long shopId, long terminalId)
        {
            var parameters = new List<SqlParameter>
         {
                new SqlParameter("@shop_id", SqlDbType.BigInt) { Value = shopId },
                new SqlParameter("@terminal_id", SqlDbType.BigInt) { Value = terminalId }
         };

            await DbStoredProcedureExecutor.ExecuteNonQueryAsync("USP_Delete_kds_terminals_setting", parameters);

            return true;
        }

    }
}
