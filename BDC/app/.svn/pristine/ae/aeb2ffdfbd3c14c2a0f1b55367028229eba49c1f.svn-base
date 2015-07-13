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

object DepartmentService extends CustomColumns {
  val langObj = new Lang(Lang.forCode("es-ES"))
  
  def findAllDepartmentList(pagNo: String, recordOnPage: String): Seq[Departments] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""

    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY dId) AS Row, * FROM art_department_master AS tbl)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    //sqlString = "SELECT  d.* from art_department_master d, art_user u where ( d.user_id=u.uid)  limit " + start + "," + end
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Departments.department *)
    }

  }

  def findAllDepartmentS(): Seq[Departments] = {
    var sqlString = ""
    sqlString = "SELECT  d.* from art_department_master d where is_deleted = 0"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Departments.department *)
    }

  }

  def findAllDepartmentsByGerentiaIds(idList: String): Seq[Departments] = {

    var sqlString = "SELECT  d.* from art_department_master d where report_to  IN (" + idList + ")  AND  d.is_deleted = 0"

    //println("sqlString  = " + sqlString)

    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Departments.department *)
    }

  }

  def departmentCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) from art_department_master"
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }
  def findAllDepartmentListByGenrencia(genrencia: String): Seq[Departments] = {
    //printf("id for depts = " + genrencia);
    var sqlString = ""
    sqlString = "SELECT  d.* from art_department_master d where d.report_type = 0 AND  d.is_deleted = 0 AND d.report_to=" + genrencia
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Departments.department *)
    }

  }
  def saveDepartment(department: Departments): Long = {
    DB.withConnection { implicit connection =>
      val lastsaved = SQL(
        """
          insert into art_department_master (department, user_id,report_type,report_to,organization_depth,updated_by,updation_date,is_deleted) values (
         {department},{user_id},{report_type},{report_to},{organization_depth},{updated_by},{updation_date},{is_deleted})
          """).on(
          'department -> department.department.trim(),
          'user_id -> department.user_id,
          'report_type -> department.report_type,
          'report_to -> department.report_to,
          'organization_depth -> department.organization_depth,
          'updated_by -> department.updated_by,
          'updation_date -> new Date(),
          'is_deleted -> department.is_deleted).executeInsert(scalar[Long].singleOpt)
      lastsaved.last
    }
  }

  def updateDepartment(department: Departments): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_department_master
          set 
          department={department},
          user_id={user_id},
          report_type={report_type},
          report_to={report_to},
          organization_depth={organization_depth},
          updated_by={updated_by},
          updation_date={updation_date}
          where dId = {dId}
          """).on(
          'dId -> department.dId,
          'department -> department.department.trim(),
          'user_id -> department.user_id,
          'report_type -> department.report_type,
          'report_to -> department.report_to,
          'updated_by -> department.updated_by,
          'updation_date -> new Date(),
          'organization_depth -> department.organization_depth).executeUpdate()
    }
  }

  def findDepartmentById(dId: Integer) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_department_master where dId = {dId} ").on(
          'dId -> dId).as(
            Departments.department.singleOpt)
      result
    }
  }

  /**
   * delete milestone information
   */
  def changeDepartmentStatus(id: Integer, is_deleted: Int) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "update  art_department_master set is_deleted= " + is_deleted + " where dId='" + id + "'").on(
          'dId -> id).executeUpdate()
    }
  }

  def changeDepartmentStatus(id: Integer, is_deleted: Int, uid: Int): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_department_master
          set 
          is_deleted={is_deleted},
          updated_by={updated_by},
          updation_date={updation_date}
          where dId = {dId}
          """).on(
          'dId -> id,
          'updated_by -> uid,
          'updation_date -> new Date(),
          'is_deleted -> is_deleted).executeUpdate()
    }
  }

  def findDepartmentByName(department: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL("select * from art_department_master where department like '" + department + "' AND is_deleted = 0").as(Departments.department *)
      result
    }
  }
  def findDepartmentByNameForEdit(department: String, department_id: String): Seq[Departments] = {
    var sql = "select d.* from art_department_master d where d.is_deleted = 0  AND d.department='" + department.trim() + "' AND d.dId <>'" + department_id + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Departments.department *)
      result
    }
  }
  def validateDepartmentForm(form: Form[Departments]): Form[Departments] = {
    var newform: Form[Departments] = null
    val department_id = form.data.get("id").get.trim()
    // val descriptionlegth = form.data.get("description").get.trim().length()
    val department = form.data.get("department").get.trim()
    /*    if (descriptionlegth <= 4 || descriptionlegth >= 500) {
      newform = form.withError("description", Messages.get(langObj, ("error.description.minmax")))
    }*/

    val obj = findDepartmentByNameForEdit(department, department_id)
    if (obj.size > 0) {
      newform = form.withError("department", Messages.get(langObj, "department.departmentexist"))
    }

    if (newform != null) {
      newform
    } else {
      form
    }
  }
}