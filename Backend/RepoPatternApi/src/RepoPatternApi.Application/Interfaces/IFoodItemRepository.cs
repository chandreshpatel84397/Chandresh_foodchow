using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Interfaces
{
    public interface IFoodItemRepository
    {
        Task<long> AddFoodItem(FoodItemCreateDto dto);
        Task<List<FoodItemCreateDto>> GetFoodItems();
        Task<bool> DeleteFoodItem(long itemId);

        Task<bool> UpdateFoodItem(long itemId, FoodItemCreateDto dto);

        Task<List<FoodItemCode>> GetItemNames(int categoryId);
        Task<bool> UpdateItemCode(long itemId, string itemCode);

        Task<bool> InsertItem(ItemInsert item);

        Task<bool> UpdateItem(long id, ItemInsert item);

        Task<List<ItemInsert>> GetItemList();

        Task<ItemInsert> GetItemById(long id);

        Task<bool> ToggleItemStatus(long item_id);

        Task<List<ItemInsert>> GetItemByName(string itemName);

        Task<bool> UpdateItemImage(long item_id, string item_image);
    }
}