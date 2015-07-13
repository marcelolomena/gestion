package utils

import services.DepartmentService
import services.DivisionService
import services.GenrenciaService
import services.ProgramService
import services.ProjectService
import services.UserService
import services.DocumentService

import java.io._
import org.apache.poi.xssf.usermodel._
import org.apache.poi.ss.usermodel._
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel._
import org.apache.poi.xssf._
import org.apache.poi.xssf.eventusermodel.XSSFReader
import org.apache.poi.xssf.model.SharedStringsTable
import org.apache.poi.openxml4j.opc.OPCPackage
import java.io.FileOutputStream
import org.apache.poi.hssf.record.CFRuleRecord.ComparisonOperator
import org.apache.poi.ss.usermodel._
import org.apache.poi.ss.util.CellRangeAddress
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import services.TaskService
import services.SubTaskServices
import org.apache.poi.hssf.usermodel._
import org.apache.poi.hssf.util._
import java.util.Calendar

import java.util.Locale;

object ExportToExcel {

	def exportExcelByProgramId(programId: String) {
		val program = ProgramService.findProgramMasterDetailsById(programId)
		val programDetail = ProgramService.findProgramOtherDetailsById(programId)
		val programDates = ProgramService.findProgramDateDetailsById(programId)
		// val projectList = UserService.findProjectListForUserAndProgram(uId, programId)

		val file = new File("programdetails.xlsx")
		val fileOut = new FileOutputStream(file)
		val wb = new XSSFWorkbook()
		val sheet = wb.createSheet("Program - " + program.get.program_name)

		//freeze the first row
		sheet.createFreezePane(2, 3)

		val header = sheet.createRow(1)
		header.createCell(0).setCellValue("Id")
		header.createCell(1).setCellValue("Program Name")
		header.createCell(2).setCellValue("Tipo de Programa")
		header.createCell(3).setCellValue("Código del programa")
		header.createCell(4).setCellValue("Gerente del Programa de")
		header.createCell(5).setCellValue("Demand Administrador")
		header.createCell(6).setCellValue("Flujo de trabajo Estado")
		header.createCell(7).setCellValue("Programa Sub Tipo")
		header.createCell(8).setCellValue("Descripción del Programa")
		header.createCell(9).setCellValue("División")
		header.createCell(10).setCellValue("Gerencia")
		header.createCell(11).setCellValue("Departamento")
		header.createCell(12).setCellValue("Horas planificadas")
		header.createCell(13).setCellValue("Horas asignadas")
		header.createCell(14).setCellValue("Horas Reservados")
		header.createCell(15).setCellValue("Tipo de impacto")
		header.createCell(16).setCellValue("Fecha de Inicio")
		header.createCell(17).setCellValue("Clausura Fecha")
		header.createCell(18).setCellValue("Finalización%")
		header.createCell(19).setCellValue("Código SAP")
		header.createCell(20).setCellValue("SAP total")

		val dataRow = sheet.createRow(2)
		dataRow.createCell(0).setCellValue("1")
		dataRow.createCell(1).setCellValue(program.get.program_name)
		dataRow.createCell(2).setCellValue(program.get.program_type)

		dataRow.createCell(3).setCellValue(program.get.program_code)
		dataRow.createCell(4).setCellValue(UserService.findUserDetailsById(program.get.program_manager.toLong).get.first_name)
		dataRow.createCell(5).setCellValue(UserService.findUserDetailsById(program.get.demand_manager.toLong).get.first_name)
		if (!program.get.work_flow_status.isEmpty) {
			dataRow.createCell(6).setCellValue(program.get.work_flow_status.get.toString())
		} else
			dataRow.createCell(6).setCellValue("")
		if (!program.get.program_sub_type.isEmpty)
			dataRow.createCell(7).setCellValue(program.get.program_sub_type.get.toString())
		else
			dataRow.createCell(7).setCellValue("")
		if (!program.get.program_description.get.isEmpty)
			dataRow.createCell(8).setCellValue(program.get.program_description.get.toString())
		else
			dataRow.createCell(8).setCellValue("")

		dataRow.createCell(9).setCellValue(DivisionService.findDivisionById(programDetail.get.devison).get.division)

		if (!programDetail.get.management.isEmpty)
			dataRow.createCell(10).setCellValue(GenrenciaService.findGenrenciaById(Integer.parseInt(programDetail.get.management.get.toString())).get.genrencia)
		else
			dataRow.createCell(10).setCellValue("")

		if (!programDetail.get.department.isEmpty)
			dataRow.createCell(11).setCellValue(DepartmentService.findDepartmentById(programDetail.get.department.get).get.department)
		else
			dataRow.createCell(11).setCellValue("")

		dataRow.createCell(12).setCellValue(ProgramService.findAllocatedHoursForPrgoram(program.get.program_id.toString()).toString())
		dataRow.createCell(13).setCellValue(ProgramService.findSpentHoursForPrgoram(program.get.program_id.toString()).toString())
		dataRow.createCell(14).setCellValue(ProgramService.findBookedHoursForPrgoram(program.get.program_id.toString()).toString())

		if (!programDetail.get.impact_type.isEmpty)
			dataRow.createCell(15).setCellValue(programDetail.get.impact_type.get.toString())
		else
			dataRow.createCell(15).setCellValue("")

		if (programDates.get.initiation_planned_date != null)
			dataRow.createCell(16).setCellValue(programDates.get.initiation_planned_date.toString())
		else
			dataRow.createCell(16).setCellValue("")

		dataRow.createCell(17).setCellValue("")

		dataRow.createCell(18).setCellValue("")

		val projects = ProjectService.findProjectListForProgram(programId)

		if (!projects.isEmpty) {
			var countprojectIndex = 4
			var counttaskIndex = 7

			for ((project, index) <- projects.zipWithIndex) {
				var projectHeader = sheet.createRow(countprojectIndex)
				projectHeader.createCell(0).setCellValue("Id")
				projectHeader.createCell(1).setCellValue("Project Name")
				projectHeader.createCell(2).setCellValue("Código SAP")
				projectHeader.createCell(3).setCellValue("Fecha de inicio")
				projectHeader.createCell(4).setCellValue("Horas planificadas")
				projectHeader.createCell(5).setCellValue("horas asignadas")
				projectHeader.createCell(6).setCellValue("Horas Reservados ")
				projectHeader.createCell(7).setCellValue("SAP total ")
				projectHeader.createCell(8).setCellValue("fecha de lanzamiento")
				projectHeader.createCell(9).setCellValue("Presupuesto real dedicado")
				projectHeader.createCell(10).setCellValue("Presupuesto asignado")
				projectHeader.createCell(11).setCellValue("Descripción")

				var projectdataRow = sheet.createRow((1 + countprojectIndex))
				projectdataRow.createCell(0).setCellValue("1." + (index + 1))
				projectdataRow.createCell(1).setCellValue(project.project_name)
				projectdataRow.createCell(2).setCellValue(0)//project.sap_code.get.toString()
				projectdataRow.createCell(3).setCellValue(project.start_date.toString())
				projectdataRow.createCell(4).setCellValue("")
				projectdataRow.createCell(5).setCellValue("")
				projectdataRow.createCell(6).setCellValue("")
				projectdataRow.createCell(7).setCellValue(0)//project.total_sap.toString()
				projectdataRow.createCell(8).setCellValue(project.final_release_date.toString())
				projectdataRow.createCell(9).setCellValue(project.description)
				projectdataRow.createCell(10).setCellValue(1)//project.budget_approved.toString()
				projectdataRow.createCell(11).setCellValue(project.description)

				counttaskIndex = (countprojectIndex + 3)

				val tasks = TaskService.findTaskListByProjectId(project.pId.get.toString())
				if (tasks.size > 0) {
					var taskcounter = 0
					for ((task, index2) <- tasks.zipWithIndex) {

						var taskHeader = sheet.createRow(counttaskIndex + taskcounter)
						taskHeader.createCell(0).setCellValue("Id")
						taskHeader.createCell(1).setCellValue("Task Name")
						taskHeader.createCell(2).setCellValue("Tipo de Dependencia")
						taskHeader.createCell(3).setCellValue("Código de tareas")
						taskHeader.createCell(4).setCellValue("Horas asignadas")
						taskHeader.createCell(5).setCellValue("Tarea de Dependencia")
						taskHeader.createCell(6).setCellValue("Fecha de inicio prevista")
						taskHeader.createCell(7).setCellValue("Planeado Fecha de finalización")
						taskHeader.createCell(8).setCellValue("Propietario")
						taskHeader.createCell(9).setCellValue("Descripción")

						var taskdataRow = sheet.createRow(counttaskIndex + 1 + taskcounter)
						taskdataRow.createCell(0).setCellValue("1." + (index + 1) + "." + (index2 + 1))
						taskdataRow.createCell(1).setCellValue(task.task_title)
						if (!task.dependencies_type.isEmpty)
							taskdataRow.createCell(2).setCellValue(task.dependencies_type.get.toString())
						else
							taskdataRow.createCell(2).setCellValue("")
						taskdataRow.createCell(3).setCellValue(task.task_code)
						taskdataRow.createCell(4).setCellValue(task.plan_time.toString())
						taskdataRow.createCell(5).setCellValue(task.task_depend.toString())
						taskdataRow.createCell(6).setCellValue(task.plan_start_date.toString())
						taskdataRow.createCell(7).setCellValue(task.plan_end_date.toString())
						taskdataRow.createCell(8).setCellValue(UserService.findUserDetailsById(task.owner.toLong).get.first_name + " " + UserService.findUserDetailsById(task.owner.toLong).get.last_name)
						taskdataRow.createCell(9).setCellValue(task.task_description.toString())

						var countsubtaskIndex = (counttaskIndex + taskcounter + 3)
						val subTasks = SubTaskServices.findSubTasksByTask(task.tId.get.toString())
						var subtaskcounter = 0
						for ((subTask, index3) <- subTasks.zipWithIndex) {
							var subtaskHeader = sheet.createRow(countsubtaskIndex + subtaskcounter)
							subtaskHeader.createCell(0).setCellValue("Id")
							subtaskHeader.createCell(1).setCellValue("Subtask Name")
							subtaskHeader.createCell(2).setCellValue("Título")
							subtaskHeader.createCell(3).setCellValue("descripción")
							subtaskHeader.createCell(4).setCellValue("Fecha de inicio prevista")
							subtaskHeader.createCell(5).setCellValue("Planeado Fecha de finalización")
							subtaskHeader.createCell(6).setCellValue("Sub Grupo de Dependencia")

							var subtaskdataRow = sheet.createRow(countsubtaskIndex + subtaskcounter + 1)
							subtaskdataRow.createCell(0).setCellValue("1." + (index + 1) + "." + (index2 + 1) + "." + (index3 + 1))
							subtaskdataRow.createCell(1).setCellValue(subTask.task_complete.toString())
							subtaskdataRow.createCell(2).setCellValue(subTask.note)
							subtaskdataRow.createCell(3).setCellValue(subTask.note)
							subtaskdataRow.createCell(4).setCellValue(subTask.actual_start_date.toString())
							subtaskdataRow.createCell(5).setCellValue(subTask.actual_end_date.toString())
							subtaskdataRow.createCell(6).setCellValue("")
							subtaskcounter = subtaskcounter + 3
						}
						taskcounter = taskcounter + 3 + subtaskcounter
						countprojectIndex = countsubtaskIndex + subtaskcounter + 1
					}
				}
			}
		}
		sheet.groupRow(3, 10)
		sheet.groupRow(11, 18)
		sheet.groupRow(19, 28)

		//set column widths, the width is measured in units of 1/256th of a character width

		sheet.setColumnWidth(0, 256 * 6)
		sheet.setColumnWidth(1, 256 * 30)
		sheet.setZoom(4, 4)

		wb.write(fileOut)

		fileOut.close()
	}

}