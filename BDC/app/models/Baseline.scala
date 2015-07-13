package models

import anorm.Pk
import java.util.Date
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB

case class Baseline(id: Option[Int], change_set: String, user_id: Integer, changed_at: Date, object_type: String, ref_id: Integer)

object Baseline {
  val baseline = {
    get[Option[Int]]("id") ~
      get[String]("change_set") ~
      get[Int]("user_id") ~
      get[Date]("changed_at") ~
      get[String]("object_type") ~
      get[Int]("ref_id") map {
        case id ~ change_set ~ user_id ~ changed_at ~ object_type ~ ref_id =>
          Baseline(id, change_set, user_id, changed_at, object_type, ref_id)
      }
  }

  /**
   * method to insert new record into the database
   */
  def insert(baseline: Baseline): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """insert into art_baseline( change_set, user_id, changed_at, object_type, ref_id) values (
            {change_set},{user_id},{changed_at}, {object_type},{ref_id})
			""").on(
          'change_set -> baseline.change_set,
          'user_id -> baseline.user_id,
          'changed_at -> baseline.changed_at,
          'object_type -> baseline.object_type,
          'ref_id -> baseline.ref_id).executeUpdate()
    }
  }

  /**
   * method to update the project from database by ID
   */
  def update(baseline: Baseline): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
			update art_baseline
			set
			id={id},
      change_set={change_set},
      user_id={user_id},
			changed_at = {changed_at},
      object_type={object_type},
      ref_id = {ref_id}
			where id = {id}
			""").on(
          'id -> baseline.id,
          'change_set -> baseline.change_set,
          'user_id -> baseline.user_id,
          'changed_at -> baseline.changed_at,
          'object_type -> baseline.object_type,
          'ref_id -> baseline.ref_id).executeUpdate()
    }
  }

  def getBaselineCount(ref: Int, object_type: String): Int = {
    DB.withConnection { implicit connection =>
      var result = SQL(
        """
			select count(*) as baseline_count from art_baseline
			where ref_id = {ref_id} AND object_type = {object_type}
			""").on(
          'ref_id -> ref,
          'object_type -> object_type).apply().head
      var count = result[Long]("baseline_count")
      count.toInt
    }
  }

  def getBaseline(ref: Int, object_type: String): Seq[Baseline] = {
    DB.withConnection { implicit connection =>
      SQL(
        """
			select * from art_baseline
			where ref_id = {ref_id} AND object_type = {object_type}
			""").on(
          'ref_id -> ref,
          'object_type -> object_type).as(Baseline.baseline *)
    }
  }

  def getAllBaselines(): Seq[Baseline] = {
    DB.withConnection { implicit connection =>
      SQL(
        """
      select * from art_baseline
      
      """).on().as(Baseline.baseline *)
    }
  }
}