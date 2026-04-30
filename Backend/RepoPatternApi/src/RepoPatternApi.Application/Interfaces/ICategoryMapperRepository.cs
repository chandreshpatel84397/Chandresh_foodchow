using RepoPatternApi.Domain.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Application.Interfaces
{
    public interface ICategoryMapperRepository
    {
        Task<IEnumerable<dynamic>> GetCategories();

        Task<IEnumerable<dynamic>> GetSections();

        Task AddSection(SectionDto dto);

        Task DeleteSection(int sectionId);

        Task MapCategory(CategoryMapperDto dto);

        Task<IEnumerable<dynamic>> GetSectionCategories(int sectionId);
        Task DeleteCategory(int sectionId, int categoryId);
        Task UpdateSection(SectionDto dto);
    }
}
