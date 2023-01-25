using JWT.Data;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace JWT.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly SmartphonesDataBaseContext _dbContext;

    public UsersController(SmartphonesDataBaseContext context)
    {
        _dbContext = context;
    }

    [HttpPost]
    [Route("AddUser")]
    public IActionResult AddUser(User newUser)
    {
        var olduser = _dbContext.Users.FirstOrDefault(x => x.Login == newUser.Login);
        if (olduser != null)
            return Conflict();

        User user = new User
        {
            Login = newUser.Login,
            Password = PasswordHasher.HashPassword(newUser.Password)
        };
        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();
        return Ok();
    }
}