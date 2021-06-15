using Data.Interfaces;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Entities
{
    public class UserJoinTrip : IEntity<Guid>,IDateTracking
    {
        [ForeignKey("UserId"), Column(Order = 0)]
        public Guid Id { get; set; }
        public User User { get; set; }
        [ForeignKey("TripId"), Column(Order = 1)]
        public Guid TripId { get; set; }
        public Trip Trip { get; set; }

        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Requirements { get; set; }
        public int PeopleNumber { get; set; }
        public string CostPayment { get; set; }
        public int Status { get; set; }
        public string CodeID { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public Guid? DiscountId { get; set; }
        public virtual Discount Discount { get; set; }

    }
}
