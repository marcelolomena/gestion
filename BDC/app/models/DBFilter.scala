package models

/**
 * @author marcelo
 */
case class DBFilter(
  field: String,
  op: String,
  data: String)