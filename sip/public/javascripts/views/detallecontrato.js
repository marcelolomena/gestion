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
    console.log("Data:"+JSON.stringify(rowData));
    var tipocontrato = rowData.tipocontrato;
    var codigoart = $('#'+subgrid_table_id).getRowData($('#'+subgrid_table_id).getGridParam("selrow")).codigoart;
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
    templateServicio += "<div class='column-half'>CUI Responsable DIVOT<span style='color:red'>*</span>{idcui}</div>";    
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
    templateServicio += "<div class='column-half'>Número Solicitud<span style='color:red'>*</span>{numerosolicitud}</div>";    
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Anexo{anexo}</div>";    
    templateServicio += "<div class='column-half'>Numero Ficha Criticidad{numfichacriticidad}</div>";
    templateServicio += "<div class='column-half'>Estado<span style='color:red'>*</span>{idestadocto}</div>";
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";
templateServicio += "<div class='column-half'>Plazo<span style='color:red'>*</span>{idplazocontrato}</div>";    
    templateServicio += "<div class='column-half'>Condición<span style='color:red'>*</span>{idcondicion}</div>";
    templateServicio += "</div>";
    
    templateServicio += "<div class='form-row' style='display: none;'>";
    templateServicio += "<div class='column-half'>Saldo Presupuesto{saldopresupuesto}</div>";   
    templateServicio += "</div>";
    
    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Monto Contrato<span style='color:red'>*</span>{montocontrato}</div>";
    templateServicio += "<div class='column-half'>Moneda<span style='color:red'>*</span>{idmoneda}</div>";
    templateServicio += "</div>";
    
    if (tipocontrato == 'Continuidad') {
        templateServicio += "<div class='form-row'>";  
        templateServicio += "<div class='column-half'>Valor Cuota<span style='color:red'>*</span>{valorcuota}</div>";    
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
    }

    templateServicio += "<div class='form-row'>";     
    templateServicio += "<div class='column-half'>Nombre Servicio<span style='color:red'>*</span>{glosaservicio}</div>";
    templateServicio += "</div>";
    
    templateServicio += "<div class='form-row'>";     
    templateServicio += "<div class='column-half'>Comentario{comentario}</div>";
    templateServicio += "</div>";         
      
    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Más IVA{impuesto}</div>"; 
    if (tipocontrato == 'Continuidad') {     
        templateServicio += "<div class='column-half'>Diferido{diferido}</div>";
        templateServicio += "<div class='column-half'>Calculo Automático de Cuotas{tipogeneracion}</div>";   
    }  
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
            { label: 'Codigo ART', name: 'codigoart', width: 100, align: 'left', search: true, editable: true,
                editoptions: { size: 10,
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var thissid = $(this).val();
                            var pgrid = $("#grid")
                            var prowKey = pgrid.getGridParam("selrow");
                            var prowData = pgrid.getRowData(prowKey);
                            var pthissid = rowData.tipocontrato;                               
                            $.ajax({
                                type: "GET",
                                url: '/getlistasap/' + proveedor+'/'+thissid,
                                async: false,
                                success: function (data) {
                                    var r = "<select>";
                                    r += '<option value="0">--Escoger SAP--</option>';
                                    r += '<option value="1">--En Tramite--</option>';
                                    $.each(data, function (i, item) {
                                        r += '<option value="' + data[i].id + '">' + data[i].id+ ' ' +data[i].nombre+ '</option>';
                                    });
                                    r += "</select>";
                                    $("#sap").html(r);
                                }
                            });
                            $("input#sap").val($('option:selected', this).text());
                        }
                    }],
                }                    
            }, 
            { label: 'SAP', name: 'sap', width: 100, align: 'left', search: true, editable: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/getlistasap/0/0',
                    buildSelect: function (response) {
                        var r = "<select>";
                        r += '<option value="0">--Escoger SAP--</option>';  
                        r += '<option value="1">--En Tramite--</option>';  
                        return r + "</select>";    
                    }             
                }         
            },                                   
            { label: 'Anexo', name: 'anexo', width: 100, align: 'left', search: true, editable: true },          
            { label: 'Solicitud', name: 'numerosolicitud', width: 100, align: 'left', search: true, editable: true, hidden: false },            
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
                label: 'CUI Responsable Divot', name: 'estructuracui.cui', width: 50, align: 'left', search: true, editable: false, hidden: false,
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
                formatter: 'number', formatoptions: { decimalPlaces: 2 },
                editoptions: {
                    dataInit: function (el) {
                        $(el).mask('000.000.000.000.000,00', { reverse: true });
                    }
                }                
            },
            {
                label: 'Monto Contrato', name: 'montocontrato', width: 100, align: 'right',
                search: false, editable: true, hidden: false,
                formatter: 'number', formatoptions: { decimalPlaces: 2 },
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
                label: 'Nombre Servicio', name: 'glosaservicio', search: true, editable: true, hidden: false,
                edittype: "textarea", editoptions: {maxlength:"255"}
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
                edittype: "textarea", editoptions: {maxlength:"1000"}
            },
            {
                label: 'Numero Ficha Criticidad', name: 'numfichacriticidad', search: false, editable: true, hidden: true,
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
                if (!confirm('Esta seguro de modificar. Puede perder los flujos ingresados')){
                    return [true, "", ""];
                }
                if (typeof(postdata.valorcuota) != "undefined"){
                    postdata.valorcuota = postdata.valorcuota.split(".").join("").replace(",", ".");
                }
                postdata.montocontrato = postdata.montocontrato.split(".").join("").replace(",", ".");
                var cuota = new Number(postdata.valorcuota);  
                var montocontrato = new Number(postdata.montocontrato);  
                var mecuotas =  new Number(postdata.mesesentrecuotas);
                var cantcuotas = new Number(postdata.numerocuotas);   
                if (parseInt(postdata.sap) == 0) {
                    return [false, "SAP: Debe escoger un valor", ""];  
                }                    
                if (tipocontrato == 'Proyectos') {
                    console.log('art:'+postdata.codigoart.length);
                    if (postdata.codigoart.length == 0) {
                        return [false, "Código Art: Debe ingresar un valor", ""];
                    }
                }                 
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
                }  if (isNaN(montocontrato) || montocontrato <= 0) {
                    return [false, "Monto Contrato: Debe ingresar un valor", ""];                    
                }  if (isNaN(cuota) || cuota <= 0) {
                    if (typeof(postdata.valorcuota) != "undefined"){
                        return [false, "Valor cuota: Debe ingresar un valor mayor que cero", ""];
                    }                } if (parseInt(postdata.idmoneda) == 0) {
                    return [false, "Moneda: Debe escoger un valor", ""];
                } if (parseInt(postdata.factorimpuesto) == -1) {
                    return [false, "Factor: Debe escoger un valor", ""];
                } if (postdata.periodoprimeracuota == 0) {
                    return [false, "Primera Cuota: Debe ingresar un valor", ""];
                } if (postdata.periodoinicioservicio == 0) {
                    return [false, "Inicio Servicio: Debe ingresar un valor", ""];
                }  if (isNaN(mecuotas) || mecuotas <= 0) {
                    if (typeof(postdata.mesesentrecuotas) != "undefined"){
                        return [false, "Meses Entre Cuotas: Debe escoger un valor", ""];
                    }
                } if (isNaN(cantcuotas) || cantcuotas <= 0) {
                    if (typeof(postdata.numerocuotas) != "undefined"){
                        return [false, "Cantidad de Cuotas: Debe escoger un valor", ""];
                    }
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
                    var thiscart = rowData.codigoart;
                    var thiscsap = rowData.sap;
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
                    $.ajax({
                        type: "GET",
                        url: '/getlistasap/' + $('#grid').getRowData(row_id).idproveedor +'/'+thiscart ,
                        async: false,
                        success: function (data) {
                            var r = "<select>";
                            r += '<option value="0">--Escoger Servicio--</option>';
                            r += '<option value="1">--En Tramite--</option>';
                            $.each(data, function (i, item) {
                                console.log("nombresrv:"+data[i].id+" = thissrv:"+thissid);
                                if (data[i].id == thiscsap) {
                                    r += '<option value="' + data[i].id + '" selected>' + data[i].id + ' ' + data[i].nombre+ '</option>';
                                } else {
                                    r += '<option value="' + data[i].id + '" >' + data[i].id+ ' ' + data[i].nombre+ '</option>';
                                }
                            });
                            r += "</select>";
                            $("#sap").html(r);
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
                if (typeof(postdata.valorcuota) != "undefined"){
                    postdata.valorcuota = postdata.valorcuota.split(".").join("").replace(",", ".");
                }
                postdata.montocontrato = postdata.montocontrato.split(".").join("").replace(",", ".");
                var cuota = new Number(postdata.valorcuota);  
                var montocontrato = new Number(postdata.montocontrato);  
                var mecuotas =  new Number(postdata.mesesentrecuotas);
                var cantcuotas = new Number(postdata.numerocuotas);       
                if (parseInt(postdata.sap) == 0) {
                    return [false, "SAP: Debe escoger un valor", ""];  
                }
                if (tipocontrato == 'Proyectos') {
                    console.log('art:'+postdata.codigoart.length);
                    if (postdata.codigoart.length == 0) {
                        return [false, "Código Art: Debe ingresar un valor", ""];
                    }
                }                    
                if (parseInt(postdata.idcui) == 0) {
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
                } if (isNaN(montocontrato) || montocontrato <= 0) {
                    return [false, "Monto Contrato: Debe ingresar un valor mayor que cero", ""];
                } if (isNaN(cuota) || cuota <= 0) {
                    if (typeof(postdata.valorcuota) != "undefined"){
                        return [false, "Valor cuota: Debe ingresar un valor mayor que cero", ""];
                    }
                } if (parseInt(postdata.idmoneda) == 0) {
                    return [false, "Moneda: Debe escoger un valor", ""];
                } if (parseInt(postdata.factorimpuesto) == -1) {
                    return [false, "Factor: Debe escoger un valor", ""];
                } if (postdata.periodoprimeracuota == 0) {
                    return [false, "Primera Cuota: Debe ingresar un valor", ""];
                } if (postdata.periodoinicioservicio == 0) {
                    return [false, "Inicio Servicio: Debe ingresar un valor", ""];
                } if (isNaN(mecuotas) || mecuotas <= 0) {
                    if (typeof(postdata.mesesentrecuotas) != "undefined"){
                        return [false, "Meses Entre Cuotas: Debe escoger un valor", ""];
                    }
                } if (isNaN(cantcuotas) || cantcuotas <= 0) {
                    if (typeof(postdata.numerocuotas) != "undefined"){
                        return [false, "Cantidad de Cuotas: Debe escoger un valor", ""];
                    }
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
                    //var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"idservicio\",\"op\":\"cn\",\"data\":\"" + postdata.idservicio + "\"}]}";
                    //$('#' + subgrid_table_id).jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
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
                if (result.error_code == 10)
                    return [true,"No se puede borrar servicio, esta vinculado a prefacturas", ""];                
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
