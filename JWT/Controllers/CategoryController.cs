using Domain.Models;
using JWT.Cache;
using JWT.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JWT.Controllers;
[ApiController, Authorize]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly SmartphonesDataBaseContext _dbContext;
    private readonly ICacheService _cacheService;

    public CategoryController(SmartphonesDataBaseContext context, ICacheService cacheService)
    {
        _dbContext = context;
        _cacheService = cacheService;
    }

    [HttpGet]
    [Route("categoryList")]
    public async Task<ActionResult<IEnumerable<Category>>> Get()
    {
        List<Category> categories = _cacheService.GetData<List<Category>>("Category");
        if (categories == null)
        {
            var categoriesSql = await _dbContext.Categories.ToListAsync();
            if (categoriesSql.Count > 0)
            {
                _cacheService.SetData("Category", categoriesSql, DateTimeOffset.Now.AddDays(1));
            }
        }

        return categories;
    }
    
    [HttpGet]
    [Route("productsCountInCategory")]
    public async Task<ActionResult<int>> GetCountInCategory(int categoryId)
    {
        return _dbContext.Smartphones.Where(x => x.CategoryId == categoryId).ToList().Count;
    }
}