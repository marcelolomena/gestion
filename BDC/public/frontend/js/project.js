var selectedOverviewTabClass;


$(document).ready(function() {
	Date.now = Date.now || function() { return +new Date; }; 
	$(".project_list_1:even").addClass("project_list_2");
	$("#sCountry").val("");
	var url = window.location.href;
	var withOutParametters = url.split('/')[3];

	switch (withOutParametters) {

	case "new-sap":
		$("#programs").addClass("active");
		break;
	case "new-project-sap":
		$("#programs").addClass("active");
		break;
	case "dashboard":
		$("#dash").addClass("active");
		renderTab5();
		// $(".dashboard-overview-tab li").on("click", toggleOverviewTab);
		// $("#cancel-dashboard-search").on("click", cancelDashboardSearch);
		// bindSerachFunction();
		break;
	case "report-tool":
		$("#dash").addClass("active");
		renderTab5();

		break;
	case "road-map":
		$("#roadmap").addClass("active");
		$('.loader').css('display', 'block');
		break;
	case "reset-password":
		$("#profile").addClass("active");
		break;
	case "new-subtask":
		$("#programs").addClass("active");
		break;
	case "edit-subtask":
		$("#programs").addClass("active");
		break;
	case "save-subTask":
		$("#programs").addClass("active");
		break;
	case "track-program":
		$("#programs").addClass("active");
		break;
	case "programs":
		$("#programs").addClass("active");
		break;
	case "add-new-program":
		$("#programs").addClass("active");
		break;
	case "edit-program":
		$("#programs").addClass("active");
		break;
	case "program-details":
		$("#programs").addClass("active");
		break;
	case "project-task-details":
		$("#programs").addClass("active");
		break;
	case "show-baseline":
		$("#programs").addClass("active");
		break;
	case "new-sap":
		$("#programs").addClass("active");
		break;
	case "add-new-project":
		$("#programs").addClass("active");
		break;
	case "risk-management":
		$("#programs").addClass("active");
		break;
	case "edit-risk":
		$("#programs").addClass("active");
		break;
	case "add-risk":
		$("#programs").addClass("active");
		break;
	case "edit-project":
		$("#programs").addClass("active");
		break;
	case "timesheet":
		// $("#programs").addClass("active");
		$(".top_part_right li a").removeClass("active-top");
		$("#timesheet_id").addClass("active-top");
		break;
	case "new-task":
		$("#programs").addClass("active");
		break;
	case "task-edit":
		$("#programs").addClass("active");
		break;
	case "project-details":
		$("#programs").addClass("active");
		break;
	case "new-member":
		$("#programs").addClass("active");
		break;
	case "employee":
		$("#profile").addClass("active");
		$(".dash_right_data_2:odd").addClass("dash_right_data_2_odd");
		break;

	case "edit-users-skills":
		$("#profile").addClass("active");
		$(".dash_right_data_2:odd").addClass("dash_right_data_2_odd");
		break;
	case "change-profile-image":
		$("#profile").addClass("active");
		break;

	case "edit-users-profile":
		$("#profile").addClass("active");
		$(".dash_right_data_2:odd").addClass("dash_right_data_2_odd");
		break;

	case "overview":
		$(".top_part_right li a").removeClass("active-top");
		$("#maintenance_id").addClass("active-top");
		break;
	case "historic-overview":
		$(".top_part_right li a").removeClass("active-top");
		$("#maintenance_id").addClass("active-top");
		break;
	case "add-project-type":
		$(".top_part_right li a").removeClass("active-top");
		$("#maintenance_id").addClass("active-top");
		break;
	case "edit-project-type":
		$(".top_part_right li a").removeClass("active-top");
		$("#maintenance_id").addClass("active-top");
		break;
	case "project-type-template":
		$(".top_part_right li a").removeClass("active-top");
		$("#maintenance_id").addClass("active-top");
		break;
	case "new-generic-task":
		$(".top_part_right li a").removeClass("active-top");
		$("#maintenance_id").addClass("active-top");
		break;
	case "edit-generic-task":
		$(".top_part_right li a").removeClass("active-top");
		$("#maintenance_id").addClass("active-top");
		break;
	case "add-predefined-task":
		$(".top_part_right li a").removeClass("active-top");
		$("#maintenance_id").addClass("active-top");
		break;
	case "edit-predefined-task":
		$(".top_part_right li a").removeClass("active-top");
		$("#maintenance_id").addClass("active-top");
		break;
	case "add-new-user":
		$(".top_part_right li a").removeClass("active-top");
		$("#employees_id").addClass("active-top");
		break;
	case "user-management":
		$(".top_part_right li a").removeClass("active-top");
		$("#employees_id").addClass("active-top");
		$(".dash_right_data_2:odd").addClass("dash_right_data_2_odd");
		break;
	case "edit-user":
		$(".top_part_right li a").removeClass("active-top");
		$("#employees_id").addClass("active-top");
		$(".dash_right_data_2:odd").addClass("dash_right_data_2_odd");
		break;
	case "upload-document":
		$(".top_part_right li a").removeClass("active-top");
		$("#documents_id").addClass("active-top");
		break;

	case "document-overview":
		$(".top_part_right li a").removeClass("active-top");
		$("#documents_id").addClass("active-top");
		break;

	}

	$(window).scroll(function() {
		if (!Slider.isPlaying)
			$("#dialog-box").hide();
	});

/*	$(".tab1").off("click").on("click", renderTab1);
	$(".tab2").off("click").on("click", renderTab2);
	$(".tab3").off("click").on("click", renderTab3);
	$(".tab4").off("click").on("click", renderTab4);*/
	$(".dashboard-tab1").off("click").on("click", renderTab5);

	$(".tab_new_pi").off("click").on("click", renderTabPIGraph);

	// $(".emp_edit").off("click").on("click", renderEditProfile);

	$(".setting").off("click").on("click", renderSetting);

	$(".show_tasks").off("click").on("click", renderShowTasks);
	
	$(".xshow_tasks").off("click").on("click", xrenderShowTasks);
	
	$(".openbox").off("click").on("click", openbox);

	$(".show_sub_task ").off("click").on("click", renderShowSubTasks);
	
	$(".show-alert").on("click",renderAlertDetails)

});

function openbox(){
	var _this = $(this);
	var p_id = _this.attr("id").split("_")[1];
	$("#sub_task_id").val(p_id);
	$("#divMyForm").dialog("open");
}
function xrenderShowTasks() {
	var _this = $(this);
	var p_id = _this.attr("id").split("_")[1];
	if ($("#xtask_list_" + p_id).is(':visible')) {
		$("#xtask_" + p_id).removeClass("show_tasks_up");
	} else {
		//$("#task_" + p_id).addClass("show_tasks_up");
	}
	$("#xtask_list_" + p_id).slideToggle();

}

function renderShowTasks() {
	var _this = $(this);
	var p_id = _this.attr("id").split("_")[1];
	if ($("#task_list_" + p_id).is(':visible')) {
		$("#task_" + p_id).removeClass("show_tasks_up");
	} else {
		//$("#task_" + p_id).addClass("show_tasks_up");
	}
	$("#task_list_" + p_id).slideToggle();

}

function renderShowSubTasks() {
	var _this = $(this);
	var m_id = _this.attr("id").split("_")[2];

	if ($("#sub_task_list_" + m_id).is(':visible')) {
		$("#sub_task_" + m_id).removeClass("show_sub_task_up");
	} else {
		$("#sub_task_" + m_id).addClass("show_sub_task_up");
	}
	$("#sub_task_list_" + m_id).slideToggle();
}

function renderSettingHover() {
	var count = 0;
	var NewIndex = 0;

	$(".setting_full")
			.hover(
					function() {
						if (count == 0) {
							if ($(".popup-div").is(":visible")) {
								$(this)
										.after(
												' <img id="user_go" src="/assets/frontend/images/arrow-up.png" />');
							} else {
								$(this)
										.after(
												' <img id="user_go" src="/assets/frontend/images/arrow-down.png" />');
							}

						}
						jQuery('.top_part_right').find('#user_go').each(
								function() {
									NewIndex++;
									if (NewIndex > 1)
										$(this).remove();
								});

						count++;
					}, function() {
						$("#user_go").remove();
					});

}

function renderMessageHover() {
	var count = 0;
	var NewIndex = 0;

	$(".message_full")
			.hover(
					function() {
						if (count == 0) {
							if ($(".popup-div").is(":visible")) {
								$(this)
										.after(
												' <img id="msg_go" src="/assets/frontend/images/arrow-up.png" />');
							} else {
								$(this)
										.after(
												' <img id="msg_go" src="/assets/frontend/images/arrow-down.png" />');
							}
						}
						jQuery('.top_part_right').find('#msg_go').each(
								function() {
									NewIndex++;
									if (NewIndex > 1)
										$(this).remove();
								});

						count++;
					}, function() {
						$("#msg_go").remove();
					});

}
function renderSetting() {
	var _this = $(this);
	if ($(".popup-div").is(":visible")) {
		$(".popup-div").slideUp(500);
		$(".popup-div").addClass("display-none");
	} else {

		var url = "/user-setting";
		$
				.get(
						url,
						function(data) {
							$(".popup-div").html(data);
							var h = $(document).height() + "px";
							$(".row-div").css("height", h);
							$(".popup-div").slideDown(1000);
							$(".popup-div").removeClass("display-none");
							$(".close-icon").off("click").on("click",
									renderCloseWindow);
							$(".update-pm").off("click").on("click",
									renderUpdatePMSetting);
							$('.chk-select').bind('change',
									renderCheckedProject);
							$(".p_details_list:even").addClass("pop_div_even");
							$(".p_details_list:odd").addClass("pop_div_odd");

							var availableTags = [];

							jQuery('.row-div').find('.p_details_list span')
									.each(
											function() {
												availableTags.push(AllTrim($(
														this).text()));
											});

							$.extend(
											$.ui.autocomplete.prototype,
											{
												_renderItem : function(ul, item) {

													var term = this.element
															.val(), html = item.label
															.replace(term,
																	"<span style='font-weight:bold; color:red;'>$&</span>");
													return $("<li></li>")
															.data(
																	"item.autocomplete",
																	item)
															.append(
																	$("<a></a>")
																			.html(
																					html))
															.appendTo(ul);
												}
											});

							$(".search-project").autocomplete({
								source : availableTags
							});

							$('.search-project').live('keypress', function(e) {
								var p = e.which;
								if (p == 13) {
									renderSeachProjects();
								}
							});
							var offset = $(".main").offset();

							$(".row-div").css("padding-left", "34px");
							var OSName = "Unknown OS";
							var browservalue = navigator.userAgent
									.toUpperCase();
							if (navigator.appVersion.indexOf("Win") != -1)
								OSName = "Windows";
							if (navigator.appVersion.indexOf("Mac") != -1)
								OSName = "MacOS";

							if (navigator.appVersion.indexOf("Mac") != -1) {
								// $(".popup-div").css("top","34px");

							}

						});
	}

}

function renderSeachProjects() {
	$(".p_listing").html("");
	var search = $(".search-project").val();
	var sdata = "search=" + search;
	var url = "/search-projects";
	$.get(url, sdata, function(data) {

		$(".p_listing").html(data);
		$(".p_details_list:even").addClass("pop_div_even");
		$(".p_details_list:odd").addClass("pop_div_odd");

		$(".update-pm").off("click").on("click", renderUpdatePMSetting);
		$('.chk-select').bind('change', renderCheckedProject);

	});

}

function renderMessages() {
	if ($(".popup-div").is(":visible")) {
		$(".popup-div").slideUp(1000);
		$(".popup-div").addClass("display-none");
	} else {
		var url = "/user-messages";
		$.get(url, function(data) {
			$(".popup-div").html(data);
			var h = $(document).height() + "px";
			$(".row-div").css("height", h);
			$(".popup-div").slideDown(1000);
			$(".popup-div").removeClass("display-none");
			$(".close-icon").off("click").on("click", renderCloseWindow);

		});
	}
}
/**
 * close setting poup
 */
function renderCloseWindow() {
	$(".popup-div").slideUp(1000);
	$(".popup-div").addClass("display-none");
}

/**
 * submit poup data
 */
function renderUpdatePMSetting() {
	var url = $("#myPMUpdate").attr("action");
	var sData = $('#myPMUpdate').serialize();
	$.post(url, sData, function(data) {
		if (data == "Success") {
			$(".popup-div").addClass("display-none");
			window.location.reload();
		}
	});

}

/**
 * check unchecked
 */
function renderCheckedProject() {
	var empty_id = "";
	jQuery('.row-div').find('.chk-select').each(function() {
		var _this = $(this);
		if ($(this).is(':checked')) {
			if (empty_id == "") {
				empty_id = _this.attr("name");
			} else {
				empty_id = empty_id + ", " + _this.attr("name");
			}
		}

	});
	$("#pId").val(empty_id);
}

function renderCheckedProject() {
	var empty_id = "";
	jQuery('.row-div').find('.chk-select').each(function() {
		var _this = $(this);
		if ($(this).is(':checked')) {
			if (empty_id == "") {
				empty_id = _this.attr("name");
			} else {
				empty_id = empty_id + ", " + _this.attr("name");
			}
		}

	});
	$("#pId").val(empty_id);

}

function renderTabPIGraph() {
	var url = "/tab-pi-chart?t=" + Date.now();
	$.get(url, function(data) {
		$(".content-box-content").html(data).show().slideDown(9000);
		jQuery('.content-box-tabs').find('a').removeClass("current");
		$(".tab_new_pi").addClass("current");
		$("#spi-pie-graph").live("click", renderSPIchart);
		$("#cpi-pie-graph").live("click", renderCPIchart);
		$("#spi-pie-graph").trigger("click");
		
	});

}

function renderSPIchart() {
	var json_response_spi = $("#json_response_spi1").val();
	if(typeof json_response_spi != 'undefined'){
		var obj = JSON.parse(json_response_spi);
		$('#spi-pie-graph').addClass('pie-btn-class');
		$('#cpi-pie-graph').removeClass('pie-btn-class');
		$('#view-label').text('');
		$('#view-label').text('SPI CHART');
		$(".project_list").html("");
		var riskLbl = $("#riskLabelstatus").val();
		var chart = AmCharts
				.makeChart(
						"chartdiv",
						{
							"type" : "pie",
							"theme" : "dark",
							//"depth3D": 20,
							"colors" : [ "#33cc33", "#F4D47A", "#FF9E01", "#FF0000"],

							"dataProvider" : [ {
								"status" : "On Track",
								"value" : obj.on_track,
								"description" : obj.on_track_prog_id
							}, {
								"status" : "Slightly Less",
								"value" : obj.delay_10_per,
								"description" : obj.delay_10_prog_id
							}, {
								"status" : riskLbl,
								"value" : obj.delay_20_per,
								"description" : obj.delay_20_prog_id
							}, {
								"status" : "In Danger",
								"value" : obj.delay_40_per,
								"description" : obj.delay_40_prog_id
							} ],
							"legend" : {
								"markerType" : "circle"
							},
							"valueField" : "value",
							"pullOutOnlyOne" : true,
							"titleField" : "status",
							"balloonText" : "[[title]]<br><span style='font-size:14px;'><b>[[value]]</b> ([[percents]]%)</span>"
						});
		
		// add click listener
		chart.addListener(
						"pullOutSlice",
						function(event) {
							$(".project_list ").removeClass('display-none');
							var program_id_list = chart.dataProvider[event.dataItem.index].description;
							url = "/pie-show-programs-list?program_id_list="
									+ program_id_list;
							$.get(url, function(data) {
								$(".project_list ").html(data);
								$('html, body').animate({scrollTop:$(document).height()}, 3000);
							});
						});
		chart.addListener("pullInSlice", function(event) {
			  $('html, body').animate({scrollTop:0},3000);
			$(".project_list ").addClass('display-none');
		});

		$('.amChartsLegend').on('click',function(){
			$('.amcharts-chart-div').find('a').remove();
	     });
	 $('.amcharts-chart-div').find('a').css('display','none');
	}else{
		$(".tab_new_pi").addClass("current");
	}
	
}



function renderCPIchart() {
	$('#cpi-pie-graph').addClass('pie-btn-class');
	$('#spi-pie-graph').removeClass('pie-btn-class');
	$('#view-label').text();
	$(".project_list").html("");
	$('#view-label').text('CPI CHART');
	var json_response_cpi = $("#json_response_cpi1").val();
	var obj2 = JSON.parse(json_response_cpi);
	var chart2 = AmCharts
			.makeChart(
					"chartdiv",
					{
						"type" : "pie",
						"theme" : "dark",
						//"depth3D": 20,
						"colors" : [ "#33cc33", "#F4D47A", "#FF9E01", "#FF0000" ],
						"dataProvider" : [ {
							"status" : "On Track",
							"value" : obj2.on_track_cpi,
							"description" : obj2.on_track_prog_id_cpi
						}, {
							"status" : "Slightly Less",
							"value" : obj2.delay_10_per_cpi,
							"description" : obj2.delay_10_prog_id_cpi
						}, {
							"status" : "Risk",
							"value" : obj2.delay_20_per_cpi,
							"description" : obj2.delay_20_prog_id_cpi
						}, {
							"status" : "In Danger",
							"value" : obj2.delay_40_per_cpi,
							"description" : obj2.delay_40_prog_id_cpi
						} ],
						"legend" : {
							"markerType" : "circle"
						},
						"valueField" : "value",
						"pullOutOnlyOne" : true,
						"titleField" : "status",
						"balloonText" : "[[title]]<br><span style='font-size:14px;'><b>[[value]]</b> ([[percents]]%)</span>"
					});

	// add click listener for cpi chart
	chart2.addListener(
					"pullOutSlice",
					function(event) {
						$(".project_list ").removeClass('display-none');
						var program_id_list = chart2.dataProvider[event.dataItem.index].description;
						url = "/pie-show-programs-list?program_id_list="
								+ program_id_list;
						$.get(url, function(data) {
							$(".project_list ").html(data);
							$('html, body').animate({scrollTop:$(document).height()}, 3000);
						});
					});
	chart2.addListener("pullInSlice", function(event) {
		$(".project_list ").addClass('display-none');
	    $('html, body').animate({scrollTop:0},3000);
	});

	$('.amChartsLegend').on('click',function(){
		$('.amcharts-chart-div').find('a').remove();
     });
	$('.amcharts-chart-div').find('a').remove();
}


function renderTab1() {
	var url = "/tab-finance";
	$.get(url, function(data) {
		$(".content-box-content").html(data).show().slideDown(9000);
		jQuery('.content-box-tabs').find('a').removeClass("current");
		$(".tab1").addClass("current");
		$('.customStyleSelectBox').customStyle();
	});

}

function renderTab2() {
	var url = "/tab-employee";
	$.get(url, function(data) {
		$(".content-box-content").html(data).show().slideDown(9000);
		jQuery('.content-box-tabs').find('a').removeClass("current");
		$(".tab2").addClass("current");

		$('.customStyleSelectBox').customStyle();
	});

}

function renderTab3() {
	var url = "/tab-products";
	$.get(url,
			function(data) {
				$(".content-box-content").html(data).show().slideDown(9000);
				jQuery('.content-box-tabs').find('a').removeClass("current");
				$(".tab3").addClass("current");

				$(".dash_left_detail_1_data:even").addClass(
						"dash_left_detail_1_data2");

			});

}

function renderTab4() {
	var url = "/tab-other";
	$.get(url, function(data) {
		$(".content-box-content").html(data).show().slideDown(9000);
		jQuery('.content-box-tabs').find('a').removeClass("current");
		$(".tab4").addClass("current");
	});

}

function bindSerachFunction() {
	// $(".dashboard-tab1").on("click", showDashboard);
	// $(".dashboard-tab2").on("click", showSearchDashboard);
}

function toggleOverviewTab() {
	if (!($(this).find(":first-child").hasClass("current"))) {
		selectedOverviewTab = $(this).find(":first-child");
		$(".dashboard-overview-tab li").each(function() {
			$(this).find(":first-child").removeClass('current');
		});

		var selectedOverviewTabClass = $(selectedOverviewTab).attr("class");
		if (selectedOverviewTabClass == 'dashboard-tab2') {
			$(".focus_on").slideDown();
		} else if (selectedOverviewTabClass == 'dashboard-tab1') {
			// callApi("/document-overview-listing", null, "GET",
			// documentOverviewCallback);
			$('.focus_on_title').css('display', 'none');
			$(".focus_on").slideUp();
		}
		$(selectedOverviewTab).addClass('current');

	}
}

function cancelDashboardSearch() {
	// callApi("/document-overview-listing", null, "GET",
	// documentOverviewCallback);
	$('.focus_on_title').css('display', 'none');
	$(".focus_on").slideUp();
	$(".dashboard-overview-tab .dashboard-tab1").addClass('current')
	$(".dashboard-overview-tab .dashboard-tab2").removeClass('current')
}

function renderTab5() {
	$('.loader').css('display', 'block');
	var url = "/tab-report?t=" + Date.now();
	 
	$.get(url, function(data) {
		$(".content-box-content").html(data);
		$('.loader').css('display', 'none');
		//$('.tab_new_pi').removeClass("current");
		$(".dashboard-overview-tab li").find("a").removeClass("current");
		 $(".dashboard-tab1").addClass("current");
		//$(".show-projects").on("click", renderProjectReport);
		
		 var items = $("#dashboard-report .rows-child");

		var numItems = items.length;
		if (numItems > 20) {
			//$('#task_items').css('display', 'block');
			var perPage = 20;

			items.slice(perPage).hide();
			$("#task_items").pagination(
					{
						items : numItems,
						itemsOnPage : perPage,
						cssStyle : "light-theme",
						onPageClick : function(pageNumber) { // this is where the magic happens
							// someone changed page, lets hide/show trs appropriately

							var showFrom = perPage
									* (pageNumber - 1);
							var showTo = showFrom + perPage;

							items.hide() // first hide everything, then show for the new page
							.slice(showFrom, showTo).show();
							
						}
					});
		} else if (numItems === 0) {
			//$('#emp_list_item').css('display', 'none');
		}
		
		
		
		
		
		// bindSerachFunction();
	});

}



function renderProjectReport() {
	$('.loader').css('display', 'block');
	var _this = $(this);
	var id = _this.attr("id").split("_")[1]

	window.location.href = "/program-details/" + id;
	/*
	 * var url = "/tab-project-report?id=" + id; $.get(url, function(data) {
	 * $(".content-box-content").html(data); $('.loader').css('display',
	 * 'none'); $('.content-box-tabs').find('a').removeClass("current");
	 * $(".tab5").addClass("current"); $(".show-projects").on("click",
	 * renderProjectReport); });
	 */

}

function showSearchDashboard() {
	$('.loader').css('display', 'block');
	if (!$("#dashboard-tab2").hasClass("current")) {
		var url = "/dashboard-search?t="+Date.now();
		$.get(url, function(data) {
			$(".content-box-content").html(data);
			$('.loader').css('display', 'none');
			$(".focus_on").css("display", "block");
			$("#dashboard-tab2").addClass("current");
			//$("#dashboard-tab1").removeClass("current");
			$("#search-report-form").on("click", renderSearchReportSubmit);
			$("#cancel-dashboard-search-report").on("click",
					renderCancelSearchDashboard);
		});
	}
	$('.loader').css('display', 'none');

}

function showSearchProgram() {
	$('.loader').css('display', 'block');
	if (!$("#program-tab2").hasClass("current")) {
		var url = "/program-search";
		$.get(url, function(data) {
			$(".content-box-content").html(data);
			$('.loader').css('display', 'none');
			$(".focus_on").css("display", "block");
			$("#program-tab2").addClass("current");
			$("#program-tab1").removeClass("current");
			$("#program-search-form").on("click", renderSearchProgramSubmit);
			$("#cancel-program-search-report").on("click", function() {
				window.location.reload();
			});
		});
	}
	$('.loader').css('display', 'none');

}

function showSearchAlert() {

	$('.loader').css('display', 'block');
	if (!$("#alert-tab2").hasClass("current")) {
		var url = "/alert-search";
		$.get(url, function(data) {
			$(".content-box-content").html(data);
			$('.loader').css('display', 'none');
			$(".focus_on").css("display", "block");
			$("#alert-tab2").addClass("current");
			$("#program-tab1").removeClass("current");
			//$("#program-search-form").on("click", renderSearchAlertSubmit);
			$("#cancel-program-search-report").on("click", function() {
				window.location.reload();
			});
		});
	}
	$('.loader').css('display', 'none');

}

function showSearchGenericProject() {

	$('.loader').css('display', 'block');
	if (!$("#overview-tab2").hasClass("current")) {
		var url = "/form-project-search";
		$.get(url, function(data) {
			$(".content-box-content").html(data);
			$('.loader').css('display', 'none');
			$(".focus_on").css("display", "block");
			$("#overview-tab2").addClass("current");
			$("#program-tab1").removeClass("current");
			$("#cancel-program-search-report").on("click", function() {
				window.location.reload();
			});
		});
	}
	$('.loader').css('display', 'none');

}

function showSearchGenericTask() {

	$('.loader').css('display', 'block');
	if (!$("#overview-tab3").hasClass("current")) {
		var url = "/form-task-search";
		$.get(url, function(data) {
			$(".content-box-content").html(data);
			$('.loader').css('display', 'none');
			$(".focus_on").css("display", "block");
			$("#overview-tab3").addClass("current");
			$("#program-tab1").removeClass("current");
			$("#cancel-program-search-report").on("click", function() {
				window.location.reload();
			});
		});
	}
	$('.loader').css('display', 'none');

}

function renderCancelSearchDashboard() {
	// renderTab5();
	$('.loader').css('display', 'block');
	var url = "/tab-report?t=" + Date.now();
	$.get(url, function(data) {
		$(".content-box-content").html(data);
		$('.loader').css('display', 'none');
		// jQuery('.content-box-tabs').find('a').removeClass("current");
		// $(".tab5").addClass("current");
		$(".show-projects").on("click", renderProjectReport);
		$("#dashboard-tab1").addClass("current");
		$("#dashboard-tab2").removeClass("current");
		// bindSerachFunction();
	});
}

function renderCancelSearchProgram() {

	window.location.reload();
	// renderTab5();
	/*
	 * $('.loader').css('display', 'block'); var url = "/program-listing?t=" +
	 * Date.now(); $.get(url, function(data) { $('.loader').css('display',
	 * 'none'); $(".content-box-content").html(data); //
	 * jQuery('.content-box-tabs').find('a').removeClass("current"); //
	 * $(".tab5").addClass("current"); //$(".show-projects").on("click",
	 * renderProjectReport); $("#program-tab1").addClass("current");
	 * $("#program-tab2").removeClass("current"); // bindSerachFunction(); });
	 */
}

function getTaskDetails(taskId) {
	$('.leftPanel').find('.fn-label').each(function() {
		$("#" + $(this).attr('id')).removeClass("selected-task");

	});
	var detailType = parseInt($("#pDetailType").val());

	var sdata = "";
	var url = "";
	$(".team_task_div").html("");
	sdata = "id=" + taskId + "&type=" + detailType;
	url = "/get-task-details?t=" + Date.now();
	$("#row_" + taskId).addClass("selected-task");
	$.get(url, sdata, function(data2) {
		var divCount = 0;
		$(".team_task_div").html(data2);
		$("#p_page").find(".team_task_div").each(function() {
			$(".team_task_div").addClass("team_task_div_change");
			divCount = divCount + 1;
		});

		$(".design_team_left_detail_1_data_1:even").addClass(
				"design_team_left_detail_odd");
		$(".design_team_left_detail_1_data_1:even").removeClass(
				"design_team_left_detail_1_data_1");
		$(".edit_actual_end_date_final").on("click", editActualEndDateFinal);
		
		/*$(".planned_hours").datepicker({
			buttonImageOnly : true,
			dateFormat : "dd-mm-yy",
			changeMonth : true,
			changeYear : true
		});*/
		var delay = 200;
		setTimeout(function() {
			renderAllocationList(taskId);
		}, delay);
	});

}

function editActualEndDateFinal(){
	//e.preventDefault();
	var _this = $(".edit-hours");
	if($(".planned_hours").hasClass("add-border")==false){
		//$(".planned_hours").removeClass("add-border");
		_this.addClass("update-hours");
		$(".planned_hours").addClass("add-border");
		$(".planned_hours").attr('readonly', false);
		$(".planned_hours").attr('disabled', false);
		var maxD = $("#task_end_date").val().replace(/-/g, '/');
		$(".planned_hours").datepicker({
					minDate : new Date(),
					maxDate : new Date(maxD),
					dateFormat : "dd-mm-yy"
		});
		
		$("#jquery-ui").attr("disabled", "disabled");
		$("#ui-datepicker-div").css("float", "left");
		$(".edit_actual_end_date_final").css("margin-top","13px");
		$(".update-hours").bind("click",renderSubmitActualEndDateFinal);
		
	}else{
		$(".planned_hours").removeClass("add-border");
		//$(".planned_hours").addClass("add-border");
		_this.removeClass("update-hours");
		$(".planned_hours").attr('readonly', true);
		$(".planned_hours").attr('disabled', true);
		$("#jquery-ui").removeAttr("disabled");
		$(".edit_actual_end_date_final").css("margin-top","20px");
		$(".update-hours").unbind();
		
	}
}

function renderSubmitActualEndDateFinal(){
	//alert(1);
	var _this =$(".edit_actual_end_date_final");
	var newid = _this.attr("id").split("_")[1];
	var date_string =$(".planned_hours").val();
	var url = "/update-actual-end-date-final?id="+newid+"&date_string="+date_string;
	$.post(url, function(data) {
		var json = $.parseJSON(data);
		if(json.status == "Fail"){
			alert(json.message);
		}
		var _new_this = $(".edit-hours");
		_new_this.removeClass("update-hours");
		$(".planned_hours").attr('readonly', true);
		$(".planned_hours").attr('disabled', true);
		$("#jquery-ui").removeAttr("disabled");
		$(".edit_actual_end_date_final").css("margin-top","20px");
		$(".update-hours").unbind();
		$(".edit_actual_end_date_final").unbind();
		$(".edit_actual_end_date_final").on("click", editActualEndDateFinal);
	});
}

function cancelSubmitActualEndDateFinal(){
	//alert(2);
}


function milestoneId(element, id) {
	var sdata = "id=" + id;
	$(".multiple_icn").find('img').removeClass('relativePostion');
	$("#" + id).addClass('relativePostion');
	var url = "";
	url = "/milestone-other-details?t=" + Date.now();
	$.get(url, sdata, function(data) {
		$("#teamhistory").html(data);
		$(".no-subtask").html("");
		var $div = $('div.team_task_div');

		if ($div.length > 1) {
			$div.not(':last').remove()
		}

		var delay = 200;
		setTimeout(function() {
			var count = 0;
			$('.leftPanel').find('.fn-label').each(function() {
				if (count == 0) {
					$("#" + $(this).attr('id')).trigger("click");
				}
				count++;
			});
		}, delay);

	});

	$('#scroll_up').removeClass('display-none');

}

function renderEditProfile() {
	var uId = $("#uId").val();
	if (uId != "") {

		var url = "/edit-employee?uId=" + uId + "&t=" + Date.now();
		$
				.get(
						url,
						function(data) {
							$(".emp-edit-info").html(data);
							$(".emp-edit-info").slideDown(2000);

							$(".update-skills").off("click").on("click",
									renderUpdateSkills);
							$(".cancel-profile").off("click").on("click",
									renderCancelSkillsUpdate);

							// $(".emp-edit-info").removeClass("display-none");
							$(".emp_detail_description").addClass(
									"display-none");
							var delay = 500;
							setTimeout(function() {
								var url = "/skill-list?uId=" + uId + "&t="
										+ Date.now();
								$.get(url, function(data) {
									$(".skill-list").html(data);
									$(".skill-list").slideDown(2000);
									$(".dash_right_data_2:odd").addClass(
											"dash_right_data_2_odd");
									$('.customStyleSelectBox').customStyle();
								});

							}, delay);

							$.validator.addMethod("trueUser", function(value) {
								var uId = $("#uId").val();
								var url = "/check-user-name?uname=" + value
										+ "&uId=" + uId;
								var valid = false;
								$.get(url, function(data) {
									if (data == "true") {
										valid = true;
									}
								});
								return valid;
							});

							$('#myemployeeUpdate')
									.validate(
											{
												errorElement : 'span',
												submitHandler : function(form) {
													renderUpdateProfile();
												},
												rules : {
													first_name : {
														required : true,
														maxlength : 60
													},
													last_name : {
														required : true,
														maxlength : 60
													},
													uname : {
														required : true,
														maxlength : 60
													},
													birth_date : {
														required : true
													},
													joining_date : {
														required : true
													},
													email : {
														required : true
													}

												},
												messages : {
													first_name : {
														required : "Please enter first name.",
														maxlength : "Title should be less than 60 characters."
													},
													last_name : {
														required : "Please enter last name.",
														maxlength : "Title should be less than 60 characters."
													},
													uname : {
														required : "Please enter user name.",
														maxlength : "User name should be less than 60 characters."
													},
													birth_date : {
														required : "Please select birth date."
													},
													joining_date : {
														required : "Please select join date."
													},
													email : {
														required : "Please enter email address."
													}
												}

											});
						});
	}
}

function renderUpdateProfile() {
	var url = $("#myemployeeUpdate").attr("action");
	var sData = $('#myemployeeUpdate').serialize();
	$.post(url, sData, function(data) {
		if (data == "Success") {
			window.location.reload();
		}
	});

}

function AllTrim(x) {
	return x.replace(/^\s+|\s+$/gm, '');
}

function renderEditSkills() {
	var uId = $("#uId").val();

	if (uId != "") {
		var url = "/edit-skills?uId=" + uId;
		$.get(url, function(data) {
			$(".emp-edit-info").html(data);
			$(".emp-edit-info").slideDown(2000);
			$("#skill").addClass("dd");
			$(".update-skills").off("click").on("click", renderUpdateSkills);
			$(".cancel-profile").off("click").on("click",
					renderCancelSkillsUpdate);
			// $(".emp-edit-info").removeClass("display-none");
			$(".emp_detail_description").addClass("display-none");

		});

	}
}

function onLoadSkills(id) {
	if (id != "") {
		setTimeout(function() {
			var url = "/skill-list?uId=" + id + "&t=" + Date.now();
			$.get(url, function(data) {
				$(".skill-list").html(data);
				$(".dash_right_data_2:odd").addClass("dash_right_data_2_odd");
			});
		});
	}
}

function renderUpdateSkills() {
	var skill_id = $("#skill").val();
	if (skill_id != "") {
		var url = $("#mySkillUpdate").attr("action");

		var sData = $('#mySkillUpdate').serialize();
		$.post(url, sData, function(data) {

			if (data != "fails") {
				var uId = data;
				var delay = 500;
				setTimeout(function() {
					var url = "/skill-list?uId=" + uId + "&t=" + Date.now();
					$.get(url, function(data) {
						$(".skill-list").html(data);
						alert("Skill  updated.");
						$(".skill-list").slideDown(2000);
						$(".dash_right_data_2:odd").addClass(
								"dash_right_data_2_odd");

					});

				}, delay);

			}
		});
	}

}

function renderCancelSkillsUpdate() {
	window.location.reload();
}

function renderRoadmapProgramList() {
	var _this = $(this);
	var division = _this.val();
	var url = "/get-program-list?division=" + division;
	$.get(url, function(data) {
		$("#roadmap-program").html(data);
		$("#roadmap-type").val("division");
		$("#roadmap-projects").html(
				"<option value=''>--Select Project--</option>");
		onLoadRoadMap();

	});
	// $("#roadmap-program").html("<option value=''>--Select
	// Program--</option>");
	// $("#roadmap-projects").html("<option value=''>--Select
	// Project--</option>");
	// $("#roadmap-type").val("none");
	// onLoadRoadMap();
	// $("#roadmap-program").next().find(".customStyleSelectBoxInner").html("--Select
	// Program--");
	// $("#roadmap-projects").next().find(".customStyleSelectBoxInner").html("--Select
	// Project--");
}

function renderRoadmapProjectList() {
	var _this = $(this);
	var program_id = _this.val();
	/* if(program_id!=""){ */
	var url = "/get-roadmap-project-list?programid=" + program_id;
	$.get(url, function(data) {
		$("#roadmap-projects").html(data);
		$("select #roadmap-projects").prop('selectedIndex', 0);
		$("#roadmap-type").val("program");
		onLoadRoadMap();
	});
	/*
	 * }else{ $("#roadmap-type").val("division"); onLoadRoadMap(); }
	 */
	// $("#roadmap-projects").next().find(".customStyleSelectBoxInner").html("--Select
	// Project--");
}

function renderRoadmapProjectDetails() {
	var pValue = $("#roadmap-projects").val()
	if (pValue != "") {
		$("#roadmap-type").val("project");
	} else {
		$("#roadmap-type").val("program");
	}

	onLoadRoadMap();

}

function renderSearchReportSubmit() {
	var url = "/dashboard-search"
	$.ajax({
		url : url,
		type : "POST",
		cache : false,
		data : $("#search-document-form").serialize(),
		dataType : "html",
		success : function(data) {
			$("#search-result").html(data)
			$(".show-projects").on("click", renderProjectReport);
		},
		error : function() {
			alert("alertSomethingWentWrong");
		}
	});

}

/*
function renderSearchAlertSubmit() {

	$('.loader').css('display', 'block');


	var url = "/alert-search-result"
	var params = $("#search-program-form").serialize()

	$.ajax({
		url : url,
		type : "POST",
		cache : false,
		data : $("#search-program-form").serialize(),
		dataType : "html",
		success : function(data) {
			//$("#search-result").html(data)
			 var blob=new Blob([data]);
			download(blob,'informe.xlsx','application/vnd.ms-excel')
			$('#search_program_id').css("display", "none");
			$('#alert-tab2').removeClass('current');
			$('.loader').css('display', 'none');
		},
		error : function() {
			alert("alertSomethingWentWrong");
			$('.loader').css('display', 'none');
		}
	});
}
*/
function renderSearchProgramSubmit() {

	$('.loader').css('display', 'block');
	var url = "/program-search"
	$.ajax({
		url : url,
		type : "POST",
		cache : false,
		data : $("#search-program-form").serialize(),
		dataType : "html",
		success : function(data) {
			$("#search-result").html(data)
			$('#search_program_id').css("display", "none");
			$('#program-tab2').removeClass('current');
			$('.loader').css('display', 'none');
		},
		error : function() {
			alert("alertSomethingWentWrong");
			$('.loader').css('display', 'none');
		}
	});

}

function renderUpdateProfileRoleMapping(){
	var _this = $("#role_id");
	var role = _this.val();
	var user_id = $("#user_id").val()
	
	if(typeof role != 'undefined' || role !=""){
		var url = "/user-profile-roles?user_id=" + user_id+"&role_id="+role;
		$.post(url, function(data) {
			var json = $.parseJSON(data);
			if(json.status == "Sucess"){
				window.location.reload();
			}
		});
	}
}

function renderRemoveProfileRole(){
	var _this = $(this);
	var id = _this.attr("id").split("_")[1];
	
	if(typeof id != 'undefined' || id !=""){
		var url = "/remove-profile-roles?id=" + id
		$.post(url, function(data) {
			var json = $.parseJSON(data);
			if(json.status == "Sucess"){
				window.location.reload();
			}
		});
	}
	
}
function renderAlertDetails(){
	var _this = $(this);
	var id = _this.attr("id").split("_")[1];
	if($("#ad_"+id).hasClass("oculto")){
		$("#ad_"+id).slideDown(1000);
		$("#ad_"+id).removeClass("oculto");
	}else{
		$("#ad_"+id).slideUp(1000);
		$("#ad_"+id).addClass("oculto");
	}
}

function renderRemoveSkill(){
	var _this  =  $(this).attr("id");
	var id = _this.split("_")[1];
	var uId = $("#uId").val();
	$("#dialog-confirm").html("¿Quieres eliminar esta habilidad");
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

				var url = "/delete-skill/" + id+"/"+uId;;
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
}