const puppeteer = require("puppeteer");
const config = require("../config");
const logger = require("./logger");

class BrowserManager {
  constructor() {
    this.browser = null;
    this.launchPromise = null;
  }

  async init() {
    if (this.browser) return this.browser;
    if (this.launchPromise) {
      logger.info("BrowserManager waiting for existing launch process...");
      return this.launchPromise;
    }

    this.launchPromise = this._launchBrowser();
    return this.launchPromise;
  }

  async _launchBrowser() {
    logger.info("BrowserManager launching shared instance...");
    try {
      const browser = await puppeteer.launch(config.browser);
      logger.info("BrowserManager shared browser launched.");

      browser.on("disconnected", () => {
        logger.warn("BrowserManager browser disconnected! Resetting...");
        this.browser = null;
        this.launchPromise = null;
      });

      this.browser = browser;
      return browser;
    } catch (error) {
      logger.error("BrowserManager failed to launch", error);
      this.launchPromise = null;
      throw error;
    }
  }

  async getPage() {
    if (!this.browser) await this.init();
    return this.browser.newPage();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      logger.info("BrowserManager closed.");
    }
  }
}

module.exports = new BrowserManager();
