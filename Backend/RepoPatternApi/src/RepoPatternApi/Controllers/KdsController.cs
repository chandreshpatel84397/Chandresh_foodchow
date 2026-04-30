
using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Application.Interfaces;

namespace RepoPatternApi.API.Controllers
{
    [Route("api/kds")]
    [ApiController]
    public class KdsController : ControllerBase
    {
        private readonly IKdsService _service;

        public KdsController(IKdsService service)
        {
            _service = service;
        }

        [HttpGet("categories/{shopId}")]
        public async Task<IActionResult> GetCategories(long shopId)
            => Ok(await _service.GetCategoriesAsync(shopId));

        [HttpGet("terminals/{shopId}")]
        public async Task<IActionResult> GetTerminals(long shopId)
            => Ok(await _service.GetTerminalsAsync(shopId));

        [HttpGet("{shopId}/{terminalId}")]
        public async Task<IActionResult> GetTerminal(long shopId, long terminalId)
            => Ok(await _service.GetTerminalByIdAsync(shopId, terminalId));

        [HttpPost("create")]
        public async Task<IActionResult> Create(long shopId, string terminalName, string foodCategoryId)
            => Ok(await _service.CreateTerminalAsync(shopId, terminalName, foodCategoryId));

        [HttpPut("update")]
        public async Task<IActionResult> Update(long shopId, long terminalId, string terminalName, string foodCategoryId)
            => Ok(await _service.UpdateTerminalAsync(shopId, terminalId, terminalName, foodCategoryId));

        [HttpDelete("delete/{shopId}/{terminalId}")]
        public async Task<IActionResult> Delete(long shopId, long terminalId)
            => Ok(await _service.DeleteTerminalAsync(shopId, terminalId));

        //test
        [HttpGet("terminalstest/{shopId}")]
        public async Task<IActionResult> GetAllTerminalsForShopNewAsync(long shopId)
            => Ok(await _service.GetAllTerminalsForShopNewAsync(shopId));
    }
}
