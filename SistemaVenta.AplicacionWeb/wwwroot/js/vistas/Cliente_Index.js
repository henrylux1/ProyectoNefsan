const MODELO_BASE_CLIENTE = {
    idCliente: 0,
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    esActivo: 1,
    urlFoto: ""
}

let tablaDataClientes;

$(document).ready(function () {

    tablaDataClientes = $('#tbdataClientes').DataTable({
        responsive: true,
        "ajax": {
            "url": '/Cliente/Lista',
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "idCliente", "visible": false, "searchable": false },
            {
                "data": "urlFoto", render: function (data) {
                    return `<img style="height:60px" src=${data} class="rounded mx-auto d-block"/>`
                }
            },
            { "data": "nombre" },
            { "data": "correo" },
            { "data": "telefono" },
            { "data": "direccion" },
            {
                "data": "esActivo", render: function (data) {
                    if (data == 1)
                        return '<span class="badge badge-info">Activo</span>';
                    else
                        return '<span class="badge badge-danger">No Activo</span>';
                }
            },
            {
                "defaultContent": '<button class="btn btn-primary btn-editar btn-sm mr-2"><i class="fas fa-pencil-alt"></i></button>' +
                    '<button class="btn btn-danger btn-eliminar btn-sm"><i class="fas fa-trash-alt"></i></button>',
                "orderable": false,
                "searchable": false,
                "width": "80px"
            }
        ],
        order: [[0, "desc"]],
        dom: "Bfrtip",
        buttons: [
            {
                text: 'Exportar Excel',
                extend: 'excelHtml5',
                title: '',
                filename: 'Reporte Clientes',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6]
                }
            }, 'pageLength'
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        },
    });

})


function mostrarModalClientes(modelo = MODELO_BASE_CLIENTE) {
    $("#txtIdCliente").val(modelo.idCliente)
    $("#txtNombreCliente").val(modelo.nombre)
    $("#txtCorreoCliente").val(modelo.correo)
    $("#txtTelefonoCliente").val(modelo.telefono)
    $("#txtDireccionCliente").val(modelo.direccion)
    $("#cboEstadoCliente").val(modelo.esActivo)
    $("#txtFotoCliente").val("")
    $("#imgCliente").attr("src", modelo.urlFoto)


    $("#modalDataClientes").modal("show")
}

$("#btnNuevoCliente").click(function () {
    mostrarModalClientes()
})


$("#btnGuardarCliente").click(function () {

    const inputs = $("input.input-validar-cliente").serializeArray();
    const inputs_sin_valor = inputs.filter((item) => item.value.trim() == "")

    if (inputs_sin_valor.length > 0) {
        const mensaje = `Debe completar el campo : "${inputs_sin_valor[0].name}"`;
        toastr.warning("", mensaje)
        $(`input[name="${inputs_sin_valor[0].name}"]`).focus()
        return;
    }

    const modeloCliente = structuredClone(MODELO_BASE_CLIENTE);
    modeloCliente["idCliente"] = parseInt($("#txtIdCliente").val())
    modeloCliente["nombre"] = $("#txtNombreCliente").val()
    modeloCliente["correo"] = $("#txtCorreoCliente").val()
    modeloCliente["telefono"] = $("#txtTelefonoCliente").val()
    modeloCliente["direccion"] = $("#txtDireccionCliente").val()
    modeloCliente["esActivo"] = $("#cboEstadoCliente").val()

    const inputFotoCliente = document.getElementById("txtFotoCliente")

    const formDataCliente = new FormData();

    formDataCliente.append("foto", inputFotoCliente.files[0])
    formDataCliente.append("modelo", JSON.stringify(modeloCliente))

    $("#modalDataClientes").find("div.modal-content").LoadingOverlay("show");

    if (modeloCliente.idCliente == 0) {

        fetch("/Cliente/Crear", {
            method: "POST",
            body: formDataCliente
        })
            .then(response => {
                $("#modalDataClientes").find("div.modal-content").LoadingOverlay("hide");
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then(responseJson => {

                if (responseJson.estado) {

                    tablaDataClientes.row.add(responseJson.objeto).draw(false)
                    $("#modalDataClientes").modal("hide")
                    swal("Listo!", "El cliente fue creado", "success")
                } else {
                    swal("Los sentimos", responseJson.mensaje, "error")
                }
            })
    } else {
        fetch("/Cliente/Editar", {
            method: "PUT",
            body: formDataCliente
        })
            .then(response => {
                $("#modalDataClientes").find("div.modal-content").LoadingOverlay("hide");
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then(responseJson => {

                if (responseJson.estado) {

                    tablaDataClientes.row(filaSeleccionadaCliente).data(responseJson.objeto).draw(false);
                    filaSeleccionadaCliente = null;
                    $("#modalDataClientes").modal("hide")
                    swal("Listo!", "El cliente fue modificado", "success")
                } else {
                    swal("Los sentimos", responseJson.mensaje, "error")
                }
            })

    }


})

let filaSeleccionadaCliente;
$("#tbdataClientes tbody").on("click", ".btn-editar", function () {

    if ($(this).closest("tr").hasClass("child")) {
        filaSeleccionadaCliente = $(this).closest("tr").prev();
    } else {
        filaSeleccionadaCliente = $(this).closest("tr");
    }

    const data = tablaDataClientes.row(filaSeleccionadaCliente).data();

    mostrarModalClientes(data);

})

$("#tbdataClientes tbody").on("click", ".btn-eliminar", function () {

    let filaCliente;
    if ($(this).closest("tr").hasClass("child")) {
        filaCliente = $(this).closest("tr").prev();
    } else {
        filaCliente = $(this).closest("tr");
    }

    const dataCliente = tablaDataClientes.row(filaCliente).data();

    swal({
        title: "¿Está seguro?",
        text: `Eliminar al cliente "${dataCliente.nombre}"`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "No, cancelar",
        closeOnConfirm: false,
        closeOnCancel: true
    },
        function (respuesta) {

            if (respuesta) {

                $(".showSweetAlert").LoadingOverlay("show");


