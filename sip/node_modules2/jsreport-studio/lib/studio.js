var Express = require('express')
var favicon = require('serve-favicon')
var compression = require('compression')
var path = require('path')
var fs = require('fs')
var url = require('url')
var requestLog = require('./requestLog')

module.exports = function (reporter, definition) {
  requestLog(reporter)
  var compiler

  function sendIndex (req, res, next) {
    var indexHtml = path.join(__dirname, '../static/dist/index.html')

    function send (err, content) {
      if (err) {
        return next(err)
      }

      content = content.replace('client.js', reporter.options.appPath + 'studio/assets/client.js')

      res.send(content
        .replace('$jsreportVersion', reporter.version)
        .replace('$jsreportMode', reporter.options.mode))
    }

    function tryRead () {
      compiler.outputFileSystem.readFile(indexHtml, 'utf8', function (err, content) {
        if (err) {
          return setTimeout(tryRead, 1000)
        }

        send(null, content)
      })
    }

    if (reporter.options.mode === 'jsreport-development') {
      tryRead()
    } else {
      fs.readFile(indexHtml, 'utf8', send)
    }
  }

  function redirectOrSendIndex (req, res, next) {
    var reqUrl = url.parse(req.originalUrl)
    if (reqUrl.pathname[reqUrl.pathname.length - 1] !== '/') {
      return res.redirect(reqUrl.pathname + '/' + (reqUrl.search || ''))
    }

    sendIndex(req, res, next)
  }

  reporter.on('after-authentication-express-routes', function () {
    return reporter.express.app.get('/', redirectOrSendIndex)
  })

  reporter.on('after-express-static-configure', function () {
    if (!reporter.authentication) {
      return reporter.express.app.get('/', redirectOrSendIndex)
    }
  })

  reporter.on('before-express-configure', function () {
    reporter.express.app.use('/api/report', function (req, res, next) {
      res.cookie('render-complete', true)
      next()
    })
  })

  reporter.on('express-configure', function () {
    if (reporter.options.mode !== 'jsreport-development') {
      if (!fs.existsSync(path.join(__dirname, '../static/dist/extensions.client.js'))) {
        fs.renameSync(path.join(__dirname, '../static/dist/1.client.js'), path.join(__dirname, '../static/dist/extensions.client.js'))
      }
      var webpackWrap = fs.readFileSync(path.join(__dirname, '../static/dist/extensions.client.js'), 'utf8')
      var webpackExtensions = webpackWrap.replace('$extensionsHere', function () {
        return reporter.extensionsManager.extensions.map(function (e) {
          try {
            return fs.readFileSync(path.join(e.directory, 'studio/main.js'))
          } catch (e) {
            return ''
          }
        }).join('\n')
      })
      fs.writeFileSync(path.join(__dirname, '../static/dist/1.client.js'), webpackExtensions)
    } else {
      fs.writeFileSync(path.join(__dirname, '../src/extensions_dev.js'), reporter.extensionsManager.extensions.map(function (e) {
        try {
          fs.statSync(path.join(e.directory, '/studio/main_dev.js'))
          return "import '" + path.relative(path.join(__dirname, '../src'), path.join(e.directory, '/studio/main_dev.js')).replace(/\\/g, '/') + "'"
        } catch (e) {
          return ''
        }
      }).join('\n'))
    }

    var app = reporter.express.app

    app.use(compression())
    app.use(favicon(path.join(__dirname, '../static', 'favicon.ico')))

    if (reporter.options.mode === 'jsreport-development') {
      var webpack = require('webpack')
      var webpackConfig = require('../webpack/dev.config')(reporter.extensionsManager.extensions)
      compiler = webpack(webpackConfig)
      reporter.express.app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: '/studio/assets/',
        hot: true,
        inline: true,
        lazy: false,
        stats: { colors: true }
      }))
      reporter.express.app.use(require('webpack-hot-middleware')(compiler))
    }

    app.use('/studio/assets', Express.static(path.join(__dirname, '../static', 'dist')))

    app.get('/studio/*', sendIndex)
  })
}
