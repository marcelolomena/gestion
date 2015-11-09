package controllers.Frontend

import org.joda.time.DateTime
import org.joda.time.Days

import controllers.Secured
import models.Baseline
import play.api.mvc.Action
import play.api.mvc.Controller
import services.ProgramService
import services.ProjectService
import services.TaskService
import services.UserService

object ReportTool extends Controller with Secured {

	def getReportTool() = Action { implicit request =>
		Ok(views.html.reports.reportTool("BALA"))
	}

	def getProjectList() = Action { implicit request =>
		val projects = ProjectService.findProjectListOrderByPrograms()
		Ok(views.html.reports.projectList(projects))
	}
	def getBaselineChangeView() = Action { implicit request =>
		val baselines = Baseline.getAllBaselines();
		Ok(views.html.reports.baseLineChange(baselines))
	}

	def getProgramList() = Action { implicit request =>
		val programs = ProgramService.findAllPrograms("", "")
 		Ok(views.html.reports.programsList(programs))
	}

	def getEmployeeList() = Action { implicit request =>
		val users = UserService.findAllUsers()
		Ok(views.html.reports.employeeList(users))
	}
	def getProgramStatus() = Action { implicit request =>
		Ok(views.html.reports.programStatusReport("BALA"))
	}
	def getProjectStatus() = Action { implicit request =>
		Ok(views.html.reports.projectStatus("BALA"))
	}
	def getHoursBookedPerMonth() = Action { implicit request =>
		val programs = ProgramService.findAllProgramList()
		var hashmap = new java.util.HashMap[String, java.util.HashMap[String, Double]]()
		for (program <- programs) {
			var dateHoursMap = new java.util.HashMap[String, Double]()
			val projects = ProjectService.findProjectListForProgram(program.program_id.toString())
			for (project <- projects) {
				val tasks = TaskService.findTaskListByProjectId(project.pId.get.toString)
				for (i <- 0 to 5) {
					val todays = new DateTime().plusMonths(i)
					var allocatedHrs = 0.00
					for (task <- tasks) {
						val dt1 = new DateTime(task.plan_start_date)
						val dt2 = new DateTime(task.plan_end_date)
						val days_diff = Days.daysBetween(dt1, dt2).getDays() + 1
						val per_days_hour = task.plan_time.toDouble / days_diff
						if ((dt1.getMillis() < todays.getMillis()) && (todays.getMillis() < dt2.getMillis())) {
							if ((dt2.getMonthOfYear() == todays.getMonthOfYear()) && (dt1.getMonthOfYear() == todays.getMonthOfYear())) {
								allocatedHrs += task.plan_time.toDouble
							} else {
								if ((dt1.getMonthOfYear() < todays.getMonthOfYear()) && (todays.getMonthOfYear() == dt2.getMonthOfYear())) {
									allocatedHrs += (todays.dayOfMonth().getMaximumValue() - (todays.dayOfMonth().getMaximumValue() - dt2.dayOfMonth().get())) * per_days_hour
								}
								if ((todays.getMonthOfYear() < dt2.getMonthOfYear()) && (todays.getMonthOfYear() == dt1.getMonthOfYear())) {
									allocatedHrs += (todays.dayOfMonth().getMaximumValue() - (todays.dayOfMonth().getMaximumValue() - dt2.dayOfMonth().get())) * per_days_hour
								}
								if ((dt1.getMonthOfYear() < todays.getMonthOfYear()) && (todays.getMonthOfYear() < dt2.getMonthOfYear())) {
									allocatedHrs += (todays.dayOfMonth().getMaximumValue()) * per_days_hour
								}
							}

						} else {
							if ((dt1.getMillis() > todays.getMillis()) && (todays.getMillis() < dt2.getMillis()) && (todays.getMonthOfYear() == dt1.getMonthOfYear())) {
								allocatedHrs += (Days.daysBetween(dt1, dt2).getDays() + 1) * per_days_hour
							} else if ((dt1.getMillis() < todays.getMillis()) && (todays.getMillis() > dt2.getMillis()) && (todays.getMonthOfYear() == dt1.getMonthOfYear())) {
								allocatedHrs += (Days.daysBetween(dt1, dt2).getDays() + 1) * per_days_hour
							}
						}
						dateHoursMap.put(todays.getMonthOfYear().toString(), allocatedHrs)
					}

				}
			}
			hashmap.put(program.program_name, dateHoursMap)
		}
		Ok(views.html.reports.hoursBookedPerMonth(programs, hashmap))
	}
}
