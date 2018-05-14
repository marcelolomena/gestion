package model

/**
 * Possible Status Codes to be sent back to client
 */
object StatusCode extends Enumeration {
  type StatusCode = Int

  val OK = 200
  val ImproperParameters = 420
  val IdentifierNotFound = 421
  val DatabaseError = 422
  val Unauthorized = 423
}

import model.StatusCode._
import play.api.libs.json.Writes

/**
 * Main envelope to be passed around from service to controller,
 * and then serialized and passed to the client.
 * @param statusCode from enum StatusCode
 * @param message message on error
 * @param retData data to return on success
 * @tparam A class to be serialized and returned
 */
case class ServiceResponse[A : Writes](statusCode : StatusCode, message : String = null)(implicit val retData : A = null) {
  lazy val data : A =  retData
}