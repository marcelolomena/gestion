package models
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date

import anorm.{~, _}
import play.api.db.DB
import play.api.data.format.Formats._
import play.api.data.Form
import play.api.data.Forms._
import play.api.data._
import play.api.libs.json.Json

case class ProgramSearch(
    //delay_level: Option[String],
    //project_classification: Option[String],
    work_flow_status: Option[String],
    program_name: Option[String],
    program_code: Option[String], //agregado
    sap_code: Option[String], //agregado    
    program_type: Option[String],
    program_sub_type: Option[String],
    division: Option[String],
    program_role: Option[String],
    item_budget: Option[String],
    sort_type: Option[String],
    impact_type: Option[String])

case class ProgramMaster(
program_id: Option[Int], 
program_type: Int, 
program_sub_type: Option[Int],
  program_name: String,
  program_code: Long,
  internal_number:Option[Int],
  pLevel: Option[String],
  sap_code: Option [Long], 
  program_description: Option[String],
  work_flow_status: Integer, 
  demand_manager: Integer, 
  program_manager: Integer,
  completion_percentage: Option[Double], 
  is_active: Option[Int], 
  planned_hours: Option[Long],
  internal_state: String, 
  estimated_cost: Option[Long],
  clasificacion: Option[String]
                        )

case class ProgramResult(
      program_id:Option[Int],
      program_type:Option[Int],
      program_name:String,
      devison:Option[Int])

object ProgramSearch {
  val programSearch = {
    //get[Option[String]]("delay_level") ~
      //get[Option[String]]("project_classification") ~
      get[Option[String]]("work_flow_status") ~
      get[Option[String]]("program_name") ~ //agregado
      get[Option[String]]("program_code") ~ //agregado
      get[Option[String]]("sap_code") ~ //agregado     
      get[Option[String]]("program_type") ~
      get[Option[String]]("program_sub_type") ~
      get[Option[String]]("division") ~
      get[Option[String]]("program_role") ~
      get[Option[String]]("item_budget") ~
      get[Option[String]]("sort_type") ~
      get[Option[String]]("impact_type") map {
        //case /*delay_level ~ project_classification*/work_flow_status ~ program_name ~ program_type ~ program_sub_type ~ division ~ program_role ~ item_budget ~ sort_type ~ impact_type => ProgramSearch(/*delay_level, project_classification, */work_flow_status,program_name,program_type, program_sub_type, division, program_role, item_budget, sort_type,impact_type)
         case /*delay_level ~ project_classification*/work_flow_status ~ program_name ~ program_code ~ sap_code ~ program_type ~ program_sub_type ~ division ~ program_role ~ item_budget ~ sort_type ~ impact_type => ProgramSearch(/*delay_level, project_classification, */work_flow_status,program_name,program_code,sap_code,program_type, program_sub_type, division, program_role, item_budget, sort_type,impact_type) //cambio
       
      }
  }
}

object ProgramResult extends CustomColumns  {
  val programResult = {
      get[Option[Int]]("program_id") ~
      get[Option[Int]]("program_type") ~
      get[String]("program_name") ~
      get[Option[Int]]("devison")  map {
      case program_id ~
        program_type ~
        program_name ~
        devison =>
        ProgramResult(program_id, program_type,program_name, devison)
    }
  }
}

object ProgramMaster extends CustomColumns {

  val pMaster = {
    get[Option[Int]]("program_id") ~
      get[Int]("program_type") ~
      get[Option[Int]]("program_sub_type") ~
      get[String]("program_name") ~
      get[Long]("program_code") ~
      get[Option[Int]]("internal_number") ~
      get[Option[String]]("pLevel") ~
      get[Option[Long]]("sap_code") ~
      get[Option[String]]("program_description") ~
      get[Int]("work_flow_status") ~
      get[Int]("demand_manager") ~
      get[Int]("program_manager") ~
      get[Option[Double]]("completion_percentage") ~
      get[Option[Int]]("is_active") ~
      get[Option[Long]]("planned_hours") ~
      get[String]("internal_state") ~
      get[Option[Long]]("estimated_cost")  ~
      get[Option[String]]("clasificacion") map {
              case program_id ~
                program_type ~
                program_sub_type ~
                program_name ~
                program_code ~
                internal_number ~
                pLevel ~
                sap_code ~
                program_description ~
                work_flow_status ~
                demand_manager ~
                program_manager ~
                completion_percentage ~
                is_active ~
                planned_hours ~
                internal_state ~
                estimated_cost ~
                clasificacion =>
            ProgramMaster(
              program_id,
              program_type,
              program_sub_type,
              program_name,
              program_code,
              internal_number,
              pLevel,
              sap_code,
              program_description,
              work_flow_status,
              demand_manager,
              program_manager,
              completion_percentage,
              is_active,
              planned_hours,
              internal_state,
              estimated_cost,
              clasificacion)
      }
  }
}

case class ProgramDetails(
       program_id: Int,
       devison: Int,
       management: Option[Int],
       department: Option[Int],
       impact_type: Int,
       business_line: Option[String],
       sap_code: Option[Int])

object ProgramDetails {

  val pDetails = {
    get[Int]("program_id") ~
      get[Int]("devison") ~
      get[Option[Int]]("management") ~
      get[Option[Int]]("department") ~
      get[Int]("impact_type") ~
      get[Option[String]]("business_line") ~
      get[Option[Int]]("sap_code") map {
        case program_id ~
          devison ~
          management ~
          department ~
          impact_type ~
          business_line ~
          sap_code =>
          ProgramDetails(
            program_id,
            devison,
            management,
            department,
            impact_type,
            business_line,
            sap_code)

      }
  }
}

case class ProgramDates(program_id: Int, creation_date: Date, initiation_planned_date: Date,
  closure_date: Option[Date], release_date: Date)

object ProgramDates {

  val pDates = {
    get[Int]("program_id") ~ get[Date]("creation_date") ~ get[Date]("initiation_planned_date") ~
      get[Option[Date]]("closure_date") ~ get[Date]("release_date") map {
        case program_id ~ creation_date ~ initiation_planned_date ~ closure_date ~ release_date =>
          ProgramDates(program_id, creation_date, initiation_planned_date, closure_date, release_date)
      }
  }
}

case class Program_Members_Master(program_id: Int, demand_manager: Option[Int], program_manager: Option[Int], process_engineer: Option[Int],
  quality_manager: Option[Int], release_manager: Option[Int], envirement_manager: Option[Int], developer_leader: Option[Int],
  pmo: Option[Int], production_manager: Option[Int], sponsor: Option[Int], software_architect: Option[Int], user_leader: Option[Int])

object Program_Members_Master {

  val pmDetails = {
    get[Int]("program_id") ~ get[Option[Int]]("demand_manager") ~ get[Option[Int]]("program_manager") ~ get[Option[Int]]("process_engineer") ~
      get[Option[Int]]("quality_manager") ~ get[Option[Int]]("release_manager") ~ get[Option[Int]]("envirement_manager") ~
      get[Option[Int]]("developer_leader") ~ get[Option[Int]]("pmo") ~ get[Option[Int]]("production_manager") ~
      get[Option[Int]]("sponsor") ~ get[Option[Int]]("software_architect") ~ get[Option[Int]]("user_leader") map {
        case program_id ~ demand_manager ~ program_manager ~ process_engineer ~ quality_manager ~ release_manager ~
          envirement_manager ~ developer_leader ~ pmo ~ production_manager ~ sponsor ~ software_architect ~ user_leader =>
          Program_Members_Master(program_id, demand_manager, program_manager, process_engineer, quality_manager, release_manager,
            envirement_manager, developer_leader, pmo, production_manager, sponsor, software_architect, user_leader)

      }
  }

}

case class Program_Master(program_id: Option[Int], program_type: Int, program_sub_type: Option[Int], program_name: String,
  program_code: Int, program_description: Option[String], work_flow_status: Option[Int], strategic_focus: Option[Int],
  devison: Int, management: Option[Int], department: Option[Int], business_line: Option[String], creation_date: Date,
  initiation_planned_date: Option[Date], closure_date: Option[Date], release_date: Option[Date])

object Program_Master {

  val program = {
    get[Option[Int]]("program_id") ~ get[Int]("program_type") ~ get[Option[Int]]("program_sub_type") ~ get[String]("program_name") ~
      get[Int]("program_code") ~ get[Option[String]]("program_description") ~ get[Option[Int]]("work_flow_status") ~
      get[Option[Int]]("strategic_focus") ~ get[Int]("devison") ~ get[Option[Int]]("management") ~ get[Option[Int]]("department") ~
      get[Option[String]]("business_line") ~ get[Date]("creation_date") ~
      get[Option[Date]]("initiation_planned_date") ~ get[Option[Date]]("closure_date") ~ get[Option[Date]]("release_date") map {
        case program_id ~ program_type ~ program_sub_type ~ program_name ~ program_code ~ program_description ~ work_flow_status ~
          strategic_focus ~ devison ~ management ~ department ~ business_line ~ creation_date ~ initiation_planned_date ~
          closure_date ~ release_date =>
          Program_Master(program_id, program_type, program_sub_type, program_name, program_code, program_description, work_flow_status,
            strategic_focus, devison, management, department, business_line, creation_date, initiation_planned_date,
            closure_date, release_date)
      }
  }

}

case class ProgramMembersOld(id: Option[Int], program_id: Int, role_id: Int, member_id: Int, is_active: Int)

object ProgramMembersOld {

  val program_members_old = {
    get[Option[Int]]("id") ~ get[Int]("program_id") ~ get[Int]("role_id") ~ get[Int]("member_id") ~
      get[Int]("is_active")  map {
        case id ~ program_id ~ role_id ~ member_id ~ is_active =>
          ProgramMembersOld(id, program_id, role_id, member_id, is_active)
      }
  }
}

case class ProgramMembers(id: Option[Int], program_id: Int, role_id: Int, member_id: Int, is_active: Int, pData : String)

object ProgramMembers {

  val program_members = {
    get[Option[Int]]("id") ~ get[Int]("program_id") ~ get[Int]("role_id") ~ get[Int]("member_id") ~
      get[Int]("is_active") ~ get[String]("pData") map {
        case id ~ program_id ~ role_id ~ member_id ~ is_active  ~ pData =>
          ProgramMembers(id, program_id, role_id, member_id, is_active, pData)
      }
  }
}

case class ProgramInternalMembers(id: Option[Int], program_id: Int, role_id: Int, member_id: Int, is_active: Int,estimated_time : Double,hours : Double,diferencia : Double)

object ProgramInternalMembers {

  val program_internal_members = {
    get[Option[Int]]("id") ~ get[Int]("program_id") ~ get[Int]("role_id") ~ get[Int]("member_id") ~
      get[Int]("is_active") ~ get[Double]("estimated_time") ~ get[Double]("hours") ~ get[Double]("diferencia") map {
        case id ~ program_id ~ role_id ~ member_id ~ is_active ~ estimated_time ~ hours ~ diferencia=>
          ProgramInternalMembers(id, program_id, role_id, member_id, is_active,estimated_time,hours,diferencia)
      }
  }
}

case class DistributionTimeSheet(task_for_date : Date, hours : Double)

object DistributionTimeSheet {

  val disTime = {
    get[Date]("task_for_date") ~ get[Double]("hours")  map {
        case task_for_date ~ hours =>
          DistributionTimeSheet(task_for_date, hours)
      }
  }
  implicit val disWrites = Json.writes[DistributionTimeSheet]
}


case class SAP(id: Int, program_id: Int, sap_number: Int, budget_type: Int, cui1: String, cui1_per: Double, cui2: String, cui2_per: Double,
  is_active: Int, creation_date: Option[Date], last_update: Option[Date], planned_hours: Option[Double], approved_date: Option[Date], comitted_date: Option[Date],close_date: Option[Date])

object SAP extends CustomColumns {

  val sap = {
    get[Int]("id") ~
      get[Int]("program_id") ~
      get[Int]("sap_number") ~
      get[Int]("budget_type") ~
      get[String]("cui1") ~
      get[Double]("cui1_per") ~
      get[String]("cui2") ~
      get[Double]("cui2_per") ~
      get[Int]("is_active") ~
      get[Option[Date]]("creation_date") ~
      get[Option[Date]]("last_update") ~
      get[Option[Double]]("planned_hours") ~
      get[Option[Date]]("approved_date") ~
      get[Option[Date]]("comitted_date") ~
      get[Option[Date]]("close_date")map {
        case id ~ program_id ~ sap_number ~ budget_type ~ cui1 ~ cui1_per ~ cui2 ~ cui2_per ~ is_active ~ creation_date ~ last_update ~ planned_hours ~ approved_date ~ comitted_date ~ close_date =>
          SAP(id, program_id, sap_number, budget_type, cui1, cui1_per, cui2, cui2_per, is_active, creation_date, last_update, planned_hours, approved_date, comitted_date, close_date)

      }
  }

}

case class SAPMaster(program_id: Int, sap_number: Int, budget_type: Int, cui1: String, cui1_per: Double, cui2: String, cui2_per: Double,
  investment: Investment, expenditure: Expenditure, is_active: Int, creation_date: Option[Date], last_update: Option[Date], planned_hours: Option[Double], approved_date: Option[Date], comitted_date: Option[Date], close_date: Option[Date])

object SAPMaster extends CustomColumns {

  /*val sap_master = {
		get[Int]("program_id") ~ get[String]("sap_number") ~ get[Int]("budget_type") ~ get[Double]("cui1") ~ get[Double]("cui1_per") ~
			get[Double]("cui2") ~ get[Double]("cui2_per") ~ get[Investment]("investment") ~ get[Expenditure]("expenditure") ~
			get[Int]("is_active") ~ get[Option[Date]]("creation_date") ~ get[Option[Date]]("last_update") map {
				case program_id ~ sap_number ~ budget_type ~ cui1 ~ cui1_per ~ cui2 ~ cui2_per ~ investment ~ expenditure ~ is_active ~ creation_date ~ last_update =>
					SAPMaster(program_id, sap_number, budget_type, cui1, cui1_per, cui2, cui2_per, investment, expenditure, is_active, creation_date, last_update)

			}
	}*/

}

case class ExpenseDetails(sap_id: Int, expense_type: Int, hardware: Option[Long], software: Option[Long], telecommunication: Option[Long],
  development: Option[Long], other: Option[Long], qa: Option[Long],
  improvements: Option[Long], recurring_first: Option[Long])

object ExpenseDetails extends CustomColumns {

  val sap_data = {
    get[Int]("sap_id") ~ get[Int]("expense_type") ~
      get[Option[Long]]("hardware") ~
      get[Option[Long]]("software") ~
      get[Option[Long]]("telecommunication") ~
      get[Option[Long]]("development") ~
      get[Option[Long]]("other") ~
      get[Option[Long]]("qa") ~
      get[Option[Long]]("improvements") ~
      get[Option[Long]]("recurring_first") map {
        case sap_id ~ expense_type ~ hardware ~ software ~
          telecommunication ~ development ~ other ~ qa ~ improvements ~ recurring_first =>
          ExpenseDetails(sap_id, expense_type, hardware, software, telecommunication, development, other, qa, improvements, recurring_first)

      }
  }
}
/**
 * Program Status
 */

case class ProgramStatus(id: Option[Int], program_id: Int, status_for_date: Date, reason_for_change: String, status: Int)

object ProgramStatus {

  val pStatus = {
    get[Option[Int]]("id") ~ get[Int]("program_id") ~ get[Date]("status_for_date") ~ get[String]("reason_for_change") ~
      get[Int]("status") map {
        case id ~ program_id ~ status_for_date ~ reason_for_change ~ status =>
          ProgramStatus(id, program_id, status_for_date, reason_for_change, status)
      }
  }
  implicit val statusWrites = Json.writes[ProgramStatus]
}

case class Programs(
                     program_id: Option[Int],
                     program_type: Int,
                     program_sub_type: Option[Int],
                     program_name: String,
                     program_code: Long,
                     internal_number: Option[Int],
                     pLevel: Option[String],
                     program_description: Option[String],
                     work_flow_status: Integer,
                     demand_manager: Integer,
                     clasificacion:Option[String],
                     program_manager: Integer,
                     program_details: ProgramDetail,
                     program_dates: ProgramDate,
                     is_active: Option[Int],
                     planned_hours: Option[Long],
                     internal_state:String,
                     estimated_cost: Option[Long]
                   )

object Programs {

}

case class ProgramDetail(devison: Int, management: Option[Int], department: Option[Int], impact_type: Int,
  business_line: Option[String], sap_code: Option[Int])

object ProgramDetail {

}
case class ProgramDate(initiation_planned_date: Date, creation_date: Date, closure_date: Date, release_date: Date)

object ProgramDate {

}

case class Investment(investment_hardware: Option[Long], investment_software: Option[Long], investment_telecommunication: Option[Long],
  investment_development: Option[Long], investment_other: Option[Long], investment_qa: Option[Long],
  investment_improvements: Option[Long], investment_recurring_first: Option[Long])

object Investment extends CustomColumns {

}

case class Expenditure(expenditure_hardware: Option[Long], expenditure_software: Option[Long], expenditure_telecommunication: Option[Long],
  expenditure_development: Option[Long], expenditure_other: Option[Long], expenditure_qa: Option[Long],
  expenditure_improvements: Option[Long], expenditure_recurring_first: Option[Long])

object Expenditure extends CustomColumns {

}

case class ProgramCodes(id: Option[Int], program_code: Long, creation_date: Date)

object ProgramCodes {

  val program_code = {
    get[Option[Int]]("id") ~ get[Long]("program_code") ~ get[Date]("creation_date") map {
      case id ~ program_code ~ creation_date =>
        ProgramCodes(id, program_code, creation_date)
    }
  }
}

case class ListStatus(id: Option[Int], nid: Int, status_for_date: Date,reason_for_change: String,status: Int, level: String)

object ListStatus extends CustomColumns  {

  val lstatus = {
    get[Option[Int]]("id") ~ get[Int]("nid") ~ get[Date]("status_for_date") ~
    get[String]("reason_for_change")~ get[Int]("status") ~ get[String]("level") map {
      case id ~ nid ~ status_for_date ~ reason_for_change ~ status ~ level =>
        ListStatus(id, nid, status_for_date, reason_for_change,status,level)
    }
  }
}

case class ProgramHours(program_id: Option[Int], planned_hours: Option[Long], estimated_cost: Option[Long])

object ProgramHours {

  val planned_hours = {
    get[Option[Int]]("program_id") ~ get[Option[Long]]("planned_hours") ~ get[Option[Long]]("estimated_cost") map {
      case program_id ~ planned_hours ~ estimated_cost =>
        ProgramHours(program_id, planned_hours, estimated_cost)

    }
  }

}

case class SAPMasterEdit(program_id: Int, sap_number: Int, budget_type: Int, cui1: String, cui1_per: Double, cui2: String, cui2_per: Double,
  investment: Investment, expenditure: Expenditure, paid_investment: PaidInvestment, paid_expenditure: PaidExpenditure,
  commited_investment: CommittedInvestment, commited_expenditure: CommittedExpenditure,
  is_active: Int, creation_date: Option[Date], last_update: Option[Date], planned_hours: Option[Double])

object SAPMasterEdit extends CustomColumns {

  /*val sap_master = {
    get[Int]("program_id") ~ get[String]("sap_number") ~ get[Int]("budget_type") ~ get[Double]("cui1") ~ get[Double]("cui1_per") ~
      get[Double]("cui2") ~ get[Double]("cui2_per") ~ get[Investment]("investment") ~ get[Expenditure]("expenditure") ~
      get[Int]("is_active") ~ get[Option[Date]]("creation_date") ~ get[Option[Date]]("last_update") map {
        case program_id ~ sap_number ~ budget_type ~ cui1 ~ cui1_per ~ cui2 ~ cui2_per ~ investment ~ expenditure ~ is_active ~ creation_date ~ last_update =>
          SAPMaster(program_id, sap_number, budget_type, cui1, cui1_per, cui2, cui2_per, investment, expenditure, is_active, creation_date, last_update)

      }
  }*/

}

case class HardwareSAP(sap_id: Int,
  paid_investment_hardware: Option[Long], paid_expenditure_hardware: Option[Long],
  committed_investment_hardware: Option[Long], committed_expenditure_hardware: Option[Long],
  non_committed_investment_hardware: Option[Long], non_committed_expenditure_hardware: Option[Long],
  available_investment_hardware: Option[Long], available_expenditure_hardware: Option[Long])

object HardwareSAP extends CustomColumns {

  val hardware = {
    get[Int]("sap_id") ~
      get[Option[Long]]("paid_investment_hardware") ~
      get[Option[Long]]("paid_expenditure_hardware") ~
      get[Option[Long]]("committed_investment_hardware") ~
      get[Option[Long]]("committed_expenditure_hardware") ~
      get[Option[Long]]("non_committed_investment_hardware") ~
      get[Option[Long]]("non_committed_expenditure_hardware") ~
      get[Option[Long]]("available_investment_hardware") ~
      get[Option[Long]]("available_expenditure_hardware") map {
        case sap_id ~ paid_investment_hardware ~ paid_expenditure_hardware ~
          committed_investment_hardware ~ committed_expenditure_hardware ~
          non_committed_investment_hardware ~ non_committed_expenditure_hardware ~
          available_investment_hardware ~ available_expenditure_hardware =>
          HardwareSAP(sap_id, paid_investment_hardware, paid_expenditure_hardware,
            committed_investment_hardware, committed_expenditure_hardware,
            non_committed_investment_hardware, non_committed_expenditure_hardware,
            available_investment_hardware, available_expenditure_hardware)

      }
  }

}

case class SoftwareSAP(sap_id: Int,
  paid_investment_software: Option[Long], paid_expenditure_software: Option[Long],
  committed_investment_software: Option[Long], committed_expenditure_software: Option[Long],
  non_committed_investment_software: Option[Long], non_committed_expenditure_software: Option[Long],
  available_investment_software: Option[Long], available_expenditure_software: Option[Long])

object SoftwareSAP extends CustomColumns {

  val software = {
    get[Int]("sap_id") ~
      get[Option[Long]]("paid_investment_software") ~
      get[Option[Long]]("paid_expenditure_software") ~
      get[Option[Long]]("committed_investment_software") ~
      get[Option[Long]]("committed_expenditure_software") ~
      get[Option[Long]]("non_committed_investment_software") ~
      get[Option[Long]]("non_committed_expenditure_software") ~
      get[Option[Long]]("available_investment_software") ~
      get[Option[Long]]("available_expenditure_software") map {
        case sap_id ~ paid_investment_software ~ paid_expenditure_software ~
          committed_investment_software ~ committed_expenditure_software ~
          non_committed_investment_software ~ non_committed_expenditure_software ~
          available_investment_software ~ available_expenditure_software =>
          SoftwareSAP(sap_id, paid_investment_software, paid_expenditure_software,
            committed_investment_software, committed_expenditure_software,
            non_committed_investment_software, non_committed_expenditure_software,
            available_investment_software, available_expenditure_software)

      }
  }

}

case class TelecommunicationSAP(sap_id: Int,
  paid_investment_telecommunication: Option[Long], paid_expenditure_telecommunication: Option[Long],
  committed_investment_telecommunication: Option[Long], committed_expenditure_telecommunication: Option[Long],
  non_committed_investment_telecommunication: Option[Long], non_committed_expenditure_telecommunication: Option[Long],
  available_investment_telecommunication: Option[Long], available_expenditure_telecommunication: Option[Long])

object TelecommunicationSAP extends CustomColumns {

  val telecommunication = {
    get[Int]("sap_id") ~
      get[Option[Long]]("paid_investment_telecommunication") ~
      get[Option[Long]]("paid_expenditure_telecommunication") ~
      get[Option[Long]]("committed_investment_telecommunication") ~
      get[Option[Long]]("committed_expenditure_telecommunication") ~
      get[Option[Long]]("non_committed_investment_telecommunication") ~
      get[Option[Long]]("non_committed_expenditure_telecommunication") ~
      get[Option[Long]]("available_investment_telecommunication") ~
      get[Option[Long]]("available_expenditure_telecommunication") map {
        case sap_id ~ paid_investment_telecommunication ~ paid_expenditure_telecommunication ~
          committed_investment_telecommunication ~ committed_expenditure_telecommunication ~
          non_committed_investment_telecommunication ~ non_committed_expenditure_telecommunication ~
          available_investment_telecommunication ~ available_expenditure_telecommunication =>
          TelecommunicationSAP(sap_id, paid_investment_telecommunication, paid_expenditure_telecommunication,
            committed_investment_telecommunication, committed_expenditure_telecommunication,
            non_committed_investment_telecommunication, non_committed_expenditure_telecommunication,
            available_investment_telecommunication, available_expenditure_telecommunication)

      }
  }

}

case class DevelopemntSAP(sap_id: Int,
  paid_investment_development: Option[Long], paid_expenditure_development: Option[Long],
  committed_investment_development: Option[Long], committed_expenditure_development: Option[Long],
  non_committed_investment_development: Option[Long], non_committed_expenditure_development: Option[Long],
  available_investment_development: Option[Long], available_expenditure_development: Option[Long])

object DevelopemntSAP extends CustomColumns {

  val development = {
    get[Int]("sap_id") ~
      get[Option[Long]]("paid_investment_development") ~
      get[Option[Long]]("paid_expenditure_development") ~
      get[Option[Long]]("committed_investment_development") ~
      get[Option[Long]]("committed_expenditure_development") ~
      get[Option[Long]]("non_committed_investment_development") ~
      get[Option[Long]]("non_committed_expenditure_development") ~
      get[Option[Long]]("available_investment_development") ~
      get[Option[Long]]("available_expenditure_development") map {
        case sap_id ~ paid_investment_development ~ paid_expenditure_development ~
          committed_investment_development ~ committed_expenditure_development ~
          non_committed_investment_development ~ non_committed_expenditure_development ~
          available_investment_development ~ available_expenditure_development =>
          DevelopemntSAP(sap_id, paid_investment_development, paid_expenditure_development,
            committed_investment_development, committed_expenditure_development,
            non_committed_investment_development, non_committed_expenditure_development,
            available_investment_development, available_expenditure_development)

      }
  }

}

case class QASAP(sap_id: Int,
  paid_investment_qa: Option[Long], paid_expenditure_qa: Option[Long],
  committed_investment_qa: Option[Long], committed_expenditure_qa: Option[Long],
  non_committed_investment_qa: Option[Long], non_committed_expenditure_qa: Option[Long],
  available_investment_qa: Option[Long], available_expenditure_qa: Option[Long])

object QASAP extends CustomColumns {

  val qa = {
    get[Int]("sap_id") ~
      get[Option[Long]]("paid_investment_qa") ~
      get[Option[Long]]("paid_expenditure_qa") ~
      get[Option[Long]]("committed_investment_qa") ~
      get[Option[Long]]("committed_expenditure_qa") ~
      get[Option[Long]]("non_committed_investment_qa") ~
      get[Option[Long]]("non_committed_expenditure_qa") ~
      get[Option[Long]]("available_investment_qa") ~
      get[Option[Long]]("available_expenditure_qa") map {
        case sap_id ~ paid_investment_qa ~ paid_expenditure_qa ~
          committed_investment_qa ~ committed_expenditure_qa ~
          non_committed_investment_qa ~ non_committed_expenditure_qa ~
          available_investment_qa ~ available_expenditure_qa =>
          QASAP(sap_id, paid_investment_qa, paid_expenditure_qa,
            committed_investment_qa, committed_expenditure_qa,
            non_committed_investment_qa, non_committed_expenditure_qa,
            available_investment_qa, available_expenditure_qa)

      }
  }

}

case class OtherSAP(sap_id: Int,
  paid_investment_other: Option[Long], paid_expenditure_other: Option[Long],
  committed_investment_other: Option[Long], committed_expenditure_other: Option[Long],
  non_committed_investment_other: Option[Long], non_committed_expenditure_other: Option[Long],
  available_investment_other: Option[Long], available_expenditure_other: Option[Long])

object OtherSAP extends CustomColumns {

  val other = {
    get[Int]("sap_id") ~
      get[Option[Long]]("paid_investment_other") ~
      get[Option[Long]]("paid_expenditure_other") ~
      get[Option[Long]]("committed_investment_other") ~
      get[Option[Long]]("committed_expenditure_other") ~
      get[Option[Long]]("non_committed_investment_other") ~
      get[Option[Long]]("non_committed_expenditure_other") ~
      get[Option[Long]]("available_investment_other") ~
      get[Option[Long]]("available_expenditure_other") map {
        case sap_id ~ paid_investment_other ~ paid_expenditure_other ~
          committed_investment_other ~ committed_expenditure_other ~
          non_committed_investment_other ~ non_committed_expenditure_other ~
          available_investment_other ~ available_expenditure_other =>
          OtherSAP(sap_id, paid_investment_other, paid_expenditure_other,
            committed_investment_other, committed_expenditure_other,
            non_committed_investment_other, non_committed_expenditure_other,
            available_investment_other, available_expenditure_other)

      }
  }

}

case class ImprovementsSAP(sap_id: Int,
  paid_investment_improvements: Option[Long], paid_expenditure_improvements: Option[Long],
  committed_investment_improvements: Option[Long], committed_expenditure_improvements: Option[Long],
  non_committed_investment_improvements: Option[Long], non_committed_expenditure_improvements: Option[Long],
  available_investment_improvements: Option[Long], available_expenditure_improvements: Option[Long])

object ImprovementsSAP extends CustomColumns {

  val improvements = {
    get[Int]("sap_id") ~
      get[Option[Long]]("paid_investment_improvements") ~
      get[Option[Long]]("paid_expenditure_improvements") ~
      get[Option[Long]]("committed_investment_improvements") ~
      get[Option[Long]]("committed_expenditure_improvements") ~
      get[Option[Long]]("non_committed_investment_improvements") ~
      get[Option[Long]]("non_committed_expenditure_improvements") ~
      get[Option[Long]]("available_investment_improvements") ~
      get[Option[Long]]("available_expenditure_improvements") map {
        case sap_id ~ paid_investment_improvements ~ paid_expenditure_improvements ~
          committed_investment_improvements ~ committed_expenditure_improvements ~
          non_committed_investment_improvements ~ non_committed_expenditure_improvements ~
          available_investment_improvements ~ available_expenditure_improvements =>
          ImprovementsSAP(sap_id, paid_investment_improvements, paid_expenditure_improvements,
            committed_investment_improvements, committed_expenditure_improvements,
            non_committed_investment_improvements, non_committed_expenditure_improvements,
            available_investment_improvements, available_expenditure_improvements)

      }
  }

}

case class RecurringSAP(sap_id: Int,
  paid_investment_recurring_first: Option[Long], paid_expenditure_recurring_first: Option[Long],
  committed_investment_recurring_first: Option[Long], committed_expenditure_recurring_first: Option[Long],
  non_committed_investment_recurring_first: Option[Long], non_committed_expenditure_recurring_first: Option[Long],
  available_investment_recurring_first: Option[Long], available_expenditure_recurring_first: Option[Long])

object RecurringSAP extends CustomColumns {

  val recurring_first = {
    get[Int]("sap_id") ~
      get[Option[Long]]("paid_investment_recurring_first") ~
      get[Option[Long]]("paid_expenditure_recurring_first") ~
      get[Option[Long]]("committed_investment_recurring_first") ~
      get[Option[Long]]("committed_expenditure_recurring_first") ~
      get[Option[Long]]("non_committed_investment_recurring_first") ~
      get[Option[Long]]("non_committed_expenditure_recurring_first") ~
      get[Option[Long]]("available_investment_recurring_first") ~
      get[Option[Long]]("available_expenditure_recurring_first") map {
        case sap_id ~ paid_investment_recurring_first ~ paid_expenditure_recurring_first ~
          committed_investment_recurring_first ~ committed_expenditure_recurring_first ~
          non_committed_investment_recurring_first ~ non_committed_expenditure_recurring_first ~
          available_investment_recurring_first ~ available_expenditure_recurring_first =>
          RecurringSAP(sap_id, paid_investment_recurring_first, paid_expenditure_recurring_first,
            committed_investment_recurring_first, committed_expenditure_recurring_first,
            non_committed_investment_recurring_first, non_committed_expenditure_recurring_first,
            available_investment_recurring_first, available_expenditure_recurring_first)

      }
  }

}

case class PaidInvestment(paid_investment_hardware: Option[Long], paid_investment_software: Option[Long], paid_investment_telecommunication: Option[Long],
  paid_investment_development: Option[Long], paid_investment_other: Option[Long], paid_investment_qa: Option[Long],
  paid_investment_improvements: Option[Long], paid_investment_recurring_first: Option[Long])

object PaidInvestment extends CustomColumns {

}

case class PaidExpenditure(paid_expenditure_hardware: Option[Long], paid_expenditure_software: Option[Long], paid_expenditure_telecommunication: Option[Long],
  paid_expenditure_development: Option[Long], paid_expenditure_other: Option[Long], paid_expenditure_qa: Option[Long],
  paid_expenditure_improvements: Option[Long], paid_expenditure_recurring_first: Option[Long])

object PaidExpenditure extends CustomColumns {

}

case class CommittedInvestment(committed_investment_hardware: Option[Long], committed_investment_software: Option[Long], committed_investment_telecommunication: Option[Long],
  committed_investment_development: Option[Long], committed_investment_other: Option[Long], committed_investment_qa: Option[Long],
  committed_investment_improvements: Option[Long], committed_investment_recurring_first: Option[Long])

object CommittedInvestment extends CustomColumns {

}

case class CommittedExpenditure(committed_expenditure_hardware: Option[Long], committed_expenditure_software: Option[Long], committed_expenditure_telecommunication: Option[Long],
  committed_expenditure_development: Option[Long], committed_expenditure_other: Option[Long], committed_expenditure_qa: Option[Long],
  committed_expenditure_improvements: Option[Long], committed_expenditure_recurring_first: Option[Long])

object CommittedExpenditure extends CustomColumns {

}

case class NonCommittedInvestment(non_committed_investment_hardware: Option[Long], non_committed_investment_software: Option[Long], non_committed_investment_telecommunication: Option[Long],
  non_committed_investment_development: Option[Long], non_committed_investment_other: Option[Long], non_committed_investment_qa: Option[Long],
  non_committed_investment_improvements: Option[Long], non_committed_investment_recurring_first: Option[Long])

object NonCommittedInvestment extends CustomColumns {

}

case class NonCommittedExpenditure(non_committed_expenditure_hardware: Option[Long], non_committed_expenditure_software: Option[Long], non_committed_expenditure_telecommunication: Option[Long],
  non_committed_expenditure_development: Option[Long], non_committed_expenditure_other: Option[Long], non_committed_expenditure_qa: Option[Long],
  non_committed_expenditure_improvements: Option[Long], non_committed_expenditure_recurring_first: Option[Long])

object NonCommittedExpenditure extends CustomColumns {

}

case class AvailableInvestment(available_investment_hardware: Option[Long], available_investment_software: Option[Long], available_investment_telecommunication: Option[Long],
  available_investment_development: Option[Long], available_investment_other: Option[Long], available_investment_qa: Option[Long],
  available_investment_improvements: Option[Long], available_investment_recurring_first: Option[Long])

object AvailableInvestment extends CustomColumns {

}

case class AvailableExpenditure(available_expenditure_hardware: Option[Long], available_expenditure_software: Option[Long], available_expenditure_telecommunication: Option[Long],
  available_expenditure_development: Option[Long], available_expenditure_other: Option[Long], available_expenditure_qa: Option[Long],
  available_expenditure_improvements: Option[Long], available_expenditure_recurring_first: Option[Long])

object AvailableExpenditure extends CustomColumns {

}

case class ProgramCombo(program_id: Option[Int], program_name: String)

object ProgramCombo {

  val pCombo = {
    get[Option[Int]]("program_id") ~ get[String]("program_name") map {
      case program_id ~ program_name =>
        ProgramCombo(program_id, program_name)

    }
  }
  implicit val ProgramComboWrites = Json.writes[ProgramCombo]

}

case class ProgramUserCapacity(program_name: String, porcentaje: Double)

object ProgramUserCapacity {

  val programUserCapacity = {
    get[String]("program_name") ~ get[Double]("porcentaje") map {
      case program_name ~ porcentaje =>
        ProgramUserCapacity(program_name, porcentaje)

    }
  }
  implicit val capacityWrites = Json.writes[ProgramUserCapacity]
}