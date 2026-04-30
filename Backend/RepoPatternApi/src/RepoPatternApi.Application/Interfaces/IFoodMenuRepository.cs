using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Interfaces
{
    public interface IFoodMenuRepository
    {
        // MENU
        long InsertMenu(ShopMenuDto model); // ✅ FIX
        string UpdateMenu(long id, ShopMenuDto model);
        string DeleteMenu(long id);
        List<ShopMenuDto> GetAllMenus();
        ShopMenuDto GetMenuById(long id);

        // MENU TIMINGS
        string InsertMenuTimings(List<MenuTimingDto> timings);
        string UpdateMenuTimings(long menuId, List<MenuTimingDto> timings);
        List<MenuTimingDto> GetMenuTimings(long menuId);
        string DeleteMenuTimings(long menuId);

        // MENU ITEMS
        string InsertMenuItems(List<MenuItemDto> items);
        string UpdateMenuItems(long menuId, List<MenuItemDto> items);
        List<MenuItemDto> GetMenuItems(long menuId);

        string DeleteMenuItems(long menuId);
    }
}