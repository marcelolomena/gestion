package art_forms

import scala.math.BigDecimal.int2bigDecimal
import models._
import services._
import play.api.data.Form
import play.api.data.Forms.email
import play.api.data.Forms.mapping
import play.api.data.Forms.nonEmptyText
import play.api.data.Forms.number
import play.api.data.Forms.of
import play.api.data.Forms.optional
import play.api.data.Forms.text
import play.api.data.format.Formats.bigDecimalFormat
import play.api.data.format.Formats.booleanFormat
import play.api.data.format.Formats.doubleFormat
import play.api.data.format.Formats.longFormat
import play.i18n.Lang
import play.i18n.Messages

object ARTForms {

  val langObj = new Lang(Lang.forCode("es-ES"))

  /**
   * add/edit project form FRONT end.
   */
  val projectForm: Form[ProjectMasters] = Form(
    mapping(
      "project_id" -> text.verifying(Messages.get(langObj, "error.project.projectId"), program_type => program_type.length() > 4 && program_type.length() < 9),
      "program" -> number,
      "project_mode" -> number,
      "project_name" -> text.verifying(Messages.get(langObj, "error.project.projectName"), project_name => project_name.length > 0),
      "description" -> text.verifying(Messages.get(langObj, "error.project.projectDescription"), description => (description.length > 4 && description.length <= 160)),
      "project_manager" -> number.verifying(Messages.get(langObj, "error.project.projectManager"), project_manager => project_manager > 0),
      "start_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "final_release_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "completion_percentage" -> optional(of[Double].verifying(Messages.get(langObj, "error.program."), completion_per => (completion_per >= 0 && completion_per <= 100))),
      "ppm_number" -> optional(of[Double].verifying(Messages.get(langObj, "error.project.ppm_number"), ppm_number => (ppm_number >= 0 && ppm_number <= 999999999))),
      "work_flow_status" -> optional(number),
      "baseline" -> of[Boolean],
      "planned_hours" -> optional(of[Double]))(ProjectMasters.apply)(ProjectMasters.unapply))

  /**
   * add Generic project form FRONT end.
   */
  val genericprojectForm: Form[GernericProject] = Form(
    mapping(
      "id" -> optional(number),
      "project_id" -> text.verifying(Messages.get(langObj, "error.project.projectId"), program_type => program_type.length() > 4 && program_type.length() < 9),
      "project_mode" -> number.verifying(Messages.get(langObj, "projecttype.projecttypealereadyexists"), project_mode => GenericProjectService.findProjectTypeInGenericProject(project_mode)),
      "project_name" -> text.verifying(Messages.get(langObj, "error.project.projectName"), project_name => project_name.length > 0),
      "description" -> text.verifying(Messages.get(langObj, "error.project.projectDescription"), description => (description.length > 4 && description.length <= 160)),
      "project_manager" -> number.verifying(Messages.get(langObj, "error.project.projectManager"), project_manager => project_manager > 0),
      "start_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "final_release_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "budget_approved" -> number,
      "sap_code" -> optional(text),
      "total_sap" -> of[BigDecimal].verifying(Messages.get(langObj, "error.project.total_sap"), total_sap => (total_sap >= 0)),
      "budget_approved_staff" -> of[BigDecimal].verifying(Messages.get(langObj, "error.project.budgetValue"), budget_approved_staff => (budget_approved_staff >= 0 && budget_approved_staff <= 999999999)),
      "budget_approved_contractor" -> of[BigDecimal].verifying(Messages.get(langObj, "error.project.budgetValue"), budget_approved_contractor => (budget_approved_contractor >= 0 && budget_approved_contractor <= 999999999)),
      "budget_approved_hardware" -> of[BigDecimal].verifying(Messages.get(langObj, "error.project.budgetValue"), budget_approved_hardware => (budget_approved_hardware >= 0 && budget_approved_hardware <= 999999999)),
      "budget_approved_software" -> of[BigDecimal].verifying(Messages.get(langObj, "error.project.budgetValue"), budget_approved_software => (budget_approved_software >= 0 && budget_approved_software <= 999999999)),
      "ppm_number" -> optional(of[Double].verifying(Messages.get(langObj, "error.project.ppm_number"), ppm_number => (ppm_number >= 0 && ppm_number <= 999999999))),
      "work_flow_status" -> optional(number),
      "baseline" -> of[Boolean])(GernericProject.apply)(GernericProject.unapply))

  /**
   * Edit Generic project form FRONT end.
   */
  val editGenericprojectForm: Form[GernericProject] = Form(
    mapping(
      "id" -> optional(number),
      "project_id" -> text.verifying(Messages.get(langObj, "error.project.projectId"), program_type => program_type.length() > 4 && program_type.length() < 9),
      "project_mode" -> number,
      "project_name" -> text.verifying(Messages.get(langObj, "error.project.projectName"), project_name => project_name.length > 0),
      "description" -> text.verifying(Messages.get(langObj, "error.project.projectDescription"), description => (description.length > 4 && description.length <= 160)),
      "project_manager" -> number.verifying(Messages.get(langObj, "error.project.projectManager"), project_manager => project_manager > 0),
      "start_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "final_release_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "budget_approved" -> number,
      "sap_code" -> optional(text),
      "total_sap" -> of[BigDecimal].verifying(Messages.get(langObj, "error.project.ppm_number"), ppm_number => (ppm_number >= 0 && ppm_number <= 999999999)),
      "budget_approved_staff" -> of[BigDecimal].verifying(Messages.get(langObj, "error.project.budgetValue"), budget_approved_staff => (budget_approved_staff >= 0 && budget_approved_staff <= 999999999)),
      "budget_approved_contractor" -> of[BigDecimal].verifying(Messages.get(langObj, "error.project.budgetValue"), budget_approved_contractor => (budget_approved_contractor >= 0 && budget_approved_contractor <= 999999999)),
      "budget_approved_hardware" -> of[BigDecimal].verifying(Messages.get(langObj, "error.project.budgetValue"), budget_approved_hardware => (budget_approved_hardware >= 0 && budget_approved_hardware <= 999999999)),
      "budget_approved_software" -> of[BigDecimal].verifying(Messages.get(langObj, "error.project.budgetValue"), budget_approved_software => (budget_approved_software >= 0 && budget_approved_software <= 999999999)),
      "ppm_number" -> optional(of[Double].verifying(Messages.get(langObj, "error.project.ppm_number"), ppm_number => (ppm_number >= 0 && ppm_number <= 999999999))),
      "work_flow_status" -> optional(number),
      "baseline" -> of[Boolean])(GernericProject.apply)(GernericProject.unapply))

  /**
   * add/edit task Front end
   */
  val taskForm: Form[TaskMaster] = Form(
    mapping(
      "mId" -> optional(number),
      "pId" -> number, //.verifying(Messages.get("error.task.projectId"), project => project.length() > 4),
      "project_mode" -> number,
      "pert" -> number, //of[Boolean]
      "title" -> text.verifying(Messages.get(langObj, "error.task.milestone_title"), title => title.length() >= 4 && title.length() <= 60),
      "plan_start_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "plan_end_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "description" -> text.verifying(Messages.get(langObj, "error.task.description"), description => description.length() > 0 && description.length() <= 160),
      "plan_time" -> of[BigDecimal].verifying(Messages.get(langObj, "error.task.plan_time"), (plan_time => plan_time >= 0 && plan_time <= 99999)),
      "task_status" -> number.verifying(Messages.get(langObj, "error.task.milestone_status"), (milestone_status => milestone_status >= 0)),
      "status" -> number,
      "task_owner" -> number.verifying(Messages.get(langObj, "error.task.owner"), (task_owner => task_owner >= 0)),
      "task_discipline" -> number,
      "completion_percentage" -> optional(of[Double].verifying(Messages.get(langObj, "error.program.completion_per"), program_code => (program_code >= 0 && program_code <= 100))),
      "remark" -> optional(text),
      "task_depend" -> optional(text),
      "dependencies_type" -> optional(number),
      "task_details" -> mapping(
        "task_type" -> number,
        "task_code" -> text,
        "stage" -> number,
        "user_role" -> number,
        "deliverable" -> optional(number))(TaskDetails.apply)(TaskDetails.unapply))((tId, pId, project_mode, pert, title, plan_start_date, plan_end_date,
        description, plan_time, task_status, status, task_owner, task_discipline,
        completion_percentage, remark, task_depend, dependencies_type, task_details) =>
        TaskMaster(tId, pId, project_mode, pert, title, plan_start_date, plan_end_date,
          description, plan_time, task_status, status, task_owner, task_discipline,
          completion_percentage, remark, task_depend, dependencies_type, task_details))((task: TaskMaster) => Some((task.tId, task.project, task.status, task.pert, task.task_title, task.plan_start_date, task.plan_end_date,
        task.task_description, task.plan_time, task.task_status, task.status, task.owner, task.task_discipline,
        task.completion_percentage, task.remark, task.task_depend, task.dependencies_type, task.task_details))))

  val userRegistrationForm: Form[UserMaster] = Form(
    mapping(
      "uid" -> optional(number),
      "uname" -> text.verifying(Messages.get(langObj, "error.user.username.minmax"), uname => (uname.length() >= 4 && uname.length() <= 15)).verifying(Messages.get("error.user.unique"), uname => UserService.checkUsername(uname) == 0), //
      "profile_image" -> optional(text),
      "first_name" -> text.verifying(Messages.get(langObj, "error.user.first.minmax"), first_name => first_name.length() >= 4 && first_name.length() <= 30),
      "last_name" -> text.verifying(Messages.get(langObj, "error.user.last.minmax"), last_name => last_name.length() >= 4 && last_name.length() <= 30),
      "email" -> email.verifying(Messages.get(langObj, "error.user.email.minmax"), email => (email.length() > 0)).verifying(Messages.get("error.user.email.unique"), email => UserService.checkEmailId(email) == 0),
      "password" -> text.verifying(Messages.get(langObj, "error.user.password.minmax"), password => password.length() > 4 && password.length() <= 10),
      "birth_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "rut_number" -> text.verifying(Messages.get(langObj, "error.user.rut.minmax"), rut_number => rut_number.length() > 4 && rut_number.length() <= 15),
      "contact_number" -> text.verifying(Messages.get(langObj, "error.user.conatct.minmax"), contact_number => contact_number.length() > 0),
      "isverify" -> optional(number),
      "verify_code" -> optional(text),
      "verify_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "status" -> number,
      "added_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "office" -> mapping(
        "division" -> number.verifying(Messages.get(langObj, "error.user.division.minmax"), division => division > 0),
        "gerencia" -> optional(number),
        "department" -> optional(number),
        "joining_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
        "office_number" -> text,
        "isadmin" -> number,
        "rate_hour" -> number,
        "user_type" -> number,
        "work_hours" -> of[BigDecimal],
        "bonus_app" -> number,
        "user_profile" -> text)(OfficeMaster.apply)(OfficeMaster.unapply))((uid, uname, profile_image, first_name, last_name, email, password,
        birth_date, rut_number, contact_number, isverify, verify_code, verify_date, status, added_date, office) =>
        UserMaster(uid, uname, profile_image, first_name, last_name, email, password, birth_date, rut_number, contact_number,
          isverify, verify_code, verify_date, status, added_date, office))((users: UserMaster) => Some((users.uid, users.uname, users.profile_image, users.first_name, users.last_name, users.email, users.password,
        users.birth_date, users.rut_number, users.contact_number, users.isverify, users.verify_code, users.verify_date, users.status, users.added_date, users.office))))

  val userUpdateForm: Form[UserMaster] = Form(
    mapping(
      "uid" -> optional(number),
      "uname" -> text, //
      "profile_image" -> optional(text),
      "first_name" -> text.verifying(Messages.get(langObj, "error.user.first.minmax"), first_name => first_name.length() >= 4 && first_name.length() <= 30),
      "last_name" -> text.verifying(Messages.get(langObj, "error.user.last.minmax"), last_name => last_name.length() >= 4 && last_name.length() <= 30),
      "email" -> email,
      "password" -> text.verifying(Messages.get(langObj, "error.user.password.minmax"), password => password.length() >= 4),
      "birth_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "rut_number" -> text,
      "contact_number" -> text.verifying(Messages.get(langObj, "error.user.conatct.minmax"), contact_number => contact_number.length() > 0),
      "isverify" -> optional(number),
      "verify_code" -> optional(text),
      "verify_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "status" -> number,
      "added_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "office" -> mapping(
        "division" -> number.verifying(Messages.get(langObj, "error.user.division.minmax"), division => division > 0),
        "gerencia" -> optional(number),
        "department" -> optional(number),
        "joining_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
        "office_number" -> text,
        "isadmin" -> number,
        "rate_hour" -> number,
        "user_type" -> number,
        "work_hours" -> of[BigDecimal],
        "bonus_app" -> number,
        "user_profile" -> text)(OfficeMaster.apply)(OfficeMaster.unapply))((uid, uname, profile_image, first_name, last_name, email, password,
        birth_date, rut_number, contact_number, isverify, verify_code, verify_date, status, added_date, office) =>
        UserMaster(uid, uname, profile_image, first_name, last_name, email, password, birth_date, rut_number, contact_number,
          isverify, verify_code, verify_date, status, added_date, office))((users: UserMaster) => Some((users.uid, users.uname, users.profile_image, users.first_name, users.last_name, users.email, users.password,
        users.birth_date, users.rut_number, users.contact_number, users.isverify, users.verify_code, users.verify_date, users.status, users.added_date, users.office))))

  val programForm: Form[Programs] = Form(
    mapping(
      "program_type" -> number,
      "program_sub_type" -> optional(number),
      "program_name" -> text.verifying(Messages.get(langObj, "error.program.program_name.MinMax"), program_name => program_name.trim().length() >= 4 && program_name.trim().length() <= 140),
      "program_code" -> of[Long], //.verifying(Messages.get(langObj, "error.program.program_code.MinMax"), program_code => (program_code >= 0 && program_code < 99999999)).verifying(Messages.get(langObj, "error.program.program_code.unique"), program_code => ProgramService.findPrgoramCode(program_code)),
      "program_description" -> optional(text.verifying(Messages.get(langObj, "error.program.program_description.MinMax"), program_description => program_description.trim().length() > 3 && program_description.trim().length() <= 500)),
      "work_flow_status" -> number,
      "demand_manager" -> number,
      "program_manager" -> number,
      "program_details" -> mapping(
        "devison" -> number,
        "management" -> optional(number),
        "department" -> optional(number),
        "impact_type" -> number,
        "business_line" -> optional(text.verifying(Messages.get(langObj, "error.program.program_details_business_line.MinMax"), business_line => business_line.trim().length() > 0 && business_line.trim().length() < 60)),
        "sap_code" -> optional(number))(ProgramDetail.apply)(ProgramDetail.unapply),
      "program_dates" -> mapping(
        "initiation_planned_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
        "creation_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
        "closure_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
        "release_date" -> play.api.data.Forms.date("dd-MM-yyyy"))(ProgramDate.apply)(ProgramDate.unapply),
      "is_active" -> optional(number),
      "planned_hours" -> optional(of[Long]),
      "internal_state" -> text,
      "estimated_cost" -> optional(of[Long]))((program_type, program_sub_type, program_name, program_code,
        program_description, work_flow_status, demand_manager, program_manager, program_details, program_dates, is_active, planned_hours, internal_state, estimated_cost) =>
        Programs(None, program_type, program_sub_type, program_name, program_code,
          program_description, work_flow_status, demand_manager,
          program_manager, program_details, program_dates, is_active, planned_hours, internal_state, estimated_cost))((program: Programs) => Some((program.program_type, program.program_sub_type, program.program_name, program.program_code,
        program.program_description, program.work_flow_status, program.demand_manager, program.program_manager,
        program.program_details, program.program_dates, program.is_active, program.planned_hours, program.internal_state, program.estimated_cost))))

  /**
   * edit program front end
   */
  val programFormEdit: Form[Programs] = Form(
    mapping(
      "program_type" -> number,
      "program_sub_type" -> optional(number),
      "program_name" -> text.verifying(Messages.get(langObj, "error.program.program_name.MinMax"), program_name => program_name.trim().length() >= 4 && program_name.trim().length() <= 140),
      "program_code" -> of[Long], //.verifying(Messages.get(langObj, "error.program.program_code.MinMax"), program_code => (program_code >= 0 && program_code < 99999999)), //
      "program_description" -> optional(text.verifying(Messages.get(langObj, "error.program.program_description.MinMax"), program_description => program_description.trim().length() > 3 && program_description.trim().length() <= 500)),
      "work_flow_status" -> number,
      "demand_manager" -> number,
      "program_manager" -> number,
      "program_details" -> mapping(
        "devison" -> number,
        "management" -> optional(number),
        "department" -> optional(number),
        "impact_type" -> number,
        "business_line" -> optional(text.verifying(Messages.get(langObj, "error.program.program_details_business_line.MinMax"), business_line => business_line.trim().length() > 0 && business_line.trim().length() < 60)),
        "sap_code" -> optional(number))(ProgramDetail.apply)(ProgramDetail.unapply),
      "program_dates" -> mapping(
        "initiation_planned_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
        "creation_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
        "closure_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
        "release_date" -> play.api.data.Forms.date("dd-MM-yyyy"))(ProgramDate.apply)(ProgramDate.unapply),
      "is_active" -> optional(number),
      "planned_hours" -> optional(of[Long]),
      "internal_state" -> text,
      "estimated_cost" -> optional(of[Long]))((program_type, program_sub_type, program_name, program_code,
        program_description, work_flow_status, demand_manager, program_manager, program_details, program_dates, is_active, planned_hours, internal_state, estimated_cost) =>
        Programs(None, program_type, program_sub_type, program_name, program_code,
          program_description, work_flow_status, demand_manager,
          program_manager, program_details, program_dates, is_active, planned_hours, internal_state, estimated_cost))((program: Programs) => Some((program.program_type, program.program_sub_type, program.program_name, program.program_code,
        program.program_description, program.work_flow_status, program.demand_manager, program.program_manager,
        program.program_details, program.program_dates, program.is_active, program.planned_hours, program.internal_state, program.estimated_cost))))

  /**
   * Not in use...
   */
  val new_programForm: Form[Program_Master] = Form(
    mapping(
      "program_id" -> optional(number),
      "program_type" -> number,
      "program_sub_type" -> optional(number),
      "program_name" -> text.verifying(Messages.get(langObj, "error.program.program_name.MinMax"), program_name => program_name.trim().length() >= 4 && program_name.trim().length() <= 140),
      "program_code" -> number.verifying(Messages.get(langObj, "error.program.program_code.MinMax"), program_code => (program_code >= 0 && program_code < 99999999)).verifying(Messages.get(langObj, "error.program.program_code.unique"), program_code => ProgramService.findPrgoramCode(program_code)), //
      "program_description" -> optional(text.verifying(Messages.get(langObj, "error.program.program_description.MinMax"), program_description => program_description.trim().length() > 3 && program_description.trim().length() <= 500)),
      "work_flow_status" -> optional(number),
      "strategic_focus" -> optional(number),
      "devison" -> number,
      "management" -> optional(number),
      "department" -> optional(number),
      "business_line" -> optional(text.verifying(Messages.get(langObj, "error.program.program_details_business_line.MinMax"), business_line => business_line.trim().length() > 0 && business_line.trim().length() < 60)),
      "creation_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "initiation_planned_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "closure_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "release_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")))(Program_Master.apply)(Program_Master.unapply))

  val program_member_old: Form[Program_Members_Master] = Form(
    mapping(
      "program_id" -> number,
      "demand_manager" -> optional(number),
      "program_manager" -> optional(number),
      "process_engineer" -> optional(number),
      "quality_manager" -> optional(number), //
      "release_manager" -> optional(number),
      "envirement_manager" -> optional(number),
      "developer_leader" -> optional(number),
      "pmo" -> optional(number),
      "production_manager" -> optional(number),
      "sponsor" -> optional(number),
      "software_architect" -> optional(number),
      "user_leader" -> optional(number))(Program_Members_Master.apply)(Program_Members_Master.unapply))

  val program_members: Form[ProgramMembers] = Form(
    mapping(
      "id" -> optional(number),
      "program_id" -> number,
      "role_id" -> number,
      "member_id" -> number,
      "is_active" -> number,
      "pData" -> text)(ProgramMembers.apply)(ProgramMembers.unapply))

  val sap_form: Form[SAPMaster] = Form(
    mapping(
      "program_id" -> number,
      "sap_number" -> number,
      "budget_type" -> number,
      "cui1" -> text.verifying(Messages.get(langObj, "newsap.cui1.empty"), cui1 => cui1.toString().trim().length() > 0),
      "cui1_per" -> of[Double],
      "cui2" -> text,
      "cui2_per" -> of[Double],
      "investment" -> mapping(
        "investment_hardware" -> optional((of[Long]).verifying("Enter positive number.", investment_hardware => (investment_hardware >= 0))),
        "investment_software" -> optional((of[Long]).verifying("Enter positive number.", investment_software => (investment_software >= 0))),
        "investment_telecommunication" -> optional((of[Long]).verifying("Enter positive number.", investment_telecommunication => (investment_telecommunication >= 0))),
        "investment_development" -> optional((of[Long]).verifying("Enter positive number.", investment_development => (investment_development >= 0))),
        "investment_other" -> optional((of[Long]).verifying("Enter positive number.", investment_other => (investment_other >= 0))),
        "investment_qa" -> optional((of[Long]).verifying("Enter positive number.", investment_qa => (investment_qa >= 0))),
        "investment_improvements" -> optional((of[Long]).verifying("Enter positive number.", investment_improvements => (investment_improvements >= 0))),
        "investment_recurring_first" -> optional((of[Long]).verifying("Enter positive number.", investment_recurring_first => (investment_recurring_first >= 0))))(Investment.apply)(Investment.unapply),
      "expenditure" -> mapping(
        "expenditure_hardware" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))),
        "expenditure_software" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))),
        "expenditure_telecommunication" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))),
        "expenditure_development" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))),
        "expenditure_other" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))),
        "expenditure_qa" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))),
        "expenditure_improvements" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))),
        "expenditure_recurring_first" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))))(Expenditure.apply)(Expenditure.unapply),
      "is_active" -> number,
      "creation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "last_update" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "planned_hours" -> optional(of[Double]),
      "approved_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "comitted_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "close_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")))((program_id, sap_number, budget_type, cui1, cui1_per, cui2, cui2_per, investment, expenditure, is_active, creation_date, last_update, planned_hours, approved_date, comitted_date, close_date) =>
        SAPMaster(program_id, sap_number, budget_type, cui1, cui1_per, cui2, cui2_per, investment, expenditure, is_active, creation_date, last_update, planned_hours, approved_date, comitted_date, close_date))((sap: SAPMaster) => Some((sap.program_id, sap.sap_number, sap.budget_type, sap.cui1, sap.cui1_per,
        sap.cui2, sap.cui2_per, sap.investment, sap.expenditure, sap.is_active, sap.creation_date, sap.last_update, sap.planned_hours, sap.approved_date, sap.comitted_date, sap.close_date))))

  val project_sap_form: Form[ProjectSAP] = Form(
    mapping(
      "project_id" -> number,
      "sap_id" -> number,
      "project_investment" -> mapping(
        "investment_hardware" -> optional((of[Long]).verifying("Enter positive number.", investment_hardware => (investment_hardware >= 0))),
        "investment_software" -> optional((of[Long]).verifying("Enter positive number.", investment_software => (investment_software >= 0))),
        "investment_telecommunication" -> optional((of[Long]).verifying("Enter positive number.", investment_telecommunication => (investment_telecommunication >= 0))),
        "investment_development" -> optional((of[Long]).verifying("Enter positive number.", investment_development => (investment_development >= 0))),
        "investment_other" -> optional((of[Long]).verifying("Enter positive number.", investment_other => (investment_other >= 0))),
        "investment_qa" -> optional((of[Long]).verifying("Enter positive number.", investment_qa => (investment_qa >= 0))),
        "investment_improvements" -> optional((of[Long]).verifying("Enter positive number.", investment_improvements => (investment_improvements >= 0))),
        "investment_recurring_first" -> optional((of[Long]).verifying("Enter positive number.", investment_recurring_first => (investment_recurring_first >= 0))))(ProjectInvestment.apply)(ProjectInvestment.unapply),
      "project_expenditure" -> mapping(
        "expenditure_hardware" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))),
        "expenditure_software" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))),
        "expenditure_telecommunication" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))),
        "expenditure_development" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))),
        "expenditure_other" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))),
        "expenditure_qa" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))),
        "expenditure_improvements" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))),
        "expenditure_recurring_first" -> optional((of[Long]).verifying("Enter positive number.", expenditure_hardware => (expenditure_hardware >= 0))))(ProjectExpenditure.apply)(ProjectExpenditure.unapply),
      "is_active" -> number,
      "creation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "last_update" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "planned_hours" -> optional(of[Double]))((project_id, sap_id, investment, expenditure, is_active, creation_date, last_update, planned_hours) =>
        ProjectSAP(project_id, sap_id, investment, expenditure, is_active, creation_date, last_update, planned_hours))((sap: ProjectSAP) => Some((sap.project_id, sap.sap_id,
        sap.project_investment, sap.project_expenditure, sap.is_active, sap.creation_date, sap.last_update, sap.planned_hours))))

  /**
   * *
   * backend form to add/edit Impact Type
   */
  val impactTypeForm: play.api.data.Form[ImpactTypes] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "impact_type" -> nonEmptyText)(ImpactTypes.apply)(ImpactTypes.unapply))

  /**
   * *
   * backend form to add/edit Stage
   */
  val stageForm: play.api.data.Form[Stages] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "sequencing" -> optional(number).verifying(Messages.get(langObj, "sequencing.empty"), sequencing => (!sequencing.isEmpty)),
      "stage" -> text.verifying(Messages.get(langObj, "stage.empty"), stage => (stage.trim().length() > 0)),
      "description" -> text.verifying(Messages.get(langObj, "projecttype.description.empty"), description => (description.trim().length() > 0)),
      "updated_by" -> optional(number),
      "updation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "creation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "is_deleted" -> number)(Stages.apply)(Stages.unapply))

  /**
    * *
    * backend form to add/edit ConfigMailAlert
    *
    */
  val configMailForm: play.api.data.Form[ConfigMailAlert] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "uid" -> number,
      "em1" -> optional(email),
      "em2" -> optional(email),
      "em3" -> optional(email),
      "tpl" -> text,
      "fec" -> play.api.data.Forms.date("yyyy-MM-dd"),
      "is_active" -> number,
      "description" -> nonEmptyText)(ConfigMailAlert.apply)(ConfigMailAlert.unapply))


  /**
   * *
   * backend form to add/edit Stage
   */
  val deliverableForm: play.api.data.Form[Deliverables] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "deliverable" -> text.verifying(Messages.get(langObj, "deliverable.empty"), deliverable => (deliverable.trim().length() > 0)),
      "description" -> text.verifying(Messages.get(langObj, "projecttype.description.empty"), description => (description.trim().length() > 0)),
      "updated_by" -> optional(number),
      "updation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "creation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "is_deleted" -> number)(Deliverables.apply)(Deliverables.unapply))

  /**
   * *
   * frontend form to add Project Type
   */
  val projectctTypeForm: play.api.data.Form[GenericProjectType] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "generic_project_type" -> optional(text).verifying("Ingrese Tipo de Proyecto", generic_project_type => (generic_project_type.getOrElse("").trim().length() > 0)),
      "description" -> text.verifying(Messages.get(langObj, "projecttype.description.empty"), description => (description.trim().length() > 0)),
      "project_type" -> number,
      "responsible" -> number,
      "states" -> number,
      "creation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "updation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")))(GenericProjectType.apply)(GenericProjectType.unapply))

  val imgCropForm: play.api.data.Form[ProfileImage] = play.api.data.Form(
    mapping(
      "uId" -> optional(number),
      "x" -> optional(number),
      "y" -> optional(number),
      "w" -> optional(number),
      "h" -> optional(number),
      "profile_image" -> optional(text))(ProfileImage.apply)(ProfileImage.unapply))

  /**
   * *
   * front end form to edit Project Type
   */
  val projectctEditTypeForm: play.api.data.Form[GenericProjectType] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "generic_project_type" -> optional(text),
      "description" -> text.verifying(Messages.get(langObj, "projecttype.description.empty"), description => (description.length() > 0)),
      "project_type" -> number,
      "responsible" -> number,
      "states" -> number,
      "creation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "updation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")))(GenericProjectType.apply)(GenericProjectType.unapply))

  /**
   * *
   * backend form to add/edit SubType
   */
  val myTaskDesciplineForm: play.api.data.Form[TaskDesciplineChild] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "sequencing" -> optional(number).verifying(Messages.get(langObj, "sequencing.empty"), sequencing => (!sequencing.isEmpty)),
      "task_discipline" -> nonEmptyText,
      "description" -> nonEmptyText)(TaskDesciplineChild.apply)(TaskDesciplineChild.unapply))

  val resetPasswordForm: play.api.data.Form[PasswordMaster] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "old_password" -> text.verifying(Messages.get(langObj, "error.login.min"), old_password => old_password.trim().length() >= 4 && old_password.trim().length() <= 140),
      "new_password" -> text.verifying(Messages.get(langObj, "error.login.min"), new_password => new_password.trim().length() >= 4 && new_password.trim().length() <= 140),
      "confirm_password" -> nonEmptyText)(PasswordMaster.apply)(PasswordMaster.unapply))

  val forgotPasswordUserNameForm: play.api.data.Form[ForgotPasswordUserNameMaster] = play.api.data.Form(
    mapping(
      "user_name" -> text.verifying(Messages.get(langObj, "error.user.email.empty"), user_name => (user_name.length() > 0)))(ForgotPasswordUserNameMaster.apply)(ForgotPasswordUserNameMaster.unapply))

  val forgotPasswordForm: play.api.data.Form[ForgotPasswordMaster] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "email" -> nonEmptyText,
      "user_name" -> nonEmptyText,
      "verification_code" -> nonEmptyText,
      "creation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "verify_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "isverify" -> optional(number))(ForgotPasswordMaster.apply)(ForgotPasswordMaster.unapply))

  val recoverPasswordForm: play.api.data.Form[PasswordRecoverMaster] = play.api.data.Form(
    mapping(
      "new_password" -> text.verifying(Messages.get(langObj, "forgotpassword.newpassword.empty"), new_password => (new_password.length() > 0)),
      "confirm_password" -> text.verifying(Messages.get(langObj, "forgotpassword.confirmpassword.empty"), confirm_password => (confirm_password.length() > 0)))(PasswordRecoverMaster.apply)(PasswordRecoverMaster.unapply))

  val mySubTypeForm: play.api.data.Form[SubTypeCase] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "sub_type" -> nonEmptyText,
      "description" -> nonEmptyText)(SubTypeCase.apply)(SubTypeCase.unapply))

  val programTypeForm: play.api.data.Form[ProgramTypeCase] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "program_type" -> nonEmptyText,
      "description" -> nonEmptyText)(ProgramTypeCase.apply)(ProgramTypeCase.unapply))

  /**
   * *
   * backend form to add/edit Project Work Flow
   */
  val projectWorkflowForm: play.api.data.Form[ProjectWorkflow] = play.api.data.Form(
    mapping("id" -> optional(number),
      "project_workflow_status" -> nonEmptyText,
      "description" -> nonEmptyText)(ProjectWorkflow.apply)(ProjectWorkflow.unapply))

  /**
   * *
   * backend form to add/edit Program Work Flow
   */
  val workflowForm: Form[Workflows] = Form(
    mapping(
      "id" -> optional(number),
      "workflow_status" -> nonEmptyText)(Workflows.apply)(Workflows.unapply))

  /**
   * *
   * Login form
   */
  val loginForm: Form[LoginMaster] = Form(
    mapping(
      "uname" -> text.verifying(Messages.get(langObj, "error.login.username.required"), uname => uname.trim().length() >= 4 && uname.trim().length() <= 140),
      "password" -> text.verifying(Messages.get(langObj, "error.login.password.required"), pass => pass.trim().length() >= 4 && pass.trim().length() <= 140))(LoginMaster.apply)(LoginMaster.unapply))

  /**
   * *
   * Login form dId: Option[Int], genrencia:String, user_id:Long, report_type:Int,report_to:Int, organization_depth:Int)
   */

  val gerenciaForm: Form[models.Genrencias] = Form(
    mapping(
      "id" -> optional(number),
      "genrencia" -> nonEmptyText,
      "user_id" -> of[Long],
      "report_type" -> number,
      "report_to" -> number,
      "organization_depth" -> number,
      "updated_by" -> optional(number),
      "updation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "is_deleted" -> number)(Genrencias.apply)(Genrencias.unapply))

  val divisionForm: Form[Divisions] = Form(
    mapping(
      "id" -> optional(number),
      "division" -> nonEmptyText,
      "user_id" -> of[Long],
      "updated_by" -> optional(number),
      "updation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "is_deleted" -> number)(Divisions.apply)(Divisions.unapply))

  val categoryForm: Form[Categories] = Form(
    mapping(
      "id" -> optional(number),
      "description" -> nonEmptyText,
      "is_active" -> number)(Categories.apply)(Categories.unapply))


  val departmentForm: Form[Departments] = Form(
    mapping(
      "id" -> optional(number),
      "department" -> nonEmptyText,
      "user_id" -> of[Long],
      "report_type" -> number,
      "report_to" -> number,
      "organization_depth" -> number,
      "updated_by" -> optional(number),
      "updation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "is_deleted" -> number)(Departments.apply)(Departments.unapply))

  val skillUpdate: Form[SkillsMaster] = Form(
    mapping(
      "uId" -> number,
      "skill_id" -> number,
      "rating" -> number)(SkillsMaster.apply)(SkillsMaster.unapply))
  //SubTaskMaster(task_id: Option[Int], milestone_id: Long, title: String, description: String, plan_start_date: Date, plan_end_date: Date, actual_start_date: Date, actual_end_date: Date, added_date: Date, status: Int)

  val subTaskForm: Form[SubTaskMaster] = Form(
    mapping(
      "sub_task_id" -> optional(number),
      "task_id" -> of[Long],
      "task_title" -> text.verifying(Messages.get(langObj, "error.login.addsubtask.title"), task_title => (task_title.trim().length() > 0 && task_title.trim().length() <= 100)),
      "task_description" -> text.verifying(Messages.get(langObj, "error.login.addsubtask.title"), task_description => (task_description.trim().length() > 0 && task_description.trim().length() <= 160)),
      "planned_start_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "planned_end_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "actual_start_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "actual_end_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "actual_end_date_final" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "added_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "status" -> number,
      "completion_percentage" -> optional(of[Double].verifying(Messages.get(langObj, "error.program.completion_per"), completion_percentage => (completion_percentage >= 0 && completion_percentage <= 100))),
      "task_complete" -> number,
      "sub_task_depend" -> optional(text),
      "dependencies_type" -> optional(number),
      "catalogue_id" -> optional(number))(SubTaskMaster.apply)(SubTaskMaster.unapply))

  val timesheetForm: Form[TimesheetMaster] = Form(
    mapping(
      "Id" -> optional(number),
      "task_type" -> number,
      "sub_task_id" -> number,
      "task_id" -> number,
      "user_id" -> number,
      "pId" -> number,
      "task_for_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "notes" -> text,
      "hours" -> of[BigDecimal])(TimesheetMaster.apply)(TimesheetMaster.unapply))

  val documentForm: Form[Documents] = Form(
    mapping(
      "Id" -> optional(number),
      "parent_type" -> nonEmptyText,
      "parent_id" -> number,
      "title" -> text.verifying(Messages.get(langObj, "error.login.addsubtask.title"), title => (title.trim().length() > 0 && title.trim().length() <= 100)),
      "document_type" -> number,
      "version_alias" -> text.verifying(Messages.get(langObj, "error.login.addsubtask.title"), version_alias => (version_alias.trim().length() > 0 && version_alias.trim().length() <= 100)),
      "version_notes" -> text.verifying(Messages.get(langObj, "error.login.addsubtask.title"), version_notes => (version_notes.trim().length() > 0 && version_notes.trim().length() <= 160)),
      "parent_version_id" -> optional(number),
      "is_active" -> optional(number))(Documents.apply)(Documents.unapply))

  val searchDocument: Form[SearchMaster] = Form(
    mapping(
      "search_filter" -> optional(text),
      "division" -> optional(number),
      "program" -> optional(number),
      "project" -> optional(number),
      "task" -> optional(number),
      "sub_task" -> optional(number),
      "user" -> optional(number),
      "document_type" -> optional(number),
      "search_scope" -> optional(number))(SearchMaster.apply)(SearchMaster.unapply))

  val employeeSearchResultForm: Form[EmployeeSearchMaster] = Form(
    mapping(
      "search_filter" -> optional(text),
      "division" -> optional(text),
      "gerencia" -> optional(text),
      "department" -> optional(text),
      "parent_type" -> optional(text),
      "parent_id" -> optional(text),
      "start" -> optional(number),
      "end" -> optional(number))(EmployeeSearchMaster.apply)(EmployeeSearchMaster.unapply))

  val searchCriteria: Form[SearchCriteria] = Form(
    mapping(
      "searchText" -> optional(text),
      "parentId" -> optional(text),
      "parentType" -> optional(text),
      "documentType" -> optional(text),
      "searchScope" -> optional(text),
      "userId" -> optional(text),
      "searchTitle" -> optional(text))(SearchCriteria.apply)(SearchCriteria.unapply))

  val genericTaskForm: Form[GenericTask] = Form(
    mapping(
      "mId" -> optional(number),
      "task_mode" -> number,
      "title" -> text.verifying(Messages.get(langObj, "error.task.milestone_title"), title => title.length() >= 4 && title.length() <= 60),
      "plan_start_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "plan_end_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "description" -> text.verifying(Messages.get(langObj, "error.task.description"), description => description.length() >= 0 && description.length() <= 160),
      "plan_time" -> of[BigDecimal].verifying(Messages.get(langObj, "error.task.plan_time"), (plan_time => plan_time >= 0 && plan_time <= 99999)),
      //"plan_time" -> of[Double].verifying(Messages.get(langObj, "error.task.plan_time"), (plan_time => plan_time >= 0 && plan_time <= 99999)),
      "task_status" -> number.verifying(Messages.get(langObj, "error.task.milestone_status"), (milestone_status => milestone_status >= 0)),
      "status" -> number,
      "task_owner" -> number.verifying(Messages.get(langObj, "error.task.owner"), (task_owner => task_owner >= 0)),
      "task_discipline" -> optional(number),
      "completion_percentage" -> optional(of[Double].verifying(Messages.get(langObj, "error.program.completion_per"), program_code => (program_code >= 0 && program_code <= 100))),
      "remark" -> optional(text),
      "task_depend" -> optional(text),
      "task_details" -> mapping(
        "task_type" -> number,
        "task_code" -> text,
        "stage" -> optional(number),
        "user_role" -> optional(number),
        "deliverable" -> number,
        "predefined_task_id" -> number,
        "is_active" -> number)(GenericTaskDetails.apply)(GenericTaskDetails.unapply))((tId, task_mode, title, plan_start_date, plan_end_date,
        description, plan_time, task_status, status, task_owner, task_discipline,
        completion_percentage, remark, task_depend, task_details) =>
        GenericTask(tId, task_mode, title, plan_start_date, plan_end_date,
          description, plan_time, task_status, status, task_owner, task_discipline,
          completion_percentage, remark, task_depend, task_details))((task: GenericTask) => Some((task.tId, task.task_mode, task.task_title, task.plan_start_date, task.plan_end_date,
        task.task_description, task.plan_time, task.task_status, task.status, task.owner, task.task_discipline,
        task.completion_percentage, task.remark, task.task_depend, task.task_details))))

  val predefinedTaskForm: Form[PredefinedTasks] = Form(
    mapping(
      "tId" -> optional(number),
      "task_type" -> number,
      "title" -> text.verifying(Messages.get(langObj, "error.task.milestone_title"), title => title.length() >= 4 && title.length() <= 60),
      "description" -> text.verifying(Messages.get(langObj, "error.task.description"), description => description.length() >= 0 && description.length() <= 160),
      "task_discipline" -> optional(number),
      "remark" -> optional(text),
      "stage" -> optional(number),
      "user_role" -> optional(number),
      "deliverable" -> number,
      "catalogue_service" -> number,
      "is_active" -> number)(PredefinedTasks.apply)(PredefinedTasks.unapply))

  /**
   * *
   * backend form to add/edit User Role
   */
  val userRoleForm: play.api.data.Form[UserRoleChild] = play.api.data.Form(
    mapping(
      "rId" -> optional(number),
      "role" -> nonEmptyText,
      "description" -> nonEmptyText)(UserRoleChild.apply)(UserRoleChild.unapply))

  /**
   * *
   * backend form to add/edit ProjectType
   */
  val genericprojectTypeForm: play.api.data.Form[GenericProjectTypes] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "generic_project_type" -> text.verifying(Messages.get(langObj, "genericprojecttype.empty"), generic_project_type => (generic_project_type.trim().length() > 0)),
      "description" -> text.verifying(Messages.get(langObj, "projecttype.description.empty"), description => (description.trim().length() > 0)),
      "updated_by" -> optional(number),
      "updation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "creation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "is_deleted" -> number)(GenericProjectTypes.apply)(GenericProjectTypes.unapply))

  /**
   * *
   * backend form to add/edit DocumentType
   */
  val DocumentTypeForm: play.api.data.Form[DocumentTypes] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "document_type" -> text.verifying(Messages.get(langObj, "documenttype.empty"), document_type => (document_type.trim().length() > 0)),
      "description" -> text.verifying(Messages.get(langObj, "projecttype.description.empty"), description => (description.trim().length() > 0)),
      "updated_by" -> optional(number),
      "updation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "creation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "is_deleted" -> number)(DocumentTypes.apply)(DocumentTypes.unapply))

  /**
   * *
   * backend form to add/edit BudgetTypes
   */
  val budgetTypeForm: play.api.data.Form[BudgetTypes] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "sequencing" -> optional(number).verifying(Messages.get(langObj, "sequencing.empty"), sequencing => (!sequencing.isEmpty)),
      "budget_type" -> text.verifying(Messages.get(langObj, "budgettype.empty"), budget_type => (budget_type.trim().length() > 0)),
      "description" -> text.verifying(Messages.get(langObj, "projecttype.description.empty"), description => (description.trim().length() > 0)),
      "updated_by" -> optional(number),
      "updation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "creation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "is_deleted" -> number)(BudgetTypes.apply)(BudgetTypes.unapply))

  val programStatusForm: play.api.data.Form[ProgramStatus] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "program_id" -> number,
      "status_for_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "reason_for_change" -> text.verifying(Messages.get(langObj, "programStatus.description.empty"), description => (description.trim().length() > 0)),
      "status" -> number)(ProgramStatus.apply)(ProgramStatus.unapply))

  val projectStatusForm: play.api.data.Form[ProjectStatus] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "project_id" -> number,
      "status_for_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "reason_for_change" -> text.verifying(Messages.get(langObj, "programStatus.description.empty"), description => (description.trim().length() > 0)),
      "status" -> number)(ProjectStatus.apply)(ProjectStatus.unapply))

  val taskStatusForm: play.api.data.Form[TaskStatus] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "task_id" -> number,
      "status_for_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "reason_for_change" -> text.verifying(Messages.get(langObj, "programStatus.description.empty"), description => (description.trim().length() > 0)),
      "status" -> number)(TaskStatus.apply)(TaskStatus.unapply))

  val subTaskStatusForm: play.api.data.Form[SubTaskStatus] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "sub_task_id" -> number,
      "status_for_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
      "reason_for_change" -> text.verifying(Messages.get(langObj, "programStatus.description.empty"), description => (description.trim().length() > 0)),
      "status" -> number)(SubTaskStatus.apply)(SubTaskStatus.unapply))

  val searchDashboard: Form[DashboardSearch] = Form(
    mapping(
      "delay_level" -> optional(text),
      "project_classification" -> optional(text),
      "program_type" -> optional(text),
      "program_sub_type" -> optional(text),
      "division" -> optional(text),
      "program_role" -> optional(text),
      "item_budget" -> optional(text),
      "sort_type" -> optional(text),
      "gerencia" -> optional(text),
      "department" -> optional(text))(DashboardSearch.apply)(DashboardSearch.unapply))

  val searchProgram: Form[ProgramSearch] = Form(
    mapping(
      //"delay_level" -> optional(text),
      //"project_classification" -> optional(text),
      "work_flow_status" -> optional(text),
      "program_name" -> optional(text),
      "program_code" -> optional(text), //agregado
      "sap_code" -> optional(text), //agregado      
      "program_type" -> optional(text),
      "program_sub_type" -> optional(text),
      "division" -> optional(text),
      "program_role" -> optional(text),
      "item_budget" -> optional(text),
      "sort_field" -> optional(text),
      "impact_type" -> optional(text))(ProgramSearch.apply)(ProgramSearch.unapply))

  /**
   * *
   * backend form to add/edit
   */
  val serviceCatalogueForm: play.api.data.Form[ServiceCatalogues] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "discipline" -> number,
      "service_code" -> text.verifying(Messages.get(langObj, "servcieCatalogue.serviceCodeValidationEmpty"), service_code => (service_code.trim().length() > 0)),
      "service_name" -> text.verifying(Messages.get(langObj, "servcieCatalogue.serviceNameValidationEmpty"), service_name => (service_name.trim().length() > 0)),
      "description" -> optional(text),
      "service_scope" -> text.verifying(Messages.get(langObj, "servcieCatalogue.serviceScopeValidationEmpty"), service_scope => (service_scope.trim().length() > 0)),
      "service_requestor_role" -> optional(number),
      "executive_role_primary" -> optional(number),
      "executive_role_secondary" -> optional(number),
      "sla_value" -> number,
      "sla_unit" -> number)(ServiceCatalogues.apply)(ServiceCatalogues.unapply))

  val program_hours_form: Form[ProgramHours] = Form(
    mapping(
      "program_id" -> optional(number),
      "planned_hours" -> optional(of[Long]),
      "estimated_cost" -> optional(of[Long]))(ProgramHours.apply)(ProgramHours.unapply))

  /**
   * *
   * backend form to add/edit
   */

  val riskManagementForm: Form[RiskManagement] = Form(
    mapping(
      "parent_id" -> optional(number),
      "parent_type" -> optional(number),
      "name" -> text.verifying(Messages.get(langObj, "risk.name"), name => (name.trim().length() > 0)),
      "cause" -> text.verifying(Messages.get(langObj, "risk.cause"), cause => (cause.trim().length() > 0)),
      "event" -> text.verifying(Messages.get(langObj, "risk.event"), event => (event.trim().length() > 0)),
      "imapct" -> text.verifying(Messages.get(langObj, "risk.imapct"), imapct => (imapct.trim().length() > 0)),
      "risk_category" -> number,
      "variable_imapact" -> text,
      "probablity_of_occurence" -> number,
      "quantification" -> number,
      "strategic_reply" -> number,
      "responsible" -> number,
      "reply_action" -> optional(text),
      "configuration_plan" -> optional(text),
      "document_category" -> optional(text),
      "sub_category" -> number,
      "risk_state" -> number,
      "risk_clouser_date" -> play.api.data.Forms.date("dd-MM-yyyy") /*,
      "is_active" -> optional(number)*/ )(RiskManagement.apply)(RiskManagement.unapply))
  /*      
  val riskManagementExForm: Form[RiskManagement] = Form(
    mapping(
              "parent_id" -> optional(number),
              "parent_type" -> optional(number),
              "name" -> text.verifying(Messages.get(langObj, "risk.name"), name => (name.trim().length() > 0)),
              "cause" -> text.verifying(Messages.get(langObj, "risk.cause"), cause => (cause.trim().length() > 0)),
              "event" -> text.verifying(Messages.get(langObj, "risk.event"), event => (event.trim().length() > 0)),
              "imapct" -> text.verifying(Messages.get(langObj, "risk.imapct"), imapct => (imapct.trim().length() > 0)),
              "risk_category" -> number,
              "variable_imapact" -> text,
              "probablity_of_occurence" -> number,
              "quantification" -> number,
              "strategic_reply" -> number,
              "responsible" -> number,
              "reply_action" -> optional(text),
              "configuration_plan" -> optional(text),
              "document_category" -> optional(text),
              "sub_category" -> number,
              "risk_clouser_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
              "is_active" -> optional(number),
              "tail_risk" -> mapping(
                 "risk_state" -> number)(RiskManagementEx.apply)(RiskManagementEx.unapply))((parent_id,
                        parent_type,
                        name,
                        cause,
                        event,
                        imapct,
                        risk_category,
                        variable_imapact,
                        probablity_of_occurence,
                        quantification,
                        strategic_reply,
                        responsible,
                        reply_action,
                        configuration_plan,
                        document_category,
                        sub_category,
                        risk_clouser_date,
                        is_active,
                        tail_risk) => RiskManagement(
                          parent_id,
                        parent_type,
                        name,
                        cause,
                        event,
                        imapct,
                        risk_category,
                        variable_imapact,
                        probablity_of_occurence,
                        quantification,
                        strategic_reply,
                        responsible,
                        reply_action,
                        configuration_plan,
                        document_category,
                        sub_category,
                        risk_clouser_date,
                        is_active, 
                        tail_risk))((risk:RiskManagement) => Some((risk.parent_id,risk.parent_type,risk.name,risk.cause,
                            risk.event,risk.imapct,risk.risk_category,risk.variable_imapact,
                            risk.probablity_of_occurence,risk.quantification,risk.strategic_reply,
                            risk.responsible,risk.reply_action,risk.configuration_plan,
                            risk.document_category,risk.sub_category,risk.risk_clouser_date,risk.is_active,risk.tail_risk))))         
*/

  val addIssueForm: Form[models.RiskManagementIssueMain] = Form(
    mapping(
      "id" -> optional(number),
      "parent_id" -> optional(number), //.verifying(Messages.get("error.task.projectId"), project => project.length() > 4),
      "parent_type" -> optional(number),
      "title" -> text.verifying(Messages.get(langObj, "addIsse.placeholder.title"), title => (title.trim().length() > 0)),
      "description" -> text.verifying(Messages.get(langObj, "addIssue.placeholder.issueDescription"), description => (description.trim().length() > 0)),
      "category" -> number,
      "sub_category" -> number,
      "members_involved" -> optional(text),
      "action_plan" -> optional(text),
      "priority" -> number,
      "user_id" -> optional(number),
      "issue_status" -> optional(number),
      "is_active" -> optional(number),
      "riskManagementIssueDate" -> mapping(
        "issue_date" -> play.api.data.Forms.date("dd-MM-yyyy"),
        "closure_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
        "planned_end_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
        "actual_end_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
        "creation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
        "updation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")))(models.RiskManagementIssueDate.apply)(models.RiskManagementIssueDate.unapply))((id, parent_id, parent_type, title, description, category, sub_category, members_involved,
        action_plan, priority, user_id, issue_status, is_active, riskManagementIssueDate) =>
        models.RiskManagementIssueMain(id, parent_id, parent_type, title, description, category, sub_category, members_involved,
          action_plan, priority, user_id, issue_status, is_active, riskManagementIssueDate))((task: models.RiskManagementIssueMain) => Some((task.id, task.parent_id, task.parent_type, task.title, task.description, task.category,
        task.sub_category, task.members_involved, task.action_plan, task.priority, task.user_id, task.issue_status, task.is_active, task.riskManagementIssueDate))))

  /**
   * *
   * backend form to add/edit UserProfile
   */

  val userProfileForm: play.api.data.Form[UserProfiles] = play.api.data.Form(
    mapping(
      "id" -> optional(number),
      "profile_code" -> text.verifying(Messages.get(langObj, "userprofile.errormsg.profile_code"), profile_code => (profile_code.trim().length() > 0)),
      "profile_name" -> text.verifying(Messages.get(langObj, "userprofile.errormsg.profile_name"), profile_name => (profile_name.trim().length() > 0)),
      "description" -> text.verifying(Messages.get(langObj, "userprofile.errormsg.description"), description => (description.trim().length() > 0)),
      "updated_by" -> optional(number),
      "updation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "creation_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "is_deleted" -> number)(UserProfiles.apply)(UserProfiles.unapply))

  /**
   * Risk Manual Alerts...
   * Author - Balkrishna
   * Date - 25-02-2015
   */

  val pertForm: Form[InputPert] = Form(
    mapping(
      "programa" -> number,
      "lider" -> number,
      "plantilla" -> number,
      "cajero" -> number,
      "direccion" -> text,
      "fecha" -> play.api.data.Forms.date("dd-MM-yyyy"))(InputPert.apply)(InputPert.unapply))

  /**
   * Risk Manual Alerts...
   * Author - Balkrishna
   * Date - 09-11-2017
   */

  val alertsForm: Form[RiskAlerts] = Form(
    mapping(
      "id" -> optional(number),
      "risk_id" -> number,
      "event_code" -> optional(number),
      "event_date" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "event_title" -> text.verifying("Por favor, introduzca el título de alerta", event_title => (event_title.trim().length() > 0)),
      "event_details" -> optional(text),
      "responsible" -> optional(number),
      "person_invloved" -> optional(text),
      "criticality" -> optional(number),
      "is_active" -> optional(number),
      "category_id" -> optional(number),
      "impacted_variable" -> optional(text),
      "reiteration" -> optional(number),
      "status_id" -> optional(number),
      "task_id" -> optional(number),
      "change_state" -> optional(play.api.data.Forms.date("dd-MM-yyyy")),
      "responsible_answer" -> optional(text))(RiskAlerts.apply)(RiskAlerts.unapply))



  val alertsSearchForm: Form[AlertsSearch] = Form(
    mapping(
      "event_code" -> optional(number),
      "criticality" -> optional(number),
      "category_id" -> optional(number),
      "status_id" -> optional(number))(AlertsSearch.apply)(AlertsSearch.unapply))

  val genericProjectSearchForm: Form[ProjectTypeSearch] = Form(
    mapping(
      "type_id" -> optional(number),
      "responsible_id" -> optional(number))(ProjectTypeSearch.apply)(ProjectTypeSearch.unapply))
}




