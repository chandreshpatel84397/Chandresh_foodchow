//namespace RepoPatternApi.Domain.DTO
//{
//    public class FoodShopTaxDTO
//    {
//        public long food_shop_tax_id { get; set; }
//        public string? food_country_tax_id { get; set; }
//        public long? shop_id { get; set; }
//        public string? tax_name { get; set; }
//        public double? tax_percentage { get; set; }
//        public bool? is_active { get; set; }       // ✅ stays bool? — send true/false from frontend
//        public double? tax_type { get; set; }  // instead of string?    // ✅ stays string? — send "1" or "0" from frontend
//        public DateTime? created_date { get; set; }
//        public DateTime? updated_date { get; set; }
//    }
//}


namespace RepoPatternApi.Domain.DTO
{
    public class FoodShopTaxDTO
    {
        public long food_shop_tax_id { get; set; }
        public string? food_country_tax_id { get; set; }
        public long? shop_id { get; set; }
        public string? tax_name { get; set; }
        public double? tax_percentage { get; set; }
        public bool? is_active { get; set; }       // ✅ stays bool? — send true/false from frontend
        public string? tax_type { get; set; }      // ✅ stays string? — send "1" or "0" from frontend
        public DateTime? created_date { get; set; }
        public DateTime? updated_date { get; set; }
    }
}
