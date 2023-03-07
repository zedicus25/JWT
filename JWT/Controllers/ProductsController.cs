using JWT.Cache;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces.UnitOfWorks;
using JWT.Roles;
using Newtonsoft.Json;

namespace JWT.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IUnitOfWorks _unitOfWorks;
    private readonly ICacheService _cacheService;
    private readonly AzureClient _azureClient;

    public ProductsController(IUnitOfWorks unitOfWorks, ICacheService cacheService)
    {
        _unitOfWorks = unitOfWorks;
        _cacheService = cacheService;
        _azureClient = new AzureClient();
    }

    [HttpGet]
    [Route("productsList")]
    public async Task<ActionResult<IEnumerable<Product>>> Get()
    {
        try
        {
            List<Product> assets = _cacheService.GetData<List<Product>>("AllAssets");
            if (assets == null)
            {
                var assestSql = _unitOfWorks.ProductRepository.GetAll().Result.ToList();
                if (assestSql.Count() > 0)
                {
                    _cacheService.SetData("AllAssets", assestSql, DateTimeOffset.Now.AddDays(1));
                    assets = assestSql.ToList();
                }
            }
            return assets.Where(x => x.StatusId != 3 && x.StatusId != 2).ToList();
        }
        catch(Exception ex)
        {
        }
        return _unitOfWorks.ProductRepository.GetAll().Result.Where(x => x.StatusId != 3 && x.StatusId != 2).ToList();
    }

    [HttpGet]
    [Route("productsInPage")]
    public async Task<ActionResult<IEnumerable<Product>>> Get([FromQuery(Name ="perPage")] int perPage, [FromQuery(Name = "page")] int page)
    {
        List<Product> assets = _cacheService.GetData<List<Product>>("AllAssets");
        if(assets == null)
            assets = _unitOfWorks.ProductRepository.GetAll().Result.ToList();
        if (assets != null)
        {
            int startIndex = perPage * (page - 1);
            try
            {
                var res = assets.Where(x => x.StatusId != 3 && x.StatusId != 2).ToList().GetRange(startIndex, perPage);
                return res;
            }
            catch (ArgumentException ex)
            {
                Product start = assets.Where(x => x.StatusId != 3 && x.StatusId != 2).ElementAtOrDefault(startIndex);
                if (start == null)
                    return new List<Product>();
                int endIndex = assets.Where(x => x.StatusId != 3 && x.StatusId != 2).ToList().LastIndexOf(assets.Last()) + 1;
                return assets.Where(x => x.StatusId != 3 && x.StatusId != 2).ToList().GetRange(startIndex, endIndex - startIndex);
            }
        }
        else
            return NoContent();
    }

    [HttpGet]
    [Route("getProductsInCategory")]
    public async Task<ActionResult<IEnumerable<Product>>> GetByCategoryId([FromQuery(Name = "categoryId")] int categoryId)
    {
        List<Product> smartphones = _cacheService.GetData<List<Product>>("AllAssets");
        if (smartphones != null)
        {
            var smart = smartphones.Where(x => x.CategoryId == categoryId && x.StatusId != 3 && x.StatusId != 2);
            return smart.ToList();
        }
        var smart1 = _unitOfWorks.ProductRepository.GetAll().Result;
        if (smart1.Count() > 0)
            _cacheService.SetData("AllAssets", smart1, DateTimeOffset.Now.AddDays(1));
        return _unitOfWorks.ProductRepository.GetByCategoryId(categoryId).Result;
    }

        

    [HttpGet]
    [Route("getProductsInSubCategories")]
    public  ActionResult<IEnumerable<Product>> GetBySubCategories([FromQuery(Name = "categoriesId")] int[] categoriesId, 
        [FromQuery(Name = "categoryId")] int categoryId)
    {
        List<Product> smartphones = _cacheService.GetData<List<Product>>("AllAssets");
        if (smartphones != null)
        {
            var smart = smartphones.Where(x => categoriesId.Any(c => c == x.SubCategoryId) &&
            x.CategoryId == categoryId);
            return smart.ToList();
        }
        var smart1 = _unitOfWorks.ProductRepository.GetAll().Result;
        if (smart1.Count() > 0)
            _cacheService.SetData("AllAssets", smart1, DateTimeOffset.Now.AddDays(1));
        return _unitOfWorks.ProductRepository.GetProductInSubCategories(categoriesId, categoryId).ToList();
    }
       

    [HttpPost]
    [Authorize(Roles = UserRoles.Manager)]
    [Route("setStatus")]
    public ActionResult SetStatus([FromQuery(Name = "productId")] int productId, [FromQuery(Name = "statusId")] int statusId)
    {
        _unitOfWorks.ProductRepository.SetStatus(productId, statusId);
        if (_unitOfWorks.Commit() > 0)
        {
            var smart1 = _unitOfWorks.ProductRepository.GetAll().Result;
            if (smart1.Count() > 0)
                _cacheService.SetData("AllAssets", smart1, DateTimeOffset.Now.AddDays(1));
            return Ok();
        }
        return NotFound();
    }

    [HttpDelete]
    [Authorize(Roles = UserRoles.Manager)]
    [Route("deleteProduct")]
    public ActionResult DeleteProduct([FromQuery(Name = "productId")] int productId)
    {
        _unitOfWorks.ProductRepository.SetStatus(productId, 3);
        if (_unitOfWorks.Commit() > 0)
        {
            var smart1 = _unitOfWorks.ProductRepository.GetAll().Result;
            if (smart1.Count() > 0)
                _cacheService.SetData("AllAssets", smart1, DateTimeOffset.Now.AddDays(1));
            return Ok("Ok");
        }

        return NotFound();
    }

    [HttpGet]
    [Route("getProduct")]
    public ActionResult<Product> GetProduct([FromQuery(Name = "productId")] int productId)
    {
        List<Product> smartphones = _cacheService.GetData<List<Product>>("AllAssets");
        if (smartphones != null)
        {
            var smart = smartphones.FirstOrDefault(x => x.Id == productId);
            if (smart != null)
                return smart;
        }
        var smart1 = _unitOfWorks.ProductRepository.GetProductById(productId);
        if (smart1 != null)
            return smart1;
        return NotFound();
    }

    [HttpGet]
    [Route("getProductCount")]
    public ActionResult<int> GetProductsCount()
    {
        List<Product> allAssets = _cacheService.GetData<List<Product>>("AllAssets");
        if(allAssets != null)
        {
            return allAssets.Count;
        }
        var smart1 = _unitOfWorks.ProductRepository.GetAll().Result;
        if (smart1.Count() > 0)
        {
            _cacheService.SetData("AllAssets", smart1, DateTimeOffset.Now.AddDays(1));
            return smart1.Count();
        }
            
        return NotFound();
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.Manager)]
    [Route("addProduct")]
    public async Task<ActionResult<bool>> AddProduct()
    {
        AzureResponce responce = await _azureClient.SendFile(Request.Form.Files[0]);
        if (responce.IsSuccess)
        {
            string url = _azureClient.GetFileUrl(responce.FileName);
            if (!url.Equals(string.Empty))
            {
                
                var pro = Request.Form["product"];
                Product product = JsonConvert.DeserializeObject<Product>(pro);
                product.Photo = url;
                _unitOfWorks.ProductRepository.Add(product);
            }
        }
        
        if (_unitOfWorks.Commit() > 0)
        {
            var smart1 = _unitOfWorks.ProductRepository.GetAll().Result;
            if (smart1.Count() > 0)
                _cacheService.SetData("AllAssets", smart1, DateTimeOffset.Now.AddDays(1));
            return Ok();
        }
        return BadRequest();
    }
    [HttpPut]
    [Authorize(Roles = UserRoles.Manager)]
    [Route("updateProduct")]
    public IActionResult UpdateProduct([FromBody]Product smartphone)
    {
        _unitOfWorks.ProductRepository.Update(smartphone);
        if (_unitOfWorks.Commit() > 0)
        {
            var smart1 = _unitOfWorks.ProductRepository.GetAll().Result;
            if (smart1.Count() > 0)
                _cacheService.SetData("AllAssets", smart1, DateTimeOffset.Now.AddDays(1));
            return Ok();
        }
            
        return BadRequest();
    }

    [HttpGet]
    [Route("findProduct")]
    public async Task<ActionResult<IEnumerable<Product>>> FindProducts([FromQuery(Name = "productName")]string productName)
    {
        List<Product> allAssets = _cacheService.GetData<List<Product>>("AllAssets");
        if (allAssets != null)
        {
            var smart = allAssets
                .Where(x => x.StatusId != 3 && x.StatusId != 2 && x.Name.ToLower().Contains(productName.ToLower()))
                .ToList();
            if (smart != null)
                return smart;
        }
        var smart1 = _unitOfWorks.ProductRepository.GetAll().Result;
        if (smart1.Count() > 0)
            _cacheService.SetData("AllAssets", smart1, DateTimeOffset.Now.AddDays(1));
        return smart1.Where(x => x.StatusId != 3 && x.StatusId != 2 && x.Name.ToLower().Contains(productName.ToLower())).ToList();

     }

    [HttpGet]
    [Route("getPopularProducts")]
    public async Task<ActionResult<IEnumerable<Product>>> GetPopular()
    {
        List<Product> allAssets = _cacheService.GetData<List<Product>>("AllAssets");
        if (allAssets != null)
        {
            var smart = allAssets.Where(x => x.StatusId == 4 && x.StatusId != 3 && x.StatusId != 2).ToList();
            if (smart != null)
                return smart;
        }
        var smart1 = _unitOfWorks.ProductRepository.GetAll().Result;
        if (smart1.Count() > 0)
            _cacheService.SetData("AllAssets", smart1, DateTimeOffset.Now.AddDays(1));
        return smart1.Where(x => x.StatusId == 4 && x.StatusId != 3 && x.StatusId != 2).ToList();
    }
}