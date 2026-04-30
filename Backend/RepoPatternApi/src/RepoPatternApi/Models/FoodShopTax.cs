namespace RepoPatternApi.Models
{
    public class FoodShopTax
    {
        public long food_shop_tax_id { get; set; }

        public string? food_country_tax_id { get; set; }

        public long? shop_id { get; set; }

        public string? tax_name { get; set; }

        public double? tax_percentage { get; set; }

        public bool? is_active { get; set; }

        public double? tax_type { get; set; }   // FLOAT → double

        public DateTime created_date { get; set; } = DateTime.Now;

        public DateTime updated_date { get; set; } = DateTime.Now;
    }
}
