using System.Data;
using System.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Infrastructure.Repositories
{
    public class CategoryMapperRepository : ICategoryMapperRepository
    {
        private readonly IConfiguration _configuration;

        public CategoryMapperRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<dynamic>> GetCategories()
        {
            var cs = _configuration.GetConnectionString("DefaultConnection");

            using var con = new SqlConnection(cs);

            var query = @"SELECT
                    id,
                    cate_name,
                    shop_id
                  FROM food_category
                  WHERE status = 1
                  ";

            return await con.QueryAsync(query);
        }

        public async Task<IEnumerable<dynamic>> GetSections()
        {
            var cs = _configuration.GetConnectionString("DefaultConnection");

            using var con = new SqlConnection(cs);

            var query = @"SELECT DISTINCT
                    section_id,
                    section_name,
                    shop_id
                  FROM catelistforkds
                  ";

            return await con.QueryAsync(query);
        }

        public async Task AddSection(SectionDto dto)
        {
            var cs = _configuration.GetConnectionString("DefaultConnection");

            using var con = new SqlConnection(cs);

            var query = @"
INSERT INTO catelistforkds(section_id,section_name,shop_id)
VALUES(
   (SELECT ISNULL(MAX(section_id),0)+1 FROM catelistforkds),
   ISNULL(@SectionName,'NEW SECTION'),
   @Shop_Id
)";

            await con.ExecuteAsync(query, dto);
        }

        public async Task DeleteSection(int id)
        {
            var cs = _configuration.GetConnectionString("DefaultConnection");

            using var con = new SqlConnection(cs);

            var query = @"DELETE FROM catelistforkds 
                  WHERE section_id = @id";

            await con.ExecuteAsync(query, new { id });
        }

        public async Task MapCategory(CategoryMapperDto dto)
        {
            var cs = _configuration.GetConnectionString("DefaultConnection");

            using var con = new SqlConnection(cs);

            var query = @"
DELETE FROM catelistforkds
WHERE cate_id = @CategoryId AND shop_id = @Shop_Id;

INSERT INTO catelistforkds
(section_id, section_name, cate_id, cate_name, shop_id)
SELECT
    @SectionId,
    s.section_name,
    c.id,
    c.cate_name,
    @Shop_Id
FROM food_category c
JOIN catelistforkds s ON s.section_id = @SectionId
WHERE c.id = @CategoryId
";

            await con.ExecuteAsync(query, dto);
        }

        public async Task<IEnumerable<dynamic>> GetSectionCategories(int sectionId)
        {
            var cs = _configuration.GetConnectionString("DefaultConnection");

            using var con = new SqlConnection(cs);

            var query = @"SELECT
                    cate_id,
                    cate_name
                  FROM catelistforkds
                  WHERE section_id = @sectionId";

            return await con.QueryAsync(query, new { sectionId });
        }

        public async Task DeleteCategory(int sectionId, int categoryId)
        {
            var cs = _configuration.GetConnectionString("DefaultConnection");

            using var con = new SqlConnection(cs);

            var query = @"DELETE FROM catelistforkds 
                  WHERE section_id=@sectionId 
                  AND cate_id=@categoryId";

            await con.ExecuteAsync(query, new { sectionId, categoryId });
        }

        public async Task UpdateSection(SectionDto dto)
        {
            var cs = _configuration.GetConnectionString("DefaultConnection");

            using var con = new SqlConnection(cs);

            var query = @"UPDATE catelistforkds
                  SET section_name = @SectionName
                  WHERE section_id = @SectionId";

            await con.ExecuteAsync(query, dto);
        }
    }
}