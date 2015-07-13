/**
 * Created by Balkrishna Date: 17/10/2014
 */
var isSearchTemplateOpen;
var selectedTab;
var selectedOverviewTab;
var selectedOverviewTabClass;
var selectedParentType;
var selectedDivisionId;

$(document).ready( function() {
	$("#docuement-overview div").on("click", renderDocumentView);
	$('#search-document-form').on('submit', submitSerachDocumentForm);
	$('.focus_on_title').on('click', toggleSearchIcon);
	$("#program").on('change', getProjectList);
	$("#project").on('change', getTaskList);
	$("#task").on('change', getSubTaskList);
	$("#search-result-tab li").on("click", toggleTab);
	$("#document_overview_tab li").on("click", toggleOverviewTab);
	$("#cancel-document-search").on("click", cancelDocumentSearch);
	$("#cancel-document").on("click", cancelDocumentUpload);
	$(".delete-doc").on("click", deleteDocument);
	$("#upload-division-doc").on("click", uploadDivisionDoc);
	bindTooltipForDocument();
});

function uploadDivisionDoc(){
	if(selectedDivisionId != null && selectedDivisionId != ""){
		var url = "/upload-document/" + selectedDivisionId + "/DIVISION/ADD"
		$(this).attr("href", url);
	}
	return true;
}

function deleteDocumentSubtask(e){
	e.preventDefault();
	var classes = $(this).attr("class");
	var splittedClasses = classes.split(" ");
	var docId = splittedClasses[1];
	var urlString = $(this).attr("href");
	var self = $(this);
	
	$("#dialog-confirm").html("Do you want to delete this subtask Document?");	
	$("#pop-box-over").css("display", "block");
	$("#dialog-confirm").css("display", "block");
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
				$.ajax({
					url : urlString,
					type : "GET",
					cache : false,
					dataType : "html",
					async : false,
					success : function(data) {
				
						if($(".current-doc-listing-subtask").length >= 1){
							if($(".prev-doc-listing-subtask-"+docId).length > 0 ){
								$(".prev-doc-listing-subtask-"+docId).each(function(index, item){
									if(index == 0){
										$(item).find(".update-doc-subtask").css("display", "block");
										$(item).find(".delete-doc-subtask").css("display", "block");
										$(self).parent().parent().html($(item).html());
										$(item).slideUp(function(){
											$(this).remove();
										})
										$(".delete-doc-subtask").unbind("click", deleteDocumentSubtask);
										$(".delete-doc-subtask").bind("click", deleteDocumentSubtask);
									}
								});
							}else{
								$(self).parent().parent().slideUp(function(){
									$(this).remove();
									if($(".current-doc-listing-subtask").length == 0){
										$(".doc_listing_subtask").html("<h2 class='left push-top20px no-document'> No hay documentos disponibles para Sub-Tarea seleccionado</h2>");
									}
								});
							}
						}else {
							$(".doc_listing_subtask").html("<h2 class='left push-top20px no-document'> No hay documentos disponibles para Sub-Tarea seleccionado</h2>");
						}
						if($(".current-doc-listing-subtask").length == 0 && data=='Success'){
							window.location.reload();
						}
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

function deleteDocument(e){
	e.preventDefault();
	var classes = $(this).attr("class");
	var splittedClasses = classes.split(" ");
	var docId = splittedClasses[1];
	var urlString = $(this).attr("href");
	var parent_type = $(this).attr("id").split("_")[0];
    //alert(parent_type);
	var self = $(this);
	$("#dialog-confirm").html("Do you want to delete this Document?");	
	$("#pop-box-over").css("display", "block");
	$("#dialog-confirm").css("display", "block");
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
				$.ajax({
					url : urlString,
					type : "GET",
					cache : false,
					dataType : "html",
					async : false,
					success : function(data) {
						if($(".current-doc-listing").length >= 1){
							if($(".prev-doc-listing-"+docId).length > 0 ){
								$(".prev-doc-listing-" + docId).each(function(index, item){
									if(index == 0){
										$(item).find(".update-doc").css("display", "block");
										$(item).find(".delete-doc").css("display", "block");
										$(self).parent().parent().html($(item).html());
										$(item).slideUp(function(){
											$(this).remove();
										})
										$(".delete-doc").unbind("click", deleteDocument);
										$(".delete-doc").bind("click", deleteDocument);
									}
								});
							}else{
								$(self).parent().parent().slideUp(function(){
									$(this).remove();
									if($(".current-doc-listing").length == 0){
										$(".doc_listing").html("<h2 class='left push-top20px no-document'> No hay documentos disponibles para "+parent_type+" seleccionado</h2>");
									}
								});
							}
						}else {
							$(".doc_listing").html("<h2 class='left push-top20px no-document'> No hay documentos disponibles para "+parent_type+" seleccionado</h2>");
						}
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

function bindTooltipForDocument(){
	$('.doc_info').powerTip({
		placement: 'ne', // north-east tooltip position
		mouseOnToPopup: true
	});
	
	$('.doc_view').powerTip({
		placement: 'ne' // north-east tooltip position
	});
	
	$('.doc_edit').powerTip({
		placement: 'ne' // north-east tooltip position
	});
	
}

function renderDocumentView(){
	var _this = $(this);
	var myId = _this.attr("id");
	if(myId){
		var dType = myId.split("_");
		//alert(dType[0]+" "+dType[1]);
		switch(dType[0]) {
			case "div":
				$("#new-division-doc-upload").css("display", "block");
				selectedParentType = "DIVISION";
				selectedDivisionId = dType[1];
				renderDocumentDisplay(dType[1], "DIVISION");
				$("#d_p_"+dType[1]).toggle();
				break;
			case "pro" :
				$("#new-division-doc-upload").css("display", "none");
				selectedParentType = "PROGRAM";
				renderDocumentDisplay(dType[1], "PROGRAM");
				$("#p_pr_"+dType[1]).toggle();
				break;
			case "pr" :
				$("#new-division-doc-upload").css("display", "none");
				selectedParentType = "PROJECT";
				renderDocumentDisplay(dType[1], "PROJECT");
				$("#t_"+dType[1]).toggle();
				break;
			case "ts" :
				$("#new-division-doc-upload").css("display", "none");
				selectedParentType = "TASK";
				renderDocumentDisplay(dType[1], "TASK");
				$("#s_"+dType[1]).toggle();
				break;
			case "st" :
				$("#new-division-doc-upload").css("display", "none");
				selectedParentType = "SUBTASK";
				renderDocumentDisplay(dType[1], "SUBTASK");
				break;
		
		}
		
		//$(".doc_view").on("click",renderDocumentDisplay)
		
	}
}
function cancelDocumentUpload(){
	window.history.back();
}
function renderDocumentDisplay(parent_id, parent_type){
	
	$(".loader").css("display", "block");
	var url = "/document-listing/" + parent_id + "/" + parent_type +"?t="+Date.now();
	$.get(url, function(data) {
		$(".document-right").html(data);
		$(".delete-doc").on("click", deleteDocument);
		bindTooltipForDocument()
	});
	$(".loader").css("display", "none");
}

function submitSerachDocumentForm(){
	callApi($(this).attr('action'), $(this).serialize(), "POST", searchResultSuccess);
	return false;
}

function searchResultSuccess(reponse){
	$("#search-result").html(reponse);
	bindTooltipForDocument();
	$(".delete-doc").on("click", deleteDocument);
	$("#search-result-form").on("submit", submitSearchReultForm);
	$('.search-form-wrapper').slideUp(1000, function(){
		$('.focus_on_title').css("margin", "-18px 0 0 820px");
		$('.focus_on_title').css("cursor", "pointer");
		isSearchTemplateOpen = true;
		$("#search-result-tab li").on("click", toggleTab);
	});
	$("#search-result").slideDown(500, function() {
		$("#search-result-tab li a").on("click", function(e){
			e.preventDefault();
		});
	});
}

function submitSearchReultForm(){
	var url = "/get-documents/";
	switch(selectedTab) {
	   case "division":
	    	url = url + "DIVISION";
	        break;
	    case "program":
	    	url = url + "PROGRAM";
	        break;
	    case "project":
	    	url = url + "PROJECT";
	        break;
	    case "task":
	    	url = url + "TASK";
	        break;
	    case "subtask":
	    	url = url + "SUBTASK";
	        break;
	    default:
	        break;
	}
	callApi(url, $(this).serialize(), "POST", toggleTabSuccess);
	return false;
}

function toggleSearchIcon(){
	if(isSearchTemplateOpen){
		$('.search-form-wrapper').slideDown(1000, function(){
			$('.focus_on_title').css("margin", "-18px 0 0 13px");
			$('.focus_on_title').css("cursor", "default");
			isSearchTemplateOpen = false;
		});
	}
}

function getProjectList(){
	callApi("/get-roadmap-project-list?programid=" + $("#program").val(), null, "GET", getProjectListSuccess);
	if($("#program").val() == ""){
		callApi("/search-task-list?projectId=", null, "GET", getTaskListSuccess);
		callApi("/search-subtask-list?taskId=", null, "GET", getSubTaskListSuccess);
	}
}

function getProjectListSuccess(response) {
	$("#project").html(response);
	bindTooltipForDocument();
	$("#task").html("<option value='' class='blank'>--- Choose Task ---</option>");
	$("#sub_task").html("<option value='' class='blank'>--- Choose Sub Task ---</option>");
}

function getTaskList(){
	if($("#program").val() != "" && $("#project").val() == ""){
		$("#task").html("<option value='' class='blank'>--- Choose Task ---</option>");
		$("#sub_task").html("<option value='' class='blank'>--- Choose Sub Task ---</option>");
	}else {
		callApi("/search-task-list?projectId=" + $("#project").val(), null, "GET", getTaskListSuccess);
	}
	
}

function getTaskListSuccess(response) {
	$("#task").html(response);
	bindTooltipForDocument();
	$("#sub_task").html("<option value='' class='blank'>--- Choose Sub Task ---</option>");
}

function getSubTaskList(){
	if($("#task").val() == ""){
		$("#sub_task").html("<option value='' class='blank'>--- Choose Sub Task ---</option>");
	}else {
		callApi("/search-subtask-list?taskId=" + $("#task").val(), null, "GET", getSubTaskListSuccess);
	}
}

function getSubTaskListSuccess(response){
	$("#sub_task").html(response);
	bindTooltipForDocument();
}

function toggleTab() {
	
	if(!($(this).find(":first-child").hasClass("current"))){
		anchorTag = $(this).find(":first-child");
		$("#search-result-tab li").each(function() {
			$(this).find(":first-child").removeClass('current');
		});
		selectedTab = $(anchorTag).attr('class');
		$("#search-result-form").submit();
		//callApi($(anchorTag).attr('href'), null, 'GET', toggleTabSuccess);		
	}
}

function toggleTabSuccess(reponse) {
	$("#search-result").html(reponse);
	$("#search-result-form").on("submit", submitSearchReultForm);
	$("#search-result-tab li").each(function() {
		$(this).find(":first-child").removeClass('current');
		$(this).on("click", toggleTab);
		$(this).find(":first-child").on("click", function(e){
			e.preventDefault();
		});
	});
	$("#search-result-tab li ." + selectedTab).addClass("current");
}

function toggleOverviewTab(){
	if(!($(this).find(":first-child").hasClass("current"))){
		selectedOverviewTab = $(this).find(":first-child");
		$("#document_overview_tab li").each(function() {
			$(this).find(":first-child").removeClass('current');
		});
		selectedOverviewTabClass = $(selectedOverviewTab).attr('class');
		if(selectedOverviewTabClass == 'searchForm'){
			$(".focus_on").slideDown();
			$("#new-division-doc-upload").css("display", "none");
		}else if(selectedOverviewTabClass == 'documentOverview'){
			callApi("/document-overview-listing", null, "GET", documentOverviewCallback);
			var url = window.location.href;
			var splitUrl = url.split("?");
			
			if(splitUrl.length > 0){
			var id= splitUrl[1];
			if(typeof id != "undefined"){
			  renderDocumentDisplay(id, "DIVISION");
			  $('.data_row_for_highlight').removeClass("selected_doc_highlighting");
			  $("#div_"+id).addClass("selected_doc_highlighting");
			  $("#d_p_"+id).toggle();
			}
		}
			 window.setTimeout(function(){$(".data_row_for_highlight:first").addClass("selected_doc_highlighting");}, 2000);
		$('.data_row_for_highlight').live('click',function(){
			$('.data_row_for_highlight').removeClass("selected_doc_highlighting");
			if($(this).hasClass("selected_doc_highlighting")){
				$(this).removeClass("selected_doc_highlighting");
			}else{
				$(this).addClass("selected_doc_highlighting");
			}
		});
			$('.focus_on_title').css('display', 'none');
		}
		$(selectedOverviewTab).addClass('current');
		
	}
	
}

function documentOverviewCallback(response) {
	$("#docuement-overview").html(response);
	bindTooltipForDocument();
	$(".focus_on").slideUp();
	$('.focus_on_title').css('display', 'block')
	$("#docuement-overview div").on("click", renderDocumentView);
	$('.focus_on_title').css("margin", "-18px 0 0 13px");
	$('.focus_on_title').css("cursor", "pointer");
	$(".search-form-wrapper").css("display", "block");
	$(".delete-doc").on("click", deleteDocument);
	$('.data_row_for_highlight').addClass("data_row_for_highlight");
	if($(this).hasClass("selected_doc_highlighting")){
		$(this).removeClass("selected_doc_highlighting");
	}else{
		$(this).addClass("selected_doc_highlighting");
	}
$("#new-division-doc-upload").css("display", "block");
	$("#new-division-doc-upload").css("display", "block");
}

function cancelDocumentSearch(){
	callApi("/document-overview-listing", null, "GET", documentOverviewCallback);
	$('.focus_on_title').css('display', 'none');
	$("#document_overview_tab .documentOverview").addClass('current')
	$("#document_overview_tab .searchForm").removeClass('current')
	
}


function callApi(url, data, method, callBack){
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