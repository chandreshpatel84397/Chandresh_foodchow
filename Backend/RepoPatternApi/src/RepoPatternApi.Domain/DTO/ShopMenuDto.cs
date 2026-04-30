using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
    public class ShopMenuDto
    {
        public long Id { get; set; }
        public long ShopId { get; set; }
        public string MenuName { get; set; }
        public string Description { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public long Status { get; set; }
        public long ForOnline { get; set; }
        public long ForPos { get; set; }
    }
}