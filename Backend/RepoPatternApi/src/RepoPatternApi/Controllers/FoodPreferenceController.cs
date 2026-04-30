using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Application.Services;
using RepoPatternApi.Domain.DTO;


namespace RepoPatternApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodPreferenceController : ControllerBase
    {
        private readonly FoodPreferenceService _service;

        public FoodPreferenceController(FoodPreferenceService service)
        {
            _service = service;
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] FoodPreferenceCreateDto dto)
        {
            var choiceid = await _service.AddFoodPreference(dto);
            return Ok(new { choiceid = choiceid, message = "Inserted successfully" });
        }

        [HttpGet("get")]
        public async Task<IActionResult> Get()
        {
            var data = await _service.GetFoodPreferences();
            return Ok(data);
        }

        [HttpDelete("delete/{preferenceId}")]
        public async Task<IActionResult> Delete(string preferenceId)
        {
            if (!long.TryParse(preferenceId, out var id))
                return BadRequest(new { message = "Invalid preference id" });

            var result = await _service.DeleteFoodPreference(id);

            if (!result)
                return NotFound(new { message = "Preference not found" });

            return Ok(new { message = "Deleted successfully" });
        }

        [HttpPut("update/{preferenceId}")]
        public async Task<IActionResult> Update(
    string preferenceId,
    [FromBody] FoodPreferenceCreateDto dto)
        {
            if (!long.TryParse(preferenceId, out var id))
                return BadRequest(new { message = "Invalid preference id" });

            var result = await _service.UpdateFoodPreference(id, dto);

            if (!result)
                return NotFound(new { message = "Preference not found" });

            return Ok(new { message = "Updated successfully" });
        }
    }
}