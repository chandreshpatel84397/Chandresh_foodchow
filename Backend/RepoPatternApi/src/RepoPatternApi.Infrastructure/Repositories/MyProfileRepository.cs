using Microsoft.Extensions.Configuration;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;
using System.Data;
using Microsoft.Data.SqlClient;

namespace RepoPatternApi.Infrastructure.Repositories
{
    public class MyProfileRepository : IMyProfileRepository
    {
        private readonly IConfiguration _configuration;

        public MyProfileRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> CreateMyProfileAsync(MyProfileCreateDto dto)
        {
            var cs = _configuration.GetConnectionString("DefaultConnection");

            using (var con = new SqlConnection(cs))
            {
                await con.OpenAsync();

                using (var tran = con.BeginTransaction())
                {
                    try
                    {
                        // UPSERT into food_shop
                        string q1 = @"
                        IF EXISTS (SELECT 1 FROM dbo.food_shop WHERE shop_id = @shop_id)
                        BEGIN
                            UPDATE dbo.food_shop SET 
                                first_name = @first_name,
                                last_name = @last_name,
                                email_id = @email_id,
                                mobileno = @mobileno,
                                phoneno = @phoneno,
                                shop_name = @shop_name,
                                websitename = @websitename,
                                promo_code = @promo_code,
                                timezone = @timezone,
                                shop_type = @shop_type,
                                cuisine_type = @cuisine_type,
                                amenities = @amenities,
                                updated_date = SYSDATETIME()
                            WHERE shop_id = @shop_id
                        END
                        ELSE
                        BEGIN
                            INSERT INTO dbo.food_shop (shop_id, first_name, last_name, email_id, mobileno, phoneno, 
                                    shop_name, websitename, promo_code, timezone, shop_type, cuisine_type, 
                                    amenities, created_date, updated_date)
                            VALUES (@shop_id, @first_name, @last_name, @email_id, @mobileno, @phoneno, 
                                    @shop_name, @websitename, @promo_code, @timezone, @shop_type, @cuisine_type, 
                                    @amenities, SYSDATETIME(), SYSDATETIME());
                        END";

                        using (var cmd1 = new SqlCommand(q1, con, (SqlTransaction)tran))
                        {
                            cmd1.Parameters.AddWithValue("@shop_id", dto.shop_id);
                            cmd1.Parameters.AddWithValue("@first_name", (object?)dto.first_name ?? DBNull.Value);
                            cmd1.Parameters.AddWithValue("@last_name", (object?)dto.last_name ?? DBNull.Value);
                            cmd1.Parameters.AddWithValue("@email_id", (object?)dto.email_id ?? DBNull.Value);
                            cmd1.Parameters.AddWithValue("@mobileno", (object?)dto.mobileno ?? DBNull.Value);
                            cmd1.Parameters.AddWithValue("@phoneno", (object?)dto.phoneno ?? DBNull.Value);
                            cmd1.Parameters.AddWithValue("@shop_name", (object?)dto.restaurant_name ?? DBNull.Value);
                            cmd1.Parameters.AddWithValue("@websitename", (object?)dto.website_url ?? DBNull.Value);
                            cmd1.Parameters.AddWithValue("@promo_code", (object?)dto.promocode ?? DBNull.Value);
                            cmd1.Parameters.AddWithValue("@timezone", (object?)dto.timezone ?? DBNull.Value);

                            // Move shop_type and cuisine_type to food_shop
                            cmd1.Parameters.AddWithValue("@shop_type", dto.restaurant_types != null ? string.Join(",", dto.restaurant_types) : DBNull.Value);
                            cmd1.Parameters.AddWithValue("@cuisine_type", dto.cuisines != null ? string.Join(",", dto.cuisines) : DBNull.Value);

                            // Consolidate address info into amenities
                            string fullAddress = $"Address: {dto.apartment_no} {dto.address_line_1} {dto.address_line_2} {dto.area} {dto.city} {dto.state} {dto.country} {dto.pincode}".Replace("  ", " ").Trim();
                            cmd1.Parameters.AddWithValue("@amenities", fullAddress);

                            await cmd1.ExecuteNonQueryAsync();
                        }

                        // UPSERT into food_shop_settings
                        string q2 = @"
                        IF EXISTS (SELECT 1 FROM dbo.food_shop_settings WHERE shop_id = @shop_id)
                        BEGIN
                            UPDATE dbo.food_shop_settings SET 
                                payment_method = @payment_method,
                                delivery_fees = @delivery_fees,
                                min_order = @min_order,
                                delivery_time = @delivery_time,
                                updated_date = SYSDATETIME()
                            WHERE shop_id = @shop_id
                        END
                        ELSE
                        BEGIN
                            INSERT INTO dbo.food_shop_settings (shop_id, payment_method, delivery_fees, min_order, delivery_time, 
                                    created_date, updated_date)
                            VALUES (@shop_id, @payment_method, @delivery_fees, @min_order, @delivery_time, 
                                    SYSDATETIME(), SYSDATETIME());
                        END";

                        using (var cmd2 = new SqlCommand(q2, con, (SqlTransaction)tran))
                        {
                            cmd2.Parameters.AddWithValue("@shop_id", dto.shop_id);
                            cmd2.Parameters.AddWithValue("@payment_method", (object?)dto.payment_method ?? DBNull.Value);
                            cmd2.Parameters.AddWithValue("@delivery_fees", (object?)dto.delivery_fees ?? DBNull.Value);
                            cmd2.Parameters.AddWithValue("@min_order", (object?)dto.min_order ?? DBNull.Value);
                            cmd2.Parameters.AddWithValue("@delivery_time", (object?)dto.delivery_time ?? DBNull.Value);

                            await cmd2.ExecuteNonQueryAsync();
                        }

                        tran.Commit();
                        return true;
                    }
                    catch (SqlException sqlEx)
                    {
                        tran.Rollback();
                        Console.WriteLine($"SQL Error in CreateMyProfileAsync: {sqlEx.Message} (Number: {sqlEx.Number})");
                        return false;
                    }
                    catch (Exception ex)
                    {
                        tran.Rollback();
                        Console.WriteLine($"General Error in CreateMyProfileAsync: {ex.Message}");
                        return false;
                    }
                }
            }
        }
    }
}