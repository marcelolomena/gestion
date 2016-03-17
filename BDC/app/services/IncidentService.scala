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
import models.Pie;
import anorm._
import anorm.SqlParser._
import play.api.libs.json.JsObject

/**
 * @author marcelo
 */
object IncidentService {

  def list(pageSize: String, pageNumber: String, Json: String, user_id: Int): Seq[Incident] = {
    var sqlString = "EXEC art.list_incident {PageSize},{PageNumber},{Json},{User_Id}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json, 'User_Id -> user_id).executeQuery() as (Incident.incident *)
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
             note: String,
			 configuration_id: String,
			 program_id: String,
			 task_owner_id: String,
			 alm_number: String): Option[ErrorIncident] = {

    var sqlString = """
      EXEC art.update_incident {severity_id},{date_end},{incident_id},{status_id},
      {user_creation_id},{note},{configuration_id},{program_id},{task_owner_id},{alm_number}
      """

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('severity_id -> severity_id.toInt,
        'date_end -> date_end,
        'incident_id -> incident_id.toInt,
        'status_id -> status_id.toInt,
        'user_creation_id -> user_creation_id.toInt,
        'note -> note,
		'configuration_id -> configuration_id.toInt,
		'program_id -> program_id.toInt,
		'task_owner_id -> task_owner_id.toInt,
		'alm_number -> alm_number).executeQuery() as (ErrorIncident.error.singleOpt)
    }
  }

  def updateCompletionPercentage(sub_task_id: String,title:String, completion_percentage: String, plan_start_date: String, plan_end_date: String): Option[ErrorIncident] = {

    var sqlString = """
      EXEC art.update_incident_subtask {sub_task_id},{title},{completion_percentage},{plan_start_date},{plan_end_date}
      """

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('sub_task_id -> sub_task_id.toInt,
        'title -> title,
        'completion_percentage -> completion_percentage.toDouble,
        'plan_start_date -> plan_start_date,
        'plan_end_date -> plan_end_date).executeQuery() as (ErrorIncident.error.singleOpt)
    }
  }

  def save(configuration_id: String,
           program_id: String,
           date_creation: String,
           ir_number: String,
		       alm_number: String,
           user_sponsor_id: String,
           brief_description: String,
           extended_description: String,
           severity_id: String,
           date_end: String,
           task_owner_id: String,
           user_creation_id: String): Option[ErrorIncident] = {

    var sqlString = """
      EXEC art.save_incident {configuration_id},{program_id},
      {date_creation},{ir_number},{alm_number},{user_sponsor_id},{brief_description},
      {extended_description},{severity_id},{date_end},{task_owner_id},{user_creation_id}
      """

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('configuration_id -> configuration_id.toInt,
        'program_id -> program_id.toInt,
        'date_creation -> date_creation,
        'ir_number -> ir_number,
		'alm_number -> alm_number,
        'user_sponsor_id -> user_sponsor_id,
        'brief_description -> brief_description,
        'extended_description -> extended_description,
        'severity_id -> severity_id.toInt,
        'date_end -> date_end,
        'task_owner_id -> task_owner_id.toInt,
        'user_creation_id -> user_creation_id.toInt).executeQuery() as (ErrorIncident.error.singleOpt)
    }
  }

  def saveSubTask(
                task_id: String,
                title: String,
                description: String,
                plan_start_date: String,
                plan_end_date: String,               
                catalogo: String): Option[ErrorIncident] = {

    var sqlString = """
      EXEC art.save_incident_subtask {task_id},{title},{description},{plan_start_date},{plan_end_date},{catalogo}
      """

    DB.withConnection { implicit connection =>
      SQL(sqlString).on(
        'task_id -> task_id.toInt,
        'title -> title,
        'description -> description,
        'plan_start_date -> plan_start_date,
        'plan_end_date -> plan_end_date,
        'catalogo -> catalogo.toInt).executeQuery() as (ErrorIncident.error.singleOpt)
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
        'planeadas -> planeadas.toFloat,
        'ingresadas -> ingresadas.toFloat,
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
        'planeadas -> planeadas.toFloat,
        'ingresadas -> ingresadas.toFloat,
        'sub_task_id -> sub_task_id.toInt,
        'user_creation_id -> user_creation_id.toInt).executeQuery() as (ErrorIncident.error.singleOpt)
    }
  }

  def delMember(task_id: String,
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

  def count(Json: String, user_id: Int): Int = {

    var sqlString = "EXEC art.count_incident {Json}, {User_Id}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Json -> Json, 'User_Id -> user_id).executeQuery() as (scalar[Int].single)
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
    var sqlString = "SELECT first_name + ' ' + last_name value,first_name + ' ' + last_name label FROM art_user WHERE first_name like '%" + term + "%' OR last_name like '%" + term + "%'"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(NameUsr.name *)
    }
  }

  def listUsrTwo(term: String): Seq[NameUsr] = {
    var sqlString = "exec art.list_member_rrhh {term}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('term -> term) as(NameUsr.name *)
    }
  }
  
  def selectDepartamentIncident: Seq[ComboDepartament] = {
    var sqlString = """
  SELECT DISTINCT r.codDepartamento dId
      ,r.glosaDepartamento department
     FROM art_incident a,
       art_incident_configuration c,
       art_user f,
       art_incident_severity g,
       RecursosHumanos r
      WHERE
      a.configuration_id=c.configuration_id AND
      a.user_sponsor_id=f.uid AND
      g.severity_id=a.severity_id AND
      a.is_deleted = 1 AND
      LEFT(r.emailTrab, CHARINDEX('@', r.emailTrab) - 1 ) = f.uname 
      AND LEN(r.emailTrab) > 1
      AND periodo=(SELECT MAX(periodo) FROM RecursosHumanos)
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

  def selectSeverityConfiguration(id: String): Seq[Severity] = {
    var sqlString = ""
    sqlString = "SELECT * FROM art_incident_severity WHERE configuration_id={id}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).as(Severity.severity *)
    }
  }
  def selectProgramConfiguration(id: String): Seq[ProgramCombo] = {
    var sqlString = ""
    sqlString = "SELECT a.program_id,RTRIM(a.program_name) program_name from art_program a, art_incident_configuration b WHERE a.program_type=b.configuration_program_type AND b.configuration_id={id} AND a.is_active=1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).as(ProgramCombo.pCombo *)
    }
  }
  def selectSeverityConfiguration(): Seq[Severity] = {
    var sqlString = ""
    sqlString = "SELECT * FROM art_incident_severity"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Severity.severity *)
    }
  }

  def selectSubtask(id: String, SortColumnName: String, SortOrderBy: String, NumberOfRows: Int, StartRow: Int): Seq[IncidentSubTask] = {
    var sqlString = """
  SELECT * FROM
(SELECT Row_Number() Over(ORDER BY CASE                  
                    WHEN {SortColumnName} = 'title'
                    AND {SortOrderBy} = 'asc'
                    THEN title
                    END ASC, CASE
                    WHEN {SortColumnName} = 'title'
                    AND {SortOrderBy} = 'desc'
                    THEN title
                    END DESC) as sno,
  COUNT(*) Over() cantidad,
        X.sub_task_id,
        X.task_id,
        W.owner task_owner_id,
        J.project_manager project_manager_id,
        G.demand_manager program_manager_id,        
        X.title,
        '' description,
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
        expected_percentage,
        '' fecini
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
        JOIN art_task W ON X.task_id=W.tId
        JOIN art_project_master J ON W.pId = J.pId 
        JOIN art_program G ON J.program = G.program_id              
    WHERE X.is_deleted=1 AND W.is_active=1 AND X.task_id = {id} 
    ) as RECORDS
    WHERE  RECORDS.Sno BETWEEN ({StartRow} - {NumberOfRows}) AND ({StartRow} - 1) ORDER BY plan_start_date
      """
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt,
          'SortColumnName -> SortColumnName,
          'SortOrderBy -> SortOrderBy,
          'NumberOfRows -> NumberOfRows,
          'StartRow -> StartRow).as(IncidentSubTask.incidentsubtask *)
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
      t.owner task_owner_id,
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
      JOIN art_task t ON t.tId=a.task_id
      WHERE
      a.is_deleted  = 1 AND t.is_active = 1 AND
       a.sub_task_id={id}
    """

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).as(Hours.hours *)
    }
  }
  
  def pieChart(): Seq[Pie] = {

    var sqlString = "EXEC art.porcentaje_incident_for_department"
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Pie.pie *)
    }
  }  

}