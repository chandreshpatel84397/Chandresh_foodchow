using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
    public class UpdateItemCodeDto
    {
        public long item_id { get; set; }
        public string item_code { get; set; }
    }
}