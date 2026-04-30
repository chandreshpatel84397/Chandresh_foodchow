namespace RepoPatternApi.Models
{
    public class FoodCategory
    {
        public long id { get; set; } // keep this
        public long shop_id { get; set; }

        public string? cate_name { get; set; }
        public string? cate_image { get; set; }

        public long cate_position { get; set; }
        public string? description { get; set; }

        // 1 = Active, 0 = Inactive
        public long status { get; set; } = 1;

        public DateTime created_date { get; set; } = DateTime.Now;
        public DateTime updated_date { get; set; } = DateTime.Now;
    }
}