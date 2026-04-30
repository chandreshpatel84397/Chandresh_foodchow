using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryMapperController : ControllerBase
    {
        private readonly ICategoryMapperRepository _repo;

        public CategoryMapperController(ICategoryMapperRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var data = await _repo.GetCategories(); // no shopId
            return Ok(data);
        }

        [HttpGet("sections")]
        public async Task<IActionResult> GetSections()
        {
            var data = await _repo.GetSections();
            return Ok(data);
        }

        [HttpPost("addsection")]
        public async Task<IActionResult> AddSection([FromBody] SectionDto dto)
        {
            await _repo.AddSection(dto);
            return Ok("Section added successfully");
        }

        [HttpDelete("deletesection/{id}")]
        public async Task<IActionResult> DeleteSection(int id)
        {
            await _repo.DeleteSection(id);
            return Ok("Section deleted successfully");
        }

        [HttpPost("mapcategory")]
        public async Task<IActionResult> MapCategory([FromBody] CategoryMapperDto dto)
        {
            await _repo.MapCategory(dto);
            return Ok("Category mapped successfully");
        }

        [HttpGet("sectioncategories/{sectionId}")]
        public async Task<IActionResult> GetSectionCategories(int sectionId)
        {
            var data = await _repo.GetSectionCategories(sectionId);
            return Ok(data);
        }
        [HttpDelete("deletecategory/{sectionId}/{categoryId}")]
        public async Task<IActionResult> DeleteCategory(int sectionId, int categoryId)
        {
            await _repo.DeleteCategory(sectionId, categoryId);
            return Ok();
        }
        [HttpPut("updatesection")]
        public async Task<IActionResult> UpdateSection([FromBody] SectionDto dto)
        {
            await _repo.UpdateSection(dto);
            return Ok();
        }
    }
}