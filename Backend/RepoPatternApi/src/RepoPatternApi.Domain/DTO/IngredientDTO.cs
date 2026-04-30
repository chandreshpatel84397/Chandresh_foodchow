using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
    public class IngredientDTO
    {
        public long ingredient_id { get; set; }

        public long shop_id { get; set; }

        public long ingredient_category_id { get; set; }

        public string ingredient_name { get; set; }

        public float price { get; set; }

        public bool is_veg { get; set; }

        public bool status { get; set; }
    }
}