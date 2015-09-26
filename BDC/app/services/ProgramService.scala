package services;
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
//import com.typesafe.plugin._
import org.apache.commons.lang3.StringUtils
import java.util.Date
import SqlParser.scalar
import java.text.DecimalFormat
import org.json.JSONObject
import services._
import play.api.data.Form
import java.text.SimpleDateFormat
import org.json.JSONArray
import play.libs.Json
import org.json.JSONObject
import play.api.libs.json
import play.i18n._
import play.mvc._

import controllers.Frontend.Program

import java.util.Calendar
import java.sql.Connection
import scala.math.BigDecimal.RoundingMode

object ProgramService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))

  def insertProgramDetails(pm: Programs): Long = {
    var isSaved = false

    val program_code = getUniqueProgramCode()

    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          insert into art_program (
          program_type, program_sub_type, program_name,program_code, 
          program_description, work_flow_status, 
          demand_manager, program_manager, devison, management, department, sap_code,
          impact_type, business_line, creation_date, initiation_planned_date, closure_date,release_date,
          planned_hours, estimated_cost 
          ) 
          values(
          {program_type},{program_sub_type},{program_name},{program_code},
          {program_description},{work_flow_status}, {demand_manager},{program_manager},{devison},
					{management},{department},{sap_code}, {impact_type},{business_line}, {creation_date},{initiation_planned_date},{closure_date},{release_date},{planned_hours}, {estimated_cost} 
          )
          """).on(
          'program_type -> pm.program_type,
          'program_sub_type -> pm.program_sub_type,
          'program_name -> pm.program_name.trim(),
          'program_code -> program_code,
          'program_description -> pm.program_description,
          'work_flow_status -> pm.work_flow_status,
          'demand_manager -> pm.demand_manager,
          'program_manager -> pm.demand_manager,//pm.program_manager,
          'devison -> pm.program_details.devison,
          'management -> pm.program_details.management,
          'department -> pm.program_details.department,
          'sap_code -> pm.program_details.sap_code,
          'impact_type -> pm.program_details.impact_type,
          'business_line -> pm.program_details.business_line,
          'creation_date -> pm.program_dates.creation_date,
          'initiation_planned_date -> pm.program_dates.initiation_planned_date,
          'closure_date -> pm.program_dates.closure_date,
          'release_date -> pm.program_dates.release_date,
          'planned_hours -> pm.planned_hours,
          'estimated_cost -> pm.estimated_cost).executeInsert(scalar[Long].singleOpt)

      result.last

    }

  }

  def updateProgram(id: String, pm: Programs): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_program
          set 
          program_type={program_type}, 
          program_sub_type={program_sub_type},
					program_name={program_name},
          program_code={program_code}, 
          program_description={program_description}, 
          work_flow_status={work_flow_status}, 
          demand_manager={demand_manager}, 
          program_manager={program_manager}, 
					devison={devison},
          sap_code={sap_code},
          management={management}, 
          department={department}, 
          impact_type={impact_type}, 
          business_line={business_line}, 
          initiation_planned_date={initiation_planned_date}, 
          closure_date={closure_date},
					release_date={release_date},
          is_active={is_active},
          planned_hours={planned_hours},
          estimated_cost={estimated_cost}
          where program_id = {program_id}
          """).on(
          'program_id -> id,
          'program_type -> pm.program_type,
          'program_sub_type -> pm.program_sub_type,
          'program_name -> pm.program_name.trim(),
          'program_code -> pm.program_code,
          'program_description -> pm.program_description,
          'work_flow_status -> pm.work_flow_status,
          'demand_manager -> pm.demand_manager,
          'program_manager -> pm.program_manager,
          'devison -> pm.program_details.devison,
          'management -> pm.program_details.management,
          'department -> pm.program_details.department,
          'impact_type -> pm.program_details.impact_type,
          'sap_code -> pm.program_details.sap_code,
          'business_line -> pm.program_details.business_line,
          'initiation_planned_date -> pm.program_dates.initiation_planned_date,
          'closure_date -> pm.program_dates.closure_date,
          'release_date -> pm.program_dates.release_date,
          'is_active -> pm.is_active.getOrElse(1),
          'planned_hours -> pm.planned_hours,
          'estimated_cost -> pm.estimated_cost).executeUpdate()
    }
  }

  def saveProgramDetails(pm: ProgramMaster, pd: ProgramDetails, pds: ProgramDates): Boolean = {
    var isSaved = false
    DB.withConnection { implicit connection =>
      val sqlString = SQL(
        """
          insert into art_program (
          program_type, program_sub_type, program_name,program_code, 
          program_description, work_flow_status, 
          internal_state, demand_management_status, demand_manager, program_manager,  
          devison, management, department, impact_type, business_line, 
          creation_date, initiation_planned_date, closure_date,planned_hours,estimated_cost
          ) 
          values(
          {program_type},{program_sub_type},{program_name},{program_code},
          {program_description},{work_flow_status},
          {internal_state},{demand_management_status},{demand_manager},{program_manager},
          {devison},{management},{department},
          {impact_type},{business_line},
          {creation_date},{initiation_planned_date},{closure_date},{planned_hours},{estimated_cost}
          )
          """).on(
          'program_type -> pm.program_type,
          'program_sub_type -> pm.program_sub_type,
          'program_name -> pm.program_name.trim(),
          'program_code -> pm.program_code,
          'program_description -> pm.program_description,
          'work_flow_status -> pm.work_flow_status,
          'demand_manager -> pm.demand_manager,
          'program_manager -> pm.program_manager,
          'devison -> pd.devison,
          'management -> pd.management,
          'department -> pd.department,
          'impact_type -> pd.impact_type,
          'business_line -> pd.business_line,
          'creation_date -> pds.creation_date,
          'initiation_planned_date -> pds.initiation_planned_date,
          'closure_date -> pds.closure_date,
          'planned_hours -> pm.planned_hours,
          'estimated_cost -> pm.estimated_cost)

      sqlString.executeUpdate()

      isSaved = true

    }
    isSaved
  }

  def updateProgramDetails(pm: ProgramMaster, pd: ProgramDetails, pds: ProgramDates): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_program
          set 
          program_type={program_type}, 
          program_sub_type={program_sub_type}, 
					program_name={program_name},
          program_code={program_code}, 
          projects_numbers={projects_numbers}, 
          program_description={program_description}, 
          work_flow_status={work_flow_status}, 
          demand_management_status={demand_management_status},
          demand_manager={demand_manager}, 
          program_manager={program_manager},  
          devison={devison},
          management={management}, 
          department={department}, 
          impact_type={impact_type}, 
          business_line={business_line}, 
          initiation_planned_date={initiation_planned_date}, 
          closure_date={closure_date},
          is_active={is_active},
          planned_hours={planned_hours} ,
          estimated_cost={estimated_cost}
          where program_id = {program_id}
          """).on(
          'program_id -> pm.program_id,
          'program_type -> pm.program_type,
          'program_sub_type -> pm.program_sub_type,
          'program_name -> pm.program_name.trim(),
          'program_code -> pm.program_code,
          'program_description -> pm.program_description,
          'work_flow_status -> pm.work_flow_status,
          'demand_manager -> pm.demand_manager,
          'program_manager -> pm.program_manager,
          'devison -> pd.devison,
          'management -> pd.management,
          'department -> pd.department,
          'impact_type -> pd.impact_type,
          'business_line -> pd.business_line,
          'creation_date -> pds.creation_date,
          'initiation_planned_date -> pds.initiation_planned_date,
          'closure_date -> pds.closure_date,
          'is_active -> pm.is_active.getOrElse(1),
          'planned_hours -> pm.planned_hours,
          'estimated_cost -> pm.estimated_cost).executeUpdate()
    }
  }

  def updateProgramDetailsStatusField(program_id: String, status: String) = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_program set work_flow_status={work_flow_status}
          where program_id = {program_id}
          """).on('work_flow_status -> status, 'program_id -> program_id).executeUpdate()
    }
  }

  def validateForm(form: Form[Programs], old_id: String) = {
    var clouser_date = ""
    var end_planned_date = ""
    var initiation_planned_date = ""
    var date1: Long = 0
    var date2: Long = 0
    var date3: Long = 0
    var date4: Long = 0
    var clouserDate = true
    var creationDate = true
    var clouserDate2 = true
    var release_date = ""
    var invalid_release_date = true
    var new_form: Form[Programs] = null
    var chkdate = false
    var chkreldate = false
    var chkinidate = false

    val today = new Date();
    val format = new java.text.SimpleDateFormat("dd-MM-yyyy")

    if (!form("program_dates.release_date").value.isEmpty && !StringUtils.isEmpty(form("program_dates.release_date").value.get)) {
      release_date = form("program_dates.release_date").value.get
      date4 = format.parse(release_date).getTime()
      chkreldate = true
    }
    if (!form("program_dates.closure_date").value.isEmpty && !StringUtils.isEmpty(form("program_dates.closure_date").value.get)) {
      clouser_date = form("program_dates.closure_date").value.get
      date1 = format.parse(clouser_date).getTime()
    }

    if (!form("program_dates.end_planned_date").value.isEmpty && !StringUtils.isEmpty(form("program_dates.end_planned_date").value.get)) {
      end_planned_date = form("program_dates.end_planned_date").value.get
      date2 = format.parse(end_planned_date).getTime()
      chkdate = true
    }
    if (!form("program_dates.initiation_planned_date").value.isEmpty && !StringUtils.isEmpty(form("program_dates.initiation_planned_date").value.get)) {
      initiation_planned_date = form("program_dates.initiation_planned_date").value.get
      date3 = format.parse(initiation_planned_date).getTime()
      chkinidate = true
    }

    if (date2.toLong > today.getTime() && chkdate) {
      creationDate = false
    }
    if (date4 > date3 && (chkinidate && chkreldate)) {
      invalid_release_date = false
    }

    //println(clouser_date + " " + end_planned_date + " " + initiation_planned_date + creationDate + "");
    //println(date1.toLong + " " + date2.toLong + " " + date3.toLong + " " + (date1.toLong < date2.toLong) + " " + (date1.toLong < date3.toLong));

    if (date1 != 0 && date2 != 0) {

      if (date1.toLong < date2.toLong) {
        clouserDate = false
      }
    }
    if (date1.toLong != 0 && date3.toLong != 0) {
      if (date1.toLong < date3.toLong) {
        clouserDate2 = false
      }
    }

    /*if (!clouserDate || !clouserDate2) {
      //form.withError("program_dates.closure_date", Messages.get(langObj, "error.addnewprogram.closuredatecreationdatecompare"))
    } 
      else if (date4.toLong > date1.toLong) {
      form.withError("program_dates.closure_date", Messages.get(langObj, "error.addnewprogram.closuredatereleasedatecompare"))
    }    */

    if (!form("program_name").value.isEmpty && !StringUtils.isEmpty(form("program_name").value.get)) {
      val program = form("program_name").value.get.trim
      val existData = findProgramMasterDetailsByProgramName(program, old_id)

      if (existData.size > 0) {
        /*if (!StringUtils.equals(existData.get.program_id.toString(), old_id)) {*/
        new_form = form.withError("program_name", "This program name already in use, please insert unique program name.")
        /* }*/

      }
    }

    if (invalid_release_date) {
      new_form = form.withError("program_dates.release_date", Messages.get(langObj, "error.addnewprogram.invalidReleaseDate"))
    }
    if (!creationDate) {
      new_form = form.withError("program_dates.end_planned_date", Messages.get(langObj, "error.addnewprogram.creationdatetodaycompare"))
    }

    if (!StringUtils.isEmpty(old_id)) {

      if (!invalid_release_date && release_date != null) {

        val maxProjectEndDate = ProjectService.findMaxProjectEndDate(old_id);
        if (maxProjectEndDate != null) {
          if (date4.toLong < maxProjectEndDate.get.getTime) {
            new_form = form.withError("program_dates.release_date", "Program end date can not be before project end date");
          }
        }

        val minProjectEndDat = ProjectService.findMinProjectStartDate(old_id)
        if (minProjectEndDat != null) {
          if (date3.toLong > minProjectEndDat.get.getTime) {
            new_form = form.withError("program_dates.initiation_planned_date", "Program start date can not be after project start date");
          }
        }

      }

      val planned_value = ProgramService.getPlannedHoursForProgram(old_id)
      if (!form("planned_hours").value.isEmpty && !StringUtils.isEmpty(form("planned_hours").value.get)) {
        val actual_planned_hours = form("planned_hours").value.get.toDouble
        var project_planned_hours: Double = 0
        val projects = ProjectService.findProjectListForProgram(old_id)
        for (p <- projects) {
          if (!p.planned_hours.isEmpty) {
            project_planned_hours += p.planned_hours.get
          }
        }
        if (actual_planned_hours < project_planned_hours) {
          new_form = form.withError("planned_hours", "Total hours associated with program are less than planned hours for a project, please enter valid hours.")
        }
      } else {
        val actual_planned_hours: Double = 0
        var project_planned_hours: Double = 0
        val projects = ProjectService.findProjectListForProgram(old_id)
        for (p <- projects) {
          if (!p.planned_hours.isEmpty) {
            project_planned_hours += p.planned_hours.get
          }
        }
        if (actual_planned_hours < project_planned_hours) {
          new_form = form.withError("planned_hours", "Total hours associated with program are less than planned hours for a project, please enter valid hours.")
        }
      }

    }
    if (date1 < date4 && date1 != 0) {
      new_form = form.withError("program_dates.closure_date", "Fecha de cierre no debe ser menor que la fecha de lanzamiento.")
    }
    if (new_form != null) {
      new_form
    } else {
      form
    }
  }

  def deleteProgram(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "Delete from art_program where program_id='" + id + "'").on(
          'program_id -> id).executeUpdate()
    }
  }

  def findProgramMasterDetailsByProgramName(program_name: String, old_id: String): Seq[ProgramMaster] = {
    var sqlString = ""
    if (!old_id.trim().isEmpty()) {
      sqlString = "select  * from art_program where program_name='" + program_name + "' AND is_active=1 AND program_id <> '" + old_id + "'"
    } else {
      sqlString = "select  * from art_program where (program_name='" + program_name + "' AND is_active=1)"
    }
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(ProgramMaster.pMaster *)
      result

    }
  }
  
  def programas_sin_avance_en_tareas(uid: String): Seq[ProgramMaster] = {
    var sqlString = "EXEC art.sin_avance {uid}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('uid -> uid.toInt).executeQuery() as (ProgramMaster.pMaster *)
    }
  }  

  def findProgramMasterDetailsById(pId: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          select  * from art_program where program_id = {pId}
          """).on(
          'pId -> pId).as(ProgramMaster.pMaster.singleOpt)
      result
    }
  }

  def findProgramOtherDetailsById(pId: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          select * from art_program where program_id = {pId}
          """).on(
          'pId -> pId).as(ProgramDetails.pDetails.singleOpt)
      result
    }
  }

  def findProgramDateDetailsById(pId: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          select * from art_program where program_id = {pId}
          """).on(
          'pId -> pId).as(ProgramDates.pDates.singleOpt)
      result
    }
  }

  def findAllPrograms(pagNo: String, recordOnPage: String): Seq[ProgramMaster] = {
    var sqlString = ""
    if (StringUtils.isNotEmpty(pagNo) && StringUtils.isNotEmpty(recordOnPage)) {
      val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
      val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
      val end = Integer.parseInt(recordOnPage.toInt.toString)

      /*sqlString = """SELECT * from art_program  limit """ + start + "," + end*/
      var sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_program AS tbl )as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"

    } else {
      sqlString = """
          SELECT * from art_program"""
    }

    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramMaster.pMaster *)
    }

  }

  def findAllUserPrograms(uId: String): Seq[ProgramMaster] = {
    var sqlString = ""
    sqlString = "SELECT * from art_program where is_active = 1 AND program_id IN  (select program from art_project_master where is_active = 1 AND  pId IN (select pId from art_user_project_mapping where uId=" + uId + " and show_project=1))"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramMaster.pMaster *)
    }

  }

  def findProjectManagerPrograms(uId: String): Seq[ProgramMaster] = {
    var sqlString = ""
    sqlString = "SELECT * from art_program where is_active = 1 AND program_id IN  (select program_id from art_program_members where member_id=" + uId + " and is_active=0)"

    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramMaster.pMaster *)
    }

  }

  def findAllProgramsForDivision(divison: String): Seq[ProgramDetails] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          select * from art_program where devison = {divison} 
          """).on(
          'divison -> divison).as(ProgramDetails.pDetails.*)
      result
    }

  }
  def findAllProgramMasterDetailsForDivision(divison: String): Seq[ProgramMaster] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          select * from art_program where devison = {divison} AND is_active=1
          """).on(
          'divison -> divison).as(ProgramMaster.pMaster.*)
      result
    }

  }

  def findProgramCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "select count(*) from art_program  where is_active=1"
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }

  def findPrgoramCode(program_code: Double): Boolean = {
    var isNotPresent = true
    //println("select * from art_program where program_code=" + program_code)
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_program where program_code=" + program_code + "").on(
          'program_code -> program_code).as(ProgramMaster.pMaster *)
      if (result.size > 0) {
        isNotPresent = false
      }
    }

    isNotPresent
  }

  def findAllocatedHoursForPrgoram(program: String): BigDecimal = {
    val sqlSting = "SELECT * FROM art_task WHERE pId IN (SELECT DISTINCT(pId) FROM art_project_master WHERE is_active=1 AND  program=" + program + ")"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(Tasks.tasks *)
      var hours: BigDecimal = 0
      for (r <- result) {
        hours += r.plan_time
      }
      hours
    }
  }

  def findSpentHoursForPrgoram(program: String): BigDecimal = {
    var hours: BigDecimal = 0

    var sqlSting = "SELECT * FROM art_sub_task_allocation WHERE is_deleted=1 AND sub_task_id IN ( select sub_task_id from art_sub_task t where is_deleted=1 and t.task_id IN ( select tId from art_task where pId IN (SELECT DISTINCT(pId) FROM art_project_master WHERE is_active=1 AND program=" + program + ") AND is_active = 1 ))"

    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(SubTaskAllocation.taskAllocation *)

      for (r <- result) {
        hours += r.estimated_time
      }
      hours
    }

    sqlSting = "SELECT * FROM art_sub_task_allocation_external WHERE is_deleted=1 AND sub_task_id IN ( select sub_task_id from art_sub_task t where is_deleted=1 and t.task_id IN ( select tId from art_task where pId IN (SELECT DISTINCT(pId) FROM art_project_master WHERE is_active=1 AND program=" + program + ") AND is_active = 1 ))"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(SubTaskAllocationExternal.taskAllocationExternal *)

      for (r <- result) {
        hours += r.estimated_time
      }
      hours
    }

  }
  def findBookedHoursForPrgoram(program: String): BigDecimal = {
    var hours: BigDecimal = 0
    var sqlSting = "SELECT * FROM art_timesheet WHERE  pId IN (SELECT DISTINCT(pId) FROM art_project_master WHERE is_active=1 AND  program =" + program + ")"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(Timesheet.timesheetLists *)

      for (t <- result) {
        hours = hours + t.hours
      }
      hours

    }

    sqlSting = "SELECT * FROM art_timesheet_external WHERE pId IN (SELECT DISTINCT(pId) FROM art_project_master WHERE  program =" + program + ")"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(TimesheetExternal.timesheetLists *)

      for (t <- result) {
        hours = hours + t.hours
      }
      hours

    }
  }

  def findAllProgramList(): Seq[ProgramMaster] = {
    var sqlString = ""
    sqlString = "SELECT * from art_program where is_active = 1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramMaster.pMaster *)
    }

  }

  def findProgramListCount(): Long = {
    var sqlString = ""
    sqlString = "SELECT COUNT(*) from art_program where is_active = 1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(scalar[Long].single)
    }

  }

  def findAllUserProgramsCount(uId: String): Long = {
    var sqlString = ""
    sqlString = "SELECT COUNT(*) from art_program where is_active = 1 AND program_id IN  (select program from art_project_master where is_active = 1 AND  pId IN (select pId from art_user_project_mapping where uId=" + uId + " and show_project=1))"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(scalar[Long].single)
    }

  }

  def findPaginationUserPrograms(uId: String, start: Integer, end: Integer): Seq[ProgramMaster] = {
    var sqlString = ""
    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY program_name) AS Row, * FROM art_program AS tbl where is_active = 1 AND program_id IN  (select program from art_project_master where is_active = 1 AND  pId IN (select pId from art_user_project_mapping where uId=" + uId + " and show_project=1)))as ss WHERE  (  Row >=" + (start) + " AND Row <= " + (end) + ")"
    //sqlString = "SELECT * from art_program where is_active = 1 AND program_id IN  (select program from art_project_master where is_active = 1 AND  pId IN (select pId from art_user_project_mapping where uId=" + uId + " and show_project=1))"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramMaster.pMaster *)
    }

  }

  def findPaginationProgramList(start: Integer, end: Integer): Seq[ProgramMaster] = {
    var sqlString = ""
    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY program_name) AS Row, * FROM art_program AS tbl where is_active = 1 )as ss WHERE  (  Row >=" + (start) + " AND Row <= " + (end) + ")"
    // sqlString = "SELECT * from art_program where is_active = 1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramMaster.pMaster *)
    }

  }

  def programBasline(programDates: Option[ProgramDates], initiation_planned_date: Date, closure_date: Date, release_date: Date, user_id: String, program_id: String) = {
    var dates_changed: Boolean = false;
    var changeState = new JSONArray();

    if (initiation_planned_date != null && programDates.get.initiation_planned_date != null && !initiation_planned_date.equals(programDates.get.initiation_planned_date)) {
      dates_changed = true;
      var changeStateObject = new JSONObject();
      changeStateObject.put("fieldName", "initiation_planned_date");
      changeStateObject.put("org_value", new SimpleDateFormat("dd-MM-yyyy").format(programDates.get.initiation_planned_date));
      changeStateObject.put("new_value", new SimpleDateFormat("dd-MM-yyyy").format(initiation_planned_date));
      changeState.put(changeStateObject);
    }
    if (closure_date != null && !programDates.get.closure_date.isEmpty && !closure_date.equals(programDates.get.closure_date.get)) {
      dates_changed = true;
      var changeStateObject = new JSONObject();
      changeStateObject.put("fieldName", "closure_date");
      changeStateObject.put("org_value", new SimpleDateFormat("dd-MM-yyyy").format(programDates.get.closure_date.get));

      changeStateObject.put("new_value", new SimpleDateFormat("dd-MM-yyyy").format(closure_date));
      changeState.put(changeStateObject);
    }

    if (release_date != null && programDates.get.release_date != null && !release_date.equals(programDates.get.release_date)) {
      dates_changed = true;
      var changeStateObject = new JSONObject();
      changeStateObject.put("fieldName", "release_date");
      changeStateObject.put("org_value", new SimpleDateFormat("dd-MM-yyyy").format(programDates.get.release_date));

      changeStateObject.put("new_value", new SimpleDateFormat("dd-MM-yyyy").format(release_date));
      changeState.put(changeStateObject);
    }

    if (dates_changed) {
      val baseline = Baseline(None, changeState.toString(), Integer.parseInt(user_id), new Date(), "program", Integer.parseInt(program_id));
      Baseline.insert(baseline);
    }
  }

  /**
   * check program status for a date
   */
  def checkProgramStatusForDate(program_id: String, status_for_date: String) = {
    val sql = "select * from  art_program_status where program_id =" + program_id + " && status_for_date = '" + status_for_date + "'";
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(
        ProgramStatus.pStatus.singleOpt)
      result
    }
  }

  def insertProgramStatus(pm: ProgramStatus): Long = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          insert into  art_program_status (
            program_id, status_for_date, reason_for_change, status 
          ) 
          values(
            {program_id}, {status_for_date},{reason_for_change},{status}
          )
          """).on(
          'program_id -> pm.program_id,
          'status_for_date -> new Date(),
          'reason_for_change -> pm.reason_for_change,
          'status -> pm.status).executeInsert(scalar[Long].singleOpt)

      result.last

    }
  }

  def updateProgram(pm: ProgramStatus): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_program_status
          set 
          reason_for_change={reason_for_change},
          status={status}
          where program_id = {program_id} and id={id}
          """).on(
          'id -> pm.id,
          'program_id -> pm.program_id,
          'reason_for_change -> pm.reason_for_change,
          'status -> pm.status).executeUpdate()
    }
  }

  def findClouseDateBaslineChange(program_id: String) = {
    var i = 0
    var changeSet = ""
    var baseline = Baseline.getBaseline(Integer.parseInt(program_id), "program")
    for (b <- baseline) {

      var jsonNode = Json.parse(b.change_set);
      var itr = jsonNode.iterator()

      while (itr.hasNext()) {
        var jsonObj = itr.next();
        //println(jsonObj + "---");
        var field = jsonObj.findValue("fieldName").toString()
        field = field.replaceAll("^\"|\"$", "");
        if (StringUtils.equals(field, "release_date")) {
          var new_field = jsonObj.findValue("org_value").toString().replaceAll("^\"|\"$", "")
          //  println(new_field +" "+i);
          if (i == 0) {
            changeSet = "<tr><td class='text-strike-through' style='text-decoration:line-through;vertical-align: top' id='" + program_id + "'>" + new_field + "</td></tr>";

          } else {
            changeSet = changeSet + "<tr><td class='text-strike-through' style='text-decoration:line-through;vertical-align: top' id='" + program_id + "'>" + new_field + "</td></tr>";
          }
          i = i + 1;
        }
      }
    }
    val format = new java.text.SimpleDateFormat("dd-MM-yyyy")
    if (ProgramService.findProgramDateDetailsById(program_id).get.release_date != null) {
      changeSet = changeSet + "<tr><td class='width_full' style='float:left;width:100%;vertical-align: top;' id='" + program_id + "'>" + format.format(ProgramService.findProgramDateDetailsById(program_id).get.release_date) + "</td></tr>";
    } else {
      changeSet = changeSet + "<tr><td class='width_full' style='vertical-align: top' id='" + program_id + "'> &nbsp;</td></tr>"
    }
    changeSet = "<table >" + changeSet + "</table>"
    changeSet
  }

  def findInitiationDateBaslineChange(program_id: String) = {
    var i = 0
    var changeSet = ""
    var baseline = Baseline.getBaseline(Integer.parseInt(program_id), "program")
    for (b <- baseline) {

      var jsonNode = Json.parse(b.change_set);
      var itr = jsonNode.iterator()

      while (itr.hasNext()) {

        var jsonObj = itr.next();
        var field = jsonObj.findValue("fieldName").toString()
        field = field.replaceAll("^\"|\"$", "");

        if (StringUtils.equals(field, "initiation_planned_date")) {

          var new_field = jsonObj.findValue("org_value").toString().replaceAll("^\"|\"$", "")
          if (i == 0) {
            changeSet = "<tr><td class='text-strike-through' style='text-decoration:line-through;vertical-align: top' id='" + program_id + "'>" + new_field + "</td></tr>";
          } else {
            changeSet = changeSet + "<tr><td class='text-strike-through' style='text-decoration:line-through;vertical-align: top' id='" + program_id + "'>" + new_field + "</td></tr>";
          }
          i = i + 1;
        }
      }
    }
    val format = new java.text.SimpleDateFormat("dd-MM-yyyy")
    val program_dates = ProgramService.findProgramDateDetailsById(program_id)
    if (program_dates.get.initiation_planned_date != null) {
      changeSet = changeSet + "<tr><td class='width_full' style='vertical-align: top' id='" + program_id + "'>" + format.format(program_dates.get.initiation_planned_date) + "</td></tr>";
    } else {
      changeSet = changeSet + "<tr><td class='width_full' style='vertical-align: top' id='" + program_id + "'> &nbsp;</td></tr>"
    }
    changeSet = "<table>" + changeSet + "</table>"

    changeSet
  }

  def findProgramStatus(program_id: String) = {
    var sqlString = ""
    sqlString = "SELECT TOP 1 * from art_program_status where program_id=" + program_id + " order by status_for_date DESC"
    //sqlString = "SELECT * from art_program_status where program_id=" + program_id + "  order by status_for_date DESC LIMIT 0, 1 "
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramStatus.pStatus.singleOpt)
    }
  }
  
  def findAllProgramStatus(program_id: String): Seq[ProgramStatus] = {
    var sqlString = ""
    sqlString = "SELECT * from art_program_status where program_id=" + program_id + "  order by status_for_date DESC"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramStatus.pStatus *)
    }
  }  

  def findActivePrograms(): Seq[ProgramMaster] = {
    var sqlString = ""
    sqlString = "SELECT * from art_program where is_active=1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramMaster.pMaster *)
    }
  }

  def findActiveProgramsListForIds(program_id_list: String): Seq[ProgramMaster] = {
    var sqlString = "SELECT * from art_program where is_active = 1 AND program_id IN(" + program_id_list + ")"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramMaster.pMaster *)
    }
  }
  def findActiveProgramsIds() = {
    var sqlString = ""
    sqlString = "SELECT program_id from art_program where is_active=1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(scalar[Long] *)
    }
  }

  def searchDashboardReport(work_flow_status:String, program_name: String,program_type: String, program_sub_type: String, division: String, program_role: String, item_budget: String, sort_type: String): Seq[ProgramMaster] = {
    //var sqlString = ""
    //var stment1 = ""
    //var stment2 = ""
    //var stment3 = ""
    //var stment4 = ""
    //var stment5 = ""
    //var stment6 = ""
    //var stment7 = ""
    //var tstx = "OR"
    var sqlString = "SELECT * from art_program where "
 
    if (!StringUtils.isEmpty(work_flow_status)) {
      sqlString = sqlString + " work_flow_status = " + work_flow_status + " AND"
    }
    
    if (!StringUtils.isEmpty(program_name)) {
      sqlString = sqlString + " program_name like '%" + program_name + "%' AND"
    }
    
    if (!StringUtils.isEmpty(program_type)) {
      sqlString = sqlString + " program_type=" + program_type + " AND"
    }

    if (!StringUtils.isEmpty(program_sub_type)) {
      sqlString = sqlString + " program_sub_type=" + program_sub_type + " AND"
    }

    if (!StringUtils.isEmpty(division)) {
      sqlString = sqlString + " devison=" + division + " AND"
    }

    if (!StringUtils.isEmpty(program_role)) {
      sqlString = sqlString + " program_id IN ( select DISTINCT(program_id) from art_program_members where member_id=" + program_role + " ) AND"
      //sqlString = sqlString + " program_id IN ( select DISTINCT(program_id) from art_program_members where role_id=6 AND member_id=" + program_role + " ) AND"
    }

    if (!StringUtils.isEmpty(item_budget)) {
      sqlString = sqlString + " program_id IN (select DISTINCT(program_id) from art_program_sap_master where budget_type=" + item_budget + " and is_active=1) AND"
    }

    /*
    if (!StringUtils.isEmpty(delay_level)) {
      var minVal: Double = 0
      var maxVal: Double = 0
      var programIds = ""
      var nonProgramIds = ""

      Integer.parseInt(delay_level) match {
        case 0 =>
          minVal = 0
          maxVal = 0.7
        case 1 =>
          minVal = 0.7
          maxVal = 0.9
        case 2 =>
          minVal = 0.9
          maxVal = 1
        case 3 =>
          minVal = 1
          maxVal = 1000000
      }
      */
/*
      val programs = ProgramService.findActivePrograms()
      for (p <- programs) {
        val earn = SpiCpiCalculationsService.findCalculationsForDashboard(p.program_id.get.toString())

        if (!earn.isEmpty) {
          if (!earn.get.spi.isEmpty) {
            var spi = earn.get.spi.get
            if (spi >= minVal && spi < maxVal) {

              if (StringUtils.isEmpty(programIds)) {
                programIds = p.program_id.get.toString()
              } else {
                programIds += "," + p.program_id.get.toString()
              }
            }

          }
        }
        if (StringUtils.isEmpty(nonProgramIds)) {
          nonProgramIds = p.program_id.get.toString()
        } else {
          nonProgramIds += "," + p.program_id.get.toString()
        }
      }

      if (!StringUtils.isEmpty(programIds)) {
        sqlString = sqlString + " program_id IN (" + programIds + ") AND"
      } else {
        sqlString = sqlString + " program_id NOT IN (" + nonProgramIds + ") AND"
      }
    }
*/
    //println("---------------------"+sqlString)
/*
    if (!StringUtils.isEmpty(project_classification)) {
      var minVal: Double = 0
      var maxVal: Double = 0
      var programIds = ""
      var nonProgramIds = ""

      Integer.parseInt(project_classification) match {
        case 0 =>
          minVal = 0
          maxVal = 1350
        case 1 =>
          maxVal = 12500
          minVal = 1350
        case 2 =>
          minVal = 12500
          maxVal = -1
      }

      val programs = ProgramService.findActivePrograms()
      var isValid = false
      for (p <- programs) {
        isValid = false
        val total_investment = SAPServices.calculateTotalSAPInvestment(p.program_id.get.toString())
        val total_expenditure = SAPServices.calculateTotalSAPExpenditure(p.program_id.get.toString())
        val total_sum = total_investment + total_expenditure

        if (maxVal == -1) {
          if (total_sum >= minVal) {
            isValid = true
          }
        } else {

          if (total_sum >= minVal && total_sum < maxVal) {
            isValid = true
          }
        }

        if (isValid) {
          if (StringUtils.isEmpty(programIds)) {
            programIds = p.program_id.get.toString()

          } else {
            programIds += "," + p.program_id.get.toString()

          }
        }

        if (StringUtils.isEmpty(nonProgramIds)) {
          nonProgramIds = p.program_id.get.toString()
        } else {
          nonProgramIds = nonProgramIds + "," + p.program_id.get.toString()
        }

        isValid = false

      }

      if (!StringUtils.isEmpty(programIds)) {
        sqlString = sqlString + " program_id IN (" + programIds + ") AND"
      } else {
        sqlString = sqlString + " program_id NOT IN (" + nonProgramIds + ") AND"
      }

    }
*/
    if (sqlString.contains("AND")) {
      sqlString = rtrim(sqlString).toString()

      sqlString = sqlString + " AND is_active=1"

    } else {
      sqlString = sqlString + " is_active=1"
    }

    if (StringUtils.isNotEmpty(sort_type)) {
      if (sort_type.equals("1")) {
        sqlString = sqlString + " ORDER BY program_name asc";
      } else if (sort_type.equals("2")) {
        sqlString = sqlString + " ORDER BY release_date asc";
      }
    }

    //println("la super query:" + sqlString)
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramMaster.pMaster *)
    }
  }

  def searchDashboardReportForm(delay_level: String, project_classification: String, program_type: String, program_sub_type: String, division: String, program_role: String, item_budget: String, sort_type: String, gerencia: String, department: String): Seq[ProgramMaster] = {
    var sqlString = ""
    var stment1 = ""
    var stment2 = ""
    var stment3 = ""
    var stment4 = ""
    var stment5 = ""
    var stment6 = ""
    var stment7 = ""
    var tstx = "OR"
    sqlString = "SELECT * from art_program where   "
    if (!StringUtils.isEmpty(program_type)) {
      sqlString = sqlString + " program_type=" + program_type + " AND"
    }

    if (!StringUtils.isEmpty(program_sub_type)) {
      sqlString = sqlString + " program_sub_type=" + program_sub_type + " AND"
    }

    if (!StringUtils.isEmpty(division)) {
      sqlString = sqlString + " devison=" + division + " AND"
    }
    if (!StringUtils.isEmpty(gerencia)) {
      sqlString = sqlString + " management=" + gerencia + " AND"
    }
    if (!StringUtils.isEmpty(department)) {
      sqlString = sqlString + " department=" + department + " AND"
    }

    if (!StringUtils.isEmpty(program_role)) {
      sqlString = sqlString + " program_id IN ( select DISTINCT(program_id) from art_program_members where role_id=6 AND member_id=" + program_role + " ) AND"
    }

    if (!StringUtils.isEmpty(item_budget)) {
      sqlString = sqlString + " program_id IN (select DISTINCT(program_id) from art_program_sap_master where budget_type=" + item_budget + " and is_active=1) AND"
    }

    if (!StringUtils.isEmpty(delay_level)) {
      var minVal: Double = 0
      var maxVal: Double = 0
      var programIds = ""
      var nonProgramIds = ""

      Integer.parseInt(delay_level) match {
        case 0 =>
          minVal = 0
          maxVal = 0.7
        case 1 =>
          minVal = 0.7
          maxVal = 0.9
        case 2 =>
          minVal = 0.9
          maxVal = 1
        case 3 =>
          minVal = 1
          maxVal = 1000000
      }

      val programs = ProgramService.findActivePrograms()
      for (p <- programs) {
        val earn = SpiCpiCalculationsService.findCalculationsForDashboard(p.program_id.get.toString())

        if (!earn.isEmpty) {
          if (!earn.get.spi.isEmpty) {
            var spi = earn.get.spi.get
            if (spi >= minVal && spi < maxVal) {

              if (StringUtils.isEmpty(programIds)) {
                programIds = p.program_id.get.toString()
              } else {
                programIds += "," + p.program_id.get.toString()
              }
            }

          }
        }
        if (StringUtils.isEmpty(nonProgramIds)) {
          nonProgramIds = p.program_id.get.toString()
        } else {
          nonProgramIds += "," + p.program_id.get.toString()
        }
      }

      if (!StringUtils.isEmpty(programIds)) {
        sqlString = sqlString + " program_id IN (" + programIds + ") AND"
      } else {
        sqlString = sqlString + " program_id NOT IN (" + nonProgramIds + ") AND"
      }
    }

    //println("---------------------"+sqlString)
    if (!StringUtils.isEmpty(project_classification)) {
      var minVal: Double = 0
      var maxVal: Double = 0
      var programIds = ""
      var nonProgramIds = ""

      Integer.parseInt(project_classification) match {
        case 0 =>
          minVal = 0
          maxVal = 1350
        case 1 =>
          maxVal = 12500
          minVal = 1350
        case 2 =>
          minVal = 12500
          maxVal = -1
      }

      val programs = ProgramService.findActivePrograms()
      var isValid = false
      for (p <- programs) {
        isValid = false
        val total_investment = SAPServices.calculateTotalSAPInvestment(p.program_id.get.toString())
        val total_expenditure = SAPServices.calculateTotalSAPExpenditure(p.program_id.get.toString())
        val total_sum = total_investment + total_expenditure

        if (maxVal == -1) {
          if (total_sum >= minVal) {
            isValid = true
          }
        } else {

          if (total_sum >= minVal && total_sum < maxVal) {
            isValid = true
          }
        }

        if (isValid) {
          if (StringUtils.isEmpty(programIds)) {
            programIds = p.program_id.get.toString()

          } else {
            programIds += "," + p.program_id.get.toString()

          }
        }

        if (StringUtils.isEmpty(nonProgramIds)) {
          nonProgramIds = p.program_id.get.toString()
        } else {
          nonProgramIds = nonProgramIds + "," + p.program_id.get.toString()
        }

        isValid = false

      }

      if (!StringUtils.isEmpty(programIds)) {
        sqlString = sqlString + " program_id IN (" + programIds + ") AND"
      } else {
        sqlString = sqlString + " program_id NOT IN (" + nonProgramIds + ") AND"
      }

    }

    if (sqlString.contains("AND")) {
      sqlString = rtrim(sqlString).toString()

      sqlString = sqlString + " AND is_active=1"

    } else {
      sqlString = sqlString + " is_active=1"
    }

    if (StringUtils.isNotEmpty(sort_type)) {
      if (sort_type.equals("1")) {
        sqlString = sqlString + " ORDER BY program_name asc";
      } else if (sort_type.equals("2")) {
        sqlString = sqlString + " ORDER BY release_date asc";
      }
    }
    //println("sqlString ==   " + sqlString)
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramMaster.pMaster *)
    }
  }

  def rtrim(s: String): String = {
    var i = s.length() - 4;
    while (i >= 0 && Character.isWhitespace(s.charAt(i))) {
      i = i - 1;
    }
    s.substring(0, i + 1)
  }

  def getUniqueProgramCode(): Long = {
    var program_count = 0
    var sql = ""
    val df = new DecimalFormat("00")
    val today = Calendar.getInstance()

    today.setTime(new Date())
    var program_code: Long = (today.get(Calendar.YEAR) + "" + df.format((today.get(Calendar.MONTH) + 1).toInt) + "" + df.format(1.toLong)).toLong

    var newcode = ""

    sql = "select TOP 1* from  art_program_code_master order by id DESC";
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProgramCodes.program_code.singleOpt)
      if (!result.isEmpty) {
        program_count = result.size
        program_code = result.get.program_code
      }
    }

    var isValid = ProgramService.findPrgoramCode(program_code)
    /**
     * run loop till we will not get unique program code
     */
    var i = 0

    while (!isValid) {
      val len = program_code.toString().length()
      if (program_count > 0) {
        program_count = program_count.toInt + 1
        val today = Calendar.getInstance()
        today.setTime(new Date())
        newcode = today.get(Calendar.YEAR) + "" + df.format((today.get(Calendar.MONTH) + 1).toInt) + "" + df.format(program_count)
        program_code = newcode.toLong

      }

      isValid = ProgramService.findPrgoramCode(program_code)
    }

    if (isValid) {
      InsertProgramCode(program_code)
    }
    program_code
  }

  def InsertProgramCode(program_code: Long) = {
    val pc = ProgramCodes(Option(1), program_code, new Date())
    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          insert into  art_program_code_master (
            program_code, creation_date
          ) 
          values(
            {program_code}, {creation_date}
          )
          """).on(
          'program_code -> pc.program_code,
          'creation_date -> new Date()).executeUpdate()
    }
  }

  def softDeleteProgram(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "update art_program set is_active = 0 where  program_id='" + id + "'").on(
          'program_id -> id).executeUpdate()
    }
  }

  def getPlannedHoursForProgram(program_id: String): Double = {
    var sqlString = ""
    var valueP: Double = 0
    sqlString = "select * from art_program where is_active = 1 AND program_id=" + program_id
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(ProgramMaster.pMaster.singleOpt)
      if (!result.isEmpty) {
        if (!result.get.planned_hours.isEmpty) {
          valueP = result.get.planned_hours.get
        }
      }
    }
    valueP
  }

  def updateProgramEstimatedCost(program_id: String, est_cost: String) {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "update art_program set estimated_cost =" + est_cost + " where  program_id='" + program_id + "'").on(
          'program_id -> program_id).executeUpdate()
    }
  }

  def completionPercentageForProgram(program_id: String): scala.math.BigDecimal = {
    var completion_percentage_forProgram: scala.math.BigDecimal = 0
    if (!StringUtils.isEmpty(program_id)) {
      val program = ProgramService.findProgramMasterDetailsById(program_id)
      val projects = ProjectService.findProjectListForProgram(program_id)
      var plan_time_for_program: scala.math.BigDecimal = 0.0
      var actual_hours_completed_for_program: scala.math.BigDecimal = 0.0
      for (project <- projects) {

        var actual_hours_completed_for_project: scala.math.BigDecimal = 0.0

        val tasks = TaskService.findTaskListByProjectId(project.pId.get.toString)
        for (c <- tasks) {
          //plan_time_for_program = plan_time_for_program.+(c.plan_time) // new definition for completion percentage
          val subtasks = TaskService.findSubTaskListByTaskId(c.tId.get.toString())
          var compl_per_task: scala.math.BigDecimal = 0
          var actual_hours_completed_for_task: scala.math.BigDecimal = 0
          for (subtask <- subtasks) {
            val allocationsubtasks = SubTaskServices.findSubTasksAllocationBySubTask(subtask.sub_task_id.get.toString())
            var hrs_allocated_to_subtask = 0.0
            var acutal_hours_completed_for_subtask: scala.math.BigDecimal = 0
            for (suballoc <- allocationsubtasks) {
              hrs_allocated_to_subtask += suballoc.estimated_time.toDouble
              // println("hrs_allocated_to_subtask = " + suballoc.estimated_time.toDouble + "subtask completion_percentage =  " + subtask.completion_percentage.get)
            }

            val allocationsubtasksexternal = SubTaskServices.findSubTasksAllocationExternalBySubTask(subtask.sub_task_id.get.toString())
            for (suballoc2 <- allocationsubtasksexternal) {
              hrs_allocated_to_subtask += suballoc2.estimated_time.toDouble
              // println("hrs_allocated_to_subtask = " + suballoc.estimated_time.toDouble + "subtask completion_percentage =  " + subtask.completion_percentage.get)
            }

            if (!subtask.completion_percentage.isEmpty) {
              acutal_hours_completed_for_subtask = (hrs_allocated_to_subtask * subtask.completion_percentage.get / 100)
            } else {
              acutal_hours_completed_for_subtask = 0
            }

            actual_hours_completed_for_task += acutal_hours_completed_for_subtask
          }
          // println("actual_hours_completed_for_task = " + actual_hours_completed_for_task)
          actual_hours_completed_for_project += actual_hours_completed_for_task
        }
        actual_hours_completed_for_program += actual_hours_completed_for_project

      }
      plan_time_for_program = program.get.planned_hours.getOrElse(0).toString().toDouble // new definition for completion percentage
      if (actual_hours_completed_for_program != 0 && plan_time_for_program != 0) {

        completion_percentage_forProgram = ((actual_hours_completed_for_program / plan_time_for_program) * 100).setScale(2, RoundingMode.HALF_UP);
      } else {
        completion_percentage_forProgram = 0.0
      }

    }

    completion_percentage_forProgram
  }

  //VP
  def getProgramPlannedValue(program_id: String) = {
    var result: Option[Double] = Option(0)

    var sql = """   SELECT planned_hours from art_program  where program_id=""" + program_id + """ AND is_active=1  """
    DB.withConnection { implicit connection =>
      try {
        result = SQL(sql).as(scalar[Double].singleOpt)
      } catch {
        case e: Exception =>
      }
      result

    }
  }
  ///VA
  def getProgramValueAssigned(program_id: String) = {
    var sql = """   SELECT SUM(estimated_time) estimated_time FROM
(SELECT ISNULL(SUM(estimated_time),0)
estimated_time FROM art_sub_task_allocation WHERE task_id IN 
(SELECT tId FROM art_task WHERE pId IN (SELECT pId FROM art_project_master WHERE program=""" + program_id + """))
 AND is_deleted=1
UNION ALL
SELECT ISNULL(SUM(estimated_time),0) estimated_time FROM art_sub_task_allocation_external WHERE task_id IN 
(SELECT tId FROM art_task WHERE pId IN (SELECT pId FROM art_project_master WHERE program=""" + program_id + """)) 
AND is_deleted=1
) AS TOTAL"""
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }

  //VG Expected earned value
  def getProgramEarnValue(program_id: String): Option[Double] = {
    var sql = """  SELECT SUM(suma) FROM
(
SELECT SUM(A.estimated_time * A.completion_percentage /100) suma FROM
(SELECT b.tId, a.sub_task_id, d.estimated_time, a.completion_percentage
FROM art_sub_task_allocation d 
INNER JOIN art_sub_task a
ON d.sub_task_id=a.sub_task_id
INNER JOIN art_task b
ON a.task_id=b.tId
INNER JOIN art_project_master c
ON b.pId=c.pId
WHERE c.program=""" + program_id + """ AND
a.plan_end_date < GETDATE() AND
a.completion_percentage > 0 AND
a.is_deleted=1 AND
b.is_active=1 AND
c.is_active=1 AND
d.is_deleted=1) A
INNER JOIN 
(SELECT d.sub_task_id,SUM(d.hours) hours
FROM art_timesheet d 
INNER JOIN art_sub_task a
ON d.sub_task_id=a.sub_task_id
INNER JOIN art_task b
ON a.task_id=b.tId
INNER JOIN art_project_master c
ON b.pId=c.pId
WHERE c.program=""" + program_id + """ AND
a.plan_end_date < GETDATE() AND
a.is_deleted=1 AND
b.is_active=1 AND
c.is_active=1 AND
d.is_deleted=1
GROUP BY d.sub_task_id
UNION ALL
SELECT d.sub_task_id,SUM(d.hours) hours
FROM art_timesheet_external d 
INNER JOIN art_sub_task a
ON d.sub_task_id=a.sub_task_id
INNER JOIN art_task b
ON a.task_id=b.tId
INNER JOIN art_project_master c
ON b.pId=c.pId
WHERE c.program=""" + program_id + """ AND
a.plan_end_date < GETDATE() AND
a.is_deleted=1 AND
b.is_active=1 AND
c.is_active=1 AND
d.is_deleted=1
GROUP BY d.sub_task_id
) B
ON A.sub_task_id=B.sub_task_id
UNION ALL
SELECT SUM(A.estimated_time * A.completion_percentage /100) suma FROM
(SELECT b.tId, a.sub_task_id, d.estimated_time, a.completion_percentage
FROM art_sub_task_allocation_external d 
INNER JOIN art_sub_task a
ON d.sub_task_id=a.sub_task_id
INNER JOIN art_task b
ON a.task_id=b.tId
INNER JOIN art_project_master c
ON b.pId=c.pId
WHERE c.program=""" + program_id + """ AND
a.plan_end_date < GETDATE() AND
a.completion_percentage > 0 AND
a.is_deleted=1 AND
b.is_active=1 AND
c.is_active=1 AND
d.is_deleted=1) A
INNER JOIN 
(SELECT d.sub_task_id,SUM(d.hours) hours
FROM art_timesheet d 
INNER JOIN art_sub_task a
ON d.sub_task_id=a.sub_task_id
INNER JOIN art_task b
ON a.task_id=b.tId
INNER JOIN art_project_master c
ON b.pId=c.pId
WHERE c.program=""" + program_id + """ AND
a.plan_end_date < GETDATE() AND
a.is_deleted=1 AND
b.is_active=1 AND
c.is_active=1 AND
d.is_deleted=1
GROUP BY d.sub_task_id
UNION ALL
SELECT d.sub_task_id,SUM(d.hours) hours
FROM art_timesheet_external d 
INNER JOIN art_sub_task a
ON d.sub_task_id=a.sub_task_id
INNER JOIN art_task b
ON a.task_id=b.tId
INNER JOIN art_project_master c
ON b.pId=c.pId
WHERE c.program=""" + program_id + """ AND
a.plan_end_date < GETDATE() AND
a.is_deleted=1 AND
b.is_active=1 AND
c.is_active=1 AND
d.is_deleted=1
GROUP BY d.sub_task_id
) B
ON A.sub_task_id=B.sub_task_id
) AS TOTAL
"""
    // println(sql)
    var result: Option[Double] = Option(0)
    DB.withConnection { implicit connection =>
      try {
        result = SQL(sql).as(scalar[Double].singleOpt)
      } catch {
        case e: Exception => return result
      }
      result
    }
  }

  //HC //actual cost non canonical
  def getProgramActualCost(program_id: String): Option[Double] = {
    var sql = """   
              SELECT SUM(hours) hours FROM
              (SELECT  ISNULL(SUM(hours),0) hours FROM art_timesheet WHERE task_id IN (SELECT tId FROM art_task WHERE pId IN (SELECT pId FROM art_project_master WHERE program=""" + program_id + """)) AND is_deleted=1
              UNION ALL
              SELECT  ISNULL(SUM(hours),0) hours FROM art_timesheet_external WHERE task_id  IN (SELECT tId FROM art_task WHERE pId IN (SELECT pId FROM art_project_master WHERE program=""" + program_id + """)) AND is_deleted=1
              ) AS TOTAL
                """
    //println(sql)
    var result: Option[Double] = Option(0)
    DB.withConnection { implicit connection =>
      try {
        result = SQL(sql).as(scalar[Double].singleOpt)
      } catch {
        case e: Exception => return result
      }
      result
    }
  }

  ///FIP planned start date

  ////FTP planned end date

  ///FIR  Minimum date on which a worked hour is registered for the sub tasks of a task
  def getProgramMinDate(program_id: String) = {
    var sql = """    
             SELECT MIN(fecha) FROM
              (
              SELECT MIN(d.task_for_date) fecha
              FROM art_timesheet d
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
              INNER JOIN art_project_master c
              ON b.pId=c.pId
              WHERE c.program = """ + program_id + """ AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              c.is_active=1 AND
              d.is_deleted=1
              UNION
              SELECT MIN(d.task_for_date) fecha
              FROM art_timesheet_external d
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
              INNER JOIN art_project_master c
              ON b.pId=c.pId
              WHERE c.program = """ + program_id + """ AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              c.is_active=1 AND
              d.is_deleted=1
              ) AS MINIMOS
              """
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Date].singleOpt)
      result
    }
  }

  ///FTR Real end date, it corresponds to the latest date on which a sub task had register of hours worked, once it is 100% finished
  def getProgramMaxDate(program_id: String) = {
    var sql = """    
              SELECT MAX(fecha) FROM
              (
              SELECT MAX(d.task_for_date) fecha
              FROM art_timesheet d
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
              INNER JOIN art_project_master c
              ON b.pId=c.pId
              WHERE c.program = """ + program_id + """ AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              c.is_active=1 AND
              d.is_deleted=1
              UNION
              SELECT MAX(d.task_for_date) fecha
              FROM art_timesheet_external d
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
              INNER JOIN art_project_master c
              ON b.pId=c.pId
              WHERE c.program = """ + program_id + """ AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              c.is_active=1 AND
              d.is_deleted=1
              ) AS MAXIMOS
              """
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Date].singleOpt)
      result
    }
  }

  //VG Expected earned value
  def getProgramExpectedEarnValue(program_id: String) = {
    var sql = """  
              SELECT SUM(estimated_time) estimated_time FROM
              (SELECT  ISNULL(SUM(estimated_time),0) estimated_time FROM art_sub_task_allocation WHERE 
              sub_task_id IN (SELECT sub_task_id FROM art_sub_task WHERE plan_end_date < GETDATE() AND task_id IN
               (SELECT tId FROM art_task WHERE pId IN (SELECT pId FROM art_project_master WHERE program=""" + program_id + """))   AND is_deleted=1)  AND is_deleted=1
              UNION ALL
              SELECT  ISNULL(SUM(estimated_time),0) estimated_time FROM art_sub_task_allocation_external WHERE
              sub_task_id IN (SELECT sub_task_id FROM art_sub_task WHERE plan_end_date < GETDATE() AND task_id IN 
              (SELECT tId FROM art_task WHERE pId IN (SELECT pId FROM art_project_master WHERE program=""" + program_id + """))   AND is_deleted=1) AND is_deleted=1) AS TOTAL


              """
    // println(sql)
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }

  def getProgramUserCapacity(uid: Integer, periodo: Integer): Seq[ProgramUserCapacity] = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.list_member_program  {uid},{periodo}").on(
        'uid -> uid.toInt, 'periodo -> periodo.toInt).executeQuery().as(ProgramUserCapacity.programUserCapacity *)
    }
  }
}