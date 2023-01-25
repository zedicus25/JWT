using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Models;
using Domain.Interfaces.UnitOfWorks;

namespace JWT.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthenticationController : ControllerBase
{
    private readonly IUnitOfWorks _unitOfWorks;

    public AuthenticationController(IUnitOfWorks unitOfWorks)
    {
        _unitOfWorks = unitOfWorks;
    }

    [HttpPost]
    [Route("login")]
    public  IActionResult Login(User loginingUser)
    {
        if (loginingUser.Login.Equals(String.Empty) || loginingUser.Password.Equals(String.Empty))
            return BadRequest();


        if (_unitOfWorks.UserRepository.CheckPassword(loginingUser))
        {
            var secretKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(ConfigurationManager.AppSettings["JWT:Secret"]));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var jwtOptions = new JwtSecurityToken(
                issuer: ConfigurationManager.AppSettings["JWT:ValidIssuer"],
                audience: ConfigurationManager.AppSettings["JWT:ValidAudience"],
                claims: new List<Claim>(),
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: signinCredentials);
            var tokenStr = new JwtSecurityTokenHandler().WriteToken(jwtOptions);
            return Ok(new JwtTokenResponse() { Token = tokenStr });
        }

        return Unauthorized();
    }
}