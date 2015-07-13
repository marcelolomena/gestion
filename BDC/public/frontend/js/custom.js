//cufon setup
//Cufon.replace('nav');

//dropbox styling
$(function() {
    try {
        oHandler = $("#websites2, #websites3,#websites4,#websites5,#websites6,#websites7,.dropdown").msDropDown({mainCSS:'dd'}).data("dd");
        $(".ddChild").css({"height":"auto","max-height":"400px"});
	} catch(e) {
		alert("Error: "+e.message);
	}
});

/**
 * Notation Object: contains notation array, getNotation method
 **/
var Notation = {
    
    //notation array
    notations: {},

    //method return notation div with code and color combinations 
    getNotationDiv: function(key){
    	
        if(this.notations!=null && this.notations[key]!==null && this.notations[key]!=='undefined'){
            var tmp =this.notations[key];
            //return '<span class="notation_code '+ tmp.code.toLowerCase() +'">'+ tmp.code +'</span>';
            return "";
        }
        return "";
    },
    
    getNotationByKey: function(key){
         if(this.notations!=null && this.notations[key]!==null && this.notations[key]!=='undefined')
            return this.notations[key];
    }
}

/**
* Slider Object: contains slider parameters, slider init method and slider play/pause/stop methods 
**/
var sub = 55;
var Slider = {
    
    // contains days between start and end date
    monthDays: 31, 
    
    // contains current day by index
    currentDay: 0,
    
    // contains slider physical width
    sliderWidth: 625,
    
    //contains counter for slider
    cnt: 0,
    
    //contains max length of slider
    mx: (this.monthDays * 20), 
    
    //contains timeout object used for slider play
    tOut: 0,
    
    //contains span object, the array moves with slider handle
    spn: 0,
    
    //contains state of slider i.e. play = 1/pause = 0
    isPlaying: false,
    
    //contains extra space required to the left of moving arrow
    extraSpace: 332, 
    
    //contains width per day
    jump: 0,
    
    //method to init the slider
    init: function(){
		var tm = $("#slider-range-min").position();
        this.extraSpace = tm.left - 10;
		
        var self = this;
        this.spn = $(".map_data_title").find("span.moving_arrow");
        
        //init the slider
        $( "#slider-range-min" ).slider({
    		range: "min",
    		value: self.cnt,
    		min: 1,
    		max: self.mx,
            animate: true,
    		slide: function( event, ui ) {                
    			self.cnt = ui.value;  
                Calendar.setCurrentActive();	
              
    		}            
    	});       
        
    	
    	
        //init the play/pause events
        $(".play_button").click(function(){
            if( self.isPlaying ){ 
                //if slider is stopped, and user clicks play
                clearTimeout(self.tOut);
                self.isPlaying = false;
                $(this).find("img").attr("src", "assets/frontend/images/play_button.png");
            }else{
                //if slider is playing, and user clicks pause
                self.isPlaying = true;
                setTimeout(function() { self.updateSlider(); }, 20);                
                $(this).find("img").attr("src", "assets/frontend/images/pause_button.png");        
            }            
        });
    },
    
    //method to reset the slider
    resetSlider: function(){
        clearTimeout(this.tOut);
        this.currentDay =0;
        this.cnt = 0;
        this.mx = ((this.monthDays )* 20);
        this.tOut=0;
        $(this.spn).css("left", this.cnt+this.extraSpace);
        this.isPlaying=false;
        this.jump = this.mx / (this.monthDays);
       
        $(".map_data_detail").find(".hover").removeClass("hover");
        $(".date_cell").eq(0).addClass("hover");
        $( "#slider-range-min" ).slider( "option", "max", this.mx );
        $( "#slider-range-min" ).slider( "option", "value", 0 );
        $(".play_button").find("img").attr("src", "assets/frontend/images/play_button.png");
    },
    
    addMarkerToSlider: function(data){
    	$(".slider-marker").remove();
    	$(".slider-marker1").remove();
    	$(".slider-marker2").remove();
    
        if(data == null) return;
        var cnt = Util.getDateDiff($("#start_date").val(), $("#end_date").val());
        var dt = Date.parse($("#start_date").val()), _self=this;
        var isWorld = $("#map").attr("type")!='world'?false:true;
        
        var OSName="Unknown OS";
    	var browservalue = navigator.userAgent.toUpperCase(); 
    	
        for(i=0; i< this.monthDays+1; i++){
            //if it is first day of week
            if(i > 0)
                dt.add({ days: 1 });
            
            var countIndex = 0
            $.each(data, function(key, row){
            	var markerString = "";
            	markerString = "<img class='slider-marker'></span>";
            	var launch = null;
            	for(j=0;j<row.length;j++){
            		if(row[countIndex]){
                		
                		var diff = Util.getDateDiff($("#start_date").val(), dt), elementStr = markerString;
                		//console.log(dt.toString('yyyy-MM-dd')+"-"+row[countIndex].release_date)
            	        if(dt.toString('yyyy-MM-dd')==row[countIndex].release_date){
            	        	switch(row[countIndex].status){
    	                	case "0":
    	                		launch = "cl";
    	                		 break;
    	                	case "1":
    	                		launch = "yellow";
    	                		break;
    	                	case "2":
    	                		 launch = "esa";  
    	                		  break;
            	        	}
            	        	
                	    }
                		
                		
                	}
                		
                    if(launch != null){
                    	
                        if($("#slider-range-min").find("img#"+dt.toString('yyyy-MM-dd')).length > 0)
                            return;
                        var tmp = (i / (_self.monthDays+1)) * 100;
                        
                        var element = $(elementStr);
                        $(element).attr("src", "assets/frontend/images/"+launch+".png").attr("id", dt.toString('yyyy-MM-dd'));                    
                        $(element).css({'left': tmp +'%'});        
                        $("#slider-range-min").find(".ui-slider-handle").after(element);
                    }
                    countIndex++;
            	}
            	
                
                
            });
        }
        
    },
    
    //update slider thread
    updateSlider: function(){
        
        //if slider is not play state then return
        if(!this.isPlaying)        
            return;
            
              
        //if max limit is greater than count then execute the code
        if(this.cnt < this.mx){
            this.cnt++;
            $( "#slider-range-min" ).slider( "value" , [this.cnt] );     
			var tm = $(".ui-slider-handle").position();
			//Util.log("left"+tm.left);
			
            $(this.spn).css("left", (tm.left - 11));
            Calendar.setCurrentActive();            
            var _this = this;
            setTimeout(function() { _this.updateSlider(); }, 150);
        }else{
            //else reset state and image
            this.isPlaying = false;
            $(".play_button").find("img").attr("src", "assets/frontend/images/play_button.png");
        }            
    }
    
}

/**
* Calendar Object: contains calendar parameter and calendar methods 
**/
var Calendar = {
    
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
               //var map = $('#map').vectorMap('getMap');
               var map = null;
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
        //var map = $('#map').vectorMap('getMap');
        var map = null;
        var today = new Date();
        var weekno = today.getWeek(); 
        
        var currentWeek =  new Date(startDt);
        var weeknum = currentWeek.getWeek(); 
        
        //clear the div
        $(".map_data_detail").html("");
        
        //get the start date
        var dt = startDt;
        var date = dt.getDate();
       
       // alert(dt);
        $(".release-info").hide().find(".dialog-content").html("");
        //set the table header part
        var weekTitle = "<div class='weekTitle'> Week - " +weeknum + " &nbsp;/&nbsp; </div>  " ;
        var titleEndDt = "", calendarTitle=startDt.toString("MMMM d"), isFirst = true, _self =this;
        //map.clearMarker();
        var infoObject = { title: "Minor Release", message: "date: NA", background: "red", releaseCode: "CL" };
        //iterate for 7 days and create the 7 day's table
        
        //var viewType = parseInt($("#viewType").val());
       
        for(i=0; i< 35 ; i++){
        	
            //if it is first day of week
            if(i > 0)
                date = dt.add({ days: 1 }).getDate();
            
            
            //generate the inner html for a day_cell and append to table
            var cell = $("<div />").attr("index", i).addClass("map_data_detail_1 date_cell hide disabled").html('<div class="number">&nbsp;</div>');
            $(".map_data_detail").append(cell);
            
            //set the date number
            $(".map_data_detail").find("div.number").eq(i).html(date).attr("id", dt.toString("dd-MM-yyyy"));
            
            //if the current day of week is exeeds the end_date then do not execute
            if(Util.getDateDiff(dt, $("#end_date").val()) >= 0){
                $(".date_cell").eq(i).removeClass("disabled");
              
                titleEndDt = dt.toString("MMMM d, yyyy");          
                
                //check the date with fetched data and append the matching events
                var element = $(".map_data_detail").find("div.number").eq(i);
               
                $.each(data, function(key, row){
                	$.each(row, function(key, item){
                		 //check for store availability
                		//alert(item.release_date)
                        if(dt.toString('yyyy-MM-dd')==item.release_date){
                           _self.addMarker('esa', item, map, isFirst, dt, element);
                           isFirst=false;   
                        }
                		
                		if( dt.toString('yyyy-MM-dd')==item.uat_staff_launch_date){
                            //_self.addMarker('uat', row, map, isFirst, dt, element);
                            //isFirst=false;                       
                        }
                	})
                	/*
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
                    */
                }); 
            }
            
            //show the generated cell
            $(cell).fadeIn(2000);   
        }
      
       // var initDate ="Jan 01 2013 00:00:00 GMT"
      
        
        //set the onclick event to cell
        Calendar.onCellClick();
        
          
        //set the calendar title
        calendarTitle += " - " + titleEndDt ;
        var newcalendarTitle = weekTitle+" <div class='left font-helvetica monthMargin'>"+ calendarTitle + "</div>";
        
        /*var browservalue = navigator.userAgent.toUpperCase(); 
        if (navigator.appVersion.indexOf("Mac")!=-1){
        	 var prevWeek='<div class="previousWeekArrow1"> << </div> <div class="previousWeek"> Previous</div>'; 
             var nextWeek='<div class="nextWeekArrow1"> >> </div><div class="nextWeek">Next </div>  ';
             	
        }else{
        	 var prevWeek='<div class="previousWeekArrow"> << </div> <div class="previousWeek"> Previous</div>'; 
             var nextWeek='<div class="nextWeekArrow"> >> </div><div class="nextWeek">Next </div>  ';
        }*/
        
       // prevWeek+=newcalendarTitle;
        //prevWeek+=nextWeek;
        
        $(".calendarTitle").html(newcalendarTitle);
        
     
    	
        
    },
    Launches: { uat: ["UAT Staff Launch", "uat_staff_launch"], cl: ["Customer Launch", "customer_launch"], esa: ["Expected Store Availability", "expected_store_availability"]},
    addMarker : function(launch, row, map, isFirst, dt, element){
    	
       var tDate = dt.toString("dd-MM-yyyy"), tDate2 = dt.toString("MMMM d, yyyy");
       
       var rowId = launch+ "-"+row.id+"-"+tDate;
       // tDate2 removed..
       var roadmapType= $("#roadmapType").val();
       var msgMilestonetitle = "";
       switch(row.status){
       case "0":
    		 msgMilestonetitle = "<span style='float:left;width:100%;border-bottom:1px solid #E6E6E6;color:green; font-size: 10px;'><a style='color:green;'  class='program-milestone' href='/program-details/"+row.id + "'>" + row.title.toUpperCase() + "</span></a>"
    	   break;
       case "1":
    	   msgMilestonetitle = "<span style='float:left;width:100%;border-bottom:1px solid #E6E6E6;color:green; font-size: 10px;'><a style='color:green;' class='project-milestone'  href='/project-details/"+row.id + "'>" + row.title.toUpperCase() + "</span></a>"
    		//msgMilestonetitle = "<span class='notation_code_mil'><span style='float:left;padding-bottom:3px;width:100%;border-bottom:1px solid #E6E6E6;color:#FF9900;font-weight:bold;'>"+row.CountryProduct.milestone_title.toUpperCase()+"</span><a style='color:#585858;' href='/project-details/"+row.Product.pId +"#"+row.CountryProduct.id+"#"+roadmapType+"'><span>"+row.CountryProduct.description.substring(0, 100)+"</span><span class='more-milestone'>....More</span></a>"
    	   break;
       case "2":
    		msgMilestonetitle = "<span class='notation_code_mil'><span style='float:left;padding-bottom:3px;width:100%;border-bottom:1px solid #E6E6E6;color:red;font-weight:bold;'>"+row.CountryProduct.milestone_title.toUpperCase()+"</span><a style='color:#585858;' href='/project-details/"+row.Product.pId +"#"+row.CountryProduct.id+"#"+roadmapType+"'><span>"+row.CountryProduct.description.substring(0,	 100)+"</span><span class='more-milestone'>....More</span></a>"
    	   break;
       }
       
       // alert(this.arrayCount);alert(this.arrayCount);
       this.arrayCount=this.arrayCount+1;
       var info = { title: this.Launches[launch][0], "row":rowId, date: tDate, message:msgMilestonetitle, releaseCode: launch.toUpperCase(), milestoneTitle:row.title,milestoneStatus:row.status, lengths:this.arrayCount};
     //Notation.getNotationDiv(this.Launches[launch][1]) .....code removed span inserted manually
       var extraString = ""
       if(row.title.length>8){
    	   extraString = "..."
       }else{
    	   extraString=""
       }
       $(element).before(msgMilestonetitle);
       //$(element).before("<a href='/project-task-details/"+row.id+"'><p row='"+rowId+"' id='" + rowId +"' style='float:left' class='roadmap'>" + "<span class='status_0'></span><span class='marker-info' style='float:left;max-width:70px;'>"+row.title.substring(0,13)+extraString+"<br></span></p></a>");
       
   
       //$(element).before("<p row='"+rowId+"' id='"+row.Country.code+"'>" + "<span class='notation_code esa'>"+row.CountryProduct.milestone_code+"</span><span class='marker-info'>"+row.Product.title+"<br><span class='notation_code_mil mil'>"+ row.CountryProduct.milestone_title+"<span></span></p>");
       /*map.addMarker(row.Country.code.toLowerCase(), info);
       if($("#map").attr("type")!='world')
            map.showCountryInfo(info);
       setSelectionMap(row.Country.code.toLowerCase(), isFirst);
       */
    },
    
    //onclick event 
    onCellClick: function(){
    	
    var _self = this;
      $(".date_cell:not(.disabled)").live('click', function(){
    	  
    	  var startIndex =  parseInt($(this).index());
    	  if(startIndex==0){
    		  //Calendar.cStart = Date.parse($("#start_date").val());
             // Calendar.generateCalendar();
    	  }
/*    	   var map = $('#map').vectorMap('getMap');
           if($("#map").attr("type")=='world'){                
                map.hideMarkerInfo();
           }*/
           
           var day = ((Calendar.currentWeek - 1)*7) + eval($(this).attr("index"));
           //alert((Calendar.currentWeek - 1)*7 + " - " +eval($(this).attr("index")));
           Slider.cnt = day * Slider.jump;
           //alert( Slider.cnt);
           $( "#slider-range-min" ).slider( "value" , [Slider.cnt]);
           $(this).parent().find(".hover").removeClass("hover");
           var date = $(this).find(".number").attr("id");
           //alert( );
           $(this).addClass("hover");
           var countryArray = new Array();
           $(this).find("p").each(function(index){
                if($.inArray($(this).attr("id"), countryArray) == -1)
                    countryArray.push($(this).attr("id"));
           });
      
      
          /*$.each(countryArray, function(ind, code){
        	
        	  
        	   ///code start....this will change marker background possition as per the milestone status..
        	   var m = $("#"+date).parent().parent();
        	   $(m).find("p").each(function(index){
        		   //alert($(this).children().attr("class"));  
        		   var cc =  $(this).attr("id");
          		   var classStatus = $(this).children().attr("class").split(" ")[1]
        		   if(cc== code){
        			   //alert(classStatus);
        			   if($("#roadmapType").val()=="1"){
        				
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
        	   // code end here for milestone color change...
        	    
           
        	  //countryArray.length +" "+ code.toLowerCase()+ " + +"  +
//        	    map.showMarkerInfo(code.toLowerCase(), $("#marker_"+code.toLowerCase()), date);        
           });*/
           
           Calendar.setCountryInfoSelection();
           if(Slider.isPlaying)
                $(".play_button").trigger("click");      
      });  
    }
};

/**
* Util Object: contains utility methods 
**/
var Util = {

    //method to find difference between 2 dates in days
    getDateDiff: function(sDt, eDt){
        //console.log(sDt +">>"+eDt);
        
        var one_day=1000*60*60*24, startDt=null, endDt=null;
        if(sDt==null || eDt == null )
            return -1;
        
        //check given parameter is a string/object
        if(typeof (sDt) === 'object')
            startDt = sDt;
        else
            startDt = Date.parse(sDt);
        
        //check given parameter is a string/object    
        if(typeof (eDt) === 'object')
            endDt = eDt;
        else
            endDt = Date.parse(eDt);
        
        //if the parsed date is null then
        if(startDt==null || endDt == null )
            return -1;
            
        //console.log(Math.ceil((endDt.getTime()-startDt.getTime())/(one_day)));
        return Math.ceil((endDt.getTime()-startDt.getTime())/(one_day));        
    },
    
    //method to log the data into console
    log: function(data){
        /*if (console && console.log){
        // console.log( 'Sample of data:', data );
        }*/
    }
};
	
//map initialize
function initMap(mapId){   
	 $(mapId).vectorMap({color: "#C7EDFF",backgroundColor: '#ffffff',hoverOpacity: 0.7,
     hoverColor: false});
     
     $(".jvectormap-zoomout").html("");
     $(".jvectormap-zoomin").html("");
     $("#map > svg").attr({"onclick":"javascript:void(0)"});
     $("#map > svg").attr({"clss":"dasvg"});
    
     //$("#map > svg").draggable({drag: function(event, ui) {}});
}

//holds currently selected country color
var previousSelectedCountry=new Array();

/**
* Method to set selected country background color
**/
function setSelectionMap(cd, removePrevious){
    /*var param = {};
    if(removePrevious && previousSelectedCountry.length > 0){
        $.each(previousSelectedCountry, function(ind, code){
            param[code]= '#C7EDFF';
        });        
    }        
    param[cd.toLowerCase()]= '#BFE1EC';
    previousSelectedCountry.push(cd.toLowerCase());
    $('#map').vectorMap('set', 'colors', param);*/
}

Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
} 

/**
* Method calls api with given parameters
**/
function getPageData(){    
	var s_date=  Date.parse($("#start_date").val()).toString("yyyy-MM-dd");
	$("#start_date").val(s_date);
	var e_date=  Date.parse($("#end_date").val()).toString("yyyy-MM-dd");
	$("#end_date").val(e_date);

	var params = "start_date=" + s_date + "&end_date=" + e_date;
	var rtype = $("#roadmap-type").val(); 
	
	switch (rtype) {
	
	case "division":
		var division = $("#roadmap-division").val(); 
		params += "&product=division&pId="+division;
		break;
	case "program":
		var program = $("#roadmap-program").val(); 
		
		params += "&product=program&pId="+program;
		
		break;
	case "project":
		var project = $("#roadmap-projects").val(); 
		params += "&product=project&pId="+project;
		break;
	default:
		params += "&product=none&pId=none";
	break;
	
	}
	
	//params = ""
	//params = "start_date=" + s_date + "&end_date=" + e_date
	//params += "&product=none";
	 //alert(Date.parse($( "#end_date" ).datepicker({"dateFormat": "yy-mm-dd", defaultDate: "+1m" }).val()));
	//&roadmapType="+$("#roadmapType").val()
	
    //params += "&country="+ $("#home_page").find("#sCountry").val() + "&product="+ $("#sProduct").val(); 
	
/*	if($("#websites5").val()=="")
		params += "&product=none";
	else
		params += "&product="+ $("#websites5").val();	
	*/
	
    var url= "/roadmapProductDetails?"+params;
    $.post(url ,
       function(data) {
    	
    		
          //Util.log( data );
          //drawMap($("#home_page").find("#sCountry").val()==""?"all":$("#home_page").find("#sCountry").val());
          Slider.monthDays = Util.getDateDiff($("#start_date").val(), $("#end_date").val());
          Slider.resetSlider();
          Calendar.arrayCount = 0;
          Calendar.cStart = Date.parse($("#start_date").val());
          Calendar.cpreviousStart = Date.parse($("#start_date").val());
          Calendar.cEnd = Date.parse($("#end_date").val());
          Calendar.cData = data;
          
          Calendar.generateCalendar();
          
          Slider.addMarkerToSlider(data);
          isCallFromCountryChange =false;
          
        //  $("#map").attr({"onclick":"void(0)"});
       
          /**
           * for month view and calender view
           */
          $('.loader').css('display', 'none');
    }, "json");
    
    
    var delay = 600;
	setTimeout(function() { 
	/**
	 * THis code is for roadmap page spacing between two tasks in a single cell..
	 */
		
	    $(".map_data_detail").find(".date_cell").each(function() {
	    	var count =0 ;	
	    	var _this = $(this);
	    	_this.find("a").each(function() {
	    		count++;
	    	//	alert(count);
	    	});
	    	switch (count){
	    	case 1:
	    		break;
    		case 2:
    			//_this.find("a").css("height","40px");
    			break;
    		case 3:
    			//_this.find("a").css("height","30px");
    			break;
    		case 4:
    			//_this.find("a").css("height","20px");
    			break;
	    	default:
	    		//_this.find("a").css("height","20px");
	    		break;
	    	}
	    });
	}, delay);
}

//countries object: contains country codes, default x-y for map rendering
 var countries = { 
    "af" : {map: 'gh_en', defaultX: 1250, defaultY:  250, defaultScale: .2},
    "mu" : {map: 'mu_en', defaultX: 850, defaultY:  -150, defaultScale: .2},
    "bw" : {map: 'bw_en', defaultX: 1150, defaultY: 250, defaultScale: .2},
    "zm" : {map: 'zm_en', defaultX: 1150, defaultY: 200, defaultScale: .2},
    "zw" : {map: 'zw_en', defaultX: 650, defaultY: 200},
    "tz" : {map: 'tz_en', defaultX: -495, defaultY: -330, defaultScale: 6},
    "ae" : {map: 'ae_en', defaultX: -1645, defaultY: -570, defaultScale: 6},
    "eg" : {map: 'eg_en', defaultX: -470, defaultY: -230, defaultScale: 5},
    "pt" : {map: 'pt_en', defaultX: -395, defaultY: -200, defaultScale: 8},
    "gb" : {map: 'gb_en', defaultX: -390, defaultY: -140, defaultScale: 6},
    "all" : {map: 'world_en', noScale: true, color: '#C7EDFF'}            
};

var worldMap ="#map", countryMap="#country_map", markerPrefix = "#jvectormap1_";
function drawMap(country){
	$("#map").css({"opacity": "1"});
	//alert(country);
    country = country;
    
    var defaultSetting = {noScale: false, defaultScale: 0.3, color: '#1C97D0',backgroundColor: '#ffffff',hoverColor: false};
    var selectionOfCountries = {"in": "#1C97D0", "mu": "#1C97D0", "bw": "#1C97D0", "zm": "#1C97D0", "zw": "#1C97D0", "tz": "#1C97D0", "ae": "#1C97D0", "eg": "#1C97D0", "pt": "#1C97D0","gb": "#1C97D0"};
    $.extend(defaultSetting, countries[country]);
    
    $(worldMap).off('mouseout').off('mouseover').html("");
    $(countryMap).off('mouseout').off('mouseover').html("");
    $(worldMap).attr("type", "world");
  //  $(worldMap).vectorMap(defaultSetting);
    
    if(country != "all"){
        $(worldMap).attr("type", "country");
        var selectedCountry = {};
        selectedCountry[country] = "#1C97D0";
        var countrySettings = defaultSetting;
        $.extend(countrySettings, countries['all'], {backgroundColor: 'transparent', color: "#C7EDFF"});
       // $(countryMap).vectorMap(countrySettings);  
        $(countryMap).off('mouseout').off('mouseover');
        $(worldMap).append("<div class='release-info'><div class='dialog-content'></div></div>");
        //$('#map').vectorMap('set', 'colors', selectedCountry);
       
        $(".release-info").show();
	$("#map").css({"opacity": "0.75"});
        $(".jvectormap-zoomin").hide();
        $(".jvectormap-zoomout").hide();
    }else {
        $(".jvectormap-zoomin").show();
        $(".jvectormap-zoomout").show();
      //  $('#map').vectorMap('set', 'colors', selectionOfCountries);
      
    }
        
    $(".jvectormap-zoomout").html("");
    $(".jvectormap-zoomin").html("");
    $(worldMap).find("svg").attr({"onclick":"void(0)"});
    $(".jvectormap-zoomin").hide();
    $(".jvectormap-zoomout").hide();
  //  markerPrefix = "#"+ $("#map").find("path").eq(0).attr("id").replace("id", "");
}




/**
* Method setups the html elements,
* javascript functions on roadmap page load
**/
var isCallFromCountryChange = false;
function onLoadRoadMap(){    
    //init the map
	
	//drawMap("all");

    //set on dropdown select function
    var onSelectF =function(selectedDate){
        var option = this.id == "start_date" ? "minDate" : "maxDate",
			instance = $( this ).data( "datepicker" ),
			date = $.datepicker.parseDate(
				instance.settings.dateFormat ||
				$.datepicker._defaults.dateFormat,
				selectedDate, instance.settings );

        if(this.id == "start_date"){
            $( "#end_date" ).datepicker( "option", option, date );
        }else{
            $( "#start_date" ).datepicker( "option", option, date );
        }
        getPageData();
       
    };
    
    //set datepicker and set the onselect date function
    $('#start_date').datepicker({
    	"dateFormat": "yy-mm-dd", onSelect: onSelectF, "altFormat":" yy M d",
        beforeShow: function (input, inst) {
            var offset = $(input).offset();
            window.setTimeout(function () {
                if(offset.top>350){
                	$("#ui-datepicker-div").css({ top: '325px' });
                	
                }
            }, 1);
        }
    });
    
    //set datepicker and set the onselect date function
    $('#end_date').datepicker({
    	"dateFormat": "yy-mm-dd", 
    	defaultDate: "+1m", 
    	"altFormat":"yy M d", 
    	onSelect: onSelectF,
        beforeShow: function (input, inst) {
        	
        	
            var offset = $(input).offset();
            window.setTimeout(function () {
               
                if(offset.top>350){
                	$("#ui-datepicker-div").css({ top: '325px' });
                	
                }
            }, 1);
        }
    });
    
    
    //set datepicker and set the onselect date function .....above function used 
   // $( "#end_date" ).datepicker({"dateFormat": "yy-mm-dd", defaultDate: "+1m", "altFormat":"dd MM yyyy", onSelect: onSelectF });
    //$( "#start_date" ).datepicker({"dateFormat": "yy-mm-dd", onSelect: onSelectF, "altFormat":"d M yy"});
    $("#home_page").find("#sCountry").change(function() {
        //setSelectionMap($(this).val(), true);
        isCallFromCountryChange = true;
        getPageData();         
    });    
    $("#websites5").change(function() {
        $(".product_detail_link").html("");
        var productNm = $("#websites5 option[value='"+ $(this).val() +"']").text();

        if($(this).val()!="")
            $(".product_detail_link").html($("<a/>").attr("href", "/project-details/" + $(this).val()).html("View "+ productNm +" Details"));
        getPageData(); 
    });
    
    //inti the slider
    Slider.init();
    
    //call the api data
    getPageData();
   
    
   
   
}