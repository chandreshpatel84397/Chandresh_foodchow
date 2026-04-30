using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
    public class categoryresponseDTO
    {
        public long CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? CategoryImage { get; set; }
        public bool CategoryStatus { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime? UpdateDate { get; set; }
    }
}