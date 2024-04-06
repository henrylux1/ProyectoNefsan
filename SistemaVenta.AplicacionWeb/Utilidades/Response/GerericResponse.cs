namespace SistemaVenta.AplicacionWeb.Utilidades.Response
{
    public class GerericResponse<TObject>
    {
        public bool Estado { get; set; }
        public string? Mensaje { get; set; }
        public TObject? Objeto { get; set; }
        public List<TObject>? ListaObjeto { get; set; }

    }
}
