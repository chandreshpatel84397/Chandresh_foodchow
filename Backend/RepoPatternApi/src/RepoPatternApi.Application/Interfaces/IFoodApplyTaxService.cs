using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Interfaces
{
    public interface IFoodApplyTaxService
    {
        Task<string> ApplyTaxAsync(ApplyTaxDTO dto);
        Task<string> RemoveTaxAsync(ApplyTaxDTO dto);
        Task<List<(long item_id, long size_id)>> GetAppliedTaxAsync(long tax_id);
    }
}