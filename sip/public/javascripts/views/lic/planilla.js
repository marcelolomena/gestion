
    $(document).ready(function () {
        var tmpl = "<div id='responsive-form' class='clearfix'>";
        
        tmpl += "<div style='display: none;'>Producto {idproducto}</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-half'><span style='color:red'>*</span>Contrato {contrato}</div>";
        tmpl += "<div class='column-half'><span style='color:red'>*</span>O. C. {ordencompra}</div>";
        tmpl += "</div>";
    
        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-half'><span style='color:red'>*</span>CUI {idcui}</div>";
        tmpl += "<div class='column-half'><span style='color:red'>*</span>SAP {sap}</div>";
        tmpl += "</div>";
    
        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-half'><span style='color:red'>*</span>Fabricante {idfabricante}</div>";
        tmpl += "<div class='column-half'><span style='color:red'>*</span>Proveedor {idproveedor}</div>";
        tmpl += "</div>";
    
        tmpl += "<div class='form-row' >";
        tmpl += "<div class='column-half'>Software {nombre}</div>";
        tmpl += "<div class='column-half'>¿Donde esta instalada? {idtipoinstalacion}</div>";
        tmpl += "</div>";
    
        tmpl += "<div class='form-row' >";
        tmpl += "<div class='column-half'>Clasificación {idclasificacion}</div>";
        tmpl += "<div class='column-half'>Tipo de Licenciamiento {idtipolicenciamiento}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row' >";
        tmpl += "<div class='column-half'>Fecha Compra {fechacompra}</div>";
        tmpl += "<div class='column-half'>Fecha Expiración {fechaexpiracion}</div>";
        tmpl += "</div>";        

        tmpl += "<div class='form-row' >";
        tmpl += "<div class='column-half'>Tipo de Contrato {perpetua}</div>";
        tmpl += "<div class='column-half'>N° Lic Compradas {liccompradas}</div>";
        tmpl += "</div>"; 

        tmpl += "<div class='form-row' >";
        tmpl += "<div class='column-half'>Moneda {idmoneda}</div>";
        tmpl += "<div class='column-half'>Valor Licencias {valorlicencia}</div>";
        tmpl += "</div>";        

        tmpl += "<div class='form-row' >";
        tmpl += "<div class='column-half'>Valor Soporte {valorsoporte}</div>";
        tmpl += "<div class='column-half'>Valor Anual Neto {valoranualneto}</div>";
        tmpl += "<div class='column-half'>Fecha Control {fecharenovasoporte}</div>";
        tmpl += "</div>"; 
        
        tmpl += "<div class='form-row' >";
        tmpl += "<div class='column-half'>Factura {factura}</div>";
        tmpl += "<div class='column-half'>Cant. Compradas {licstock}</div>";
        tmpl += "</div>"; 
        
        tmpl += "<div class='form-row' >";
        tmpl += "<div class='column-half'>Instalada {licocupadas}</div>";
        tmpl += "<div class='column-half'>Comprador {comprador}</div>";
        tmpl += "</div>"; 

        tmpl += "<div class='form-row' >";
        tmpl += "<div class='column-half'>Responsable {responsable}</div>";
        tmpl += "<div class='column-half'>Correo Comprador {correocomprador}</div>";
        tmpl += "</div>";         

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Comentario {comentario}</div>";
        tmpl += "</div>";
    
        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";
            
        var $table = $('#grid');
        var viewModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: false
        }, {
            label: 'Id Producto',
            name: 'idproducto',
            hidden: true,
            editable: true,
            zsHidden: true
        }, {
            label: 'Contrato',
            name: 'contrato',
            width: 100,
            align: 'center',
            sortable: false,
            editable: true,
            search: true
        }, {
            label: 'O.C.',
            name: 'ordencompra',
            width: 100,
            align: 'center',
            sortable: false,
            editable: true,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("00000", {
                        placeholder: "00000"
                    });
                }
            },
            search: true
        }, {
            label: 'CUI',
            name: 'idcui',
            width: 80,
            align: 'center',
            sortable: false,
            editable: true,
            edittype: 'select',
            editoptions: {
                defaultValue: '0',
                dataUrl: '/lic/cui',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.cui;
                    var data = JSON.parse(response);
                    //return new zs.SelectTemplate(data, 'Seleccione CUI', thissid).template;
                    var s = "<select>";
                    s += '<option value="">--Seleccione CUI--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";                    
                }
            },
            search: false
        }, {
            label: 'SAP',
            name: 'sap',
            width: 80,
            align: 'center',
            sortable: false,
            editable: true,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("00000", {
                        placeholder: "00000"
                    });
                }
            },
            search: false
        }, {
            label: 'Fabricante',
            name: 'idfabricante',
            jsonmap: 'nombreFab',
            width: 180,
            align: 'center',
            sortable: false,
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/fabricantes',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.fabricante;
                    var data = JSON.parse(response);
                    //return new zs.SelectTemplate(data, 'Seleccione Fabricante', thissid).template;
                    var s = "<select>";
                    s += '<option value="">--Seleccione Fabricante--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";                    
                }
            },
            editrules: {
                required: true
            },
            search: true,
            stype: 'select',
            searchoptions: {
                dataUrl: '/lic/fabricantes',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.fabricante;
                    var data = JSON.parse(response);
                    //return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    var s = "<select>";//el default
                    s += '<option value="">--Seleccione Fabricante--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";                    
                }
            }
        }, {
            label: 'Proveedor',
            name: 'idproveedor',
            jsonmap: 'razonsocial',
            width: 300,
            align: 'center',
            sortable: false,
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/proveedor',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.proveedor;
                    var data = JSON.parse(response);
                    //return new zs.SelectTemplate(data, 'Seleccione Proveedor', thissid).template;
                    var s = "<select>";//el default
                    s += '<option value="">--Seleccione Proveedor--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";                    
                }
            },
            editrules: {
                required: true
            },
            search: true
        }, {
            label: 'Software',
            name: 'nombre',
            sortable: false,
            width: 200,
            align: 'center',
            editable: true,
            editrules: {
                required: true
            },
            search: true
        }, {
            label: '¿Donde está instalada?',
            name: 'idtipoinstalacion',
            jsonmap: 'nombreTipoInst',
            width: 160,
            align: 'center',
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/tiposInstalacion',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.tipoInstalacion;
                    var data = JSON.parse(response);
                    //return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    var s = "<select>";//el default
                    s += '<option value="">--Seleccione--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";                    
                }
            },
            editrules: {
                required: true
            },

            search: true,
            stype: 'select',
            searchoptions: {
                dataUrl: '/lic/tiposInstalacion',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.tipoInstalacion;
                    var data = JSON.parse(response);
                    //return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    var s = "<select>";
                    s += '<option value="">--Seleccione--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";                    
                }
            }
        }, {
            label: 'Clasificación',
            name: 'idclasificacion',
            jsonmap: 'nombreClas',
            width: 150,
            align: 'center',
            sortable: false,
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/clasificaciones',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.clasificacion;
                    var data = JSON.parse(response);
                    //return new zs.SelectTemplate(data, 'Seleccione Clasificación', thissid).template;
                    var s = "<select>";//el default
                    s += '<option value="">--Seleccione Clasificación--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";                    
                }
            },
            editrules: {
                required: true
            },
            search: true,
            stype: 'select',
            searchoptions: {
                dataUrl: '/lic/clasificaciones',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.clasificacion;
                    var data = JSON.parse(response);
                    //return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    var s = "<select>";
                    s += '<option value="">--Seleccione--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";                    
                }
            }
        }, {
            label: 'Tipo de Licenciamiento',
            name: 'idtipolicenciamiento',
            jsonmap: 'nombreTipoLic',
            width: 170,
            align: 'center',
            sortable: false,
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/tiposLicenciamiento',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.tipoLicenciamiento;
                    var data = JSON.parse(response);
                    //return new zs.SelectTemplate(data, 'Seleccione Tipo de Licencia', thissid).template;
                    var s = "<select>";
                    s += '<option value="">--Seleccione Tipo de Licencia--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                        
                }
            },
            editrules: {
                required: true
            },
            search: true,
            stype: 'select',
            searchoptions: {
                dataUrl: '/lic/tiposLicenciamiento',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.tipoLicenciamiento;
                    var data = JSON.parse(response);
                    //return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    var s = "<select>";
                    s += '<option value="">--Seleccione--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                        
                }
            }
        }, {
            label: 'Fecha Compra',
            name: 'fechacompra',
            width: 125,
            align: 'center',
            sortable: false,
            editable: true,
            formatter: function (cellvalue, options, rowObject) {
                var val = rowObject.fechacompra;
                if (val != null) {
                    val = val.substring(0,10);
                    var fechaok = val.substring(8)+'-'+val.substring(5,7)+'-'+val.substring(0,4);
                    return fechaok;
                } else {
                    return '';
                }
            },
            editoptions: {
                'data-provide': 'datepicker',
                dataInit: function (element) {
                    $(element).mask("00-00-0000", {
                        placeholder: "__-__-____"
                    });
                    $(element).datepicker({
                        language: 'es',
                        weekStart: 1,
                        format: 'dd-mm-yyyy',
                        autoclose: true
                    })
                }
            },
            search: false
        }, {
            label: 'Fecha Expiración',
            name: 'fechaexpiracion',
            align: 'center',
            width: 125,
            sortable: false,
            editable: true,
            formatter: function (cellvalue, options, rowObject) {
                var val = rowObject.fechaexpiracion;
                if (val != null) {
                    val = val.substring(0,10);
                    var fechaok = val.substring(8)+'-'+val.substring(5,7)+'-'+val.substring(0,4);
                    return fechaok;
                } else {
                    return '';
                }
            },
            editoptions: {
                'data-provide': 'datepicker',
                dataInit: function (element) {
                    $(element).mask("00-00-0000", {
                        placeholder: "__-__-____"
                    });
                    $(element).datepicker({
                        language: 'es',
                        weekStart: 1,
                        format: 'dd-mm-yyyy',
                        autoclose: true
                    })
                }
            },
            search: false
        }, {
            label: 'Tipo de Contrato',
            name: 'perpetua',
            align: 'center',
            width: 120,
            sortable: false,
            editable: true,
            search: false,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemPerpetua               
            },            
            formatter: function (cellvalue, options, rowObject) {
                var val = rowObject.perpetua;
                if (val != null) {
                    if (val == 1)
                        return 'Perpetua';
                    else 
                        return 'Suscripción';
                } else {
                    return '';
                }
            },
        
        },
        {
            label: 'N° Lic Compradas',
            name: 'liccompradas',
            width: 125,
            align: 'center',
            formatter: 'integer',
            sortable: false,
            editable: true,
            editoptions: {
                defaultValue: '0'
            },
            editrules: {
                required: true
            },

            search: false
        }, {
            label: 'Moneda',
            name: 'idmoneda',
            jsonmap: 'moneda',
            width: 70,
            align: 'center',
            sortable: false,
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/moneda',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.moneda;
                    var data = JSON.parse(response);
                    //return new zs.SelectTemplate(data, 'Seleccione Moneda', thissid).template;
                    var s = "<select>";
                    s += '<option value="">--Escoger Producto--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                        
                }
            },
            search: false
        }, {
            label: 'Valor Licencias',
            name: 'valorlicencia',
            width: 110,
            align: 'center',
            sortable: false,
            editable: true,
            editoptions: {
                defaultValue: '0'
            },
            formatter: 'integer',
            search: false
        }, {
            label: 'Valor Soporte',
            name: 'valorsoporte',
            width: 110,
            align: 'center',
            sortable: false,
            editable: true,
            editoptions: {
                defaultValue: '0'
            },
            editoptions: {
                defaultValue: '0'
            },
            formatter: 'integer',
            search: false,
        }, {
            label: 'Valor Anual Neto',
            name: 'valoranualneto',
            width: 120,
            align: 'center',
            sortable: false,
            editable: true,
            editoptions: {
                defaultValue: '0'
            },
            editoptions: {
                defaultValue: '0'
            },
            formatter: 'integer',
            search: false,
        },
        {
            label: 'Fecha Control',
            name: 'fecharenovasoporte',
            width: 125,
            align: 'center',
            sortable: false,
            editable: true,
            formatter: function (cellvalue, options, rowObject) {
                var val = rowObject.fecharenovasoporte;
                if (val != null) {
                    val = val.substring(0,10);
                    var fechaok = val.substring(8)+'-'+val.substring(5,7)+'-'+val.substring(0,4);
                    return fechaok;
                } else {
                    return '';
                }
            },
            editoptions: {
                'data-provide': 'datepicker',
                dataInit: function (element) {
                    $(element).mask("00-00-0000", {
                        placeholder: "__-__-____"
                    });
                    $(element).datepicker({
                        language: 'es',
                        weekStart: 1,
                        format: 'dd-mm-yyyy',
                        autoclose: true
                    })
                }
            },
            search: false
        }, {
            label: 'Factura',
            name: 'factura',
            width: 80,
            align: 'center',
            sortable: false,
            editable: true,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("0000000000", {
                        placeholder: "0000000000"
                    });
                }
            },
            search: false
        },
        {
            label: 'Cant. Compradas por Producto',
            name: 'licstock',
            width: 200,
            align: 'center',
            sortable: false,
            editable: true,
            hidden: false,
            editoptions: {
                defaultValue: '0'
            },
            formatter: function (cellvalue, options, rowObject) {
                return rowObject.ilimitado ? 'Ilimitado' : cellvalue;
            },            
            search: false
        }, {
            label: 'Instalada por Producto',
            name: 'licocupadas',
            width: 150,
            align: 'center',
            sortable: false,
            editable: true,
            editoptions: {
                defaultValue: '0'
            },
            formatter: 'integer',
            search: false
        }, {
            label: 'Alerta de Renovación',
            name: 'alertarenovacion',
            width: 140,
            align: 'center',
            sortable: false,
            editable: false,
            search: false,
            formatter: function (cellvalue, options, rowObject) {
                var rojo = '<span><img src="../../../../images/redcircle.png" width="19px"/></span>';
                var amarillo = '<span><img src="../../../../images/yellowcircle.png" width="19px"/></span>';
                var verde = '<span><img src="../../../../images/greencircle.png" width="19px"/></span>';
                var gris = '<span><img src="../../../../images/greycircle.png" width="19px"/></span>';
                if(rowObject.alertarenovacion === 'aGris'){
                    return gris;
                }else{
                    if (rowObject.alertarenovacion === 'Vencida') {
                        return rojo;
                    } else {
                        if (rowObject.alertarenovacion === 'Renovar') {
                            return amarillo;
                        } else {
                            if (rowObject.alertarenovacion === 'bAl Dia')
                            
                            
                            return verde;
                        }
                    }    
                }   
            }            
        }, {
            label: 'Comprador',
            name: 'comprador',
            align: 'left',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'Responsable',
            name: 'responsable',
            align: 'left',
            sortable: false,
            editable: true,
            search: false,
            editoptions: {
                readonly: 'readonly'
            }			
        },{
            label: 'Correo Comprador',
            name: 'correocomprador',
            align: 'left',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'Comentario',
            name: 'comentario',
            hidden: false,
            sortable: false,
            editable: true,
            edittype: 'textarea',
            search: false,
            width: 1000,
            editoptions: {
                fullRow: true
            },            
        },
        {
            label: 'Ficha Técnica',
            name: 'fichatecnica',
            width: 100,
            hidden: false,
            editable: false,
            search: false,
            formatter: function (cellvalue, options, rowObject) {
                var nombre = rowObject.fichatecnica;
                var id = rowObject.id;
                if (nombre != null) {
                    return "<a href='/lic/downficha/"+id+"'>"+nombre+"</a>" ;
                } else {
                    return "Sin Adjunto";
                }
            }, 
            sortable: false       
        }        
        ];

        $("#grid").jqGrid({
            url: '/lic/planilla',
            mtype: "GET",
            datatype: "json",
            page: 1,
            colModel: viewModel,
            rowNum: 10,
            regional: 'es',
            height: 'auto',
            sortable: "true",
            width: null,
            shrinkToFit: false,
            caption: 'Compras',
            pager: "#pager",
            viewrecords: true,
            rowList: [10, 20, 30, 40, 50],
            styleUI: "Bootstrap",
            editurl: '/lic/planilla'
        });       

        $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });


        $('#grid').jqGrid('navGrid', "#pager", {
            edit: true,
            add: true,
            del: true,
            refresh: true,
            search: false, // show search button on the toolbar        
            cloneToTop: false
        },
        {
            editCaption: "Modifica Compra",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return [true, 'Error: ' + data.responseText, ""];
            },
            beforeSubmit: function (postdata, formid) {
                if (!postdata.idfabricante) {
                    return [false, "Fabricante: Debe escoger un valor.", ""];
                } else if (!postdata.idproveedor) {
                    return [false, "Proveedor: Debe escoger un valor.", ""];
                } else if (postdata.nombre.trim().length == 0) {
                    return [false, "Software: Debe ingresar un software.", ""];
                } else if (!postdata.idtipoinstalacion) {
                    return [false, "¿Donde está instalada?: Debe escoger un valor.", ""];
                } else if (!postdata.idclasificacion) {
                    return [false, "Clasificación: Debe escoger un valor.", ""];
                } else if (!postdata.idtipolicenciamiento) {
                    return [false, "Tipo de Licenciamiento: Debe escoger un valor.", ""];
                } else if (postdata.liccompradas.trim().length == 0) {
                    return [false, "N° Lic Compradas: Debe ingresar un cantidad.", ""];
                } else if (!postdata.idmoneda) {
                    return [false, "Moneda: Debe escoger un valor.", ""];
                } else if (postdata.valorsoporte.trim().length == 0) {
                    return [false, "Valor Soportes: Debe ingresar un valor.", ""];
                } else {
                    return [true, "", ""];
                }
            }
        },
        {
        }, {

        }
    );

    $('#grid').jqGrid('navButtonAdd', 'pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/lic/exportplanilla';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_left").css("width", "");
});

