package services

import java.io.File
import scala.Option.option2Iterable
import org.apache.commons.lang3.StringUtils
import anorm._
import anorm.sqlToSimple
//import anorm.toParameterValue
import models.DocumentMaster
import models.VersionDetails
import play.Play
import play.api.Play.current
import play.api.db.DB
import models.CustomColumns
import SqlParser._
import scala.util.control.Exception._
object DocumentService extends CustomColumns {

  def insertNewDocument(document: DocumentMaster): Long = {
    DB.withConnection { implicit connection =>

      val lastSave = SQL(
        """
          insert into document_master ( extension, parent_type, parent_id,
           title, updated_at, is_active
         ) values (
           {extension},{parent_type},{parent_id},
          {title}, {updated_at}, {is_active})
          """).on(
          'extension -> document.extension,
          'parent_type -> document.parent_type,
          'parent_id -> document.parent_id,
          'title -> document.title,
          'updated_at -> document.updated_at,
          'is_active -> document.is_active).executeInsert(scalar[Long].singleOpt)

      lastSave.last
    }
  }

  def insertVersionDetails(versionDetails: VersionDetails): Long = {
    DB.withConnection { implicit connection =>

      val lastSave = SQL(
        """
          insert into version_details (document_id, user_id, version_no, version_alias,
           version_notes, is_deleted, document_type, creation_date, file_name, file_path
         ) values (
           {document_id}, {user_id}, {version_no},{version_alias},
          {version_notes},{is_deleted}, {document_type}, {creation_date}, {file_name}, {file_path})
          """).on(
          'document_id -> versionDetails.document_id,
          'user_id -> versionDetails.user_id,
          'version_no -> versionDetails.version_no.bigDecimal,
          'version_alias -> versionDetails.version_alias,
          'version_notes -> versionDetails.version_notes,
          'is_deleted -> versionDetails.is_deleted,
          'document_type -> versionDetails.document_type,
          'creation_date -> versionDetails.creation_date,
          'file_name -> versionDetails.file_name,
          'file_path -> versionDetails.file_path).executeInsert(scalar[Long].singleOpt)
      lastSave.last
    }
  }

  def updateDocumentMaster(documentMaster: DocumentMaster): Int = {
    //println("Extension - " + documentMaster.extension );
    // println("Updation Date  - " + documentMaster.updated_at  );
    DB.withConnection { implicit connection =>
      SQL(
        """
          update document_master
          set
          extension = {extension},
          parent_type={parent_type},
          parent_id = {parent_id},
          title = {title},
          updated_at = {updated_at},
          is_active = {is_active}
          where id = {id}
          """).on(
          'id -> documentMaster.Id,
          'extension -> documentMaster.extension,
          'parent_type -> documentMaster.parent_type,
          'parent_id -> documentMaster.parent_id,
          'title -> documentMaster.title,
          'updated_at -> documentMaster.updated_at,
          'is_active -> documentMaster.is_active).executeUpdate()
    }
  }

  def updateCurrentVerionToPrevious(versionDetails: VersionDetails): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update version_details
          set
          document_id = {document_id},
          user_id={user_id},
          version_no = {version_no},
          version_alias = {version_alias},
          version_notes = {version_notes},
          parent_version_id={parent_version_id},
          is_deleted={is_deleted},
          document_type={document_type},    
          creation_date={creation_date},
          file_name={file_name},
          file_path={file_path}
          where id = {id}
          """).on(
          'id -> versionDetails.id,
          'document_id -> versionDetails.document_id,
          'user_id -> versionDetails.user_id,
          'version_no -> versionDetails.version_no.bigDecimal,
          'version_alias -> versionDetails.version_alias,
          'version_notes -> versionDetails.version_notes,
          'parent_version_id -> versionDetails.parent_version_id,
          'is_deleted -> versionDetails.is_deleted,
          'document_type -> versionDetails.document_type,
          'creation_date -> versionDetails.creation_date,
          'file_name -> versionDetails.file_name,
          'file_path -> versionDetails.file_path).executeUpdate()
    }
  }

  def deleteCurrentVersion(versionDetails: Option[VersionDetails]): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update version_details
          set
          document_id = {document_id},
          user_id={user_id},
          version_no = {version_no},
          version_alias = {version_alias},
          version_notes = {version_notes},
          parent_version_id=0,
          is_deleted=1,
          document_type={document_type},    
          creation_date={creation_date},
          file_name={file_name},
          file_path={file_path}
          where id = {id}
          """).on(
          'id -> versionDetails.get.id,
          'document_id -> versionDetails.get.document_id,
          'user_id -> versionDetails.get.user_id,
          'version_no -> versionDetails.get.version_no.bigDecimal,
          'version_alias -> versionDetails.get.version_alias,
          'version_notes -> versionDetails.get.version_notes,
          'document_type -> versionDetails.get.document_type,
          'creation_date -> versionDetails.get.creation_date,
          'file_name -> versionDetails.get.file_name,
          'file_path -> versionDetails.get.file_path).executeUpdate()
    }
  }

  def updatePreviousToCurrent(versionDetails: Option[VersionDetails]): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update version_details
          set
          document_id = {document_id},
          user_id={user_id},
          version_no = {version_no},
          version_alias = {version_alias},
          version_notes = {version_notes},
          parent_version_id=null,
          is_deleted=0,
          document_type={document_type},    
          creation_date={creation_date},
          file_name={file_name},
          file_path={file_path}
          where id = {id}
          """).on(
          'id -> versionDetails.get.id,
          'document_id -> versionDetails.get.document_id,
          'user_id -> versionDetails.get.user_id,
          'version_no -> versionDetails.get.version_no.bigDecimal,
          'version_alias -> versionDetails.get.version_alias,
          'version_notes -> versionDetails.get.version_notes,
          'document_type -> versionDetails.get.document_type,
          'creation_date -> versionDetails.get.creation_date,
          'file_name -> versionDetails.get.file_name,
          'file_path -> versionDetails.get.file_path).executeUpdate()
    }
  }

  def findAllDocuments(parent_id: String, parent_type: String, searchText: String, documentType: String, userId: String): Seq[DocumentMaster] = {
    var sqlString = "SELECT  * from document_master "
    if (StringUtils.isNotEmpty(parent_id) && StringUtils.isNotEmpty(parent_type)) {
      sqlString = sqlString + " WHERE parent_id =" + parent_id + " and parent_type = '" + parent_type + "'  ";

    } else if (StringUtils.isNotEmpty(parent_id)) {
      sqlString = sqlString + " WHERE parent_id =" + parent_id + "' ";

    } else if (StringUtils.isNotEmpty(parent_type)) {
      sqlString = sqlString + " WHERE parent_type = '" + parent_type + "'  ";
    }

    sqlString = sqlString + " AND is_active = 1 "

    if (StringUtils.isNotEmpty(searchText)) {
      if (sqlString.contains("WHERE"))
        sqlString = sqlString + " AND title LIKE '%" + searchText + "%' ";
      else
        sqlString = sqlString + " WHERE title LIKE '%" + searchText + "%'";
    }
    sqlString = sqlString + "  order by updated_at desc"

    DB.withConnection { implicit connection =>
      SQL(sqlString).as(DocumentMaster.documentMaster *)
    }

  }

  def findProgramDocuments(parent_id: String, parentType: String, searchText: String): Seq[DocumentMaster] = {
    var sql = "";
    // println("parentType=   " + parentType)

    if (StringUtils.isNotEmpty(searchText)) {
      sql = "SELECT * FROM document_master WHERE title LIKE '%" + searchText + "%' AND ";
    } else {
      sql = "SELECT * FROM document_master WHERE ";
    }
    if (parentType.equals("DIVISION")) {
      if (StringUtils.isNotEmpty(parent_id)) {
        sql = sql + "parent_type = 'PROGRAM' AND parent_id IN( select pm.program_id from art_program pm where ( pm.devison = " + parent_id + "))"
      } else {
        sql = sql + "parent_type = 'PROGRAM'"
      }
    } else if (parentType.equals("PROGRAM")) {
      if (StringUtils.isNotEmpty(parent_id)) {
        sql = sql + "parent_type = 'PROGRAM' AND parent_id IN( select pm.program_id from art_program pm where ( pm.devison = " + parent_id + "))"
      } else {
        sql = sql + "parent_type = 'PROGRAM'"
      }
    } else if (parentType.equals("PROJECT")) {
      if (StringUtils.isNotEmpty(parent_id)) {
        sql = sql + "parent_type = 'PROJECT' AND parent_id = " + parent_id
      } else {
        sql = sql + "parent_type = 'PROJECT'"
      }
    }

    sql = sql + " AND is_active =1 order by updated_at desc";
    // println("program Sql -- " + sql);
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(DocumentMaster.documentMaster *)
      result
    }
  }

  def findProjectDocuments(parent_id: String, parentType: String, searchText: String): Seq[DocumentMaster] = {
    var sql = "";
    // println("parentType=   " + parentType)

    if (StringUtils.isNotEmpty(searchText)) {
      sql = "SELECT * FROM document_master WHERE title LIKE '%" + searchText + "%' AND ";
    } else {
      sql = "SELECT * FROM document_master WHERE ";
    }
    if (parentType.equals("DIVISION")) {
      if (StringUtils.isNotEmpty(parent_id)) {
        sql = sql + "parent_type = 'PROJECT' AND parent_id IN( select pm.pId from art_project_master pm where ( pm.program IN ( select  DISTINCT(program_id) from art_program where devison=" + parent_id + " ) ))"
      } else {
        sql = sql + "parent_type = 'PROJECT'"
      }
    } else if (parentType.equals("PROGRAM")) {
      if (StringUtils.isNotEmpty(parent_id)) {
        sql = sql + "parent_type = 'PROJECT' AND parent_id IN( select pm.pId from art_project_master pm where ( pm.program = " + parent_id + "))"
      } else {
        sql = sql + "parent_type = 'PROJECT'"
      }
    } else if (parentType.equals("PROJECT")) {
      if (StringUtils.isNotEmpty(parent_id)) {
        sql = sql + "parent_type = 'PROJECT' AND parent_id = " + parent_id
      } else {
        sql = sql + "parent_type = 'PROJECT'"
      }
    }

    sql = sql + " AND is_active =1 order by updated_at desc";
    //println("project Sql -- " + sql);
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(DocumentMaster.documentMaster *)
      result
    }
  }

  def findTaskDocuments(parentId: String, parentType: String, searchText: String): Seq[DocumentMaster] = {
    var sql = "";
    if (StringUtils.isNotEmpty(searchText)) {
      sql = "SELECT * FROM document_master WHERE title LIKE '%" + searchText + "%' AND ";
    } else {
      sql = "SELECT * FROM document_master WHERE ";
    }
    if (parentType.equals("DIVISION")) {
      if (StringUtils.isNotEmpty(parentId)) {
        sql = sql + "parent_type = 'TASK' AND parent_id IN  (select ts.tId from art_task ts where ts.pId IN (select pm.pId from art_project_master pm where pm.program  IN ( select  DISTINCT(program_id) from art_program where devison=" + parentId + " ) ))"
      } else {
        sql = sql + "parent_type = 'TASK'";
      }
    } else if (parentType.equals("PROGRAM")) {
      if (StringUtils.isNotEmpty(parentId)) {
        sql = sql + "parent_type = 'TASK' AND parent_id IN  (select ts.tId from art_task ts where ts.pId IN (select pm.pId from art_project_master pm where pm.program = " + parentId + "))"
      } else {
        sql = sql + "parent_type = 'TASK'";
      }
    } else if (parentType.equals("PROJECT")) {
      if (StringUtils.isNotEmpty(parentId)) {
        sql = sql + "parent_type = 'TASK' AND parent_id IN  (select ts.tId from art_task ts where ts.pId = " + parentId + ")";
      } else {
        sql = sql + "parent_type = 'TASK'";
      }
    } else if (parentType.equals("TASK")) {
      if (StringUtils.isNotEmpty(parentId)) {
        sql = sql + "parent_type = 'TASK' AND parent_id = " + parentId
      } else {
        sql = sql + "parent_type = 'TASK'";
      }
    }
    sql = sql + " AND is_active = 1 order by updated_at desc";
    // println("Task Sql -- " + sql);
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(DocumentMaster.documentMaster *)
      result
    }
  }

  def findSubTaskDocuments(parentId: String, parentType: String, searchText: String): Seq[DocumentMaster] = {
    var sql = ""
    if (StringUtils.isNotEmpty(searchText)) {
      sql = "SELECT * FROM document_master WHERE title LIKE '%" + searchText + "%' AND ";
    } else {
      sql = "SELECT * FROM document_master WHERE ";
    }
    if (parentType.equals("DIVISION")) {
      if (StringUtils.isNotEmpty(parentId)) {
        sql = sql + "parent_type = 'SUBTASK' AND parent_id IN (select st.sub_task_id from art_sub_task st where st.task_id IN (select ts.tId from art_task ts where ts.pId IN (select pm.pId from art_project_master pm where pm.program IN (select DISTINCT(program_id) from art_program where devison= " + parentId + "))))"
      } else {
        sql = sql + "parent_type = 'SUBTASK' ";
      }
    } else if (parentType.equals("PROGRAM")) {
      if (StringUtils.isNotEmpty(parentId)) {
        sql = sql + "parent_type = 'SUBTASK' AND parent_id IN (select st.sub_task_id from art_sub_task st where st.task_id IN (select ts.tId from art_task ts where ts.pId IN (select pm.pId from art_project_master pm where pm.program = " + parentId + ")))"
      } else {
        sql = sql + "parent_type = 'SUBTASK' ";
      }
    } else if (parentType.equals("PROJECT")) {
      if (StringUtils.isNotEmpty(parentId)) {
        sql = sql + "parent_type = 'SUBTASK' AND parent_id IN (select st.sub_task_id from art_sub_task st where st.task_id IN (select ts.tId from art_task ts where ts.pId =  " + parentId + "))"
      } else {
        sql = sql + "parent_type = 'SUBTASK' ";
      }
    } else if (parentType.equals("TASK")) {
      if (StringUtils.isNotEmpty(parentId)) {
        sql = sql + "parent_type = 'SUBTASK' AND parent_id IN (select st.sub_task_id from art_sub_task st where st.task_id = " + parentId + ")"
      } else {
        sql = sql + "parent_type = 'SUBTASK' ";
      }
    } else if (parentType.equals("SUBTASK")) {
      if (StringUtils.isNotEmpty(parentId)) {
        sql = sql + "parent_type = 'SUBTASK' AND parent_id = " + parentId
      } else {
        sql = sql + "parent_type = 'SUBTASK' ";
      }
    }
    sql = sql + " AND is_active =1 order by updated_at desc";
    //println("Sub Task Sql -- " + sql);
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(DocumentMaster.documentMaster *)
      result
    }
  }

  def findDocumentById(document_id: String): Option[DocumentMaster] = {
    var sqlString = ""
    sqlString = "SELECT  * from document_master where  is_active =1 AND id =" + document_id;
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(DocumentMaster.documentMaster.singleOpt)
    }

  }

  def findAllCurrentVersions(document_id: String): Option[VersionDetails] = {
    var sqlString = ""
    sqlString = "SELECT  * from version_details where document_id =" + document_id + " and is_deleted = 0 and parent_version_id IS NULL";

    DB.withConnection { implicit connection =>
      SQL(sqlString).as(VersionDetails.versionDetails.singleOpt)
    }
  }

  def findAllCurrentVersionsFromVersionId(document_id: String): Option[VersionDetails] = {
    var sqlString = ""
    sqlString = "SELECT  * from version_details where document_id =" + document_id + " and is_deleted = 0 and parent_version_id IS NULL";

    DB.withConnection { implicit connection =>
      SQL(sqlString).as(VersionDetails.versionDetails.singleOpt)
    }
  }
  def searchAllCurrentVersions(document_id: String, documentType: String, userId: String): Seq[VersionDetails] = {
    var sqlString = ""
    sqlString = "SELECT  * from version_details where document_id =" + document_id + " and is_deleted = 0 and parent_version_id IS NULL";
    if (StringUtils.isNotEmpty(documentType)) {
      sqlString = sqlString + " and document_type = " + documentType;
    }
    if (StringUtils.isNotEmpty(userId)) {
      sqlString = sqlString + " and user_id = " + userId;
    }
    //println("Sql == " + sqlString);
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(VersionDetails.versionDetails *)
    }
  }

  def findAllPreviousVersionDocument(document_id: String): Option[VersionDetails] = {
    var sqlString = ""
    sqlString = "SELECT  * from version_details where document_id =" + document_id + " and is_deleted = 0 and parent_version_id IS NOT NULL ORDER BY parent_version_id DESC";
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(VersionDetails.versionDetails.singleOpt)
    }
  }

  def searchAllPreviousVersionDocuments(document_id: String, documentType: String, userId: String): Seq[VersionDetails] = {
    var sqlString = ""
    sqlString = "SELECT  * from version_details where document_id =" + document_id + " and is_deleted = 0 and parent_version_id IS NOT NULL";
    if (StringUtils.isNotEmpty(documentType)) {
      sqlString = sqlString + " and document_type = " + documentType;
    }
    if (StringUtils.isNotEmpty(userId)) {
      sqlString = sqlString + " and user_id = " + userId;
    }

    sqlString = sqlString + " ORDER BY parent_version_id DESC";
    //println("Sql == " + sqlString);
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(VersionDetails.versionDetails *)
    }
  }

  def findAllPreviousVersionDocuments(document_id: String): Seq[VersionDetails] = {
    var sqlString = ""
    sqlString = "SELECT  * from version_details where document_id =" + document_id + " and is_deleted = 0 and parent_version_id IS NOT NULL ORDER BY parent_version_id DESC";
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(VersionDetails.versionDetails *)
    }
  }

  def getFilePath(parent_id: String, parentType: String, uploadType: String): String = {
    var filePath: String = Play.application().configuration().getString("bdc.documents.location");
    var parentId = parent_id;
    if (uploadType.equals("Update")) {
      var documentMaster = DocumentService.findDocumentById(parentId);
      if (!documentMaster.isEmpty) {
        parentId = documentMaster.get.parent_id.toString;
      } else {
        parentId = parent_id
      }

    }
    if (parentType.equals("PROGRAM")) {
      val program = ProgramService.findProgramMasterDetailsById(parentId);
      filePath = "/" + program.get.program_code.toString + "/";
    } else if (parentType.equals("PROJECT")) {
      val project = ProjectService.findProjectDetails(Integer.parseInt(parentId));
      val program = ProgramService.findProgramMasterDetailsById(project.get.program.toString);
      filePath = "/" + program.get.program_code.toString + "/" + project.get.project_id.toString() + "/";
    } else if (parentType.equals("TASK")) {
      val task = TaskService.findTaskDetailsByTaskId(Integer.parseInt(parentId))
      val project = ProjectService.findProjectDetails(Integer.parseInt(task.get.pId.toString));
      val program = ProgramService.findProgramMasterDetailsById(project.get.program.toString);
      filePath = "/" + program.get.program_code.toString.toString() + "/" + project.get.project_id.toString() + "/" + task.get.task_code.toString() + "/";
      //println("File Path [DocumentService] -- " + filePath);
    } else if (parentType.equals("SUBTASK")) {
      var subTask = SubTaskServices.findSubTaskDetailsBySubtaskId(parentId);
      var task = TaskService.findTaskDetailsByTaskId(Integer.parseInt(subTask.get.task_id.toString));
      val project = ProjectService.findProjectDetails(Integer.parseInt(task.get.pId.toString));
      val program = ProgramService.findProgramMasterDetailsById(project.get.program.toString);
      filePath = "/" + program.get.program_code.toString + "/" + project.get.project_id.toString() + "/" + task.get.task_code.toString() + "/" + subTask.get.sub_task_id.get.toString + "/";
    }
    return filePath;
  }

  def createFolderForHistoricalData(parentId: String, parentType: String, fileName: String, currentPath: String): String = {

    var filePath: String = Play.application().configuration().getString("bdc.documents.location") + "/PreviousVersion";
    //println("File Path first level -- " + filePath);
    var file = new File(filePath)
    //println("FIle Pathe --- " + filePath);
    //println("First Level -- " + file);
    //println("Creating directory first level -- " + file.mkdir());
    if (parentType.equals("PROGRAM")) {
      val program = ProgramService.findProgramMasterDetailsById(parentId);
      filePath = filePath + "/" + program.get.program_code.toString;
      file = new File(filePath)
      //println("Second make dir - " + file.mkdir());
    } else if (parentType.equals("PROJECT")) {
      val project = ProjectService.findProjectDetails(Integer.parseInt(parentId));
      val program = ProgramService.findProgramMasterDetailsById(project.get.program.toString);
      filePath = filePath + "/" + program.get.program_code.toString;
      file = new File(filePath)
      file.mkdir()
      filePath = filePath + "/" + project.get.project_id.toString()
      file = new File(filePath)
      file.mkdir()
    } else if (parentType.equals("TASK")) {
      val task = TaskService.findTaskDetailsByTaskId(Integer.parseInt(parentId))
      val project = ProjectService.findProjectDetails(Integer.parseInt(task.get.pId.toString));
      val program = ProgramService.findProgramMasterDetailsById(project.get.program.toString);
      filePath = filePath + "/" + program.get.program_code.toString;
      file = new File(filePath)
      file.mkdir()
      filePath = filePath + "/" + project.get.project_id.toString()
      file = new File(filePath)
      file.mkdir()
      filePath = filePath + "/" + task.get.task_code.toString()
      file = new File(filePath)
      file.mkdir()
    } else if (parentType.equals("SUBTASK")) {
      var subTask = SubTaskServices.findSubTaskDetailsBySubtaskId(parentId);
      var task = TaskService.findTaskDetailsByTaskId(Integer.parseInt(subTask.get.task_id.toString));
      val project = ProjectService.findProjectDetails(Integer.parseInt(task.get.pId.toString));
      val program = ProgramService.findProgramMasterDetailsById(project.get.program.toString);
      filePath = filePath + "/" + program.get.program_code.toString;
      file = new File(filePath)
      file.mkdir()
      filePath = filePath + "/" + project.get.project_id.toString()
      file = new File(filePath)
      file.mkdir()
      filePath = filePath + "/" + task.get.task_code.toString()
      file = new File(filePath)
      file.mkdir()
      filePath = filePath + "/" + subTask.get.sub_task_id.get.toString
      file = new File(filePath)
      file.mkdir()
    }

    file = new File(currentPath + fileName)
    //println("File Name -- " + (currentPath + fileName));
    file.renameTo(new File(filePath + "/" + fileName))
    return "/documents/" + filePath.substring(7) + "/" + fileName;

  }

  def deleteDocumentMaster(id: String): Int = {
    try {
      var currentVersion = findAllCurrentVersions(id);
      if (!currentVersion.isEmpty) {
        var deletedCurrentVersion = deleteCurrentVersion(currentVersion)
      }
      var latestPreviousVersion = getLatestPreviousVersion(id);
      if (!latestPreviousVersion.isEmpty) {
        updatePreviousToCurrent(latestPreviousVersion);
      } else {
        DB.withConnection { implicit connection =>
          SQL(
            """
		        update document_master
		        set
		        is_active=0
		        where id = {id}
		        """).on('id -> id).executeUpdate()
        }
      }
      return 0;
    } catch {
      case t: Throwable => return -1;
    }
  }

  def getLatestPreviousVersion(id: String) = {
    var sqlString = "Select * from version_details where parent_version_id = (select MAX(parent_version_id) from version_details) and is_deleted = 0 and document_id = " + id;

    DB.withConnection { implicit connection =>
      SQL(sqlString).as(VersionDetails.versionDetails.singleOpt)
    }

    /*
    DB.withConnection { implicit connection =>
      SQL(
        """
        update document_master
        set
        is_active=0
        where id = {id}
        """).on('id -> id).executeUpdate()
    }*/
  }

  def findDocumentDetails(parent_type: String, parent_id: String) = {
    DB.withConnection { implicit connection =>
      var sql = ""
      
      parent_type match {
        case "DIVISION" =>
          sql = "select di.division, 'NA' as program_name, 'NA' as project_name, 'NA' as task_title, 'NA' as title  from art_division_master di where di.dId= " + parent_id + ""
        case "PROGRAM" =>
          sql = "select di.division,pro.program_name, 'NA' as project_name, 'NA' as task_title, 'NA' as title  from art_division_master di,art_program pro where di.dId=pro.devison AND pro.program_id= " + parent_id + ""
        case "PROJECT" =>
          sql = "select di.division, pro.program_name, pr.project_name, 'NA' as task_title, 'NA' as title from art_division_master di,art_program pro,art_project_master pr where di.dId=pro.devison AND pro.program_id = pr.program AND pr.pId= " + parent_id + ""
        case "TASK" =>
          sql = "select di.division, pro.program_name, pr.project_name, t.task_title, 'NA' as title  from art_division_master di ,art_program pro,art_project_master pr,art_task t where di.dId=pro.devison AND pro.program_id = pr.program AND pr.pId=t.pId AND t.tId= " + parent_id + ""
        case "SUBTASK" =>
          sql = "select di.division, pro.program_name, pr.project_name, t.task_title,s.title from art_division_master di,art_program pro,art_project_master pr,art_task t,art_sub_task s where di.dId=pro.devison AND pro.program_id = pr.program AND pr.pId=t.pId AND t.tId= s.task_id and s.sub_task_id=" + parent_id + ""

      }
      //  println(sql + "----------------")
      val result =
        SQL(sql).as(models.SearchResultDocumentMaster.searchResultObject.singleOpt)
      result

    }

  }
}