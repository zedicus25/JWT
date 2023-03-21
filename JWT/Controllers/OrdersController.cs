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
            try
            {
                List<Order> orders = _cacheService.GetData<List<Order>>("AllOrders");
                if (orders == null)
                {
                    var ordersSql = _unitOfWorks.OrderRepository.GetAll().Result.ToList();
                    if (ordersSql.Count() > 0)
                    {
                        _cacheService.SetData("AllOrders", ordersSql, DateTimeOffset.Now.AddDays(1));
                        orders = ordersSql.ToList();
                    }
                }
                return orders.ToList();
            }
            catch (Exception ex)
            {
            }
            return _unitOfWorks.OrderRepository.GetAll().Result.ToList();
        }


        [HttpPost]
        [Authorize(Roles = UserRoles.User)]
        [Route("createOrder")]
        public async Task<ActionResult<IEnumerable<Order>>> CreateOrder([FromQuery(Name = "productsId")] int[] productsId, [FromQuery(Name = "userName")] string userName, [FromQuery(Name = "totalPrice")] float totalPrice)
        {
            Order order = new Order();
            order.OrderTime = DateTime.Now;
            order.ProductsCount = productsId.Length;
            order.TotalPrice = totalPrice;
            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
                return BadRequest("User dont found!");

            order.UserId = user.Id;

            _unitOfWorks.OrderRepository.Add(order);

            if (_unitOfWorks.Commit() > 0)
            {
                var orders = _unitOfWorks.OrderRepository.GetAll().Result;
                try
                {
                    if (orders.Count() > 0)
                        _cacheService.SetData("AllOrders", orders, DateTimeOffset.Now.AddDays(1));
                }
                catch (Exception)
                {
                }
                CreateOrdersLines(productsId);
                if(_unitOfWorks.Commit() > 0)
                {
                    return Ok();
                }

                return BadRequest("Something went wrong!");
                
            }

            return BadRequest();
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.User)]
        [Route("userOrders")]
        public async Task<ActionResult<IEnumerable<Order>>> GetByUserId([FromQuery(Name = "userId")]string userId)
        {
            try
            {
                List<Order> orders = _cacheService.GetData<List<Order>>("AllOrders");
                if (orders == null)
                {
                    var ordersSql = _unitOfWorks.OrderRepository.GetAll().Result.ToList();
                    if (ordersSql.Count() > 0)
                    {
                        _cacheService.SetData("AllOrders", ordersSql, DateTimeOffset.Now.AddDays(1));
                        orders = ordersSql.ToList();
                    }
                }
                return orders.Where(or => or.UserId.Equals(userId)).ToList();
            }
            catch (Exception ex)
            {
            }
            return _unitOfWorks.OrderRepository.GetAll().Result.Where(or => or.UserId.Equals(userId)).ToList();
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
    }
}
