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
    public IActionResult AddUser(User user)
    {
        if (_dbContext.Users.FirstOrDefault(x => x.Login == user.Login) != null)
            return Conflict();

        user.Password = PasswordHasher.HashPassword(user.Password);
        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();
        return Ok();
    }
}