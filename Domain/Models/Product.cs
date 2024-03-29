﻿using System;
using System.Collections.Generic;

namespace Domain.Models;

public partial class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public double? Price { get; set; }

    public string? Photo { get; set; }

    public int? CategoryId { get; set; }

    public int? SubCategoryId { get; set; }

    public int? Quantity { get; set; }

    public int? Sold { get; set; }

    public int? StatusId { get; set; }

    public string? LinkToFile { get; set; }

    public virtual Category? Category { get; set; }

    public virtual Status? Status { get; set; }

    public virtual SubCategory? SubCategory { get; set; }
}
