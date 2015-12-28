package models
import anorm.SqlParser._
import anorm._
import java.util.Date

/*
case class RiskManagement(
    parent_id: Option[Int],
    parent_type: Option[Int],
    name: String,
    cause: String,
    event: String,
  imapct: String,
  risk_category: Int,
  variable_imapact: String,
  probablity_of_occurence: Int,
  quantification: Int,
  strategic_reply: Int,
  responsible: Int,
  reply_action: Option[String],
  configuration_plan: Option[String],
  document_category: Option[String],
  sub_category: Int,
  risk_state: Int,
  risk_clouser_date: Date/*,
  is_active: Option[Int]*/)

object RiskManagement extends CustomColumns {

  val riskManagement = {
      get[Option[Int]]("parent_id") ~
      get[Option[Int]]("parent_type") ~
      get[String]("name") ~
      get[String]("cause") ~
      get[String]("event") ~
      get[String]("imapct") ~
      get[Int]("risk_category") ~
      get[String]("variable_imapact") ~
      get[Int]("probablity_of_occurence") ~
      get[Int]("quantification") ~
      get[Int]("strategic_reply") ~
      get[Int]("responsible") ~
      get[Option[String]]("reply_action") ~
      get[Option[String]]("configuration_plan") ~
      get[Option[String]]("document_category") ~
      get[Int]("sub_category") ~
      get[Int]("risk_state") ~
      get[Date]("risk_clouser_date") /*~ 
      get[Option[Int]]("is_active")*/ map {
        case parent_id ~ parent_type ~ name ~ cause ~ event ~ imapct ~ risk_category ~ variable_imapact ~ probablity_of_occurence ~ quantification ~ strategic_reply ~ responsible
          ~ reply_action ~ configuration_plan ~ document_category ~ sub_category ~ risk_state ~ risk_clouser_date /*~ is_active*/ =>
          RiskManagement(parent_id, parent_type, name, cause, event, imapct, risk_category, variable_imapact, probablity_of_occurence, quantification, strategic_reply, responsible,
            reply_action, configuration_plan, document_category, sub_category,risk_state,risk_clouser_date/*, is_active*/)
      }
  }
}
*/

case class RiskManagement(
    parent_id: Option[Int],
    parent_type: Option[Int],
    name: String,
    cause: String,
    event: String,
  imapct: String,
  risk_category: Int,
  variable_imapact: String,
  probablity_of_occurence: Int,
  quantification: Int,
  strategic_reply: Int,
  responsible: Int,
  reply_action: Option[String],
  configuration_plan: Option[String],
  document_category: Option[String],
  sub_category: Int,
  risk_state: Int,
  risk_clouser_date: Date)

object RiskManagement extends CustomColumns {

  val riskManagement = {
      get[Option[Int]]("parent_id") ~
      get[Option[Int]]("parent_type") ~
      get[String]("name") ~
      get[String]("cause") ~
      get[String]("event") ~
      get[String]("imapct") ~
      get[Int]("risk_category") ~
      get[String]("variable_imapact") ~
      get[Int]("probablity_of_occurence") ~
      get[Int]("quantification") ~
      get[Int]("strategic_reply") ~
      get[Int]("responsible") ~
      get[Option[String]]("reply_action") ~
      get[Option[String]]("configuration_plan") ~
      get[Option[String]]("document_category") ~
      get[Int]("sub_category") ~
      get[Int]("risk_state") ~
      get[Date]("risk_clouser_date") map {
        case parent_id ~ parent_type ~ name ~ cause ~ event ~ imapct ~ risk_category ~ variable_imapact ~ probablity_of_occurence ~ quantification ~ strategic_reply ~ responsible
          ~ reply_action ~ configuration_plan ~ document_category ~ sub_category ~ risk_state ~ risk_clouser_date  =>
          RiskManagement(parent_id, parent_type, name, cause, event, imapct, risk_category, variable_imapact, probablity_of_occurence, quantification, strategic_reply, responsible,
            reply_action, configuration_plan, document_category, sub_category,risk_state,risk_clouser_date)
      }
  }
}
/*
case class RiskManagementEx(
  risk_state: Int
  )

object RiskManagementEx extends CustomColumns {

  val riskManagementEx = {
      get[Int]("risk_state")  map {
        case  risk_state  =>
          RiskManagementEx(
              risk_state)
      }
  }
}
*/

case class RiskManagementIssue(id: Option[Int], parent_id: Option[Int], parent_type: Option[Int], title: String, description: String,
  category: Int, sub_category: Int, members_involved: Option[String], action_plan: Option[String],
  priority: Int, issue_date: Date, user_id: Option[Int], closure_date: Option[Date],
  planned_end_date: Option[Date], actual_end_date: Option[Date], creation_date: Option[Date],
  updation_date: Option[Date], issue_status: Option[Int], is_active: Option[Int])

object RiskManagementIssue extends CustomColumns {

  val riskManagementIssue = {
    get[Option[Int]]("id") ~
      get[Option[Int]]("parent_id") ~
      get[Option[Int]]("parent_type") ~
      get[String]("title") ~
      get[String]("description") ~
      get[Int]("category") ~
      get[Int]("sub_category") ~
      get[Option[String]]("members_involved") ~
      get[Option[String]]("action_plan") ~
      get[Int]("priority") ~
      get[Date]("issue_date") ~
      get[Option[Int]]("user_id") ~
      get[Option[Date]]("closure_date") ~
      get[Option[Date]]("planned_end_date") ~
      get[Option[Date]]("actual_end_date") ~
      get[Option[Date]]("creation_date") ~
      get[Option[Date]]("updation_date") ~
      get[Option[Int]]("issue_status") ~
      get[Option[Int]]("is_active") map {
        case id ~ parent_id ~ parent_type ~ title ~ description ~ category ~ sub_category ~ members_involved ~ action_plan ~
          priority ~ issue_date ~ user_id ~ closure_date ~ planned_end_date ~ actual_end_date ~ creation_date
          ~ updation_date ~ issue_status ~ is_active =>
          RiskManagementIssue(id, parent_id, parent_type, title, description, category, sub_category, members_involved,
            action_plan, priority, issue_date, user_id, closure_date, planned_end_date, actual_end_date, creation_date,
            updation_date, issue_status, is_active)
      }
  }
}

case class RiskManagementMaster(id: Option[Int], parent_id: Option[Int], parent_type: Option[Int], name: String, cause: String,
  event: String, imapct: String, risk_category: Int, variable_imapact: String,
  probablity_of_occurence: Int, quantification: Int, strategic_reply: Int, responsible: Int,
  reply_action: Option[String], configuration_plan: Option[String],
  document_category: Option[String], risk_clouser_date: Date, user_id: Option[Int], creation_date: Option[Date], updation_date: Option[Date], risk_state: Int, sub_category: Int)

object RiskManagementMaster extends CustomColumns {

  val riskManagementMaster = {
    get[Option[Int]]("id") ~
      get[Option[Int]]("parent_id") ~
      get[Option[Int]]("parent_type") ~
      get[String]("name") ~
      get[String]("cause") ~
      get[String]("event") ~
      get[String]("imapct") ~
      get[Int]("risk_category") ~
      get[String]("variable_imapact") ~
      get[Int]("probablity_of_occurence") ~
      get[Int]("quantification") ~
      get[Int]("strategic_reply") ~
      get[Int]("responsible") ~
      get[Option[String]]("reply_action") ~
      get[Option[String]]("configuration_plan") ~
      get[Option[String]]("document_category") ~
      get[Date]("risk_clouser_date") ~
      get[Option[Int]]("user_id") ~
      get[Option[Date]]("creation_date") ~
      get[Option[Date]]("updation_date") ~
      get[Int]("risk_state") ~
      get[Int]("sub_category") map {
        case id ~ parent_id ~ parent_type ~ name ~ cause ~ event ~ imapct ~ risk_category ~ variable_imapact ~ probablity_of_occurence ~ quantification ~ strategic_reply ~ responsible
          ~ reply_action ~ configuration_plan ~ document_category ~ risk_clouser_date ~ user_id ~ creation_date ~ updation_date ~ risk_state ~ sub_category =>
          RiskManagementMaster(id, parent_id, parent_type, name, cause, event, imapct, risk_category, variable_imapact, probablity_of_occurence, quantification, strategic_reply, responsible,
            reply_action, configuration_plan, document_category, risk_clouser_date, user_id, creation_date, updation_date, risk_state, sub_category)
      }
  }
}

/*
case class RiskManagementIncreased(id: Option[Int], parent_id: Option[Int], parent_type: Option[Int], name: String, cause: String,
  event: String, imapct: String, risk_category: Int, variable_imapact: String,
  probablity_of_occurence: Int, quantification: Int, strategic_reply: Int, responsible: Int,
  reply_action: Option[String], configuration_plan: Option[String],
  document_category: Option[String], risk_clouser_date: Date, user_id: Option[Int], creation_date: Option[Date], updation_date: Option[Date],
  is_active: Option[Int], sub_category: Int, level: String, title: String, program_name: String)

object RiskManagementIncreased extends CustomColumns {

  val riskManagementIncreased = {
    get[Option[Int]]("id") ~
      get[Option[Int]]("parent_id") ~
      get[Option[Int]]("parent_type") ~
      get[String]("name") ~
      get[String]("cause") ~
      get[String]("event") ~
      get[String]("imapct") ~
      get[Int]("risk_category") ~
      get[String]("variable_imapact") ~
      get[Int]("probablity_of_occurence") ~
      get[Int]("quantification") ~
      get[Int]("strategic_reply") ~
      get[Int]("responsible") ~
      get[Option[String]]("reply_action") ~
      get[Option[String]]("configuration_plan") ~
      get[Option[String]]("document_category") ~
      get[Date]("risk_clouser_date") ~
      get[Option[Int]]("user_id") ~
      get[Option[Date]]("creation_date") ~
      get[Option[Date]]("updation_date") ~
      get[Option[Int]]("is_active") ~
      get[Int]("sub_category") ~ get[String]("level") ~ get[String]("title") ~ get[String]("program_name") map {
        case id ~ parent_id ~ parent_type ~ name ~ cause ~ event ~ imapct ~ risk_category ~ variable_imapact ~ probablity_of_occurence ~ quantification ~ strategic_reply ~ responsible
          ~ reply_action ~ configuration_plan ~ document_category ~ risk_clouser_date ~ user_id ~ 
          creation_date ~ updation_date ~ is_active ~ sub_category ~ level ~ title ~ program_name=>
          RiskManagementIncreased(id, parent_id, parent_type, name, cause, event, imapct, risk_category, variable_imapact, probablity_of_occurence, quantification, strategic_reply, responsible,
            reply_action, configuration_plan, document_category, risk_clouser_date,
            user_id, creation_date, updation_date, is_active, sub_category,level,title,program_name)
      }
  }
}
*/

case class RiskManagementIssueMain(id: Option[Int], parent_id: Option[Int], parent_type: Option[Int],
  title: String, description: String,
  category: Int, sub_category: Int, members_involved: Option[String], action_plan: Option[String],
  priority: Int, user_id: Option[Int], issue_status: Option[Int], is_active: Option[Int],
  riskManagementIssueDate: RiskManagementIssueDate)

object RiskManagementIssueObj extends CustomColumns {

}

case class RiskManagementIssueDate(issue_date: Date, closure_date: Option[Date],
  planned_end_date: Option[Date], actual_end_date: Option[Date], creation_date: Option[Date],
  updation_date: Option[Date])

object RiskManagementIssueDate extends CustomColumns {

}

object riskParentType extends Enumeration {
  type riskParentTypeValues = Value
  val Program, Project, Task, SubTask,TimeSheet = Value
}

object riskCategory1 extends Enumeration {
  type riskCategoryValues = Value
  val Strategic, Operational, Financial, Complience = Value
}

object variableImpact extends Enumeration {
  type variableImpactValues = Value
  val Scope, Cost, Timeline, Complience = Value
}

object probablityOfOccurence extends Enumeration {
  type probablityOfOccurenceValues = Value
  val Alto, Mediano, Bajo = Value
}

object quantificationImpact extends Enumeration {
  type quantificationImpactValues = Value
  val Alto, Mediano, Bajo = Value
}

object strategicReply extends Enumeration {
  type strategicReplyValues = Value
  val Acceptar, Mitgar, Evitar, Transerir = Value
}
/*
object riskState extends Enumeration {
  type riskStateValues = Value
  val Latent, Mitigado, Materialazado = Value
}
*/
