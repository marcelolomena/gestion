package services

import play.api.Play.current
import play.api.db.DB
import models.Incident
import models.Configuration
import models.ComboConfiguration
import models.ProgramCombo
import models.Severity
import models.ComboStatus
import models.ComboDepartament
import models.ErrorIncident
import models.Status
import models.SubTasks
import models.Hours
import models.IncidentSubTask
import models.NameUsr
import anorm._
import anorm.SqlParser._
import play.api.libs.json.JsObject

/**
 * @author marcelo
 */
object IncidentService {

  def list(pageSize: String, pageNumber: String, Json: String): Seq[Incident] = {
    var sqlString = "EXEC art.list_incident {PageSize},{PageNumber},{Json}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (Incident.incident *)
    }
  }

  def validateCodIR(id: String): Int = {
    var sqlString = ""
    sqlString = "EXEC art.validate_incident_codir {codir}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('codir -> id).as(scalar[Int].single)
    }
  }

  def delete(id: String): Int = {
    var sqlString = ""
    sqlString = "EXEC art.delete_incident {id}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).as(scalar[Int].single)
    }
  }

  def update(severity_id: String,
             date_end: String,
             incident_id: String,
             status_id: String,
             user_creation_id: String,
             note: String): Option[ErrorIncident] = {

    var sqlString = """
      EXEC art.update_incident {severity_id},{date_end},{incident_id},{status_id},
      {user_creation_id},{note}
      """

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('severity_id -> severity_id.toInt,
        'date_end -> date_end,
        'incident_id -> incident_id.toInt,
        'status_id -> status_id.toInt,
        'user_creation_id -> user_creation_id.toInt,
        'note -> note).executeQuery() as (ErrorIncident.error.singleOpt)
    }
  }

  def save(configuration_id: String,
           program_id: String,
           date_creation: String,
           ir_number: String,
           user_sponsor_id: String,
           brief_description: String,
           extended_description: String,
           severity_id: String,
           date_end: String,
           task_owner_id: String,
           user_creation_id: String): Option[ErrorIncident] = {

    var sqlString = """
      EXEC art.save_incident {configuration_id},{program_id},
      {date_creation},{ir_number},{user_sponsor_id},{brief_description},
      {extended_description},{severity_id},{date_end},{task_owner_id},{user_creation_id}
      """

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('configuration_id -> configuration_id.toInt,
        'program_id -> program_id.toInt,
        'date_creation -> date_creation,
        'ir_number -> ir_number,
        'user_sponsor_id -> user_sponsor_id.toInt,
        'brief_description -> brief_description,
        'extended_description -> extended_description,
        'severity_id -> severity_id.toInt,
        'date_end -> date_end,
        'task_owner_id -> task_owner_id.toInt,
        'user_creation_id -> user_creation_id.toInt).executeQuery() as (ErrorIncident.error.singleOpt)
    }
  }

  def saveHours(task_for_date: String,
                nota: String,
                planeadas: String,
                ingresadas: String,
                sub_task_id: String,
                task_id: String,
                uid: String,
                user_creation_id: String): Option[ErrorIncident] = {

    var sqlString = """
      EXEC art.save_incident_hours {task_for_date},{nota},{planeadas},{ingresadas},{sub_task_id},
      {task_id},{uid},{user_creation_id}
      """

    DB.withConnection { implicit connection =>
      SQL(sqlString).on(
        'task_for_date -> task_for_date,
        'nota -> nota,
        'planeadas -> planeadas.toInt,
        'ingresadas -> ingresadas.toInt,
        'sub_task_id -> sub_task_id.toInt,
        'task_id -> task_id.toInt,
        'uid -> uid.toInt,
        'user_creation_id -> user_creation_id.toInt).executeQuery() as (ErrorIncident.error.singleOpt)
    }
  }

  def insertMember(name: String,
                   task_for_date: String,
                   nota: String,
                   planeadas: String,
                   ingresadas: String,
                   sub_task_id: String,
                   user_creation_id: String): Option[ErrorIncident] = {

    var sqlString = """
      EXEC art.save_incident_member {name},{task_for_date},{nota},{planeadas},{ingresadas},{sub_task_id},{user_creation_id}
      """

    DB.withConnection { implicit connection =>
      SQL(sqlString).on(
        'name -> name,
        'task_for_date -> task_for_date,
        'nota -> nota,
        'planeadas -> planeadas.toInt,
        'ingresadas -> ingresadas.toInt,
        'sub_task_id -> sub_task_id.toInt,
        'user_creation_id -> user_creation_id.toInt).executeQuery() as (ErrorIncident.error.singleOpt)
    }
  }
  
  def delMember(task_id:String,
                   sub_task_id: String,
                   uid: String): Int = {

    var sqlString = """
      EXEC art.del_incident_member {task_id},{sub_task_id},{uid}
      """

    DB.withConnection { implicit connection =>
      SQL(sqlString).on(
        'task_id -> task_id.toInt,
        'sub_task_id -> sub_task_id.toInt,
        'uid -> uid.toInt).executeQuery() as (scalar[Int].single)
    }
  }  
  
  def delSubTask(sub_task_id: String): Int = {

    var sqlString = """
      EXEC art.del_incident_subtask {sub_task_id}
      """
    DB.withConnection { implicit connection =>
      SQL(sqlString).on(
        'sub_task_id -> sub_task_id.toInt).executeQuery() as (scalar[Int].single)
    }
  }    

  def count(Json: String): Int = {

    var sqlString = "EXEC art.count_incident {Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }

  def selectTypeFromId(id: String): Int = {
    var sqlString = ""
    sqlString = "SELECT configuration_program_type FROM art_incident_configuration WHERE configuration_id={id}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).as(scalar[Int].single)
    }
  }

  def selectSeverityDays(id: String, feccre: String): Int = {
    var sqlString = "EXEC art.severity_day_incident {id},{feccre}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt, 'feccre -> feccre).as(scalar[Int].single)
    }
  }

  def selectTypeIncident: Seq[ComboConfiguration] = {
    var sqlString = ""
    sqlString = "SELECT configuration_id, RTRIM(configuration_name) configuration_name from art_incident_configuration where class_id = 1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ComboConfiguration.comboConfiguration *)
    }
  }

  def selectStatusIncident: Seq[ComboStatus] = {
    var sqlString = ""
    sqlString = "SELECT status_id, RTRIM(status_name) status_name from art_incident_status where class_id = 1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ComboStatus.comboStatus *)
    }
  }

  def listUsr(term: String): Seq[NameUsr] = {
    var sqlString = "SELECT first_name + ' ' + last_name value,first_name + ' ' + last_name label from art_user where first_name like '%" + term + "%' OR last_name like '%" + term + "%'"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(NameUsr.name *)
    }
  }

  def selectDepartamentIncident: Seq[ComboDepartament] = {
    var sqlString = """
    SELECT a.dId,a.department 
    FROM art_department_master a, art_program b 
    WHERE a.dId=b.department AND b.is_active=1 AND a.is_deleted = 0  AND b.program_id 
    IN (SELECT DISTINCT program_id FROM art_incident)
    """
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ComboDepartament.comboDepartament *)
    }
  }

  def selectProgramForType(id: String): Seq[ProgramCombo] = {
    var sqlString = """
    SELECT a.program_id,RTRIM(a.program_name) program_name from art_program a,
     art_incident_configuration b WHERE
      a.program_type=b.configuration_program_type AND
       b.configuration_program_type={id} AND a.is_active=1
       """
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).as(ProgramCombo.pCombo *)
    }
  }

  def selectSeverity: Seq[Severity] = {
    var sqlString = ""
    sqlString = "SELECT * FROM art_incident_severity"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Severity.severity *)
    }
  }

  def selectSubtask(id: String): Seq[IncidentSubTask] = {
    var sqlString = """
    SELECT
        X.sub_task_id,
        X.title,
        X.plan_start_date,
        X.plan_end_date,
        Y.real_start_date,
        Y.real_end_date,
        X.completion_percentage,
        ISNULL(Y.hours,0) hours,
    CASE WHEN DATEDIFF (day, X.plan_start_date, GETDATE()) < 0 THEN 0 
           WHEN DATEDIFF (day, X.plan_end_date, GETDATE()) > 0 THEN 100 
           WHEN DATEDIFF (day, X.plan_end_date, GETDATE()) <= 0 AND DATEDIFF (day, X.plan_start_date, GETDATE()) >= 0 THEN IIF(DATEDIFF (day, X.plan_start_date, DATEADD(day,1,X.plan_end_date)) > 0, 
           ROUND(100 * CAST(DATEDIFF (day, X.plan_start_date, GETDATE()) AS FLOAT)/DATEDIFF (day, X.plan_start_date, DATEADD(day,1,X.plan_end_date) ),2) , 0)
        END
        expected_percentage
         FROM art_sub_task X 
        LEFT OUTER JOIN
        (
         SELECT SUM(hours) hours,
         MIN(task_for_date) real_start_date,
          MAX(task_for_date) real_end_date, 
          sub_task_id FROM art_timesheet
           GROUP BY sub_task_id
        ) Y
        ON X.sub_task_id=Y.sub_task_id
        WHERE is_deleted=1 AND task_id = {id}
      """
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).as(IncidentSubTask.incidentsubtask *)
    }
  }

  def selectStatus(id: String): Seq[Status] = {
    var sqlString = """    
    SELECT
 a.log_id,
  a.incident_id,
   RTRIM(b.status_name) status_name,
    a.log_date,
   a.note,
   c.first_name + ' ' + c.last_name user_creation_name
    FROM 
    art_incident_log a,
     art_incident_status b,
     art_user c
      WHERE 
    a.status_id=b.status_id AND a.user_creation_id = c.uid AND incident_id = {id}
    """

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).as(Status.status *)
    }
  }

  def selectWorkerHours(id: String): Seq[Hours] = {
    var sqlString = """    
      SELECT
      a.task_id,
      a.sub_task_id,
      c.uid,
      c.first_name + ' ' + c.last_name nombre,
      a.estimated_time planeadas,
      ISNULL(b.trabajadas,0) trabajadas,
      GETDATE() task_for_date,
      0 ingresadas,
      '' nota
      FROM art_sub_task_allocation a
      LEFT OUTER JOIN 
      (SELECT sub_task_id,SUM(hours) trabajadas,user_id FROM art_timesheet WHERE is_deleted=1 GROUP BY sub_task_id,user_id) b
      ON a.sub_task_id=b.sub_task_id AND a.user_id=b.user_id
      JOIN art_user c
      ON a.user_id=c.uid
      WHERE
      a.is_deleted  = 1 AND
       a.sub_task_id={id}
    """

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).as(Hours.hours *)
    }
  }

}