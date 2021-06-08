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
    [Route("notification")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService<Guid> _service;
        private readonly IHubContext<HubClient, IHubClient> _hubContext;
        public NotificationController(INotificationService<Guid> service, IHubContext<HubClient, IHubClient> hubContext)
        {
            _service = service;
            _hubContext = hubContext;
        }
        [HttpGet("notipage/{id:guid}")]
        public IActionResult GetAllNotificationByUserId(Guid id)
        {
            try
            {
                var notiResponses = _service.GetNotificationByUserId(id);
                return Ok(notiResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [HttpGet("newnotipage/{id:guid}")]
        public IActionResult GetNewNotiUserId(Guid id)
        {
            try
            {
                var notiResponses = _service.GetNewNotification(id);
                return Ok(notiResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [HttpPost("notipage")]
        public async Task<IActionResult> CreateNotificationAsync([FromBody] NotificationRequest notiRequest)
        {
            try
            {
                var notiResponses = _service.CreateNotification(notiRequest);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok(notiResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
    }
}
