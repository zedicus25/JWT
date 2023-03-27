using JWT.Roles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace JWT.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = UserRoles.Admin)]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;

        public UsersController(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        [Route("getUsers")]
        public async Task<ActionResult<IEnumerable<IdentityUser>>> GetUsers()
        {
            List<IdentityUser> res = new List<IdentityUser>();
            var users = await GetUsersInRole(UserRoles.User);
            foreach (var item in users)
            {
                if (_userManager.IsInRoleAsync(item, UserRoles.Admin).Result
                    || _userManager.IsInRoleAsync(item, UserRoles.Manager).Result)
                    continue;
                else
                    res.Add(item);
            }
            return res.ToList();
        }
            

        [HttpGet]
        [Route("getManagers")]
        public async Task<ActionResult<IEnumerable<IdentityUser>>> GetManagers()
        {
            List<IdentityUser> res = new List<IdentityUser>();
            var users = await GetUsersInRole(UserRoles.User);
            foreach (var item in users)
            {
                if (_userManager.IsInRoleAsync(item, UserRoles.Admin).Result)
                    continue;
                else
                    res.Add(item);
            }
            return res.ToList();
        }
             

        [HttpGet]
        [Route("getAdmins")]
        public ActionResult<IEnumerable<IdentityUser>> GetAdmins() =>
            GetUsersInRole(UserRoles.Admin).Result.ToList();

        [HttpPost]
        [Route("deleteUser")]
        public async Task<ActionResult> DeleteUser([FromQuery (Name = "userId")]string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound();

            var res = await _userManager.DeleteAsync(user);
            if (res.Succeeded)
                return Ok();
            return BadRequest();
        }

        private async Task<IEnumerable<IdentityUser>> GetUsersInRole(string role) =>
            await _userManager.GetUsersInRoleAsync(role);
    }
}
