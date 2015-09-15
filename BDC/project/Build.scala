import sbt._
import Keys._
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
    "net.liftweb" %% "lift-json" % "2.6+",
    "org.json" % "org.json" % "chargebee-1.0",
    "org.mindrot" % "jbcrypt" % "0.3m",
    "org.imgscalr" % "imgscalr-lib" % "4.2",
    "org.apache.poi" % "poi" % "3.9",
    "org.apache.poi" % "poi-ooxml" % "3.9",
    "com.typesafe.play" %% "play-mailer" % "2.4.1",
    "com.typesafe" %% "play-plugins-mailer" % "2.1.0",
    "org.apache.commons" % "commons-email" % "1.3")

  val main = Project(appName, file(".")).enablePlugins(play.PlayScala).settings(
    version := appVersion,
    libraryDependencies ++= appDependencies)

  // no incluye documentacion de la API mientras empaqueta:
  doc in Compile <<= target.map(_ / "none")

}