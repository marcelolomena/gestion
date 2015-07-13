package services

import models.Project
import play.api.Play.current
import play.api.db.DB
import models._
import anorm._
import java.util.Date
import org.apache.commons.lang3.StringUtils
import java.util.Calendar

object RoadmapServices {

  def getRoadmapCalenderDetailsForProgram(startDate: Date, endDate: Date, product: String, roadmapType: String, uId: Integer, uType: Integer): List[ProgramMaster] = {
    DB.withConnection { implicit connection =>
      var productDetails = ""
      var date = ""
      var projectCondition = ""
      var sql = ""

      if (!StringUtils.equals(product, "NA") && !StringUtils.equals(product, "null") && !StringUtils.isEmpty(product)) {
        roadmapType match {
          case "division" =>
            sql = "SELECT DISTINCT(p.pId), p.* FROM art_project_master p ,art_task m where  m.pId=p.pId and  p.program IN (SELECT program_id FROM art_program WHERE devison=" + product + ") AND"
          case "program" =>
            sql = "SELECT DISTINCT(p.pId), p.* FROM art_project_master p ,art_task m where  m.pId=p.pId and p.program=" + product + " AND"
          case "project" =>
            sql = "SELECT DISTINCT(p.pId), p.* FROM art_project_master p ,art_task m where  m.pId=p.pId and p.pId=" + product + " AND"
          case "none" =>
            sql = "SELECT DISTINCT(p.pId), p.* FROM art_project_master p ,art_task m where  m.pId=p.pId and "

        }

      } else {
        sql = "SELECT DISTINCT(p.pId), p.* FROM art_project_master p ,art_task m where  m.pId=p.pId and "
      }

      sql = "select * from art_program p where "

      if (startDate == "" || endDate == "") {
        return null
      } else {
        if (product != "none") {
          //sql += " m.pId='" + product + "' AND "
        }
        val today = Calendar.getInstance()
        today.setTime(startDate)

        val tomorrow = Calendar.getInstance()
        tomorrow.setTime(endDate)

        // sql += " (p.start_date >  '"+(startDate.getYear()+1900)+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate()+ "' || p.final_release_date < '"+(endDate.getYear()+1900)+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate()+"')"

        sql += " p.closure_date BETWEEN '" + today.get(Calendar.YEAR) + "-" + (today.get(Calendar.MONTH) + 1) + "-" + today.get(Calendar.DATE) + "' AND '" + tomorrow.get(Calendar.YEAR) + "-" + (tomorrow.get(Calendar.MONTH) + 1) + "-" + tomorrow.get(Calendar.DATE) + "'"
        //println("Sql - - " + sql);
        val result = SQL(sql).as(ProgramMaster.pMaster *)

        result
      }
    }
  }

  def getRoadmapCalenderDetails(startDate: Date, endDate: Date, product: String, roadmapType: String, uId: Integer, uType: Integer): List[Project] = {
    DB.withConnection { implicit connection =>
      var productDetails = ""
      var date = ""
      var projectCondition = ""
      var sql = ""

      if (!StringUtils.equals(product, "NA") && !StringUtils.equals(product, "null") && !StringUtils.isEmpty(product)) {
        roadmapType match {
          case "division" =>
            sql = "SELECT DISTINCT(p.pId), p.* FROM art_project_master p ,art_task m where  m.pId=p.pId and  p.program IN (SELECT program_id FROM art_program WHERE devison=" + product + ") AND"
          case "program" =>
            sql = "SELECT DISTINCT(p.pId), p.* FROM art_project_master p ,art_task m where  m.pId=p.pId and p.program=" + product + " AND"
          case "project" =>
            sql = "SELECT DISTINCT(p.pId), p.* FROM art_project_master p ,art_task m where  m.pId=p.pId and p.pId=" + product + " AND"
          case "none" =>
            sql = "SELECT DISTINCT(p.pId), p.* FROM art_project_master p ,art_task m where  m.pId=p.pId and "

        }

      } else {
        sql = "SELECT DISTINCT(p.pId), p.* FROM art_project_master p ,art_task m where  m.pId=p.pId and "
      }

      if (startDate == "" || endDate == "") {
        return null
      } else {
        if (product != "none") {
          //sql += " m.pId='" + product + "' AND "
        }
        val today = Calendar.getInstance()
        today.setTime(startDate)

        val tomorrow = Calendar.getInstance()
        tomorrow.setTime(endDate)

        // sql += " (p.start_date >  '"+(startDate.getYear()+1900)+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate()+ "' || p.final_release_date < '"+(endDate.getYear()+1900)+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate()+"')"

        sql += " m.plan_end_date BETWEEN '" + today.get(Calendar.YEAR) + "-" + (today.get(Calendar.MONTH) + 1) + "-" + today.get(Calendar.DATE) + "' AND '" + tomorrow.get(Calendar.YEAR) + "-" + (tomorrow.get(Calendar.MONTH) + 1) + "-" + tomorrow.get(Calendar.DATE) + "'"
        //println("Sql - - " + sql);
        val result = SQL(sql).as(Project.project *)

        result
      }

    }
  }
}