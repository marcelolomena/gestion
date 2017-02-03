function showSubGrids(subgrid_id, row_id) {
    var rowData = $("#grid").getRowData(row_id);
    var tipocontrato = rowData.tipocontrato;

    //if (tipocontrato == 1) {
        showSubGrid_JQGrid2(subgrid_id, row_id, "JQGrid2");
    /*}
    else {
        showSubGrid_JQGrid3(subgrid_id, row_id, "JQGrid3");
    }*/
}

function showSubGrid_JQGrid2(subgrid_id, row_id, message, suffix) {
    var rowData = $("#grid").getRowData(row_id);
    var tipocontrato = rowData.tipocontrato;
    var codigoart = rowData.codigoart;
    var proveedor = rowData.idproveedor;
    console.log("tipocontrato:"+tipocontrato+", codigoart:"+codigoart+", proveedor:"+proveedor);
    var subgrid_table_id, pager_id, toppager_id;
    subgrid_table_id = subgrid_id + '_t';
    pager_id = 'p_' + subgrid_table_id;
    toppager_id = subgrid_table_id + '_toppager';
    if (suffix) {
        subgrid_table_id += suffix;
        pager_id += suffix;
    }
    
    
    var idservicio=0;
    var templateServicio = "<div id='responsive-form' class='clearfix'>";
    if (tipocontrato == 'Proyectos') {
        templateServicio += "<div class='form-row'>";
        templateServicio += "<div class='column-full'>Codigo ART<span style='color:red'>*</span>{codigoart}</div>";
        templateServicio += "</div>";
        templateServicio += "<div class='form-row'>";
        templateServicio += "<div class='column-full'>SAP<span style='color:red'>*</span>{sap}</div>";    
        templateServicio += "</div>";        
    }
    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>CUI<span style='color:red'>*</span>{idcui}</div>";    
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Servicio<span style='color:red'>*</span>{idservicio}</div>";
    if (tipocontrato == 'Proyectos') {    
        templateServicio += "<div class='column-half'>Tarea<span style='color:red'>*</span>{tarea}</div>";
    }        
    templateServicio += "</div>";
    
    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Fecha Inicio<span style='color:red'>*</span>{fechainicio}</div>";
    templateServicio += "<div class='column-half'>Fecha Término<span style='color:red'>*</span>{fechatermino}</div>";
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Fecha Control{fechacontrol}</div>";
    templateServicio += "<div class='column-half'>Anexo{anexo}</div>";
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Estado<span style='color:red'>*</span>{idestadocto}</div>";
    templateServicio += "<div class='column-half'>Plazo<span style='color:red'>*</span>{idplazocontrato}</div>";
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Condición<span style='color:red'>*</span>{idcondicion}</div>";
    templateServicio += "<div class='column-half'>Contacto<span style='color:red'>*</span>{idcontactoproveedor}</div>";
    templateServicio += "</div>";
    
    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Saldo Presupuesto{saldopresupuesto}</div>";   
    templateServicio += "</div>";
    
    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Valor Cuota<span style='color:red'>*</span>{valorcuota}</div>";
    templateServicio += "<div class='column-half'>Moneda<span style='color:red'>*</span>{idmoneda}</div>";
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";  
    templateServicio += "<div class='column-half'>Factor<span style='color:red'>*</span>{factorimpuesto}</div>";
    templateServicio += "</div>";
    
    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Primera Cuota<span style='color:red'>*</span>{periodoprimeracuota}</div>";
    templateServicio += "<div class='column-half'>Inicio Servicio<span style='color:red'>*</span>{periodoinicioservicio}</div>";        
    templateServicio += "</div>";    

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Meses Entre Cuotas<span style='color:red'>*</span>{mesesentrecuotas}</div>";
    templateServicio += "<div class='column-half'>Cantidad de Cuotas<span style='color:red'>*</span>{numerocuotas}</div>";
    templateServicio += "</div>";
        
    templateServicio += "<div class='form-row'>";     
    templateServicio += "<div class='column-half'>Descripción<span style='color:red'>*</span>{glosaservicio}</div>";
    templateServicio += "</div>";
    
    templateServicio += "<div class='form-row'>";     
    templateServicio += "<div class='column-half'>Comentario<span style='color:red'>*</span>{comentario}</div>";
    templateServicio += "</div>";         
      
    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Más IVA<span style='color:red'>*</span>{impuesto}</div>";  
    templateServicio += "<div class='column-half'>Diferido<span style='color:red'>*</span>{diferido}</div>";
    templateServicio += "<div class='column-half'>Calculo Automático de Cuotas<span style='color:red'>*</span>{tipogeneracion}</div>";     
    templateServicio += "</div>";    



    templateServicio += "<hr style='width:100%;'/>";
    templateServicio += "<div> {sData} {cData}  </div>";
    templateServicio += "</div>";

    $('#' + subgrid_id).append('<table id=' + subgrid_table_id + ' class=scroll></table><div id=' + pager_id + ' class=scroll></div>');

    $('#' + subgrid_table_id).jqGrid({
        mtype: "POST",
        url: '/contratoservicio/' + row_id,
        editurl: '/contratoservicio/action/' + row_id,
        datatype: 'json',
        page: 1,
        colModel: [
            { label: 'id', name: 'id', key: true, hidden: true },
            { label: 'SAP', name: 'sap', width: 100, align: 'left', search: true, editable: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/getlistasap/' + proveedor+'/'+codigoart,
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.sap;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Sin SAP--</option>';
                        $.each(data, function (i, item) {
                            //console.log("nombre:"+data[i].id+" = this:"+thissid);
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' +  data[i].id+'-'+data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].id+'-'+data[i].nombre + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                }             
            },
            { label: 'Codigo ART', name: 'codigoart', width: 100, align: 'left', search: true, editable: true,
                editoptions: { size: 10, readonly: 'readonly', defaultValue: codigoart}  
            },                        
            { label: 'Anexo', name: 'anexo', width: 100, align: 'left', search: true, editable: true },          
            {
                label: 'idcui', name: 'idcui', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/contratoservicio/plantillapresupuesto/' + $('#grid').getRowData(row_id).idproveedor,
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idcui;                     
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger CUI--</option>';
                        $.each(data, function (i, item) {
                            //console.log("nombre:"+data[i].id+" = this:"+thissid);
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' +  data[i].cui+'-'+data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].cui+'-'+data[i].nombre + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var thissid = $(this).val();
                            var pgrid = $("#grid")
                            var prowKey = pgrid.getGridParam("selrow");
                            var prowData = pgrid.getRowData(prowKey);
                            var pthissid = rowData.tipocontrato;                               
                            $.ajax({
                                type: "GET",
                                url: '/contratoservicio/cuiforservice/' + $('#grid').getRowData(row_id).idproveedor + '/' + thissid+'/'+pthissid,
                                async: false,
                                success: function (data) {
                                    var r = "<select>";
                                    r += '<option value="0">--Escoger Servicio--</option>';
                                    $.each(data, function (i, item) {
                                        r += '<option value="' + data[i].id + '">' + data[i].nombre+ '</option>';
                                    });
                                    r += "</select>";
                                    $("#idservicio").html(r);
                                }
                            });
                            $("input#servicio").val($('option:selected', this).text());
                        }
                    }],
                }
            },
            {
                label: 'CUI', name: 'estructuracui.cui', width: 50, align: 'left', search: true, editable: false, hidden: false,
                //jsonmap: "EstructuraCui.nombre"
            },
            {
                label: 'idservicio', name: 'idservicio', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    value: "0:--Escoger Servicio--",
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var cui = $("#idcui").val();
                            var thissid = $(this).val();                          
                            $.ajax({
                                type: "GET",
                                url: '/contratoservicio/saldopresup/' + cui + '/' + thissid,
                                async: true,
                                success: function (data) {
                                    if (data.length > 0) {
                                        $("input#saldopresupuesto").val(data[0].montopresupuestocaja);
                                    }
                                }
                            });
                            $.ajax({
                                type: "GET",
                                url: '/getlistatareas/'+ thissid+'/'+proveedor,
                                async: false,
                                success: function (data) {
                                    var r = "<select>";
                                    r += '<option value="0">--Escoger Tarea--</option>';
                                    $.each(data, function (i, item) {
                                        r += '<option value="' + data[i].id + '">' + data[i].nombre+ '</option>';
                                    });
                                    r += "</select>";
                                    $("#tarea").html(r);
                                }
                            });
                            //$("input#tarea").val($('option:selected', this).text());
                            
                        }
                    }],                    
                }
            },
            {
                label: 'Servicio', name: 'servicio.nombre', width: 300, align: 'left', search: true, editable: true,
                editrules: { edithidden: false }, hidedlg: true
            },  
            {            
                label: 'Tarea', name: 'tarea', search: false, editable: true, hidden: false,
                edittype: "select",
                editoptions: {                   
                    dataUrl: '/getlistatareas/0/0',
                    postData: function (rowid, value, cmName) {
                        return {
                            idsrv: $('#' + subgrid_table_id).getRowData(rowid).idservicio,
                            idproveedor: proveedor
                        }
                    },                    
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.tarea;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Tarea--</option>';                        
                        $.each(data, function (i, item) {
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });

                        return s + "</select>";
                    },
                }                
            },                           
            {
                label: 'idcuenta', name: 'idcuenta', search: false, editable: false, hidden: true,
            },
            {
                label: 'Cuenta', name: 'servicio.cuentascontable.cuentacontable', width: 100, align: 'left', search: true, editable: false, hidden: false,
            },
            {
                label: 'Fecha Inicio', name: 'fechainicio', width: 150, align: 'center', search: true, editable: true, hidden: false,
                formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
                searchoptions: {
                    dataInit: function (el) {
                        $(el).datepicker({
                            language: 'es',
                            format: 'yyyy-mm-dd',
                            autoclose: true,
                            onSelect: function (dateText, inst) {
                                setTimeout(function () {
                                    $('#' + subgrid_table_id)[0].triggerToolbar();
                                }, 100);
                            }
                        });
                    },
                    sopt: ["eq", "le", "ge"]
                },
                editoptions: {
                    size: 10, maxlengh: 10,
                    dataInit: function (element) {
                        $(element).mask("0000-00-00", { placeholder: "____-__-__" });
                        $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                    }
                }
            }, {
                label: 'Fecha Término', name: 'fechatermino', width: 160, align: 'center', search: true, editable: true, hidden: false,
                formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
                searchoptions: {
                    dataInit: function (el) {
                        $(el).datepicker({
                            language: 'es',
                            format: 'yyyy-mm-dd',
                            autoclose: true,
                            onSelect: function (dateText, inst) {
                                setTimeout(function () {
                                    $('#' + subgrid_table_id)[0].triggerToolbar();
                                }, 100);
                            }
                        });
                    },
                    sopt: ["eq", "le", "ge"]
                },
                editoptions: {
                    size: 10, maxlengh: 10,
                    dataInit: function (element) {
                        $(element).mask("0000-00-00", { placeholder: "____-__-__" });
                        $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                    }
                }
            }, {
                label: 'Fecha Control', name: 'fechacontrol', width: 150, align: 'center', search: true, editable: true, hidden: false,
                formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
                searchoptions: {
                    dataInit: function (el) {
                        $(el).datepicker({
                            language: 'es',
                            format: 'yyyy-mm-dd',
                            autoclose: true,
                            onSelect: function (dateText, inst) {
                                setTimeout(function () {
                                    $('#' + subgrid_table_id)[0].triggerToolbar();
                                }, 100);
                            }
                        });
                    },
                    sopt: ["eq", "le", "ge"]
                },
                editoptions: {
                    size: 10, maxlengh: 10,
                    dataInit: function (element) {
                        $(element).mask("0000-00-00", { placeholder: "____-__-__" });
                        $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                    }
                }
            },
            {
                label: 'Cuota', name: 'valorcuota', width: 100, align: 'right',
                search: true, editable: true, hidden: false,
                formatter: 'number', formatoptions: { decimalPlaces: 2 }
            },
            {
                label: 'idmoneda', name: 'idmoneda', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/monedas',
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idmoneda;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Moneda--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].moneda + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].moneda + '</option>';
                            }
                        });
                        return s + "</select>";
                    }
                }
            },
            {
                label: 'idfrecuencia', name: 'idfrecuencia', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/parameters/frecuenciafacturacion',
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idfrecuencia;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default

                        s += '<option value="0">--Escoger Frecuencia--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
/*
                        setTimeout(function () {
                            if (needDisable) {
                                $('#idfrecuencia').prop('disabled', true);
                            } else {
                                $('#idfrecuencia').removeAttr('disabled');
                            }
                        }, 100);
*/
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            $("input#frecuenciafacturacion").val($('option:selected', this).text());
                        }
                    }],
                }
            },
            {
                label: 'Frecuencia', name: 'frecuenciafacturacion', align: 'center', search: true, editable: true, hidden: true,
                editrules: { edithidden: false }, hidedlg: true
            },
            {
                label: 'Plazo', name: 'idplazocontrato', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/parameters/plazocontrato',
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idplazocontrato;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Plazo--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            $("input#plazocontrato").val($('option:selected', this).text());
                        }
                    }],
                }
            },
            {
                label: 'Plazo', name: 'parametro.nombre', align: 'center', search: true, editable: true, hidden: false,
                editrules: { edithidden: false }, hidedlg: true
            },
            {
                label: 'Condición', name: 'idcondicion', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/parameters/condicionnegociacion',
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idcondicion;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Condición--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            $("input#condicionnegociacion").val($('option:selected', this).text());
                        }
                    }],
                }
            },
            {
                label: 'Condición', name: 'condicionnegociacion', align: 'center', search: true, editable: true, hidden: true,
                editrules: { edithidden: false }, hidedlg: true
            },
            {
                label: 'Mas IVA', name: 'impuesto', search: false, editable: true, hidden: true,
                edittype: "checkbox", editoptions: {value: "1:0", defaultValue: "1"}
            },                
            {
                label: 'Factor', name: 'factorimpuesto', align: 'right', search: true, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/parameters/factor',
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.factorimpuesto;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="-1">--Escoger Factor--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].valor == thissid) {
                                s += '<option value="' + data[i].valor + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].valor + '">' + data[i].nombre + '</option>';
                            }
                        });
                        return s + "</select>";
                    }
                }
            },
            {
                label: 'idcontactoproveedor', name: 'idcontactoproveedor', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/contactos/' + $('#grid').getRowData(row_id).idproveedor,
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idcontactoproveedor;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Contacto--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].contacto + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].contacto + '</option>';
                            }
                        });
                        return s + "</select>";
                    }
                }
            },
            {
                label: 'Estado', name: 'idestadocto', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/parameters/estadocontrato',
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idestadocto;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Estado--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            $("input#estadocontrato").val($('option:selected', this).text());
                        }
                    }],
                }
            },
            {
                label: 'Estado', name: 'estadocontrato', width: 150, align: 'left', search: true, editable: true, hidden: false,
                editrules: { edithidden: false }, hidedlg: true
            },
            {
                label: 'Descripción', name: 'glosaservicio', search: true, editable: true, hidden: false,
                edittype: "textarea"
            },
            {
                label: 'Meses Entre Cuotas', name: 'mesesentrecuotas', align: 'center', search: true, editable: true, hidden: true,
                formatter: 'number', formatoptions: { decimalPlaces: 0 }
            },       
            {
                label: 'Mes Primera Cuota', name: 'periodoprimeracuota', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: /contratoperiodos/,
                    buildSelect: function (response) {
                        var grid = $("#grid");
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.desde;
                        console.log(response);
                        var data = JSON.parse(response);
                        //console.log(data);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Periodo--</option>';
                        $.each(data, function (i, item) {
                            //console.log("***desde:" + data[i].id + ", " + thissid);
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
                        //console.log(s);
                        return s + "</select>";
                    }
                }, dataInit: function (elem) { $(elem).width(200); }            
            },          
            {
                label: 'Número Cuotas', name: 'numerocuotas', align: 'center', search: true, editable: true, hidden: true,
                formatter: 'number', formatoptions: { decimalPlaces: 0 }
            },     
            {
                label: 'Periodo Inicio Servicio', name: 'periodoinicioservicio', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: /contratoperiodos/,
                    buildSelect: function (response) {
                        var grid = $("#grid");
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.desde;
                        //console.log(response);
                        var data = JSON.parse(response);
                        console.log(data);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Periodo--</option>';
                        $.each(data, function (i, item) {
                            //console.log("***desde:" + data[i].id + ", " + thissid);
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
                        //console.log(s);
                        return s + "</select>";
                    }
                }, dataInit: function (elem) { $(elem).width(200); }            
            },   
            {
                label: 'Gasto Diferido', name: 'diferido', search: false, editable: true, hidden: true,
                edittype: "checkbox", editoptions: {value: "1:0", defaultValue: "1"}
            },          
            {
                label: 'Saldo Presupuesto', name: 'saldopresupuesto', align: 'center', search: true, editable: true, hidden: true,
                formatter: 'number', formatoptions: { decimalPlaces: 0 }, editoptions: { size: 10, readonly: 'readonly', defaultValue: "0"} 
            },
            {
                label: 'Calculo Automático', name: 'tipogeneracion', search: false, editable: true, hidden: true,
                edittype: "checkbox", editoptions: {value: "1:0", defaultValue: "1"}
            },
            {
                label: 'Comentario', name: 'comentario', search: false, editable: true, hidden: false,
                edittype: "textarea"
            }                                                       
        ],
        shrinkToFit: true,
        autowidth: true,
        caption: 'Servicios',
        viewrecords: true,
        rowNum: 10,
        rowList: [10, 20, 30],
        regional: 'es',
        height: 'auto',
        //height: '100%',
        //width: null,
        pager: $('#' + pager_id),
        styleUI: "Bootstrap",
//        loadError: sipLibrary.jqGrid_loadErrorHandler,
//        gridComplete: function () {
//            var recs = $('#' + subgrid_table_id).getGridParam("reccount");
//            if (isNaN(recs) || recs == 0) {
//                $('#' + subgrid_table_id).addRowData("blankRow", { "anexo": "No hay datos" });
//            }
//        },
        subGrid: true,
        subGridRowExpanded: gridDetail,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down",
            "reloadOnExpand": true,
            "selectOnExpand": true
        }
    });

    $('#' + subgrid_table_id).jqGrid("setLabel", "fechainicio", "", { "text-align": "center" });
    $('#' + subgrid_table_id).jqGrid("setLabel", "fechatermino", "", { "text-align": "center" });
    $('#' + subgrid_table_id).jqGrid("setLabel", "fechacontrol", "", { "text-align": "center" });
    $('#' + subgrid_table_id).jqGrid("setLabel", "valorcuota", "", { "text-align": "right" });
    $('#' + subgrid_table_id).jqGrid("setLabel", "frecuenciafacturacion", "", { "text-align": "center" });

    $('#' + subgrid_table_id).jqGrid("setLabel", "plazocontrato", "", { "text-align": "center" });
    $('#' + subgrid_table_id).jqGrid("setLabel", "condicionnegociacion", "", { "text-align": "center" });
    $('#' + subgrid_table_id).jqGrid("setLabel", "impuesto", "", { "text-align": "right" });
    $('#' + subgrid_table_id).jqGrid("setLabel", "factorimpuesto", "", { "text-align": "right" });

    $('#' + subgrid_table_id).jqGrid('navGrid', '#' + pager_id, {
        edit: true, add: true,
        del: true, search: false, refresh: true, view: true, position: "left", cloneToTop: false
    }, {
            editCaption: "Modifica Servicio",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: templateServicio,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                postdata.valorcuota = postdata.valorcuota.split(".").join("").replace(",", ".");
                var cuota = new Number(postdata.valorcuota);  
                var mecuotas =  new Number(postdata.mesesentrecuotas);
                var cantcuotas = new Number(postdata.numerocuotas);       

                if (parseInt(postdata.idservicio) == 0) {
                    return [false, "Servicio: Debe escoger un valor", ""];
                } if (parseInt(postdata.idcui) == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } if (postdata.fechainicio.length == 0) {
                    return [false, "Fecha Inicio: Debe escoger un valor", ""];
                } if (postdata.fechatermino.length == 0) {
                    return [false, "Fecha Termino: Debe escoger un valor", ""];
                } if (parseInt(postdata.fechacontrol.length) == 0) {
                    return [false, "Fecha Control: Debe escoger un valor", ""];
                } if (parseInt(postdata.idestadocto) == 0) {
                    return [false, "Estado: Debe escoger un valor", ""];
                } if (parseInt(postdata.idplazocontrato) == 0) {
                    return [false, "Plazo: Debe escoger un valor", ""];
                } if (parseInt(postdata.idcondicion) == 0) {
                    return [false, "Condición: Debe escoger un valor", ""];
                } if (parseInt(postdata.idcontactoproveedor) == 0) {
                    return [false, "Contacto: Debe escoger un valor", ""];
                }  if (isNaN(cuota) || cuota <= 0) {
                    return [false, "Valor cuota: Debe ingresar un valor", ""];
                } if (parseInt(postdata.idmoneda) == 0) {
                    return [false, "Moneda: Debe escoger un valor", ""];
                } if (parseInt(postdata.factorimpuesto) == -1) {
                    return [false, "Factor: Debe escoger un valor", ""];
                } if (postdata.periodoprimeracuota == 0) {
                    return [false, "Primera Cuota: Debe ingresar un valor", ""];
                } if (postdata.periodoinicioservicio == 0) {
                    return [false, "Inicio Servicio: Debe ingresar un valor", ""];
                }  if (isNaN(mecuotas) || mecuotas <= 0) {
                    return [false, "Meses Entre Cuotas: Debe escoger un valor", ""];
                } if (isNaN(cantcuotas) || cantcuotas <= 0) {
                    return [false, "Cantidad de Cuotas: Debe escoger un valor", ""];
                } if (postdata.glosaservicio.trim().length == 0) {
                    return [false, "Descripción: Debe ingresar un texto", ""];
                } else {
                    return [true, "", ""]
                }
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code == 10)
                    return [true,"Servicio guardado, flujos no se pudieron actualizar, presione Cancelar", ""];                
                else if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                //needDisable = true;

                setTimeout(function () {
                    var grid = $('#' + subgrid_table_id);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idservicio;
                    var thiscid = rowData.idcui;
                    var grid = $('#' + subgrid_table_id);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);                    
                    //var pthissid = rowData.tipocontrato;                       
                    $.ajax({
                        type: "GET",
                        url: '/contratoservicio/cuiforservice/' + $('#grid').getRowData(row_id).idproveedor + '/' + thiscid + '/'+ tipocontrato,
                        async: false,
                        success: function (data) {
                            var r = "<select>";
                            r += '<option value="0">--Escoger Servicio--</option>';
                            $.each(data, function (i, item) {
                                console.log("nombresrv:"+data[i].id+" = thissrv:"+thissid);
                                if (data[i].id == thissid) {
                                    r += '<option value="' + data[i].id + '" selected>' + data[i].nombre+ '</option>';
                                } else {
                                    r += '<option value="' + data[i].id + '" >' + data[i].nombre+ '</option>';
                                }
                            });
                            r += "</select>";
                            $("#idservicio").html(r);
                        }
                    });

                }, 1000);

                sipLibrary.centerDialog($('#' + subgrid_table_id).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($('#' + subgrid_table_id).attr('id'));
            }
        },
        {
            addCaption: "Agrega Servicio",
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: templateServicio,
            onclickSubmit: function (rowid) {
                return { parent_id: row_id };
            },
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                postdata.valorcuota = postdata.valorcuota.split(".").join("").replace(",", ".");
                var cuota = new Number(postdata.valorcuota);  
                var mecuotas =  new Number(postdata.mesesentrecuotas);
                var cantcuotas = new Number(postdata.numerocuotas);       
                if (parseInt(postdata.sap) == 0) {
                    return [false, "SAP: Debe escoger un valor", ""];  
                } if (parseInt(postdata.idcui) == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } else if (parseInt(postdata.idservicio) == 0) {
                    return [false, "Servicio: Debe escoger un valor", ""];
                } if (parseInt(postdata.tarea) == 0) {
                    return [false, "Tarea: Debe escoger un valor", ""];
                } if (postdata.fechainicio.length == 0) {
                    return [false, "Fecha Inicio: Debe escoger un valor", ""];
                } if (postdata.fechatermino.length == 0) {
                    return [false, "Fecha Termino: Debe escoger un valor", ""];
                } if (parseInt(postdata.fechacontrol.length) == 0) {
                    return [false, "Fecha Control: Debe escoger un valor", ""];
                } if (parseInt(postdata.idestadocto) == 0) {
                    return [false, "Estado: Debe escoger un valor", ""];
                } if (parseInt(postdata.idplazocontrato) == 0) {
                    return [false, "Plazo: Debe escoger un valor", ""];
                } if (parseInt(postdata.idcondicion) == 0) {
                    return [false, "Condición: Debe escoger un valor", ""];
                } if (parseInt(postdata.idcontactoproveedor) == 0) {
                    return [false, "Contacto: Debe escoger un valor", ""];
                } if (isNaN(cuota) || cuota <= 0) {
                    return [false, "Valor cuota: Debe ingresar un valor mayor que cero", ""];
                } if (parseInt(postdata.idmoneda) == 0) {
                    return [false, "Moneda: Debe escoger un valor", ""];
                } if (parseInt(postdata.factorimpuesto) == -1) {
                    return [false, "Factor: Debe escoger un valor", ""];
                } if (postdata.periodoprimeracuota == 0) {
                    return [false, "Primera Cuota: Debe ingresar un valor", ""];
                } if (postdata.periodoinicioservicio == 0) {
                    return [false, "Inicio Servicio: Debe ingresar un valor", ""];
                } if (isNaN(mecuotas) || mecuotas <= 0) {
                    return [false, "Meses Entre Cuotas: Debe escoger un valor", ""];
                } if (isNaN(cantcuotas) || cantcuotas <= 0) {
                    return [false, "Cantidad de Cuotas: Debe escoger un valor", ""];
                } if (postdata.glosaservicio.trim().length == 0) {
                    return [false, "Descripción: Debe ingresar un texto", ""];
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0) {
                    return [false, result.error_text, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"idservicio\",\"op\":\"cn\",\"data\":\"" + postdata.idservicio + "\"}]}";
                    $('#' + subgrid_table_id).jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                //needDisable = false;
                sipLibrary.centerDialog($('#' + subgrid_table_id).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($('#' + subgrid_table_id).attr('id'));
            }
        },
        {
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }
        },
        {
            recreateFilter: true
        }
    );

    $('#' + subgrid_table_id).closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").css("background-color", "#08298A");

    $("#" + pager_id + "_left").css("width", "");

}

function showSubGrid_JQGrid3(subgrid_id, row_id, suffix) {
    var subgrid_table_id, pager_id, toppager_id;
    subgrid_table_id = subgrid_id + '_t';
    pager_id = 'p_' + subgrid_table_id;
    toppager_id = subgrid_table_id + '_toppager';
    if (suffix) {
        subgrid_table_id += suffix;
        pager_id += suffix;
    }

    var templateTarea = "<div id='responsive-form' class='clearfix'>";

    templateTarea += "<div class='form-row'>";
    templateTarea += "<div class='column-half'>Sap{sap}</div>";
    templateTarea += "<div class='column-half'>Tarea{tarea}</div>";
    templateTarea += "</div>";

    templateTarea += "<div class='form-row'>";
    templateTarea += "<div class='column-half'>Fecha Inicio{fechainicio}</div>";
    templateTarea += "<div class='column-half'>Fecha Término{fechatermino}</div>";
    templateTarea += "</div>";

    templateTarea += "<div class='form-row'>";
    templateTarea += "<div class='column-half'>Fecha Control{fechacontrol}</div>";
    templateTarea += "<div class='column-half'>Valor Cuota{valorcuota}</div>";
    templateTarea += "</div>";

    templateTarea += "<div class='form-row'>";
    templateTarea += "<div class='column-half'>Estado{idestadocto}</div>";
    templateTarea += "<div class='column-half'>Frecuencia{idfrecuencia}</div>";
    templateTarea += "</div>";

    templateTarea += "<div class='form-row'>";
    templateTarea += "<div class='column-half'>Plazo{idplazocontrato}</div>";
    templateTarea += "<div class='column-half'>Condición{idcondicion}</div>";
    templateTarea += "</div>";

    templateTarea += "<div class='form-row'>";
    templateTarea += "<div class='column-half'>Contacto{idcontactoproveedor}</div>";
    templateTarea += "<div class='column-half'>Moneda{idmoneda}</div>";
    templateTarea += "</div>";

    templateTarea += "<div class='form-row'>";
    templateTarea += "<div class='column-half'>Anexo{anexo}</div>";
    templateTarea += "<div class='column-half'>Impuesto{impuesto}</div>";
    templateTarea += "</div>";

    templateTarea += "<div class='form-row'>";
    templateTarea += "<div class='column-half'>Factor{factorimpuesto}</div>";
    templateTarea += "</div>";

    templateTarea += "<div class='form-row'>";
    templateTarea += "<div class='column-full'>Descripción{glosaservicio}</div>";
    templateTarea += "</div>";
       
    templateTarea += "<div class='form-row' style='display: none;'>";
    templateTarea += "<div class='column-half'>frecuenciafacturacion {frecuenciafacturacion}</div>";
    templateTarea += "<div class='column-half'>plazocontrato {plazocontrato}</div>";
    templateTarea += "<div class='column-half'>condicionnegociacion {condicionnegociacion}</div>";
    templateTarea += "<div class='column-half'>estadocontrato {estadocontrato}</div>";
    templateTarea += "</div>";

    templateTarea += "<hr style='width:100%;'/>";
    templateTarea += "<div> {sData} {cData}  </div>";
    templateTarea += "</div>";

    $('#' + subgrid_id).append('<table id=' + subgrid_table_id + ' class=scroll></table><div id=' + pager_id + ' class=scroll></div>');

    $('#' + subgrid_table_id).jqGrid({
        mtype: "POST",
        url: '/contratoservicio/' + row_id,
        editurl: '/contratoproyecto/action/' + row_id,
        datatype: 'json',
        page: 1,
        colModel: [
            { label: 'id', name: 'id', key: true, hidden: true },
            { label: 'Anexo', name: 'anexo', width: 100, align: 'left', search: true, editable: true },
            {
                label: 'idcui', name: 'idcui', search: true, editable: false, hidden: true,
            },
            {
                label: 'Cui', name: 'estructuracui.cui', width: 50, align: 'left',
                search: true, editable: false, hidden: false,
            },
            {
                label: 'idservicio', name: 'idservicio', editable: false, hidden: true
            },
            {
                label: 'Servicio', name: 'servicio', editable: false, hidden: true
            },
            {
                label: 'idcuenta', name: 'idcuenta', editable: false, hidden: true,
            },
            {
                label: 'Cuenta', name: 'cuentacontable', editable: false, hidden: true
            },
            {
                label: 'Sap', name: 'sap', hidden: false, editable: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/sap',
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.sap;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Sap--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].sap == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].sap + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].sap + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var thispid = $(this).val();
                            $.ajax({
                                type: "GET",
                                url: '/tarea/' + thispid,
                                async: false,
                                success: function (data) {
                                    var s = "<select>";//el default
                                    s += '<option value="0">--Escoger Tarea--</option>';
                                    $.each(data, function (i, item) {
                                        s += '<option value="' + data[i].tarea + '">' + data[i].tarea + '</option>';
                                    });
                                    s += "</select>";
                                    $("#tarea").html(s);
                                }
                            });
                        }
                    }]
                }
            },
            {
                label: 'Tarea', name: 'tarea', editable: true, hidden: false, edittype: "select",
                editoptions: {
                    value: "0:--Escoger Tarea--"
                }
            },
            {
                label: 'Fecha Inicio', name: 'fechainicio', width: 150, align: 'left',
                search: true, editable: true, hidden: false,
                formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
                searchoptions: {
                    dataInit: function (el) {
                        $(el).datepicker({
                            language: 'es',
                            format: 'yyyy-mm-dd',
                            autoclose: true,
                            onSelect: function (dateText, inst) {
                                setTimeout(function () {
                                    $('#' + subgrid_table_id)[0].triggerToolbar();
                                }, 100);
                            }
                        });
                    },
                    sopt: ["eq", "le", "ge"]
                },
                editoptions: {
                    size: 10, maxlengh: 10,
                    dataInit: function (element) {
                        $(element).mask("0000-00-00", { placeholder: "____-__-__" });
                        $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                    }
                }
            }, {
                label: 'Fecha Término', name: 'fechatermino', width: 150, align: 'left', search: true,
                editable: true, hidden: false,
                formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
                searchoptions: {
                    dataInit: function (el) {
                        $(el).datepicker({
                            language: 'es',
                            format: 'yyyy-mm-dd',
                            autoclose: true,
                            onSelect: function (dateText, inst) {
                                setTimeout(function () {
                                    $('#' + subgrid_table_id)[0].triggerToolbar();
                                }, 100);
                            }
                        });
                    },
                    sopt: ["eq", "le", "ge"]
                },
                editoptions: {
                    size: 10, maxlengh: 10,
                    dataInit: function (element) {
                        $(element).mask("0000-00-00", { placeholder: "____-__-__" });
                        $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                    }
                }
            }, {
                label: 'Fecha Control', name: 'fechacontrol', width: 150, align: 'left', search: true,
                editable: true, hidden: false,
                formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
                searchoptions: {
                    dataInit: function (el) {
                        $(el).datepicker({
                            language: 'es',
                            format: 'yyyy-mm-dd',
                            autoclose: true,
                            onSelect: function (dateText, inst) {
                                setTimeout(function () {
                                    $('#' + subgrid_table_id)[0].triggerToolbar();
                                }, 100);
                            }
                        });
                    },
                    sopt: ["eq", "le", "ge"]
                },
                editoptions: {
                    size: 10, maxlengh: 10,
                    dataInit: function (element) {
                        $(element).mask("0000-00-00", { placeholder: "____-__-__" });
                        $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                    }
                }
            },
            {
                label: 'Valor Cuota', name: 'valorcuota', width: 100, align: 'left',
                search: true, editable: true, hidden: false,
                editoptions: {
                    dataInit: function (el) {
                        $(el).mask('000.000.000.000.000,00', { reverse: true });
                    }
                }
            },
            {
                label: 'idmoneda', name: 'idmoneda', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/monedas',
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idmoneda;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Moneda--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].moneda + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].moneda + '</option>';
                            }
                        });
                        return s + "</select>";
                    }
                }, dataInit: function (elem) {/* $(elem).width(200);*/ }
            },
            {
                label: 'idfrecuencia', name: 'idfrecuencia', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/parameters/frecuenciafacturacion',
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idfrecuencia;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default

                        s += '<option value="0">--Escoger Frecuencia--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
/*
                        setTimeout(function () {
                            if (needDisable) {
                                $('#idfrecuencia').prop('disabled', true);
                            } else {
                                $('#idfrecuencia').removeAttr('disabled');
                            }
                        }, 100);
*/
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            $("input#frecuenciafacturacion").val($('option:selected', this).text());
                        }
                    }],
                }, dataInit: function (elem) {/* $(elem).width(200);*/ }
            },
            {
                label: 'Frecuencia', name: 'frecuenciafacturacion', search: true, editable: true, hidden: false,
                editrules: { edithidden: false }, hidedlg: true
            },
            {
                label: 'Plazo', name: 'idplazocontrato', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/parameters/plazocontrato',
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idplazocontrato;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Plazo--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            $("input#plazocontrato").val($('option:selected', this).text());
                        }
                    }],
                }
            },
            {
                label: 'Plazo', name: 'plazocontrato', search: true, editable: true, hidden: false,
                editrules: { edithidden: false }, hidedlg: true
            },
            {
                label: 'Condición', name: 'idcondicion', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/parameters/condicionnegociacion',
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idcondicion;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Condición--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            $("input#condicionnegociacion").val($('option:selected', this).text());
                        }
                    }],
                }, dataInit: function (elem) {/* $(elem).width(200);*/ }
            },
            {
                label: 'Condición', name: 'condicionnegociacion', search: true, editable: true, hidden: false,
                editrules: { edithidden: false }, hidedlg: true
            },
            {
                label: 'Impuesto', name: 'impuesto', width: 100, align: 'left', search: true, editable: true, hidden: false,
                editoptions: {
                    dataInit: function (el) {
                        $(el).mask('000.000.000.000.000,00', { reverse: true });
                    }
                }
            },
            {
                label: 'Factor', name: 'factorimpuesto', width: 100, align: 'left', search: true, editable: true, hidden: false,
                editoptions: {
                    dataInit: function (el) {
                        $(el).mask('000.000.000.000.000,00', { reverse: true });
                    }
                }
            },
            {
                label: 'idcontactoproveedor', name: 'idcontactoproveedor', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/contactos/' + $('#grid').getRowData(row_id).idproveedor,
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idcontactoproveedor;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Contacto--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].contacto + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].contacto + '</option>';
                            }
                        });
                        return s + "</select>";
                    }
                }, dataInit: function (elem) {/* $(elem).width(200);*/ }
            },
            {
                label: 'Estado', name: 'idestadocto', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/parameters/estadocontrato',
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idestadocto;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Estado--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            $("input#estadocontrato").val($('option:selected', this).text());
                        }
                    }],
                }
            },
            {
                label: 'Estado', name: 'estadocontrato', width: 150, align: 'left', search: true, editable: true, hidden: false,
                editrules: { edithidden: false }, hidedlg: true
            },
            {
                label: 'Descripción', name: 'glosaservicio', search: true, editable: true, hidden: false,
                edittype: "textarea"
            }
         
        ],
        viewrecords: true,
        shrinkToFit: false,
        caption: 'Tareas',
        rowNum: 10,
        rowList: [10, 20, 30],
        regional: 'es',
        height: 'auto',
        width: null,
        pager: $('#' + pager_id),
        styleUI: "Bootstrap",
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $('#' + subgrid_table_id).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $('#' + subgrid_table_id).addRowData("blankRow", { "anexo": "No hay datos" });
            }
        },
        subGrid: true,
        subGridRowExpanded: gridDetail,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        }
    });

    $('#' + subgrid_table_id).jqGrid('navGrid', '#' + pager_id, {
        edit: true, add: true,
        del: true, search: false, refresh: true, view: true, position: "left", cloneToTop: false
    },
        {
            editCaption: "Modifica Tarea",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: templateTarea,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                //needDisable = true;
                sipLibrary.centerDialog($('#' + subgrid_table_id).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($('#' + subgrid_table_id).attr('id'));
            }
        },
        {
            addCaption: "Agrega Tarea",
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: templateTarea,
            onclickSubmit: function (rowid) {
                return { parent_id: row_id };
            },
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                if (postdata.sap == 0) {
                    return [false, "SAP: Debe escoger un valor", ""];
                } if (postdata.tarea == 0) {
                    return [false, "Tarea: Debe escoger un valor", ""];
                } if (postdata.idfrecuencia == 0) {
                    return [false, "Frecuencia: Debe escoger un valor", ""];
                } if (postdata.idplazocontrato == 0) {
                    return [false, "Plazo: Debe escoger un valor", ""];
                } if (postdata.idcondicion == 0) {
                    return [false, "Condición: Debe escoger un valor", ""];
                } if (postdata.idestadocto == 0) {
                    return [false, "Estado: Debe escoger un valor", ""];
                } if (postdata.idcontactoproveedor == 0) {
                    return [false, "Contacto: Debe escoger un valor", ""];
                } if (postdata.idmoneda == 0) {
                    return [false, "Moneda: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0) {
                    return [false, result.error_text, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"sap\",\"op\":\"cn\",\"data\":\"" + postdata.sap + "\"}]}";
                    $('#' + subgrid_table_id).jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                //needDisable = false;
                sipLibrary.centerDialog($('#' + subgrid_table_id).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($('#' + subgrid_table_id).attr('id'));
            }
        },
        {
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }
        },
        {
            recreateFilter: true
        }
    );

    $('#' + subgrid_table_id).closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").css("background-color", "#08298A");

    $("#" + pager_id + "_left").css("width", "");

}