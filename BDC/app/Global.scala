import services._
import scala.concurrent.duration.DurationInt
import akka.actor.Props.apply
import play.api.Application
import play.Play
import play.api.GlobalSettings
import play.api.Logger
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import akka.actor.Props
import play.api._
import play.api.mvc._
import play.libs.Akka
import play.api.mvc._
import akka.actor._
import scala.concurrent.duration._
import play.api.libs.concurrent.Execution.Implicits._
import com.typesafe.akka.extension.quartz.QuartzSchedulerExtension
import java.util.concurrent.TimeUnit
import play.api._
import play.api.mvc._
import scala.io.Source


case object Message

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

  def startScheduler(akkaSystem: ActorSystem) {
    val scheduler = QuartzSchedulerExtension(akkaSystem)

    val dailyBatch01 = akkaSystem.actorOf(Props[DailyBatch01])

    scheduler.schedule("Every15Seconds", dailyBatch01, Message)
    Logger.info("Larry :: start()")
  }

  override def onStart(app: Application) {

    Logger.info("Application BDC onStart*********************************************")
    startScheduler(Akka.system)

    //InitialData.insertUser()
  }

  object InitialData {

    def insertUser() = {
      val user = UserService.findAllUsers

      if (user.size == 0) {
        Seq(
          //UserMaster(NotAssigned, "dandrade", "$2a$10$7.sClLhbsYAGwsmYcztMnOMCQvadp39rJj2xopMrya506BIgPSXaK", "Daniel", "Andrade", 1, 9, 10, "dandrade@toyato.com", new SimpleDateFormat("yyyy-MM-dd").parse("1956-12-06"), " ", new SimpleDateFormat("yyyy-MM-dd").parse("2014-05-20"), 1, 0, "4a89f4e5-d2ee-4889-9ce6-1030b8f37637", 1, "BDC000", 1000, "91588347", 1, "8.00", 0)
        ).foreach(UserService.insertUser)

      }

    }

  }
}

class DailyBatch01 extends Actor
{
  def receive = {
    case Message =>
      Logger.info("Larry is sending emails")
      RiskService.automaticAlert
    case _ =>
      Logger.info("none")

  }

}

object DaliyBatch01 {

}
