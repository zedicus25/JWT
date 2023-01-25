using JWT.Cache;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces.UnitOfWorks;

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
            var smartphonesSql = await _unitOfWorks.SmartphoneRepository.GetAll();
            if (smartphonesSql.Count() > 0)
            {
                _cacheService.SetData("Smartphone", smartphonesSql, DateTimeOffset.Now.AddDays(1));
                smartphones = smartphonesSql.ToList();
            }
        }

        return smartphones;
    }
}