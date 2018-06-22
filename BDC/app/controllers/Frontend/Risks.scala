package controllers.Frontend


import play.api.mvc.Action
import play.api.mvc.Controller
import services._
import java.util.Date

import models._
import art_forms.ARTForms
import models.ProgramDates
import models.ProgramMaster
import models.RiskAlerts
import models.UserSetting
import models.Activity
import models.ActivityTypes
import play.Play
import play.Logger
import java.io.{File, FileOutputStream}
import java.util.UUID
import java.nio.file.Files
import java.nio.file.StandardCopyOption.REPLACE_EXISTING
import java.text.SimpleDateFormat

import org.apache.poi.xssf.usermodel.XSSFWorkbook

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
                //Redirect(routes.Risks.riskManagement(parent_id, parent_type))
                parent_type.intValue() match {
                  case 0 =>
                    Redirect(routes.Program.programDetails(parent_id))
                  case 1 =>
                    Redirect(routes.ProjectMaster.projectDetails(parent_id))
                  case 2 =>
                    Redirect(routes.Task.projectTaskDetails(parent_id))
                  case 3 =>
                    Redirect(routes.SubTask.subTaskDetails(parent_id))
                }
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

              //Redirect(routes.Risks.riskManagement(parent_id, parent_type))

              parent_type.intValue() match {
                case 0 =>
                  Redirect(routes.Program.programDetails(parent_id))
                case 1 =>
                  Redirect(routes.ProjectMaster.projectDetails(parent_id))
                case 2 =>
                  Redirect(routes.Task.projectTaskDetails(parent_id))
                case 3 =>
                  Redirect(routes.SubTask.subTaskDetails(parent_id))
              }

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

          Ok(views.html.frontend.risks.editRisk(id, ARTForms.riskManagementForm.fill(rm), usersMap, riskCategoryMap, subCategoryMap, riskStateMap, r.parent_id.get.toString(), r.parent_type.get, progrm, rm.sub_category.toString)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def editRiskAlert(risk_id: Integer, alert_id: Integer) = Action { implicit request =>

    request.session.get("username").map { user =>
      val alert = RiskService.findAlertsForRisk(risk_id.toString, alert_id.toString)
      val risk = RiskService.findRiskDetails(risk_id.toString)
      var program: Option[ProgramMaster] = null
      var program_id = ""

      val alert_states = new java.util.LinkedHashMap[String, String]()
      val status = RiskService.findAllAlertStatus()
      for (d <- status) {
        alert_states.put(d.id.get.toString, d.description)
      }
      val alert_category = new java.util.LinkedHashMap[String, String]()
      val category = RiskService.findAllAlertCategory()
      for (d <- category) {
        alert_category.put(d.id.get.toString, d.description)
      }

      val alert_task = new java.util.LinkedHashMap[String, String]()
      val tasks = TaskService.findTaskListByParentTypeId(risk.get)
      for (d <- tasks) {
        alert_task.put(d.tId.get.toString, d.task_title)
      }

      val mail_tmpl= new java.util.LinkedHashMap[String, String]()
      val tmpls = ConfigMailAlertService.listMailList
      for (d <- tmpls) {
        mail_tmpl.put(d.id.get.toString, d.description)
      }

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

          alert match {
            case None =>
              Redirect(routes.Login.loginUser())
            case Some(rr: RiskAlerts) =>
              val ra = RiskAlerts(rr.id,
                rr.risk_id,
                rr.event_code,
                rr.event_date,
                rr.event_title,
                rr.event_details,
                rr.responsible,
                rr.person_invloved,
                rr.criticality,
                rr.is_active,
                rr.category_id,
                rr.impacted_variable,
                rr.reiteration,
                rr.status_id,
                rr.task_id,
                rr.change_state,
                rr.responsible_answer,
                rr.template_id)

              val users = ProgramMemberService.findAllProgramMembers(program_id);

              println("reiteration : " + rr.reiteration.get.toInt)
              println("status_id : " + rr.status_id.get.toInt)

              if(rr.status_id.get.toInt == 3)// Alerta cerrada
                {
                  Ok(views.html.frontend.risks.alertDetails(
                    alert,
                    risk)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);

                }else{
                Ok(views.html.frontend.risks.editAlert(
                  risk_id.toString,
                  alert_id.toString,
                  ARTForms.alertsForm.fill(ra),
                  alert,
                  users,
                  alert_states,
                  alert_category,
                  alert_task,
                  mail_tmpl)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);

              }


          }
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
      //val alerts = RiskService.findAllActiveAlertsByRiskId(id)
      val alerts = RiskService.findRiskAlertsExtendedById(id)
      val risk = RiskService.findRiskDetails(id)
      val parent_id = risk.get.parent_id.get.toString()
      //println("parent_id [" + parent_id + "]")
      risk match {
        case None =>
          Ok("No Details Available");
        case Some(r: RiskManagementMaster) =>
          Ok(views.html.frontend.risks.riskDetails(alerts, risk, parent_id)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateAlert(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val alert = RiskService.findRiskAlertsById(id)
      val risk = RiskService.findRiskDetails(alert.get.risk_id.toString)

      alert match {
        case None =>
          Redirect(routes.Login.loginUser())
        case Some(rr: RiskAlerts) =>
          val ra = RiskAlerts(rr.id,
            rr.risk_id,
            rr.event_code,
            rr.event_date,
            rr.event_title,
            rr.event_details,
            rr.responsible,
            rr.person_invloved,
            rr.criticality,
            rr.is_active,
            rr.category_id,
            rr.impacted_variable,
            rr.reiteration,
            rr.status_id,
            rr.task_id,
            rr.change_state,
            rr.responsible_answer,
            rr.template_id)

          ARTForms.alertsForm.bindFromRequest.fold(
            errors => {
              var program_id = ""
              println("Errors - " + errors.errors);
              val riskObj = RiskService.findRiskDetails(ra.risk_id.toString)
              var program: Option[ProgramMaster] = null
              riskObj.get.parent_type.get match {
                case 0 =>
                  program_id = riskObj.get.parent_id.get.toString()
                case 1 =>
                  program = ProjectService.findProgramDetailForProject(riskObj.get.parent_id.toString())
                  program_id = program.get.program_id.get.toString()
                case 2 =>
                  program = TaskService.findProgramDetailForTask(riskObj.get.parent_id.get.toString())
                  program_id = program.get.program_id.get.toString()
                case 3 =>
                  program = SubTaskServices.findProgramDetailForSubTask(riskObj.get.parent_id.get.toString())
                  program_id = program.get.program_id.get.toString()
              }
              val users = ProgramMemberService.findAllProgramMembers(program_id);
              val alert_states = new java.util.LinkedHashMap[String, String]()
              val status = RiskService.findAllAlertStatus()
              for (d <- status) {
                alert_states.put(d.id.get.toString, d.description)
              }
              val alert_category = new java.util.LinkedHashMap[String, String]()
              val category = RiskService.findAllAlertCategory()
              for (d <- category) {
                alert_category.put(d.id.get.toString, d.description)
              }

              val alert_task = new java.util.LinkedHashMap[String, String]()
              val tasks = TaskService.findTaskListByParentTypeId(risk.get)
              for (d <- tasks) {
                alert_task.put(d.tId.get.toString, d.task_title)
              }
              val mail_tmpl= new java.util.LinkedHashMap[String, String]()
              val tmpls = ConfigMailAlertService.listMailList
              for (d <- tmpls) {
                mail_tmpl.put(d.id.get.toString, d.description)
              }

              BadRequest(views.html.frontend.risks.editAlert(ra.risk_id.toString,
                id,
                errors,
                alert,
                users,
                alert_states,
                alert_category,
                alert_task,
                mail_tmpl))
            },
            success => {

              val theForm = RiskService.validateAlert(ARTForms.alertsForm.fill(success))

              val theAlert = RiskAlerts(ra.id,
                ra.risk_id,
                success.event_code,
                ra.event_date,
                success.event_title.toString,
                success.event_details,
                ra.responsible,
                success.person_invloved,
                success.criticality,
                ra.is_active,
                success.category_id,
                success.impacted_variable,
                success.reiteration,
                success.status_id,
                success.task_id,
                success.change_state,
                success.responsible_answer,
                success.template_id)

              val last = RiskService.updateAlertDetails(theAlert)

              /**
               * Activity log
               */
              val act = Activity(ActivityTypes.Alert.id, "Alert sent by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
              Activity.saveLog(act)
              //RiskService.sendAutomaticAlerts(last_index.toString)

              Ok("Sccuess");

              ////            
            })
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }


  def updateAlertAndSendMail(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val alert = RiskService.findRiskAlertsById(id)
      val risk = RiskService.findRiskDetails(alert.get.risk_id.toString)

      alert match {
        case None =>
          Redirect(routes.Login.loginUser())
        case Some(rr: RiskAlerts) =>
          val ra = RiskAlerts(rr.id,
            rr.risk_id,
            rr.event_code,
            rr.event_date,
            rr.event_title,
            rr.event_details,
            rr.responsible,
            rr.person_invloved,
            rr.criticality,
            rr.is_active,
            rr.category_id,
            rr.impacted_variable,
            rr.reiteration,
            rr.status_id,
            rr.task_id,
            rr.change_state,
            rr.responsible_answer,
            rr.template_id)

          ARTForms.alertsForm.bindFromRequest.fold(
            errors => {
              var program_id = ""
              println("Errors - " + errors.errors);
              val riskObj = RiskService.findRiskDetails(ra.risk_id.toString)
              var program: Option[ProgramMaster] = null
              riskObj.get.parent_type.get match {
                case 0 =>
                  program_id = riskObj.get.parent_id.get.toString()
                case 1 =>
                  program = ProjectService.findProgramDetailForProject(riskObj.get.parent_id.toString())
                  program_id = program.get.program_id.get.toString()
                case 2 =>
                  program = TaskService.findProgramDetailForTask(riskObj.get.parent_id.get.toString())
                  program_id = program.get.program_id.get.toString()
                case 3 =>
                  program = SubTaskServices.findProgramDetailForSubTask(riskObj.get.parent_id.get.toString())
                  program_id = program.get.program_id.get.toString()
              }
              val users = ProgramMemberService.findAllProgramMembers(program_id);
              val alert_states = new java.util.LinkedHashMap[String, String]()
              val status = RiskService.findAllAlertStatus()
              for (d <- status) {
                alert_states.put(d.id.get.toString, d.description)
              }
              val alert_category = new java.util.LinkedHashMap[String, String]()
              val category = RiskService.findAllAlertCategory()
              for (d <- category) {
                alert_category.put(d.id.get.toString, d.description)
              }

              val alert_task = new java.util.LinkedHashMap[String, String]()
              val tasks = TaskService.findTaskListByParentTypeId(risk.get)
              for (d <- tasks) {
                alert_task.put(d.tId.get.toString, d.task_title)
              }
              val mail_tmpl= new java.util.LinkedHashMap[String, String]()
              val tmpls = ConfigMailAlertService.listMailList
              for (d <- tmpls) {
                mail_tmpl.put(d.id.get.toString, d.description)
              }

              BadRequest(views.html.frontend.risks.editAlert(ra.risk_id.toString,
                id,
                errors,
                alert,
                users,
                alert_states,
                alert_category,
                alert_task,
                mail_tmpl))
            },
            success => {

              val theForm = RiskService.validateAlert(ARTForms.alertsForm.fill(success))

              val theAlert = RiskAlerts(ra.id,
                ra.risk_id,
                success.event_code,
                ra.event_date,
                success.event_title.toString,
                success.event_details,
                ra.responsible,
                success.person_invloved,
                success.criticality,
                ra.is_active,
                success.category_id,
                success.impacted_variable,
                success.reiteration,
                success.status_id,
                success.task_id,
                success.change_state,
                success.responsible_answer,
                success.template_id)

              val last = RiskService.updateAlertDetailsMail(theAlert)

              /**
                * Activity log
                */

              val act = Activity(ActivityTypes.Alert.id, "Alert sent by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
              Activity.saveLog(act)

              Ok("Sccuess");

              ////
            })
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }
  //

  def updateRisk(id: String) = Action(parse.multipartFormData) { implicit request =>
    request.session.get("username").map { user =>
      //var program = ProgramService.findProgramMasterDetailsById(program_id)

      val riskObj = RiskService.findRiskDetails(id)
      //val alerts = RiskService.findAllActiveAlertsByRiskId(id)
      val alerts = RiskService.findRiskAlertsExtendedById(id)
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
              BadRequest(views.html.frontend.risks.editRisk(id, the_Form, usersMap, riskCategoryMap, subCategoryMap, riskStateMap, r.parent_id.get.toString(), r.parent_type.get, progrm, selectedSubCategory)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
            },
            risk => {
              val the_Form = RiskService.validateRiskForUpdate(oldform, progrm, id, parent_id.toString(), parent_type.toString())

              if (the_Form.hasErrors) {
                var selectedSubCategory = "";
                if (!the_Form("sub_category").value.isEmpty) {
                  selectedSubCategory = the_Form("sub_category").value.get.toString
                }
                BadRequest(views.html.frontend.risks.editRisk(id, the_Form, usersMap, riskCategoryMap, subCategoryMap, riskStateMap, r.parent_id.get.toString(), r.parent_type.get, progrm, selectedSubCategory)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
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
                /*
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
                */
                val newrisk = RiskService.findRiskDetails(id)
                Ok(views.html.frontend.risks.riskDetails(alerts, newrisk, parent_id)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
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
   * Review  18-12-2017
   */
  def newAlerts(risk_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var program: Option[ProgramMaster] = null
      val start_date: Date = new Date()
      val end_date: Date = new Date()
      var program_id = ""
      val risk = RiskService.findRiskDetails(risk_id)

      val alert_states = new java.util.LinkedHashMap[String, String]()
      val status = RiskService.findAllAlertStatus()
      for (d <- status) {
        alert_states.put(d.id.get.toString, d.description)
      }
      val alert_category = new java.util.LinkedHashMap[String, String]()
      val category = RiskService.findAllAlertCategory()
      for (d <- category) {
        alert_category.put(d.id.get.toString, d.description)
      }

      val alert_task = new java.util.LinkedHashMap[String, String]()
      val tasks = TaskService.findTaskListByParentTypeId(risk.get)
      for (d <- tasks) {
        alert_task.put(d.tId.get.toString, d.task_title)
      }

      val mail_tmpl= new java.util.LinkedHashMap[String, String]()
      val tmpls = ConfigMailAlertService.listMailList
      for (d <- tmpls) {
        mail_tmpl.put(d.id.get.toString, d.description)
      }

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

          Ok(views.html.frontend.risks.newAlerts(
            risk_id,
            ARTForms.alertsForm,
            users,
            start_date,
            end_date,
            alert_states,
            alert_category,
            alert_task,
            mail_tmpl)).withSession(
            "username" -> request.session.get("username").get,
            "utype" -> request.session.get("utype").get,
            "uId" -> request.session.get("uId").get,
            "user_profile" -> request.session.get("user_profile").get)
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def searchResult() = Action { implicit request =>

    request.session.get("username").map { user =>

      val myForm = ARTForms.alertsSearchForm.bindFromRequest
          myForm.fold(
            errors => {
              val alert_states = new java.util.LinkedHashMap[String, String]()
              val status = RiskService.findAllAlertStatus()
              for (d <- status) {
                alert_states.put(d.id.get.toString, d.description)
              }

              val alert_category = new java.util.LinkedHashMap[String, String]()
              val category = RiskService.findAllAlertCategory()
              for (d <- category) {
                alert_category.put(d.id.get.toString, d.description)
              }
              BadRequest(views.html.frontend.risks.alertForm( ARTForms.alertsSearchForm,
                alert_states,
                alert_category)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
            },
            success => {
              println("category_id : " + success.category_id.getOrElse(0))
              println("status_id : " + success.status_id.getOrElse(0))
              println("event_code : " + success.event_code.getOrElse(0))
              println("criticality : " + success.criticality.getOrElse(0))

              //success.category_id
              val file = new File("alert.xlsx")
              val fileOut = new FileOutputStream(file);
              val wb = new XSSFWorkbook
              val sheet = wb.createSheet("Alertas")
              var j = 0
              var rNum = 1
              var cNum = 0
              var a = 0

              var rowhead = sheet.createRow(0);
              val style = wb.createCellStyle();
              val font = wb.createFont();
              font.setFontName(org.apache.poi.hssf.usermodel.HSSFFont.FONT_ARIAL);
              font.setFontHeightInPoints(10);
              font.setBold(true);
              style.setFont(font);
              rowhead.createCell(0).setCellValue("program_program_code")
              rowhead.createCell(1).setCellValue("alert_id")
              rowhead.createCell(2).setCellValue("program_workflow_status")
              rowhead.createCell(3).setCellValue("program_program_name")
              rowhead.createCell(4).setCellValue("alert_impacted_variable")
              rowhead.createCell(5).setCellValue("risk_category")
              rowhead.createCell(6).setCellValue("risk_sub_category")
              rowhead.createCell(7).setCellValue("alert_category")
              rowhead.createCell(8).setCellValue("alert_criticality")
              rowhead.createCell(9).setCellValue("program_program_manager")
              rowhead.createCell(10).setCellValue("alert_responsible")
              rowhead.createCell(11).setCellValue("alert_event_title")
              rowhead.createCell(12).setCellValue("alert_status")
              rowhead.createCell(13).setCellValue("alert_reiteration")
              rowhead.createCell(14).setCellValue("alert_responsible_answer")
              rowhead.createCell(15).setCellValue("risk_name")
              rowhead.createCell(16).setCellValue("alert_event_date")
              rowhead.createCell(17).setCellValue("alert_change_state")
              rowhead.createCell(18).setCellValue("diff_in_days")

              for (j <- 0 to 18)
                rowhead.getCell(j).setCellStyle(style)

              val panel = RiskService.findReportAlerts(
                success.criticality.getOrElse(0),
                success.status_id.getOrElse(0),
                success.event_code.getOrElse(0),
                success.category_id.getOrElse(0)
              )

              for (s <- panel) {
                val row = sheet.createRow(rNum)

                val cel0 = row.createCell(cNum)
                cel0.setCellValue(s.program_program_code)

                val cel1 = row.createCell(cNum + 1)
                cel1.setCellValue(s.alert_id)

                val cel2 = row.createCell(cNum + 2)
                cel2.setCellValue(s.program_workflow_status)

                val cel3 = row.createCell(cNum + 3)
                cel3.setCellValue(s.program_program_name)

                val cel4 = row.createCell(cNum + 4)
                cel4.setCellValue(s.alert_impacted_variable)

                val cel5 = row.createCell(cNum + 5)
                cel5.setCellValue(s.risk_category)

                val cel6 = row.createCell(cNum + 6)
                cel6.setCellValue(s.risk_sub_category)

                val cel7 = row.createCell(cNum + 7)
                cel7.setCellValue(s.alert_category)

                val cel8 = row.createCell(cNum + 8)
                cel8.setCellValue(s.alert_criticality)

                val cel9 = row.createCell(cNum + 9)
                cel9.setCellValue(s.program_program_manager)

                val cel10 = row.createCell(cNum + 10)
                cel10.setCellValue(s.alert_responsible)

                val cel11 = row.createCell(cNum + 11)
                cel11.setCellValue(s.alert_event_title)

                val cel12 = row.createCell(cNum + 12)
                cel12.setCellValue(s.alert_status)

                val cel13 = row.createCell(cNum + 13)
                cel13.setCellValue(s.alert_reiteration)

                val cel14 = row.createCell(cNum + 14)
                cel14.setCellValue(s.alert_responsible_answer)

                val cel15 = row.createCell(cNum + 15)
                cel15.setCellValue(s.risk_name)

                val cel16 = row.createCell(cNum + 16)
                cel16.setCellValue(s.event_date)

                val cel17 = row.createCell(cNum + 17)
                cel17.setCellValue(s.change_state)

                val cel18 = row.createCell(cNum + 18)
                cel18.setCellValue(s.diff_in_days.toString)

                rNum = rNum + 1
                cNum = 0

              }

              for (a <- 0 to 17) {
                sheet.autoSizeColumn((a.toInt));
              }

              wb.write(fileOut);
              fileOut.close();


              val FormattedDATE = new SimpleDateFormat("yyyy-MM-dd-hh-mm-ss")
              val now = FormattedDATE.format(new Date().getTime).toString

              Ok.sendFile(content = file, fileName = _ => "alert_" + now + ".xlsx")

            })

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

def alertSearch() = Action { implicit request =>
  request.session.get("username").map { user =>


        val alert_states = new java.util.LinkedHashMap[String, String]()
        val status = RiskService.findAllAlertStatus()
        for (d <- status) {
          alert_states.put(d.id.get.toString, d.description)
        }

        val alert_category = new java.util.LinkedHashMap[String, String]()
        val category = RiskService.findAllAlertCategory()
        for (d <- category) {
          alert_category.put(d.id.get.toString, d.description)
        }


        Ok(views.html.frontend.risks.alertForm(
          ARTForms.alertsSearchForm,
          alert_states,
          alert_category)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);

  }.getOrElse {
    Redirect(routes.Login.loginUser())
  }
}

  def saveRiskAlert(risk_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var program: Option[ProgramMaster] = null
      val start_date: Date = new Date()
      val end_date: Date = new Date()
      var program_id = ""

      val risk = RiskService.findRiskDetails(risk_id)
      val alert_states = new java.util.LinkedHashMap[String, String]()
      val status = RiskService.findAllAlertStatus()
      for (d <- status) {
        alert_states.put(d.id.get.toString, d.description)
      }
      val alert_category = new java.util.LinkedHashMap[String, String]()
      val category = RiskService.findAllAlertCategory()
      for (d <- category) {
        alert_category.put(d.id.get.toString, d.description)
      }
      val alert_task = new java.util.LinkedHashMap[String, String]()
      val tasks = TaskService.findTaskListByParentTypeId(risk.get)
      for (d <- tasks) {
        alert_task.put(d.tId.get.toString, d.task_title)
      }
      val mail_tmpl= new java.util.LinkedHashMap[String, String]()
      val tmpls = ConfigMailAlertService.listMailList
      for (d <- tmpls) {
        mail_tmpl.put(d.id.get.toString, d.description)
      }
      //println(alert_task)
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
                  Ok(views.html.frontend.risks.newAlerts(risk_id,
                    errors,
                    users,
                    start_date,
                    end_date,
                    alert_states,
                    alert_category,
                    alert_task,
                    mail_tmpl))
                },
                risks => {

                  val user_id = Integer.parseInt(request.session.get("uId").get)
                  Logger.debug("TOA LA WEA " + risks)
                  val alert = RiskAlerts(
                    Option(1),
                    risk_id.toInt,
                    risks.event_code,
                    Option(new Date()),
                    risks.event_title,
                    risks.event_details,
                    Option(user_id),
                    risks.person_invloved,
                    risks.criticality,
                    Option(1),
                    risks.category_id,
                    risks.impacted_variable,
                    risks.reiteration,
                    risks.status_id,
                    risks.task_id,
                    risks.change_state,
                    risks.responsible_answer,
                    risks.template_id)

                  val last_index = RiskService.insertRiskAlert(alert)
                  //Logger.debug("EL VALOR DEVUELTO ES " + last_index)
                  //RiskService.insertAlertSend(last_index.toInt, risks.template_id.get)

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