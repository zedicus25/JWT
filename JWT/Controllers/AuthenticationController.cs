using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using JWT.Roles;
using Microsoft.AspNetCore.Authorization;

namespace JWT.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthenticationController : ControllerBase
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthenticationController( UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login([FromBody]Login model)
    {
        var user = await _userManager.FindByNameAsync(model.UserName);
        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var userRole = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim> {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

            foreach (var role in userRole)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = GetToken(authClaims);

            return Ok(new
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                Roles = userRole
            });
        }
        return Unauthorized();
    }

    [HttpPost]
    [Route("regUser")]
    public async Task<IActionResult> RegUser([FromBody] Register model)
    {
        var userEx = await _userManager.FindByNameAsync(model.UserName);
        if (userEx != null) return StatusCode(StatusCodes.Status500InternalServerError, "User in db already");

        IdentityUser user = new()
        {
            UserName = model.UserName,
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString()
        };

        var res = await _userManager.CreateAsync(user, model.Password);
        if (!res.Succeeded) { return StatusCode(StatusCodes.Status500InternalServerError, "Creation failed!"); }

        if (!await _roleManager.RoleExistsAsync(UserRoles.User))
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));
        if (await _roleManager.RoleExistsAsync(UserRoles.User))
            await _userManager.AddToRoleAsync(user, UserRoles.User);

        return Ok("User added!");
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.Admin)]
    [Route("regManager")]
    public async Task<IActionResult> RegManager([FromBody] Register model)
    {
        var userEx = await _userManager.FindByNameAsync(model.UserName);
        if (userEx != null) return StatusCode(StatusCodes.Status500InternalServerError, "User in db already");

        IdentityUser user = new()
        {
            UserName = model.UserName,
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString()
        };

        var res = await _userManager.CreateAsync(user, model.Password);
        if (!res.Succeeded) { return StatusCode(StatusCodes.Status500InternalServerError, "Creation failed!"); }

        if (!await _roleManager.RoleExistsAsync(UserRoles.Manager))
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.Manager));
        if (!await _roleManager.RoleExistsAsync(UserRoles.User))
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));


        if (await _roleManager.RoleExistsAsync(UserRoles.Manager))
            await _userManager.AddToRoleAsync(user, UserRoles.Manager);
        if (await _roleManager.RoleExistsAsync(UserRoles.User))
            await _userManager.AddToRoleAsync(user, UserRoles.User);

        return Ok("Manager added!");
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.Admin)]
    [Route("regAdmin")]
    public async Task<IActionResult> RegAdmin([FromBody] Register model)
    {
        var userEx = await _userManager.FindByNameAsync(model.UserName);
        if (userEx != null) return StatusCode(StatusCodes.Status500InternalServerError, "Admin in db already");

        IdentityUser user = new()
        {
            UserName = model.UserName,
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString()
        };

        var res = await _userManager.CreateAsync(user, model.Password);
            if (!res.Succeeded) { return StatusCode(StatusCodes.Status500InternalServerError, "Creation failed!"); }

        if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
        if(!await _roleManager.RoleExistsAsync(UserRoles.Manager))
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.Manager));
        if (!await _roleManager.RoleExistsAsync(UserRoles.User))
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));


        if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
            await _userManager.AddToRoleAsync(user, UserRoles.Admin);
        if (await _roleManager.RoleExistsAsync(UserRoles.Manager))
            await _userManager.AddToRoleAsync(user, UserRoles.Manager);
        if (await _roleManager.RoleExistsAsync(UserRoles.User))
            await _userManager.AddToRoleAsync(user, UserRoles.User);

        return Ok("Admin added!");
    }

    private JwtSecurityToken GetToken(List<Claim> claimsList)
    {
        var signKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
        var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(6),
                claims: claimsList,
                signingCredentials: new SigningCredentials(signKey, SecurityAlgorithms.HmacSha256)
            );

        return token;
    }
}