using System;
using System.Collections.Generic;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Services
{
    public class FoodMenuService
    {
        private readonly IFoodMenuRepository _repository;

        public FoodMenuService(IFoodMenuRepository repository)
        {
            _repository = repository;
        }

        // ================= MENU =================

        public long InsertMenu(ShopMenuDto model) // ✅ FIX
            => _repository.InsertMenu(model);

        public string UpdateMenu(long id, ShopMenuDto model)
            => _repository.UpdateMenu(id, model);

        public List<ShopMenuDto> GetAllMenus()
            => _repository.GetAllMenus();

        public ShopMenuDto GetMenuById(long id)
            => _repository.GetMenuById(id);

        public string DeleteMenu(long id)
            => _repository.DeleteMenu(id);

        // ================= TIMINGS =================

        public string InsertMenuTimings(List<MenuTimingDto> model)
            => _repository.InsertMenuTimings(model);

        public string UpdateMenuTimings(long id, List<MenuTimingDto> model)
            => _repository.UpdateMenuTimings(id, model);

        public List<MenuTimingDto> GetMenuTimings(long id)
            => _repository.GetMenuTimings(id);

        public string DeleteMenuTimings(long id)
            => _repository.DeleteMenuTimings(id);

        // ================= ITEMS =================

        public string InsertMenuItems(List<MenuItemDto> model)
            => _repository.InsertMenuItems(model);

        public string UpdateMenuItems(long id, List<MenuItemDto> model) // ✅ FIX
            => _repository.UpdateMenuItems(id, model);

        public List<MenuItemDto> GetMenuItems(long id) // ✅ FIX
            => _repository.GetMenuItems(id);

        public string DeleteMenuItems(long id) // ✅ FIX
            => _repository.DeleteMenuItems(id);
    }
}