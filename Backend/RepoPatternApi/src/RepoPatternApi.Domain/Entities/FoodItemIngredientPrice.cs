using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.Entities
{
    public class FoodItemIngredientPrice
    {
        public long id { get; set; }

        public long item_ingredient_id { get; set; }

        public float price { get; set; }

        public DateTime created_date { get; set; }

        public DateTime? updated_date { get; set; }

        public long status { get; set; }

        public long sold_out { get; set; }
    }
}