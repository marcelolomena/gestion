package controllers.Frontend

import anorm.NotAssigned
import java.util.Date
import java.text.SimpleDateFormat
//import org.joda.time.DateTime
//import org.joda.time.DateTimeConstants
import org.apache.commons.lang3.StringUtils
import org.json.JSONObject
import art_forms.ARTForms
import models.Activity
import models.ActivityTypes
import models.ProgramDate
import models.ProgramDetail
import models.ProgramMaster
import models.Programs
import play.api.data.Form
import play.api.mvc.Action
import play.api.mvc.Controller
import services.DepartmentService
import services.DivisionService
import services.GenrenciaService
import services.ProgramService
import services.ProjectService
import services.TimesheetService
import services.UserService
import services.DocumentService
import services.DistributionTimeSheetService
import models.VersionDetails
import java.io._
import services.TaskService
import services.SubTaskServices
import models.Project
import models.SubTaskMaster
import scala.util.Random
import services.GenericProjectService
import services.GenericService
import models.Tasks
import services.TaskService
import models.UserSetting
import java.text.SimpleDateFormat
import java.io.FileOutputStream
import services.TaskService
import services.SubTaskServices
import java.util.Calendar
import utils.ExportToExcel
import java.text.SimpleDateFormat
import java.util.Calendar
import utils.ExportToExcel
import services.SubTypeService
import services.ProgramTypeService
import services.UserRoleService
import models.Baseline
import play.libs.Json
import models.ProgramMembers
import services.ProgramMemberService
import models.ProgramMembers
import models.SAPMaster
import services.SAPServices
import services.BudgetTypeService
import models.SAPMaster
import models.Expenditure
import models.Investment
import models.SAPMaster
import models.SAP
import play.api._
import play.api.mvc._
//import play.api.libs.json
import play.api.libs.json._
import scala.math.BigDecimal.RoundingMode
import models.ProgramStatus
import services.EarnValueService
import models.SpiCpiCalculations
import services.SpiCpiCalculationsService
import models.RiskManagement
import models.RiskManagementMaster
import models.RiskManagementIssue
import java.util.TreeMap
import models.riskParentType
import services.RiskService
import models.ProgramDates
import models.ProgramMembersExternal
import services.ProgramMemberExternalService

/**
 * This will have program and project details..
 */
object Program extends Controller {

  /*val users = UserService.findAllUsers
  val gerencias = GenrenciaService.findAllGenrencias
  var userMap = new java.util.HashMap[String, String]()

  var gerenciasMap = new java.util.HashMap[String, String]()
  for (u <- users) {
    userMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
  }
  for (g <- gerencias) {

    gerenciasMap.put(g.dId.get.toString(), g.genrencia)
  }
*/
  def programsListing(programnumber: Integer) = Action { implicit request =>
    request.session.get("username").map { user =>
      val user_id = Integer.parseInt(request.session.get("uId").get)
      val username = request.session.get("username").get
      val profile = request.session.get("user_profile").get

      var start = 1;
      var end = 10;
      if (programnumber > 0) {
        start = ((programnumber - 1) * 10) + 1;
        end = start + 9;
      }
      //println("start : " + start)
      //println("end : " + end)
      //println("pagina : " + programnumber)
      
/*
      if (StringUtils.equals(profile.trim, "pmo") || StringUtils.equals(profile.trim, "su") || StringUtils.equals(profile.trim, "cl")) {
        val programs = ProgramService.findPaginationProgramList(start, end)
        val programCount = ProgramService.findProgramCount()
        var tasksDependents = new java.util.HashMap[Integer, Long]()
        val userSession = request.session + ("uId" -> user_id.toString()) + ("username" -> username) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
        Ok(views.html.frontend.program.paginationProgramListing(programs, programCount)).withSession(userSession)
      } else {
        val programs = ProgramService.findPaginationUserPrograms(user_id.toString(), start, end)
        val programCount = ProgramService.findAllUserProgramsCount(user_id.toString())
        var tasksDependents = new java.util.HashMap[Integer, Long]()
        val userSession = request.session + ("uId" -> user_id.toString()) + ("username" -> username) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
        Ok(views.html.frontend.program.paginationProgramListing(programs, programCount)).withSession(userSession)
      }
*/
        val programs = ProgramService.findAllUserJunior(username, programnumber)
        val programCount = ProgramService.countAllUserJunior(username)
        var tasksDependents = new java.util.HashMap[Integer, Long]()
        val userSession = request.session + ("uId" -> user_id.toString()) + ("username" -> username) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
        Ok(views.html.frontend.program.paginationProgramListing(programs, programCount)).withSession(userSession)      
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * List of programs
   */
  def programs() = Action { implicit request =>
    request.session.get("username").map { user =>
      val user_id = Integer.parseInt(request.session.get("uId").get)
      val username = request.session.get("username").get
      val profile = request.session.get("user_profile").get
      val pagenumber: Integer = 0
      var start = 1;
      var end = 10;
      if (pagenumber > 0) {
        start = ((pagenumber - 1) * 10) + 1;
        end = start + 9;
      }
/*
      if (StringUtils.equals(profile.trim, "pmo") || StringUtils.equals(profile.trim, "su") || StringUtils.equals(profile.trim, "cl")) {
        val programs = ProgramService.findAllProgramList()

        var tasksDependents = new java.util.HashMap[Integer, Long]()
        val userSession = request.session + ("uId" -> user_id.toString()) + ("username" -> username) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
        Ok(views.html.frontend.program.programs(programs)).withSession(userSession)
      } else {
        val programs = ProgramService.findAllUserPrograms(user_id.toString())
        var tasksDependents = new java.util.HashMap[Integer, Long]()
        val userSession = request.session + ("uId" -> user_id.toString()) + ("username" -> username) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
        Ok(views.html.frontend.program.programs(programs)).withSession(userSession)
      }
*/
      
      
        //val programs = ProgramService.findAllUserJunior(username.toString())
        val programs = ProgramService.countAllUserJunior(username)
        //println("largo weon = " + programs.length)
        var tasksDependents = new java.util.HashMap[Integer, Long]()
        val userSession = request.session + ("uId" -> user_id.toString()) + ("username" -> username) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
        Ok(views.html.frontend.program.programs(programs)).withSession(userSession)
 
      /*
       * else if (StringUtils.equals(profile.trim, "prm")) {
        
        val programs = ProgramService.findProjectManagerPrograms(user_id.toString())
        println(programs.size)
        var tasksDependents = new java.util.HashMap[Integer, Long]()
        val userSession = request.session + ("uId" -> user_id.toString()) + ("username" -> username) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
        Ok(views.html.frontend.program.programs(programs)).withSession(userSession)
      }
       */

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def programSearch() = Action { implicit request =>
    /*
    var delayLevelValues = new java.util.HashMap[String, String]()
    for (d <- models.delayLevelValues.values) {
      delayLevelValues.put(d.id.toString, d.toString())
    }

    var projectClassificationValues = new java.util.HashMap[String, String]()
    for (d <- models.projectClassificationValues.values) {
      projectClassificationValues.put(d.id.toString, d.toString())
    }
    */
    var workflowStatusValues = new java.util.HashMap[String, String]()
    for (d <- ProgramTypeService.findAllWorkflowStatus) {
      workflowStatusValues.put(d.id.get.toString, d.workflow_status.toString())
    }
    var modelManagementValues = new java.util.HashMap[String, String]()
    for (d <- ProgramTypeService.findAllProgramType) {
      modelManagementValues.put(d.id.get.toString, d.program_type.toString())
    }

    var divisionValues = new java.util.HashMap[String, String]()
    for (d <- DivisionService.findAllDivision) {
      divisionValues.put(d.dId.get.toString, d.division.toString())
    }

    var programSubTypeValues = new java.util.HashMap[String, String]()
    for (d <- SubTypeService.findAllSubTypeList) {
      programSubTypeValues.put(d.id.get.toString, d.sub_type.toString())
    }

    var budgetTypeValues = new java.util.LinkedHashMap[String, String]()
    val budgetTypes = BudgetTypeService.findActiveBudgetTypes()
    for (b <- budgetTypes) {
      budgetTypeValues.put(b.id.get.toString(), b.budget_type.toString())
    }
    /*
    val prgramMembers = ProgramMemberService.findProgramManagers("8")
    var userIds = ""
    for (p <- prgramMembers) {
      if (StringUtils.isEmpty(userIds)) {
        userIds = p.member_id.toString()
      } else {
        userIds += ", " + p.member_id.toString()
      }
    }
*/
    var programManagerValues = new java.util.LinkedHashMap[String, String]()
    //if (!StringUtils.isEmpty(userIds)) {
    //val users = UserService.findProgramManagersDetails(userIds)
    val users = UserService.findAllProgramMember
    if (users.size > 0) {
      for (u <- users) {
        programManagerValues.put(u.uid.get.toString(), u.first_name.substring(0, 1) + " " + u.last_name)
      }
    }
    //}

    var sortValues = new java.util.HashMap[String, String]()
    sortValues.put("1", "Alphabetically");
    sortValues.put("2", "Release Date");

    Ok(views.html.frontend.program.programForm( /*delayLevelValues, projectClassificationValues,*/ workflowStatusValues, modelManagementValues, divisionValues, programSubTypeValues, budgetTypeValues, programManagerValues, sortValues, ARTForms.searchProgram)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
  }

  def searchResult() = Action { implicit request =>

    request.session.get("username").map { user =>
      /*
      var delayLevelValues = new java.util.HashMap[String, String]()
      for (d <- models.delayLevelValues.values) {
        delayLevelValues.put(d.id.toString, d.toString())
      }

      var projectClassificationValues = new java.util.HashMap[String, String]()
      for (d <- models.projectClassificationValues.values) {
        projectClassificationValues.put(d.id.toString, d.toString())
      }

*/
      var workflowStatusValues = new java.util.HashMap[String, String]()
      for (d <- ProgramTypeService.findAllWorkflowStatus) {
        workflowStatusValues.put(d.id.get.toString, d.workflow_status.toString())
      }

      var modelManagementValues = new java.util.HashMap[String, String]()
      for (d <- ProgramTypeService.findAllProgramType) {
        modelManagementValues.put(d.id.get.toString, d.program_type.toString())
      }

      var divisionValues = new java.util.HashMap[String, String]()
      for (d <- DivisionService.findAllDivision) {
        divisionValues.put(d.dId.get.toString, d.division.toString())
      }

      var programSubTypeValues = new java.util.HashMap[String, String]()
      for (d <- SubTypeService.findAllSubTypeList) {
        programSubTypeValues.put(d.id.get.toString, d.sub_type.toString())
      }

      var budgetTypeValues = new java.util.LinkedHashMap[String, String]()
      val budgetTypes = BudgetTypeService.findActiveBudgetTypes()
      for (b <- budgetTypes) {
        budgetTypeValues.put(b.id.get.toString(), b.budget_type.toString())
      }

      /*
      val prgramMembers = ProgramMemberService.findProgramManagers("8")
      var userIds = ""
      for (p <- prgramMembers) {
        if (StringUtils.isEmpty(userIds)) {
          userIds = p.member_id.toString()
        } else {
          userIds += ", " + p.member_id.toString()
        }
      }
      */

      var programManagerValues = new java.util.LinkedHashMap[String, String]()
      //if (!StringUtils.isEmpty(userIds)) {
      //val users = UserService.findProgramManagersDetails(userIds)
      val users = UserService.findAllProgramMember
      if (users.size > 0) {
        for (u <- users) {
          programManagerValues.put(u.uid.get.toString(), u.first_name.substring(0, 1) + " " + u.last_name)
        }
      }
      //}
      var sortValues = new java.util.HashMap[String, String]()
      sortValues.put("1", "Alphabetically");
      sortValues.put("2", "Release Date");
      ARTForms.searchProgram.bindFromRequest.fold(
        errors => {
          Ok(views.html.frontend.program.programForm( /*delayLevelValues, projectClassificationValues,*/ workflowStatusValues, modelManagementValues, divisionValues, programSubTypeValues, budgetTypeValues, programManagerValues, sortValues, ARTForms.searchProgram)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        },
        searchForm => {
          //var delay_level = ""
          //var project_classification = ""
          var work_flow_status = ""
          var program_name = ""
          var program_type = ""
          var program_sub_type = ""
          var division = ""
          var program_role = ""
          var item_budget = ""
          var sort_type = ""
          var gerencia = ""
          var department = ""

          if (!searchForm.work_flow_status.isEmpty) {
            work_flow_status = searchForm.work_flow_status.get.trim()
          }

          if (!searchForm.program_name.isEmpty) {
            program_name = searchForm.program_name.get.trim()
          }
          if (!searchForm.program_type.isEmpty) {
            program_type = searchForm.program_type.get.trim()
          }
          if (!searchForm.program_sub_type.isEmpty) {
            program_sub_type = searchForm.program_sub_type.get.trim()
          }
          if (!searchForm.division.isEmpty) {
            division = searchForm.division.get.trim()
          }
          /*
          if (!searchForm.project_classification.isEmpty) {
            project_classification = searchForm.project_classification.get.trim()
          }
          */

          if (!searchForm.program_role.isEmpty) {
            program_role = searchForm.program_role.get.trim()
          }
          if (!searchForm.item_budget.isEmpty) {
            item_budget = searchForm.item_budget.get.trim()
          }

          if (!searchForm.sort_type.isEmpty) {
            sort_type = searchForm.sort_type.get.trim()
          }

          //println(" program_type=" + program_type + " division=" + division + " item_budget" + item_budget + " program_role=" + program_role + " item_budget=" + item_budget)

          val user_id = Integer.parseInt(request.session.get("uId").get)
          val username = request.session.get("username").get

          //var tasksDependents = new java.util.HashMap[Integer, Long]()
          val userSession = request.session + ("uId" -> user_id.toString()) + ("username" -> username) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)

          if (StringUtils.isEmpty(work_flow_status) && StringUtils.isEmpty(program_name) && StringUtils.isEmpty(program_type) &&
            StringUtils.isEmpty(program_sub_type) && StringUtils.isEmpty(division) &&
            /*StringUtils.isEmpty(project_classification) &&*/ StringUtils.isEmpty(program_role) &&
            StringUtils.isEmpty(item_budget)) {
            val programs = ProgramService.findAllProgramList()
            Ok(views.html.frontend.program.programListing(programs)).withSession(userSession)

          } else {
            val programs = ProgramService.searchDashboardReport(work_flow_status, program_name, program_type, program_sub_type, division, program_role, item_budget, "")
            Ok(views.html.frontend.program.programListing(programs)).withSession(userSession)

            //Ok("SUCCESS");
          }
        })
    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }
  }

  def programListing() = Action { implicit request =>
    request.session.get("username").map { user =>
      val user_id = Integer.parseInt(request.session.get("uId").get)
      val username = request.session.get("username").get

      val programs = ProgramService.findAllProgramList()
      var tasksDependents = new java.util.HashMap[Integer, Long]()
      val userSession = request.session + ("uId" -> user_id.toString()) + ("username" -> username) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
      Ok(views.html.frontend.program.programListing(programs)).withSession(userSession)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }

  /**
   * Program detail page...
   * programId - program id
   */
  def programDetails(programId: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val uId = Integer.parseInt(request.session.get("uId").get)
      val utype = Integer.parseInt(request.session.get("utype").get)
      val program = ProgramService.findProgramMasterDetailsById(programId)
      val statusWorkflow = ProgramTypeService.findWorkflowByProgramId(programId)
      var statusWF = statusWorkflow.get.workflow_status.toString()
      val programDetail = ProgramService.findProgramOtherDetailsById(programId)
      val programDates = ProgramService.findProgramDateDetailsById(programId)
      val projectList = UserService.findProjectListForUserAndProgram(uId, programId)
      val projects = ProjectService.findProjectListForProgram(programId)
      // val programs = ProgramService.findAllPrograms("", "")
      val documents = DocumentService.findAllDocuments(programId, "PROGRAM", "", "", "")
      var currentDocuments = new java.util.HashMap[String, Seq[VersionDetails]]()
      var prevDocuments = new java.util.HashMap[String, Seq[VersionDetails]]()

      val e_value_obj = EarnValueService.getEarnCalculationForProgram(programId)

      var expected_completion_percentage: scala.math.BigDecimal = 0.0
      if (!e_value_obj.isEmpty) {
        if (!e_value_obj.get.planned_value.isEmpty) {
          if (e_value_obj.get.planned_value.get != 0) {
            if (!program.get.planned_hours.isEmpty) {
              if (program.get.planned_hours.get != 0) {
                expected_completion_percentage = (e_value_obj.get.planned_value.get / program.get.planned_hours.get) * 100
              }
            }
          }
        }
      }
      expected_completion_percentage = expected_completion_percentage.setScale(2, RoundingMode.HALF_UP);

      val baseline = Baseline.getBaseline(Integer.parseInt(programId), "program")
      var changeSet = "";
      if (baseline.length > 0) {
        changeSet = "[";
        var i = 0;

        for (b <- baseline) {

          var jsonNode = Json.parse(b.change_set);
          var itr = jsonNode.iterator()
          while (itr.hasNext()) {
            var jsonObj = itr.next();
            if (i == 0) {
              changeSet = "[" + jsonObj.toString() + ",";
            } else {
              changeSet = changeSet + jsonObj.toString() + ",";
            }
            i = i + 1;
          }
        }

        changeSet = changeSet.substring(0, changeSet.length() - 1) + "]";
      }

      val progrma_members = ProgramMemberService.findActiveProgramMember(programId)
      val externalEmployees = ProgramMemberExternalService.findProgramMemberExternalByProgramId(programId);
      val saps = SAPServices.findAllSAPMasterDetails(programId)

      val subTasks = SubTaskServices.findAllSubTasksForProgram(programId)

      for (s <- subTasks) {

      }

      var plan_time_for_program: scala.math.BigDecimal = 0.0
      plan_time_for_program = program.get.planned_hours.getOrElse(0).toString().toDouble // new definition for completion percentage

      if (plan_time_for_program.!=(0)) {
        val completion_percentage_forProgram = ProgramService.completionPercentageForProgram(programId)
        Ok(views.html.frontend.program.programDetails(expected_completion_percentage.toString(), completion_percentage_forProgram.toString(), program, programDetail, programDates, projectList, documents, changeSet, progrma_members, saps, externalEmployees, statusWF)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      } else {

        Ok(views.html.frontend.program.programDetails(expected_completion_percentage.toString(), plan_time_for_program.toString(), program, programDetail, programDates, projectList, documents, changeSet, progrma_members, saps, externalEmployees, statusWF)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   *
   * add new program....
   */
  def addNewProgram() = Action { implicit request =>
    request.session.get("username").map { user =>

      var workflowStatusValues = new java.util.HashMap[String, String]()
      for (d <- ProgramTypeService.findAllWorkflowStatus) {
        workflowStatusValues.put(d.id.get.toString, d.workflow_status.toString())
      }

      val count = ProgramService.findAllProgramList.size
      val today = Calendar.getInstance()
      today.setTime(new Date())
      val program_code = today.get(Calendar.YEAR) + "" + (today.get(Calendar.MONTH) + 1) + "" + (Integer.parseInt(ProgramService.findProgramCount.toString) + 1).toString
      var programSubType = new java.util.HashMap[String, String]()
      var subtype = SubTypeService.findAllSubTypeList();
      for (s <- subtype) {
        programSubType.put(s.id.get.toString, s.sub_type)
      }

      var programType = new java.util.HashMap[String, String]()
      var programtype = ProgramTypeService.findAllProgramTypeList();

      for (s <- programtype) {
        programType.put(s.id.get.toString, s.program_type)
      }

      val divisions = DivisionService.findAllDivisions
      var divisionMap = new java.util.HashMap[String, String]()
      for (d <- divisions) {
        divisionMap.put(d.dId.get.toString(), d.division)
      }

      // val departments = DepartmentService.findAllDepartmentS
      var departmentsMap = new java.util.HashMap[String, String]()
      /*for (d <- departments) {
        departmentsMap.put(d.dId.get.toString(), d.department)
      }*/

      var users = UserService.findAllDemandManager();

      var usersMap = new java.util.LinkedHashMap[String, String]()
      for (u <- users) {
        usersMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
      }
      val divisionObj = DivisionService.findDivisionByNameActiveAndInactive("Division Operaciones y Tecnologia")

      var division_Id = 0
      if (!divisionObj.isEmpty) {
        division_Id = divisionObj.apply(0).dId.get
      }
      var gerenciasMap = new java.util.HashMap[String, String]()
      if (division_Id == 0) {
        val gerencias = GenrenciaService.findAllGenrencias

        for (g <- gerencias) {
          gerenciasMap.put(g.dId.get.toString(), g.genrencia)
        }
      } else {
        val gerencias = GenrenciaService.findAllGenrenciaListByDivision(division_Id.toString())
        for (g <- gerencias) {
          gerenciasMap.put(g.dId.get.toString(), g.genrencia)
        }
      }

      Ok(views.html.frontend.program.addNewProgram(ARTForms.programForm, program_code, usersMap, divisionMap, gerenciasMap, departmentsMap, programSubType, programType, workflowStatusValues)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * save program details...
   */
  def saveNewProgram = Action { implicit request =>
    val count = ProgramService.findAllProgramList.size
    val today = Calendar.getInstance()
    today.setTime(new Date())
    val program_code = "20150101"

    var workflowStatusValues = new java.util.HashMap[String, String]()
    for (d <- ProgramTypeService.findAllWorkflowStatus) {
      workflowStatusValues.put(d.id.get.toString, d.workflow_status.toString())
    }

    var programSubType = new java.util.HashMap[String, String]()
    var subtype = SubTypeService.findAllSubTypeList();
    for (s <- subtype) {
      programSubType.put(s.id.get.toString, s.sub_type)
    }

    var programType = new java.util.HashMap[String, String]()

    var programtype = ProgramTypeService.findAllProgramTypeList();
    for (s <- programtype) {
      programType.put(s.id.get.toString, s.program_type)
    }

    val divisions = DivisionService.findAllDivisions
    var divisionMap = new java.util.HashMap[String, String]()
    for (d <- divisions) {
      divisionMap.put(d.dId.get.toString(), d.division)
    }

    var users = UserService.findAllDemandManager();

    var usersMap = new java.util.HashMap[String, String]()
    for (u <- users) {
      usersMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
    }

    /*    val gerencias = GenrenciaService.findAllGenrencias

    var gerenciasMap = new java.util.HashMap[String, String]()
    for (g <- gerencias) {
      gerenciasMap.put(g.dId.get.toString(), g.genrencia)
    }*/

    val divisionObj = DivisionService.findDivisionByNameActiveAndInactive("Division Operaciones y Tecnologia")

    var division_Id = 0
    if (!divisionObj.isEmpty) {
      division_Id = divisionObj.apply(0).dId.get
    }
    var gerenciasMap = new java.util.HashMap[String, String]()
    if (division_Id == 0) {
      val gerencias = GenrenciaService.findAllGenrencias

      for (g <- gerencias) {
        gerenciasMap.put(g.dId.get.toString(), g.genrencia)
      }
    } else {
      val gerencias = GenrenciaService.findAllGenrenciaListByDivision(division_Id.toString())
      for (g <- gerencias) {
        gerenciasMap.put(g.dId.get.toString(), g.genrencia)
      }
    }

    val old_form = ARTForms.programForm.bindFromRequest
    old_form.fold(
      // Form has errors, redisplay it
      errors => {
        val theForm = ProgramService.validateForm(old_form, "")

        var departmentsMap = new java.util.HashMap[String, String]()
        if (!old_form.data.get("program_details.management").isEmpty && !old_form.data.get("program_details.management").get.isEmpty()) {
          var gerencia_id = old_form.data.get("program_details.management").get
          val departments = DepartmentService.findAllDepartmentListByGenrencia(gerencia_id)
          for (d <- departments) {
            departmentsMap.put(d.dId.get.toString(), d.department)
          }
        }

        BadRequest(views.html.frontend.program.addNewProgram(theForm, program_code, usersMap, divisionMap, gerenciasMap, departmentsMap, programSubType, programType, workflowStatusValues)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

      },
      program => {
        val theForm = ProgramService.validateForm(ARTForms.programForm.fill(program), "")
        if (theForm.hasErrors) {
          var departmentsMap = new java.util.HashMap[String, String]()
          if (!program.program_details.management.isEmpty) {
            var gerencia_id = program.program_details.management.get.toString()
            val departments = DepartmentService.findAllDepartmentListByGenrencia(gerencia_id)
            for (d <- departments) {
              departmentsMap.put(d.dId.get.toString(), d.department)
            }
          }
          BadRequest(views.html.frontend.program.addNewProgram(theForm, program_code, usersMap, divisionMap, gerenciasMap, departmentsMap, programSubType, programType, workflowStatusValues)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

        } else {

          val last_program = ProgramService.insertProgramDetails(program)
          
            val dm = program.demand_manager
            val pms = ProgramMembers(None, last_program.toInt, dm, 7, 0, "")
            //println("program member -------" + pms)
            val lastsaved = ProgramMemberService.insertProgramMemberDetails(pms)
          

          /**
           * Default project of type Initiative and its tasks...
           */
/*
          val projectTypes = GenericProjectService.findProjectTypeDetailsByType(1);
          if (!projectTypes.isEmpty) {
            val pm = program.program_manager
            val dm = program.demand_manager
            val start_date = program.program_dates.initiation_planned_date
            val end_date = program.program_dates.release_date

            val projectVlaues = Project(None, "ART" + Random.nextInt(9999), last_program.toInt, 1, "Initiative",
              projectTypes.get.description, dm, start_date, end_date, Option(0), Option(0), Option(1), false, Option(0))

            val pId = ProjectService.insertProject(projectVlaues)

            /**
             * project assigned to project manager & demand manager
             */

            /***************************/
            var projectmapping = UserSetting(dm.toLong, pId, 1)
            UserService.saveUserSetting(projectmapping)

            //val pms = ProgramMembers(None, last_program.toInt, 7, dm, 0,"")
            val pms = ProgramMembers(None, last_program.toInt, dm, 7, 0, "")
            //println("program member -------" + pms)
            val lastsaved = ProgramMemberService.insertProgramMemberDetails(pms)

            val user_id = Integer.parseInt(request.session.get("uId").get)

            if (user_id != dm) {
              projectmapping = UserSetting(user_id.toLong, pId, 1)
              UserService.saveUserSetting(projectmapping)

              //val newpms = ProgramMembers(None, last_program.toInt, 8, user_id, 0,"")
              val newpms = ProgramMembers(None, last_program.toInt, user_id, 8, 0, "")
              //println("program member -------" + newpms)
              val lastsaved = ProgramMemberService.insertProgramMemberDetails(newpms)

            }

            /***************************/

            var tasksDependents = new java.util.HashMap[Integer, Long]()
            val genericTasks = GenericService.findGenericProjectTypeTasks(projectTypes.get.id.get.toString)
            var isBaselined = false
            for (g <- genericTasks) {
              val predefined_id = g.predefined_task_id.toString()
              val service_id = GenericService.findPredefinedTasksDetails(predefined_id).get.catalogue_service
              val taskDetails = Tasks(None, pId.toInt, g.task_title, g.task_code,
                start_date, end_date, g.task_description, g.plan_time,
                new Date(), g.task_status, 1, dm, g.task_discipline, g.completion_percentage,
                g.remark, g.task_depend, Option(1), g.stage, g.user_role, Option(g.deliverable), g.task_type, 1)

              if (g.task_type == 3) {
                isBaselined = true
              }

              val latest_task = TaskService.insertTask(taskDetails)
              tasksDependents.put(g.tId.get, latest_task)

              val subtask = SubTaskMaster(None, latest_task, g.task_title, g.task_description,
                start_date, end_date, new Date(), null, null, new Date(), g.task_status, g.completion_percentage, 0, Option(""), Option(0), Option(service_id))
              SubTaskServices.insertSubTask(subtask)
            }

            if (isBaselined) {
              val project = ProjectService.findProject(pId.toInt)
              val projectInformation = Project(project.get.pId, project.get.project_id, project.get.program, project.get.project_mode, project.get.project_name, project.get.description, project.get.project_manager, project.get.start_date, project.get.final_release_date, project.get.completion_percentage, project.get.ppm_number, project.get.work_flow_status, isBaselined, Option(project.get.planned_hours.getOrElse(0)))
              val result = ProjectService.updateProject(projectInformation)
            }

            var itr = tasksDependents.keySet().iterator();
            var old_id = 0
            var new_id = 0
            while (itr.hasNext()) {
              var key = itr.next();
              old_id = key
              new_id = tasksDependents.get(key).toInt
              var oldObj = GenericService.findGenericTasksDetails(old_id.toString)
              oldObj match {
                case None =>
                case Some(obj: models.GenericTasks) =>
                  //println("Generic task id -- " + obj.tId.get.toString);
                  //println("Generic task Dependent -- " + obj.task_depend.isEmpty);
                  if (!obj.task_depend.isEmpty) {
                    var newStr = ""
                    var newVar = ""
                    var strTaskDepends = obj.task_depend.get.trim().split(",")
                    if (strTaskDepends.length > 0) {
                      for (t <- strTaskDepends) {
                        if (!t.trim().isEmpty() && !StringUtils.equals(t, "null") && !StringUtils.equals(t, "undefined")) {
                          if (StringUtils.isEmpty(newStr)) {
                            if (tasksDependents.get(Integer.parseInt(StringUtils.trim(t))) != 0) {
                              newStr = tasksDependents.get(Integer.parseInt(StringUtils.trim(t))).toInt.toString
                            }

                          } else {
                            newVar = StringUtils.trim(t.toString())
                            if (tasksDependents.get(Integer.parseInt(newVar)) != 0) {
                              newStr = newStr + "," + tasksDependents.get(Integer.parseInt(newVar)).toString
                            }

                          }
                        }
                      }

                    }

                    /**
                     * Update new dependencies...
                     */
                    val newTaskDetails = TaskService.findTaskDetailsByTaskId(new_id)
                    newTaskDetails match {
                      case None =>
                      case Some(task: models.Tasks) => {
                        val taskDetails = Tasks(task.tId, task.pId, task.task_title, task.task_code,
                          task.plan_start_date, task.plan_end_date, task.task_description, task.plan_time,
                          task.creation_date, task.task_status, task.status, task.owner, task.task_discipline,
                          task.completion_percentage, task.remark, Option(newStr), task.dependencies_type, task.stage,
                          task.user_role, task.deliverable, task.task_type, 1)

                        TaskService.updateTask(taskDetails)

                        newStr = newStr.replace("(", "")
                        newStr = newStr.replace(")", "")
                        if (!StringUtils.isEmpty(newStr)) {
                          val sub_task = SubTaskServices.findSubTasksByTask(task.tId.get.toString())
                          for (s <- sub_task) {

                            var subtasks_depend = SubTaskServices.findSubTasksforDependentTasks(newStr)
                            subtasks_depend = subtasks_depend.toString().replace("(", "")
                            subtasks_depend = subtasks_depend.toString().replace(")", "")

                            if (!StringUtils.isEmpty(subtasks_depend.toString())) {
                              SubTaskServices.updateSubTaskDependecy(s.sub_task_id.get.toString(), subtasks_depend.toString())
                            }

                          }
                        }

                      }

                    }
                  }
              }

            }
          }
*/
          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Program.id, "New program created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last_program.toInt)
          Activity.saveLog(act)
          Redirect(routes.Program.programDetails(last_program.toString()))
        }
      })
  }

  /**
   * Edit program details...template view
   * id - program id
   *
   */
  def editProgram(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      var workflowStatusValues = new java.util.HashMap[String, String]()
      for (d <- ProgramTypeService.findAllWorkflowStatus) {
        workflowStatusValues.put(d.id.get.toString, d.workflow_status.toString())
      }

      var programSubType = new java.util.HashMap[String, String]()
      var subtype = SubTypeService.findAllSubTypeList();
      for (s <- subtype) {
        programSubType.put(s.id.get.toString, s.sub_type)
      }

      var programType = new java.util.HashMap[String, String]()
      var programtype = ProgramTypeService.findAllProgramTypeList();
      for (s <- programtype) {
        programType.put(s.id.get.toString, s.program_type)
      }

      val divisions = DivisionService.findAllDivisions
      var divisionMap = new java.util.HashMap[String, String]()
      for (d <- divisions) {
        divisionMap.put(d.dId.get.toString(), d.division)
      }

      val program = ProgramService.findProgramMasterDetailsById(id)
      val programDetails = ProgramService.findProgramOtherDetailsById(id)
      val programDates = ProgramService.findProgramDateDetailsById(id)

      /*    val div_id = programDetails.get.devison
      val div = DivisionService.findDivisionById(div_id)

      if (!div.isEmpty) {
        if (div.get.is_deleted != 1) {
          divisionMap.put(div.get.dId.toString(), div.get.division)
        }
      }*/

      //println(div.get.is_deleted + " - - - - - - - - - - ")

      var departmentsMap = new java.util.HashMap[String, String]()

      val divisionObj = DivisionService.findDivisionByNameActiveAndInactive("Division Operaciones y Tecnologia")

      var division_Id = 0
      if (!divisionObj.isEmpty) {
        division_Id = divisionObj.apply(0).dId.get
      }
      var gerenciasMap = new java.util.HashMap[String, String]()
      if (division_Id == 0) {
        val gerencias = GenrenciaService.findAllGenrencias

        for (g <- gerencias) {
          gerenciasMap.put(g.dId.get.toString(), g.genrencia)
        }
      } else {
        val gerencias = GenrenciaService.findAllGenrenciaListByDivision(division_Id.toString())
        for (g <- gerencias) {
          gerenciasMap.put(g.dId.get.toString(), g.genrencia)
        }
      }

      if (!programDetails.get.management.isEmpty) {
        val dep = programDetails.get.management
        val departments = DepartmentService.findAllDepartmentListByGenrencia(programDetails.get.management.get.toString())
        for (d <- departments) {
          departmentsMap.put(d.dId.get.toString(), d.department)
        }
      }

      val pDetail = ProgramDetail(programDetails.get.devison, programDetails.get.management, programDetails.get.department, programDetails.get.impact_type, programDetails.get.business_line, programDetails.get.sap_code)
      val pDate = ProgramDate(programDates.get.initiation_planned_date, programDates.get.creation_date, programDates.get.closure_date.getOrElse(new Date), programDates.get.release_date)

      val progrm = Programs(program.get.program_id, program.get.program_type, program.get.program_sub_type, program.get.program_name, program.get.program_code, program.get.program_description, program.get.work_flow_status, program.get.demand_manager: Integer, program.get.program_manager, pDetail, pDate, program.get.is_active, program.get.planned_hours, program.get.estimated_cost)

      var users = UserService.findAllDemandManager();

      var usersMap = new java.util.LinkedHashMap[String, String]()
      for (u <- users) {
        usersMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
      }

      Ok(views.html.frontend.program.editProgram(ARTForms.programFormEdit.fill(progrm), id, usersMap, divisionMap, gerenciasMap, departmentsMap, programSubType, programType, workflowStatusValues)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Update Program details..
   * id - program id
   */
  def updateProgram(id: String) = Action { implicit request =>

    var workflowStatusValues = new java.util.HashMap[String, String]()
    for (d <- ProgramTypeService.findAllWorkflowStatus) {
      workflowStatusValues.put(d.id.get.toString, d.workflow_status.toString())
    }

    var programSubType = new java.util.HashMap[String, String]()
    var subtype = SubTypeService.findAllSubTypeList();
    for (s <- subtype) {
      programSubType.put(s.id.get.toString, s.sub_type)
    }

    var programType = new java.util.HashMap[String, String]()

    var programtype = ProgramTypeService.findAllProgramTypeList();
    for (s <- programtype) {
      programType.put(s.id.get.toString, s.program_type)
    }

    val divisions = DivisionService.findAllDivisions
    var divisionMap = new java.util.HashMap[String, String]()
    for (d <- divisions) {
      divisionMap.put(d.dId.get.toString(), d.division)
    }

    var users = UserService.findAllDemandManager();

    var usersMap = new java.util.HashMap[String, String]()
    for (u <- users) {
      usersMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
    }

    /*    val divisionObj = DivisionService.findDivisionByName("Division Operaciones y Tecnologia")

    var division_Id = 0
    if (!divisionObj.isEmpty) {
      division_Id = divisionObj.apply(0).dId.get
    }
    var gerenciasMap = new java.util.HashMap[String, String]()
    if (division_Id == 0) {
      val gerencias = GenrenciaService.findAllGenrencias

      for (g <- gerencias) {
        gerenciasMap.put(g.dId.get.toString(), g.genrencia)
      }
    } else {
      val gerencias = GenrenciaService.findAllGenrenciaListByDivision(division_Id.toString())
      for (g <- gerencias) {
        gerenciasMap.put(g.dId.get.toString(), g.genrencia)
      }
    }
    val departments = DepartmentService.findAllDepartmentS
    var departmentsMap = new java.util.HashMap[String, String]()
    for (d <- departments) {
      departmentsMap.put(d.dId.get.toString(), d.department)
    }*/
    val oldForm = ARTForms.programFormEdit.bindFromRequest

    oldForm.fold(
      errors => {
        val divisionObj = DivisionService.findDivisionByNameActiveAndInactive("Division Operaciones y Tecnologia")

        var division_Id = 0
        if (!divisionObj.isEmpty) {
          division_Id = divisionObj.apply(0).dId.get
        }
        var gerenciasMap = new java.util.HashMap[String, String]()
        if (division_Id == 0) {
          val gerencias = GenrenciaService.findAllGenrencias

          for (g <- gerencias) {
            gerenciasMap.put(g.dId.get.toString(), g.genrencia)
          }
        } else {
          val gerencias = GenrenciaService.findAllGenrenciaListByDivision(division_Id.toString())
          for (g <- gerencias) {
            gerenciasMap.put(g.dId.get.toString(), g.genrencia)
          }
        }
        var departmentsMap = new java.util.HashMap[String, String]()
        if (!oldForm.data.get("program_details.management").isEmpty && !oldForm.data.get("program_details.management").get.isEmpty()) {
          var gerencia_id = oldForm.data.get("program_details.management").get
          val departments = DepartmentService.findAllDepartmentListByGenrencia(gerencia_id)
          for (d <- departments) {
            departmentsMap.put(d.dId.get.toString(), d.department)
          }
        }
        BadRequest(views.html.frontend.program.editProgram(errors, id, usersMap, divisionMap, gerenciasMap, departmentsMap, programSubType, programType, workflowStatusValues)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      },
      program => {
        val theForm = ProgramService.validateForm(ARTForms.programFormEdit.fill(program), id)
        if (theForm.hasErrors) {
          val divisionObj = DivisionService.findDivisionByNameActiveAndInactive("Division Operaciones y Tecnologia")

          var division_Id = 0
          if (!divisionObj.isEmpty) {
            division_Id = divisionObj.apply(0).dId.get
          }
          var gerenciasMap = new java.util.HashMap[String, String]()
          if (division_Id == 0) {
            val gerencias = GenrenciaService.findAllGenrencias
            for (g <- gerencias) {
              gerenciasMap.put(g.dId.get.toString(), g.genrencia)
            }
          } else {
            val gerencias = GenrenciaService.findAllGenrenciaListByDivision(division_Id.toString())
            for (g <- gerencias) {
              gerenciasMap.put(g.dId.get.toString(), g.genrencia)
            }
          }
          var departmentsMap = new java.util.HashMap[String, String]()
          if (!oldForm.data.get("program_details.management").isEmpty && !oldForm.data.get("program_details.management").get.isEmpty()) {
            var gerencia_id = oldForm.data.get("program_details.management").get
            val departments = DepartmentService.findAllDepartmentListByGenrencia(gerencia_id)
            for (d <- departments) {
              departmentsMap.put(d.dId.get.toString(), d.department)
            }
          }
          BadRequest(views.html.frontend.program.editProgram(theForm, id, usersMap, divisionMap, gerenciasMap, departmentsMap, programSubType, programType, workflowStatusValues)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        } else {

          val dm = program.demand_manager
          val old_program_data = ProgramService.findProgramMasterDetailsById(id)

          var programDates = ProgramService.findProgramDateDetailsById(id)
          ProgramService.updateProgram(id, program)

          if (!old_program_data.isEmpty) {
            if (old_program_data.get.demand_manager != dm) {
              val projects = ProjectService.findProjectListForProgram(id)
              var isExist = false;
              for (p <- projects) {
                isExist = false;
                isExist = UserService.checkUserSettingbyuIdandpId(dm, p.pId.get)
                if (isExist) {
                  val projectmapping = UserSetting(dm.toLong, p.pId.get, 1)
                  UserService.saveUserSetting(projectmapping)
                }
              }
            }
          }

          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Program.id, "Program updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), Integer.parseInt(id))
          Activity.saveLog(act)

          var initiationPalnnedDateAfterUpdate: Date = null;
          var clouserDateAfterUpadate: Date = null;
          var releaseDateAfterUpdate: Date = null;

          if (program.program_dates.initiation_planned_date != null) {
            initiationPalnnedDateAfterUpdate = program.program_dates.initiation_planned_date;
          }
          if (program.program_dates.closure_date != null) {
            clouserDateAfterUpadate = program.program_dates.closure_date
          }

          if (program.program_dates.release_date != null) {
            releaseDateAfterUpdate = program.program_dates.release_date
          }
          ProgramService.programBasline(programDates, initiationPalnnedDateAfterUpdate, clouserDateAfterUpadate, releaseDateAfterUpdate, request.session.get("uId").get, id)
          Redirect(routes.Program.programDetails(id))
        }
      })
  }

  /**
   * Delete program details
   * Precondition - If no projects under the same program then only we can delete the Program
   *  id - program id
   */
  def deleteProgram(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val program = ProgramService.findProgramMasterDetailsById(id)
      var node = new JSONObject()
      var do_delete: Boolean = true
      val timesheetList = TimesheetService.getAllTimesheetIds()
      program match {
        case None =>
        case Some(p: ProgramMaster) =>
          val projectlist = ProjectService.findProjectIdListForProgramId(id)

          val timesheetList = TimesheetService.getAllTimesheetIds()

          for (project <- projectlist) {
            val tasklist = TaskService.findAllTaskIdListByProjectId(project.toString())
            for (task <- tasklist) {
              val subtask_list = SubTaskServices.findAllocatedSubTaskIdsByTask(task.toString())
              for (subtask <- subtask_list) {
                for (t <- timesheetList) {
                  if (t == subtask) {
                    do_delete = false
                  }
                }
              }

            }

          }

      }

      if (do_delete) {
        ProgramService.softDeleteProgram(id)
        /**
         * Activity log
         */
        val act = Activity(ActivityTypes.Program.id, "Program deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), Integer.parseInt(id))
        Activity.saveLog(act)
        node.put("status", "Success")

      } else {
        node.put("status", "Fail")
        node.put("message", "Time is booked against this program, you can not delete this program.")
      }
      Ok(node.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Find the genrencia list for program...
   */
  def getGenrenciaList = Action { implicit request =>
    val devision = request.getQueryString("devision").get.toString()
    var stateString = " <option value=''>--- Elija una Gerencia ---</option>"
    if (StringUtils.isNotEmpty(devision)) {
      val divisonList = GenrenciaService.findAllGenrenciaListByDivision(devision)
      for (d <- divisonList) {
        stateString += " <option value='" + d.dId.get + "'>" + d.genrencia + "</option>"
      }
    } else {
      /*val divisonList = GenrenciaService.findAllGenrencias()

      for (d <- divisonList) {
        stateString += " <option value='" + d.dId.get + "'>" + d.genrencia + "</option>"
      }*/
    }
    Ok(stateString)
  }

  /**
   * Find the genrencia and department list for program...
   */
  def getGenrenciaAndDepartmentList = Action { implicit request =>
    val devision = request.getQueryString("devision").get.toString()
    var gerentiaString = " <option value=''>--- Elija una Gerencia ---</option>"
    var deptIdString = ""
    var divisonList = GenrenciaService.findAllGenrencias()
    if (StringUtils.isNotEmpty(devision)) {
      divisonList = GenrenciaService.findAllGenrenciaListByDivision(devision)
      for (d <- divisonList) {
        gerentiaString += " <option value='" + d.dId.get + "'>" + d.genrencia + "</option>"
        deptIdString += d.dId.get + ","
      }
    } else {
      /*for (d <- divisonList) {
        gerentiaString += " <option value='" + d.dId.get + "'>" + d.genrencia + "</option>"
        deptIdString += d.dId.get + ","
      }*/
    }

    var departmentString = " <option value=''>--- Choose A Department ---</option>"
    if (!deptIdString.isEmpty) {
      deptIdString = deptIdString.trim().substring(0, deptIdString.length() - 1)
      val deptList = DepartmentService.findAllDepartmentsByGerentiaIds(deptIdString)
      if (!deptList.isEmpty) {
        for (dept <- deptList) {
          departmentString += " <option value='" + dept.dId.get + "'>" + dept.department + "</option>"
        }
      }
    }

    var node = new JSONObject()
    node.put("gerenciaMap", gerentiaString)
    node.put("departmentMap", departmentString)

    Ok(node.toString())
  }

  /**
   * find department list by genrencia...
   */
  def getDepartmentList = Action { implicit request =>
    val genrencia = request.getQueryString("gerencia").get.toString()
    var stateString = " <option value=''>--- Choose A Department ---</option>"
    if (StringUtils.isNotEmpty(genrencia)) {
      val divisonList = DepartmentService.findAllDepartmentListByGenrencia(genrencia)
      for (d <- divisonList) {
        stateString += " <option value='" + d.dId.get + "'>" + d.department + "</option>"
      }
    } else {
      /*val divisonList = DepartmentService.findAllDepartmentS()
      for (d <- divisonList) {
        stateString += " <option value='" + d.dId.get + "'>" + d.department + "</option>"
      }*/
    }
    Ok(stateString)
  }

  /**
   * calculate earn value for project...
   */
  def calculateProgramEarnValueAction(id: String) = Action { implicit request =>

    var node = new JSONObject()
    var calculos = SpiCpiCalculationsService.findIndicators(id, 2)
    for (s <- calculos) {

      node.put("EV", s.ev + " hrs")
      node.put("PV", s.pv + " hrs")
      node.put("AC", s.ac + " hrs")
      node.put("CPI", s.cpi)
      node.put("SPI", s.spi)
      node.put("ETC", s.etc + " hrs")
      node.put("EAC", s.eac + " hrs")
      node.put("PAI", s.pai + " %")
      node.put("PAE", s.pae + " %")
      node.put("HP", s.hp + " hrs")
      node.put("HA", s.ha + " hrs")
    }

    Ok(node.toString())
  }

  def graphDistributionInternalAction(id: String,pid: String) = Action { implicit request =>

    val calculos = DistributionTimeSheetService.distributionInternalTimeSheet(id,pid)

    Ok(play.api.libs.json.Json.toJson(calculos))
  }

  def graphDistributionExternalAction(id: String,pid: String) = Action { implicit request =>

    val calculos = DistributionTimeSheetService.distributionExternalTimeSheet(id,pid)

    Ok(play.api.libs.json.Json.toJson(calculos))
  }

  /**
   *
   */
  def trackProgram(programId: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var node = new JSONObject()
      val uId = Integer.parseInt(request.session.get("uId").get)
      val utype = Integer.parseInt(request.session.get("utype").get)
      val program = ProgramService.findProgramMasterDetailsById(programId)
      node = EarnValueService.calculateProgramEarnValue(programId)
      Ok(views.html.frontend.program.trackProgram(program, node)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Get program list for division
   * divsion -  Division id
   * divsion -  Division id
   *
   */
  def getProgramListForDivision(division: String) = Action { implicit request =>
    var finalString = ""
    var pr_name = ""
    val uId = request.session.get("uId").get
    if (!"NA".equals(division)) {
      val programs = ProgramService.findAllProgramsForDivision(division)
      //  val projects = UserService.findUserProjectsForUserProgram(uId, division)

      finalString = "<option value=''>--Select Program--</option>"
      for (p <- programs) {
        pr_name = ProgramService.findProgramMasterDetailsById(p.program_id.toString()).get.program_name
        if (pr_name.length() > 35) {
          pr_name = pr_name.substring(0, 35) + "..."
        }
        finalString = finalString + " <option value='" + p.program_id + "'>" + pr_name + "</option>"
      }
    } else {
      val programs = ProgramService.findAllProgramList()

      //  val projects = UserService.findUserProjectsForUserProgram(uId, division)
      finalString = "<option value=''>--Select Program--</option>"
      for (p <- programs) {
        pr_name = ProgramService.findProgramMasterDetailsById(p.program_id.toString()).get.program_name
        if (pr_name.length() > 35) {
          pr_name = pr_name.substring(0, 35) + "..."
        }
        finalString = finalString + " <option value='" + p.program_id + "'>" + pr_name + "</option>"
      }
    }
    Ok(finalString)
  }

  /**
   *
   */
  def projectGanttChart = Action { implicit request =>
    request.session.get("username").map { user =>
      val uId = request.session.get("uId").get
      val project_id = request.getQueryString("id").get
      var jsonArr = ProjectService.getProjectGanttChart(project_id, uId)
      Ok(jsonArr.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def exportToExcel(programId: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val uId = Integer.parseInt(request.session.get("uId").get)
      val utype = Integer.parseInt(request.session.get("utype").get)
      ExportToExcel.exportExcelByProgramId(programId)
      Redirect(routes.Program.programDetails(programId))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def newMembers(program_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      if (StringUtils.isNotEmpty(program_id)) {
        var programRoles = new java.util.LinkedHashMap[String, String]()
        //var userMap = new java.util.HashMap[String, String]()

        val roles = UserRoleService.findAllUserRoles()
        for (r <- roles) {
          programRoles.put(r.rId.get.toString(), r.role)
        }
        var userMap = new java.util.LinkedHashMap[String, String]()
        /*
        val users = UserService.findAllUsers
        for (u <- users) {
          userMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
        }
           */
        //val user_periods = 	ProgramMemberService.findPeriods(program_id)				
        val progrma_members = ProgramMemberService.findActiveProgramMember(program_id)
        val externalEmployees = ProgramMemberExternalService.findProgramMemberExternalByProgramId(program_id);
        Ok(views.html.frontend.program.newMember(program_id, ARTForms.program_members, programRoles, userMap, progrma_members, externalEmployees)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      } else {
        Redirect(routes.Login.loginUser())
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getUserProgramAvailability() = Action { implicit request =>
    request.session.get("username").map { user =>
      val program_id = request.body.asFormUrlEncoded.get("program_id")(0).toString().trim()
      val member_id = request.body.asFormUrlEncoded.get("member_id")(0).toString().trim()
      val availability = ProgramMemberService.findProgramUserAvailability(program_id, member_id)
      Ok(play.api.libs.json.Json.toJson(availability));
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def editMembersCapacity(mid: Int) = Action { implicit request =>

    val member_capacity = ProgramMemberService.listMemberAvailability(mid)
    //println("RT: " + member_capacity)
    Ok(play.api.libs.json.Json.toJson(member_capacity))
  }

  def updateMembersCapacity = Action { implicit request =>
    request.session.get("username").map { user =>
      val id = request.getQueryString("id").get.toString()
      val oper = request.getQueryString("oper").get.toString()
      //val mid= request.getQueryString("id_program_members").get.toInt
      val porcentaje = request.getQueryString("porcentaje").get.toString()
      //println(mid)
      val upadate_member_capacity = ProgramMemberService.updateMemberAvailability(id, porcentaje)
      //val member_capacity = ProgramMemberService.listMemberAvailability(mid)
      //println(member_capacity)
      Ok("ok")
    }.getOrElse {
      Redirect(routes.Login.loginUser()).withNewSession
    }
  }

  def saveMembers(program_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var programRoles = new java.util.LinkedHashMap[String, String]()
      var userMap = new java.util.LinkedHashMap[String, String]()
      val roles = UserRoleService.findAllUserRoles()
      for (r <- roles) {
        programRoles.put(r.rId.get.toString(), r.role)
      }
      val users = UserService.findAllUsers
      for (u <- users) {
        userMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
      }
      val progrma_members = ProgramMemberService.findActiveProgramMember(program_id)
      ARTForms.program_members.bindFromRequest.fold(
        errors => {
          val externalEmployees = ProgramMemberExternalService.findProgramMemberExternalByProgramId(program_id);
          //val user_periods = 	ProgramMemberService.findPeriods(program_id)
          BadRequest(views.html.frontend.program.newMember(program_id, errors, programRoles, userMap, progrma_members, externalEmployees)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        },
        program_member => {
          val theForm = ProgramMemberService.validateProgramMember(ARTForms.program_members.fill(program_member))
          if (theForm.hasErrors) {

            val role_id = theForm.data.get("role_id").get
            var userMap = new java.util.LinkedHashMap[String, String]()
            var userList = UserService.findUsersFromRole(role_id);
            for (u <- userList) {
              userMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
            }
            val externalEmployees = ProgramMemberExternalService.findProgramMemberExternalByProgramId(program_id);
            //val user_periods = 	ProgramMemberService.findPeriods(program_id)
            BadRequest(views.html.frontend.program.newMember(program_id, theForm, programRoles, userMap, progrma_members, externalEmployees)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
          } else {
            println("program_member.pData : " + program_member.pData)
            //val pms = ProgramMembers(None, program_member.program_id, program_member.role_id, program_member.member_id, program_member.is_active,program_member.pData)
            //println("program_member.role_id : " + program_member.role_id)
            //println("program_member.member_id : " + program_member.member_id)
            val pms = ProgramMembers(None, program_member.program_id, program_member.member_id, program_member.role_id, program_member.is_active, program_member.pData)
            val last = ProgramMemberService.insertProgramMemberDetails(pms)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Program_Member.id, "Program Member added by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
            Activity.saveLog(act)
            Redirect(routes.Program.newMembers(program_id))
          }

        })
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateMember(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val pm_details = ProgramMemberService.findProgramMemberDetails(id)

      var program_id = 0
      var program_member: models.ProgramMembers = null
      if (!pm_details.isEmpty) {
        if (pm_details.get.is_active == 0) {
          program_member = ProgramMembers(pm_details.get.id, pm_details.get.program_id, pm_details.get.role_id, pm_details.get.member_id, 1, "")
        } else {
          program_member = ProgramMembers(pm_details.get.id, pm_details.get.program_id, pm_details.get.role_id, pm_details.get.member_id, 0, "")
        }
        ProgramMemberService.updateProgramMemberDetails(program_member)
        /**
         * Activity log
         */
        val act = Activity(ActivityTypes.Program_Member.id, "Program Member updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), pm_details.get.id.get)
        Activity.saveLog(act)
        Ok("Success")

      } else {
        Ok("Fail")
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateMemberExternal(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val pm_details = ProgramMemberService.findExternalProgramMemberDetails(id)
      //id: Option[Int], program_id: Int, provider_type: Int, provider_name: String, resource_name: Option[String], number_of_resources: Option[Int],
      // control_field1 : Option[String], control_field2 : Option[String], created_by : Int, creation_date : Date, updation_date : Date, is_deleted : Int )

      var program_id = 0
      var program_member: models.ProgramMembersExternal = null
      if (!pm_details.isEmpty) {
        if (pm_details.get.is_deleted == 0) {
          program_member = ProgramMembersExternal(pm_details.get.id, pm_details.get.program_id, pm_details.get.provider_type, pm_details.get.provider_name, pm_details.get.resource_name, pm_details.get.number_of_resources, pm_details.get.control_field1, pm_details.get.control_field2, pm_details.get.created_by, pm_details.get.creation_date, new Date(), 1)
        } else {
          program_member = ProgramMembersExternal(pm_details.get.id, pm_details.get.program_id, pm_details.get.provider_type, pm_details.get.provider_name, pm_details.get.resource_name, pm_details.get.number_of_resources, pm_details.get.control_field1, pm_details.get.control_field2, pm_details.get.created_by, pm_details.get.creation_date, new Date(), 0)
        }
        ProgramMemberService.updateExternalProgramMemberDetails(program_member)
        /**
         * Activity log
         */
        val act = Activity(ActivityTypes.Program_Member.id, "Program Member External updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), pm_details.get.id.get)
        Activity.saveLog(act)
        Ok("Success")

      } else {
        Ok("Fail")
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def newSAP(program_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      if (StringUtils.isNotEmpty(program_id)) {
        var bts = new java.util.LinkedHashMap[String, String]()
        val bType = BudgetTypeService.findActiveBudgetTypes
        for (b <- bType) {
          bts.put(b.id.get.toString(), b.budget_type)
        }

        val planned_value = ProgramService.getPlannedHoursForProgram(program_id)

        //val newForm = ARTForms.sap_form.fill()

        Ok(views.html.frontend.program.newSAP(program_id, ARTForms.sap_form, bts, planned_value)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      } else {
        Redirect(routes.Login.loginUser())
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def saveSAP(program_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var bts = new java.util.LinkedHashMap[String, String]()
      val bType = BudgetTypeService.findActiveBudgetTypes
      for (b <- bType) {
        bts.put(b.id.get.toString(), b.budget_type)
      }
      var ph: Double = 0

      var oldForm = ARTForms.sap_form.bindFromRequest
      var otherForm = ARTForms.sap_form.bindFromRequest

      var investment_hardware: Option[Long] = None
      if (!oldForm.data.get("investment.investment_hardware").get.isEmpty) {
        val investment_hardwareStr = oldForm.data.get("investment.investment_hardware").get.replaceAll("\\.+", "")
        investment_hardware = Option(investment_hardwareStr.toLong)
      }
      var investment_software: Option[Long] = None
      if (!oldForm.data.get("investment.investment_software").get.isEmpty) {
        val investment_softwareStr = oldForm.data.get("investment.investment_software").get.replaceAll("\\.+", "")
        investment_software = Option(investment_softwareStr.toLong)
      }
      var investment_telecommunication: Option[Long] = None
      if (!oldForm.data.get("investment.investment_telecommunication").get.isEmpty) {
        val investment_telecommunicationStr = oldForm.data.get("investment.investment_telecommunication").get.replaceAll("\\.+", "")
        investment_telecommunication = Option(investment_telecommunicationStr.toLong)
      }

      var investment_development: Option[Long] = None
      if (!oldForm.data.get("investment.investment_development").get.isEmpty) {
        val investment_developmentStr = oldForm.data.get("investment.investment_development").get.replaceAll("\\.+", "")
        investment_development = Option(investment_developmentStr.toLong)
      }

      var investment_other: Option[Long] = None
      if (!oldForm.data.get("investment.investment_other").get.isEmpty) {
        val investment_otherStr = oldForm.data.get("investment.investment_other").get.replaceAll("\\.+", "")
        investment_other = Option(investment_otherStr.toLong)
      }

      var investment_qa: Option[Long] = None
      if (!oldForm.data.get("investment.investment_qa").get.isEmpty) {
        val investment_qaStr = oldForm.data.get("investment.investment_qa").get.replaceAll("\\.+", "")
        investment_qa = Option(investment_qaStr.toLong)
      }

      var investment_improvements: Option[Long] = None
      if (!oldForm.data.get("investment.investment_improvements").get.isEmpty) {
        val investment_improvementsStr = oldForm.data.get("investment.investment_improvements").get.replaceAll("\\.+", "")
        investment_improvements = Option(investment_improvementsStr.toLong)
      }

      var investment_recurring_first: Option[Long] = None
      if (!oldForm.data.get("investment.investment_recurring_first").get.isEmpty) {
        val investment_recurring_firstStr = oldForm.data.get("investment.investment_recurring_first").get.replaceAll("\\.+", "")
        investment_recurring_first = Option(investment_recurring_firstStr.toLong)
      }

      val invst = Investment(investment_hardware, investment_software, investment_telecommunication,
        investment_development, investment_other, investment_qa,
        investment_improvements, investment_recurring_first)

      var investmentValid = true
      if (investment_hardware.getOrElse(0) == 0 && investment_software.getOrElse(0) == 0 && investment_telecommunication.getOrElse(0) == 0
        && investment_development.getOrElse(0) == 0 && investment_other.getOrElse(0) == 0 && investment_qa.getOrElse(0) == 0
        && investment_improvements.getOrElse(0) == 0 && investment_recurring_first.getOrElse(0) == 0) {
        investmentValid = false
      }

      var expenditure_hardware: Option[Long] = None
      if (!oldForm.data.get("expenditure.expenditure_hardware").get.isEmpty) {
        val expenditure_hardwareStr = oldForm.data.get("expenditure.expenditure_hardware").get.replaceAll("\\.+", "")
        expenditure_hardware = Option(expenditure_hardwareStr.toLong)
      }
      var expenditure_software: Option[Long] = None
      if (!oldForm.data.get("expenditure.expenditure_software").get.isEmpty) {
        val expenditure_softwareStr = oldForm.data.get("expenditure.expenditure_software").get.replaceAll("\\.+", "")
        expenditure_software = Option(expenditure_softwareStr.toLong)
      }
      var expenditure_telecommunication: Option[Long] = None
      if (!oldForm.data.get("expenditure.expenditure_telecommunication").get.isEmpty) {
        val expenditure_telecommunicationStr = oldForm.data.get("expenditure.expenditure_telecommunication").get.replaceAll("\\.+", "")
        expenditure_telecommunication = Option(expenditure_telecommunicationStr.toLong)
      }

      var expenditure_development: Option[Long] = None
      if (!oldForm.data.get("expenditure.expenditure_development").get.isEmpty) {
        val expenditure_developmentStr = oldForm.data.get("expenditure.expenditure_development").get.replaceAll("\\.+", "")
        expenditure_development = Option(expenditure_developmentStr.toLong)
      }

      var expenditure_other: Option[Long] = None
      if (!oldForm.data.get("expenditure.expenditure_other").get.isEmpty) {
        val expenditure_otherStr = oldForm.data.get("expenditure.expenditure_other").get.replaceAll("\\.+", "")
        expenditure_other = Option(expenditure_otherStr.toLong)
      }

      var expenditure_qa: Option[Long] = None
      if (!oldForm.data.get("expenditure.expenditure_qa").get.isEmpty) {
        val expenditure_qaStr = oldForm.data.get("expenditure.expenditure_qa").get.replaceAll("\\.+", "")
        expenditure_qa = Option(expenditure_qaStr.toLong)
      }

      var expenditure_improvements: Option[Long] = None
      if (!oldForm.data.get("expenditure.expenditure_improvements").get.isEmpty) {
        val expenditure_improvementsStr = oldForm.data.get("expenditure.expenditure_improvements").get.replaceAll("\\.+", "")
        expenditure_improvements = Option(expenditure_improvementsStr.toLong)
      }

      var expenditure_recurring_first: Option[Long] = None
      if (!oldForm.data.get("expenditure.expenditure_recurring_first").get.isEmpty) {
        val expenditure_recurring_firstStr = oldForm.data.get("expenditure.expenditure_recurring_first").get.replaceAll("\\.+", "")
        expenditure_recurring_first = Option(expenditure_recurring_firstStr.toLong)
      }

      val expds = Expenditure(expenditure_hardware, expenditure_software, expenditure_telecommunication,
        expenditure_development, expenditure_other, expenditure_qa,
        expenditure_improvements, expenditure_recurring_first)

      var expenseValid = true
      if (expenditure_hardware.getOrElse(0) == 0 && expenditure_software.getOrElse(0) == 0 && expenditure_telecommunication.getOrElse(0) == 0
        && expenditure_development.getOrElse(0) == 0 && expenditure_other.getOrElse(0) == 0 && expenditure_qa.getOrElse(0) == 0
        && expenditure_improvements.getOrElse(0) == 0 && expenditure_recurring_first.getOrElse(0) == 0) {
        expenseValid = false
      }

      var isValidSAP = false
      if (investmentValid || expenseValid) {
        isValidSAP = true
      }

      // val sap_number = oldForm.data.get("sap_number").get.toInt

      var sap_number: Int = 0
      if (!oldForm.data.get("sap_number").get.isEmpty) {
        sap_number = oldForm.data.get("sap_number").get.toInt
      }

      var budget_type: Int = 0
      if (!oldForm.data.get("budget_type").get.isEmpty) {
        budget_type = oldForm.data.get("budget_type").get.toInt
      }
      var cui1 = ""
      if (!oldForm.data.get("cui1").get.isEmpty) {
        cui1 = oldForm.data.get("cui1").get.trim()
      }
      var cui1_per: Double = 0.0
      if (!oldForm.data.get("cui1_per").get.isEmpty) {
        cui1_per = oldForm.data.get("cui1_per").get.toDouble
      }
      var cui2 = ""
      if (!oldForm.data.get("cui2").get.isEmpty) {
        cui2 = oldForm.data.get("cui2").get.trim()
      }
      var cui2_per: Double = 0.0
      if (!oldForm.data.get("cui2_per").get.isEmpty) {
        cui2_per = oldForm.data.get("cui2_per").get.toDouble
      }
      var approved_date: Option[Date] = None
      if (oldForm.data.get("approved_date").isDefined && !oldForm.data.get("approved_date").get.trim().isEmpty) {
        val string = oldForm.data.get("approved_date").get.trim();
        val format = new SimpleDateFormat("dd-MM-yyyy");
        val date = format.parse(string);
        approved_date = Option(date)
      } else {
        approved_date = None
      }
      var comitted_date: Option[Date] = None
      if (oldForm.data.get("comitted_date").isDefined && !oldForm.data.get("comitted_date").get.trim().isEmpty) {
        val string = oldForm.data.get("comitted_date").get.trim();
        val format = new SimpleDateFormat("dd-MM-yyyy");
        val date = format.parse(string);
        comitted_date = Option(date)
      } else {
        comitted_date = None
      }
      val sap = SAPMaster(program_id.toInt, sap_number, budget_type, cui1, cui1_per, cui2, cui2_per, invst, expds, 1, None, None, None, approved_date, comitted_date)
      oldForm = oldForm.fill(sap)
      oldForm.fold(
        errors => {
          var newForm = errors
          newForm = SAPServices.validateSAPForm(oldForm.fill(sap), program_id, "", otherForm, isValidSAP)
          BadRequest(views.html.frontend.program.newSAP(program_id, newForm, bts, ph)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        },
        sap_member => {
          val theForm = SAPServices.validateSAPForm(ARTForms.sap_form.fill(sap), program_id, "", otherForm, isValidSAP)
          if (theForm.hasErrors) {
            BadRequest(views.html.frontend.program.newSAP(program_id, theForm, bts, ph)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
          } else {
            val last_index = SAPServices.insertSAP(sap_member)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Program_Sap.id, "Program SAP created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last_index.toInt)
            Activity.saveLog(act)
            Redirect(routes.Program.newSAP(program_id))
          }

        })

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def editSAP(sap_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      if (StringUtils.isNotEmpty(sap_id)) {
        val sapMaster = SAPServices.findSAPMasterDetails(sap_id)
        val sap_Invest = SAPServices.findSAPInvestmentDetails(sap_id)
        val sap_expend = SAPServices.findSAPExpenditureDetails(sap_id)

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

        if (!sap_Invest.isEmpty) {
          if (!sap_Invest.get.hardware.isEmpty) {
            current_i_hardware = sap_Invest.get.hardware.get
          }

          if (!sap_Invest.get.software.isEmpty)
            current_i_software = sap_Invest.get.software.get

          if (!sap_Invest.get.telecommunication.isEmpty)
            current_i_telecommunication = sap_Invest.get.telecommunication.get

          if (!sap_Invest.get.development.isEmpty)
            current_i_development = sap_Invest.get.development.get

          if (!sap_Invest.get.other.isEmpty)
            current_i_other = sap_Invest.get.other.get

          if (!sap_Invest.get.qa.isEmpty)
            current_i_qa = sap_Invest.get.qa.get

          if (!sap_Invest.get.improvements.isEmpty)
            current_i_improvements = sap_Invest.get.improvements.get

          if (!sap_Invest.get.recurring_first.isEmpty)
            current_i_recurring_first = sap_Invest.get.recurring_first.get

        }

        val invest = Investment(Option(current_i_hardware), Option(current_i_software), Option(current_i_telecommunication),
          Option(current_i_development), Option(current_i_other), Option(current_i_qa), Option(current_i_improvements), Option(current_i_recurring_first))

        if (!sap_expend.isEmpty) {
          if (!sap_expend.get.hardware.isEmpty)
            current_e_hardware = sap_expend.get.hardware.get

          if (!sap_expend.get.software.isEmpty)
            current_e_software = sap_expend.get.software.get

          if (!sap_expend.get.telecommunication.isEmpty)
            current_e_telecommunication = sap_expend.get.telecommunication.get

          if (!sap_expend.get.development.isEmpty)
            current_e_development = sap_expend.get.development.get

          if (!sap_expend.get.other.isEmpty)
            current_e_other = sap_expend.get.other.get

          if (!sap_expend.get.qa.isEmpty)
            current_e_qa = sap_expend.get.qa.get

          if (!sap_expend.get.improvements.isEmpty)
            current_e_improvements = sap_expend.get.improvements.get

          if (!sap_expend.get.recurring_first.isEmpty)
            current_e_recurring_first = sap_expend.get.recurring_first.get

        }

        val expend = Expenditure(Option(current_e_hardware), Option(current_e_software), Option(current_e_telecommunication),
          Option(current_e_development), Option(current_e_other), Option(current_e_qa), Option(current_e_improvements), Option(current_e_recurring_first))

        val objSAP = SAPMaster(sapMaster.get.program_id, sapMaster.get.sap_number, sapMaster.get.budget_type, sapMaster.get.cui1,
          sapMaster.get.cui1_per, sapMaster.get.cui2, sapMaster.get.cui2_per, invest, expend, sapMaster.get.is_active, sapMaster.get.creation_date, sapMaster.get.last_update, sapMaster.get.planned_hours, sapMaster.get.approved_date, sapMaster.get.comitted_date)

        var bts = new java.util.LinkedHashMap[String, String]()
        val bType = BudgetTypeService.findActiveBudgetTypes
        for (b <- bType) {
          bts.put(b.id.get.toString(), b.budget_type)
        }

        val program_id = sapMaster.get.program_id.toString()
        val planned_value = ProgramService.getPlannedHoursForProgram(program_id)

        var valueMap = new java.util.LinkedHashMap[String, String]()

        val hardware = SAPServices.getHardwareSAPDetails(sap_id)
        if (!hardware.isEmpty) {
          valueMap.put("paid_investment_hardware", hardware.get.paid_investment_hardware.getOrElse("0").toString())
          valueMap.put("paid_expenditure_hardware", hardware.get.paid_expenditure_hardware.getOrElse("0").toString())
          valueMap.put("paid_investment_hardware", hardware.get.paid_investment_hardware.getOrElse("0").toString())
          valueMap.put("committed_investment_hardware", hardware.get.committed_investment_hardware.getOrElse("0").toString())
          valueMap.put("committed_expenditure_hardware", hardware.get.committed_expenditure_hardware.getOrElse("0").toString())
          valueMap.put("non_committed_investment_hardware", hardware.get.non_committed_investment_hardware.getOrElse("0").toString())
          valueMap.put("non_committed_expenditure_hardware", hardware.get.non_committed_expenditure_hardware.getOrElse("0").toString())
          //valueMap.put("available_investment_hardware", hardware.get.available_investment_hardware.getOrElse("0").toString())
          //valueMap.put("available_expenditure_hardware", hardware.get.available_expenditure_hardware.getOrElse("0").toString())
          var available: Long = 0
          if (current_e_hardware >= 0) {
            available = current_e_hardware - (hardware.get.paid_expenditure_hardware.getOrElse("0").toString().toLong + hardware.get.committed_expenditure_hardware.getOrElse("0").toString().toLong + hardware.get.non_committed_expenditure_hardware.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_expenditure_hardware", available.toString())

          available = 0
          if (current_i_hardware >= 0) {
            available = current_i_hardware - (hardware.get.paid_investment_hardware.getOrElse("0").toString().toLong + hardware.get.committed_investment_hardware.getOrElse("0").toString().toLong + hardware.get.non_committed_investment_hardware.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_investment_hardware", available.toString())
        }

        val software = SAPServices.getSoftwareSAPDetails(sap_id)
        if (!software.isEmpty) {
          valueMap.put("paid_investment_software", software.get.paid_investment_software.getOrElse("0").toString())
          valueMap.put("paid_expenditure_software", software.get.paid_expenditure_software.getOrElse("0").toString())
          valueMap.put("paid_investment_software", software.get.paid_investment_software.getOrElse("0").toString())
          valueMap.put("committed_investment_software", software.get.committed_investment_software.getOrElse("0").toString())
          valueMap.put("committed_expenditure_software", software.get.committed_expenditure_software.getOrElse("0").toString())
          valueMap.put("non_committed_investment_software", software.get.non_committed_investment_software.getOrElse("0").toString())
          valueMap.put("non_committed_expenditure_software", software.get.non_committed_expenditure_software.getOrElse("0").toString())
          //valueMap.put("available_investment_software", software.get.available_investment_software.getOrElse("0").toString())
          //valueMap.put("available_expenditure_software", software.get.available_expenditure_software.getOrElse("0").toString())

          var available: Long = 0
          if (current_e_software >= 0) {
            available = current_e_software - (software.get.paid_expenditure_software.getOrElse("0").toString().toLong + software.get.committed_expenditure_software.getOrElse("0").toString().toLong + software.get.non_committed_expenditure_software.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_expenditure_software", available.toString())

          available = 0
          if (current_i_software >= 0) {
            available = current_i_software - (software.get.paid_investment_software.getOrElse("0").toString().toLong + software.get.committed_investment_software.getOrElse("0").toString().toLong + software.get.non_committed_investment_software.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_investment_software", available.toString())

        }

        val development = SAPServices.getDevelopemntSAPDetails(sap_id)
        if (!development.isEmpty) {
          valueMap.put("paid_investment_development", development.get.paid_investment_development.getOrElse("0").toString())
          valueMap.put("paid_expenditure_development", development.get.paid_expenditure_development.getOrElse("0").toString())
          valueMap.put("paid_investment_development", development.get.paid_investment_development.getOrElse("0").toString())
          valueMap.put("committed_investment_development", development.get.committed_investment_development.getOrElse("0").toString())
          valueMap.put("committed_expenditure_development", development.get.committed_expenditure_development.getOrElse("0").toString())
          valueMap.put("non_committed_investment_development", development.get.non_committed_investment_development.getOrElse("0").toString())
          valueMap.put("non_committed_expenditure_development", development.get.non_committed_expenditure_development.getOrElse("0").toString())
          //valueMap.put("available_investment_development", development.get.available_investment_development.getOrElse("0").toString())
          //valueMap.put("available_expenditure_development", development.get.available_expenditure_development.getOrElse("0").toString())

          var available: Long = 0
          if (current_e_development >= 0) {
            available = current_e_development - (development.get.paid_expenditure_development.getOrElse("0").toString().toLong + development.get.committed_expenditure_development.getOrElse("0").toString().toLong + development.get.non_committed_expenditure_development.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_expenditure_development", available.toString())

          available = 0
          if (current_i_development >= 0) {
            available = current_i_development - (development.get.paid_investment_development.getOrElse("0").toString().toLong + development.get.committed_investment_development.getOrElse("0").toString().toLong + development.get.non_committed_investment_development.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_investment_development", available.toString())

        }

        val improvements = SAPServices.getImprovementsSAPDetails(sap_id)
        if (!improvements.isEmpty) {
          valueMap.put("paid_investment_improvements", improvements.get.paid_expenditure_improvements.getOrElse("0").toString())
          valueMap.put("paid_expenditure_improvements", improvements.get.paid_expenditure_improvements.getOrElse("0").toString())
          valueMap.put("paid_investment_improvements", improvements.get.paid_investment_improvements.getOrElse("0").toString())
          valueMap.put("committed_investment_improvements", improvements.get.committed_investment_improvements.getOrElse("0").toString())
          valueMap.put("committed_expenditure_improvements", improvements.get.committed_expenditure_improvements.getOrElse("0").toString())
          valueMap.put("non_committed_investment_improvements", improvements.get.non_committed_investment_improvements.getOrElse("0").toString())
          valueMap.put("non_committed_expenditure_improvements", improvements.get.non_committed_expenditure_improvements.getOrElse("0").toString())
          //valueMap.put("available_investment_improvements", improvements.get.available_investment_improvements.getOrElse("0").toString())
          //valueMap.put("available_expenditure_improvements", improvements.get.available_expenditure_improvements.getOrElse("0").toString())

          var available: Long = 0
          if (current_e_improvements >= 0) {
            available = current_e_improvements - (improvements.get.paid_expenditure_improvements.getOrElse("0").toString().toLong + improvements.get.committed_expenditure_improvements.getOrElse("0").toString().toLong + improvements.get.non_committed_expenditure_improvements.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_expenditure_improvements", available.toString())

          available = 0
          if (current_i_improvements >= 0) {
            available = current_i_improvements - (improvements.get.paid_investment_improvements.getOrElse("0").toString().toLong + improvements.get.committed_investment_improvements.getOrElse("0").toString().toLong + improvements.get.non_committed_investment_improvements.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_investment_improvements", available.toString())
        }

        val other = SAPServices.getOtherSAPDetails(sap_id)
        if (!other.isEmpty) {
          valueMap.put("paid_investment_other", other.get.paid_investment_other.getOrElse("0").toString())
          valueMap.put("paid_expenditure_other", other.get.paid_expenditure_other.getOrElse("0").toString())
          //valueMap.put("paid_investment_other", other.get.paid_investment_other.getOrElse("0").toString())
          valueMap.put("committed_investment_other", other.get.committed_investment_other.getOrElse("0").toString())
          valueMap.put("committed_expenditure_other", other.get.committed_expenditure_other.getOrElse("0").toString())
          valueMap.put("non_committed_investment_other", other.get.non_committed_investment_other.getOrElse("0").toString())
          valueMap.put("non_committed_expenditure_other", other.get.non_committed_expenditure_other.getOrElse("0").toString())

          //valueMap.put("available_investment_other", other.get.available_investment_other.getOrElse("0").toString())
          var available: Long = 0
          if (current_e_other >= 0) {
            available = current_e_other - (other.get.paid_expenditure_other.getOrElse("0").toString().toLong + other.get.committed_expenditure_other.getOrElse("0").toString().toLong + other.get.non_committed_expenditure_other.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_expenditure_other", available.toString())

          available = 0
          if (current_i_other >= 0) {
            //println(current_i_other)
            //println(other.get.paid_investment_other.getOrElse("0").toString())
            //println(other.get.committed_investment_other.getOrElse("0"))
            //println(other.get.non_committed_investment_other.getOrElse("0").toString())
            available = current_i_other - (other.get.paid_investment_other.getOrElse("0").toString().toLong + other.get.committed_investment_other.getOrElse("0").toString().toLong + other.get.non_committed_investment_other.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_investment_other", available.toString())
        }

        val qa = SAPServices.getQASAPDetails(sap_id)
        if (!qa.isEmpty) {
          valueMap.put("paid_investment_qa", qa.get.paid_investment_qa.getOrElse("0").toString())
          valueMap.put("paid_expenditure_qa", qa.get.paid_expenditure_qa.getOrElse("0").toString())
          // valueMap.put("paid_investment_qa", qa.get.paid_investment_qa.getOrElse("0").toString())
          valueMap.put("committed_investment_qa", qa.get.committed_investment_qa.getOrElse("0").toString())
          valueMap.put("committed_expenditure_qa", qa.get.committed_expenditure_qa.getOrElse("0").toString())
          valueMap.put("non_committed_investment_qa", qa.get.non_committed_investment_qa.getOrElse("0").toString())
          valueMap.put("non_committed_expenditure_qa", qa.get.non_committed_expenditure_qa.getOrElse("0").toString())
          //valueMap.put("available_investment_qa", qa.get.available_investment_qa.getOrElse("0").toString())
          // valueMap.put("available_expenditure_qa", qa.get.available_expenditure_qa.getOrElse("0").toString())
          var available: Long = 0

          if (current_e_qa >= 0) {
            available = current_e_qa - (qa.get.paid_expenditure_qa.getOrElse("0").toString().toLong + qa.get.committed_expenditure_qa.getOrElse("0").toString().toLong + qa.get.non_committed_expenditure_qa.getOrElse("0").toString().toLong)

          }
          valueMap.put("available_expenditure_qa", available.toString())

          available = 0
          if (current_i_qa >= 0) {
            available = current_i_qa - (qa.get.paid_investment_qa.getOrElse("0").toString().toLong + qa.get.committed_investment_qa.getOrElse("0").toString().toLong + qa.get.non_committed_investment_qa.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_investment_qa", available.toString())
        }

        val recurring_first = SAPServices.getRecurringSAPDetails(sap_id)
        if (!recurring_first.isEmpty) {
          valueMap.put("paid_investment_recurring_first", recurring_first.get.paid_expenditure_recurring_first.getOrElse("0").toString())
          valueMap.put("paid_expenditure_recurring_first", recurring_first.get.paid_expenditure_recurring_first.getOrElse("0").toString())
          valueMap.put("paid_investment_recurring_first", recurring_first.get.paid_investment_recurring_first.getOrElse("0").toString())
          valueMap.put("committed_investment_recurring_first", recurring_first.get.committed_investment_recurring_first.getOrElse("0").toString())
          valueMap.put("committed_expenditure_recurring_first", recurring_first.get.committed_expenditure_recurring_first.getOrElse("0").toString())
          valueMap.put("non_committed_investment_recurring_first", recurring_first.get.non_committed_investment_recurring_first.getOrElse("0").toString())
          valueMap.put("non_committed_expenditure_recurring_first", recurring_first.get.non_committed_expenditure_recurring_first.getOrElse("0").toString())
          //valueMap.put("available_investment_recurring_first", recurring_first.get.available_investment_recurring_first.getOrElse("0").toString())
          //  valueMap.put("available_expenditure_recurring_first", recurring_first.get.available_expenditure_recurring_first.getOrElse("0").toString())
          var available: Long = 0
          if (current_e_recurring_first >= 0) {
            available = current_e_recurring_first - (recurring_first.get.paid_expenditure_recurring_first.getOrElse("0").toString().toLong + recurring_first.get.committed_expenditure_recurring_first.getOrElse("0").toString().toLong + recurring_first.get.non_committed_expenditure_recurring_first.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_expenditure_recurring_first", available.toString())

          available = 0
          if (current_i_recurring_first >= 0) {
            available = current_i_recurring_first - (recurring_first.get.paid_investment_recurring_first.getOrElse("0").toString().toLong + recurring_first.get.committed_investment_recurring_first.getOrElse("0").toString().toLong + recurring_first.get.non_committed_investment_recurring_first.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_investment_recurring_first", available.toString())
        }

        val telecommunication = SAPServices.getTelecommunicationSAPDetails(sap_id)
        if (!telecommunication.isEmpty) {
          valueMap.put("paid_investment_telecommunication", telecommunication.get.paid_expenditure_telecommunication.getOrElse("0").toString())
          valueMap.put("paid_expenditure_telecommunication", telecommunication.get.paid_expenditure_telecommunication.getOrElse("0").toString())
          valueMap.put("paid_investment_telecommunication", telecommunication.get.paid_investment_telecommunication.getOrElse("0").toString())
          valueMap.put("committed_investment_telecommunication", telecommunication.get.committed_investment_telecommunication.getOrElse("0").toString())
          valueMap.put("committed_expenditure_telecommunication", telecommunication.get.committed_expenditure_telecommunication.getOrElse("0").toString())
          valueMap.put("non_committed_investment_telecommunication", telecommunication.get.non_committed_investment_telecommunication.getOrElse("0").toString())
          valueMap.put("non_committed_expenditure_telecommunication", telecommunication.get.non_committed_expenditure_telecommunication.getOrElse("0").toString())
          // valueMap.put("available_investment_telecommunication", telecommunication.get.available_investment_telecommunication.getOrElse("0").toString())
          //   valueMap.put("available_expenditure_telecommunication", telecommunication.get.available_expenditure_telecommunication.getOrElse("0").toString())
          var available: Long = 0
          if (current_e_telecommunication >= 0) {
            available = current_e_telecommunication - (telecommunication.get.paid_expenditure_telecommunication.getOrElse("0").toString().toLong + telecommunication.get.committed_expenditure_telecommunication.getOrElse("0").toString().toLong + telecommunication.get.non_committed_expenditure_telecommunication.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_expenditure_telecommunication", available.toString())

          available = 0
          if (current_i_telecommunication >= 0) {
            available = current_i_telecommunication - (telecommunication.get.paid_investment_telecommunication.getOrElse("0").toString().toLong + telecommunication.get.committed_investment_telecommunication.getOrElse("0").toString().toLong + telecommunication.get.non_committed_investment_telecommunication.getOrElse("0").toString().toLong)
          }
          valueMap.put("available_investment_telecommunication", available.toString())
        }
        //println("user_profile : " + request.session.get("user_profile").get)
        Ok(views.html.frontend.program.editSAP(sapMaster.get.program_id.toString, sap_id, ARTForms.sap_form.fill(objSAP), bts, planned_value, valueMap)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      } else {
        Redirect(routes.Login.loginUser())
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateSAP(sap_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val sapMaster = SAPServices.findSAPMasterDetails(sap_id)
      if (!sapMaster.isEmpty) {
        var bts = new java.util.LinkedHashMap[String, String]()
        val bType = BudgetTypeService.findActiveBudgetTypes
        for (b <- bType) {
          bts.put(b.id.get.toString(), b.budget_type)
        }
        var ph: Double = 0
        val program_id = sapMaster.get.program_id.toString()
        val planned_value = ProgramService.getPlannedHoursForProgram(program_id)

        var oldForm = ARTForms.sap_form.bindFromRequest
        var otherForm = ARTForms.sap_form.bindFromRequest
        var valueMap = new java.util.LinkedHashMap[String, String]()
        valueMap = SAPServices.fillSAPValues(otherForm);

        var investment_hardware: Option[Long] = None
        if (!oldForm.data.get("investment.investment_hardware").get.isEmpty) {
          val investment_hardwareStr = oldForm.data.get("investment.investment_hardware").get.replaceAll("\\.+", "")
          investment_hardware = Option(investment_hardwareStr.toLong.toLong)
        }
        var investment_software: Option[Long] = None
        if (!oldForm.data.get("investment.investment_software").get.isEmpty) {
          val investment_softwareStr = oldForm.data.get("investment.investment_software").get.replaceAll("\\.+", "")
          investment_software = Option(investment_softwareStr.toLong)
        }
        var investment_telecommunication: Option[Long] = None
        if (!oldForm.data.get("investment.investment_telecommunication").get.isEmpty) {
          val investment_telecommunicationStr = oldForm.data.get("investment.investment_telecommunication").get.replaceAll("\\.+", "")
          investment_telecommunication = Option(investment_telecommunicationStr.toLong)
        }

        var investment_development: Option[Long] = None
        if (!oldForm.data.get("investment.investment_development").get.isEmpty) {
          val investment_developmentStr = oldForm.data.get("investment.investment_development").get.replaceAll("\\.+", "")
          investment_development = Option(investment_developmentStr.toLong)
        }

        var investment_other: Option[Long] = None
        if (!oldForm.data.get("investment.investment_other").get.isEmpty) {
          val investment_otherStr = oldForm.data.get("investment.investment_other").get.replaceAll("\\.+", "")
          investment_other = Option(investment_otherStr.toLong)
        }

        var investment_qa: Option[Long] = None
        if (!oldForm.data.get("investment.investment_qa").get.isEmpty) {
          val investment_qaStr = oldForm.data.get("investment.investment_qa").get.replaceAll("\\.+", "")
          investment_qa = Option(investment_qaStr.toLong)
        }

        var investment_improvements: Option[Long] = None
        if (!oldForm.data.get("investment.investment_improvements").get.isEmpty) {
          val investment_improvementsStr = oldForm.data.get("investment.investment_improvements").get.replaceAll("\\.+", "")
          investment_improvements = Option(investment_improvementsStr.toLong)
        }

        var investment_recurring_first: Option[Long] = None
        if (!oldForm.data.get("investment.investment_recurring_first").get.isEmpty) {
          val investment_recurring_firstStr = oldForm.data.get("investment.investment_recurring_first").get.replaceAll("\\.+", "")
          investment_recurring_first = Option(investment_recurring_firstStr.toLong)
        }

        val invst = Investment(investment_hardware, investment_software, investment_telecommunication,
          investment_development, investment_other, investment_qa,
          investment_improvements, investment_recurring_first)

        var investmentValid = true
        if (investment_hardware.getOrElse(0) == 0 && investment_software.getOrElse(0) == 0 && investment_telecommunication.getOrElse(0) == 0
          && investment_development.getOrElse(0) == 0 && investment_other.getOrElse(0) == 0 && investment_qa.getOrElse(0) == 0
          && investment_improvements.getOrElse(0) == 0 && investment_recurring_first.getOrElse(0) == 0) {
          investmentValid = false
        }

        var expenditure_hardware: Option[Long] = None
        if (!oldForm.data.get("expenditure.expenditure_hardware").get.isEmpty) {
          val expenditure_hardwareStr = oldForm.data.get("expenditure.expenditure_hardware").get.replaceAll("\\.+", "")
          expenditure_hardware = Option(expenditure_hardwareStr.toLong)
        }
        var expenditure_software: Option[Long] = None
        if (!oldForm.data.get("expenditure.expenditure_software").get.isEmpty) {
          val expenditure_softwareStr = oldForm.data.get("expenditure.expenditure_software").get.replaceAll("\\.+", "")
          expenditure_software = Option(expenditure_softwareStr.toLong)
        }
        var expenditure_telecommunication: Option[Long] = None
        if (!oldForm.data.get("expenditure.expenditure_telecommunication").get.isEmpty) {
          val expenditure_telecommunicationStr = oldForm.data.get("expenditure.expenditure_telecommunication").get.replaceAll("\\.+", "")
          expenditure_telecommunication = Option(expenditure_telecommunicationStr.toLong)
        }

        var expenditure_development: Option[Long] = None
        if (!oldForm.data.get("expenditure.expenditure_development").get.isEmpty) {
          val expenditure_developmentStr = oldForm.data.get("expenditure.expenditure_development").get.replaceAll("\\.+", "")
          expenditure_development = Option(expenditure_developmentStr.toLong)
        }

        var expenditure_other: Option[Long] = None
        if (!oldForm.data.get("expenditure.expenditure_other").get.isEmpty) {
          val expenditure_otherStr = oldForm.data.get("expenditure.expenditure_other").get.replaceAll("\\.+", "")
          expenditure_other = Option(expenditure_otherStr.toLong)
        }

        var expenditure_qa: Option[Long] = None
        if (!oldForm.data.get("expenditure.expenditure_qa").get.isEmpty) {
          val expenditure_qaStr = oldForm.data.get("expenditure.expenditure_qa").get.replaceAll("\\.+", "")
          expenditure_qa = Option(expenditure_qaStr.toLong)
        }

        var expenditure_improvements: Option[Long] = None
        if (!oldForm.data.get("expenditure.expenditure_improvements").get.isEmpty) {
          val expenditure_improvementsStr = oldForm.data.get("expenditure.expenditure_improvements").get.replaceAll("\\.+", "")
          expenditure_improvements = Option(expenditure_improvementsStr.toLong)
        }

        var expenditure_recurring_first: Option[Long] = None
        if (!oldForm.data.get("expenditure.expenditure_recurring_first").get.isEmpty) {
          val expenditure_recurring_firstStr = oldForm.data.get("expenditure.expenditure_recurring_first").get.replaceAll("\\.+", "")
          expenditure_recurring_first = Option(expenditure_recurring_firstStr.toLong)
        }

        val expds = Expenditure(expenditure_hardware, expenditure_software, expenditure_telecommunication,
          expenditure_development, expenditure_other, expenditure_qa,
          expenditure_improvements, expenditure_recurring_first)

        var expenseValid = true
        if (expenditure_hardware.getOrElse(0) == 0 && expenditure_software.getOrElse(0) == 0 && expenditure_telecommunication.getOrElse(0) == 0
          && expenditure_development.getOrElse(0) == 0 && expenditure_other.getOrElse(0) == 0 && expenditure_qa.getOrElse(0) == 0
          && expenditure_improvements.getOrElse(0) == 0 && expenditure_recurring_first.getOrElse(0) == 0) {
          expenseValid = false
        }

        // val sap_number = oldForm.data.get("sap_number").get.toInt

        var sap_number: Int = 0
        if (!oldForm.data.get("sap_number").get.isEmpty) {
          sap_number = oldForm.data.get("sap_number").get.toInt
        }
        var budget_type: Int = 0
        if (!oldForm.data.get("budget_type").get.isEmpty) {
          budget_type = oldForm.data.get("budget_type").get.toInt
        }
        var cui1 = ""
        if (!oldForm.data.get("cui1").get.isEmpty) {
          cui1 = oldForm.data.get("cui1").get
        }
        var cui1_per: Double = 0.0
        if (!oldForm.data.get("cui1_per").get.isEmpty) {
          cui1_per = oldForm.data.get("cui1_per").get.toDouble
        }
        var cui2 = ""
        if (!oldForm.data.get("cui2").get.isEmpty) {
          cui2 = oldForm.data.get("cui2").get
        }
        var cui2_per: Double = 0.0
        if (!oldForm.data.get("cui2_per").get.isEmpty) {
          cui2_per = oldForm.data.get("cui2_per").get.toDouble
        }

        var isValidSAP = false
        if (investmentValid || expenseValid) {
          isValidSAP = true
        }

        /* var creation_date: Option[Date] = None
      if (!oldForm.data.get("creation_date").get.isEmpty) {
        creation_date = oldForm.data.get("creation_date").get
      }*/

        var approved_date: Option[Date] = None
        if (oldForm.data.get("approved_date").isDefined && !oldForm.data.get("approved_date").get.trim().isEmpty) {
          val string = oldForm.data.get("approved_date").get.trim();
          val format = new SimpleDateFormat("dd-MM-yyyy");
          val date = format.parse(string);
          approved_date = Option(date)
        } else {
          approved_date = None
        }
        var comitted_date: Option[Date] = None
        if (oldForm.data.get("comitted_date").isDefined && !oldForm.data.get("comitted_date").get.trim().isEmpty) {
          val string = oldForm.data.get("comitted_date").get.trim();
          val format = new SimpleDateFormat("dd-MM-yyyy");
          val date = format.parse(string);
          comitted_date = Option(date)
        } else {
          comitted_date = None
        }
        val sap = SAPMaster(program_id.toInt, sap_number, budget_type, cui1, cui1_per, cui2, cui2_per,
          invst, expds, 1, None, None, None, approved_date, comitted_date)

        oldForm = oldForm.fill(sap)
        oldForm.fold(
          errors => {
            var newForm = errors
            newForm = SAPServices.validateSAPForm(oldForm.fill(sap), program_id, sap_id, otherForm, isValidSAP) /* if (!errors.data.get("planned_hours").isEmpty) {
              ph = errors.data.get("planned_hours").get.toDouble
            }*/
            BadRequest(views.html.frontend.program.editSAP(sapMaster.get.program_id.toString, sap_id, errors, bts, ph, valueMap)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
          },
          sap_member => {

            val theForm = SAPServices.validateSAPForm(ARTForms.sap_form.fill(sap), program_id, sap_id, otherForm, isValidSAP)
            if (theForm.hasErrors) {
              /*if (!sap_member.planned_hours.isEmpty) {
                ph = sap_member.planned_hours.get
              }*/
              BadRequest(views.html.frontend.program.editSAP(sapMaster.get.program_id.toString, sap_id, theForm, bts, ph, valueMap)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
            } else {
              val last_index = SAPServices.updateSAP(sap, sap_id)

              SAPServices.updateSAPAdditionalValues(sap_id, otherForm)

              /**
               * Activity log
               */
              val act = Activity(ActivityTypes.Program_Sap.id, "Program SAP updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), sap_id.toInt)
              Activity.saveLog(act)
              Redirect(routes.Program.programDetails(program_id))
            }

          })
      } else {
        Redirect(routes.Login.loginUser())
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateSAPStatus(sap_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val sap_details = SAPServices.findSAPMasterDetails(sap_id)
      var node = new JSONObject()
      var do_delete: Boolean = true
      sap_details match {
        case None =>
          node.put("status", "Fail")
          node.put("message", "SAP associated with the SAP id is not available .")
        case Some(sap: SAP) =>
          val sap_id_list = SAPServices.findProjectSAPListBySapId(sap_id)
          if (sap_id_list.size > 0) {
            do_delete = false
          }
          if (do_delete) {
            SAPServices.changeSAPStatus(0, sap_id)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Program_Sap.id, "Program SAP deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), sap_id.toInt)
            Activity.saveLog(act)
            node.put("status", "Success")
          } else {
            node.put("status", "Fail")
            node.put("message", "This SAP number is used in Project, you can not delete this SAP number.")
          }
      }
      Ok(node.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateProgramStatus(program_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
      var today = FormattedDATE.format(new Date().getTime()).toString()
      val programStatus = ProgramService.findAllProgramStatus(program_id)
      Ok(views.html.frontend.program.updateProgramStatus(ARTForms.programStatusForm, program_id, programStatus)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateStatus(program_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
      var today = FormattedDATE.format(new Date().getTime()).toString()
      val programStatus = ProgramService.findAllProgramStatus(program_id)
      ARTForms.programStatusForm.bindFromRequest.fold(
        errors => {
          println(errors.errors);
          BadRequest(views.html.frontend.program.updateProgramStatus(errors, program_id, programStatus)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        },
        program_status => {
          val lastIndex = ProgramService.insertProgramStatus(program_status)
          Redirect(routes.Program.updateProgramStatus(program_id))
        })
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateProgramDetailsStatus(program_id: String, status: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var node = new JSONObject()
      if (!program_id.trim().isEmpty() && !status.trim().isEmpty()) {
        ProgramService.updateProgramDetailsStatusField(program_id, status)
        node.put("status", "Sucess")
      } else {
        node.put("status", "Fail")
        node.put("message", "failed to update status.")
      }
      Ok(node.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getSpiGraph(program_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val node = new JSONObject()
      val spi_date_map = new java.util.LinkedHashMap[Long, Double];
      val cpi_date_map = new java.util.LinkedHashMap[Long, Double];
      val espi_date_map = new java.util.LinkedHashMap[Long, Double];
      val ecpi_date_map = new java.util.LinkedHashMap[Long, Double];
      val program_id_map = new java.util.LinkedHashMap[Long, Int];

      val tp = new java.util.LinkedHashMap[Long, Integer];
      val ta = new java.util.LinkedHashMap[Long, Integer];

      val actual_cost_map = new java.util.LinkedHashMap[Long, Double];
      val earn_value_map = new java.util.LinkedHashMap[Long, Double];
      val planned_value_map = new java.util.LinkedHashMap[Long, Double];

      val e_earn_value_map = new java.util.LinkedHashMap[Long, Double];
      val e_planned_value_map = new java.util.LinkedHashMap[Long, Double];
      val e_actual_cost_map = new java.util.LinkedHashMap[Long, Double];

      var spicpiCal = SpiCpiCalculationsService.findCalculationsById(program_id);
      if (!spicpiCal.isEmpty) {
        for (s <- spicpiCal) {
          var formattedDate: SimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd")
          if (!s.spi.isEmpty && !s.fecha.isEmpty) {
            spi_date_map.put(formattedDate.parse(s.fecha.get.toString()).getTime(), s.spi.getOrElse(0))
            espi_date_map.put(formattedDate.parse(s.fecha.get.toString()).getTime(), s.espi.getOrElse(0))
            cpi_date_map.put(formattedDate.parse(s.fecha.get.toString()).getTime(), s.cpi.get)
            ecpi_date_map.put(formattedDate.parse(s.fecha.get.toString()).getTime(), s.ecpi.get)
            actual_cost_map.put(formattedDate.parse(s.fecha.get.toString()).getTime(), s.vb.get)
            e_actual_cost_map.put(formattedDate.parse(s.fecha.get.toString()).getTime(), s.evb.get)
            earn_value_map.put(formattedDate.parse(s.fecha.get.toString()).getTime(), s.vg.get)
            e_earn_value_map.put(formattedDate.parse(s.fecha.get.toString()).getTime(), s.evg.get)
            planned_value_map.put(formattedDate.parse(s.fecha.get.toString()).getTime(), s.vp.get)
            //e_planned_value_map.put(formattedDate.parse(s.fecha.get.toString()).getTime(), s.evp.get)
            e_planned_value_map.put(formattedDate.parse(s.fecha.get.toString()).getTime(), s.evb.get)
            tp.put(formattedDate.parse(s.fecha.get.toString()).getTime(), s.tp.get)
            ta.put(formattedDate.parse(s.fecha.get.toString()).getTime(), s.ta.get)
            program_id_map.put(formattedDate.parse(s.fecha.get.toString()).getTime(), s.pid);
          }

        }
      } else {

      }

      node.put("spi_date_map", spi_date_map)
      node.put("cpi_date_map", cpi_date_map)
      node.put("ecpi_date_map", ecpi_date_map)
      node.put("espi_date_map", espi_date_map)

      node.put("actual_cost_map", actual_cost_map)
      node.put("e_actual_cost_map", e_actual_cost_map)

      node.put("earn_value_map", earn_value_map)
      node.put("e_earn_value_map", e_earn_value_map)

      node.put("planned_value_map", planned_value_map)
      node.put("e_planned_value_map", e_planned_value_map)

      node.put("ta", ta)
      node.put("tp", tp)
      node.put("program_id", program_id_map);
      /* for (i <- 0 to 11) {
        val date = new DateTime().minusWeeks(i).withDayOfWeek(DateTimeConstants.FRIDAY).toDate()
        var formattedDate: SimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd")
        var date1 = formattedDate.format(date)*/
      val EV_list = EarnValueService.getGraphCalculationForProgram(program_id)
      for (ev_obj <- EV_list) {
        var formattedDate: SimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd")
        var date1 = formattedDate.format(ev_obj.recorded_date)
        //spi_date_map.put(formattedDate.parse(date1).getTime(), ev_obj.scheduled_perforamce_index.get)
        //cpi_date_map.put(formattedDate.parse(date1).getTime(), ev_obj.cost_performance_index.get)

        //actual_cost_map.put(formattedDate.parse(date1).getTime(), ev_obj.actual_cost.get)
        //earn_value_map.put(formattedDate.parse(date1).getTime(), ev_obj.erned_value.get)
        //planned_value_map.put(formattedDate.parse(date1).getTime(), ev_obj.planned_value.get)
      }

      /* }*/
      //  val nmap = spi_date_map.descendingMap();
      /*
      if (EV_list.isEmpty || EV_list.size == 0) {
        node.put("empty_object", "empty_object")
      } else {
        node.put("spi_date_map", spi_date_map)
        node.put("cpi_date_map", cpi_date_map)
        node.put("ecpi_date_map", ecpi_date_map)
        node.put("espi_date_map", espi_date_map)

        node.put("actual_cost_map", actual_cost_map)
        node.put("e_actual_cost_map", e_actual_cost_map)

        node.put("earn_value_map", earn_value_map)
        node.put("e_earn_value_map", e_earn_value_map)

        node.put("planned_value_map", planned_value_map)
        node.put("e_planned_value_map", e_planned_value_map)

        node.put("ta", ta)
        node.put("tp", tp)
        node.put("program_id", program_id_map);

      }
*/
      Ok(node.toString())

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateProgramHours(program: String, hours: String) = Action { implicit request =>

    request.session.get("username").map { user =>
      var node = new JSONObject()

      val planned_value = ProgramService.getPlannedHoursForProgram(program)
      val actual_planned_hours = hours.toDouble
      var project_planned_hours: Double = 0
      val projects = ProjectService.findProjectListForProgram(program)
      for (p <- projects) {
        if (!p.planned_hours.isEmpty) {
          project_planned_hours += p.planned_hours.get
        }
      }
      if (actual_planned_hours < project_planned_hours) {
        node.put("status", "Fail")
        node.put("message", "Total hours associated with program are less than planned hours for a project, please enter valid hours.")
      } else {
        SAPServices.updateProgramPlannedHours(program, hours)
        /**
         * Activity log
         */
        val act = Activity(ActivityTypes.Program_Planned_Hrs.id, "Program planned hours updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), program.toInt)
        Activity.saveLog(act)
        node.put("status", "Sucess")
      }

      Ok(node.toString())

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }

  def updateProjectHours(project: String, hours: String) = Action { implicit request =>

    request.session.get("username").map { user =>
      var node = new JSONObject()
      var project_planned_hours: Double = 0

      if (!StringUtils.isEmpty(project)) {
        val projectDetails = ProjectService.findProject(Integer.parseInt(project))

        if (!projectDetails.isEmpty) {
          val program_id = projectDetails.get.program.toString()
          val program = ProgramService.findProgramMasterDetailsById(program_id)

          var program_hours: Long = 0
          if (!program.get.planned_hours.isEmpty) {
            program_hours = program.get.planned_hours.get
          } else {
            program_hours = 0
          }

          if (!StringUtils.isEmpty(hours)) {
            val actual_planned_hours = hours.toDouble
            var project_planned_hours: Double = 0
            var task_assigned_hours: Double = 0
            val projects = ProjectService.findProjectListForProgram(program_id)
            for (p <- projects) {
              if (!p.planned_hours.isEmpty && !StringUtils.equals(p.pId.get.toString(), project)) {
                project_planned_hours += p.planned_hours.get
              }
            }

            val tasks = TaskService.findTaskListByProjectId(project)
            for (t <- tasks) {
              task_assigned_hours += t.plan_time.toDouble
            }
            project_planned_hours += actual_planned_hours

            if (program_hours < project_planned_hours) {
              node.put("status", "Fail")
              node.put("message", "Total hours associated with projects are more than planned hours for a program, please enter valid hours.")
              //newform = sap_form.withError("planned_hours", Messages.get(langObj, "sap.plann_hour"))
            } else {

              if (actual_planned_hours < task_assigned_hours) {
                node.put("status", "Fail")
                node.put("message", "Total hours associated with tasks are more than planned hours for a project, please enter valid hours.")
              } else {
                SAPServices.updateProjectPlannedHours(project, hours)
                /**
                 * Activity log
                 */
                val act = Activity(ActivityTypes.Project_Planned_Hrs.id, "Project planned hours updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), project.toInt)
                Activity.saveLog(act)
                node.put("status", "Sucess")
              }
            }
          }

        }
      }
      Ok(node.toString())

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }

  def updateProgramEstimatedCost(program_id: String, est_cost: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var node = new JSONObject()
      var project_estimated_cost: Double = 0
      if (!StringUtils.isEmpty(program_id)) {
        if (!StringUtils.isEmpty(est_cost)) {
          ProgramService.updateProgramEstimatedCost(program_id, est_cost)
          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Estimation_Cost.id, "Estimation Cost updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), program_id.toInt)
          Activity.saveLog(act)

          node.put("status", "Success")
        } else {
          node.put("status", "Fail")
          node.put("message", "Estimated Cost Should not empty.")
        }
      } else {
        node.put("status", "Fail")
        node.put("message", "Program is not present.")
      }
      Ok(node.toString());
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def issueManagement(parent_id: String, parent_type: Integer) = Action { implicit request =>
    request.session.get("username").map { user =>
      Ok(views.html.frontend.task.issueManagement(parent_id, parent_type)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);

    }.getOrElse {

      Redirect(routes.Login.loginUser())
    }
  }
  
  def issueManagementForTimesheet(parent_id: String, parent_type: Integer) = Action { implicit request =>
    request.session.get("username").map { user =>
      Ok(views.html.frontend.task.issueManagementForTimesheet(parent_id, parent_type)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);

    }.getOrElse {

      Redirect(routes.Login.loginUser())
    }
  }  
  
  def issueDetails(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val issue = RiskService.findIssueDetails(id)
      issue match {
        case None =>
          Ok("No Details Available");
        case Some(r: RiskManagementIssue) =>

          //var program = ProgramService.findProgramMasterDetailsById(program_id)
          Ok(views.html.frontend.task.issueDetails(issue, id)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def addIssue(parent_id: String, parent_type: Integer) = Action { implicit request =>
    request.session.get("username").map { user =>
      var program: Option[ProgramMaster] = null
      var start_date: Date = new Date()
      var end_date: Date = new Date()
      parent_type.intValue() match {
        case 2 =>
          program = TaskService.findProgramDetailForTask(parent_id)
          val task = TaskService.findTaskDetailsByTaskId(parent_id.toInt)
          if (!task.isEmpty) {
            start_date = task.get.plan_start_date
            end_date = task.get.plan_end_date
          }
        case 3 =>
          program = SubTaskServices.findProgramDetailForSubTask(parent_id)
          val subtask = SubTaskServices.findSubTaskDetailsBySubtaskId(parent_id)
          if (!subtask.isEmpty) {
            start_date = subtask.get.plan_start_date
            end_date = subtask.get.plan_end_date
          }
      }
      if (!program.isEmpty) {
        val users = ProgramMemberService.findAllProgramMembers(program.get.program_id.get.toString);
        val riskCategoryMap = new java.util.LinkedHashMap[String, String]()

        val categories = services.RiskService.findActiveIssueCategory()
        for (categ <- categories) {
          riskCategoryMap.put(categ.id.get.toString(), categ.category_name)
        }

        val subCategoryMap = new java.util.LinkedHashMap[String, String]()
        Ok(views.html.frontend.program.addIssue(parent_id, parent_type, ARTForms.addIssueForm, riskCategoryMap, subCategoryMap, users, start_date, end_date)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
      } else {
        Redirect(routes.Login.loginUser())
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def saveIssue(parent_id: String, parent_type: Integer) = Action { implicit request =>
    request.session.get("username").map { user =>
      var program: Option[ProgramMaster] = null
      var start_date: Date = new Date()
      var end_date: Date = new Date()
      var task_id = ""
      parent_type.intValue() match {
        case 2 =>
          program = TaskService.findProgramDetailForTask(parent_id)
          val task = TaskService.findTaskDetailsByTaskId(parent_id.toInt)
          if (!task.isEmpty) {
            start_date = task.get.plan_start_date
            end_date = task.get.plan_end_date
            task_id = task.get.tId.get.toString()
          }
        case 3 =>
          program = SubTaskServices.findProgramDetailForSubTask(parent_id)
          val subtask = SubTaskServices.findSubTaskDetailsBySubtaskId(parent_id)
          if (!subtask.isEmpty) {
            start_date = subtask.get.plan_start_date
            end_date = subtask.get.plan_end_date
            task_id = subtask.get.task_id.toString()
          }
      }
      if (!program.isEmpty) {

      } else {
        Redirect(routes.Program.issueManagement(parent_id, parent_type))
      }
      val riskCategoryMap = new java.util.LinkedHashMap[String, String]()
      val categories = services.RiskService.findActiveIssueCategory()
      for (categ <- categories) {
        riskCategoryMap.put(categ.id.get.toString(), categ.category_name)
      }
      val oldform = ARTForms.addIssueForm.bindFromRequest
      oldform.fold(
        errors => {
          val the_Form = RiskService.validateIssue(oldform, start_date, end_date, task_id)
          val subCategoryMap = new java.util.LinkedHashMap[String, String]()
          if (!the_Form.data.get("category").isEmpty && the_Form.data.get("category").isDefined) {
            val sub_categories = RiskService.findIssueSubCategoryForIssueCategory(the_Form.data.get("category").get.trim())
            if (sub_categories != null) {
              for (sub_cat <- sub_categories) {
                subCategoryMap.put(sub_cat.id.get.toString(), sub_cat.name)
              }
            }
          }
          val users = ProgramMemberService.findAllProgramMembers(program.get.program_id.get.toString);
          BadRequest(views.html.frontend.program.addIssue(parent_id, parent_type, the_Form, riskCategoryMap, subCategoryMap, users, start_date, end_date)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
        },
        issue => {
          val the_Form = RiskService.validateIssue(oldform, start_date, end_date, task_id)
          if (the_Form.hasErrors) {
            val subCategoryMap = new java.util.LinkedHashMap[String, String]()
            if (!the_Form.data.get("category").isEmpty) {
              val sub_categories = RiskService.findIssueSubCategoryForIssueCategory(the_Form.data.get("category").get)
              if (sub_categories != null) {
                for (sub_cat <- sub_categories) {
                  subCategoryMap.put(sub_cat.id.get.toString(), sub_cat.name)
                }
              }
            }
            val users = ProgramMemberService.findAllProgramMembers(program.get.program_id.get.toString);
            BadRequest(views.html.frontend.program.addIssue(parent_id, parent_type, the_Form, riskCategoryMap, subCategoryMap, users, start_date, end_date)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
          } else {
            val user_id = Integer.parseInt(request.session.get("uId").get)
            val last_save = RiskService.insertRiskIssue(issue, user_id)

            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Issue.id, "New Issue created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last_save.toInt)
            Activity.saveLog(act)
            Redirect(routes.Risks.riskManagement(parent_id, parent_type))
            Redirect(routes.Program.issueManagement(parent_id, parent_type))
          }
        })

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def deleteIssue(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val risk = RiskService.findIssueDetails(id)
      risk match {
        case None =>
          Ok("Fail")
        case Some(r: RiskManagementIssue) =>
          RiskService.deleteIssueDetails(id)
          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Issue.id, "Issue deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
          Activity.saveLog(act)
          Ok("Success")
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def editIssue(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var risk = RiskService.findIssueDetails(id)
      var userMap = new java.util.HashMap[String, String]()

      risk match {
        case None =>
          Redirect(routes.Login.loginUser())
        case Some(risk: models.RiskManagementIssue) =>
          val parent_id = risk.parent_id.get.toString()
          val parent_type = risk.parent_type.get
          var start_date: Date = new Date()
          var end_date: Date = new Date()
          var program: Option[ProgramMaster] = null
          parent_type.intValue() match {
            case 2 =>
              program = TaskService.findProgramDetailForTask(parent_id)
              val task = TaskService.findTaskDetailsByTaskId(parent_id.toInt)
              if (!task.isEmpty) {
                start_date = task.get.plan_start_date
                end_date = task.get.plan_end_date
              }
            case 3 =>
              program = SubTaskServices.findProgramDetailForSubTask(parent_id)
              val subtask = SubTaskServices.findSubTaskDetailsBySubtaskId(parent_id)
              if (!subtask.isEmpty) {
                start_date = subtask.get.plan_start_date
                end_date = subtask.get.plan_end_date
              }

          }
          if (!program.isEmpty) {
            val riskCategoryMap = new java.util.LinkedHashMap[String, String]()

            val categories = services.RiskService.findActiveIssueCategory()
            for (categ <- categories) {
              riskCategoryMap.put(categ.id.get.toString(), categ.category_name)
            }
            val sub_categories = RiskService.findIssueSubCategoryForIssueCategory(risk.category.toString())
            val subCategoryMap = new java.util.LinkedHashMap[String, String]()
            if (sub_categories != null) {
              for (sub_cat <- sub_categories) {
                subCategoryMap.put(sub_cat.id.get.toString(), sub_cat.name)
              }
            }
            val users = ProgramMemberService.findAllProgramMembers(program.get.program_id.get.toString);

            val risk_new = models.RiskManagementIssueMain(risk.id, risk.parent_id, risk.parent_type,
              risk.title, risk.description, risk.category, risk.sub_category, risk.members_involved, risk.action_plan,
              risk.priority, risk.user_id, risk.issue_status, risk.is_active, models.RiskManagementIssueDate(risk.issue_date, risk.closure_date, risk.planned_end_date, risk.actual_end_date, risk.creation_date, risk.updation_date))
            Ok(views.html.frontend.program.editIssue(id, ARTForms.addIssueForm.fill(risk_new), parent_id, parent_type, riskCategoryMap, subCategoryMap, users, start_date, end_date)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
          } else {
            Redirect(routes.Program.issueManagement(parent_id, parent_type))
          }
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateIssue(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var risk = RiskService.findIssueDetails(id)
      risk match {
        case None =>
          Redirect(routes.Login.loginUser())
        case Some(risk_issue: RiskManagementIssue) =>
          var task_id = ""
          val parent_id = risk_issue.parent_id.get.toString()
          val parent_type = risk_issue.parent_type.get
          var start_date: Date = new Date()
          var end_date: Date = new Date()
          var program: Option[ProgramMaster] = null
          parent_type.intValue() match {
            case 2 =>
              program = TaskService.findProgramDetailForTask(parent_id)
              val task = TaskService.findTaskDetailsByTaskId(parent_id.toInt)
              if (!task.isEmpty) {
                start_date = task.get.plan_start_date
                end_date = task.get.plan_end_date
                task_id = task.get.tId.get.toString()
              }
            case 3 =>
              program = SubTaskServices.findProgramDetailForSubTask(parent_id)
              val subtask = SubTaskServices.findSubTaskDetailsBySubtaskId(parent_id)
              if (!subtask.isEmpty) {
                start_date = subtask.get.plan_start_date
                end_date = subtask.get.plan_end_date
                task_id = subtask.get.task_id.toString()
              }
          }
          if (!program.isEmpty) {

          } else {
            Redirect(routes.Program.issueManagement(parent_id, parent_type))
          }
          val riskCategoryMap = new java.util.LinkedHashMap[String, String]()

          val categories = services.RiskService.findActiveIssueCategory()
          for (categ <- categories) {
            riskCategoryMap.put(categ.id.get.toString(), categ.category_name)
          }

          val oldform = ARTForms.addIssueForm.bindFromRequest
          oldform.fold(errors => {
            val the_Form = RiskService.validateIssueUpdate(oldform, start_date, end_date, id, task_id)
            val subCategoryMap = new java.util.LinkedHashMap[String, String]()
            if (!the_Form.data.get("category").isEmpty) {
              val sub_categories = RiskService.findIssueSubCategoryForIssueCategory(the_Form.data.get("category").get)
              if (sub_categories != null) {
                for (sub_cat <- sub_categories) {
                  subCategoryMap.put(sub_cat.id.get.toString(), sub_cat.name)
                }
              }
            }
            val users = ProgramMemberService.findAllProgramMembers(program.get.program_id.get.toString);
            BadRequest(views.html.frontend.program.editIssue(id, the_Form, parent_id, parent_type, riskCategoryMap, subCategoryMap, users, start_date, end_date)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
          },
            issue => {
              val the_Form = RiskService.validateIssueUpdate(oldform, start_date, end_date, id, task_id)
              if (the_Form.hasErrors) {
                val subCategoryMap = new java.util.LinkedHashMap[String, String]()
                if (!the_Form.data.get("category").isEmpty) {
                  val sub_categories = RiskService.findIssueSubCategoryForIssueCategory(the_Form.data.get("category").get)
                  if (sub_categories != null) {
                    for (sub_cat <- sub_categories) {
                      subCategoryMap.put(sub_cat.id.get.toString(), sub_cat.name)
                    }
                  }
                }
                val users = ProgramMemberService.findAllProgramMembers(program.get.program_id.get.toString);
                BadRequest(views.html.frontend.program.editIssue(id, the_Form, parent_id, parent_type, riskCategoryMap, subCategoryMap, users, start_date, end_date)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
              } else {
                val last_save = RiskService.updateRiskIssue(issue)
                /**
                 * Activity log
                 */
                val act = Activity(ActivityTypes.Issue.id, "Issue updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
                Activity.saveLog(act)
                parent_type.toInt match {
                  case 0 =>
                    Redirect(routes.Program.programDetails(issue.parent_id.get.toString()))
                  case 1 =>
                    Redirect(routes.ProjectMaster.projectDetails(issue.parent_id.get.toString()))
                  case 2 =>
                    Redirect(routes.Task.projectTaskDetails(issue.parent_id.get.toString()))
                  case 3 =>
                    Redirect(routes.SubTask.subTaskDetails(issue.parent_id.get.toString()))
                }
              }

            })
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getMembersFromRole(role_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var stateString = " <option value=''>" + "Please select the member" + "</option>";
      if (StringUtils.isNotEmpty(role_id) && !role_id.equals("0")) {
        var userList = UserService.findUsersFromRole(role_id);
        if (!userList.isEmpty) {
          for (u <- userList) {
            stateString += " <option value='" + u.uid.get + "'>" + u.first_name + " " + u.last_name + "</option>"
          }

        }
      }
      Ok(stateString);
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def addSoftwareFactory() = Action { implicit request =>
    request.session.get("username").map { user =>
      val program_id = request.body.asFormUrlEncoded.get("program_id")(0).toString().trim()
      val role_id = request.body.asFormUrlEncoded.get("role_id")(0).toString().trim()
      var provider_name = request.body.asFormUrlEncoded.get("provider_name")(0).toString().trim()
      var number_of_resources = request.body.asFormUrlEncoded.get("number_of_resources")(0).toString().trim();
      val user_id = Integer.parseInt(request.session.get("uId").get)
      var numOfResource = 0;
      if (StringUtils.isNotEmpty(number_of_resources)) {
        numOfResource = Integer.parseInt(number_of_resources);
      }

      var newExternalContractor = ProgramMembersExternal(null, Integer.parseInt(program_id), Integer.parseInt(role_id), provider_name, Option(""), Option(numOfResource), Option("Test"), Option("Test"), user_id, new Date, new Date, 0);
      ProgramMemberExternalService.saveProgramMemberExternal(newExternalContractor);
      Ok("success");
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def addExternalContractor() = Action { implicit request =>
    request.session.get("username").map { user =>
      val program_id = request.body.asFormUrlEncoded.get("program_id")(0).toString().trim()
      val role_id = request.body.asFormUrlEncoded.get("role_id")(0).toString().trim()
      var provider_name = request.body.asFormUrlEncoded.get("provider_name")(0).toString().trim()
      var name_of_resource = request.body.asFormUrlEncoded.get("name_of_resource")(0).toString().trim();
      val user_id = Integer.parseInt(request.session.get("uId").get)
      var test = null;

      var newExternalContractor = ProgramMembersExternal(null, Integer.parseInt(program_id), Integer.parseInt(role_id), provider_name, Option(name_of_resource), Option(0), Option("Test"), Option("Test"), user_id, new Date, new Date, 0);
      ProgramMemberExternalService.saveProgramMemberExternal(newExternalContractor);
      Ok("success");
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getIssueSubCategory(category_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var subCategoryString = "<option>Seleccionar Categoría Sub</option>"
      if (!category_id.trim().isEmpty()) {
        val riskSubCategory = services.RiskService.findIssueSubCategoryForIssueCategory(category_id)
        for (subCategory <- riskSubCategory) {
          subCategoryString += " <option value='" + subCategory.id.get + "'>" + subCategory.name + "</option>"
        }
      }
      Ok(subCategoryString);
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getProgramDistribution(uid: Integer, period: Integer) = Action { implicit request =>
    request.session.get("username").map { user =>
      //println("uid:" + uid)
      //println("period:" + period)
      val capaciyt = ProgramService.getProgramUserCapacity(uid, period)
      Ok(play.api.libs.json.Json.toJson(capaciyt));
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }
}