package controllers.Frontend

import java.util.List
import scala.math.BigDecimal.double2bigDecimal
import scala.math.BigDecimal.int2bigDecimal
import org.apache.commons.lang3.StringUtils
import org.json.JSONArray
import org.json.JSONObject
import play.api.mvc.Action
import play.api.mvc.Controller
import services.DepartmentService
import services.DivisionService
import services.ProgramService
import services.ProjectService
import services.SubTaskServices
import services.TimesheetService
import services.UserService
import services.RiskStateService
import java.util.Calendar
import java.util.Date
import models.Baseline
import play.libs.Json
import org.json.JSONObject
import play.api.libs.json
import play.api.libs.json._
import services.ProgramMemberService
import art_forms.ARTForms
import services.ProgramTypeService
import services.SubTypeService
import models.SearchCriteria
import models.VersionDetails
import services.TaskService
import services.DocumentService
import services.BudgetTypeService
import services.EarnValueService
import scala.math.BigDecimal.RoundingMode
import utils.DateTime
import services.SpiCpiCalculationsService
import services.RiskCategoryService
import models.RiskManagement
import models.RiskManagementMaster
//import models.RiskManagementIncreased
import models.RiskManagementIssue
import java.util.TreeMap
import models.riskParentType
import services.RiskService
import models.ProgramDates
import models.ProgramMaster
import models.RiskAlerts
import models.UserSetting
import models.Activity
import models.ActivityTypes
import play.Play
import play.api.Play.current
import play.api.data._
import java.io.FileInputStream
import java.util.UUID
//import play.api.libs.Files
import java.nio.file.CopyOption
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption.REPLACE_EXISTING

object Risks extends Controller {

  def riskManagement(parent_id: String, parent_type: Integer) = Action { implicit request =>
    request.session.get("username").map { user =>
      Ok(views.html.frontend.risks.riskManagement(parent_id, parent_type)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);

    }.getOrElse {

      Redirect(routes.Login.loginUser())
    }
  }

  def addRisk(parent_id: String, parent_type: Integer) = Action { implicit request =>
    request.session.get("username").map { user =>

      //var program = ProgramService.findProgramMasterDetailsById(program_id)
      var progrm: Option[ProgramDates] = null
      parent_type.intValue() match {
        case 0 =>
          progrm = ProgramService.findProgramDateDetailsById(parent_id)
        case 1 =>
          val progrm_m = ProjectService.findProgramDetailForProject(parent_id)
          if (!progrm_m.isEmpty) {
            progrm = ProgramService.findProgramDateDetailsById(progrm_m.get.program_id.get.toString())
          }
        case 2 =>
          val progrm_m = TaskService.findProgramDetailForTask(parent_id)
          if (!progrm_m.isEmpty) {
            progrm = ProgramService.findProgramDateDetailsById(progrm_m.get.program_id.get.toString())
          }
        case 3 =>
          val progrm_m = SubTaskServices.findProgramDetailForSubTask(parent_id)
          if (!progrm_m.isEmpty) {
            progrm = ProgramService.findProgramDateDetailsById(progrm_m.get.program_id.get.toString())
          }
      }

      var usersMap = new java.util.LinkedHashMap[String, String]()
      if (!progrm.isEmpty) {
        val users = ProgramMemberService.findAllProgramMembers(progrm.get.program_id.toString);
        for (u <- users) {
          usersMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
        }
      }
      val riskCategoryMap = new java.util.LinkedHashMap[String, String]()

      val categories = RiskCategoryService.findActiveRiskCategory()
      for (categ <- categories) {
        riskCategoryMap.put(categ.id.get.toString(), categ.category_name)
      }

      val riskStateMap = new java.util.LinkedHashMap[String, String]()

      val states = RiskStateService.findActiveRiskState()
      for (state <- states) {
        riskStateMap.put(state.id.get.toString(), state.state_name)
      }

      val subCategoryMap = new java.util.LinkedHashMap[String, String]()

      /*   val subcategories = RiskCategoryService.findActiveRiskSubCategory()
      for (subcate <- subcategories) {
        subCategoryMap.put(subcate.id.get.toString(), subcate.name)
      }
*/
      Ok(views.html.frontend.risks.addRisk(parent_id, parent_type, ARTForms.riskManagementForm, usersMap, riskCategoryMap, subCategoryMap, progrm, "", riskStateMap)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def saveRisk(parent_id: String, parent_type: Integer) = Action(parse.multipartFormData) { implicit request =>
    request.session.get("username").map { user =>
      val subCategoryMap = new java.util.LinkedHashMap[String, String]()
      val riskCategoryMap = new java.util.LinkedHashMap[String, String]()
      val riskStateMap = new java.util.LinkedHashMap[String, String]()

      var progrm: Option[ProgramDates] = null
      parent_type.intValue() match {

        case 0 =>
          progrm = ProgramService.findProgramDateDetailsById(parent_id)
        case 1 =>
          val progrm_m = ProjectService.findProgramDetailForProject(parent_id)
          if (!progrm_m.isEmpty) {
            progrm = ProgramService.findProgramDateDetailsById(progrm_m.get.program_id.get.toString())
          }
        case 2 =>
          val progrm_m = TaskService.findProgramDetailForTask(parent_id)
          if (!progrm_m.isEmpty) {
            progrm = ProgramService.findProgramDateDetailsById(progrm_m.get.program_id.get.toString())
          }
        case 3 =>
          val progrm_m = SubTaskServices.findProgramDetailForSubTask(parent_id)
          if (!progrm_m.isEmpty) {
            progrm = ProgramService.findProgramDateDetailsById(progrm_m.get.program_id.get.toString())
          }
      }
      var usersMap = new java.util.LinkedHashMap[String, String]()
      if (!progrm.isEmpty) {
        val users = ProgramMemberService.findAllProgramMembers(progrm.get.program_id.toString);
        for (u <- users) {
          usersMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
        }

      }

      /*   val categories = RiskCategoryService.findActiveRiskCategory()
      for (categ <- categories) {
        riskCategoryMap.put(categ.id.get.toString(), categ.category_name)
      }*/

      /*  val subcategories = RiskCategoryService.findActiveRiskSubCategory()
      for (subcateg <- subcategories) {
        subCategoryMap.put(subcateg.id.get.toString(), subcateg.name)
      }*/

      val categories = RiskCategoryService.findActiveRiskCategory()
      for (categ <- categories) {
        riskCategoryMap.put(categ.id.get.toString(), categ.category_name)
      }

      val states = RiskStateService.findActiveRiskState()
      for (state <- states) {
        riskStateMap.put(state.id.get.toString(), state.state_name)
      }

      val oldForm = ARTForms.riskManagementForm.bindFromRequest
      oldForm.fold(
        errors => {
          var newform = oldForm
          var selectedSubCategory = "";

          if (!oldForm("sub_category").value.isEmpty) {
            selectedSubCategory = oldForm("sub_category").value.get.toString
          }
          //selectedSubCategory = oldForm.get.sub_category.toString;
          val the_Form = RiskService.validateRisk(oldForm, progrm)

          BadRequest(views.html.frontend.risks.addRisk(parent_id, parent_type, the_Form, usersMap, riskCategoryMap, subCategoryMap, progrm, selectedSubCategory, riskStateMap)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
        },
        risk => {
          var newform = oldForm
          var selectedSubCategory = "";
          if (!oldForm("sub_category").value.isEmpty) {
            selectedSubCategory = oldForm("sub_category").value.get.toString
          }
          val the_Form = RiskService.validateRisk(oldForm, progrm)
          if (the_Form.hasErrors) {
            BadRequest(views.html.frontend.risks.addRisk(parent_id, parent_type, the_Form, usersMap, riskCategoryMap, subCategoryMap, progrm, selectedSubCategory, riskStateMap)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
          } else {
            var newFileName = ""
            val user_id = Integer.parseInt(request.session.get("uId").get)
            request.body.file("document_category").map {
              uploaded_document =>
                println("document ----------- " + uploaded_document.filename);
                import java.io.File
                val filename = uploaded_document.filename
                val contentType = uploaded_document.contentType
                Play.application().configuration().getString("bdc.documents.location");
                var filePath: String = Play.application().configuration().getString("bdc.documents.location") + "/";
                var filePathParent: String = "";
                if (!"".equals(filename)) {
                  //Retrieve file extension.
                  val extension = filename.substring((filename.lastIndexOf(".") + 1), filename.length())

                  //Create new file name from UUID
                  newFileName = UUID.randomUUID().toString() + "." + extension;

                  filePathParent = RiskService.getFilePath(parent_id, parent_type.toString());
                  var file = new File(filePathParent + "alldocuments/" + newFileName);
                  uploaded_document.ref.moveTo(file, true);
                  var docFile = new File(Play.application().configuration().getString("bdc.documents.location") + "/alldocuments/" + newFileName)
                  Files.copy(file.toPath(), docFile.toPath(), REPLACE_EXISTING);

                }

                val risk_master = RiskManagementMaster(Option(0), Option(parent_id.toInt), Option(parent_type), risk.name.trim(), risk.cause, risk.event,
                  risk.imapct, risk.risk_category, risk.variable_imapact, risk.probablity_of_occurence,
                  risk.quantification, risk.strategic_reply, risk.responsible, risk.reply_action,
                  risk.configuration_plan, Option(newFileName), risk.risk_clouser_date, ////////////////////temp
                  Option(user_id), Option(new Date()), Option(new Date()), risk.risk_state, risk.sub_category)

                val last = RiskService.insertRisk(risk_master)

                if (last.isWhole()) {
                  val risk_project_id = RiskService.createRiskManagementProject(parent_id, parent_type, last.toString())
                }
                /**
                 * Activity log
                 */
                val act = Activity(ActivityTypes.Risk.id, "New Risk created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
                Activity.saveLog(act)
                Redirect(routes.Risks.riskManagement(parent_id, parent_type))
            }.getOrElse {
              implicit val newFlash = request.flash + ("error" -> "Something went wrong.")
              /* if (uploadType.equals("ADD")) {
              BadRequest(views.html.frontend.documents.uploadDocument(ARTForms.documentForm.fill(document), documentType, document.title, document.parent_id.toString, document.parent_type.toString, uploadType, "", newFlash)).withSession(userSession)
            } else {*/

              val risk_master = RiskManagementMaster(Option(0), Option(parent_id.toInt), Option(parent_type), risk.name.trim(), risk.cause, risk.event,
                risk.imapct, risk.risk_category, risk.variable_imapact, risk.probablity_of_occurence,
                risk.quantification, risk.strategic_reply, risk.responsible, risk.reply_action,
                risk.configuration_plan, Option(""), risk.risk_clouser_date, ////////////////////temp
                Option(user_id), Option(new Date()), Option(new Date()), risk.risk_state, risk.sub_category)

              val last = RiskService.insertRisk(risk_master)

              if (last.isWhole()) {
                val risk_project_id = RiskService.createRiskManagementProject(parent_id, parent_type, last.toString())
              }
              /**
               * Activity log
               */
              val act = Activity(ActivityTypes.Risk.id, "New Risk created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
              Activity.saveLog(act)

              Redirect(routes.Risks.riskManagement(parent_id, parent_type))
              /* }*/
            }
          }

        })
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def editRisk(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val risk = RiskService.findRiskDetails(id)
      risk match {
        case None =>
          Redirect(routes.Login.loginUser())
        case Some(r: RiskManagementMaster) =>
          val rm = RiskManagement(r.parent_id, r.parent_type, r.name, r.cause, r.event, r.imapct, r.risk_category,
            r.variable_imapact, r.probablity_of_occurence, r.quantification, r.strategic_reply, r.responsible,
            r.reply_action, r.configuration_plan, r.document_category, r.sub_category, r.risk_state, r.risk_clouser_date /*, r.is_active*/ )

          val parent_type = r.parent_type.get
          val parent_id = r.parent_id.get.toString()
          var progrm: Option[ProgramDates] = null

          parent_type match {

            case 0 =>
              progrm = ProgramService.findProgramDateDetailsById(parent_id)
            case 1 =>
              val progrm_m = ProjectService.findProgramDetailForProject(parent_id)
              if (!progrm_m.isEmpty) {
                progrm = ProgramService.findProgramDateDetailsById(progrm_m.get.program_id.get.toString())
              }
            case 2 =>
              val progrm_m = TaskService.findProgramDetailForTask(parent_id)
              if (!progrm_m.isEmpty) {
                progrm = ProgramService.findProgramDateDetailsById(progrm_m.get.program_id.get.toString())
              }
            case 3 =>
              val progrm_m = SubTaskServices.findProgramDetailForSubTask(parent_id)
              if (!progrm_m.isEmpty) {
                progrm = ProgramService.findProgramDateDetailsById(progrm_m.get.program_id.get.toString())
              }
          }

          var usersMap = new java.util.LinkedHashMap[String, String]()
          if (!progrm.isEmpty) {
            val users = ProgramMemberService.findAllProgramMembers(progrm.get.program_id.toString);
            for (u <- users) {
              usersMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
            }
          }
          val subCategoryMap = new java.util.LinkedHashMap[String, String]()
          val riskCategoryMap = new java.util.LinkedHashMap[String, String]()
          val categories = RiskCategoryService.findActiveRiskCategory()
          for (categ <- categories) {
            riskCategoryMap.put(categ.id.get.toString(), categ.category_name)
          }
          val riskStateMap = new java.util.LinkedHashMap[String, String]()
          val states = RiskStateService.findActiveRiskState()
          for (state <- states) {
            riskStateMap.put(state.id.get.toString(), state.state_name)
          }

          Ok(views.html.frontend.risks.editRisk(id, ARTForms.riskManagementForm.fill(rm), usersMap, riskCategoryMap, subCategoryMap,riskStateMap, r.parent_id.get.toString(), r.parent_type.get, progrm, rm.sub_category.toString)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def deleteRisk(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val risk = RiskService.findRiskDetails(id)
      risk match {
        case None =>
          Ok("Fail")
        case Some(r: RiskManagementMaster) =>
          RiskService.deleteRiskDetails(id)
          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Risk.id, "Risk deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
          Activity.saveLog(act)
          Ok("Success")
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def riskDetails(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val risk = RiskService.findRiskDetails(id)
      risk match {
        case None =>
          Ok("No Details Available");
        case Some(r: RiskManagementMaster) =>
          Ok(views.html.frontend.risks.riskDetails(risk, id)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateRisk(id: String) = Action(parse.multipartFormData) { implicit request =>
    request.session.get("username").map { user =>
      //var program = ProgramService.findProgramMasterDetailsById(program_id)

      val riskObj = RiskService.findRiskDetails(id)
      riskObj match {
        case None =>
          Redirect(routes.Login.loginUser())
        case Some(r: RiskManagementMaster) =>
          val old_res = r.responsible
          val rm = RiskManagement(r.parent_id, r.parent_type, r.name, r.cause, r.event, r.imapct, r.risk_category,
            r.variable_imapact, r.probablity_of_occurence, r.quantification, r.strategic_reply, r.responsible,
            r.reply_action, r.configuration_plan, r.document_category, r.sub_category, r.risk_state, r.risk_clouser_date)

          val parent_type = r.parent_type.get
          val parent_id = r.parent_id.get.toString()
          var progrm: Option[ProgramDates] = null
          parent_type match {

            case 0 =>
              progrm = ProgramService.findProgramDateDetailsById(parent_id)
            case 1 =>
              val progrm_m = ProjectService.findProgramDetailForProject(parent_id)
              if (!progrm_m.isEmpty) {
                progrm = ProgramService.findProgramDateDetailsById(progrm_m.get.program_id.get.toString())
              }
            case 2 =>
              val progrm_m = TaskService.findProgramDetailForTask(parent_id)
              if (!progrm_m.isEmpty) {
                progrm = ProgramService.findProgramDateDetailsById(progrm_m.get.program_id.get.toString())
              }
            case 3 =>
              val progrm_m = SubTaskServices.findProgramDetailForSubTask(parent_id)
              if (!progrm_m.isEmpty) {
                progrm = ProgramService.findProgramDateDetailsById(progrm_m.get.program_id.get.toString())
              }
          }
          var usersMap = new java.util.LinkedHashMap[String, String]()
          if (!progrm.isEmpty) {
            val users = ProgramMemberService.findAllProgramMembers(progrm.get.program_id.toString);
            for (u <- users) {
              usersMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
            }

          }
          val subCategoryMap = new java.util.LinkedHashMap[String, String]()
          val riskCategoryMap = new java.util.LinkedHashMap[String, String]()
          val categories = RiskCategoryService.findActiveRiskCategory()
          for (categ <- categories) {
            riskCategoryMap.put(categ.id.get.toString(), categ.category_name)
          }
          val riskStateMap = new java.util.LinkedHashMap[String, String]()
          val states = RiskStateService.findActiveRiskState()
          for (state <- states) {
            riskStateMap.put(state.id.get.toString(), state.state_name)
          }
          val oldform = ARTForms.riskManagementForm.bindFromRequest
          oldform.fold(
            errors => {
              val the_Form = RiskService.validateRiskForUpdate(oldform, progrm, id, parent_id.toString(), parent_type.toString())
              var selectedSubCategory = "";
              if (!oldform("sub_category").value.isEmpty) {
                selectedSubCategory = oldform("sub_category").value.get.toString
              }
              BadRequest(views.html.frontend.risks.editRisk(id, the_Form, usersMap, riskCategoryMap, subCategoryMap,riskStateMap, r.parent_id.get.toString(), r.parent_type.get, progrm, selectedSubCategory)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
            },
            risk => {
              val the_Form = RiskService.validateRiskForUpdate(oldform, progrm, id, parent_id.toString(), parent_type.toString())

              if (the_Form.hasErrors) {
                var selectedSubCategory = "";
                if (!the_Form("sub_category").value.isEmpty) {
                  selectedSubCategory = the_Form("sub_category").value.get.toString
                }
                BadRequest(views.html.frontend.risks.editRisk(id, the_Form, usersMap, riskCategoryMap, subCategoryMap,riskStateMap, r.parent_id.get.toString(), r.parent_type.get, progrm, selectedSubCategory)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
              } else {

                var newFileName = ""
                request.body.file("document_category").map {
                  uploaded_document =>
                    import java.io.File
                    val filename = uploaded_document.filename
                    val contentType = uploaded_document.contentType
                    Play.application().configuration().getString("bdc.documents.location");
                    var filePath: String = Play.application().configuration().getString("bdc.documents.location") + "/";
                    var filePathParent: String = "";
                    println("filename===        " + filename)
                    if (!"".equals(filename)) {
                      //Retrieve file extension.

                      val extension = filename.substring((filename.lastIndexOf(".") + 1), filename.length())

                      //Create new file name from UUID
                      newFileName = UUID.randomUUID().toString() + "." + extension;

                      filePathParent = RiskService.getFilePath(parent_id, parent_type.toString());
                      var file = new File(filePathParent + "alldocuments/" + newFileName);
                      uploaded_document.ref.moveTo(file, true);
                      var docFile = new File(Play.application().configuration().getString("bdc.documents.location") + "/alldocuments/" + newFileName)
                      Files.copy(file.toPath(), docFile.toPath(), REPLACE_EXISTING);
                      if (!riskObj.get.document_category.isEmpty) {
                        var file_new = new File(filePathParent + "alldocuments/" + riskObj.get.document_category.get)
                        if (file_new.exists)
                          file_new.delete();
                      }
                    }
                }

                val user_id = Integer.parseInt(request.session.get("uId").get)
                if (!"".equals(newFileName)) {
                  val rm = RiskManagementMaster(Option(id.toInt), r.parent_id, r.parent_type, risk.name, risk.cause, risk.event, risk.imapct, risk.risk_category,
                    risk.variable_imapact, risk.probablity_of_occurence, risk.quantification, risk.strategic_reply, risk.responsible,
                    risk.reply_action, risk.configuration_plan, Option(newFileName), risk.risk_clouser_date, r.user_id, r.creation_date,
                    Option(new Date()), risk.risk_state, risk.sub_category)

                  if (old_res != risk.responsible) {
                    val risk_project = ProjectService.getRiskProjectDetails(progrm.get.program_id)
                    risk_project match {
                      case None =>
                      case Some(project: models.Project) =>
                        var isExist = false;
                        isExist = UserService.checkUserSettingbyuIdandpId(risk.responsible, project.pId.get)
                        if (isExist) {
                          val projectmapping = UserSetting(risk.responsible, project.pId.get, 1)
                          UserService.saveUserSetting(projectmapping)
                        }
                    }
                  }

                  val last = RiskService.updateRiskDetails(rm)
                } else {
                  val rm = RiskManagementMaster(Option(id.toInt), r.parent_id, r.parent_type, risk.name, risk.cause, risk.event, risk.imapct, risk.risk_category,
                    risk.variable_imapact, risk.probablity_of_occurence, risk.quantification, risk.strategic_reply, risk.responsible,
                    risk.reply_action, risk.configuration_plan, riskObj.get.document_category, risk.risk_clouser_date, r.user_id, r.creation_date,
                    Option(new Date()), risk.risk_state, risk.sub_category)

                  if (old_res != risk.responsible) {
                    val risk_project = ProjectService.getRiskProjectDetails(progrm.get.program_id)
                    risk_project match {
                      case None =>
                      case Some(project: models.Project) =>
                        var isExist = false;
                        isExist = UserService.checkUserSettingbyuIdandpId(risk.responsible, project.pId.get)
                        if (isExist) {
                          val projectmapping = UserSetting(risk.responsible, project.pId.get, 1)
                          UserService.saveUserSetting(projectmapping)
                        }
                    }
                  }

                  val last = RiskService.updateRiskDetails(rm)
                }

                /**
                 * Activity log
                 */
                val act = Activity(ActivityTypes.Risk.id, "Risk Upadated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
                Activity.saveLog(act)
                r.parent_type.get match {
                  case 0 =>
                    Redirect(routes.Program.programDetails(r.parent_id.get.toString()))
                  case 1 =>
                    Redirect(routes.ProjectMaster.projectDetails(r.parent_id.get.toString()))
                  case 2 =>
                    Redirect(routes.Task.projectTaskDetails(r.parent_id.get.toString()))
                  case 3 =>
                    Redirect(routes.SubTask.subTaskDetails(r.parent_id.get.toString()))
                }
              }

            })

      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Manual Alerts generations
   * Author - Balkrishna
   * Date - 25-02-2015
   */
  def newAlerts(risk_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var program: Option[ProgramMaster] = null
      var start_date: Date = new Date()
      var end_date: Date = new Date()
      var program_id = ""
      val risk = RiskService.findRiskDetails(risk_id)
      risk match {
        case None =>
          Redirect(routes.Login.loginUser())

        case Some(r: RiskManagementMaster) =>
          r.parent_type.get match {
            case 0 =>
              program_id = r.parent_id.get.toString()
            case 1 =>
              program = ProjectService.findProgramDetailForProject(r.parent_id.get.toString())
              program_id = program.get.program_id.get.toString()
            case 2 =>
              program = TaskService.findProgramDetailForTask(r.parent_id.get.toString())
              program_id = program.get.program_id.get.toString()
            case 3 =>
              program = SubTaskServices.findProgramDetailForSubTask(r.parent_id.get.toString())
              program_id = program.get.program_id.get.toString()
          }
          val users = ProgramMemberService.findAllProgramMembers(program_id);
          for (u <- users) {
            // println(u.uid + " " + u.first_name)
          }
          Ok(views.html.frontend.risks.newAlerts(risk_id, ARTForms.alertsForm, users, start_date, end_date)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def saveRiskAlert(risk_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var program: Option[ProgramMaster] = null
      var start_date: Date = new Date()
      var end_date: Date = new Date()
      var program_id = ""
      val risk = RiskService.findRiskDetails(risk_id)
      risk match {
        case None =>
          Redirect(routes.Login.loginUser())

        case Some(r: RiskManagementMaster) =>

          val risk = RiskService.findRiskDetails(risk_id)
          risk match {
            case None =>
              Redirect(routes.Login.loginUser())

            case Some(r: RiskManagementMaster) =>

              r.parent_type.get match {
                case 0 =>
                  program_id = r.parent_id.get.toString()
                case 1 =>
                  program = ProjectService.findProgramDetailForProject(r.parent_id.get.toString())
                  program_id = program.get.program_id.get.toString()
                case 2 =>
                  program = TaskService.findProgramDetailForTask(r.parent_id.get.toString())
                  program_id = program.get.program_id.get.toString()
                case 3 =>
                  program = SubTaskServices.findProgramDetailForSubTask(r.parent_id.get.toString())
                  program_id = program.get.program_id.get.toString()
              }

              val users = ProgramMemberService.findAllProgramMembers(program_id);
              val oldform = ARTForms.alertsForm.bindFromRequest
              oldform.fold(
                errors => {
                  Ok(views.html.frontend.risks.newAlerts(risk_id, errors, users, start_date, end_date))
                },
                risks => {

                  val user_id = Integer.parseInt(request.session.get("uId").get)
                  val alert = RiskAlerts(Option(1), risk_id.toInt, Option(2), risks.event_code, Option(new Date()),
                    risks.event_title, risks.event_details, Option(user_id), risks.person_invloved,
                    risks.alert_type,
                    risks.criticality, Option(1))

                  val last_index = RiskService.insertRiskAlert(alert)

                  /**
                   * Activity log
                   */
                  val act = Activity(ActivityTypes.Risk.id, "Risk alert sent by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), risk_id.toInt)
                  Activity.saveLog(act)
                  //RiskService.sendAutomaticAlerts(last_index.toString)

                  Ok("Sccuess");
                })
          }

      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getRiskSubCategory(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val riskSubCategory = RiskCategoryService.findRiskSubCategoryForRiskCategory(id)
      var subCategoryString = "<option>Select Sub Category</option>"
      for (subCategory <- riskSubCategory) {
        subCategoryString += " <option value='" + subCategory.id.get + "'>" + subCategory.name + "</option>"
      }
      Ok(subCategoryString);
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }
  def deleteRiskAlert(risk_alert_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      RiskService.updateRiskAlertStatus(risk_alert_id)
      /**
       * Activity log
       */
      val act = Activity(risk_alert_id.toInt, "Risk alert deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), risk_alert_id.toInt)
      Activity.saveLog(act)
      Ok("Success")
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

}