using API.Helpers;
using Domain.DomainModels.API.RequestModels;
using Domain.IServices;
using Microsoft.AspNetCore.Mvc;
using System;

namespace API.Controllers
{
    [ApiController]
    [RoleBaseAuthorize(Data.Enums.ERole.User, Data.Enums.ERole.Admin)]
    [Route("chat")]
    public class ChatController : ControllerBase
    {
        private readonly IChatService<Guid> m_chatService;

        public ChatController(IChatService<Guid> chatService)
        {
            m_chatService = chatService;
        }

        [Route("single/{id:guid}/{other:guid}")]
        [HttpGet]
        public IActionResult LoadChatBoxById(Guid id, Guid other)
        {
            try
            {
                var l_chatBoxResponses = m_chatService.GetChatBox(id, other);
                return Ok(l_chatBoxResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [Route("single/{id:guid}")]
        [HttpGet]
        public IActionResult LoadChatBoxById(Guid id)
        {
            try
            {
                var l_chatBoxResponses = m_chatService.GetChatBox(id);
                return Ok(l_chatBoxResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [Route("multi/{id:guid}")]
        [HttpGet]
        public IActionResult LoadChatBoxesById(Guid id)
        {
            try
            {
                var l_chatBoxesResponses = m_chatService.GetAllChatBoxesByUserId(id);
                return Ok(l_chatBoxesResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [Route("sync/{id:guid}/{other:guid}")]
        [HttpGet]
        public IActionResult SyncChatBoxContent(Guid id, Guid other)
        {
            try
            {
                var l_response = m_chatService.LoadCachedChatBoxContent(id, other);
                return Ok(l_response);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [Route("update")]
        [HttpPost]
        public IActionResult UpdateChatBoxContent([FromBody] UpdateChatBoxContentRequest request)
        {
            try
            {
                var l_response = m_chatService.UpdateChatBoxContent(request);
                return Ok(l_response);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
    }
}
