package services

import java.text.SimpleDateFormat

import anorm.SQL
import anorm.SqlParser.scalar
import anorm.sqlToSimple
import play.api.Play.current
import play.api.db.DB
import play.i18n.Lang
import java.util.Date
import scala.util.Random
import models._
import org.apache.commons.lang3.StringUtils
import play.api.Logger
import play.Play

object RiskService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))

  def insertRisk(risk: RiskManagementMaster): Long = {

    var planned_hours: Double = 0

    DB.withConnection { implicit connection =>

      val sap_master = SQL(
        """
          insert into art_risk (parent_id,parent_type,name,cause, event, imapct,risk_category, sub_category, variable_imapact,
          probablity_of_occurence,quantification,strategic_reply,
          responsible,reply_action,configuration_plan,document_category,risk_clouser_date,user_id,creation_date,
          updation_date,risk_state,is_active
         ) values (
          {parent_id},{parent_type},{name},{cause}, {event}, {imapct},{risk_category}, {sub_category},{variable_imapact},
          {probablity_of_occurence},{quantification},{strategic_reply},
          {responsible},{reply_action},{configuration_plan},{document_category},
          {risk_clouser_date},{user_id},{creation_date},
          {updation_date},{risk_state},{is_active})
          """).on(
          'parent_id -> risk.parent_id,
          'parent_type -> risk.parent_type,
          'name -> risk.name,
          'cause -> risk.cause,
          'event -> risk.event,
          'imapct -> risk.imapct,
          'risk_category -> risk.risk_category,
          'sub_category -> risk.sub_category,
          'variable_imapact -> risk.variable_imapact,
          'probablity_of_occurence -> risk.probablity_of_occurence,
          'quantification -> risk.quantification,
          'strategic_reply -> risk.strategic_reply,
          'responsible -> risk.responsible,
          'reply_action -> risk.reply_action,
          'configuration_plan -> risk.configuration_plan,
          'document_category -> risk.document_category,
          'sub_category -> risk.sub_category,
          'risk_clouser_date -> risk.risk_clouser_date,
          'user_id -> risk.user_id,
          'creation_date -> new Date,
          'updation_date -> risk.updation_date,
          'risk_state -> risk.risk_state,
          'is_active -> 1).executeInsert(scalar[Long].singleOpt)

      var last_index = sap_master.last

      last_index
    }

  } /*  'risk_state -> risk.risk_state,*/

  /*
   */
  def updateAlertDetails(alert: RiskAlerts) = {
    DB.withConnection { implicit connection =>

      val alert_detail = SQL(
        """
          update art_risk_alert  SET 
          risk_id={risk_id},          
          event_code={event_code},
          event_date={event_date},
          event_title={event_title},
          event_details={event_details},
          responsible={responsible},
          person_invloved={person_invloved},
          criticality={criticality},
          category_id={category_id},
          impacted_variable={impacted_variable},
          reiteration={reiteration},
          status_id={status_id},
          task_id={task_id},
          change_state={change_state},
          responsible_answer={responsible_answer}
          where id={id}
          """).on(
          'id -> alert.id.get,
          'risk_id -> alert.risk_id,
          'event_code -> alert.event_code,
          'event_date -> alert.event_date,
          'event_title -> alert.event_title,
          'event_details -> alert.event_details.get.toString,
          'responsible -> alert.responsible,
          'person_invloved -> alert.person_invloved,
          'criticality -> alert.criticality,
          'category_id -> alert.category_id,
          'impacted_variable -> alert.impacted_variable,
          'reiteration -> alert.reiteration,
          'status_id -> alert.status_id,
          'task_id -> alert.task_id,
          'change_state -> alert.change_state,
          'responsible_answer -> alert.responsible_answer).executeUpdate()
    }
  }

  def updateAlertDetailsMail(alert: RiskAlerts) = {
    DB.withConnection { implicit connection =>

      var increment = alert.reiteration.get + 1
      val tmp = alert.reiteration.get + 1
      /*
      1 create
      2 reintento 1
      3 reintento 2
       */
      if (increment.toInt > 3) {
        increment = 3
      }

      val alert_detail = SQL(
        """
          update art_risk_alert  SET
          risk_id={risk_id},
          event_code={event_code},
          event_date={event_date},
          event_title={event_title},
          event_details={event_details},
          responsible={responsible},
          person_invloved={person_invloved},
          criticality={criticality},
          category_id={category_id},
          impacted_variable={impacted_variable},
          reiteration={reiteration},
          status_id={status_id},
          task_id={task_id},
          change_state={change_state},
          responsible_answer={responsible_answer}
          where id={id}
          """).on(
        'id -> alert.id.get,
        'risk_id -> alert.risk_id,
        'event_code -> alert.event_code,
        'event_date -> alert.event_date,
        'event_title -> alert.event_title,
        'event_details -> alert.event_details.get.toString,
        'responsible -> alert.responsible,
        'person_invloved -> alert.person_invloved,
        'criticality -> alert.criticality,
        'category_id -> alert.category_id,
        'impacted_variable -> alert.impacted_variable,
        'reiteration -> increment,
        'status_id -> alert.status_id,
        'task_id -> alert.task_id,
        'change_state -> alert.change_state,
        'responsible_answer -> alert.responsible_answer).executeUpdate()

      if(tmp.toInt <= 3) {
        sendEmailAlerts(alert.id.get.toString, increment)
      }
    }
  }

  def updateRiskDetails(risk: RiskManagementMaster) = {

    var planned_hours: Double = 0

    DB.withConnection { implicit connection =>
      val sap_master = SQL(
        """
          update art_risk  SET 
          name={name},
          cause={cause},
          event={event},
          imapct={imapct},
          risk_category={risk_category},
          sub_category={sub_category},
          variable_imapact={variable_imapact},
          probablity_of_occurence={probablity_of_occurence},
          quantification={quantification},
          strategic_reply={strategic_reply},
          responsible={responsible},
          reply_action={reply_action},
          configuration_plan={configuration_plan},
          document_category={document_category},
          risk_clouser_date={risk_clouser_date},
          updation_date={updation_date}
          where id={id}
          """).on(
          'id -> risk.id.get,
          'name -> risk.name,
          'cause -> risk.cause,
          'event -> risk.event,
          'imapct -> risk.imapct,
          'risk_category -> risk.risk_category,
          'sub_category -> risk.sub_category,
          'variable_imapact -> risk.variable_imapact,
          'probablity_of_occurence -> risk.probablity_of_occurence,
          'quantification -> risk.quantification,
          'strategic_reply -> risk.strategic_reply,
          'responsible -> risk.responsible,
          'reply_action -> risk.reply_action,
          'configuration_plan -> risk.configuration_plan,
          'document_category -> risk.document_category,
          'risk_clouser_date -> risk.risk_clouser_date,
          'updation_date -> risk.updation_date,
          'sub_category -> risk.sub_category).executeUpdate()
    } //          'risk_state -> risk.risk_state,

  }

  def deleteRiskDetails(id: String) = {
    DB.withConnection { implicit connection =>
      val sap_master = SQL(
        """
          update art_risk  SET 
          is_active={is_active}
          where id={id}
          """).on(
          'id -> id,
          'is_active -> 0).executeUpdate()
    }

  }

  def findRiskList(parent_id: String, parent_type: Int): Seq[RiskManagementMaster] = {
    val sqlString = "SELECT *  FROM art_risk where is_active = 1 AND parent_id=" + parent_id + " AND parent_type=" + parent_type + ""

    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskManagementMaster.riskManagementMaster *)
    }
  }

  def findRiskFromAlert(risk_id: String): Seq[RiskManagementMaster] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "SELECT * FROM art_risk WHERE parent_id IN (SELECT parent_id FROM art_risk WHERE id = {rId} AND is_active = 1) AND is_active = 1").on(
        'rId -> risk_id).as(RiskManagementMaster.riskManagementMaster *)
      result
    }
  }


  def findRiskListProgram(parent_id: String): Seq[RiskManagementMaster] = {
    var sqlString = "SELECT *  FROM art_risk where is_active = 1 AND (parent_id=" + parent_id + ""
    val proyectos = ProjectService.findProjectIdListForProgramId(parent_id)
    for (pr <- proyectos) {
      val tareas = TaskService.findAllTaskIdListByProjectId(pr.toString())
      sqlString = sqlString + " OR (parent_id=" + pr.toString() + " AND parent_type=1) "
      for (ta <- tareas) {
        sqlString = sqlString + " OR (parent_id=" + ta.toString() + " AND parent_type=2) "
      }
    }
    sqlString = sqlString + " )"

    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskManagementMaster.riskManagementMaster *)
    }
  }

  def findAllRiskList(parent_id: String, parent_type: Int): Seq[RiskManagementMaster] = {
    val sqlString = "SELECT *  FROM art_risk where parent_id=" + parent_id + " AND parent_type=" + parent_type + ""

    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskManagementMaster.riskManagementMaster *)
    }
  }
  def findRiskDetails(id: String) = {
    val sqlString = "select * from art_risk where id='" + id + "' "

    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(RiskManagementMaster.riskManagementMaster.singleOpt)
      result
    }

  }

  def findRiskDetailsByName(risk_name: String, parent_id: String, parent_type: Int) = {
    val sqlString = "select * from art_risk where CONVERT(NVARCHAR(MAX), name)='" + risk_name + "' AND parent_id='" + parent_id + "' AND parent_type='" + parent_type + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(RiskManagementMaster.riskManagementMaster.singleOpt)
      result
    }

  }

  def findIssueDetailsByName(issue_name: String, parent_id: String, parent_type: Int) = {
    val sqlString = "select * from art_issue where CONVERT(NVARCHAR(MAX), title)='" + issue_name + "' AND parent_id='" + parent_id + "' AND parent_type='" + parent_type + "'"
    //println(sqlString)
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(RiskManagementIssue.riskManagementIssue.singleOpt)
      result
    }

  }
  def getFilePath(parent_id: String, parentType: String): String = {
    var filePath: String = Play.application().configuration().getString("bdc.documents.location");
    var parentId = parent_id;
    if (parentType.equals("TASK")) {
      val task = TaskService.findTaskDetailsByTaskId(Integer.parseInt(parentId))
      val project = ProjectService.findProjectDetails(Integer.parseInt(task.get.pId.toString));
      val program = ProgramService.findProgramMasterDetailsById(project.get.program.toString);
      filePath = "/" + program.get.program_code.toString.toString() + "/" + project.get.project_id.toString() + "/" + task.get.task_code.toString() + "/";
      //println("File Path [DocumentService] -- " + filePath);
    } else if (parentType.equals("SUBTASK")) {
      var subTask = SubTaskServices.findSubTaskDetailsBySubtaskId(parentId);
      var task = TaskService.findTaskDetailsByTaskId(Integer.parseInt(subTask.get.task_id.toString));
      val project = ProjectService.findProjectDetails(Integer.parseInt(task.get.pId.toString));
      val program = ProgramService.findProgramMasterDetailsById(project.get.program.toString);
      filePath = "/" + program.get.program_code.toString + "/" + project.get.project_id.toString() + "/" + task.get.task_code.toString() + "/" + subTask.get.sub_task_id.get.toString + "/";
    }
    return filePath;
  }

  def insertRiskIssue(risk: models.RiskManagementIssueMain, user_id: Integer): Long = {

    var planned_hours: Double = 0

    DB.withConnection { implicit connection =>

      val risk_issue = SQL(
        """
          insert into art_issue (parent_id,parent_type,title,description,category,sub_category,members_involved,
          action_plan,priority,issue_date, user_id,closure_date,planned_end_date, creation_date,issue_status,updation_date,is_active
         ) values (
          {parent_id},{parent_type},{title},{description},{category},{sub_category},{members_involved},
          {action_plan},{priority},{issue_date}, {user_id},{closure_date},{planned_end_date}, {creation_date},{issue_status},{updation_date},{is_active})
          """).on(
          'parent_id -> risk.parent_id,
          'parent_type -> risk.parent_type,
          'title -> risk.title,
          'description -> risk.description,
          'category -> risk.category,
          'sub_category -> risk.sub_category,
          'members_involved -> risk.members_involved,
          'action_plan -> risk.action_plan,
          'priority -> risk.priority,
          'issue_date -> risk.riskManagementIssueDate.issue_date,
          'user_id -> user_id,
          'closure_date -> risk.riskManagementIssueDate.closure_date,
          'planned_end_date -> risk.riskManagementIssueDate.planned_end_date,
          'issue_status -> risk.issue_status,
          'creation_date -> new Date(),
          'updation_date -> new Date(),
          'is_active -> 1).executeInsert(scalar[Long].singleOpt)

      var last_index = risk_issue.last

      last_index
    }

  }

  def updateRiskIssue(risk: models.RiskManagementIssueMain) = {
    var planned_hours: Double = 0

    DB.withConnection { implicit connection =>

      val risk_issue = SQL(
        """
          update art_issue SET 
          title={title},
          description={description},
          category={category},
           sub_category={sub_category},
          members_involved={members_involved},
          priority={priority},
          action_plan={action_plan},
          issue_date={issue_date}, 
          closure_date={closure_date},
          planned_end_date={planned_end_date},
          issue_status ={issue_status},
          updation_date={updation_date}
          where id={id}
          """).on(
          'id -> risk.id.get,
          'title -> risk.title,
          'description -> risk.description,
          'category -> risk.category,
          'sub_category -> risk.sub_category,
          'members_involved -> risk.members_involved,
          'action_plan -> risk.action_plan,
          'priority -> risk.priority,
          'issue_date -> risk.riskManagementIssueDate.issue_date,
          'closure_date -> risk.riskManagementIssueDate.closure_date,
          'planned_end_date -> risk.riskManagementIssueDate.planned_end_date,
          'issue_status -> risk.issue_status,
          'updation_date -> new Date()).executeUpdate()
    }

  }

  def findIssueList(parent_id: String, parent_type: Int): Seq[RiskManagementIssue] = {
    val sqlString = "SELECT * FROM art_issue where is_active = 1 AND parent_id=" + parent_id + " AND parent_type=" + parent_type + ""
    //println(sqlString)
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskManagementIssue.riskManagementIssue *)
    }
  }

  def findIssueListNew(parent_id: String, parent_type: Int): Seq[RiskManagementIssue] = {
    val sqlString = "SELECT *  FROM art_issue where is_active = 1 AND parent_id=" + parent_id + " AND parent_type=" + parent_type + ""
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskManagementIssue.riskManagementIssue *)
    }
  }

  def findRiskIssueList(risk_id: String): Seq[RiskManagementIssue] = {
    val sqlString = "SELECT *  FROM art_issue where is_active = 1 AND risk_id=" + risk_id + ""
    //println(sqlString)
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskManagementIssue.riskManagementIssue *)
    }
  }

  def findIssueDetails(id: String) = {
    val sqlString = "select * from art_issue where id=" + id
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(RiskManagementIssue.riskManagementIssue.singleOpt)
      result
    }

  }
  def deleteIssueDetails(id: String) = {
    DB.withConnection { implicit connection =>
      val sap_master = SQL(
        """
          update art_issue  SET 
          is_active={is_active}
          where id={id}
          """).on(
          'id -> id,
          'is_active -> 0).executeUpdate()
    }

  }

  def validateRiskFunction(parent_id: String, parent_type: Integer): Boolean = {

    var isValid = true
    var progrm: Option[ProgramMaster] = null
    parent_type.intValue() match {

      case 0 =>
        progrm = ProgramService.findProgramMasterDetailsById(parent_id)
      case 1 =>
        progrm = ProjectService.findProgramDetailForProject(parent_id)
      case 2 =>
        progrm = TaskService.findProgramDetailForTask(parent_id)
      case 3 =>
        progrm = SubTaskServices.findProgramDetailForSubTask(parent_id)
    }
    if (!progrm.isEmpty) {
      val program_detail = ProgramService.findProgramDateDetailsById(progrm.get.program_id.get.toString())
      if (!program_detail.isEmpty) {
        val end_date = program_detail.get.release_date
        val start_date = program_detail.get.initiation_planned_date
        val today = new Date();
        if (today.getTime < start_date.getTime || today.getTime > end_date.getTime) {
          isValid = false
        }
      }

    }

    isValid
  }

  def findProgramByIdParent(parent_id: String, parent_type: Integer): Option[ProgramMaster] = {

    var progrm: Option[ProgramMaster] = null
    parent_type.intValue() match {

      case 0 =>
        progrm = ProgramService.findProgramMasterDetailsById(parent_id)
      case 1 =>
        progrm = ProjectService.findProgramDetailForProject(parent_id)
      case 2 =>
        progrm = TaskService.findProgramDetailForTask(parent_id)
      case 3 =>
        progrm = SubTaskServices.findProgramDetailForSubTask(parent_id)
    }

    progrm
  }

  def validateIssueFunction(parent_id: String, parent_type: Integer): Boolean = {

    var isValid = true
    var task: Option[Tasks] = null
    var subtask: Option[models.SubTasks] = null
    parent_type.intValue() match {
      case 2 =>
        task = TaskService.findTaskDetailsByTaskId(parent_id.toInt)
        if (task != null) {
          val end_date = task.get.plan_end_date
          val start_date = task.get.plan_start_date
          val today = new Date();
          if (today.getTime < start_date.getTime || today.getTime > end_date.getTime) {
            isValid = false
            isValid
          } else {
            isValid
          }
        } else {
          false
        }

      case 3 =>
        subtask = SubTaskServices.findSubTaskDetailsBySubtaskId(parent_id)
        if (subtask != null) {
          val end_date = subtask.get.plan_end_date
          val start_date = subtask.get.plan_start_date
          val today = new Date();
          if (today.getTime < start_date.getTime || today.getTime > end_date.getTime) {
            isValid = false
            isValid
          } else {
            isValid
          }
        } else {
          isValid
        }
    }
  }

  /**
   * Risk Management Project & Task Creation....
   */
  def createRiskManagementProject(parent_id: String, parent_type: Integer, risk_id: String) {

    var end_date: Date = new Date();

    var progrm: Option[ProgramMaster] = null
    parent_type.intValue() match {

      case 0 =>
        progrm = ProgramService.findProgramMasterDetailsById(parent_id)
        val program_detail = ProgramService.findProgramDateDetailsById(progrm.get.program_id.get.toString())
        if (!program_detail.isEmpty)
          end_date = program_detail.get.release_date

      case 1 =>
        progrm = ProjectService.findProgramDetailForProject(parent_id)
        val project = ProjectService.findProjectDetails(parent_id.toInt)
        if (!project.isEmpty) {
          end_date = project.get.final_release_date
        }

      case 2 =>
        progrm = TaskService.findProgramDetailForTask(parent_id)
        val task = TaskService.findTaskDetailsByTaskId(parent_id.toInt)
        if (!task.isEmpty) {
          end_date = task.get.plan_end_date
        }
      case 3 =>
        progrm = SubTaskServices.findProgramDetailForSubTask(parent_id)
        val sub_task = SubTaskServices.findSubTaskDetailsBySubtaskId(parent_id)
        if (!sub_task.isEmpty) {
          end_date = sub_task.get.plan_end_date
        }
    }

    val risk = findRiskDetails(risk_id)

    if (!progrm.isEmpty && !risk.isEmpty) {
      val risk_project = ProjectService.getRiskProjectDetails(progrm.get.program_id.get)
      risk_project match {
        case None =>
          val program_detail = ProgramService.findProgramDateDetailsById(progrm.get.program_id.get.toString())
          val res = risk.get.responsible
          val projectVlaues = Project(None, "ART" + Random.nextInt(9999), progrm.get.program_id.get, 0, "Risk Management",
            risk.get.name, risk.get.responsible, program_detail.get.initiation_planned_date, program_detail.get.release_date, Option(0), Option(0), Option(1), false, Option(0))

          val pId = ProjectService.insertProject(projectVlaues)

          /**
           * assign
           */

          var isExist = false;
          isExist = UserService.checkUserSettingbyuIdandpId(res, pId.toInt)
          if (isExist) {
            val projectmapping = UserSetting(res, pId, 1)
            UserService.saveUserSetting(projectmapping)
          }

          val taskDetails = Tasks(None, pId.toInt, risk.get.name, "SYS" + Random.nextInt(9999),
            new Date(), program_detail.get.release_date, risk.get.cause, 0,
            new Date(), 0, 1, risk.get.responsible, Option(0), Option(0),
            Option(""), Option(""), Option(1), Option(0), Option(0), Option(0), 1, 1)

          val latest_task = TaskService.insertTask(taskDetails)

        case Some(project: models.Project) =>

          val taskDetails = Tasks(None, project.pId.get, risk.get.name, "SYS" + Random.nextInt(9999),
            new Date(), end_date, risk.get.cause, 0,
            new Date(), 0, 1, risk.get.responsible, Option(0), Option(0),
            Option(""), Option(""), Option(1), Option(0), Option(0), Option(0), 1, 1)

          /**
           * asssign
           *
           */
          var isExist = false;
          isExist = UserService.checkUserSettingbyuIdandpId(risk.get.responsible, project.pId.get)
          if (isExist) {
            val projectmapping = UserSetting(risk.get.responsible, project.pId.get, 1)
            UserService.saveUserSetting(projectmapping)
          }

          val latest_task = TaskService.insertTask(taskDetails)

      }
    }
  }

  /**
   * Risk Initial Management Project & Task Creation from template ...
   */
  def createInitialRiskManagementProject(parent_id: String, risk_id: String) {

    var end_date: Date = new Date();

    var progrm: Option[ProgramMaster] = null

    progrm = ProgramService.findProgramMasterDetailsById(parent_id)
    val program_detail = ProgramService.findProgramDateDetailsById(progrm.get.program_id.get.toString())
    if (!program_detail.isEmpty)
      end_date = program_detail.get.release_date

    val risk = findRiskDetails(risk_id)

    if (!progrm.isEmpty && !risk.isEmpty) {
      val risk_project = ProjectService.getRiskProjectDetails(progrm.get.program_id.get)
      risk_project match {
        case None =>
          val program_detail = ProgramService.findProgramDateDetailsById(progrm.get.program_id.get.toString())
          val res = risk.get.responsible
          val projectVlaues = Project(None, "ART" + Random.nextInt(9999), progrm.get.program_id.get, 0, "Risk Management",
            risk.get.name, risk.get.responsible, program_detail.get.initiation_planned_date, program_detail.get.release_date, Option(0), Option(0), Option(1), false, Option(0))

          val pId = ProjectService.insertProject(projectVlaues)

          /**
           * assign
           */

          var isExist = false;
          isExist = UserService.checkUserSettingbyuIdandpId(res, pId.toInt)
          if (isExist) {
            val projectmapping = UserSetting(res, pId, 1)
            UserService.saveUserSetting(projectmapping)
          }

          val taskDetails = Tasks(None, pId.toInt, risk.get.name, "SYS" + Random.nextInt(9999),
            new Date(), program_detail.get.release_date, risk.get.cause, 0,
            new Date(), 0, 1, risk.get.responsible, Option(0), Option(0),
            Option(""), Option(""), Option(1), Option(0), Option(0), Option(0), 1, 1)

          val latest_task = TaskService.insertTask(taskDetails)

        case Some(project: models.Project) =>

          val taskDetails = Tasks(None, project.pId.get, risk.get.name, "SYS" + Random.nextInt(9999),
            new Date(), end_date, risk.get.cause, 0,
            new Date(), 0, 1, risk.get.responsible, Option(0), Option(0),
            Option(""), Option(""), Option(1), Option(0), Option(0), Option(0), 1, 1)

          /**
           * asssign
           *
           */
          var isExist = false;
          isExist = UserService.checkUserSettingbyuIdandpId(risk.get.responsible, project.pId.get)
          if (isExist) {
            val projectmapping = UserSetting(risk.get.responsible, project.pId.get, 1)
            UserService.saveUserSetting(projectmapping)
          }

          val latest_task = TaskService.insertTask(taskDetails)

      }
    }
  }

  def validateRisk(form: play.api.data.Form[RiskManagement], progrm: Option[ProgramDates]) = {
    var date1: Long = 0
    var date2: Long = 0
    var date3: Long = 0
    var date4: Long = 0
    var name = ""
    var invalid_release_date = true
    var new_form: play.api.data.Form[RiskManagement] = null

    val today = new Date();
    val format = new java.text.SimpleDateFormat("dd-MM-yyyy")
    var risk_clouser_date = ""
    if (!form("risk_clouser_date").value.isEmpty) {
      risk_clouser_date = form("risk_clouser_date").value.get
      if (!StringUtils.isEmpty(risk_clouser_date))
        date1 = format.parse(risk_clouser_date).getTime()
    }

    if (!progrm.isEmpty) {
      date2 = progrm.get.initiation_planned_date.getTime
      date3 = progrm.get.release_date.getTime
      if (date1 != 0) {
        if (date2 > date1 || date1 > date3) {
          new_form = form.withError("risk_clouser_date", "Invalid risk clouser date.")
        }
      }
    }
    /**
     * insert unique Risk name
     */

    if (!form("name").value.isEmpty) {
      name = form("name").value.get.trim()
      val riskObj = getRiskObjByProgramId(progrm.get.program_id.toString(), name)
      if (riskObj != null) {
        new_form = form.withError("name", "Risk name already exists.")
      }
    }

    if (new_form != null) {
      new_form
    } else {
      form
    }
  }
  def getRiskObjByProgramId(program_id: String, risk_name: String): RiskManagementMaster = {
    val program_risks = RiskService.findAllRiskList(program_id, 0)
    for (risk <- program_risks) {
      if (StringUtils.equalsIgnoreCase(risk_name, risk.name.trim())) {
        return risk
      }
    }
    val projects = ProjectService.findProjectListForProgram(program_id)
    for (pr <- projects) {
      val project_risks = RiskService.findAllRiskList(pr.pId.get.toString(), 1)
      for (risk <- project_risks) {
        if (StringUtils.equalsIgnoreCase(risk_name, risk.name.trim())) {
          return risk
        }
      }

      val tasks = TaskService.findTaskListByProjectId(pr.pId.get.toString())
      for (t <- tasks) {
        val task_risks = RiskService.findAllRiskList(t.tId.get.toString(), 2)
        val subTasks = SubTaskServices.findSubTasksByTask(t.tId.get.toString())
        for (risk <- task_risks) {
          if (StringUtils.equalsIgnoreCase(risk_name, risk.name.trim())) {
            return risk
          }
        }
        for (s <- subTasks) {
          val sub_task_risks = RiskService.findAllRiskList(s.sub_task_id.get.toString(), 3)
          for (risk <- sub_task_risks) {
            if (StringUtils.equalsIgnoreCase(risk_name, risk.name.trim())) {
              return risk
            }
          }
        }
      }
    }
    return null
  }

  def validateRiskForUpdate(form: play.api.data.Form[RiskManagement], progrm: Option[ProgramDates], risk_id: String, parent_id: String, parent_type: String) = {
    var date1: Long = 0
    var date2: Long = 0
    var date3: Long = 0
    var date4: Long = 0
    var name = ""
    var invalid_release_date = true
    var new_form: play.api.data.Form[RiskManagement] = null

    val today = new Date();
    val format = new java.text.SimpleDateFormat("dd-MM-yyyy")
    var risk_clouser_date = ""
    if (!form("risk_clouser_date").value.isEmpty) {
      risk_clouser_date = form("risk_clouser_date").value.get
      if (!StringUtils.isEmpty(risk_clouser_date))
        date1 = format.parse(risk_clouser_date).getTime()
    }

    if (!progrm.isEmpty) {
      date2 = progrm.get.initiation_planned_date.getTime
      date3 = progrm.get.release_date.getTime
      if (date1 != 0) {
        if (date2 > date1 || date1 > date3) {
          new_form = form.withError("risk_clouser_date", "Invalid risk clouser date.")
        }
      }
    }
    /**
     * update unique Risk name
     */
    if (!form("name").value.isEmpty) {
      name = form("name").value.get.trim()
      val riskObj = getRiskObjByProgramId(progrm.get.program_id.toString(), name)
      if (riskObj != null) {
        if (riskObj.id.get != risk_id.toLong)
          new_form = form.withError("name", "Risk name already exists.")
      }
    }

    if (new_form != null) {
      new_form
    } else {
      form
    }
  }

  def validateIssue(form: play.api.data.Form[models.RiskManagementIssueMain], start_date: Date, end_date: Date, task_id: String) = {
    var date1: Long = 0
    var date2: Long = 0
    var date3: Long = 0
    var date4: Long = 0
    var invalid_release_date = true
    var closure_date = ""
    var issue_status = ""
    var name = ""
    var new_form: play.api.data.Form[models.RiskManagementIssueMain] = null

    val today = new Date();
    val format = new java.text.SimpleDateFormat("dd-MM-yyyy")
    var risk_clouser_date = ""
    var issue_date = ""

    /**
     * insert unique Issue name
     */
    if (!form("title").value.isEmpty) {
      name = form("title").value.get.trim()
      val issueObj = getIssueObjByTaskId(task_id, name)
      if (issueObj != null) {
        new_form = form.withError("title", "Issue name already exists.")
      }
    }

    /*    if (!form("issue_date").value.isEmpty) {
      risk_clouser_date = form("issue_date").value.get
      if (!StringUtils.isEmpty(risk_clouser_date)) {
        date1 = format.parse(risk_clouser_date).getTime()
        if (start_date.getTime > date1 || date1 > end_date.getTime) {
          new_form = form.withError("issue_date", "Invalid issue date.")
        }
      }
    }*/
    if (!form("members_involved").value.isEmpty) {
      val members_involved = form("members_involved").value.get
      if (members_involved.isEmpty()) {
        new_form = form.withError("members_involved", "Por favor, seleccione al menos un miembro.")
      }
    }

    if (!form("planned_end_date").value.isEmpty) {
      issue_date = form("planned_end_date").value.get
      if (!StringUtils.isEmpty(issue_date)) {
        date2 = format.parse(issue_date).getTime()
        if (start_date.getTime > date2 || date2 > end_date.getTime) {
          new_form = form.withError("planned_end_date", "Invalid planned end date.")
        }
      }
    }

    if (!form("issue_status").value.isEmpty) {
      issue_status = form("issue_status").value.get.toString().trim()
      if (!StringUtils.isEmpty(issue_status)) {
        if ("1".equals(issue_status)) {
          if (!form("closure_date").value.isEmpty) {
            closure_date = form("closure_date").value.get
            if (!StringUtils.isEmpty(closure_date)) {
              date2 = format.parse(closure_date).getTime()
              if (date2 > System.currentTimeMillis()) {
                new_form = form.withError("closure_date", "Invalid closure date for issue status.")
              }
            }
          }
        }
      }
    }

    if (!form("closure_date").value.isEmpty) {
      closure_date = form("closure_date").value.get
      if (!StringUtils.isEmpty(closure_date)) {
        if (!form("issue_date").value.isEmpty) {
          issue_date = form("issue_date").value.get
          if (!StringUtils.isEmpty(issue_date)) {
            date1 = format.parse(issue_date).getTime()
            date2 = format.parse(closure_date).getTime()
            if (date1 > date2) {
              new_form = form.withError("closure_date", "Closure date should not greater than issue date.")
            }
          }
        }
      }
    }

    /*    if (!form("closure_date").value.isEmpty) {
      closure_date = form("closure_date").value.get
      if (!StringUtils.isEmpty(closure_date)) {
        date2 = format.parse(closure_date).getTime()
        if (start_date.getTime > date2 || date2 > end_date.getTime) {
          new_form = form.withError("closure_date", "Invalid closure date.")
        }
      }
    }*/

    if (new_form != null) {
      new_form
    } else {
      form
    }
  }

  def getIssueObjByTaskId(task_id: String, issue_name: String): RiskManagementIssue = {
    val task_issues = RiskService.findIssueList(task_id, 2)
    for (issue <- task_issues) {
      if (StringUtils.equalsIgnoreCase(issue_name, issue.title.trim())) {
        return issue
      }
    }
    val subTasks = SubTaskServices.findSubTasksByTask(task_id)
    for (s <- subTasks) {
      val sub_task_issues = RiskService.findIssueList(s.sub_task_id.get.toString(), 3)
      for (issue <- sub_task_issues) {
        if (StringUtils.equalsIgnoreCase(issue_name, issue.title.trim())) {
          return issue
        }
      }
    }
    return null;
  }
  def validateIssueUpdate(form: play.api.data.Form[RiskManagementIssueMain], start_date: Date, end_date: Date, issue_id: String, task_id: String) = {
    var date1: Long = 0
    var date2: Long = 0
    var date3: Long = 0
    var date4: Long = 0
    var invalid_release_date = true
    var closure_date = ""
    var issue_status = ""
    var name = ""
    var new_form: play.api.data.Form[RiskManagementIssueMain] = null

    val today = new Date();
    val format = new java.text.SimpleDateFormat("dd-MM-yyyy")
    var risk_clouser_date = ""
    var issue_date = ""

    /**
     * insert unique Issue name
     */

    if (!form("title").value.isEmpty) {
      name = form("title").value.get.trim()
      val issueObj = getIssueObjByTaskId(task_id, name)
      if (issueObj != null) {
        val parent_id = form("parent_id").value.get.trim()
        val parent_type = form("parent_type").value.get.trim()
        val issueObj = getIssueObjByTaskId(task_id, name)
        if (issue_id.toLong != issueObj.id.get) {
          new_form = form.withError("title", "Issue name already exists.")
        }
      }
    }
    if (!form("members_involved").value.isEmpty) {
      val members_involved = form("members_involved").value.get
      if (members_involved.isEmpty()) {
        new_form = form.withError("members_involved", "Por favor, seleccione al menos un miembro.")
      }
    }

    /*    if (!form("issue_date").value.isEmpty) {
      risk_clouser_date = form("issue_date").value.get
      if (!StringUtils.isEmpty(risk_clouser_date)) {
        date1 = format.parse(risk_clouser_date).getTime()
        if (start_date.getTime > date1 || date1 > end_date.getTime) {
          new_form = form.withError("issue_date", "Invalid issue date.")
        }
      }
    }
*/
    if (!form("planned_end_date").value.isEmpty) {
      issue_date = form("planned_end_date").value.get
      if (!StringUtils.isEmpty(issue_date)) {
        date2 = format.parse(issue_date).getTime()
        if (start_date.getTime > date2 || date2 > end_date.getTime) {
          new_form = form.withError("planned_end_date", "Invalid planned end date.")
        }
      }
    }

    if (!form("issue_status").value.isEmpty) {
      issue_status = form("issue_status").value.get.toString().trim()
      if (!StringUtils.isEmpty(issue_status)) {
        if ("1".equals(issue_status)) {
          if (!form("closure_date").value.isEmpty) {
            closure_date = form("closure_date").value.get
            if (!StringUtils.isEmpty(closure_date)) {
              date2 = format.parse(closure_date).getTime()
              if (date2 > System.currentTimeMillis()) {
                new_form = form.withError("closure_date", "Invalid closure date for issue status.")
              }
            }
          }

        }
      }
    }

    if (!form("closure_date").value.isEmpty) {
      closure_date = form("closure_date").value.get
      if (!StringUtils.isEmpty(closure_date)) {
        if (!form("issue_date").value.isEmpty) {
          issue_date = form("issue_date").value.get
          if (!StringUtils.isEmpty(issue_date)) {
            date1 = format.parse(issue_date).getTime()
            date2 = format.parse(closure_date).getTime()
            if (date1 > date2) {
              new_form = form.withError("closure_date", "Closure date should not less than issue date.")
            }
          }
        }
      }
    }

    /*    if (!form("closure_date").value.isEmpty) {
      closure_date = form("closure_date").value.get
      println("*  " + closure_date)

      if (!StringUtils.isEmpty(closure_date)) {
        date2 = format.parse(closure_date).getTime()

        println("**  " + start_date)
        println("***  " + end_date)

        if (start_date.getTime > date2 || date2 > end_date.getTime) {
          new_form = form.withError("closure_date", "Invalid closure date.")
        }
      }
    }*/

    if (new_form != null) {
      new_form
    } else {
      form
    }
  }

  def validateAlert(form: play.api.data.Form[RiskAlerts]) = {
    var new_form: play.api.data.Form[RiskAlerts] = null

    if (form("event_title").value.isEmpty) {
      new_form = form.withError("event_title", "Por favor, ingrese un nombre para la alerta.")
    }

    if (new_form != null) {
      new_form
    } else {
      form
    }
  }

  def getRiskManagementTasksForProgramId(program_id: String) = {
    val sqlString = "SELECT * from art_task where  is_active = 1 AND pId =(SELECT pId  FROM art_project_master where is_active = 1 AND program=" + program_id + " AND project_name = 'Risk Management')"
    //println(sqlString)
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Tasks.tasks *)
    }
  }

  def insertAlertSend(id_alert: Int,id_template: Int): Long = {

    val sqlString =
      """
        |insert art_risk_alert_send
        |(id_alert,id_template,send_time) values
        |({id_alert},{id_template},GETDATE())
      """.stripMargin

    DB.withConnection { implicit connection =>
      val lastsaved = SQL(sqlString).
        on('id_alert->id_alert,'id_template->id_template).executeInsert(scalar[Long].singleOpt)
      lastsaved.last
    }
  }

  def insertRiskAlert(risk: models.RiskAlerts): Long = {
    DB.withConnection { implicit connection =>

      val risk_issue = SQL(
        """
          insert into art_risk_alert (risk_id,event_code,event_date,event_title,event_details,
          responsible,person_invloved, criticality,is_active,
          category_id,impacted_variable,reiteration,status_id,task_id,change_state,responsible_answer
         ) values (
         {risk_id},{event_code},{event_date},{event_title},{event_details},
          {responsible},{person_invloved},{criticality},{is_active},
          {category_id},{impacted_variable},{reiteration},{status_id},{task_id},{change_state},{responsible_answer})
          """).on(
        'risk_id -> risk.risk_id,
        'event_code -> risk.event_code,
        'event_date -> risk.event_date,
        'event_title -> risk.event_title,
        'event_details -> risk.event_details,
        'responsible -> risk.responsible,
        'person_invloved -> risk.person_invloved,
        'criticality -> risk.criticality,
        'is_active -> 1,
        'category_id -> risk.category_id,
        'impacted_variable -> risk.impacted_variable,
        'reiteration -> risk.reiteration,
        'status_id -> risk.status_id,
        'task_id -> risk.task_id,
        'change_state -> risk.change_state,
        'responsible_answer -> risk.responsible_answer).executeInsert(scalar[Long].singleOpt)

      val last_index = risk_issue.last
      Logger.debug("EL VALOR DEVUELTO ES " + last_index)
      Logger.debug("EL VALOR DEL TEMPLATE ES " + risk.template_id.get)
      RiskService.insertAlertSend(last_index.toInt, risk.template_id.get)

      val state_ret=sendEmailAlerts(last_index.toString,risk.reiteration.get)
      state_ret match {
        case "OK" =>
          Logger.debug("Send Email OK")
        case _   => Logger.debug(state_ret)
      }


      last_index
    }

  }


  def findRiskIds(parent_id: String, parent_type: Integer) = {
    var sqlString = ""
    sqlString = "SELECT id from art_risk where parent_id=" + parent_id + " AND parent_type=" + parent_type + " AND is_active=1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(scalar[Int] *)
    }
  }

  def updateRiskAlertStatus(risk_alert_id: String): Long = {
    DB.withConnection { implicit connection =>
      val risk_issue = SQL(""" update  art_risk_alert set is_active = 0 where id =""" + risk_alert_id).executeUpdate
      risk_issue
    }
  }

  def findAllActiveAlerts(): Seq[RiskAlerts] = {
    val sqlString = "SELECT * FROM art_risk_alert where is_active=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(RiskAlerts.alerts *)
      result
    }
  }

  def findAllOpenAlerts(employeeid:Int): Seq[RiskAlerts] = {
    val sqlString =
      """
        |SELECT a.id
        |,a.risk_id
        |,a.event_code
        |,a.event_date
        |,a.event_title
        |,a.event_details
        |,a.responsible
        |,a.person_invloved
        |,a.criticality
        |,a.is_active
        |,a.category_id
        |,a.impacted_variable
        |,a.reiteration
        |,a.status_id
        |,a.task_id
        |,a.change_state
        |,a.responsible_answer
        |,null template_id
        |FROM art_risk_alert a JOIN art_risk_alert_status b
        | ON a.status_id = b.id
        | WHERE a.is_active=1 AND b.is_active = 1
        | AND b.description != 'Cerrada'
      """.stripMargin

    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskAlerts.alerts *)
    }
  }

  def findAllFirstExpiredAlerts(): Seq[RiskAlerts] = {
    val sqlString =
      """
        SELECT a.* FROM art_risk_alert a JOIN art_risk_alert_status b ON a.status_id = b.id
        WHERE dbo.BusinessDays(a.event_date, CAST(a.change_state AS DATE)) > 2
        AND b.description = 'Vigente' AND a.reiteration = 1
      """
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(RiskAlerts.alerts *)
      result
    }
  }

  def findAllSecondExpiredAlerts(): Seq[RiskAlerts] = {
    val sqlString =
      """
        SELECT a.* FROM art_risk_alert a JOIN art_risk_alert_status b ON a.status_id = b.id
        WHERE dbo.BusinessDays(a.event_date, CAST(a.change_state AS DATE)) > 8
        AND b.description = 'Vencida' AND a.reiteration = 2
      """
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(RiskAlerts.alerts *)
      result
    }
  }

  def findAllActiveAlertsByRiskId(id: String): Seq[RiskAlerts] = {
    val sqlString =
      """
        |SELECT id
        |      ,risk_id
        |      ,event_code
        |      ,event_date
        |      ,event_title
        |      ,event_details
        |      ,responsible
        |      ,person_invloved
        |      ,criticality
        |      ,is_active
        |      ,category_id
        |      ,impacted_variable
        |      ,reiteration
        |      ,status_id
        |      ,task_id
        |      ,change_state
        |      ,responsible_answer
        |	  ,null template_id
        |  FROM art_risk_alert
        |  WHERE risk_id = {id}
      """.stripMargin
    //val sqlString = "SELECT * FROM art_risk_alert where is_active=1 AND risk_id = " + id
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).on('id->id.toInt).as(RiskAlerts.alerts *)
      result
    }
  }

  def findAllResponsibleIds(id: String): Seq[RiskAlerts] = {
    val sqlString =
      """
        |SELECT * ,null template_id
        |  FROM art_risk_alert
        |  WHERE responsible = {id}
      """.stripMargin

    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).on('id->id.toInt).as(RiskAlerts.alerts *)
      result
    }
  }

  def countCurrentAlerts(alert_id: String): Long = {
    DB.withConnection { implicit connection =>
      val count: Long = SQL("""
         SELECT count(*) cant FROM art_risk_alert a JOIN art_risk_alert_status b ON a.status_id = b.id
         WHERE b.description = 'Vigente' AND a.is_active = 1 AND b.is_active = 1 AND a.risk_id = (SELECT risk_id FROM art_risk_alert WHERE id = {alert_id})
        """)
        .on(
          'alert_id -> alert_id).as(scalar[Long].single)

      count;
    }
  }

  def riskCategory(id: String): String = {
    DB.withConnection { implicit connection =>
     SQL("""
           SELECT b.category_name FROM art_risk a JOIN art_risk_category b ON a.risk_category = b.id
           WHERE a.id = (SELECT risk_id FROM art_risk_alert WHERE id = {id})
        """)
        .on(
          'id -> id).as(scalar[String].single)
    }
  }

  def riskState(id: String): String = {
    DB.withConnection { implicit connection =>
      SQL("""
            SELECT b.state_name FROM art_risk a JOIN art_risk_state b ON a.risk_state = b.id
            WHERE a.id = (SELECT risk_id FROM art_risk_alert WHERE id = {id})
        """)
        .on(
          'id -> id).as(scalar[String].single)
    }
  }
/**/
  def riskImapct(id: String): String = {
    DB.withConnection { implicit connection =>
      SQL("""
            SELECT a.imapct FROM art_risk a WHERE a.id = (SELECT risk_id FROM art_risk_alert WHERE id = {id})
        """)
        .on(
          'id -> id).as(scalar[String].single)
    }
  }

  def countRisk(parent_id: String, probablity: Int, impact: Int): Long = {
    DB.withConnection { implicit connection =>
      val count1: Long = SQL("""
              SELECT count(*) FROM art_risk 
              WHERE 
              probablity_of_occurence = {probablity} 
              AND quantification = {impact} 
              AND is_active = 1 
              AND parent_id = {parent_id} 
        """)
        .on(
          'parent_id -> parent_id.toInt,
          'probablity -> probablity,
          'impact -> impact).as(scalar[Long].single)

      val count2: Long = SQL("""
              SELECT count(*) FROM art_risk 
              WHERE 
              probablity_of_occurence = {probablity} 
              AND quantification = {impact} 
              AND is_active = 1 
              AND parent_id in (SELECT pId FROM art_project_master WHERE program = {parent_id} AND is_active = 1)
        """)
        .on(
          'parent_id -> parent_id.toInt,
          'probablity -> probablity,
          'impact -> impact).as(scalar[Long].single)

      val count3: Long = SQL("""
            SELECT count(*) FROM art_risk 
            WHERE 
            probablity_of_occurence = {probablity} 
            AND quantification = {impact} 
            AND is_active = 1 
            AND parent_id in (SELECT tId FROM art_task WHERE is_active = 1 AND pId in (SELECT pId FROM art_project_master WHERE program = {parent_id} AND is_active = 1))
        """)
        .on(
          'parent_id -> parent_id.toInt,
          'probablity -> probablity,
          'impact -> impact).as(scalar[Long].single)

      count1 + count2 + count3;
    }
  }

  def countRiskForShow(parent_id: String): Long = {
    DB.withConnection { implicit connection =>
      val count1: Long = SQL("""
              SELECT count(*) FROM art_risk 
              WHERE is_active = 1 
              AND parent_id = {parent_id} 
        """)
        .on(
          'parent_id -> parent_id.toInt).as(scalar[Long].single)

      val count2: Long = SQL("""
              SELECT count(*) FROM art_risk 
              WHERE is_active = 1 
              AND parent_id in (SELECT pId FROM art_project_master WHERE program = {parent_id} AND is_active = 1)
        """)
        .on(
          'parent_id -> parent_id.toInt).as(scalar[Long].single)

      val count3: Long = SQL("""
            SELECT count(*) FROM art_risk 
            WHERE is_active = 1 
            AND parent_id in (SELECT tId FROM art_task WHERE is_active = 1 AND pId in (SELECT pId FROM art_project_master WHERE program = {parent_id} AND is_active = 1))
        """)
        .on(
          'parent_id -> parent_id.toInt).as(scalar[Long].single)

      count1 + count2 + count3;
    }
  }

  def countAlertForRisk(risk_id: String): Long = {
    DB.withConnection { implicit connection =>
      val count: Long = SQL("""
              SELECT count(*) FROM art_risk_alert WHERE risk_id = {risk_id} AND is_active = 1
        """)
        .on(
          'risk_id -> risk_id.toInt).as(scalar[Long].single)
      count;
    }
  }

  def findRiskAlertsById(id: String): Option[RiskAlerts] = {
    if (!StringUtils.isEmpty(id)) {
      val sqlString =
        """
          |SELECT id
          |      ,risk_id
          |      ,event_code
          |      ,event_date
          |      ,event_title
          |      ,event_details
          |      ,responsible
          |      ,person_invloved
          |      ,criticality
          |      ,is_active
          |      ,category_id
          |      ,impacted_variable
          |      ,reiteration
          |      ,status_id
          |      ,task_id
          |      ,change_state
          |      ,responsible_answer
          |	  ,null template_id
          |  FROM art_risk_alert
          |  WHERE id = {id}
        """.stripMargin
      //val sqlString = "SELECT * FROM art_risk_alert where is_active=1 AND id=" + id

      DB.withConnection { implicit connection =>
        val result = SQL(sqlString).on('id->id).as(RiskAlerts.alerts.singleOpt)
        result
      }
    } else {
      val result: Option[RiskAlerts] = null
      result
    }

  }

  def findAlertsForRisk(risk_id: String, alert_id: String): Option[RiskAlerts] = {

    //val sqlString = "SELECT * FROM art_risk_alert where is_active=1 AND id=" + alert_id + " AND risk_id =" + risk_id
    val sqlString = """
      |SELECT id
      |      ,risk_id
      |      ,event_code
      |      ,event_date
      |      ,event_title
      |      ,event_details
      |      ,responsible
      |      ,person_invloved
      |      ,criticality
      |      ,is_active
      |      ,category_id
      |      ,impacted_variable
      |      ,reiteration
      |      ,status_id
      |      ,task_id
      |      ,change_state
      |      ,responsible_answer
      |	  ,null template_id
      |  FROM art_risk_alert
      |  WHERE id = {alert_id}
      |  AND risk_id = {risk_id}
    """.stripMargin
    //println(sqlString)

    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).on('alert_id->alert_id.toInt,'risk_id->risk_id.toInt).as(RiskAlerts.alerts.singleOpt)
      result
    }

  }

  def findDescriptionStatusAlert(status_id: String): Option[String] = {
    DB.withConnection { implicit connection =>
      SQL("SELECT description FROM art_risk_alert_status WHERE id={id}").on(
        'id -> status_id).as(scalar[Option[String]].single)
    }
  }

  def findDescriptionCategoryAlert(category_id: String): Option[String] = {
    DB.withConnection { implicit connection =>
      SQL("SELECT description FROM art_risk_alert_category WHERE is_active = 1 AND id={id}").on(
        'id -> category_id).as(scalar[Option[String]].single)
    }
  }

  def findReportAlerts(alert_criticality_id: Int, alert_status_id: Int, alert_event_code_id: Int, alert_category_id: Int): Seq[AlertReportFull] = {
    var sql :String = ""
    val sqlString =
      """
        SELECT * FROM
        (
                SELECT
                CASE b.parent_type
                WHEN 0 THEN (
                				SELECT w.program_code program_code FROM art_program w
                				WHERE w.program_id = b.parent_id
                				AND w.is_active = 1
                			)
                WHEN 1 THEN (
                				SELECT w.program_code program_code FROM art_program w
                				JOIN art_project_master x ON w.program_id = x.program
                				WHERE x.pId = b.parent_id
                				AND w.is_active = 1
                				AND x.is_active = 1
                			)
                WHEN 2 THEN (
                				SELECT w.program_code program_code FROM art_program w
                				JOIN art_project_master x ON w.program_id = x.program
                				JOIN art_task y ON x.pId = y.pId
                				WHERE y.tId = b.parent_id
                				AND w.is_active = 1
                				AND x.is_active = 1
                				AND y.is_active = 1
                			)
                WHEN 3 THEN (
                				SELECT w.program_code program_code FROM art_program w
                				JOIN art_project_master x ON w.program_id = x.program
                				JOIN art_task y ON x.pId = y.pId
                				JOIN art_sub_task z ON y.tId = z.task_id
                				WHERE z.sub_task_id = b.parent_id
                				AND w.is_active = 1
                				AND x.is_active = 1
                				AND y.is_active = 1
                				AND z.is_deleted = 1
                			)
                END program_program_code,
                a.id alert_id,
                CASE b.parent_type
                WHEN 0 THEN (
                				SELECT k.workflow_status workflow_status FROM art_program w
                				JOIN art_program_workflow_status k ON w.work_flow_status = k.id
                				WHERE w.program_id = b.parent_id
                				AND w.is_active = 1
                			)
                WHEN 1 THEN (
                				SELECT k.workflow_status workflow_status FROM art_program w
                				JOIN art_program_workflow_status k ON w.work_flow_status = k.id
                				JOIN art_project_master x ON w.program_id = x.program
                				WHERE x.pId = b.parent_id
                				AND w.is_active = 1
                				AND x.is_active = 1
                			)
                WHEN 2 THEN (
                				SELECT k.workflow_status workflow_status FROM art_program w
                				JOIN art_program_workflow_status k ON w.work_flow_status = k.id
                				JOIN art_project_master x ON w.program_id = x.program
                				JOIN art_task y ON x.pId = y.pId
                				WHERE y.tId = b.parent_id
                				AND w.is_active = 1
                				AND x.is_active = 1
                				AND y.is_active = 1
                			)
                WHEN 3 THEN (
                				SELECT k.workflow_status workflow_status FROM art_program w
                				JOIN art_program_workflow_status k ON w.work_flow_status = k.id
                				JOIN art_project_master x ON w.program_id = x.program
                				JOIN art_task y ON x.pId = y.pId
                				JOIN art_sub_task z ON y.tId = z.task_id
                				WHERE z.sub_task_id = b.parent_id
                				AND w.is_active = 1
                				AND x.is_active = 1
                				AND y.is_active = 1
                				AND z.is_deleted = 1
                			)
                END program_workflow_status,
                CASE b.parent_type
                WHEN 0 THEN (
                				SELECT w.program_name program_name FROM art_program w
                				WHERE w.program_id = b.parent_id
                				AND w.is_active = 1
                			)
                WHEN 1 THEN (
                				SELECT w.program_name program_name FROM art_program w
                				JOIN art_project_master x ON w.program_id = x.program
                				WHERE x.pId = b.parent_id
                				AND w.is_active = 1
                				AND x.is_active = 1
                			)
                WHEN 2 THEN (
                				SELECT w.program_name program_name FROM art_program w
                				JOIN art_project_master x ON w.program_id = x.program
                				JOIN art_task y ON x.pId = y.pId
                				WHERE y.tId = b.parent_id
                				AND w.is_active = 1
                				AND x.is_active = 1
                				AND y.is_active = 1
                			)
                WHEN 3 THEN (
                				SELECT w.program_name program_name FROM art_program w
                				JOIN art_project_master x ON w.program_id = x.program
                				JOIN art_task y ON x.pId = y.pId
                				JOIN art_sub_task z ON y.tId = z.task_id
                				WHERE z.sub_task_id = b.parent_id
                				AND w.is_active = 1
                				AND x.is_active = 1
                				AND y.is_active = 1
                				AND z.is_deleted = 1
                			)
                END program_program_name,
                ISNULL(a.impacted_variable,'') alert_impacted_variable,
                p.category_name risk_category,
                q.description risk_sub_category,
                c.description alert_category,
                CASE a.criticality
                WHEN 1 THEN 'Alto'
                WHEN 2 THEN 'Medio'
                WHEN 3 THEN 'Bajo'
                END alert_criticality,
                CASE b.parent_type
                WHEN 0 THEN (
                				SELECT u.first_name + ' '  + u.last_name program_manager FROM art_program w
                				JOIN art_user u ON w.program_manager = u.uid
                				WHERE w.program_id = b.parent_id
                				AND w.is_active = 1
                			)
                WHEN 1 THEN (
                				SELECT u.first_name + ' '  + u.last_name program_manager FROM art_program w
                				JOIN art_user u ON w.program_manager = u.uid
                				JOIN art_project_master x ON w.program_id = x.program
                				WHERE x.pId = b.parent_id
                				AND w.is_active = 1
                				AND x.is_active = 1
                			)
                WHEN 2 THEN (
                				SELECT u.first_name + ' '  + u.last_name program_manager FROM art_program w
                				JOIN art_user u ON w.program_manager = u.uid
                				JOIN art_project_master x ON w.program_id = x.program
                				JOIN art_task y ON x.pId = y.pId
                				WHERE y.tId = b.parent_id
                				AND w.is_active = 1
                				AND x.is_active = 1
                				AND y.is_active = 1
                			)
                WHEN 3 THEN (
                				SELECT u.first_name + ' '  + u.last_name program_manager FROM art_program w
                				JOIN art_user u ON w.program_manager = u.uid
                				JOIN art_project_master x ON w.program_id = x.program
                				JOIN art_task y ON x.pId = y.pId
                				JOIN art_sub_task z ON y.tId = z.task_id
                				WHERE z.sub_task_id = b.parent_id
                				AND w.is_active = 1
                				AND x.is_active = 1
                				AND y.is_active = 1
                				AND z.is_deleted = 1
                			)
                END program_program_manager,
                r.first_name + ' ' + r.last_name alert_responsible,
                a.event_title alert_event_title,
                s.description alert_status,
                a.reiteration alert_reiteration,
                ISNULL(a.responsible_answer,'') alert_responsible_answer,
                b.name risk_name,
                a.criticality alert_criticality_id,
                a.status_id alert_status_id,
                a.event_code alert_event_code_id,
                a.category_id alert_category_id,
        				FORMAT(a.event_date, 'yyyy-MM-dd') event_date,
      	  			ISNULL(FORMAT(a.change_state, 'yyyy-MM-dd'),'') change_state,
                dbo.BusinessDays(a.event_date,CAST(a.change_state AS DATE)) diff_in_days
                FROM art_risk_alert a
                JOIN art_risk b ON a.risk_id = b.id
                JOIN art_risk_alert_category c ON c.id = a.category_id
                JOIN art_risk_category p ON b.risk_category = p.id
                JOIN art_risk_sub_category q ON b.sub_category = q.id
                JOIN art_user r ON a.responsible = r.uid
                JOIN art_risk_alert_status s ON s.id = a.status_id
                WHERE
                a.is_active = 1
                AND b.is_active = 1
                AND c.is_active = 1
                AND p.is_deleted = 0
                AND q.is_deleted = 0
        ) K
        WHERE K.program_program_code IS NOT NULL
        ${sql}
        ORDER BY K.alert_id
      """

    if(alert_criticality_id > 0) {
      sql = " AND K.alert_criticality_id = " + alert_criticality_id
    }

    if(alert_status_id > 0) {
      sql = sql + " AND K.alert_status_id = " + alert_status_id
    }

    if(alert_event_code_id > 0) {
      sql = sql + " AND K.alert_event_code_id = " + alert_event_code_id
    }

    if(alert_category_id > 0) {
      sql = sql + " AND K.alert_category_id = " + alert_category_id
    }

    val qrysql = sqlString.replaceAllLiterally("${sql}",sql)
    //println(qrysql)

    DB.withConnection { implicit connection =>
      SQL(qrysql).as(AlertReportFull.alertFull *)

    }

  }



  def findRiskAlertsIncreasedById(id: String): Option[RiskAlertsIncreased] = {

    if (!StringUtils.isEmpty(id)) {
      /*
      var sqlString = "EXEC art.risk_alert_details {id}"

      DB.withConnection { implicit connection =>
        SQL(sqlString).on('id -> id.toInt).executeQuery() as (RiskAlertsIncreased.alertsIncreased.singleOpt)
      }
      */
      val sqlString = """
                        	SELECT
                            X.id,
                              X.risk_id,
                              Z.pmo,
                              X.event_code,
                              X.event_date,
                              X.event_title,
                              X.impacted_variable,
                              X.responsible,
                              X.person_invloved,
                              X.criticality,
                              X.is_active,
                        	Y.level,
                        	Y.title,
                        	Y.program_name FROM art_risk_alert X
                        	JOIN
                        	(SELECT
                        	id,
                        	CASE
                        		WHEN a.parent_type = 0 THEN 'Programa'
                        		WHEN a.parent_type = 1 THEN 'Proyecto'
                        		WHEN a.parent_type = 2 THEN 'Tarea'
                        		WHEN a.parent_type = 3 THEN 'Sub-Tarea'
                        	END level,
                        	CASE
                        		WHEN a.parent_type = 0 THEN (SELECT b.program_name FROM art_program b WHERE b.program_id=a.parent_id)
                        		WHEN a.parent_type = 1 THEN (SELECT c.project_name FROM art_project_master c WHERE c.pId=a.parent_id)
                        		WHEN a.parent_type = 2 THEN (SELECT d.task_title FROM art_task d WHERE d.tId=a.parent_id)
                        		WHEN a.parent_type = 3 THEN (SELECT e.title FROM art_sub_task e WHERE e.sub_task_id=a.parent_id)
                        	END title,
                        	CASE
                        		WHEN a.parent_type = 0 THEN (SELECT program_name FROM art_program WHERE program_id=a.parent_id)
                        		WHEN a.parent_type = 1 THEN (SELECT program_name FROM art_program WHERE program_id=(SELECT program FROM art_project_master WHERE pId=a.parent_id))
                        		WHEN a.parent_type = 2 THEN (SELECT program_name FROM art_program WHERE program_id=(SELECT program FROM art_project_master WHERE pId=(SELECT pId FROM art_task WHERE tId=a.parent_id)))
                        		WHEN a.parent_type = 3 THEN (SELECT program_name FROM art_program WHERE program_id=(SELECT program FROM art_project_master WHERE pId=(SELECT pId FROM art_task WHERE tId=(SELECT task_id FROM art_sub_task WHERE sub_task_id=a.parent_id))))
                        	END program_name
                        	  FROM art_risk a) Y
                        	ON X.risk_id=Y.id
                          JOIN
                          (SELECT uid, u.first_name + ' '+ u.last_name pmo FROM art_user u) Z
                          ON X.responsible = Z.uid
                        	WHERE
                        	X.is_active=1 AND
                        	X.id={id}
              """
      DB.withConnection { implicit connection =>
        val result = SQL(sqlString).on(
          'id -> id.toInt).as(RiskAlertsIncreased.alertsIncreased.singleOpt)
        result
      }

    } else {
      val result: Option[RiskAlertsIncreased] = null
      result
    }

  }

  def findRiskAlertsExtendedById(id: String): Seq[RiskAlertsExtended] =  {

    val sql = """ SELECT a.*,b.description category, c.description status
                 FROM art_risk_alert a
                 JOIN art_risk_alert_category b
                 ON a.category_id = b.id
                 JOIN art_risk_alert_status c
                 ON a.status_id = c.id
                 WHERE
                 a.is_active = 1
                 AND b.is_active = 1
                 AND c.is_active = 1
                 AND risk_id ={id}
              """
    DB.withConnection { implicit connection =>
      val result = SQL(sql).on(
        'id -> id.toInt).as(RiskAlertsExtended.alerts *)
      result
    }
  }

  def findRiskAlertsUserIds() = {
    var sqlString = ""
    sqlString = "SELECT person_invloved FROM art_risk_alert where is_active=1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(scalar[String] *)
    }
  }

  def findTmplMail(id_alert: String) : String = {


    val id_template=DB.withConnection { implicit connection =>
      SQL("select id_template from art_risk_alert_send where id_alert={id_alert}").on('id_alert->id_alert.toInt).as(scalar[Int].single)
    }

    val sqlString = "SELECT tpl FROM art_risk_alert_conf WHERE is_active = 1 AND id={id_template}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id_template->id_template).as(scalar[String].single)
    }
  }

  def findTmplId(id_alert: String) : Int = {

    DB.withConnection { implicit connection =>
      SQL("select id_template from art_risk_alert_send where id_alert={id_alert}").on('id_alert->id_alert.toInt).as(scalar[Int].single)
    }
  }

  def findBigBossMail(emailEmployee: String) : Option[String] = {
    val sqlString = """
                      ;WITH tblBoss AS
                      (
                          SELECT emailJefe,emailTrab
                              FROM RecursosHumanos WHERE emailTrab = {emailEmployee} AND periodo = (SELECT MAX(periodo) FROM RecursosHumanos)
                          UNION ALL
                          SELECT RecursosHumanos.emailJefe,RecursosHumanos.emailTrab
                              FROM RecursosHumanos  JOIN tblBoss  ON RecursosHumanos.emailTrab = tblBoss.emailJefe
                      )
                      SELECT STUFF((
                              SELECT top 2 ','+ emailTrab
                              FROM tblBoss WHERE  emailTrab <> {emailEmployee}
                              FOR XML PATH('')
                              )
                              ,1,1,'') AS emailTrab
                      OPTION(MAXRECURSION 32767)
      """

    DB.withConnection { implicit connection =>

      SQL(sqlString).on(
        'emailEmployee -> emailEmployee).as(scalar[Option[String]].single)

      /*
      val rowOption = SQL(sqlString)
        .on('emailEmployee -> emailEmployee)
        .apply
        .headOption
      rowOption match {
        case Some(row) => Some(row[String]("emailTrab"))
        case None => None
      }
      */
    }
  }


  def findBossMail(emailEmployee: String) : Option[String] = {
    val sqlString = """
                      ;WITH tblBoss AS
                      (
                          SELECT emailJefe,emailTrab
                              FROM RecursosHumanos WHERE emailTrab = {emailEmployee} AND periodo = (SELECT MAX(periodo) FROM RecursosHumanos)
                          UNION ALL
                          SELECT RecursosHumanos.emailJefe,RecursosHumanos.emailTrab
                              FROM RecursosHumanos  JOIN tblBoss  ON RecursosHumanos.emailTrab = tblBoss.emailJefe
                      )
                      SELECT top 1 emailTrab FROM  tblBoss
                          WHERE emailTrab <> {emailEmployee}
                      OPTION(MAXRECURSION 32767)
      """

    DB.withConnection { implicit connection =>

      SQL(sqlString).on(
        'emailEmployee -> emailEmployee).as(scalar[Option[String]].single)
      /*
      val rowOption = SQL(sqlString)
        .on('emailEmployee -> emailEmployee)
        .apply
        .headOption
      rowOption match {
        case Some(row) => Some(row[String]("emailTrab"))
        case None => None
      }
      */
    }
  }


  def findUserAlertsIds(employeeid: String): String = {
    var risk_ids = ""
    val risksAlerts = RiskService.findAllActiveAlerts()
    for (r <- risksAlerts) {

      if (!r.person_invloved.isEmpty) {//obtiene los id de alerta en que figura el usuario
        if (r.person_invloved.get.contains(employeeid)) {
          if (StringUtils.isEmpty(risk_ids)) {
            risk_ids = r.id.get.toString()
          } else {
            risk_ids = risk_ids + "," + r.id.get.toString()
          }
        }
      }

    }

    return risk_ids
  }

  def findNewUserAlertsIds(employeeid: String): String = {
    var risk_ids = ""
    val risksAlerts = RiskService.findAllOpenAlerts(employeeid.toInt)
    for (r <- risksAlerts) {

      if (!r.person_invloved.isEmpty) {//obtiene los id de alerta en que figura el usuario
        if (r.person_invloved.get.contains(employeeid)) {
          if (StringUtils.isEmpty(risk_ids)) {
            risk_ids = r.id.get.toString()
          } else {
            risk_ids = risk_ids + "," + r.id.get.toString()
          }
        }
      }

    }

    return risk_ids
  }
  
  def findAllAlertStatus(): Seq[RiskStatus] = {
    var sqlString = "select id,description,is_active from art_risk_alert_status where is_active = 1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskStatus.status *)
    }
  }

  def findAllCCEmail(id_template:String): Option[String] = {
    val sqlString =
      """
        SELECT ISNULL(RTRIM(em1),'') + ',' + ISNULL(RTRIM(em2),'') + ',' + ISNULL(RTRIM(em3),'')
        emails FROM art_risk_alert_conf WHERE is_active = 1 AND id={id_template}
      """
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id_template->id_template.toInt).as(scalar[String].singleOpt)
    }
  }
  
  def findAllAlertCategory(): Seq[RiskCategory] = {
    var sqlString = "select id,description,is_active from art_risk_alert_category where is_active = 1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskCategory.category *)
    }
  }

  def updateFirstAlertCronMail(alert_id: String, reiteration: Int) = {
    DB.withConnection { implicit connection =>

      SQL(
        """
          update art_risk_alert SET
          reiteration={reiteration},
          status_id=(SELECT id FROM art_risk_alert_status WHERE description = 'Vencida'),
          change_state=GETDATE()
          where id={alert_id}
          """).on(
        'alert_id -> alert_id,
        'reiteration -> reiteration).executeUpdate()

    }
  }

  def updateSecondAlertCronMail(alert_id: String, reiteration: Int) = {
    DB.withConnection { implicit connection =>

      SQL(
        """
          update art_risk_alert SET
          reiteration={reiteration},
          change_state=GETDATE()
          where id={alert_id}
          """).on(
        'alert_id -> alert_id,
        'reiteration -> reiteration).executeUpdate()

    }
  }

  def automaticAlert() {
    val FormattedDATE = new SimpleDateFormat("yyyy-MM-dd-hh-mm-ss")
    val now = FormattedDATE.format(new Date().getTime).toString
    //first iteration
    val firstCandidates = RiskService.findAllFirstExpiredAlerts()
    if(!firstCandidates.isEmpty) {
      for (t <- firstCandidates) {
        Logger.info("First round : " + t.id.get.toString + " " + t.reiteration.get.toInt)
        val round = t.reiteration.get.toInt + 1

        sendEmailAlerts(t.id.get.toString, round) match {
          case "OK" =>
            // update Alert
            Logger.info("Update Alert [" + t.id.get.toString + "] reiteration [" + round + "]")
            updateFirstAlertCronMail(t.id.get.toString, round)
          case _   => Logger.info("I DO NOT SEND THE MAIL!!")
        }

      } //first iteration
    }else{
      Logger.info("["  + now + "] There are no valid alerts with more than two days of delay.")
    }

    //second iteration
    val secondCandidates = RiskService.findAllSecondExpiredAlerts()
    if(!secondCandidates.isEmpty) {
      for (r <- secondCandidates) {
        Logger.info("Second round : " + r.id.get.toString + " " + r.reiteration.get.toInt)
        val round = r.reiteration.get.toInt + 1

        sendEmailAlerts(r.id.get.toString, round) match {
          case "OK" =>
            // update Alert
            Logger.info("Update Alert [" + r.id.get.toString + "] reiteration [" + round + "]")
            updateFirstAlertCronMail(r.id.get.toString, round)
          case _   => Logger.info("I DO NOT SEND THE MAIL!!")
        }

      } //second iteration
    } else {
      Logger.info("["  + now + "] There are no valid alerts with more than eight days of delay.")
    }
  }

  def riskAutomaticAlert() {
    val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
    val todaydate = format.parse(format.format(new java.util.Date()))

    var program: Option[ProgramMaster] = null
    var users: Seq[Users] = null

    /**
     * Step 1 - Send Alert when you calculate Task completion percentage on start & end date.
     */
    //    val tasks = TaskService.findAllTasks();
    //    for (t <- tasks) {
    //      
    //      var start_date = format.parse(format.format(t.plan_start_date))
    //      var end_date = format.parse(format.format(t.plan_end_date))
    //     
    //      if (start_date.getTime == todaydate.getTime) {
    //         if(t.tId.get==909){
    //      println(t.tId.get)  
    //      }
    //      
    //        val risks = RiskService.findAllRiskList(t.tId.get.toString(), 2)
    //        if (risks.size > 0) {
    //          program = TaskService.findProgramDetailForTask(t.tId.get.toString())
    //          if (!program.isEmpty) {
    //            users = ProgramMemberService.findAllProgramMembers(program.get.program_id.get.toString);
    //            var persons = ""
    //            for (u <- users) {
    //              if (StringUtils.isEmpty(persons)) {
    //                persons = u.uid.get.toString()
    //              } else {
    //                persons = persons + "," + u.uid.get.toString()
    //              }
    //            }
    //            for (r <- risks) {
    //
    //              val alert = RiskAlerts(Option(1), r.id.get, Option(1), Option(1), Option(new Date()),
    //                r.name, Option(r.cause), Option(r.responsible), Option(persons),
    //                Option(1), Option(1), Option(1))
    //              val last = insertRiskAlert(alert)
    //                println("Start date is same "+ last)
    //            }
    //
    //          }
    //
    //        }
    //
    //      }
    //      if (end_date.getTime == todaydate.getTime) {
    //        val risks = RiskService.findAllRiskList(t.tId.get.toString(), 2)
    //        if (risks.size > 0) {
    //          program = TaskService.findProgramDetailForTask(t.tId.get.toString())
    //          if (!program.isEmpty) {
    //            users = ProgramMemberService.findAllProgramMembers(program.get.program_id.get.toString);
    //            var persons = ""
    //            for (u <- users) {
    //              if (StringUtils.isEmpty(persons)) {
    //                persons = u.uid.get.toString()
    //              } else {
    //                persons = persons + "," + u.uid.get.toString()
    //              }
    //            }
    //            for (r <- risks) {
    //            
    //              val alert = RiskAlerts(Option(1), r.id.get, Option(1), Option(1), Option(new Date()),
    //                r.name, Option(r.cause), Option(r.responsible), Option(persons),
    //                Option(1), Option(1), Option(1))
    //
    //              val last = insertRiskAlert(alert)
    //              println("end date is same "+ last)
    //            }
    //
    //          }
    //
    //        }
    //      }

    //} //Step 1 ends

    /**
     * Step 2 - When SPI value is less than 1
     */
    users = null
    val programs = ProgramService.findActivePrograms()
    for (p <- programs) {
      val spi = SpiCpiCalculationsService.findCalculationsForDashboard(p.program_id.get.toString())
      if (!spi.isEmpty) {
        if (spi.get.spi.get < 1) {
          users = ProgramMemberService.findAllProgramMembers(p.program_id.get.toString);

          val risks = RiskService.findAllRiskList(p.program_id.get.toString(), 0)
          // println(p.program_id.get + " SPI " + risks.size)
          if (risks.size > 0) {
            program = TaskService.findProgramDetailForTask(p.program_id.get.toString())
            if (!program.isEmpty) {
              users = ProgramMemberService.findAllProgramMembers(program.get.program_id.get.toString);
              var persons = ""
              for (u <- users) {
                if (StringUtils.isEmpty(persons)) {

                  persons = u.uid.get.toString()
                } else {
                  persons = persons + "," + u.uid.get.toString()
                }
              }
              /*
              for (r <- risks) {

                val alert = RiskAlerts(Option(1), r.id.get, Option(1), Option(1), Option(new Date()),
                  r.name, Option(r.cause), Option(r.responsible), Option(persons),
                  Option(1), Option(1), Option(1),)

                /**
                 * Temp commit
                 */
                val last = insertRiskAlert(alert)
                //sendAutomaticAlerts(last.toString())
              }
              */

            }

          }

        }

      }
    } //Step 2 ends

    /**
     * *
     * Step 3 -
     */

  }

  /*
  author: marcelol marcelol@loso.cl
   */
  def sendEmailAlerts(alert_id: String, increment: Int) : String = {

    var response: String = "NOK"

    if (!StringUtils.isEmpty(alert_id)) {

      val alert = findRiskAlertsById(alert_id)
      if (!alert.isEmpty) {

        var persons = ""
        val risk_id = alert.get.risk_id.toString()
        val risks = findRiskFromAlert(risk_id)

        val risk_details = findRiskDetails(risk_id)
        if (!risk_details.isEmpty) {
          val risk_parent_id = risk_details.get.parent_id.get
          val risk_parent_type = risk_details.get.parent_type.get
          val program = findProgramByIdParent(risk_parent_id.toString, risk_parent_type)

          if (!alert.get.person_invloved.isEmpty) {
            persons = alert.get.person_invloved.get
          }

          val template = findTmplMail(alert_id)
          val tId = findTmplId(alert_id)
          var cc = findAllCCEmail(tId.toString).get.toString

          val lastchar = cc.charAt(cc.length-1).toString

          if(lastchar.equals(","))
            cc = cc.substring(0, cc.length() - 1)

          var user: Option[Users] = null
          if (!StringUtils.isEmpty(persons)) {
            for (p <- persons.split(",")) {
              user = UserService.findUser(p.toString())
              if (!user.isEmpty) {
                val email = user.get.email.toString()

                Logger.debug("EMAIL : " + email)

                if (!StringUtils.isEmpty(email)) {

                  if(increment == 2) {
                    val boss = findBossMail(email)
                    if(!boss.isEmpty) {
                      Logger.debug("el jefe es : " + boss.get.toString)
                      cc = cc + "," + boss.get.toString
                    }else{
                      Logger.debug("no tiene jefe")
                    }

                  } else if (increment == 3) {
                    val bigboss = findBigBossMail(email)
                    if(!bigboss.isEmpty) {
                      Logger.debug("el gran jefe : " + bigboss.get.toString)
                      cc = cc + "," + bigboss.get.toString
                    }else{
                      Logger.debug("no tiene gran jefe")
                    }
                  }

                  Logger.debug("USER : " + user.toString)
                  Logger.debug("PROGRAM : " + program.toString)
                  Logger.debug("ALERT : " + alert.toString)
                  Logger.debug("RISK : " + risks.toString)
                  Logger.debug("RISK DETAIL : " + risk_details.toString)
                  Logger.debug("INCREMENT : " + increment.toString)
                  Logger.debug("TEMPLATE : " + template.toString)
                  Logger.debug("CC : " + cc.toString)

                  response=utils.SendEmail.sendEmailRiskAlert(
                    user,
                    program,
                    alert,
                    risks,
                    risk_details,
                    increment,
                    template,
                    cc)

                  Logger.debug("RESPUESTA : " + response)


                }

              }
            }
          }

        }

      }

    }

    response

  }

  def findIssueCategoryForCategoryId(category_id: String): Option[models.IssueCategory] = {
    if (!category_id.trim().isEmpty()) {
      var sqlString = "SELECT * FROM  art_issue_category where is_deleted = 0 AND id=" + category_id
      DB.withConnection { implicit connection =>
        SQL(sqlString).as(models.IssueCategory.issueCategoryNew.singleOpt)
      }
    } else {
      null
    }
  }
  def findIssueSubCategoryForIssueCategory(category_id: String): Seq[models.IssueSubCategory] = {
    if (!category_id.trim().isEmpty()) {
      var sqlString = "SELECT * FROM  art_issue_sub_category where is_deleted = 0 AND category_id=" + category_id
      DB.withConnection { implicit connection =>
        SQL(sqlString).as(models.IssueSubCategory.issueSubCategory *)
      }
    } else {
      null
    }
  }

  def findActiveIssueCategory(): Seq[models.IssueCategory] = {
    var sqlString = "SELECT * FROM  art_issue_category where is_deleted = 0"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(models.IssueCategory.issueCategoryNew *)
    }
  }

  def findIssueSubCategoryForSubCategoryId(sub_category_id: String): Option[models.IssueSubCategory] = {
    if (!sub_category_id.trim().isEmpty()) {
      var sqlString = "SELECT * FROM  art_issue_sub_category where is_deleted = 0 AND id=" + sub_category_id
      DB.withConnection { implicit connection =>
        SQL(sqlString).as(models.IssueSubCategory.issueSubCategory.singleOpt)
      }
    } else {
      null
    }
  }

}