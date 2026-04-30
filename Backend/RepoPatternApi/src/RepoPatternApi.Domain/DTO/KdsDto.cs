using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
    public class FoodCategoryDto
    {
        public int Id { get; set; }
        public string CateName { get; set; }
        public int CatePosition { get; set; }
        public bool Status { get; set; }
    }

    // ========== TERMINAL DTO ==========
    public class KdsTerminalDto
    {
        public long TerminalId { get; set; }
        public long? ShopId { get; set; }
        public string TerminalName { get; set; }
        public string FoodCategoryId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
