/**
* Calendar Object: contains calendar parameter and calendar methods 
**/
var timesheetCalendar = {
    
    //contains current week by index
    currentWeek: 1,
    //7: week view 35: month view
    //set currently active calendar cell
    setCurrentActive: function(){
        if(Slider.jump >0){   
        	
            var days = Math.round(Slider.cnt / Slider.jump);
            var ind = days, cWeek = this.currentWeek;
            var viewType=parseInt($("#viewType").val());
            if(viewType==7){
            	ind = Math.round(days % 7);
            }
            if(viewType==35){
            	/**
            	 * scroll down when during roadmap play.
            	 */
            	if(ind==7 || ind==14 || ind==21 ){
            		var y = $(window).scrollTop();  //your current y position on the page
                	$(window).scrollTop(y+6);		
            	}
            }
            //alert(ind);
            cWeek = Math.ceil((days+1) / 7)
            //alert(cWeek);
            if(cWeek != this.currentWeek){
                var t = Date.parse($("#start_date").val());
                this.cStart = t.add({ days: (7 * (cWeek - 1)) });
                this.currentWeek = cWeek;
                if(viewType==7){
                	this.generateCalendar();
                }
            }
      
            var tmp =$(".date_cell").eq(ind);
      
            if(!$(tmp).hasClass("disabled")){
                $(".map_data_detail").find(".hover").removeClass("hover");
                $(tmp).addClass("hover");
                
                this.setCountryInfoSelection();
               
               
               /**
                * code to show/hide marker while play details....
                */
               var map = $('#map').vectorMap('getMap');
               //alert($(".map_data_detail").find(".hover").find(".number").attr("id"));
               var date =  $(".map_data_detail").find(".hover").find(".number").attr("id");
               var codeValues =  $(".map_data_detail").find(".hover").find(".number").prev().attr("id");
               var countryArray = new Array();
           
               $(".map_data_detail").find(".hover").find(".number").parent().find("p").each(function(index){
            	   if($.inArray($(this).attr("id"), countryArray) == -1)
                      countryArray.push($(this).attr("id"));
               });
            
               if(codeValues){
            	   $.each(countryArray, function(ind, code){
            		   
            		 ///code start....this will change marker background possition as per the milestone status..
                	   var m = $("#"+date).parent().parent();
                	   $(m).find("p").each(function(index){
                		   //alert($(this).children().attr("class"));  
                		   var cc =  $(this).attr("id");
                  		   var classStatus = $(this).children().attr("class").split(" ")[1]
                		   if(cc== code){
                			   if($("#roadmapType").val()=="1"){
                				   //alert(classStatus);
	                			   switch(classStatus){
	                			   case "cl":
	                				   //green
	                				   $("#marker_"+code.toLowerCase()).css({"background-position":"-58px center"});
	                				   break;
	                			   case "uat":
	                				   $("#marker_"+code.toLowerCase()).css({"background-position":"-90px center"});
	                				   //orange
	                				   break;
	                			   case "esa":
	                				   //red
	                				   $("#marker_"+code.toLowerCase()).css({"background-position":"-76px center"});
	                				   break;
	                			
	                			   }
                			   }else{
                				   
                				   switch(classStatus){
	                			   case "cl":
	                				   //green
	                				   $("#marker_"+code.toLowerCase()).addClass("marker_green");
	                				   $("#marker_"+code.toLowerCase()).removeClass("marker_red");
	                				   $("#marker_"+code.toLowerCase()).removeClass("marker_orange");
	                				   break;
	                			   case "uat":
	                				   $("#marker_"+code.toLowerCase()).addClass("marker_orange");
	                				   $("#marker_"+code.toLowerCase()).removeClass("marker_red");
	                				   $("#marker_"+code.toLowerCase()).removeClass("marker_green");
	                				   //orange
	                				   break;
	                			   case "esa":
	                				   //red
	                				   $("#marker_"+code.toLowerCase()).addClass("marker_red");
	                				   $("#marker_"+code.toLowerCase()).removeClass("marker_green");
	                				   $("#marker_"+code.toLowerCase()).removeClass("marker_orange");
	                				   break;
	                			
	                			   }
                			   }
                		   }        		          		 
                	   });
                	   /**
                	    * code end here for milestone color change...
                	    */
            		   
                	   //map.showMarkerInfo(code.toLowerCase(), $("#marker_"+code.toLowerCase()), date);      
                   });
               }else{
            	   //map.hideMarkerInfo();
               }
            }
            
        }
    },
    
    setCountryInfoSelection: function(){
       /* if($("#map").attr("type")=='world')
            return;
        */
        $(".release-info").find(".border-with-radius").removeClass("border-with-radius");
        var dt= $(".map_data_detail").find(".hover").find(".number").attr("id");
       
        $(".release-info").find("div.clear_both").each(function(){
           if($(this).attr("id").indexOf(dt) > -1)
                $(this).addClass("border-with-radius"); 
        });
        
    },
    
    //calendar parameters
    cStart: null,
    cEnd: null,
    cData: null,
    
    //method to generate calendar
    generateCalendar: function(){
        var startDt = this.cStart;
        var endDt = this.cEnd;
        //Calendar.cpreviousStart =this.cStart;
        //alert(startDt + " " +endDt);
        var data = this.cData;
       
        var today =  Date.parse($("#current-timesheet-date").val());
        var weekno = today.getWeek(); 
        var currentDate = today;
        var currentWeek =  new Date(startDt);
        var weeknum = currentWeek.getWeek(); 
        
        //clear the div
        $(".map_data_detail").html("");
        
        //get the start date
        
        var dt = startDt;
        var date = dt.getDate();
        
        $(".release-info").hide().find(".dialog-content").html("");
        //set the table header part
        var weekTitle = "<div class='weekTitle'> Week - " +weeknum + " &nbsp;/&nbsp; </div>  " ;
        var titleEndDt = "", calendarTitle=startDt.toString("MMMM d"), isFirst = true, _self =this;
        //map.clearMarker();
        var infoObject = { title: "Minor Release", message: "date: NA", background: "red", releaseCode: "CL" };
        //iterate for 7 days and create the 7 day's table
        
        //var viewType = parseInt($("#viewType").val());
       
        for(i=0; i< 7 ; i++){
        	
            //if it is first day of week
            if(i > 0)
                date = dt.add({ days: 1 }).getDate();
            
            var currentClass = "";
            if(dt.toString() == currentDate.toString()){
            	currentClass = "currentDate";
            }
            var addBorder = "";
            if(i==0){
            	addBorder = "style='border-left:1px solid #CFD9DD;'";
            }
            //generate the inner html for a day_cell and append to table
            var cell = $("<div "+addBorder+" ><div />").attr("index", i).addClass("calanderCell date_cell hide "+currentClass+" disabled").html('<div class="number numberCell">&nbsp;</div>');
            $(".map_data_detail").append(cell);
            //set the date number
            $(".map_data_detail").find("div.number").eq(i).html(date).attr("id", dt);
            
            //if the current day of week is exeeds the end_date then do not execute
            if(Util.getDateDiff(dt, $("#end_date").val()) >= 0){
                $(".date_cell").eq(i).removeClass("disabled");
              
                titleEndDt = dt.toString("MMMM d, yyyy");          
                
                //check the date with fetched data and append the matching events
                var element = $(".map_data_detail").find("div.number").eq(i);
              
                $.each(data, function(key, row){
                    //check for customer launch
                    if(dt.toString('yyyy-MM-dd')==row.CountryProduct.customer_launch_date){
                       //_self.addMarker('cl', row, map, isFirst, dt, element);
                       //isFirst=false;
                    }
                    
                    //check for store availability
                    if(dt.toString('yyyy-MM-dd')==row.CountryProduct.expected_store_availability_date){
                    
                       _self.addMarker('esa', row, map, isFirst, dt, element);
                       isFirst=false;   
                    }
                    
                    //check for staff launch
                    if( dt.toString('yyyy-MM-dd')==row.CountryProduct.uat_staff_launch_date){
                       //_self.addMarker('uat', row, map, isFirst, dt, element);
                       //isFirst=false;                       
                    }
                }); 
            }
            
            //show the generated cell
            $(cell).fadeIn(2000);   
        }
      
       // var initDate ="Jan 01 2013 00:00:00 GMT"
      
        
        //set the onclick event to cell
        timesheetCalendar.onCellClick();
        
        
      
        
        
        //set the calendar title
        calendarTitle += " - " + titleEndDt ;
        var newcalendarTitle = weekTitle+" <div class='left font-helvetica monthMargin'>"+ calendarTitle + "</div>";
        
        var browservalue = navigator.userAgent.toUpperCase(); 
        if (navigator.appVersion.indexOf("Mac")!=-1){
        	 var prevWeek='<div class="previousWeekArrow1"> << </div> <div class="previousWeek"> Previous</div>'; 
             var nextWeek='<div class="nextWeekArrow1"> >> </div><div class="nextWeek">Next </div>  ';
             	
        }else{
        	 var prevWeek='<div class="previousWeekArrow"> << </div> <div class="previousWeek"> Previous</div>'; 
             var nextWeek='<div class="nextWeekArrow"> >> </div><div class="nextWeek">Next </div>  ';
        }
        
        prevWeek+=newcalendarTitle;
        prevWeek+=nextWeek;
        
        //$(".calendarTitle").html("prevWeek");
        
     
    	
        
    },
    Launches: { uat: ["UAT Staff Launch", "uat_staff_launch"], cl: ["Customer Launch", "customer_launch"], esa: ["Expected Store Availability", "expected_store_availability"]},
    addMarker: function(launch, row, map, isFirst, dt, element){
       var tDate = dt.toString("dd-MM-yyyy"), tDate2 = dt.toString("MMMM d, yyyy");
       var rowId = launch+"-"+row.Country.code+"-"+row.Product.id+"-"+tDate;
       // tDate2 removed..
       var roadmapType= $("#roadmapType").val();
       var msgMilestonetitle = "";
       switch(row.CountryProduct.milestoneStatus){
       case "0":
    		msgMilestonetitle = "<span class='notation_code_mil'><span style='float:left;padding-bottom:3px;width:100%;border-bottom:1px solid #E6E6E6;color:green;font-weight:bold;'>"+row.CountryProduct.milestone_title.toUpperCase()+"</span><a style='color:#585858;' target='_blank' href='/project-details/"+row.Product.pId +"#"+row.CountryProduct.id+"#"+roadmapType+"'><span>"+row.CountryProduct.description.substring(0, 100)+"</span><span class='more-milestone'>....More</span></a>"
    	   break;
       case "1":
    		msgMilestonetitle = "<span class='notation_code_mil'><span style='float:left;padding-bottom:3px;width:100%;border-bottom:1px solid #E6E6E6;color:#FF9900;font-weight:bold;'>"+row.CountryProduct.milestone_title.toUpperCase()+"</span><a style='color:#585858;' target='_blank' href='/project-details/"+row.Product.pId +"#"+row.CountryProduct.id+"#"+roadmapType+"'><span>"+row.CountryProduct.description.substring(0, 100)+"</span><span class='more-milestone'>....More</span></a>"
    	   break;
       case "2":
    		msgMilestonetitle = "<span class='notation_code_mil'><span style='float:left;padding-bottom:3px;width:100%;border-bottom:1px solid #E6E6E6;color:red;font-weight:bold;'>"+row.CountryProduct.milestone_title.toUpperCase()+"</span><a style='color:#585858;' target='_blank' href='/project-details/"+row.Product.pId +"#"+row.CountryProduct.id+"#"+roadmapType+"'><span>"+row.CountryProduct.description.substring(0, 100)+"</span><span class='more-milestone'>....More</span></a>"
    	   break;
       }
       
       // alert(this.arrayCount);alert(this.arrayCount);
       this.arrayCount=this.arrayCount+1;
       var info = { title: this.Launches[launch][0], "row":rowId, date: tDate, message:msgMilestonetitle, releaseCode: launch.toUpperCase(), milestoneTitle:row.CountryProduct.milestone_title,milestoneStatus:row.CountryProduct.milestoneStatus, lengths:this.arrayCount};
     //Notation.getNotationDiv(this.Launches[launch][1]) .....code removed span inserted manually
      switch(row.CountryProduct.milestoneStatus){
      case "0":
    	  $(element).before("<a href='/project-details/"+row.CountryProduct.product_id+"#"+row.CountryProduct.id+"' target='_blank'><p row='"+rowId+"' id='"+row.Country.code+"' style='float:left'>" + "<span class='notation_code cl'>"+row.CountryProduct.milestone_code+"</span><span class='marker-info' style='float:left;max-width:63px;'>"+row.Product.title+"<br></span></p></a>");
    	  break;
      case "1":
    	  $(element).before("<a  href='/project-details/"+row.CountryProduct.product_id+"#"+row.CountryProduct.id+"'  target='_blank'><p row='"+rowId+"' id='"+row.Country.code+"' style='float:left'>" + "<span class='notation_code uat'>"+row.CountryProduct.milestone_code+"</span><span class='marker-info' style='float:left;max-width:63px;'>"+row.Product.title+"<br></span></p></a>");
    	  break;
      case "2":
    	  $(element).before("<a  href='/project-details/"+row.CountryProduct.product_id+"#"+row.CountryProduct.id+"'  target='_blank'><p row='"+rowId+"' id='"+row.Country.code+"' style='float:left'>" + "<span class='notation_code esa'>"+row.CountryProduct.milestone_code+"</span><span class='marker-info' style='float:left;max-width:63px;'>"+row.Product.title+"<br></span></p></a>");
    	  break;
      }
   
       //$(element).before("<p row='"+rowId+"' id='"+row.Country.code+"'>" + "<span class='notation_code esa'>"+row.CountryProduct.milestone_code+"</span><span class='marker-info'>"+row.Product.title+"<br><span class='notation_code_mil mil'>"+ row.CountryProduct.milestone_title+"<span></span></p>");
       /*map.addMarker(row.Country.code.toLowerCase(), info);
       if($("#map").attr("type")!='world')
            map.showCountryInfo(info);
       setSelectionMap(row.Country.code.toLowerCase(), isFirst);
       */
    },
    
    //onclick event 
    onCellClick: function(){
    		//alert("ddd");
    }
};

$(document).ready(function(){
	
	$('#subtask_div_change_id').dialog({
        autoOpen: false,
        modal: true,
        height:'auto',
        width:'auto',
        buttons: {
            "Cerrar": function() {
                $(this).dialog("close");
            }
        }
    });
	
	var oldselectedDate = "";
	 var today =  Date.parse($("#current-timesheet-date").val());
	today.addDays(-3);
	timesheetCalendar.arrayCount = 0;
	timesheetCalendar.cStart = today;
    timesheetCalendar.cpreviousStart = today;
    timesheetCalendar.cEnd = today;
	timesheetCalendar.generateCalendar();
	
	 var today =  Date.parse($("#current-timesheet-date").val());
	oldselectedDate = today;
	currentTitle();
	getTimeSheetList(oldselectedDate);
	calculateTotalHour();
	jQuery("#task_for_date").val(oldselectedDate.toString("yyyy-MM-dd"));
	removeNext();
	
/*	jQuery("#addNewRow").live("click",function(){
		addTimeSheetRow();
		jQuery("#addNewRow").addClass("display-none");
		//$('.customStyleSelectBox').customStyle();
	});*/
	
	
	//jQuery("#addNewRow").trigger("click");
	jQuery("#addNewRow").hide();
	//jQuery("#addNewRow").off('click').on("click",renderTimesheetActivityOnaddNewRow);
	
	
	jQuery(".clander-next-weer").live("click",function(){
		$('#project_type_id').addClass("display-none");
		$('.estimated_cost_program').removeClass('text-box-hours');
		$('.estimated_cost_program').val('');
		$('#program_container').find(".subtask_name").each(function() {
			var _this = $(this);
			_this.parent().parent().removeClass('highlight-class');
		});
		var today = jQuery(".map_data_detail").find(".number:last").attr("id");
		today = new Date(today);
		today.addDays(+1);
		timesheetCalendar.arrayCount = 0;
		timesheetCalendar.cStart = today;
	    timesheetCalendar.cpreviousStart = today;
	    timesheetCalendar.cEnd = today;
		timesheetCalendar.generateCalendar();
		keepSelected(oldselectedDate);
		jQuery(".map_data_detail").find(".number:first").trigger("click");
		removeNext();
	});
	
	jQuery(".clander-prev-weer").live("click",function(){//on por live
		$('#project_type_id').addClass("display-none");
		$('.estimated_cost_program').removeClass('text-box-hours');
		$('.estimated_cost_program').val('');
		$('#program_container').find(".subtask_name").each(function() {
			var _this = $(this);
			_this.parent().parent().removeClass('highlight-class');
		});
		var today = jQuery(".map_data_detail").find(".number:first").attr("id");
		today = new Date(today);
		today.addDays(-7);
		timesheetCalendar.arrayCount = 0;
		timesheetCalendar.cStart = today;
	    timesheetCalendar.cpreviousStart = today;
	    timesheetCalendar.cEnd = today;
		timesheetCalendar.generateCalendar();
		keepSelected(oldselectedDate);
		jQuery(".map_data_detail").find(".number:first").trigger("click");
		removeNext();
	});
	
	jQuery(".calanderCell").live("click",function(){//on por live
		$('.estimated_cost_program').removeClass('text-box-hours');
		$('.estimated_cost_program').val('');
		$('#project_type_id').addClass("display-none");
		$('#program_container').find(".subtask_name").each(function() {
			var _this = $(this);
			_this.parent().parent().removeClass('highlight-class');
		});
		var today = Date.parse($("#current-timesheet-date").val());
		var selectedDate = new Date(jQuery(this).children().attr("id"));
		if(today.getTime() >= selectedDate.getTime() ){
			$('#subtask_div_change_id').addClass('display-none');
			jQuery(".currentDate").removeClass("currentDate");
			jQuery(this).addClass("currentDate");
			oldselectedDate = new Date(jQuery(this).find(".number:first").attr("id"));
			currentTitle();
			getTimeSheetList(oldselectedDate);
			$(".timesheet-form-row").html("");
			//$(".timesheet-sub-task-details").html("");
			jQuery("#task_for_date").val(oldselectedDate.toString("yyyy-MM-dd"));
			$(".allocated-time").addClass("display-none");
			 $(".booked-time").addClass("display-none");
			 $(".available-time").addClass("display-none");
		}
	
	});
	
	jQuery("#timesheet_activity").live("change",renderTimesheetActivity);//on por live
	
	jQuery(".cancel-timesheet,.cancel-form ").live("click", renderCancelTimesheet);//on por live
	
	jQuery(".subtask_name").live("click",renderValidateSubTaskFromList);//on por live
	//jQuery("#todalafila").live("click",renderValidateSubTaskFromList);
	

	
	/*  $(".estimated_cost_program").keydown(function (e) {
		  if ((!e.shiftKey && !e.ctrlKey && !e.altKey) && ((e.keyCode >= 48 && e.keyCode <= 57) ||
	                (e.keyCode >= 96 && e.keyCode <= 105))) {
	          }
	          else if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 39 &&
	                       e.keyCode != 9) {
	              e.preventDefault();
	          }
	    });  */
	  
	  
	 /// $(".estimated_cost_program").mask('00:00');
	  
	    $.mask.definitions['H'] = "[0-2]";
	    $.mask.definitions['h'] = "[0-9]";
	    $.mask.definitions['M'] = "[0-5]";
	    $.mask.definitions['m'] = "[0-9]";
	
	
	    $(".estimated_cost_program").mask("Hh:Mm");
	  
	  
	  $(".non_project_list").keydown(function (e) {
		  if ((!e.shiftKey && !e.ctrlKey && !e.altKey) && ((e.keyCode >= 48 && e.keyCode <= 57) ||
	                (e.keyCode >= 96 && e.keyCode <= 105))) {
	          }
	          else if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 39 &&
	                       e.keyCode != 9) {
	              e.preventDefault();
	          }
	   });
	
	  jQuery('#save-subtask-hours').off('click').on('click',function(event){
		 $(this).attr("disabled", "disabled");
		event.preventDefault();
	
		var myArray = [];
		var total_hrs_for_day=0.0;
		var bool = false;
		$('.subtask_list').find("input").removeClass("text-box-hours");
		$('.subtask_list').find(".estimated_cost_program").each(function() {
			var _this = $(this);
			if(_this.val()) {
				var txt_val =_this.val().replace(/:/g , ".")
				 if(parseFloat(txt_val)== 0){
					 _this.addClass('text-box-hours');
					 bool = true ;
				 }
				 if(parseFloat(txt_val)> 24){
					 _this.addClass('text-box-hours');
					 bool = true ;
				 }
			}
		});
		$('.subtask_list').find(".estimated_cost_program").each(function() {
			var _this = $(this);
			var obj = {};
			if(_this.val()) {
				var minutes = _this.val().split(':')[1];
				if(minutes){
					if(minutes > 59)
					return false;
				}
				var txt_val =_this.val()
				txt_val = txt_val.replace(/:/g , ".")
				obj.subtask_id=_this.attr('id');
				 if(parseFloat(txt_val)== 0){
					 return false;
				 }
				 if(parseFloat(txt_val)> 24){
					 obj.value = parseFloat(txt_val);
						total_hrs_for_day+=obj.value;
					 return false;
				 }
				 if( parseFloat(txt_val) > 0 && parseFloat(txt_val) <= 24){
					obj.value = txt_val;
					total_hrs_for_day+=parseFloat(txt_val);
					myArray.push(obj);
				}
			}
		});
		
		setTimeout('$("#save-subtask-hours").removeAttr("disabled")', 400); 
		if(myArray.length && !bool){
		//var hours =parseFloat($(".hours-spent").html().split(":")[1])+ total_hrs_for_day;
		var _new_hrs_from_form = total_hrs_for_day.toFixed(2).toString()
		var _new_mins = (parseInt(_new_hrs_from_form.split(".")[0]) * 60) + (parseInt(_new_hrs_from_form.split(".")[1]))
		
		var _min = (parseInt($(".hours-spent").html().split(":")[1]) * 60 )+(parseInt($(".hours-spent").html().split(":")[2]))
		var hours = (_min + _new_mins)
		      if(hours > (24* 60) || parseFloat(total_hrs_for_day) == 0 ){
				var message ="Hours should not be 0 or greater than 24 hours per day.";
				customDialogBox(message);
				return false;
				}else{
				var selectedDate = jQuery(".currentDate").children().attr("id");
				var sd = new Date(selectedDate);
				var dateFormate = sd.toString('yyyy-MM-dd')
					$.ajax({
					    type: "POST",
					    url: "/save-hours-for-subtask?sd="+dateFormate,
					    data: JSON.stringify(myArray),
					    contentType: "application/json;charset=utf-8",
					    success: function(){
					    	jQuery(".currentDate").trigger('click');
					    	$('.subtask_list').find(".estimated_cost_program").each(function() {
					    		if(!$(this).hasClass('text-box-hours')){
					    			$(this).val("");
					    		}
					 		});
					    },
					    failure: function(errMsg) {
					        alert(errMsg);
					    }
					});
				}
		}else if(!myArray.length && !bool){
			message ="Ingrese Horas:Minutos.";
			customDialogBox(message);
			return false;
		}else if( bool){
			var message ="Hours should not be 0 or greater than 24 hours per day.";
			customDialogBox(message);
			return false;
		}
	});
});
///////////////////////////////////////////////
function renderTimesheetActivityOnaddNewRow(){
        	$("#time_available").val("");
			$('#tr_id_1').addClass('display-none');
			$('#tr_id_2').addClass('display-none');
			$('#tr_id_3').addClass('display-none');
			$('#tr_id_4').addClass('display-none');
			$('#project_type_id').removeClass('display-novoid renderTimesheetActivityOnaddNewRow()ne');
			var user = $("#user_id").val()
			jQuery.ajax({
				url: "/get-project-tasks-list?user_id="+user,
				cache:false,
				tye:"GET",
				dataType : "html",
				success: function (data) {
					jQuery("#project_type_id").html(data);
				//	$("#sub_task").off("change").on("change",renderValidateSubTask);
		        },
		        error: function () {
		        	alert("alertSomethingWentWrong");
		        }
			});
}
////////////////////////////////////////////////

function renderTimesheetActivity(){
	var _this = $(this);
	var aType = _this.val();
	$("#time_available").val("");
	if(aType!=""){
		switch (aType) {
		case "1":
			$('#tr_id_1').addClass('display-none');
			$('#tr_id_2').addClass('display-none');
			$('#tr_id_3').addClass('display-none');
			$('#tr_id_4').addClass('display-none');
			$('#project_type_id').removeClass('display-none');
			var user = $("#user_id").val()
			jQuery.ajax({
				url: "/get-project-tasks-list?user_id="+user,
				cache:false,
				tye:"GET",
				dataType : "html",
				success: function (data) {
					jQuery("#project_type_id").html(data);
				//	$("#sub_task").off("change").on("change",renderValidateSubTask);
		        },
		        error: function () {
		        	alert("alertSomethingWentWrong");
		        }
			});
			break;

		case "2":
			$('#tr_id_1').removeClass('display-none');
			$('#tr_id_2').removeClass('display-none');
			$('#tr_id_3').removeClass('display-none');
			$('#tr_id_4').removeClass('display-none');
			$('#project_type_id').addClass('display-none');
			$('#subtask_div_change_id').addClass('display-none');
			jQuery.ajax({
				url: "/get-non-project-tasks",
				cache:false,
				tye:"GET",
				dataType : "html",
				success: function (data) {
		            jQuery("#sub_task").html(data);
		        },
		        error: function () {
		        	alert("alertSomethingWentWrong");
		        }
			});
			break;
			
		case "0":
			$('#tr_id_1').removeClass('display-none');
			$('#tr_id_2').removeClass('display-none');
			$('#tr_id_3').removeClass('display-none');
			$('#tr_id_4').removeClass('display-none');
			$('#project_type_id').addClass('display-none');
			$('#subtask_div_change_id').addClass('display-none');
			jQuery("#sub_task").html('<option value="">--Select Activity--</option>');
		}
	}
}

function renderValidateSubTaskFromList(){
	var subtask = $(this).attr('id').split("_")[1] ;
	$('#program_container').find(".subtask_name").each(function() {
		var _this = $(this);
		_this.parent().parent().removeClass('highlight-class');
	});
	
	$(this).parent().parent().addClass('highlight-class');
	var today_date = $(".calendarTitle").text();
	if(subtask!=''){
			/*
			var url = "/validate-subtask-timesheet?subtask=" + subtask +"&tDate="+today_date;
			$.get(url, function(data) {
				var obj = JSON.parse(data);
				$('#subtask_div_change_id').removeClass('display-none');
				if(obj.title){
					 $('#title_id').text(obj.title);
				}if(obj.description){
					 $('#descr_id').text(obj.description);
				}if(obj.status){
					 $('#status_id').addClass(obj.status);
				}if(obj.start_date){
					 $('#plan_start_date').text(obj.start_date);
				}if(obj.end_date){
					$('#plan_end_date').text(obj.end_date);
				}if(obj.depend_name){
					$('#track_changes_id').text(obj.depend_name);
				}if(obj.baselineAvailable){
					 $('#subtask_dependancy_id').text(obj.baselineAvailable);
				}
			});	
			url2 = "/get-subtask-document-listing?subtask=" + subtask ;
			$.get(url2, function(data) {
				$('#timesheet_doc_list_id').removeClass('display-none');
				$('#timesheet_doc_list_id').html(data);
			});
			$('#subtask_div_change_id').dialog('open');
			*/
			var url="/sub-task-details-from-timesheet/" + subtask;
			$(location).attr('href',url);
	}else {
		$('#subtask_div_change_id').addClass('display-none');
	}
}

function renderValidateSubTask(){
	var _this = $(this) ;
	var subtask = _this.val();
	var today_date = $(".calendarTitle").text();
	if(subtask!=''){
		var task_type = parseInt($("#timesheet_activity").val());
		if(task_type==1){
			var url = "/validate-subtask-timesheet?subtask=" + subtask +"&tDate="+today_date;
			$.get(url, function(data) {
				var obj = JSON.parse(data);
				if(!obj.isAvailable){
					alert("Sub Task is not within planned dates, please contact your project manager")
				}
				$(".allocated-time").removeClass("display-none");
				 $(".booked-time").removeClass("display-none");
				 $(".available-time").removeClass("display-none");
				if(obj.Booked){
					$(".booked-time").html("Booked time : "+obj.Booked);
				}
				if(obj.Allocated){
					$(".allocated-time").html("Allocated time : "+obj.Allocated);
				}
				if(obj.Available){
					$(".available-time").html("Available time : "+obj.Available);
				    $('#time_available').val(obj.Available);
				}

				$('#subtask_div_change_id').removeClass('display-none');
				if(obj.title){
					 $('#title_id').text(obj.title);
				}if(obj.description){
					 $('#descr_id').text(obj.description);
				}if(obj.status){
					 $('#status_id').addClass(obj.status);
				}if(obj.start_date){
					 $('#plan_start_date').text(obj.start_date);
				}if(obj.end_date){
					$('#plan_end_date').text(obj.end_date);
				}if(obj.depend_name){
					$('#track_changes_id').text(obj.depend_name);
				}if(obj.baselineAvailable){
					 $('#subtask_dependancy_id').text(obj.baselineAvailable);
				}
			});	
			url2 = "/get-subtask-document-listing?subtask=" + subtask ;
			$.get(url2, function(data) {
				$('#timesheet_doc_list_id').removeClass('display-none');
				$('#timesheet_doc_list_id').html(data);
			});
		}else {
			$('#subtask_div_change_id').addClass('display-none');
		}
	}else {
		$('#subtask_div_change_id').addClass('display-none');
	}
}
//keep selected calender cell
function keepSelected(selectedDate){
	jQuery(".map_data_detail").children().each(function(e){
		if(jQuery(this).find("div").attr('id').toString() == selectedDate.toString()){
			jQuery(this).addClass("currentDate");
		}
	});
}
//title for calender
function currentTitle(){
	var selectedDate = jQuery(".currentDate").children().attr("id");
	if(selectedDate.length > 0){
		var sd = new Date(selectedDate);
		$(".calendarTitle").html(sd.toString('dd-MM-yyyy'));
	}else{
		today = new Date();
		$(".calendarTitle").html(today.toString('dd-MM-yyyy'));
	}
}
//add new row in timesheet table
function addTimeSheetRow(){
	jQuery.ajax({
		url: "/addrow",
		type: "POST",
		cache: false,
		dataType : "html",
		success: function (data) {
            jQuery(".newRow").html(data);
            jQuery("#timesheet_activity").focus();
            
        },
        error: function () {
        	alert("alertSomethingWentWrong");
        }
	});
}
//get users tasklist by dete
function getTimeSheetList(oldselectedDate){
	var dateFormate = oldselectedDate.toString("yyyy-MM-dd");
	
	jQuery.ajax({
			url: "/getUserTimeSheetList?sd="+dateFormate,
			cache:false,
			tye:"GET",
			dataType : "html",
			success: function (data) {
	            jQuery(".timesheet-wrapper table tbody").html(data);
	            calculateTotalHour();
	            
	        },
	        error: function () {
	        	alert("alertSomethingWentWrong");
	        }
		});
	}

//delete timesheet
function deleteTimesheet(element,tid){
	$("#dialog-confirm").html("Are you sure want to delete this timesheet entry?");
	// Define the Dialog and its properties.
	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Confirm",
		height : 150,
		width : 300,
		buttons : {
			"Yes" : function() {
				jQuery.ajax({
					url: "/daleteTimesheet?tid="+tid,
					cache:false,
					tye:"GET",
					dataType : "html",
					success: function (data) {
							if( $("#timesheet-list > tbody > tr").length == 1){
								window.location.reload();
							}else{
								jQuery(element).parent().parent().remove();
							}
						// window.location.reload();
							$('#program_container').find(".subtask_name").each(function() {
								var _this = $(this);
								_this.parent().parent().removeClass('highlight-class');
							});
						$('.subtask_list').find(".estimated_cost_program").each(function() {
				    		if(!$(this).hasClass('text-box-hours')){
				    			$(this).val("");
				    		}
				 		});
						$('.non_project').find(".non_project_list").each(function() {
				    		if(!$(this).hasClass('text-box-hours')){
				    			$(this).val("");
				    		}
				 		});
						 calculateTotalHour();
			            //jQuery(".timesheet-wrapper table tbody").html(data);
			        },
			        error: function () {
			        	alert("alertSomethingWentWrong");
			        }
				});
				$(this).dialog('close');
				$("#pop-box-over").css("display", "none");
				$("#dialog-confirm").css("display", "none");
			},
			"No" : function() {
				$(this).dialog('close');
				$("#pop-box-over").css("display", "none");
				$("#dialog-confirm").css("display", "none");
			}
		}
	});
	$("#pop-box-over").css("display", "block");
	$("#dialog-confirm").css("display", "block");
}

function renderCancelTimesheet(){
	$(".timesheet-form-row").html("");
	$('#subtask_div_change_id').addClass('display-none');
	jQuery("#addNewRow").removeClass("display-none");
	$(".allocated-time").addClass("display-none");
	 $(".booked-time").addClass("display-none");
	 $(".available-time").addClass("display-none");
	 $('#project_type_id').addClass('display-none');
	 $('.estimated_cost_program').val('');
		$('.estimated_cost_program').removeClass('text-box-hours');
		$('#program_container').find(".subtask_name").each(function() {
			var _this = $(this);
			_this.parent().parent().removeClass('highlight-class');
		});
	//$(".allocated-time").html("");
	//$(".booked-time").html("");
	//$(".available-time").html("");
}
//save timesheet
function saveTimesheet(){
		var url = jQuery("#timesheet-form").attr("action");
		var hours_value = $("#hours").val();
		if(parseInt(hours_value)>24){
			alert("Hours should be less than 24 hours.");
			 $( "#hours" ).focus();
		}else{
			var hours =parseFloat($(".hours-spent").html().split(":")[1])+parseFloat(hours_value);
			if(hours > 24 || parseFloat(hours_value) == 0 ){
				alert("Hours should not be 0 or greater than 24 hours per day.");
			}else{
				jQuery.ajax({
					url: url,
					type: "POST",
					cache: false,
					data: jQuery("#timesheet-form").serialize(),
					dataType : "html",
					success: function (data) {
						if(data=="Success"){
							$('#subtask_div_change_id').addClass('display-none');
							$(".currentDate").trigger("click");
							jQuery(".newRow").html("");
							 calculateTotalHour();
							 $(".main").scrollTop(10);
							 jQuery("#addNewRow").removeClass("display-none");
							 $(".allocated-time").addClass("display-none");
							 $(".booked-time").addClass("display-none");
							 $(".available-time").addClass("display-none");
						}
			            //jQuery("#timesheet-list tbody").append(data);
			        },
			        error: function () {
			        	alert("alertSomethingWentWrong");
			        }
				});
			}
		}
}
function calculateTotalHour(){
	var total_hours = 0;
	jQuery('#timesheet-list').find('.hours-cal').each(function() {
		total_hours = total_hours + parseInt($(this).text().split(':')[0]) * 60 + parseInt($(this).text().split(':')[1]);
	});
	var hr = parseInt(total_hours/60);
	var min = total_hours % 60
	if(total_hours==24){
		$("#addNewRow").addClass("display-none");
	}else{
		$("#addNewRow").removeClass("display-none");
	}
	var totalLabel=$("#langtotalval").val();
	var hourLabel=$("#langhrsval").val();
	var minuteLabel=$("#langminval").val();
    $(".hours-spent").html(totalLabel+" : "+ hr+" "+hourLabel+" : "+min+ " "+minuteLabel)
}

//remove new if date is gt todates date
function removeNext(){
	var today = new Date();
	var selectedDate = new Date(jQuery(".map_data_detail").find(".number:last").attr("id"));
	if(selectedDate.getTime() > today.getTime() ){
		jQuery(".clander-next-weer").addClass("display-none");
	}else{
		jQuery(".clander-next-weer").removeClass("display-none");
	}
}

function customDialogBox(message) {
	$("#dialog-confirm").html(message); // /warning
	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Warning",
		height : 150,
		width : 350,
		buttons : {
			"Ok" : function() {
				$(this).dialog('close');
				$("#pop-box-over").css("display", "none");
				$("#dialog-confirm").css("display", "none");
			}
		}
	});
}
