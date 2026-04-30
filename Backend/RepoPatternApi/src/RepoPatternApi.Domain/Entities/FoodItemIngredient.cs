using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.Entities
{
    public class FoodItemIngredient
    {
        public long ingredient_id { get; set; }

        public long shop_id { get; set; }

        // connects to food_item_custom_category.custom_cat_id
        public long ingredient_category_id { get; set; }

        public string ingredient_name { get; set; }

        public long is_size_available { get; set; }

        public long is_veg { get; set; }

        public long status { get; set; }

        public DateTime created_date { get; set; }

        public DateTime? updated_date { get; set; }

        public long sold_out_flag { get; set; }
    }
}