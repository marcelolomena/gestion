window.collaboratorHtml = (collaborator, float) ->
  return "<div class=\"btn avatar\" style=\"float:#{float};background:url(#{collaborator.avatarUrl});\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"#{collaborator.username}\"></div>"

window.ticketModalHtml = (ticket) ->
  return "<div class=\"modal fade ticket-modal\" id=\"activeTicketModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\" style=\"z-index:1500;\" data-options='{\"id\":#{ticket.id}}\'>
            <div class=\"modal-dialog\">
              <div class=\"modal-content\">
                <div class=\"modal-header\">
                  <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>
                  <h4 class=\"modal-title\">#{ticket.name}</h4>
                </div>
                <div class=\"modal-body\">
                  <div class=\"row\">
                    <div class=\"col-md-6\">
                      <p>#{ticket.description if ticket.description != undefined}</p>
                    </div>
                    <div class=\"col-md-6\">
                      <div class=\"row\">
                        <span id=\"note\" class=\"pull-right\">COLLABORATORS</span>
                        <a href=\"#\" data-original-title=\"Add user\" data-placement=\"right\" class=\"editable-open pull-right\"  id=\"pencil\">
                          <button type=\"button\" id='collab' class=\"mdi-content-add\" style=\"z-index:1501;padding:0;margin:0;border-radius:10px;border-color: currentColor;background-color: white;margin-right: 5px;margin-top: 1px;\"></button>
                        </a>
                      </div>
                      <div id=\"collabDiv\" class=\"row\">
                        #{collaboratorHtml(collaborator, 'right',) for collaborator in ticket.collaborators}
                      </div>
                      <div class=\"row\">#{Messages("difficulty")}</div>
                      <div class=\"row\">
                        <div id=\"difficultyModalSlider\" class=\"slider shor\"></div>
                      </div>
                      <div class=\"row\">#{Messages("priority")}</div>
                      <div class=\"row\">
                        <div id=\"priorityModalSlider\" class=\"slider shor\"></div>
                      </div>
                    </div>
                  </div>
                  <div class=\"row\">
                    <h4 class=\"modal-header modal-title\">Activity</h4>
                    <div class=\"form-group\" style=\"padding-top:10px\">
                      <label for=\"inputComment\" class=\"col-sm-1 control-label\" style=\"padding-left:22;padding-top:10\">
                        #{collaboratorHtml(currentUser, 'none')}
                      </label>
                      <div class=\"col-lg-10\">
                        <textarea class=\"form-control\" rows=\"3\" id=\"inputComment\" name=\"comment\" style=\"outline-color:mediumaquamarine;outline-style:groove;\"></textarea>
                        <button id=\"commentButton\" type=\"button\" class=\"btn btn-primary\" style=\"float:right;margin-right:-5;\">#{Messages("comment")}</button>
                        <script>
                           $(document).ready(function() {
                              $('#commentButton').on('click', function() {
                                console.log($('#activeTicketModal').data('options'));
                                var comment = {
                                  ticketId: $('#activeTicketModal').data('options').id,
                                  comment: $('#inputComment').val(),
                                  userId: currentUser.id
                                };
                                console.log(comment);
                                $.ajax({
                                  url: '/addComment',
                                  data: JSON.stringify(comment),
                                  dataType: 'json',
                                  contentType: 'application/json;charset=utf-8',
                                  type: 'POST',
                                  success: function (data) {
                                    console.log(data);
                                    return false;
                                  }
                                });

                              });
                          });
                        </script>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>"

window.ticketContentTemplateHtml = (ticket, boardId) ->
  str = "<div id=\"ticket#{ticket.id}\" class=\"well well-lg ui-state-default btn btn-raised ticket#{boardId}\" data-options=\"{'id':#{ticket.id}, 'board_id':#{boardId}}\" style=\"max-width:100%;background-color:cornsilk\">
            <div class=\"disabled\" data-options=\"{\"id\":#{ticket.id}}\">#{ticket.name}</div>
            <div class=\"disabled ticket-description\" data-options=\"{'id':#{ticket.id}, 'board_id':#{boardId}}\">#{ticket.description}</div>
            <div id=\"collab_container#{ticket.id}\" data-options=\"{'id':#{ticket.id}, 'board_id':#{boardId}}\" style=\"padding-top:12px;\">"
  if ticket.collaborators != undefined
    for collaborator in ticket.collaborators
      str += "<div class=\"btn avatar\" style=\"background:url(#{collaborator.avatarUrl});\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"#{collaborator.username}\" data-options=\"{'id':#{ticket.id}, 'board_id':#{boardId}}\"></div>"

  str += "</div></br><div>#{Messages("difficulty")}</div><div data-options=\"{'id':#{ticket.id}, 'board_id':#{boardId}}\" class=\"progress progress-striped\">"

  if ticket.difficulty > 0 and ticket.difficulty < 3
    str += "<div class=\"progress-bar progress-bar-info\" data-options=\"{'id':#{ticket.id}, 'board_id':#{boardId}}\" style=\"width : #{ticket.difficulty}0%\"></div>"
  else if ticket.difficulty >= 4 and ticket.difficulty <= 6
    str += "<div class=\"progress-bar progress-bar-success\" data-options=\"{'id':#{ticket.id}, 'board_id':#{boardId}}\" style=\"width : #{ticket.difficulty}0%\"></div>"
  else if ticket.difficulty > 6 and ticket.difficulty <= 8
    str += "<div class=\"progress-bar progress-bar-warning\" data-options=\"{'id':#{ticket.id}, 'board_id':#{boardId}}\" style=\"width : #{ticket.difficulty}0%\"></div>"
  else if ticket.difficulty > 8
    str += "<div class=\"progress-bar progress-bar-danger\" data-options=\"{'id':#{ticket.id}, 'board_id':#{boardId}}\" style=\"width : #{ticket.difficulty}0%\"></div>"

  str += "</div>
          <div>#{Messages("priority")}</div>
          <div data-options=\"{'id':#{ticket.id}, 'board_id':#{boardId}}\" class=\"progress progress-striped\">"

  if ticket.priority == 5 || ticket.priority == 4
    str += "<div data-options=\"{'id':#{ticket.id}, 'board_id':#{boardId}}\" class=\"progress-bar progress-bar-info\" style=\"width : #{Math.abs(((ticket.priority-1)*2)-10)}0%\"></div>"
  else if ticket.priority == 3
    str += "<div data-options=\"{'id':#{ticket.id}, 'board_id':#{boardId}}\" class=\"progress-bar progress-bar-success\" style=\"width : #{Math.abs(((ticket.priority-1)*2)-10)}0%\"></div>"
  else if ticket.priority == 2
    str += "<div data-options=\"{'id':#{ticket.id}, 'board_id':#{boardId}}\" class=\"progress-bar progress-bar-warning\" style=\"width : #{Math.abs(((ticket.priority-1)*2)-10)}0%\"></div>"
  else if ticket.priority == 1
    str += "<div data-options=\"{'id':#{ticket.id}, 'board_id':#{boardId}}\" class=\"progress-bar progress-bar-danger\" style=\"width : #{Math.abs(((ticket.priority-1)*2)-10)}0%\"></div>"

  str += "</div></div>"

  ticketMap[ticket.id] = ticket;

  str += "<script>
          $(document).ready(function() {
            $('#' + \"ticket#{ticket.id}\").off('click');
            $('#' + \"ticket#{ticket.id}\").on('click', function(e) {
              $(ticketModalHtml(ticketMap[#{ticket.id}])).modal();
            });
          });</script>"

  ticket.boardId = boardId;

  return str

window.columnContentTemplateHtml = (column, project, boardId) ->
  str = "<ul id=\"sortable#{column.id}\" class=\"sortable connectedSortable#{project.project.id}\" data-options=\"{'id':#{column.id}}\">
            <div style=\"text-align:center;min-height:30%;\" id=\"sortableKol#{column.id}\" data-options=\"{'id':#{column.id}}\" class=\"sortable sortable_cols#{project.project.id}\">"
  if column.isArchiveKolumn
    str += "<span class=\"kol-header btn btn-info btn-success\" style=\"width:100%;\">#{column.name}</span>"
  else
    str += "<span id=\"sortableKolName#{column.id}\" class=\"kol-header#{project.project.id} btn btn-info btn-raised\" style=\"width:100%;\">#{column.name}</span>"

  str += ticketContentTemplateHtml(ticket,boardId) for ticket in project.tickets when ticket.currentKolumnId is column.id
  str += "</div></ul>"
  return str

compareColumns = (columnA,columnB) ->
  if columnA.position < columnB.position
    return -1
  if columnA.position > columnB.position
    return 1
  return 0

window.projectContentTemplateHtml = (project) ->
  project.tickets = project.tickets.concat.apply([],project.tickets)
  project.kolumns = project.kolumns.concat.apply([],project.kolumns)
  projectMap[project.project.id] = project

  str = ""
  if project.kolumns.length == 0
    str += "<div id=\"noActiveColumns#{project.project.id}\" class=\"panel-body\">No Active Columns!</div>"
    str += "<div id=\"columnContainer#{project.project.id}\" class=\"sortable_groups#{project.project.id}\" style=\"display:flex;flex-wrap:wrap;\">"
  else
    project.kolumns.sort(compareColumns)
    str += "<div id=\"columnContainer#{project.project.id}\" class=\"sortable_groups#{project.project.id}\" style=\"display:flex;flex-wrap:wrap;\">"
    for column in project.kolumns
        str += columnContentTemplateHtml(column, project, project.project.boardId)
    str += "</div>"
    str += "<script>
            $(document).ready(function() {
              addColumnSortableForProject(projectMap[#{project.project.id}]);
            });
          </script>"
    return str

window.projectTemplateHtml = (project, k) ->
  return "<div class=\"panel #{panelColors[k]}\">
                <div class=\"panel-heading\" role=\"tab\" id=\"headingProject#{project.project.id}\">
                  <h4 class=\"panel-title\">
                    <a data-toggle=\"collapse\" data-parent=\"#accordionProjects#{project.project.boardId}\" href=\"#collapseProject#{project.project.id}\" aria-expanded=\"false\" aria-controls=\"collapseProject#{project.project.id}\">
                      #{project.project.name}
                    </a>
                  </h4>
                </div>
                <div id=\"collapseProject#{project.project.id}\" data-options=\"{'id':#{project.project.id}}\" class=\"panel-collapse collapse project#{project.project.boardId}\" role=\"tabpanel\" aria-labelledby=\"headingProject#{project.project.id}\">
                  #{projectContentTemplateHtml(project)}
                </div>
                <script>
                  $(document).ready(function(){
                    $('#' + \"collapseProject#{project.project.id}\").on('shown.bs.collapse', function(event) {
                      $(this).addClass('ac-active');
                      event.stopPropagation();
                      var projectId = JSON.parse($(this).data('options').replace(/'/g, '\"')).id;
                      console.log(\"collapse proj\");
                      hideButtons();
                      addTicketTooltip.show();
                      addColumnTooltip.show();
                      addTicketButton.off('click');
                      addColumnButton.off('click');
                      addTicketButton.on('click', function(){
                        $(newTicketModal(projectId)).modal()
                      });
                      addColumnButton.on('click', function(){
                        $(newColumnModal(projectId)).modal()
                      })
                    });
                    $('#' + \"collapseProject#{project.project.id}\").on('hide.bs.collapse', function(event) {
                      $(this).removeClass('ac-active');
                      event.stopPropagation();
                      var projectId = JSON.parse($(this).data('options').replace(/'/g, '\"')).id;
                      console.log(\"collapse proj\");
                      hideButtons();
                      addProjectTooltip.show();
                      addUserTooltip.show();
                    });
                });
                </script>
              </div>"

panelColors = ["panel-success", "panel-primary", "panel-warning", "panel-danger", "panel-info"]
window.boardContentTemplateHtml = (board) ->
  str = ""
  board.projects = board.projects.concat.apply([], board.projects)
  console.log(board)
  if board.projects.length == 0
    str += "<div id=\"noActiveProjects#{board.board.id}\">No projects in #{board.board.name}</div>"
    str += "<div class=\"panel-group\" id=\"accordionProjects#{board.board.id}\" role=\"tablist\" aria-multiselectable=\"true\">"
  else
    str += "<div class=\"panel-group\" id=\"accordionProjects#{board.board.id}\" role=\"tablist\" aria-multiselectable=\"true\">"
    k = 0
    for project in board.projects
      if k > 4
        k = 0
      str += projectTemplateHtml(project,k)
      k += 1
  return str

window.boardTemplateHtml = (board) ->
  return "<div class='panel panel-default'>
            <div class='panel-heading' role='tab' id=\"headingBoard#{board.board.id}\">
              <h4 class=\"panel-title\">
              <a data-toggle=\"collapse\" data-parent=\"#accordionBoard\" href=\"#collapseBoard#{board.board.id}\" aria-expanded=\"false\" aria-controls=\"collapseBoard#{board.board.id}\">
                #{board.board.name}
              </a>
              #{"<button class=\"btn avatar\" style=\"float:right;background:url(#{user.avatarUrl});\"></button>" for user in board.users}
             </h4>
            </div>
            <div id=\"collapseBoard#{board.board.id}\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingBoard#{board.board.id}\" data-options=\"{'id':#{board.board.id}}\">
              <div class=\"panel-body\">
                #{boardContentTemplateHtml(board)}
              </div>
            </div>
            </div>
            <script>
              $(document).ready(function() {
                affixBoardSocket($(\"#collapseBoard#{board.board.id}\"),\"socket?userId=#{currentUser.id}&boardId=#{board.board.id}\", #{board.board.id});
              });
            </script>"