using Dapper;
using Microsoft.Extensions.Configuration;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Infrastructure.Repositories
{
    public class MenuLanguageRepository : IMenuLanguageRepository
    {
        private readonly IConfiguration _configuration;

        public MenuLanguageRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<MenuLanguageDTO> GetMenuLanguage(long shop_id)
        {
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            string query = @"SELECT 
                            shop_id,
                            Primary_language,
                            Secondary_language,
                            Display_menu,
                            MenuDirection,
                            type_of_menu
                            FROM menu_language
                            WHERE shop_id = @shop_id";

            return await con.QueryFirstOrDefaultAsync<MenuLanguageDTO>(query, new { shop_id });
        }

        public async Task<string> UpdateMenuLanguage(MenuLanguageDTO dto)
        {
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            string query = @"IF EXISTS (SELECT 1 FROM menu_language WHERE shop_id=@shop_id)
                            BEGIN
                                UPDATE menu_language
                                SET
                                    Primary_language=@Primary_language,
                                    Secondary_language=@Secondary_language,
                                    Display_menu=@Display_menu,
                                    MenuDirection=@MenuDirection,
                                    type_of_menu=@type_of_menu
                                WHERE shop_id=@shop_id
                            END
                            ELSE
                            BEGIN
                                INSERT INTO menu_language
                                (
                                    shop_id,
                                    Primary_language,
                                    Secondary_language,
                                    Display_menu,
                                    MenuDirection,
                                    type_of_menu
                                )
                                VALUES
                                (
                                    @shop_id,
                                    @Primary_language,
                                    @Secondary_language,
                                    @Display_menu,
                                    @MenuDirection,
                                    @type_of_menu
                                )
                            END";

            await con.ExecuteAsync(query, dto);

            return "Menu Language Updated Successfully";
        }
    }
}