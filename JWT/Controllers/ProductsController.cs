using JWT.Cache;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces.UnitOfWorks;
using JWT.Roles;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;
using JWT.Statuses;

namespace JWT.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IUnitOfWorks _unitOfWorks;
    private readonly ICacheService _cacheService;
    private readonly AzureClient _azureClient;
    private readonly UserManager<IdentityUser> _userManager;

    public ProductsController(IUnitOfWorks unitOfWorks, ICacheService cacheService, UserManager<IdentityUser> userManager)
    {
        _unitOfWorks = unitOfWorks;
        //_cacheService = cacheService;
        _azureClient = new AzureClient();
        _userManager = userManager;
    }

    [HttpGet]
    [Route("productsList")]
    public async Task<ActionResult<IEnumerable<Product>>> Get()
    {
        var data = await TryGetDataFromCache();
        return data.Where(x => x.StatusId != ((int)ProductStatuses.Deleted) 
        && x.StatusId != ((int)ProductStatuses.UnVisible)).ToList();
    }

    [HttpGet]
    [Route("getProductsInCategory")]
    public async Task<ActionResult<IEnumerable<Product>>> GetByCategoryId([FromQuery(Name = "categoryId")] int categoryId)
    {
        var data = await TryGetDataFromCache();
        return data.Where(x => x.CategoryId == categoryId && x.StatusId != ((int)ProductStatuses.Deleted)
        && x.StatusId != ((int)ProductStatuses.UnVisible)).ToList();
    }

    [HttpGet]
    [Route("getProductsInSubCategories")]
    public async Task<ActionResult<IEnumerable<Product>>> GetBySubCategories([FromQuery(Name = "categoriesId")] int[] categoriesId,
        [FromQuery(Name = "categoryId")] int categoryId)
    {
        var data = await TryGetDataFromCache();
        return data.Where(x => categoriesId.Any(c => c == x.SubCategoryId)
        && x.CategoryId == categoryId && x.StatusId != ((int)ProductStatuses.Deleted)
        && x.StatusId != ((int)ProductStatuses.UnVisible)).ToList();
    }


    [HttpPost]
    [Authorize(Roles = UserRoles.Manager)]
    [Route("setStatus")]
    public async Task<ActionResult> SetStatus([FromQuery(Name = "productId")] int productId, [FromQuery(Name = "statusId")] int statusId)
    {
        _unitOfWorks.ProductRepository.SetStatus(productId, statusId);
        if (_unitOfWorks.Commit() > 0)
        {
            await SetDataToCache();   
            return Ok();
        }

        return NotFound();
    }

    [HttpDelete]
    [Authorize(Roles = UserRoles.Manager)]
    [Route("deleteProduct")]
    public async Task<ActionResult> DeleteProduct([FromQuery(Name = "productId")] int productId)
    {
        _unitOfWorks.ProductRepository.SetStatus(productId, 3);
        if (_unitOfWorks.Commit() > 0)
        {
            await SetDataToCache();      
            return Ok("Ok");
        }

        return NotFound();
    }

    [HttpGet]
    [Route("getProduct")]
    public async Task<ActionResult<Product>> GetProduct([FromQuery(Name = "productId")] int productId)
    {
        var data = await TryGetDataFromCache();
        var prod = data.FirstOrDefault(x => x.Id == productId && x.StatusId != ((int)ProductStatuses.Deleted)
        && x.StatusId != ((int)ProductStatuses.UnVisible));
        if (prod == null)
            return NotFound();

        return prod;
    }

    [HttpGet]
    [Route("getProductCount")]
    public async Task<ActionResult<int>> GetProductsCount()
    {
        var data = await TryGetDataFromCache();
        return data.Count();
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.Manager)]
    [Route("addProduct")]
    public async Task<ActionResult<bool>> AddProduct()
    {
        AzureResponce photoResponce = await _azureClient.SendFile(Request.Form.Files[0]);
        AzureResponce assetFileReponce = await _azureClient.SendFile(Request.Form.Files[1]);
        if (photoResponce.IsSuccess && assetFileReponce.IsSuccess)
        {
            string photoUrl = _azureClient.GetFileUrl(photoResponce.FileName);
            string assetUrl = _azureClient.GetFileUrl(assetFileReponce.FileName);
            if (!photoUrl.Equals(string.Empty) && !assetUrl.Equals(string.Empty))
            {

                var pro = Request.Form["product"];
                Product product = JsonConvert.DeserializeObject<Product>(pro);
                product.Photo = photoUrl;
                product.LinkToFile = assetUrl;
                _unitOfWorks.ProductRepository.Add(product);
            }
        }

        if (_unitOfWorks.Commit() > 0)
            await SetDataToCache();

        return BadRequest();
    }

    [HttpPut]
    [Authorize(Roles = UserRoles.Manager)]
    [Route("updateProduct")]
    public async Task<IActionResult> UpdateProduct([FromBody] Product smartphone)
    {
        _unitOfWorks.ProductRepository.Update(smartphone);
        if (_unitOfWorks.Commit() > 0)
        {
            await SetDataToCache();
            return Ok();
        }

        return BadRequest();
    }

    [HttpGet]
    [Route("findProduct")]
    public async Task<ActionResult<IEnumerable<Product>>> FindProducts([FromQuery(Name = "productName")] string productName)
    {
        var data = await TryGetDataFromCache();
        return data.Where(x => x.StatusId != ((int)ProductStatuses.Deleted) 
        && x.StatusId != ((int)ProductStatuses.UnVisible)
        && x.Name.ToLower().Contains(productName.ToLower())).ToList();
    }

    [HttpGet]
    [Route("getPopularProducts")]
    public async Task<ActionResult<IEnumerable<Product>>> GetPopular()
    {
        var data = await TryGetDataFromCache();
        return data.Where(x => x.StatusId != ((int)ProductStatuses.Deleted)
        && x.StatusId != ((int)ProductStatuses.UnVisible) 
        && x.StatusId == (int)ProductStatuses.Popular).ToList();
    }

    [HttpGet]
    [Authorize(Roles = UserRoles.User)]
    [Route("orderProducts")]
    public async Task<ActionResult<IEnumerable<Product>>> GetOrderLines([FromQuery(Name = "orderId")] int orderId)
    {
        var orderLines = _unitOfWorks.OrderLinesRepository.GetAll().Result.Where(x => x.OrderId == orderId);
        var assets = await TryGetDataFromCache();
        return assets.Where(x => orderLines.Any(p => p.ProductId == x.Id)).ToList();
    }

    [HttpGet]
    [Authorize(Roles = UserRoles.User)]
    [Route("buyedProducts")]
    public async Task<ActionResult<IEnumerable<Product>>> GetBuyedProducts([FromQuery(Name = "userLogin")] string userLog) 
    {
        var user = await _userManager.FindByNameAsync(userLog);

        if (user == null)
            return BadRequest("User dont found!");

        List<Order> orders = _unitOfWorks.OrderRepository.GetAll().Result.Where(x => x.UserId == user.Id).ToList();
        orders.Distinct();

        List<OrderLine> ordersLines = new List<OrderLine>();
        var allLines = await _unitOfWorks.OrderLinesRepository.GetAll();
        
        foreach (var item in orders)
            ordersLines.AddRange(allLines.Where(x => x.OrderId == item.Id));

        allLines.Distinct();

        var allProducts = await TryGetDataFromCache();
        HashSet<Product> results = new HashSet<Product>();
        foreach(var item in ordersLines)
            results.Add(allProducts.FirstOrDefault(x => x.Id == item.ProductId));

        return results;
    }

    private async Task SetDataToCache()
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
    private async Task<IEnumerable<Product>> TryGetDataFromCache()
    {
        try
        {
            List<Product> assets = _cacheService.GetData<List<Product>>("AllAssets");
            if (assets != null)
                return assets;

            await SetDataToCache();
        }
        catch (Exception)
        {
        }

        return await _unitOfWorks.ProductRepository.GetAll();
    }
}