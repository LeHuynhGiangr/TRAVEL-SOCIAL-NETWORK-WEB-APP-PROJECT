using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Helpers;
using API.Hub;
using Domain.DomainModels.API.RequestModels;
using Domain.IServices;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Controllers
{
    [ApiController]
    [RoleBaseAuthorize(Data.Enums.ERole.User, Data.Enums.ERole.Admin)]
    [Route("media")]
    public class MediaController : ControllerBase
    {
        private readonly IMediaService<Guid> _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IHubContext<HubClient, IHubClient> _hubContext;

        public MediaController(IMediaService<Guid> service, IWebHostEnvironment webHostEnvironment, IHubContext<HubClient, IHubClient> hubContext)
        {
            _service = service;
            _webHostEnvironment = webHostEnvironment;
            _hubContext = hubContext;
        }
        [HttpGet]
        public IActionResult GetMedia()
        {
            try
            {
                var medias = _service.GetAll();
                return Ok(medias);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        //get posts of user
        [HttpGet("load/{id:guid}")]
        public IActionResult LoadMediaById(Guid id)
        {
            try
            {
                //System.Guid id = System.Guid.Parse(HttpContext.Items["Id"].ToString());
                var mediaResponses = _service.GetMediaByUserId(id);
                return Ok(mediaResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateMediaAsync([FromForm] CreateMediaRequest createMediaRequest)
        {
            try
            {
                System.Guid id = System.Guid.Parse(HttpContext.Items["Id"].ToString());
                createMediaRequest.UserId = id;
                _service.Create(createMediaRequest, _webHostEnvironment.WebRootPath);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok("Create successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
    }
}
