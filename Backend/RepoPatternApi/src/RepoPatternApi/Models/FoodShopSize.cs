namespace RepoPatternApi.Models
{
    public class FoodShopSize
    {
        public long id { get; set; }
        public long shop_id { get; set; }
        public string size_name { get; set; }
        public long status { get; set; }
        public DateTime created_Date { get; set; }
        public DateTime updated_Date { get; set; }
    }
}