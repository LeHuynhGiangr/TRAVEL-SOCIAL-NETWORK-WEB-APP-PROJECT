using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using API.Helpers;
using Domain.DomainModels.API.RequestModels;
using Domain.IServices;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [RoleBaseAuthorize(Data.Enums.ERole.User, Data.Enums.ERole.Admin)]
    [Route("trip")]
    public class TripController : ControllerBase
    {
        private readonly ITripService<Guid> _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public TripController(ITripService<Guid> service, IWebHostEnvironment webHostEnvironment)
        {
            _service = service;
            _webHostEnvironment = webHostEnvironment;
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
        [HttpPost]
        public IActionResult CreateTrip([FromForm] CreateTripRequest createTripRequest)
        {
            try
            {
                System.Guid id = System.Guid.Parse(HttpContext.Items["Id"].ToString());
                createTripRequest.UserId = id;
                _service.Create(createTripRequest, _webHostEnvironment.WebRootPath);
                return Ok("Create successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        //get trip by page id
        [HttpGet("filter")]
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
