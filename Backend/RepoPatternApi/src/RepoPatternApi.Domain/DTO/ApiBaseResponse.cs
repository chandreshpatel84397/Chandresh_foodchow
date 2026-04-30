using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepoPatternApi.Domain.DTO
{
        public class ApiBaseResponse
        {
            public int ResponseCode { get; set; }
            public bool Success { get; set; }
            public string? Message { get; set; }
            public object? Data { get; set; }
            public string? Result { get; set; }
    }
    }

