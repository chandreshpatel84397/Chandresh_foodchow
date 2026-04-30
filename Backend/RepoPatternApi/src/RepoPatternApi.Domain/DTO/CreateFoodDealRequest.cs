using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RepoPatternApi.Domain.DTO
{
    public class CreateFoodDealRequest
    {
        [JsonPropertyName("dealId")]
        public long DealId { get; set; }

        [JsonPropertyName("dealName")]
        public string DealName { get; set; }

        [JsonPropertyName("dealTypeId")]
        public long DealTypeId { get; set; }

        [JsonPropertyName("shopId")]
        public long ShopId { get; set; }

        [JsonPropertyName("dealDesc")]
        public string DealDesc { get; set; }

        [JsonPropertyName("dealImage")]
        public string DealImage { get; set; }

        [JsonPropertyName("dealPrice")]
        public double DealPrice { get; set; }

        [JsonPropertyName("dealMRP")]
        public double DealMRP { get; set; }

        [JsonPropertyName("totalDealPrice")]
        public double TotalDealPrice { get; set; }

        [JsonPropertyName("status")]
        public long Status { get; set; }

        [JsonPropertyName("percentDiscountOnCart")]
        public double PercentDiscountOnCart { get; set; }

        [JsonPropertyName("validOrderMethod")]
        public string ValidOrderMethod { get; set; }

        [JsonPropertyName("validPaymentMethod")]
        public string ValidPaymentMethod { get; set; }

        [JsonPropertyName("applyDiscount")]
        public long ApplyDiscount { get; set; }

        [JsonPropertyName("minOrder")]
        public long MinOrder { get; set; }

        [JsonPropertyName("taxIds")]
        public List<int>? TaxIds { get; set; }

        [JsonPropertyName("taxType")]
        public int TaxType { get; set; }
        [JsonPropertyName("taxAmount")]
        public double TaxAmount { get; set; }

        [JsonPropertyName("dealItems")]
        public List<DealItemRequest> DealItems { get; set; } = new List<DealItemRequest>();

        [JsonPropertyName("dealGroups")]
        public List<DealGroupRequest> DealGroups { get; set; } = new List<DealGroupRequest>();
    }

    public class DealGroupRequest
    {
        [JsonPropertyName("groupNo")]
        public int GroupNo { get; set; }

        [JsonPropertyName("items")]
        public List<DealGroupItemRequest> Items { get; set; }
    }

    public class DealGroupItemRequest
    {
        [JsonPropertyName("categoryId")]
        public long CategoryId { get; set; }

        [JsonPropertyName("itemId")]
        public long ItemId { get; set; }
    }

    public class DealItemRequest
    {
        [JsonPropertyName("dealCategoryId")]
        public long DealCategoryId { get; set; }

        [JsonPropertyName("categoryId")]
        public long CategoryId { get; set; }

        [JsonPropertyName("itemId")]
        public long ItemId { get; set; }

        [JsonPropertyName("sizeId")]
        public long SizeId { get; set; }
    }

    public class DealImageRequest
    {
        [JsonPropertyName("dealImage")]
        public string DealImage { get; set; }
    }

    public class DealStatusRequest
    {
        [JsonPropertyName("status")]
        public long Status { get; set; }
    }

    public class UpdateDealStatusRequest
    {
        [JsonPropertyName("status")]
        public long Status { get; set; }
    }
}