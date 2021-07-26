using API.Helpers;
using API.Hub;
using Domain.DomainModels.API.RequestModels;
using Domain.IServices;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [RoleBaseAuthorize(Data.Enums.ERole.User, Data.Enums.ERole.Admin)]
    [Route("messenger")]
    public class MessengerController : ControllerBase
    {
        private readonly IMessageService<Guid> _service;
        private readonly IHubContext<HubClient, IHubClient> _hubContext;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public MessengerController(IMessageService<Guid> service, IWebHostEnvironment webHostEnvironment, IHubContext<HubClient, IHubClient> hubContext)
        {
            _service = service;
            _webHostEnvironment = webHostEnvironment;
            _hubContext = hubContext;
        }
        [HttpGet("{id:guid}")]
        public IActionResult GetAllMesUserId(Guid id)
        {
            try
            {
                Guid iduser = System.Guid.Parse(HttpContext.Items["Id"].ToString());
                var adsResponses = _service.GetMesByUserId(iduser, id);
                return Ok(adsResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateMesAsync([FromForm] MessengerRequest mesRequest)
        {
            try
            {
                mesRequest.FromId = System.Guid.Parse(HttpContext.Items["Id"].ToString());
                var mes = _service.Create(mesRequest, _webHostEnvironment.WebRootPath);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok(mes);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [Route("all/{id:guid}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteMessages(Guid id)
        {
            try
            {
                Guid iduser = System.Guid.Parse(HttpContext.Items["Id"].ToString());
                _service.DeleteMessages(iduser, id);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok("Delete successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [Route("{id:guid}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteMessagesById(Guid id)
        {
            try
            {
                Guid iduser = System.Guid.Parse(HttpContext.Items["Id"].ToString());
                _service.DeleteMessagesById(id);
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
