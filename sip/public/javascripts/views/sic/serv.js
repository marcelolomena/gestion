//doc.js
var gridServ = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t")

        var tmplServ = "<div id='responsive-form' class='clearfix'>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Servicio<span style='color:red'>*</span>{idservicio}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Glosa Servicio<span style='color:red'>*</span>{glosaservicio}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Documento Técnico Asociado<span style='color:red'>*</span>{iddoctotecnico}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Glosa Referencia Dcto<span style='color:red'>*</span>{glosareferencia}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Clase Criticidad<span style='color:red'>*</span>{idclasecriticidad}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-half'>Nota Criticidad<span style='color:red'>*</span>{notacriticidad}</div>";
        tmplServ += "<div class='column-half'>Color Nota<span style='color:red'>*</span>{colornota}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Clase Proveedor<span style='color:red'>*</span>{claseproveedor}</div>";
        tmplServ += "</div>";

        tmplServ += "<hr style='width:100%;'/>";
        tmplServ += "<div> {sData} {cData}  </div>";
        tmplServ += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'Solicitud', 'idServicio', 'Servicio', 'Glosa Servicio', 'Id Documento','Documento', 'Glosa Referencia', 'ID Clase Criticidad','Clase Criticidad','Nota Criticidad', 'Color Nota', 'Clase Proveedor'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true },
                { name: 'idsolicitud', index: 'idsolicitud', width: 100, hidden: true, editable: true },
                //{ name: 'idservicio', index: 'idservicio', width: 100, hidden: true, editable: true, editoptions: { size: 10 } },
                {
                    name: 'idservicio', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/servicios/' + parentRowKey + '/list',
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.idservicio;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Seleccione un Servicio--</option>';
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
                },
                { name: 'servicio.nombre', index: 'servicio', width: 150, editable: true, editoptions: { size: 10 } },
                { name: 'glosaservicio', index: 'glosaservicio', width: 200, editable: true, editoptions: { size: 25 } },
                //{ name: 'iddoctotecnico', index: 'iddoctotecnico', width: 100, hidden: true,  editable: true, editoptions: { size: 10 } },
                {
                    name: 'iddoctotecnico', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/servicios/' + parentRowKey + '/doctoasociado',
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.iddoctotecnico;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Seleccione un Documento--</option>';
                            $.each(data, function (i, item) {

                                if (data[i].id == thissid) {
                                    s += '<option value="' + data[i].id + '" selected>' + data[i].nombrecorto + '</option>';
                                } else {
                                    s += '<option value="' + data[i].id + '">' + data[i].nombrecorto + '</option>';
                                }
                            });
                            return s + "</select>";
                        }
                    }
                },
                { name: 'documentoscotizacion.nombrecorto', index: 'documento', width: 150, editable: true, editoptions: { size: 10 } },
                { name: 'glosareferencia', index: 'glosareferencia', width: 200, align: "left", editable: true, editoptions: { size: 10 } },
                {
                    name: 'idclasecriticidad', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/clasecriticidadserv',
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.idclasecriticidad;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Seleccione Clase Criticidad--</option>';
                            $.each(data, function (i, item) {

                                if (data[i].id == thissid) {
                                    s += '<option value="' + data[i].id + '" selected>' + data[i].glosaclase + '</option>';
                                } else {
                                    s += '<option value="' + data[i].id + '">' + data[i].glosaclase + '</option>';
                                }
                            });
                            return s + "</select>";
                        }
                    }
                },
                { name: 'clasecriticidad.glosaclase', index: 'clasecriticidad', width: 150, align: "left", editable: true, editoptions: { size: 10 } },
                { name: 'notacriticidad', index: 'notacriticidad', width: 150, align: "left", editable: true, editoptions: { size: 10 } },
                { name: 'colornota', index: 'colornota', width: 50, align: "left", editable: true, editoptions: { size: 10 } },
                { name: 'claseproveedor', index: 'claseproveedor', width: 150, align: "left", editable: true, editoptions: { size: 10 } }
            ],
            rowNum: 5,
            rowList: [3, 6],
            loadonce: true,
            pager: '#navGridServ',
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            shrinkToFit: false,
            height: "auto",
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Servicios"
        });
        $gridTab.jqGrid('navGrid', '#navGridServ', { edit: true, add: true, del: true, search: false },
            {
                editCaption: "Modifica Servicio",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmplServ,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON
            }, {
                addCaption: "Agrega Servicio",
                closeAfterAdd: true,
                recreateForm: true,
                template: tmplServ,
                mtype: 'POST',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON
            }, {

            }, {

            });


    }
}

