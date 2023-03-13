using Domain.Interfaces.UnitOfWorks;
using Domain.Models;
using JWT.Cache;
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

    [HttpPost]
    [Route("addCategory")]
    public async Task<IActionResult> AddCategory([FromQuery (Name = "categoryName")] string categoryName)
    {
        try
        {
            var categoriesSql = await _unitOfWorks.CategoryRepository.GetAll();
            if (categoriesSql.Any(x => x.Name == categoryName))
                return Conflict();

            Category category = new Category();
            category.Name = categoryName;
            _unitOfWorks.CategoryRepository.Add(category);
            if (_unitOfWorks.Commit() > 0)
            {
                try
                {
                    var categories = await _unitOfWorks.CategoryRepository.GetAll();
                    if (categories.Count() > 0)
                    {
                        _cacheService.SetData("Category", categories, DateTimeOffset.Now.AddDays(1));
                    }
                }
                catch (Exception)
                {
                }

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
        if(_unitOfWorks.Commit() > 0)
        {
            _unitOfWorks.CategoryRepository.Delete(categoryId);
            if (_unitOfWorks.Commit() > 0)
            {
                try
                {
                    categories = await _unitOfWorks.CategoryRepository.GetAll();
                    var products = await _unitOfWorks.ProductRepository.GetAll();
                    if (categories.Count() > 0)
                    {
                        _cacheService.SetData("Category", categories, DateTimeOffset.Now.AddDays(1));
                    }
                    if(products.Count() > 0)
                    {
                        _cacheService.SetData("AllAssets", products, DateTimeOffset.Now.AddDays(1));
                    }
                }
                catch (Exception)
                {
                }
                return Ok();
            }
        }
        return BadRequest();
    }

    [HttpPut]
    [Route("updateCategory")]
    public async Task<IActionResult> UpdateCategory([FromBody] Category category)
    {
        _unitOfWorks.CategoryRepository.Update(category);
        if(_unitOfWorks.Commit() > 0)
        {
            var categories = await _unitOfWorks.CategoryRepository.GetAll();
            if (categories.Count() > 0)
            {
                _cacheService.SetData("Category", categories, DateTimeOffset.Now.AddDays(1));
            }
            return Ok();
        }
        return BadRequest(); 
    }
    

    [HttpGet]
    [Route("productsCountInCategory")]
    public async Task<ActionResult<int>> GetCountInCategory([FromQuery(Name = "categoryId")] int categoryId) =>  
        await _unitOfWorks.CategoryRepository.GetCountInCategory(categoryId);

}