using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.RequestModels
{
    public class UserJoinTripRequest
    {
        public Guid TripId { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Requirements { get; set; }
        public int PeopleNumber { get; set; }
        public string CostPayment { get; set; }
        public Guid UserId { get; set; }
        public Guid? DiscountId { get; set; }
    }
}
