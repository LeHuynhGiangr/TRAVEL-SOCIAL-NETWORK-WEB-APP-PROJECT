using API.Helpers;
using Data.EF;
using Data.Entities;
using Data.Enums;
using Domain.DomainModels.API.RequestModels;
using Domain.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("identity")]//routing/
    public class IdentityController : ControllerBase
    {
        private string m_tokenKeyName = "refreshtoken";
        private IUserService<Guid> m_userService;//dependency injection/
        private readonly ProjectDbContext _context;

        /*-----------------------------------------------------------------------------
         ------------------------------------------------------------------------------*/

        //Parameter DI/
        public IdentityController(IUserService<Guid> userService, ProjectDbContext context)
        {
            m_userService = userService;
            _context = context;
        }

        /*-----------------------------------------------------------------------------
         ------------------------------------------------------------------------------*/

        /*
         * below is public action methods which can be access without authorization
         */
        //[AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
        {
            try
            {

                // Validation OTP
                OTP otp = await _context.OTPs.FirstOrDefaultAsync(otp => otp.MailAddress == registerRequest.UserName && otp.OTPcode.ToString() == registerRequest.OTP);

                if (otp == null)
                {
                    return BadRequest("OTP is not match");
                }

                m_userService.Register(registerRequest, Request.Headers["origin"]);
                return Ok(new { message = "registration successful" });//temporarily, verification token has not been sent to email yet
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        //[AllowAnonymous]//this attribute is applied to does not require authorization/
        [HttpPost("authenticate")]//Http post method
        public IActionResult Authenticate([FromBody] AuthenticateRequest model)//get data from request body, auto binding/
        {
            try
            {
                var l_response = m_userService.Authenticate(model, GetclientIpv4Address());

                //if response is null -> status 400 - Bad request
                if (l_response == null)
                {
                    return BadRequest(new { message = "username or password is incorrect" });
                }

                SetTokenCookie(l_response.RefreshToken);
                Response.Cookies.Append("id", l_response.Id);

                return Ok(l_response);//status 200 OK
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }

        }

        //[AllowAnonymous]
        [HttpPost("refresh-token")]
        public IActionResult RefreshToken()
        {
            try
            {
                //get refreshToken in cookies
                var l_refreshToken = Request.Cookies[m_tokenKeyName];

                //if cannot get token return status 400 - bad request
                if (string.IsNullOrEmpty(l_refreshToken))
                {
                    return BadRequest(new { message = "token is required" });
                }

                var l_response = m_userService.RefreshToken(l_refreshToken, GetclientIpv4Address());

                //if response is null return status 401 unauthorized
                if (l_response == null)
                {
                    return Unauthorized(new { message = "invalid token" });
                }

                SetTokenCookie(l_response.RefreshToken);

                return Ok(l_response);//status 200 OK
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpPost("verify-email")]
        public IActionResult VerifyEmail()
        {
            return StatusCode(503);
        }

        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword()
        {
            return StatusCode(503);
        }

        [HttpPost("validate-reset-token")]
        public IActionResult ValidateResetToken()
        {
            return StatusCode(503);
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword()
        {
            return StatusCode(503);
        }

        /*-----------------------------------------------------------------------------
         ------------------------------------------------------------------------------*/

        private void SetTokenCookie(string token)
        {
            var l_cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),//time of cookie life is seven day
                //...
                SameSite = SameSiteMode.Strict,
            };
            Response.Cookies.Append(m_tokenKeyName, token, l_cookieOptions);
        }

        //Get client IP address
        private string GetclientIpv4Address()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
            {
                return Request.Headers["X-Forwarded-for"];
            }
            else
            {
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            }
        }
    }
}
