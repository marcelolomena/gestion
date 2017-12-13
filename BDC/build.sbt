name := "BDC"

version := "1.0-SNAPSHOT"

scalaVersion := "2.11.11"

resolvers += "Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/"

scalacOptions in ThisBuild ++= Seq("-unchecked", "-deprecation")

libraryDependencies ++= Seq(
  ws,
  jdbc,
  anorm,
  "net.liftweb" %% "lift-json" % "2.6.3",
  "org.json" % "json" % "20160810",
  "org.mindrot" % "jbcrypt" % "0.3m",
  "org.imgscalr" % "imgscalr-lib" % "4.2",
  "org.apache.poi" % "poi" % "3.10.1",
  "org.apache.poi" % "poi-ooxml" % "3.10.1",
  "com.typesafe.play.plugins" %% "play-plugins-mailer" % "2.3.1",
  "com.enragedginger" %% "akka-quartz-scheduler" % "1.6.0-akka-2.4.x",
  "org.apache.commons" % "commons-email" % "1.4",
  "com.google.guava" % "guava" % "16.0.1",
  "org.julienrf" %% "play-jsmessages" % "1.6.2"
)

lazy val root = (project in file(".")).enablePlugins(PlayScala)