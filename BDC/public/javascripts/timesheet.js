$(document).ready(
		function() {
			
		//$(".project-plan").off("click").on("click", renderProjectPlan);
			
});
function renderProjectPlan() {
	
	var _this = $(this);
	var id = _this.attr("title");
	

	var url = "/task-planning?id="+id;
	
	/*$.get(url, function(data) {
		
	});*/

}