using Domain.Interfaces.UnitOfWorks;
using Domain.Models;
using JWT.Cache;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;
using System.Security.Cryptography.Xml;

namespace JWT.Controllers;
[ApiController]
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
        try
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
        catch (Exception)
        {
        }
        return _unitOfWorks.CategoryRepository.GetAll().Result.ToList();


    }

    [HttpGet]
    [Route("subCategoryList")]
    public async Task<ActionResult<IEnumerable<SubCategory>>> GetSubCategories()
    {
        try
        {
            List<SubCategory> categories = _cacheService.GetData<List<SubCategory>>("SubCategory");
            if (categories == null)
            {
                var categoriesSql = await _unitOfWorks.CategoryRepository.GetSubCategories();
                if (categoriesSql.Count() > 0)
                {
                    _cacheService.SetData("SubCategory", categoriesSql, DateTimeOffset.Now.AddDays(1));
                    categories = categoriesSql.ToList();
                }
            }
            return categories;
        }
        catch (Exception)
        {
        }
        return _unitOfWorks.CategoryRepository.GetSubCategories().Result.ToList();
    }

    [HttpGet]
    [Route("productsCountInCategory")]
    public async Task<ActionResult<int>> GetCountInCategory([FromQuery(Name = "categoryId")] int categoryId) =>  
        await _unitOfWorks.CategoryRepository.GetCountInCategory(categoryId);


    
}