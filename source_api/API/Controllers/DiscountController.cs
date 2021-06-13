using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Helpers;
using API.Hub;
using Domain.DomainModels.API.RequestModels;
using Domain.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Controllers
{
    [ApiController]
    [RoleBaseAuthorize(Data.Enums.ERole.User, Data.Enums.ERole.Admin)]
    [Route("discount")]
    public class DiscountController : ControllerBase
    {
        private readonly IDiscountService<Guid> _service;
        private readonly IHubContext<HubClient, IHubClient> _hubContext;
        public DiscountController(IDiscountService<Guid> service, IHubContext<HubClient, IHubClient> hubContext)
        {
            _service = service;
            _hubContext = hubContext;
        }
        [HttpGet("{id:guid}")]
        public IActionResult GetAllDiscountPageId(Guid id)
        {
            try
            {
                var disResponses = _service.GetDiscountByPageId(id);
                return Ok(disResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateDiscountAsync([FromBody] DiscountRequest disRequest)
        {
            try
            {
                var disResponses = _service.CreateDiscount(disRequest);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok(disResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [Route("{id:guid}")]
        [HttpPut]
        public async Task<IActionResult> BlockDiscount(Guid id)
        {
            try
            {
                if (_service.BlockDiscount(id) == true)
                {
                    await _hubContext.Clients.All.BroadcastMessage();
                    return Ok("UnBlock successfully");
                }
                else
                {
                    await _hubContext.Clients.All.BroadcastMessage();
                    return Ok("Block successfully");
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [Route("{id:guid}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteDiscount(Guid id)
        {
            try
            {
                _service.DeleteDiscount(id);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok("Delete successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
    }
}
