//if (!window.btoa) window.btoa = base64.encode

//if (!window.atob) window.atob = base64.decode
/**
 * Created by balkrishna Date: 06:06:2014
 */
$(document).ready(
		function() {
			
			Date.now = Date.now || function() { return +new Date; }; 

			// $("#new-task").off("click").on("click", renderNewTask);

			// $(".task_edit").live("click", renderTaskEdit);
			// $(".edit_tasks_details").live("click", renderTaskEdit);

			// $(".add_subtask").on("click", renderNewSubTask);

			// $(".edit-sub-task").live("click", renderEditSubTask);

			// $('#add-sub-task-form label').unbind('click');
			
			
			
			
			$('form label').click(
					function(e) {
						e.preventDefault();
						var elem = $(e.target);
						if (!elem.hasClass("hasDatepicker")
								&& !elem.is(":visible")
								&& !elem.hasClass("ui-datepicker")
								&& !elem.hasClass("ui-icon")
								&& !elem.hasClass("ui-datepicker-next")
								&& !elem.hasClass("ui-datepicker-prev")
								&& !$(elem).parents(".ui-datepicker").length) {

							$('.hasDatepicker').datepicker('hide');
						}

					});

			$("#sap-form").on("submit", function() {

			})

			
			$(".assign-sub-task").live("click", renderAssignSubTask);

			$("#pop-box-over").on("click", renderClosePoup);

			// $(".show_tasks_details").live("click", renderTaskDetails);

			// $(".main_task_data").live("click", renderTaskDetails2);
			// $("#program_code").on("blur", renderValidateProgramCode);

			$(".cancel-form").live("click", renderCancelProgram);

			$("#critical_path").on("change", renderCriticalPath);
			$("#sub_task_critical_path")
					.on("change", renderSubTaskCriticalPath);

			// $("#role_id").on("change", programMemberOnSelect);

			$("#baseline_enabled").change(
					function() {
						var baseLineEnabled = false;
						if (this.checked) {
							baseLineEnabled = true;
						}
						$("#baseline_enabled_flag").val(baseLineEnabled);
						showHideBaseline(this.checked);
						jQuery.ajax({
							url : "/update-baseline",
							type : "POST",
							data : "project_id=" + $("#projectId").val()
									+ "&baseline=" + baseLineEnabled,
							cache : false,
							success : function(data) {
								if (data != 'success') {
									alert("alertSomethingWentWrong");
								}
							},
							error : function() {
								alert("alertSomethingWentWrong");
							}
						});

					});

			$(".program-sap").live("click", renderSAPUpdate);

			$(".active-project-sap").live("click", renderProjectSAPUpdate);

			$(".delete_tasks_details").live("click", renderTasksUpdate);

			$(".delete-predefined").on("click", renderDeletePredefinedTask);

			$(".delete-sub-task-id").on("click", renderDeleteSubTask);

			$(".dashboard-tab2").on("click", showSearchDashboard);
			
			$("#dashboard-risk-tab").on("click", renderShowRiskReport);
			
			$("#dashboard-issue-tab").on("click", renderShowIssueReport);

			$(".program-tab2").on("click", showSearchProgram);

			$(".alert-tab2").on("click", showSearchAlert);

			$(".edit-hours").off("click").on("click", renderEditProgramHours);
			
			$(".edit-status").off("click").live("click", renderEditProgramStatus);
			

			$(".edit-estimated-cost").off("click").on("click",
					renderEditProgramEstimatedCost);

			$(".edit-project-hours").on("click", renderEditprojectHours);

			$("#role_id").on("change", renderMembersFromRole);

			$(".delete-risk").on("click", renderDeleteRisk);
			$(".delete-alert").on("click", renderDeleteAlert);
			$("#risk-filter-tab li").on("click", toggleTabRisk);
			$("#issue-filter-tab li").on("click", toggleTabIssue);
			
			
		});

function toggleTabRisk() {
	
	
	if(!($(this).find(":first-child").hasClass("current"))){
		$(".loader").css("display", "block");
		anchorTag = $(this).find(":first-child");
		$("#risk-filter-tab li").each(function() {
			$(this).find(":first-child").removeClass('current');
		});
		selectedTab = $(anchorTag).attr('class');
		$(anchorTag).addClass("current");
		//$("#search-result-form").submit();
		callApi($(anchorTag).attr('href'), null, 'GET', toggleTabRiskCallback);
		
	}
	
	return false;
}

function toggleTabIssue() {
	
	if(!($(this).find(":first-child").hasClass("current"))){
		$(".loader").css("display", "block");
		anchorTag = $(this).find(":first-child");
		$("#risk-filter-tab li").each(function() {
			$(this).find(":first-child").removeClass('current');
		});
		selectedTab = $(anchorTag).attr('class');
		$(anchorTag).addClass("current");
		//$("#search-result-form").submit();
		callApi($(anchorTag).attr('href'), null, 'GET', toggleTabIssueCallback);
		
	}
	return false;
}

function toggleTabIssueCallback(reponse){
	$("#risk_result").html(reponse);
	$(".loader").css("display", "none");
	
}

function addEvenOddRisk(){
	var i = 0;
	$("#risk_result li.row-data").each(function(item, index){
		
		if(i%2==0){
			$(this).addClass("even-row-data")
		}
		
		i++;
	});
}

function toggleTabRiskCallback(reponse){
	$("#risk_result").html(reponse);
	
	addEvenOddRisk();
	$(".loader").css("display", "none");
	
}

function programMemberOnSelect() {
	var selectedOption = $(this).val()

	if (selectedOption == 47) {
		alert(1);
	} else if (selectedOption == 48) {
		alert(2);
	}
}

function renderMembersFromRole() {
	var roleId = $(this).val();
	if (roleId == null || roleId == "") {
		roleId = "0";
	}
	var url1 = "/get-members-from-role/" + roleId;
	$(".loader").css("display", "block");
	$.ajax({
		url : url1,
		type : "GET",
		cache : false,
		dataType : "html",
		async : false,
		success : function(data) {
			$("#member_id").html(data);
			$(".loader").css("display", "none");
		}
	});
}


function renderGerenciaList() {
	var _this = $(this);
	var d_id = _this.val();
	var url = "/get-genrencia-list?devision=" + d_id;
	$.get(url, function(data) {
		$("#program_details_management").html(data);
	});
}

function renderDepartmentList() {
	var _this = $(this);
	var d_id = _this.val();
	if(d_id==""){
		$("#program_details_department").html('<option value="">--- Elija un Departamento ---</option>');
	}else{
		var url = "/get-department-list?gerencia=" + d_id;
		$.get(url, function(data) {
			$("#program_details_department").html(data);
		});
	}
}

function renderUserGerenciaList() {
	var _this = $(this);
	var d_id = _this.val();

	var url = "/get-genrencia-list?devision=" + d_id;
	$.get(url, function(data) {
		$("#office_gerencia").html(data);
		$("#office_department").html(
				"<option value=''>--- Choose A Department ---</option>")
	});
}

function renderUserGerenciaAndDepartmentList() {
	var _this = $(this);
	var d_id = _this.val();
	var url = "/get-genrencia-and-department-list?devision=" + d_id;
	$.get(url, function(data) {
		var json = $.parseJSON(data);
		$("#office_gerencia").html(json.gerenciaMap);
		$("#office_department").html(json.departmentMap);
	});
}

function renderUserDepartmentList() {
	var _this = $(this);
	var d_id = _this.val();

	var url = "/get-department-list?gerencia=" + d_id;
	$.get(url, function(data) {
		$("#office_department").html(data);
	});
}


function renderDashBoardGerenciaAndDepartmentList() {
	var _this = $(this);
	var d_id = _this.val();
	var url = "/get-genrencia-and-department-list?devision=" + d_id;
	$.get(url, function(data) {
		var json = $.parseJSON(data);
		$("#gerencia").html(json.gerenciaMap);
		$("#department").html(json.departmentMap);
	});
}

function renderDashBoardDepartmentList() {
	var _this = $(this);
	var d_id = _this.val();

	var url = "/get-department-list?gerencia=" + d_id;
	$.get(url, function(data) {
		$("#department").html(data);
	});
}
function showHideBaseline(baselineEnabled) {
	if (baselineEnabled) {
		// $("#t_data_list .baseline_status").css("display", "block");
		$("#t_data_list .change-status-base").html("Yes");
		// $("#t_data_list .task_staus").css("width", "7%");
		// $("#subtask-details .subtask-baseline").css("display", "block");
	} else {
		// $("#t_data_list .baseline_status").css("display", "none");
		// $("#t_data_list .task_staus").css("width", "7%");
		$("#t_data_list .change-status-base").html("No")
		// $("#subtask-details .subtask-baseline").css("display", "none");
	}

}

$.validator.addMethod("mynumber", function(value, element) {
	return this.optional(element)
			|| ((/^[\d]{1,11}(.[\d]{1,2})?$/).test(value));
}, "Please specify the correct number format");

$.validator.addMethod('positiveNumber', function(value) {
	return Number(value) > 0;
}, 'Enter a positive number estimated time.');

$.validator
		.addMethod(
				"truedate",
				function(value) {
					function GetFullYear(year) {
						var twoDigitCutoffYear = 10 % 100;
						var cutoffYearCentury = 10 - twoDigitCutoffYear;
						return ((year > twoDigitCutoffYear) ? (cutoffYearCentury - 100 + year)
								: (cutoffYearCentury + year));
					}
					if (value == null || value == '')
						return true;
					var yearFirstExp = new RegExp(
							"^\\s*((\\d{4})|(\\d{2}))([-/]|\\. ?)(\\d{1,2})\\4(\\d{1,2})\\.?\\s*$");
					try {
						m = value.match(yearFirstExp);
						var day, month, year;
						if (m != null && (m[2].length == 4)) {
							day = m[6];
							month = m[5];
							year = (m[2].length == 4) ? m[2]
									: GetFullYear(parseInt(m[3]));
						} else {
							var yearLastExp = new RegExp(
									"^\\s*(\\d{1,2})([-/]|\\. ?)(\\d{1,2})(?:\\s|\\2)((\\d{4})|(\\d{2}))(?:\\s\u0433\\.)?\\s*$");
							m = value.match(yearLastExp);
							if (m == null) {
								return null;
							}
							day = m[1];
							month = m[3];
							year = (m[5].length == 4) ? m[5]
									: GetFullYear(parseInt(m[6]));
						}
						month -= 1;
						var date = new Date(year, month, day);
						if (year < 100) {
							date.setFullYear(year);
						}
						return (typeof (date) == "object"
								&& year == date.getFullYear()
								&& month == date.getMonth() && day == date
								.getDate()) ? date.valueOf() : null;
					} catch (err) {
						return null;
					}
				}, "Invalid date");

function renderNewTask() {
	var _this = $(this);
	jQuery
			.ajax({
				url : "/task-new-fo?id=" + $("#project_id").val(),
				type : "GET",
				cache : false,
				dataType : "html",
				success : function(data) {
					$("#pop-box").css("position", "absolute");
					$("#pop-box").css("top", "0%");
					$("#pop-box").html(data);
					$("#pop-box").removeClass("display-none");
					$("#pop-box-over").removeClass("display-none");
					$(".leftPanel").css("z-index", "0");
					autocompleteOwnerSearch();
					var minD = $("#project_start").val().replace(/-/g, '/');
					var maxD = $("#project_end").val().replace(/-/g, '/');
					$("#plan_start_date").datepicker(
							{
								buttonImageOnly : true,
								minDate : new Date(minD),
								maxDate : new Date(maxD),
								dateFormat : "dd-mm-yy",
								onSelect : function(d, inst) {
									var dt = $.datepicker.parseDate('dd-mm-yy',
											d);
									$('#plan_end_date').datepicker('option',
											'minDate', dt);
									$('#plan_end_date').datepicker("refresh");
								}
							});
					$("#plan_end_date").datepicker(
							{
								buttonImageOnly : true,
								minDate : new Date($("#project_start").val()
										.replace(/-/g, '/')),
								maxDate : new Date($("#project_end").val()
										.replace(/-/g, '/')),
								dateFormat : "dd-mm-yy"
							});

					$("#title").focus();

					$('#fo-new-task-form')
							.validate(
									{
										errorElement : 'span',
										submitHandler : function(form) {
											saveTaskFo();
										},
										rules : {
											title : {
												required : true,
												maxlength : 60
											},
											plan_start_date : {
												truedate : true,
												required : true
											},
											description : {
												maxlength : 160
											},
											plan_end_date : {
												required : true,
												truedate : true
											},
											plan_time : {
												required : true,
												mynumber : true,
												positiveNumber : true

											}

										},
										messages : {
											title : {
												required : "Por favor ingresa un título",
												maxlength : "El título debe debe tener mínimo 4 y máximo de 60 caracteres."
											},
											plan_start_date : {
												required : "Por favor, introduzca la fecha."
											},
											description : {
												maxlength : "Descripción de la tarea debe tener como máximo 160 caracteres."
											},
											plan_end_date : {
												required : "Por favor, introduzca la fecha."
											},
											plan_time : {
												required : "Por favor, introduzca el valor numérico."
											}

										}
									});

					// console.log($("#project_start").val() +"
					// "+$("#project_end").val());

					$(".close-popup-box, .cancel-form").off("click").on(
							"click", renderClosePoup);

					$("#milestone_status").on("change", renderTaskRemark);
				},
				error : function() {
					alert("Error");
				}
			});
}

function renderNewSubTask() {
	var _this = $(this)
	var task_id = $("#milestone_id").val();
	// var task_id = $("#t_data_list
	// .selected-task").find(".show_tasks_details").attr("id").split("_")[1];
	// var task_id = $("#milestone_id").val();
	if (task_id) {
		$.ajax({
			url : "/sub-task-new-fo?id=" + task_id,
			type : "GET",
			cache : false,
			dataType : "html",
			success : function(data) {
				// console.log(data);
				$("#pop-box").css("position", "fixed");
				$("#pop-box").css("top", "10%");
				$("#pop-box").html(data);
				$("#pop-box").removeClass("display-none");
				$("#pop-box-over").removeClass("display-none");
				$(".leftPanel").css("z-index", "0");

				// console.log($("#task_start_date").val() +"
				// "+$("#task_end_date").val());

				// milestoneId("",task_id);
			}
		});

	}

	/*
	 * jQuery.ajax({ url: "/task-new-fo?id="+$("#project_id").val(), type:
	 * "GET", cache: false, dataType : "html", success: function (data) {
	 * 
	 * jQuery("#pop-box").html(data); $("#pop-box").removeClass("display-none"); }
	 * });
	 */

}

function renderEditSubTask() {
	var _this = jQuery(this);
	var sub_task_id = $("#sub_task_id").val();
	var task_id = $("#milestone_id").val();
	$
			.ajax({
				url : "/sub-task-edit-fo?id=" + sub_task_id,
				type : "GET",
				cache : false,
				dataType : "html",
				success : function(data) {
					$("#pop-box").css("position", "fixed");
					$("#pop-box").css("top", "10%");
					$("#pop-box").html(data);
					$("#pop-box").removeClass("display-none");
					$("#pop-box-over").removeClass("display-none");
					$(".leftPanel").css("z-index", "0");
					// //console.log($("#task_start_date").val() +"
					// "+$("#task_end_date").val());
					$("#planned_start_date").datepicker(
							{
								buttonImageOnly : true,
								minDate : new Date($("#task_start_date").val()
										.split(' ')[0].replace(/-/g, '/')),
								maxDate : new Date($("#task_end_date").val()
										.split(' ')[0].replace(/-/g, '/')),
								dateFormat : "dd-mm-yy",
								onSelect : function(d, inst) {
									var dt = $.datepicker.parseDate('dd-mm-yy',
											d);
									$('#planned_end_date').datepicker('option',
											'minDate', dt);
									$('#planned_end_date')
											.datepicker("refresh");
								}
							});

					var datefrommysql = $("#planned_start_date").val();
					var arraydate = datefrommysql.split('-');
					var yearfirstdigit = arraydate[2][2];
					var yearlastdigit = arraydate[2][3];
					var day = arraydate[0];
					var month = arraydate[1];
					var year = arraydate[2]
					// alert(Date.parse(day + "/" + month + "/" + year) );

					var datefrommysql2 = $("#task_end_date").val();
					var arraydate2 = datefrommysql2.split('-');
					var yearfirstdigit2 = arraydate2[2][2];
					var yearlastdigit2 = arraydate2[2][3];
					var day2 = arraydate2[0];
					var month2 = arraydate2[1];
					var year2 = arraydate2[2].split(" ")[0]
					// alert(day2 + "/" + month2 + "/" + year2) ;

					// alert(new Date($("#task_end_date").val().split('
					// ')[0].replace(/-/g, '/')));
					$("#planned_end_date").datepicker({
						buttonImageOnly : true,
						dateFormat : "dd-mm-yy",
						minDate : Date.parse(day + "/" + month + "/" + year),
						maxDate : Date.parse(day2 + "/" + month2 + "/" + year2)

					});

					$('#fo-new-sub-task-form')
							.validate(
									{
										errorElement : 'span',
										submitHandler : function(form) {
											saveSubTaskFo();
										},
										rules : {
											task_title : {
												required : true,
												maxlength : 60
											},
											task_description : {
												required : true,
												maxlength : 160
											},
											planned_start_date : {
												required : true,
												truedate : true
											},
											planned_end_date : {
												required : true,
												truedate : true
											}

										},
										messages : {
											task_title : {
												required : "Por favor, ingresa el título.",
												maxlength : "Título debe tener mínimo 4 y máximo de 60 caracteres."
											},
											task_description : {
												required : "Por favor, ingresa la descripción",
												maxlength : "Descripción de la subtarea debe tener como máximo 160 caracteres."
											},
											planned_start_date : {
												required : "Por favor, introduzca la fecha."
											},
											planned_end_date : {
												required : "Por favor, introduzca la fecha."
											}

										}
									});

					$(".close-popup-box, .cancel-form").off("click").on(
							"click", renderClosePoup);

				}
			});

}

function renderAssignSubTask() {
	var _this = $(this);
	var _this = jQuery(this);
	var sub_task_id = $("#sub_task_id").val();

	$
			.ajax({
				url : "/assign-sub-task?id=" + sub_task_id,
				type : "GET",
				cache : false,
				dataType : "html",
				success : function(data) {

					$("#pop-box").html(data);

					$("#pop-box").removeClass("display-none");

					$("#pop-box-over").removeClass("display-none");

					$(".leftPanel").css("z-index", "0");

					$(".close-popup-box, .cancel-form").off("click").on(
							"click", renderClosePoup);

					$("#user_role")
							.change(
									function() {
										var roleId = $(this).val();
										if (roleId == null || roleId == "") {
											roleId = 0;
										}
										/*
										if (roleId == 46 || roleId == 47) {
											var url1 = "/get-program-members-external-from-role/"
													+ roleId
													+ "/"
													+ $("#subtask_project_id")
															.val();
										} else {
											var url1 = "/get-program-members-from-role/"
													+ roleId
													+ "/"
													+ $("#subtask_project_id")
															.val();
										}
										*/
										if (roleId == 1) {
											var url1 = "/get-program-members-external-from-projectid/"
													+ $("#projectId")
															.val();
										} else {
											var url1 = "/get-program-members-from-projectid/"
													+ $("#projectId")
															.val();
										}										

										$(".loader").css("display", "block");
										$.ajax({
											url : url1,
											type : "GET",
											cache : false,
											dataType : "html",
											async : false,
											success : function(data) {
												$("#user").html(data);
												$(".loader").css("display",
														"none");
											}
										});
									});

					/*
					 * var department_id = $("#department").val(); var url =
					 * "/get-user-by-department?department_id=" + department_id;
					 * $.get(url, function(data) { $("#user").html(data);
					 * autocompleteSearch(); $("#user").val("");
					 * $("#search-user").val(""); $("#search-user").focus(); });
					 */
					$.validator.addMethod('positiveNumber', function(value) {
						return Number(value) > 0;
					}, 'Enter a positive number estimated time.');

					$('#assign_subtask')
							.validate(
									{
										errorElement : 'span',
										submitHandler : function(form) {
											assignSubTaskFo();
										},
										rules : {
											user : {
												required : true
											},
											estimated_time : {
												required : true,
												positiveNumber : true
											}
										},
										messages : {
											user : {
												required : "Por favor selecciona un usuario."
											},
											estimated_time : {
												required : "Por favor ingresa el tiempo estimado, en horas"
											}
										}
									});
					renderAllocationList(sub_task_id);

				}
			});

}

function autocompleteSearch() {
	/**
	 * search..
	 * 
	 */
	var availableTags = [];
	// alert($('#user').html());
	$('#user').find(".dep-user").each(function() {
		// alert($(this).html())
		availableTags.push(AllTrim($(this).text()));
	});

	$.extend($.ui.autocomplete.prototype, {
		_renderItem : function(ul, item) {

			var term = this.element.val(), html = item.label.replace("", "");
			return $("<li></li>").data("item.autocomplete", item).append(
					$("<a></a>").html(html)).appendTo(ul);
		}
	});

	$("#search-user").autocomplete({
		source : availableTags
	});
	$(".ui-autocomplete").css("width", "300px");

	$('#search-user').blur(function() {
		var isPresent = false;
		var searchString = AllTrim($('#search-user').val());
		var otherValue = "";
		$('#user').find(".dep-user").each(function() {
			otherValue = AllTrim($(this).text());
			if (searchString == otherValue) {
				isPresent = true;
				$("#user").val($(this).val());
			}

		});

		if (!isPresent) {
			// $("#user").val("");
		}
	});
}

function autocompleteOwnerSearch() {
	/**
	 * search..while creating a task
	 * 
	 */
	var availableTags = [];

	$('#task_owner').find("option").each(function() {
		availableTags.push(AllTrim($(this).text()));
	});

	$.extend($.ui.autocomplete.prototype, {
		_renderItem : function(ul, item) {
			var term = this.element.val(), html = item.label.replace("", "");
			return $("<li></li>").data("item.autocomplete", item).append(
					$("<a></a>").html(html)).appendTo(ul);
		}
	});

	$("#search-user").autocomplete({
		source : availableTags
	});
	$(".ui-autocomplete").css("width", "300px");

	$('#search-user').blur(function() {
		var isPresent = false;
		var searchString = AllTrim($('#search-user').val());
		var otherValue = "";
		$('#task_owner').find("option").each(function() {
			otherValue = AllTrim($(this).text());
			if (searchString == otherValue) {
				isPresent = true;
				$("#task_owner").val($(this).val());
			}
		});

		if (!isPresent) {
			// $("#task_owner").val("");
		}
	});
}

function autocompletePMSearch() {
	/**
	 * search..while creating a task
	 * 
	 */
	var availableTags = [];

	$('#project_manager').find("option").each(function() {
		availableTags.push(AllTrim($(this).text()));
	});

	$.extend($.ui.autocomplete.prototype, {
		_renderItem : function(ul, item) {
			var term = this.element.val(), html = item.label.replace("", "");
			return $("<li></li>").data("item.autocomplete", item).append(
					$("<a></a>").html(html)).appendTo(ul);
		}
	});

	$("#search-user").autocomplete({
		source : availableTags
	});
	$(".ui-autocomplete").css("width", "300px");

	$('#search-user').blur(
			function() {
				var isPresent = false;
				var searchString = AllTrim($('#search-user').val());
				var otherValue = "";
				$('#project_manager').find("option").each(
						function() {
							otherValue = AllTrim($(this).text());
							if (searchString == otherValue) {
								isPresent = true;
								$("#project_manager").val($(this).val());
								$("#project_manager").next().find(
										".customStyleSelectBoxInner").html(
										otherValue);
							}
						});

				if (!isPresent) {
					// $("#project_manager").val("");
				}
			});
}

function saveTaskFo() {

	var task_code = $("#task_code").val();
	var project_id = $("#project_id").val();
	var url = jQuery("#fo-new-task-form").attr("action");
	var mode = $("#mode").val();
	var mId = "";
	if (mode == "edit") {
		mId = $("#mId").val();
	}

	$
			.ajax({
				url : url,
				type : "POST",
				cache : false,
				data : $("#fo-new-task-form").serialize(),
				dataType : "html",
				success : function(data) {

					var obj = JSON.parse(data);
					if (obj.status == "Success") {
						$("#pop-box").css("position", "fixed");
						$('#fo-new-task-form input').attr('disabled',
								'disabled');
						// window.location.reload();

						var delay = 200;
						setTimeout(
								function() {
									var url = "/get-updated-tasks?t="
											+ Date.now() + "&project_id="
											+ project_id;
									$
											.get(
													url,
													function(data) {
														$("#t_data_list").html(
																data);

														if (mode == "add") {
															var items = $("#project_task_list .task_data");

															var numItems = items.length;

															if (numItems > 0) {
																$('#task_items')
																		.css(
																				'display',
																				'block');
																var perPage = 5;

																items
																		.slice(
																				perPage)
																		.hide();
																$("#task_items")
																		.pagination(
																				{
																					items : numItems,
																					itemsOnPage : perPage,
																					cssStyle : "light-theme",
																					onPageClick : function(
																							pageNumber) { // this
																						// is
																						// where
																						// the
																						// magic
																						// happens
																						// someone
																						// changed
																						// page,
																						// lets
																						// hide/show
																						// trs
																						// appropriately
																						var showFrom = perPage
																								* (pageNumber - 1);
																						var showTo = showFrom
																								+ perPage;

																						items
																								.hide()
																								// first
																								// hide
																								// everything,
																								// then
																								// show
																								// for
																								// the
																								// new
																								// page
																								.slice(
																										showFrom,
																										showTo)
																								.show();
																						// $("#teamhistory").html("");
																						$(
																								"#t_data_list")
																								.find(
																										".task_data")
																								.removeClass(
																										"selected-task");
																					}
																				});
															} else if (numItems === 0) {
																$(
																		'#emp_list_item')
																		.css(
																				'display',
																				'none');
															}

															if (obj.lastestId) {
																var latest_id = obj.lastestId
																var count = 0;
																$(
																		"#project_task_list")
																		.find(
																				".show_tasks_details")
																		.each(
																				function() {
																					count++;
																					var id = $(
																							this)
																							.attr(
																									"id")
																							.split(
																									"_")[1];

																					if (id == latest_id) {
																						var page = 1;
																						var x = count;
																						var y = 5;
																						var res = x
																								% y;
																						if (res != 0) {
																							page = ((x - res)
																									/ y + 1);
																						} else {
																							page = ((x - res) / y);
																						}

																						$(
																								"#task_items")
																								.pagination(
																										'selectPage',
																										page);
																						$(
																								"#pop-box")
																								.html(
																										"");
																						$(
																								"#pop-box")
																								.addClass(
																										"display-none");
																						$(
																								"#pop-box-over")
																								.addClass(
																										"display-none");
																						$(
																								".leftPanel")
																								.css(
																										"z-index",
																										"2");
																						// $("#st_"+latest_id).trigger("click");
																					}

																				});

															}

														} else {
															window.location.href = "/project-task-details/"
																	+ mId
															/*
															 * $("#pop-box").html("");
															 * $("#pop-box").addClass(
															 * "display-none");
															 * $("#pop-box-over").addClass(
															 * "display-none");
															 */
														}

													});
									renderGanttChart();
								}, delay);

					} else {
						// $("#fo-new-task-form").find("input").removeClass("error");
						if (obj.messageStartDate) {
							alert(obj.messageStartDate);
							// $("#plan_start_date").addClass("error");
							$("#plan_start_date").focus();
						} else if (obj.messageEndDate) {
							alert(obj.messageEndDate);
							// $("#plan_end_date").addClass("error");
							$("#plan_end_date").focus();
						} else if (obj.messagePlanTime) {
							alert(obj.messagePlanTime);
							$("#plan_end_date").addClass("error");
							$("#plan_end_date").focus();
						} else if (obj.completion_percentage) {
							alert("Por favor ingresa un % de tiempo válido");

						} else {
							alert("Error, por favor ingresa un valor válido");
						}

					}

					// jQuery("#timesheet-list tbody").append(data);
				},
				error : function() {
					alert("Error");
				}
			});
}

function saveSubTaskFo() {

	var url = jQuery("#fo-new-sub-task-form").attr("action");
	var sub_task_id = $("#sub_task_id").val();
	var task_id = $("#task_id").val();
	$.ajax({
		url : url,
		type : "POST",
		cache : false,
		data : $("#fo-new-sub-task-form").serialize(),
		dataType : "html",
		success : function(data2) {
			var obj = JSON.parse(data2);
			if (obj.status == "Success") {
				// window.location.reload();
				milestoneId("", milestone_id);

				$(".loader").css("display", "none");
				if (obj.lastestId) {
					var delay = 500;
					setTimeout(function() {
						$("#flot-placeholder .leftPanel").find(".fn-label")
								.each(function() {
									var id = $(this).attr("id").split("_")[1];
									if (id == obj.lastestId) {
										$(this).trigger("click");
									}
								});
					}, delay);
				}
				$('#fo-new-sub-task-form input').attr('disabled', 'disabled');
				$("#pop-box").html("");
				$("#pop-box").addClass("display-none");
				$("#pop-box-over").addClass("display-none");
				$(".leftPanel").css("z-index", "2");

			} else {

				if (obj.messageStart) {

					alert(obj.messageStart);
					// $("#plan_start_date").addClass("error");
					$("#planned_start_date").focus();
				} else if (obj.messageEnd) {
					alert(obj.messageEnd);
					// $("#plan_end_date").addClass("error");
					$("#planned_end_date").focus();
				} else if (obj.messageTask) {
					alert(obj.messageTask);
					$("#task_title").addClass("error");
					$("#task_title").focus();
				} else {
					alert("Error, por favor ingresa un valor válido");
				}

			}
			// 
			// jQuery("#timesheet-list tbody").append(data);
		},
		error : function() {
			alert("Error");
		}
	});
}

function isIE() {
	var myNav = navigator.userAgent.toLowerCase();
	return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1])
			: false;
}

function assignSubTaskFo() {
	var days = parseFloat($("#days").val());
	var estimated_time = parseFloat($("#estimated_time").val());

	if (days < estimated_time) {
		alert("Un máximo de " + days
				+ " horas pueden ser asignadas para esta tarea, favor reingrese las horas.");
		$("#estimated_time").focus();
	} else {
		var userValue = $("#user").val();
		if (userValue == "") {
			alert("Por favor seleccione un usuario válido.");
			$("#search-user").focus();
		} else {
			var max_hour = parseFloat($("#max_hours").val());
			var input_value = parseFloat($("#estimated_time").val());
			var m_id = $("#task_id").val();
			var t_id = $("#sub_task_id").val();
			// alert(max_hour +" - "+ input_value +" - "+ (max_hour >=
			// input_value) );
			var role_id = $("#user_role").val();
			//if (role_id == 46 || role_id == 47) {
			if (role_id == 1) {				
				if (max_hour >= input_value) {
					$
							.ajax({
								url : "/assign-sub-task-external",
								type : "POST",
								cache : false,
								data : $("#assign_subtask").serialize(),
								dataType : "html",
								success : function(data) {
									if (data == "Success") {
										milestoneId("", m_id);
										$("#pop-box").html("");
										$("#pop-box").addClass("display-none");
										$("#pop-box-over").addClass(
												"display-none");
										$(".leftPanel").css("z-index", "2");

										renderEarnValue(m_id);
										renderEarnValuepro(m_id);
										var delay = 300;
										setTimeout(function() {
											getTaskDetails(t_id);
										}, delay);

									} else {
										alert("Error, por favor ingresa un valor válido");
									}
									$('#assign_subtask input').attr('disabled',
											'disabled');
									// jQuery("#timesheet-list
									// tbody").append(data);
								},
								error : function() {
									alert("Error");
								}
							});
				} else {
					alert("Tiempo estimado debe ser menor a las horas disponibles.");
					$("#estimated_time").focus();
				}
			} else {
				if (max_hour >= input_value) {
					var url = $("#assign_subtask").attr("action");
					$
							.ajax({
								url : url,
								type : "POST",
								cache : false,
								data : $("#assign_subtask").serialize(),
								dataType : "html",
								success : function(data) {
									var _data = JSON.parse(data)
									// console.log(_data)
									if (_data.status == "Success") {
										// window.location.reload();
										// milestoneId("", m_id);
										$("#pop-box").html("");
										$("#pop-box").addClass("display-none");
										$("#pop-box-over").addClass(
												"display-none");
										$(".leftPanel").css("z-index", "2");

										/* renderEarnValue(m_id); */
										var delay = 300;
										setTimeout(function() {
											getTaskDetails(t_id);
										}, delay);
										if (_data.lastestId) {
											$("row_" + _data.lastestId)
													.trigger("click");
											/*
											 * setTimeout(function() {
											 * $("#flot-placeholder
											 * .leftPanel").find(".fn-label").each(function() {
											 * var id =
											 * $(this).attr("id").split("_")[1];
											 * console.log((id ==
											 * _data.lastestId)); if (id ==
											 * _data.lastestId) {
											 * $(this).trigger("click"); } }); },
											 * delay);
											 */
										}
									} else {
										alert("Error, por favor ingresa un valor válido");
									}
									$('#assign_subtask input').attr('disabled',
											'disabled');
									// jQuery("#timesheet-list
									// tbody").append(data);
								},
								error : function() {
									alert("Error");
								}
							});
				} else {
					alert("Tiempo estimado debe ser menor a las horas disponibles.");
					$("#estimated_time").focus();
				}
			}
		}

	}

}

function renderClosePoup() {
	$("#pop-box").css("position", "fixed");
	$("#pop-box").css("top", "10%");
	$("#pop-box").html("");
	$("#pop-box").addClass("display-none");
	$("#pop-box-over").addClass("display-none");

	$(".leftPanel").css("z-index", "2");

}

function renderAllocationList(id) {
	if (id != "") {

		$.ajax({
			url : "/allocation-list?id=" + id,
			type : "GET",
			cache : false,
			dataType : "html",
			success : function(data) {

				$("#allocation_list").html(data);

				$(".delete-allocation").off("click").on("click",
						renderDeleteAllocation);
				$(".delete-external-allocation").off("click").on("click",
						renderDeleteExternalAllocation);

				$(".edit-external-allocation").on("click",
						renderEditExternalAllocation);
				$(".edit-internal-allocation").on("click",
						renderEditInternalAllocation);

				
				// $(".edit_assigned_user").off("click").on("click",renderEditAssignSubTask);

			}
		});

	}
}

function renderDeleteAllocation() {
	var _this = $(this);
	var id = _this.attr("id").split("_")[1];
	var sub_task = $("#sub_task_id").val();
	$.ajax({
		url : "/delete-allocation?id=" + id,
		type : "GET",
		cache : false,
		dataType : "html",
		success : function(data) {
			var obj = JSON.parse(data);
			if (obj.status == "Success") {
				//
				// renderAllocationList(sub_task)
				//
				// var m_id = $("#m_id").val();
				// renderEarnValue(m_id);
				window.location.reload();
			}
			if (obj.status == "Fail") {
				alert("No hay registros disponibles...");
			}
		}
	});

}

function renderDeleteExternalAllocation() {
	var _this = $(this);
	var id = _this.attr("id").split("_")[1];
	var sub_task = $("#sub_task_id").val();
	$.ajax({
		url : "/delete-external-allocation?id=" + id,
		type : "GET",
		cache : false,
		dataType : "html",
		success : function(data) {
			var obj = JSON.parse(data);
			if (obj.status == "Success") {

				// renderAllocationList(sub_task)
				//
				// var m_id = $("#m_id").val();
				// renderEarnValue(m_id);
				window.location.reload();
			}
			if (obj.status == "Fail") {
				alert("No hay registros disponibles...");
			}
		}
	});

}

function renderEditAssignSubTask() {
	var _this = $(this);

	var id = _this.attr("id").split("_")[1];
	var new_value = $("#user_hour_" + id).val();

	$("#user_hour_" + id).addClass("update_date");
	$("#user_hour_" + id).removeAttr("readonly");
	$("#user_hour_" + id).focus();
	$("#s_" + id).addClass("edit_assigned_user_save");
	$("#s_" + id).removeClass("edit_assigned_user");

	$("#user_hour_" + id).keypress(function(e) {
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
			alert("Sólo números");
			return false;
		}
	});

	$('.edit_assigned_user_save').on(
			'click',
			function() {
				if (AllTrim(new_value) != "") {

					if (parsefloat(new_value) > 0.0) {
						var nVal = $("#user_hour_" + id).val();

						$.ajax({
							url : "/update-hours?id=" + id + "&hours=" + nVal,
							type : "GET",
							cache : false,
							dataType : "html",
							success : function(data) {

								if (data == "Success") {
									$("#s_" + id).removeClass(
											"edit_assigned_user_save");
									$("#s_" + id)
											.addClass("edit_assigned_user");
									$(".edit_assigned_user").off("click").on(
											"click", renderEditAssignSubTask);

									$("#user_hour_" + id).removeClass(
											"update_date");
									$("#user_hour_" + id).attr('readonly',
											'true');
									$("#user_hour_" + id).unbind();
									$("#user_hour_" + id).focusout();
								}
							}
						});
					}

				}
			});
}

function renderTaskEdit() {
	var _this = $(this);

	var id = _this.attr("id").split("_")[1];
	$
			.ajax({
				url : "/task-edit-fo?id=" + id,
				type : "GET",
				cache : false,
				dataType : "html",
				success : function(data) {
					$("#pop-box").css("position", "absolute");
					$("#pop-box").css("top", "0%");
					$("#pop-box").html(data);
					$("#pop-box").removeClass("display-none");
					$("#pop-box-over").removeClass("display-none");
					$(".leftPanel").css("z-index", "0");
					autocompleteOwnerSearch();
					// //console.log($("#project_start").val() +"
					// "+$("#project_end").val());
					$("#plan_start_date").datepicker(
							{
								buttonImageOnly : true,
								minDate : new Date($("#project_start").val()
										.replace(/-/g, '/')),
								maxDate : new Date($("#project_end").val()
										.replace(/-/g, '/')),
								dateFormat : "dd-mm-yy",
								onSelect : function(d, inst) {
									var dt = $.datepicker.parseDate('dd-mm-yy',
											d);
									$('#plan_end_date').datepicker('option',
											'minDate', dt);
									$('#plan_end_date').datepicker("refresh");
								}
							});

					var new_dt = $.datepicker.parseDate('dd/mm/yy', $(
							"#plan_start_date").val().replace(/-/g, '/'));

					$("#plan_end_date").datepicker(
							{
								buttonImageOnly : true,
								minDate : new_dt,
								maxDate : new Date($("#project_end").val()
										.replace(/-/g, '/')),
								dateFormat : "dd-mm-yy"
							});

					$('#fo-new-task-form')
							.validate(
									{
										errorElement : 'span',
										submitHandler : function(form) {
											saveTaskFo();
										},
										rules : {
											title : {
												required : true,
												maxlength : 60
											},
											description : {
												maxlength : 160
											},
											plan_start_date : {
												required : true,
												truedate : true
											},
											plan_end_date : {
												required : true,
												truedate : true
											},
											plan_time : {
												required : true,
												mynumber : true,
												positiveNumber : true
											}

										},
										messages : {
											title : {
												required : "Por favor ingrese el título.",
												maxlength : "Título debe tener mínimo 4 y máximo de 60 caracteres."
											},
											description : {
												maxlength : "Descripción debe tener como máximo 160 caracteres."
											},
											plan_start_date : {
												required : "Por favor, introduzca la fecha."
											},
											plan_end_date : {
												required : "Por favor, introduzca la fecha."
											},
											milestone_release_date : {
												required : "Por favor, introduzca la fecha."
											},
											plan_time : {
												required : "Por favor, introduzca el valor numérico."
											}

										}
									});

					$(".close-popup-box, .cancel-form").off("click").on(
							"click", renderClosePoup);
					$("#title").focus();

					$("#milestone_status").on("change", renderTaskRemark);
				},
				error : function() {
					alert("Error");
				}
			});
}

function renderTaskRemark() {
	$("#remark").removeClass("display-none");
	$("#remark_field").find("label").css("display", "block");
}
function AllTrim(x) {
	return x.replace(/^\s+|\s+$/gm, '');
}
function renderTaskDetails2() {

	var id = $(this).next().find('.show_tasks_details').attr("id").split("_")[1];

	$("#project_task_list li").each(function() {
		$(this).removeClass("selected-task");
	});
	$(this).parent().addClass("selected-task");
	milestoneId("", id);
}

function renderTaskDetails() {

	var id = $(this).attr("id").split("_")[1];

	$("#project_task_list").find(".show_tasks_details").each(function() {
		$(this).parent().parent().removeClass("selected-task");
	});
	$(this).parent().parent().addClass("selected-task");
	milestoneId("", id);
}

function renderCancelProgram() {
	// window.location.href="/programs"
	$("#pop-box").css("position", "fixed");
	$("#pop-box").css("top", "10%");
	$("#pop-box").html("");
	$("#pop-box").addClass("display-none");
	$("#pop-box-over").addClass("display-none");
	$(".leftPanel").css("z-index", "2");
}

/*
 * function renderValidateProgramCode(){ var _this = $(this); var p_code =
 * _this.val(); var mode = $("#add-new-program-form").attr("action"); var
 * edit_id ="" if(mode=="/add-new-program"){ edit_id = "NA"; }else{ edit_id =
 * $("#add-new-program-form").attr("action").split("/")[2]; }
 * 
 * var url="/validate-program-code?devision="+d_id; $.get(url, function(data) {
 * $("#program_details_management").html(data); }); }
 */

function renderEmployeeList() {
	var _this = $(this);
	var department = _this.val();
	if (department != "") {
		var url = "/employee-list?department=" + department;
		$.get(url, function(data) {
			$("#employeeMap .dash_left_detail_1_main").html(data);
			var items = $("#employeeMap .employee-data");
			var numItems = items.length;
			if (numItems > 0) {
				$('#emp_list_item').css('display', 'block');
				var perPage = 10;
				items.slice(perPage).hide();
				$("#emp_list_item").pagination({
					items : numItems,
					itemsOnPage : perPage,
					cssStyle : "light-theme",
					onPageClick : function(pageNumber) { // this is where the
						// magic happens
						// someone changed page, lets hide/show trs
						// appropriately

						var showFrom = perPage * (pageNumber - 1);
						var showTo = showFrom + perPage;

						items.hide() // first hide everything, then show for
						// the
						// new page
						.slice(showFrom, showTo).show();

					}
				});

				// $("#program").on("change", renderProjectBarChart);
			} else if (numItems === 0) {
				$('#emp_list_item').css('display', 'none');
			}
		});
	} else {
		renderBarChart("NA", "NA");
	}
}
function renderProgramList() {
	var _this = $(this);
	$(".loader").css("display", "block");
	var division = _this.val();
	if (division != "NA") {
		var url = "/get-program-list?division=" + division;
		$.get(url, function(data) {
			$("#program").html(data);
			renderBarChart("division", division);

			// $("#program").on("change", renderProjectBarChart);
		});

	} else {
		renderBarChart("NA", "NA");
	}
	$("#program").html("");
	// $("#program").val("NA");
	$("#program").next().find(".customStyleSelectBoxInner").html(
			"--Select Program--");

	$(".loader").css("display", "none");
}

function renderProjectList() {
	var _this = $(this);
	$(".loader").css("display", "block");
	var program_id = _this.val();

	if (program_id != "NA" && program_id != "") {

		var url = "/get-project-list?programid=" + program_id;
		$.get(url, function(data) {
			$("#project").html(data);
			$("#project").next().find(".customStyleSelectBoxInner").html(
					"--Select Project--");
			renderBarChart("program", program_id);

			$("#project").on("change", renderProjectBarChart);
			$("select #program").prop('selectedIndex', -1);

		});
	} else {
		var division = $("#division").val();
		if (division != "NA") {
			renderBarChart("division", division);
		} else {
			renderBarChart("NA", "NA");
		}

	}
	$(".loader").css("display", "none");
}

function renderPieChart() {
	// pie-timesheet
	url = "/pie-timesheet?t=" + Date.now();
	$.get(url, function(data) {

		var obj = JSON.parse(data);

		if (obj.length > 0) {

			plot2 = jQuery.jqplot('dashboard-pie-chart', [ [
					[ 'Project Related Work', obj[0].project ],
					[ 'Meetings', obj[0].npMeetings ],
					[ 'Trainings', obj[0].npTraining ],
					[ 'Non-billable Projects', obj[0].npNonBill ],
					[ 'Leaves', obj[0].npLeave ],
					[ 'BAU Run Support', obj[0].npBAU ] ] ], {
				title : ' ',
				seriesDefaults : {
					shadow : false,
					renderer : jQuery.jqplot.PieRenderer,
					rendererOptions : {
						startAngle : 180,
						sliceMargin : 0,
						showDataLabels : true,
						lineWidth : 5
					}
				},
				grid : {
					borderColor : 'transparent',
					shadow : false,
					drawBorder : false,
					shadowColor : 'transparent'
				},
				seriesColors : [ '#F70C1F', "#0C9620", '#EBF22E', '#96F7C0',
						"#09E9F9", '#F7C640' ],
				legend : {
					show : true,
					location : 'e'
				}
			});
			var count = 0;
			$('#dashboard-pie-chart').find('.jqplot-data-label').each(
					function() {
						if (count != 0) {
							$(this).css("color", "#000");
						}
						count++;
					});

		}
	});

}

function renderProjectBarChart() {
	var _this = $(this);
	var project_id = _this.val();
	if (project_id != "") {
		renderBarChart("project", project_id);
	} else {
		var pr = $("#program").val();
		renderBarChart("program", pr);
	}
}

function renderBarChart(mode, id) {

	var objAray = [];
	var objArrayStaff = [];
	var objArrayContract = [];
	var objArraySW = [];
	var objArrayHW = [];
	var objProject = [];
	var objSpent = [];
	var url = ""

	url = "/bar-finance?mode=" + mode + "&id=" + id + "&t=" + Date.now();
	$.get(url, function(data) {

		var obj = JSON.parse(data);
		if (obj.length > 0) {
			$("#chart1").html("");
			$(obj).each(function(index, item) {

				objArrayStaff.push(item.staff);
				objArrayContract.push(item.contractor);
				objArraySW.push(item.sw);
				objArrayHW.push(item.hw);
				objProject.push(item.project);
				objSpent.push(item.spent);

			});

			// console.log(objArrayStaff);
			// console.log(objArrayContract);
			// console.log(objArraySW);
			// console.log(objArrayHW);

			var s1 = [ 30000, 40000, 10000, 5000 ];
			var s2 = [ 20000, 20000, 200, 20000 ];
			var s3 = [ 350, 600, 350, 450 ];
			var s4 = [ 250, 250, 300, 300 ];

			// Can specify a custom tick Array.
			// Ticks should match up one for each y value (category) in the
			// series.
			var ticks = objProject;

			var plot1 = $.jqplot('chart1', [ objArrayStaff, objArrayContract,
					objArraySW, objArrayHW, objSpent ], {
				// The "seriesDefaults" option is an options object that will
				// be applied to all series in the chart.
				seriesColors : [ '#F7C640', '#3BCC3D', '#7F7E7B', '#4EAAED',
						'#F70C1F' ],
				seriesDefaults : {
					renderer : $.jqplot.BarRenderer,
					rendererOptions : {
						fillToZero : true,
						barPadding : 0,
						barWidth : 15
					}
				},
				// Custom labels for the series are specified with the "label"
				// option on the series option. Here a series option object
				// is specified for each series.
				series : [ {
					label : 'Budget for Staff'
				}, {
					label : 'Budget for Contractor'
				}, {
					label : 'Budget for Software'
				}, {
					label : 'Budget for Hardware'
				}, {
					label : 'Actual Budget Spent'
				}

				],
				// Show the legend and put it outside the grid, but inside the
				// plot container, shrinking the grid to accomodate the legend.
				// A value of "outside" would not shrink the grid and allow
				// the legend to overflow the container.
				legend : {
					show : true,
					placement : 'outside',
					background : 'white',
					textColor : 'black',
					fontFamily : 'Times New Roman',
					border : '5px solid black'
				},
				grid : {
					drawGridLines : true, // wether to draw lines across the
					// grid or not.
					gridLineColor : '#F4F6F7', // CSS color spec of the grid
					// lines.
					background : '#fff',
					shadow : false,
					borderWidth : 0
				},
				axes : {
					// Use a category axis on the x axis and use our custom
					// ticks.
					xaxis : {
						renderer : $.jqplot.CategoryAxisRenderer,
						ticks : ticks,
						autoscale : false,
						labelRenderer : $.jqplot.CanvasAxisLabelRenderer,
						tickRenderer : $.jqplot.CanvasAxisTickRenderer,
						tickOptions : {
							angle : 30,
							fontSize : '9pt'
						}
					},
					// Pad the y axis just a little so bars can get close to,
					// but
					// not touch, the grid boundaries. 1.2 is the default
					// padding.
					yaxis : {
						pad : 1.05,
						min : 0,
						tickOptions : {
							formatString : '$%d'
						}
					}
				}
			});
		} else {
			$("#chart1").html(
					"<span class='no-graph'>No Records Available...</span>");
		}
	});

}

function renderTimeSheetGraph() {
	var objArrayUser = [];
	var objArrayNP = [];
	var objArrayP = [];
	var url = ""

	url = "/bar-timesheet?&t=" + Date.now();
	$.get(url, function(data) {

		var obj = JSON.parse(data);
		if (obj.length > 0) {
			$(obj).each(function(index, item) {

				objArrayNP.push(item.nonProject);
				objArrayP.push(item.project);
				objArrayUser.push(item.user);

			});

			// console.log(objArrayStaff);
			// console.log(objArrayContract);
			// console.log(objArraySW);
			// console.log(objArrayHW);

			var s1 = [ 30000, 40000, 10000, 5000 ];
			var s2 = [ 20000, 20000, 200, 20000 ];
			var s3 = [ 350, 600, 350, 450 ];
			var s4 = [ 250, 250, 300, 300 ];

			// Can specify a custom tick Array.
			// Ticks should match up one for each y value (category) in the
			// series.
			var ticks = objArrayUser;
			$("#dashboard-timesheet").html("");
			var plot1 = $.jqplot('dashboard-timesheet',
					[ objArrayNP, objArrayP ], {
						// The "seriesDefaults" option is an options object that
						// will
						// be applied to all series in the chart.
						seriesColors : [ '#F21515', '#363CED' ],
						seriesDefaults : {
							renderer : $.jqplot.BarRenderer,
							rendererOptions : {
								fillToZero : true,
								barPadding : 0,
								barWidth : 15

							}
						},
						// Custom labels for the series are specified with the
						// "label"
						// option on the series option. Here a series option
						// object
						// is specified for each series.
						series : [ {
							label : 'Non Project Activity'
						}, {
							label : 'Project Activity'
						}

						],
						// Show the legend and put it outside the grid, but
						// inside the
						// plot container, shrinking the grid to accomodate the
						// legend.
						// A value of "outside" would not shrink the grid and
						// allow
						// the legend to overflow the container.
						legend : {
							show : true,
							placement : 'outside'
						},
						grid : {
							drawGridLines : true, // wether to draw lines
							// across the grid or not.
							background : '#fff',
							shadow : false,
							gridLineColor : '#F4F6F7',
							borderWidth : 0
						},
						axes : {
							// Use a category axis on the x axis and use our
							// custom ticks.
							xaxis : {
								renderer : $.jqplot.CategoryAxisRenderer,
								ticks : ticks
							},
							// Pad the y axis just a little so bars can get
							// close to, but
							// not touch, the grid boundaries. 1.2 is the
							// default padding.
							yaxis : {
								pad : 1.05,
								tickOptions : {
									formatString : '%d'
								}
							}
						}
					});
		}
	});

}
function renderTimeSheetPerProjectTime() {
	var _this = $(this);
	var fromDate = $("#from_date").val();
	var toDate = $("#to_date").val();
	renderTimeSheetPerProject(fromDate, toDate)
}

function renderTimeSheetPerProject(fromDate, toDate) {
	var objArrayProject = [];
	var objArrayHours = [];
	var url = ""
	if (fromDate == "" && toDate == "") {
		url = "/bar-timesheet-projects?from=NA&to=NA&t=" + Date.now();
	} else {
		url = "/bar-timesheet-projects?from=" + fromDate + "&to=" + toDate
				+ "&t=" + Date.now();
	}
	// url = "/bar-timesheet-projects";
	$
			.get(
					url,
					function(data) {

						var obj = JSON.parse(data);
						if (obj.length > 0) {
							$(obj).each(function(index, item) {

								objArrayProject.push(item.project);
								objArrayHours.push(item.hours);

							});

							// console.log(objArrayStaff);
							// console.log(objArrayContract);
							// console.log(objArraySW);
							// console.log(objArrayHW);

							var s1 = [ 30000, 40000, 10000, 5000 ];
							var s2 = [ 20000, 20000, 200, 20000 ];
							var s3 = [ 350, 600, 350, 450 ];
							var s4 = [ 250, 250, 300, 300 ];

							// Can specify a custom tick Array.
							// Ticks should match up one for each y value
							// (category) in the
							// series.
							var ticks = objArrayProject;
							$("#dashboard-timesheet-project").html("");
							var plot1 = $
									.jqplot(
											'dashboard-timesheet-project',
											[ objArrayHours ],
											{
												// The "seriesDefaults" option
												// is an options object that
												// will
												// be applied to all series in
												// the chart.
												seriesColors : [ '#37EF3A' ],
												seriesDefaults : {
													renderer : $.jqplot.BarRenderer,
													rendererOptions : {
														fillToZero : true,
														barPadding : 0,
														barWidth : 15

													}
												},
												// Custom labels for the series
												// are specified with the
												// "label"
												// option on the series option.
												// Here a series option
												// object
												// is specified for each series.
												series : [ {
													label : 'Hours Per Project',
													pointLabels : {
														ypadding : 5
													}
												}

												],
												// Show the legend and put it
												// outside the grid, but
												// inside the
												// plot container, shrinking the
												// grid to accomodate the
												// legend.
												// A value of "outside" would
												// not shrink the grid and
												// allow
												// the legend to overflow the
												// container.
												legend : {
													show : true,
													placement : 'outside'
												},
												grid : {
													drawGridLines : true, // wether
													// to
													// draw
													// lines
													// across the grid or not.
													background : '#fff',
													shadow : false,
													gridLineColor : '#F4F6F7',
													borderWidth : 0
												},
												axes : {
													// Use a category axis on
													// the x axis and use our
													// custom ticks.
													xaxis : {
														autoscale : true,
														renderer : $.jqplot.CategoryAxisRenderer,
														ticks : ticks,
														labelRenderer : $.jqplot.CanvasAxisLabelRenderer,
														tickRenderer : $.jqplot.CanvasAxisTickRenderer,
														tickOptions : {
															angle : 45,
															fontSize : '9pt'
														}

													},
													// Pad the y axis just a
													// little so bars can get
													// close to, but
													// not touch, the grid
													// boundaries. 1.2 is the
													// default padding.
													yaxis : {
														pad : 1.05,
														min : 0,
														tickOptions : {
															formatString : '%d'
														}
													}
												}
											});
						} else {
							$("#dashboard-timesheet-project").html(
									"No Records Available...");
						}
					});

}

function renderDivisionBarChart() {

	var objAray = [];
	var objArrayStaff = [];
	var objArrayContract = [];
	var objArraySW = [];
	var objArrayHW = [];
	var objProject = [];
	var objSpent = [];
	var url = ""

	url = "/bar-division-finace?t=" + Date.now();
	$.get(url, function(data) {

		var obj = JSON.parse(data);
		if (obj.length > 0) {
			$(obj).each(function(index, item) {

				objArrayStaff.push(item.staff);
				objArrayContract.push(item.contractor);
				objArraySW.push(item.sw);
				objArrayHW.push(item.hw);
				objProject.push(item.division);
				objSpent.push(item.spent);

			});

			// console.log(objArrayStaff);
			// console.log(objArrayContract);
			// console.log(objArraySW);
			// console.log(objArrayHW);

			var s1 = [ 30000, 40000, 10000, 5000 ];
			var s2 = [ 20000, 20000, 200, 20000 ];
			var s3 = [ 350, 600, 350, 450 ];
			var s4 = [ 250, 250, 300, 300 ];

			// Can specify a custom tick Array.
			// Ticks should match up one for each y value (category) in the
			// series.
			var ticks = objProject;
			$("#chart1").html("");
			var plot1 = $.jqplot('division-finance', [ objArrayStaff,
					objArrayContract, objArraySW, objArrayHW, objSpent ], {
				// The "seriesDefaults" option is an options object that will
				// be applied to all series in the chart.
				seriesColors : [ '#F7C640', '#3BCC3D', '#7F7E7B', '#4EAAED',
						'#F70C1F' ],
				seriesDefaults : {
					renderer : $.jqplot.BarRenderer,
					rendererOptions : {
						fillToZero : true,
						barPadding : 0,
						barWidth : 15

					}
				},
				// Custom labels for the series are specified with the "label"
				// option on the series option. Here a series option object
				// is specified for each series.
				series : [ {
					label : 'Budget for Staff'
				}, {
					label : 'Budget for Contractor'
				}, {
					label : 'Budget for Software'
				}, {
					label : 'Budget for Hardware'
				}, {
					label : 'Actual Budget Spent'
				}

				],
				// Show the legend and put it outside the grid, but inside the
				// plot container, shrinking the grid to accomodate the legend.
				// A value of "outside" would not shrink the grid and allow
				// the legend to overflow the container.
				legend : {
					show : true,
					placement : 'outside'
				},
				grid : {
					drawGridLines : true, // wether to draw lines across the
					// grid or not.
					background : '#fff',
					shadow : false,
					gridLineColor : '#F4F6F7',
					borderWidth : 0
				},
				axes : {
					// Use a category axis on the x axis and use our custom
					// ticks.
					xaxis : {
						renderer : $.jqplot.CategoryAxisRenderer,
						ticks : ticks
					},
					// Pad the y axis just a little so bars can get close to,
					// but
					// not touch, the grid boundaries. 1.2 is the default
					// padding.
					yaxis : {
						pad : 1.05,
						min : 0,
						tickOptions : {
							formatString : '$%d'
						}
					}
				}
			});
		}
	});

}

function clearSubTasks() {
	$("#teamhistory").html("");
}

function renderGanttChart() {
	var url = "/task-gantt-chart?id=" + $("#project_id").val() + "&t="
			+ Date.now();
	$(".loader").css("display", "block");
	$.post(url, function(data) {
		var mainString = ""
		var obj = JSON.parse(data);
		// console.log(obj);
		// $("#flot-placeholder").html("");
		// $("#teamhistory").html("");
		// alert(obj.length);
		if (obj.length > 0) {
			$("#task-gantt").gantt({
				source : obj,
				navigate : "scroll",
				scale : "days",
				maxScale : "months",
				minScale : "days",
				itemsPerPage : 5,
				waitText : "Please Wait...",
				'scrollToToday' : true,
				onItemClick : function(data) {
					var taskId = data;
					// getTaskDetails(taskId);
				},
				onAddClick : function(dt, rowId) {
					// alert("Empty space clicked - add an item!"+);
				},
				onRender : function() {

					if (window.console && typeof console.log === "function") {
						// console.log("chart rendered");
						var count = 0;
						$('.leftPanel').find('.fn-label').each(function() {
							// $("#"+$(this).attr('id')).removeClass("selected-task");
							if (count == 0) {
								// console.log($(this).attr('id'));
								// $("#"+$(this).attr('id')).trigger("click");
							}
							count++;

						});

					}

					if (isIE() == 8) {
						var count = 0;
						$('.leftPanel').find('.fn-label').each(function() {
							// $("#"+$(this).attr('id')).removeClass("selected-task");
							if (count == 0) {
								// console.log($(this).attr('id'));
								// $("#"+$(this).attr('id')).trigger("click");
							}
							count++;

						});
					}
				}

			});

			// var offset = $("#flot-placeholder").offset();
			// var h = parseInt($("#flot-placeholder").height())-60;

			// $("#flot-placeholder").css("height",h+"px");
			$("#task-ganttr").css("margin-top", "10px");
			// $("#task-gantt").css("margin-bottom","-25px");

		} else {
			// $("#task-gantt").css("height","0px");
			// $("#task-gantt").css("margin-top","10px");
		}
	});

}

function getRenderGanttChart(itemsOnSinglePage) {
	var url = "/task-gantt-chart?id=" + $("#project_id").val() + "&t="
			+ Date.now();
	$(".loader").css("display", "block");
	$.post(url, function(data) {
		var mainString = ""
		var obj = JSON.parse(data);
		// console.log(obj);
		// $("#flot-placeholder").html("");
		// $("#teamhistory").html("");
		// alert(obj.length);
		if (obj.length > 0) {
			$("#task-gantt").gantt({
				source : obj,
				navigate : "scroll",
				scale : "days",
				maxScale : "months",
				minScale : "days",
				itemsPerPage : itemsOnSinglePage,
				waitText : "Please Wait...",
				'scrollToToday' : true,
				onItemClick : function(data) {
					var taskId = data;
					// getTaskDetails(taskId);
				},
				onAddClick : function(dt, rowId) {
					// alert("Empty space clicked - add an item!"+);
				},
				onRender : function() {

					if (window.console && typeof console.log === "function") {
						// console.log("chart rendered");
						var count = 0;
						$('.leftPanel').find('.fn-label').each(function() {
							// $("#"+$(this).attr('id')).removeClass("selected-task");
							if (count == 0) {
								// console.log($(this).attr('id'));
								// $("#"+$(this).attr('id')).trigger("click");
							}
							count++;

						});

					}

					if (isIE() == 8) {
						var count = 0;
						$('.leftPanel').find('.fn-label').each(function() {
							// $("#"+$(this).attr('id')).removeClass("selected-task");
							if (count == 0) {
								// console.log($(this).attr('id'));
								// $("#"+$(this).attr('id')).trigger("click");
							}
							count++;

						});
					}
				}

			});

	
			// var offset = $("#flot-placeholder").offset();
			// var h = parseInt($("#flot-placeholder").height())-60;

			// $("#flot-placeholder").css("height",h+"px");
			$("#task-ganttr").css("margin-top", "10px");
			// $("#task-gantt").css("margin-bottom","-25px");

		} else {
			// $("#task-gantt").css("height","0px");
			// $("#task-gantt").css("margin-top","10px");
		}
	});

}
function renderProjectGanttChart() {
	var url = "/project-gantt-chart?id=" + $("#program").val();
	$(".loader").css("display", "block");
	$.post(url, function(data) {
		var mainString = ""
		var obj = JSON.parse(data);
		// console.log(obj);
		// $("#flot-placeholder").html("");
		// $("#teamhistory").html("");
		// alert(obj.length);
		if (obj.length > 0) {
			$("#project-gantt").gantt({
				source : obj,
				navigate : "scroll",
				scale : "days",
				maxScale : "months",
				minScale : "days",
				itemsPerPage : 10,
				waitText : "Please Wait...",
				'scrollToToday' : true,
				onItemClick : function(data) {

					var taskId = data;
					// getTaskDetails(taskId);
				},
				onAddClick : function(dt, rowId) {
					// alert("Empty space clicked - add an item!"+);
				},
				onRender : function() {

					if (window.console && typeof console.log === "function") {
						// console.log("chart rendered");
						var count = 0;
						$('.leftPanel').find('.fn-label').each(function() {
							// $("#"+$(this).attr('id')).removeClass("selected-task");
							if (count == 0) {
								// console.log($(this).attr('id'));
								// $("#"+$(this).attr('id')).trigger("click");
							}
							count++;

						});

					}

					if (isIE() == 8) {
						var count = 0;
						$('.leftPanel').find('.fn-label').each(function() {
							// $("#"+$(this).attr('id')).removeClass("selected-task");
							if (count == 0) {
								// console.log($(this).attr('id'));
								// $("#"+$(this).attr('id')).trigger("click");
							}
							count++;

						});
					}
				}

			});

			// var offset = $("#flot-placeholder").offset();
			// var h = parseInt($("#flot-placeholder").height())-60;

			// $("#flot-placeholder").css("height",h+"px");
			$("#task-ganttr").css("margin-top", "10px");
			// $("#task-gantt").css("margin-bottom","-25px");

		} else {
			// $("#task-gantt").css("height","0px");
			// $("#task-gantt").css("margin-top","10px");
		}
		$(".loader").css("display", "none");
	});

}

function getMilestoneDetails(id) {
	var url = window.location.href;
	var withOutParametters = url.split('/')[3];
	if (withOutParametters == "program-details") {
		window.location.href = "/project-details/" + id
	}
	if (withOutParametters == "project-details") {
		window.location.href = "/project-task-details/" + id
	}

}

function renderUpdateProfile() {
	var url = jQuery("#myemployeeUpdate").attr("action");

	$.ajax({
		url : url,
		type : "POST",
		cache : false,
		data : $("#myemployeeUpdate").serialize(),
		dataType : "html",
		success : function(data) {
			// alert(data);
		}
	});

}

function renderEarnValue(id) {

	var url = "/earn-value?id=" + id + "&t=" + Date.now();
	$(".loader").css("display", "block");

	$.get(url, function(data) {

		var mainString = ""
		var obj = JSON.parse(data);

		if (obj.EV) {
			$("#ev").html(obj.EV);
			$("#pv").html(obj.PV);
			$("#pai").html(obj.PAI);
			$("#ac").html(obj.AC);
			$("#spi").html(obj.SPI);
			$("#cpi").html(obj.CPI);
			$("#eac").html(obj.EAC);
			$("#etc").html(obj.ETC);
			$("#pae").html(obj.PAE);
			$("#hp").html(obj.HP);
			$("#ha").html(obj.HA);
		} else {
			$("#subtask-details").addClass("display-none");
		}

	});
	var delay = 200;
	setTimeout(function() {
		$(".loader").css("display", "none");
	}, delay);
}

function renderEarnValuepro(id) {

	var url = "/earn-value-pro?id=" + id + "&t=" + Date.now();
	$(".loader").css("display", "block");

	$.get(url, function(data) {

		var mainString = ""
		var obj = JSON.parse(data);

		if (obj.EV) {
			//$("#ev2").html(obj.EV);
			$("#pv2").html(obj.PV);
			//$("#pai2").html(obj.PAI);
			//$("#ac2").html(obj.AC);
			$("#spi2").html(obj.SPI);
			//$("#cpi2").html(obj.CPI);
			//$("#eac2").html(obj.EAC);
			//$("#etc2").html(obj.ETC);
			$("#pae2").html(obj.PAE);
			//$("#hp2").html(obj.HP);
			//$("#ha2").html(obj.HA);
		} else {
			$("#subtask-details").addClass("display-none");
		}

	});
	var delay = 200;
	setTimeout(function() {
		$(".loader").css("display", "none");
	}, delay);
}

function renderPae(id) {

	var url = "/find-pae?id=" + id + "&t=" + Date.now();
	$(".loader").css("display", "block");

	$.get(url, function(data) {

		var mainString = ""
		var obj = JSON.parse(data);

		if (obj.EV) {
			//$("#ev").html(obj.EV);
			//$("#pv").html(obj.PV);
			//$("#pai").html(obj.PAI);
			//$("#ac").html(obj.AC);
			$("#elspi").html(obj.SPI);
			$("#elcpi").html(obj.CPI);
			//$("#eac").html(obj.EAC);
			//$("#etc").html(obj.ETC);
			$("#elpae").html(obj.PAE);
			//$("#hp").html(obj.HP);
			//$("#ha").html(obj.HA);
		} else {
			$("#subtask-details").addClass("display-none");
		}

	});
	var delay = 200;
	setTimeout(function() {
		$(".loader").css("display", "none");
	}, delay);
}



function rederOnloadTaskDependence() {
	var _this = $("#task_depend").val();

	if (_this != "") {
		var dType = parseInt($("#dependencies_type").val());
		var maxD = $("#project_end").val().replace(/-/g, '/');
		var id = _this;
		var url = "/task-dependency?id=" + id;
		$.get(url, function(data) {
			var mainString = ""
			var obj = JSON.parse(data);

			switch (dType) {
			case 1:// finish-start
				$("#plan_start_date").datepicker("destroy");
				$("#plan_end_date").datepicker("destroy");
				// $('#plan_start_date').datepicker('option', 'minValue',
				// obj.start.replace(/-/g, '/'));
				var maxD = $("#project_end").val().replace(/-/g, '/');
				var minD = obj.end.replace(/-/g, '/');
				// alert( new Date(obj.start.replace(/-/g, '/'))+ " - "+new
				// Date(obj.end.replace(/-/g, '/')));
				$("#plan_start_date").datepicker(
						{
							buttonImageOnly : true,
							minDate : new Date(minD),
							maxDate : new Date(maxD),
							dateFormat : "dd-mm-yy",
							changeMonth : true,
							changeYear : true,
							onSelect : function(d, inst) {
								var dt = $.datepicker.parseDate('dd-mm-yy', d);
								$('#plan_end_date').datepicker('option',
										'minDate', dt);
								$('#plan_end_date').datepicker("refresh");
							}
						});

				$("#plan_end_date").datepicker({
					buttonImageOnly : true,
					changeMonth : true,
					changeYear : true,
					minDate : new Date(minD),
					maxDate : new Date(maxD),
					dateFormat : "dd-mm-yy"
				});

				// $('#date').datepicker('option', 'maxValue', new
				// Date(obj.end));
				break;
			case 2:// start-start
				$("#plan_start_date").datepicker("destroy");
				$("#plan_end_date").datepicker("destroy");
				// alert( new Date(obj.start.replace(/-/g, '/'))+ " - "+new
				// Date(obj.end.replace(/-/g, '/')))
				// var min = $("#project_start").val().replace(/-/g, '/');
				var minD = obj.start.replace(/-/g, '/');
				var maxD = $("#project_end").val().replace(/-/g, '/');
				// alert( new Date(minD)+ " - "+new Date(maxD));
				$("#plan_start_date").datepicker(
						{
							buttonImageOnly : true,
							minDate : new Date(minD),
							maxDate : new Date(maxD),
							dateFormat : "dd-mm-yy",
							changeMonth : true,
							changeYear : true,
							onSelect : function(d, inst) {
								var dt = $.datepicker.parseDate('dd-mm-yy', d);
								$('#plan_end_date').datepicker('option',
										'minDate', dt);
								$('#plan_end_date').datepicker("refresh");
							}
						});

				$("#plan_end_date").datepicker({
					buttonImageOnly : true,
					changeMonth : true,
					changeYear : true,
					minDate : new Date(minD),
					maxDate : new Date(maxD),
					dateFormat : "dd-mm-yy"
				});
				break;
			case 3:// start-finish

				$("#plan_start_date").datepicker("destroy");
				$("#plan_end_date").datepicker("destroy");
				// alert( new Date(obj.start.replace(/-/g, '/'))+ " - "+new
				// Date(obj.end.replace(/-/g, '/')))
				var minD = $("#project_start").val().replace(/-/g, '/');
				var maxD = obj.start.replace(/-/g, '/');
				// alert( new Date(minD)+ " - "+new Date(maxD));
				// var maxD = obj.end.replace(/-/g, '/');
				$("#plan_start_date").datepicker(
						{
							buttonImageOnly : true,
							minDate : new Date(minD),
							maxDate : new Date(maxD),
							dateFormat : "dd-mm-yy",
							changeMonth : true,
							changeYear : true,
							onSelect : function(d, inst) {
								var dt = $.datepicker.parseDate('dd-mm-yy', d);
								$('#plan_end_date').datepicker('option',
										'minDate', dt);
								$('#plan_end_date').datepicker("refresh");
							}
						});

				$("#plan_end_date").datepicker({
					buttonImageOnly : true,
					changeMonth : true,
					changeYear : true,
					minDate : new Date(minD),
					maxDate : new Date(maxD),
					dateFormat : "dd-mm-yy"
				});
				break;
			case 4:// finish-finish
				// alert( new Date(obj.start.replace(/-/g, '/'))+ " - "+new
				// Date(obj.end.replace(/-/g, '/')))
				$("#plan_start_date").datepicker("destroy");
				$("#plan_end_date").datepicker("destroy");
				var minD = $("#project_start").val().replace(/-/g, '/');
				var maxD = obj.end.replace(/-/g, '/');
				// alert( new Date(minD)+ " - "+new Date(maxD));
				$("#plan_start_date").datepicker(
						{
							buttonImageOnly : true,
							minDate : new Date(minD),
							maxDate : new Date(maxD),
							dateFormat : "dd-mm-yy",
							changeMonth : true,
							changeYear : true,
							onSelect : function(d, inst) {
								var dt = $.datepicker.parseDate('dd-mm-yy', d);
								$('#plan_end_date').datepicker('option',
										'minDate', dt);
								$('#plan_end_date').datepicker("refresh");
							}
						});
				$("#plan_end_date").datepicker({
					buttonImageOnly : true,
					changeMonth : true,
					changeYear : true,
					minDate : new Date(minD),
					maxDate : new Date(maxD),
					dateFormat : "dd-mm-yy"
				});

			}

		});
	}

}

function rederTaskDependency() {
	var project_id = $("#pId").val();
	var selected_task = $("#task_depend").val();
	var url = "/get-tasks?project_id=" + project_id + "&selected_task="
			+ selected_task + "&t=" + Date.now();
	$.get(url, function(data) {
		$("#pop-box").html(data);
		$("#pop-box").removeClass("display-none");
		$("#pop-box-over").removeClass("display-none");
		$(".add-task-depend").on("click", renderAddTaskDepends);
		$(".done-task-selection").on("click", renderDoneSelection);
		$(".close-popup-box").on("click", renderClosePoup);
		$("#myTasks").val($("#task_depend").val());
		renderDependencyTaskList();
		$(".multiselect").multiselect();

	});
}

function rederEditTaskDependency() {
	var project_id = $("#pId").val();

	var selectd_task = $("#task_depend").val();
	var task_id = $("#task_id").val();
	var dType = parseInt($("#dependencies_type").val());
	// console.log(task_id+" "+project_id+" "+selectd_task)
	var url = "/get-edit-tasks?predessor_task=" + task_id + "&project_id="
			+ project_id + "&tasks=" + selectd_task + "&t=" + Date.now();
	$.get(url, function(data) {
		$("#pop-box").html(data);
		$("#pop-box").removeClass("display-none");
		$("#pop-box-over").removeClass("display-none");
		$("#myTasks").val(selectd_task);
		renderDependencyTaskList();
		$(".add-task-depend").on("click", renderAddTaskDepends);
		$(".done-task-selection").on("click", renderDoneSelection);
		$(".close-popup-box").on("click", renderClosePoup);
		$("#task_id").val(task_id);
		$(".multiselect").multiselect();

	});
}

function renderDependencyTaskList() {
	var tasks = $("#myTasks").val();
	var ids = tasks.split(",");
	for (i = 0; i < ids.length; i++) {
		var newId = $("#multiselect_" + AllTrim(ids[i]))
		newId.addClass("multiselect-on");
		newId.find("input:checkbox").attr("checked", true);
	}
	/*
	 * var task_id= $("#task_id").val(); var
	 * url="/get-dependent-tasks-list?tasks="+tasks+"&t="+ Date.now();;
	 * $.get(url, function(data) { $(".dependency-task-list").append(data); });
	 */

}

jQuery.fn.multiselect = function() {
	$(this).each(function() {
		var _this = $(this);

		var checkboxes = $(this).find("input:checkbox");
		var select_tasks = ""
		checkboxes.each(function() {
			var checkbox = $(this);

			// Highlight pre-selected checkboxes
			if (checkbox.prop("checked"))
				checkbox.parent().addClass("multiselect-on");

			// Highlight checkboxes that the user selects
			checkbox.click(function() {
				if (checkbox.prop("checked"))
					checkbox.parent().addClass("multiselect-on");
				else
					checkbox.parent().removeClass("multiselect-on");

				renderDepedentTask(_this.attr("id"))

			});
		});

	});
};

function renderDepedentTask(id) {
	var newId = id.split("_")[1]
	var _this = $("#depends-task-list")
	var checkboxes = $(_this).find("input:checkbox");
	var select_tasks = ""
	checkboxes.each(function() {
		var checkbox = $(this);
		// alert($(this).val())
		if (checkbox.prop("checked")) {
			if (select_tasks == "") {
				select_tasks = checkbox.val();
			} else {
				select_tasks = select_tasks + ", " + checkbox.val()
			}

		}

	});
	// alert(select_tasks);
	$("#myTasks").val(select_tasks);
	// alert($("#selected_task_dependency_"+newId).val() +"-----"+newId);
}

function rederSubTaskDependency() {
	var task_id = $("#task_id").val();
	var selected_sub_task = $("#sub_task_depend").val();
	var dType = parseInt($("#dependencies_type").val());
	var url = "/get-sub-tasks?task_id=" + task_id + "&selected_sub_task="
			+ selected_sub_task + "&t=" + Date.now();
	;
	$.get(url, function(data) {
		$("#pop-box").html(data);
		$("#pop-box").removeClass("display-none");
		$("#pop-box-over").removeClass("display-none");
		$("#myTasks").val(selected_sub_task);
		renderDependencySubTaskList();
		$(".add-task-depend").on("click", renderAddSubTaskDepends);
		$(".done-task-selection").on("click", renderDoneSubTaskSelection);
		$(".close-popup-box").on("click", renderClosePoup);

		$("#project").on("change", renderTasksforDependency)
		$("#task").on("change", renderSubTaskListforDependency)
		$(".multiselect").multiselectSubTask();
		renderSelectedSubTaskList();
	});
}

function rederEditSubTaskDependency() {
	var task_id = $("#task_id").val();
	var selectd_tasks = $("#sub_task_depend").val();
	var predessor_sub_task = $("#sub_task_id").val();
	var url = "/get-edit-sub-tasks?currentSub=" + predessor_sub_task
			+ "&task_id=" + task_id + "&sub_tasks=" + selectd_tasks + "&t="
			+ Date.now();

	$.get(url, function(data) {
		$("#pop-box").html(data);
		$("#pop-box").removeClass("display-none");
		$("#pop-box-over").removeClass("display-none");
		$("#myTasks").val(selectd_tasks);
		renderDependencySubTaskList();
		$(".add-task-depend").on("click", renderAddSubTaskDepends);
		$(".done-task-selection").on("click", renderDoneSubTaskSelection);
		$(".close-popup-box").on("click", renderClosePoup);

		$("#project").on("change", renderTasksforDependency)
		$("#task").on("change", renderSubTaskListforDependency)
		$(".multiselect").multiselectSubTask();
		renderSelectedSubTaskList();
	});
}

jQuery.fn.multiselectSubTask = function() {
	$(this).each(function() {
		var _this = $(this);

		var checkboxes = $(this).find("input:checkbox");
		var select_tasks = ""
		checkboxes.each(function() {
			var checkbox = $(this);

			// Highlight pre-selected checkboxes
			if (checkbox.prop("checked"))
				checkbox.parent().addClass("multiselect-on");

			// Highlight checkboxes that the user selects
			checkbox.click(function() {
				if (checkbox.prop("checked")) {
					checkbox.parent().addClass("multiselect-on");
					renderValidateSubTaskDependency(_this.attr("id"));

				} else {

					checkbox.parent().removeClass("multiselect-on");

					var oldvalues = $("#myTasks").val().split(",");
					var current = AllTrim(_this.attr("id").split("_")[1]);
					var newString = ""
					for (i = 0; i < oldvalues.length; i++) {
						if (AllTrim(oldvalues[i]) != "") {
							var new_id = AllTrim(oldvalues[i]);
							if (new_id != current) {
								if (newString == "") {
									newString = new_id;
								} else {
									newString = newString + "," + new_id;
								}
							}
						}
					}
					$("#myTasks").val(newString);
					renderDependencySubTaskList();
				}

				// renderDepedentTask(_this.attr("id"))

			});
		});
		renderSelectedSubTaskList();
	});
};
function renderValidateSubTaskDependency(id) {
	var new_id = AllTrim(id.split("_")[1]);
	var task_id = $("#task_id").val();
	var current_sub_task = $("#currentSubTask").val();
	var oldvalue = $("#myTasks").val();
	var url = "/validate-sub-task-date?task=" + task_id + "&sub_task=" + new_id
			+ "&current_sub_task=" + current_sub_task + "&selected_sub_tasks="
			+ oldvalue;
	$.get(url, function(data) {
		var obj = JSON.parse(data);
		if (obj.status == "Fail") {
			// $("#multiselect_"+new_id).remove();
			alert(obj.message);
			$("#multiselect_" + new_id).find("label").removeClass(
					"multiselect-on");
			$("#multiselect_" + new_id).find("input:checkbox").attr("checked",
					false);

		} else {
			var isValid = true
			var oldvalues = oldvalue.split(",");
			for (i = 0; i < oldvalues.length; i++) {
				if (AllTrim(oldvalues[i]) != "") {
					var current = AllTrim(oldvalues[i]);
					if (new_id == current) {
						isValid = false
					}
				}
			}
			if (isValid) {
				if (AllTrim(oldvalue) == "") {
					$("#myTasks").val(new_id);
				} else {
					$("#myTasks").val(oldvalue + "," + new_id);
				}
			}

			renderDependencySubTaskList();
			/*
			 * if(e.options[e.selectedIndex].value!=""){ //alert("Sub Task
			 * Selected..."); $(".dependency-task-list").append("<li>"+e.options[e.selectedIndex].text+"</li>");
			 * $(e.options[e.selectedIndex]).remove(); }
			 */
		}
	});

}
function renderSelectedSubTaskList() {
	var currentValues = $("#myTasks").val().split(",");
	// alert(currentValues.length);
	for (i = 0; i < currentValues.length; i++) {
		if (AllTrim(currentValues[i]) != "") {
			var new_id = AllTrim(currentValues[i])
			// alert(new_id)
			// $("#multiselect_" + new_id).remove();
			$("#multiselect_" + new_id).find("label")
					.addClass("multiselect-on");
			$("#multiselect_" + new_id).find("input:checkbox").attr("checked",
					true);
		}
	}

}

function renderAddSubTaskDepends() {
	var e = document.getElementById("subtask");

	var oldvalue = $("#myTasks").val();
	var currentVal = e.options[e.selectedIndex].value;

	/*
	 * if(AllTrim(currentVal)!=""){ var task_id = $("#task_id").val(); var
	 * current_sub_task = $("#currentSubTask").val(); var
	 * url="/validate-sub-task-date?task="+task_id+"&sub_task="+currentVal+"&current_sub_task="+current_sub_task+"&selected_sub_tasks="+oldvalue;
	 * $.get(url, function(data) { var obj = JSON.parse(data);
	 * if(obj.status=="Fail"){ alert(obj.message) }else{ if(AllTrim(oldvalue) ==
	 * ""){ $("#myTasks").val(e.options[e.selectedIndex].value) }else{
	 * $("#myTasks").val(oldvalue+","+e.options[e.selectedIndex].value) }
	 * if(e.options[e.selectedIndex].value!=""){ //alert("Sub Task
	 * Selected..."); $(".dependency-task-list").append("<li>"+e.options[e.selectedIndex].text+"</li>");
	 * $(e.options[e.selectedIndex]).remove(); } } }); }
	 */
}

function renderDependencySubTaskList() {
	var tasks = $("#myTasks").val();
	var task_id = $("#task_id").val();
	if (tasks != "") {
		var url = "/get-dependent-sub-tasks-list?sub_tasks=" + tasks + "&t="
				+ Date.now();
		$.get(url, function(data) {
			$(".dependency-task-list").html(data);
		});
	} else {
		$(".dependency-task-list").html("");
	}

}

function renderAddTaskDepends() {
	var e = document.getElementById("task");
	var oldvalue = $("#myTasks").val();
	var currentVal = e.options[e.selectedIndex].value;
	if (AllTrim(currentVal) != "") {
		if (AllTrim(oldvalue) == "") {
			$("#myTasks").val(e.options[e.selectedIndex].value)
		} else {
			$("#myTasks")
					.val(oldvalue + "," + e.options[e.selectedIndex].value)
		}
		if (e.options[e.selectedIndex].text != "") {
			// alert("Task Selected...");
			$(".dependency-task-list").append(
					"<li>" + e.options[e.selectedIndex].text + "</li>");
			// document.body.removeChild(e.options[e.selectedIndex]);
			// e..remove();
			$(e.options[e.selectedIndex]).remove();

			// e.parentNode.removeChild(e.options[e.selectedIndex]);
			// alert(e.options[e.selectedIndex]);

			// renderDependencySubTaskList();
		}
	}

}

function customDialogBox(message, height, width) {
	$("#dialog-confirm").html("Miembro eliminado del programa"); // /warning

	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Información",
		height : 150,
		width : 300,
		buttons : {
			"Ok" : function() {
				window.location.reload();
				$(this).dialog('close');
				$("#pop-box-over").css("display", "none");
				$("#dialog-confirm").css("display", "none");
			}
		}
	});
}

function callApi(url, data, method, callBack) {
	
	var result;
	jQuery.ajax({
		url : url,
		type : method,
		data : data,
		cache : false,
		success : function(response) {
			callBack(response);
		},
		error : function() {
			result = "failure";
		}
	});
	
	return result;

}

function renderTasksforDependency() {
	var _this = $("#project").val();
	if (_this != "" && _this == "") {
		$("#task").html(
				"<option value='' class='blank'>--- Seleccione tarea ---</option>");
		$("#sub_task")
				.html(
						"<option value='' class='blank'>--- Seleccione subtarea ---</option>");
	} else {
		callApi("/search-task-list?projectId=" + $("#project").val(), null,
				"GET", getTaskListSuccess);
	}
}

function renderSubTaskListforDependency() {
	if ($("#task").val() == "") {
		// $("#sub_task").html("<option value='' class='blank'>--- Choose Sub
		// Task ---</option>");
	} else {
		callApi("/search-dependency-subtask-list?taskId=" + $("#task").val(),
				null, "GET", getDependencySubTaskListSuccess);
	}
}

function getTaskListSuccess(response) {
	$("#task").html(response);
	$("#sub_task").html(
			"<option value='' class='blank'>--- Seleccione subtarea ---</option>");
}
function getSubTaskListSuccess(response) {
	$("#subtask").html(response);
}

function getDependencySubTaskListSuccess(response) {
	$("#subtask").html(response);
	$(".multiselect").multiselectSubTask();
}
function formatDate(input) {
	var datePart = input.match(/\d+/g);
	var day = datePart[2]
	var month = datePart[1]
	var year = datePart[0];
	return day + '-' + month + '-' + year;
}

function removeChilds() {
	document.body.removeChild(document.getElementById('container'));
}
function renderDependencySubTaskDates() {
	var subtasks = $("#myTasks").val();
	var url = "/get-dependent-subtask-dates?sub_tasks=" + subtasks;
	$.get(url, function(data) {
		var obj = JSON.parse(data);
		if (obj.minDate) {

			var maxD = $("#task_end_date").val().replace(/-/g, '/');
			var minD = obj.maxDate.replace(/-/g, '/');
			// alert(minD +" "+maxD);
			$('#planned_start_date').val("");
			$('#planned_end_date').val("");
			$("#planned_start_date").datepicker("destroy");
			$("#planned_end_date").datepicker("destroy");

			alert("Esta subtarea debe ser planificada entre "
					+ formatDate(obj.maxDate) + " y "
					+ formatDate($("#task_end_date").val()))
			$("#planned_start_date").datepicker({
				buttonImageOnly : true,
				minDate : new Date(minD),
				maxDate : new Date(maxD),
				dateFormat : "dd-mm-yy",
				changeMonth : true,
				changeYear : true,
				onSelect : function(d, inst) {
					var dt = $.datepicker.parseDate('dd-mm-yy', d);
					$('#planned_end_date').datepicker('option', 'minDate', dt);
					$('#planned_end_date').datepicker("refresh");
				}
			});

			$("#planned_end_date").datepicker({
				buttonImageOnly : true,
				minDate : new Date(minD),
				maxDate : new Date(maxD),
				dateFormat : "dd-mm-yy",
				changeMonth : true,
				changeYear : true,
			});

		}

	});

}

function renderDependencyTaskDates() {
	var tasks = $("#myTasks").val();
	var url = "/get-dependent-task-dates?tasks=" + tasks;
	$.get(url, function(data) {
		var obj = JSON.parse(data);
		if (obj.minDate) {

			$("#plan_start_date").datepicker("destroy");
			$("#plan_end_date").datepicker("destroy");
			// $('#plan_start_date').datepicker('option', 'minValue',
			// obj.start.replace(/-/g, '/'));
			var maxD = $("#project_end").val().replace(/-/g, '/');
			var minD = obj.maxDate.replace(/-/g, '/');
			$("#plan_start_date").val("");
			$("#plan_end_date").val("");
			// alert("min "+new Date(minD) +" maxD "+new Date(maxD) +" - "+"min
			// "+ minD +" maxD "+ maxD )
			alert("Esta tarea debe ser planificada entre " + formatDate(minD)
					+ " y " + formatDate(maxD))
			// alert( new Date(obj.start.replace(/-/g, '/'))+ " - "+new
			// Date(obj.end.replace(/-/g, '/')));
			$("#plan_start_date").datepicker({
				buttonImageOnly : true,
				minDate : new Date(minD),
				maxDate : new Date(maxD),
				dateFormat : "dd-mm-yy",
				changeMonth : true,
				changeYear : true,
				onSelect : function(d, inst) {
					var dt = $.datepicker.parseDate('dd-mm-yy', d);
					$('#plan_end_date').datepicker('option', 'minDate', dt);
					$('#plan_end_date').datepicker("refresh");
				}
			});

			$("#plan_end_date").datepicker({
				buttonImageOnly : true,
				changeMonth : true,
				changeYear : true,
				minDate : new Date(minD),
				maxDate : new Date(maxD),
				dateFormat : "dd-mm-yy"
			});

		}

		// alert(d.format("dd-MMM-yyyy") );
	});

}

function renderDoneSelection() {
	$("#task_depend").val($("#myTasks").val());
	$("#dependencies_type").val($("#dependency_type").val());

	var typeSelected = $(".type").text();
	switch (typeSelected) {
	case "Select Tasks":
		renderDependencyTaskDates();
		break;
	case "Select Sub Tasks":
		renderDependencySubTaskDates();
		break;
	}

	$("#pop-box").html("");
	$("#pop-box").addClass("display-none");
	$("#pop-box-over").addClass("display-none");

}

function renderDoneSubTaskSelection() {
	$("#sub_task_depend").val($("#myTasks").val());
	var typeSelected = $(".type").text();
	switch (typeSelected) {
	case "Select Tasks":
		renderDependencyTaskDates();
		break;
	case "Select Sub Tasks":
		renderDependencySubTaskDates();
		break;
	}
	$("#pop-box").html("");
	$("#pop-box").addClass("display-none");
	$("#pop-box-over").addClass("display-none");

}

function rederTaskDependence() {
	var _this = $(this);
	var dType = parseInt($("#dependencies_type").val());
	var maxD = $("#project_end").val().replace(/-/g, '/');
	var id = _this.val();
	if (id != "") {
		var url = "/task-dependency?id=" + id;
		$.get(url, function(data) {
			var mainString = ""
			var obj = JSON.parse(data);
			$("#plan_start_date").val("");
			$("#plan_end_date").val("");
			switch (dType) {
			case 1:// finish-start
				$("#plan_start_date").datepicker("destroy");
				$("#plan_end_date").datepicker("destroy");
				// $('#plan_start_date').datepicker('option', 'minValue',
				// obj.start.replace(/-/g, '/'));
				var maxD = $("#project_end").val().replace(/-/g, '/');
				var minD = obj.end.replace(/-/g, '/');
				// alert( new Date(obj.start.replace(/-/g, '/'))+ " - "+new
				// Date(obj.end.replace(/-/g, '/')));
				$("#plan_start_date").datepicker(
						{
							buttonImageOnly : true,
							minDate : new Date(minD),
							maxDate : new Date(maxD),
							dateFormat : "dd-mm-yy",
							changeMonth : true,
							changeYear : true,
							onSelect : function(d, inst) {
								var dt = $.datepicker.parseDate('dd-mm-yy', d);
								$('#plan_end_date').datepicker('option',
										'minDate', dt);
								$('#plan_end_date').datepicker("refresh");
							}
						});

				$("#plan_end_date").datepicker({
					buttonImageOnly : true,
					changeMonth : true,
					changeYear : true,
					minDate : new Date(minD),
					maxDate : new Date(maxD),
					dateFormat : "dd-mm-yy"
				});

				// $('#date').datepicker('option', 'maxValue', new
				// Date(obj.end));
				break;
			case 2:// start-start
				$("#plan_start_date").datepicker("destroy");
				$("#plan_end_date").datepicker("destroy");
				// alert( new Date(obj.start.replace(/-/g, '/'))+ " - "+new
				// Date(obj.end.replace(/-/g, '/')))
				// var min = $("#project_start").val().replace(/-/g, '/');
				var minD = obj.start.replace(/-/g, '/');
				var maxD = $("#project_end").val().replace(/-/g, '/');
				// alert( new Date(minD)+ " - "+new Date(maxD));
				$("#plan_start_date").datepicker(
						{
							buttonImageOnly : true,
							minDate : new Date(minD),
							maxDate : new Date(maxD),
							dateFormat : "dd-mm-yy",
							changeMonth : true,
							changeYear : true,
							onSelect : function(d, inst) {
								var dt = $.datepicker.parseDate('dd-mm-yy', d);
								$('#plan_end_date').datepicker('option',
										'minDate', dt);
								$('#plan_end_date').datepicker("refresh");
							}
						});

				$("#plan_end_date").datepicker({
					buttonImageOnly : true,
					changeMonth : true,
					changeYear : true,
					minDate : new Date(minD),
					maxDate : new Date(maxD),
					dateFormat : "dd-mm-yy"
				});
				break;
			case 3:// start-finish

				$("#plan_start_date").datepicker("destroy");
				$("#plan_end_date").datepicker("destroy");
				// alert( new Date(obj.start.replace(/-/g, '/'))+ " - "+new
				// Date(obj.end.replace(/-/g, '/')))
				var minD = $("#project_start").val().replace(/-/g, '/');
				var maxD = obj.start.replace(/-/g, '/');
				// alert( new Date(minD)+ " - "+new Date(maxD));
				// var maxD = obj.end.replace(/-/g, '/');
				$("#plan_start_date").datepicker(
						{
							buttonImageOnly : true,
							minDate : new Date(minD),
							maxDate : new Date(maxD),
							dateFormat : "dd-mm-yy",
							changeMonth : true,
							changeYear : true,
							onSelect : function(d, inst) {
								var dt = $.datepicker.parseDate('dd-mm-yy', d);
								$('#plan_end_date').datepicker('option',
										'minDate', dt);
								$('#plan_end_date').datepicker("refresh");
							}
						});

				$("#plan_end_date").datepicker({
					buttonImageOnly : true,
					changeMonth : true,
					changeYear : true,
					minDate : new Date(minD),
					maxDate : new Date(maxD),
					dateFormat : "dd-mm-yy"
				});
				break;
			case 4:// finish-finish
				// alert( new Date(obj.start.replace(/-/g, '/'))+ " - "+new
				// Date(obj.end.replace(/-/g, '/')))
				$("#plan_start_date").datepicker("destroy");
				$("#plan_end_date").datepicker("destroy");
				var minD = $("#project_start").val().replace(/-/g, '/');
				var maxD = obj.end.replace(/-/g, '/');
				// alert( new Date(minD)+ " - "+new Date(maxD));
				$("#plan_start_date").datepicker(
						{
							buttonImageOnly : true,
							minDate : new Date(minD),
							maxDate : new Date(maxD),
							dateFormat : "dd-mm-yy",
							changeMonth : true,
							changeYear : true,
							onSelect : function(d, inst) {
								var dt = $.datepicker.parseDate('dd-mm-yy', d);
								$('#plan_end_date').datepicker('option',
										'minDate', dt);
								$('#plan_end_date').datepicker("refresh");
							}
						});
				$("#plan_end_date").datepicker({
					buttonImageOnly : true,
					changeMonth : true,
					changeYear : true,
					minDate : new Date(minD),
					maxDate : new Date(maxD),
					dateFormat : "dd-mm-yy"
				});

			}

		});
	}

}

function renderProjectEarnValue(id) {

	var url = "/project-earn-value?id=" + id + "&t=" + Date.now();
	$(".loader").css("display", "block");

	$.get(url, function(data) {

		var mainString = ""
		var obj = JSON.parse(data);

		if (obj.EV) {
			$("#ev").html(obj.EV);
			$("#pv").html(obj.PV);
			$("#pai").html(obj.PAI);
			$("#ac").html(obj.AC);
			$("#spi").html(obj.SPI);
			$("#cpi").html(obj.CPI);
			$("#eac").html(obj.EAC);
			$("#etc").html(obj.ETC);
			$("#pae").html(obj.PAE);
			$("#hp").html(obj.HP);
			$("#ha").html(obj.HA);			
		} else {
			$("#subtask-details").addClass("display-none");
		}

	});
	var delay = 200;
	setTimeout(function() {
		$(".loader").css("display", "none");
	}, delay);
}
function renderProjectEarnValuepro(id) {

	var url = "/project-earn-value-pro?id=" + id + "&t=" + Date.now();
	$(".loader").css("display", "block");

	$.get(url, function(data) {

		var mainString = ""
		var obj = JSON.parse(data);

		if (obj.EV) {
			//$("#ev").html(obj.EV);
			$("#pv2").html(obj.PV);
			//$("#pai").html(obj.PAI);
			//$("#ac").html(obj.AC);
			$("#spi2").html(obj.SPI);
			//$("#cpi").html(obj.CPI);
			//$("#eac").html(obj.EAC);
			//$("#etc").html(obj.ETC);
			$("#pae2").html(obj.PAE);
			//$("#hp").html(obj.HP);
			//$("#ha").html(obj.HA);			
		} else {
			$("#subtask-details").addClass("display-none");
		}

	});
	var delay = 200;
	setTimeout(function() {
		$(".loader").css("display", "none");
	}, delay);
}
function renderCriticalPath() {
	var _this = $("#critical_path");
	if (_this.is(":checked")) {
		renderCriticalPathGantt();
	} else {
		renderGanttChart();
	}
}

function renderCriticalPathGantt() {
	var url = "/task-critical-task-gantt-chart?id=" + $("#project_id").val()
			+ "&t=" + Date.now();
	$(".loader").css("display", "block");
	$.post(url, function(data) {

		var mainString = ""
		var obj = JSON.parse(data);

		if (obj.length > 0) {
			var lag = 0;
			if (obj[0].lag) {
				lag = obj[0].lag
			}
			$("#task-gantt").gantt({
				source : obj,
				navigate : "scroll",
				scale : "days",
				maxScale : "months",
				minScale : "days",
				itemsPerPage : 10,
				waitText : "Please Wait...",
				'scrollToToday' : true,
				onItemClick : function(data) {

					var taskId = data;
					// getTaskDetails(taskId);
				},
				onAddClick : function(dt, rowId) {
					// alert("Empty space clicked - add an item!"+);
				},
				onRender : function() {

					if (window.console && typeof console.log === "function") {
						// console.log("chart rendered");
						var count = 0;
						$('.leftPanel').find('.fn-label').each(function() {
							// $("#"+$(this).attr('id')).removeClass("selected-task");
							if (count == 0) {
								// console.log($(this).attr('id'));
								// $("#"+$(this).attr('id')).trigger("click");
							}
							count++;

						});

					}

					if (isIE() == 8) {
						var count = 0;
						$('.leftPanel').find('.fn-label').each(function() {
							// $("#"+$(this).attr('id')).removeClass("selected-task");
							if (count == 0) {
								// console.log($(this).attr('id'));
								// $("#"+$(this).attr('id')).trigger("click");
							}
							count++;

						});
					}
				}

			});

			// var offset = $("#flot-placeholder").offset();
			// var h = parseInt($("#flot-placeholder").height())-60;

			// $("#flot-placeholder").css("height",h+"px");
			$("#task-ganttr").css("margin-top", "10px");
			// $("#task-gantt").css("margin-bottom","-25px");

			alert("Minimum lag for critcial path is " + lag);

		} else {
			alert("Ruta crítica no disponible.");
			// $("#task-ganttr").html("No Tasks to Display.");
			// $("#task-gantt").css("height","0px");
			// $("#task-gantt").css("margin-top","10px");
		}
	});
}

function renderProgramEarnValue(id) {

	var url = "/program-earn-value?id=" + id + "&t=" + Date.now();
	$(".loader").css("display", "block");

	$.get(url, function(data) {

		var obj = JSON.parse(data);

		if (obj.EV) {
			$("#ev").html(obj.EV);
			$("#pv").html(obj.PV);
			$("#pai").html(obj.PAI);
			$("#ac").html(obj.AC);
			$("#spi").html(obj.SPI);
			$("#cpi").html(obj.CPI);
			$("#eac").html(obj.EAC);
			$("#etc").html(obj.ETC);
			$("#pae").html(obj.PAE);
			$("#hp").html(obj.HP);
			$("#ha").html(obj.HA);
		} else {
			$("#subtask-details").addClass("display-none");
		}

	});
	var delay = 200;
	setTimeout(function() {
		$(".loader").css("display", "none");
	}, delay);
}

function renderProgramEarnValuepro(id) {

	var url = "/program-earn-value-pro?id=" + id + "&t=" + Date.now();
	$(".loader").css("display", "block");

	$.get(url, function(data) {

		var obj = JSON.parse(data);

		if (obj.EV) {
			//$("#ev").html(obj.EV);
			$("#pv2").html(obj.PV);
			//$("#pai").html(obj.PAI);
			//$("#ac").html(obj.AC);
			$("#spi2").html(obj.SPI);
			//$("#cpi").html(obj.CPI);
			//$("#eac").html(obj.EAC);
			//$("#etc").html(obj.ETC);
			$("#pae2").html(obj.PAE);
			//$("#hp").html(obj.HP);
			//$("#ha").html(obj.HA);
		} else {
			$("#subtask-details").addClass("display-none");
		}

	});
	var delay = 200;
	setTimeout(function() {
		$(".loader").css("display", "none");
	}, delay);
}

function renderSubTaskCriticalPath() {
	var _this = $("#sub_task_critical_path");
	if (_this.is(":checked")) {
		renderSubTaskCriticalPathGantt();
	} else {
		renderSubTaskGanttChart();
	}
}

function renderSubTaskGanttChart() {
	var url = "/sub-task-graph?id=" + $("#task_id").val() + "&t=" + Date.now();
	$(".loader").css("display", "block");
	$.post(url, function(data) {
		var obj = JSON.parse(data);
		if (obj.length > 0) {

			$("#flot-placeholder").gantt(
					{
						source : obj,
						navigate : "scroll",
						scale : "days",
						maxScale : "months",
						minScale : "days",
						itemsPerPage : 10,
						waitText : "Please Wait...",
						'scrollToToday' : true,
						onItemClick : function(data) {

							var taskId = data;
							getTaskDetails(taskId);
						},
						onAddClick : function(dt, rowId) {

						},
						onRender : function() {

							if (isIE() == 8) {
								var count = 0;
								$('.leftPanel').find('.fn-label').each(
										function() {
											if (count == 0) {
												$("#" + $(this).attr('id'))
														.trigger("click");
											}
											count++;

										});
							}
							var url = window.location.href;
							if (url.search("#") > 0) {
								var splitUrl = url.split("#");
								$("#row_" + splitUrl[1]).trigger("click");
							} else {
								if (window.console
										&& typeof console.log === "function") {
									var count = 0;
									$('.leftPanel').find('.fn-label').each(
											function() {
												if (count == 0) {
													$("#" + $(this).attr('id'))
															.trigger("click");
												}
												count++;

											});

								}
							}
						}

					});

			$("#flot-placeholder").css("margin-top", "10px");
			$("#flot-placeholder").css("margin-bottom", "-25px");

		} else {
			$("#flot-placeholder").css("height", "0px");
			$("#flot-placeholder").css("margin-top", "10px");
		}

	});

	var delay = 200;
	setTimeout(function() {
		$(".loader").css("display", "none");
	}, delay);

}
function renderSubTaskCriticalPathGantt() {
	var url = "/sub-task-critical-graph?id=" + $("#task_id").val() + "&t="
			+ Date.now();
	// $(".loader").css("display","block");

	$.post(url, function(data) {
		var obj = JSON.parse(data);
		if (obj.length > 0) {

			if (obj[0].lag != null) {
				var lag = obj[0].lag
				alert("Minimum lag for critical path is " + lag);
			}
			$("#flot-placeholder").gantt({
				source : obj,
				navigate : "scroll",
				scale : "days",
				maxScale : "months",
				minScale : "days",
				itemsPerPage : 10,
				waitText : "Por favor espere...",
				'scrollToToday' : true,
				onItemClick : function(data) {

					var taskId = data;
					getTaskDetails(taskId);
				},
				onAddClick : function(dt, rowId) {

				},
				onRender : function() {

					if (window.console && typeof console.log === "function") {

						var count = 0;
						$('.leftPanel').find('.fn-label').each(function() {

							if (count == 0) {

								$("#" + $(this).attr('id')).trigger("click");
							}
							count++;

						});

					}

					if (isIE() == 8) {
						var count = 0;
						$('.leftPanel').find('.fn-label').each(function() {
							// $("#"+$(this).attr('id')).removeClass("selected-task");
							if (count == 0) {
								// console.log($(this).attr('id'));
								$("#" + $(this).attr('id')).trigger("click");
							}
							count++;

						});
					}
				}

			});

			$("#flot-placeholder").css("margin-top", "10px");
			$("#flot-placeholder").css("margin-bottom", "-25px");

		} else {
			alert("Critical path not available.");
			// $("#flot-placeholder").css("height","0px");
			// $("#flot-placeholder").css("margin-top","10px");
		}

	});

	var delay = 200;
	setTimeout(function() {
		$(".loader").css("display", "none");
	}, delay);

}

function autocompleteMemberSearch() {
	/**
	 * search..while creating a task
	 * 
	 */
	var availableTags = [];

	$('#member_id').find("option").each(function() {
		availableTags.push(AllTrim($(this).text()));
	});

	$.extend($.ui.autocomplete.prototype, {
		_renderItem : function(ul, item) {
			var term = this.element.val(), html = item.label.replace("", "");
			return $("<li></li>").data("item.autocomplete", item).append(
					$("<a></a>").html(html)).appendTo(ul);
		}
	});

	$("#member_id_search").autocomplete({
		source : availableTags
	});
	$(".ui-autocomplete").css("width", "300px");

	$('#member_id_search').blur(function() {
		var isPresent = false;
		var searchString = AllTrim($('#member_id_search').val());
		var otherValue = "";
		$('#member_id').find("option").each(function() {
			otherValue = AllTrim($(this).text());
			if (searchString == otherValue) {
				isPresent = true;
				$("#member_id").val($(this).val());
				// alert($("#member_id").val());
			}
		});

		if (!isPresent) {
			// $("#project_manager").val("");
		}
	});
}

function renderProgramMember() {
	var _this = $(this);
	var mid = _this.attr("id").split("_")[1];

	$("#dialog-confirm").html("Quiere eliminar?"); // /Do you want
	// to change the
	// status?
	// Define the Dialog and its properties.
	$("#dialog-confirm")
			.dialog(
					{
						resizable : false,
						modal : true,
						title : "Confirmar",
						height : 150,
						width : 300,
						buttons : {
							"Yes" : function() {

								$(this).dialog('close');
								$("#pop-box-over").css("display", "none");
								$("#dialog-confirm").css("display", "none");

								var url = "/update-member?id=" + mid + "&t="
										+ Date.now();
								$
										.post(
												url,
												function(data) {

													if (data == "Success") {

														$("#dialog-confirm")
																.html(
																		"Ha borrado al miembro del programa"); // /warning

														$("#dialog-confirm")
																.dialog(
																		{
																			resizable : false,
																			modal : true,
																			title : "Information",
																			height : 150,
																			width : 300,
																			buttons : {
																				"Ok" : function() {
																					window.location
																							.reload();
																					$(
																							this)
																							.dialog(
																									'close');
																					$(
																							"#pop-box-over")
																							.css(
																									"display",
																									"none");
																					$(
																							"#dialog-confirm")
																							.css(
																									"display",
																									"none");
																				}
																			}
																		});

														$("#pop-box-over").css(
																"display",
																"block");
														$("#dialog-confirm")
																.css("display",
																		"block");

													}

												});

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

function renderProgramMemberExternal() {
	var _this = $(this);
	var mid = _this.attr("id").split("_")[1];

	$("#dialog-confirm").html("Quiere eliminar?"); // /Do you want
	// to change the
	// status?
	// Define the Dialog and its properties.
	$("#dialog-confirm")
			.dialog(
					{
						resizable : false,
						modal : true,
						title : "Confirmar",
						height : 150,
						width : 300,
						buttons : {
							"Yes" : function() {

								$(this).dialog('close');
								$("#pop-box-over").css("display", "none");
								$("#dialog-confirm").css("display", "none");

								var url = "/update-external-member?id=" + mid
										+ "&t=" + Date.now();
								$
										.post(
												url,
												function(data) {

													if (data == "Success") {

														$("#dialog-confirm")
																.html(
																		"Ha borrado al miembro del programa"); // /warning

														$("#dialog-confirm")
																.dialog(
																		{
																			resizable : false,
																			modal : true,
																			title : "Information",
																			height : 150,
																			width : 300,
																			buttons : {
																				"Ok" : function() {
																					window.location
																							.reload();
																					$(
																							this)
																							.dialog(
																									'close');
																					$(
																							"#pop-box-over")
																							.css(
																									"display",
																									"none");
																					$(
																							"#dialog-confirm")
																							.css(
																									"display",
																									"none");
																				}
																			}
																		});

														$("#pop-box-over").css(
																"display",
																"block");
														$("#dialog-confirm")
																.css("display",
																		"block");

													}

												});

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

function renderProgramSoftdelete() {

	var _this = $(this);
	var programid = _this.attr("id").split("_")[1];
	$("#dialog-confirm").html("¿Está seguro que desea eliminar este programa?"); // /warning
	$("#dialog-confirm").dialog(
			{
				resizable : false,
				modal : true,
				title : "Advertencia",
				height : 150,
				width : 300,
				buttons : {
					"Sí" : function() {
						$(this).dialog('close');
						$("#pop-box-over").css("display", "none");
						$("#dialog-confirm").css("display", "none");
						$("#pop-box-over").css("display", "block");
						$("#dialog-confirm").css("display", "block");

						var url = "/delete-program?id=" + programid + "&t="
								+ Date.now();
						$.post(url, function(data) {
							var json_var = $.parseJSON(data);
							var json_data = json_var.status
							if (json_data == "Success") {
								window.location.reload();
							} else {

								/**
								 * fail dialog box
								 */
								$("#dialog-confirm").html(json_var.message); // /warning
								$("#dialog-confirm").dialog(
										{
											resizable : false,
											modal : true,
											title : "Warning",
											height : 150,
											width : 300,
											buttons : {
												"Ok" : function() {
													$(this).dialog('close');
													$("#pop-box-over").css(
															"display", "none");
													$("#dialog-confirm").css(
															"display", "none");
												}
											}
										});

								$("#pop-box-over").css("display", "block");
								$("#dialog-confirm").css("display", "block");
							}

						});

					},
					"No" : function() {

						$(this).dialog('close');
						$("#pop-box-over").css("display", "none");
						$("#dialog-confirm").css("display", "none");

					}
				}
			});

}

function renderProjectSoftdelete() {
	var _this = $(this);
	var project_id = _this.attr("id").split("_")[1];
	$("#dialog-confirm").html("¿Está seguro que desea eliminar este proyecto?"); // /warning

	$("#dialog-confirm").dialog(
			{
				resizable : false,
				modal : true,
				title : "Advertencia",
				height : 150,
				width : 300,
				buttons : {
					"Sí" : function() {
						$(this).dialog('close');
						$("#pop-box-over").css("display", "none");
						$("#dialog-confirm").css("display", "none");
						$("#pop-box-over").css("display", "block");
						$("#dialog-confirm").css("display", "block");

						var url = "/delete-project?id=" + project_id + "&t="
								+ Date.now();
						$.post(url, function(data) {
							var json_var = $.parseJSON(data);
							var json_data = json_var.status;

							if (json_data == "Success") {
								window.location.reload();
							} else {

								$("#dialog-confirm").html(json_var.message); // /warning

								$("#dialog-confirm").dialog(
										{
											resizable : false,
											modal : true,
											title : "Warning",
											height : 150,
											width : 300,
											buttons : {
												"Ok" : function() {
													$(this).dialog('close');
													$("#pop-box-over").css(
															"display", "none");
													$("#dialog-confirm").css(
															"display", "none");
												}
											}
										});

								$("#pop-box-over").css("display", "block");
								$("#dialog-confirm").css("display", "block");
							}

						});

					},
					"No" : function() {
						$(this).dialog('close');
						$("#pop-box-over").css("display", "none");
						$("#dialog-confirm").css("display", "none");
					}
				}
			});

}

function renderSAPUpdate() {
	var _this = $(this);
	var mid = _this.attr("id").split("_")[1];
	 $("#jquery-ui").removeAttr("disabled");
	// $(".loader").css("display","block");
	$("#dialog-confirm").html("Quieres cambiar el estado?"); // /Do you want
	$("#dialog-confirm").dialog({resizable : false,
						modal : true,
						title : "Confirmar",
						height : 150,
						width : 300,
						buttons : {
							"Yes" : function() {
								$(this).dialog('close');
								$("#pop-box-over").css("display", "none");
								$("#dialog-confirm").css("display", "none");
								var url = "/update-sap?id=" + mid + "&t="+ Date.now();
								$.post(url,function(data) {
													var json_var = $.parseJSON(data);
													var json_data = json_var.status
													if (json_data == "Success") {
														$("#dialog-confirm").html("Ha eliminado el número SAP"); // /warning
														$("#dialog-confirm")
																.dialog({resizable : false,
																			modal : true,
																			title : "Información",
																			height : 150,
																			width : 300,
																			buttons : {
																				"Ok" : function() {
																					window.location
																							.reload();
																					
																				}
																			}
																		});

														$("#pop-box-over").css(
																"display",
																"block");
														$("#dialog-confirm")
																.css("display",
																		"block");
													} else {
														$("#dialog-confirm")
																.html(
																		json_var.message); // /Do
														// you
														// want
														// to change the
														// status?
														// Define the Dialog and
														// its properties.
														$("#dialog-confirm")
																.dialog(
																		{
																			resizable : false,
																			modal : true,
																			title : "Warning",
																			height : 150,
																			width : 300,
																			buttons : {
																				"Ok" : function() {
																					 $("#jquery-ui").attr("disabled", "disabled");
																					$(this)
																							.dialog('close');
																					$("#pop-box-over")
																							.css(
																									"display",
																									"none");
																					$("#dialog-confirm")
																							.css(
																									"display",
																									"none");
																				}
																			}
																		});

														$("#pop-box-over").css(
																"display",
																"block");
														$("#dialog-confirm")
																.css("display",
																		"block");

													}

												});
							},
							"No" : function() {
								$(this).dialog('close');
								$("#pop-box-over").css("display", "none");
								$("#dialog-confirm").css("display", "none");
							    $("#jquery-ui").attr("disabled", "disabled");
							}
						}
					});

}

function renderTasksUpdate() {
	var _this = $(this);
	var mid = _this.attr("id").split("_")[1];
	var isValidString = _this.find("input").val();
	if (isValidString == "true") {
		
		$("#dialog-confirm").html("¿Está seguro que desea eliminar esta tarea?"); // /Do you
		// want
		// to change the
		// status?
		$("#dialog-confirm").dialog(
				{
					resizable : false,
					modal : true,
					title : "Advertencia",
					height : 150,
					width : 300,
					buttons : {
						"Yes" : function() {
							$(this).dialog('close');
							$("#pop-box-over").css("display", "none");
							$("#dialog-confirm").css("display", "none");

							var url = "/delete-task?id=" + mid;
							$.get(url, function(data) {
								var json_var = $.parseJSON(data);
								var json_data = json_var.status
								if (json_data == "Success") {
									window.location.reload();
								} else if (json_data == "Fail") {
									$("#dialog-confirm").html(json_var.message); // /Do
									// you
									// want
									// to change the
									// status?
									$("#dialog-confirm").dialog(
											{
												resizable : false,
												modal : true,
												title : "Advertencia",
												height : 150,
												width : 300,
												buttons : {
													"Ok" : function() {
														$(this).dialog('close');
														$("#pop-box-over").css(
																"display", "none");
														$("#dialog-confirm").css(
																"display", "none");
													}
												}
											});

									$("#pop-box-over").css("display", "block");
									$("#dialog-confirm").css("display", "block");
								}

							});
						},
						"No" : function() {
							$(this).dialog('close');
							$("#pop-box-over").css("display", "none");
							$("#dialog-confirm").css("display", "none");
						}
					}
				});
		
		
	}else if(isValidString == "false") {
		
		$("#dialog-confirm").html("Esta tarea es predecesor de otra tarea en el mismo proyecto. ¿Seguro desea borrarla?"); // /Do you
		// want
		// to change the
		// status?
		$("#dialog-confirm").dialog(
				{
					resizable : false,
					modal : true,
					title : "Warning",
					height : 150,
					width : 300,
					buttons : {
						"Yes" : function() {
							$(this).dialog('close');
							$("#pop-box-over").css("display", "none");
							$("#dialog-confirm").css("display", "none");

							var url = "/delete-task?id=" + mid;
							$.get(url, function(data) {
								var json_var = $.parseJSON(data);
								var json_data = json_var.status
								if (json_data == "Success") {
									window.location.reload();
								} else if (json_data == "Fail") {
									$("#dialog-confirm").html(json_var.message); // /Do
									// you
									// want
									// to change the
									// status?
									$("#dialog-confirm").dialog(
											{
												resizable : false,
												modal : true,
												title : "Advertencia",
												height : 150,
												width : 300,
												buttons : {
													"Ok" : function() {
														$(this).dialog('close');
														$("#pop-box-over").css(
																"display", "none");
														$("#dialog-confirm").css(
																"display", "none");
													}
												}
											});

									$("#pop-box-over").css("display", "block");
									$("#dialog-confirm").css("display", "block");
								}

							});
						},
						"No" : function() {
							$(this).dialog('close');
							$("#pop-box-over").css("display", "none");
							$("#dialog-confirm").css("display", "none");
						}
					}
				});
		
	}
	

}

function renderProjectSAPUpdate() {
	var _this = $(this);
	var mid = _this.attr("id").split("_")[1];

	$("#dialog-confirm").html("��Quieres cambiar el estado?"); // /Do you want
	// to change the
	// status?
	// Define the Dialog and its properties.
	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Confirmar",
		height : 150,
		width : 300,
		buttons : {
			"Yes" : function() {
				$(this).dialog('close');
				$("#pop-box-over").css("display", "none");
				$("#dialog-confirm").css("display", "none");

				var url = "/update-project-sap?id=" + mid + "&t=" + Date.now();
				$.post(url, function(data) {
					var json_var = $.parseJSON(data);
					var json_data = json_var.status
					if (json_data == "Success") {
						$("#dialog-confirm").html(json_var.message); // /warning

						$("#dialog-confirm").dialog({
							resizable : false,
							modal : true,
							title : "Information",
							height : 150,
							width : 300,
							buttons : {
								"Ok" : function() {
									window.location.reload();
								}
							}
						});

						$("#pop-box-over").css("display", "block");
						$("#dialog-confirm").css("display", "block");
						$(_this).parent().remove();
					} else if (json_data == "Fail") {

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

function renderProjectSAPDetails() {
	var _this = $(this);
	var id = _this.val();
	if (id != "") {
		var project_id = $("#project_id").val();
		var url = "/project-sap-details?id=" + id + "&project_id=" + project_id
				+ "&t=" + Date.now();
		$(".loader").css("display", "block");

		$.get(url,
				function(data) {
					if (data != "fail") {
						var obj = JSON.parse(data);

						$("#available_investment_hardware")
								.val(obj[0].hardware);
						$("#available_investment_software")
								.val(obj[0].software);
						$("#available_investment_telecommunication").val(
								obj[0].telecommunication);
						$("#available_investment_development").val(
								obj[0].development);
						$("#available_investment_other").val(obj[0].other);
						$("#available_investment_qa").val(obj[0].qa);
						$("#available_investment_improvements").val(
								obj[0].improvements);
						$("#available_investment_recurring_first").val(
								obj[0].recurring_first);

						$("#available_expenditure_hardware").val(
								obj[1].hardware);
						$("#available_expenditure_software").val(
								obj[1].software);
						$("#available_expenditure_telecommunication").val(
								obj[1].telecommunication);
						$("#available_expenditure_development").val(
								obj[1].development);
						$("#available_expenditure_other").val(obj[1].other);
						$("#available_expenditure_qa").val(obj[1].qa);
						$("#available_expenditure_improvements").val(
								obj[1].improvements);
						$("#available_expenditure_recurring_first").val(
								obj[1].recurring_first);
					} else {
						$("#available_investment_hardware").val("0");
						$("#available_investment_software").val("0");
						$("#available_investment_telecommunication").val("0");
						$("#available_investment_development").val("0");
						$("#available_investment_other").val("0");
						$("#available_investment_qa").val("0");
						$("#available_investment_improvements").val("0");
						$("#available_investment_recurring_first").val("0");

						$("#available_expenditure_hardware").val("0");
						$("#available_expenditure_software").val("0");
						$("#available_expenditure_telecommunication").val("0");
						$("#available_expenditure_development").val("0");
						$("#available_expenditure_other").val("0");
						$("#available_expenditure_qa").val("0");
						$("#available_expenditure_improvements").val("0");
						$("#available_expenditure_recurring_first").val("0");
					}
				});
	} else {
		$("#available_investment_hardware").val("0");
		$("#available_investment_software").val("0");
		$("#available_investment_telecommunication").val("0");
		$("#available_investment_development").val("0");
		$("#available_investment_other").val("0");
		$("#available_investment_qa").val("0");
		$("#available_investment_improvements").val("0");
		$("#available_investment_recurring_first").val("0");

		$("#available_expenditure_hardware").val("0");
		$("#available_expenditure_software").val("0");
		$("#available_expenditure_telecommunication").val("0");
		$("#available_expenditure_development").val("0");
		$("#available_expenditure_other").val("0");
		$("#available_expenditure_qa").val("0");
		$("#available_expenditure_improvements").val("0");
		$("#available_expenditure_recurring_first").val("0");
	}

}

function renderBookTimeNew() {
	var _self = $(this);
	var sub_task = $("#sub_task").val();
	var num = /^[0-9\s\+]+$/;
	var dateRegex = "/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/";
	var id = $(_self).attr('id');
	var splittedIds = id.split("_");
	var userId = splittedIds[1];
	var bookedHours = $("#user_hour_" + userId + "_" + splittedIds[2]).val();
	var plannedStartDate = $("#planned_start_date").val();
	var plannedEndDate = $("#planned_end_date").val();
	var validationFlag = false;
	if (bookedHours != null && bookedHours != "" && bookedHours.match(num)) {
		var available = parseInt($(
				"#available_hours_" + userId + "_" + splittedIds[2]).html());
		validationFlag = true;
		var inputedPlannedStartDate = $(
				"#input_planned_start_date_" + splittedIds[1] + "_"
						+ splittedIds[2]).val();
		var inputedPlannedEndDate = $(
				"#input_planned_end_date_" + splittedIds[1] + "_"
						+ splittedIds[2]).val();
		if (inputedPlannedStartDate != null
				&& $.trim(inputedPlannedStartDate) != ""
				&& inputedPlannedEndDate != null
				&& $.trim(inputedPlannedEndDate) != "") {
			var url = "/time-booked?sub_task=" + sub_task + "&user="
					+ splittedIds[1] + "&user_hour=" + bookedHours;
			$.get(url, function(data) {
				if (data == "Success") {
					$("#booking-list input").val("");
					$(".loader").css('display', 'block');
					window.location.reload();
				}
			});
		} else {
			alert("Por favor ingrese fechas correctas de inicio y término");
		}

	} else {
		alert("Por favor ingrese horas correctas.");
	}
	// alert(1);
}

function renderBookTimeExternal() {
	var _self = $(this);
	var sub_task = $("#sub_task").val();
	var num = /^[0-9\s\+]+$/;
	var dateRegex = "/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/";
	var id = $(_self).attr('id');
	var splittedIds = id.split("_");
	var userId = splittedIds[1];
	var bookedHours = $("#user_hour_" + userId + "_" + splittedIds[2]).val();
	var plannedStartDate = $("#planned_start_date").val();
	var plannedEndDate = $("#planned_end_date").val();
	var validationFlag = false;
	if (bookedHours != null && bookedHours != "" && bookedHours.match(num)) {
		var available = parseInt($(
				"#available_hours_" + userId + "_" + splittedIds[2]).html());
		validationFlag = true;
		var inputedPlannedStartDate = $(
				"#input_planned_start_date_" + splittedIds[1] + "_"
						+ splittedIds[2]).val();
		var inputedPlannedEndDate = $(
				"#input_planned_end_date_" + splittedIds[1] + "_"
						+ splittedIds[2]).val();
		if (inputedPlannedStartDate != null
				&& $.trim(inputedPlannedStartDate) != ""
				&& inputedPlannedEndDate != null
				&& $.trim(inputedPlannedEndDate) != "") {
			var url = "/time-booked-external?sub_task=" + sub_task + "&user="
					+ splittedIds[1] + "&user_hour=" + bookedHours;
			$.get(url, function(data) {
				if (data == "Success") {
					$("#booking-list input").val("");
					$(".loader").css('display', 'block');
					window.location.reload();
				}
			});
		} else {
			alert("Por favor ingrese fechas correctas de inicio y término");
		}

	} else {
		alert("Por favor ingrese las horas correctas.");
	}
	
}

function renderBookTime() {
	var num = /^[0-9\s\+]+$/;
	var sub_task = $("#sub_task").val();
	var _this = $(this);
	var user = _this.attr("id").split("_")[1];
	var user_hour = $("#user_hour_" + user).val();
	if (typeof user_hour != 'undefined') {
		if (!user_hour.match(num)) {
			$("#dialog-confirm").html("Por favor ingrese las horas correctas.");
			// Define the Dialog and its properties.
			$("#dialog-confirm").dialog({
				resizable : false,
				modal : true,
				title : "Advertencia",
				height : 150,
				width : 300,
				buttons : {
					"Ok" : function() {
						$(this).dialog('close');
						$("#pop-box-over").css("display", "none");
						$("#dialog-confirm").css("display", "none");
					}
				}
			});
		} else {

			var available = parseInt($("#available_hours_" + user).html());
			if (available < parseInt(user_hour)) {
				$("#dialog-confirm").html("Por favor ingrese las horas correctas.");

				// Define the Dialog and its properties.
				$("#dialog-confirm").dialog({
					resizable : false,
					modal : true,
					title : "Warning",
					height : 150,
					width : 300,
					buttons : {
						"Ok" : function() {
							$(this).dialog('close');
							$("#pop-box-over").css("display", "none");
							$("#dialog-confirm").css("display", "none");
						}
					}
				});
			} else {
				$("#dialog-confirm").html("¿Desea ingresar tiempo?");

				// Define the Dialog and its properties.
				$("#dialog-confirm")
						.dialog(
								{
									resizable : false,
									modal : true,
									title : "Confirmar",
									height : 150,
									width : 300,
									buttons : {
										"Yes" : function() {

											$(this).dialog('close');
											$("#pop-box-over").css("display",
													"none");
											$("#dialog-confirm").css("display",
													"none");

											// alert(user +" "+ sub_task)
											var url = "/time-booked?sub_task="
													+ sub_task + "&user="
													+ user + "&user_hour="
													+ user_hour;
											$.get(url, function(data) {
												if (data == "Success") {
													$("#booking-list input")
															.val("");
													window.location.reload();
												}
											});
											$(this).dialog('close');
											$("#pop-box-over").css("display",
													"none");
											$("#dialog-confirm").css("display",
													"none");
										},
										"No" : function() {
											$(this).dialog('close');

											$("#pop-box-over").css("display",
													"none");
											$("#dialog-confirm").css("display",
													"none");
										}
									}
								});

				$("#pop-box-over").css("display", "block");
				$("#dialog-confirm").css("display", "block");

			}
			/**/

		}
	}

	/**/
}

function renderDeleteSubTask() {
	$("#dialog-confirm").html("¿Está seguro que desea eliminar esta subtarea?");
	
	var id = $('.update-sub-task').attr('id');

	// Define the Dialog and its properties.
	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Confirmar",
		height : 150,
		width : 300,
		buttons : {
			"Sí" : function() {
				$(this).dialog('close');
				$("#pop-box-over").css("display", "none");
				$("#dialog-confirm").css("display", "none");

				var url = "/delete-sub-task?id=" + id;
				$.get(url, function(data) {
					if (data == "Success") {
						window.location.reload();
					}
				});

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

function renderDeletePredefinedTask() {
	var _this = $(this);
	var id = _this.attr("id").split("_")[1];
	$("#dialog-confirm").html("¿Está seguro que desea eliminar esta tarea predefinida?");
	// Define the Dialog and its properties.
	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Confirmar",
		height : 150,
		width : 300,
		buttons : {
			"Sí" : function() {
				$(this).dialog('close');
				$("#pop-box-over").css("display", "none");
				$("#dialog-confirm").css("display", "none");

				var sub_task = $("#sub_task").val();
				// alert(user +" "+ sub_task)
				var url = "/delete-predefined-task/" + id;
				$.get(url, function(data) {
					if (data == "Success") {
						// $("#booking-list input").val("");
						window.location.reload();
					}
				});

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

/**
 * Update project planned hours
 */
function renderEditprojectHours() {
	var _this = $(".edit-project-hours");
	$(".planned_hours").css("cursor", "none");
	if ($(".planned_hours").hasClass("add-border") == false) {
		_this.addClass("update-hours");
		$(".planned_hours").addClass("add-border");
		$(".update-hours").on("click", renderSubmitProjectHours);
		$(".planned_hours").removeAttr('readonly');
		$(".planned_hours").removeAttr('disabled');
		$(".planned_hours").css("cursor", "pointer");
	} else {
		$(".planned_hours").removeClass("add-border");
		_this.removeClass("update-hours");
		$(".update-hours").unbind();
		$(".planned_hours").attr('readonly', true);
		$(".planned_hours").attr('disabled', true);
		$(".planned_hours").css("cursor", "none");
	}
}

function renderSubmitProjectHours() {
	var program = $("#project_id").val();
	var hours = $(".planned_hours").val();
	if (hours != "") {
		var url = "/update-project-hours?project=" + program + "&hours="
				+ hours;

		$(".loader").css("display", "block");
		$.post(url, function(data) {
			var json = $.parseJSON(data);
			if (json.status == "Fail") {
				$("#dialog-confirm").html(json.message); // /warning

				$("#dialog-confirm").dialog({
					resizable : false,
					modal : true,
					title : "Advertencia",
					height : 150,
					width : 500,
					buttons : {
						"Ok" : function() {
							$(this).dialog('close');
							$("#pop-box-over").css("display", "none");
							$("#dialog-confirm").css("display", "none");
						}
					}
				});
				// alert(json.message);
			} else {

				$("#dialog-confirm").html(
						"Horas planeadas guardadas"); // /warning
				$("#dialog-confirm").dialog({
					resizable : false,
					modal : true,
					title : "Information",
					height : 150,
					width : 300,
					buttons : {
						"Ok" : function() {
							$(this).dialog('close');
							$("#pop-box-over").css("display", "none");
							$("#dialog-confirm").css("display", "none");
							window.location.reload();
						}
					}
				});
			}

			$(".update-hours").unbind();
			$(".edit-project-hours").removeClass("update-hours");
			$(".edit-project-hours").off("click").on("click",
					renderEditprojectHours);

		});
		$(".loader").css("display", "none");

	}
}

/**
 * Update program planned hours
 */
function renderEditProgramHours() {
	var _this = $(".edit-hours");
	if ($(".planned_hours").hasClass("add-border") == false) {
		_this.addClass("update-hours");
		$(".planned_hours").addClass("add-border");
		$(".update-hours").on("click", renderSubmitProgramHours);
		$(".planned_hours").removeAttr("readonly");
		$(".planned_hours").removeAttr("disabled");
	} else {
		$(".planned_hours").removeClass("add-border");
		_this.removeClass("update-hours");
		$(".planned_hours").attr('readonly', true);
		$(".planned_hours").attr('disabled', true);
		$(".update-hours").unbind();
	}
}


/**
 * Update program Status
 */
function renderEditProgramStatus() {
	var _this = $(".edit-status");
	var user_profile = $("#user_profile_id").val();
	if(user_profile !="pmo"){
		$(".workflow_status_program option[value='3']").remove();
		$(".workflow_status_program option[value='4']").remove();
	}
	$(".workflow_status_program").removeAttr("disabled");
	$(".workflow_status_program").removeAttr("readonly");
	_this.addClass("update-status");
	_this.removeClass("edit-status");
	$(".update-status").on("click", renderSubmitProgramStatus);
	/* $(".workflow_status_program").removeAttr("readonly");
	$(".workflow_status_program").removeAttr("disabled");
	
		_this.removeClass("update-hours");
		$(".workflow_status_program").attr('readonly', true);
		$(".workflow_status_program").attr('disabled', true);
		$(".update-status").unbind();*/
}


function validateNumeric(_value, _message, _type) {
	var test_result = /^\d+$/.test(_value);
	var isNotNumeric = false;
	var chars = "0123456789";
	var len = _value.length;
	var char = "";
	for (i = 0; i < len; i++) {
		char = _value.charAt(i);
		if (chars.indexOf(char) == -1) {
			isNotNumeric = true;
		}
	}

	if (isNotNumeric) {
		$("#dialog-confirm").html(_message); // /warning
		$("#dialog-confirm").dialog(
				{
					resizable : false,
					modal : true,
					title : "Warning",
					height : 150,
					width : 500,
					buttons : {
						"Ok" : function() {
							$(this).dialog('close');
							$("#pop-box-over").css("display", "none");
							$("#dialog-confirm").css("display", "none");
							if (_type == "planned_hrs") {
								$(".planned_hours").addClass("add-red-border");
								$(".planned_hours").removeAttr("readonly");
								$(".planned_hours").removeAttr("disabled");
								$(".edit-hours").addClass("update-hours");
							} else {
								$(".estimated_cost_program").addClass(
										"add-red-border");
								$(".estimated_cost_program").removeAttr(
										"readonly");
								$(".estimated_cost_program").removeAttr(
										"disabled");
								$(".edit-estimated-cost").addClass(
										"update-hours");
							}

							return false;
						}
					}
				});
		return false;
	} else {
		return true;
	}
}
function renderSubmitProgramStatus() {
	    var program = $("#program").val();
	    var status = $(".workflow_status_program").val();
		var url = "/update-program-details-status-field?program=" + program + "&status="+ status+"&_t="+Date.now;
		$(".loader").css("display", "block");
		$.post(url, function(data) {
			var json = $.parseJSON(data);
			if (json.status == "Fail") {
				$("#dialog-confirm").html(json.message); // /warning
				$("#dialog-confirm").dialog({
					resizable : false,
					modal : true,
					title : "Warning",
					height : 150,
					width : 500,
					buttons : {
						"Ok" : function() {
							$(this).dialog('close');
							$("#pop-box-over").css("display", "none");
							$("#dialog-confirm").css("display", "none");
							$(".workflow_status_program").removeAttr("readonly");
							$(".workflow_status_program").removeAttr("disabled");
							$(".edit-status").addClass("update-status");
							return false;
						}
					}
				});
			} else {
				$("#dialog-confirm").html("Programa actualizado"); // /warning
				$("#dialog-confirm").dialog({
					resizable : false,
					modal : true,
					title : "Information",
					height : 150,
					width : 300,
					buttons : {
						"Ok" : function() {
							$(this).dialog('close');
							$("#pop-box-over").css("display", "none");
							$("#dialog-confirm").css("display", "none");
							$(".workflow_status_program").attr("readonly", "readonly");
							$(".workflow_status_program").attr("disabled", "disabled");
							$(".update-status").addClass("edit-status").removeClass("update-status");
							$(".edit-status").unbind();
						}
					}
				});

			}
			$(".update-status").unbind();
			$(".edit-status").removeClass("update-hours");
			$(".edit-status").off("click").on("click", renderEditProgramStatus);
		});

	$(".loader").css("display", "none");
}


function renderSubmitProgramHours() {
	var program = $("#program").val();
	var hours = $(".planned_hours").val();
	var bool = true;
	if (hours == "") {
		hours = "0.0"
	} else {
		var _value = hours;
		var _message = "Por favor ingrese un número válido";
		bool = validateNumeric(_value, _message, "planned_hrs");
	}
	if (bool) {
		var url = "/update-program-hours?program=" + program + "&hours="
				+ hours;

		$(".loader").css("display", "block");
		$.post(url, function(data) {
			var json = $.parseJSON(data);
			if (json.status == "Fail") {
				$("#dialog-confirm").html(json.message); // /warning
				$("#dialog-confirm").dialog({
					resizable : false,
					modal : true,
					title : "Warning",
					height : 150,
					width : 500,
					buttons : {
						"Ok" : function() {
							$(this).dialog('close');
							$("#pop-box-over").css("display", "none");
							$("#dialog-confirm").css("display", "none");
							$(".planned_hours").removeAttr("readonly");
							$(".planned_hours").removeAttr("disabled");
							$(".edit-hours").addClass("update-hours");
							return false;
						}
					}
				});

			} else {

				$("#dialog-confirm").html(
						"Horas planeadas del programa guardadas"); // /warning
				$("#dialog-confirm").dialog({
					resizable : false,
					modal : true,
					title : "Information",
					height : 150,
					width : 300,
					buttons : {
						"Ok" : function() {
							$(this).dialog('close');
							$("#pop-box-over").css("display", "none");
							$("#dialog-confirm").css("display", "none");

							$(".planned_hours").attr("readonly", "readonly");
							$(".planned_hours").attr("disabled", "disabled");
							$(".edit-hours").removeClass("update-hours");
							$(".update-hours").unbind();
						}
					}
				});

			}
			$(".update-hours").unbind();
			$(".edit-hours").removeClass("update-hours");
			$(".edit-hours").off("click").on("click", renderEditProgramHours);
		});
	}

	$(".loader").css("display", "none");
}

/**
 * Update program estimated hours
 */
function renderEditProgramEstimatedCost() {
	var _this = $(".edit-estimated-cost");
	if ($(".estimated_cost").hasClass("add-border") == false) {
		_this.addClass("update-cost");
		$(".estimated_cost_program").addClass("add-border");
		$(".update-cost").on("click", renderSubmitProgramEstimatedCost);
		$(".estimated_cost_program").removeAttr('readonly');
		$(".estimated_cost_program").removeAttr('disabled');
	} else {
		$(".estimated_cost").removeClass("add-border");
		_this.removeClass("update-cost");
		$(".estimated_cost_program").attr('readonly', true);
		$(".estimated_cost_program").attr("disabled", "disabled");
		$(".update-cost").unbind();
	}
}

function renderSubmitProgramEstimatedCost() {
	var program = $("#program").val();
	var bool = true;
	var estimated_cost = $(".estimated_cost_program").val().replace(/\./g, '');
	if (estimated_cost == "") {
		estimated_cost = "0"
	} else {
		var _value = estimated_cost;
		var _message = "Por favor ingrese un número válido";
		bool = validateNumeric(_value, _message, "est_cost");
	}
	if (bool) {
		var url = "/update-program-estimated-cost?program=" + program
				+ "&estimated_cost=" + estimated_cost;

		$(".loader").css("display", "block");
		$
				.post(
						url,
						function(data) {
							var json = $.parseJSON(data);
							if (json.status == "Success") {
								$("#dialog-confirm")
										.html(
												"Costo estimado del programa guardado"); // /Information
								$("#dialog-confirm")
										.dialog(
												{
													resizable : false,
													modal : true,
													title : "Información",
													height : 150,
													width : 300,
													buttons : {
														"Ok" : function() {
															$(this).dialog(
																	'close');
															$("#pop-box-over")
																	.css(
																			"display",
																			"none");
															$("#dialog-confirm")
																	.css(
																			"display",
																			"none");
															$(
																	".estimated_cost_program")
																	.removeClass(
																			"add-border");
															$(
																	".estimated_cost_program")
																	.attr(
																			"readonly",
																			"readonly");
															$(
																	".estimated_cost_program")
																	.attr(
																			"disabled",
																			"disabled");
															$(
																	".edit-estimated-cost")
																	.removeClass(
																			"update-cost");
															$(".update-cost")
																	.unbind();
															return false;
														}
													}
												});
							} else {
								$("#dialog-confirm").html(json.message); // /warning
								$("#dialog-confirm")
										.dialog(
												{
													resizable : false,
													modal : true,
													title : "Advertencia",
													height : 150,
													width : 500,
													buttons : {
														"Ok" : function() {
															$(this).dialog(
																	'close');
															$("#pop-box-over")
																	.css(
																			"display",
																			"none");
															$("#dialog-confirm")
																	.css(
																			"display",
																			"none");
															$(
																	".estimated_cost_program")
																	.addClass(
																			"add-red-border");
															$(
																	".estimated_cost_program")
																	.removeAttr(
																			"readonly");
															$(
																	".estimated_cost_program")
																	.removeAttr(
																			"disabled");
															$(
																	".edit-estimated-cost")
																	.addClass(
																			"update-cost");
															$(".update-cost")
																	.unbind();
															return false;
														}
													}
												});
							}
							$(".update-cost").unbind();
							$(".edit-estimated-cost")
									.removeClass("update-cost");
							$(".edit-estimated-cost").off("click").on("click",
									renderEditProgramEstimatedCost);
						});
		$(".loader").css("display", "none");
	}
}

function renderUserProfile() {
	var admin = $("#isAdmin option:selected").text();
	if (admin != "") {
		$("#user_profile").val("");
		$("#user_profile").find("option").each(function() {
			$(this).attr('selected', false);
		});
		$("#user_profile option:contains(" + admin + ")").attr('selected',
				'selected');
	}
}

function renderDeleteRisk() {
	var _this = $(this);
	var id = _this.attr("id").split("_")[1];
	$("#dialog-confirm").html("¿Está seguro que desea eliminar este riesgo?");
	// Define the Dialog and its properties.
	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Confirmar",
		height : 150,
		width : 300,
		buttons : {
			"Sí" : function() {
				$(this).dialog('close');
				$("#pop-box-over").css("display", "none");
				$("#dialog-confirm").css("display", "none");

				var url = "/delete-risk/" + id;
				$.get(url, function(data) {
					if (data == "Success") {
						// $("#booking-list input").val("");
						window.location.reload();
					}
				});

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

function renderDeleteAlert() {
	var _this = $(this);
	var id = _this.attr("id").split("_")[1];
	$("#dialog-confirm").html("¿Está seguro que desea eliminar esta alerta?");
	// Define the Dialog and its properties.
	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Confirmar",
		height : 150,
		width : 300,
		buttons : {
			"Sí" : function() {
				$(this).dialog('close');
				$("#pop-box-over").css("display", "none");
				$("#dialog-confirm").css("display", "none");

				//var url = "/delete-alert/" + id;
				var url ="/delete-risk-alert?risk_alert_id="+id;
				$.get(url, function(data) {
					if (data == "Success") {
						// $("#booking-list input").val("");
						window.location.reload();
					}
				});

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

function renderDeleteIssue() {

	var _this = $(this);
	var id = _this.attr("id").split("_")[1];
	$("#dialog-confirm").html("��Seguro que quieren eliminar esta Issue");
	// Define the Dialog and its properties.
	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Confirmar",
		height : 150,
		width : 300,
		buttons : {
			"OK" : function() {
				$(this).dialog('close');
				$("#pop-box-over").css("display", "none");
				$("#dialog-confirm").css("display", "none");

				var url = "/delete-issue/" + id;
				$.get(url, function(data) {
					if (data == "Success") {
						// $("#booking-list input").val("");
						window.location.reload();
					}
				});

			},
			"Cancelar" : function() {
				$(this).dialog('close');

				$("#pop-box-over").css("display", "none");
				$("#dialog-confirm").css("display", "none");
			}
		}
	});

	$("#pop-box-over").css("display", "block");
	$("#dialog-confirm").css("display", "block");

}

function renderRiskDetails() {
	var _this = $(this);
	var element = _this.attr("id");
	var id = _this.attr("id").split("_")[1];
	if (!$("#" + element).hasClass("active-link")) {
		var url = "/risk-details?id=" + id + "&t=" + Date.now();
		$.get(url, function(data) {
			$(".left-div-risk span").removeClass("active-link");
			$("#" + element).addClass("active-link");
			$(".right-panel-risk").html(data);
			$(".add-alert").on("click", renderAlertForm)
		});
	}

}
function renderAlertForm() {
	var _this = $(this);
	var id = _this.attr("id").split("_")[1];

	var url = "/new-alert?risk_id=" + id + "&t=" + Date.now();
	$.get(url, function(data) {

		$("#risk_alert").html(data);
		$("#risk-other-details").addClass("display-none");
		$("#risk_alert").slideDown(2000);
		$("#send-alert").on("click", renderSendAlert);
		$("#done-alert").on("click", renderCancelAlert);
		$("#risk_alert").css("display", "block");
		$("#risk-other-details").css("display", "none");

		$('.mutliSelect').on('click', function() {
			var ids = ""
			$(this).find(':checked').map(function() {
				if (ids == "") {
					ids = $(this).val();
				} else {
					ids = ids + "," + $(this).val();
				}
			});
			$("#person_invloved").val(ids);

		});
		var ids = $("#person_invloved").val().split(",");
		for ( var i in ids) {
			$("#user_list_" + ids[i]).attr("checked", "checked");
		}

	});

}
function renderSendAlert() {

	var url = $("#risk-management-alert-form").attr("action");
	var sData = $('#risk-management-alert-form').serialize();

	$.post(url, sData, function(data) {
		if (data == "Sccuess") {
			$("#risk-other-details").slideDown(2000);
			$("#risk-other-details").removeClass("display-none");
			$("#risk_alert").css("display", "none");
			$("#risk_alert").html("");
		} else {
			$("#risk_alert").html(data);

			$("#send-alert").on("click", renderSendAlert);
			$("#done-alert").on("click", renderCancelAlert);

			$('.mutliSelect').on('click', function() {
				var ids = ""
				$(this).find(':checked').map(function() {
					if (ids == "") {
						ids = $(this).val();
					} else {
						ids = ids + "," + $(this).val();
					}
				});
				$("#person_invloved").val(ids);

			});
			var ids = $("#person_invloved").val().split(",");
			for ( var i in ids) {
				$("#user_list_" + ids[i]).attr("checked", "checked");
			}

		}
	});
}

function renderCancelAlert() {

	$("#risk-other-details").slideDown(2000);
	$("#risk-other-details").removeClass("display-none");
	$("#risk_alert").css("display", "none");
	$("#risk_alert").html("");
}
function renderIssueDetails() {
	var _this = $(this);
	var element = _this.attr("id");
	var id = _this.attr("id").split("_")[1];
	if (!$("#" + element).hasClass("active-link")) {
		var url = "/issue-details?id=" + id + "&t=" + Date.now();
		$.get(url, function(data) {
			$(".left-div-risk span").removeClass("active-link");
			$("#" + element).addClass("active-link");
			$(".right-panel-risk").html(data);
		});
	}

}
function renderStartDateAndEndDate() {
	var startDate = $("#start_date").val();
	var endDate = $("#end_date").val();
	var currentDate = $("#current-date").val();

	var _this = $(this);
	if (_this.val() == 1) {
		$("#closure_date_field").removeClass('display-none');
		var _d2 = Date.parse(endDate).getTime();
		var today = new Date().getTime();
		$("#closure_date").datepicker({
			buttonImageOnly : true,
			dateFormat : "dd-mm-yy",
			minDate : $('#issue_date').val(),
			maxDate : currentDate,
			changeMonth : true,
			changeYear : true
		});
		$("#closure_date").datepicker("change", {
			minDate : $('#issue_date').val()
		});
		$("#closure_date").datepicker("change", {
			maxDate : currentDate
		});
	} else {
		// $("#closure_date").datepicker("change",{ maxDate: endDate });
		$("#closure_date").val("");
		$("#closure_date_field").addClass('display-none');
	}
}

function renderTimesheetForUser() {
	var _this = $(this);
	var id = _this.attr("id").split("_")[1];
	var user_type = _this.attr("id").split("_")[0];
	var user_mode = ""
	if (user_type == "mem") {
		user_mode = 1
	}
	if (user_type == "prov") {
		user_mode = 0
	}

	var sub_task = $("#sub_task").val();
	if ($("#emp_" + id).hasClass("display-none")) {
		var url = "/book-time-timesheet?sub_task=" + sub_task + "&user=" + id
				+ "&user_type=" + user_mode + "&t=" + Date.now();
		$.get(url, function(data) {
			$('#booking-list').find(".book-row").each(function() {
				$("#" + $(this).attr("id")).addClass("display-none");
				$("#" + $(this).attr("id")).css("display", "none");
			});

			$("#emp_" + id).html(data);
			$("#emp_" + id).slideDown(1000);
			$("#emp_" + id).removeClass("display-none");

		});
	} else {
		$("#emp_" + id).slideUp(1000);
		$("#emp_" + id).addClass("display-none");
		$("#emp_" + id).html("");

	}

}

function renderBookTimeRows() {
	var _this = $(this);
	var id = _this.attr("id");
	var user_type = ""

	var user = id.split("_")[1];
	var allocation_id = _this.attr("title");
	var sub_task = $("#sub_task").val();
	var start_date = $(
			"#input_planned_start_date_" + user + "_" + allocation_id).val();
	var end_date = $("#input_planned_end_date_" + user + "_" + allocation_id)
			.val();
	if (start_date != "" && end_date != "") {
		var minDate = new Date(start_date.replace(/-/g, '/'));
		var maxDate = new Date(end_date.replace(/-/g, '/'));
		var begD = $.datepicker.parseDate('dd/mm/yy', start_date.replace(/-/g,
				'/'));
		var endD = $.datepicker.parseDate('dd/mm/yy', end_date.replace(/-/g,
				'/'));
		if (begD > endD) {
			alert('Begin date must be before End date');
			$('#input_planned_start_date_' + user + "_" + allocation_id)
					.focus();
			return false;
		} else {
			if (id.split("_")[0] == 'user') {
				user_type = "1"
			} else {
				user_type = "0"
			}

			var url = "/new-book-time-timesheet?sub_task=" + sub_task
					+ "&user=" + user + "&user_type=" + user_type
					+ "&start_date=" + start_date + "&end_date=" + end_date
					+ "&t=" + Date.now();
			$.get(url, function(data) {
				$('#booking-list').find(".book-row").each(function() {
					$("#emp_" + user).addClass("display-none");
					$("#emp_" + user).css("display", "none");
				});

				$("#emp_" + user).html(data);
				$("#emp_" + user).slideDown(1000);
				$("#emp_" + user).removeClass("display-none");
				$(".book-hour-input").mask('00:00');
				/*
				 * $(".book-hour-input").keydown(function (e) { if ((!e.shiftKey &&
				 * !e.ctrlKey && !e.altKey) && ((e.keyCode >= 48 && e.keyCode <=
				 * 57) || (e.keyCode >= 96 && e.keyCode <= 105))) { } else if
				 * (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 &&
				 * e.keyCode != 39 && e.keyCode != 9) { e.preventDefault(); }
				 * });
				 */

				$("#submit-book-hours").on("click", submitBookHours);

			});

		}

	} else {
		alert("Por favor ingrese intervalo de fechas v��lido")
	}

}

function validateMinutes(timevalue) {

	var minutes = timevalue.split(':')[1];

	if (minutes) {
		if (minutes > 59) {
			return false;
		} else {
			return true;
		}

	}

}

function validateTotalHours(timevalue) {
	var txt_val = timevalue.replace(/:/g, ".")

	if (parseFloat(txt_val) == 0 || parseFloat(txt_val) > 24) {
		return false;
	}
	/*
	 * if(parseFloat(txt_val)> 24){ return false; }
	 */

	if (parseFloat(txt_val) > 0 && parseFloat(txt_val) <= 24) {
		return true;
	}

}

function submitBookHours() {
	var isValid = true;
	var isNonEmpty = false;
	var invalidMinutes = true
	$('#new-book-hours').find(".book-row")
			.each(
					function() {
						$(this).find(".book-hour-input").removeClass(
								"red-border")
						var hour = $(this).find(".book-hour-input").val();

						var booked_hours = $(this).find(".previous-hours")
								.text();
						if (hour != "") {

							if (validateMinutes(hour)) {

								if (validateTotalHours(hour)) {

									isNonEmpty = true
									var new_hour = hour.replace(/:/g, ".")
									var sum = parseFloat(new_hour)
											+ parseFloat(booked_hours);

									if (parseFloat(sum) > parseFloat(24.00)) {
										$(this).find(".book-hour-input")
												.addClass("red-border");
										isValid = false

									}
								} else {
									$(this).find(".book-hour-input").addClass(
											"red-border");
									isValid = false
								}

							} else {
								$(this).find(".book-hour-input").addClass(
										"red-border");
								invalidMinutes = false
							}

						}

					});
	if (!invalidMinutes) {
		alert("Por favor ingrese minutos válidos.");
	} else if (!isNonEmpty) {
		alert("Por favor ingrese el valor.");
	} else if (!isValid) {
		alert("Horas deben ser mayor a 0 y menor a 24 horas por día.");
	} else {
		var formData = $("#book-time-listing").serialize();
		var url = "/new-book-time-timesheet"
		$
				.ajax({
					url : url,
					type : "POST",
					cache : false,
					data : formData,
					dataType : "html",
					success : function(data) {

						var json = $.parseJSON(data);
						if (json.status == "success") {
							$('#booking-list').find(".hasDatepicker").each(
									function() {
										$(this).val("")
									});
							window.location.reload();
							// var user = json.user_id
							// var user_type = $("#user_type").val();
							// var sub_task = $("#sub_task").val();
							//						
							// var url =
							// "/book-time-timesheet?sub_task="+sub_task+"&user="+user+"&user_type="+user_type+"&t="+Date.now();
							// $.get(url, function(data) {
							// $('#booking-list').find(".book-row").each(function()
							// {
							// $("#"+$(this).attr("id")).addClass("display-none");
							// $("#"+$(this).attr("id")).css("display","none");
							// });
							//							
							// $("#emp_" + user).html(data);
							// $("#emp_" + user).slideDown(1000);
							// $("#emp_" + user).removeClass("display-none");
							// //alert(json.new_hours)
							// $("#booked-hour-main_"+user).val(json.new_hours);

							// });
						} else {
							alert("Horas deben ser mayor a 0 y menor a 24 horas por día.");
						}

					}

				});

	}
}

function renderEditExternalAllocation() {
	var _this = $(this);
	var id = _this.attr("id").split("_")[1];

	$("#sub_allocation_list").find("user_hour").each(function() {
		$(this).removeClass("enable-text-box");
		$("#user_hour_" + id).prop("disabled", true);
		$("#user_hour_" + id).prop("readonly", true);
	});
	
	$("#user_hour_" + id).prop("disabled", false);
	$("#user_hour_" + id).prop("readonly", false);
	$("#user_hour_" + id).addClass("enable-text-box");
	//$("#all_"+ id).removeClass("edit-internal-allocation");
	
	
	$(_this).addClass("update-allocation-icon");
	$(".edit-internal-allocation").unbind();
	$(_this).removeClass("edit-allocation-hours");
	$(_this).removeClass("edit-internal-allocation")
   		$(".user_hour").keypress(function (e) {
			   			if(e.which == 46 && $("#user_hour_" + id).val().indexOf(".") != -1){
			   			 return false;
			   			}
				     //if the letter is not digit then display error and don't type anything
				     if (e.which != 46 && e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
				        //display error message
				    	 return false;
				    }
				   });
	$(".update-allocation-icon").off("click").on("click",function(){
		var __this = $(this)
		var txt_value = $("#user_hour_" + id).val();
		renderUpdateExternalAllocation(id,txt_value,__this);
	});
}

function renderEditInternalAllocation() {
	var _this = $(this);
	var id = _this.attr("id").split("_")[1];
	
	$("#sub_allocation_list").find("input.user_hour").each(function() {
		$(this).removeClass("enable-text-box");
		$("#user_hour_" + id).prop("disabled", true);
		$("#user_hour_" + id).prop("readonly", true);
		
	});
	
	$("#user_hour_" + id).prop("disabled", false);
	$("#user_hour_" + id).prop("readonly", false);
	$("#user_hour_" + id).addClass("enable-text-box");
	//$("#all_"+ id).removeClass("edit-internal-allocation");
	
	
	$(_this).addClass("update-allocation-icon");
	$(".edit-internal-allocation").unbind();
	$(_this).removeClass("edit-allocation-hours");
	$(_this).removeClass("edit-internal-allocation")

   		$(".user_hour").keypress(function (e) {
		   			if(e.which == 46 && $("#user_hour_" + id).val().indexOf(".") != -1 && ($("#user_hour_" + id).val().substring($("#user_hour_" + id).val().indexOf('.')).length > 2)){
			   			 return false;
			   			}
				     //if the letter is not digit then display error and don't type anything
				     if (e.which != 46 && e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
				        //display error message
				        return false;
				    }
				   });

	$(".update-allocation-icon").off("click").on("click",function(){
		var __this = $(this)
		var txt_value = $("#user_hour_" + id).val();
		renderUpdateInternalAllocation(id,txt_value,__this);
	});
}



function renderUpdateInternalAllocation(id,txt_value,__this){
	 var url = "/allocation-time-update?sub_task_allocation=" + id
					+"&input_hours=" + txt_value
					+"&allocation_type=internal";
	        var _this=__this;
			 		$.post(url, function(data) {
						var json = $.parseJSON(data);
						if (json.status == "success") {
							//alert(json.message)
							$("#dialog-confirm").html(json.message);
							$("#user_hour_" + id).val(json.rounded_input_hours);
							$("#user_hour_" + id).removeClass('enable-text-box');
							$(_this).removeClass("update-allocation-icon");
							$(_this).addClass("edit-allocation-hours");
							$(_this).addClass("edit-internal-allocation");
							$(_this).unbind();
							$(".edit-internal-allocation").on("click",
									renderEditInternalAllocation);
							$("#user_hour_" + id).prop("disabled", true);

						// window.location.reload();
						}else{
							//alert(json.message)
							$("#dialog-confirm").html(json.message);
						}
						$("#dialog-confirm").dialog({
							resizable : false,
							modal : true,
							title : "Information",
							height : 150,
							width : 300,
							buttons : {
								"Ok" : function() {
									$(this).dialog('close');
								}
							}
						});
					}); 

	}

function renderUpdateExternalAllocation(id,txt_value,_this){
	 var url = "/allocation-time-update?sub_task_allocation=" + id
					+"&input_hours=" + txt_value
					+"&allocation_type=external";
	
		 		$.post(url, function(data) {
					var json = $.parseJSON(data);
					if (json.status == "success") {
						$("#dialog-confirm").html(json.message);
						$("#user_hour_" + id).removeClass('enable-text-box');
						$("#user_hour_" + id).val(json.rounded_input_hours);
						$(_this).removeClass("update-allocation-icon");
						$(_this).addClass("edit-allocation-hours");
						$(_this).unbind();
						$(".edit-external-allocation").on("click",
								renderEditExternalAllocation);
						
						$("#user_hour_" + id).prop("disabled", true);

					// window.location.reload();
					}else{
						//alert(json.message)
						$("#dialog-confirm").html(json.message);
					}
					$("#dialog-confirm").dialog({
						resizable : false,
						modal : true,
						title : "Información",
						height : 150,
						width : 300,
						buttons : {
							"Ok" : function() {
								$(this).dialog('close');
							}
						}
					});
				}); 
}

function renderExportReport(){
	$('.loader').css('display', 'block');
	var url = "/tab-report-export?t=" + Date.now()
	$.get(url, function(data) {
		$("#export-excel-div").html(data);
		$('.loader').css('display', 'none');
		$(".export-excel").trigger("click");
//		var delay = 500;
//		setTimeout(function() {
//		
//		},delay);
	});
}

function renderProgramList(){
	$('.loader').css('display', 'block');
	var url = "/program-list/1?t="+Date.now()
	$.get(url, function(data) {
		$("#art_programs").html(data);
		bindProgramPagination("1")
	});
	$('.loader').css('display', 'none');
}

function bindProgramPagination(pageNumber){
	var items = $(".program-row");
	var numItems = parseInt($("#program-count").val()) //items.length;
	if(numItems > 0){
		$('#program_pagination_div').css('display', 'block');
		var perPage = 10;
		if(typeof pageNumber=="undefined"){
			pageNumber =1;
		}
		items.slice(perPage).hide();
		$("#program_pagination_div").pagination({
			items : numItems,
			itemsOnPage : perPage,
			cssStyle : "light-theme",
			currentPage : pageNumber,
			onPageClick : function(pageNumber) {
				$(".loader").css("display", "block");
				var url = "/program-list/" + pageNumber+"?t="+Date.now();
				$.get(url, function(data) {
					$("#art_programs").html(data);
					bindProgramPagination(pageNumber);
				});
				$(".loader").css("display", "none");
			}
		});
	}else if(numItems === 0){
		$('#program_pagination_div').css('display', 'none');
	}
}

function renderServiceCatalog(){
	var _this = $(this);
	var d_id = _this.val();
	if(typeof d_id != 'undefined' || d_id != ""){
		$(".loader").css("display", "block");
		var url = "/get-service-catalog/" + d_id+"?t="+Date.now();
		$.get(url, function(data) {
			$("#catalogue_id").html(data);
		});
		$(".loader").css("display", "none");
	}
}

function renderShowRiskReport(){
	$(".loader").css("display", "block");
	var url = "/dashboard-risk-report?t="+Date.now();
	$.get(url, function(data) {
		$(".content-box-content").html(data);
		$(".dashboard-overview-tab li").find("a").removeClass("current");
		 $("#dashboard-risk-tab").addClass("current");
		 $("#risk-filter-tab li").on("click", toggleTabRisk);
		 addEvenOddRisk();
		 $(".loader").css("display", "none");
	});
	
}

function renderShowIssueReport(){
	$(".loader").css("display", "block");
	var url = "/dashboard-issue-report?t="+Date.now();
	$.get(url, function(data) {
		$(".content-box-content").html(data);
		$(".dashboard-overview-tab li").find("a").removeClass("current");
		 $("#dashboard-issue-tab").addClass("current");
		 $("#risk-filter-tab li").on("click", toggleTabRisk);
		 addEvenOddRisk();
		 $(".loader").css("display", "none");
	});

}

function calculateSAPCalculations(){
	
	$(".sap-main-data").focusout(function () {
		var _this =$(this);
		var currnet_obj = _this.attr("id").split("_");
		var typeObj = currnet_obj[0];
		var current_val = _this.val();
		var typeData= ""
		
		switch (currnet_obj.length) {
			case 3:
				typeData = currnet_obj[2]  
				break;
			case 4:
				typeData = currnet_obj[2]+"_"+currnet_obj[3]
				break;
		}
		
		var paidObj = "paid_"+typeObj+"_"+typeData;
		var committedObj = "committed_"+typeObj+"_"+typeData;
		var noncommittedObj = "non_committed_"+typeObj+"_"+typeData;
		var availableObj = "available_"+typeObj+"_"+typeData;
	
		var maintotal = 0;
		var s1 = 0;
		var s2 = 0;
		var s3 = 0;
		
		if(typeof current_val !="undefined" && current_val != ""){
			maintotal = parseFloat(current_val.replace(/\./g, ""));	
		}
		  
		if(typeof $("#"+paidObj).val() !="undefined" && $("#"+paidObj).val() != ""){
			s1 = parseFloat($("#"+paidObj).val().replace(/\./g, ""));
		}
		if(typeof $("#"+committedObj).val() !="undefined" && $("#"+committedObj).val() != ""){
			s2 = parseFloat($("#"+committedObj).val().replace(/\./g, "")); 
		}
		if(typeof $("#"+noncommittedObj).val() !="undefined" && $("#"+noncommittedObj).val() != ""){
			s3 = parseFloat($("#"+noncommittedObj).val().replace(/\./g, "")); 
		}
		
		var s4 = maintotal-(s1+s3+s2);
		if(maintotal==0){
			//$("#"+paidObj).val("0");
			//$("#"+committedObj).val("0");
			//$("#"+noncommittedObj).val("0");
			$("#"+availableObj).val(maintotal);
		}else{
			if(s1==0 && s2==0 && s3==0){
				$("#"+availableObj).val(maintotal);
			}else{
				$("#"+availableObj).val(s4);
				if(s4 > 999){
					//alert("aa"+availableObj)
					$("#"+availableObj).mask('0.000.000.000');	
				}
				
			}
			
		}
		if(s4 > 999){
			$("#"+availableObj).mask('0.000.000.000',{reverse: false});	
		}
		
		
	});
	
	$(".sap-other-data").focusout(function () {
		var _this =$(this);
		var currnet_obj = _this.attr("id").split("_");
		var paidObj = "paid_"
		var committedObj = "committed_"
		var noncommittedObj = "non_committed_"
		var availableObj = "available_"
		var mainObj= ""
		
		switch (currnet_obj.length) {
			case 3:
					mainObj = currnet_obj[1]+"_"+currnet_obj[1]+"_"+currnet_obj[2];
					paidObj= paidObj+currnet_obj[1]+"_"+currnet_obj[2];
					committedObj= committedObj+currnet_obj[1]+"_"+currnet_obj[2];
					noncommittedObj=noncommittedObj+currnet_obj[1]+"_"+currnet_obj[2];
					availableObj=availableObj+currnet_obj[1]+"_"+currnet_obj[2];
				break;
			case 4: 
				if(currnet_obj[1] =="investment"){
					mainObj = currnet_obj[1]+"_"+currnet_obj[1]+"_"+currnet_obj[2]+"_"+currnet_obj[3]
					paidObj= paidObj+currnet_obj[1]+"_"+currnet_obj[2]+"_"+currnet_obj[3]
					committedObj= committedObj+currnet_obj[1]+"_"+currnet_obj[2]+"_"+currnet_obj[3]
					noncommittedObj=noncommittedObj+currnet_obj[1]+"_"+currnet_obj[2]+"_"+currnet_obj[3]
					availableObj=availableObj+currnet_obj[1]+"_"+currnet_obj[2]+"_"+currnet_obj[3]
				}
				if(currnet_obj[2] =="investment"){
					mainObj = currnet_obj[2]+"_"+currnet_obj[2]+"_"+currnet_obj[3]
					paidObj= paidObj+currnet_obj[2]+"_"+currnet_obj[3]
					committedObj= committedObj+currnet_obj[2]+"_"+currnet_obj[3]
					noncommittedObj=noncommittedObj+currnet_obj[2]+"_"+currnet_obj[3]
					availableObj=availableObj+currnet_obj[2]+"_"+currnet_obj[3]
				}
				
				if(currnet_obj[1] =="expenditure"){
					mainObj = currnet_obj[1]+"_"+currnet_obj[1]+"_"+currnet_obj[2]+"_"+currnet_obj[3]
					paidObj= paidObj+currnet_obj[1]+"_"+currnet_obj[2]+"_"+currnet_obj[3]
					committedObj= committedObj+currnet_obj[1]+"_"+currnet_obj[2]+"_"+currnet_obj[3]
					noncommittedObj=noncommittedObj+currnet_obj[1]+"_"+currnet_obj[2]+"_"+currnet_obj[3]
					availableObj=availableObj+currnet_obj[1]+"_"+currnet_obj[2]+"_"+currnet_obj[3]
				}
				if(currnet_obj[2] =="expenditure"){
					mainObj = currnet_obj[2]+"_"+currnet_obj[2]+"_"+currnet_obj[3]
					paidObj= paidObj+currnet_obj[2]+"_"+currnet_obj[3]
					committedObj= committedObj+currnet_obj[2]+"_"+currnet_obj[3]
					noncommittedObj=noncommittedObj+currnet_obj[2]+"_"+currnet_obj[3]
					availableObj=availableObj+currnet_obj[2]+"_"+currnet_obj[3]
				}
				
				break;
			case 5: 
				
				mainObj = currnet_obj[2]+"_"+currnet_obj[2]+"_"+currnet_obj[3]+"_"+currnet_obj[4]
				paidObj= paidObj+currnet_obj[2]+"_"+currnet_obj[3]+"_"+currnet_obj[4]
				committedObj= committedObj+currnet_obj[2]+"_"+currnet_obj[3]+"_"+currnet_obj[4]
				noncommittedObj=noncommittedObj+currnet_obj[2]+"_"+currnet_obj[3]+"_"+currnet_obj[4]
				availableObj=availableObj+currnet_obj[2]+"_"+currnet_obj[3]+"_"+currnet_obj[4]
				break;
		}
		var maintotal = 0;
		var s1 = 0;
		var s2 = 0;
		var s3 = 0;
	
		if(typeof $("#"+mainObj).val() !="undefined" && $("#"+mainObj).val() != ""){
			maintotal = parseFloat($("#"+mainObj).val().replace(/\./g, ""));	
		}
		  
		if(typeof $("#"+paidObj).val() !="undefined" && $("#"+paidObj).val() != ""){
			s1 = parseFloat($("#"+paidObj).val().replace(/\./g, ""));
		}
		if(typeof $("#"+committedObj).val() !="undefined" && $("#"+committedObj).val() != ""){
			s2 = parseFloat($("#"+committedObj).val().replace(/\./g, "")); 
		}
		if(typeof $("#"+noncommittedObj).val() !="undefined" && $("#"+noncommittedObj).val() != ""){
			s3 = parseFloat($("#"+noncommittedObj).val().replace(/\./g, "")); 
		}
			
		var s4 = maintotal-(s1+s3+s2);
		
		
		$("#"+availableObj).val(s4);
		/*if(s4 > 999){
			//alert("aa"+availableObj)
			$("#"+availableObj).mask('0.000.000.000');	
		}*/
		
		if(s4 > 999){
			$("#"+availableObj).mask('0.000.000.000',{reverse: false});	
		}
		
		
		//$('#available_investment_hardware').mask('0.000.000.000', {reverse: true});
		//$('#available_expenditure_hardware').mask('0.000.000.000', {reverse: true});
		
		
	});
}

function programSubtaskPagination(){
	
	var items = $("#sub-task-summary .sub-summary-data");
	var numItems = items.length;
	if (numItems > 0) {
		$('#sub_task_items').css('display', 'block');
		var perPage = 10;
		items.slice(perPage).hide();
		$("#sub_task_items").pagination({
			items : numItems,
			itemsOnPage : perPage,
			cssStyle : "light-theme",
			onPageClick : function(pageNumber) { // this is where the
				// magic happens
				// someone changed page, lets hide/show trs
				// appropriately

				var showFrom = perPage * (pageNumber - 1);
				var showTo = showFrom + perPage;

				items.hide() // first hide everything, then show for
				// the
				// new page
				.slice(showFrom, showTo).show();

			}
		});

		// $("#program").on("change", renderProjectBarChart);
	} else if (numItems === 0) {
		$('#sub_task_items').css('display', 'none');
	}
	
	
}

function validateProjectStartDate(project_id,start_date){
	$("#dialog-confirm").html("Fecha de finalización del proyecto no puede ser anterior a la fecha de finalización de tareas, ¿Desea cambiar la fecha de finalización de tareas?");
	// Define the Dialog and its properties.
	$("#jquery-ui").removeAttr("disabled");
	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Confirmar",
		height : 150,
		width : 450,
		buttons : {
			"Ok" : function() {
				jQuery.ajax({
					url: "/update-project-start-dates?project_id="+project_id+"&start_date="+start_date,
					cache:false,
					type:"GET",
					dataType : "html",
					success: function (data) {
							var json = $.parseJSON(data);
							if(json.status == "success"){
								document.getElementById("add-new-project-form").submit();
								$("#jquery-ui").attr("disabled", "disabled");
							}else{
								$("#dialog-confirm").html(json.message);
								$("#dialog-confirm").dialog({
									resizable : false,
									modal : true,
									title : "Información",
									height : 150,
									width : 450,
									buttons : {
										"Ok" : function() {
											$(this).dialog('close');
											$("#pop-box-over").css("display", "none");
											$("#dialog-confirm").css("display", "none");
											$("#jquery-ui").attr("disabled", "disabled");
										}
									}
								});
							}
							
			        },
			        error: function () {
			        	alert("Error");
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
				$("#jquery-ui").attr("disabled", "disabled");
			}
		}
	});
	$("#pop-box-over").css("display", "block");
	$("#dialog-confirm").css("display", "block");

}

function validateProjectEndDate(project_id,end_date){
	$("#dialog-confirm").html("Proyecto fecha de finalización no puede ser anterior a la fecha de finalización de tareas, ¿quieres chnage fecha de finalización de tareas.");
	// Define the Dialog and its properties.
	$("#jquery-ui").removeAttr("disabled");
	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Confirm",
		height : 150,
		width : 450,
		buttons : {
			"Yes" : function() {
				jQuery.ajax({
					url: "/update-project-end-dates?project_id="+project_id+"&end_date="+end_date,
					cache:false,
					type:"GET",
					dataType : "html",
					success: function (data) {
							var json = $.parseJSON(data);
							if(json.status == "success"){
								document.getElementById("add-new-project-form").submit();
								$("#jquery-ui").attr("disabled", "disabled");
							}else{
								$("#dialog-confirm").html(json.message);
								$("#dialog-confirm").dialog({
									resizable : false,
									modal : true,
									title : "Information",
									height : 150,
									width : 450,
									buttons : {
										"Ok" : function() {
											$(this).dialog('close');
											$("#pop-box-over").css("display", "none");
											$("#dialog-confirm").css("display", "none");
											$("#jquery-ui").attr("disabled", "disabled");
										}
									}
								});
							}
							
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
				$("#jquery-ui").attr("disabled", "disabled");
			}
		}
	});
	$("#pop-box-over").css("display", "block");
	$("#dialog-confirm").css("display", "block");

}


function validateTaskEdit(task_id,end_date){
	$("#dialog-confirm").html("Fecha de finalización de tarea no puede ser anterior a la fecha de finalización de subtarea, ¿Desea modificar la fecha de finalización de la subtarea?");
	// Define the Dialog and its properties.
	$("#jquery-ui").removeAttr("disabled");
	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Confirm",
		height : 150,
		width : 450,
		buttons : {
			"Yes" : function() {
				jQuery.ajax({
					url: "/update-sub-task-dates?task_id="+task_id+"&end_date="+end_date,
					cache:false,
					type:"GET",
					dataType : "html",
					success: function (data) {
							var json = $.parseJSON(data);
							if(json.status == "success"){
								document.getElementById("new-task-form").submit();
								$("#jquery-ui").attr("disabled", "disabled");
							}else{
								$("#dialog-confirm").html(json.message);
								$("#dialog-confirm").dialog({
									resizable : false,
									modal : true,
									title : "Information",
									height : 150,
									width : 450,
									buttons : {
										"Ok" : function() {
											$(this).dialog('close');
											$("#pop-box-over").css("display", "none");
											$("#dialog-confirm").css("display", "none");
											$("#jquery-ui").attr("disabled", "disabled");
										}
									}
								});
							}
							
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
				$("#jquery-ui").attr("disabled", "disabled");
			}
		}
	});
	$("#pop-box-over").css("display", "block");
	$("#dialog-confirm").css("display", "block");

}

function validateTaskStartDate(task_id,start_date){
	$("#dialog-confirm").html("Fecha de inicio de la tarea no puede ser posterior a la fecha de inicio de la subtarea, ¿Desea modificar la fecha de inicio de la subtarea?");
	// Define the Dialog and its properties.
	$("#jquery-ui").removeAttr("disabled");
	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Confirmar",
		height : 150,
		width : 450,
		buttons : {
			"Ok" : function() {
				jQuery.ajax({
					url: "/update-sub-task-start-dates?task_id="+task_id+"&start_date="+start_date,
					cache:false,
					type:"GET",
					dataType : "html",
					success: function (data) {
							var json = $.parseJSON(data);
							if(json.status == "success"){
								document.getElementById("new-task-form").submit();
								$("#jquery-ui").attr("disabled", "disabled");
							}else{
								$("#dialog-confirm").html(json.message);
								$("#dialog-confirm").dialog({
									resizable : false,
									modal : true,
									title : "Información",
									height : 150,
									width : 450,
									buttons : {
										"Ok" : function() {
											$(this).dialog('close');
											$("#pop-box-over").css("display", "none");
											$("#dialog-confirm").css("display", "none");
											$("#jquery-ui").attr("disabled", "disabled");
										}
									}
								});
							}
							
			        },
			        error: function () {
			        	alert("Error");
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
				$("#jquery-ui").attr("disabled", "disabled");
			}
		}
	});
	$("#pop-box-over").css("display", "block");
	$("#dialog-confirm").css("display", "block");

}

function validateSubTaskStartDate(sub_task_id,start_date){
	$("#dialog-confirm").html("La fecha de inicio de la subtarea no puede ser anterior a la fecha de inicio de la tarea, ¿Desea modificar tarea fecha de inicio de la tarea?");
	// Define the Dialog and its properties.
	$("#jquery-ui").removeAttr("disabled");
	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Confirmar",
		height : 150,
		width : 450,
		buttons : {
			"Ok" : function() {
				jQuery.ajax({
					url: "/update-task-start-dates?sub_task_id="+sub_task_id+"&start_date="+start_date,
					cache:false,
					type:"GET",
					dataType : "html",
					success: function (data) {
						var json = $.parseJSON(data);
						if(json.status == "success"){
							$("#jquery-ui").attr("disabled", "disabled");
							document.getElementById("edit_subtask_form").submit();
							
						}else{
							$("#dialog-confirm").html(json.message);
							$("#dialog-confirm").dialog({
								resizable : false,
								modal : true,
								title : "Información",
								height : 150,
								width : 450,
								buttons : {
									"Ok" : function() {
										$(this).dialog('close');
										$("#pop-box-over").css("display", "none");
										$("#dialog-confirm").css("display", "none");
										$("#jquery-ui").attr("disabled", "disabled");
									}
								}
							});
							//alert(json.message);
						}
							
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
				$("#jquery-ui").attr("disabled", "disabled");
			}
		}
	});
	$("#pop-box-over").css("display", "block");
	$("#dialog-confirm").css("display", "block");

}

function validateSubTaskEdit(sub_task_id,end_date){
	$("#dialog-confirm").html("Fecha de finalización de la subtarea no puede ser mayor que la fecha de finalización de la tarea, ¿Desea modificar la fecha de término de la tarea?");
	// Define the Dialog and its properties.
	$("#jquery-ui").removeAttr("disabled");
	$("#dialog-confirm").dialog({
		resizable : false,
		modal : true,
		title : "Confirmar",
		height : 150,
		width : 450,
		buttons : {
			"Ok" : function() {
				jQuery.ajax({
					url: "/update-task-dates?sub_task_id="+sub_task_id+"&end_date="+end_date,
					cache:false,
					type:"GET",
					dataType : "html",
					success: function (data) {
						var json = $.parseJSON(data);
						if(json.status == "success"){
							$("#jquery-ui").attr("disabled", "disabled");
							document.getElementById("edit_subtask_form").submit();
							
						}else{
							$("#dialog-confirm").html(json.message);
							$("#dialog-confirm").dialog({
								resizable : false,
								modal : true,
								title : "Information",
								height : 150,
								width : 450,
								buttons : {
									"Ok" : function() {
										$(this).dialog('close');
										$("#pop-box-over").css("display", "none");
										$("#dialog-confirm").css("display", "none");
										$("#jquery-ui").attr("disabled", "disabled");
									}
								}
							});
							//alert(json.message);
						}
							
			        },
			        error: function () {
			        	alert("Error");
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
				$("#jquery-ui").attr("disabled", "disabled");
			}
		}
	});
	$("#pop-box-over").css("display", "block");
	$("#dialog-confirm").css("display", "block");

}

function renderDistributionGraph(url,id) {

	var dist = [];
	var total = 0;
	var nombre = "";
	var uid = id.split("_")[1];
	$.get("/name-user/" + uid, function(res){
		nombre=res;
	});
	$.get(url, function(datos) {

		$.each(datos, function(index, element) {
			dist.push([parseInt(element.task_for_date),parseFloat(element.hours)]);
			total += element.hours;
	    });	
		$("#distribution").dialog({title:nombre}).dialog("open");
		var graph = new Highcharts.Chart( {
            chart: {
            	renderTo:'distribution',
                type: 'column'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Fecha'
                },
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Horas (hrs)'
                },
                min: 0
            },
            title: {
                text: 'total de horas ' + total.toFixed(2)
            },
            tooltip: {
                pointFormat: 'Avance acumulado: <b>{point.y:.1f} horas</b>'
            },
            plotOptions: {
                series: {
                    pointWidth: 20,
                    groupPadding: 0
                }
            },
            series: [{
                name: 'Horas',
                data: dist,
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    format: '{point.y:.1f}', // one decimal
                    y: 10, // 10 pixels down from the top
                    style: {
                        fontSize: '11px',
                        fontWeight: 'bold',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            }]
        });		
		

	});
	/*
	var delay = 200;
	setTimeout(function() {
		$(".loader").css("display", "none");
	}, delay);
	*/
}
/*
function renderDistributionGraph(url) {

	$(".loader").css("display", "block");
	var dist = [];
	var total = 0;

	$.get(url, function(datos) {

		$.each(datos, function(index, element) {
			dist.push([parseInt(element.task_for_date),parseFloat(element.hours)]);
			total += element.hours;
	    });		

		$('#distribution').highcharts('StockChart', {
            chart: {
                alignTicks: false
            },
            rangeSelector: {
                selected: 1
            },
            title: {
                text: 'Total de horas ' + total.toFixed(2)
            },
            series: [{
                type: 'column',
                name: 'Horas',
                data: dist
            }]
        });		
		$("#distribution").dialog("open");		
	});
	var delay = 200;
	setTimeout(function() {
		$(".loader").css("display", "none");
	}, delay);
}
*/