package services;
import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._;
import models._;
import anorm._
import com.typesafe.plugin._;

object ProjectManagerService {

  /**
   * Project Manager
   */
  def findProjectManagerListDetails(uId: Integer): Seq[PMSetting] = {
    DB.withConnection { implicit connection =>
      val projectManagerDetails = SQL("select * from  art_user_pm_mapping where (uId = {uId}) order by pId desc").on('uId -> uId).as(PMSetting.pm *)
      projectManagerDetails
    }
  }

  def deletePMSetting(uId: Integer) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "Delete from  art_user_pm_mapping where uId = {uId}").on(
          'uId -> uId).executeUpdate()
    }
  }

  def deletePMSettingbyuIdandpId(uId: Integer, pId: Integer) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "Delete from art_user_pm_mapping where (uId = {uId} and pId = {pId} )").on(
          'uId -> uId, 'pId -> pId).executeUpdate()
    }
  }

  def findProjectManagerProjects(uId: Integer): Seq[Project] = {
    val sqlSting = "select * from art_project_master where active =1 && pId IN (select pId from  art_user_pm_mapping where uId=" + uId + ") order by pId desc"
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(Project.project *)
    }
  }

  def findProjectManagerProjects(uId: Integer, pId: Integer) = {
    val sqlSting = "select Distinct(uId),pId from  art_user_pm_mapping where uId=" + uId + "  && pId=" + pId
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(PMSetting.pm.singleOpt)
    }
  }
  def findPMProjectsByUser(uId: Integer): Seq[Project] = {
    val sqlSting = "select * from art_project_master where active =1 && pId IN (select pId from  art_user_pm_mapping where uId=" + uId + " ) order by pId desc"
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(Project.project *)
    }
  }

  def findProjectListForPM(uId: Integer): Seq[Project] = {
    val sqlSting = "select * from art_project_master where active =1 && pId NOT IN (select pId from  art_user_pm_mapping where uId=" + uId + " ) order by pId desc"
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(Project.project *)
    }
  }

  def savePMSetting(pm: PMSetting): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
    		  insert into art_user_pm_mapping(uId,pId) values ({uId},{pId})
    		  """).on(
          'uId -> pm.uId,
          'pId -> pm.pId).executeUpdate()
    }
  }

}