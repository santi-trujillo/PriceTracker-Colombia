const BaseScraper = require("./baseScraper");

class AlkostoScraper extends BaseScraper {
  constructor() {
    super("Alkosto");
  }

  async search(query) {
    const url = `https://www.alkosto.com/search/?text=${encodeURIComponent(
      query,
    )}`;
    const logger = require("../utils/logger");

    const $ = await this.fetchWithPuppeteer(url, ".product__item__top__title");

    if (!$) {
      logger.warn("[Alkosto] Puppeteer failed, returning empty results");
      return [];
    }

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
  }
}

module.exports = new AlkostoScraper();
