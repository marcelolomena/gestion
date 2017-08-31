var gridaprobaciones = {

    renderGrid: function (loadurl, targ) {
        var $gridTabAprobaciones = $(targ + "_t")
        console.log(loadurl.substring(14))
        console.log(loadurl)
        console.log("el gridtab: " + $gridTabAprobaciones)
        console.log("el targ: " + targ)
        var rut = loadurl.substring(14);
        $gridTabAprobaciones.jqGrid({
            url: loadurl+'/2',
            datatype: "json",
            mtype: "GET",
            colModel: [
                {
                    label: 'Id', name: 'Id', index: 'Id', key: true, hidden: true, width: 10,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
                },

                { label: 'Tipo', name: 'tipoaprobacion', width: 25, hidden: false, search: true, editable: true, align: 'left', editrules: { required: true } },
                { label: 'F. Creación', name: 'FechaCreacion', width: 25, hidden: false, search: true, editable: true, align: 'left', editrules: { required: true } },
                { label: 'F. Ult. Act.', name: 'FechaUltAct', width: 25, hidden: false, search: true, editable: true, align: 'left', editrules: { required: true } },
                { label: 'Estado', name: 'estadoaprobacion', width: 25, hidden: false, search: true, editable: true, align: 'left', editrules: { required: true } },
                { label: 'Ejecutivo', name: 'Ejecutivo', width: 25, hidden: false, search: true, editable: true, align: 'left', editrules: { required: true } },

            ],

            rowNum: 20,
            //pager: '#navGridtabverlimiasdasdastes2',
            styleUI: "Bootstrap",
            //sortname: 'fecha',
            //sortorder: "desc",
            height: "auto",
            shrinkToFit: true,
            //autowidth: true,
            width: 1350,
            rownumbers: false,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Aprobaciones",
            gridComplete: function () {
                // gridcomplete
            },
            loadComplete: function () {
                // loadcomplete
                $gridTabAprobaciones.append(`
                    <button type="submit" id="botoncrear" class="btn btn-default" style="margin-top: 0px;">Crear nueva Aprobación</button>        
                `);
                $('#botoncrear').click(function () {

                    window.location.assign("/menu/crearaprobacion/p/" + rut);

                });
            },


        });






    }
}
var gridaprobaciones2 = {
    
        renderGrid: function (loadurl, targ) {
            var $gridTabAprobaciones = $(targ + "_t")
            console.log(loadurl.substring(14))
            console.log(loadurl)
            console.log("el gridtab: " + $gridTabAprobaciones)
            console.log("el targ: " + targ)
            var rut = loadurl.substring(14);
            $gridTabAprobaciones.jqGrid({
                url: loadurl+'/2',
                datatype: "json",
                mtype: "GET",
                colModel: [
                    {
                        label: 'Id', name: 'Id', index: 'Id', key: true, hidden: true, width: 10,
                        editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
                    },
    
                    { label: 'Tipo', name: 'tipoaprobacion', width: 25, hidden: false, search: true, editable: true, align: 'left', editrules: { required: true } },
                    { label: 'F. Creación', name: 'FechaCreacion', width: 25, hidden: false, search: true, editable: true, align: 'left', editrules: { required: true } },
                    { label: 'F. Ult. Act.', name: 'FechaUltAct', width: 25, hidden: false, search: true, editable: true, align: 'left', editrules: { required: true } },
                    { label: 'Estado', name: 'estadoaprobacion', width: 25, hidden: false, search: true, editable: true, align: 'left', editrules: { required: true } },
                    { label: 'Ejecutivo', name: 'Ejecutivo', width: 25, hidden: false, search: true, editable: true, align: 'left', editrules: { required: true } },
    
                ],
    
                rowNum: 20,
                //pager: '#navGridtabverlimiasdasdastes2',
                styleUI: "Bootstrap",
                //sortname: 'fecha',
                //sortorder: "desc",
                height: "auto",
                shrinkToFit: true,
                //autowidth: true,
                width: 1350,
                rownumbers: false,
                onSelectRow: function (id) {
                    var getID = $(this).jqGrid('getCell', id, 'id');
                },
                viewrecords: true,
                caption: "Aprobaciones",
                gridComplete: function () {
                    // gridcomplete
                },
                loadComplete: function () {
                    // loadcomplete
                    $gridTabAprobaciones.append(`
                        <button type="submit" id="botoncrear" class="btn btn-default" style="margin-top: 0px;">Crear nueva Aprobación</button>        
                    `);
                    $('#botoncrear').click(function () {
    
                        window.location.assign("/menu/crearaprobacion/p/" + rut);
    
                    });
                },
    
    
            });
    
    
    
    
    
    
        }
    }