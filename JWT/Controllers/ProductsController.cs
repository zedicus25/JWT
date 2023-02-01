using JWT.Cache;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces.UnitOfWorks;
using JWT.Roles;

namespace JWT.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IUnitOfWorks _unitOfWorks;
    private readonly ICacheService _cacheService;

    public ProductsController(IUnitOfWorks unitOfWorks, ICacheService cacheService)
    {
        _unitOfWorks = unitOfWorks;
        _cacheService = cacheService;
    }

    [HttpGet]
    [Route("productsList")]
    public async Task<ActionResult<IEnumerable<Product>>> Get()
    {
        List<Product> smartphones = _cacheService.GetData<List<Product>>("Smartphone");
        if (smartphones == null)
        {
            var smartphonesSql = _unitOfWorks.ProductRepository.GetAll().Result.Where(x => x.StatusId != 3);
            if (smartphonesSql.Count() > 0)
            {
                _cacheService.SetData("Smartphone", smartphonesSql, DateTimeOffset.Now.AddDays(1));
                smartphones = smartphonesSql.ToList();
            }
        }

        return smartphones;
    }

    [HttpGet]
    [Route("getProductsInCategory")]
    public async Task<ActionResult<IEnumerable<Product>>> GetByCategoryId(int categoryId) =>
        await _unitOfWorks.ProductRepository.GetByCategoryId(categoryId);

    [HttpPost]
    [Authorize(Roles = UserRoles.Admin)]
    [Route("setStatus")]
    public ActionResult SetStatus(int productId, int statusId)
    {
        _unitOfWorks.ProductRepository.SetStatus(productId, statusId);
        if (_unitOfWorks.Commit() > 0)
            return Ok();
        return NotFound();
    }

    [HttpDelete]
    [Route("deleteProduct")]
    public ActionResult DeleteProduct(int productId)
    {
        _unitOfWorks.ProductRepository.SetStatus(productId, 3);
        if (_unitOfWorks.Commit() > 0)
        {
            List<Product> smartphones = _cacheService.GetData<List<Product>>("Smartphone");
            var smartphonesSql = _unitOfWorks.ProductRepository.GetAll().Result.Where(x => x.StatusId != 3);
            if (smartphonesSql.Count() > 0)
            {
                _cacheService.SetData("Smartphone", smartphonesSql, DateTimeOffset.Now.AddDays(1));
                smartphones = smartphonesSql.ToList();
            }
            return Ok("Ok");
        }

        return NotFound();
    }

    [HttpGet]
    [Route("getProduct")]
    public ActionResult<Product> GetProduct(int productId)
    {
        List<Product> smartphones = _cacheService.GetData<List<Product>>("Smartphone");
        if (smartphones.Count() > 0)
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

    [HttpPost]
    [Route("addProduct")]
    public IActionResult AddProduct(Product smartphone)
    {
        _unitOfWorks.ProductRepository.Add(smartphone);
        if (_unitOfWorks.Commit() > 0)
            return Ok();
        return BadRequest();
    }
    [HttpPut]
    [Route("updateProduct")]
    public IActionResult UpdateProduct(Product smartphone)
    {
        _unitOfWorks.ProductRepository.Update(smartphone);
        if (_unitOfWorks.Commit() > 0)
            return Ok();
        return BadRequest();
    }

    [HttpGet]
    [Route("findProduct")]
    public async Task<ActionResult<IEnumerable<Product>>> FindProducts(string productName)
    {
        var smart1 = _unitOfWorks.ProductRepository.GetAll().Result.Where(x => x.Name.ToLower().Contains(productName.ToLower()));
        if (smart1 != null)
            return smart1.ToList();
        return NotFound();

     }
}