using JWT.Data;
using JWT.Models;
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
    public IActionResult AddUser(string login, string password)
    {
        if (_dbContext.Users.FirstOrDefault(x => x.Login == login) != null)
            return Conflict();

        User user = new User
        {
            Login = login,
            Password = PasswordHasher.HashPassword(password)
        };
        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();
        return Ok();
    }
}