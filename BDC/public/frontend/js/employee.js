var parentId = 1;
var parentType = "DIVISION";
var isSelfRef = false;
var pagenumber = 1;
var serachEmployeePagination = false;
$(document).ready( function() {
	bindPagination();
	$("#employee-overview div").on("click", renderEmployeeView);
	$("#employee-listing-tab li").on("click", toggleOverviewTab);
	$('#search-employee-form').on('submit', submitSearchEmployeeForm);
	$('.focus_on_title').on('click', toggleSearchIcon);
	$("#cancel-employee-search").on("click", cancelEmployeeSearch);
	$("#division").on('change', getGerenciaByDivision);
	$("#gerencia").on('change', getDepartmentByGerencia);
});

function renderEmployeeView(){
	var _this = $(this);
	var myId = _this.attr("id");
	isSelfRef = $(this).hasClass("self-ref");
	//alert(isSelfRef+"---"+myId)
	if(myId){
		var dType = myId.split("_");
		//alert(dType[0]+" "+dType[1]);\
		switch(dType[0]) {
			case "division" :
				parentId = dType[1];
				parentType = "DIVISION";
				pagenumber = 1;
				renderEmployees(dType[1], "DIVISION", isSelfRef,myId, pagenumber);
				if(!isSelfRef)
					$("#d_genrencia_"+dType[1]).toggle();
				break;
			case "selfdivision" :
				parentId = dType[1];
				parentType = "DIVISION";
				pagenumber = 1;
				renderEmployees(dType[1], "DIVISION", isSelfRef,myId, pagenumber);
				if(!isSelfRef)
					$("#d_genrencia_"+dType[1]).toggle();
				break;
			case "genrencia" :
				parentId = dType[1];
				parentType = "GENERENCIA";
				pagenumber = 1;
				renderEmployees(dType[1], "GENERENCIA", isSelfRef,myId, pagenumber);
				if(!isSelfRef)
					$("#g_department_"+dType[1]).toggle();
				break;
			case "selfgenrencia" :
				parentId = dType[1];
				parentType = "GENERENCIA";
				pagenumber = 1;
				renderEmployees(dType[1], "GENERENCIA", isSelfRef, myId,pagenumber);
				if(!isSelfRef)
					$("#g_department_"+dType[1]).toggle();
				break;
			case "department" :
				parentId = dType[1];
				parentType = "DEPARTMENT";
				pagenumber = 1;
				renderEmployees(dType[1], "DEPARTMENT", isSelfRef,myId, pagenumber);
				break;
		}
	}	
}

function renderEmployees(parent_id, parent_type, isSelfRef, myId, pagenumber){
	$(".loader").css("display", "block");
	var url = "/get-employee-list/" + parent_id + "/" + parent_type + "/" + isSelfRef+"/"+pagenumber;
	$.get(url, function(data) {
		$(".employee-list-right").html(data);
		var recordCount = $(".employee-list-right #records").val();
		$("#record-count").val(recordCount)
		bindPagination();
		$(".employee-list-left .data-row").each(function(){
			if($(this).attr("id") == myId){
				$(this).addClass("onSelect");
			}else{
				$(this).removeClass("onSelect");
			}
		});
	});
	
	//alert("parent id-- " + parent_id + "  Parent type -- " + parent_type);
	$(".loader").css("display", "none");
}

function bindPagination(pageNumber){
	var items = $(".emp_row");
	var numItems = parseInt($("#record-count").val()) //items.length;
	if(numItems > 0){
		$('#emp_pagination_div').css('display', 'block');
		var perPage = 10;
		if(typeof pageNumber=="undefined"){
			
			pageNumber =1;
		}
		items.slice(perPage).hide();
		$("#emp_pagination_div").pagination({
			items : numItems,
			itemsOnPage : perPage,
			cssStyle : "light-theme",
			currentPage : pageNumber,
			onPageClick : function(pageNumber) {
				$(".loader").css("display", "block");
				if(!serachEmployeePagination){
					var url = "/get-employee-list/" + parentId + "/" + parentType + "/" + isSelfRef +"/" + pageNumber;
					$.get(url, function(data) {
						$(".employee-list-right").html(data);
						bindPagination(pageNumber);
						if(pageNumber>1){
							$("#emp_pagination_div").find("li span").each(function(){
								 var _this = $(this);
							});
						}
					});
				}else{
					$("#start").val(pageNumber);
					$("#search-employee-form").trigger("submit");
					//submitSearchEmployeeForm();
				}
				$(".loader").css("display", "none");
			}
		});
	}else if(numItems === 0){
		$('#emp_pagination_div').css('display', 'none');
	}
}


function toggleOverviewTab(){
	if(!($(this).find(":first-child").hasClass("current"))){
		selectedOverviewTab = $(this).find(":first-child");
		$("#employee-listing-tab li").each(function() {
			$(this).find(":first-child").removeClass('current');
		});
		selectedOverviewTabClass = $(selectedOverviewTab).attr('class');
		if(selectedOverviewTabClass == 'searchForm'){
			$(".focus_on").slideDown();
		}else if(selectedOverviewTabClass == 'employeeOverview'){
			callApi("/employee-overview", null, "GET", employeeOverviewCallback);
			$('.focus_on').slideUp();
		}
		$(selectedOverviewTab).addClass('current');
		
	}
}

function submitSearchEmployeeForm(){
	callApi($(this).attr('action'), $(this).serialize(), "POST", searchResultSuccess);
	return false;
}

function searchResultSuccess(response){
	$("#employee-overview").html(response);
	var selectedPageNumber = $("#employee-overview #selected-page").val()
	var recordCount = $("#employee-overview #records").val();
	$("#record-count").val(recordCount);
	bindPagination(selectedPageNumber);
	serachEmployeePagination = true;
	//$("#search-result-form").on("submit", submitSearchReultForm);
	$('.search-form-wrapper').slideUp(1000, function(){
		$('.focus_on_title').css("margin", "-18px 0 0 820px");
		$('.focus_on_title').css("cursor", "pointer");
		isSearchTemplateOpen = true;
		//$("#search-result-tab li").on("click", toggleTab);
	});
	$("#search-result").slideDown(500, function() {
		$("#search-result-tab li a").on("click", function(e){
			e.preventDefault();
		});
	});
}

function cancelEmployeeSearch(){
	callApi("/employee-overview", null, "GET", employeeOverviewCallback);
	$('.focus_on_title').css('display', 'none');
	$("#employee-listing-tab .employeeOverview").addClass('current')
	$("#employee-listing-tab .searchForm").removeClass('current')
}

function employeeOverviewCallback(response) {
	
	$(".focus_on").slideUp();
	$('.focus_on_title').css('display', 'block')
	$("#employee-overview-wrapper").html(response);
	$("#employee-overview div").off("click").on("click", renderEmployeeView);
	bindPagination();
	$('.focus_on_title').css("margin", "-18px 0 0 13px");
	$('.focus_on_title').css("cursor", "pointer");
	$(".search-form-wrapper").css("display", "block");
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

function getDepartmentByGerencia(){
	if($(this).val()!=''){
	callApi("/get-department-by-gerencia/" + $(this).val(), null, "GET", getDepartmentSuccess);
}
}

function getGerenciaByDivision(){
	$("#department").html("<option value='' class='blank'>--- Choose Department ---</option>");
	if($(this).val()!=''){
		callApi("/get-gerencia-by-division/" + $(this).val(), null, "GET", getGerenciaSuccess);
	}
	
}

function getGerenciaSuccess(response){
	$("#gerencia").html(response);
}

function getDepartmentSuccess(response){
	$("#department").html(response);
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
