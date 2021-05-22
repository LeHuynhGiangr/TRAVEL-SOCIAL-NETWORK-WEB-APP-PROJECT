using Data.EF;
using Data.Entities;
using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using Domain.IServices;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Domain.Services
{
    public class RatingService : IRatingService<Guid>
    {
        private readonly EFRepository<ReviewPage, Guid> m_ratingRepository;
        public RatingService(EFRepository<ReviewPage, Guid> ratingRepository)
        {
            m_ratingRepository = ratingRepository;
        }
        public RatingResponse GetRatingById(Guid id)
        {
            var rating = m_ratingRepository.FindSingle(_ => _.Id.Equals(id), _ => _.User, _ => _.Page);
            RatingResponse ratingResponse = new RatingResponse(
                        rating.Id,
                        rating.DateCreated,
                        rating.Content,
                        rating.Rating,
                        rating.Active,
                        rating.User.Id.ToString(),
                        rating.Page.Id.ToString());
            return ratingResponse;
        }
        IEnumerable<RatingResponse> IRatingService<Guid>.GetRatingsByPageId<IdType>(IdType pageId)
        {
            //var l_rating = m_ratingRepository.GetAll(_ => _.User, _ => _.Page);
            var l_rating = m_ratingRepository.FindMultiple(_ => _.Page.Id.Equals(pageId), _ => _.Page, _ => _.User);
            List<RatingResponse> l_ratingResponses = new List<RatingResponse>();
            foreach (ReviewPage rating in l_rating)
            {
                l_ratingResponses.Add(
                    new RatingResponse(
                        rating.Id,
                        rating.DateCreated,
                        rating.Content,
                        rating.Rating,
                        rating.Active,
                        rating.User.Id.ToString(),
                        rating.Page.Id.ToString()));
            }
            return l_ratingResponses;
        }
        public RatingResponse AddRating(RatingRequest model)
        {
           
            try
            {
                Guid newid_rating = Guid.NewGuid();
                //Post l_newPost = new Post(l_newPostGuidId, model.Status, System.Text.Encoding.ASCII.GetBytes(model.Base64Str), System.Guid.Parse(model.UserId));
                ReviewPage l_newrating = new ReviewPage
                {
                    Id = newid_rating,
                    DateCreated = DateTime.Now,
                    Content = model.Content,
                    Rating = model.Rating,
                    Active = model.Active,
                    UserId = model.UserId,
                    PageId = model.PageId
                };

                m_ratingRepository.Add(l_newrating);
                m_ratingRepository.SaveChanges();

                return GetRatingById(newid_rating);
            }
            catch
            {
                throw new Exception("rating failure !");
            }
        }
        public bool BlockRating(Guid id)
        {
            ReviewPage rating = m_ratingRepository.FindById(id);
            rating.Active = !rating.Active;
            m_ratingRepository.SaveChanges();
            if (rating.Active == true)
                return true;
            else
                return false;
        }
    }
}
