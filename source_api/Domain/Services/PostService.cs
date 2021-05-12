using Data.EF;
using Data.Entities;
using Data.Interfaces;
using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using Domain.IServices;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text.Json;
using Utilities;

namespace Domain.Services
{
    public class PostService : IPostService<Guid>
    {
        private readonly EFRepository<Post, Guid> m_postRepository;
        private readonly IRepository<Friend, Guid> m_friendRepository;
        private readonly EFRepository<User, Guid> m_userRepository;

        public PostService(EFRepository<Post, Guid> postRepository, IRepository<Friend, Guid> friendRepository, EFRepository<User, Guid> userRepository)
        {
            m_postRepository = postRepository;
            m_friendRepository = friendRepository;
            m_userRepository = userRepository;
        }

        public PostResponse Create(CreatePostRequest model)
        {
            try
            {
                Guid l_newPostGuidId = Guid.NewGuid();
                //string imageUrl = this.SaveFile(webRootPath, $"media-file/{l_newPostGuidId}/", model.Image);
                string url = Utilities.BytesToFileConverter.BytesToImageFile(
                    bytes:System.Convert.FromBase64String(model.Base64Str), 
                    fileName: Guid.NewGuid().ToString(), 
                    rootDir: SystemConstants.WWWROOT_DIRECTORY,
                    subDir: SystemConstants.FAKE_POST_MEDIA_DIRECTORY + SystemConstants.DIRECTORY_SEPARATOR_CHAR + model.UserId
                );
                //Post l_newPost = new Post(l_newPostGuidId, model.Status, System.Text.Encoding.ASCII.GetBytes(model.Base64Str), System.Guid.Parse(model.UserId));
                Post l_newPost = new Post(id:l_newPostGuidId, content:model.Status, imageData:url, userId:System.Guid.Parse(model.UserId));
                m_postRepository.Add(l_newPost);
                m_postRepository.SaveChanges();
                return GetById(l_newPostGuidId);
            }
            catch
            {
                throw new Exception("create post failed");
            }
        }

        public bool Delete(Guid id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<PostResponse> GetAll()
        {
            var l_posts = m_postRepository.GetAll(_ => _.User);
            List<PostResponse> l_postResponses = new List<PostResponse>();
            foreach (Post post in l_posts)
            {
                l_postResponses.Add(
                    new PostResponse(
                        post.Id.ToString(),
                        post.DateCreated,
                        post.Content,
                        post.ImageUri,
                        JsonSerializer.Deserialize<object>(post.LikeObjectsJson ?? "[]"),
                        JsonSerializer.Deserialize<object>(post.CommentObjectsJson ?? "[]"),
                        post.User.FirstName + " " + post.User.LastName,
                        post.User.Avatar,
                        post.User.Id.ToString()));
            }
            return l_postResponses;
        }

        public PostResponse GetById(Guid id)
        {
            var l_post = m_postRepository.FindSingle(_ => _.Id.Equals(id), _ => _.User);
            PostResponse l_postResponse = new PostResponse(
                l_post.Id.ToString(),
                l_post.DateCreated,
                l_post.Content,
                l_post.ImageUri,
                JsonSerializer.Deserialize<object>(l_post.LikeObjectsJson ?? "[]"),
                JsonSerializer.Deserialize<object>(l_post.CommentObjectsJson ?? "[]"),
                l_post.User.FirstName + " " + l_post.User.LastName,
                l_post.User.Avatar,
                l_post.User.Id.ToString()
                );
            return l_postResponse;
        }

        public IEnumerable<PostResponse> GetPostsByUserId<Guid>(Guid id)
        {
            var l_posts = m_postRepository.FindMultiple(_ => _.User.Id.Equals(id), _ => _.User);
            List<PostResponse> l_postResponses = new List<PostResponse>();
            foreach (Post post in l_posts)
            {
                l_postResponses.Add(
                    new PostResponse(
                        post.Id.ToString(),
                        post.DateCreated,
                        post.Content,
                        post.ImageUri,
                        JsonSerializer.Deserialize<object>(post.LikeObjectsJson ?? "[]"),
                        JsonSerializer.Deserialize<object>(post.CommentObjectsJson ?? "[]"),
                        post.User.FirstName + " " + post.User.LastName,
                        post.User.Avatar,
                        post.User.Id.ToString()));
            }
            return l_postResponses;
        }
        public void DeletePostByUserId(Guid id)
        {

            var l_posts = m_postRepository.FindMultiple(_ => _.User.Id.Equals(id), _ => _.User);
            if(l_posts!=null)
            {
                List<PostResponse> l_postResponses = new List<PostResponse>();
                foreach (Post post in l_posts)
                {
                    m_postRepository.Remove(post);
                }
                m_postRepository.SaveChanges();
            }    
        }



        public IEnumerable<PostResponse> GetPostsByUserId<IdType>(IdType id, int maximumNumberOfEntries = 4, object ignoredObjLst = null)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<PostResponse> GetOwnedPostsByUserId<IdType>(IdType id, int maximumNumberOfEntries = 4, object ignoredObjLst = null)
        {
            throw new NotImplementedException();
        }

        [DataContract]
        public class FriendObjDataContract
        {
            [DataMember]
            public string Id { get; set; }
            [DataMember]
            public string Name { get; set; }
            [DataMember]
            public string avarThumb { get; set; }
        };
        public IEnumerable<PostResponse> GetRestrictedPostsByUserId<Guid>(Guid id)
        {
            //get list of ids of friend
            Friend l_friend = m_friendRepository.FindById(System.Guid.Parse(id.ToString()));//????????????????????????????????????????????????????????????????????l_friendObjs
            var l_serializer = new DataContractJsonSerializer(typeof(FriendObjDataContract[]));
            var l_memoryStream = new MemoryStream(System.Text.ASCIIEncoding.ASCII.GetBytes(l_friend.FriendsJsonString ?? "[]"));
            var l_friendObjDC = l_serializer.ReadObject(l_memoryStream) as FriendObjDataContract[];

            List<PostResponse> postResponses = new List<PostResponse>();
            foreach (FriendObjDataContract o in l_friendObjDC)
            {
                postResponses.AddRange(this.GetPostsByUserId(System.Guid.Parse(o.Id)));
            }
            postResponses.AddRange(this.GetPostsByUserId(id));

            return postResponses;
        }

        [DataContract]
        public class CommentObjDataContract
        {
            [DataMember]
            public string Id { get; set; }
            [DataMember]
            public string Name { get; set; }
            [DataMember]
            public string avarThumb { get; set; }
            [DataMember]
            public string Comment { get; set; }

        }
        public CommentPostResponse CommentPost(Guid userCmtId, CommentPostRequest commentPostRequest)
        {
            //edit comment-post
            var l_post = m_postRepository.FindById(System.Guid.Parse(commentPostRequest.PostId));
            var l_commentUser = m_userRepository.FindById(userCmtId);

            var l_serializer = new DataContractJsonSerializer(typeof(CommentObjDataContract[]));
            var l_memoryStream = new MemoryStream(System.Text.ASCIIEncoding.ASCII.GetBytes(l_post.CommentObjectsJson ?? "[]"));
            List<CommentObjDataContract> l_commentObjDCs = (l_serializer.ReadObject(l_memoryStream) as CommentObjDataContract[]).ToList();

            var l_commentObjDC = new CommentObjDataContract
            {
                Id = l_commentUser.Id.ToString(),
                Name = l_commentUser.FirstName + " " + l_commentUser.LastName,
                avarThumb = l_commentUser.Avatar,
                Comment = commentPostRequest.Comment
            };

            l_commentObjDCs.Add(l_commentObjDC);

            l_post.CommentObjectsJson = JsonSerializer.Serialize(l_commentObjDCs);
            m_postRepository.SaveChanges();

            return new CommentPostResponse { 
                PostId=commentPostRequest.PostId,
                UserId= l_commentObjDC.Id,
                Name= l_commentObjDC.Name,
                AvarUrl= l_commentObjDC.avarThumb,
                Comment= l_commentObjDC.Comment
            };
        }
    }
}
