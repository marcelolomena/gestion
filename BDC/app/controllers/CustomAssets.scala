package controllers


import play.api.mvc.Action
import play.api.mvc.AnyContent
import play.api.mvc.Results.Ok
import play.api.Play.current
import play.api._
import java.io.File
import play.Play


object CustomAssets {
  def at(file: String): Action[AnyContent] = Action {
    var docFile = new File(Play.application().configuration().getString("bdc.documents.location") + "/alldocuments/"+file)
    if(docFile != null && docFile.exists()){
    	Ok.sendFile(docFile)
    }else{
       Ok("File not found on the server. Its either deleted or removed from the server,")
    }
  } 
}