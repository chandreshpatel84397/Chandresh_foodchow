using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
    public class ItemInsert
    {
        public long item_id { get; set; }
        public long cate_id { get; set; }
        public string item_name { get; set; }
        public string description { get; set; }
        public string? item_image { get; set; }
        public long is_veg { get; set; }
        public long non_veg_type { get; set; }
        public string item_code { get; set; }
        public long price { get; set; } // maps to open_price}

        public long status { get; set; }
        public long is_alcohol { get; set; }
    }
}