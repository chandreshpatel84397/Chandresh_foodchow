using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Services
{
    public class FoodItemService
    {
        private readonly IFoodItemRepository _repo;

        public FoodItemService(IFoodItemRepository repo)
        {
            _repo = repo;
        }

        public Task<long> AddFoodItem(FoodItemCreateDto dto)
        {
            return _repo.AddFoodItem(dto);
        }

        public Task<List<FoodItemCreateDto>> GetFoodItems()
        {
            return _repo.GetFoodItems();
        }

        public Task<bool> DeleteFoodItem(long itemId)
        {
            return _repo.DeleteFoodItem(itemId);
        }

        public Task<bool> UpdateFoodItem(long itemId, FoodItemCreateDto dto)
        {
            return _repo.UpdateFoodItem(itemId, dto);
        }
        public Task<List<FoodItemCode>> GetItemNames(int categoryId)
        {
            return _repo.GetItemNames(categoryId);
        }
        public async Task<bool> UpdateItemCode(long id, string itemCode)
        {
            return await _repo.UpdateItemCode(id, itemCode);
        }

        public interface IFoodItemService
        {
            Task<string> AddItem(ItemInsert model);
        }

        public async Task<bool> InsertItem(ItemInsert item)
        {
            return await _repo.InsertItem(item);
        }

        public async Task<bool> UpdateItem(long id, ItemInsert item)
        {
            return await _repo.UpdateItem(id, item);
        }

        public Task<List<ItemInsert>> GetItemList()
        {
            return _repo.GetItemList();
        }

        public async Task<ItemInsert> GetItemById(long id)
        {
            return await _repo.GetItemById(id);
        }

        public async Task<bool> ToggleItemStatus(long item_id)
        {
            return await _repo.ToggleItemStatus(item_id);
        }

        public Task<List<ItemInsert>> GetItemByName(string itemName)
        {
            return _repo.GetItemByName(itemName);
        }

        public Task<bool> UpdateItemImage(long item_id, string item_image)
        {
            return _repo.UpdateItemImage(item_id, item_image);
        }
    }
}