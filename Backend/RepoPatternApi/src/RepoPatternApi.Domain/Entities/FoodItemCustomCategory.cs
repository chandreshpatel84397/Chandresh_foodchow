using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.Entities
{
    public class FoodItemCustomCategory
    {
        public long custom_cat_id { get; set; }      // BIGINT
        public long shop_id { get; set; }             // BIGINT
        public string custom_cat_name { get; set; }   // NVARCHAR(500)
        public long status { get; set; }              // BIGINT (1 = active, 0 = inactive)
        public DateTime? created_date { get; set; }   // DATETIME2
        public DateTime? updated_date { get; set; }   // DATETIME2
    }
}
