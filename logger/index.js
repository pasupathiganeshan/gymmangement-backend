const { createLogger, format, transports } = require('winston');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');
const config = require('../config'); // Assuming your config is being imported from a config file

const customFormat = format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: config.logLevel,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }), // To include error stack traces
    customFormat
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.errors({ stack: true }), // To include error stack traces
        customFormat
      )
    }),
    new DailyRotateFile({
      // eslint-disable-next-line no-undef
      filename: path.resolve(__dirname, `../logs/${config.NODE_ENV}-%DATE%.log`),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }), // To include error stack traces
        customFormat
      )
    })
  ]
});

module.exports = logger;
