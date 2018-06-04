(function ($, _) {
    'use strict';
    var zs = window.zs;

    function beforeSubmit(postdata, formid) {
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
    };

    function initGrid(viewModel) {
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Compras', 'Editar Compra', 'Agregar compra', '/lic/planilla', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC']);
        grid.prmEdit.beforeSubmit = beforeSubmit;
        grid.prmAdd.beforeSubmit = beforeSubmit;
        grid.navParameters.add = false;
        grid.navParameters.del = false;
        grid.build();
        // grid.addExportButton('Excel', 'glyphicon glyphicon-download-alt', '/lic/exportplanilla');
    }

    

    $(function () {
        var $table = $('#gridMaster');
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
                    return new zs.SelectTemplate(data, 'Seleccione CUI', thissid).template;
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
                    return new zs.SelectTemplate(data, 'Seleccione Fabricante', thissid).template;
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
                    return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
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
                    return new zs.SelectTemplate(data, 'Seleccione Proveedor', thissid).template;
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
                    return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
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
                    return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
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
                    return new zs.SelectTemplate(data, 'Seleccione Clasificación', thissid).template;
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
                    return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
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
                    return new zs.SelectTemplate(data, 'Seleccione Tipo de Licencia', thissid).template;
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
                    return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
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
                    return new zs.SelectTemplate(data, 'Seleccione Moneda', thissid).template;
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
            label: 'Fecha Renovación Soporte',
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
            search: false
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
        ];
        
        initGrid(viewModel);
        $('#gridMaster').jqGrid('navButtonAdd', 'pagerMaster', {
            caption: "",
            buttonicon: "glyphicon glyphicon-download-alt",
            title: "Excel",
            position: "last",
            onClickButton: function () {
                var grid = $('#gridMaster');
                var rowKey = grid.getGridParam("selrow");
                var url = '/lic/exportplanilla';
                $('#gridMaster').jqGrid('excelExport', { "url": url });
            }
        });
    });
})(jQuery, _);