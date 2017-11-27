

//fork in run := true

name := "BDC"

version := "1.0-SNAPSHOT"

scalaVersion := "2.11.11"

libraryDependencies ++= Seq(
  ws,
  jdbc,
  anorm,
  "net.liftweb" %% "lift-json" % "3.0",
  "org.json" % "json" % "20160810",
  "org.mindrot" % "jbcrypt" % "0.3m",
  "org.imgscalr" % "imgscalr-lib" % "4.2",
  "org.apache.poi" % "poi" % "3.10.1",
  "org.apache.poi" % "poi-ooxml" % "3.10.1",
  "com.typesafe.play.plugins" %% "play-plugins-mailer" % "2.3.1",
  "com.enragedginger" %% "akka-quartz-scheduler" % "1.6.0-akka-2.4.x",
  "org.apache.commons" % "commons-email" % "1.3"
)

lazy val root = (project in file(".")).enablePlugins(PlayScala)