using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces.UnitOfWorks;

namespace JWT.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUnitOfWorks _unitOfWorks;

    public UsersController(IUnitOfWorks unitOfWorks)
    {
        _unitOfWorks = unitOfWorks;
    }

    [HttpPost]
    [Route("AddUser")]
    public IActionResult AddUser(User newUser)
    {
        var olduser = _unitOfWorks.UserRepository.GetAll().Result.FirstOrDefault(x => x.Login == newUser.Login);
        if (olduser != null)
            return Conflict();

        _unitOfWorks.UserRepository.Add(newUser);
        if(_unitOfWorks.Commit() > 0)
            return Ok();

        return BadRequest();

    }
}