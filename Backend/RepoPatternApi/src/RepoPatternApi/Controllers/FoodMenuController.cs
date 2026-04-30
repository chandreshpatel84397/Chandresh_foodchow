using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Application.Services;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodMenuController : ControllerBase
    {
        private readonly FoodMenuService _service;

        public FoodMenuController(FoodMenuService service)
        {
            _service = service;
        }

        [HttpPost("create-menu")]
        public IActionResult CreateMenu(ShopMenuDto model)
            => Ok(_service.InsertMenu(model));

        [HttpPut("update-menu/{id}")]
        public IActionResult UpdateMenu(long id, ShopMenuDto model)
        {
            return Ok(_service.UpdateMenu(id, model));
        }

        [HttpGet("get-all")]
        public IActionResult GetAll()
            => Ok(_service.GetAllMenus());

        [HttpGet("get-by-id/{id}")]
        public IActionResult GetById(long id)
            => Ok(_service.GetMenuById(id));



        [HttpDelete("delete/{id}")]
        public IActionResult Delete(long id)
            => Ok(_service.DeleteMenu(id));




        // Insert Menu Timings
        [HttpPost("insert-timings")]
        public IActionResult InsertTimings(List<MenuTimingDto> model)
        {
            return Ok(_service.InsertMenuTimings(model));
        }

        // Get Menu Timings By MenuId
        [HttpGet("get-timings/{menuId}")]
        public IActionResult GetTimings(long menuId)
        {
            return Ok(_service.GetMenuTimings(menuId));
        }

        // Update Menu Timings
        [HttpPut("update-timings/{menuId}")]
        public IActionResult UpdateTimings(long menuId, List<MenuTimingDto> model)
        {
            return Ok(_service.UpdateMenuTimings(menuId, model));
        }

        // Delete Menu Timings
        [HttpDelete("delete-timings/{menuId}")]
        public IActionResult DeleteTimings(long menuId)
        {
            return Ok(_service.DeleteMenuTimings(menuId));
        }

        // Insert Menu Items
        [HttpPost("insert-items")]
        public IActionResult InsertItems(List<MenuItemDto> model)
        {
            return Ok(_service.InsertMenuItems(model));
        }

        // Get Menu Items By MenuId
        [HttpGet("get-items/{menuId}")]
        public IActionResult GetItems(long menuId) // ✅ FIX
        {
            return Ok(_service.GetMenuItems(menuId));
        }

        // Update Menu Items
        [HttpPut("update-items/{menuId}")]
        public IActionResult UpdateItems(long menuId, List<MenuItemDto> model) // ✅ FIX
        {
            return Ok(_service.UpdateMenuItems(menuId, model));
        }

        // Delete Menu Items
        [HttpDelete("delete-items/{menuId}")]
        public IActionResult DeleteItems(long menuId) // ✅ FIX
        {
            return Ok(_service.DeleteMenuItems(menuId));
        }
    }
}