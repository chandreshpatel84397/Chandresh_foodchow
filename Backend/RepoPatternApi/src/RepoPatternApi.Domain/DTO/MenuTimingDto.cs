using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
    public class MenuTimingDto
    {
        public long ShopId { get; set; }
        public long MenuId { get; set; }
        public string DaysName { get; set; }
        public string OpenTime { get; set; }
        public string CloseTime { get; set; }
        public long CloseDay { get; set; }
        public long FullDay { get; set; }
    }
}
