using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodShopTaxController : ControllerBase
    {
        private readonly IFoodShopTaxService _service;

        public FoodShopTaxController(IFoodShopTaxService service)
        {
            _service = service;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddTax([FromBody] FoodShopTaxDTO dto)
        {
            try
            {
                var id = await _service.AddTaxAsync(dto);
                return Ok(new { message = "Tax Added Successfully", id });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        //[HttpPost("add")]
        //public async Task<IActionResult> AddTax([FromBody] FoodShopTaxDTO dto)
        //{
        //    try
        //    {
        //        var id = await _service.AddTaxAsync(dto);
        //        return Ok(new { message = "Tax Added Successfully", id });
        //    }
        //    catch (InvalidOperationException ex)
        //    {
        //        return Conflict(new { message = ex.Message });
        //    }
        //    catch (Exception ex)  // ← ADD THIS
        //    {
        //        return StatusCode(500, new { message = "An error occurred.", detail = ex.Message });
        //    }
        //}



        [HttpGet("getall")]
        public async Task<IActionResult> GetAllTax()
        {
            var list = await _service.GetAllTaxAsync();
            return Ok(list);
        }


        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateTax(long id, [FromBody] FoodShopTaxDTO dto)
        {
            try
            {
                await _service.UpdateTaxAsync(id, dto);
                return Ok(new { message = "Tax Updated Successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteTax(long id)
        {
            await _service.DeleteTaxAsync(id);
            return Ok(new { message = "Tax Deleted Successfully" });
        }
    }
}

