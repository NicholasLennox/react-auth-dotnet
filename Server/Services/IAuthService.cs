using System;
using Server.Models.Dtos;

namespace Server.Services
{
    public interface IAuthService
    {
        Task<string?> Register(RegisterRequestDto dto);
        Task<string?> Login(LoginRequestDto dto);
    }
}
