﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SistemaVenta.AplicacionWeb.Controllers
{
    [Authorize]
    public class NuevaVentaCreditoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
