using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DomainModels.API.ResponseModels
{
    public class DiscountResponse
    {
        public DiscountResponse() { }
        public DiscountResponse(Guid id, System.DateTime dateCreated, string name, string codeDiscount,int discountPer,
            bool active, string pageId)
        {
            Id = id;
            DateCreated = dateCreated;
            Name = name;
            CodeDiscount = codeDiscount;
            DiscountPer = discountPer;
            Active = active;
            PageId = pageId;
        }
        public Guid Id { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public string Name { get; set; }
        public string CodeDiscount { get; set; }
        public int DiscountPer { get; set; }
        public bool Active { get; set; }
        public string PageId { get; set; }
    }
}
