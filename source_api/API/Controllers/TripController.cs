using System;
using System.Collections.Generic;
using System.IO;
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
    [Route("trip")]
    public class TripController : ControllerBase
    {
        private readonly ITripService<Guid> _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IHubContext<HubClient, IHubClient> _hubContext;
        public TripController(ITripService<Guid> service, IWebHostEnvironment webHostEnvironment, IHubContext<HubClient, IHubClient> hubContext)
        {
            _service = service;
            _webHostEnvironment = webHostEnvironment;
            _hubContext = hubContext;
        }
        [HttpGet]
        public IActionResult LoadAllTrip()
        {
            try
            {
                var tripResponses = _service.GetAll();
                return Ok(tripResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [HttpGet("{id:guid}")]
        public IActionResult LoadTripById(Guid id)
        {
            try
            {
                var tripResponses = _service.GetById(id);
                return Ok(tripResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        //get trip by user id
        [HttpGet("load")]
        public IActionResult LoadTripsByUserId()
        {
            try
            {
                System.Guid id = System.Guid.Parse(HttpContext.Items["Id"].ToString());
                var tripResponses  = _service.GetTripsByUserId(id);
                return Ok(tripResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        //get trip by page id
        [HttpGet("load/{id:guid}")]
        public IActionResult LoadTripsByPageId(Guid id)
        {
            try
            {
                var tripResponses = _service.GetTripsByPageId(id);
                return Ok(tripResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        //get trip by page id
        [HttpGet("loadactive/{id:guid}")]
        public IActionResult LoadTripsByPageIdActive(Guid id)
        {
            try
            {
                var tripResponses = _service.GetTripsByPageIdActive(id);
                return Ok(tripResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateTripAsync([FromForm] CreateTripRequest createTripRequest)
        {
            try
            {
                System.Guid id = System.Guid.Parse(HttpContext.Items["Id"].ToString());
                createTripRequest.UserId = id;
                _service.Create(createTripRequest, _webHostEnvironment.WebRootPath);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok("Create successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> ModifyTripAsync([FromBody] CreateTripRequest createTripRequest, Guid id)
        {
            try
            {
                _service.ModifyTrip(id,createTripRequest);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok("Update successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        //filter trip
        [HttpPost("filter")]
        public IActionResult FilterTrip([FromBody] FilterRequest filterRequest)
        {
            try
            {
                var tripResponses = _service.FilterTrip(filterRequest);
                return Ok(tripResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
    }
}
