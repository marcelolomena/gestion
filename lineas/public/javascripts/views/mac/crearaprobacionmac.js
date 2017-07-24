$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var elcaption = ""

    $(".gcontainer").prepend(`
            <div id="cabecera" class="panel panel-primary">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 class="panel-title">Paso 2 de 3 - Configuración Grupo</h3>
                </div>
                <div class="panel-body">
                    <div class="form-group">
                        <p>
                            No ha sido posible encontrar MAC de Grupo asociado a este cliente </br>
                            ¿Desea buscar el grupo por otro RUT cliente?
                        </p>
                        <button id="si" class="btn btn-default">Sí</button> 
                        <button id="no" class="btn btn-default">No</button>  
                    </div>         
                </div>
                
            </div>`);

    $('#si').click(function () {
        $('#cabecera').css("display", "none");
        window.location.href = "/menu/crearaprobacion";

    });
    $('#no').click(function () {
        elcaption = "Nuevo Grupo";
        $('#cabecera').html(`<div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 class="panel-title">Paso 2 de 3 - Configuración Grupo</h3>
                     </div>
                    <div class="panel-body">
                        <p>Vincule o desvincule las empresas que conforman el grupo segun corresponda</p>
                    </div>
               `);

        var template = "<div id='responsive-form' class='clearfix'>";

        template += "<div class='form-row'>";
        template += "<div class='column-full'><span style='color:red'>* </span>Rut: {Rut}</div>";
        template += "<div class='column-full'><span style='color:red'>* </span>Nombre: {Nombre}</div>";
        template += "<div class='column-full'><span style='color:red'>* </span>Razon Social: {RazonSocial}</div>";
        template += "</div>";

        template += "<div class='form-row' style='display: none;'>";
        template += "<div class='column-full'>Nombre: {idgrupo}</div>";
        template += "<div class='column-full'>Nombre: {Id}</div>";
        template += "<div class='column-full'>Nombre: {idrelacion}</div>";
        template += "</div>";

        template += "<hr style='width:100%;'/>";
        template += "<div> {sData} {cData}  </div>";
        template += "</div>";
        var modelGrupo = [
            { label: 'Id', name: 'Id', width: 30, key: true, hidden: true, editable: true },
            {
                label: 'Rut', name: 'Rut', width: 80, hidden: false, search: true, editable: true,
                editrules: { required: true },
                editoptions: {
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var grid = $("#grid")
                            var rowKey = grid.getGridParam("selrow");
                            var rowData = grid.getRowData(rowKey);
                            //console.log("rowData:" + rowData);
                            var thissid = $(this).val();
                            $.ajax({
                                type: "GET",
                                url: '/getdatoscliente/' + thissid,
                                async: false,
                                success: function (data) {
                                    if (data.length > 0) {
                                        //console.log("glosa:" + data[0].glosaservicio);
                                        $("input#Nombre").val(data[0].Nombre);
                                        $("input#RazonSocial").val(data[0].Nombre);
                                        $("input#Id").val(data[0].Id);

                                    } else {
                                        alert("No existe cliente en Base de Datos");
                                    }
                                }
                            });
                            setTimeout(function () {
                                var rut = $('#Rut').val();
                                $.ajax({
                                    type: "GET",
                                    url: '/buscargrupo/' + rut,
                                    success: function (data) {
                                        $("input#idgrupo").val(data[0].Id);
                                    }
                                });
                            }, 500);

                        }
                    }],
                }
            },
            { label: 'idgrupo', name: 'idgrupo', hidden: true, editable: true },
            { label: 'idrelacion', name: 'idrelacion', hidden: true, editable: true },

            { label: 'Nombre', name: 'Nombre', width: 250, hidden: false, search: true, editable: true, editrules: { required: true } },
            { label: 'Razón Social', name: 'RazonSocial', width: 250, hidden: false, search: true, editable: true, editrules: { required: true } },

        ];

        $("#grid").jqGrid({
            url: '/grupoempresa/90222000',
            mtype: "GET",
            datatype: "json",
            page: 1,
            colModel: modelGrupo,
            rowNum: 10,
            regional: 'es',
            height: 'auto',
            autowidth: true,
            shrinkToFit: true,
            caption: elcaption,
            pager: "#pager",
            viewrecords: true,
            rowList: [5, 10, 20, 50],
            styleUI: "Bootstrap",
            editurl: '/grupoempresa',
            loadError: sipLibrary.jqGrid_loadErrorHandler,
            gridComplete: function () {
                var recs = $("#grid").getGridParam("reccount");
                if (isNaN(recs) || recs == 0) {

                    $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
                }
            }
        });

        $("#grid").jqGrid('navGrid', "#pager", {
            edit: false, add: true, del: true, search: false,
            refresh: true, view: false, position: "left", cloneToTop: false
        },
            {
                closeAfterEdit: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                editCaption: "Modifica Grupo",
                //template: template,
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                }
            },
            {
                closeAfterAdd: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Agregar Empresa",
                template: template,
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                },
                beforeShowForm: function (form) {
                    $("input#Nombre").prop('disabled', true);
                    $("input#RazonSocial").prop('disabled', true);
                },
                afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (result.error != "0")
                        return [false, "Error en llamada a Servidor", ""];
                    else
                        return [true, "", ""]

                }, afterShowForm: function (form) {
                    sipLibrary.centerDialog($("#grid").attr('Id'));

                },
                onclickSubmit: function (rowid) {
                    return { grupo: "1" };
                }
            },
            {
                closeAfterDelete: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Eliminar Empresa",
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                }, afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (result.success != true)
                        return [false, result.error_text, ""];
                    else
                        return [true, "", ""]
                },
                onclickSubmit: function (rowid) {
                    var rowKey = $("#grid").getGridParam("selrow");
                    var rowData = $("#grid").getRowData(rowKey);
                    var thissid = rowData.idrelacion;
                    return { idrelacion: thissid };
                }
            },
            {
                recreateFilter: true
            }
        );

        $("#pager_left").css("width", "");

        $(".gcontainer").append(`
        <div class="form-group" style="padding-top: 10px; padding-left: 15px;">
            <button id="confirmar" class="btn btn-default">Continuar</button>     
        </div>
        `);

        $('#confirmar').click(function () {
            if (confirm("¿Está seguro de continuar con esta configuración de grupo?")) {
                window.location.href = "/menu/crearaprobacionmac2";
            }
            else {
                return false;
            }
        });

    });

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });


});



