using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
    public class FoodPreferenceCreateDto
    {
        public long preference_id { get; set; }
        public required string preference_name { get; set; }
        public long is_active { get; set; }   // maps to is_active / status
        public List<string> option_name { get; set; } = new();
    }
}