package models
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB

case class Documents(Id: Option[Int], parent_type: String, parent_id: Int, title: String,
  document_type: Int, version_alias: String, version_notes: String,
  parent_version_id: Option[Int], is_active: Option[Int])

object Documents extends CustomColumns {

  val document = {
    get[Option[Int]]("id") ~
      get[String]("parent_type") ~
      get[Int]("parent_id") ~
      get[String]("title") ~
      get[Int]("document_type") ~
      get[String]("version_alias") ~
      get[String]("version_notes") ~
      get[Option[Int]]("parent_version_id") ~
      get[Option[Int]]("is_active") map {
        case id ~ parent_type ~ parent_id ~ title ~ document_type ~ version_alias ~ version_notes ~ parent_version_id ~ is_active =>
          Documents(id, parent_type, parent_id, title, document_type, version_alias, version_notes, parent_version_id, is_active)
      }
  }

}

case class DocumentMaster(Id: Option[Int]=None, extension: String, parent_type: String, parent_id: Int, title: String, updated_at: Date, is_active: Int)

object DocumentMaster {

  val documentMaster = {
    get[Option[Int]]("id") ~
      get[String]("extension") ~
      get[String]("parent_type") ~
      get[Int]("parent_id") ~
      get[String]("title") ~
      get[Date]("updated_at") ~
      get[Int]("is_active") map {
        case id ~ extension ~ parent_type ~ parent_id ~ title ~ updated_at ~ is_active =>
          DocumentMaster(id, extension, parent_type, parent_id, title, updated_at, is_active)
      }
  }

}

case class SearchMaster(search_filter: Option[String], division: Option[Int], program: Option[Int], project: Option[Int], task: Option[Int],
  sub_task: Option[Int], user: Option[Int], document_type: Option[Int], search_scope: Option[Int])

object SearchMaster {

  val searchObject = {
    get[Option[String]]("search_filter") ~
      get[Option[Int]]("division") ~
      get[Option[Int]]("program") ~
      get[Option[Int]]("project") ~
      get[Option[Int]]("task") ~
      get[Option[Int]]("sub_task") ~
      get[Option[Int]]("user") ~
      get[Option[Int]]("document_type") ~
      get[Option[Int]]("search_scope") map {
        case search_filter ~ division ~ program ~ project ~ task ~ sub_task ~ user ~ document_type ~ search_scope =>
          SearchMaster(search_filter, division, program, project, task, sub_task, user, document_type, search_scope)
      }
  }

}

case class SearchCriteria(searchText: Option[String], parentId: Option[String], parentType: Option[String], documentType: Option[String],
  searchScope: Option[String], userId: Option[String], searchTitle: Option[String])

object SearchCriteria {

  val searchCriteria = {
    get[Option[String]]("searchText") ~
      get[Option[String]]("parentId") ~
      get[Option[String]]("parentType") ~
      get[Option[String]]("documentType") ~
      get[Option[String]]("searchScope") ~
      get[Option[String]]("userId") ~
      get[Option[String]]("title") map {
        case searchText ~ parentId ~ parentType ~ documentType ~ searchScope ~ userId ~ searchTitle =>
          SearchCriteria(searchText, parentId, parentType, documentType, searchScope, userId, searchTitle)
      }
  }
}

case class VersionDetails(id: Option[Int], document_id: Int, version_no: BigDecimal, version_alias: String, version_notes: String,
  parent_version_id: Option[Int], user_id: Int, is_deleted: Boolean, document_type: Int, creation_date: Date, file_name: String, file_path: String)

object VersionDetails extends CustomColumns {

  val versionDetails = {
    get[Option[Int]]("id") ~
      get[Int]("document_id") ~
      get[java.math.BigDecimal]("version_no") ~
      get[String]("version_alias") ~
      get[String]("version_notes") ~
      get[Option[Int]]("parent_version_id") ~
      get[Int]("user_id") ~
      get[Boolean]("is_deleted") ~
      get[Int]("document_type") ~
      get[Date]("creation_date") ~
      get[String]("file_name") ~
      get[String]("file_path") map {
        case id ~ document_id ~ version_no ~ version_alias ~ version_notes ~ parent_version_no ~ user_id ~ is_deleted ~ document_type ~ creation_date ~ file_name ~ file_path =>
          VersionDetails(id, document_id, version_no, version_alias, version_notes, parent_version_no, user_id, is_deleted, document_type, creation_date, file_name, file_path)
      }
  }

}

case class SearchResultDocumentMaster(division: Option[String], program_name: Option[String], project_name: Option[String], task_title: Option[String],
  title: Option[String])

object SearchResultDocumentMaster {
  val searchResultObject = {
    get[Option[String]]("division") ~
      get[Option[String]]("program_name") ~
      get[Option[String]]("project_name") ~
      get[Option[String]]("task_title") ~
      get[Option[String]]("title") map {
        case division ~ program_name ~ project_name ~ task_title ~ title =>
          SearchResultDocumentMaster(division, program_name, project_name, task_title, title)
      }
  }
}

object documentTypeValue extends Enumeration {
  type documentTypeValue = Value
  val Resolution, Presentation, Todo = Value
}

object parentTypeValue extends Enumeration {
  type documentTypeValue = Value
  val Program, Projects, Task, SubTask, Division = Value
}