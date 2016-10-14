var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  winston = require('winston'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  flash = require('express-flash'),
  fs = require('fs'),
  app = express(),
  logDirectory = path.join(__dirname, 'log'),
  passport = require('passport'),
  session = require('express-session'),
  SequelizeStore = require('connect-session-sequelize')(session.Store),
  sequelize = require('./models/index').sequelize;

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

const tsFormat = () => (new Date()).toLocaleTimeString();

var logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      timestamp: tsFormat,
      colorize: true
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDirectory}/sip.log`,
      timestamp: tsFormat,
      datePattern: 'dd-MM-yyyy',
      prepend: true,
      level: app.get('env') === 'development' ? 'verbose' : 'info'
    })
  ]
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// Configuring Passport
app.use(session({
  secret: 'keyboard cat',
  //cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000,
    db: sequelize
  })
}));
app.use(passport.initialize());
app.use(passport.session());


// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);
var routes = require('./routes')(app, passport);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    logger.error(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });

  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  logger.error(err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;