const BaseScraper = require("./baseScraper");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

class AlkostoScraper extends BaseScraper {
  constructor() {
    super("Alkosto");
  }

  async search(query) {
    const browserManager = require("../utils/browserManager");
    const config = require("../config");
    const logger = require("../utils/logger");

    const url = `https://www.alkosto.com/search/?text=${encodeURIComponent(
      query
    )}`;
    logger.info(`[Alkosto] Launching Puppeteer`, { url });

    let page = null;

    try {
      page = await browserManager.getPage();

      await page.setUserAgent(this.getRandomUserAgent());
      await page.setViewport(config.scraping.viewport);

      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: config.scraping.timeout.puppeteerNavigation,
      });

      try {
        await page.waitForSelector(".product__item__top__title", {
          timeout: config.scraping.timeout.puppeteerSelector,
        });
      } catch (e) {
        logger.warn("[Alkosto] Wait selector timeout");
      }

      const content = await page.content();

      const $ = cheerio.load(content);
      const results = [];

      const cards = $(".product__item");

      cards.slice(0, 10).each((i, el) => {
        const $el = $(el);
        if ($el.hasClass("product__item--loading")) return;

        const title = $el.find(".product__item__top__title").text().trim();
        if (!title) return;

        let link = $el.find("a.product__item__top__link").attr("href");
        if (link && !link.startsWith("http"))
          link = `https://www.alkosto.com${link}`;

        const priceText =
          $el.find(".product__price--discounts__price").first().text().trim() ||
          $el
            .find(".product__item__information__price .price")
            .first()
            .text()
            .trim();

        const price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;

        const image =
          $el.find("img").attr("src") || $el.find("img").attr("data-src");

        if (price > 0) {
          results.push({
            id: `alk-${i}`,
            title,
            price,
            formattedPrice: priceText,
            store: "Alkosto",
            link,
            image: image
              ? image.startsWith("http")
                ? image
                : `https://www.alkosto.com${image}`
              : "",
            rating: 4.3,
          });
        }
      });

      return results;
    } catch (error) {
      logger.error("[Alkosto] Puppeteer error", error);
      return [];
    } finally {
      if (page) await page.close();
    }
  }
}

module.exports = new AlkostoScraper();
