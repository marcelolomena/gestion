window.socketActions =
  newTicket : (data) ->
    console.log(data.ticket)
    projectMap[data.ticket.projectId].tickets.push(data.ticket)
    $.snackbar({content: "#{data.user.username} added new ticket '#{data.ticket.name}' to #{$('#sortableKolName' + data.ticket.currentKolumnId).text()}"})
    $(ticketContentTemplateHtml(data.ticket, data.boardId)).appendTo($("#sortableKol" + data.ticket.currentKolumnId)).fadeIn('slow')

  moveTicket : (data) ->
    console.log(data.ticket)
    ticket = $("#ticket" + data.ticket.id)
    if ticket != undefined
      $('#sortableKol' + data.ticket.currentKolumnId).sortable('option','update')(null, ->
        item: ($("#sortableKol" + data.ticket.currentKolumnId)).append(ticket)
      )
      $.snackbar({content: "#{data.user.username} moved ticket '#{data.ticket.name}' to #{$('#sortableKolName' + data.ticket.currentKolumnId).text()}"})
      ticket.appendTo($("#sortableKol" + data.ticket.currentKolumnId)).fadeIn('slow')

  newKolumn : (data) ->
    console.log(data.kolumn)
    kolumn = data.kolumn
    project = projectMap[data.kolumn.projectId]
    projectMap[data.kolumn.projectId].kolumns.push(kolumn)
    console.log(project)
    $.snackbar({content: "#{data.user.username} added new column '#{kolumn.name}' to #{project.project.name}"})
    noColumns = $("#noActiveColumns#{project.project.id}")
    if(noColumns != undefined)
      noColumns.remove()
    $(columnContentTemplateHtml(kolumn, project, project.project.boardId)).appendTo($("#columnContainer#{project.project.id}")).fadeIn('slow')
    addColumnSortableForProject(project)

  newProject : (data) ->
    console.log(data)
    noColumns = $("#noActiveProjects#{data.project.project.boardId}")
    if(noColumns != undefined)
      noColumns.remove()
    $.snackbar({content: "#{data.user.username} added new project '#{data.project.project.name}'"})
    $(projectTemplateHtml(data.project,4)).appendTo($("#accordionProjects#{data.project.project.boardId}")).fadeIn('slow')

  newComment : 4
  addCollaborator : (data) ->
    $.snackbar({content: "#{data.user.username} added '#{data.collaboratorAdded.username}' to #{data.ticket.name}"})
    $(collaboratorHtml(data.collaboratorAdded)).appendTo($('#collab_container' + data.ticket.id))
    if $('#activeTicketModal' + data.ticket.id) != undefined
      $(collaboratorHtml(data.collaboratorAdded)).appendTo($('#collabDiv' + data.ticket.id))

  addUserToBoard: (data) ->
    $.snackbar({content: "#{data.userAdding.username} added '#{data.userAdded.username}' to #{data.boardName}"})

  newBoard: (data) ->
    console.log("new board!")
    console.log(data)
    $.snackbar({content: "#{data.userAdding.username} added you to #{data.board.board.name}"})
    $(boardTemplateHtml(data.board)).appendTo($('#accordionBoard')).fadeIn('slow')