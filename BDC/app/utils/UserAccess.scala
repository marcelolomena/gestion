package utils

import play.api.mvc.Action
import play.api.mvc.AnyContent
import play.api.mvc.Request
import play.api.mvc.RequestHeader
import play.api.mvc.Result
import play.api.mvc.Results
import play.api.mvc.Security
import java.text.SimpleDateFormat
import java.text.DecimalFormat
import org.apache.commons.lang3.time.DateUtils
import java.util.Date
import controllers._
import org.apache.commons.lang3.StringUtils
import org.json.JSONArray
import org.json.JSONObject
import scala.io.Source
import java.io.{ FileReader, FileNotFoundException, IOException }
import play.api.libs.json.JsValue
import play.api.libs.json.Json
import play.Play
import java.util.StringTokenizer
import services.ProjectService
import services.ProjectManagerService
import services.ProgramMemberService
import services.TaskService
import services.UserService
import models.ProgramSearch
import services.ProgramService
import services.FunctionRoleService
import play.api.mvc.Session

trait AuthentiCate {
  /**
   * user types
   * Basic User      - 0
   * Super User      - 1
   * PMO             - 2
   * CEO             - 3
   * Project Manger  - 4
   * Program Manager - 5
   * Demand Manager  - 6
   *
   */

  def checkAccessOLD(implicit request: RequestHeader, element_type: String): Boolean = {
    var isValid = false
    if (!request.session.get("user_profile").isEmpty) {
      var user_role = request.session.get("user_profile").get
      val jsonString = models.MyGlobalObject.aclString

      //println(jsonString+"---")
      if (!StringUtils.isEmpty(jsonString)) {
        val jObject: JsValue = Json.parse(jsonString)
        if (!jObject.\\(element_type).isEmpty) {
          val jList = jObject.\\(element_type)
          var jElement = ""
          for (j <- jList) {
            jElement = j.toString()
            val st = new StringTokenizer(jElement, "\"[,]");
            while (st.hasMoreTokens()) {
              val token = st.nextToken();
              //println("--" + token + "---")
              if (StringUtils.equals(token, user_role.trim())) {
                //  println(jElement + " ---- " + user_role + "-----" + element_type)
                isValid = true
              }
            }
          }
          /*     println(jElement)
          jElement = jElement.replace("\"", "")
          val jArray = jElement.split(",")

          // println(jElement + " " + element_type + " " + user_role + "-" + jArray.contains(user_role) + " " + jArray)
          if (jArray.contains(user_role)) {
            //   println(jElement + " ---- " + user_role + "-----" + element_type)
            isValid = true
          }*/
        }
      }
    }
    isValid
  }
  
  def checkAccessSession(implicit session: Session, element_type: String): Boolean = {
    var isValid = false
    if (!session.get("user_profile").isEmpty) {
      var user_role = session.get("user_profile").get
      if(FunctionRoleService.checkDBAccess(user_role,element_type)==1){
        isValid = true
      }else{
        println("acceso denegado a: " + element_type)
      }
    }
    isValid
  }  

  def checkAccess(implicit request: RequestHeader, element_type: String): Boolean = {
    var isValid = false
    if (!request.session.get("user_profile").isEmpty) {
      var user_role = request.session.get("user_profile").get

      if(FunctionRoleService.checkDBAccess(user_role,element_type)==1){
        isValid = true
      }else{
        println("acceso denegado a: " + element_type)
      }

    }
    isValid
  } 

    def canCreateSubTask(implicit request: RequestHeader, tid: String): Boolean = {
    var isValid = false
    //println("uid:" + request.session.get("uId").get + ", tid:" +tid)
    if (!request.session.get("uId").isEmpty) {
      var uid = request.session.get("uId").get
      
      if(TaskService.canCreateSubTask(uid,tid)==1){
        println(uid + " tiene permiso para crear subtarea")
        isValid = true
      }else{
        println(uid + " no tiene permiso para crear subtarea")
      }

    }
    isValid
  } 
  
  def isAuthenticaedProject(implicit request: RequestHeader, project_id: String): Boolean = {
    var isValid = false
    if (!request.session.get("user_profile").isEmpty) {
      var user_role = request.session.get("user_profile").get
      var user_id = request.session.get("uId").get
      var isValidProject = false
      var isValidProgramMamnager = false

      ///isValidProject = UserService.checkUserSettingbyuIdandpId(user_id.toInt, project_id.toInt)
      val program = ProjectService.findProgramDetailForProject(project_id)
      if (!program.isEmpty) {
        val programMemmber = ProgramMemberService.findAllProgramMember(program.get.program_id.get.toString())
        for (pm <- programMemmber) {
          if (pm.role_id == 6 && pm.member_id == user_id.toInt) {
            isValidProgramMamnager = true
          }
        }
      } else {

      }

      val project = ProjectService.findProject(project_id.toInt)
      if (!project.isEmpty) {
        if (project.get.project_manager == user_id.toInt) {
          isValidProject = true
        }
      }

      //println(isValidProject +"---"+isValidProgramMamnager)
      if (user_role == "pmo" || user_role == "su" || isValidProject || isValidProgramMamnager) {
        isValid = true
      }
    }
    isValid

  }

}

object UserAccess extends AuthentiCate {

}
