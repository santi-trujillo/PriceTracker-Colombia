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
          Math.pow(2, config.scraping.maxRetries - retries);
        logger.warn(
          `[${this.platform}] Retrying in ${delay}ms... (${retries} left)`,
          { error: error.message },
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.fetchHtml(url, retries - 1);
      }
      logger.error(`[${this.platform}] Error exhausted retries`, error);
      return null;
    }
  }

  async fetchWithPuppeteer(url, selector = null) {
    const browserManager = require("../utils/browserManager");

    let page = null;
    try {
      logger.info(`[${this.platform}] Launching Puppeteer`, { url });
      page = await browserManager.getPage();

      await page.setUserAgent(this.getRandomUserAgent());
      await page.setViewport(config.scraping.viewport);

      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: config.scraping.timeout.puppeteerNavigation,
      });

      if (selector) {
        try {
          await page.waitForSelector(selector, {
            timeout: config.scraping.timeout.puppeteerSelector,
          });
        } catch (e) {
          logger.warn(
            `[${this.platform}] Selector '${selector}' timeout (continuing anyway)`,
          );
        }
      }

      const content = await page.content();
      return cheerio.load(content);
    } catch (error) {
      logger.error(`[${this.platform}] Puppeteer error`, error);
      return null;
    } finally {
      if (page) {
        try {
          await Promise.race([
            page.close(),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Page close timeout")),
                config.scraping.timeout.pageClose,
              ),
            ),
          ]);
        } catch (e) {
          logger.error(`[${this.platform}] Failed to close page`, e);
        }
      }
    }
  }
}

module.exports = BaseScraper;
