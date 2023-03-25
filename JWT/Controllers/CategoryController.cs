using Domain.Interfaces.UnitOfWorks;
using Domain.Models;
using JWT.Cache;
using JWT.Roles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        //_cacheService = cacheService;
    }

    [HttpGet]
    [Route("categoryList")]
    public async Task<ActionResult<IEnumerable<Category>>> Get()
    {
        var data = await TryGetDataFromCache();
        return data.ToList();
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.Manager)]
    [Route("addCategory")]
    public async Task<IActionResult> AddCategory([FromQuery (Name = "categoryName")] string categoryName)
    {
        try
        {
            var categoriesSql = await _unitOfWorks.CategoryRepository.GetAll();
            if (categoriesSql.Any(x => x.Name == categoryName))
                return Conflict();

            _unitOfWorks.CategoryRepository.Add(new Category { Name = categoryName});
            if (_unitOfWorks.Commit() > 0)
            {
                await SetCategoriesToCache();

                return Ok();
            }
            return BadRequest();
        }
        catch (Exception)
        {
        }
        return BadRequest();
    }

    [HttpDelete]
    [Authorize(Roles = UserRoles.Manager)]
    [Route("deleteCategory")]
    public async Task<IActionResult> DeleteCategory([FromQuery(Name = "categoryId")] int categoryId)
    {
        var categories = await _unitOfWorks.CategoryRepository.GetAll();
        if (categories.Count() <= 1)
            return BadRequest("One category in db");

        List<Product> productsInCategory = _unitOfWorks.ProductRepository.GetAll().Result.Where(x => x.CategoryId == categoryId).ToList();
        var defaultCategory = categories.FirstOrDefault(x => x.Id != categoryId);
        foreach (var prod in productsInCategory)
        {
            _unitOfWorks.ProductRepository.UpdateCategoryId(prod.Id, defaultCategory.Id);
            _unitOfWorks.ProductRepository.SetStatus(prod.Id, 3);
        }
            _unitOfWorks.CategoryRepository.Delete(categoryId);
            if (_unitOfWorks.Commit() > 0)
            {
                await SetCategoriesToCache();
                await SetProductsToCache();
               
                return Ok();
            }
        return BadRequest();
    }

    [HttpPut]
    [Authorize(Roles = UserRoles.Manager)]
    [Route("updateCategory")]
    public async Task<IActionResult> UpdateCategory([FromBody] Category category)
    {
        _unitOfWorks.CategoryRepository.Update(category);
        if(_unitOfWorks.Commit() > 0)
        {
            await SetCategoriesToCache();
            return Ok();
        }
        return BadRequest(); 
    }
    

    [HttpGet]
    [Authorize(Roles = UserRoles.Manager)]
    [Route("productsCountInCategory")]
    public async Task<ActionResult<int>> GetCountInCategory([FromQuery(Name = "categoryId")] int categoryId) =>  
        await _unitOfWorks.CategoryRepository.GetCountInCategory(categoryId);


    private async Task SetCategoriesToCache()
    {
        try
        {
            var smart1 = await _unitOfWorks.CategoryRepository.GetAll();
            if (smart1.Count() > 0)
                _cacheService.SetData("Category", smart1, DateTimeOffset.Now.AddDays(1));
        }
        catch (Exception)
        {
        }
    }

    private async Task SetProductsToCache()
    {
        try
        {
            var smart1 = await _unitOfWorks.ProductRepository.GetAll();
            if (smart1.Count() > 0)
                _cacheService.SetData("AllAssets", smart1, DateTimeOffset.Now.AddDays(1));
        }
        catch (Exception)
        {
        }
    }

    private async Task<IEnumerable<Category>> TryGetDataFromCache()
    {
        try
        {
            List<Category> assets = _cacheService.GetData<List<Category>>("Category");
            if (assets != null)
                return assets;

            await SetCategoriesToCache();
        }
        catch (Exception)
        {
        }

        return await _unitOfWorks.CategoryRepository.GetAll();
    }

}