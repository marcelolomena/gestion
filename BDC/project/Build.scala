import sbt._
import Keys._
//import play.Project._
import play.api._
import play.PlayImport._

object ApplicationBuild extends Build {

  val appName = "BDC"
  val appVersion = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
    ws,
    jdbc,
    anorm,
    "net.sourceforge.jtds" % "jtds" % "1.2",
    "mysql" % "mysql-connector-java" % "5.1.18", "org.json" % "org.json" % "chargebee-1.0",
    "org.mindrot" % "jbcrypt" % "0.3m",
    "org.mongodb" %% "casbah" % "2.7.2",
    "org.json4s" %% "json4s-jackson" % "3.2.10",
    "org.json4s" %% "json4s-mongo" % "3.2.10",
    "org.imgscalr" % "imgscalr-lib" % "4.2",
    "org.apache.poi" % "poi" % "3.9",
    "org.apache.poi" % "poi-ooxml" % "3.9",
    "net.sourceforge" % "mpxj" % "4.5.0-rc1",
    "com.google.code.gson" % "gson" % "2.2.4",
    "com.typesafe.play" %% "play-mailer" % "2.4.1",
    "com.typesafe" %% "play-plugins-mailer" % "2.1.0",
    "org.apache.commons" % "commons-email" % "1.3")

  val main = Project(appName, file(".")).enablePlugins(play.PlayScala).settings(
    version := appVersion,
    libraryDependencies ++= appDependencies)

  // no incluye documentacion de la API mientras empaqueta:
  doc in Compile <<= target.map(_ / "none")

}