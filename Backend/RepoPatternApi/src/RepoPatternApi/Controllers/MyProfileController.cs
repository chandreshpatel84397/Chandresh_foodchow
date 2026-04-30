using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Application.Services;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MyProfileController : ControllerBase
    {
        private readonly MyProfileService _service;
        private readonly IConfiguration _configuration;

        public MyProfileController(MyProfileService service, IConfiguration configuration)
        {
            _service = service;
            _configuration = configuration;
        }

        [HttpGet("schema")]
        public async Task<IActionResult> GetSchema()
        {
            var cs = _configuration.GetConnectionString("DefaultConnection");
            var result = new Dictionary<string, List<string>>();

            using (var con = new Microsoft.Data.SqlClient.SqlConnection(cs))
            {
                await con.OpenAsync();

                string query = @"SELECT TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
                                 WHERE TABLE_NAME IN ('food_shop', 'food_shop_settings') 
                                 ORDER BY TABLE_NAME, ORDINAL_POSITION";

                using (var cmd = new Microsoft.Data.SqlClient.SqlCommand(query, con))
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var table = reader.GetString(0);
                        var column = reader.GetString(1);
                        if (!result.ContainsKey(table))
                            result[table] = new List<string>();
                        result[table].Add(column);
                    }
                }
            }

            return Ok(result);
        }

        // POST: api/MyProfile/create
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] MyProfileCreateDto dto)
        {
            var result = await _service.CreateMyProfileAsync(dto);

            if (result)
                return Ok(new { message = "Inserted into food_shop & food_shop_settings " });

            return BadRequest(new { message = "Insert failed " });
        }
    }
}