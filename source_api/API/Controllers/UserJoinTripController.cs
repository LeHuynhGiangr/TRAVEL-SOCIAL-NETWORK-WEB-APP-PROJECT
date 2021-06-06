using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Helpers;
using API.Hub;
using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using Domain.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Controllers
{
    [ApiController]
    [RoleBaseAuthorize(Data.Enums.ERole.User, Data.Enums.ERole.Admin)]
    [Route("invitefriend")]
    public class UserJoinTripController : ControllerBase
    {
        private readonly IUserJoinTripService<Guid> _service;
        private readonly IHubContext<HubClient, IHubClient> _hubContext;
        public UserJoinTripController(IUserJoinTripService<Guid> service, IHubContext<HubClient, IHubClient> hubContext)
        {
            _service = service;
            _hubContext = hubContext;
        }
        [HttpGet("history")]
        public ActionResult<IEnumerable<UserJoinTripResponse>> GetHistoryByUserId()
        {
            try
            {
                string userId = HttpContext.Request.Query["userId"];
                var l_userResponse = _service.GetHistoryByUserId(userId);
                return Ok(l_userResponse);
            }
            catch (Exception e)
            {
                return StatusCode(503);//service unavailable
            }
        }
        //get posts of user
        [HttpGet("load")]
        public ActionResult<IEnumerable<UserJoinTripResponse>> GetFriendByTripId()
        {
            try
            {
                string tripid = HttpContext.Request.Query["tripId"];
                var l_userResponse = _service.GetFriendsByTripId(tripid);
                return Ok(l_userResponse);
            }
            catch (Exception e)
            {
                return StatusCode(503);//service unavailable
            }
        }
        [HttpPost]
        public async Task<IActionResult> InviteAsync([FromForm] UserJoinTripRequest userjoinTripRequest)
        {
            try
            {
                _service.InviteUser(userjoinTripRequest);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok("Invite successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
    }
}
