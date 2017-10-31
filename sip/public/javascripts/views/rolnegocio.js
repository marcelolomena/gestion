
function showRoleGrid(parentRowId, parentRowKey) {

   var subgrid_name = parentRowId + "_table";
    var subgrid_pager = parentRowId + "_pager";
    var subgrid_url = "/rolnegocio/list/"+ parentRowKey;

    var template = "<div id='responsive-form' class='clearfix'>";
    
    
    template += "<div class='form-row'>";
    template += "<div class='column-half'>Rol de Negocio <span style='color: red'>*</span>{rolnegocio}</div>";
    template += "</div>";
    
    template += "<div class='form-row' style='display: none;'>";
    template += "</div>";
    
    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelRoles = [
        {label:"id",name:"id",key:true,hidden:true},
        {label: 'Rol de Negocio', name: 'rolnegocio', align: 'left',search:false,editable:false},
        {label: 'id_rol', name: 'rolnegocio',search:false,editable:true,hidden:true,
            edittype: "select",
            editoptions: {
                dataUrl: '/rolnegocio/getroles',
                buildSelect: function (response) {                    
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Rol--</option>';
                    $.each(data, function (i, item) {
                        s += '<option value="' + data[0][i].rolnegocio + '">' + data[0][i].rolnegocio + '</option>';
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#rol").val($('option:selected', this).text());
                    }
                }],
            }, 
            dataInit: function (elem) { $(elem).width(200); }
        }
    ];

    $('#' + parentRowId).append('<table id=' + subgrid_name + '></table><div id=' + subgrid_pager + ' class=scroll></div>');

    $("#"+subgrid_name).jqGrid({
        url: subgrid_url,
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelRoles,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        //editurl: '/rolnegocio/action/'+parentRowKey,
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        caption: 'Roles de Usuarios',
        pager: "#" + subgrid_pager,
        viewrecords: true,
        rowList: [10, 20, 50,100],
        styleUI: "Bootstrap",
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        },
        gridComplete: function () {
            var recs = $("#" + subgrid_name).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" +  subgrid_name).addRowData("blankRow", { "id": 0, "rolnegocio": "No hay roles definidos" });
            }
        }
    });
    $("#"+subgrid_name).jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#"+subgrid_name).jqGrid('navGrid', "#"+ subgrid_pager, 
    { edit: false, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false },{
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modificar Rol",
            url: '/rolnegocio/action/'+parentRowKey,
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
        },{            
            url: '/rolnegocio/action/'+parentRowKey,
            closeAfterAdd: true,
            recreateForm: true,
            mtype: "POST",
            addCaption: "Agregar Nuevo Rol de Negocio",
            template: template,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            beforeSubmit: function (postdata, formid) {
                console.log(postdata);
                if (postdata.rolnegocio == 0) {
                    return [false, "Rol: Debe seleccionar un valor", ""];
                } else {
                    return [true, "", ""];
                }
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""];
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + subgrid_name).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + subgrid_name).attr('id'));
            }
        },{
            url: '/rolnegocio/action/'+parentRowKey,
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Rol",
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
   });
};


$(document).ready(function(){
    
    var modelUsers= [
        {label:"uid",name:"uid",key:true,hidden:true},
        {label: 'Nombre', name: 'first_name', width: 300, align: 'left',search: true},
        {label: 'Apellido', name: 'last_name', width: 300, align: 'left',search: true},
        {label: 'Nombre de usuario', name: 'uname', width: 300, align: 'left',search: true},
        {label: 'E-mail', name: 'email', width: 300, align: 'left',search: true}
    ];

    $("#grid").jqGrid({
        url: '/rolnegocio/user/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelUsers,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        subGrid: true,
        subGridRowExpanded: showRoleGrid,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        caption: 'Lista de Usuarios',
        pager: "#pager",
        viewrecords: true,
        rowList: [10, 20, 50,100],
        styleUI: "Bootstrap",
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });

    $('#grid').jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#grid').jqGrid('navGrid', "#pager", { edit: false, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false },
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

    $("#pager_left").css("width", "");

    
});