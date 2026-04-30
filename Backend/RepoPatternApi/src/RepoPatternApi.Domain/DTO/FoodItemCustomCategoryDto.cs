using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
    public class FoodItemCustomCategoryDto
    {
        public long shop_id { get; set; }            // required for insert
        public string custom_cat_name { get; set; }  // category name
        public long status { get; set; }              // 1 = active, 0 = inactive
    }
}
