$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";
    
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Producto {idProducto}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Usuario {usuario}</div>";
    tmpl += "</div>";    

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Fecha {fechasolicitud}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Comentario Solicitud {informacion}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Estado {estado}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-half'>";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Comentario Visación {comentariovisacion}</div>";
    tmpl += "</div>"; 

    tmpl += "<div class='form-half'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Torre {torre}</div>";
    tmpl += "</div>";     

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-full'>Archivo {nombrearchivo2}</div>";
    tmpl += "</div>";         

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var viewModel = [{
        label: 'ID',
        name: 'id',
        key: true,
        hidden: true,
        editable: false
    }
    , {
        label: 'Estado',
        name: 'estado',
        width: 225,
        align: 'center',
        editable: true,
        edittype: "custom",
        editoptions: {
            custom_value: sipLibrary.getRadioElementValue,
            custom_element: sipLibrary.radioElemReserva
        },
        search: false
    },
    {
        label: 'Producto',
        name: 'idProducto',
        jsonmap: 'nombre',
        align: 'center',
        width: 225,
        editable: true,
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },
        editrules: {
            required: false,
            edithidden: false
        },
        search: false
    },
    {
        label: 'Usuario',
        name: 'usuario',
        align: 'center',
        width: 225,
        editable: true,
        search: false,
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        }        
    },    
    {
        label: 'Fecha',
        name: 'fechasolicitud',
        width: 225,
        align: 'center',
        sortable: false,
        editable: true,
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },        
        formatter: function (cellvalue, options, rowObject) {
            //2017-12-31T00:00:00.000Z
            var val = rowObject.fechasolicitud;
            if (val != null) {
                val = val.substring(0,10);
                var fechaok = val.substring(8)+'-'+val.substring(5,7)+'-'+val.substring(0,4);
                return fechaok;
            } else {
                return '';
            }
        },
        search: false
    },
    {
        label: 'Comentario de Solicitud',
        name: 'informacion',
        width: 225,
        hidden: false,
        editable: true,
        edittype: 'textarea',
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },
        editrules: {
            required: false,
            edithidden: false
        },
        search: false
    },
    {
        label: 'Tipo Instalación',
        name: 'idtipoinstalacion',
        width: 225,
        hidden: true,
        editable: false,
        search: false
    },    
    {
        label: 'Adjunto',
        name: 'nombrearchivo',
        width: 225,
        hidden: false,
        editable: true,
        search: false,
        formatter: function (cellvalue, options, rowObject) {
            var nombre = rowObject.nombrearchivo;
            var id = rowObject.id;
            if (nombre != null) {
                return "<a href='/lic/downfile/"+id+"'>"+nombre+"</a>" ;
            } else {
                return "Sin Adjunto";
            }
        },        
    },   
    {
        label: 'Nombre2',
        name: 'nombrearchivo2',
        jsonmap: 'nombrearchivo',
        width: 225,
        hidden: true,
        editable: true,
        search: false
    },       
    {
        label: 'Comentario de Visación',
        name: 'comentariovisacion',
        width: 225,
        hidden: false,
        editable: true,
        edittype: 'textarea',
        editrules: {
            required: true
        },
        search: false
    },
    {
        label: 'Torre',
        name: 'torre',
        jsonmap: 'torre',
        width: 225,
        align: 'center',
        sortable: false,
        editable: true,
        edittype: 'select', 
        editrules: {
            required: true
        },
        search: false,
        editoptions: {
            dataUrl: '/lic/torres',
            buildSelect: function (response) {
                var grid = $("#grid");
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                var thissid = rowData.torre;
                var data = JSON.parse(response);
                var s = "<select>";
                var sel=false;
                s += '<option value="0">--Escoger Torre--</option>';
                $.each(data, function (i, item) {
                    if (data[i].id == thissid) {
                        s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                    } else {
                        s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                    }
                });
                return s + "</select>";
            }
        }, dataInit: function (elem) { $(elem).width(200); }        
    }, 
];
    $("#grid").jqGrid({
        url: '/lic/instalacion-visacion',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: viewModel,
        rowNum: 10,
        regional: 'es',
        sortable: "true",
        height: 'auto',
        autowidth: true,
        shrinkToFit: false,
        forceFit: true,
        viewrecords: true,
        caption: 'Visación Instalación',
        pager: "#pager",
        rowList: [10, 20, 30, 40, 50],
        styleUI: "Bootstrap",
        editurl: '/lic/instalacion-visacion',
        subGrid: false // set the subGrid property to true to show expand buttons for each row
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#grid').jqGrid('navGrid', "#pager", {
        edit: true,
        add: false,
        del: false,    
        refresh: true,
        search: false, // show search button on the toolbar        
        cloneToTop: false
    },

        {
            editCaption: "Modifica Visación",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return [true,'Error: ' + data.responseText, ""];
            },
            beforeShowForm: function (postdata, formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                if (rowData.idtipoinstalacion == 13 || rowData.idtipoinstalacion == 15 ||  rowData.idtipoinstalacion == 3) { //Deshabilita torre en caso de tipo PC
                    window.setTimeout(function () {
                        $("#torre").attr('disabled', true);
                    }, 1000); 
                    $("#torre",formid).hide();                                           
                }             
            },
            beforeSubmit: function (postdata, formid) {
                console.log("beforeSubmit");
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                //Si es servidor revisa torre
                if (rowData.idtipoinstalacion == 14 || rowData.idtipoinstalacion == 16 ||  rowData.idtipoinstalacion == 4) {
                    if (postdata.torre == 0){
                        return [false, "Debe escoger una torre", ""];
                    } else {
                        return [true, "", ""]
                    }
                } else {
                    return [true, "", ""]
                }

            }

        },   
        {}
    );

    $('#grid').jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon glyphicon-check",
        title: "Derivar",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var rowData = grid.getRowData(rowKey);

            if (rowKey != null) {
                if (rowData.estado == 'Pendiente') {
                    if (confirm("¿Esta seguro de 'Derivar' la instalación?")) {
                        $.ajax({
                            url: "/lic/derivar/" + rowData.id,
                            dataType: 'json',
                            async: false,
                            success: function (j) {
                                console.log("j:" + j);
                                $("#grid").trigger("reloadGrid");
                                if (j.error_code == 0) {
                                    $("#grid").trigger("reloadGrid");
                                } else if (j.error_code == 10) {
                                    alert("No se pudo derivar solicitud");
                                }
                            }
                        });
                    }
                } else {
                    alert("La solicitud debe estar en estado Pendiente");
                }
            } else {
                alert("Debe seleccionar una fila");
            }
        }
    });

    $("#pager_left").css("width", "");
});

