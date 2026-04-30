using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Application.Services;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodItemIngredientController : ControllerBase
    {

        private readonly FoodItemIngredientService _service;


        public FoodItemIngredientController(FoodItemIngredientService service)
        {
            _service = service;
        }



        // DISPLAY BY shop_id

        [HttpGet("{shop_id}")]

        public async Task<IActionResult> Get(long shop_id)
        {

            var data = await _service.Get(shop_id);

            return Ok(data);

        }



        // INSERT

        [HttpPost]

        public async Task<IActionResult> Insert(FoodItemIngredientDTO dto)
        {

            var result = await _service.Insert(dto);

            return Ok(result);

        }



        // UPDATE

        [HttpPut]

        public async Task<IActionResult> Update(FoodItemIngredientDTO dto)
        {

            var result = await _service.Update(dto);

            return Ok(result);

        }



        // DELETE

        [HttpDelete("{ingredient_id}/{shop_id}")]

        public async Task<IActionResult> Delete(long ingredient_id, long shop_id)
        {

            var result = await _service.Delete(ingredient_id, shop_id);

            return Ok(result);

        }

    }
}