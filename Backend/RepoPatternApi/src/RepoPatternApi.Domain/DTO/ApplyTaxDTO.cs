using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
    public class ApplyTaxDTO
    {
        public long item_id { get; set; }
        public long size_id { get; set; }
        public long tax_id { get; set; }
        public long shop_id { get; set; }
    }
}