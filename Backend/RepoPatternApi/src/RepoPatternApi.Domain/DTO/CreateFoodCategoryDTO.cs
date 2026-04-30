namespace RepoPatternApi.Domain.DTO
{
    public class CreateFoodCategoryDTO
    {
        public long shop_id { get; set; }
        public string? cate_name { get; set; }
        public string? cate_image { get; set; }
        public long cate_position { get; set; }
        public string? description { get; set; }
        public long status { get; set; } = 1;
    }
}