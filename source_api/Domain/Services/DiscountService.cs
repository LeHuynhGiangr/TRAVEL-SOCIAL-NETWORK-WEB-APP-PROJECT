using Data.EF;
using Data.Entities;
using Domain.DomainModels.API.ResponseModels;
using Domain.IServices;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Services
{
    public class DiscountService : IDiscountService<Guid>
    {
        private readonly EFRepository<Discount, Guid> m_disRepository;
        public DiscountService(EFRepository<Discount, Guid> disRepository)
        {
            m_disRepository = disRepository;
        }
        public IEnumerable<DiscountResponse> GetAll()
        {
            var l_dis = m_disRepository.GetAll(_ => _.Page);
            List<DiscountResponse> disResponse = new List<DiscountResponse>();
            foreach (Discount dis in l_dis)
            {
                disResponse.Add(
                new DiscountResponse(
                    dis.Id,
                        dis.DateCreated,
                        dis.Name,
                        dis.CodeDiscount,
                        dis.DiscountPer,
                        dis.Active,
                        dis.Page.Id.ToString()));
            }
            return disResponse;
        }
        public DiscountResponse GetById(Guid id)
        {
            var dis = m_disRepository.FindSingle(_ => _.Id.Equals(id), _ => _.Page);
            DiscountResponse disResponse = new DiscountResponse(
                        dis.Id,
                        dis.DateCreated,
                        dis.Name,
                        dis.CodeDiscount,
                        dis.DiscountPer,
                        dis.Active,
                        dis.Page.Id.ToString());
            return disResponse;
        }
        IEnumerable<DiscountResponse> IDiscountService<Guid>.GetDiscountByPageId<IdType>(IdType id)
        {
            var l_dis = m_disRepository.FindMultiple(_ => _.Page.Id.Equals(id), _ => _.Page);

            List<DiscountResponse> l_distResponses = new List<DiscountResponse>();

            foreach (Discount dis in l_dis)
            {
                l_distResponses.Add(
                    new DiscountResponse(
                        dis.Id,
                        dis.DateCreated,
                        dis.Name,
                        dis.CodeDiscount,
                        dis.DiscountPer,
                        dis.Active,
                        dis.Page.Id.ToString()));
            }
            return l_distResponses;
        }
    }
}
