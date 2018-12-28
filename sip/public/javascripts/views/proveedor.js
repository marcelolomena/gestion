$(document).ready(function () {

   $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
   
   function formatearut(rut)
   {
       var number = new String(rut);

       var result = '';

       while( number.length > 3 )
       {
         result = '.' + number.substr(number.length - 3) + result;
         number = number.substring(0, number.length - 3);
       }

       result = number + result; 
       return result;
   }
   function validaRut(campo,colname){
    
    var result;
    
	if ( campo.length == 0 ){ result = [ true, colname + ""]; return result }
	//if ( campo.length < 8 ){ result = [ false, colname + ": rut invalido"] }

	campo = campo.replace('-','')
	campo = campo.replace(/\./g,'')

	var suma = 0;
	var caracteres = "1234567890kK";
	var contador = 0;    
	for (var i=0; i < campo.length; i++){
		u = campo.substring(i, i + 1);
		if (caracteres.indexOf(u) != -1)
		contador ++;
	}
	if ( contador==0 ) { result = [ false, colname + ": rut invalido"] }
	
	var rut = campo.substring(0,campo.length-1)
	var drut = campo.substring( campo.length-1 )
	var dvr = '0';
	var mul = 2;
	
	for (i= rut.length -1 ; i >= 0; i--) {
		suma = suma + rut.charAt(i) * mul
                if (mul == 7) 	mul = 2
		        else	mul++
	}
	res = suma % 11
	if (res==1)		dvr = 'k'
                else if (res==0) dvr = '0'
	else {
		dvi = 11-res
		dvr = dvi + ""
	}
	if ( dvr != drut.toLowerCase() ) { result = [ false, colname + ": rut invalido"]; }
	else { result=[ true, colname + ""]; }
    return result
}

    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>* </span>Rut {numrut}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>* </span>Razon Social {razonsocial}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Negociador DIVOT {uid}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-half'>Negociador {negociadordivot}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Rut Representante Legal {rutrepresentante}</div>";
    tmpl += "</div>";
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Nombre Representante Legal {nombrerepresentante}</div>";
    tmpl += "</div>";
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Telefono Representante Legal {fonorepresentante}</div>";
    tmpl += "</div>";
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Correo Representante Legal {correorepresentante}</div>";
    tmpl += "</div>";
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Razon Social Contractual {razonsocialcontractual}</div>";
    tmpl += "</div>";       
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Fecha Escritura Publica {fechaescritura}</div>";
    tmpl += "</div>";          
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Notaria Escritura Publica {notariaescritura}</div>";
    tmpl += "</div>";            
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Rut Apoderado 1 {rutapoderado1}</div>";
    tmpl += "</div>";   
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Nombre Primer Apoderado {nombreapoderado1}</div>";
    tmpl += "</div>";   
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Rut Apoderado 2 {rutapoderado2}</div>";
    tmpl += "</div>";   
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Nombre Segundo Apoderado {nombreapoderado2}</div>";
    tmpl += "<div class='column-half'>Tipo Enrolamiento Proveedor<span style='color:red'>*</span>{enrolamiento}</div>";    
    tmpl += "</div>";             
    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var modelProveedor = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'RUT', name: 'numrut', width: 150, align: 'right', search: true, editable: true,
            editoptions: { maxlength: 20, size: 17, dataInit: function (el) { $(el).mask("00.000.000-A",{reverse: true}); } },
            editrules: { required: true, custom: true, custom_func: validaRut }, 
            formoptions: { elmsuffix: '<span class="required">*</span>' },
            formatter: function (cellvalue, options, rowObject) {var rut = formatearut(rowObject.numrut) + "-" + rowObject.dvrut;  return rut},                                   
        },
        { label: 'DV', name: 'dvrut', search: false, editable: false, hidden: true },
        { label: 'Razón Social', name: 'razonsocial', width: 500, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 2 } },
        { label: 'Negociador DIVOT uid', name: 'uid', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/Negociador',
                buildSelect: function (response) {
                    var grid = $("#table_proveedor");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uid;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Negociador--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].uid == thissid) {
                            s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#negociadordivot").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Negociador Divot', name: 'negociadordivot', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        { label: 'Rut Representante Legal', name: 'rutrepresentante', width: 150, align: 'right', search: true, editable: true,
            editoptions: { maxlength: 20, size: 17, dataInit: function (el) { $(el).mask("00.000.000-A",{reverse: true}); } },
            editrules: { custom: true, custom_func: validaRut }                                   
        },
        {
            label: 'Nombre Representante Legal', name: 'nombrerepresentante', width: 223, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Telefono Representante Legal', name: 'fonorepresentante', width: 220, align: 'center', search: false, editable: true,
                editoptions: {
                         dataInit: function (element) {
                        $(element).mask("00000000000", { placeholder: "___________" });
                    }
                }
        },
        { label: 'Correo Representante Legal', name: 'correorepresentante',index: "email", width: 200, align: 'left', search: false, editable: true,                   
                 editoptions: { maxlength: 80, size: 32 }, 
                 editrules: { email: true, required: false} 
        },
        {
            label: 'Razon Social Contractual', name: 'razonsocialcontractual', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Fecha Escritura Publica', name: 'fechaescritura', width: 130, align: 'right', search: false, sortable: false, 
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true, formoptions: { rowpos: 2, colpos: 1 },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'dd-mm-yy' })
                }
            }
        },      
        {
            label: 'Notaria Escritura Publica', name: 'notariaescritura', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        }, 
        { label: 'Rut Apoderado 1', name: 'rutapoderado1', width: 150, align: 'right', search: true, editable: true,
            editoptions: { maxlength: 20, size: 17, dataInit: function (el) { $(el).mask("00.000.000-A",{reverse: true}); } },
            editrules: { custom: true, custom_func: validaRut }                                   
        },
        {
            label: 'Nombre Primer Apoderado', name: 'nombreapoderado1', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        { label: 'Rut Apoderado 2', name: 'rutapoderado2', width: 150, align: 'right', search: true, editable: true,
            editoptions: { maxlength: 20, size: 17, dataInit: function (el) { $(el).mask("00.000.000-A",{reverse: true}); } },
            editrules: { custom: true, custom_func: validaRut }                                   
        },
        {
            label: 'Nombre Segundo Apoderado', name: 'nombreapoderado2', width: 210, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        }, 
        {
            label: 'Tipo Enrolamiento', name: 'enrolamiento', editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/parameters/enrolamiento',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.plazocontrato;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Tipo Enrolamiento--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var thistid = $(this).val();
                        $("input#enrolamiento").val($('option:selected', this).text());
                    }
                }],
            }
        },               
    ];

    var tmpc = "<div id='responsive-form' class='clearfix'>";

    tmpc += "<div class='form-row'>";
    tmpc += "<div class='column-full'><span style='color:red'>* </span>Contacto {contacto}</div>";
    tmpc += "</div>";

    tmpc += "<div class='form-row'>";
    tmpc += "<div class='column-full'><span style='color:red'>* </span>Telefono {fono}</div>";
    tmpc += "</div>";

    tmpc += "<div class='form-row'>";
    tmpc += "<div class='column-full'><span style='color:red'>* </span>Correo {correo}</div>";
    tmpc += "</div>";
    
    tmpc += "<div class='form-row'>";
    tmpc += "<div class='column-full'><span style='color:red'>* </span>Tipo {tipo}</div>";
    tmpc += "</div>";    

    tmpc += "<hr style='width:100%;'/>";
    tmpc += "<div> {sData} {cData}  </div>";
    tmpc += "</div>";

    $("#table_proveedor").jqGrid({
        url: '/proveedores/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelProveedor,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: 1300,
        shrinkToFit: false,
        caption: 'Lista de proveedores',
        pager: "#pager_proveedor",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        editurl: '/proveedores/action',
        styleUI: "Bootstrap",
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showContactos, // javascript function that will take care of showing the child grid        
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });
    $("#table_proveedor").jqGrid('filterToolbar', {  stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#table_proveedor').jqGrid('navGrid', "#pager_proveedor", { edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false },
        {
            editCaption: "Modifica Proveedor",
            closeAfterEdit: true,
            recreateForm: true,
            //  mtype: 'POST',
            //  url: '/proveedores/update',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
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
                $('input#numrut', form).attr('readonly', 'readonly');
                sipLibrary.centerDialog($('#table_proveedor').attr('id'));
            }
        },
        {
            addCaption: "Agrega Proveedor",
            closeAfterAdd: true,
            recreateForm: true,
            // mtype: 'POST',
            // url: '/proveedores/add',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                if (postdata.numrut == 0) {
                    return [false, "Rut: Debe escoger un valor", ""];
                } if (postdata.razonsocial == 0) {
                    return [false, "Razon Social: Debe escoger un valor", ""];
            //    } if (postdata.negociadordivot == 0) {
            //        return [false, "Negociador DIVOT: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0) {
                    return [false, result.error_text, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"razonsocial\",\"op\":\"cn\",\"data\":\"" + postdata.razonsocial + "\"}]}";
                    $("#table_proveedor").jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($('#table_proveedor').attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#table_proveedor").attr('id'));
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

    $('#table_proveedor').jqGrid('navButtonAdd', '#pager_proveedor', {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#table_proveedor');
            var rowKey = grid.getGridParam("selrow");
            var url = '/proveedoresexcel';
            $('#table_proveedor').jqGrid('excelExport', { "url": url });
        }
    });

    function showContactos(parentRowID, parentRowKey) {
        var childGridID = parentRowID + "_table";
        var childGridPagerID = parentRowID + "_pager";
        var childGridURL = "/contactos/list/" + parentRowKey;

        var modelContacto = [
            { label: 'Contacto', name: 'contacto', width: 300, align: 'center', search: true, editable: true, },
            {
                label: 'Telefono', name: 'fono', width: 100, align: 'center', search: false, editable: true,
                editoptions: {
                         dataInit: function (element) {
                        $(element).mask("00000000000", { placeholder: "___________" });
                    }
                }
            },
            { label: 'Correo', name: 'correo',index: "email", width: 300, align: 'left', search: false, editable: true,                   
                 editoptions: { maxlength: 80, size: 32 }, 
                 editrules: { email: true, required: false} 
            },
            { label: 'Tipo', name: 'tipo',index: "tipo", width: 300, align: 'left', search: false, editable: true,
               edittype: "select",                   
                 editoptions: { 
                    dataUrl: '/usuarios_por_rol/Negociador',
                    buildSelect: function (response) {
                        var grid = $("#" + childGridID);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.tipo;                        
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Tipo--</option>';
                        if (thissid == "Facturación") {
                            s += '<option selected value="Facturación">Facturación</option>';
                        } else {
                            s += '<option value="Facturación">Facturación</option>';
                        }
                        if (thissid == "Comercial") {
                            s += '<option value="Comercial" selected>Comercial</option>';
                        } else {
                            s += '<option value="Comercial">Comercial</option>';
                        }
                        if (thissid == "Técnico") {
                            s += '<option value="Técnico">Técnico</option>';
                        } else {
                            s += '<option value="Técnico">Técnico</option>';
                        }
                        return s + "</select>";
                    },

            }, dataInit: function (elem) { $(elem).width(200); }                 
            }            
            
        ];

        $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


        $("#" + childGridID).jqGrid({
            url: childGridURL,
            mtype: "GET",
            cache: false,
            datatype: "json",
            page: 1,
            colModel: modelContacto,
            viewrecords: true,
            styleUI: "Bootstrap",
            regional: 'es',
            height: 'auto',
            width: 850,
            pager: "#" + childGridPagerID,
            editurl: '/contactos/action',
            gridComplete: function () {
                var recs = $("#" + childGridID).getGridParam("reccount");
                if (isNaN(recs) || recs == 0) {

                    $("#" + childGridID).addRowData("blankRow", { "contacto": "", "fono": "No hay datos" });
                }
            }
        });

        $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
            edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
        },
            {
                closeAfterEdit: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                editCaption: "Modifica Contacto",
                template: tmpc,
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
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                }, afterShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                }
            },
            {
                closeAfterAdd: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Agrega contacto",
                template: tmpc,
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                },
                beforeSubmit: function (postdata, formid) {
                    if (postdata.contacto == 0) {
                        return [false, "Contacto: Debe escoger un valor", ""];
                    } if (postdata.fono == 0) {
                        return [false, "Telefono: Debe escoger un valor", ""];
                    } if (postdata.correo == 0) {
                        return [false, "Correo: Debe escoger un valor", ""];
                    } else {
                        return [true, "", ""]
                    }
                },
                afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (result.error_code != 0) {
                        return [false, result.error_text, ""];
                    } else {
                        var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"contacto\",\"op\":\"cn\",\"data\":\"" + postdata.contacto + "\"}]}";
                        $("#" + childGridID).jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                        return [true, "", ""];
                    }
                },
                beforeShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                },
                afterShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                },
                onclickSubmit: function (rowid) {
                    return { parent_id: parentRowKey };
                },
            },
            {
                closeAfterDelete: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Elimina Contacto",
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

    }

    $("#pager_proveedor_left").css("width", "");
});