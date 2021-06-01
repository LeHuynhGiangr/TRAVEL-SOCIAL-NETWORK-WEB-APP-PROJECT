using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.IServices
{
    public interface IPageService<T>
    {
        PageResponse GetById(Guid id);
        PageResponse Create(CreatePageRequest model);
        void ModifyPageInfo(Guid id, CreatePageRequest model);
        IEnumerable<PageResponse> GetPagesByUserId<IdType>(IdType id);
        void UploadAvatar(Guid id, string webRootPath, IFormFile background);
        void UploadBackground(Guid id, string webRootPath, IFormFile background);
        void AddFollow(Guid id);
        void RemoveFollow(Guid id);
        IEnumerable<PageResponse> GetAll();
    }
}
