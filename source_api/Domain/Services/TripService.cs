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
using System.Text.Json;
using Utilities;

namespace Domain.Services
{
    public class TripService : ITripService<Guid>
    {
        private readonly EFRepository<Trip, Guid> m_tripRepository;

        public TripService(EFRepository<Trip, Guid> tripRepository, ProjectDbContext context)
        {
            m_tripRepository = tripRepository;
        }

        public bool Delete(Guid id)
        {
            throw new NotImplementedException();
        }

        public void DeleteByUserId(Guid id)
        {
            var trips = m_tripRepository.FindMultiple(_ => _.User.Id.Equals(id), _ => _.User);
            List<TripResponse> l_postResponses = new List<TripResponse>();
            foreach (Trip trip in trips)
            {
                m_tripRepository.Remove(trip);
            }
            m_tripRepository.SaveChanges();
        }
        public IEnumerable<TripResponse> GetAll()
        {
            var l_trip = m_tripRepository.FindMultiple(_ => _.Active.Equals(true),_ => _.User, _ => _.Page).OrderByDescending(_ => _.Page.Priority);
            List<TripResponse> l_tripResponses = new List<TripResponse>();
            foreach (Trip trip in l_trip)
            {
                l_tripResponses.Add(
                    new TripResponse(
                        trip.Id,
                        trip.DateCreated,
                        trip.Description,
                        trip.User.Id.ToString(),
                        trip.Image,
                        trip.Name,
                        trip.Start,
                        trip.Destination,
                        trip.Service,
                        trip.Policy,
                        trip.InfoContact,
                        trip.Content,
                        trip.Cost,
                        trip.Persons,
                        trip.Active,
                        trip.DateStart,
                        trip.DateEnd,
                        trip.PageId.ToString()));
            }
            return l_tripResponses;
        }
        public TripResponse GetById(Guid id)
        {
            var trip = m_tripRepository.FindSingle(_ => _.Id.Equals(id), _ => _.User);
            TripResponse tripResponse = new TripResponse(
                        trip.Id,
                        trip.DateCreated,
                        trip.Description,
                        trip.User.Id.ToString(),
                        trip.Image,
                        trip.Name,
                        trip.Start,
                        trip.Destination,
                        trip.Service,
                        trip.Policy,
                        trip.InfoContact,
                        trip.Content,
                        trip.Cost,
                        trip.Persons,
                        trip.Active,
                        trip.DateStart,
                        trip.DateEnd,
                        trip.PageId.ToString());
            return tripResponse;
        }

        public TripResponse Create(CreateTripRequest model, string webRootPath)
        {
            try
            {
                Guid l_newTripGuidId = Guid.NewGuid();
                string imageUrl = this.SaveFile(webRootPath, $"media-file/{l_newTripGuidId}/", model.Image);
                string url = imageUrl;
                //Post l_newPost = new Post(l_newPostGuidId, model.Status, System.Text.Encoding.ASCII.GetBytes(model.Base64Str), System.Guid.Parse(model.UserId));
                Trip l_newTrip = new Trip
                {
                    Id = l_newTripGuidId,
                    Name = model.Name,
                    UserId = model.UserId,
                    DateCreated = DateTime.Now,
                    Location = 0,
                    Image = url,
                    Description = model.Description,
                    Start = model.Start,
                    Destination = model.Destination,
                    Content = model.Content,
                    Cost = model.Cost,
                    Persons = model.Persons,
                    Active = true,
                    Policy = model.Policy,
                    InfoContact = model.InfoContact,
                    DateStart = DateTime.Parse(model.DateStart),
                    DateEnd = DateTime.Parse(model.DateEnd),
                    Service = model.Service,
                    PageId = model.PageId
                };

                m_tripRepository.Add(l_newTrip);
                m_tripRepository.SaveChanges();

                return GetById(l_newTripGuidId);
            }
            catch (Exception e)
            {
                throw e;
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
        IEnumerable<TripResponse> ITripService<Guid>.GetAll()
        {
            var l_trips = m_tripRepository.GetAll(_ => _.User);

            List<TripResponse> l_tripResponses = new List<TripResponse>();

            foreach (Trip trip in l_trips)
            {
                l_tripResponses.Add(
                    new TripResponse(
                        trip.Id,
                        trip.DateCreated,
                        trip.Description,
                        trip.User.Id.ToString(),
                        trip.Image,
                        trip.Name,
                        trip.Start,
                        trip.Destination,
                        trip.Service,
                        trip.Policy,
                        trip.InfoContact,
                        trip.Content,
                        trip.Cost,
                        trip.Persons,
                        trip.Active,
                        trip.DateStart,
                        trip.DateEnd,
                        trip.PageId.ToString()));
            }
            return l_tripResponses;
        }

        IEnumerable<TripResponse> ITripService<Guid>.GetTripsByUserId<IdType>(IdType id)
        {
            var l_trips = m_tripRepository.FindMultiple(_ => _.User.Id.Equals(id), _ => _.User);


            List<TripResponse> l_tripResponses = new List<TripResponse>();

            foreach (Trip trip in l_trips)
            {
                l_tripResponses.Add(
                    new TripResponse(
                        trip.Id,
                        trip.DateCreated,
                        trip.Description,
                        trip.User.Id.ToString(),
                        trip.Image,
                        trip.Name,
                        trip.Start,
                        trip.Destination,
                        trip.Service,
                        trip.Policy,
                        trip.InfoContact,
                        trip.Content,
                        trip.Cost,
                        trip.Persons,
                        trip.Active,
                        trip.DateStart,
                        trip.DateEnd,
                        trip.PageId.ToString()));
            }
            return l_tripResponses;
        }
        IEnumerable<TripResponse> ITripService<Guid>.GetTripsByPageId<IdType>(IdType id)
        {
            var l_trips = m_tripRepository.FindMultiple(_ => _.Page.Id.Equals(id), _ => _.Page, _ => _.User);


            List<TripResponse> l_tripResponses = new List<TripResponse>();

            foreach (Trip trip in l_trips)
            {
                l_tripResponses.Add(
                    new TripResponse(
                        trip.Id,
                        trip.DateCreated,
                        trip.Description,
                        trip.User.Id.ToString(),
                        trip.Image,
                        trip.Name,
                        trip.Start,
                        trip.Destination,
                        trip.Service,
                        trip.Policy,
                        trip.InfoContact,
                        trip.Content,
                        trip.Cost,
                        trip.Persons,
                        trip.Active,
                        trip.DateStart,
                        trip.DateEnd,
                        trip.PageId.ToString()));
            }
            return l_tripResponses;
        }
        IEnumerable<TripResponse> ITripService<Guid>.GetTripsByPageIdActive<IdType>(IdType id)
        {
            var l_trips = m_tripRepository.FindMultiple(_ => _.Page.Id.Equals(id) && _.Active == true, _ => _.Page, _ => _.User);


            List<TripResponse> l_tripResponses = new List<TripResponse>();

            foreach (Trip trip in l_trips)
            {
                l_tripResponses.Add(
                    new TripResponse(
                        trip.Id,
                        trip.DateCreated,
                        trip.Description,
                        trip.User.Id.ToString(),
                        trip.Image,
                        trip.Name,
                        trip.Start,
                        trip.Destination,
                        trip.Service,
                        trip.Policy,
                        trip.InfoContact,
                        trip.Content,
                        trip.Cost,
                        trip.Persons,
                        trip.Active,
                        trip.DateStart,
                        trip.DateEnd,
                        trip.PageId.ToString()));
            }
            return l_tripResponses;
        }
        public IEnumerable<TripResponse> FilterTrip(FilterRequest filterRequest)
        {
            var l_trips = m_tripRepository.GetAll(_ => _.Page, _ => _.User).Where(_ => _.Name.ToLower().Contains(filterRequest.Name.ToLower())
            && Convert.ToInt32(_.Cost) >= filterRequest.CostStart && Convert.ToInt32(_.Cost) <= filterRequest.CostEnd && _.Active.Equals(true)).OrderByDescending(_ => _.Page.Priority);

            List<TripResponse> l_tripResponses = new List<TripResponse>();

            foreach (Trip trip in l_trips)
            {
                l_tripResponses.Add(
                    new TripResponse(
                        trip.Id,
                        trip.DateCreated,
                        trip.Description,
                        trip.User.Id.ToString(),
                        trip.Image,
                        trip.Name,
                        trip.Start,
                        trip.Destination,
                        trip.Service,
                        trip.Policy,
                        trip.InfoContact,
                        trip.Content,
                        trip.Cost,
                        trip.Persons,
                        trip.Active,
                        trip.DateStart,
                        trip.DateEnd,
                        trip.PageId.ToString()));
            }
            return l_tripResponses;
        }
        public void ModifyTrip(Guid id, CreateTripRequest model)
        {
            Trip trip = m_tripRepository.FindById(id);
            var m_trip = trip;
            {
                trip.DateCreated = trip.DateCreated;
                trip.Description = model.Description;
                trip.UserId = trip.UserId;
                trip.PageId = trip.PageId;
                trip.Name = model.Name;
                trip.Start = model.Start;
                trip.Destination = model.Destination;
                trip.Service = model.Service;
                trip.Policy = model.Policy;
                trip.Image = trip.Image;
                trip.InfoContact = model.InfoContact;
                trip.Content = model.Content;
                trip.Cost = model.Cost;
                trip.Persons = model.Persons;
                trip.Active = model.Active;
                trip.DateStart = DateTime.Parse(model.DateStart);
                trip.DateEnd = DateTime.Parse(model.DateEnd);
            }
            m_tripRepository.SetModifierTripStatus(m_trip, EntityState.Modified);
            m_tripRepository.SaveChanges();
        }
        public void UpdatePriorityTrip(PriorityPageRequest priorityPage)
        {
            Trip trip = m_tripRepository.FindById(priorityPage.Id);
            trip.Priority = priorityPage.Priority;
            m_tripRepository.SaveChanges();
        }
    }
}
