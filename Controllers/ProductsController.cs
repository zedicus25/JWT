using JWT.Data;
using JWT.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JWT.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly SmartphonesDataBaseContext _dbContext;

    public ProductsController(SmartphonesDataBaseContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Route("productsList")]
    public async Task<ActionResult<IEnumerable<Smartphone>>> Get() => _dbContext.Smartphones.ToList();
}