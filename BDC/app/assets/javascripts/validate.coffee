$(document).on ready: ->

  $(document).on 'shown.bs.modal', '#newUserModal', ()->
    console.log('Add User Modal Visible')
    validate = {
      rules: {
        username:
          required: true
      },
      errorPlacement: (error, element) ->
        error.insertBefore(element)
      ,
      submitHandler: (form) ->
        data = JSON.parse($('#newUserModal').data('options').replace(/'/g, '"'))
        values = {}
        $.each $(form).serializeArray(), (i, field) ->
          values[field.name] = field.value
        values["boardId"] = data.board_id
        values["assignerId"] = currentUser.id
        values["authLevel"] = authLevelEnum[$('#authLevel').val()]
        console.log("Dispatch New User For Board " + JSON.stringify(values))
        $.ajax
          url: 'userBoardAuthorization'
          data: JSON.stringify(values)
          dataType: 'json'
          contentType: 'application/json;charset=utf-8'
          type: 'POST'
          success: (data) ->
            console.log(data)
            $('#newUserModal').modal('hide')
            return false
    }

    $("#newUserForm").submit (e) ->
      e.preventDefault()

    $("#newUserForm").validate(validate)

  $(document).on 'shown.bs.modal', '#createProjectModal', ()->
    console.log('Create Project Modal visible')
    validate = {
      rules: {
        name:
          required: true
          minlength: 3
        prefix:
          required: true
      },
      errorPlacement: (error, element) ->
        error.insertBefore(element)
      ,
      submitHandler: (form) ->
        data = JSON.parse($("#createProjectModal").data('options').replace(/'/g, '"'))
        console.log(data)
        values = {}
        $.each $(form).serializeArray(), (i, field) ->
          values[field.name] = field.value
        values["boardId"] = data.board_id
        values["createdByUserId"] = currentUser.id
        console.log("Dispatch Create Project: " + JSON.stringify(values))
        $.ajax
          url:"createNewProject"
          data: JSON.stringify(values)
          dataType: 'json'
          contentType: "application/json;charset=utf-8"
          type: 'POST'
          success: (data) ->
            console.log(data)
            $("#createProjectModal").modal('hide')
            return false
    }
    $("#newProjectForm").submit (e) ->
      e.preventDefault()

    $("#newProjectForm").validate(validate)

  $(document).on 'shown.bs.modal', '#createColumnModal', ()->
    console.log('Create Column Modal visible')
    validate = {
      rules:
        name :
          required : true,
          minlength : 3
        ,
        position :
          required : true
        ,
        threshold:
          required : true
        ,
        isArchive :
          required : true
      ,
      errorPlacement: (error, element) ->
        console.log("error")
        error.insertBefore(element)
      ,
      submitHandler: (form) ->
        data = JSON.parse($("#createColumnModal").data('options').replace(/'/g, '"'))
        values = {}
        $.each $(form).serializeArray(), (i, field) ->
          value = ""
          if !isNaN(field.value)
            value = parseInt(field.value)
          else
            value = field.value
          values[field.name] = value
        values["isArchiveKolumn"] = $("#inputArchive").is(":checked")
        values["projectId"] = data.project_id;
        values["createdByUserId"] = currentUser.id;
        console.log("Dispatch Create Board: " + JSON.stringify(values))
        $.ajax
          url:"createNewKolumn"
          data: JSON.stringify(values)
          dataType: 'json'
          contentType: "application/json;charset=utf-8"
          type: 'POST'
          success: (data) ->
            console.log(data)
            $("#createColumnModal").modal('hide')
            return false
        return false
    }
    $("#newColumnForm").submit (e) ->
      e.preventDefault()

    $("#newColumnForm").validate(validate)

  $(document).on 'shown.bs.modal', '#createBoardModal', ()->
    console.log('Create Board Modal visible')
    validate = {
      rules:
        name:
          required: true
          minlength: 3
      ,
      errorPlacement: (error, element) ->
        console.log("error")
        error.insertBefore(element)
      ,
      submitHandler: (form) ->
        data = $("#newBoardForm").data('options')
        values = {}
        $.each $(form).serializeArray(), (i, field) ->
          values[field.name] = field.value
        values["userId"] = currentUser.id
        console.log("Dispatch Create Board: " + JSON.stringify(values))
        $.ajax
          url:"createNewBoard"
          data: JSON.stringify(values)
          dataType: 'json'
          contentType: "application/json;charset=utf-8"
          type: 'POST'
          success: (data) ->
            console.log(data)
            $("#createBoardModal").modal('hide')
            return false
        return false
    }
    $("#newBoardForm").submit (e) ->
      e.preventDefault()

    $("#newBoardForm").validate(validate)

  $(document).on 'shown.bs.modal', '#createTicketModal', ()->
    console.log('Create Ticket Modal visible')
    difficultySlider = $("#difficultySlider");
    difficultySlider.noUiSlider
      start: 0
      connect: "lower"
      orientation: "horizontal"
      step:1
      range: {
        'min': 0
        'max': 10
      }
    colours = ["slider-material-cyan-300",
               "slider-material-cyan-700",
               "slider-material-blue-800",
               "slider-material-green-600",
               "slider-material-green-800",
               "slider-material-lime",
               "slider-material-yellow",
               "slider-material-amber-900",
               "slider-material-deep-orange",
               "slider-danger",
               "slider-material-red"];

    lastColour = "slider-cyan-300";
    difficultySlider.on slide:()->
      value = colours[parseInt(difficultySlider.val())];
      difficultySlider.toggleClass(lastColour+ " " + value);
      lastColour = value;

    validate = {
      rules:
        name:
          required: true
      ,
      errorPlacement: (error, element) ->
        console.log("error")
        error.insertBefore(element)
      ,
      submitHandler: (form) ->
        data = JSON.parse($("#createTicketModal").data('options').replace(/'/g, '"'))
        values = {}
        $.each $(form).serializeArray(), (i, field) ->
          value = ""
          if !isNaN(field.value)
            value = parseInt(field.value)
          else
            value = field.value
          values[field.name] = value
        values["userId"] = currentUser.id
        values["difficulty"] = parseInt(difficultySlider.val());
        values["projectId"] = data.project_id;
        values["assignerId"] = currentUser.id;
        values["currentKolumnId"] = projectMap[data.project_id].kolumns[0].id

        console.log("Dispatch Create Ticket: " + JSON.stringify(values))
        $.ajax
          url:"createNewTicket"
          data: JSON.stringify(values)
          dataType: 'json'
          contentType: "application/json;charset=utf-8"
          type: 'POST'
          success: (data) ->
            console.log(data)
            $("#createTicketModal").modal('hide')
            return false
        return false
    }
    $("#newTicketForm").submit (e) ->
      e.preventDefault()

    $("#newTicketForm").validate(validate)
