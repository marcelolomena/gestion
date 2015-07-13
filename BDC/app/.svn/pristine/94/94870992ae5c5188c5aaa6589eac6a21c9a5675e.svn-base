package services;
import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._;
import models._;
import anorm._
import com.typesafe.plugin._;
import play.api.data.Form
import play.i18n._
import play.mvc._
import java.util.Date

object GenrenciaService extends CustomColumns {
  val langObj = new Lang(Lang.forCode("es-ES"))
  def findAllGenrenciaList(pagNo: String, recordOnPage: String): Seq[Genrencias] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""

    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY dId) AS Row, * FROM art_genrencia_master AS tbl)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    //sqlString = "SELECT  d.* from art_genrencia_master d, art_user u where ( d.user_id=u.uid)  limit " + start + "," + end
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Genrencias.genrencia *)
    }

  }

  def findAllGenrencia(): Seq[Genrencias] = {
    var sqlString = ""
    sqlString = "SELECT  d.* from art_genrencia_master d where d.is_deleted= 0"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Genrencias.genrencia *)
    }

  }

 

  def genrenciaCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = "SELECT  count(*) from art_genrencia_master "
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }

  def findAllGenrenciaListByDivision(devision: String): Seq[Genrencias] = {
    var sqlString = "SELECT  d.* from art_genrencia_master d where d.report_type=0 and d.is_deleted=0 and d.report_to= " + devision
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Genrencias.genrencia *)
    }
  }

  def saveGenrencia(genrencia: Genrencias): Long = {
    DB.withConnection { implicit connection =>
      val lastsaved = SQL(
        """
          insert into art_genrencia_master ( genrencia, user_id,report_type,report_to,organization_depth,updated_by,updation_date,is_deleted) values (
           {genrencia},{user_id},{report_type},{report_to},{organization_depth},{updated_by},{updation_date},{is_deleted})
          """).on(
          'genrencia -> genrencia.genrencia.trim(),
          'user_id -> genrencia.user_id,
          'report_type -> genrencia.report_type,
          'report_to -> genrencia.report_to,
          'organization_depth -> genrencia.organization_depth,
          'updated_by -> genrencia.updated_by,
          'updation_date -> new Date(),
          'is_deleted -> genrencia.is_deleted).executeInsert(scalar[Long].singleOpt)
      lastsaved.last
    }
  }

  def updateGenrencia(genrencia: Genrencias): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_genrencia_master
          set 
          genrencia =  {genrencia},
          user_id={user_id},
          report_to={report_to},
          report_type={report_type},
          organization_depth={organization_depth},
          updated_by={updated_by},
          updation_date={updation_date}
          where dId = {dId}
          """).on(
          'dId -> genrencia.dId,
          'genrencia -> genrencia.genrencia.trim(),
          'user_id -> genrencia.user_id,
          'report_to -> genrencia.report_to,
          'report_type -> genrencia.report_type,
          'updated_by -> genrencia.updated_by,
          'updation_date -> new Date(),
          'organization_depth -> genrencia.organization_depth).executeUpdate()
    }
  }

  def findGenrenciaById(dId: Integer) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_genrencia_master where dId = {dId}  ").on(
          'dId -> dId).as(
            Genrencias.genrencia.singleOpt)
      result
    }
  }

  /**
   * delete milestone information
   */

  def changeGenrenciaStatus(id: Integer, is_deleted: Int, uid: Int): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_genrencia_master
          set 
          updated_by={updated_by},
          updation_date={updation_date},
          is_deleted={is_deleted}
          where dId = {dId}
          """).on(
          'dId -> id,
          'updated_by -> uid,
          'updation_date -> new Date(),
          'is_deleted -> is_deleted).executeUpdate()
    }
  }

  def findGenrenciaByName(genrencia: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL("select * from art_genrencia_master where is_deleted=0 AND genrencia = '" + genrencia + "' ").as(Genrencias.genrencia *)
      result
    }
  }
  def findGenrenciaByNameForEdit(genrencia: String, genrencia_id: String): Seq[Genrencias] = {
    var sql = "select d.* from art_genrencia_master d where d.is_deleted = 0  AND d.genrencia='" + genrencia.trim() + "' AND d.dId <>'" + genrencia_id + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Genrencias.genrencia *)
      result
    }
  }
  def validateGenrenciaForm(form: Form[Genrencias]): Form[Genrencias] = {
    var newform: Form[Genrencias] = null
    val genrencia_id = form.data.get("id").get.trim()
    // val descriptionlegth = form.data.get("description").get.trim().length()
    val genrencia = form.data.get("genrencia").get.trim()
    /*    if (descriptionlegth <= 4 || descriptionlegth >= 500) {
      newform = form.withError("description", Messages.get(langObj, ("error.description.minmax")))
    }*/

    val obj = findGenrenciaByNameForEdit(genrencia, genrencia_id)
    if (obj.size > 0) {
      newform = form.withError("genrencia", Messages.get(langObj, "gerencia.gerenciaexist"))
    }

    if (newform != null) {
      newform
    } else {
      form
    }
  }
  
   def findAllGenrencias(): Seq[Genrencias] = {
    var sqlString = ""
    sqlString = "SELECT  d.* from art_genrencia_master d where d.is_deleted = 0"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Genrencias.genrencia *)
    }
  }
   
}