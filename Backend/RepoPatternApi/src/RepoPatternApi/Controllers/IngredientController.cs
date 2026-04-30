using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;
using System.Data.SqlClient;

namespace RepoPatternApi.Controllers
{
    [ApiController]
    [Route("api/extras")]

    public class IngredientController : ControllerBase
    {
        private readonly IIngredientService _service;

        public IngredientController(IIngredientService service)
        {
            _service = service;
        }

        // GET ALL BY SHOP
        [HttpGet("list/{shop_id}")]

        public async Task<IActionResult> GetAll(long shop_id)
        {
            var data = await _service.GetAll(shop_id);

            return Ok(data);
        }


        // GET SINGLE BY ID
        [HttpGet("detail/{id}")]

        public async Task<IActionResult> GetById(long id)
        {
            var data = await _service.GetById(id);

            return Ok(data);
        }


        // INSERT
        [HttpPost]

        public async Task<IActionResult> Insert(IngredientDTO dto)
        {
            await _service.Insert(dto);

            return Ok("Extra Added");
        }


        // UPDATE
        [HttpPut]

        public async Task<IActionResult> Update(IngredientDTO dto)
        {
            await _service.Update(dto);

            return Ok("Extra Updated");
        }


        // DELETE
        [HttpDelete("{ingredient_id}/{shop_id}")]

        public async Task<IActionResult> Delete(long ingredient_id, long shop_id)
        {
            await _service.Delete(ingredient_id, shop_id);

            return Ok("Extra Deleted");
        }
    }

}