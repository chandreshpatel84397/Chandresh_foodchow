using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Infrastructure.Repositories
{
    public class FoodPreferenceRepository : IFoodPreferenceRepository
    {
        private readonly IConfiguration _config;

        public FoodPreferenceRepository(IConfiguration config)
        {
            _config = config;
        }

        public async Task<long> AddFoodPreference(FoodPreferenceCreateDto dto)
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();


            long preferenceId = long.Parse(
                DateTime.UtcNow.ToString("yyMMddHHmmss")
            );

            // 2️⃣ Insert into food_preferences
            var sqlPreference = @"
                INSERT INTO food_preferences
                (preference_id, preference_name, is_active, created_date, sold_out_flag)
                VALUES
                (@preference_id, @preference_name, @is_active, GETDATE(), 0);
            ";

            await con.ExecuteAsync(sqlPreference, new
            {
                preference_id = preferenceId,
                preference_name = dto.preference_name,
                is_active = dto.is_active
            });

            // 3️⃣ Insert options
            if (dto.option_name != null && dto.option_name.Any())
            {
                var sqlOption = @"
                    INSERT INTO food_preference_options
                    (preference_option_id, preference_id, option_name, status, created_date, sold_out_flag)
                    VALUES
                    (@preference_option_id, @preference_id, @option_name, @status, GETDATE(), 0);
                ";

                foreach (var opt in dto.option_name)
                {
                    long optionId = long.Parse(
                        DateTime.UtcNow.ToString("yyyyMMddHHmmssfff")
                    );

                    await con.ExecuteAsync(sqlOption, new
                    {
                        preference_option_id = optionId,
                        preference_id = preferenceId,
                        option_name = opt,
                        status = dto.is_active
                    });
                }
            }

            return preferenceId;
        }
        public async Task<List<FoodPreferenceCreateDto>> GetFoodPreferences()
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();

            var sql = @"
        SELECT 
            fp.preference_id,
            fp.preference_name,
            fp.is_active,
            fpo.option_name
        FROM food_preferences fp
        LEFT JOIN food_preference_options fpo
            ON fp.preference_id = fpo.preference_id
        ORDER BY fp.created_date DESC;
    ";

            var lookup = new Dictionary<long, FoodPreferenceCreateDto>();

            var result = await con.QueryAsync<long, string, long, string, FoodPreferenceCreateDto>(
                sql,
                (preferenceId, preferenceName, isActive, optionName) =>
                {
                    if (!lookup.TryGetValue(preferenceId, out var dto))
                    {
                        dto = new FoodPreferenceCreateDto
                        {
                            preference_id = preferenceId,
                            preference_name = preferenceName,
                            is_active = isActive,
                            option_name = new List<string>()
                        };

                        lookup.Add(preferenceId, dto);
                    }

                    if (!string.IsNullOrEmpty(optionName))
                    {
                        dto.option_name.Add(optionName);
                    }

                    return dto;
                },
                splitOn: "preference_name,is_active,option_name"
            );

            return lookup.Values.ToList();
        }


        public async Task<bool> DeleteFoodPreference(long preferenceId)
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();

            using var tran = con.BeginTransaction();

            try
            {
                // 1️) Delete options first (FK safety)
                var deleteOptionsSql = @"
            DELETE FROM food_preference_options
            WHERE preference_id = @preferenceId;
        ";

                await con.ExecuteAsync(
                    deleteOptionsSql,
                    new { preferenceId },
                    tran
                );

                // 2️) Delete preference
                var deletePreferenceSql = @"
            DELETE FROM food_preferences
            WHERE preference_id = @preferenceId;
        ";

                var rowsAffected = await con.ExecuteAsync(
                    deletePreferenceSql,
                    new { preferenceId },
                    tran
                );

                tran.Commit();

                return rowsAffected > 0;
            }
            catch
            {
                tran.Rollback();
                throw;
            }
        }

        public async Task<bool> UpdateFoodPreference(long preferenceId, FoodPreferenceCreateDto dto)
        {
            using var con = new SqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );

            await con.OpenAsync();
            using var tran = con.BeginTransaction();

            try
            {
                // 1️⃣ Update main preference
                var updatePreferenceSql = @"
            UPDATE food_preferences
            SET preference_name = @preference_name,
                is_active = @is_active
            WHERE preference_id = @preference_id;
        ";

                var rows = await con.ExecuteAsync(
                    updatePreferenceSql,
                    new
                    {
                        preference_id = preferenceId,
                        preference_name = dto.preference_name,
                        is_active = dto.is_active
                    },
                    tran
                );

                if (rows == 0)
                {
                    tran.Rollback();
                    return false;
                }

                // 2️⃣ Delete old options
                var deleteOptionsSql = @"
            DELETE FROM food_preference_options
            WHERE preference_id = @preferenceId;
        ";

                await con.ExecuteAsync(
                    deleteOptionsSql,
                    new { preferenceId },
                    tran
                );

                // 3️⃣ Insert new options
                if (dto.option_name != null && dto.option_name.Any())
                {
                    var insertOptionSql = @"
                INSERT INTO food_preference_options
                (preference_option_id, preference_id, option_name, status, created_date, sold_out_flag)
                VALUES
                (@preference_option_id, @preference_id, @option_name, @status, GETDATE(), 0);
            ";

                    foreach (var opt in dto.option_name)
                    {
                        long optionId = long.Parse(
                            DateTime.UtcNow.ToString("yyyyMMddHHmmssfff")
                        );

                        await con.ExecuteAsync(
                            insertOptionSql,
                            new
                            {
                                preference_option_id = optionId,
                                preference_id = preferenceId,
                                option_name = opt,
                                status = dto.is_active
                            },
                            tran
                        );
                    }
                }

                tran.Commit();
                return true;
            }
            catch
            {
                tran.Rollback();
                throw;
            }
        }
    }
}