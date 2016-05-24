package services

import play.api.Play.current
import play.api.db.DB
import models.UserStory
import models.UserStoryScenario
//import models.ErrorUserStory
import anorm._
import anorm.SqlParser._
import play.api.libs.json.JsObject

/**
 * @author cristian
 */
object UserStoryService {

  def list(pageSize: String, pageNumber: String, Json: String, user_id: Int): Seq[UserStory] = {
    var sqlString = "EXEC art.list_user_story {PageSize},{PageNumber},{Json},{User_Id}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json, 'User_Id -> user_id).executeQuery() as (UserStory.userStory *)
    }
  }
  def listScenario(user_story: String): Seq[UserStoryScenario] = {
    var sqlString = "EXEC art.list_user_story_scenario {User_story}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('User_story -> user_story).executeQuery() as (UserStoryScenario.userStoryScenario *)
    }
  }
/*
  def delete(id: String): Int = {
    var sqlString = ""
    sqlString = "EXEC art.delete_incident {id}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).as(scalar[Int].single)
    }
  }
*/
  /*
  def update(severity_id: String,
             date_end: String,
             incident_id: String,
             status_id: String,
             user_creation_id: String,
             note: String,
			 configuration_id: String,
			 program_id: String,
			 task_owner_id: String,
			 alm_number: String,
			 uname: String): Option[ErrorIncident] = {

    var sqlString = """
      EXEC art.update_incident {severity_id},{date_end},{incident_id},{status_id},
      {user_creation_id},{note},{configuration_id},{program_id},{task_owner_id},{alm_number},{uname}
      """
    println("va el dato en el servicio")
println(uname)
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
		'alm_number -> alm_number,
		'uname -> uname).executeQuery() as (ErrorIncident.error.singleOpt)
    }
  }
*/
/*
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
*/

  def count(Json: String, user_id: Int): Int = {

    var sqlString = "EXEC art.count_user_story {Json}, {User_Id}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Json -> Json, 'User_Id -> user_id).executeQuery() as (scalar[Int].single)
    }
  }

}