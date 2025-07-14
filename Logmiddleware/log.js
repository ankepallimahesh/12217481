const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, 'logs.txt');
const logger = (req, res, next) => {
  const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`;
  fs.appendFileSync(logFilePath, logEntry);
  next();
};

module.exports = logger;
