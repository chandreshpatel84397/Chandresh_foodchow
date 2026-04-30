namespace RepoPatternApi.Models
{
    public class FoodSubTaxAmount
    {
        public long id { get; set; }

        public long item_id { get; set; }

        public long shop_id { get; set; }

        public double item_size_id { get; set; }

        public long tax_id { get; set; }

        public double tax_amount { get; set; }

        public long tax_type { get; set; }
    }
}
