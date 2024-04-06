using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SistemaVenta.BLL.Interfaces;
using SistemaVenta.DAL.Interfaces;
using SistemaVenta.Entity;

namespace SistemaVenta.BLL.Implementacion
{
    public class NegocioService : INegocioService
    {
        public Task<Negocio> Obtener()
        {
            throw new NotImplementedException();
        }
        public Task<Negocio> GuardarCambios(Negocio entidad, Stream Logo = null, string NombreLogo = "")
        {
            throw new NotImplementedException();
        }

       
    }
}
