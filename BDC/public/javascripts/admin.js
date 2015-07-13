$(document).ready(function(){
	
	Date.now = Date.now || function() { return +new Date; }; 
	
	var pageTitile= AllTrim($("h1").text());
	switch (pageTitile) {
	case "PROJECT":
		$("#pm").addClass("active");
		break;
	case "User":
		$("#um").addClass("active");	
		break;
	case "Project Tasks":
		$("#mil").addClass("active");
		//renderProjectDetails();
		break;
	case "Milestone History":
		$("#hm").addClass("active");	
		break;
	case "Milestone & Team":
		$("#tm").addClass("active");	
		break;
	case "Sub Tasks":
		$("#mtk").addClass("active");	
		break;
	case "Goals":
		$("#gl").addClass("active");	
		break;
	case "Goal History":
		$("#gh").addClass("active");	
		break;
	case "Goals & Team":
		$("#gt").addClass("active");	
		break;		
	case "Goal Tasks":
		$("#gtk").addClass("active");	
		break;	
	case "PM Project Management":
		$("#pms").addClass("active");	
		break;	
	case "CEO Project Management":
		$("#ceo").addClass("active");	
		break;
	case "Sub Tipos de Programas":
		$("#subT").addClass("active");
		$("#subT a").css('color','#ffff00');
		break;
    case "Perfil del Usuario":
		$("#userProfileId").addClass("active");
		$("#userProfileId a").css('color','#ffff00');
		break;
    case "Catálogo de Servicios":
		$("#catservice").addClass("active");
		$("#catservice a").css('color','#ffff00');
		break;
	case "Plantillas por Tipo de Proyecto":
		$("#pTypeActive").addClass("active");
		$("#pTypeActive a").css('color','#ffff00');
		break;
	case "Tipo de Programa":
		$("#programT").addClass("active");	
		$("#programT a").css('color','#ffff00');
		break;
	case "Sub Tasks Allocation":
		$("#sba").addClass("active");	
		break;
	case "Divisiónes":
		$("#dv").addClass("active");	
		$("#dv a").css('color','#ffff00');
		break;
	case "Gerencias":
		$("#ge").addClass("active");	
		$("#ge a").css('color','#ffff00');
		break;
	case "Departamentos":
		$("#dm").addClass("active");	
		$("#dm a").css('color','#ffff00');
		break;
	case "Sub Tipos de Programas":
		$("#subT").addClass("active");	
		$("#subT a").css('color','#ffff00');
		break;		
	case "Disciplinas":
		$("#progDiscipline").addClass("active");	
		$("#progDiscipline a").css('color','#ffff00');
		break;
		
	case "Estado":
		$("#projActive").addClass("active");	
		$("#projActive a").css('color','#ffff00');
		break;
	case "Tipo de Presupuesto":
		$("#bTypeActive").addClass("active");	
		$("#bTypeActive a").css('color','#ffff00');
		break;
	case "Etapas":
		$("#stageActive").addClass("active");
		$("#stageActive a").css('color','#ffff00');
		break;	
	case "Rol de Usuario":
		$("#UserRoleActive").addClass("active");	
		$("#UserRoleActive a").css('color','#ffff00');
		break;	
	case "Tipos de Documentos":
		$("#dTypeActive").addClass("active");	
		$("#dTypeActive a").css('color','#ffff00');
		break;	
	case "Entregables":
		$("#delActive").addClass("active");
		$("#delActive a").css('color','#ffff00');
		break;
	}
	

	if(typeof getUrlParameter("page") !== "undefined" && getUrlParameter("page") !== null){
		  
	}else{
		   var pageNo = $(".pagination .color-black").html();
		   if(pageNo !="" && pageNo != null){
		    var sPageURL = window.location.href;
	        var sURLVariables = sPageURL.split('?')[0];
	        var records = $("#pageRecord").val();
		    window.location.href =sURLVariables+"?page="+pageNo+"&record="+records
	   } 
	}
	
	$('#document').change(function() {
		$("#file_name").val("fileUpload");
	});
	
	$(".searchKey").keyup(function(event){
	    if(event.keyCode == 13){
	        $(".searchBtn").click();
	    }
	});
	
	//////////////////////////////
	$("#mySubTypeEdit #id_field").hide();
	$("#workflowStatusEdit #id_field").hide();
	$("#myImpactTypeEdit #id_field").hide();
	$("#projectWorkflowStatusEdit #id_field").hide();
	$("#organization_depth_field").hide();
	$("#id_field").hide();
    $("form dl .info").hide();
	
	
	
	/**
	 * project selected display milestones..
	 */
	$( "#task_project").change(function() {
		var projectId = $('#task_project').val();
		var url="/get-project-tasks?project_id="+projectId;
		   $.get(url,  function(data) {
			   $("#task_milesotne").html(data);
	    });
		   
		   
	});
	
	$( "#task_goal_project").change(function() {
		var projectId = $('#task_goal_project').val();
		var url="/get-goal-list?project_id="+projectId;
		   $.get(url,  function(data) {
			   $("#task_goal").html(data);
	    });
	});
	

	$(".milestone_title").click(function(){ 
		var milestoneId = $(this).find('input').val();
		var url="/history-listing?milestone_id="+milestoneId;
		   $.get(url,  function(data) {
			   $("#history_listing").html(data);
		   });
		
	});
	
	$(".goal_title").click(function(){ 
		var goalId = $(this).find('input').val();
		var url="/goal-history?goal_id="+goalId;
		   $.get(url,  function(data) {
			   $("#history_listing").html(data);
		   });
		
	});

	$(".team_title").click(function(){ 
		var teamId = $(this).find('input').val();
		var url="/team-listing?team_id="+teamId;
		   $.get(url,  function(data) {
			   $("#history_listing").html(data);
		   });
		   
		url="/team-milestone-listing?team_id="+teamId;
		$.get(url,  function(data) {
		   $("#milestone_listing").html(data);
		});
		
	});

	$(".goal_team_title").click(function(){ 
		var teamId = $(this).find('input').val();
		var url="/goal-team-listing?team_id="+teamId;
		   $.get(url,  function(data) {
			   $("#goal-history_listing").html(data);
		   });
		   
		url="/team-goals-listing?team_id="+teamId;
		$.get(url,  function(data) {
		   $("#goals_listing").html(data);
		});
		
	});
	

	/**
	 * this is to select report type for genrencia...
	 * 
	 */
	$("#report_type").change(function() {
		var report_type = $('#report_type').val();
		var url="/get-genrencia-report-to-types?report_type="+report_type+"&tt="+Date.now();
		   $.get(url,  function(data) {
			   $("#report_to").html(data);
	    });
	});
	
	/**
	 * this is to select report type for department...
	 * 
	 */
	$("#d_report_type").change(function() {
		var report_type = $('#report_type').val();
		var url="/get-department-report-to-types?report_type="+report_type;
		   $.get(url,  function(data) {
			   $("#report_to").html(data);
	    });
	});
	
	
	$(".table tr:even").not(".table tr:first").addClass("table-tr-odd-bg");
	
	$(document).on("click",".projectAdd", function() {
		var url="/projectSave";
		   $.get(url,  function(data) {	  
			   alert(data);
		   });
	});
	
	
	$("#projectAdd").click(function(){ 
		  $.post('projectSave',$("#project").serialize(),function(data){
			//  alert(data);
		  }); 
	});
	
	$(".icon-remove").click(function(){ 
		 // alert("1121"); 
	});
	

	
	$('#myProject').validate({
		errorElement:'span',
		rules:{
			project_name:{
				required: true,
				maxlength: 500
			},
			description:{
				//required: true,
				maxlength: 2000
			},
			start_date:{
				required: true
			},
			final_release_date:{
				required: true
			},
			team_size:{
				//required: true,
				number: true,
				min:1			
			},
			project_manager:{
				required: true
			},
			company_url:{
				//required: true,
				url:true
			},
			country:{
				required: true
			},
			state:{
				//required: true
			},
			city:{
				//required: true
			},
			program:{
				required: true
			},
			department_code:{
				required: true
			},
			budget_approved_staff:{
				mynumber:true
			},
			budget_approved_contractor:{
				mynumber:true
			},
			budget_approved_hardware:{
				mynumber:true
			},
			budget_approved_software:{
				mynumber:true
			}
		},
		messages:{
			project_name:{
				required: "Please enter the name.",
				maxlength: "Max 500 characters acceptable."
			},
			description:{
				//required: "Please enter the description.",
				maxlength: "Max 2000 characters acceptable."
			},
			start_date:{
				required: "Please select start date."
			},
			final_release_date:{
				required: "Please select release date."
			},
			team_size:{
				//required: "Please enter the team size.",
				number: "Please enter numbers only.",
				min:"Please enter a valid number."
			},
			company_url:{
				//required: "Please enter company url.",
				url: "Please enter valid url."
			},
			project_manager:{
				project_manager: "Please select project manager."
			},
			country:{
				required: "Please select country."
			},
			state:{
				//required: "Please select state."
			},
			city:{
				//required: "Please select city."
			},
			program:{
				project_manager: "Please select program."
			},
			department_code:{
				department_code: "Please select department."
			},
			budget_approved_staff:{
				
			},
			budget_approved_contractor:{
				
			},
			budget_approved_hardware:{
				
			},
			budget_approved_software:{
				
			}
		}
	});
	
	
	$('#myDept').validate({
		errorElement:'span',
		rules:{
			department:{
				required: true,
				maxlength: 100
			},
			user_id:{
				required: true,
			}
		},
		messages:{
			department:{
				required: "Please enter the department name.",
				maxlength: "Max 100 characters acceptable."
			},
			user_id:{
				required: "Please select the user.",
			}
		}
	});
	
	$('#myDivision').validate({
		errorElement:'span',
		rules:{
			division:{
				required: true,
				maxlength: 100
			},
			user_id:{
				required: true,
			}
		},
		messages:{
			department:{
				required: "Please enter the department name.",
				maxlength: "Max 100 characters acceptable."
			},
			user_id:{
				required: "Please select the user.",
			}
		}
	});
	
	$('#myGenrencia').validate({
		errorElement:'span',
		rules:{
			genrencia:{
				required: true
			},
			user_id:{
				required: true
			},
			report_type:{
				required: true
			},
			report_to:{
				required: true
			}
		},
		messages:{
			genrencia:{
				required: "Please select the genrencia name."
			},
			user_id:{
				required: "Please select the user."
			},
			report_type:{
				required: "Please select the reporting values."
			},
			report_to:{
				required: "Please select the reporting values."
			}
		}
	});
	
	
	
	$('#myTeam').validate({
		errorElement:'span',
		rules:{
			team_name:{
				required: true
			}
		},
		messages:{
			team_name:{
				required: "Please enter team name."
			}
		}
	});
	$('#loginForm').validate({
		errorElement:'span',
		rules:{
			uname:{
				required: true
			},
			pass:{
				required: true
			}
		},
		messages:{
			uname:{
				required: "Please enter the user name."
			},
			pass:{
				required: "Please enter the password."
			}
		}
	});
	
	$('#resetPassword').validate({
		errorElement:'span',
		rules:{
			resetPassword:{
				required: true,
				email:true
			}
			
		},
		messages:{
			resetPassword:{
				required:  "Please enter the user's email address.",
				email: "Please enter a valid email address."
			}
		}
	});


	$('#confirmPassword').validate({
		errorElement:'span',
		rules:{
			newPassword:{
				required: true
			},
			confirmPassword:{
				required: true,
				 equalTo: "#newPassword"
			}
		},
		messages:{
			newPassword:{
				required: "Please enter a new password."
			},
			confirmPassword:{
				required: "Please enter the Confirm Password.",
				 equalTo: "Confirm password does not match."
			}
		}
	});
	
	$.validator.addMethod("mynumber", function (value, element) {
	    return this.optional(element) || ( (/^[\d]{1,11}(.[\d]{1,2})?$/).test(value) );
	}, "The value should not be negative.");
	
	$.validator.addMethod('positiveNumber',
		    function (value) { 
		        return Number(value) > 0;
		    }, 'Enter a positive number estimated time.');
	
	$('#myUser11').validate({
		errorElement:'span',
		rules:{
			first_name:{
				required: true
			},
			last_name:{
				required: true
			},
			uname:{
				required: true,
				remote:  "check-user"
			},
			password:{
				required: true
			},
			email:{
				required: true,
				email: true,
				remote:  "check-email"
			},
			rut_number:{
				required: true
			},
			contact_number:{
				required: true
			},
			birth_date:{
				required: true
			},
			joining_date:{
				required: true
			},
			rate_hour:{
				required: true
			},
			user_type:{
				required: true
			},
			work_hours:{
				required: true,
				mynumber:true
			},
			bonus_app:{
				required: true
			}
		},
		messages:{
			first_name:{
				required: "Please enter the first name."
			},
			last_name:{
				required: "Please enter last name."
			},
			uname:{
				required: "Please enter username.",
				remote: "User name is already exist."
			},
			password:{
				required: "Please enter password."
			},
			email:{
				required: "Please enter email.",
				email: "Please enter a valid email address.",
				remote: "Email id already exists."
			},
			rut_number:{
				required: "Please enter a RUT number."
			},
			contact_number:{
				required: "Please enter a contact number."
			},
			birth_date:{
				required: "Please select birth date."
			},
			joining_date:{
				required: "Please select joining date."
			},
			rate_hour:{
				required: "Please enter rate per hour."
			},
			user_type:{
				required: "Please select user type."
			},
			work_hours:{
				required: "Please enter work hours."
			},
			bonus_app:{
				required: "Please select bonus value."
			}
		}
	});
	
	$('#myUserUpdate').validate({
		errorElement:'span',
		rules:{
			first_name:{
				required: true
			},
			last_name:{
				required: true
			},
			uname:{
				required: true,
				remote:  "check-user"
			},
			password:{
				required: true
			},
			email:{
				required: true,
				email: true,
				remote:  "check-email"
			},
			rut_number:{
				required: true
			},
			contact_number:{
				required: true
			},
			birth_date:{
				required: true
			},
			joining_date:{
				required: true
			},
			rate_hour:{
				required: true
			},
			user_type:{
				required: true
			},
			work_hours:{
				required: true,
				mynumber:true
			},
			bonus_app:{
				required: true
			}
		},
		messages:{
			first_name:{
				required: "Please enter the first name."
			},
			last_name:{
				required: "Please enter the last name."
			},
			uname:{
				required: "Please enter the username.",
				remote: "User name is already exists."
			},
			password:{
				required: "Please enter the password."
			},
			email:{
				required: "Please enter email.",
				email: "Please enter a valid email address.",
				remote: "Email id already exists."
			},
			rut_number:{
				required: "Please enter a RUT number."
			},
			contact_number:{
				required: "Please enter the contact number."
			},
			birth_date:{
				required: "Please select birth date."
			},
			joining_date:{
				required: "Please select joining date."
			},
			rate_hour:{
				required: "Please enter rate per hour."
			},
			user_type:{
				required: "Please select user type."
			},
			work_hours:{
				required: "Please enter work hours."
			},
			bonus_app:{
				required: "Please select bonus value."
			}
		}
	});
	
	$('#myMilestone').validate({
		errorElement:'span',
		rules:{
			title:{
				required: true
			},
			milestone_code:{
				required: true,
				maxlength:8
			},
			milestone_release_date:{
				required: true
			},
			description:{
				//required: true
			},
			country:{
				required: true
			},
			state:{
				//required: true
			},
			city:{
				//required: true
			},
			plan_time:{
				required: true,
 				mynumber:true,
 				positiveNumber:true
			}
		},
		messages:{
			title:{
				required: "Please enter title."
			},
			milestone_code:{
				required: "Please enter milestone code.",
				maxlength:"Please enter 8 digit code only."
			},
			milestone_release_date:{
				required: "Please select the release date."
			},
			description:{
				//required: "Please enter description."
			},
			country:{
				required: "Please select the country."
			},
			state:{
				//required: "Please select state."
			},
			city:{
				//required: "Please select city."
			},
			plan_time:{
 				required: "Please enter the project plan time in hours.",
 				//mynumber: "Planned time should be in decimal.",
 				positiveNumber:"Planned time should not be negative."
 			}
		}
	});
	
	$('#historyForm').validate({
		
		errorElement:'span',
		rules:{
			tagTitle:{
				required: true
			},
			tag:{
				required: true
			}
		},
		messages:{
			tagTitle:{
				required:"Please enter tag title."
			},
			tag:{
				required: "Please select a tag."
			}
		}	
	});
	$('#myTeamMapping').validate({
		errorElement:'span',
		rules:{
			user:{
				required: true
			},
			role:{
				required: true
			},
			workingFrom:{
				required: true
			},
			workingTill:{
				required: true
			}
			
		},
		messages:{
			user:{
				required:"Please select the user."
			},
			role:{
				required: "Please select user role."
			},
			workingFrom:{
				required:"Please select the date."
			},
			workingTill:{
				required:"Please select the date."
			}
		}
		
	});
	
	$('#myMilestoneTask').validate({
		errorElement:'span',
		rules:{
			task_project:{
				required: true
			},
			task_milesotne:{
				required: true
			},
			task_title:{
				required: true
			},
			task_description:{
				required: true
			},
			task_start_date:{
				required: true
			},
			task_end_date:{
				required: true
			}
		},
		messages:{
			task_project:{
				required:"Please select project."
			},
			task_milesotne:{
				required:"Please select milestone."
			},
			task_title:{
				required:"Please select task title."
			},
			task_description:{
				required:"Please select task description."
			},
			task_start_date:{
				required:"Please select task start date."
			},
			task_end_date:{
				required:"Please select task end date."
			}
		}	
	});

	$('#myGoalTask').validate({
		errorElement:'span',
		rules:{
			task_project:{
				required: true
			},
			task_goal:{
				required: true
			},
			task_title:{
				required: true
			},
			task_description:{
				required: true
			},
			task_start_date:{
				required: true
			},
			task_end_date:{
				required: true
			}
		},
		messages:{
			task_project:{
				required:"Please select project."
			},
			task_goal:{
				required:"Please select goal."
			},
			task_title:{
				required:"Please select task title."
			},
			task_description:{
				required:"Please select task description."
			},
			task_start_date:{
				required:"Please select task start date."
			},
			task_end_date:{
				required:"Please select task end date."
			}
		}	
	});
	
	
	
	
	/**
	 * records on page during pagination
	 */
	if(getUrlVars()["record"]!=undefined || getUrlVars()["record"]!=null){$(".pageRecord").val(getUrlVars()["record"]);}
	$(".pageRecord").on('change',function(){
		var url=window.location.href;
		var withOutParametters = url.split('?')[0];
		var searchKey = $(".searchKey").val();
		window.location.href=withOutParametters+"?page=1&record="+$(this).val(); //+"&search="+searchKey;
	});
	
	
	/*
	 * Search
	 */
	if(getUrlVars()["search"]!=undefined || getUrlVars()["search"]!=null){$(".searchKey").val(getUrlVars()["search"]);}
	jQuery(".searchBtn").on('click',function()
			{
				var url=window.location.href;
			  	var withOutParametters = url.split('?')[0];
			  	var pageRecord =jQuery(".pageRecord").val();
			  	var searchKey = AllTrim($(".searchKey").val());
			  
			  	window.location.href=withOutParametters+"?page=1&record="+pageRecord+"&search="+searchKey;
			});
	
	
	/**
	 * slide up and slide down on click
	 */
	$(".project-manager").off("click").on("click", renderProjectManagerDetails);
	
	$("#role").on("change", renderUsers);
	
	//$(".task-project-select").on("change", renderProjectDetails);
	
	$(".allocation-step1-select").on("click", renderStep2);
	
});

function renderStep2(){
	var _this =$(this);
	var p_id= _this.attr("title");
	var url ="sub-task-allocation-step2?id="+p_id;
	$.get(url,  function(data) {
	   $(".well").html(data);
	   $(".allocation-step3-select").on("click", renderStep3);
    });
	  
}

function renderStep3(){
	var _this =$(this);
	var p_id= _this.attr("title");
	var url ="sub-task-allocation-step3?id="+p_id;
	$.get(url,  function(data) {
	   $(".well").html(data);
	   $(".allocation-step3-select").off("click").on("click", renderNewSubTask);
    });
}

function renderNewSubTask(){
	var _this =$(this);
	var task_id= _this.attr("title");
	var url ="sub-task-allocation?task_id="+task_id;
	$.get(url,  function(data) {
	   $(".well").html(data);
	 //  $(".allocation-step3-select").off("click").on("click", renderNewSubTask);
    });
	
}

function renderProjectManagerDetails(){
	var _this = $(this);
	var menu = jQuery(_this).find('span');
	if (menu.is(":visible"))
	{
		menu.slideUp(500);
	}
	// otherwise, slide the menu down
	else
	{
		menu.slideDown(500);
	}
}

function renderUsers(){
	
	/*var roleType = parseInt($("#role").val());
	var team_id =  parseInt($("#team").val());
	if(roleType==4){
		var url="/find-user-names?role="+roleType+"&team_id="+team_id;
	   $.get(url,  function(data) {
		   $('#user').html(data);
	   });
	}else{
		var url="/find-user-names?role="+roleType+"&team_id="+team_id;
		   $.get(url,  function(data) {
			   $('#user').html(data);
			  
		   });
	}*/
}
/**
 * get project details on task/milestone page...
 */
function renderProjectDetails(){
	var project_id = $("#project_id").val();
	if(project_id != null && project_id != 'undefined'){
		var url ="get-project-detail?id="+project_id;
	    $.get(url,  function(data) {
		   $('.project-details-admin').html(data);
	    });
		  
	    var url ="get-project-task-list?id="+project_id;
	    $.get(url,  function(data) {
	 	   $('#task-listing').html(data);
	     });
	}
    
}
function renderGerenciaList() {
	var _this = $(this);
	var d_id = _this.val();

	var url = "/get-genrencia-list?devision=" + d_id;
	$.get(url, function(data) {
		$("#genrencia").html(data);
	});
}

function renderDepartmentList() {
	var _this = $(this);
	var d_id = _this.val();

	var url = "/get-department-list?gerencia=" + d_id;
	$.get(url, function(data) {
		$("#department").html(data);
	});
}



/**
 * get all parameters and values form url 
 */
function getUrlVars()
{ 
		//get url parameters
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
}
function AllTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}


//////////////////////
function getUrlParameter(sParam)
{
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) 
  {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) 
      {
          return sParameterName[1];
      }
  }
}
function renderServiceCatalogList(){
	var _this = $(this);
	var d_id = _this.val();
	if(typeof d_id != "undefined" && d_id !=""){
		var url = "/service-catalogue-list-new?id=" + d_id+"&t="+Date.now();
		$.get(url, function(data) {
			$(".well").html(data);
		});
	}
	
}