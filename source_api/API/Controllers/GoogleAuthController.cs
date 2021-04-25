using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using Domain.IServices;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    [AllowAnonymous, Route("account")]
    public class GoogleAuthController : ControllerBase
    {

        private IUserService<Guid> m_userService;

        public GoogleAuthController(IUserService<Guid> userService)
        {
            m_userService = userService;
        }

        [Route("google-login")]
        public IActionResult GoogleLogin()
        {
            var properties = new AuthenticationProperties { RedirectUri = Url.Action("GoogleResponse") };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [Route("google-response")]
        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (result == null)
            {
                return Redirect("google-login");
            }

            var claims = result.Principal.Identities
                    .FirstOrDefault().Claims.Select(claim => new
                    {
                        claim.Issuer,
                        claim.OriginalIssuer,
                        claim.Type,
                        claim.Value
                    });

            string fname = "";
            string lname = "";
            string email = "";
            var jwt = "";
            if (claims.Count() > 3)
            {
                fname = claims.ToList()[2].Value.ToString();
                lname = claims.ToList()[3].Value.ToString();
                email = claims.ToList()[4].Value.ToString();
            }

            UserResponse userResponse = m_userService.GetByUserName(email);


            if (userResponse != null)
            {
                jwt = m_userService.AuthenticateG(email, GetclientIpv4Address());
            }
            else
            {
                // Register

                RegisterRequest registerModel = new RegisterRequest()
                {
                    UserName = email,
                    FirstName = fname,
                    LastName = lname,
                    Gender = "Male",
                    Active = true,
                    Password = email,
                    ConfirmPassword = email,
                    AcceptTerms = true
                };


                m_userService.Register(registerModel, Request.Headers["origin"]);

                userResponse = m_userService.GetByUserName(email);
            }    
            return Redirect(@"http://localhost:4200?token=" + jwt + "&id=" + userResponse.Id);
        }
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