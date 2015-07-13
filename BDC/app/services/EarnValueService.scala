package services;
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
import com.typesafe.plugin._
import java.util.Date
import java.text.DecimalFormat
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import scala.math.BigDecimal.double2bigDecimal
import scala.math.BigDecimal.int2bigDecimal
import org.apache.commons.lang3.StringUtils
import org.json.JSONObject
import anorm.SqlParser.scalar
import anorm.SQL
import anorm.sqlToSimple
import models.EarnValue
import models.MainEarnValue
import models.SPIValue
import models.SubTaskEV
import models.SubTaskEarnValue
import play.api.Play.current
import play.api.db.DB
import models.CustomColumns

object EarnValueService extends CustomColumns {

  def saveEarnValueCalcuations(ev: EarnValue): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          insert into art_erned_value( parent_type, parent_id, recorded_date, 
          erned_value, planned_value, actual_cost, completion_percentage, scheduled_varience,
           cost_varience, scheduled_perforamce_index, cost_performance_index, estimate_at_completion, 
           estimate_to_complete) values ({parent_type}, {parent_id}, {recorded_date}, 
          {erned_value}, {planned_value}, {actual_cost}, {completion_percentage}, {scheduled_varience},
           {cost_varience}, {scheduled_perforamce_index}, {cost_performance_index}, {estimate_at_completion}, 
           {estimate_to_complete})
          """).on(
          'parent_type -> ev.parent_type,
          'parent_id -> ev.parent_id,
          'recorded_date -> ev.recorded_date,
          'erned_value -> ev.erned_value,
          'planned_value -> ev.planned_value,
          'actual_cost -> ev.actual_cost,
          'completion_percentage -> ev.completion_percentage,
          'scheduled_varience -> ev.scheduled_varience,
          'cost_varience -> ev.cost_varience,
          'scheduled_perforamce_index -> ev.scheduled_perforamce_index,
          'cost_performance_index -> ev.cost_performance_index,
          'estimate_at_completion -> ev.estimate_at_completion,
          'estimate_to_complete -> ev.estimate_to_complete).executeUpdate()
    }
  }

  def saveProgramEarnValue(id: String) = {
    val todays = new Date().getTime()
    val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
    val currentDate = format.parse(format.format(todays))
    var programEV: BigDecimal = 0
    var programPV: BigDecimal = 0
    var programAC: BigDecimal = 0
    var programPR: BigDecimal = 0
    var programSV: BigDecimal = 0
    var programCV: BigDecimal = 0
    var programSPI: BigDecimal = 0
    var programCPI: BigDecimal = 0
    var programEAC: BigDecimal = 0
    var programETC: BigDecimal = 0

    val programDetail = ProgramService.findProgramDateDetailsById(id)
    if (!programDetail.isEmpty) {
      val projects = ProjectService.findProjectListForProgram(programDetail.get.program_id.toString)
      var finalEV: BigDecimal = 0
      var finalPV: BigDecimal = 0
      var finalAC: BigDecimal = 0
      var finalPR: BigDecimal = 0
      var finalSV: BigDecimal = 0
      var finalCV: BigDecimal = 0
      var finalSPI: BigDecimal = 0
      var finalCPI: BigDecimal = 0
      var finalEAC: BigDecimal = 0
      var finalETC: BigDecimal = 0
      var count = 0

      //  if (projects.size > 0) {

      for (p <- projects) {
        /*        finalEV = 0
        finalPV = 0
        finalAC = 0
        finalPR = 0
        finalSV = 0
        finalCV = 0
        finalSPI = 0
        finalCPI = 0
        finalEAC = 0
        finalETC = 0*/
        //  val projectDetails = ProjectService.findProject(p.pId.get)

        //  if (projectDetails.get.start_date.getTime() <= currentDate.getTime()) { //) && (projectDetails.get.final_release_date.getTime() >= currentDate.getTime())

        if (p.start_date.getTime() <= currentDate.getTime()) { //) && (projectDetails.get.final_release_date.getTime() >= currentDate.getTime())
          count += 1
          val tasks = TaskService.findTaskListByProjectId(p.pId.get.toString)
          var work: Double = 0
          var cPer: Double = 0
          var eval: Double = 0
          var avg: Double = 0
          var expectedWD: scala.math.BigDecimal = 0
          var bookedhours: BigDecimal = 0

          for (task <- tasks) {
            cPer = 0
            var bookedhours: BigDecimal = 0
            work = 0
            // val taskDetail = TaskService.findTaskDetailsByTaskId(task.tId.get)

            val sDate = task.plan_start_date
            val eDate = task.plan_end_date

            //  println((sDate.getTime() < refDate.getTime()) + " " + (eDate.getTime() > refDate.getTime()));

            if ((sDate.getTime() <= currentDate.getTime())) { // && (eDate.getTime() >= currentDate.getTime())
              val project = ProjectService.findProject(task.pId)

              if (!task.completion_percentage.isEmpty) {
                cPer = task.completion_percentage.get
              }
              var expectedWD = (cPer * task.plan_time) / 100

              val subTasks = TaskService.findSubTaskListByTaskId(task.tId.get.toString())
              /*         if (subTasks.size > 0) {*/
              for (t <- subTasks) {
                val sdate = t.plan_start_date.getTime()
                val edate = t.plan_end_date.getTime()
                if ((t.plan_start_date.getTime() <= currentDate.getTime())) { //&& (t.plan_end_date.getTime() >= currentDate.getTime())
                  val diff = (edate - sdate) / (1000 * 60 * 60 * 24) + 1
                  val todaysDiff = (edate - currentDate.getTime()) / (1000 * 60 * 60 * 24)
                  val tasks = services.SubTaskServices.findSubTasksAllocationBySubTask(t.sub_task_id.get.toString)

                  if (!t.completion_percentage.isEmpty && t.completion_percentage.get == 100) {
                    val tasks = services.SubTaskServices.findSubTasksAllocationBySubTask(t.sub_task_id.get.toString)
                    for (ss <- tasks) {
                      finalEV += ss.estimated_time
                    }
                  }

                  var eval: Double = 0
                  var avg: Double = 0
                  for (ss <- tasks) {
                    eval += ss.estimated_time;
                  }
                  if (diff > 0)
                    avg = eval / diff
                  else
                    avg = eval

                  if (todaysDiff > 0) {
                    val newVal = (diff - todaysDiff) * avg
                    work += newVal
                  } else {
                    val newVal = diff * avg
                    work += newVal
                  }

                  //println("for task - " + t.task + " avg work per day - " + avg + " total days - " + diff + " pending days - (" + todaysDiff + ") total work done till today- " + work);

                  if (TaskService.findBookedHoursForTask(task.tId.get.toString) > 0) {
                    bookedhours = TaskService.findBookedHoursForTask(task.tId.get.toString)
                  }

                }

              }

              //finalEV += expectedWD // old earn value calculation
              finalPV += work
              finalAC += bookedhours
              if (tasks.size > 0) {
                cPer = cPer / tasks.size
              } else {
                cPer = 0
              }
              finalPR += cPer

              /* }*/
            }

          }

        }
        programEV += finalEV
        programPV += finalPV
        programAC += finalAC
        programPR += finalPR

      }
      if (count != 0)
        programPR = programPR / count

      /**
       * Other calculations....
       */
      //SV = PV – EV 
      programSV = programPV - programEV
      //CV  = EV - AC
      programCV = programEV - programAC
      //SPI = EV/PV
      if (finalPV > 0) {
        programSPI = programEV / programPV
      } else {
        programSPI = 0
      }
      //CPI = EV/AC
      if (programAC > 0)
        programCPI = programEV / programAC
      else
        programCPI = 0

      //EAC = PV+AC-EV
      programEAC = programPV + programAC - programEV

      // ETC = PV - AC
      programETC = programPV - programAC

      //---
      /*val format = new DecimalFormat("0.00")
        node.put("PV", format.format(programPV))
        node.put("EV", format.format(programEV))
        node.put("AC", format.format(programAC))
        node.put("SV", format.format(programSV))
        node.put("CV", format.format(programCV))
        node.put("CPI", format.format(programCPI))
        node.put("cp", format.format(programPR))
        node.put("SPI", format.format(programSPI))
        node.put("EAC", format.format(programEAC))
        node.put("ETC", format.format(programETC))
        */
      val earnValueObject = EarnValue(Option(0), 0, Integer.parseInt(id), new Date(), Option(programEV.toDouble), Option(programPV.toDouble), Option(programAC.toDouble),
        Option(programPR.toDouble), Option(programSV.toDouble), Option(programCV.toDouble), Option(programSPI.toDouble), Option(programCPI.toDouble),
        Option(programEAC.toDouble), Option(programETC.toDouble))

      EarnValueService.saveEarnValueCalcuations(earnValueObject)

      // }

    }

  }

  def calculateProgramEarnValue(id: String) = {
    var node = new JSONObject()
    val todays = new Date().getTime()
    val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
    val currentDate = format.parse(format.format(todays))
    var programEV: BigDecimal = 0
    var programPV: BigDecimal = 0
    var programAC: BigDecimal = 0
    var programPR: BigDecimal = 0
    var programSV: BigDecimal = 0
    var programCV: BigDecimal = 0
    var programSPI: BigDecimal = 0
    var programCPI: BigDecimal = 0
    var programEAC: BigDecimal = 0
    var programETC: BigDecimal = 0

    val programDetail = ProgramService.findProgramDateDetailsById(id)
    /*    if (!programDetail.isEmpty) {*/
    val projects = ProjectService.findProjectListForProgram(programDetail.get.program_id.toString)
    var finalEV: BigDecimal = 0
    var finalPV: BigDecimal = 0
    var finalAC: BigDecimal = 0
    var finalPR: BigDecimal = 0
    var finalSV: BigDecimal = 0
    var finalCV: BigDecimal = 0
    var finalSPI: BigDecimal = 0
    var finalCPI: BigDecimal = 0
    var finalEAC: BigDecimal = 0
    var finalETC: BigDecimal = 0
    var count = 0

    if (projects.size > 0) {

      for (p <- projects) {
        /*          finalEV = 0
          finalPV = 0
          finalAC = 0
          finalPR = 0
          finalSV = 0
          finalCV = 0
          finalSPI = 0
          finalCPI = 0
          finalEAC = 0
          finalETC = 0*/
        // val projectDetails = ProjectService.findProject(p.pId.get)

        if (p.start_date.getTime() <= currentDate.getTime()) { //) && (projectDetails.get.final_release_date.getTime() >= currentDate.getTime())
          count += 1
          val tasks = TaskService.findTaskListByProjectId(p.pId.get.toString)
          var work: Double = 0
          var cPer: Double = 0
          var eval: Double = 0
          var avg: Double = 0
          var expectedWD: scala.math.BigDecimal = 0
          var bookedhours: BigDecimal = 0

          for (task <- tasks) {
            cPer = 0
            var bookedhours: BigDecimal = 0
            work = 0
            //  val taskDetail = TaskService.findTaskDetailsByTaskId(task.tId.get)

            val sDate = task.plan_start_date
            val eDate = task.plan_end_date

            //  println((sDate.getTime() < refDate.getTime()) + " " + (eDate.getTime() > refDate.getTime()));

            if ((sDate.getTime() <= currentDate.getTime())) { // && (eDate.getTime() >= currentDate.getTime())
              val project = ProjectService.findProject(task.pId)

              if (!task.completion_percentage.isEmpty) {
                cPer = task.completion_percentage.get
              }
              var expectedWD = (cPer * task.plan_time) / 100

              val subTasks = TaskService.findSubTaskListByTaskId(task.tId.get.toString())
              /* if (subTasks.size > 0) {*/
              for (t <- subTasks) {
                val sdate = t.plan_start_date.getTime()
                val edate = t.plan_end_date.getTime()
                if (!t.completion_percentage.isEmpty && t.completion_percentage.get == 100) {
                  val tasks = services.SubTaskServices.findSubTasksAllocationBySubTask(t.sub_task_id.get.toString)
                  for (ss <- tasks) {
                    finalEV += ss.estimated_time
                  }
                }

                if ((t.plan_start_date.getTime() <= currentDate.getTime())) { //&& (t.plan_end_date.getTime() >= currentDate.getTime())
                  val diff = (edate - sdate) / (1000 * 60 * 60 * 24) + 1
                  val todaysDiff = (edate - currentDate.getTime()) / (1000 * 60 * 60 * 24)
                  val tasks = services.SubTaskServices.findSubTasksAllocationBySubTask(t.sub_task_id.get.toString)
                  var eval: Double = 0
                  var avg: Double = 0
                  for (ss <- tasks) {
                    eval += ss.estimated_time;
                  }
                  if (diff > 0)
                    avg = eval / diff
                  else
                    avg = eval

                  if (todaysDiff > 0) {
                    val newVal = (diff - todaysDiff) * avg
                    work += newVal
                  } else {
                    val newVal = diff * avg
                    work += newVal
                  }

                  //println("for task - " + t.task + " avg work per day - " + avg + " total days - " + diff + " pending days - (" + todaysDiff + ") total work done till today- " + work);

                  if (TaskService.findBookedHoursForTask(task.tId.get.toString) > 0) {
                    bookedhours = TaskService.findBookedHoursForTask(task.tId.get.toString)
                  }

                }

              }

              // finalEV += expectedWD  //old earned value calculation method
              finalPV += work
              finalAC += bookedhours
              if (tasks.size > 0) {
                cPer = cPer / tasks.size
              } else {
                cPer = 0
              }
              finalPR += cPer

              /*}*/
            }

          }

        }
        programEV += finalEV
        programPV += finalPV
        programAC += finalAC
        programPR += finalPR

      }
      if (count != 0)
        programPR = programPR / count

      /**
       * Other calculations....
       */
      //SV = PV – EV 
      programSV = programPV - programEV
      //CV  = EV - AC
      programCV = programEV - programAC
      //SPI = EV/PV
      if (finalPV > 0) {
        programSPI = programEV / programPV
      } else {
        programSPI = 0
      }
      //CPI = EV/AC
      if (programAC > 0)
        programCPI = programEV / programAC
      else
        programCPI = 0

      //EAC = PV+AC-EV
      programEAC = programPV + programAC - programEV

      // ETC = PV - AC
      programETC = programPV - programAC

      //---
      val format = new DecimalFormat("0.00")
      node.put("PV", format.format(programPV))
      node.put("EV", format.format(programEV))
      node.put("AC", format.format(programAC))
      node.put("SV", format.format(programSV))
      node.put("CV", format.format(programCV))
      node.put("CPI", format.format(programCPI))
      node.put("cp", format.format(programPR))
      node.put("SPI", format.format(programSPI))
      node.put("EAC", format.format(programEAC))
      node.put("ETC", format.format(programETC))
    }
    node
  }

  def calculateProjectEarnValue(id: String) = {
    var node = new JSONObject()
    val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
    val projectDetails = ProjectService.findProject(Integer.parseInt(id))
    val d_format = new DecimalFormat("0.00")
    val ev = getProjectEV(id, format.format(new Date))
    if (!ev.isEmpty) {
      node.put("PV", d_format.format(ev.get.pv.getOrElse(0)))
      node.put("EV", d_format.format(ev.get.ev.getOrElse(0)))
      node.put("AC", d_format.format(ev.get.ac.getOrElse(0)))
      node.put("SV", d_format.format(ev.get.pv.get - ev.get.ev.get))
      node.put("CV", d_format.format(ev.get.ev.get - ev.get.ac.get))
      node.put("CPI", d_format.format(ev.get.cpi.getOrElse(0)))
      //node.put("cp", format.format(ev.get.c.get.toString()))
      node.put("SPI", d_format.format(ev.get.spi.getOrElse(0)))
      //PV  + AC – EV
      val eac = ev.get.pv.get + ev.get.ac.get - ev.get.ev.get
      node.put("EAC", d_format.format(eac))
      //PV – AC
      node.put("ETC", d_format.format((ev.get.pv.get - ev.get.ac.get)))
    } else {
      val ev = getProjectEV(id, "")
      if (!ev.isEmpty) {
        node.put("PV", d_format.format(ev.get.pv.getOrElse(0)))
        node.put("EV", d_format.format(ev.get.ev.getOrElse(0)))
        node.put("AC", d_format.format(ev.get.ac.getOrElse(0)))
        node.put("SV", d_format.format(ev.get.pv.get - ev.get.ev.get))
        node.put("CV", d_format.format(ev.get.ev.get - ev.get.ac.get))
        node.put("CPI", d_format.format(ev.get.cpi.getOrElse(0)))
        //node.put("cp", format.format(ev.get.c.get.toString()))
        node.put("SPI", d_format.format(ev.get.spi.getOrElse(0)))
        //PV  + AC – EV
        val eac = ev.get.pv.get + ev.get.ac.get - ev.get.ev.get
        node.put("EAC", d_format.format(eac))
        //PV – AC
        node.put("ETC", d_format.format((ev.get.pv.get - ev.get.ac.get)))
      }
    }

    node
  }

  def calculateTaskEarnValue(id: String) = {
    var node = new JSONObject()
    val todays = new Date().getTime()
    var earn_value: Double = 0
    val taskDetail = TaskService.findActiveTaskDetailsByTaskId(Integer.parseInt(id))
    val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
    val d_format = new DecimalFormat("0.00")
    val ev = getTaskEV(id, format.format(new Date))
    if (!ev.isEmpty) {
      node.put("PV", d_format.format(ev.get.pv.getOrElse(0)))
      node.put("EV", d_format.format(ev.get.ev.getOrElse(0)))
      node.put("AC", d_format.format(ev.get.ac.getOrElse(0)))
      node.put("SV", d_format.format(ev.get.pv.get - ev.get.ev.get))
      node.put("CV", d_format.format(ev.get.ev.get - ev.get.ac.get))
      node.put("CPI", d_format.format(ev.get.cpi.getOrElse(0)))
      //node.put("cp", format.format(ev.get.c.get.toString()))
      node.put("SPI", d_format.format(ev.get.spi.getOrElse(0)))
      //PV  + AC – EV
      val eac = ev.get.pv.get + ev.get.ac.get - ev.get.ev.get
      node.put("EAC", d_format.format(eac))
      //PV – AC
      node.put("ETC", d_format.format((ev.get.pv.get - ev.get.ac.get)))
    } else {
      val ev = getTaskEV(id, "")
      if (!ev.isEmpty) {
        node.put("PV", d_format.format(ev.get.pv.getOrElse(0)))
        node.put("EV", d_format.format(ev.get.ev.getOrElse(0)))
        node.put("AC", d_format.format(ev.get.ac.getOrElse(0)))
        node.put("SV", d_format.format(ev.get.pv.get - ev.get.ev.get))
        node.put("CV", d_format.format(ev.get.ev.get - ev.get.ac.get))
        node.put("CPI", d_format.format(ev.get.cpi.getOrElse(0)))
        //node.put("cp", format.format(ev.get.c.get.toString()))
        node.put("SPI", d_format.format(ev.get.spi.getOrElse(0)))
        //PV  + AC – EV
        val eac = ev.get.pv.get + ev.get.ac.get - ev.get.ev.get
        node.put("EAC", d_format.format(eac))
        //PV – AC
        node.put("ETC", d_format.format((ev.get.pv.get - ev.get.ac.get)))
      }
    }

    node
  }

  def calculateSubTaskEarnValue(id: String) = {
    var node = new JSONObject()
    val todays = new Date().getTime()
    var earn_value: Double = 0
    val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
    val d_format = new DecimalFormat("0.00")
    val ev = getSubTaskEV(id, format.format(new Date))
    if (!ev.isEmpty) {
      node.put("PV", d_format.format(ev.get.pv.getOrElse(0)))
      node.put("EV", d_format.format(ev.get.ev.getOrElse(0)))
      node.put("AC", d_format.format(ev.get.ac.getOrElse(0)))
      node.put("SV", d_format.format(ev.get.pv.get - ev.get.ev.get))
      node.put("CV", d_format.format(ev.get.ev.get - ev.get.ac.get))
      node.put("CPI", d_format.format(ev.get.cpi.getOrElse(0)))
      //node.put("cp", format.format(ev.get.c.get.toString()))
      node.put("SPI", d_format.format(ev.get.spi.getOrElse(0)))
      //PV  + AC – EV
      val eac = ev.get.pv.get + ev.get.ac.get - ev.get.ev.get
      node.put("EAC", d_format.format(eac))
      //PV – AC
      node.put("ETC", d_format.format((ev.get.pv.get - ev.get.ac.get)))
    } else {
      val ev = getSubTaskEV(id, "")
      if (!ev.isEmpty) {
        node.put("PV", d_format.format(ev.get.pv.getOrElse(0)))
        node.put("EV", d_format.format(ev.get.ev.getOrElse(0)))
        node.put("AC", d_format.format(ev.get.ac.getOrElse(0)))
        node.put("SV", d_format.format(ev.get.pv.get - ev.get.ev.get))
        node.put("CV", d_format.format(ev.get.ev.get - ev.get.ac.get))
        node.put("CPI", d_format.format(ev.get.cpi.getOrElse(0)))
        //node.put("cp", format.format(ev.get.c.get.toString()))
        node.put("SPI", d_format.format(ev.get.spi.getOrElse(0)))
        //PV  + AC – EV
        val eac = ev.get.pv.get + ev.get.ac.get - ev.get.ev.get
        node.put("EAC", d_format.format(eac))
        //PV – AC
        node.put("ETC", d_format.format((ev.get.pv.get - ev.get.ac.get)))
      }
    }

    node
  }

  def getSubTaskEV(sub_task_id: String, fecha: String): Option[MainEarnValue] = {
    var sql = ""
    if (!StringUtils.isEmpty(fecha)) {
      sql = "select * from art_sub_task_indicators where sub_task_id=" + sub_task_id + " AND fecha='" + fecha + "'"
    } else {
      sql = "select * from art_sub_task_indicators where sub_task_id=" + sub_task_id + " AND fecha= ( select MAX(fecha) from art_sub_task_indicators where sub_task_id=" + sub_task_id + ")"
    }

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(MainEarnValue.mainEarnValue.singleOpt)
      result
    }
  }
  def getTaskEV(task_id: String, fecha: String): Option[MainEarnValue] = {
    var sql = ""
    if (!StringUtils.isEmpty(fecha)) {
      sql = "SELECT fecha,SUM(pv_inc) as pv_inc,SUM(pv) as pv,SUM(ev) as ev,SUM(e_ev) as e_ev ,SUM(ac) as ac ,SUM(spi) as spi,SUM(cpi) as cpi ,SUM(e_spi) as e_spi ,SUM(e_cpi) as e_cpi FROM art_sub_task_indicators where task_id=" + task_id + " AND fecha='" + fecha + "' group by fecha"

    } else {
      sql = "SELECT fecha,SUM(pv_inc) as pv_inc,SUM(pv) as pv,SUM(ev) as ev,SUM(e_ev) as e_ev ,SUM(ac) as ac ,SUM(spi) as spi,SUM(cpi) as cpi ,SUM(e_spi) as e_spi ,SUM(e_cpi) as e_cpi FROM art_sub_task_indicators where task_id=" + task_id + " AND fecha=(select MAX(fecha) from art_sub_task_indicators where task_id=" + task_id + ") group by fecha"
    }

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(MainEarnValue.mainEarnValue.singleOpt)
      result
    }
  }

  def getEarnCalculationForProgram(id: String) = {
    var sqlString = ""
    sqlString = "SELECT TOP 1* from art_erned_value where parent_type='0' AND parent_id='" + id + "' order by recorded_date DESC"
    //sqlString = "SELECT * from art_erned_value where parent_type='0' AND parent_id='" + id + "' order by recorded_date DESC LIMIT 0,1"
    //println(sqlString)
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(EarnValue.earnValueObj.singleOpt)
    }
  }

  def getEarnCalculationForProject(projetct_id: String) = {
    var sqlString = "SELECT TOP 1* from art_erned_value where parent_type='1' AND parent_id='" + projetct_id + "' order by recorded_date DESC"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(EarnValue.earnValueObj.singleOpt)
    }
  }

  def programEarnValueCalculations() = {
    val programs = ProgramService.findActivePrograms()
    for (p <- programs) {
      val program_details = ProgramService.findProgramDateDetailsById(p.program_id.get.toString())
      if (!program_details.isEmpty) {
        if (!program_details.get.closure_date.isEmpty && program_details.get.initiation_planned_date != null) {
          saveProgramEarnValue(p.program_id.get.toString())
        }
      }
    }
  }

  def getGraphCalculationForProgram(id: String) = {
    var sqlString = " SELECT DISTINCT scheduled_perforamce_index, cost_performance_index , erned_value, planned_value,actual_cost , recorded_date  from art_erned_value where parent_type='0' AND parent_id='" + id + "'  ORDER BY recorded_date ASC";
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(SPIValue.spiValueObj *)
    }
  }

  def getSPIForAllActiveProgram(program_id: String) = {
    var sqlString = " SELECT TOP 1* from art_erned_value where parent_type='0' AND parent_id='" + program_id + "'  ORDER BY scheduled_perforamce_index DESC";
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(EarnValue.earnValueObj.singleOpt)
    }
  }

  def calculateSubTaskEarnValue() {
    val subtasks = SubTaskServices.findAllAllocatedSubTasks
    if (subtasks.size > 0) {
      for (s <- subtasks) {
        val s_date = s.plan_start_date
        val e_date = s.plan_end_date
        var index = 0
        var pv_inc: Double = 0
        var pv: Double = 0
        var ev: Double = 0 //%*total hours
        var e_ev: Double = 0 //100% = pv else = 0 
        var ac: Double = 0 //timesheet 
        var spi: Double = 0 // ev/pv
        var cpi: Double = 0 //EV/AC
        var e_spi: Double = 0 //eEV/PV
        var e_cpi: Double = 0 //eEv/AC
        var task_hour: Double = 0
        var tommorrow = ""
        var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
        var dateFormate = new SimpleDateFormat("yyyy/MM/dd");
        var today = s_date
        var sub_task_info = SubTaskServices.findDetailInformation("SUBTASK", s.sub_task_id.get.toString())
        var diffInDays = (e_date.getTime - s_date.getTime) / (1000 * 60 * 60 * 24) + 1

        var total_hours = SubTaskServices.findTotalAllocatedHoursForSubTask(s.sub_task_id.get.toString()).toDouble
        val dateObj = SubTaskServices.findActualStartDateForSubTask(s.sub_task_id.get.toString())
        var minDate: Date = new Date

        if (diffInDays > 0) {
          pv_inc = total_hours / diffInDays
          pv = pv_inc

          deleteSubTaskEarnValue(s.sub_task_id.get.toString())

          if (!s.completion_percentage.isEmpty) {
            if (s.completion_percentage.get == 100) {
              e_ev = total_hours
            } else {
              e_ev = 0

            }
            ev = s.completion_percentage.get * total_hours / 100
          } else {
            e_ev = 0
            ev = 0
          }

          //ac = TimesheetService.getBookedHourForSubTask(s.sub_task_id.get.toString()).toDouble

          while (diffInDays > 0) {
            var c = Calendar.getInstance();
            c.setTime(today)
            c.add(Calendar.DATE, index);
            tommorrow = FormattedDATE.format(c.getTime()).toString();
            var fetcha = FormattedDATE.parse(tommorrow)
            val curr_date = FormattedDATE.parse(FormattedDATE.format(new Date))
            if (curr_date.getTime == fetcha.getTime) {
              var evs: Option[Double] = Option(0)
              var total_hours = SubTaskServices.findTotalAllocatedHoursForSubTask(s.sub_task_id.get.toString()).toDouble
              if (!s.completion_percentage.isEmpty) {
                evs = Option(s.completion_percentage.get * total_hours / 100)
              }

              val ev = SubTaskEV(Option(s.sub_task_id.get), curr_date, evs)
              val isValid = validateEV(s.sub_task_id.get.toString(), dateFormate.format(new Date))
              if (isValid) {
                saveSubTaskEV(ev)
              } else {
                updateSubTaskEV(ev)
              }
            }
            if (dateObj != null) {
              minDate = dateObj.get
              ac = SubTaskServices.findActualCostForSubTask(s.sub_task_id.get.toString(), dateFormate.format(minDate), dateFormate.format(fetcha))

            } else {
              ac = 0
            }
            if (!sub_task_info.isEmpty) {

              var ev_cal = SubTaskEarnValue(Option(0), Option(s.sub_task_id.get), sub_task_info.get.task_id, sub_task_info.get.project_id,
                sub_task_info.get.program_id, fetcha, Option(pv_inc), Option(pv), Option(ev),
                Option(e_ev), Option(ac), Option(spi), Option(cpi), Option(e_spi), Option(e_cpi))

              saveSubTaskEarnValue(ev_cal)

              pv = pv + pv_inc

              if (ac != 0) {
                cpi = ev / ac
                e_cpi = e_ev / ac
              } else {
                cpi = 0
                e_cpi = 0
              }

              if (pv != 0) {
                spi = ev.toInt / pv
                e_spi = e_ev / pv
              } else {
                spi = 0
                e_spi = 0
              }
            }
            diffInDays = diffInDays - 1
            index = index + 1
          }

        }

      }
    }

    if (subtasks.size > 0) {
      var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
      var dateFormate = new SimpleDateFormat("yyyy/MM/dd");
      for (s <- subtasks) {
        val s_date = s.plan_start_date
        val e_date = s.plan_end_date
        var diffInDays = (e_date.getTime - s_date.getTime) / (1000 * 60 * 60 * 24) + 1
        var today = s_date
        var tommorrow = ""
        var index = 0
        while (diffInDays > 0) {
          var c = Calendar.getInstance();
          c.setTime(today)
          c.add(Calendar.DATE, index);
          tommorrow = FormattedDATE.format(c.getTime()).toString();
          var fetcha = FormattedDATE.parse(tommorrow)
          val newEV = getEV(s.sub_task_id.toString(), dateFormate.format(fetcha))
          if (!newEV.isEmpty) {
            if (!newEV.get.ev.isEmpty) {
              updateSubTaskEarnValue(s.sub_task_id.toString(), dateFormate.format(fetcha), newEV.get.ev.get)
            }

          }
          diffInDays = diffInDays - 1
          index = index + 1
        }

      }
    }

  }

  def saveSubTaskEarnValue(ev: models.SubTaskEarnValue) {
    DB.withConnection { implicit connection =>
      SQL(
        """
          insert into art_sub_task_indicators( sub_task_id, task_id, project_id, 
          program_id, fecha, pv_inc, pv, ev,
           e_ev, ac, spi, cpi,e_spi,e_cpi) values ({sub_task_id}, {task_id}, {project_id}, 
          {program_id}, {fecha}, {pv_inc}, {pv}, {ev},
           {e_ev}, {ac}, {spi}, {cpi},{e_spi},{e_cpi})
          """).on(
          'sub_task_id -> ev.sub_task_id,
          'task_id -> ev.task_id,
          'project_id -> ev.project_id,
          'program_id -> ev.program_id,
          'fecha -> ev.fecha,
          'pv_inc -> ev.pv_inc,
          'pv -> ev.pv,
          'ev -> ev.ev,
          'e_ev -> ev.e_ev,
          'ac -> ev.ac,
          'spi -> ev.spi,
          'cpi -> ev.cpi,
          'e_spi -> ev.e_spi,
          'e_cpi -> ev.e_cpi).executeUpdate()
    }
  }

  def saveSubTaskEV(ev: models.SubTaskEV) {
    DB.withConnection { implicit connection =>
      SQL(
        """
          insert into art_subtask_ev_indicators( sub_task_id, fecha, ev) values (
          {sub_task_id},{fecha},{ev}
          )
          """).on(
          'sub_task_id -> ev.sub_task_id,
          'fecha -> ev.fecha,
          'ev -> ev.ev).executeUpdate()
    }
  }

  def updateSubTaskEV(ev: models.SubTaskEV) {
    var dateFormate = new SimpleDateFormat("yyyy/MM/dd");
    val sql = "update art_subtask_ev_indicators set ev=" + ev.ev.get + " where sub_task_id=" + ev.sub_task_id.get + " AND fecha=CAST('" + dateFormate.format(ev.fecha) + "' as DATE) "
    DB.withConnection { implicit connection =>
      SQL(sql).executeUpdate()
    }
  }

  def updateSubTaskEarnValue(sub_task_id: String, fecha: String, ev: Double) {
    val sql = "update art_sub_task_indicators set ev=" + ev + " where sub_task_id=" + sub_task_id + " AND fecha=CAST('" + fecha + "' as DATE) "
    DB.withConnection { implicit connection =>
      SQL(sql).executeUpdate()
    }
  }

  def validateEV(sub_task_id: String, fecha: String): Boolean = {
    var isValid = true
    val sql = "select * from art_subtask_ev_indicators where sub_task_id=" + sub_task_id + " AND fecha='" + fecha + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTaskEV.subtaskEV *)
      if (result.size > 0)
        isValid = false
    }
    isValid
  }

  def getEV(sub_task_id: String, fecha: String): Option[SubTaskEV] = {
    val sql = "select * from art_subtask_ev_indicators where sub_task_id=" + sub_task_id + " AND fecha='" + fecha + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTaskEV.subtaskEV.singleOpt)
      result
    }
  }

  def getProjectEV(project_id: String, fecha: String): Option[MainEarnValue] = {
    var sql = ""
    if (!StringUtils.isEmpty(fecha)) {
      sql = "SELECT fecha,SUM(pv_inc) as pv_inc,SUM(pv) as pv,SUM(ev) as ev,SUM(e_ev) as e_ev ,SUM(ac) as ac ,SUM(spi) as spi,SUM(cpi) as cpi ,SUM(e_spi) as e_spi ,SUM(e_cpi) as e_cpi FROM art_sub_task_indicators where project_id=" + project_id + " AND fecha='" + fecha + "' group by fecha"
    } else {
      sql = "SELECT fecha,SUM(pv_inc) as pv_inc,SUM(pv) as pv,SUM(ev) as ev,SUM(e_ev) as e_ev ,SUM(ac) as ac ,SUM(spi) as spi,SUM(cpi) as cpi ,SUM(e_spi) as e_spi ,SUM(e_cpi) as e_cpi FROM art_sub_task_indicators where project_id=" + project_id + " AND fecha=(select MAX(fecha) from art_sub_task_indicators where project_id=" + project_id + ") group by fecha"
    }

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(MainEarnValue.mainEarnValue.singleOpt)
      result
    }
  }

  /*  def getProjectEV(project_id: String, fecha: String): Option[MainEarnValue] = {
    var sql = ""
    if (!StringUtils.isEmpty(fecha)) {
      sql = """   SELECT SUM(estimated_time) estimated_time FROM
(SELECT ISNULL(SUM(estimated_time),0) estimated_time FROM art_sub_task_allocation WHERE 
sub_task_id IN (SELECT sub_task_id FROM art_sub_task WHERE plan_end_date < GETDATE() AND task_id IN (SELECT tId FROM art_task WHERE pId=""" + project_id + """ AND is_deleted=1) AND is_deleted=1)  AND is_deleted=1
UNION ALL
SELECT ISNULL(SUM(estimated_time),0) estimated_time FROM art_sub_task_allocation_external WHERE
sub_task_id IN (SELECT sub_task_id FROM art_sub_task WHERE plan_end_date < GETDATE() AND task_id IN (SELECT tId FROM art_task WHERE pId=""" + project_id + """ AND is_deleted=1) AND is_deleted=1) AND is_deleted=1) AS TOTAL """
    } else {
      sql = """   SELECT SUM(estimated_time) estimated_time FROM
(SELECT ISNULL(SUM(estimated_time),0) estimated_time FROM art_sub_task_allocation WHERE 
sub_task_id IN (SELECT sub_task_id FROM art_sub_task WHERE plan_end_date < GETDATE() AND task_id IN (SELECT tId FROM art_task WHERE pId=""" + project_id + """ AND is_deleted=1) AND is_deleted=1)  AND is_deleted=1
UNION ALL
SELECT ISNULL(SUM(estimated_time),0) estimated_time FROM art_sub_task_allocation_external WHERE
sub_task_id IN (SELECT sub_task_id FROM art_sub_task WHERE plan_end_date < GETDATE() AND task_id IN (SELECT tId FROM art_task WHERE pId=""" + project_id + """ AND is_deleted=1) AND is_deleted=1) AND is_deleted=1) AS TOTAL """
    }

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(MainEarnValue.mainEarnValue.singleOpt)
      result
    }
  }*/

  def deleteSubTaskEarnValue(sub_task_id: String) = {
    DB.withConnection { implicit connection =>
      SQL("Delete art_sub_task_indicators where sub_task_id=" + sub_task_id).executeUpdate()
    }
  }

  def getEarnValue(id: String, obj_type: String): Seq[models.MainEarnValue] = {
    var sql = ""
    if (!StringUtils.isEmpty(obj_type)) {
      obj_type match {
        case "Task" =>
          sql = """
                  SELECT fecha,SUM(pv_inc) as pv_inc,SUM(pv) as pv,SUM(ev) as ev,SUM(e_ev) as e_ev ,SUM(ac) as ac ,SUM(spi) as spi,SUM(cpi) as cpi ,SUM(e_spi) as e_spi ,SUM(e_cpi) as e_cpi FROM art_sub_task_indicators where task_id=""" + id + """ group by fecha
                """
        case "SubTask" =>
          sql = "select * from art_sub_task_indicators where sub_task_id = " + id
        case "Project" =>
          sql = """
                  SELECT fecha,SUM(pv_inc) as pv_inc,SUM(pv) as pv,SUM(ev) as ev,SUM(e_ev) as e_ev ,SUM(ac) as ac ,SUM(spi) as spi,SUM(cpi) as cpi ,SUM(e_spi) as e_spi ,SUM(e_cpi) as e_cpi FROM art_sub_task_indicators where project_id=""" + id + """ group by fecha
                """
        case "Program" =>
          sql = "select * from art_sub_task_indicators where task_id = " + id
      }

    }
    var result: Seq[models.MainEarnValue] = null
    DB.withConnection { implicit connection =>
      result = SQL(sql).as(MainEarnValue.mainEarnValue *)
    }
    result
  }
}