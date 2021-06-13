using Data.EF;
using Data.Entities;
using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using Domain.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
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
        public DiscountResponse CreateDiscount(DiscountRequest model)
        {
            try
            {
                Guid l_newTripGuidId = Guid.NewGuid();
                Discount o_newDis = new Discount
                {
                    Id = l_newTripGuidId,
                    Name = model.Name,
                    CodeDiscount = model.CodeDiscount,
                    DiscountPer = model.DiscountPer,
                    Active = model.Active,
                    DateCreated = DateTime.Now,
                    PageId = model.PageId
                };

                m_disRepository.Add(o_newDis);
                m_disRepository.SaveChanges();

                return GetById(l_newTripGuidId);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public bool BlockDiscount(Guid id)
        {
            Discount dis = m_disRepository.FindById(id);
            dis.Active = !dis.Active;
            m_disRepository.SaveChanges();
            if (dis.Active == true)
                return true;
            else
                return false;
        }
        public void DeleteDiscount(Guid id)
        {
            try
            {
                var dis_request = m_disRepository.GetAll(_ => _.Page).Where(_ => _.Id.ToString().ToLower().Contains(id.ToString().ToLower())).FirstOrDefault();
                m_disRepository.Remove(dis_request);
                m_disRepository.SaveChanges();
            }
            catch
            {
                throw new Exception("delete failed");
            }
        }
    }
}
