$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    $(".gcontainer").prepend(`
            <div class="panel panel-primary">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 class="panel-title">Información Grupo</h3>
                </div>
                <div class="panel-body">
                    <div id="cabecera" class="form-group">
                        <div class="row">
                            <div class="col-xs-4" style="font-size:16px"><b>Nombre Grupo:</b> <span id="nombregrupo"></span></div>
                            <div class="col-xs-4" style="font-size:16px"><b>Ejecutivo:</b> <span id="ejecutivo"></span></div>
                        </div>
                        <div class="row">
                            <div class="col-xs-4" style="font-size:16px"><b>Fecha Presentación:</b> <span id="fechapresentacion"></span></div>
                            <div class="col-xs-4" style="font-size:16px"><b>Vcto. Ant:</b> <span id="vencimientoanterior"></span></div>
                            
                        </div>
                    </div> 
                </div>
                
            </div>`);

    var idcabecera = $("#param").text();
    var nombre = ""
    var rut = ""
    var idgrupo = ""
    var nombregrupo = ""
    var elcaption = ""
    $.ajax({
        type: "GET",
        url: '/getdatosmacgrupal/' + idcabecera,
        async: false,
        success: function (data) {
            if (data.length > 0) {
                nombregrupo = data[0].nombregrupo;
                idgrupo = data[0].idgrupo;
                $("#nombregrupo").html(nombregrupo)
                $("#ejecutivo").html(ejecutivo)
                grilladegrupo(idcabecera, nombregrupo);
            } else {
                alert("No existe MAC Grupo con ID: "+idcabecera)
            }
        }
    });

    
    function grilladegrupo(idcabecera, nombregrupo) {
        $("#gridMaster").prepend(`
                <div class="form-group" style="padding-top: 10px; padding-left: 15px;">
                    <button id="crearmacindividual" type="submit" class="btn neutro border ladda-button ng-scope" >Crear MAC Individuales</button> 
                    
                    <button id="compgrupo" type="submit" class="btn neutro border ladda-button ng-scope" >Comportamiento Grupo</button> 

                    <button id="modificarmacs" type="submit" class="btn neutro border ladda-button ng-scope" >Modificar MACs</button> 
                </div>
                `);

        elcaption = "Selección de Empresas para: " + nombregrupo;


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
                label: ' ', name: 'Acomite', width: 20, hidden: false, search: true, editable: true, editrules: { required: true },
                formatter: function (cellvalue, options, rowObject) {
                    if (cellvalue == 2) { 
                        dato = '<input type="checkbox" name="acomite" value="1" onclick="$(this).val(this.checked ? 1 : 0)" checked/> '
                    }
                    else {
                        dato = '<input type="checkbox" name="acomite" value="0" onclick="$(this).val(this.checked ? 1 : 0)" /> '
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
                                        $("input#grupoid").val(data[0].Id);

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
            { label: 'idcabecera', name: 'idcabecera', hidden: true, editable: true },
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
            url: '/grupoempresanew/' + idcabecera,
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
            editurl: '/grupoempresanew',
            loadError: sipLibrary.jqGrid_loadErrorHandler,
            gridComplete: function () {
                var recs = $("#grid").getGridParam("reccount");
                if (isNaN(recs) || recs == 0) {

                    $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
                }
                
            },
            loadComplete: function () {

                $('#crearmacindividual').click(function () {
                    var $grid = $("#grid")
                    var rows = $grid.getDataIDs();
                    //console.dir(rows)
                    var cellValues = [];
                    var alerta = "Se creará el MAC Grupal y Mac Individuales para las siguientes empresas: \n"
                    for (var i = 0; i < rows.length; i++) {
                        var data = $grid.getRowData(rows[i]);
                        //console.dir(data)
                        var acomite = data.Acomite.substring(45,46);
                        //console.log(acomite)
                        if (parseInt(acomite) == 1) {
                            alerta += $grid.jqGrid("getCell", rows[i], "Nombre") + "\n";
                            cellValues.push(
                                {
                                    "id": $grid.jqGrid("getCell", rows[i], "Id"),
                                    "nombre": $grid.jqGrid("getCell", rows[i], "Nombre"),
                                    "rut": $grid.jqGrid("getCell", rows[i], "Rut")
                                });
                        }
                    }
                    //console.dir(cellValues)
                    if (confirm(alerta)) {
                        $.ajax({
                            url: '/crearmacgrupal/' + idgrupo,
                            type: 'POST',
                            async: false,
                            data: JSON.stringify({ empresas: cellValues }),
                            contentType: 'application/json',
                            dataType: 'json',
                            success: function (data) {
                                if (data.error == 0) {
                                    var idmacgrupal = data.macgrupal.Id;
                                    console.log(idmacgrupal);
                                    window.location.href = "/menu/macgrupal/p/" + idmacgrupal;
                                } else {
                                    alert("Algo falló :(")
                                }

                            }
                        });

                    }
                    else {
                        return false;
                    };
                    if (confirm("¿Está seguro de continuar con esta configuración de grupo?")) {
                        window.location.assign("/menu/crearaprobacionmac2" + "/p/" + id);
                    }
                    else {
                        return false;
                    }
                });
                
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
                    return { grupo: idgrupo, cabecera: idcabecera };
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
                    var thissid = rowData.idcabecera;
                    return { cabecera: thissid };
                }
            },
            {
                recreateFilter: true
            }
        );

        $("#pager_left").css("width", "");

    }

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });

    var idmacgrupal = $("#param").text();
    var nombre = ""
    var rut = ""
    var idgrupo = ""
    var nombregrupo = ""
    var elcaption = ""
    $("#gridMaster").append(`
            <div class="panel panel-primary" id="accordion" style="width: 1440px">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161; cursor: pointer;' data-toggle="collapse" data-parent="#accordion" data-target="#contenido" aria-expanded="true">
                    <h3 class="panel-title"> MAC Individuales</h3>
                </div>
                <div class="panel-body" id="contenido">
                    <hr class="section-separations"></hr>
                    <ul class='nav nav-tabs tabs-up' id='myTabGrupal'>
                        <li><a href='/macindividuales/` + idmacgrupal+`' data-target='#vermacgrupal' id='vermacgrupal_tab' data-toggle='tabgrupal'>Grupo</a></li>
                        <li><a href='/aprobacion/' data-target='#aprobacion' id='aprobacion_tab' data-toggle='tabgrupal'>MAC Individual</a></li>
                        <li><a href='/bitacora/' data-target='#bitacora' id='bitacora_tab' data-toggle='tabgrupal'>Bitacora</a></li>
                    </ul>
                    <div class='tab-content'>
                        <div class='tab-pane active' id='vermacgrupal'><div class='container-fluid'><table id='vermacgrupal_t'></table><div id='navGridVermacGrupal'></div></div></div>
                        <div class='tab-pane' id='aprobacion'><table id='aprobacion_t'></table><div id='navGridAprob'></div></div>
                        <div class='tab-pane' id='bitacora'><table id='bitacora_t'></table><div id='navGridBita'></div></div>
                    </div>
                </div>
            </div> `)


    
    $('#vermacgrupal_tab').addClass('media_node active span')
    $('.active[data-toggle="tabgrupal"]').each(function (e) {
        var $this = $(this),
            loadurlgrupal = $this.attr('href'),
            targgrupal = $this.attr('data-target');
        if (targgrupal === '#vermacgrupal') {
            //gridVermacgrupal.renderGrid(loadurlgrupal, targgrupal)
        } else if (targ === '#aprobacion') {
            //gridAprobacion.renderGrid(loadurlgrupal, targgrupal)
        }
        $this.tab('show');
        return false;
    });

    $('[data-toggle="tabgrupal"]').click(function (e) {
        var $this = $(this),
            loadurlgrupal = $this.attr('href'),
            targgrupal = $this.attr('data-target');
        if (targgrupal === '#vermacgrupal') {
            //gridVermacgrupal.renderGrid(loadurlgrupal, targgrupal)
        } else if (targgrupal === '#aprobacion') {
            //gridAprobacion.renderGrid(loadurlgrupal, targgrupal)
        }

        $this.tab('show');
        return false;
    });
/*
    $.ajax({
        type: "GET",
        url: '/getmacindividuales/' + idmacgrupal,
        async: false,
        success: function (data) {
            if (data.length > 0) {
                var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
                for (t in data) {
                    tabs += "<li><a href='/macindividual/" + data[t].Id + "' data-target='#mac" + data[t].Id + "' id='mac" + data[t].Id + "_tab' data-toggle='tab'>" + data[t].Nombre + "</a></li>"
                }
                tabs += "</ul>"
                tabs += "<div class='tab-content'>"
                for (t in data) {
                    if (t == 0) {
                        tabs += "<div class='tab-pane active' id='mac" + data[t].Id + "'><div class='container-fluid'><table id='mac" + data[t].Id + "_t'></table><div id='navGridmac" + data[t].Id + "'></div></div></div>"
                    } else {
                        tabs += "<div class='tab-pane' id='mac" + data[t].Id + "'><div class='container-fluid'><table id='mac" + data[t].Id + "_t'></table><div id='navGridmac" + data[t].Id + "'></div></div></div>"
                    }
                }
                tabs += "</div>"
                $("#gridMaster").append(tabs);
                $('#mac' + data[0].Id + '_tab').addClass('media_node active span')

                $('.active[data-toggle="tab"]').each(function (e) {
                    var $this = $(this),
                        loadurl = $this.attr('href'),
                        targ = $this.attr('data-target');
                    console.log("hola mac " + targ)
                    gridMacIndividual.renderGrid(loadurl, targ)
                    $this.tab('show');
                    return false;
                });

                $('[data-toggle="tab"]').click(function (e) {
                    var $this = $(this),
                        loadurl = $this.attr('href'),
                        targ = $this.attr('data-target');
                    console.log("hola mac " + targ)
                    gridMacIndividual.renderGrid(loadurl, targ)
                    $this.tab('show');
                    return false;
                });

            } else {
                alert("No existen MAC Individuales")
            }
        }
    });
*/

});



