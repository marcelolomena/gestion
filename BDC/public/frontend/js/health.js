$(document).ready(function () {
    $("#jqGrid").jqGrid({
        url: '/getReportSlowForPMO',
        mtype: "POST",
        datatype: "json",
        colModel: [
            { label: 'PMO', name: 'nombre',width:400 },
			{ label: 'Programa', name: 'programa' },
            { label: 'Texto', name: 'texto' },
            {
				label: '0) Registro OK. No presenta puntos de atención',
				name: 'indicador_0',
				summaryTpl : "<b>{0}</b>",
				summaryType: "sum",
				width:200,
				align:"right"
			},
            {
                label: '1) Programa que no tiene ningún proyecto',
                name: 'indicador_1',
                summaryTpl : "<b>{0}</b>",
   				summaryType: "sum",
   				width:200,
   				align:"right"
             },
             {
                 label: '2) El programa tiene proyectos, pero al menos uno de ellos no tiene tareas',
                 name: 'indicador_2',
                 summaryTpl : "<b>{0}</b>",
             		summaryType: "sum",
             		width:200,
             		align:"right"
             },
             {
                 label: '3) El proyecto tiene tareas, pero alguna de ellas no tiene subtareas',
                 name: 'indicador_3',
                 summaryTpl : "<b>{0}</b>",
             		summaryType: "sum",
             		width:200,
             		align:"right"
             },
             {
                 label: '4) El proyecto tiene subtareas, pero alguna de ellas no tiene horas asignadas',
                 name: 'indicador_4',
                 summaryTpl : "<b>{0}</b>",
             		summaryType: "sum",
             		width:200,
             		align:"right"
             },
             {
                 label: '5) El proyecto tiene al menos una subtarea sin horas imputadas, siendo que debió haber terminado',
                 name: 'indicador_5',
                 summaryTpl : "<b>{0}</b>",
             		summaryType: "sum",
             		width:200,
             		align:"right"
             },
             {
                 label: '6) Imputación de horas de acuerdo al tiempo transcurrido, pero no es consistente con el avance informado',
                 name: 'indicador_6',
                 summaryTpl : "<b>{0}</b>",
             		summaryType: "sum",
             		width:200,
             		align:"right"
             }
        ],
		loadonce:true,
		prmNames: {nd: null,rows:null,page:null,search:null},
        shrinkToFit: false,
        rowNum: 5000,
        scroll: 1,
        forceFit:true,
        height: "auto",
        //width:800,
        pager: "#jqGridPager",
        //sortable: false,
        grouping: true,
        groupingView: {
            groupField: ["nombre", "programa"],
            groupColumnShow: [true, true],
            groupText: [
				"<b>{0}</b>",
				"<b>{0}</b>"
			],
            groupOrder: ["asc", "asc"],
            groupSummary: [true, false],
			groupSummaryPos: ['header', 'header'],
            groupCollapse: true
        },
        ajaxGridOptions: {
            contentType: "application/json; charset=utf-8",
        },
        serializeGridData: function(postData) {
            return JSON.stringify(postData);
        }
    });
});
