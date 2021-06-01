using API.Helpers;
using Data.Entities;
using Domain.DomainModels.API.ResponseModels;
using Domain.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [RoleBaseAuthorize(Data.Enums.ERole.Admin)]
    [Route("admin")]//routing/
    public class AdminController:ControllerBase
    {
        private readonly IUserService<Guid> m_userService;//dependency injection/
        private readonly IPageService<Guid> p_service;
        //Parameter DI/
        public AdminController(IUserService<Guid> userService, IPageService<Guid> p_service_)
        {
            m_userService = userService;
            p_service = p_service_;
        }

        [HttpGet]
        public ActionResult<IEnumerable<UserResponse>> GetAll()
        {
            try
            {
                var l_userResponses = m_userService.GetAll();
                return Ok(l_userResponses);
            }
            catch (Exception e)
            {
                return StatusCode(503);//service unavailable
            }
        }
        [Route("{id:guid}")]
        [HttpDelete]
        public ActionResult<User> DeleteUser(Guid id)
        {
            try
            {
                m_userService.DeleteUser(id);
                return Ok("Delete user successfully");
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Not found !" });
            }
        }

        [Route("block/{id:guid}")]
        [HttpPut]
        public ActionResult<User> BlockUser(Guid id)
        {
            try
            {
                if (m_userService.BlockUser(id) == true)
                    return Ok("UnBlock user successfully");
                else
                    return Ok("Block user successfully");
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Not found !" });
            }
        }
        [HttpGet("page")]
        public IActionResult GetAllPage()
        {
            try
            {
                var pageResponses = p_service.GetAll();
                return Ok(pageResponses);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
    }
}
