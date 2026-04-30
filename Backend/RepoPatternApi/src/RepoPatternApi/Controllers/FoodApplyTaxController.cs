using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodApplyTaxController : ControllerBase
    {
        private readonly IFoodApplyTaxService _service;

        public FoodApplyTaxController(IFoodApplyTaxService service)
        {
            _service = service;
        }

        // ================= APPLY =================
        [HttpPost("apply")]
        public async Task<IActionResult> ApplyTax([FromBody] ApplyTaxDTO dto)
        {
            var result = await _service.ApplyTaxAsync(dto);

            return Ok(new
            {
                success = true,
                message = result
            });
        }

        // ================= REMOVE =================
        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveTax([FromBody] ApplyTaxDTO dto)
        {
            var result = await _service.RemoveTaxAsync(dto);

            return Ok(new
            {
                success = true,
                message = result
            });
        }

        // ================= GET APPLIED TAX =================
        [HttpGet("applied/{tax_id}")]
        public async Task<IActionResult> GetAppliedTax(long tax_id)
        {
            var result = await _service.GetAppliedTaxAsync(tax_id);

            // 🔥 FIX: Convert tuple → proper JSON
            var response = result.Select(x => new
            {
                item_id = x.item_id,
                item_size_id = x.size_id   // ✅ IMPORTANT MATCH DB
            });

            return Ok(response);
        }
    }
}