using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Interfaces
{
   public  interface IMyProfileRepository 
    {
        Task<bool> CreateMyProfileAsync(MyProfileCreateDto dto);
    }
}
