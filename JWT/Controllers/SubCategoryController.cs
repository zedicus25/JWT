using Domain.Interfaces.UnitOfWorks;
using Domain.Models;
using JWT.Cache;
using JWT.Roles;
using Microsoft.AspNetCore.Authorization;
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
            var data = await TryGetDataFromCache();
            return data.ToList();
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Manager)]
        [Route("addSubCategory")]
        public async Task<IActionResult> AddSubCategory([FromQuery(Name = "subCategoryName")] string subCategoryName)
        {
            try
            {
                var subCategoriesSql = await _unitOfWorks.SubCategoryRepository.GetAll();
                if (subCategoriesSql.Any(x => x.Name == subCategoryName))
                    return Conflict();

                _unitOfWorks.SubCategoryRepository.Add(new SubCategory {Name = subCategoryName });
                if (_unitOfWorks.Commit() > 0)
                {
                    await SetSubCategoriesToCache();

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
            _unitOfWorks.SubCategoryRepository.Delete(subCategoryId);
            if (_unitOfWorks.Commit() > 0)
            {
                await SetSubCategoriesToCache();
                await SetProductsToCache();
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut]
        [Authorize(Roles = UserRoles.Manager)]
        [Route("updateCategory")]
        public async Task<IActionResult> UpdateCategory([FromBody] SubCategory category)
        {
            _unitOfWorks.SubCategoryRepository.Update(category);
            if (_unitOfWorks.Commit() > 0)
            {
                await SetSubCategoriesToCache();

                return Ok();
            }
            return BadRequest();
        }

        private async Task SetSubCategoriesToCache()
        {
            try
            {
                var smart1 = await _unitOfWorks.SubCategoryRepository.GetAll();
                if (smart1.Count() > 0)
                    _cacheService.SetData("SubCategory", smart1, DateTimeOffset.Now.AddDays(1));
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
        /// <summary>
        /// Method <c>TryGetDataFromCache</c> trying get data from cache, if its null, 
        /// return data form database and write cache.
        /// </summary>
        /// <returns>Collection of products</returns>
        private async Task<IEnumerable<SubCategory>> TryGetDataFromCache()
        {
            try
            {
                List<SubCategory> assets = _cacheService.GetData<List<SubCategory>>("SubCategory");
                if (assets != null)
                    return assets;

                await SetSubCategoriesToCache();
            }
            catch (Exception)
            {
            }

            return await _unitOfWorks.SubCategoryRepository.GetAll();
        }
    }
}
