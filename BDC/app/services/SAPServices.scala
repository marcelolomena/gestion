package services

import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models.Stages
import anorm._
//import com.typesafe.plugin._
import com.sun.xml.internal.ws.wsdl.writer.document.Import
import java.util._
import models.SAPMaster
import play.api.data.Form
import play.i18n.Messages
import play.i18n.Lang
import models.Project
import models.ProjectSAP
import models.ProjectSAP
import org.apache.commons.lang3.StringUtils
import controllers.Frontend.Program
import models.SAP
import models.ExpenseDetails
import models.ProjectSAPMaster
import models.ProjectExpenseDetails
import models.CustomColumns
import scala.math.BigDecimal.RoundingMode
import models.HardwareSAP
import models.SoftwareSAP
import models.TelecommunicationSAP
import models.DevelopemntSAP
import models.OtherSAP
import models.QASAP
import models.ImprovementsSAP
import models.RecurringSAP
import java.sql.SQLException

object SAPServices extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))

  def insertSAP(sap: SAPMaster): Long = {

    var planned_hours: Double = 0

    DB.withConnection { implicit connection =>

      val sap_master = SQL(
        """
          insert into  art_program_sap_master (program_id,sap_number,budget_type, cui1, 
          cui1_per,cui2,cui2_per,is_active,creation_date,last_update,approved_date,comitted_date, close_date
         ) values (
          {program_id}, {sap_number},{budget_type},
          {cui1},{cui1_per},{cui2},{cui2_per},{is_active},{creation_date},{last_update},{approved_date},{comitted_date},{close_date})
          """).on(
          'program_id -> sap.program_id,
          'sap_number -> sap.sap_number,
          'budget_type -> sap.budget_type,
          'cui1 -> sap.cui1,
          'cui1_per -> sap.cui1_per,
          'cui2 -> sap.cui2,
          'cui2_per -> sap.cui2_per,
          'is_active -> 1,
          'creation_date -> new Date(),
          'approved_date -> sap.approved_date,
          'comitted_date -> sap.comitted_date,
          'close_date -> sap.close_date,
          'last_update -> new Date()).executeInsert(scalar[Long].singleOpt)

      var last_index = sap_master.last

      if (!last_index.isNaN()) {

        //Investment = 0
        val sap_invest = SQL(
          """
          insert into art_program_sap_details (sap_id, expense_type,  hardware,   software, 
            telecommunication,development,other,qa,improvements,recurring_first
         ) values (
						{sap_id}, {expense_type},  {hardware},   {software}, 
						{telecommunication},{development},{other},{qa},{improvements},{recurring_first})
          """).on(
            'sap_id -> last_index,
            'expense_type -> 0,
            'hardware -> sap.investment.investment_hardware,
            'software -> sap.investment.investment_software,
            'telecommunication -> sap.investment.investment_telecommunication,
            'development -> sap.investment.investment_development,
            'other -> sap.investment.investment_other,
            'qa -> sap.investment.investment_qa,
            'improvements -> sap.investment.investment_improvements,
            'recurring_first -> sap.investment.investment_recurring_first).executeInsert(scalar[Long].singleOpt)

        //Expenditure = 1
        val sap_expese = SQL(
          """
          insert into art_program_sap_details (sap_id, expense_type,  hardware,   software, 
            telecommunication,development,other,qa,improvements,recurring_first
         ) values (
            {sap_id}, {expense_type},  {hardware},   {software}, 
            {telecommunication},{development},{other},{qa},{improvements},{recurring_first})
          """).on(
            'sap_id -> last_index,
            'expense_type -> 1,
            'hardware -> sap.expenditure.expenditure_hardware,
            'software -> sap.expenditure.expenditure_software,
            'telecommunication -> sap.expenditure.expenditure_telecommunication,
            'development -> sap.expenditure.expenditure_development,
            'other -> sap.expenditure.expenditure_other,
            'qa -> sap.expenditure.expenditure_qa,
            'improvements -> sap.expenditure.expenditure_improvements,
            'recurring_first -> sap.expenditure.expenditure_recurring_first).executeInsert(scalar[Long].singleOpt)

      }

      last_index
    }

  }

  def updateProgramPlannedHours(program_id: String, hours: String) {
    var planned_hours: Double = 0
    DB.withConnection { implicit connection =>
      if (!StringUtils.isEmpty(hours)) {
        planned_hours = hours.toDouble
        val current_hours = ProgramService.getPlannedHoursForProgram(program_id)
        if (current_hours != planned_hours) {
          val program_hours = SQL(
            """
                  update  art_program SET planned_hours={planned_hours} where program_id={program_id}
                  """).on(
              'program_id -> program_id,
              'planned_hours -> planned_hours).executeUpdate()
        }
      }
    }
  }

  def updateProjectPlannedHours(project_id: String, hours: String) {
    var planned_hours: Double = 0
    DB.withConnection { implicit connection =>
      if (!StringUtils.isEmpty(hours)) {
        planned_hours = hours.toDouble
        val current_hours = ProjectService.getPlannedHoursForProject(project_id)
        if (current_hours != planned_hours) {
          val program_hours = SQL(
            """
                  update  art_project_master SET planned_hours={planned_hours} where pId={project_id}
                  """).on(
              'project_id -> project_id,
              'planned_hours -> planned_hours).executeUpdate()
        }
      }
    }
  }

  def updateSAP(sap: SAPMaster, sap_id: String) = {
    var planned_hours: Double = 0
    DB.withConnection { implicit connection =>

      val sap_master = SQL(
        """
          update  art_program_sap_master SET program_id={program_id},sap_number={sap_number},budget_type={budget_type}, cui1={cui1}, 
          cui1_per={cui1_per},cui2={cui2},cui2_per={cui2_per},last_update={last_update},approved_date={approved_date},comitted_date={comitted_date},close_date={close_date} where id={sap_id}
          """).on(
          'sap_id -> sap_id,
          'program_id -> sap.program_id,
          'sap_number -> sap.sap_number,
          'budget_type -> sap.budget_type,
          'cui1 -> sap.cui1,
          'cui1_per -> sap.cui1_per,
          'cui2 -> sap.cui2,
          'cui2_per -> sap.cui2_per,
          'last_update -> new Date(),
          'approved_date -> sap.approved_date,
          'comitted_date -> sap.comitted_date,
          'close_date -> sap.close_date).executeUpdate()

      //Investment = 0
      val sap_invest = SQL(
        """
          update art_program_sap_details SET   hardware={hardware},   software={software}, 
            telecommunication={telecommunication},development={development},other={other},qa={qa},improvements={improvements},recurring_first={recurring_first}
          where (sap_id={sap_id} and expense_type={expense_type})
          """).on(
          'sap_id -> sap_id,
          'expense_type -> 0,
          'hardware -> sap.investment.investment_hardware,
          'software -> sap.investment.investment_software,
          'telecommunication -> sap.investment.investment_telecommunication,
          'development -> sap.investment.investment_development,
          'other -> sap.investment.investment_other,
          'qa -> sap.investment.investment_qa,
          'improvements -> sap.investment.investment_improvements,
          'recurring_first -> sap.investment.investment_recurring_first).executeUpdate()

      //Expenditure = 1
      val sap_expese = SQL(
        """
          update art_program_sap_details SET   hardware={hardware},   software={software}, 
            telecommunication={telecommunication},development={development},other={other},qa={qa},improvements={improvements},recurring_first={recurring_first}
          where (sap_id={sap_id} and expense_type={expense_type})
          """).on(
          'sap_id -> sap_id,
          'expense_type -> 1,
          'hardware -> sap.expenditure.expenditure_hardware,
          'software -> sap.expenditure.expenditure_software,
          'telecommunication -> sap.expenditure.expenditure_telecommunication,
          'development -> sap.expenditure.expenditure_development,
          'other -> sap.expenditure.expenditure_other,
          'qa -> sap.expenditure.expenditure_qa,
          'improvements -> sap.expenditure.expenditure_improvements,
          'recurring_first -> sap.expenditure.expenditure_recurring_first).executeUpdate()

      if (!sap.planned_hours.isEmpty) {
        planned_hours = sap.planned_hours.get
        val program_id = sap.program_id.toString()
        val current_hours = ProgramService.getPlannedHoursForProgram(program_id)
        if (current_hours != planned_hours) {
          val program_hours = SQL(
            """
                  update  art_program SET planned_hours={planned_hours} where program_id={program_id}
                  """).on(
              'program_id -> program_id,
              'planned_hours -> planned_hours).executeUpdate()
        }
      }
    }

  }

  def findSAPMasterDetails(sap_id: String) = {
    var sql = ""
    sql = "select * from art_program_sap_master where id='" + sap_id + "' "
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SAP.sap.singleOpt)
      result

    }
  }

  def findSAPMasterBySAPNumber(sap_number: String, program_id: String, sap_id: String) = {
    var sql = ""
    if (sap_id.trim().isEmpty())
      sql = "select * from art_program_sap_master where sap_number='" + sap_number + "' and program_id='" + program_id + "'  and is_active=1"
    else
      sql = "select * from art_program_sap_master where id <> " + sap_id.trim() + "and sap_number='" + sap_number + "' and program_id='" + program_id + "'  and is_active=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SAP.sap *)
      result
    }
  }

  def findActiveSAPMasterDetails(program_id: String) = {
    var sql = ""
    sql = "select * from art_program_sap_master where program_id='" + program_id + "' and is_active=1 order by creation_date desc"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SAP.sap *)
      result

    }
  }

  def findAllSAPMasterDetails(program_id: String) = {
    var sql = ""
    sql = "select * from art_program_sap_master where program_id='" + program_id + "' AND is_active=1  order by creation_date desc"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SAP.sap *)
      result

    }
  }

  def findSAPOldInvestmentDetails(id: String) = {
    var sql = ""
    sql = "select * from art_project_sap_details where project_sap_id='" + id + "' and expense_type=0 "

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectExpenseDetails.project_sap.singleOpt)
      result

    }
  }

  def findSAPOldExpenditureDetails(id: String) = {
    var sql = ""
    sql = "select * from art_project_sap_details where project_sap_id='" + id + "' and expense_type=1 "

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectExpenseDetails.project_sap.singleOpt)
      result

    }
  }

  def findSAPInvestmentDetails(sap_id: String) = {
    var sql = ""
    sql = "select * from art_program_sap_details where sap_id='" + sap_id + "' and expense_type=0 "

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ExpenseDetails.sap_data.singleOpt)
      result

    }
  }

  def findSAPExpenditureDetails(sap_id: String) = {
    var sql = ""
    sql = "select * from art_program_sap_details where sap_id='" + sap_id + "' and expense_type=1"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ExpenseDetails.sap_data.singleOpt)
      result

    }
  }
  def findActiveSAPMasterForProject(program_id: String, project_id: String) = {
    var sql = ""
    var sap_list = ""
    sql = "select * from art_project_sap_master where project_id='" + project_id + "' and is_active=1"

    DB.withConnection { implicit connection =>
      val results = SQL(sql).as(ProjectSAPMaster.project_sap_master *)
      for (r <- results) {

        if (StringUtils.isEmpty(sap_list)) {
          sap_list = r.sap_id.toString
        } else {
          sap_list = sap_list + ", " + r.sap_id.toString
        }
      }

    }
    if (StringUtils.isEmpty(sap_list)) {
      sql = "select * from art_program_sap_master where program_id='" + program_id + "' and is_active=1 order by creation_date desc"
    } else {
      sql = "select * from art_program_sap_master where program_id='" + program_id + "' and id Not In(" + sap_list + ") and is_active=1 order by creation_date desc"
    }
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SAP.sap *)
      result

    }
  }

  def calculateTotalSAPInvestment(pogram_id: String) = {
    var sql = ""
    var total: Double = 0
    var finalTotal: scala.math.BigDecimal = 0
    val saps = findAllSAPMasterDetails(pogram_id)
    for (s <- saps) {
      finalTotal += calculateSAPInvestment(s.id.toString())
    }
    finalTotal = finalTotal.setScale(2, RoundingMode.HALF_UP);
    finalTotal
  }

  def calculateTotalSAPExpenditure(pogram_id: String) = {
    var sql = ""
    var total: Double = 0
    var finalTotal: scala.math.BigDecimal = 0
    val saps = findAllSAPMasterDetails(pogram_id)
    for (s <- saps) {
      finalTotal += calculateSAPExpenditure(s.id.toString())
    }
    finalTotal = finalTotal.setScale(2, RoundingMode.HALF_UP);
    finalTotal
  }

  def calculateSAPInvestment(sap_id: String) = {
    var sql = ""
    var total: scala.math.BigDecimal = 0
    sql = "select * from art_program_sap_details where sap_id='" + sap_id + "' and expense_type=0"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ExpenseDetails.sap_data.singleOpt)
      var hw: Double = 0
      var sw: Double = 0
      var improvements: Double = 0
      var qa: Double = 0
      var recurring_first: Double = 0
      var telecommunication: Double = 0
      var other: Double = 0
      var development: Double = 0

      if (!result.isEmpty && !result.get.hardware.isEmpty) {
        hw = result.get.hardware.get
      }
      if (!result.isEmpty && !result.get.software.isEmpty) {
        sw = result.get.software.get
      }
      if (!result.isEmpty && !result.get.improvements.isEmpty) {
        improvements = result.get.improvements.get
      }
      if (!result.isEmpty && !result.get.qa.isEmpty) {
        qa = result.get.qa.get
      }
      if (!result.isEmpty && !result.get.recurring_first.isEmpty) {
        recurring_first = result.get.recurring_first.get
      }
      if (!result.isEmpty && !result.get.other.isEmpty) {
        other = result.get.other.get
      }
      if (!result.isEmpty && !result.get.telecommunication.isEmpty) {
        telecommunication = result.get.telecommunication.get
      }

      if (!result.isEmpty && !result.get.development.isEmpty) {
        development = result.get.development.get
      }
      if (!result.isEmpty) {
        total = hw + sw + improvements + qa + recurring_first + other + telecommunication + development
      }
      //println(total+"---------------------");
      total.setScale(2, RoundingMode.HALF_UP);
    }

  }

  def calculateSAPExpenditure(sap_id: String) = {
    var sql = ""
    var total: scala.math.BigDecimal = 0
    sql = "select * from art_program_sap_details where sap_id='" + sap_id + "' and expense_type=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ExpenseDetails.sap_data.singleOpt)
      var hw: Double = 0
      var sw: Double = 0
      var improvements: Double = 0
      var qa: Double = 0
      var recurring_first: Double = 0
      var telecommunication: Double = 0
      var other: Double = 0
      var development: Double = 0
      if (!result.isEmpty && !result.get.hardware.isEmpty) {
        hw = result.get.hardware.get
      }
      if (!result.isEmpty && !result.get.software.isEmpty) {
        sw = result.get.software.get
      }
      if (!result.isEmpty && !result.get.improvements.isEmpty) {
        improvements = result.get.improvements.get
      }
      if (!result.isEmpty && !result.get.qa.isEmpty) {
        qa = result.get.qa.get
      }
      if (!result.isEmpty && !result.get.recurring_first.isEmpty) {
        recurring_first = result.get.recurring_first.get
      }
      if (!result.isEmpty && !result.get.other.isEmpty) {
        other = result.get.other.get
      }
      if (!result.isEmpty && !result.get.telecommunication.isEmpty) {
        telecommunication = result.get.telecommunication.get
      }
      if (!result.isEmpty && !result.get.development.isEmpty) {
        development = result.get.development.get
      }

      if (!result.isEmpty) {
        total = hw + sw + improvements + qa + recurring_first + other + telecommunication + development
      }
      //println(total);

      total.setScale(2, RoundingMode.HALF_UP);
    }
  }

  def changeSAPStatus(status: Integer, sap_id: String) = {

    DB.withConnection { implicit connection =>
      val sap = SQL(
        """
          update  art_program_sap_master SET is_active={is_active},last_update={last_update} where id={sap_id}
          """).on(
          'sap_id -> sap_id,
          'is_active -> status,
          'last_update -> new Date()).executeUpdate()
    }

  }

  def changeProjectSAPStatus(status: Integer, id: String) = {

    DB.withConnection { implicit connection =>
      val sap = SQL(
        """
          update  art_project_sap_master SET is_active={is_active},last_update={last_update} where id={id}
          """).on(
          'id -> id,
          'is_active -> status,
          'last_update -> new Date()).executeUpdate()
    }

  }

  def fillSAPValues(old_sap_form: Form[SAPMaster]): java.util.LinkedHashMap[String, String] = {
    var valueMap = new java.util.LinkedHashMap[String, String]()

    //Hardware
    if (!old_sap_form.data.get("paid_investment_hardware").get.isEmpty()) {
      valueMap.put("paid_investment_hardware", old_sap_form.data.get("paid_investment_hardware").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_investment_hardware").get.isEmpty()) {
      valueMap.put("committed_investment_hardware", old_sap_form.data.get("committed_investment_hardware").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_investment_hardware").get.isEmpty()) {
      valueMap.put("non_committed_investment_hardware", old_sap_form.data.get("non_committed_investment_hardware").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_investment_hardware").get.isEmpty()) {
      valueMap.put("available_investment_hardware", old_sap_form.data.get("available_investment_hardware").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("paid_expenditure_hardware").get.isEmpty()) {
      valueMap.put("paid_expenditure_hardware", old_sap_form.data.get("paid_expenditure_hardware").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_expenditure_hardware").get.isEmpty()) {
      valueMap.put("committed_expenditure_hardware", old_sap_form.data.get("committed_expenditure_hardware").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_expenditure_hardware").get.isEmpty()) {
      valueMap.put("non_committed_expenditure_hardware", old_sap_form.data.get("non_committed_expenditure_hardware").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_expenditure_hardware").get.isEmpty()) {
      valueMap.put("available_expenditure_hardware", old_sap_form.data.get("available_expenditure_hardware").get.replaceAll("\\.+", "").toString())
    }

    //Software
    if (!old_sap_form.data.get("paid_investment_software").get.isEmpty()) {
      valueMap.put("paid_investment_software", old_sap_form.data.get("paid_investment_software").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_investment_software").get.isEmpty()) {
      valueMap.put("committed_investment_software", old_sap_form.data.get("committed_investment_software").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_investment_software").get.isEmpty()) {
      valueMap.put("non_committed_investment_software", old_sap_form.data.get("non_committed_investment_software").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_investment_software").get.isEmpty()) {
      valueMap.put("available_investment_software", old_sap_form.data.get("available_investment_software").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("paid_expenditure_software").get.isEmpty()) {
      valueMap.put("paid_expenditure_software", old_sap_form.data.get("paid_expenditure_software").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_expenditure_software").get.isEmpty()) {
      valueMap.put("committed_expenditure_software", old_sap_form.data.get("committed_expenditure_software").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_expenditure_software").get.isEmpty()) {
      valueMap.put("non_committed_expenditure_software", old_sap_form.data.get("non_committed_expenditure_software").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_expenditure_software").get.isEmpty()) {
      valueMap.put("available_expenditure_software", old_sap_form.data.get("available_expenditure_software").get.replaceAll("\\.+", "").toString())
    }

    //telecommunication
    if (!old_sap_form.data.get("paid_investment_telecommunication").get.isEmpty()) {
      valueMap.put("paid_investment_telecommunication", old_sap_form.data.get("paid_investment_telecommunication").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_investment_telecommunication").get.isEmpty()) {
      valueMap.put("committed_investment_telecommunication", old_sap_form.data.get("committed_investment_telecommunication").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_investment_telecommunication").get.isEmpty()) {
      valueMap.put("non_committed_investment_telecommunication", old_sap_form.data.get("non_committed_investment_telecommunication").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_investment_telecommunication").get.isEmpty()) {
      valueMap.put("available_investment_telecommunication", old_sap_form.data.get("available_investment_telecommunication").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("paid_expenditure_telecommunication").get.isEmpty()) {
      valueMap.put("paid_expenditure_telecommunication", old_sap_form.data.get("paid_expenditure_telecommunication").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_expenditure_telecommunication").get.isEmpty()) {
      valueMap.put("committed_expenditure_telecommunication", old_sap_form.data.get("committed_expenditure_telecommunication").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_expenditure_telecommunication").get.isEmpty()) {
      valueMap.put("non_committed_expenditure_telecommunication", old_sap_form.data.get("non_committed_expenditure_telecommunication").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_expenditure_telecommunication").get.isEmpty()) {
      valueMap.put("available_expenditure_telecommunication", old_sap_form.data.get("available_expenditure_telecommunication").get.replaceAll("\\.+", "").toString())
    }

    //development
    if (!old_sap_form.data.get("paid_investment_development").get.isEmpty()) {
      valueMap.put("paid_investment_development", old_sap_form.data.get("paid_investment_development").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_investment_development").get.isEmpty()) {
      valueMap.put("committed_investment_development", old_sap_form.data.get("committed_investment_development").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_investment_development").get.isEmpty()) {
      valueMap.put("non_committed_investment_development", old_sap_form.data.get("non_committed_investment_development").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_investment_development").get.isEmpty()) {
      valueMap.put("available_investment_development", old_sap_form.data.get("available_investment_development").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("paid_expenditure_development").get.isEmpty()) {
      valueMap.put("paid_expenditure_development", old_sap_form.data.get("paid_expenditure_development").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_expenditure_development").get.isEmpty()) {
      valueMap.put("committed_expenditure_development", old_sap_form.data.get("committed_expenditure_development").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_expenditure_development").get.isEmpty()) {
      valueMap.put("non_committed_expenditure_development", old_sap_form.data.get("non_committed_expenditure_development").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_expenditure_development").get.isEmpty()) {
      valueMap.put("available_expenditure_development", old_sap_form.data.get("available_expenditure_development").get.replaceAll("\\.+", "").toString())
    }

    //other    
    if (!old_sap_form.data.get("paid_investment_other").get.isEmpty()) {
      valueMap.put("paid_investment_other", old_sap_form.data.get("paid_investment_other").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_investment_other").get.isEmpty()) {
      valueMap.put("committed_investment_other", old_sap_form.data.get("committed_investment_other").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_investment_other").get.isEmpty()) {
      valueMap.put("non_committed_investment_other", old_sap_form.data.get("non_committed_investment_other").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_investment_other").get.isEmpty()) {
      valueMap.put("available_investment_other", old_sap_form.data.get("available_investment_other").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("paid_expenditure_other").get.isEmpty()) {
      valueMap.put("paid_expenditure_other", old_sap_form.data.get("paid_expenditure_other").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_expenditure_other").get.isEmpty()) {
      valueMap.put("committed_expenditure_other", old_sap_form.data.get("committed_expenditure_other").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_expenditure_other").get.isEmpty()) {
      valueMap.put("non_committed_expenditure_other", old_sap_form.data.get("non_committed_expenditure_other").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_expenditure_other").get.isEmpty()) {
      valueMap.put("available_expenditure_other", old_sap_form.data.get("available_expenditure_other").get.replaceAll("\\.+", "").toString())
    }

    //QA
    if (!old_sap_form.data.get("paid_investment_qa").get.isEmpty()) {
      valueMap.put("paid_investment_qa", old_sap_form.data.get("paid_investment_qa").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_investment_qa").get.isEmpty()) {
      valueMap.put("committed_investment_qa", old_sap_form.data.get("committed_investment_qa").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_investment_qa").get.isEmpty()) {
      valueMap.put("non_committed_investment_qa", old_sap_form.data.get("non_committed_investment_qa").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_investment_qa").get.isEmpty()) {
      valueMap.put("available_investment_qa", old_sap_form.data.get("available_investment_qa").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("paid_expenditure_qa").get.isEmpty()) {
      valueMap.put("paid_expenditure_qa", old_sap_form.data.get("paid_expenditure_qa").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_expenditure_qa").get.isEmpty()) {
      valueMap.put("committed_expenditure_qa", old_sap_form.data.get("committed_expenditure_qa").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_expenditure_qa").get.isEmpty()) {
      valueMap.put("non_committed_expenditure_qa", old_sap_form.data.get("non_committed_expenditure_qa").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_expenditure_qa").get.isEmpty()) {
      valueMap.put("available_expenditure_qa", old_sap_form.data.get("available_expenditure_qa").get.replaceAll("\\.+", "").toString())
    }

    //improvements
    if (!old_sap_form.data.get("paid_investment_improvements").get.isEmpty()) {
      valueMap.put("paid_investment_improvements", old_sap_form.data.get("paid_investment_improvements").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_investment_improvements").get.isEmpty()) {
      valueMap.put("committed_investment_improvements", old_sap_form.data.get("committed_investment_improvements").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_investment_improvements").get.isEmpty()) {
      valueMap.put("non_committed_investment_improvements", old_sap_form.data.get("non_committed_investment_improvements").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_investment_improvements").get.isEmpty()) {
      valueMap.put("available_investment_improvements", old_sap_form.data.get("available_investment_improvements").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("paid_expenditure_improvements").get.isEmpty()) {
      valueMap.put("paid_expenditure_improvements", old_sap_form.data.get("paid_expenditure_improvements").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_expenditure_improvements").get.isEmpty()) {
      valueMap.put("committed_expenditure_improvements", old_sap_form.data.get("committed_expenditure_improvements").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_expenditure_improvements").get.isEmpty()) {
      valueMap.put("non_committed_expenditure_improvements", old_sap_form.data.get("non_committed_expenditure_improvements").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_expenditure_improvements").get.isEmpty()) {
      valueMap.put("available_expenditure_improvements", old_sap_form.data.get("available_expenditure_improvements").get.replaceAll("\\.+", "").toString())
    }

    //recurring_first
    if (!old_sap_form.data.get("paid_investment_recurring_first").get.isEmpty()) {
      valueMap.put("paid_investment_recurring_first", old_sap_form.data.get("paid_investment_recurring_first").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_investment_recurring_first").get.isEmpty()) {
      valueMap.put("committed_investment_recurring_first", old_sap_form.data.get("committed_investment_recurring_first").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_investment_recurring_first").get.isEmpty()) {
      valueMap.put("non_committed_investment_recurring_first", old_sap_form.data.get("non_committed_investment_recurring_first").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_investment_recurring_first").get.isEmpty()) {
      valueMap.put("available_investment_recurring_first", old_sap_form.data.get("available_investment_recurring_first").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("paid_expenditure_recurring_first").get.isEmpty()) {
      valueMap.put("paid_expenditure_recurring_first", old_sap_form.data.get("paid_expenditure_recurring_first").get.replaceAll("\\.+", "").toString())
    }
    if (!old_sap_form.data.get("committed_expenditure_recurring_first").get.isEmpty()) {
      valueMap.put("committed_expenditure_recurring_first", old_sap_form.data.get("committed_expenditure_recurring_first").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("non_committed_expenditure_recurring_first").get.isEmpty()) {
      valueMap.put("non_committed_expenditure_recurring_first", old_sap_form.data.get("non_committed_expenditure_recurring_first").get.replaceAll("\\.+", "").toString())
    }

    if (!old_sap_form.data.get("available_expenditure_recurring_first").get.isEmpty()) {
      valueMap.put("available_expenditure_recurring_first", old_sap_form.data.get("available_expenditure_recurring_first").get.replaceAll("\\.+", "").toString())
    }

    valueMap
  }

  def updateSAPAdditionalValues(sap_id: String, old_sap_form: Form[SAPMaster]) = {
    var valueMap = new java.util.LinkedHashMap[String, String]()
    var paid_investment_hardware: Long = 0
    var committed_investment_hardware: Long = 0
    var non_committed_investment_hardware: Long = 0
    var available_investment_hardware: Long = 0
    var paid_expenditure_hardware: Long = 0
    var committed_expenditure_hardware: Long = 0
    var non_committed_expenditure_hardware: Long = 0
    var available_expenditure_hardware: Long = 0

    var paid_investment_software: Long = 0
    var committed_investment_software: Long = 0
    var non_committed_investment_software: Long = 0
    var available_investment_software: Long = 0
    var paid_expenditure_software: Long = 0
    var committed_expenditure_software: Long = 0
    var non_committed_expenditure_software: Long = 0
    var available_expenditure_software: Long = 0

    var paid_investment_telecommunication: Long = 0
    var committed_investment_telecommunication: Long = 0
    var non_committed_investment_telecommunication: Long = 0
    var available_investment_telecommunication: Long = 0
    var paid_expenditure_telecommunication: Long = 0
    var committed_expenditure_telecommunication: Long = 0
    var non_committed_expenditure_telecommunication: Long = 0
    var available_expenditure_telecommunication: Long = 0

    var paid_investment_development: Long = 0
    var committed_investment_development: Long = 0
    var non_committed_investment_development: Long = 0
    var available_investment_development: Long = 0
    var paid_expenditure_development: Long = 0
    var committed_expenditure_development: Long = 0
    var non_committed_expenditure_development: Long = 0
    var available_expenditure_development: Long = 0

    var paid_investment_other: Long = 0
    var committed_investment_other: Long = 0
    var non_committed_investment_other: Long = 0
    var available_investment_other: Long = 0
    var paid_expenditure_other: Long = 0
    var committed_expenditure_other: Long = 0
    var non_committed_expenditure_other: Long = 0
    var available_expenditure_other: Long = 0

    var paid_investment_qa: Long = 0
    var committed_investment_qa: Long = 0
    var non_committed_investment_qa: Long = 0
    var available_investment_qa: Long = 0
    var paid_expenditure_qa: Long = 0
    var committed_expenditure_qa: Long = 0
    var non_committed_expenditure_qa: Long = 0
    var available_expenditure_qa: Long = 0

    var paid_investment_improvements: Long = 0
    var committed_investment_improvements: Long = 0
    var non_committed_investment_improvements: Long = 0
    var available_investment_improvements: Long = 0
    var paid_expenditure_improvements: Long = 0
    var committed_expenditure_improvements: Long = 0
    var non_committed_expenditure_improvements: Long = 0
    var available_expenditure_improvements: Long = 0

    var paid_investment_recurring_first: Long = 0
    var committed_investment_recurring_first: Long = 0
    var non_committed_investment_recurring_first: Long = 0
    var available_investment_recurring_first: Long = 0
    var paid_expenditure_recurring_first: Long = 0
    var committed_expenditure_recurring_first: Long = 0
    var non_committed_expenditure_recurring_first: Long = 0
    var available_expenditure_recurring_first: Long = 0

    //Hardware
    if (!old_sap_form.data.get("paid_investment_hardware").get.isEmpty()) {
      paid_investment_hardware = old_sap_form.data.get("paid_investment_hardware").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_investment_hardware").get.isEmpty()) {
      committed_investment_hardware = old_sap_form.data.get("committed_investment_hardware").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_investment_hardware").get.isEmpty()) {
      non_committed_investment_hardware = old_sap_form.data.get("non_committed_investment_hardware").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_investment_hardware").get.isEmpty()) {
      available_investment_hardware = old_sap_form.data.get("available_investment_hardware").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("paid_expenditure_hardware").get.isEmpty()) {
      paid_expenditure_hardware = old_sap_form.data.get("paid_expenditure_hardware").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_expenditure_hardware").get.isEmpty()) {
      committed_expenditure_hardware = old_sap_form.data.get("committed_expenditure_hardware").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_expenditure_hardware").get.isEmpty()) {
      non_committed_expenditure_hardware = old_sap_form.data.get("non_committed_expenditure_hardware").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_expenditure_hardware").get.isEmpty()) {
      available_expenditure_hardware = old_sap_form.data.get("available_expenditure_hardware").get.replaceAll("\\.+", "").toLong
    }

    //Software
    if (!old_sap_form.data.get("paid_investment_software").get.isEmpty()) {
      paid_investment_software = old_sap_form.data.get("paid_investment_software").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_investment_software").get.isEmpty()) {
      committed_investment_software = old_sap_form.data.get("committed_investment_software").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_investment_software").get.isEmpty()) {
      non_committed_investment_software = old_sap_form.data.get("non_committed_investment_software").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_investment_software").get.isEmpty()) {
      available_investment_software = old_sap_form.data.get("available_investment_software").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("paid_expenditure_software").get.isEmpty()) {
      paid_expenditure_software = old_sap_form.data.get("paid_expenditure_software").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_expenditure_software").get.isEmpty()) {
      committed_expenditure_software = old_sap_form.data.get("committed_expenditure_software").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_expenditure_software").get.isEmpty()) {
      non_committed_expenditure_software = old_sap_form.data.get("non_committed_expenditure_software").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_expenditure_software").get.isEmpty()) {
      available_expenditure_software = old_sap_form.data.get("available_expenditure_software").get.replaceAll("\\.+", "").toLong
    }

    //telecommunication
    if (!old_sap_form.data.get("paid_investment_telecommunication").get.isEmpty()) {
      paid_investment_telecommunication = old_sap_form.data.get("paid_investment_telecommunication").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_investment_telecommunication").get.isEmpty()) {
      committed_investment_telecommunication = old_sap_form.data.get("committed_investment_telecommunication").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_investment_telecommunication").get.isEmpty()) {
      non_committed_investment_telecommunication = old_sap_form.data.get("non_committed_investment_telecommunication").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_investment_telecommunication").get.isEmpty()) {
      available_investment_telecommunication = old_sap_form.data.get("available_investment_telecommunication").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("paid_expenditure_telecommunication").get.isEmpty()) {
      paid_expenditure_telecommunication = old_sap_form.data.get("paid_expenditure_telecommunication").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_expenditure_telecommunication").get.isEmpty()) {
      committed_expenditure_telecommunication = old_sap_form.data.get("committed_expenditure_telecommunication").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_expenditure_telecommunication").get.isEmpty()) {
      non_committed_expenditure_telecommunication = old_sap_form.data.get("non_committed_expenditure_telecommunication").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_expenditure_telecommunication").get.isEmpty()) {
      available_expenditure_telecommunication = old_sap_form.data.get("available_expenditure_telecommunication").get.replaceAll("\\.+", "").toLong
    }

    //development
    if (!old_sap_form.data.get("paid_investment_development").get.isEmpty()) {
      paid_investment_development = old_sap_form.data.get("paid_investment_development").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_investment_development").get.isEmpty()) {
      committed_investment_development = old_sap_form.data.get("committed_investment_development").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_investment_development").get.isEmpty()) {
      non_committed_investment_development = old_sap_form.data.get("non_committed_investment_development").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_investment_development").get.isEmpty()) {
      available_investment_development = old_sap_form.data.get("available_investment_development").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("paid_expenditure_development").get.isEmpty()) {
      paid_expenditure_development = old_sap_form.data.get("paid_expenditure_development").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_expenditure_development").get.isEmpty()) {
      committed_expenditure_development = old_sap_form.data.get("committed_expenditure_development").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_expenditure_development").get.isEmpty()) {
      non_committed_expenditure_development = old_sap_form.data.get("non_committed_expenditure_development").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_expenditure_development").get.isEmpty()) {
      available_expenditure_development = old_sap_form.data.get("available_expenditure_development").get.replaceAll("\\.+", "").toLong
    }

    //other    
    if (!old_sap_form.data.get("paid_investment_other").get.isEmpty()) {
      paid_investment_other = old_sap_form.data.get("paid_investment_other").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_investment_other").get.isEmpty()) {
      committed_investment_other = old_sap_form.data.get("committed_investment_other").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_investment_other").get.isEmpty()) {
      non_committed_investment_other = old_sap_form.data.get("non_committed_investment_other").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_investment_other").get.isEmpty()) {
      available_investment_other = old_sap_form.data.get("available_investment_other").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("paid_expenditure_other").get.isEmpty()) {
      paid_expenditure_other = old_sap_form.data.get("paid_expenditure_other").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_expenditure_other").get.isEmpty()) {
      committed_expenditure_other = old_sap_form.data.get("committed_expenditure_other").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_expenditure_other").get.isEmpty()) {
      non_committed_expenditure_other = old_sap_form.data.get("non_committed_expenditure_other").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_expenditure_other").get.isEmpty()) {
      available_expenditure_other = old_sap_form.data.get("available_expenditure_other").get.replaceAll("\\.+", "").toLong
    }

    //QA
    if (!old_sap_form.data.get("paid_investment_qa").get.isEmpty()) {
      paid_investment_qa = old_sap_form.data.get("paid_investment_qa").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_investment_qa").get.isEmpty()) {
      committed_investment_qa = old_sap_form.data.get("committed_investment_qa").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_investment_qa").get.isEmpty()) {
      non_committed_investment_qa = old_sap_form.data.get("non_committed_investment_qa").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_investment_qa").get.isEmpty()) {
      available_investment_qa = old_sap_form.data.get("available_investment_qa").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("paid_expenditure_qa").get.isEmpty()) {
      paid_expenditure_qa = old_sap_form.data.get("paid_expenditure_qa").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_expenditure_qa").get.isEmpty()) {
      committed_expenditure_qa = old_sap_form.data.get("committed_expenditure_qa").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_expenditure_qa").get.isEmpty()) {
      non_committed_expenditure_qa = old_sap_form.data.get("non_committed_expenditure_qa").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_expenditure_qa").get.isEmpty()) {
      available_expenditure_qa = old_sap_form.data.get("available_expenditure_qa").get.replaceAll("\\.+", "").toLong
    }

    //improvements
    if (!old_sap_form.data.get("paid_investment_improvements").get.isEmpty()) {
      paid_investment_improvements = old_sap_form.data.get("paid_investment_improvements").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_investment_improvements").get.isEmpty()) {
      committed_investment_improvements = old_sap_form.data.get("committed_investment_improvements").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_investment_improvements").get.isEmpty()) {
      non_committed_investment_improvements = old_sap_form.data.get("non_committed_investment_improvements").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_investment_improvements").get.isEmpty()) {
      available_investment_improvements = old_sap_form.data.get("available_investment_improvements").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("paid_expenditure_improvements").get.isEmpty()) {
      paid_expenditure_improvements = old_sap_form.data.get("paid_expenditure_improvements").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_expenditure_improvements").get.isEmpty()) {
      committed_expenditure_improvements = old_sap_form.data.get("committed_expenditure_improvements").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_expenditure_improvements").get.isEmpty()) {
      non_committed_expenditure_improvements = old_sap_form.data.get("non_committed_expenditure_improvements").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_expenditure_improvements").get.isEmpty()) {
      available_expenditure_improvements = old_sap_form.data.get("available_expenditure_improvements").get.replaceAll("\\.+", "").toLong
    }

    //recurring_first
    if (!old_sap_form.data.get("paid_investment_recurring_first").get.isEmpty()) {
      paid_investment_recurring_first = old_sap_form.data.get("paid_investment_recurring_first").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_investment_recurring_first").get.isEmpty()) {
      committed_investment_recurring_first = old_sap_form.data.get("committed_investment_recurring_first").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_investment_recurring_first").get.isEmpty()) {
      non_committed_investment_recurring_first = old_sap_form.data.get("non_committed_investment_recurring_first").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_investment_recurring_first").get.isEmpty()) {
      available_investment_recurring_first = old_sap_form.data.get("available_investment_recurring_first").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("paid_expenditure_recurring_first").get.isEmpty()) {
      paid_expenditure_recurring_first = old_sap_form.data.get("paid_expenditure_recurring_first").get.replaceAll("\\.+", "").toLong
    }
    if (!old_sap_form.data.get("committed_expenditure_recurring_first").get.isEmpty()) {
      committed_expenditure_recurring_first = old_sap_form.data.get("committed_expenditure_recurring_first").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("non_committed_expenditure_recurring_first").get.isEmpty()) {
      non_committed_expenditure_recurring_first = old_sap_form.data.get("non_committed_expenditure_recurring_first").get.replaceAll("\\.+", "").toLong
    }

    if (!old_sap_form.data.get("available_expenditure_recurring_first").get.isEmpty()) {
      available_expenditure_recurring_first = old_sap_form.data.get("available_expenditure_recurring_first").get.replaceAll("\\.+", "").toLong
    }

    val hardware = HardwareSAP(sap_id.toInt, Option(paid_investment_hardware), Option(paid_expenditure_hardware),
      Option(committed_investment_hardware), Option(committed_expenditure_hardware),
      Option(non_committed_investment_hardware), Option(non_committed_expenditure_hardware),
      Option(available_investment_hardware), Option(available_expenditure_hardware))

    val software = SoftwareSAP(sap_id.toInt, Option(paid_investment_software), Option(paid_expenditure_software),
      Option(committed_investment_software), Option(committed_expenditure_software),
      Option(non_committed_investment_software), Option(non_committed_expenditure_software),
      Option(available_investment_software), Option(available_expenditure_software))

    val telecommunication = TelecommunicationSAP(sap_id.toInt, Option(paid_investment_telecommunication), Option(paid_expenditure_telecommunication),
      Option(committed_investment_telecommunication), Option(committed_expenditure_telecommunication),
      Option(non_committed_investment_telecommunication), Option(non_committed_expenditure_telecommunication),
      Option(available_investment_telecommunication), Option(available_expenditure_telecommunication))

    val development = DevelopemntSAP(sap_id.toInt, Option(paid_investment_development), Option(paid_expenditure_development),
      Option(committed_investment_development), Option(committed_expenditure_development),
      Option(non_committed_investment_development), Option(non_committed_expenditure_development),
      Option(available_investment_development), Option(available_expenditure_development))

    val other = OtherSAP(sap_id.toInt, Option(paid_investment_other), Option(paid_expenditure_other),
      Option(committed_investment_other), Option(committed_expenditure_other),
      Option(non_committed_investment_other), Option(non_committed_expenditure_other),
      Option(available_investment_other), Option(available_expenditure_other))

    val qa = QASAP(sap_id.toInt, Option(paid_investment_qa), Option(paid_expenditure_qa),
      Option(committed_investment_qa), Option(committed_expenditure_qa),
      Option(non_committed_investment_qa), Option(non_committed_expenditure_qa),
      Option(available_investment_qa), Option(available_expenditure_qa))

    val improvements = ImprovementsSAP(sap_id.toInt, Option(paid_investment_improvements), Option(paid_expenditure_improvements),
      Option(committed_investment_improvements), Option(committed_expenditure_improvements),
      Option(non_committed_investment_improvements), Option(non_committed_expenditure_improvements),
      Option(available_investment_improvements), Option(available_expenditure_improvements))

    val recurring = RecurringSAP(sap_id.toInt, Option(paid_investment_recurring_first), Option(paid_expenditure_recurring_first),
      Option(committed_investment_recurring_first), Option(committed_expenditure_recurring_first),
      Option(non_committed_investment_recurring_first), Option(non_committed_expenditure_recurring_first),
      Option(available_investment_recurring_first), Option(available_expenditure_recurring_first))

    updateHardwareSAPDetails(hardware)

    updateSoftwareSAPDetails(software)

    updateTelecommuncationSAPDetails(telecommunication)

    updateDevelopmentSAPDetails(development)

    updateOtherSAPDetails(other)

    updateQASAPDetails(qa)

    updateImprovementsSAPDetails(improvements)

    updateRecurringSAPDetails(recurring)

  }

  def getHardwareSAPDetails(sap_id: String): Option[HardwareSAP] = {
    var sql = "select * from art_program_sap_details where sap_id='" + sap_id + "' AND expense_type=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(HardwareSAP.hardware.singleOpt)
      result
    }
  }

  def getSoftwareSAPDetails(sap_id: String): Option[SoftwareSAP] = {
    var sql = "select * from art_program_sap_details where sap_id='" + sap_id + "' AND expense_type=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SoftwareSAP.software.singleOpt)
      result
    }
  }

  def getTelecommunicationSAPDetails(sap_id: String): Option[TelecommunicationSAP] = {
    var sql = "select * from art_program_sap_details where sap_id='" + sap_id + "' AND expense_type=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(TelecommunicationSAP.telecommunication.singleOpt)
      result
    }
  }

  def getDevelopemntSAPDetails(sap_id: String): Option[DevelopemntSAP] = {
    var sql = "select * from art_program_sap_details where sap_id='" + sap_id + "' AND expense_type=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(DevelopemntSAP.development.singleOpt)
      result
    }
  }

  def getOtherSAPDetails(sap_id: String): Option[OtherSAP] = {
    var sql = "select * from art_program_sap_details where sap_id='" + sap_id + "' AND expense_type=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(OtherSAP.other.singleOpt)
      result
    }
  }

  def getQASAPDetails(sap_id: String): Option[QASAP] = {
    var sql = "select * from art_program_sap_details where sap_id='" + sap_id + "' AND expense_type=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(QASAP.qa.singleOpt)
      result
    }
  }

  def getImprovementsSAPDetails(sap_id: String): Option[ImprovementsSAP] = {
    var sql = "select * from art_program_sap_details where sap_id='" + sap_id + "' AND expense_type=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ImprovementsSAP.improvements.singleOpt)
      result
    }
  }

  def getRecurringSAPDetails(sap_id: String): Option[RecurringSAP] = {
    var sql = "select * from art_program_sap_details where sap_id='" + sap_id + "' AND expense_type=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(RecurringSAP.recurring_first.singleOpt)
      result
    }
  }

  def updateHardwareSAPDetails(hardware: HardwareSAP) {
    DB.withConnection { implicit connection =>

      val sap_invest = SQL(
        """
          update art_program_sap_details SET paid_investment_hardware={paid_investment_hardware}, paid_expenditure_hardware={paid_expenditure_hardware}, 
          committed_investment_hardware={committed_investment_hardware},committed_expenditure_hardware={committed_expenditure_hardware},
          non_committed_investment_hardware={non_committed_investment_hardware},non_committed_expenditure_hardware={non_committed_expenditure_hardware},
          available_investment_hardware={available_investment_hardware},available_expenditure_hardware={available_expenditure_hardware}
          where (sap_id={sap_id} AND expense_type=1)
          """).on(
          'sap_id -> hardware.sap_id,
          'paid_investment_hardware -> hardware.paid_investment_hardware,
          'paid_expenditure_hardware -> hardware.paid_expenditure_hardware,
          'committed_investment_hardware -> hardware.committed_investment_hardware,
          'committed_expenditure_hardware -> hardware.committed_expenditure_hardware,
          'non_committed_investment_hardware -> hardware.non_committed_investment_hardware,
          'non_committed_expenditure_hardware -> hardware.non_committed_expenditure_hardware,
          'available_investment_hardware -> hardware.available_investment_hardware,
          'available_expenditure_hardware -> hardware.available_expenditure_hardware)

      sap_invest.executeUpdate()
    }

  }

  def updateSoftwareSAPDetails(software: SoftwareSAP) {

    DB.withConnection { implicit connection =>

      val sap_invest = SQL(
        """
          update  art_program_sap_details SET 
          paid_investment_software={paid_investment_software}, paid_expenditure_software={paid_expenditure_software}, 
          committed_investment_software={committed_investment_software},committed_expenditure_software={committed_expenditure_software},
          non_committed_investment_software={non_committed_investment_software},non_committed_expenditure_software={non_committed_expenditure_software},
          available_investment_software={available_investment_software},available_expenditure_software={available_expenditure_software}
          where sap_id={sap_id} AND expense_type=1
          """).on(
          'sap_id -> software.sap_id,
          'paid_investment_software -> software.paid_investment_software,
          'paid_expenditure_software -> software.paid_expenditure_software,
          'committed_investment_software -> software.committed_investment_software,
          'committed_expenditure_software -> software.committed_expenditure_software,
          'non_committed_investment_software -> software.non_committed_investment_software,
          'non_committed_expenditure_software -> software.non_committed_expenditure_software,
          'available_investment_software -> software.available_investment_software,
          'available_expenditure_software -> software.available_expenditure_software).executeUpdate()
    }
  }

  def updateTelecommuncationSAPDetails(telecommunication: TelecommunicationSAP) {

    DB.withConnection { implicit connection =>

      val sap_invest = SQL(
        """
            update  art_program_sap_details SET 
          paid_investment_telecommunication={paid_investment_telecommunication}, paid_expenditure_telecommunication={paid_expenditure_telecommunication}, 
          committed_investment_telecommunication={committed_investment_telecommunication},committed_expenditure_telecommunication={committed_expenditure_telecommunication},
          non_committed_investment_telecommunication={non_committed_investment_telecommunication},non_committed_expenditure_telecommunication={non_committed_expenditure_telecommunication},
          available_investment_telecommunication={available_investment_telecommunication},available_expenditure_telecommunication={available_expenditure_telecommunication}
          where sap_id={sap_id} AND expense_type=1
          """).on(
          'sap_id -> telecommunication.sap_id,
          'paid_investment_telecommunication -> telecommunication.paid_investment_telecommunication,
          'paid_expenditure_telecommunication -> telecommunication.paid_expenditure_telecommunication,
          'committed_investment_telecommunication -> telecommunication.committed_investment_telecommunication,
          'committed_expenditure_telecommunication -> telecommunication.committed_expenditure_telecommunication,
          'non_committed_investment_telecommunication -> telecommunication.non_committed_investment_telecommunication,
          'non_committed_expenditure_telecommunication -> telecommunication.non_committed_expenditure_telecommunication,
          'available_investment_telecommunication -> telecommunication.available_investment_telecommunication,
          'available_expenditure_telecommunication -> telecommunication.available_expenditure_telecommunication).executeUpdate()
    }
  }

  def updateDevelopmentSAPDetails(development: DevelopemntSAP) {

    DB.withConnection { implicit connection =>

      val sap_invest = SQL(
        """
            update  art_program_sap_details SET 
          paid_investment_development={paid_investment_development}, paid_expenditure_development={paid_expenditure_development}, 
          committed_investment_development={committed_investment_development},committed_expenditure_development={committed_expenditure_development},
          non_committed_investment_development={non_committed_investment_development},non_committed_expenditure_development={non_committed_expenditure_development},
          available_investment_development={available_investment_development},available_expenditure_development={available_expenditure_development}
          where sap_id={sap_id} AND expense_type=1
          """).on(
          'sap_id -> development.sap_id,
          'paid_investment_development -> development.paid_investment_development,
          'paid_expenditure_development -> development.paid_expenditure_development,
          'committed_investment_development -> development.committed_investment_development,
          'committed_expenditure_development -> development.committed_expenditure_development,
          'non_committed_investment_development -> development.non_committed_investment_development,
          'non_committed_expenditure_development -> development.non_committed_expenditure_development,
          'available_investment_development -> development.available_investment_development,
          'available_expenditure_development -> development.available_expenditure_development).executeUpdate()
    }
  }

  def updateOtherSAPDetails(other: OtherSAP) {

    DB.withConnection { implicit connection =>

      val sap_invest = SQL(
        """
            update  art_program_sap_details SET 
          paid_investment_other={paid_investment_other}, paid_expenditure_other={paid_expenditure_other}, 
          committed_investment_other={committed_investment_other},committed_expenditure_other={committed_expenditure_other},
          non_committed_investment_other={non_committed_investment_other},non_committed_expenditure_other={non_committed_expenditure_other},
          available_investment_other={available_investment_other},available_expenditure_other={available_expenditure_other}
          where sap_id={sap_id} AND expense_type=1
          """).on(
          'sap_id -> other.sap_id,
          'paid_investment_other -> other.paid_investment_other,
          'paid_expenditure_other -> other.paid_expenditure_other,
          'committed_investment_other -> other.committed_investment_other,
          'committed_expenditure_other -> other.committed_expenditure_other,
          'non_committed_investment_other -> other.non_committed_investment_other,
          'non_committed_expenditure_other -> other.non_committed_expenditure_other,
          'available_investment_other -> other.available_investment_other,
          'available_expenditure_other -> other.available_expenditure_other).executeUpdate()
    }
  }

  def updateQASAPDetails(qa: QASAP) {

    DB.withConnection { implicit connection =>

      val sap_invest = SQL(
        """
            update  art_program_sap_details SET 
          paid_investment_qa={paid_investment_qa}, paid_expenditure_qa={paid_expenditure_qa}, 
          committed_investment_qa={committed_investment_qa},committed_expenditure_qa={committed_expenditure_qa},
          non_committed_investment_qa={non_committed_investment_qa},non_committed_expenditure_qa={non_committed_expenditure_qa},
          available_investment_qa={available_investment_qa},available_expenditure_qa={available_expenditure_qa}
          where sap_id={sap_id} AND expense_type=1
          """).on(
          'sap_id -> qa.sap_id,
          'paid_investment_qa -> qa.paid_investment_qa,
          'paid_expenditure_qa -> qa.paid_expenditure_qa,
          'committed_investment_qa -> qa.committed_investment_qa,
          'committed_expenditure_qa -> qa.committed_expenditure_qa,
          'non_committed_investment_qa -> qa.non_committed_investment_qa,
          'non_committed_expenditure_qa -> qa.non_committed_expenditure_qa,
          'available_investment_qa -> qa.available_investment_qa,
          'available_expenditure_qa -> qa.available_expenditure_qa).executeUpdate()
    }
  }

  def updateImprovementsSAPDetails(improvements: ImprovementsSAP) {

    DB.withConnection { implicit connection =>

      val sap_invest = SQL(
        """
          update  art_program_sap_details SET 
          paid_investment_improvements={paid_investment_improvements}, paid_expenditure_improvements={paid_expenditure_improvements}, 
          committed_investment_improvements={committed_investment_improvements},committed_expenditure_improvements={committed_expenditure_improvements},
          non_committed_investment_improvements={non_committed_investment_improvements},non_committed_expenditure_improvements={non_committed_expenditure_improvements},
          available_investment_improvements={available_investment_improvements},available_expenditure_improvements={available_expenditure_improvements}
          where sap_id={sap_id} AND expense_type=1
          """).on(
          'sap_id -> improvements.sap_id,
          'paid_investment_improvements -> improvements.paid_investment_improvements,
          'paid_expenditure_improvements -> improvements.paid_expenditure_improvements,
          'committed_investment_improvements -> improvements.committed_investment_improvements,
          'committed_expenditure_improvements -> improvements.committed_expenditure_improvements,
          'non_committed_investment_improvements -> improvements.non_committed_investment_improvements,
          'non_committed_expenditure_improvements -> improvements.non_committed_expenditure_improvements,
          'available_investment_improvements -> improvements.available_investment_improvements,
          'available_expenditure_improvements -> improvements.available_expenditure_improvements).executeUpdate()
    }
  }

  def updateRecurringSAPDetails(recurring_first: RecurringSAP) {

    DB.withConnection { implicit connection =>

      val sap_invest = SQL(
        """
          update  art_program_sap_details SET 
          paid_investment_recurring_first={paid_investment_recurring_first}, paid_expenditure_recurring_first={paid_expenditure_recurring_first}, 
          committed_investment_recurring_first={committed_investment_recurring_first},committed_expenditure_recurring_first={committed_expenditure_recurring_first},
          non_committed_investment_recurring_first={non_committed_investment_recurring_first},non_committed_expenditure_recurring_first={non_committed_expenditure_recurring_first},
          available_investment_recurring_first={available_investment_recurring_first},available_expenditure_recurring_first={available_expenditure_recurring_first}
          where sap_id={sap_id} AND expense_type=1
          """).on(
          'sap_id -> recurring_first.sap_id,
          'paid_investment_recurring_first -> recurring_first.paid_investment_recurring_first,
          'paid_expenditure_recurring_first -> recurring_first.paid_expenditure_recurring_first,
          'committed_investment_recurring_first -> recurring_first.committed_investment_recurring_first,
          'committed_expenditure_recurring_first -> recurring_first.committed_expenditure_recurring_first,
          'non_committed_investment_recurring_first -> recurring_first.non_committed_investment_recurring_first,
          'non_committed_expenditure_recurring_first -> recurring_first.non_committed_expenditure_recurring_first,
          'available_investment_recurring_first -> recurring_first.available_investment_recurring_first,
          'available_expenditure_recurring_first -> recurring_first.available_expenditure_recurring_first).executeUpdate()
    }
  }

  /**
   * Program SAP Form -  Custom Validation
   */
  def validateSAPForm(sap_form: Form[SAPMaster], program_id: String, sap_id: String, old_sap_form: Form[SAPMaster], isValidSAP: Boolean) = {

    var newform: play.api.data.Form[models.SAPMaster] = null
    var cui1_per: Double = 0
    var cui2_per: Double = 0

    if ("0".equals(sap_form.data.get("budget_type").get)) {
      newform = sap_form.withError("budget_type", Messages.get(langObj, "sap.budget_type.empty"))
    }
    if ("0".equals(sap_form.data.get("sap_number").get.trim())) {
      newform = sap_form.withError("sap_number", Messages.get(langObj, "newsap.sapnumber.empty"))
    }
    if ("".equals(sap_form.data.get("cui1").get.trim())) {
      newform = sap_form.withError("cui1", Messages.get(langObj, "newsap.cui1.empty"))
    }
    if ("".equals(sap_form.data.get("cui2").get.trim())) {
      newform = sap_form.withError("cui2", Messages.get(langObj, "newsap.cui2.empty"))
    }

    if (!sap_form.data.get("cui1_per").isEmpty && !StringUtils.isEmpty(sap_form.data.get("cui1_per").get)) {

      if (sap_form.data.get("cui1_per").get.toString().equals("0.0") && sap_form.data.get("cui2_per").get.toString().equals("0.0")) {
        newform = sap_form.withError("cui1_per", Messages.get(langObj, "sap.validPer"))
      } else {
        cui1_per = sap_form.data.get("cui1_per").get.toDouble
      }

    }

    if (!sap_form.data.get("cui2_per").isEmpty && !StringUtils.isEmpty(sap_form.data.get("cui2_per").get)) {

      if (sap_form.data.get("cui1_per").get.toString().equals("0.0") && sap_form.data.get("cui2_per").get.toString().equals("0.0")) {

        newform = sap_form.withError("cui2_per", Messages.get(langObj, "sap.validPer"))
      } else {
        cui2_per = sap_form.data.get("cui2_per").get.toDouble
      }

    }

    var sap_no: String = ""
    if (!sap_form.data.get("sap_number").isEmpty) {
      sap_no = sap_form.data.get("sap_number").get
    }
    if (sap_no.trim().length() > 10) {
      newform = sap_form.withError("sap_number", Messages.get(langObj, "sap.sap_number.range"))
    } else if (!sap_no.isEmpty()) {
      val sapObjArr = findSAPMasterBySAPNumber(sap_no, program_id, sap_id)
      if (sapObjArr.size > 0) {
        newform = sap_form.withError("sap_number", "Número de SAP es ya existe.")
      }
    }

    var cui1: Double = 0
    if (sap_form.data.get("cui1").isDefined && !sap_form.data.get("cui1").isEmpty && !StringUtils.isEmpty(sap_form.data.get("cui1").get)) {
      cui1 = sap_form.data.get("cui1").get.toDouble

      if (cui1 > 999999999) {
        newform = sap_form.withError("cui1", Messages.get(langObj, "sap.cui1.range"))
      }
    }
    var cui2: Double = 0
    if (!sap_form.data.get("cui2").isDefined && !sap_form.data.get("cui2").isEmpty && !StringUtils.isEmpty(sap_form.data.get("cui2").get)) {
      cui2 = sap_form.data.get("cui2").get.toDouble

      if (cui2 > 999999999) {
        newform = sap_form.withError("cui2", Messages.get(langObj, "sap.cui2.range"))
      }
    }
    val newSum = cui2_per.toInt + cui1_per.toInt

    val sum: java.math.BigDecimal = java.math.BigDecimal.valueOf(cui2_per.toInt + cui1_per.toInt)

    /**
     * Code to check cui percentage less than eqquals to 100.
     */

    if (newSum > 100 || newSum == 0 || (newSum < 100 && newSum > 0)) {

      newform = sap_form.withError("cui2_per", Messages.get(langObj, "sap.validPer"))
      //newform.fill(oldData)
      // newform
    }

    if (!isValidSAP) {
      newform = sap_form.withError("sap_number", Messages.get(langObj, "sap.validSAPValue"))
    }

    /*val program_id = sap_form.data.get("program_id").get
    val planned_value = ProgramService.getPlannedHoursForProgram(program_id)

    if (!sap_form.data.get("planned_hours").isEmpty && !StringUtils.isEmpty(sap_form.data.get("planned_hours").get)) {
      val actual_planned_hours = sap_form.data.get("planned_hours").get.toDouble
      var project_planned_hours: Double = 0
      val projects = ProjectService.findProjectListForProgram(program_id)
      for (p <- projects) {
        if (!p.planned_hours.isEmpty) {
          project_planned_hours += p.planned_hours.get
        }
      }
      if (actual_planned_hours < project_planned_hours) {
        newform = sap_form.withError("planned_hours", Messages.get(langObj, "sap.plann_hour"))
      }
    }*/

    /**
     *  Edit SAP Validate SAP paid,committed, non committed values.
     *
     */

    //Hardware
    var approved: Long = 0
    var approved_buddget: Long = 0
    var paid_budget: Long = 0
    var commited: Long = 0
    var non_committed: Long = 0
    if (!StringUtils.isEmpty(sap_id)) {

      //Hardware Investment and Expenditure..F
      if (!sap_form.data.get("investment.investment_hardware").isEmpty) {
        approved = sap_form.data.get("investment.investment_hardware").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_investment_hardware").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_investment_hardware").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_investment_hardware").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_investment_hardware").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_investment_hardware").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_investment_hardware").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          //newform = sap_form.withError("available_investment_hardware", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_investment_hardware").get.isEmpty || !old_sap_form.data.get("committed_investment_hardware").get.isEmpty || !old_sap_form.data.get("non_committed_investment_hardware").get.isEmpty || !old_sap_form.data.get("available_investment_hardware").get.isEmpty) {
          newform = sap_form.withError("investment.investment_hardware", "Ingrese monto")
        }
      }

      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      if (!sap_form.data.get("expenditure.expenditure_hardware").isEmpty) {
        approved = sap_form.data.get("expenditure.expenditure_hardware").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_expenditure_hardware").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_expenditure_hardware").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_expenditure_hardware").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_expenditure_hardware").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_expenditure_hardware").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_expenditure_hardware").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          //newform = sap_form.withError("available_expenditure_hardware", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_expenditure_hardware").get.isEmpty || !old_sap_form.data.get("committed_expenditure_hardware").get.isEmpty || !old_sap_form.data.get("non_committed_expenditure_hardware").get.isEmpty || !old_sap_form.data.get("available_expenditure_hardware").get.isEmpty) {
          newform = sap_form.withError("expenditure.expenditure_hardware", "Ingrese monto")
        }
      }

      //software investment & expenditure..
      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      if (!sap_form.data.get("investment.investment_software").isEmpty) {
        approved = sap_form.data.get("investment.investment_software").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_investment_software").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_investment_software").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_investment_software").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_investment_software").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_investment_software").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_investment_software").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          //newform = sap_form.withError("available_investment_software", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_investment_software").get.isEmpty || !old_sap_form.data.get("committed_investment_software").get.isEmpty || !old_sap_form.data.get("non_committed_investment_software").get.isEmpty || !old_sap_form.data.get("available_investment_software").get.isEmpty) {
          newform = sap_form.withError("investment.investment_software", "Ingrese monto")
        }
      }

      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      if (!sap_form.data.get("expenditure.expenditure_software").isEmpty) {
        approved = sap_form.data.get("expenditure.expenditure_software").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_expenditure_software").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_expenditure_software").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_expenditure_software").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_expenditure_software").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_expenditure_software").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_expenditure_software").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          //newform = sap_form.withError("available_expenditure_software", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_expenditure_software").get.isEmpty || !old_sap_form.data.get("committed_expenditure_software").get.isEmpty || !old_sap_form.data.get("non_committed_expenditure_software").get.isEmpty || !old_sap_form.data.get("available_expenditure_software").get.isEmpty) {
          newform = sap_form.withError("expenditure.expenditure_software", "Ingrese monto")
        }
      }

      //Telecomunication...
      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      if (!sap_form.data.get("investment.investment_telecommunication").isEmpty) {
        approved = sap_form.data.get("investment.investment_telecommunication").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_investment_telecommunication").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_investment_telecommunication").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_investment_telecommunication").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_investment_telecommunication").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_investment_telecommunication").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_investment_telecommunication").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          //newform = sap_form.withError("available_investment_telecommunication", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_investment_telecommunication").get.isEmpty || !old_sap_form.data.get("committed_investment_telecommunication").get.isEmpty || !old_sap_form.data.get("non_committed_investment_telecommunication").get.isEmpty || !old_sap_form.data.get("available_investment_telecommunication").get.isEmpty) {
          newform = sap_form.withError("investment.investment_telecommunication", "Ingrese monto")
        }
      }

      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      if (!sap_form.data.get("expenditure.expenditure_telecommunication").isEmpty) {
        approved = sap_form.data.get("expenditure.expenditure_telecommunication").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_expenditure_telecommunication").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_expenditure_telecommunication").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_expenditure_telecommunication").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_expenditure_telecommunication").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_expenditure_telecommunication").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_expenditure_telecommunication").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          //newform = sap_form.withError("available_expenditure_telecommunication", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_expenditure_telecommunication").get.isEmpty || !old_sap_form.data.get("committed_expenditure_telecommunication").get.isEmpty || !old_sap_form.data.get("non_committed_expenditure_telecommunication").get.isEmpty || !old_sap_form.data.get("available_expenditure_telecommunication").get.isEmpty) {
          newform = sap_form.withError("expenditure.expenditure_telecommunication", "Ingrese monto")
        }
      }

      //development

      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      if (!sap_form.data.get("investment.investment_development").isEmpty) {
        approved = sap_form.data.get("investment.investment_development").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_investment_development").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_investment_development").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_investment_development").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_investment_development").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_investment_development").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_investment_development").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          //newform = sap_form.withError("available_investment_development", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_investment_development").get.isEmpty || !old_sap_form.data.get("committed_investment_development").get.isEmpty || !old_sap_form.data.get("non_committed_investment_development").get.isEmpty || !old_sap_form.data.get("available_investment_development").get.isEmpty) {
          newform = sap_form.withError("investment.investment_development", "Ingrese monto")
        }
      }

      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      if (!sap_form.data.get("expenditure.expenditure_development").isEmpty) {
        approved = sap_form.data.get("expenditure.expenditure_development").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_expenditure_development").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_expenditure_development").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_expenditure_development").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_expenditure_development").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_expenditure_development").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_expenditure_development").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          //newform = sap_form.withError("available_expenditure_development", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_expenditure_development").get.isEmpty || !old_sap_form.data.get("committed_expenditure_development").get.isEmpty || !old_sap_form.data.get("non_committed_expenditure_development").get.isEmpty || !old_sap_form.data.get("available_expenditure_development").get.isEmpty) {
          newform = sap_form.withError("expenditure.expenditure_development", "Ingrese monto")
        }
      }

      //Other

      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      if (!sap_form.data.get("investment.investment_other").isEmpty) {
        approved = sap_form.data.get("investment.investment_other").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_investment_other").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_investment_other").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_investment_other").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_investment_other").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_investment_other").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_investment_other").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          //newform = sap_form.withError("available_investment_other", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_investment_other").get.isEmpty || !old_sap_form.data.get("committed_investment_other").get.isEmpty || !old_sap_form.data.get("non_committed_investment_other").get.isEmpty || !old_sap_form.data.get("available_investment_other").get.isEmpty) {
          newform = sap_form.withError("investment.investment_other", "Ingrese monto")
        }
      }

      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      if (!sap_form.data.get("expenditure.expenditure_other").isEmpty) {
        approved = sap_form.data.get("expenditure.expenditure_other").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_expenditure_other").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_expenditure_other").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_expenditure_other").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_expenditure_other").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_expenditure_other").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_expenditure_other").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          //newform = sap_form.withError("available_expenditure_other", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_expenditure_other").get.isEmpty || !old_sap_form.data.get("committed_expenditure_other").get.isEmpty || !old_sap_form.data.get("non_committed_expenditure_other").get.isEmpty || !old_sap_form.data.get("available_expenditure_other").get.isEmpty) {
          newform = sap_form.withError("expenditure.expenditure_other", "Ingrese monto")
        }
      }

      //QA

      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      if (!sap_form.data.get("investment.investment_qa").isEmpty) {
        approved = sap_form.data.get("investment.investment_qa").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_investment_qa").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_investment_qa").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_investment_qa").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_investment_qa").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_investment_qa").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_investment_qa").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          //newform = sap_form.withError("available_investment_qa", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_investment_qa").get.isEmpty || !old_sap_form.data.get("committed_investment_qa").get.isEmpty || !old_sap_form.data.get("non_committed_investment_qa").get.isEmpty || !old_sap_form.data.get("available_investment_qa").get.isEmpty) {
          newform = sap_form.withError("investment.investment_qa", "Ingrese monto")
        }
      }

      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      if (!sap_form.data.get("expenditure.expenditure_qa").isEmpty) {
        approved = sap_form.data.get("expenditure.expenditure_qa").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_expenditure_qa").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_expenditure_qa").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_expenditure_qa").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_expenditure_qa").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_expenditure_qa").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_expenditure_qa").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          // newform = sap_form.withError("available_expenditure_qa", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_expenditure_qa").get.isEmpty || !old_sap_form.data.get("committed_expenditure_qa").get.isEmpty || !old_sap_form.data.get("non_committed_expenditure_qa").get.isEmpty || !old_sap_form.data.get("available_expenditure_qa").get.isEmpty) {
          newform = sap_form.withError("expenditure.expenditure_qa", "Ingrese monto")
        }
      }

      //Improvements
      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      if (!sap_form.data.get("investment.investment_improvements").isEmpty) {
        approved = sap_form.data.get("investment.investment_improvements").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_investment_improvements").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_investment_improvements").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_investment_improvements").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_investment_improvements").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_investment_improvements").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_investment_improvements").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          //newform = sap_form.withError("available_investment_improvements", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_investment_improvements").isEmpty || !old_sap_form.data.get("committed_investment_improvements").get.isEmpty || !old_sap_form.data.get("non_committed_investment_improvements").get.isEmpty || !old_sap_form.data.get("available_investment_improvements").get.isEmpty) {
          newform = sap_form.withError("investment.investment_improvements", "Ingrese monto")
        }
      }

      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      /*if (!sap_form.data.get("expenditure.expenditure_improvements").get.isEmpty) {
        approved = sap_form.data.get("expenditure.expenditure_improvements").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_expenditure_qa").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_expenditure_qa").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_expenditure_improvements_qa").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_expenditure_qa").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_expenditure_qa").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_expenditure_improvements_qa").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          newform = sap_form.withError("available_expenditure_qa", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_expenditure_improvements").get.isEmpty || !old_sap_form.data.get("committed_expenditure_improvements").get.isEmpty || !old_sap_form.data.get("non_committed_expenditure_improvements").get.isEmpty || !old_sap_form.data.get("available_expenditure_improvements").get.isEmpty) {
          newform = sap_form.withError("expenditure.expenditure_improvements", "Ingrese monto")
        }
      }*/

      //recurring_first
      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      if (!sap_form.data.get("investment.investment_recurring_first").get.isEmpty) {
        approved = sap_form.data.get("investment.investment_recurring_first").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_investment_recurring_first").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_investment_recurring_first").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_investment_recurring_first").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_investment_recurring_first").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_investment_recurring_first").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_investment_recurring_first").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          //newform = sap_form.withError("available_investment_recurring_first", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_investment_recurring_first").get.isEmpty || !old_sap_form.data.get("committed_investment_recurring_first").get.isEmpty || !old_sap_form.data.get("non_committed_investment_recurring_first").get.isEmpty || !old_sap_form.data.get("available_investment_recurring_first").get.isEmpty) {
          newform = sap_form.withError("investment.investment_recurring_first", "Ingrese monto")
        }
      }

      approved = 0
      paid_budget = 0
      commited = 0
      non_committed = 0
      if (!sap_form.data.get("expenditure.expenditure_recurring_first").get.isEmpty) {
        approved = sap_form.data.get("expenditure.expenditure_recurring_first").get.replaceAll("\\.+", "").toLong
        if (!old_sap_form.data.get("paid_expenditure_recurring_first").get.isEmpty()) {
          paid_budget = old_sap_form.data.get("paid_expenditure_recurring_first").get.replaceAll("\\.+", "").toLong
        }
        if (!old_sap_form.data.get("committed_expenditure_recurring_first").get.isEmpty()) {
          commited = old_sap_form.data.get("committed_expenditure_recurring_first").get.replaceAll("\\.+", "").toLong
        }

        if (!old_sap_form.data.get("non_committed_expenditure_recurring_first").get.isEmpty()) {
          non_committed = old_sap_form.data.get("non_committed_expenditure_recurring_first").get.replaceAll("\\.+", "").toLong
        }

        if (approved < (paid_budget + commited + non_committed)) {
          //newform = sap_form.withError("available_expenditure_recurring_first", "Cantidad no válida.")
        }

      } else {
        if (!old_sap_form.data.get("paid_expenditure_recurring_first").get.isEmpty || !old_sap_form.data.get("committed_expenditure_recurring_first").get.isEmpty || !old_sap_form.data.get("non_committed_expenditure_recurring_first").get.isEmpty || !old_sap_form.data.get("available_expenditure_recurring_first").get.isEmpty) {
          newform = sap_form.withError("expenditure.expenditure_recurring_first", "Ingrese monto")
        }
      }

    }

    if (!sap_form.data.get("approved_date").isEmpty) {
      val string = sap_form.data.get("approved_date").get.trim();
      val format = new java.text.SimpleDateFormat("dd-MM-yyyy");
      val date = format.parse(string);
      val start_date = ProgramService.findProgramDateDetailsById(program_id).get.initiation_planned_date
      if (start_date.after(date)) {
        newform = sap_form.withError("approved_date", "Approve date should not greater than Program Start date");
      }
    }

    if (!sap_form.data.get("comitted_date").isEmpty) {
      val format = new java.text.SimpleDateFormat("dd-MM-yyyy");
      val string = sap_form.data.get("comitted_date").get.trim();
      val date = format.parse(string);
      val start_date = ProgramService.findProgramDateDetailsById(program_id).get.initiation_planned_date
      if (start_date.after(date)) {
        newform = sap_form.withError("comitted_date", "Comitted date should not greater than Program Start date");
      }
    }
    if (!sap_form.data.get("approved_date").isEmpty && !sap_form.data.get("comitted_date").isEmpty) {
      val format = new java.text.SimpleDateFormat("dd-MM-yyyy");
      val string = sap_form.data.get("comitted_date").get.trim();
      val string2 = sap_form.data.get("approved_date").get.trim();
      val date = format.parse(string);
      val date2 = format.parse(string2);
      if (date2.after(date)) {
        newform = sap_form.withError("comitted_date", "Comitted date should greater than Approved date");
      }
    }

    // println(newform.errors)

    /**
     * Validations ends
     *
     */
    // newform = sap_form.withError("sap_number", "Número de SAP es ya existe.")
    if (newform != null) {
      newform
    } else {
      sap_form
    }

  }

  /**
   * Project SAP Form - Custom Validation
   */
  def validateProjectSAPForm(sap_form: Form[ProjectSAP], old_project_sap_id: String) = {

    var newform: play.api.data.Form[models.ProjectSAP] = null

    var cui1_per: Double = 0
    var cui2_per: Double = 0

    if ("0".equals(sap_form.data.get("sap_id").get)) {
      newform = sap_form.withError("sap_id", "Please select the SAP number")
    }
    if (!sap_form.data.get("sap_id").isEmpty) {

      val id = sap_form.data.get("sap_id").get

      var old_i_hardware: Long = 0
      var old_i_software: Long = 0
      var old_i_telecommunication: Long = 0
      var old_i_development: Long = 0
      var old_i_other: Long = 0
      var old_i_qa: Long = 0
      var old_i_improvements: Long = 0
      var old_i_recurring_first: Long = 0

      var old_e_hardware: Long = 0
      var old_e_software: Long = 0
      var old_e_telecommunication: Long = 0
      var old_e_development: Long = 0
      var old_e_other: Long = 0
      var old_e_qa: Long = 0
      var old_e_improvements: Long = 0
      var old_e_recurring_first: Long = 0

      var current_i_hardware: Long = 0
      var current_i_software: Long = 0
      var current_i_telecommunication: Long = 0
      var current_i_development: Long = 0
      var current_i_other: Long = 0
      var current_i_qa: Long = 0
      var current_i_improvements: Long = 0
      var current_i_recurring_first: Long = 0

      var current_e_hardware: Long = 0
      var current_e_software: Long = 0
      var current_e_telecommunication: Long = 0
      var current_e_development: Long = 0
      var current_e_other: Long = 0
      var current_e_qa: Long = 0
      var current_e_improvements: Long = 0
      var current_e_recurring_first: Long = 0

      val sap_data = SAPServices.findSAPInvestmentDetails(id)
      var i_investment_hardware: Long = 0
      var i_investment_software: Long = 0
      var i_investment_telecommunication: Long = 0
      var i_investment_development: Long = 0
      var i_investment_other: Long = 0
      var i_investment_qa: Long = 0
      var i_investment_improvements: Long = 0
      var i_investment_recurring_first: Long = 0

      var e_investment_hardware: Long = 0
      var e_investment_software: Long = 0
      var e_investment_telecommunication: Long = 0
      var e_investment_development: Long = 0
      var e_investment_other: Long = 0
      var e_investment_qa: Long = 0
      var e_investment_improvements: Long = 0
      var e_investment_recurring_first: Long = 0

      var total_investment_hardware: Long = 0
      var total_investment_software: Long = 0
      var total_investment_telecommunication: Long = 0
      var total_investment_development: Long = 0
      var total_investment_other: Long = 0
      var total_investment_qa: Long = 0
      var total_investment_improvements: Long = 0
      var total_investment_recurring_first: Long = 0

      var total_expend_hardware: Long = 0
      var total_expend_software: Long = 0
      var total_expend_telecommunication: Long = 0
      var total_expend_development: Long = 0
      var total_expend_other: Long = 0
      var total_expend_qa: Long = 0
      var total_expend_improvements: Long = 0
      var total_expend_recurring_first: Long = 0

      val total_sap_invest = SAPServices.findSAPInvestmentDetails(id)
      if (!total_sap_invest.isEmpty) {

        if (!total_sap_invest.get.hardware.isEmpty)
          total_investment_hardware += total_sap_invest.get.hardware.get

        if (!total_sap_invest.get.software.isEmpty)
          total_investment_software += total_sap_invest.get.software.get

        if (!total_sap_invest.get.telecommunication.isEmpty)
          total_investment_telecommunication += total_sap_invest.get.telecommunication.get

        if (!total_sap_invest.get.development.isEmpty)
          total_investment_development += total_sap_invest.get.development.get

        if (!total_sap_invest.get.other.isEmpty)
          total_investment_other += total_sap_invest.get.other.get

        if (!total_sap_invest.get.qa.isEmpty)
          total_investment_qa += total_sap_invest.get.qa.get

        if (!total_sap_invest.get.improvements.isEmpty)
          total_investment_improvements += total_sap_invest.get.improvements.get

        if (!total_sap_invest.get.recurring_first.isEmpty)
          total_investment_recurring_first += total_sap_invest.get.recurring_first.get

      }

      val total_sap_expand = SAPServices.findSAPExpenditureDetails(id)
      if (!total_sap_expand.isEmpty) {

        if (!total_sap_expand.get.hardware.isEmpty)
          total_expend_hardware += total_sap_expand.get.hardware.get

        if (!total_sap_expand.get.software.isEmpty)
          total_expend_software += total_sap_expand.get.software.get

        if (!total_sap_expand.get.telecommunication.isEmpty)
          total_expend_telecommunication += total_sap_expand.get.telecommunication.get

        if (!total_sap_expand.get.development.isEmpty)
          total_expend_development += total_sap_expand.get.development.get

        if (!total_sap_expand.get.other.isEmpty)
          total_expend_other += total_sap_expand.get.other.get

        if (!total_sap_expand.get.qa.isEmpty)
          total_expend_qa += total_sap_expand.get.qa.get

        if (!total_sap_expand.get.improvements.isEmpty)
          total_expend_improvements += total_sap_expand.get.improvements.get

        if (!total_sap_expand.get.recurring_first.isEmpty)
          total_expend_recurring_first += total_sap_expand.get.recurring_first.get

      }

      val project_saps_invests = SAPServices.findProjectSAPInvestmentDetails(id)
      for (p <- project_saps_invests) {
        if (!p.hardware.isEmpty)
          i_investment_hardware += p.hardware.get

        if (!p.software.isEmpty)
          i_investment_software += p.software.get

        if (!p.telecommunication.isEmpty)
          i_investment_telecommunication += p.telecommunication.get

        if (!p.development.isEmpty)
          i_investment_development += p.development.get

        if (!p.other.isEmpty)
          i_investment_other += p.other.get

        if (!p.qa.isEmpty)
          i_investment_qa += p.qa.get

        if (!p.improvements.isEmpty)
          i_investment_improvements += p.improvements.get

        if (!p.recurring_first.isEmpty)
          i_investment_recurring_first += p.recurring_first.get

      }

      val project_saps_expends = SAPServices.findProjectSAPExpenditureDetails(id)
      for (p <- project_saps_expends) {
        if (!p.hardware.isEmpty)
          e_investment_hardware += p.hardware.get

        if (!p.software.isEmpty)
          e_investment_software += p.software.get

        if (!p.telecommunication.isEmpty)
          e_investment_telecommunication += p.telecommunication.get

        if (!p.development.isEmpty)
          e_investment_development += p.development.get

        if (!p.other.isEmpty)
          e_investment_other += p.other.get

        if (!p.qa.isEmpty)
          e_investment_qa += p.qa.get

        if (!p.improvements.isEmpty)
          e_investment_improvements += p.improvements.get

        if (!p.recurring_first.isEmpty)
          e_investment_recurring_first += p.recurring_first.get

      }

      if (!StringUtils.isEmpty(old_project_sap_id)) {
        val sap_old_data = SAPServices.findSAPOldInvestmentDetails(old_project_sap_id)
        if (!sap_old_data.isEmpty) {

          if (!sap_old_data.get.hardware.isEmpty)
            old_i_hardware += sap_old_data.get.hardware.get

          if (!sap_old_data.get.software.isEmpty)
            old_i_software += sap_old_data.get.software.get

          if (!sap_old_data.get.telecommunication.isEmpty)
            old_i_telecommunication += sap_old_data.get.telecommunication.get

          if (!sap_old_data.get.development.isEmpty)
            old_i_development += sap_old_data.get.development.get

          if (!sap_old_data.get.other.isEmpty)
            old_i_other += sap_old_data.get.other.get

          if (!sap_old_data.get.qa.isEmpty)
            old_i_qa += sap_old_data.get.qa.get

          if (!sap_old_data.get.improvements.isEmpty)
            old_i_improvements += sap_old_data.get.improvements.get

          if (!sap_old_data.get.recurring_first.isEmpty)
            old_i_recurring_first += sap_old_data.get.recurring_first.get

        }

        val old_sap_expand = SAPServices.findSAPOldExpenditureDetails(old_project_sap_id)
        if (!old_sap_expand.isEmpty) {

          if (!old_sap_expand.get.hardware.isEmpty)
            old_e_hardware += old_sap_expand.get.hardware.get

          if (!old_sap_expand.get.software.isEmpty)
            old_e_software += old_sap_expand.get.software.get

          if (!old_sap_expand.get.telecommunication.isEmpty)
            old_e_telecommunication += total_sap_expand.get.telecommunication.get

          if (!old_sap_expand.get.development.isEmpty)
            old_e_development += old_sap_expand.get.development.get

          if (!old_sap_expand.get.other.isEmpty)
            old_e_other += old_sap_expand.get.other.get

          if (!old_sap_expand.get.qa.isEmpty)
            old_e_qa += old_sap_expand.get.qa.get

          if (!total_sap_expand.get.improvements.isEmpty)
            old_e_improvements += old_sap_expand.get.improvements.get

          if (!old_sap_expand.get.recurring_first.isEmpty)

            old_e_recurring_first += old_sap_expand.get.recurring_first.get

        }

        total_investment_hardware = total_investment_hardware + old_i_hardware
        total_investment_software = total_investment_software + old_i_software
        total_investment_telecommunication = total_investment_telecommunication + old_i_telecommunication
        total_investment_development = total_investment_development + old_i_development
        total_investment_other = total_investment_other + old_i_other
        total_investment_qa = total_investment_qa + old_i_qa
        total_investment_improvements = total_investment_improvements + old_i_improvements
        total_investment_recurring_first = total_investment_recurring_first + old_i_recurring_first

        total_expend_hardware = total_expend_hardware + old_e_hardware
        total_expend_software = total_expend_software + old_e_software
        total_expend_telecommunication = total_expend_telecommunication + old_e_telecommunication
        total_expend_development = total_expend_development + old_e_development
        total_expend_other = total_expend_other + old_e_other
        total_expend_qa = total_expend_qa + old_e_qa
        total_expend_improvements = total_expend_improvements + old_e_improvements
        total_expend_recurring_first = total_expend_recurring_first + old_e_recurring_first

      }

      /*************/
      //println(total_investment_software + "---" + i_investment_software)
      total_investment_hardware = total_investment_hardware - i_investment_hardware
      total_investment_software = total_investment_software - i_investment_software
      total_investment_telecommunication = total_investment_telecommunication - i_investment_telecommunication
      total_investment_development = total_investment_development - i_investment_development
      total_investment_other = total_investment_other - i_investment_other
      total_investment_qa = total_investment_qa - i_investment_qa
      total_investment_improvements = total_investment_improvements - i_investment_improvements
      total_investment_recurring_first = total_investment_recurring_first - i_investment_recurring_first

      total_expend_hardware = total_expend_hardware - e_investment_hardware
      total_expend_software = total_expend_software - e_investment_software
      total_expend_telecommunication = total_expend_telecommunication - e_investment_telecommunication
      total_expend_development = total_expend_development - e_investment_development
      total_expend_other = total_expend_other - e_investment_other
      total_expend_qa = total_expend_qa - e_investment_qa
      total_expend_improvements = total_expend_improvements - e_investment_improvements
      total_expend_recurring_first = total_expend_recurring_first - e_investment_recurring_first

      /**
       * Get current values...Investment
       */

      if (!sap_form.data.get("project_investment.investment_hardware").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_investment.investment_hardware").get) && sap_form.data.get("project_investment.investment_hardware").isDefined)

        current_i_hardware = sap_form.data.get("project_investment.investment_hardware").get.toLong

      if (!sap_form.data.get("project_investment.investment_software").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_investment.investment_software").get) && sap_form.data.get("project_investment.investment_software").isDefined) {
        current_i_software = sap_form.data.get("project_investment.investment_software").get.toLong
      }

      if (!sap_form.data.get("project_investment.investment_telecommunication").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_investment.investment_telecommunication").get) && sap_form.data.get("project_investment.investment_telecommunication").isDefined)
        current_i_telecommunication = sap_form.data.get("project_investment.investment_telecommunication").get.toLong

      if (!sap_form.data.get("project_investment.investment_development").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_investment.investment_development").get) && sap_form.data.get("project_investment.investment_development").isDefined)
        current_i_development = sap_form.data.get("project_investment.investment_development").get.toLong

      if (!sap_form.data.get("project_investment.investment_other").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_investment.investment_other").get) && sap_form.data.get("project_investment.investment_other").isDefined)
        current_i_other = sap_form.data.get("project_investment.investment_other").get.toLong

      if (!sap_form.data.get("project_investment.investment_qa").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_investment.investment_qa").get) && sap_form.data.get("project_investment.investment_qa").isDefined)
        current_i_qa = sap_form.data.get("project_investment.investment_qa").get.toLong

      if (!sap_form.data.get("project_investment.investment_improvements").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_investment.investment_improvements").get) && sap_form.data.get("project_investment.investment_improvements").isDefined)
        current_i_improvements = sap_form.data.get("project_investment.investment_improvements").get.toLong

      if (!sap_form.data.get("project_investment.investment_recurring_first").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_investment.investment_recurring_first").get) && sap_form.data.get("project_investment.investment_recurring_first").isDefined)
        current_i_recurring_first = sap_form.data.get("project_investment.investment_recurring_first").get.toLong

      /**
       * Get current .....expenditure
       */
      if (!sap_form.data.get("project_expenditure.expenditure_hardware").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_expenditure.expenditure_hardware").get) && sap_form.data.get("project_expenditure.expenditure_hardware").isDefined)
        current_e_hardware = sap_form.data.get("project_expenditure.expenditure_hardware").get.toLong

      if (!sap_form.data.get("project_expenditure.expenditure_software").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_expenditure.expenditure_software").get) && sap_form.data.get("project_expenditure.expenditure_software").isDefined)
        current_e_software = sap_form.data.get("project_expenditure.expenditure_software").get.toLong

      if (!sap_form.data.get("project_expenditure.expenditure_telecommunication").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_expenditure.expenditure_telecommunication").get) && sap_form.data.get("project_expenditure.expenditure_telecommunication").isDefined)
        current_e_telecommunication = sap_form.data.get("project_expenditure.expenditure_telecommunication").get.toLong

      if (!sap_form.data.get("project_expenditure.expenditure_development").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_expenditure.expenditure_development").get) && sap_form.data.get("project_expenditure.expenditure_development").isDefined)
        current_e_development = sap_form.data.get("project_expenditure.expenditure_development").get.toLong

      if (!sap_form.data.get("project_expenditure.expenditure_other").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_expenditure.expenditure_other").get) && sap_form.data.get("project_expenditure.expenditure_other").isDefined)
        current_e_other = sap_form.data.get("project_expenditure.expenditure_other").get.toLong

      if (!sap_form.data.get("project_expenditure.expenditure_qa").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_expenditure.expenditure_qa").get) && sap_form.data.get("project_expenditure.expenditure_qa").isDefined)
        current_e_qa = sap_form.data.get("project_expenditure.expenditure_qa").get.toLong

      if (!sap_form.data.get("project_expenditure.expenditure_improvements").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_expenditure.expenditure_improvements").get) && sap_form.data.get("project_expenditure.expenditure_improvements").isDefined)
        current_e_improvements = sap_form.data.get("project_expenditure.expenditure_improvements").get.toLong

      if (!sap_form.data.get("project_expenditure.expenditure_recurring_first").isEmpty && !StringUtils.isEmpty(sap_form.data.get("project_expenditure.expenditure_recurring_first").get) && sap_form.data.get("project_expenditure.expenditure_recurring_first").isDefined)
        current_e_recurring_first = sap_form.data.get("project_expenditure.expenditure_recurring_first").get.toLong

      /**
       * Compare with available...investment
       */

      if (total_investment_hardware < current_i_hardware) {
        newform = sap_form.withError("project_investment.investment_hardware", "Insert valid amount.")
        //newform.fill(sap_form.get)
      }

      if (total_investment_software < current_i_software) {
        newform = sap_form.withError("project_investment.investment_software", "Insert valid amount.")
        //newform.fill(sap_form.get)
      }
      if (total_investment_telecommunication < current_i_telecommunication) {
        newform = sap_form.withError("project_investment.investment_telecommunication", "Insert valid amount.")
        //newform.fill(sap_form.get)
      }

      if (total_investment_development < current_i_development) {

        newform = sap_form.withError("project_investment.investment_development", "Insert valid amount.")
        //newform.fill(sap_form.get)
      }
      if (total_investment_other < current_i_other) {
        newform = sap_form.withError("project_investment.investment_other", "Insert valid amount.")
        //newform.fill(sap_form.get)
      }
      if (total_investment_qa < current_i_qa) {
        newform = sap_form.withError("project_investment.investment_qa", "Insert valid amount.")
        //newform.fill(sap_form.get)
      }
      if (total_investment_improvements < current_i_improvements) {
        newform = sap_form.withError("project_investment.investment_improvements", "Insert valid amount.")
        // newform.fill(sap_form.get)
      }
      if (total_investment_recurring_first < current_i_recurring_first) {
        newform = sap_form.withError("project_investment.investment_recurring_first", "Insert valid amount.")
        //newform.fill(sap_form.get)
      }

      /**
       * Compare with available...expenditure
       */
      if (total_expend_hardware < current_e_hardware) {
        newform = sap_form.withError("project_expenditure.expenditure_hardware", "Insert valid amount.")
        // newform.fill(sap_form.get)
      }
      if (total_expend_software < current_e_software) {
        newform = sap_form.withError("project_expenditure.expenditure_software", "Insert valid amount.")
        //newform.fill(sap_form.get)
      }
      if (total_expend_telecommunication < current_e_telecommunication) {
        newform = sap_form.withError("project_expenditure.expenditure_telecommunication", "Insert valid amount.")
        //newform.fill(sap_form.get)
      }
      if (total_expend_development < current_e_development) {
        newform = sap_form.withError("project_expenditure.expenditure_development", "Insert valid amount.")
        //newform.fill(sap_form.get)
      }
      if (total_expend_other < current_e_other) {
        newform = sap_form.withError("project_expenditure.expenditure_other", "Insert valid amount.")
        //newform.fill(sap_form.get)
      }
      if (total_expend_qa < current_e_qa) {
        newform = sap_form.withError("project_expenditure.expenditure_qa", "Insert valid amount.")
        //newform.fill(sap_form.get)
      }
      if (total_expend_improvements < current_e_improvements) {
        newform = sap_form.withError("project_expenditure.expenditure_improvements", "Insert valid amount.")
        //newform.fill(sap_form.get)
      }

      if (total_expend_recurring_first < current_e_recurring_first) {
        newform = sap_form.withError("project_expenditure.expenditure_recurring_first", "Insert valid amount.")
        //newform.fill(sap_form.get)
      }

      /* if (!sap_form.data.get("project_id").isEmpty) {
        val project_id = sap_form.data.get("project_id").get
        val project = ProjectService.findProject(Integer.parseInt(project_id))
        if (!project.isEmpty) {
          val program_id = project.get.program.toString()
          val program = ProgramService.findProgramMasterDetailsById(program_id)
          if (!program.get.planned_hours.isEmpty) {
            val program_hours = program.get.planned_hours.get

            if (!sap_form.data.get("planned_hours").isEmpty && !StringUtils.isEmpty(sap_form.data.get("planned_hours").get)) {
              val actual_planned_hours = sap_form.data.get("planned_hours").get.toDouble
              var project_planned_hours: Double = 0
              val projects = ProjectService.findProjectListForProgram(program_id)
              for (p <- projects) {
                if (!p.planned_hours.isEmpty && !StringUtils.equals(p.pId.get.toString(), project_id)) {
                  project_planned_hours += p.planned_hours.get
                }
              }
              project_planned_hours += actual_planned_hours
              println(program_hours + " ---" + project_planned_hours)
              if (program_hours < project_planned_hours) {

                newform = sap_form.withError("planned_hours", Messages.get(langObj, "sap.plann_hour"))
              }
            }

          }
        }

      }*/
    }

    /*if (!sap_form.data.get("cui1_per").isEmpty)
      cui1_per = sap_form.data.get("cui1_per").get.toDouble

    if (!sap_form.data.get("cui2_per").isEmpty)
      cui2_per = sap_form.data.get("cui2_per").get.toDouble

    if ((cui2_per + cui1_per) > 100) {
      newform = sap_form.withError("cui2_per", Messages.get(langObj, "sap.validPer"))
      newform.fill(sap_form.get)
      newform
    } else {
      sap_form
    }*/

    if (newform != null) {
      newform
    } else {
      sap_form
    }
  }

  def calculateProgramSAPInvestment(sap_id: String) = {
    var sql = ""
    var total: scala.math.BigDecimal = 0
    sql = "select s.* from art_project_sap_details s,  art_project_sap_master ms where ms.id=s.project_sap_id and ms.sap_id='" + sap_id + "' and ms.is_active=1 and s.expense_type=0"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectExpenseDetails.project_sap *)
      var hw: Double = 0
      var sw: Double = 0
      var improvements: Double = 0
      var qa: Double = 0
      var recurring_first: Double = 0
      var telecommunication: Double = 0
      var other: Double = 0
      var development: Double = 0

      if (result.size > 0) {
        for (r <- result) {
          if (!r.hardware.isEmpty) {
            hw = r.hardware.get
          }
          if (!r.software.isEmpty) {
            sw = r.software.get
          }
          if (!r.improvements.isEmpty) {
            improvements = r.improvements.get
          }
          if (!r.qa.isEmpty) {
            qa = r.qa.get
          }
          if (!r.recurring_first.isEmpty) {
            recurring_first = r.recurring_first.get
          }
          if (!r.other.isEmpty) {
            other = r.other.get
          }
          if (!r.telecommunication.isEmpty) {
            telecommunication = r.telecommunication.get
          }
          if (!r.development.isEmpty) {
            development = r.development.get
          }
          total = total + (hw + sw + improvements + qa + recurring_first + other + telecommunication + development)
          hw = 0
          sw = 0
          improvements = 0
          qa = 0
          recurring_first = 0
          other = 0
          telecommunication = 0
          development = 0
        }
      }

      total = calculateSAPInvestment(sap_id) - total
      total
    }
  }

  def calculateProgramTotalSAPAvailableInvestment(program_id: String): Double = {
    var total: Double = 0
    var final_total: Double = 0
    val saps = findActiveSAPMasterDetails(program_id)
    for (s <- saps) {

      val sql = """
      SELECT  
      SUM(available_investment_hardware + available_investment_software +
      available_investment_telecommunication + available_investment_development+
      available_investment_other + available_investment_qa+
      available_investment_improvements + available_investment_recurring_first) FROM art_program_sap_details s where s.sap_id=""" + s.id

      try {
        DB.withConnection { implicit connection =>
          val result = SQL(sql).as(scalar[Double].singleOpt)
          total += result.get.toDouble

        }
      } catch {
        case _: Throwable => total
      } finally {
        if (total == 0) {
          total = calculateProgramSAPInvestment(s.id.toString()).toDouble

        }
        final_total += total
        total = 0
      }

    }
    final_total
  }

  def calculateProgramTotalSAPAvailableExpenditure(program_id: String): Double = {
    var total: Double = 0.0
    var final_total: Double = 0
    val saps = findActiveSAPMasterDetails(program_id)
    for (s <- saps) {

      val sql = """
      SELECT  
      SUM(available_expenditure_hardware + available_expenditure_software +
      available_expenditure_telecommunication + available_expenditure_development+
      available_expenditure_other + available_expenditure_qa+
      available_expenditure_improvements + available_expenditure_recurring_first) FROM art_program_sap_details s where s.sap_id=""" + s.id

      try {
        DB.withConnection { implicit connection =>
          val result = SQL(sql).as(scalar[Double].singleOpt)
          total += result.get.toDouble

        }
      } catch {
        case _: Throwable => total
      } finally {

        if (total == 0) {
          total = calculateProgramSAPExpenditure(s.id.toString()).toDouble
        }
        final_total += total
        total = 0
      }
    }
    final_total

  }

  def calculateProgramSAPAvailableInvestment(sap_id: String): Double = {
    var total: Double = 0
    val sql = """SELECT  
      SUM(available_investment_hardware + available_investment_software +
	    available_investment_telecommunication + available_investment_development+
	    available_investment_other + available_investment_qa+
	    available_investment_improvements + available_investment_recurring_first) FROM art_program_sap_details s where s.sap_id=""" + sap_id

    try {
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(scalar[Double].singleOpt)
        total = result.get.toDouble
        total
      }
    } catch {
      case _: Throwable => total
    } finally {
      total
    }

  }

  def calculateProgramSAPAvailableExpenditure(sap_id: String): Double = {
    var total: Double = 0.0
    val sql = """SELECT  
      SUM(available_expenditure_hardware + available_expenditure_software +
	    available_expenditure_telecommunication + available_expenditure_development+
	    available_expenditure_other + available_expenditure_qa+
	    available_expenditure_improvements + available_expenditure_recurring_first) FROM art_program_sap_details s where s.sap_id=""" + sap_id

    try {
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(scalar[Double].singleOpt)
        total = result.get.toDouble
        total
      }
    } catch {
      case _: Throwable => total
    } finally {
      total
    }
  }

  def calculateProgramSAPExpenditure(sap_id: String) = {
    var sql = ""
    var total: scala.math.BigDecimal = 0
    sql = "select s.* from art_project_sap_details s,  art_project_sap_master ms where ms.id=s.project_sap_id and ms.sap_id='" + sap_id + "' and ms.is_active=1 and s.expense_type=1"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectExpenseDetails.project_sap *)
      var hw: Double = 0
      var sw: Double = 0
      var improvements: Double = 0
      var qa: Double = 0
      var recurring_first: Double = 0
      var telecommunication: Double = 0
      var other: Double = 0
      var development: Double = 0

      if (result.size > 0) {
        for (r <- result) {
          if (!r.hardware.isEmpty) {
            hw = r.hardware.get
          }
          if (!r.software.isEmpty) {
            sw = r.software.get
          }
          if (!r.improvements.isEmpty) {
            improvements = r.improvements.get
          }
          if (!r.qa.isEmpty) {
            qa = r.qa.get
          }
          if (!r.recurring_first.isEmpty) {
            recurring_first = r.recurring_first.get
          }
          if (!r.other.isEmpty) {
            other = r.other.get
          }
          if (!r.telecommunication.isEmpty) {
            telecommunication = r.telecommunication.get
          }
          if (!r.development.isEmpty) {
            development = r.development.get
          }
          total = total + (hw + sw + improvements + qa + recurring_first + other + telecommunication + development)
          hw = 0
          sw = 0
          improvements = 0
          qa = 0
          recurring_first = 0
          other = 0
          telecommunication = 0
          development = 0
        }
      }

      //total = hw + sw + improvements + qa + recurring_first + other + telecommunication + development

      total = calculateSAPExpenditure(sap_id) - total
      total
    }
  }

  /**
   * Project SAP Data
   *
   */

  def insertProjectSAP(sap: ProjectSAP): Long = {

    DB.withConnection { implicit connection =>

      val sap_master = SQL(
        """
          insert into art_project_sap_master (project_id,sap_id,is_active,creation_date,last_update
         ) values (
          {project_id}, {sap_id},{is_active},{creation_date},{last_update})
          """).on(
          'project_id -> sap.project_id,
          'sap_id -> sap.sap_id,
          'is_active -> 1,
          'creation_date -> new Date(),
          'last_update -> new Date()).executeInsert(scalar[Long].singleOpt)

      var last_index = sap_master.last.toString().toLong

      if (!last_index.isNaN()) {

        //Investment = 0
        val sap_invest = SQL(
          """
          insert into art_project_sap_details (project_sap_id, expense_type,  hardware,   software, 
            telecommunication,development,other,qa,improvements,recurring_first
         ) values (
            {project_sap_id}, {expense_type},  {hardware},   {software}, 
            {telecommunication},{development},{other},{qa},{improvements},{recurring_first})
          """).on(
            'project_sap_id -> last_index,
            'expense_type -> 0,
            'hardware -> sap.project_investment.investment_hardware,
            'software -> sap.project_investment.investment_software,
            'telecommunication -> sap.project_investment.investment_telecommunication,
            'development -> sap.project_investment.investment_development,
            'other -> sap.project_investment.investment_other,
            'qa -> sap.project_investment.investment_qa,
            'improvements -> sap.project_investment.investment_improvements,
            'recurring_first -> sap.project_investment.investment_recurring_first).executeInsert(scalar[Long].singleOpt)

        //Expenditure = 1
        val sap_expese = SQL(
          """
          insert into art_project_sap_details (project_sap_id, expense_type,  hardware,   software, 
            telecommunication,development,other,qa,improvements,recurring_first
         ) values (
            {project_sap_id}, {expense_type},  {hardware},   {software}, 
            {telecommunication},{development},{other},{qa},{improvements},{recurring_first})
          """).on(
            'project_sap_id -> last_index,
            'expense_type -> 1,
            'hardware -> sap.project_expenditure.expenditure_hardware,
            'software -> sap.project_expenditure.expenditure_software,
            'telecommunication -> sap.project_expenditure.expenditure_telecommunication,
            'development -> sap.project_expenditure.expenditure_development,
            'other -> sap.project_expenditure.expenditure_other,
            'qa -> sap.project_expenditure.expenditure_qa,
            'improvements -> sap.project_expenditure.expenditure_improvements,
            'recurring_first -> sap.project_expenditure.expenditure_recurring_first).executeInsert(scalar[Long].singleOpt)

      }

      last_index
    }

  }

  def updateProjectSAP(sap: ProjectSAP, id: String) = {

    DB.withConnection { implicit connection =>

      val sap_master = SQL(
        """
          update  art_project_sap_master SET last_update={last_update} where id={id}
          """).on(
          'id -> id,
          'last_update -> new Date()).executeUpdate()

      var planned_hours: Double = 0
      if (!sap.planned_hours.isEmpty) {
        planned_hours = sap.planned_hours.get
        val project_id = sap.project_id.toString()
        val current_hours = ProjectService.getPlannedHoursForProject(project_id)
        if (current_hours != planned_hours) {
          val program_hours = SQL(
            """
                  update  art_project_master SET planned_hours={planned_hours} where pId={project_id}
                  """).on(
              'project_id -> project_id,
              'planned_hours -> planned_hours).executeUpdate()
        }
      }

      //Investment = 0
      val sap_invest = SQL(
        """
          update  art_project_sap_details SET   hardware={hardware},   software={software}, 
            telecommunication={telecommunication},development={development},other={other},qa={qa},improvements={improvements},recurring_first={recurring_first}
          where (project_sap_id={project_sap_id} and expense_type={expense_type})
          """).on(
          'project_sap_id -> id,
          'expense_type -> 0,
          'hardware -> sap.project_investment.investment_hardware,
          'software -> sap.project_investment.investment_software,
          'telecommunication -> sap.project_investment.investment_telecommunication,
          'development -> sap.project_investment.investment_development,
          'other -> sap.project_investment.investment_other,
          'qa -> sap.project_investment.investment_qa,
          'improvements -> sap.project_investment.investment_improvements,
          'recurring_first -> sap.project_investment.investment_recurring_first).executeUpdate()

      //Expenditure = 1
      val sap_expese = SQL(
        """
          update  art_project_sap_details SET   hardware={hardware},  software={software}, 
            telecommunication={telecommunication},development={development},other={other},qa={qa},improvements={improvements},recurring_first={recurring_first}
          where (project_sap_id={project_sap_id} and expense_type={expense_type})
          """).on(
          'project_sap_id -> id,
          'expense_type -> 1,
          'hardware -> sap.project_expenditure.expenditure_hardware,
          'software -> sap.project_expenditure.expenditure_software,
          'telecommunication -> sap.project_expenditure.expenditure_telecommunication,
          'development -> sap.project_expenditure.expenditure_development,
          'other -> sap.project_expenditure.expenditure_other,
          'qa -> sap.project_expenditure.expenditure_qa,
          'improvements -> sap.project_expenditure.expenditure_improvements,
          'recurring_first -> sap.project_expenditure.expenditure_recurring_first).executeUpdate()

    }

  }

  def calculateProjectSAPInvestment(sap_id: String) = {
    var sql = ""
    var total: Double = 0
    sql = "select s.* from art_project_sap_details s,  art_project_sap_master ms where ms.id=s.project_sap_id and ms.id='" + sap_id + "' and s.expense_type=0"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectExpenseDetails.project_sap.singleOpt)
      var hw: Double = 0
      var sw: Double = 0
      var improvements: Double = 0
      var qa: Double = 0
      var recurring_first: Double = 0
      var telecommunication: Double = 0
      var other: Double = 0
      var development: Double = 0

      if (!result.get.hardware.isEmpty) {
        hw = result.get.hardware.get
      }
      if (!result.get.software.isEmpty) {
        sw = result.get.software.get
      }
      if (!result.get.improvements.isEmpty) {
        improvements = result.get.improvements.get
      }
      if (!result.get.qa.isEmpty) {
        qa = result.get.qa.get
      }
      if (!result.get.recurring_first.isEmpty) {
        recurring_first = result.get.recurring_first.get
      }
      if (!result.get.other.isEmpty) {
        other = result.get.other.get
      }
      if (!result.get.telecommunication.isEmpty) {
        telecommunication = result.get.telecommunication.get
      }
      if (!result.get.development.isEmpty) {
        development = result.get.development.get
      }

      //println(hw + " " + sw + "-" + improvements + "-" + qa + "-" + recurring_first + "-" + other + "-" + telecommunication + "-" + development);
      if (!result.isEmpty) {
        total = hw + sw + improvements + qa + recurring_first + other + telecommunication + development
      }
      //println(total + "-------------");
      total
    }
  }

  def calculateProjectSAPExpenditure(sap_id: String) = {
    var sql = ""
    var total: Double = 0
    sql = "select s.* from art_project_sap_details s,  art_project_sap_master ms where ms.id=s.project_sap_id and ms.id='" + sap_id + "' and s.expense_type=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectExpenseDetails.project_sap.singleOpt)
      var hw: Double = 0
      var sw: Double = 0
      var improvements: Double = 0
      var qa: Double = 0
      var recurring_first: Double = 0
      var telecommunication: Double = 0
      var other: Double = 0
      var development: Double = 0

      if (!result.get.hardware.isEmpty) {
        hw = result.get.hardware.get
      }
      if (!result.get.software.isEmpty) {
        sw = result.get.software.get
      }
      if (!result.get.improvements.isEmpty) {
        improvements = result.get.improvements.get
      }
      if (!result.get.qa.isEmpty) {
        qa = result.get.qa.get
      }
      if (!result.get.recurring_first.isEmpty) {
        recurring_first = result.get.recurring_first.get
      }
      if (!result.get.other.isEmpty) {
        other = result.get.other.get
      }
      if (!result.get.telecommunication.isEmpty) {
        telecommunication = result.get.telecommunication.get
      }
      if (!result.get.development.isEmpty) {
        development = result.get.development.get
      }

      if (!result.isEmpty) {
        total = hw + sw + improvements + qa + recurring_first + other + telecommunication + development
      }
      total
    }
  }

  def calculateProjectSAPInvestmentAllocated(project_id: String) = {
    var sql = ""
    var total: Double = 0
    sql = "select s.* from art_project_sap_details s,  art_project_sap_master ms where ms.id=s.project_sap_id and ms.project_id='" + project_id + "' and s.expense_type=0"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectExpenseDetails.project_sap *)
      var hw: Double = 0
      var sw: Double = 0
      var improvements: Double = 0
      var qa: Double = 0
      var recurring_first: Double = 0
      var telecommunication: Double = 0
      var other: Double = 0
      var development: Double = 0

      if (result.size > 0) {
        for (r <- result) {
          if (!r.hardware.isEmpty) {
            hw = r.hardware.get
          }
          if (!r.software.isEmpty) {
            sw = r.software.get
          }
          if (!r.improvements.isEmpty) {
            improvements = r.improvements.get
          }
          if (!r.qa.isEmpty) {
            qa = r.qa.get
          }
          if (!r.recurring_first.isEmpty) {
            recurring_first = r.recurring_first.get
          }
          if (!r.other.isEmpty) {
            other = r.other.get
          }
          if (!r.telecommunication.isEmpty) {
            telecommunication = r.telecommunication.get
          }
          if (!r.development.isEmpty) {
            development = r.development.get
          }

          total = total + (hw + sw + improvements + qa + recurring_first + other + telecommunication + development)
          hw = 0
          sw = 0
          improvements = 0
          qa = 0
          recurring_first = 0
          other = 0
          telecommunication = 0
          development = 0
        }
      }

      total
    }
  }

  def calculateProjectSAPExpenditureAllocated(project_id: String) = {
    var sql = ""
    var total: Double = 0
    sql = "select s.* from art_project_sap_details s,  art_project_sap_master ms where ms.id=s.project_sap_id and ms.project_id='" + project_id + "' and s.expense_type=1"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectExpenseDetails.project_sap *)
      var hw: Double = 0
      var sw: Double = 0
      var improvements: Double = 0
      var qa: Double = 0
      var recurring_first: Double = 0
      var telecommunication: Double = 0
      var other: Double = 0
      var development: Double = 0

      if (result.size > 0) {
        for (r <- result) {
          if (!r.hardware.isEmpty) {
            hw = r.hardware.get
          }
          if (!r.software.isEmpty) {
            sw = r.software.get
          }
          if (!r.improvements.isEmpty) {
            improvements = r.improvements.get
          }
          if (!r.qa.isEmpty) {
            qa = r.qa.get
          }
          if (!r.recurring_first.isEmpty) {
            recurring_first = r.recurring_first.get
          }
          if (!r.other.isEmpty) {
            other = r.other.get
          }
          if (!r.telecommunication.isEmpty) {
            telecommunication = r.telecommunication.get
          }
          if (!r.development.isEmpty) {
            development = r.development.get
          }
          total = total + (hw + sw + improvements + qa + recurring_first + other + telecommunication + development)
          hw = 0
          sw = 0
          improvements = 0
          qa = 0
          recurring_first = 0
          other = 0
          telecommunication = 0
          development = 0
        }
      }

      total
    }
  }

  def findProjectSAPMasterDetails(sap_id: String) = {
    var sql = ""
    sql = "select * from art_project_sap_master where id='" + sap_id + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectSAPMaster.project_sap_master.singleOpt)
      result
    }
  }

  def findProjectSAPInvestment(id: String) = {
    var sql = ""
    sql = "select  * from art_project_sap_details where project_sap_id='" + id + "' and expense_type=0"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectExpenseDetails.project_sap.singleOpt)
      result
    }
  }

  def findProjectSAPExpenditure(id: String) = {
    var sql = ""
    sql = "select  * from art_project_sap_details where project_sap_id='" + id + "' and expense_type=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectExpenseDetails.project_sap.singleOpt)
      result
    }
  }

  def findProjectSAPInvestmentDetails(sap_id: String) = {
    var sql = ""
    sql = "select s.* from art_project_sap_details s,  art_project_sap_master ms where ms.is_active=1 AND ms.id=s.project_sap_id and ms.sap_id='" + sap_id + "' and s.expense_type=0"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectExpenseDetails.project_sap *)
      result
    }
  }

  def findProjectSAPExpenditureDetails(sap_id: String) = {
    var sql = ""
    sql = "select s.* from art_project_sap_details s,  art_project_sap_master ms where ms.is_active=1 AND ms.id=s.project_sap_id and ms.sap_id='" + sap_id + "' and s.expense_type=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectExpenseDetails.project_sap *)
      result
    }
  }

  def findActiveProjectSAPMasterDetails(project_id: String) = {
    var sql = ""
    sql = "select * from art_project_sap_master where project_id='" + project_id + "' and is_active=1 order by creation_date desc"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectSAPMaster.project_sap_master *)
      result

    }
  }

  def findAllProjectSAPMasterDetails(project_id: String) = {
    var sql = ""
    sql = "select * from art_project_sap_master where project_id='" + project_id + "' AND is_active=1 order by creation_date desc"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectSAPMaster.project_sap_master *)
      result

    }
  }

  def findProjectSAPListBySapId(sap_id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL("select id from art_project_sap_master where sap_id= {sap_id} AND is_active = 1").on('sap_id -> sap_id).as(scalar[Long] *)
      result
    }
  }

}
