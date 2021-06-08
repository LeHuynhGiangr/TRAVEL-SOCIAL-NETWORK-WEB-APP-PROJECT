using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Helpers;
using API.Hub;
using Data.Entities;
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
    [Route("page")]
    public class PageController : ControllerBase
    {
        private readonly IPageService<Guid> _service;
        private readonly IRatingService<Guid> _service_;
        private readonly IUserFollow<Guid> f_service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IHubContext<HubClient, IHubClient> _hubContext;
        public PageController(IPageService<Guid> service, IWebHostEnvironment webHostEnvironment,
            IRatingService<Guid> service_, IUserFollow<Guid> _f_service, IHubContext<HubClient, IHubClient> hubContext)
        {
            _service = service;
            _service_ = service_;
            f_service = _f_service;
            _webHostEnvironment = webHostEnvironment;
            _hubContext = hubContext;
        }

        [HttpGet("{id:guid}")]
        public IActionResult LoadPagesId(Guid id)
        {
            try
            {
                var pageResponses = _service.GetById(id);
                return Ok(pageResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        //get posts of user
        [HttpGet("load")]
        public IActionResult LoadPagesByUserId()
        {
            try
            {
                System.Guid id = System.Guid.Parse(HttpContext.Items["Id"].ToString());
                var pageResponses = _service.GetPagesByUserId(id);
                return Ok(pageResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [HttpPost]
        public IActionResult CreatePage([FromForm] CreatePageRequest createPageRequest)
        {
            try
            {
                System.Guid id = System.Guid.Parse(HttpContext.Items["Id"].ToString());
                createPageRequest.UserId = id;
                _service.Create(createPageRequest, _webHostEnvironment.WebRootPath);
                return Ok("Create successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [Route("avatar")]
        [HttpPut]
        public async Task<IActionResult> UploadAvatarAsync([FromForm] Guid id,IFormFile avatar)
        {
            try
            {
                var l_memStream = new System.IO.MemoryStream();
                avatar.CopyTo(l_memStream);
                _service.UploadAvatar(id, _webHostEnvironment.WebRootPath, avatar);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok("Upload avatar success fully");
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [Route("background")]
        [HttpPut]
        public async Task<IActionResult> UploadBackgroundAsync([FromForm] Guid id, IFormFile background)
        {
            try
            {
                var l_memStream = new System.IO.MemoryStream();
                background.CopyTo(l_memStream);
                _service.UploadBackground(id, _webHostEnvironment.WebRootPath, background);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok("Upload background success fully");
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
        [Route("rating/{id:guid}")]
        [HttpGet]
        public IActionResult LoadAllRatings(Guid id)
        {
            try
            {
                var ratingResponses = _service_.GetRatingsByPageId(id);
                return Ok(ratingResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [Route("rating")]
        [HttpPost]
        public async Task<IActionResult> RatingPageAsync([FromBody] RatingRequest ratingRequest)
        {
            try
            {
                System.Guid id = System.Guid.Parse(HttpContext.Items["Id"].ToString());
                ratingRequest.UserId = id;
                _service_.AddRating(ratingRequest);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok("Add successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [Route("rating/block/{id:guid}")]
        [HttpPut]
        public async Task<ActionResult<ReviewPage>> BlockRatingAsync(Guid id)
        {
            try
            {
                if (_service_.BlockRating(id) == true)
                {
                    await _hubContext.Clients.All.BroadcastMessage();
                    return Ok("UnBlock rating successfully");
                }
                else
                    return Ok("Block rating successfully");
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Not found !" });
            }
        }
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> ModifyPageAsync([FromBody] CreatePageRequest createpageRequest, Guid id)
        {
            try
            {
                _service.ModifyPageInfo(id, createpageRequest);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok("Update successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [Route("checkfollow")]
        [HttpPost]
        public bool CheckFollowPage([FromBody] UserFollowPageRequest followpageRequest)
        {
            followpageRequest.UserId = System.Guid.Parse(HttpContext.Items["Id"].ToString());
            if (f_service.GetFollow(followpageRequest) == true)
                return true;
            else
                return false;
        }
        [HttpGet("userfollow/{id:guid}")]
        public IActionResult GetAllUserFollowByPageId(Guid id)
        {
            try
            {
                var userResponse = f_service.GetUserFollowByPageId(id);
                return Ok(userResponse);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [Route("follow")]
        [HttpPost]
        public async Task<IActionResult> FollowPageAsync([FromBody] UserFollowPageRequest followpageRequest)
        {
            try
            {
                followpageRequest.UserId = System.Guid.Parse(HttpContext.Items["Id"].ToString());
                if(f_service.GetFollow(followpageRequest) == false)
                {
                    f_service.Follow(followpageRequest);
                    _service.AddFollow(followpageRequest.PageId);
                    await _hubContext.Clients.All.BroadcastMessage();
                    return Ok("Follow successfully");
                }
                else
                {
                    return Ok("Follow failure");
                }    
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        [Route("unfollow")]
        [HttpDelete]
        public async Task<IActionResult> UnFollowPageAsync([FromBody] UserUnfollowRequest userUnfollowRequest)
        {
            try
            {
                userUnfollowRequest.UserId = System.Guid.Parse(HttpContext.Items["Id"].ToString());
                f_service.UnFollow(userUnfollowRequest);
                _service.RemoveFollow(userUnfollowRequest.PageId);
                await _hubContext.Clients.All.BroadcastMessage();
                return Ok("UnFollow successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
    }
}
