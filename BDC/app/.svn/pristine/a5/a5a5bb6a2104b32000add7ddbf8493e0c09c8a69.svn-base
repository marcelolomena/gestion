package controllers.Frontend

import play.api.mvc.Action
import play.api.mvc.Controller
import services.ProgramService
import art_forms.ARTForms
import models.DocumentMaster
import anorm.NotAssigned
import services.DocumentService
import models.VersionDetails
import java.util.Date
import services.UserService
import java.util.UUID
import models.VersionDetails
import models.DocumentMaster
import services.TaskService
import services.SubTaskServices
import services.ProjectService
import play.Play
import play.api.Play.current
import play.api.data._
import play.api.data.Forms._
import java.io.File
import scala.io.Source
import org.apache.commons.lang3.StringUtils
import models._
import utils._
import models.SubTaskMaster
import models.SubTasks
import models.SearchCriteria
import models.DocumentMaster
import models.VersionDetails
//import play.api.libs.Files
import java.nio.file.CopyOption
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption.REPLACE_EXISTING
import java.io.FileOutputStream
import java.io.IOException
import java.util.Date
import services._
import java.io.FileInputStream
import services.ProgramTypeService
import models.Program_Master
import models.Program_Master
import services.DivisionService
import services.GenrenciaService
import services.DepartmentService
//import java.io.File

object Documents extends Controller {
  def documentOverview() = Action { implicit request =>
    request.session.get("username").map { user =>

      val userSession = request.session + ("uId" -> request.session.get("uId").get) + ("username" -> request.session.get("username").get) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
      //val programs = ProgramService.findAllPrograms("", "")

      var documentType = new java.util.HashMap[String, String]()
      val doc_type_list = DocumentTypeService.findAllDocumentTypes()
      for (d <- doc_type_list) {
        documentType.put(d.id.get.toString, d.document_type.toString())
      }
      var divisionList = DivisionService.findAllDivision()
      val programs = ProgramService.findAllProgramList
      val documents = DocumentService.findAllDocuments(divisionList(0).dId.get.toString, "DIVISION", "", "", "")
      val projects = ProjectService.findProjectList
      val tasks = TaskService.findAllTasks
      val subTasks = SubTaskServices.findAllSubTasks
      val users = UserService.findAllUsers
      Ok(views.html.frontend.documents.documentOverview(divisionList, programs, documents, "DIVISION", ARTForms.searchDocument, documentType, projects, tasks, subTasks, users)).withSession(userSession)
    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }
  }

  def documentOverviewListing() = Action { implicit request =>
    request.session.get("username").map { user =>

      val userSession = request.session + ("uId" -> request.session.get("uId").get) + ("username" -> request.session.get("username").get) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
      //val programs = ProgramService.findAllPrograms("", "")

      var documentType = new java.util.HashMap[String, String]()
      val doc_type_list = DocumentTypeService.findAllDocumentTypes()
      for (d <- doc_type_list) {
        documentType.put(d.id.get.toString, d.document_type.toString())
      }
      var divisionList = DivisionService.findAllDivision()
      val programs = ProgramService.findAllProgramList
      val documents = DocumentService.findAllDocuments(divisionList(0).dId.get.toString, "DIVISION", "", "", "")
      val projects = ProjectService.findProjectList
      val tasks = TaskService.findAllTasks
      val subTasks = SubTaskServices.findAllSubTasks
      val users = UserService.findAllUsers
      Ok(views.html.frontend.documents.documentOverviewListing(divisionList, programs, documents, "DIVISION")).withSession(userSession)
    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }

  }

  def uploadDocument(parent_id: String, parentType: String, uploadType: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      if (uploadType.equals("ADD") || uploadType.equals("UPDATE")) {
        val userSession = request.session + ("uId" -> request.session.get("uId").get) + ("username" -> request.session.get("username").get) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
        var documentType = new java.util.HashMap[String, String]()

        val doc_type_list = DocumentTypeService.findAllDocumentTypes()
        for (d <- doc_type_list) {
          documentType.put(d.id.get.toString, d.document_type.toString())
        }
        var parentVersionNo = "";

        var currentParent = ""

        //If uploadtype is update, then parent_id will be document_id
        if (uploadType.equals("UPDATE")) {
          var currentVersionDetails = DocumentService.findAllCurrentVersions(parent_id);

          parentVersionNo = currentVersionDetails.get.id.get.toString();
          var documentMaster = DocumentService.findDocumentById(currentVersionDetails.get.document_id.toString);
          if (!documentMaster.isEmpty) {
            currentParent = currentVersionDetails.get.document_id.toString
          } else {
            currentParent = parent_id
          }

          Ok(views.html.frontend.documents.uploadDocument(ARTForms.documentForm, documentType, documentMaster.get.title, currentParent, parentType, uploadType, parentVersionNo, request.flash)).withSession(userSession)
        } else {
          Ok(views.html.frontend.documents.uploadDocument(ARTForms.documentForm, documentType, "", parent_id, parentType, uploadType, parentVersionNo, request.flash)).withSession(userSession)
        }
      } else {
        if (parentType.equals("PROGRAM"))
          Redirect(routes.Program.programDetails(parent_id));
        else if (parentType.equals("PROJECT"))
          Redirect(routes.ProjectMaster.projectDetails(parent_id))
        else if (parentType.equals("TASK"))
          Redirect(routes.Task.projectTaskDetails(parent_id))
        else
          Redirect(routes.Login.loginUser());
      }
    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }

  }

  def uploadNewDocument(parent_id: String, parentType: String, uploadType: String) = Action(parse.multipartFormData) { implicit request =>

    var documentType = new java.util.HashMap[String, String]()
    val doc_type_list = DocumentTypeService.findAllDocumentTypes()
    for (d <- doc_type_list) {
      documentType.put(d.id.get.toString, d.document_type.toString())
    }
    request.session.get("username").map { user =>
      val userSession = request.session + ("uId" -> request.session.get("uId").get) + ("username" -> request.session.get("username").get) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)

      ARTForms.documentForm.bindFromRequest.fold(
        // Form has errors, redisplay it

        errors => {
          println(errors.errors);
          BadRequest(views.html.frontend.documents.uploadDocument(errors, documentType, errors.data.get("title").get, errors.data.get("parent_id").get, errors.data.get("parent_type").get, uploadType, errors.data.get("parent_version_id").get, request.flash)).withSession(userSession)
        },
        document => {
          request.body.file("upload_document").map {
            uploaded_document =>

              import java.io.File
              val filename = uploaded_document.filename
              val contentType = uploaded_document.contentType
              Play.application().configuration().getString("bdc.documents.location");
              var filePath: String = Play.application().configuration().getString("bdc.documents.location") + "/";
              var filePathParent: String = "";
              if (filename != "") {
                //Retrieve file extension.
                val extension = filename.substring((filename.lastIndexOf(".") + 1), filename.length())

                //Create new file name from UUID
                var newFileName = UUID.randomUUID().toString() + "." + extension;
                if (uploadType.equals("UPDATE")) {
                  filePathParent = DocumentService.getFilePath(parent_id, parentType, "Update");

                } else {
                  filePathParent = DocumentService.getFilePath(parent_id, parentType, "CurrentVersion");
                }

                //println("filePath========    " + filePath)
                //println("filePathParent=========       " + filePathParent)
                //println("newFileName=======       " + newFileName)
                //println("el Path=======       " + filePath + "CurrentVersion" + filePathParent + newFileName)
                //println(filePath + "CurrentVersion")
                //println(filePath + "CurrentVersion" + newfilePathParent)
                //println("newfilePathParent [" + newfilePathParent + "]")
                
                //var newfilePathParent = filePathParent.substring(0, filePathParent.size-1)
                //println("guaa [" + filePath + "CurrentVersion" + filePathParent.trim()  + "]")
                var dirOrigen = new java.io.File(filePath + "CurrentVersion" + filePathParent).mkdirs()

                /*
                var file = new java.io.File(filePath + "CurrentVersion" + filePathParent.trim(),newFileName)

	            if (file.createNewFile())
	            	println("El fichero se ha creado correctamente")
			    else
			    	println("No ha podido ser creado el fichero")
			    */
                
                var file = new File(filePath + "CurrentVersion" + filePathParent + newFileName)
                uploaded_document.ref.moveTo(file, true);
                var dirDestino = new java.io.File(Play.application().configuration().getString("bdc.documents.location") + "/alldocuments/").mkdir()
                var docFile = new File(Play.application().configuration().getString("bdc.documents.location") + "/alldocuments/" + newFileName)
                
                
                Files.copy(file.toPath(), docFile.toPath(), REPLACE_EXISTING);
                var version_no = 1.0;
                if (uploadType.equals("ADD")) {
                  //Create new Document Master Object.

                  var parent_type = document.parent_type
                  if ("TIME".equals(document.parent_type)) {
                    parent_type = "SUBTASK"
                  }
                  val documentMaster = DocumentMaster(None, extension, parent_type, document.parent_id, document.title, new Date, 1);
                  val document_id = DocumentService.insertNewDocument(documentMaster);

                  /**
                   * Activity log
                   */
                  val act = Activity(ActivityTypes.Document.id, "Document uploaded by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), document_id.toInt)
                  Activity.saveLog(act)
                  var versionDetails = VersionDetails(None, document_id.toInt, version_no, document.version_alias, document.version_notes, Option(1), Integer.parseInt(request.session.get("uId").get), false, document.document_type, new Date, newFileName, "/assets/uploads/CurrentVersion" + filePathParent + newFileName);
                  val lastUpdateId = DocumentService.insertVersionDetails(versionDetails);
                  if (parentType.equals("DIVISION"))
                    Redirect(routes.Documents.documentOverview() + "?" + parent_id);
                  else if (parentType.equals("PROGRAM"))
                    Redirect(routes.Program.programDetails(document.parent_id.toString));
                  else if (parentType.equals("PROJECT"))
                    Redirect(routes.ProjectMaster.projectDetails(parent_id));
                  else if (parentType.equals("TASK"))
                    Redirect(routes.Task.projectTaskDetails(parent_id));
                  else if (parentType.equals("SUBTASK")) {
                    val subTaskDetail = SubTaskServices.findSubTaskDetailsBySubtaskId(parent_id)
                    Redirect(routes.Task.projectTaskDetails(subTaskDetail.get.task_id.toString + "?#" + subTaskDetail.get.sub_task_id));
                  } else if (parentType.equals("TIME")) {
                    Redirect(routes.SubTask.subTaskDetails(parent_id));
                  } else
                    Redirect(routes.Login.loginUser());
                } else if (uploadType.equals("UPDATE")) {
                  var documentMaster: Option[DocumentMaster] = null;

                  var previousCurrentVersion = DocumentService.findAllCurrentVersionsFromVersionId(parent_id);
                  if (!previousCurrentVersion.isEmpty) {

                    documentMaster = DocumentService.findDocumentById(previousCurrentVersion.get.document_id.toString);
                    val updatedDocumentMaster = DocumentMaster(documentMaster.get.Id, documentMaster.get.extension, documentMaster.get.parent_type, documentMaster.get.parent_id, documentMaster.get.title, new Date, 1);
                    val doc_id = DocumentService.updateDocumentMaster(updatedDocumentMaster);
                    version_no = previousCurrentVersion.get.version_no.toDouble + 1.0;
                    val versionDetails = VersionDetails(None, parent_id.toInt, version_no, document.version_alias, document.version_notes, Option(1), Integer.parseInt(request.session.get("uId").get), false, document.document_type, new Date, newFileName, ("/assets/uploads/CurrentVersion" + filePathParent + newFileName));
                    val lastUpdateId = DocumentService.insertVersionDetails(versionDetails);
                    var historicalFilePath = DocumentService.createFolderForHistoricalData(documentMaster.get.parent_id.toString, parentType, previousCurrentVersion.get.file_name, (filePath + "CurrentVersion" + filePathParent));
                    var versionDetail = VersionDetails(previousCurrentVersion.get.id, previousCurrentVersion.get.document_id, previousCurrentVersion.get.version_no, previousCurrentVersion.get.version_alias, previousCurrentVersion.get.version_notes, Option(lastUpdateId.toInt), previousCurrentVersion.get.user_id, false, previousCurrentVersion.get.document_type, previousCurrentVersion.get.creation_date, previousCurrentVersion.get.file_name, historicalFilePath);
                    DocumentService.updateCurrentVerionToPrevious(versionDetail);
                    if (!documentMaster.isEmpty) {
                      // parentType=documentMaster.get.parent_type.toString()  
                    }

                    /**
                     * Activity log
                     */
                    val act = Activity(ActivityTypes.Document.id, "Document updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), doc_id.toInt)
                    Activity.saveLog(act)

                  }
                  //  println("Parent type -- " + parent_id);
                  if (parentType.equals("DIVISION")) {
                    if (!documentMaster.isEmpty) {
                      // println(" i  m  here ")
                      //  Redirect(routes.Documents.documentOverview() + "#" + documentMaster.get.parent_id);
                      val url = "/document-overview?" + documentMaster.get.parent_id
                      println("url   " + url)
                      Redirect(url);
                    } else {
                      Redirect(routes.Documents.documentOverview());
                    }

                  } else if (parentType.equals("PROGRAM") && !documentMaster.isEmpty)
                    Redirect(routes.Program.programDetails(documentMaster.get.parent_id.toString));
                  else if (parentType.equals("PROJECT") && !documentMaster.isEmpty)
                    Redirect(routes.ProjectMaster.projectDetails(documentMaster.get.parent_id.toString));
                  else if (parentType.equals("TASK") && !documentMaster.isEmpty)
                    Redirect(routes.Task.projectTaskDetails(documentMaster.get.parent_id.toString));
                  else if (parentType.equals("SUBTASK") && !documentMaster.isEmpty) {
                    val subTaskDetail = SubTaskServices.findSubTaskDetailsBySubtaskId(documentMaster.get.parent_id.toString)
                    Redirect(routes.Task.projectTaskDetails(subTaskDetail.get.task_id.toString));
                  } else
                    Redirect(routes.Login.loginUser());
                } else {
                  Redirect(routes.Login.loginUser());
                }
              } else {
                implicit val newFlash = request.flash + ("error" -> "Missing file")
                if (uploadType.equals("ADD")) {
                  BadRequest(views.html.frontend.documents.uploadDocument(ARTForms.documentForm.fill(document), documentType, document.title, document.parent_id.toString, document.parent_type.toString, uploadType, "", newFlash)).withSession(userSession)
                } else {
                  BadRequest(views.html.frontend.documents.uploadDocument(ARTForms.documentForm.fill(document), documentType, document.title, document.parent_id.toString, document.parent_type.toString, uploadType, document.parent_version_id.get.toString, newFlash)).withSession(userSession)
                }
              }
          }.getOrElse {
            implicit val newFlash = request.flash + ("error" -> "Something went wrong.")
            if (uploadType.equals("ADD")) {
              BadRequest(views.html.frontend.documents.uploadDocument(ARTForms.documentForm.fill(document), documentType, document.title, document.parent_id.toString, document.parent_type.toString, uploadType, "", newFlash)).withSession(userSession)
            } else {
              BadRequest(views.html.frontend.documents.uploadDocument(ARTForms.documentForm.fill(document), documentType, document.title, document.parent_id.toString, document.parent_type.toString, uploadType, document.parent_version_id.get.toString, newFlash)).withSession(userSession)
            }
          }

        })
    }.getOrElse {
      Redirect(routes.Login.loginUser()).withNewSession
    }
  }

  def documentListing(parent_id: String, parentType: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val documents = DocumentService.findAllDocuments(parent_id, parentType, "", "", "")
      Ok(views.html.frontend.documents.documentListing(documents, parentType));
    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }
  }

  def searchDocument() = Action { implicit request =>
    request.session.get("username").map { user =>
      val userSession = request.session + ("uId" -> request.session.get("uId").get) + ("username" -> request.session.get("username").get) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
      var documentType = new java.util.HashMap[String, String]()
      val doc_type_list = DocumentTypeService.findAllDocumentTypes()
      for (d <- doc_type_list) {
        documentType.put(d.id.get.toString, d.document_type.toString())
      }
      val divisions = DivisionService.findAllDivisions
      val programs = ProgramService.findAllProgramList
      val projects = ProjectService.findProjectList
      val tasks = TaskService.findAllTasks
      val subTasks = SubTaskServices.findAllSubTasks
      val users = UserService.findAllUsers

      Ok(views.html.frontend.documents.searchDocument(ARTForms.searchDocument, documentType, divisions, programs, projects, tasks, subTasks, users)).withSession(userSession)
    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }
  }

  def searchResult() = Action { implicit request =>
    request.session.get("username").map { user =>
      val userSession = request.session + ("uId" -> request.session.get("uId").get) + ("username" -> request.session.get("username").get) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
      var documentType = new java.util.HashMap[String, String]()
      val doc_type_list = DocumentTypeService.findAllDocumentTypes()
      for (d <- doc_type_list) {
        documentType.put(d.id.get.toString, d.document_type.toString())
      }
      val divisions = DivisionService.findAllDivisions
      val programs = ProgramService.findAllProgramList
      val projects = ProjectService.findProjectList
      val tasks = TaskService.findAllTasks
      val subTasks = SubTaskServices.findAllSubTasks
      val users = UserService.findAllUsers
      ARTForms.searchDocument.bindFromRequest.fold(
        errors => {
          println("errors -- " + errors.data)
          Ok(views.html.frontend.documents.searchDocument(ARTForms.searchDocument, documentType, divisions, programs, projects, tasks, subTasks, users)).withSession(userSession)
        },
        searchForm => {

          var searchText: String = if (!searchForm.search_filter.isEmpty) searchForm.search_filter.get else "";
          var divisionId: String = if (!searchForm.division.isEmpty) searchForm.division.get.toString else "";
          var programId: String = if (!searchForm.program.isEmpty) searchForm.program.get.toString else "";
          var projectId: String = if (!searchForm.project.isEmpty) searchForm.project.get.toString else "";
          var taskId: String = if (!searchForm.task.isEmpty) searchForm.task.get.toString else "";
          var subTaskId: String = if (!searchForm.sub_task.isEmpty) searchForm.sub_task.get.toString else "";
          var documentType: String = if (!searchForm.document_type.isEmpty) searchForm.document_type.get.toString else "";
          var userId: String = if (!searchForm.user.isEmpty) searchForm.user.get.toString else "";
          var searchScope: String = if (!searchForm.search_scope.isEmpty) searchForm.search_scope.get.toString else "";
          var parentType: String = "";
          var parentId: String = "";
          var searchTitle: String = "";
          var isCurrentDocumentPresent: String = ""
          var isPreviousDocumentPresent: String = ""
          if (StringUtils.isNotEmpty(subTaskId)) {
            parentType = "SUBTASK";
            parentId = subTaskId;
            val subtask = SubTaskServices.findSubTaskDetailsBySubtaskId(parentId).get
            searchTitle = subtask.task

          } else if (StringUtils.isNotEmpty(taskId)) {
            parentType = "TASK";
            parentId = taskId;
            val task = TaskService.findTaskDetailsByTaskId(Integer.parseInt(parentId)).get
            searchTitle = task.task_title

          } else if (StringUtils.isNotEmpty(projectId)) {
            parentType = "PROJECT";
            parentId = projectId;
            val project = ProjectService.findProjectDetails(Integer.parseInt(parentId)).get
            searchTitle = project.project_name

          } else if (StringUtils.isNotEmpty(programId)) {
            parentType = "PROGRAM";
            parentId = programId;

            val program = ProgramService.findProgramMasterDetailsById(parentId).get
            searchTitle = program.program_name
            val division = DivisionService.findDivisionById(ProgramService.findProgramOtherDetailsById(program.program_id.toString()).get.devison).get.division
          } else if (StringUtils.isNotEmpty(divisionId)) {
            parentType = "DIVISION";
            parentId = divisionId;
            searchTitle = DivisionService.findDivisionById(parentId.toInt).get.division
          } else {
            parentType = "DIVISION";
          }
          var documents = DocumentService.findAllDocuments(parentId, parentType, searchText, documentType, userId);
          var currentVersions = new java.util.HashMap[String, Seq[VersionDetails]]()
          var previousVersions = new java.util.HashMap[String, Seq[VersionDetails]]()
          for (d <- documents) {
            var currentVersionList = DocumentService.searchAllCurrentVersions(d.Id.get.toString, documentType, userId)
            var previousVersionList = DocumentService.searchAllPreviousVersionDocuments(d.Id.get.toString, documentType, userId)
            currentVersions.put(d.Id.get.toString, currentVersionList)
            previousVersions.put(d.Id.get.toString, previousVersionList)
            if (StringUtils.isEmpty(isCurrentDocumentPresent) && currentVersionList.size > 0) {
              isCurrentDocumentPresent = "YES";
            }
            if (StringUtils.isEmpty(isPreviousDocumentPresent) && previousVersionList.size > 0) {
              isPreviousDocumentPresent = "YES";
            }
          }
          val searchCriteria = SearchCriteria(Option(searchText), Option(parentId), Option(parentType), Option(documentType), Option(searchScope), Option(userId), Option(searchTitle));
          var searchCriteriaForm = ARTForms.searchCriteria.fill(searchCriteria)
          // println("documents====      " + documents);
          Ok(views.html.frontend.documents.searchResult(searchCriteriaForm, documents, currentVersions, previousVersions, isCurrentDocumentPresent, isPreviousDocumentPresent, parentType)).withSession(userSession)
        });
      //Ok("SUCCESS");
    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }
  }

  def getDocuments(requestedDocumentType: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val userSession = request.session + ("uId" -> request.session.get("uId").get) + ("username" -> request.session.get("username").get) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
      ARTForms.searchCriteria.bindFromRequest.fold(
        errors => {
          Ok("Something Went Worng").withSession(userSession)
        },
        searchCriteria => {

          var searchText: String = if (!searchCriteria.searchText.isEmpty) searchCriteria.searchText.get else "";
          var parentId: String = if (!searchCriteria.parentId.isEmpty) searchCriteria.parentId.get.toString else "";
          var parentType: String = if (!searchCriteria.parentType.isEmpty) searchCriteria.parentType.get else "";
          var documentType: String = if (!searchCriteria.documentType.isEmpty) searchCriteria.documentType.get.toString else "";
          var userId: String = if (!searchCriteria.userId.isEmpty) searchCriteria.userId.get.toString else "";
          var searchScope: String = if (!searchCriteria.searchScope.isEmpty) searchCriteria.searchScope.get.toString else "";
          var title: String = if (!searchCriteria.searchTitle.isEmpty) searchCriteria.searchTitle.get.toString else "";
          var isCurrentDocumentPresent: String = ""
          var isPreviousDocumentPresent: String = ""
          var documents: Seq[DocumentMaster] = null;
          if (requestedDocumentType.equals("DIVISION")) {
            documents = DocumentService.findAllDocuments(parentId, parentType, searchText, documentType, userId);
          } else if (requestedDocumentType.equals("PROGRAM")) {
        
            documents = DocumentService.findProgramDocuments(parentId, parentType, searchText);
          } else if (requestedDocumentType.equals("PROJECT")) {

            documents = DocumentService.findProjectDocuments(parentId, parentType, searchText);
          } else if (requestedDocumentType.equals("TASK")) {

            documents = DocumentService.findTaskDocuments(parentId, parentType, searchText);
          } else if (requestedDocumentType.equals("SUBTASK")) {

            documents = DocumentService.findSubTaskDocuments(parentId, parentType, searchText);
          } else {
            //subtitle = DivisionService.findDivisionById(parentId.toInt).get.division
            documents = DocumentService.findAllDocuments(parentId, parentType, searchText, documentType, userId);
          }

          var currentVersions = new java.util.HashMap[String, Seq[VersionDetails]]()
          var previousVersions = new java.util.HashMap[String, Seq[VersionDetails]]()

          for (d <- documents) {
            var currentVersionList = DocumentService.searchAllCurrentVersions(d.Id.get.toString, documentType, userId)
            var previousVersionList = DocumentService.searchAllPreviousVersionDocuments(d.Id.get.toString, documentType, userId)
            currentVersions.put(d.Id.get.toString, currentVersionList)
            previousVersions.put(d.Id.get.toString, previousVersionList)
            if (StringUtils.isEmpty(isCurrentDocumentPresent) && currentVersionList.size > 0) {
              isCurrentDocumentPresent = "YES";
            }
            if (StringUtils.isEmpty(isPreviousDocumentPresent) && previousVersionList.size > 0) {
              isPreviousDocumentPresent = "YES";
            }
          }
          Ok(views.html.frontend.documents.searchResult(ARTForms.searchCriteria.fill(searchCriteria), documents, currentVersions, previousVersions, isCurrentDocumentPresent, isPreviousDocumentPresent, requestedDocumentType)).withSession(userSession)
        });
    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }
  }

  def getTaskByProject(projectId: String) = Action { implicit request =>
    var finalString = ""
    val uId = request.session.get("uId").get
    var tasks: Seq[Tasks] = null;
    if (StringUtils.isNotBlank(projectId)) {
      tasks = TaskService.findTaskListByProjectId(projectId);
    } else {
      tasks = TaskService.findAllTasks
    }
    var pr_name = ""
    finalString = "<option value='' class='blank'>--- Choose Task ---</option>"
    for (task <- tasks) {
      if (task.task_title.length() > 50) {
        pr_name = task.task_title.substring(0, 50) + ".."
      } else {
        pr_name = task.task_title
      }
      finalString = finalString + " <option value='" + task.tId + "'>" + pr_name + "</option>"
    }
    Ok(finalString)
  }

  def getSubtaskByTask(taskId: String) = Action { implicit request =>
    var finalString = ""
    val uId = request.session.get("uId").get
    var subtasks: Seq[SubTasks] = null;
    if (StringUtils.isNotBlank(taskId)) {
      subtasks = SubTaskServices.findSubTasksByTask(taskId);
    } else {
      subtasks = SubTaskServices.findAllSubTasks
    }
    var pr_name = ""
    finalString = "<option value='' class='blank'>--- Choose Sub Task ---</option>"
    for (subtask <- subtasks) {
      if (subtask.task.length() > 50) {
        pr_name = subtask.task.substring(0, 50) + ".."
      } else {
        pr_name = subtask.task
      }
      finalString = finalString + " <option value='" + subtask.sub_task_id + "'>" + pr_name + "</option>"
    }
    Ok(finalString)
  }

  def uploadProgramFromFile() = Action(parse.multipartFormData) { implicit request =>

    request.body.file("upload_doc").map {
      upload_doc =>
        // println("document -- " + upload_doc.filename);
        val fileInputStream = new FileInputStream(upload_doc.ref.file);
        ImportFromExcel.readExcelFileSaveToDatabase(fileInputStream)
    }
    Ok("hi, document values imported")
  }

  def documentDelete(document_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      DocumentService.deleteDocumentMaster(document_id)

      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Document.id, "Document deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), document_id.toInt)
      Activity.saveLog(act)
      Ok("Success");
    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }
  }

}