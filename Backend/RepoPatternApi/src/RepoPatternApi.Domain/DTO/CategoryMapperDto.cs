using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
    public class CategoryMapperDto
    {
        public int SectionId { get; set; }

        public int CategoryId { get; set; }

        public int Shop_Id { get; set; }
    }

    public class SectionDto
    {
        public int SectionId { get; set; }
        public string SectionName { get; set; }
        public int Shop_Id { get; set; }
    }
}
