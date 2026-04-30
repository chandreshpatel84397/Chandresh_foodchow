using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using RepoPatternApi.Application.DTOs;
using RepoPatternApi.Models;
using System.Data;

namespace RepoPatternApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodShopSizeController : ControllerBase
    {
        private readonly IConfiguration _config;

        public FoodShopSizeController(IConfiguration config)
        {
            _config = config;
        }

        private IDbConnection Connection
            => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

        [HttpPost("insert")]
        public IActionResult InsertFoodShopSize([FromBody] FoodShopSizeCreateDto model)
        {
            string sql = @"
        INSERT INTO food_shop_sizes
        (shop_id, size_name, status)
        VALUES
        (@shop_id, @size_name, 1)
    ";

            using (var db = Connection)
            {
                db.Execute(sql, new
                {
                    shop_id = 1,
                    size_name = model.size_name
                });
            }
            return Ok(new { message = "Data inserted successfully" });
        }
        [HttpGet("getall")]
        public IActionResult GetAllFoodShopSize()
        {
            string sql = "SELECT * FROM food_shop_sizes";

            using (var db = Connection)
            {
                var data = db.Query<FoodShopSize>(sql).ToList();
                return Ok(data);
            }
        }
        [HttpDelete("delete/{id}")]
        public IActionResult DeleteFoodShopSize(int id)
        {
            string sql = "DELETE FROM food_shop_sizes WHERE id = @id";

            using (var db = Connection)
            {
                int rows = db.Execute(sql, new { id });

                if (rows == 0)
                {
                    return NotFound(new { message = "Record not found" });
                }
            }

            return Ok(new { message = "Deleted successfully" });
        }
        [HttpPut("update/{id}")]
        public IActionResult UpdateFoodShopSize(int id, FoodShopSizeUpdateDto model)
        {
            string sql = @"
        UPDATE food_shop_sizes
        SET 
            size_name = @size_name
            
        WHERE id = @id ";

            using (var db = Connection)
            {
                int rows = db.Execute(sql, new
                {
                    id = id,
                    size_name = model.size_name,

                });

                if (rows == 0)
                {
                    return NotFound(new { message = "Record not found" });
                }
            }

            return Ok(new { message = "Updated successfully" });

        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            string sql = "SELECT * FROM food_shop_sizes WHERE id = @id";

            using (var db = Connection)
            {
                var data = db.QueryFirstOrDefault(sql, new { id });

                if (data == null)
                    return NotFound(new { message = "Record not found" });

                return Ok(data);
            }
        }
    }
}