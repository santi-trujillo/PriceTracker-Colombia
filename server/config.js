require("dotenv").config();

const config = {
  server: {
    port: parseInt(process.env.PORT) || 3000,
    globalTimeout: parseInt(process.env.GLOBAL_TIMEOUT) || 30000,
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
      max: parseInt(process.env.RATE_LIMIT_MAX) || 60,
    },
  },
  scraping: {
    timeout: {
      axios: parseInt(process.env.AXIOS_TIMEOUT) || 8000,
      puppeteerNavigation: parseInt(process.env.PUPPETEER_NAV_TIMEOUT) || 15000,
      puppeteerSelector: parseInt(process.env.PUPPETEER_SEL_TIMEOUT) || 8000,
      pageClose: parseInt(process.env.PAGE_CLOSE_TIMEOUT) || 5000,
    },
    maxRetries: parseInt(process.env.MAX_RETRIES) || 2,
    retryDelay: parseInt(process.env.RETRY_DELAY) || 1000,
    viewport: { width: 1366, height: 768 },
    userAgent: "desktop",
  },
  browser: {
    headless: process.env.HEADLESS !== "false" ? "new" : false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
    ],
  },
};

module.exports = config;
