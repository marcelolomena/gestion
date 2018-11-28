import isObject from 'lodash/isObject'
import resolveUrl from '../helpers/resolveUrl.js'

function addInput (form, name, value) {
  const input = document.createElement('input')
  input.type = 'hidden'
  input.name = name
  input.value = value
  form.appendChild(input)
}

export default function (request, target) {
  delete request.template._id
  request.template.content = request.template.content || ' '

  request.options = request.options || {}
  request.options.preview = true

  if (target === '_self') {
    delete request.options.preview
    request.options.download = true
  }

  const mapForm = document.createElement('form')
  mapForm.target = target
  mapForm.method = 'POST'
  mapForm.action = resolveUrl('/api/report')

  function addBody (path, body) {
    if (body === undefined) {
      return
    }

    for (const key in body) {
      if (isObject(body[ key ])) {
        // somehow it skips empty array for template.scripts, this condition fixes that
        if (body[ key ] instanceof Array && body[ key ].length === 0) {
          addInput(mapForm, path + '[' + key + ']', [])
        }
        addBody(path + '[' + key + ']', body[ key ])
      } else {
        if (body[ key ] !== undefined && !(body[ key ] instanceof Array)) {
          addInput(mapForm, path + '[' + key + ']', body[ key ])
        }
      }
    }
  }

  addBody('template', request.template)
  addBody('options', request.options)

  if (request.data) {
    addInput(mapForm, 'data', request.data)
  }

  document.body.appendChild(mapForm)

  mapForm.submit()
}

