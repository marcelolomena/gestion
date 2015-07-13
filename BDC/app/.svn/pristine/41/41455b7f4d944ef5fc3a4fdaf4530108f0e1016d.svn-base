
import anorm.Id
import anorm.NotAssigned
import models.NonProjectTask
import models.Skills
import models.UserRole
import models.Users
import play.api.Application
import play.api.GlobalSettings
import services.DepartmentService
import services.ProjectService
import services.SubTaskServices
import services.TaskService
import services.UserService
import services.RiskService
import scala.concurrent.duration.DurationInt
import akka.actor.Props.apply
import play.api.Application
import play.Play
import play.api.Play.current
import play.api.GlobalSettings
import play.api.Logger

import play.api.libs.concurrent.Execution.Implicits.defaultContext
import akka.actor.Props
import utils.ImportFromExcel
import services.EarnValueService
import play.api._
import play.api.mvc._
import play.libs.Akka
import play.api.mvc._
import akka.actor._
import scala.concurrent.duration._
import play.api.libs.concurrent.Execution.Implicits._
//import play.libs.Time.CronExpression
import java.util.Date
import java.util.concurrent.TimeUnit
import org.omg.CosNaming.NamingContextPackage.NotFound
import play.api._
import play.api.mvc._
import java.io.IOException
import java.io.FileNotFoundException
import scala.io.Source
import java.io.{ FileReader, FileNotFoundException, IOException }

object Global extends GlobalSettings {

  /*  override def onError(request: RequestHeader, ex: Throwable) = {
    Results.InternalServerError(
      views.html.frontend.InternalServerError(ex))
  }

  override def onHandlerNotFound(request: RequestHeader) = {
    Results.NotFound(
      views.html.frontend.notFound(request, request.flash))
  }

  override def onBadRequest(request: RequestHeader, error: String) = {
    Results.BadRequest("Bad Request: " + error)
  }*/

  override def onStart(app: Application) {
    var filePath = ""
    val filename = Play.application().configuration().getString("bdc.global.aclfile")
    println(filename + "------------filename")
    try {
      for (line <- Source.fromFile(filename).getLines()) {
        filePath = filePath + "" + line
      }
    } catch {
      case ex: FileNotFoundException => println("Couldn't find that file.")
      case ex: IOException => println("Had an IOException trying to read that file")
    }
    models.MyGlobalObject.aclString = filePath

    //you could add initial data here
    //val e = new CronExpression("0 00 9 ? * *")
    //val nextValidTimeAfter = e.getNextValidTimeAfter(new Date())
    //val delay = Duration.create(nextValidTimeAfter.getTime() - System.currentTimeMillis(), TimeUnit.MILLISECONDS);

    val Tick = "runnable"

    val tickActor = Akka.system.actorOf(Props(new Actor {
      def receive = {
        case Tick =>
        //EarnValueService.programEarnValueCalculations()
        // RiskService.riskAutomaticAlert()
      }
    }))

    // Repeat every 12 hours, start 0 seconds after start
    //Akka.system.scheduler.schedule(0 seconds, 12 hours, tickActor, Tick)
    //Akka.system.scheduler.scheduleOnce(delay, tickActor, Tick)

    // to call calculateSubTaskEarnValue() method every 12 hours - jaideo

    //you could add initial data here
    //val e1 = new CronExpression("0 00 8 ? * *")
    //val nextValidTimeAfter1 = e1.getNextValidTimeAfter(new Date())
    //val delay1 = Duration.create((nextValidTimeAfter1.getTime() - System.currentTimeMillis()), TimeUnit.MILLISECONDS);

    //val e2 = new CronExpression("0 00 16 ? * *")
    //val nextValidTimeAfter2 = e2.getNextValidTimeAfter(new Date())
    //val delay2 = Duration.create((nextValidTimeAfter2.getTime() - System.currentTimeMillis()), TimeUnit.MILLISECONDS);
    val Tick1 = "runnable"
    //Logger.debug("Scheduling to run at 1 " + nextValidTimeAfter1);
    //Logger.debug("Scheduling to run at 2 " + nextValidTimeAfter2);

    val tickActor1 = Akka.system.actorOf(Props(new Actor {
      def receive = {
        case Tick1 =>
          EarnValueService.calculateSubTaskEarnValue()
      }
    }))

    // Repeat every 12 hours, start 0 seconds after start
    //Akka.system.scheduler.scheduleOnce(delay1, tickActor1, Tick1)
    //Akka.system.scheduler.scheduleOnce(delay2, tickActor1, Tick1)
    ///  Akka.system.scheduler.schedule(0 second, 12 hours, tickActor1, Tick1)

    /*
    InitialData.insertProject()
    InitialData.insertUser()
    InitialData.insertUserRole()
    InitialData.insertTeam()
    InitialData.insertTeamMember()
    InitialData.insertMilestones()
    InitialData.insertTeamMappingDetails()
    InitialData.insertUserProjectMapping()
    InitialData.insertTeamMappingDetails
    InitialData.insertSkills()
    InitialData.insertUserProjectMapping()
    InitialData.insertDepartment()
    InitialData.insertNonProjectTask()
*/
    InitialData.insertDepartment()
  }

  /* def reminderDaemon(app: Application) = {
    Logger.info("Scheduling the reminder daemon")
    val reminderActor = Akka.system(app).actorOf(Props(new utils.ImportFromExcel))
    Akka.system(app).scheduler.schedule(12 hours, 0 minutes, reminderActor, "reminderDaemon")
  }*/

  object InitialData {

    def insertProject() = {

      val project = ProjectService.findCount

      if (project == 0) {
        /*	Seq( //Project(NotAssigned, "P5594", 1, 1, 1, 1, "Customer eDocs Pilot", "Pilot implementation of a customer eDOCs initiative allowing the banks customers to store documents in a secure banking cloud.", 3, new SimpleDateFormat("yyyy-MM-dd").parse("2014-01-06"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-03-13"), 1, 1000, 1000, 1000, 1000, "S200", 1, "", 1, false),
					//Project(NotAssigned, "P55491", 2, 2, 2, 2, "CLS Payments Q4 release", "Changes to MT 202/MT203 messages to accept CLS payments from New York, London.", 4, new SimpleDateFormat("yyyy-MM-dd").parse("2014-01-08"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-04-18"), 1, 2000, 2000, 2000, 2000, "S300", 1, "", 1, false),
					//Project(NotAssigned, "P75482", 3, 3, 2, 3, "Mortgage Frontend Release 3.0", "Mortgage on boarding platform for UK data processing center.", 6, new SimpleDateFormat("yyyy-MM-dd").parse("2014-01-08"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-04-30"), 1, 3000, 3000, 3000, 3000, "S400", 1, "", 1, false)

				Project(NotAssigned, "P89273", 2, "Banking Application", "", 11, new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-01"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-09-01"), 1, Option("S4587"), Option(15000), 0, 0, 0, 0, 2000, 1, true),
					Project(NotAssigned, "P40667", 3, "Insurance application", "A formal request to an insurance company asking for a payment based on the terms of the insurance policy. Insurance claims are reviewed by the company for their validity and then paid out to the insured or requesting party (on behalf of the insured) once approved.", 14, new SimpleDateFormat("yyyy-MM-dd").parse("2014-05-01"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-10-01"), 1, Option("S4587"), 15000, 0, 0, 0, 0, 2000, 1, true),
					Project(NotAssigned, "P1346", 1, "SM - Corrección Archivo D03", "This is project created for the Banco Chile - which is aimed at correcting the file storage infrastructure. It is an initiative and is following the fast track.", 14, new SimpleDateFormat("yyyy-MM-dd").parse("2014-03-03"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-07-07"), 1, Option("S4587"), 15000, 300000, 40000, 25000, 232, 2000, 1, true),
					Project(NotAssigned, "P24292", 1, "SM - Bloqueos y Cierre CCI", "This is a project created for the Banco De Chile using the Advanced Roadmap Tool", 14, new SimpleDateFormat("yyyy-MM-dd").parse("2014-07-14"), new SimpleDateFormat("yyyy-MM-dd").parse("2015-01-08"), 1, Option("S4587"), 15000, 50000, 40000, 3000, 2000, 2000, 1, false),
					Project(NotAssigned, "P41655", 1, "SM - Automatización de Interfaces para Entel Visa", "This is a test description for the Projects using the Advanced Roadmap Tool", 14, new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-01"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-08-20"), 1, Option("S4587"), 15000, 20000, 20000, 20000, 200, 2000, 1, true),
					Project(NotAssigned, "P60096", 1, "Soporte, Incidentes y Continuidad - Departamento Servicios de Negocio", "This is a test project using the advanced roadmap tool", 14, new SimpleDateFormat("yyyy-MM-dd").parse("2014-07-03"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-09-19"), 1, Option("S4587"), 15000, 520000, 200000, 20000, 200, 2000, 1, false),
					Project(NotAssigned, "P72510", 1, "INFRA-TI Contrato Servicios Telecomunicaciones  Renovación 2013-2017", "This is a test description for the Projects using the Advanced Roadmap Tool.", 666, new SimpleDateFormat("yyyy-MM-dd").parse("2014-07-18"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-11-13"), 1, Option("S4587"), 15000, 20000, 20000, 200, 200, 2000, 1, false),
					Project(NotAssigned, "P72468", 3, "Sistema Automático de Control de Márgenes (2)", "Project description for the Advanced Roadmap Tool.", 568, new SimpleDateFormat("yyyy-MM-dd").parse("2013-11-28"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-12-31"), 1, Option("S4587"), 15000, 30000, 40000, 5000, 10000, 2000, 1, false),
					Project(NotAssigned, "P47646", 1, "Piloto Software PARASOFT - Virtualización de Servicios", "This is a test description for the Projects using the Advanced Roadmap Tool", 14, new SimpleDateFormat("yyyy-MM-dd").parse("2014-05-13"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-10-10"), 1, Option("S4587"), 15000, 20000, 20000, 20000, 200, 2000, 1, false),
					Project(NotAssigned, "P86452", 1, "Sistema Automático de Control de Márgenes (2)", "This is a test description for the Projects using the Advanced Roadmap Tool", 14, new SimpleDateFormat("yyyy-MM-dd").parse("2014-07-01"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-09-25"), 1, Option("S4587"), 15000, 20000, 20000, 200, 200, 2000, 1, false),
					Project(NotAssigned, "P17577", 1, "Sistema Automático de Control de Márgenes - LSA", "", 14, new SimpleDateFormat("yyyy-MM-dd").parse("2014-07-10"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-10-23"), 1, Option("S4587"), 15000, 20000, 20000, 20000, 200, 2000, 1, false),
					Project(NotAssigned, "P10574", 3, "Sistema Automático de Control de Márgenes - CDR", "Project description for the Advanced Roadmap Tool.", 14, new SimpleDateFormat("yyyy-MM-dd").parse("2013-11-28"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-12-31"), 1, Option("S4587"), 15000, 30000, 40000, 7000, 10000, 2000, 1, true),
					Project(NotAssigned, "P74366", 1, "Sistema Automático de Control de Márgenes - Siebel", "This is a test description for the Projects using the Advanced Roadmap Tool", 568, new SimpleDateFormat("yyyy-MM-dd").parse("2014-07-03"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-10-09"), 1, Option("S4587"), 15000, 20000, 20000, 200, 200, 2000, 1, false),
					Project(NotAssigned, "P58320", 3, "Cálculo Tasa Máxima Convencional-Lineas de Credito (2)", "Project description for the Advanced Roadmap Tool.", 565, new SimpleDateFormat("yyyy-MM-dd").parse("2013-12-17"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-16"), 1, Option("S4587"), 15000, 45000, 50000, 5000, 7000, 2000, 1, false)).foreach(ProjectService.insertProject)*/
      }

    }

    def insertUser() = {
      val user = UserService.findAllUsers

      if (user.size == 0) {
        Seq( //UserMaster(NotAssigned, "dandrade", "$2a$10$7.sClLhbsYAGwsmYcztMnOMCQvadp39rJj2xopMrya506BIgPSXaK", "Daniel", "Andrade", 1, 9, 10, "dandrade@toyato.com", new SimpleDateFormat("yyyy-MM-dd").parse("1956-12-06"), " ", new SimpleDateFormat("yyyy-MM-dd").parse("2014-05-20"), 1, 0, "4a89f4e5-d2ee-4889-9ce6-1030b8f37637", 1, "BDC000", 1000, "91588347", 1, "8.00", 0)
        ).foreach(UserService.insertUser)

      }

    }

    /**
     * Insert user role
     */
	 /*
    def insertUserRole() = {
      val userRole = UserService.findUserRoles
      if (userRole.size == 0) {
        Seq(
          UserRole(Id(1), "Engineer"),
          UserRole(Id(2), "QA Manager"),
          UserRole(Id(3), "Project Manager"),
          UserRole(Id(4), "Sales Manager")).foreach(TaskService.insertRole)
      }
    }
*/
    /**
     * insert team
     */
    /*		def insertTeam() = {
			val team = TaskService.findAllTeams
			if (team.size == 0) {
				Seq(
					Team(NotAssigned, "Team A", "", 1),
					Team(NotAssigned, "Team B", "", 1),
					Team(NotAssigned, "Team C", "", 1),
					Team(NotAssigned, "Team D", "", 1),
					Team(NotAssigned, "Team F", "", 1),
					Team(NotAssigned, "Team G", "", 1),
					Team(NotAssigned, "Team H", "", 1)).foreach(TaskService.insertTeam)

			}
		}*/

    /**
     * insert team member
     */
    /*def insertTeamMember() = {
			val teamMember = TaskService.findAllTeamMember
			if (teamMember.size == 0) {
				Seq(
					TeamMember(NotAssigned, 1, 6, 1, new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-26 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-08-31 00:00:00"), 1),
					TeamMember(NotAssigned, 1, 11, 4, new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-27 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-11-30 00:00:00"), 1),
					TeamMember(NotAssigned, 1, 9, 2, new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-26 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-10-31 00:00:00"), 1),
					TeamMember(NotAssigned, 2, 11, 4, new SimpleDateFormat("yyyy-MM-dd").parse("2014-08-01 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-10-31 00:00:00"), 1),
					TeamMember(NotAssigned, 2, 10, 1, new SimpleDateFormat("yyyy-MM-dd").parse("2014-08-01 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-10-04 00:00:00"), 1)).foreach(TaskService.insertTeamMember)
			}
		}*/

    /**
     * insert milestones details
     */
    def insertMilestones() = {
      val milestone = TaskService.findAllTasks
      if (milestone.size == 0) {
        //Seq(
        //Milestones(NotAssigned, "P68376", "Front end Development.", "MM100", "India", "Maharastra", "Pune, 28", new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-22"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-22"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-22"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-22 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-22"), "Sprints for requirements to be closed before commencing with development.", 200, new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-13"), 0, 1, 11),
        //Milestones(NotAssigned, "P68376", "West Zone Branch Upgrade..", "WC100", "India", "Maharastra", "Mumbai", new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-18"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-18 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-18 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-18 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-18 00:00:00"), "", 300, new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-13 12:13:51"), 1, 1, 11),
        //Milestones(NotAssigned, "P68376", "Q4 Danish Translation.......", "QC200", "India", "Delhi", "Delhi", new SimpleDateFormat("yyyy-MM-dd").parse("2014-02-14"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-02-14 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-02-14 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-02-14 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-02-14 00:00:00"), "Hire consultant to work on the Danish Translations. Also imp for UTF 8 rendering.", 200, new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-13 12:14:43"), 0, 1, 11),
        //Milestones(NotAssigned, "P75482", "Finalize Database.", "DB201", "China", "Bijing", "Bijing", new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-30"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-30 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-30 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-30 00:00:00"), new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-30 00:00:00"), "", 500, new SimpleDateFormat("yyyy-MM-dd").parse("2014-06-13 13:26:26"), 0, 1, 11)).foreach(TaskService.insert)
      }
    }

    /**
     * insert team mapping details
     */
    /*def insertTeamMappingDetails() = {
			val teamMapping = TaskService.findTeamMappingCount("")
			if (teamMapping == 0) {
				Seq(
					TeamMapping(2, 1),
					TeamMapping(3, 1),
					TeamMapping(1, 2),
					TeamMapping(2, 2)).foreach(TaskService.assignTeamMilestone)
			}
		}*/

    def insertUserProjectMapping() = {
      val userProjects = UserService.findUserAllProjectsForUser

      if (userProjects == 0) {

        /*Seq(
          UserSetting(6, 2),
          UserSetting(9, 2),
          UserSetting(6, 1),
          UserSetting(9, 1),
          UserSetting(10, 3),
          UserSetting(10, 2)).foreach(UserService.saveUserSetting)
*/
      }

    }

    def insertSkills() = {

      val skills = UserService.findAllSkills().size

      if (skills == 0) {
        Seq(
          Skills(1, "Hibernate"),
          Skills(2, "Templating"),
          Skills(3, "C++"),
          Skills(4, "C#.NET"),
          Skills(5, "SQL"),
          Skills(6, "JAVA"),
          Skills(7, "IOS"),
          Skills(8, "User Experience Design"),
          Skills(9, "IOS"),
          Skills(10, "Javascript"),
          Skills(11, "JQuery"),
          Skills(12, "HTML"),
          Skills(13, "Play Framework")).foreach(UserService.insertSkills)
      }

    }

    def insertDepartment() = {
      val department = DepartmentService.findAllDepartmentS
      if (department.size == 0) {
        /*Seq(
					DepartmentMaster(None, "Developement", 6, 0, 1, 0),
					DepartmentMaster(None, "Testing", 3, 0, 1, 0),
					DepartmentMaster(None, "Marketing", 4, 0, 1, 0),
					DepartmentMaster(None, "Planning", 5, 0, 1, 0),
					DepartmentMaster(None, "Communication", 2, 0, 1, 0),
					DepartmentMaster(None, "packaging/Deployment", 8, 0, 1, 0),
					DepartmentMaster(None, "Other", 6, 0, 1, 0)).foreach(DepartmentService.saveDepartment)*/
      }

    }

    def insertNonProjectTask() = {
      val nonProjectTask = SubTaskServices.findNonProjectTasks
      if (nonProjectTask.size == 0) {
        Seq(
          NonProjectTask(None, "Leaves"),
          NonProjectTask(None, "Training"),
          NonProjectTask(None, "Meetings"),
          NonProjectTask(None, "Non-billable projects"),
          NonProjectTask(None, "BAU Run Support")).foreach(SubTaskServices.saveNonProjectsTasks)
      }

    }

  }
}

