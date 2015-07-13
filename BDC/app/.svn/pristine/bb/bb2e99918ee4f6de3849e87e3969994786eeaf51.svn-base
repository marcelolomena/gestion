package services

import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._;
import models._;
import anorm._
import com.typesafe.plugin._;

object ActivityLogServices {

  def saveActivityLogServices(act: Activity): Int = {
    DB.withConnection { implicit connection =>
      SQL("EXEC bitacora.set_activity  {type},{message},{uid},{rid}").on(
        'type -> act.activity_type, 'message -> act.message, 'uid -> act.user_id, 'rid -> act.refId).executeQuery().as(scalar[Int].single)
    }
  }

  def countActivityLogServices(): Int = {
    DB.withConnection { implicit connection =>
      SQL("EXEC bitacora.get_num_activity").executeQuery().as(scalar[Int].single)
    }
  }  
  
  def findPaginationActivityLog(PageSize: Integer, PageNumber: Integer): Seq[Activity] = {
    DB.withConnection { implicit connection =>
      SQL("EXEC bitacora.get_paginate_activity  {PageSize},{PageNumber}").on(
        'PageSize -> PageSize, 'PageNumber -> PageNumber).executeQuery().as(Activity.activityLog *)
    }
  }  
}