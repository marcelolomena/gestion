$(document).ready(function(){
	var optionsPieIncident ={
			chart: {
				renderTo: 'container',
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },title: {
	            text: 'REAL Erogaciones por SAP'
	        },tooltip: {
	        	formatter: function() {
	        	    return '<b>'+ this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 2) +' %';
	        	}	        	
	        },plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                point: {
	                    events: {
	                       click: function(event) {
	                    	   grillaProgramaDepa(this.options.dId,this.options.name);
	                       }
	                    }
	                 },
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    },
	                    connectorColor: 'silver'
	                }
	            }
	        },series: []			
	};
    
	$.ajax({
		  url: '/graficodata',
		  type: 'GET',
		  success: function(data) {
			  optionsPieIncident.series.push(JSON.parse(data));
				var charPieDepa = new Highcharts.Chart(optionsPieIncident);
			
		  },
		  error: function(e) {

		  }
	});	    
});
