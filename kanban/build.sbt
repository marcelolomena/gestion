name := """play-scala"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.2"

scalacOptions := Seq("-unchecked", "-deprecation", "-encoding", "utf8")

libraryDependencies ++= {
  val akkaV = "2.3.6"
  Seq(
  jdbc,
  "org.julienrf" %% "play-jsmessages" % "1.6.2",
  anorm,
    "mysql"               % "mysql-connector-java" % "5.1.21"
  )
}