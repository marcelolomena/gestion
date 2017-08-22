$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    $(".gcontainer").prepend(`
            <div class="panel panel-primary">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 class="panel-title">Configuración Grupo</h3>
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
                            <div class="col-xs-4" style="font-size:12px"><b><span id="banca"></span> / <span id="oficina"></span> / <span id="pep"></span></b></div>
                        </div>
                        <div class="row">    
                            <div class="col-xs-4" style="font-size:12px"><b>Ejecutivo Control: <span id="ejecutivo"></span></b></div>
                        </div>
                        <div class="row">
                            <div class="col-xs-4" style="font-size:12px"><b>Riesgo: <span id="riesgo"></span> / Rating: <span id="rating"></span></b></div>
                        </div>
                        
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
                banca = data[0].Banca;
                oficina = data[0].Oficina;
                ejecutivo = data[0].Ejecutivo;
                riesgo = data[0].Riesgo;
                rating = data[0].Rating;
                pep = data[0].Pep;
                $("#rut").html(rut)
                $("#nombre").html(nombre)
                $("#nombregrupo").html(nombregrupo)
                $("#banca").html(banca)
                $("#oficina").html(oficina)
                $("#ejecutivo").html(ejecutivo)
                $("#riesgo").html(riesgo)
                $("#rating").html(rating)
                $("#pep").html(pep)
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
                url: '/creargruponuevo/' + id + '/' + nombregrupo,
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


        var template = "<div id='responsive-form' class='clearfix'>";

        template += "<div class='form-row'>";
        template += "<div class='column-full'><span style='color:red'>* </span>Rut: {Rut}</div>";
        template += "<div class='column-full'><span style='color:red'>* </span>Nombre: {Nombre}</div>";
        template += "<div class='column-full'><span style='color:red'>* </span>Alias: {Alias}</div>";
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
                label: ' ', name: 'acomite', width: 20, hidden: false, search: true, editable: true, editrules: { required: true },
                formatter: function (cellvalue, options, rowObject) {
                    if (rowObject.Id == id) {
                        dato = '<input type="checkbox" name="acomite" value="1" checked/> '
                    }
                    else {
                        dato = '<input type="checkbox" name="acomite" value="0" /> '
                    }
                    return dato
                }
            },

            {
                label: 'Rut', name: 'Rut', width: 70, hidden: false, search: true, editable: true,
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
                                        $("input#Alias").val(data[0].Alias);
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
            { label: 'Nombre Cliente', name: 'Nombre', width: 250, hidden: false, search: true, editable: true, editrules: { required: true } },
            { label: 'Alias', name: 'Alias', width: 120, hidden: false, search: true, editable: true, editrules: { required: true } },
            { label: 'R. Grupo', name: 'ratinggrupal', width: 50, hidden: false, search: true, editable: true, editrules: { required: true } },
            { label: 'R. Indiv.', name: 'Rating', width: 50, hidden: false, search: true, editable: true, editrules: { required: true } },
            { label: 'Clasif', name: 'Riesgo', width: 50, hidden: false, search: true, editable: true, editrules: { required: true } },
            { label: 'Vig', name: 'Vigilancia', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
            { label: 'F. Vto MAC', name: 'fechavctomac', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
            {
                label: 'F. Ult Bal', name: 'fechaultbal', width: 60, hidden: false, search: true, editable: true, editrules: { required: true },
                formatter: function (cellvalue, options, rowObject) {
                    dato = '03-08-2017'
                    return dato
                }
            },
            {
                label: 'Aprobado', name: 'aprobado', width: 100, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }

            },
            {
                label: 'Utilizado', name: 'utilizado', width: 80, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }

            },
            { label: 'Ejecutivo', name: 'Ejecutivo', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
            {
                label: 'N° Grupos', name: 'numerogrupos', width: 60, hidden: false, search: true, editable: true,
                formatter: function (cellvalue, options, rowObject) {
                    dato = 1
                    return dato
                }
            },

        ];

        $("#grid").jqGrid({
            url: '/grupoempresa/' + id,
            mtype: "GET",
            datatype: "json",
            page: 1,
            colModel: modelGrupo,
            rowNum: 20,
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
                    $("input#Alias").prop('disabled', true);
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
            <button id="crearmacindividual" type="submit" class="btn neutro border ladda-button ng-scope" >Crear MAC Individuales</button> 
            
            <button id="consultarcompgrupo" type="submit" class="btn neutro border ladda-button ng-scope" >Consultar Comportamiento Grupo</button> 
        </div>
        `);

        $('#crearmacindividual').click(function () {
            if (confirm("¿Está seguro de continuar con esta configuración de grupo?")) {
                window.location.assign("/menu/crearaprobacionmac2" + "/p/" + id);
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



