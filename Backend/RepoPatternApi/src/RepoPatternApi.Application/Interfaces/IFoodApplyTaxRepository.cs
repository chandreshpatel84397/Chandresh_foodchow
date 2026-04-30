using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Interfaces
{
    public interface IFoodApplyTaxRepository
    {
        Task<double> GetItemPriceAsync(long size_id);
        Task<(double tax_percent, long tax_type)> GetTaxDetailsAsync(long tax_id);
        Task<bool> IsTaxAlreadyAppliedAsync(long item_id, long size_id, long tax_id);
        Task InsertAppliedTaxAsync(ApplyTaxDTO dto, double tax_amount, long tax_type);
        Task<bool> RemoveAppliedTaxAsync(ApplyTaxDTO dto);
        Task<List<(long item_id, long size_id)>> GetAppliedTaxAsync(long tax_id);
    }
}