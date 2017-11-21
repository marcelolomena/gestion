package models

import play.api.Play.current
import play.api.PlayException
import java.util.Date
import anorm.SqlParser._
import anorm._
import services.ActivityLogServices


case class Activity(activity_type: Int, message: String, created_at: Date, user_id: Int, refId: Int)

object Activity extends CustomColumns {

  val activityLog = {
    get[Int]("activity_type") ~
      get[String]("message") ~
      get[Date]("created_at") ~
      get[Int]("user_id") ~
      get[Int]("refId") map {
      case activity_type ~ message ~ created_at ~ user_id ~ refId =>
        Activity(activity_type, message, created_at, user_id, refId)
    }

  }

  def saveLog(activity: Activity) = {
    ActivityLogServices.saveActivityLogServices(activity)
  }

  def getActivityLogs() {

  }
}

object ActivityTypes extends Enumeration {
  type ActivityTypes = Value
  val Program,
  Project,
  Task,
  SubTask,
  User,
  Login,
  Allocation,
  Timesheet,
  Risk,
  Alert,
  Issue,
  Document,
  Estimation_Cost,
  Program_Planned_Hrs,
  Project_Planned_Hrs,
  Program_Member,
  Generic_Project_Type,
  Generic_Task_Type,
  Predefined_Task_Type,
  Division, Gerencia,
  Department,
  Program_Type,
  Sub_Type,
  Task_Discipline,
  User_Role, Stage,
  Deliverable,
  Document_Type,
  Budget_Type,
  Service_Catalogue,
  Program_Sap,
  Project_Sap,
  UserSkills,
  Project_Workflow_Status,
  Incident,ConfigMail = Value
}