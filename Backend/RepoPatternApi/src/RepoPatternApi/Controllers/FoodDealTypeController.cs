using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Application.Services;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodDealTypeController : ControllerBase
    {
        private readonly FoodDealTypeService _service;

        public FoodDealTypeController(FoodDealTypeService service)
        {
            _service = service;
        }

        // GET: api/FoodDealType/get-all
        [HttpGet("get-all")]
        public ActionResult<List<DealTypeResponse>> GetAllDealTypes()
        {
            var result = _service.GetAllDealTypes();
            return Ok(result);
        }
    }
}