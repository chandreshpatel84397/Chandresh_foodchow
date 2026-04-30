namespace RepoPatternApi.Domain.DTO
{
    public class MyProfileCreateDto
    {
        public long shop_id { get; set; }
        public string? first_name { get; set; }
        public string? last_name { get; set; }
        public string? email_id { get; set; }
        public string? mobileno { get; set; }
        public string? phoneno { get; set; }

        // Step 2
        public string[]? restaurant_types { get; set; }
        public string? default_currency { get; set; }
        public string[]? cuisines { get; set; }

        // Step 3
        public string? restaurant_name { get; set; }
        public string? apartment_no { get; set; }
        public string? pincode { get; set; }
        public string? address_line_1 { get; set; }
        public string? address_line_2 { get; set; }
        public string? area { get; set; }
        public string? city { get; set; }
        public string? state { get; set; }
        public string? country { get; set; }
        public string? website_url { get; set; }
        public string? promocode { get; set; }
        public string? timezone { get; set; }
        public double? latitude { get; set; }
        public double? longitude { get; set; }

        // Legacy fields (optional to keep for compatibility)
        public string? payment_method { get; set; }
        public double? delivery_fees { get; set; }
        public double? min_order { get; set; }
        public string? delivery_time { get; set; }
    }
}