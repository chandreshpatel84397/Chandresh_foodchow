using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Application.Services
{
    public class FoodApplyTaxService : IFoodApplyTaxService
    {
        private readonly IFoodApplyTaxRepository _repo;

        public FoodApplyTaxService(IFoodApplyTaxRepository repo)
        {
            _repo = repo;
        }

        public async Task<string> ApplyTaxAsync(ApplyTaxDTO dto)
        {
            double price = await _repo.GetItemPriceAsync(dto.size_id);

            var (tax_percent, tax_type) = await _repo.GetTaxDetailsAsync(dto.tax_id);

            double tax_amount = (price * tax_percent) / 100;

            bool exists = await _repo.IsTaxAlreadyAppliedAsync(dto.item_id, dto.size_id, dto.tax_id);

            if (exists) return "Tax already applied";

            await _repo.InsertAppliedTaxAsync(dto, tax_amount, tax_type);

            return "Tax Applied Successfully";
        }

        public async Task<string> RemoveTaxAsync(ApplyTaxDTO dto)
        {
            bool removed = await _repo.RemoveAppliedTaxAsync(dto);

            return removed ? "Tax Removed Successfully" : "Tax not found";
        }

        public async Task<List<(long item_id, long size_id)>> GetAppliedTaxAsync(long tax_id)
        {
            return await _repo.GetAppliedTaxAsync(tax_id);
        }
    }
}