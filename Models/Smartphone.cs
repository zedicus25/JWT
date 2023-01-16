using System;
using System.Collections.Generic;

namespace JWT.Models;

public partial class Smartphone
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Model { get; set; } = null!;

    public double? Price { get; set; }

    public string? Photo { get; set; }
}
