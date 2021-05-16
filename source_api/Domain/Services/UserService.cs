using System;
using Microsoft.IdentityModel.Tokens;//SecurityTokenDescriptor class
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Security.Claims;
using System.Collections.Generic;
using System.Text;

using Data.EF;
using Domain.IServices;
using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using Data.Entities;
using Microsoft.EntityFrameworkCore.Internal;
using System.Linq;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Domain.Services.InternalServices;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Utilities;
using Data.Interfaces;
using MediationLib;

namespace Domain.Services
{
    public class UserService : IUserService<Guid>
    {
        private readonly int m_refreshTokenDayTimeLive = 7;

        private readonly EFRepository<User, Guid> m_userRepository;
        //private readonly AppSettings m_appSettings;
        //private readonly IEmailService

        //cross-service
        private readonly IFriendService<Guid> m_friendService;

        public UserService(EFRepository<User, Guid> userRepository, IFriendService<Guid> friendService)
        {
            m_userRepository = userRepository;

            //
            m_friendService = friendService;
        }
        public AuthenticateResponse Authenticate(AuthenticateRequest authenticateRequest, string ipAddress)
        {
            //var l_user = m_userRepository.FindSingle(_ => _.UserName == authenticateRequest.Username && _.Password == authenticateRequest.Password);
            var l_user = m_userRepository.FindSingle(_ => _.UserName == authenticateRequest.Username && _.PasswordHash == System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(authenticateRequest.Password)).ToString());

            //User not found
            if (l_user == null)
            {
                throw new Exception("username or password is incorrect");
            }

            //User have be found so generate jwt and refresh tokens
            var l_jwtToken = this.GenerateJwtToken(l_user);
            var l_refreshToken = this.GenerateRefreshToken(ipAddress);

            //save refresh token
            if (l_user.RefreshTokens == null) l_user.RefreshTokens = new List<RefreshToken>();
            l_user.RefreshTokens.Add(l_refreshToken);

            //remove old refresh token from user
            RemoveOldRefreshTokens(l_user);

            //here is saving to db
            m_userRepository.Update(l_user);
            m_userRepository.SaveChanges();

            //Mediator.Notify(m_friendService.GetAllKeyById(l_user.Id), l_user.Id.ToString());
            return new AuthenticateResponse(l_user.Id.ToString(), l_user.FirstName, l_user.LastName, l_user.Active, l_jwtToken, l_refreshToken.Token);
        }
        public string AuthenticateG(string email, string ipAddress)
        {
            //var l_user = m_userRepository.FindSingle(_ => _.UserName == authenticateRequest.Username && _.Password == authenticateRequest.Password);
            var l_user = m_userRepository.FindSingle(_ => _.UserName == email);

            //User have be found so generate jwt and refresh tokens
            var l_jwtToken = this.GenerateJwtToken(l_user);
            var l_refreshToken = this.GenerateRefreshToken(ipAddress);

            //save refresh token
            if (l_user.RefreshTokens == null) l_user.RefreshTokens = new List<RefreshToken>();
            l_user.RefreshTokens.Add(l_refreshToken);

            //remove old refresh token from user
            RemoveOldRefreshTokens(l_user);

            //here is saving to db
            m_userRepository.Update(l_user);
            m_userRepository.SaveChanges();

            return l_jwtToken;
        }

        public AuthenticateResponse RefreshToken(string token, string ipAddress)
        {
            var l_user = m_userRepository.FindSingle(u => u.RefreshTokens.Any(rt => rt.Token == token), _ => _.RefreshTokens);

            //return null if no user found with token
            if (l_user == null)
            {
                throw new Exception("invalid token");
            };

            var l_refreshToken = l_user.RefreshTokens.Single(rt => rt.Token == token);


            //return null if token is no longer active
            if (!l_refreshToken.IsActive)
            {
                throw new Exception("invalid token");
            };

            // replace old refresh token with a new one and save
            var l_newRefreshToken = this.GenerateRefreshToken(ipAddress);//generate new RefreshToken instance
            l_refreshToken.Revoked = DateTime.UtcNow;
            l_refreshToken.RevokedByIp = ipAddress;
            l_refreshToken.ReplacedByToken = l_newRefreshToken.Token;
            l_user.RefreshTokens.Add(l_newRefreshToken);

            //remove old refresh token from user
            RemoveOldRefreshTokens(l_user);

            m_userRepository.Update(l_user);
            m_userRepository.SaveChanges();

            // generate new jwt
            var l_jwtToken = GenerateJwtToken(l_user);

            return new AuthenticateResponse(l_user.Id.ToString(), l_user.FirstName, l_user.LastName, l_user.Active, l_jwtToken, l_newRefreshToken.Token);
        }

        //get new JWT and new refresh token
        public bool RevokeToken(string token, string ipAddress)
        {
            var l_user = m_userRepository.FindSingle(u => u.RefreshTokens.Any(rt => rt.Token == token));

            //return null if no user found with token
            if (l_user == null)
            {
                throw new Exception("invalid token");
            };

            var l_refreshToken = l_user.RefreshTokens.Single(rt => rt.Token == token);

            //return null if token is no longer active
            if (!l_refreshToken.IsActive)
            {
                throw new Exception("invalid token");
            };

            //revoke token and save
            l_refreshToken.Revoked = DateTime.UtcNow;
            l_refreshToken.RevokedByIp = ipAddress;
            m_userRepository.Update(l_user);
            m_userRepository.SaveChanges();

            return true;//revoke successfully
        }

        public void Register(RegisterRequest model, string origin)
        {
            //Check valid model
            if (model.Password != model.ConfirmPassword)
            {
                throw new Exception("Password and Confirm Password must be matched");
            }
            if (model.AcceptTerms == false)
            {
                throw new Exception("Terms must be accepted");
            }
            //check username or has not been used
            if (m_userRepository.FindSingle(_ => _.UserName == model.UserName) != null)
            {
                throw new Exception("Username are already registered");
            }

            var l_sixDigitToken = RandomSixDigitToken();

            var l_user = new User
            {
                UserName = model.UserName,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Gender = model.Gender,
                Active = true,
                PasswordHash = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(model.Password)).ToString(),////temporarily, using encode instead of really hash
                Password = model.Password,
                //TwoFactorEnabled = false,
                TwoFactorEnabled = true,
                PhoneNumberConfirmed = true,
                EmailConfirmed = true,
                LockoutEnabled = false,
                AccessFailedCount = 0,

                /*
                 * temp code, make easy to register, but registering need a verification token
                 */
                //DateVerified = DateTime.UtcNow,
                DateVerified = null,
                //VerificationShortToken = null,
                VerificationShortToken = l_sixDigitToken,
                Friend = new Friend
                {
                    Id = Guid.Empty,
                    //list friend in json format
                    FriendsJsonString = null,
                    DateCreated = DateTime.Now
                },
                /*
                 * 
                 */
            };

            l_user.Role = Data.Enums.ERole.User;
            //l_user.VerificationShortToken = RandomSixDigitToken();

            m_userRepository.Add(l_user);
            m_userRepository.SaveChanges();

            //send varification token to email
            //SendVerificationEmail(l_user, origin);
            EmailService.SendAsync(l_user.UserName, "Token for confirm of register", l_sixDigitToken);
        }

        public void VerifyEmail(string token)
        {
            throw new NotImplementedException();
        }

        public void ForgotPassword(ForgotPasswordRequest model, string origin)
        {
            throw new NotImplementedException();
        }

        public void ValidateResetToken(ValidateResetTokenRequest model)
        {
            throw new NotImplementedException();
        }

        public void ResetPassword(ResetPasswordRequest model)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<UserResponse> GetAll()
        {
            var l_users = m_userRepository.GetAll(_ => _.Friend);
            List<UserResponse> l_userResponses = new List<UserResponse>();
            foreach (User user in l_users)
            {
                l_userResponses.Add(new UserResponse
                {
                    Id = user.Id,
                    Created = user.DateCreated,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Gender = user.Gender,
                    IsVerified = user.DateVerified != null || user.VerificationShortToken == null,
                    PhoneNumber = user.PhoneNumber,
                    Role = user.Role,
                    Updated = user.DateModified,
                    Active = user.Active,
                    FriendsJson = JsonSerializer.Deserialize<object>(user.Friend?.FriendsJsonString ?? "[]"),
                });
            }
            return l_userResponses;
        }
        public IEnumerable<UserResponse> GetAllByName(string Name)
        {
            var l_users = m_userRepository.GetAll();
            var userList = l_users.Where(_ => _.FirstName.ToLower().Contains(Name.ToLower()));
            List<UserResponse> l_userResponses = new List<UserResponse>();
            foreach (User user in userList)
            {
                l_userResponses.Add(new UserResponse
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Avatar = user.Avatar,
                    Description = user.Description,
                    UserName = user.UserName
                });
            }
            return l_userResponses;
        }
        public UserResponse GetById(Guid id)
        {
            try
            {
                User l_user = m_userRepository.FindById(id);
                if (l_user == null)
                {
                    throw new Exception("can not find user");
                }
                return new UserResponse
                {
                    UserName = l_user.UserName,
                    FirstName = l_user.FirstName,
                    LastName = l_user.LastName,
                    PhoneNumber = l_user.PhoneNumber,
                    Address = l_user.Address,
                    Email = l_user.Email,
                    Gender = l_user.Gender,
                    Description = l_user.Description,
                    Background = l_user.Background,
                    Avatar = l_user.Avatar,
                    FollowMe = l_user.FollowMe,
                    Location = l_user.Location,
                    BirthDay = l_user.BirthDay,
                    RequestFriend = l_user.RequestFriend,
                    ViewListFriend = l_user.ViewListFriend,
                    ViewTimeLine = l_user.ViewTimeLine,
                    Works = l_user.Works,
                    AcademicLevel = l_user.AcademicLevel,
                    AddressAcademic = l_user.AddressAcademic,
                    DescriptionAcademic = l_user.DescriptionAcademic,
                    StudyingAt = l_user.StudyingAt,
                    FromDate = l_user.FromDate,
                    ToDate = l_user.ToDate,
                    Hobby = l_user.Hobby,
                    Language = l_user.Language,
                    Role = l_user.Role
                };
            }
            catch (Exception e)
            {
                throw e;
            }
            //throw new NotImplementedException();
        }

        public UserResponse GetByUserName(string username)
        {
            try
            {
                var l_users = m_userRepository.GetAll();
                var user = l_users.Where(_ => _.UserName.ToLower().Contains(username.ToLower())).FirstOrDefault();
                if (user != null)
                {
                    UserResponse userResponse = new UserResponse
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Avatar = user.Avatar,
                        Description = user.Description,
                        UserName = user.UserName
                    };
                    return userResponse;
                }
                else
                    return null;
            }
            catch (Exception e)
            {
                throw e;
            }
            //throw new NotImplementedException();
        }


        public UserResponse Update(Guid id, UpdateUserRequest model)
        {
            throw new NotImplementedException();
        }

        public bool Delete(Guid id)
        {
            throw new NotImplementedException();
        }

        public void UploadAvatar(Guid id, string webRootPath, IFormFile avatar)
        {
            User user = m_userRepository.FindById(id);

            string imageUrl = this.SaveFile(webRootPath, $"media-file/{id}/", avatar);
            string url = imageUrl;

            user.Avatar = url;
            m_userRepository.SetModifierUserStatus(user, EntityState.Modified);
            m_userRepository.SaveChanges();
        }
        public void UploadBackground(Guid id, string webRootPath, IFormFile background)
        {
            User user = m_userRepository.FindById(id);
            string imageUrl = this.SaveFile(webRootPath, $"media-file/{id}/", background);
            string url = imageUrl;
            user.Background = url;
            m_userRepository.SetModifierUserStatus(user, EntityState.Modified);
            m_userRepository.SaveChanges();
        }
        private string SaveFile(string webRootPath, string dirFile, IFormFile image)
        {
            //host static image
            Int32 unixTimestamp = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            string nameImage = unixTimestamp.ToString() + "." + image.FileName.Split('.')[1];

            string filePath = $"{webRootPath}{SystemConstants.DIRECTORY_SEPARATOR_CHAR}{dirFile}";

            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }

            using (FileStream fileStream = System.IO.File.Create(filePath + nameImage))
            {
                image.CopyTo(fileStream);
                fileStream.Flush();
            }

            return dirFile + nameImage;
        }
        public void UploadUserProfile(Guid id, UpdateUserRequest model)
        {
            User user = m_userRepository.FindById(id);
            var l_user = user;
            {
                user.Email = model.Email;
                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.Description = model.Description;
                user.Address = model.Address;
                user.PhoneNumber = model.PhoneNumber;
                user.Location = model.Location;
                user.Works = model.Works;
                user.Gender = model.Gender;
                user.BirthDay = model.BirthDay;
                user.FollowMe = model.FollowMe;
                user.RequestFriend = model.RequestFriend;
                user.ViewListFriend = model.ViewListFriend;
                user.ViewTimeLine = model.ViewTimeLine;
                ///*
                // * temp code, make easy to register, but registering need a verification token
                // */
                //user.DateVerified = DateTime.UtcNow;
                //user.VerificationShortToken = null;
                /*
                 * 
                 */
            };
            m_userRepository.SetModifierUserStatus(l_user, EntityState.Modified);
            m_userRepository.SaveChanges();
        }
        public void ChangePassword(Guid id, ResetPasswordRequest model)
        {
            if (model.Password != model.ConfirmPassword)
            {
                throw new Exception("Password and Confirm Password must be matched");
            }
            User user = m_userRepository.FindById(id);
            var l_user = user;
            {
                user.PasswordHash = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(model.Password)).ToString();
                user.Password = model.Password;
            }
            m_userRepository.SetModifierUserStatus(l_user, EntityState.Modified);
            m_userRepository.SaveChanges();
        }
        public void UpdateAcademic(Guid id, UpdateAcademicRequest model)
        {
            User user = m_userRepository.FindById(id);
            var l_user = user;
            {
                user.AcademicLevel = model.AcademicLevel;
                user.AddressAcademic = model.AddressAcademic;
                user.DescriptionAcademic = model.DescriptionAcademic;
                user.FromDate = model.FromDate;
                user.ToDate = model.ToDate;
                user.StudyingAt = model.StudyingAt;
            }
            m_userRepository.SetModifierUserStatus(l_user, EntityState.Modified);
            m_userRepository.SaveChanges();
        }
        public void UpdateInterest(Guid id, UpdateInterestRequest model)
        {
            User user = m_userRepository.FindById(id);
            var l_user = user;
            {
                user.Hobby = model.Hobby;
                user.Language = model.Language;
            }
            m_userRepository.SetModifierUserStatus(l_user, EntityState.Modified);
            m_userRepository.SaveChanges();
        }

        public void DeleteUser(Guid id)
        {
            User user = m_userRepository.FindById(id);
            m_userRepository.Remove(user);
            m_userRepository.SaveChanges();
        }

        public bool BlockUser(Guid id)
        {
            User user = m_userRepository.FindById(id);

            user.Active = !user.Active;
            m_userRepository.SetModifierUserStatus(user, EntityState.Modified);
            m_userRepository.SaveChanges();
            if (user.Active == true)
                return true;
            else
                return false;
        }
        //--------------------------------------------------------------------------
        //helper methods
        private string GenerateJwtToken(User user)
        {
            var l_tokenHandler = new JwtSecurityTokenHandler();
            var l_key = Encoding.ASCII.GetBytes("S#$33ab654te^#^$KD%^64");//secret string
            var l_tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, ((int)user.Role).ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(l_key), SecurityAlgorithms.HmacSha256Signature)
            };
            var l_token = l_tokenHandler.CreateToken(l_tokenDescriptor);

            return l_tokenHandler.WriteToken(l_token);
        }

        private RefreshToken GenerateRefreshToken(string ipAddress)
        {
            RefreshToken l_refreshToken = new RefreshToken();
            using (var rngCryptoServiceProvider = new RNGCryptoServiceProvider())
            {
                var l_randomBytes = new byte[64];
                rngCryptoServiceProvider.GetBytes(l_randomBytes);
                l_refreshToken = new RefreshToken
                {
                    Token = Convert.ToBase64String(l_randomBytes),
                    Expires = DateTime.UtcNow.AddDays(7),
                    CreatedByIp = ipAddress
                };
            };
            return l_refreshToken;
        }

        private void RemoveOldRefreshTokens(User user)
        {
            var l_tokens = user.RefreshTokens.Where(_ => _.IsActive == false && _.Expires.AddDays(m_refreshTokenDayTimeLive) <= DateTime.UtcNow).Select(_ => _);
            foreach (var token in l_tokens)
            {
                user.RefreshTokens.Remove(token);
            }
        }

        public string RandomSixDigitToken()
        {
            Random l_random = new Random();
            int l_sixDigit = l_random.Next(100000, 999999);
            return l_sixDigit.ToString();
        }

        private void SendVerificationEmail(User user, string origin)
        {

        }
    }
}
