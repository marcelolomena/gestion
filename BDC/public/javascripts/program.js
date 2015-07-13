$(document).ready(function(){
	
//	$(".allocation-step1-select").Live("click", renderStep2);
	
	
	$('#myProgram').validate({
		errorElement:'span',
		rules:{
			program_type:{
				required: true
			},
			program_sub_type:{
				required: true
			},
			program_code:{
				required: true
			},
			projects_numbers:{
				required: true,
				positiveNumber:true
			},
			system_code:{
				required: true,
				mynumber:true
			},
			internal_number:{
				required: true,
				positiveNumber:true
			},
			pLevel:{
				required: true
			},
			program_description:{
				required: true
			},
			work_flow_status:{
				required: true
			},
			internal_state:{
				required: true
			},
			demand_management_status:{
				required: true
			},
			demand_manager:{
				required: true
			},
			program_manager:{
				required: true
			},
			program_manager_designation:{
				required: true
			},
			management_representative:{
				required: true
			},
			department_representative:{
				required: true
			},
			devison:{
				required: true
			},
			management:{
				required: true
			},
			department:{
				required: true
			},
			impact_type:{
				required: true
			},
			business_line:{
				required: true
			},
			sap_code:{
				required: true,
				positiveNumber:true
			},
			total_sap:{
				required: true
			},
			completion_percentage :{
				required: true,
				mynumber:true
			},
			state_gantt:{
				required: true
			},
			initiation_planned_date:{
				required: true
			},
			end_planned_date:{
				required: true
			},
			baseline_date:{
				required: true
			},
			clossing_date_gantt:{
				required: true
			},
			actual_release_date :{
				required: true
			},
			closure_date :{
				required: true
			},
			last_action_date :{
				required: true
			}
			
		},
		messages:{
			program_type:{
				required: "Please enter program type"
			},
			program_sub_type:{
				required: "Please enter program sub type"
			},
			program_code:{
				required: "Please enter program code"
			},
			projects_numbers:{
				required: "Please enter project number"
			},
			system_code:{
				required: "Please enter system code"				
			},
			internal_number:{
				required: "Please enter Internal Number"
			},
			pLevel:{
				required: "Please enter project level"
			},
			program_description:{
				required: "Please enter project description"
			},
			work_flow_status:{
				required: "Please enter work flow status"
			},
			internal_state:{
				required: "Please enter internal state"
			},
			demand_management_status:{
				required: "Please enter demand management status"
			},
			demand_manager:{
				required: "Please enter demand manager"
			},
			program_manager:{
				required: "Please enter program manager"
			},
			program_manager_designation:{
				required: "Please enter project manager designation"
			},
			management_representative:{
				required: "Please enter management representative"
			},
			department_representative:{
				required: "Please enter department representative"
			},
			devison:{
				required: "Please enter deision"
			},
			management:{
				required: "Please enter management"
			},
			department:{
				required: "Please enter management representative"
			},
			impact_type:{
				required: "Please enter impact type"
			},
			business_line:{
				required: "Please enter bussines line"
			},
			sap_code:{
				required: "Please enter SAP code"
			},
			total_sap:{
				required: "Please enter total SAP"
			},
			completion_percentage :{
				required: "Please enter completion percentage"
			},
			state_gantt:{
				required: "Please enter state gantt"
			},
			initiation_planned_date:{
				required: "Please enter initiation planned date"
			},
			end_planned_date:{
				required: "Please enter end planned date"
			},
			baseline_date:{
				required: "Please enter baseline date"
			},
			clossing_date_gantt:{
				required: "Please enter clossing date gannt"
			},
			actual_release_date :{
				required: "Please enter actual release date"
			},
			closure_date :{
				required: "Please enter clousre date"
			},
			last_action_date :{
				required: "Please enter last action date"
			}
		}
	});

	
});

$.validator.addMethod("mynumber", function (value, element) {
    return this.optional(element) || ( (/^[\d]{1,11}(.[\d]{1,2})?$/).test(value) );
}, "Please specify the correct number format");


$.validator.addMethod('positiveNumber',
	    function (value) { 
	        return Number(value) > 0;
	    }, 'Enter a positive number estimated time.');