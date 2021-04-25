using Data.Entities;
using Domain.DomainModels;
using Domain.DomainModels.API.RequestModels;
using Domain.DomainModels.API.ResponseModels;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;

namespace Domain.IServices
{
    public interface IUserService<T>
    {
        AuthenticateResponse Authenticate(AuthenticateRequest authenticateRequest, string ipAdress);
        string AuthenticateG(string email, string ipAddress);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="token">refresh token</param>
        /// <param name="ipAddress">client ipv4 address</param>
        /// <returns>
        /// AuthenticateResponse instance if refresh successfully
        /// null if refresh failure
        /// </returns>
        AuthenticateResponse RefreshToken(string token, string ipAddress);
        bool RevokeToken(string token, string ipAddress);
        void Register(RegisterRequest model, string origin);
        void VerifyEmail(string token);
        //void SendEmail(string mailAddress, string content);
        void ForgotPassword(ForgotPasswordRequest model, string origin);
        void ValidateResetToken(ValidateResetTokenRequest model);
        void ResetPassword(ResetPasswordRequest model);
        IEnumerable<UserResponse> GetAll();
        IEnumerable<UserResponse> GetAllByName(string Name);
        UserResponse GetById(T id);
        UserResponse Update(T id, UpdateUserRequest model);
        bool Delete(T id);
        void UploadAvatar(Guid id, string webRootPath, IFormFile avatar);
        //void UploadAvatar(Guid id, IFormFile avatar);
        void DeleteUser(Guid id);
        bool BlockUser(Guid id);
        void UploadUserProfile(Guid id, UpdateUserRequest model);
        void ChangePassword(Guid id, ResetPasswordRequest model);
        void UpdateAcademic(Guid id, UpdateAcademicRequest model);
        void UpdateInterest(Guid id, UpdateInterestRequest model);
        void UploadBackground(Guid id, string webRootPath, IFormFile background);
        UserResponse GetByUserName(string username);
    }
}
