using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
    public class FoodItemCreateDto
    {
        public long item_id { get; set; }

        public long cate_id { get; set; }

        public string? menu_time_id { get; set; }

        public string? item_name { get; set; }

        public string? description { get; set; }

        public string? item_image { get; set; }

        public long is_size_available { get; set; }

        public long is_veg { get; set; }

        public long non_veg_type { get; set; }

        public long is_alcohol { get; set; }

        public long status { get; set; }

        public long shop_id { get; set; }

        public long is_custom { get; set; }

        public long is_preference { get; set; }

        public string? note { get; set; }

        public long item_position { get; set; }

        public DateTime? created_date { get; set; }

        public DateTime? updated_date { get; set; }

        public string? ordering_method { get; set; }

        public string? item_code { get; set; }

        public long is_manage_stock { get; set; }

        public long sold_out_flag { get; set; }

        public string? barcode { get; set; }

        public long mark_sold_out { get; set; }

        public long open_price { get; set; }
    }
}