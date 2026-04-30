using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuLanguageController : ControllerBase
    {
        private readonly IMenuLanguageService _service;

        public MenuLanguageController(IMenuLanguageService service)
        {
            _service = service;
        }

        [HttpGet("get/{shop_id}")]
        public async Task<IActionResult> GetMenuLanguage(long shop_id)
        {
            var result = await _service.GetMenuLanguage(shop_id);
            return Ok(result);
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateMenuLanguage(MenuLanguageDTO dto)
        {
            var result = await _service.UpdateMenuLanguage(dto);
            return Ok(result);
        }
    }
}