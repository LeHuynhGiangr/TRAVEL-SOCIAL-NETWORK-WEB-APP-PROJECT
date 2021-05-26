/*
 * class for user entity
 */
using Data.Enums;
using Data.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Data.Entities
{
    //principal entity/
    public class User : IdentityUser<Guid>, IEntity<Guid>, IDateTracking
    {
        //key/
        //inherit from IdentityUser<Guid>
        //properties
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Password { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public float Location { get; set; }
        public string Works { get; set; }
        public bool Active { get; set; }
        public string Avatar { get; set; }
        public string Background { get; set; }
        public bool FollowMe { get; set; }
        public bool RequestFriend { get; set; }
        public bool ViewListFriend { get; set; }
        public bool ViewTimeLine { get; set; }
        public string AcademicLevel { get; set; }
        public string StudyingAt { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string AddressAcademic { get; set; }
        public string DescriptionAcademic { get; set; }
        public DateTime? BirthDay { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }

        public DateTime? DateVerified { get; set; }

        public string VerificationShortToken { get; set; }
        public string ResetToken { get; set; }
        public DateTime? DateResetTokenExpired { get; set; }

        //json string, storing list of friends
        //public string FriendsJsonString { get; set; }
        public string Hobby { get; set; }
        public string Language { get; set; }

        //Reference navigation
        //public Role Role { get; set; }
        public ERole Role { get; set; }

        //collection navigation
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
        public IList<UserJoinTrip> UserJoinTrips { get; set; }
        public IList<Trip> Trips { get; set; }
        public IList<ReviewPage> ReviewPages { get; set; }
        public virtual ICollection<Post> Posts { get; set; }
        public Friend Friend { get; set; }

        public virtual ICollection<UserChatBox> UserChatBoxes { get; set; }
        public IList<UserFollowPage> UserFollowPages { get; set; }

        //public virtual ICollection<Friend> Friends { get; set; }

        //method
        public bool IsRefreshTokenOwned(string token)
        {
            /*
             * The Find method on DbSet uses the primary key value to attempt to find an entity tracked by the context. 
             * If the entity is not found in the context then a query will be sent to the database to find the entity there. 
             * Null is returned if the entity is not found in the context or in the database. 
             */
            return this.RefreshTokens?.Single(_ => _.Token == token) != null;
        }
        //public virtual ICollection<Friend> Friends { get; } = new List<Friend>();
    }
}
