using Domain.Interfaces.UnitOfWorks;
using Domain.Models;
using JWT.Cache;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JWT.Controllers;
[ApiController]
[Authorize]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly IUnitOfWorks _unitOfWorks;
    private readonly ICacheService _cacheService;

    public CategoryController(IUnitOfWorks unitOfWorks, ICacheService cacheService)
    {
        _unitOfWorks = unitOfWorks;
        _cacheService = cacheService;
    }

    [HttpGet]
    [Route("categoryList")]
    public async Task<ActionResult<IEnumerable<Category>>> Get()
    {
        List<Category> categories = _cacheService.GetData<List<Category>>("Category");
        if (categories == null)
        {
            var categoriesSql = await _unitOfWorks.CategoryRepository.GetAll();
            if (categoriesSql.Count() > 0)
            {
                _cacheService.SetData("Category", categoriesSql, DateTimeOffset.Now.AddDays(1));
                categories = categoriesSql.ToList();
            }
        }
        return categories;
    }

    [HttpGet]
    [Route("productsCountInCategory")]
    public async Task<ActionResult<int>> GetCountInCategory(int categoryId) =>  await _unitOfWorks.CategoryRepository.GetCountInCategory(categoryId);

}