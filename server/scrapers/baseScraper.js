const axios = require("axios");
const cheerio = require("cheerio");
const UserAgent = require("user-agents");
const config = require("../config");
const logger = require("../utils/logger");

class BaseScraper {
  constructor(platform) {
    this.platform = platform;
  }

  getRandomUserAgent() {
    return new UserAgent({
      deviceCategory: config.scraping.userAgent,
    }).toString();
  }

  async fetchHtml(url, retries = config.scraping.maxRetries) {
    const headers = {
      "User-Agent": this.getRandomUserAgent(),
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "es-CO,es;q=0.9,en;q=0.8",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    };

    try {
      logger.info(`[${this.platform}] Fetching`, { url });
      const { data } = await axios.get(url, {
        headers,
        timeout: config.scraping.timeout.axios,
      });
      return cheerio.load(data);
    } catch (error) {
      if (retries > 0) {
        const delay =
          config.scraping.retryDelay *
          (config.scraping.maxRetries - retries + 1);
        logger.warn(
          `[${this.platform}] Retrying in ${delay}ms... (${retries} left)`,
          { error: error.message }
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.fetchHtml(url, retries - 1);
      }
      logger.error(`[${this.platform}] Error exhausted retries`, error);
      return null;
    }
  }
}

module.exports = BaseScraper;
