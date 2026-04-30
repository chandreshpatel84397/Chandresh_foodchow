using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
    // This DTO is used to send data to frontend
    public class DealTypeResponse
    {
        public long DealTypeId { get; set; }
        public string DealTypeName { get; set; }
    }
}