using Microsoft.AspNetCore.Mvc;
using RepoPatternApi.Application.Services;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodItemController : ControllerBase
    {
        private readonly FoodItemService _service;

        public FoodItemController(FoodItemService service)
        {
            _service = service;
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] FoodItemCreateDto dto)
        {
            var itemId = await _service.AddFoodItem(dto);

            return Ok(new
            {
                item_id = itemId,
                message = "Food item inserted successfully"
            });
        }

        [HttpGet("get")]
        public async Task<IActionResult> GetItems()
        {
            var items = await _service.GetFoodItems();
            return Ok(items); // MUST return something
        }

        [HttpDelete("delete/{itemId}")]
        public async Task<IActionResult> Delete(string itemId)
        {
            if (!long.TryParse(itemId, out var id))
                return BadRequest(new { message = "Invalid item id" });

            var result = await _service.DeleteFoodItem(id);

            if (!result)
                return NotFound(new { message = "Item not found" });

            return Ok(new { message = "Item deleted successfully" });
        }

        [HttpPut("update/{itemId}")]
        public async Task<IActionResult> Update(
    string itemId,
    [FromBody] FoodItemCreateDto dto)
        {
            if (!long.TryParse(itemId, out var id))
                return BadRequest(new { message = "Invalid item id" });

            var result = await _service.UpdateFoodItem(id, dto);

            if (!result)
                return NotFound(new { message = "Item not found" });

            return Ok(new { message = "Item updated successfully" });
        }
        [HttpGet("get-item-names")]
        public async Task<IActionResult> GetItemNames(int categoryId)
        {
            Console.WriteLine("CategoryId: " + categoryId); // 🔥 ADD THIS

            var data = await _service.GetItemNames(categoryId);
            return Ok(data);
        }

        [HttpPut("update-item-code/{id}")]
        public async Task<IActionResult> UpdateItemCode(
    long id,
    [FromBody] UpdateItemCodeDto dto)
        {
            if (id != dto.item_id)
                return BadRequest(new { message = "ID mismatch" });

            var result = await _service.UpdateItemCode(id, dto.item_code);

            if (!result)
                return NotFound(new { message = "Item not found" });

            return Ok(new { message = "Item code updated successfully" });
        }
        [HttpPost("insert-item")]
        public async Task<IActionResult> InsertItem([FromBody] ItemInsert dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.item_name))
                return BadRequest(new { message = "Invalid data" });

            var result = await _service.InsertItem(dto);

            if (!result)
                return BadRequest(new { message = "Insert failed" });

            return Ok(new { message = "Item inserted successfully" });
        }

        [HttpPut("update-item/{id}")]
        public async Task<IActionResult> UpdateItem(long id, [FromBody] ItemInsert dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.item_name))
                return BadRequest(new { message = "Invalid data" });

            var result = await _service.UpdateItem(id, dto);

            if (!result)
                return BadRequest(new { message = "Update failed or item not found" });

            return Ok(new { message = "Item updated successfully" });
        }

        [HttpGet("get-item-list")]
        public async Task<IActionResult> GetItemList()
        {
            var data = await _service.GetItemList();
            return Ok(data);
        }

        [HttpGet("get-item/{id}")]
        public async Task<IActionResult> GetItemById(long id)
        {
            var item = await _service.GetItemById(id);

            if (item == null)
                return NotFound();

            return Ok(item);
        }

        [HttpPost("toggle-status/{item_id}")]
        public async Task<IActionResult> ToggleItemStatus(long item_id)
        {
            var result = await _service.ToggleItemStatus(item_id);

            if (!result)
                return NotFound();

            return Ok("Status toggled successfully");
        }

        [HttpGet("get-item-by-name")]
        public async Task<IActionResult> GetItemByName(string itemName)
        {
            if (string.IsNullOrWhiteSpace(itemName))
                return BadRequest(new { message = "item_name is required" });

            var data = await _service.GetItemByName(itemName);

            if (data == null || data.Count == 0)
                return NotFound(new { message = "No items found with that item_name" });

            return Ok(data);
        }

        [HttpPost("update-item-image/{item_id}")]
        public async Task<IActionResult> UpdateItemImage(long item_id, IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest(new { message = "image is required" });

            // save file to wwwroot/images or your custom folder
            var fileName = image.FileName;
            var folderPath = @"C:\Users\admin\Pictures\Screenshots";
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var result = await _service.UpdateItemImage(item_id, fileName);

            if (!result)
                return NotFound(new { message = "item_id not found" });

            return Ok(new { message = "Image updated successfully", item_id, item_image = fileName });
        }
    }
}