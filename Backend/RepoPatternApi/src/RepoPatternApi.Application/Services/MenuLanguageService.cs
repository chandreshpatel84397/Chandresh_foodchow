using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Application.Services
{
    public class MenuLanguageService : IMenuLanguageService
    {
        private readonly IMenuLanguageRepository _repository;

        public MenuLanguageService(IMenuLanguageRepository repository)
        {
            _repository = repository;
        }

        public async Task<MenuLanguageDTO> GetMenuLanguage(long shop_id)
        {
            return await _repository.GetMenuLanguage(shop_id);
        }

        public async Task<string> UpdateMenuLanguage(MenuLanguageDTO dto)
        {
            return await _repository.UpdateMenuLanguage(dto);
        }
    }
}
