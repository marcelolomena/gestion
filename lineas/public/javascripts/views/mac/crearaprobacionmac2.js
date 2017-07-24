$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var elcaption = ""

    $(".gcontainer").prepend(`
            <div id="cabecera" class="panel panel-primary">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 class="panel-title">Paso 3 de 3 - Creación MAC Individuales</h3>
                </div>
                <div class="panel-body">
                    <div class="form-group">
                        <p>
                            Seleccione las empresas que desea presentar a comité para crear los MAC individuales
                        </p>  
                    </div>         
                </div>
                
            </div>`);

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
        caption: "Grupo",
        pager: "#pager",
        multiselect: true,
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
        edit: false, add: false, del: false, search: false,
        refresh: false, view: false, position: "left", cloneToTop: false
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

    $("#pager").css("height", "50px");

    $("#grid").jqGrid('navButtonAdd', "#pager", {
        caption: '<button class="btn btn-default">Guardar y Crear MAC Individuales</button>',
        buttonicon: "",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var $grid = $("#grid")
            var selIds = $grid.jqGrid("getGridParam", "selarrrow")
            if(selIds!=""){
                var i, n;
                var cellValues = [];
                var alerta = "Se creará el MAC Grupal y Mac Individuales para las siguientes empresas: \n"
                for (i = 0, n = selIds.length; i < n; i++) {
                    alerta += $grid.jqGrid("getCell", selIds[i], "Nombre") + "\n";
                    cellValues.push($grid.jqGrid("getCell", selIds[i], "Id"));
                }
                if (confirm(alerta)) {
                    window.location.href = "/menu/macindividuales";
                }
                else {
                    return false;
                };
            }else{
                alert("Debe seleccionar al menos una empresa");
            }

        }
    });

    $("#pager_left").css("width", "");

    $(".gcontainer").append(`
        `);



    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });


});



