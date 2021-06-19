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
    public class AdvertisementService : IAdvertisementService<Guid>
    {
        private readonly EFRepository<Advertisement, Guid> m_adRepository;
        public AdvertisementService(EFRepository<Advertisement, Guid> adRepository)
        {
            m_adRepository = adRepository;
        }
        public IEnumerable<AdvertisementResponse> GetAll()
        {
            var l_ads = m_adRepository.GetAll(_ => _.Page);
            List<AdvertisementResponse> adsResponse = new List<AdvertisementResponse>();
            foreach (Advertisement ads in l_ads)
            {
                adsResponse.Add(
                new AdvertisementResponse(
                    ads.Id,
                    ads.DateCreated,
                    ads.Name,
                    ads.Cost,
                    ads.Priority,
                    ads.EndDate,
                    ads.Active,
                    ads.Page.Id.ToString()));
            }
            return adsResponse;
        }
        public AdvertisementResponse GetById(Guid id)
        {
            var ads = m_adRepository.FindSingle(_ => _.Id.Equals(id), _ => _.Page);
            AdvertisementResponse adsResponse = new AdvertisementResponse(
                    ads.Id,
                    ads.DateCreated,
                    ads.Name,
                    ads.Cost,
                    ads.Priority,
                    ads.EndDate,
                    ads.Active,
                    ads.Page.Id.ToString());
            return adsResponse;
        }
        IEnumerable<AdvertisementResponse> IAdvertisementService<Guid>.GetAdsByPageId<IdType>(IdType id)
        {
            var l_ads = m_adRepository.FindMultiple(_ => _.Page.Id.Equals(id), _ => _.Page);

            List<AdvertisementResponse> l_adsResponses = new List<AdvertisementResponse>();

            foreach (Advertisement ads in l_ads)
            {
                l_adsResponses.Add(
                    new AdvertisementResponse(
                        ads.Id,
                        ads.DateCreated,
                        ads.Name,
                        ads.Cost,
                        ads.Priority,
                        ads.EndDate,
                        ads.Active,
                        ads.Page.Id.ToString()));
            }
            return l_adsResponses;
        }
        IEnumerable<AdvertisementResponse> IAdvertisementService<Guid>.GetAdsActiveByPageId<IdType>(IdType id)
        {
            var l_ads = m_adRepository.FindMultiple(_ => _.Page.Id.Equals(id) && _.Active == true, _ => _.Page);

            List<AdvertisementResponse> l_adsResponses = new List<AdvertisementResponse>();

            foreach (Advertisement ads in l_ads)
            {
                l_adsResponses.Add(
                    new AdvertisementResponse(
                        ads.Id,
                        ads.DateCreated,
                        ads.Name,
                        ads.Cost,
                        ads.Priority,
                        ads.EndDate,
                        ads.Active,
                        ads.Page.Id.ToString()));
            }
            return l_adsResponses;
        }
        public AdvertisementResponse CreateAdvertisement(AdvertisementRequest model)
        {
            try
            {
                Guid l_newTripGuidId = Guid.NewGuid();
                Advertisement o_newAds = new Advertisement
                {
                    Id = l_newTripGuidId,
                    DateCreated = DateTime.Now,
                    Name = model.Name,
                    Cost = model.Cost,
                    Priority = model.Priority,
                    EndDate = model.EndDate,
                    Active = true,
                    PageId = model.PageId
                };

                m_adRepository.Add(o_newAds);
                m_adRepository.SaveChanges();

                return GetById(l_newTripGuidId);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public void DeleteAdvertisement(Guid id)
        {
            try
            {
                var dis_request = m_adRepository.GetAll(_ => _.Page).Where(_ => _.Id.ToString().ToLower().Contains(id.ToString().ToLower())).FirstOrDefault();
                m_adRepository.Remove(dis_request);
                m_adRepository.SaveChanges();
            }
            catch
            {
                throw new Exception("delete failed");
            }
        }
        public bool BlockAdvertisement(Guid id)
        {
            Advertisement ads = m_adRepository.FindById(id);
            ads.Active = !ads.Active;
            m_adRepository.SaveChanges();
            if (ads.Active == true)
                return true;
            else
                return false;
        }
    }
}
