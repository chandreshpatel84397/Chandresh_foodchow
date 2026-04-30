using Azure.Core;
using RepoPatternApi.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace RepoPatternApi.Infrastructure.Repositories
{
    public class AffiniaPaymentRepository : IAffiniaPaymentRepository
    {
        private readonly IAffiniaPaymentRepository _affiniaPaymentRepository;
        public AffiniaPaymentRepository(IAffiniaPaymentRepository affiniaPaymentRepository  )
        {
            _affiniaPaymentRepository = affiniaPaymentRepository;
        }
        
    }
}
