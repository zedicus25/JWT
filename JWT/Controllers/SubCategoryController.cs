using Domain.Interfaces.UnitOfWorks;
using Domain.Models;
using JWT.Cache;
using Microsoft.AspNetCore.Mvc;

namespace JWT.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubCategoryController : ControllerBase
    {
        private readonly IUnitOfWorks _unitOfWorks;
        private readonly ICacheService _cacheService;

        public SubCategoryController(IUnitOfWorks unitOfWorks, ICacheService cacheService)
        {
            _unitOfWorks = unitOfWorks;
           //_cacheService = cacheService;
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
                    var categoriesSql = await _unitOfWorks.SubCategoryRepository.GetAll();
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
            return _unitOfWorks.SubCategoryRepository.GetAll().Result.ToList();
        }

        [HttpPost]
        [Route("addSubCategory")]
        public async Task<IActionResult> AddSubCategory([FromQuery(Name = "subCategoryName")] string subCategoryName)
        {
            try
            {
                var subCategoriesSql = await _unitOfWorks.SubCategoryRepository.GetAll();
                if (subCategoriesSql.Any(x => x.Name == subCategoryName))
                    return Conflict();

                SubCategory category = new SubCategory();
                category.Name = subCategoryName;
                _unitOfWorks.SubCategoryRepository.Add(category);
                if (_unitOfWorks.Commit() > 0)
                {
                    try
                    {
                        var categories = await _unitOfWorks.CategoryRepository.GetAll();
                        if (categories.Count() > 0)
                        {
                            _cacheService.SetData("SubCategory", categories, DateTimeOffset.Now.AddDays(1));
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
        [Route("deleteSubCategory")]
        public async Task<IActionResult> DeleteCategory([FromQuery(Name = "subCategoryId")] int subCategoryId)
        {
            var subCategories = await _unitOfWorks.SubCategoryRepository.GetAll();
            if (subCategories.Count() <= 1)
                return BadRequest("One sub category in db");

            List<Product> productsInCategory = _unitOfWorks.ProductRepository.GetAll().Result.Where(x => x.SubCategoryId == subCategoryId).ToList();
            var defaultCategory = subCategories.FirstOrDefault(x => x.Id != subCategoryId);
            foreach (var prod in productsInCategory)
            {
                _unitOfWorks.ProductRepository.UpdateSubCategoryId(prod.Id, defaultCategory.Id);
                _unitOfWorks.ProductRepository.SetStatus(prod.Id, 3);
            }
            if (_unitOfWorks.Commit() > 0)
            {
                _unitOfWorks.SubCategoryRepository.Delete(subCategoryId);
                if (_unitOfWorks.Commit() > 0)
                {
                    try
                    {
                        subCategories = await _unitOfWorks.SubCategoryRepository.GetAll();
                        var products = await _unitOfWorks.ProductRepository.GetAll();
                        if (subCategories.Count() > 0)
                        {
                            _cacheService.SetData("SubCategory", subCategories, DateTimeOffset.Now.AddDays(1));
                        }
                        if (products.Count() > 0)
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
        public async Task<IActionResult> UpdateCategory([FromBody] SubCategory category)
        {
            _unitOfWorks.SubCategoryRepository.Update(category);
            if (_unitOfWorks.Commit() > 0)
            {
                var categories = await _unitOfWorks.SubCategoryRepository.GetAll();
                if (categories.Count() > 0)
                {
                    _cacheService.SetData("SubCategory", categories, DateTimeOffset.Now.AddDays(1));
                }
                return Ok();
            }
            return BadRequest();
        }
    }
}
