using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.ResponseModels
{
    public class UserJoinTripResponse
    {
        public UserJoinTripResponse() { }
        public UserJoinTripResponse(Guid uid, System.DateTime dateCreated, string name,string phonenumber,string email,string address,
            string requirements,int peoplenumber,string costpayment,Guid tid, Guid? discountId)
        {
            UserId = uid;
            DateCreated = dateCreated;
            Name = name;
            PhoneNumber = phonenumber;
            Email = email;
            Address = address;
            Requirements = requirements;
            PeopleNumber = peoplenumber;
            CostPayment = costpayment;
            TripId = tid;
            DiscountId = discountId;
        }
        public Guid UserId { get; set; }
        public Guid TripId { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Requirements { get; set; }
        public int PeopleNumber { get; set; }
        public string CostPayment { get; set; }
        public Guid? DiscountId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
    }
}
