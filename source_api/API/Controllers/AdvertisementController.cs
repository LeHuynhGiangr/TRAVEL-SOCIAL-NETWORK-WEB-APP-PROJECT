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
    [Route("advertisement")]
    public class AdvertisementController : ControllerBase
    {
        private readonly IAdvertisementService<Guid> _service;
        private readonly IHubContext<HubClient, IHubClient> _hubContext;
        public AdvertisementController(IAdvertisementService<Guid> service, IHubContext<HubClient, IHubClient> hubContext)
        {
            _service = service;
            _hubContext = hubContext;
        }
        [HttpGet("{id:guid}")]
        public IActionResult GetAllAdsPageId(Guid id)
        {
            try
            {
                var adsResponses = _service.GetAdsByPageId(id);
                return Ok(adsResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateAdsAsync([FromBody] AdvertisementRequest adsRequest)
        {
            try
            {
                var adsResponses = _service.CreateAdvertisement(adsRequest);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok(adsResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [Route("{id:guid}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteAdvertisement(Guid id)
        {
            try
            {
                _service.DeleteAdvertisement(id);
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
