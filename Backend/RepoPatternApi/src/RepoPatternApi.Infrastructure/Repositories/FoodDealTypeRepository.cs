using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using RepoPatternApi.Application.Services;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Infrastructure.Repositories
{
    public class FoodDealTypeRepository : IFoodDealTypeRepository
    {
        private readonly string _connectionString;

        public FoodDealTypeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public List<DealTypeResponse> GetAllDealTypes()
        {
            List<DealTypeResponse> list = new List<DealTypeResponse>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // Fetch only active deal types
                SqlCommand cmd = new SqlCommand(
                    "SELECT deal_type_id, deal_type_name FROM food_deal_type WHERE status = 1",
                    conn);

                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    list.Add(new DealTypeResponse
                    {
                        DealTypeId = reader.GetInt64(0),
                        DealTypeName = reader.GetString(1)
                    });
                }
            }

            return list;
        }
    }
}