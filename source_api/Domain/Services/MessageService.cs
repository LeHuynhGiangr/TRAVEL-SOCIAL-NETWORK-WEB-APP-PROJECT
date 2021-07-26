using Data.EF;
using Data.Entities;
using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using Domain.IServices;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Utilities;

namespace Domain.Services
{
    public class MessageService : IMessageService<Guid>
    {
        private readonly EFRepository<Messenger, Guid> m_mesRepository;
        private readonly ProjectDbContext _context;

        public MessageService(EFRepository<Messenger, Guid> mesRepository, ProjectDbContext context)
        {
            m_mesRepository = mesRepository;
            _context = context;
        }
        IEnumerable<MessengerResponse> IMessageService<Guid>.GetMesByUserId<IdType>(IdType iduser, IdType idclient)
        {
            var l_mes = m_mesRepository.FindMultiple(_ => (_.FromId.Equals(iduser) && _.ToId.Equals(idclient))||(_.FromId.Equals(idclient) && _.ToId.Equals(iduser)), _ => _.UserFrom, _ => _.UserTo).OrderBy(_ => _.DateCreated);

            List<MessengerResponse> l_mesResponses = new List<MessengerResponse>();

            foreach (Messenger mes in l_mes)
            {
                l_mesResponses.Add(
                    new MessengerResponse(
                        mes.Id,
                        mes.DateCreated,
                        mes.FromId,
                        mes.ToId,
                        mes.Subject,
                        mes.Content,
                        mes.Attachment
                        ));
            }
            return l_mesResponses;
        }
        public string Create(MessengerRequest model, string webRootPath)
        {
            try
            {
                Guid l_newId = Guid.NewGuid();
                string imageUrl;
                if (model.Attachment != null)
                {
                    imageUrl = this.SaveFile(webRootPath, $"media-file/{l_newId}/", model.Attachment);
                }
                else
                    imageUrl = null;
                string url = imageUrl;
                //Post l_newPost = new Post(l_newPostGuidId, model.Status, System.Text.Encoding.ASCII.GetBytes(model.Base64Str), System.Guid.Parse(model.UserId));
                Messenger l_mes = new Messenger
                {
                    Id = l_newId,
                    FromId = model.FromId,
                    ToId = model.ToId,
                    Subject = model.Subject,
                    Content = model.Content,
                    Attachment = url,
                    DateCreated = DateTime.Now
                };
                m_mesRepository.Add(l_mes);
                m_mesRepository.SaveChanges();
                return "create successfully !";
            }
            catch
            {
                throw new Exception("create media failed");
            }
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
    }
}
