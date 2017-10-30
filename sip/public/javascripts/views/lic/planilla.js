(function ($, _) {
    'use strict';
    var zs = window.zs;

    function beforeSubmit(postdata, formid) {
        if (!postdata.idFabricante) {
            return [false, "Fabricante: Debe escoger un valor.", ""];
        } else if (!postdata.idProveedor) {
            return [false, "Proveedor: Debe escoger un valor.", ""];
        } else if (postdata.nombre.trim().length == 0) {
            return [false, "Software: Debe ingresar un software.", ""];
        } else if (!postdata.idTipoInstalacion) {
            return [false, "¿Donde está instalada?: Debe escoger un valor.", ""];
        } else if (!postdata.idClasificacion) {
            return [false, "Clasificación: Debe escoger un valor.", ""];
        } else if (!postdata.idTipoLicenciamiento) {
            return [false, "Tipo de Licenciamiento: Debe escoger un valor.", ""];
        } else if (postdata.fechaCompra.trim().length == 0) {
            return [false, "Fecha Compra: Debe ingresar una fecha.", ""];
        } else if (postdata.licCompradas.trim().length == 0) {
            return [false, "N° Lic Compradas: Debe ingresar un cantidad.", ""];
        } else if (!postdata.idMoneda) {
            return [false, "Moneda: Debe escoger un valor.", ""];
        } else if (postdata.valorLicencia == "0") {
            return [false, "Valor Licencias: Debe ingresar un valor.", ""];
        } else if (postdata.valorSoporte.trim().length == 0) {
            return [false, "Valor Soportes: Debe ingresar un valor.", ""];
        } else if (postdata.fechaRenovaSoporte.trim().length == 0) {
            return [false, "Fecha Expiración: Debe escoger un valor.", ""];
        } else {
            return [true, "", ""];
        }
    };

    function initGrid(viewModel) {
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Compras', 'Editar Compra', 'Agregar compra', '/lic/planilla', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC']);
        grid.prmEdit.beforeSubmit = beforeSubmit;
        grid.prmAdd.beforeSubmit = beforeSubmit;
        grid.navParameters.del = true;
        grid.navParameters.del = false;
        grid.navParameters.add = false;
        grid.build();
        grid.addExportButton('Excel', 'glyphicon glyphicon-download-alt', '/lic/exportplanilla');
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
            name: 'idProducto',
            hidden: true,
            editable: true,
            zsHidden: true
        }, {
            label: 'Contrato',
            name: 'contrato',
            width: 80,
            align: 'center',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'O.C.',
            name: 'ordenCompra',
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
            label: 'CUI',
            name: 'idCui',
            width: 80,
            align: 'center',
            sortable: false,
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/cui',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.idCui;
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
            name: 'idFabricante',
            jsonmap: 'fabricante.nombre',
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
            name: 'idProveedor',
            jsonmap: 'proveedor.nombre',
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
            search: false
        }, {
            label: 'Software',
            name: 'nombre',
            width: 200,
            align: 'center',
            editable: true,
            editrules: {
                required: true
            },
            search: true
        }, {
            label: '¿Donde está instalada?',
            name: 'idTipoInstalacion',
            jsonmap: 'tipoInstalacion.nombre',
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
            name: 'idClasificacion',
            jsonmap: 'clasificacion.nombre',
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
            name: 'idTipoLicenciamiento',
            jsonmap: 'tipoLicenciamiento.nombre',
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
            name: 'fechaCompra',
            width: 200,
            align: 'center',
            sortable: false,
            editable: true,
            formatter: function (cellvalue, options, rowObject) {
                var val = rowObject.fechaExpiracion;
                console.log("fecha:"+val);
                if (val != null) {
                    val = val.substring(0,10);
                    console.log("fecha2:"+val);//2017-10-28
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
            name: 'fechaExpiracion',
            align: 'center',
            width: 200,
            sortable: false,
            editable: true,
            formatter: function (cellvalue, options, rowObject) {
                var val = rowObject.fechaExpiracion;
                console.log("fecha:"+val);
                if (val != null) {
                    val = val.substring(0,10);
                    console.log("fecha2:"+val);//2017-10-28
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
            label: 'N° Lic Compradas',
            name: 'licCompradas',
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
            name: 'idMoneda',
            jsonmap: 'moneda.nombre',
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
            name: 'valorLicencia',
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
            label: 'Valor Soportes',
            name: 'valorSoporte',
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
            name: 'fechaRenovaSoporte',
            width: 125,
            align: 'center',
            sortable: false,
            editable: true,
            formatter: function (cellvalue, options, rowObject) {
                var val = rowObject.fechaExpiracion;
                console.log("fecha:"+val);
                if (val != null) {
                    val = val.substring(0,10);
                    console.log("fecha2:"+val);//2017-10-28
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
            label: 'N° Lic. Adquiridas',
            name: 'licStock',
            width: 125,
            align: 'center',
            sortable: false,
            editable: false,
            editoptions: {
                defaultValue: '0'
            },
            formatter: 'integer',
            search: false
        }, {
            label: 'N° Lic. Instaladas',
            name: 'licOcupadas',
            width: 125,
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
            name: 'alertaRenovacion',
            width: 140,
            align: 'center',
            sortable: false,
            editable: false,
            search: false
        }, {
            label: 'Comprador',
            name: 'comprador',
            align: 'left',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'Correo Comprador',
            name: 'correoComprador',
            align: 'left',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'Comentarios',
            name: 'comentarios',
            hidden: true,
            sortable: false,
            editable: true,
            edittype: 'textarea',
            search: false
        },
        ];
        initGrid(viewModel);
    });
})(jQuery, _);