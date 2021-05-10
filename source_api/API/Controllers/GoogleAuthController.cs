using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Data.EF;
using Data.Entities;
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
        private readonly EFRepository<User, Guid> m_userRepository;
        public GoogleAuthController(IUserService<Guid> userService, EFRepository<User, Guid> userRepository)
        {
            m_userService = userService;
            m_userRepository = userRepository;
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
                var l_user = new User
                {
                    UserName = email,
                    FirstName = fname,
                    LastName = lname,
                    Gender = "Male",
                    Active = true,
                    PasswordHash = null,
                    Password = null,
                    TwoFactorEnabled = true,
                    PhoneNumberConfirmed = true,
                    EmailConfirmed = true,
                    LockoutEnabled = false,
                    AccessFailedCount = 0,
                    DateVerified = null,
                    Friend = new Friend
                    {
                        Id = Guid.Empty,
                        FriendsJsonString = null,
                        DateCreated = DateTime.Now
                    },
                };
                l_user.Role = Data.Enums.ERole.User;
                m_userRepository.Add(l_user);
                m_userRepository.SaveChanges();

                userResponse = m_userService.GetByUserName(email);

                jwt = m_userService.AuthenticateG(email, GetclientIpv4Address());
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