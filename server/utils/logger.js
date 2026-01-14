const logger = {
  info: (message, meta = {}) => {
    console.log(
      JSON.stringify({
        level: "INFO",
        timestamp: new Date().toISOString(),
        message,
        ...meta,
      })
    );
  },
  error: (message, error = null) => {
    console.error(
      JSON.stringify({
        level: "ERROR",
        timestamp: new Date().toISOString(),
        message,
        error: error ? error.message : undefined,
        stack: error ? error.stack : undefined,
      })
    );
  },
  warn: (message, meta = {}) => {
    console.warn(
      JSON.stringify({
        level: "WARN",
        timestamp: new Date().toISOString(),
        message,
        ...meta,
      })
    );
  },
};

module.exports = logger;
