using JWT.Cache;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces.UnitOfWorks;
using System.Collections;
using DataAcessEF.UnitOfWorks;

namespace JWT.Controllers;
[ApiController, Authorize]
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
    public async Task<ActionResult<IEnumerable<Smartphone>>> Get()
    {
        List<Smartphone> smartphones = _cacheService.GetData<List<Smartphone>>("Smartphone");
        if (smartphones == null)
        {
            var smartphonesSql =  _unitOfWorks.SmartphoneRepository.GetAll().Result.Where(x => x.StatusId != 3);
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
    public async Task<ActionResult<IEnumerable<Smartphone>>> GetByCategoryId(int categoryId) =>
        await _unitOfWorks.SmartphoneRepository.GetByCategoryId(categoryId);

    [HttpPost]
    [Route("setStatus")]
    public ActionResult SetStatus(int productId, int statusId)
    {
        _unitOfWorks.SmartphoneRepository.SetStatus(productId, statusId);
        if (_unitOfWorks.Commit() > 0)
            return Ok();
        return NotFound();
    }

    [HttpDelete]
    [Route("deleteProduct")]
    public ActionResult DeleteProduct(int productId)
    {
        _unitOfWorks.SmartphoneRepository.SetStatus(productId,3);
        if (_unitOfWorks.Commit() > 0)
        {
            List<Smartphone> smartphones = _cacheService.GetData<List<Smartphone>>("Smartphone");
            var smartphonesSql = _unitOfWorks.SmartphoneRepository.GetAll().Result.Where(x => x.StatusId != 3);
            if (smartphonesSql.Count() > 0)
            {
                _cacheService.SetData("Smartphone", smartphonesSql, DateTimeOffset.Now.AddDays(1));
                smartphones = smartphonesSql.ToList();
            }
            return Ok("Ok");
        }
            
        return NotFound();
    }

    [HttpDelete]
    [Route("getProduct")]
    public ActionResult<Smartphone> GetProduct(int productId)
    {
        List<Smartphone> smartphones = _cacheService.GetData<List<Smartphone>>("Smartphone");
        if(smartphones.Count() > 0)
        {
            var smart = smartphones.FirstOrDefault(x => x.Id == productId);
            if (smart != null)
                return smart;
            return NotFound();
        }
        var smart1 = _unitOfWorks.SmartphoneRepository.GetSmartphoneById(productId);
        if (smart1 != null)
            return smart1;
        return NotFound();

    }

}