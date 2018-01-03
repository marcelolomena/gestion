package services;
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
import com.typesafe.plugin._
import org.apache.commons.lang3.StringUtils
import play.Logger

object GenericService extends CustomColumns {

  def insertTask(task: GenericTasks, catalogue_service_id: Int): Long = {
    DB.withConnection { implicit connection =>

      val lastSave = SQL(
        """
          insert into art_generic_task (task_mode,task_title, task_code,
            plan_start_date, plan_end_date, 
            task_description,plan_time,creation_date,task_status, status, owner,task_discipline,
            completion_percentage,remark,task_depend,
            stage,user_role,deliverable,task_type, predefined_task_id,catalogue_service, is_active
         ) values (
            {task_mode},{task_title},{task_code},
            {plan_start_date},{plan_end_date},
            {task_description},{plan_time},{creation_date},{task_status},{status}, 
            {owner},{task_discipline},{completion_percentage},{remark},{task_depend},
            {stage},{user_role},{deliverable},{task_type}, {predefined_task_id},{catalogue_service}, {is_active}
          )
          """).on(
          'task_mode -> task.task_mode,
          'task_title -> task.task_title,
          'task_code -> task.task_code,
          'plan_start_date -> task.plan_start_date,
          'plan_end_date -> task.plan_end_date,
          'task_description -> task.task_description,
          'plan_time -> task.plan_time.bigDecimal,
          'creation_date -> task.creation_date,
          'task_status -> task.task_status,
          'status -> task.status,
          'owner -> task.owner,
          'task_discipline -> task.task_discipline,
          'completion_percentage -> task.completion_percentage,
          'remark -> task.remark,
          'task_depend -> task.task_depend,
          'stage -> task.stage,
          'user_role -> task.user_role,
          'deliverable -> task.deliverable,
          'task_type -> task.task_type,
          'predefined_task_id -> task.predefined_task_id,
          'catalogue_service -> catalogue_service_id,
          'is_active -> task.is_active).executeInsert(scalar[Long].singleOpt)

      lastSave.last
    }
  }

  def updateTask(task: GenericTasks): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_generic_task
          set 
            task_title={task_title},
            task_description = {task_description},
            task_discipline = {task_discipline},
            remark = {remark},
            task_depend={task_depend},
            stage={stage},
            user_role={user_role},
            deliverable={deliverable}
          where tId = {tId}
          """).on(
          'tId -> task.tId,
          'task_title -> task.task_title,
          'task_description -> task.task_description,
          'task_discipline -> task.task_discipline,
          'remark -> task.remark,
          'task_depend -> task.task_depend,
          'stage -> task.stage,
          'user_role -> task.user_role,
          'deliverable -> task.deliverable).executeUpdate()
    }
  }

  def deleteTaskFromProjectTemplate(tId: String): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_generic_task
          set 
            is_active=0
          where tId = {tId}
          """).on(
          'tId -> tId).executeUpdate()
    }
  }

  def UpdateDependency(task_id: String, selected_task: String): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_generic_task
          set 
            task_depend={task_depend}
          where tId = {tId}
          """).on(
          'tId -> task_id,
          'task_depend -> selected_task).executeUpdate()
    }
  }

  def deletePredefinedTask(tId: String): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_generic_task
          set 
            is_active=0
          where tId = {tId}
          """).on(
          'tId -> tId).executeUpdate()
    }
  }

  def updateDependecy(tId: String, task_depends: String): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_generic_task
          set 
            task_depend={task_depend}
          where tId = {tId}
          """).on(
          'tId -> tId, 'task_depend -> task_depends).executeUpdate()
    }
  }

  def findAllGenericTask: Seq[GenericTasks] = {
    DB.withConnection { implicit connection =>
      SQL("SELECT  * FROM art_generic_task where is_active=1 AND predefined_task_id <> 0").as(GenericTasks.tasks *)
    }
  }

  def findGenericProjectTypeTasks(id: String) = {
    DB.withConnection { implicit connection =>
      val sqlString = "select * from art_generic_task where task_mode = {id} AND is_active=1 AND predefined_task_id <> 0"
      val result = SQL(sqlString).on('id->id)as(
        GenericTasks.tasks *)
      result
    }
  }

  def validateGenericProjectTypeTasksDependency(task_mode: String, tId: String) = {

    var isValid = true
    val tasks = findGenericProjectTypeTasks(task_mode)
    if (tasks.size > 0) {

      for (t <- tasks) {
        if (!t.task_depend.isEmpty) {
          var tasks_depend_aarray = t.task_depend.get.split(",")
          for (td <- tasks_depend_aarray) {
            var task_id = StringUtils.trim(td)
            if (!StringUtils.isEmpty(task_id)) {
              if (task_id.toInt == tId.toInt) {
                isValid = false
              }
            }
          }
        }

      }
    }

    isValid

  }

  def findGenericTasksByPredefinedTaskId(id: String) = {
    DB.withConnection { implicit connection =>
      var sqlString = "select * from art_generic_task where predefined_task_id =  " + id + " AND is_active=1 AND predefined_task_id <> 0";
      val result = SQL(
        sqlString).on(
          'id -> id).as(
            GenericTasks.tasks *)
      result
    }
  }

  def findGenericTasksDetails(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_generic_task where tId = {id}  AND is_active=1 AND predefined_task_id <> 0").on(
          'id -> id).as(
            GenericTasks.tasks.singleOpt)

      result
    }
  }

  def findDependentTasks(task_mode: String, selected_tasks: String): Seq[GenericTasks] = {
    var sqlString = ""
    if (StringUtils.isBlank(selected_tasks) || StringUtils.equals(selected_tasks.trim(), "NaN")) {
      sqlString = "select * from art_generic_task where task_mode ='" + task_mode + "'  AND is_active=1 AND predefined_task_id <> 0"
    } else {
      sqlString = "select * from art_generic_task where task_mode ='" + task_mode + "' && tId NOT IN (" + selected_tasks + ")  AND is_active=1 AND predefined_task_id <> 0"
    }
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(GenericTasks.tasks *)
      result
    }
  }

  def insertPredefinedTask(task: PredefinedTasks): Long = {
    DB.withConnection { implicit connection =>

      val lastSave = SQL(
        """
          insert into art_predefined_task (task_type, task_title, task_description, task_discipline, remark, stage,user_role, 
          deliverable,catalogue_service, is_active
         ) values (
			    {task_type}, {task_title}, {task_description}, {task_discipline},{remark}, {stage},{user_role},{deliverable},{catalogue_service}, {is_active}
          )
          """).on(
          'task_type -> task.task_type,
          'task_title -> task.task_title,
          'task_description -> task.task_description,
          'task_discipline -> task.task_discipline,
          'remark -> task.remark,
          'stage -> task.stage,
          'user_role -> task.user_role,
          'deliverable -> task.deliverable,
          'catalogue_service -> task.catalogue_service,
          'is_active -> task.is_active).executeInsert(scalar[Long].singleOpt)

      lastSave.last
    }
  }

  def updatePredefinedTask(task: PredefinedTasks): Int = {
    DB.withConnection { implicit connection =>
      val lastSave = SQL(
        """
          update art_predefined_task
          set 
			      task_type={task_type},
            task_title={task_title},
            task_description = {task_description},
            task_discipline = {task_discipline},
            remark = {remark},
            stage={stage},
            user_role={user_role},
            deliverable={deliverable},
            catalogue_service={catalogue_service},
			      is_active={is_active}    
            where tId = {tId}
            """).on(
          'tId -> task.tId,
          'task_type -> task.task_type,
          'task_title -> task.task_title,
          'task_description -> task.task_description,
          'task_discipline -> task.task_discipline,
          'remark -> task.remark,
          'stage -> task.stage,
          'user_role -> task.user_role,
          'deliverable -> task.deliverable,
          'catalogue_service -> task.catalogue_service,
          'is_active -> task.is_active).executeUpdate()
      lastSave
    }
  }

  def findPredefinedTasksDetails(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_predefined_task where tId = {id} AND is_active=1").on(
          'id -> id).as(
            PredefinedTasks.predefined_tasks.singleOpt)

      result
    }
  }

  def findAllPredefinedTasksDetails(task_mode: String) = {
    DB.withConnection { implicit connection =>
      val sqlString = "select * from art_predefined_task where is_active=1 AND tId NOT IN (select t.predefined_task_id from art_generic_task t where t.is_active=1 and t.task_mode={task_mode})"
      val result = SQL(sqlString).on('task_mode->task_mode).as(PredefinedTasks.predefined_tasks *)
      result
    }
  }

  def findAllDigestiblePredefinedTasksDetails(task_mode: String) = {
    DB.withConnection { implicit connection =>
      val sqlString =
        """
          |SELECT A.tId, A.task_title,A.task_description,B.task_discipline,C.role user_role,D.deliverable FROM
          |(
          |	SELECT X.* FROM
          |	(
          |	SELECT * from art_predefined_task
          |	) X
          |	LEFT OUTER JOIN
          |	(
          |	SELECT t.predefined_task_id FROM art_generic_task t WHERE t.is_active=1 and t.task_mode={task_mode}
          |	) Y
          |	ON X.tId = Y.predefined_task_id
          |	WHERE Y.predefined_task_id IS NULL
          |	AND X.is_active = 1
          |) A
          |JOIN
          |(
          |	SELECT * FROM art_task_discipline WHERE is_deleted = 0
          |) B
          |ON A.task_discipline = B.id
          |JOIN
          |(
          |	SELECT * FROM art_user_role
          |) C
          |ON A.user_role = C.rId
          |JOIN
          |(
          |	SELECT * FROM art_program_deliverable
          |) D
          |ON A.deliverable = D.id
          |WHERE
          |C.is_deleted = 0
          |AND D.is_deleted = 0
          |ORDER BY A.task_title
        """.stripMargin
      val result = SQL(sqlString).on('task_mode->task_mode).as(DigestiblePredefinedTasks.digestible_predefined_tasks *)
      result
    }
  }

  def findAllDigestiblePredefinedTasksFiltered(task_mode: String, task_title: String) = {
    DB.withConnection { implicit connection =>
      Logger.debug("task_title : " + task_title)
      val sqlString =
        """
          |SELECT A.tId, A.task_title,A.task_description,B.task_discipline,C.role user_role,D.deliverable FROM
          |(
          |	SELECT X.* FROM
          |	(
          |	SELECT * from art_predefined_task
          |	) X
          |	LEFT OUTER JOIN
          |	(
          |	SELECT t.predefined_task_id FROM art_generic_task t WHERE t.is_active=1 and t.task_mode={task_mode}
          |	) Y
          |	ON X.tId = Y.predefined_task_id
          |	WHERE Y.predefined_task_id IS NULL
          |	AND X.is_active = 1
          |) A
          |JOIN
          |(
          |	SELECT * FROM art_task_discipline WHERE is_deleted = 0
          |) B
          |ON A.task_discipline = B.id
          |JOIN
          |(
          |	SELECT * FROM art_user_role
          |) C
          |ON A.user_role = C.rId
          |JOIN
          |(
          |	SELECT * FROM art_program_deliverable
          |) D
          |ON A.deliverable = D.id
          |WHERE
          |C.is_deleted = 0
          |AND D.is_deleted = 0
          |AND task_title like {title}
          |ORDER BY A.task_title
        """.stripMargin
      val result = SQL(sqlString).on('task_mode->task_mode,'title->task_title).as(DigestiblePredefinedTasks.digestible_predefined_tasks *)
      result
    }
  }

  def getPredefinedTasks(task_title: String) = {
    var isPresent = false
    DB.withConnection { implicit connection =>
      var sqlString = "select count(*) from art_predefined_task where is_active=1 AND task_title='" + task_title.trim() + "'";
      val result = SQL(sqlString).as(scalar[Long].singleOpt)
      if (result.get > 0) {
        isPresent = true
      }
      isPresent
    }
  }
  def newProjectTypevalidateForm(form: play.api.data.Form[PredefinedTasks]) = {
    var newform: play.api.data.Form[models.PredefinedTasks] = null
    if (!form.data.get("title").isEmpty) {
      val task_title = form.data.get("title").get
      val bool = getPredefinedTasks(task_title)
      if (bool) {
        newform = form.withError("title", "Nombre de la tarea predefinida ya existe.")
      }
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }
  def getPredefinedTasksForEdit(task_title: String, id: String) = {
    var isPresent = false
    DB.withConnection { implicit connection =>
      var sqlString = "select count(*) from art_predefined_task where tId<>" + id + " AND is_active=1 AND task_title='" + task_title.trim() + "'";
      val result = SQL(sqlString).as(scalar[Long].singleOpt)
      if (result.get > 0) {
        isPresent = true
      }
      isPresent
    }
  }
  def editProjectTypevalidateForm(form: play.api.data.Form[PredefinedTasks], id: String) = {
    var newform: play.api.data.Form[models.PredefinedTasks] = null
    if (!form.data.get("title").isEmpty) {
      val task_title = form.data.get("title").get
      val bool = getPredefinedTasksForEdit(task_title, id)
      if (bool) {
        newform = form.withError("title", "Nombre de la tarea predefinida ya existe.")
      }
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }

  def updatePlanTime(task_id: String, plan_time: String) : Int = {
    DB.withConnection { implicit connection =>
      SQL("UPDATE art_generic_task SET plan_time = {plan_time} WHERE tId = {task_id}").on(
        'task_id -> task_id,
      'plan_time -> plan_time).executeUpdate()
    }
  }
}