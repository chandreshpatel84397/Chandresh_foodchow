using RepoPatternApi.Domain.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Application.Interfaces
{
    public interface IMenuLanguageService
    {
        Task<MenuLanguageDTO> GetMenuLanguage(long shop_id);

        Task<string> UpdateMenuLanguage(MenuLanguageDTO dto);
    }
}