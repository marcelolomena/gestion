class ModalBase
  constructor: (@modalId, @formId, @dataOptions, @title, @body, @submitButtonTitle) ->

  content: () ->
    return "<div class=\"modal fade\" id=\"#{@modalId}\" data-options=\"#{@dataOptions}\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\" style=\"z-index:1500;\">
              <div class=\"modal-dialog\">
                <div class=\"modal-content\">
                  <div class=\"modal-header\">
                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>
                    <h4 class=\"modal-title\">#{@title}</h4>
                  </div>
                  <form class=\"form-horizontal\" id=\"#{@formId}\">
                    <div class=\"modal-body\">
                      #{@body}
                    </div>
                    <div class=\"modal-footer\">
                      <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">#{Messages("close")}</button>
                      <button type=\"submit\" class=\"btn btn-primary\" id=\"submitModal\">#{@submitButtonTitle}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>"

class NewUserModal extends ModalBase
  newUserTemplateForm = () ->
    return "<fieldset>
              <div class=\"form-group\">
                <label for=\"inputUserName\" class=\"col-lg-3 control-label\">#{Messages("username")}</label>
                <div class=\"col-lg-9\">
                  <input type=\"text\" class=\"form-control\" id=\"inputUserName\" name=\"username\" placeholder=\"#{Messages("username")}\">
                </div>
              </div>
              <div class=\"form-group\">
                <label for=\"authLevel\" class=\"col-lg-3 control-label\">#{Messages("authorization.level")}</label>
                <div class=\"col-lg-7\">
                  <select class=\"form-control\" id=\"authLevel\" name=\"authLevel\">
                    <option>SuperAdmin</option>
                    <option>Admin</option>
                    <option>Contributor</option>
                    <option>Reader</option>
                  </select>
                </div>
              </div>
            </fieldset>"
  constructor: (boardId) ->
    super("newUserModal",
          "newUserForm",
          "{'board_id':#{boardId}}"
          Messages("new.user"),
          newUserTemplateForm(),
          Messages("add.new.user"))

class NewTicketModal extends ModalBase
  newTicketTemplateForm = () ->
    return "<fieldset>
              <div class=\"form-group\">
                <label for=\"inputName\" class=\"col-lg-2 control-label\">#{Messages("name")}</label>
                <div class=\"col-lg-7\">
                  <input type=\"text\" class=\"form-control\" id=\"inputName\" name=\"name\" placeholder=\"#{Messages("name.of.ticket")}\">
                </div>
              </div>
              <div class=\"form-group\">
                <label for=\"inputDescription\" class=\"col-lg-2 control-label\">#{Messages("description")}</label>
                <div class=\"col-lg-7\">
                  <textarea class=\"form-control\" rows=\"3\" id=\"inputDescription\" name=\"description\"></textarea>
                </div>
              </div>
              <div class=\"form-group\">
              <label for=\"priority\" class=\"col-lg-2 control-label\">#{Messages("priority")}</label>
              <div class=\"col-lg-7\">
                <select class=\"form-control\" id=\"priority\" name=\"priority\">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
            </div>
            <div class=\"form-group\">
              <label for=\"difficultySlider\" class=\"col-lg-2 control-label\">#{Messages("difficulty")}</label>
              <div class=\"col-lg-7\">
                <div class=\"slider shor slider-cyan-300\" id=\"difficultySlider\"></div>
              </div>
            </div>
          </fieldset>"
  constructor: (projectId) ->
    super("createTicketModal",
          "newTicketForm",
          "{'project_id':#{projectId}}"
          Messages("new.ticket"),
          newTicketTemplateForm(),
          Messages("add.new.ticket"))

class NewColumnModal extends ModalBase
  newColumnTemplateForm = ()->
    return "<fieldset>
              <div class=\"form-group\">
                <label for=\"inputName\" class=\"col-lg-2 control-label\">#{Messages("name")}</label>
                <div class=\"col-lg-7\">
                  <input type=\"text\" class=\"form-control\" id=\"inputName\" name=\"name\" placeholder=\"#{Messages("name.of.kolumn")}\">
                </div>
              </div>
              <div class=\"form-group\">
                <label for=\"inputPosition\" class=\"col-lg-2 control-label\">#{Messages("position")}</label>
                <div class=\"col-lg-7\">
                  <input type=\"number\" class=\"form-control\" id=\"inputPosition\" name=\"position\" placeholder=\"#{Messages("position.of.kolumn")}\">
                </div>
              </div>
              <div class=\"form-group\">
                <label for=\"inputThreshold\" class=\"col-lg-2 control-label\">#{Messages("threshold")}</label>
                <div class=\"col-lg-7\">
                  <input type=\"number\" class=\"form-control\" id=\"inputThreshold\" name=\"threshold\" placeholder=\"#{Messages("ticket.threshold.of.column")}\">
                  <div class=\"checkbox\">
                    <label>
                        <input type=\"checkbox\" id=\"inputArchive\" name=\"isArchiveKolumn\">Is this column for archiving Tickets?
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>"
  constructor: (projectId) ->
    super("createColumnModal",
          "newColumnForm",
          "{'project_id':#{projectId}}",
          Messages("new.column"),
          newColumnTemplateForm(),
          Messages("save.new.column"))

class NewProjectModal extends ModalBase
  newProjectTemplateForm = ()->
    return "<fieldset>
              <div class=\"form-group\">
                <label for=\"inputName\" class=\"col-lg-2 control-label\">#{Messages("name")}</label>
                <div class=\"col-lg-9\">
                  <input type=\"text\" class=\"form-control\" id=\"inputName\" name=\"name\" placeholder=\"#{Messages("name.of.project")}\">
                </div>
              </div>
              <div class=\"form-group\">
                <label for=\"inputPrefix\" class=\"col-lg-2 control-label\">#{Messages("project.prefix")}</label>
                <div class=\"col-lg-9\">
                  <input type=\"text\" class=\"form-control\" id=\"inputPrefix\" name=\"prefix\" placeholder=\"#{Messages("project.abbreviation")}\">
                </div>
              </div>
            </fieldset>"
  constructor: (boardId) ->
    super("createProjectModal",
          "newProjectForm",
          "{'board_id':#{boardId}}",
          Messages("new.project"),
          newProjectTemplateForm(),
          Messages("save.new.project"))

class NewBoardModal extends ModalBase
  newBoardTemplateForm = () ->
    return "<fieldset>
              <div class=\"form-group\">
                <label for=\"inputName\" class=\"col-lg-2 control-label\">#{Messages("name")}</label>
                <div class=\"col-lg-9\">
                  <input type=\"text\" class=\"form-control\" id=\"inputName\" name=\"name\" placeholder=\"#{Messages("name.of.board")}\">
                </div>
              </div>
            </fieldset>"

  constructor: () ->
    super("createBoardModal",
          "newBoardForm",
          "{\"user_id\":#{currentUser.id}}",
          Messages("new.board"),
          newBoardTemplateForm(),
          Messages("create.new.board"))


window.newBoardModal = () ->
  return new NewBoardModal().content()
window.newProjectModal = (boardId) ->
  return new NewProjectModal(boardId).content()
window.newTicketModal = (projectId) ->
  return new NewTicketModal(projectId).content()
window.newColumnModal = (projectId) ->
  return new NewColumnModal(projectId).content()
window.newUserModal = (boardId) ->
  return new NewUserModal(boardId).content()