using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.Entities;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodItemCustomCategoryController : ControllerBase
    {
        private readonly IFoodItemCustomCategoryRepository _repository;

        public FoodItemCustomCategoryController(IFoodItemCustomCategoryRepository repository)
        {
            _repository = repository;
        }

        // INSERT
        [HttpPost("insert")]
        public async Task<IActionResult> Insert(FoodItemCustomCategoryDto dto)
        {
            var entity = new FoodItemCustomCategory
            {
                custom_cat_id = 0,              
                shop_id = dto.shop_id,
                custom_cat_name = dto.custom_cat_name,
                status = dto.status
            };

            await _repository.AddAsync(entity);

            return Ok("Inserted successfully");
        }

        // GET ALL BY SHOP
        [HttpGet("getall/{shopId}")]
        public async Task<IActionResult> GetAll(long shopId)
        {
            var data = await _repository.GetAllAsync(shopId);
            return Ok(data);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update(FoodItemCustomCategoryDto dto, long category_id)
        {
            var entity = new FoodItemCustomCategory
            {
                custom_cat_id = category_id,
                custom_cat_name = dto.custom_cat_name,
                status = dto.status
            };

            await _repository.UpdateAsync(entity);
            return Ok("Updated successfully");
        }

        [HttpGet("getbyid/{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var data = await _repository.GetByIdAsync(id);
            return Ok(data);
        }




        [HttpDelete("delete/{cust_cat_id}")]
        public async Task<IActionResult> Delete(long cust_cat_id)
        {
            await _repository.DeleteAsync(cust_cat_id);
            return Ok("Deleted successfully");
        }


    }
}
