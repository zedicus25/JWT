using JWT.Cache;
using JWT.Data;
using JWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JWT.Controllers;
[ApiController, Authorize]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly SmartphonesDataBaseContext _dbContext;
    private readonly ICacheService _cacheService;

    public ProductsController(SmartphonesDataBaseContext context, ICacheService cacheService)
    {
        _dbContext = context;
        _cacheService = cacheService;
    }

    [HttpGet]
    [Route("productsList")]
    public async Task<ActionResult<IEnumerable<Smartphone>>> Get()
    {
        List<Smartphone> smartphones = _cacheService.GetData<List<Smartphone>>("Smartphone");
        if (smartphones == null)
        {
            var smartphonesSql = await _dbContext.Smartphones.ToListAsync();
            if (smartphonesSql.Count > 0)
            {
                _cacheService.SetData("Smartphone", smartphonesSql, DateTimeOffset.Now.AddDays(1));
            }
        }

        return smartphones;
    }
}