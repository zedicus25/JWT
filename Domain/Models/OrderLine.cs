using System;
using System.Collections.Generic;

namespace Domain.Models;

public partial class OrderLine
{
    public int Id { get; set; }

    public int? OrderId { get; set; }

    public int? ProductId { get; set; }

    public virtual Order? Order { get; set; }
}
