using Domain.Interfaces.UnitOfWorks;
using Domain.Models;
using JWT.Cache;
using JWT.Roles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace JWT.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IUnitOfWorks _unitOfWorks;
        private readonly ICacheService _cacheService;
        private readonly UserManager<IdentityUser> _userManager;

        public OrdersController(IUnitOfWorks unitOfWorks, ICacheService cacheService, UserManager<IdentityUser> userManager)
        {
            _unitOfWorks = unitOfWorks;
            //_cacheService = cacheService;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.Manager)]
        [Route("ordersList")]
        public async Task<ActionResult<IEnumerable<Order>>> Get()
        {
            var data = await TryGetDataFromCache();
            return data.ToList();
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.User)]
        [Route("createOrder")]
        public async Task<ActionResult<IEnumerable<Order>>> CreateOrder([FromQuery(Name = "productsId")] int[] productsId, [FromQuery(Name = "userName")] string userName, [FromQuery(Name = "totalPrice")] float totalPrice)
        {
            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
                return BadRequest("User dont found!");

            _unitOfWorks.OrderRepository.Add(new Order { OrderTime = DateTime.Now, 
                ProductsCount = productsId.Length, 
                TotalPrice = totalPrice, 
                UserId = user.Id});

            if (_unitOfWorks.Commit() > 0)
            {
                await SetDataToCache();
                CreateOrdersLines(productsId);
                if(_unitOfWorks.Commit() > 0)
                    return Ok();

                return BadRequest("Something went wrong!");
            }

            return BadRequest();
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.User)]
        [Route("userOrders")]
        public async Task<ActionResult<IEnumerable<Order>>> GetByUserId([FromQuery(Name = "userId")]string userId)
        {
            var data = await TryGetDataFromCache();
            return data.Where(or => or.UserId.Equals(userId)).ToList();
        }
        private void CreateOrdersLines(int[] productsId)
        {
            Order dbOrder = _unitOfWorks.OrderRepository.GetAll().Result.LastOrDefault();
            if (dbOrder == null)
                throw new NullReferenceException("No orders in db");


            List<Product> allProducts = _unitOfWorks.ProductRepository.GetAll().Result.ToList();

            foreach (int id in productsId)
            {
                if (allProducts.FirstOrDefault(x => x.Id == id) != null)
                {
                    OrderLine line = new OrderLine { ProductId = id, OrderId = dbOrder.Id };
                    _unitOfWorks.OrderLinesRepository.Add(line);
                }
            }
        }

        private async Task SetDataToCache()
        {
            try
            {
                var smart1 = await _unitOfWorks.OrderRepository.GetAll();
                if (smart1.Count() > 0)
                    _cacheService.SetData("AllOrders", smart1, DateTimeOffset.Now.AddDays(1));
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
        private async Task<IEnumerable<Order>> TryGetDataFromCache()
        {
            try
            {
                List<Order> assets = _cacheService.GetData<List<Order>>("AllOrders");
                if (assets != null)
                    return assets;

                await SetDataToCache();
            }
            catch (Exception)
            {
            }

            return await _unitOfWorks.OrderRepository.GetAll();
        }
    }
}
