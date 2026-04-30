using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Services
{
    public class MyProfileService
    {
        private readonly IMyProfileRepository _repo;

        public MyProfileService(IMyProfileRepository repo)
        {
            _repo = repo;
        }

        public Task<bool> CreateMyProfileAsync(MyProfileCreateDto dto)
        {
            return _repo.CreateMyProfileAsync(dto);
        }
    }
}