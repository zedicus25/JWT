using System;
using System.Collections.Generic;

namespace Domain.Models;

public partial class Order
{
    public int Id { get; set; }

    public DateTime OrderTime { get; set; }

    public double? TotalPrice { get; set; }

    public string? UserId { get; set; }

    public int? ProductsCount { get; set; }

    public virtual ICollection<OrderLine> OrderLines { get; } = new List<OrderLine>();
}
