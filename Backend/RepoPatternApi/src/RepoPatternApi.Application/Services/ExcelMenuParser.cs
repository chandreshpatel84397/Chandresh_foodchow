using OfficeOpenXml;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Services
{
    public static class ExcelMenuParser
    {
        public static (List<FoodItemCreateDto> items, List<string> errors) Parse(
            Stream excelStream, long shopId)
        {
            var items = new List<FoodItemCreateDto>();
            var errors = new List<string>();

            using var package = new ExcelPackage(excelStream);

            foreach (var ws in package.Workbook.Worksheets)
            {
                // ✅ FIX FOR EPPLUS 8
                if (ws.Dimension == null) continue;

                int totalRows = ws.Dimension.End.Row;
                int totalCols = ws.Dimension.End.Column;

                if (totalRows < 2) continue;

                var headers = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

                for (int col = 1; col <= totalCols; col++)
                {
                    var h = ws.Cells[1, col].Text?.Trim();
                    if (!string.IsNullOrEmpty(h))
                        headers[h] = col;
                }

                if (!headers.ContainsKey("Category") || !headers.ContainsKey("Item_Name"))
                {
                    errors.Add($"Sheet '{ws.Name}' missing required columns");
                    continue;
                }

                for (int row = 2; row <= totalRows; row++)
                {
                    string Cell(string col) =>
                        headers.TryGetValue(col, out int c)
                        ? ws.Cells[row, c].Text?.Trim() ?? ""
                        : "";

                    long ToLong(string col, long def = 0) =>
                        long.TryParse(Cell(col), out long v) ? v : def;

                    var itemName = Cell("Item_Name");
                    if (string.IsNullOrWhiteSpace(itemName)) continue;

                    items.Add(new FoodItemCreateDto
                    {
                        item_name = itemName,
                        note = Cell("Category"),
                        description = Cell("Description"),
                        is_veg = ToLong("Is_Veg(1:veg,0:non-veg)", 1),
                        is_alcohol = ToLong("Is_Alcohol(1:alcoholic,0:no alcoholic)", 0),
                        open_price = ToLong("Price", 0),

                        status = 1,
                        shop_id = shopId,
                        is_size_available = 0,
                        non_veg_type = 0,
                        is_custom = 0,
                        is_preference = 0,
                        item_position = row - 1,
                        is_manage_stock = 0,
                        sold_out_flag = 0,
                        mark_sold_out = 0,
                        ordering_method = "NORMAL",
                        created_date = DateTime.UtcNow,
                        updated_date = DateTime.UtcNow,
                    });
                }
            }

            return (items, errors);
        }
    }
}