var winston = require('winston'),
path = require('path');
winston.emitErrs = true;

const tsFormat = () => (new Date()).toLocaleTimeString();

var logDirectory = path.join(__dirname, '..', 'log');

var logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      timestamp: tsFormat,
      colorize: true,
      json: false,
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDirectory}` + path.sep + `lin.log`,
      timestamp: tsFormat,
      handleExceptions: true,
      json: false,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      level: 'info'
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};