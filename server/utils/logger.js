const shouldLog = process.env.NODE_ENV !== "test";

const logger = {
  info: (message, meta = {}) => {
    if (!shouldLog) return;
    console.log(
      JSON.stringify({
        level: "INFO",
        timestamp: new Date().toISOString(),
        message,
        ...meta,
      }),
    );
  },
  error: (message, error = null) => {
    if (!shouldLog) return;
    console.error(
      JSON.stringify({
        level: "ERROR",
        timestamp: new Date().toISOString(),
        message,
        error: error ? error.message : undefined,
        stack: error ? error.stack : undefined,
      }),
    );
  },
  warn: (message, meta = {}) => {
    if (!shouldLog) return;
    console.warn(
      JSON.stringify({
        level: "WARN",
        timestamp: new Date().toISOString(),
        message,
        ...meta,
      }),
    );
  },
};

module.exports = logger;
