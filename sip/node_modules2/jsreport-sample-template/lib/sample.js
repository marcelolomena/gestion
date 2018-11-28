/*!
 * Copyright(c) 2016 Jan Blaha
 *
 * Sample report used in standard and multitenant version
 */

var join = require('path').join
var fs = require('fs')

module.exports = function (reporter, definition) {
  reporter.initializeListeners.add(definition.name, this, function () {
    return reporter.settings.findValue('sample-created').then(function (v) {
      if (v === true) {
        return
      }

      var dataObj = {
        name: 'Sample data',
        dataJson: fs.readFileSync(join(__dirname, 'sample/data.js')).toString('utf8')
      }

      var scriptObj = {
        name: 'Sample script',
        content: fs.readFileSync(join(__dirname, 'sample/script.js')).toString('utf8')
      }

      var templateObj = {
        name: 'Sample report',
        content: fs.readFileSync(join(__dirname, 'sample/sample.html')).toString('utf8'),
        helpers: fs.readFileSync(join(__dirname, 'sample/helpers.js')).toString('utf8'),
        engine: 'handlebars',
        recipe: 'phantom-pdf',
        phantom: {
          header: "<h1 style='background-color:lightGray'>Library monthly report</h1> ",
          footer: 'Generated on {{generatedOn}}'
        }
      }

      return reporter.settings.addOrSet('sample-created', true).then(function () {
        return reporter.documentStore.collection('data').insert(dataObj).then(function () {
          return reporter.documentStore.collection('scripts').insert(scriptObj).then(function () {
            templateObj.data = {
              shortid: dataObj.shortid
            }
            templateObj.scripts = [{ shortid: scriptObj.shortid }]

            return reporter.documentStore.collection('templates').insert(templateObj)
          })
        })
      }).catch(function (e) {
      })
    })
  })
}
