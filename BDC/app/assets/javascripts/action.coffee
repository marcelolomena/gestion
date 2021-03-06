window.snackbarOptions =
    content: "Some text"
    style: "toast"
    timeout: 9000

$.snackbar(snackbarOptions)

WS = if window['MozWebSocket'] then window['MozWebSocket'] else WebSocket
loc = window.location
window.socketUri = ""
if loc.protocol == "https:"
  socketUri = "wss:"
else
  socketUri = "ws:"
socketUri += "//" + loc.host;
socketUri += loc.pathname;

socket = 42

window.affixBoardSocket = (domBoard, webSocketUrl, boardId) ->
  domBoard.on 'shown.bs.collapse', (event) ->
    hideButtons()
    console.log("board show")
    projectDivs = $(".project#{boardId}")
    hasActiveProject = false
    for project in projectDivs
      console.log(project)
      if $(project).hasClass("ac-active")
        hasActiveProject = true
        break

    if hasActiveProject
      addTicketTooltip.show()
      addColumnTooltip.show()
    else
      addProjectTooltip.show()
      addProjectButton.on click: ->
        $(newProjectModal(boardId)).modal()
      addUserTooltip.show()
      addUserButton.on click: ->
        $(newUserModal(boardId)).modal()

    event.stopPropagation()
    socket = new WS(socketUri+webSocketUrl)
    socket.onopen = () ->
      socket.onmessage = (message) ->
        data = JSON.parse(message.data)
        console.log("why socket?")
        console.dir(data)
        socketActions[data.action](data.data)
    return false

  domBoard.on 'hide.bs.collapse', (event) ->
    hideButtons()
    addBoardTooltip.show()
    socket.close()

window.hideButtons = () ->
  mat.hide() for mat in matButtons

window.matButtons = []

$(document).on ready: ->
  console.log(socketUri)
  window.floatingSocket = new WS("#{socketUri}socket?userId=#{currentUser.id}")
  floatingSocket.onopen = () ->
    floatingSocket.onmessage = (message) ->
      data = JSON.parse(message.data)
      console.log(data)
      socketActions[data.action](data.data)

  window.addBoardButton = $("#addBoardButton")
  window.addBoardTooltip = $("#addBoardTooltip")
  window.addUserButton = $("#addUserButton")
  window.addUserTooltip = $("#addUserTooltip")
  window.addProjectButton = $("#addProjectButton")
  window.addProjectTooltip = $("#addProjectTooltip")
  window.addTicketButton = $("#addTicketButton")
  window.addTicketTooltip = $("#addTicketTooltip")
  window.addColumnButton = $("#addColumnButton")
  window.addColumnTooltip = $("#addColumnTooltip")

  window.matButtons = [addBoardTooltip,
                       addProjectTooltip,
                       addUserTooltip,
                       addTicketTooltip,
                       addColumnTooltip]

  hideButtons()
  addBoardTooltip.show()

  $(document).on 'hidden.bs.modal', '.modal', ()->
    console.log('remove')
    $(this).remove()

  $(document).on 'hidden.bs.modal', '.ticket-modal', ()->
    console.log('remove')
    $(this).remove()

  $(document).on 'shown.bs.modal', '.ticket-modal', ()->
    ticketId = $(this).data('options').id
    ticket = ticketMap[ticketId]

    $('#difficultyModalSlider').noUiSlider
      start: ticket.difficulty
      connect: "lower"
      orientation: "horizontal"
      step:1
      range: {
        'min': 0
        'max': 10
      }
    $('#priorityModalSlider').noUiSlider
      start: Math.abs(6-ticket.priority)
      connect: "lower"
      orientation: "horizontal"
      step: 1
      range: {
        'min': 1
        'max': 5
      }

    $('#pencil').editable(
      type: 'text'
      id:'canario'
      name: 'username'
      title: 'Enter username'
      display: false
      inputclass: 'collab ui-widget'
      success: (response, newValue) ->
        $.ajax
          url: '/addCollaborator'
          data: JSON.stringify($('#pencil').data('options'))
          dataType: 'json'
          contentType: 'application/json;charset=utf-8'
          type: 'POST'
          autotext: 'never'
          success: (data) ->
            console.log(data)
            return false
    )

    $('#pencil').on shown:(e,editable) ->
      editable.input.$input.keypress (e) ->
        if e.which == 13
          return false
        return
      ticket = ticketMap[ticketId]
      console.dir(ticket)
      console.dir(ticket.collaborators)
      console.log(collab)
      $('.collab').autocomplete(
        source: ( request, response ) ->
                    $.ajax({
                      url: "getUsers"
                      data: JSON.stringify({boardId:ticket.boardId,text:request.term})
                      contentType: 'application/json;charset=utf-8'
                      type: 'POST'
                      success: ( data ) ->
                        response(data.data)
                    })
        close: (event, ui) ->
          return false
        focus: (event, ui) ->
          console.log(ui.item.label)
          $(event.target).val(ui.item.label)
        select: (event, ui) ->
          event.stopPropagation();
          $('#pencil').data('options', {
            userId: ui.item.value,
            ticketId: ticketId,
            assignerId: currentUser.id,
            boardId: ticketMap[ticketId].boardId
          })
          console.log($('#pencil').data('options'))
          $(event.target).val(ui.item.label)
          return false
      ).autocomplete('instance')._renderItem = ( ul, item ) ->
        return $('<li>').append('<a>' + item.label + '</a>' )
               .appendTo( ul )

  $(document).on 'mouseenter', '.avatar', ()->
    $('[data-toggle="tooltip"]').tooltip()

  $(".ticket").on click: ->
    console.log("ticket click")
    id = $(this).data("options").id
    tm = $(ticketModalHtml(ticketMap[id]))
    tm.modal('show')

  $('[data-toggle="tooltip"]').tooltip()

window.addColumnSortableForProject = (project)->
  oldKolumnId = ""
  newKolumnId = ""

  $(".sortable_groups#{project.project.id}").sortable
    handle: ".kol-header#{project.project.id}"
  .disableSelection()
  console.log("project.project.id: " + project.project.id)
  $(".sortable_cols#{project.project.id}").sortable
    connectWith : ".sortable_cols#{project.project.id}"
    items: ">*:not(.kol-header#{project.project.id})"
    update:(event,ui) ->
    start: (event, ui) ->
      oldKolumnId = JSON.parse($(event.target).data('options').replace(/'/g, '"')).id
    receive: (event, ui) ->
      target = $(event.target)

      newKolumnId = JSON.parse(target.data('options').replace(/'/g, '"')).id
      console.log("newKolumnId: " + newKolumnId)
      console.dir(ui.item.context)
      ticketId = JSON.parse($(ui.item.context).data('options').replace(/'/g, '"')).id
      console.log("ticketId: " + ticketId)
      values = {
        ticketId: parseInt(ticketId)
        userId: currentUser.id
        oldKolumnId: parseInt(oldKolumnId)
        newKolumnId: parseInt(newKolumnId)
        projectId: project.project.id
      }

      $.ajax
        url:"moveTicket"
        data: JSON.stringify(values)
        dataType: 'json'
        contentType: "application/json;charset=utf-8"
        type: 'PATCH'
        success: (data) ->
          console.log(data)
          return false
  .disableSelection()