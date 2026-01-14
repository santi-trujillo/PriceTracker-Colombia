require("dotenv").config();

const config = {
  server: {
    port: process.env.PORT || 3000,
    rateLimit: {
      windowMs: 60 * 1000,
      max: 60,
    },
  },
  scraping: {
    timeout: {
      axios: 8000,
      puppeteerNavigation: 15000,
      puppeteerSelector: 8000,
    },
    maxRetries: 2,
    retryDelay: 1000,
    viewport: { width: 1366, height: 768 },
    userAgent: "desktop",
  },
  browser: {
    headless: "new",
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
