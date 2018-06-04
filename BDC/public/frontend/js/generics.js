$(document).ready(function() {

	// $("#task_details_task_type").on("change", renderPredefinedTask);
	$("#add-predefined-task").on("click", renderPredefinedTask);
	if (window.location.pathname.indexOf('new-generic-task') >= 0) {
		renderPredefinedTask();
	}
	$(".delete-generic-task").on("click", renderDeleteGenericTask);
	$(".edit-dependency").on("click", renderEditDependency);
	$(".select_task").on("click", renderSelectTask);

	$(".multiselect").multiselect();

});

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

jQuery.fn.editmultiselect = function() {
	$(this).each(
			function() {
				var _this = $(this);

				var checkboxes = $(this).find("input:checkbox");
				var select_tasks = ""
				checkboxes.each(function() {
					var checkbox = $(this);

					// Highlight pre-selected checkboxes
					if (checkbox.prop("checked"))
						checkbox.addClass("multiselect-on");

					// Highlight checkboxes that the user selects
					checkbox.click(function() {
						var objId = checkbox.val();
						// alert(checkbox.prop("checked"))
						if (checkbox.prop("checked"))
							$("#multiselect_" + objId).find("label").addClass(
									"multiselect-on");
						else
							$("#multiselect_" + objId).find("label")
									.removeClass("multiselect-on");

						// $("#multiselect_"+objId).find("label").remove();
						// alert(checkbox);
						renderEditDepedentTask(objId)

					});
				});

			});
};

function renderEditDependency() {
	var id = $(this).attr("id")
	var url = "/edit-tasks-dependency?task_id=" + id + "&&task_mode="
			+ $("#project_mode").val() + "&t=" + Date.now();
	$.get(url, function(data) {
		$("#pop-box").html(data);
		$("#pop-box").removeClass("display-none");
		$("#pop-box-over").removeClass("display-none");
		$(".multiselect").editmultiselect();
		$(".done-dependency").on("click", renderUpdateDependency)
		renderDependencyTaskList(id);
		$(".close-popup-box").on("click", renderClosePoup2);

	});

}

function renderClosePoup2() {
	$("#pop-box").css("position", "fixed");
	$("#pop-box").css("top", "10%");
	$("#pop-box").html("");
	$("#pop-box").addClass("display-none");
	$("#pop-box-over").addClass("display-none");
	$(".leftPanel").css("z-index", "2");
	$("#pop-box-over").css("display", "none");

}
function renderEditDepedentTask(id) {

	var newId = id;
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
	$("#myTasks").val(select_tasks);
	// alert($("#selected_task_dependency_"+newId).val() +"-----"+newId);
}

function renderUpdateDependency() {
	var tasks = $("#myTasks").val();
	var task_id = $("#task_id").val();
	var task = $("#project_mode").val();
	// alert(tasks +" - "+task_id);
	var url = "/update-tasks-dependency?task_id=" + task_id + "&selected_task="
			+ tasks + "&t=" + Date.now();
	// $(".loader").css("display","block");
	$.post(url, function(data) {
		var json = $.parseJSON(data);

		if (json.status == "Success") {
			window.location.href = "/project-type-template/" + task
			location.reload();
		} else {
			$("#dialog-confirm").html(json.message); // /Do you want to
														// change the status?
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
						// $("#dialog-confirm").css("display","none");
					}
				}
			});

			// alert()
		}

	});
}

function renderDependencyTaskList(id) {
	var newId = id.split("_")[1]
	var _this = $("#" + id);

	var tasks = $("#myTasks").val();

	var objDep = $("#depends-task-list");

	var ids = tasks.split(",");
	for (i = 0; i < ids.length; i++) {
		var newId = $("#multiselect_" + AllTrim(ids[i]))
		newId.find("label").addClass("multiselect-on");
		newId.find("input:checkbox").attr("checked", true);
	}
	/*
	 * var task_id= $("#task_id").val(); var
	 * url="/get-dependent-tasks-list?tasks="+tasks+"&t="+ Date.now();;
	 * $.get(url, function(data) { $(".dependency-task-list").append(data); });
	 */

}

function renderPredefinedTask() {
	// var id = $("#task_details_task_type").val();
	id = "1";
	if (id == "1") {
		var url = "/get-predefined-tasks?task_mode=" + $("#project_mode").val()
				+ "&t=" + Date.now();
		$.get(url, function(data) {
			$("#pop-box").html(data);
			bindPagination();
			$("#pop-box").removeClass("display-none");
			$("#pop-box-over").removeClass("display-none");
			$(".add-task-depend").on("click", renderAddGenricTaskDepends);
			$(".done-task-selection").on("click",
					renderDoneGenericTaskSelection);
			$(".close-popup-box").on("click", renderClosePoup);
			$("#myTasks").val($("#task_depend").val());
			renderGenericDependencyTaskList();
			$(".select_task").on("click", renderSelectTask);
			$(".close-popup-box").on("click", renderClosePoup);
		});
	}
}

function bindPagination() {
	var items = $(".task-listing");
	var numItems = items.length;
	if (numItems > 0) {
		$('#task_pagination_div').css('display', 'block');
		var perPage = 20;
		items.slice(perPage).hide();
		$("#task_pagination_div").pagination({
			items : numItems,
			itemsOnPage : perPage,
			cssStyle : "light-theme",
			onPageClick : function(pageNumber) { // this is where the magic
													// happens
				// someone changed page, lets hide/show trs appropriately
				var showFrom = perPage * (pageNumber - 1);
				var showTo = showFrom + perPage;
				items.hide() // first hide everything, then show for the new
								// page
				.slice(showFrom, showTo).show();
			}
		});
	}
	if (numItems <= 20) {
		$('#task_pagination_div').css('display', 'none');
	}
}

function rederGenericTaskDependency() {
	var task_mode = $("#task_mode").val();
	var selected_task = $("#task_depend").val();
	var url = "/get-generic-tasks?task_mode=" + task_mode + "&selected_task="
			+ selected_task + "&t=" + Date.now();
	$.get(url, function(data) {
		$("#pop-box").html(data);
		$("#pop-box").removeClass("display-none");
		$("#pop-box-over").removeClass("display-none");
		$(".add-task-depend").on("click", renderAddGenricTaskDepends);
		$(".done-task-selection").on("click", renderDoneGenericTaskSelection);
		$(".close-popup-box").on("click", renderClosePoup);
		$("#myTasks").val($("#task_depend").val());
		renderGenericDependencyTaskList();
	});
}

function renderAddGenricTaskDepends() {
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
			$(".dependency-task-list").append(
					"<li>" + e.options[e.selectedIndex].text + "</li>");
			$(e.options[e.selectedIndex]).remove();
		}
	}
}

function renderDoneGenericTaskSelection() {
	$("#task_depend").val($("#myTasks").val());
	$("#dependencies_type").val($("#dependency_type").val());
	$("#pop-box").html("");
	$("#pop-box").addClass("display-none");
	$("#pop-box-over").addClass("display-none");
}

function renderGenericDependencyTaskList() {
	var tasks = $("#task_depend").val();
	if (typeof tasks != 'undefined') {
		var url = "/get-generic-dependent-tasks-list?tasks=" + tasks + "&t="
				+ Date.now();
		;
		$.get(url, function(data) {
			$(".dependency-task-list").append(data);
		});
	}

}

function renderSelectTask() {
	var id = $(this).attr("id").split("_")[1];

	// $("#t_"+id).hide();

	/*
	 * var title = $("#t_"+id+" .pre_title").attr("title"); var description =
	 * $("#t_"+id+" .pre_description").attr("title"); var remark = $("#t_"+id+"
	 * .pre_remark").attr("title"); var discipline = $("#t_"+id+"
	 * .pre_discipline").attr("title"); var stage = $("#t_"+id+"
	 * .pre_stage").attr("title"); var role = $("#t_"+id+"
	 * .pre_role").attr("title"); var delierable = $("#t_"+id+"
	 * .pre_deliverable").attr("title");
	 * 
	 */
	var task = $("#project_mode").val();
	var plan_time = $("#plan_time_"+id).val();
	if(plan_time.length===0)
	    plan_time=0
    var task_selected = new Array();
    $.each($("input[name='task_depend[]']:checked"), function() {
      task_selected.push($(this).val());
    });

    var tds = task_selected.join();
	console.log("tds : " + tds)

	//var tds = $("#selected_task_dependency_" + id).val();
	if (typeof (tds) == 'undefined') {
		tds = ""
	}
	var _self = $(this);
	var url = "/add-predefined-task-to-project?id=" + id + "&task_mode=" + task
			+ "&task_depend=" + tds + "&plan_time=" + plan_time;
	$.post(url, function(data) {
		if (data == 'success') {
			var _this = $(".generic-tasks-list");
			var checkboxes = $(_this).find("input:checkbox");
			checkboxes.each(function() {
				$(this).attr('checked', false)
				// alert($(this).parent().val())
				$(this).parent().removeClass("multiselect-on")

			});
			window.location.href = "/project-type-template/" + task
			// location.reload();
		}
	});
	/*
	 * $("#description").text(description); $("#title").val(title);
	 * $("#remark").text(remark);
	 * $("#task_discipline").val(parseInt(discipline));
	 * $("#task_details_stage").val(parseInt(stage));
	 * $("#task_details_user_role").val(parseInt(role));
	 * $("#task_details_deliverable").val(parseInt(delierable));
	 */
}

function renderDepedentTask(id) {
	var newId = id.split("_")[1]
	var _this = $("#pre_depend_" + newId)
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

	$("#selected_task_dependency_" + newId).val(select_tasks);
	// alert($("#selected_task_dependency_"+newId).val() +"-----"+newId);
}
function renderDeleteGenericTask() {
	var _this = $(this);
	var id = _this.attr("id").split("_")[1];
	var isValidString = _this.find("input").val();
	if (isValidString == "true") {
		$("#dialog-confirm").html("¿Quieres eliminar esta tarea genérico?");
		// Define the Dialog and its properties.
		$("#dialog-confirm").dialog({
			resizable : false,
			modal : true,
			title : "Confirmar",
			height : 150,
			width : 300,
			buttons : {
				"Yes" : function() {
					var url = "/delete-generic-task-for-project/" + id;
					$.get(url, function(data) {
						if (data == "Success") {
							window.location.reload();
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

	} else if(isValidString == "false"){
		
		$("#dialog-confirm").html("Esta tarea es Predecesor tarea a otra tarea por el mismo proyecto, es lo que quieres borrarlo?");
		// Define the Dialog and its properties.
		$("#dialog-confirm").dialog({
			resizable : false,
			modal : true,
			title : "Confirmar",
			height : 150,
			width : 300,
			buttons : {
				"Yes" : function() {
					var url = "/delete-generic-task-for-project/" + id;
					$.get(url, function(data) {
						if (data == "Success") {
							window.location.reload();
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

	}

	$("#pop-box-over").css("display", "block");
	$("#dialog-confirm").css("display", "block");
}
