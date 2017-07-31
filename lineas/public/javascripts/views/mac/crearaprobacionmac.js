$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    $(".gcontainer").prepend(`
            <div class="panel panel-primary">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 class="panel-title">Paso 2 de 3 - Configuración Grupo</h3>
                </div>
                <div class="panel-body">
                    
                    <div id="conmacgrupal" class="form-group" style="display:none;">
                        <div class="row">
                        <div class="col-xs-4" style="font-size:12px"><b><span id="rut"></span></b></div>
                        </div>
                        <div class="row">
                            <div class="col-xs-4" style="font-size:18px"><b><span id="nombre"></span></b></div>
                            <div class="col-xs-4" style="font-size:16px"><b>Grupo: <span id="nombregrupo"></span></b></div>
                        </div>
                        <div class="row">
                            <div class="col-xs-4" style="font-size:12px"><b>Banca Corporativa / Oficina Moneda / PEP</b></div>
                        </div>
                        <div class="row">    
                            <div class="col-xs-4" style="font-size:12px"><b>Ejecutivo Control: Alvaro Vidal</b></div>
                        </div>
                        <div class="row">
                            <div class="col-xs-4" style="font-size:12px"><b>Riesgo: A5 / Rating: 7.5</b></div>
                        </div>
                        <hr class="section-separations"></hr>
                        <p>Vincule o desvincule las empresas que conforman el grupo segun corresponda</p>
                    </div>
                    <div id="sinmacgrupal" class="form-group" style="display:none;">
                        <p>
                            No ha sido posible encontrar MAC de Grupo asociado a este cliente </br>
                            ¿Desea buscar el grupo por otro RUT cliente o crear grupo nuevo para el cliente seleccionado?
                        </p>
                        <button id="si" class="btn btn-default">Buscar Nuevo Cliente</button> 
                        <button id="no" class="btn btn-default">Crear Nuevo Grupo</button>  
                    </div>
                    <div id="buscarrut" class="form-group" style="display:none;">
                        <form id="paso2" onsubmit="return false;">
                            <label for="nuevorut">Ingrese RUT de Empresa:</label>
                            <input id="nuevorut" class="form-control" style="height:auto; width:auto;">
                            </input>
                            <button id="elboton" type="submit" class="btn neutro border ladda-button ng-scope" style="margin-top:15px;">Continuar</button>
                        </form>  
                    </div>
                </div>
                
            </div>`);

    var id = $("#param").text();
    var nombre = ""
    var rut = ""
    var idgrupo = ""
    var nombregrupo = ""
    var elcaption = ""
    $.ajax({
        type: "GET",
        url: '/getdatosclientecongrupo/' + id,
        async: false,
        success: function (data) {
            if (data.length > 0) {
                nombre = data[0].Nombre;
                rut = data[0].Rut;
                idgrupo = data[0].Idgrupo;
                nombregrupo = data[0].Grupo;
                $("#rut").html(rut)
                $("#nombre").html(nombre)
                $("#nombregrupo").html(nombregrupo)
                $('#conmacgrupal').css("display", "block");
                grilladegrupo(idgrupo, nombregrupo);
            } else {
                $('#sinmacgrupal').css("display", "block");
            }
        }
    });



    $('#si').click(function () {
        $('#sinmacgrupal').css("display", "none");
        $("#buscarrut").css("display", "block")
    });

    $('#elboton').click(function () {
        var nuevorut = $('#nuevorut').val();
        if (nuevorut != "") {
            $.ajax({
                type: "GET",
                url: '/getdatoscliente/' + nuevorut,
                async: false,
                success: function (data) {
                    if (data.length > 0) {
                        id = data[0].Id;
                        window.location.assign("/menu/crearaprobacionmac/p/" + id);
                    } else {
                        alert("No existe cliente en Base de Datos");
                    }
                }
            });

        } else {
            alert("Debe ingresar un RUT");
        }
    })

    $('#no').click(function () {
        var nombregrupo = prompt("Ingrese un nombre para el grupo", nombre);
        if (nombregrupo == null || nombregrupo == "") {
            alert("Debe ingresar un nombre de grupo")
        } else {
            $.ajax({
                type: "GET",
                url: '/creargruponuevo/' + id+'/'+nombregrupo,
                async: false,
                success: function (data) {
                    if (data.length > 0) {
                        window.location.assign("/menu/crearaprobacionmac/p/" + id);
                    } else {
                        alert("Error al crear grupo");
                    }
                }
            });
        }



    });
    function grilladegrupo(idgrupo, nombregrupo) {

        elcaption = "Grupo: " + nombregrupo;
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
            url: '/grupoempresa/'+id,
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
                    return { grupo: idgrupo };
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
            <button id="confirmar" type="submit" class="btn neutro border ladda-button ng-scope" >Continuar</button> 
        </div>
        `);

        $('#confirmar').click(function () {
            if (confirm("¿Está seguro de continuar con esta configuración de grupo?")) {
                window.location.assign("/menu/crearaprobacionmac2"+"/p/"+id);
            }
            else {
                return false;
            }
        });

    }

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });


});



