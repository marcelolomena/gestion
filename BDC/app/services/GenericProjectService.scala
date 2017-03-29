package services;

import java.util.Date

import scala.Option.option2Iterable

import org.apache.commons.lang3.StringUtils

import anorm.SQL
import anorm.SqlParser.scalar
import anorm.sqlToSimple
//import anorm.toParameterValue
import models.CustomColumns
import models.GenericProjectType
import models.GenericProjectTypes
import models.GernericProject
import models.PredefinedTasks
import models.ProjectType
import play.api.Play.current
import play.api.db.DB
import play.i18n.Lang
import play.i18n.Messages
object GenericProjectService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))

  /**
   * method to get the project-type details by id
   */
  def findProjectTypeDetails(id: String): Option[ProjectType] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_project_type_master where id = {id} ").on(
          'id -> id).as(
            ProjectType.projectDisplay.singleOpt)
      result
    }
  }

  def findProjectTypeDetailsByType(id: Integer): Option[ProjectType] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_project_type_master where project_type = {id} and states=0 ").on(
          'id -> id).as(
            ProjectType.projectDisplay.singleOpt)
      result
    }
  }
  
  def findProjectTypeDetailsByDescription(state: Integer): Option[ProjectType] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_project_type_master where states={state} and description like 'Risk Management'").on(
          'state -> state.toInt).as(
            ProjectType.projectDisplay.singleOpt)
      result
    }
  }  

  def findActiveProjectTypeDetailsByType(): Seq[ProjectType] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "SELECT * FROM art_project_type_master WHERE states=0 ORDER BY description").as(
          ProjectType.projectDisplay*)
      result
    }
  }
  def findGenericProject(pId: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_generic_project_master where pId = {pId} ").on(
          'pId -> pId).as(GernericProject.genericProject.singleOpt)
      result.get
    }
  }

  def findAllProjectTypes(): Seq[ProjectType] = {
    val sqlSting = "select * from art_project_type_master where states=0"
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(ProjectType.projectDisplay *)
    }
  }

  def findAllHistoricProjectTypes(): Seq[ProjectType] = {
    val sqlSting = "select * from art_project_type_master where states=1"
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(ProjectType.projectDisplay *)
    }
  }

  def findAllGenericProjects(): Seq[GernericProject] = {
    val sqlSting = "select * from art_generic_project_master where project_mode != 0 "
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(GernericProject.genericProject *)
    }
  }

  def deleteProjectType(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "Update art_project_type_master set states=2 where id='" + id + "'").on(
          'id -> id).executeUpdate()
    }
  }

  def insertProjectType(project: GenericProjectType): Long = {
    DB.withConnection { implicit connection =>
      val lastSave = SQL(
        """ insert into art_project_type_master (project_type,description,creation_date, responsible, states) 
            values({project_type},{description},{creation_date},{responsible},{states})
          """).on(

          'description -> project.description,
          'project_type -> project.project_type,
          'creation_date -> new Date(),
          'responsible -> project.responsible,
          'states -> project.states).executeInsert(scalar[Long].singleOpt)

      lastSave.last
    }
  }
  def findProject_type(project_type: Int): Boolean = {
    var isNotPresent = true
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_project_type_master where project_type='" + project_type + "' and states='0'").on(
          'project_type -> project_type).as(ProjectType.projectDisplay *)
      if (result.size > 0) {
        isNotPresent = false
      }
    }
    isNotPresent
  }

  def findProjectTypeInGenericProject(project_mode: Int): Boolean = {
    var isNotPresent = true
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_generic_project_master where project_mode='" + project_mode + "'").on(
          'project_mode -> project_mode).as(GernericProject.genericProject *)
      if (result.size > 0) {
        isNotPresent = false
      }
    }
    isNotPresent
  }

  def updateProjectType(project: GenericProjectType): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
				update art_project_type_master
					set
					description = {description},
					responsible={responsible},
					updation_date = {updation_date},
					states = {states}
					where id = {id}
          """).on(
          'id -> project.id,
          'description -> project.description,
          'responsible -> project.responsible,
          'updation_date -> new Date(),
          'states -> project.states).executeUpdate()
    }
  }

  def insertGenericProject(project: GernericProject): Long = {
    DB.withConnection { implicit connection =>
      val lastSave = SQL(
        """
          insert into art_generic_project_master (project_mode,project_id,  project_name, description, project_manager, start_date, final_release_date, budget_approved, sap_code,
          total_sap, budget_approved_staff, budget_approved_contractor, budget_approved_hardware, budget_approved_software,
          ppm_number, work_flow_status,baseline) values (
          {project_mode},{project_id},  {project_name}, {description}, {project_manager}, {start_date}, {final_release_date},{budget_approved}, {sap_code},
          {total_sap}, {budget_approved_staff}, {budget_approved_contractor}, {budget_approved_hardware}, {budget_approved_software}, {ppm_number},
          {work_flow_status},{baseline})
          """).on(
          'project_mode -> project.project_mode,
          'project_id -> project.project_id,
          'project_name -> project.project_name,
          'description -> project.description,
          'project_manager -> project.project_manager,
          'start_date -> project.start_date,
          'final_release_date -> project.final_release_date,
          'budget_approved -> project.budget_approved,
          'sap_code -> project.sap_code,
          'total_sap -> project.total_sap.bigDecimal,
          'budget_approved_staff -> project.budget_approved_staff.bigDecimal,
          'budget_approved_contractor -> project.budget_approved_contractor.bigDecimal,
          'budget_approved_hardware -> project.budget_approved_hardware.bigDecimal,
          'budget_approved_software -> project.budget_approved_software.bigDecimal,
          'ppm_number -> project.ppm_number,
          'work_flow_status -> project.work_flow_status,
          'baseline -> project.baseline).executeInsert(scalar[Long].singleOpt)

      lastSave.last
    }
  }

  def findProjectTypeForUpdate(project_type: Int, id: Int): Boolean = {
    var isNotPresent = true
    DB.withConnection { implicit connection =>
      val sql = "select * from art_project_type_master where project_type='" + project_type + "' and states='0' and id <> '" + id + "'"
      //println("sql" + sql)
      val result = SQL(sql)
        .on('project_type -> project_type).as(ProjectType.projectDisplay *)
      if (result.size > 0) {
        isNotPresent = false
      }
    }
    isNotPresent
  }
  def validateForm(form: play.api.data.Form[GenericProjectType]) = {
    var newform: play.api.data.Form[models.GenericProjectType] = null
    val id = Integer.parseInt(form.data.get("id").get)
    val state = form.data.get("states").get
    val pType = Integer.parseInt(form.data.get("project_type").get)
    val states = Integer.parseInt(form.data.get("states").get)
    val resultValue = findProjectTypeDetails(form.data.get("id").get)
    if (!resultValue.isEmpty) {
      val isAvalaible = findProjectTypeForUpdate(pType, id)
      if (!isAvalaible && states != resultValue.get.states && states == 0) {
        newform = form.withError("states", Messages.get(langObj, "maintenance.currentProjecttypeexists"))
        newform.fill(form.get)
        newform
      }
    }

    if (newform != null) {
      newform
    } else {
      form
    }
  }

  def getGenericProjectType(generic_project_type: String) = {
    var isPresent = false
    val sql = "select count(*) from art_program_generic_project_type where generic_project_type = '" + generic_project_type.trim() + "' AND is_deleted=0"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Long].singleOpt)
      if (result.get > 0) {
        isPresent = true
      }
    }
    isPresent
  }

  def newProjectTypevalidateForm(form: play.api.data.Form[GenericProjectType]) = {
    var newform: play.api.data.Form[models.GenericProjectType] = null
    val state = form.data.get("states").get
    var isAvalaible = true
    var mode = ""
    val states = Integer.parseInt(form.data.get("states").get)
    var resultValue: Option[ProjectType] = null
    /*  if (form.data.get("id").isDefined) {
      mode = "edit"
      val id = form.data.get("id").get
      resultValue = findProjectTypeDetails(id)
    }*/

    if (!form.data.get("generic_project_type").isEmpty) {
      val generic_project_type = form.data.get("generic_project_type").get
      val bool = getGenericProjectType(generic_project_type)
      if (bool) {
        newform = form.withError("generic_project_type", "Proyecto genérico de tipo nombre ya existe.")
      }
    }

    /* if (!form.data.get("description").isEmpty) {
      // val ptype = form.data.get("id").get
      newform = form.withError("description", "Ingrese Tipo de Proyecto")
    }*/

    /* else {
      if (form.data.get("id").isEmpty && StringUtils.equals(mode, "edit")) {
        newform = form.withError("generic_project_type", "Ingrese Tipo de Proyecto")
      } else {
        if (StringUtils.equals(mode, "edit")) {

        } else {
          val project_type = form.data.get("generic_project_type").get
          if (states == 0) {
            val isValid = findGenericProjectType(project_type)
            if (!isValid) {
              newform = form.withError("generic_project_type", "Ingrese Tipo de Proyecto")
            }
          } else {

          }

        }

      }

    }*/

    //val pType = form.data.get("project_type").get

    //findProject_type(Integer.parseInt(pType))
    //    if (resultValue != null) {
    //      if (!isAvalaible  && states != resultValue.get.states && states == 0) {
    //        newform = form.withError("project_type", Messages.get(langObj, "maintenance.currentProjecttypeexists"))
    //        //newform.fill(form.get)
    //        //newform
    //      }
    //    } else {
    //      if (!isAvalaible && states == 0) {
    //        newform = form.withError("project_type", Messages.get(langObj, "maintenance.currentProjecttypeexists"))
    //        //newform.fill(form.get)
    //        //newform
    //      }
    //
    //    }

    if (newform != null) {
      newform
    } else {
      form
    }
  }

  def findGenericProjectType(generic_project_type: String): Boolean = {
    var isNotPresent = true
    val sqlString = "select * from art_program_generic_project_type where generic_project_type like '" + generic_project_type.trim + "' AND is_deleted=0"
    //println(sqlString)
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(GenericProjectTypes.pTypes *)
      //println(result.size)
      if (result.size > 0) {
        isNotPresent = false
      }
    }
    isNotPresent
  }

  def findHistoricGenericProjectType(generic_project_type: String): Boolean = {
    var isNotPresent = true
    val sqlString = "select * from art_program_generic_project_type where generic_project_type like '" + generic_project_type.trim + "'"
    //println(sqlString)
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(GenericProjectTypes.pTypes *)
      println(result.size)
      if (result.size > 0) {
        isNotPresent = false
      }
    }
    isNotPresent
  }

  /**
   *   Predefined tasks
   */
  def findAllPredefinedTasks(): Seq[PredefinedTasks] = {
    val sqlSting = "select * from art_predefined_task where is_active=1"
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(PredefinedTasks.predefined_tasks *)
    }
  }

  object projectTypeValue extends Enumeration {
    type projectTypeValue = Value
    val Initiative, Requirements, Analysis_and_Design, Planning_and_Monitoring, Iteration_Certification, Iteration_Stabilization, Iteration_Development, Normal_Project = Value
  }

  def findActiveGenericProjectType(): Seq[GernericProject] = {
    var sqlString = "SELECT * from art_program_generic_project_type "
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(GernericProject.genericProject *)
    }
  }
}