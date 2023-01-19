using JWT.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JWT.Data;

namespace JWT.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthenticationController : ControllerBase
{
    private readonly SmartphonesDataBaseContext _dbContext;

    public AuthenticationController(SmartphonesDataBaseContext context)
    {
        _dbContext = context;
    }
    
    [HttpPost]
    [Route("login")]
    public IActionResult Login(User loginingUser)
    {
        if (loginingUser.Login.Equals(String.Empty) || loginingUser.Password.Equals(String.Empty))
            return BadRequest();

        var user = _dbContext.Users.FirstOrDefault(x => x.Login == loginingUser.Login);
        
        if(user == null)
            return Unauthorized();

        if (PasswordHasher.VerifyHashedPassword(user.Password, loginingUser.Password))
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