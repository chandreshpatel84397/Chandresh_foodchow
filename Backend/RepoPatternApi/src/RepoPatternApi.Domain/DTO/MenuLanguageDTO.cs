using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{

    public class MenuLanguageDTO
    {
        public long shop_id { get; set; }

        public string? Primary_language { get; set; }

        public string? Secondary_language { get; set; }

        public long? Display_menu { get; set; }

        public long? MenuDirection { get; set; }

        public double? type_of_menu { get; set; }
        // 1 = Single Language
        // 2 = Dual Language
    }

}