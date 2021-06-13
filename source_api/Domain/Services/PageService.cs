using Data.EF;
using Data.Entities;
using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using Domain.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Utilities;

namespace Domain.Services
{
    public class PageService : IPageService<Guid>
    {
        private readonly EFRepository<Page, Guid> m_pageRepository;
        public PageService(EFRepository<Page, Guid> pageRepository)
        {
            m_pageRepository = pageRepository;
        }
        public IEnumerable<PageResponse> GetAll()
        {
            var l_page = m_pageRepository.GetAll(_ => _.User);
            List<PageResponse> pageResponse = new List<PageResponse>();
            foreach (Page page in l_page)
            {
                pageResponse.Add(
                new PageResponse(
                    page.Id,
                    page.DateCreated,
                    page.Name,
                    page.Address,
                    page.PhoneNumber,
                    page.Avatar,
                    page.Background,
                    page.Description,
                    page.Follow,
                    page.Active,
                    page.RequestCreate,
                    page.FImageCard,
                    page.BImageCard,
                    page.Priority,
                    page.Location,
                    page.User.Id.ToString()));
            }
            return pageResponse;
        }
        public PageResponse GetById(Guid id)
        {
            var page = m_pageRepository.FindSingle(_ => _.Id.Equals(id), _ => _.User);
            PageResponse pageResponse = new PageResponse(
                        page.Id,
                        page.DateCreated,
                        page.Name,
                        page.Address,
                        page.PhoneNumber,
                        page.Avatar,
                        page.Background,
                        page.Description,
                        page.Follow,
                        page.Active,
                        page.RequestCreate,
                        page.FImageCard,
                        page.BImageCard,
                        page.Priority,
                        page.Location,
                        page.User.Id.ToString());
            return pageResponse;
        }
        IEnumerable<PageResponse> IPageService<Guid>.GetPagesByUserId<IdType>(IdType id)
        {
            var l_pages = m_pageRepository.FindMultiple(_ => _.User.Id.Equals(id), _ => _.User);

            List<PageResponse> l_pageResponses = new List<PageResponse>();

            foreach (Page page in l_pages)
            {
                l_pageResponses.Add(
                    new PageResponse(
                        page.Id,
                        page.DateCreated,
                        page.Name,
                        page.Address,
                        page.PhoneNumber,
                        page.Avatar,
                        page.Background,
                        page.Description,
                        page.Follow,
                        page.Active,
                        page.RequestCreate,
                        page.FImageCard,
                        page.BImageCard,
                        page.Priority,
                        page.Location,
                        page.User.Id.ToString()));
            }
            return l_pageResponses;
        } 
        public PageResponse Create(CreatePageRequest model, string webRootPath)
        {
            try
            {
                Guid l_newTripGuidId = Guid.NewGuid();
                string fImageCard = this.SaveFile(webRootPath, $"media-file/{l_newTripGuidId}/", model.FImageCard);
                string bImageCard = this.SaveFile(webRootPath, $"media-file/{l_newTripGuidId}/", model.BImageCard);
                //Post l_newPost = new Post(l_newPostGuidId, model.Status, System.Text.Encoding.ASCII.GetBytes(model.Base64Str), System.Guid.Parse(model.UserId));
                Page l_newPage = new Page
                {
                    Id = l_newTripGuidId,
                    Name = model.Name,
                    Address = model.Address,
                    Description = model.Description,
                    PhoneNumber = model.PhoneNumber,
                    FImageCard = fImageCard,
                    BImageCard = bImageCard,
                    RequestCreate = false,
                    DateCreated = DateTime.Now,
                    Follow = 0,
                    Active = true,
                    Priority = 0,
                    Location = null,
                    UserId = model.UserId
                };

                m_pageRepository.Add(l_newPage);
                m_pageRepository.SaveChanges();

                return GetById(l_newTripGuidId);
            }
            catch
            {
                throw new Exception("create page failed");
            }
        }
        public void ModifyPageInfo(Guid id, CreatePageRequest model)
        {
            Page page = m_pageRepository.FindById(id);
            var m_page = page;
            {
                page.Address = model.Address;
                page.PhoneNumber = model.PhoneNumber;
                page.Name = model.Name;
                page.Description = model.Description;
                page.UserId = page.UserId;
            }
            m_pageRepository.SetModifierPageStatus(m_page, EntityState.Modified);
            m_pageRepository.SaveChanges();
        }
        public void UploadAvatar(Guid id, string webRootPath, IFormFile avatar)
        {
            Page page = m_pageRepository.FindById(id);

            string imageUrl = this.SaveFile(webRootPath, $"media-file/{id}/", avatar);
            page.Avatar = imageUrl;
            m_pageRepository.SaveChanges();
        }
        public void UploadBackground(Guid id, string webRootPath, IFormFile background)
        {
            Page page = m_pageRepository.FindById(id);
            string imageUrl = this.SaveFile(webRootPath, $"media-file/{id}/", background);
            page.Background = imageUrl;
            m_pageRepository.SaveChanges();
        }
        private string SaveFile(string webRootPath, string dirFile, IFormFile image)
        {
            //host static image
            Int32 unixTimestamp = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            string nameImage = unixTimestamp.ToString() + "." + image.FileName.Split('.')[1];

            string filePath = $"{webRootPath}{SystemConstants.DIRECTORY_SEPARATOR_CHAR}{dirFile}";

            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }

            using (FileStream fileStream = System.IO.File.Create(filePath + nameImage))
            {
                image.CopyTo(fileStream);
                fileStream.Flush();
            }

            return dirFile + nameImage;
        }
        public void AddFollow(Guid id)
        {
            Page page = m_pageRepository.FindById(id);
            page.Follow = page.Follow + 1;
            m_pageRepository.SaveChanges();
        }
        public void RemoveFollow(Guid id)
        {
            Page page = m_pageRepository.FindById(id);
            page.Follow = page.Follow - 1;
            m_pageRepository.SaveChanges();
        }
        public void AcceptRequest(Guid id)
        {
            Page page = m_pageRepository.FindById(id);
            page.RequestCreate = true;
            m_pageRepository.SaveChanges();
        }
        public bool BlockPage(Guid id)
        {
            Page page = m_pageRepository.FindById(id);
            page.Active = !page.Active;
            m_pageRepository.SetModifierPageStatus(page, EntityState.Modified);
            m_pageRepository.SaveChanges();
            if (page.Active == true)
                return true;
            else
                return false;
        }
        public void DeleteRequest(Guid id)
        {
            try
            {
                var page_request = m_pageRepository.GetAll( _ => _.User).Where(_ => _.Id.ToString().ToLower().Contains(id.ToString().ToLower())).FirstOrDefault();
                m_pageRepository.Remove(page_request);
                m_pageRepository.SaveChanges();
            }
            catch
            {
                throw new Exception("delete failed");
            }
        }
    }
}
