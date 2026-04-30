using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
    public class MenuItemDto
    {
        public long ShopId { get; set; }
        public long MenuId { get; set; }
        public long CategoryId { get; set; }
        public long ItemId { get; set; }
        public long SizeId { get; set; }
        public double Price { get; set; }
        public double TotalPrice { get; set; }
    }
}
