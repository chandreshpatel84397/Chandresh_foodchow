using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Application.Services;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodDealController : ControllerBase
    {
        private readonly FoodDealService _dealService;

        public FoodDealController(FoodDealService dealService)
        {
            _dealService = dealService;
        }

        // POST: api/FoodDeal/create
        [HttpPost("create")]
        public IActionResult CreateDeal([FromBody] CreateFoodDealRequest model)
        {
            var result = _dealService.CreateDeal(model);
            return Ok(result);
        }

        // PUT: api/FoodDeal/update/{dealId}
        [HttpPut("update/{dealId}")]
        public IActionResult UpdateDeal(long dealId, [FromBody] CreateFoodDealRequest model)
        {
            var result = _dealService.UpdateDeal(dealId, model);
            return Ok(result);
        }

        // DELETE: api/FoodDeal/delete/{dealId}
        [HttpDelete("delete/{dealId}")]
        public IActionResult DeleteDeal(long dealId)
        {
            var result = _dealService.DeleteDeal(dealId);
            return Ok(result);
        }

        // GET: api/FoodDeal/getall
        [HttpGet("getall")]
        public IActionResult GetAllDeals()
        {
            var result = _dealService.GetAllDeals();
            return Ok(result);
        }

        // GET: api/FoodDeal/get-by-id/{dealId}
        [HttpGet("get-by-id/{dealId}")]
        public IActionResult GetDealById(long dealId)
        {
            var result = _dealService.GetDealById(dealId);
            return Ok(result);
        }

        // PUT: api/FoodDeal/update-image/{dealId}
        [HttpPut("update-image/{dealId}")]
        public IActionResult UpdateDealImage(long dealId, [FromBody] DealImageRequest request)
        {
            var result = _dealService.UpdateDealImage(dealId, request.DealImage);
            return Ok(result);
        }

        // PUT: api/FoodDeal/update-status/{dealId}
        [HttpPut("update-status/{dealId}")]
        public IActionResult UpdateDealStatus(long dealId, [FromBody] UpdateDealStatusRequest request)
        {
            var result = _dealService.UpdateDealStatus(dealId, request.Status);
            return Ok(result);
        }

        // GET: api/FoodDeal/get-tax/{dealId}
        [HttpGet("get-tax/{dealId}")]
        public IActionResult GetTax(long dealId)
        {
            var result = _dealService.GetDealTaxes(dealId);
            return Ok(result);
        }

        // GET: api/FoodDeal/get-groups/{dealId}
        [HttpGet("get-groups/{dealId}")]
        public IActionResult GetDealGroups(long dealId)
        {
            var result = _dealService.GetDealGroups(dealId);
            return Ok(result);
        }
    }
}