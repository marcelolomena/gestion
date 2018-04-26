package services

import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models.Stages
import anorm._
import com.typesafe.plugin._
import java.util._
import play.api.data.Form
import play.i18n._
import play.mvc._
import models.ProgramMembersExternal
import models.ProgramMembersExternalAllocation
object ProgramMemberExternalService {

  val langObj = new Lang(Lang.forCode("es-ES"))
  def findProgramMemberExternal(): Seq[ProgramMembersExternal] = {
    return null;
  }

  def saveProgramMemberExternal(obj: ProgramMembersExternal): Int = {

    DB.withConnection { implicit connection =>
      SQL(
        """
          insert into art_program_members_external (program_id, provider_type, provider_name, resource_name, number_of_resources, control_field1, control_field2, created_by, creation_date, updation_date, is_deleted) values (
         {program_id}, {provider_type}, {provider_name}, {resource_name}, {number_of_resources}, {control_field1}, {control_field2}, {created_by}, {creation_date}, {updation_date}, {is_deleted})
          """).on(
          'program_id -> obj.program_id,
          'provider_type -> obj.provider_type,
          'provider_name -> obj.provider_name,
          'resource_name -> obj.resource_name,
          'number_of_resources -> obj.number_of_resources,
          'control_field1 -> obj.control_field1,
          'control_field2 -> obj.control_field2,
          'created_by -> obj.created_by,
          'creation_date -> new Date(),
          'updation_date -> new Date(),
          'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }

  def updateProgramMemberExternal(obj: ProgramMembersExternal): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_members_external set program_id ={program_id},provider_type={provider_type},provider_name={provider_name},resource_name={resource_name},number_of_resources={number_of_resources},control_field1={control_field1}, control_field2={control_field2}, created_by={created_by}, creation_date={creation_date}, updation_date={updation_date}, is_deleted={is_deleted} where id={id}  """).on(
        'id -> obj.id.get,
        'program_id -> obj.program_id,
        'provider_type -> obj.provider_type,
        'provider_name -> obj.provider_name,
        'resource_name -> obj.resource_name,
        'number_of_resources -> obj.number_of_resources,
        'control_field1 -> obj.control_field1,
        'control_field2 -> obj.control_field2,
        'created_by -> obj.created_by,
        'creation_date -> obj.creation_date,
        'updation_date -> obj.updation_date,
        'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }

  /*  
  def findProgramMemberExternalByProgramId(program_id: String): Seq[ProgramMembersExternal] = {
    if (!program_id.isEmpty()) {
      var sql = "select * from art_program_members_external  where program_id='" + program_id + "' AND is_deleted=0"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(ProgramMembersExternal.programMembersExternal *)
        result
      }
    } else {
      null
    }
  }
*/
  def findProgramMemberExternalByProgramId(program_id: String): Seq[ProgramMembersExternalAllocation] = {
    if (!program_id.isEmpty()) {
      var sqlString = "EXEC art.asignacion_externa_ext {pId}"
      DB.withConnection { implicit connection =>
        SQL(sqlString).on('pId -> program_id.toInt).executeQuery() as (ProgramMembersExternalAllocation.programMembersExternalAllocation *)
      }
    } else {
      null
    }
  }

  def findProgramMemberExternalById(id: String): Option[ProgramMembersExternal] = {
    if (!id.isEmpty()) {
      var sql = "select * from art_program_members_external  where id='" + id + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(ProgramMembersExternal.programMembersExternal.singleOpt)
        result
      }
    } else {
      null
    }
  }

  def findProgramMembersExternalForRole(program_id: String, role_id: String): Seq[ProgramMembersExternal] = {
    var sql = "select * from art_program_members_external  where program_id='" + program_id.trim() + "' AND provider_type='" + role_id + "'";
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProgramMembersExternal.programMembersExternal *)
      result
    }
  }
  
  def findProgramMembersExternalForRole(program_id: String): Seq[ProgramMembersExternal] = {
    var sql = "SELECT * FROM art_program_members_external  WHERE is_deleted = 0 AND program_id=" + program_id.trim() 
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProgramMembersExternal.programMembersExternal *)
      result
    }
  }
  
  /**
   * delete stage
   */
  def deleteStage(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "update  art_program_stage set is_deleted = 1  where id='" + id + "'").on(
          'id -> id).executeUpdate()
    }
  }

}