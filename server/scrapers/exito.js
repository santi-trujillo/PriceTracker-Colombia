const BaseScraper = require("./baseScraper");

class ExitoScraper extends BaseScraper {
  constructor() {
    super("Éxito");
  }

  async search(query) {
    const url = `https://www.exito.com/s?q=${encodeURIComponent(query)}`;
    const logger = require("../utils/logger");

    const $ = await this.fetchWithPuppeteer(
      url,
      'article[data-testid="store-product-card"]',
    );

    if (!$) {
      logger.warn("[Éxito] Puppeteer failed, returning empty results");
      return [];
    }

    const results = [];

    let cards = $('article[data-testid="store-product-card"]');
    if (cards.length === 0) cards = $(".vtex-product-summary-2-x-container");

    cards.slice(0, 10).each((i, el) => {
      const $el = $(el);

      const title =
        $el.find("h3 a").text().trim() ||
        $el.find(".vtex-product-summary-2-x-productBrand").text().trim();

      if (!title) return;

      let link =
        $el.find("h3 a").attr("href") ||
        $el.find("a.vtex-product-summary-2-x-clearLink").attr("href");
      if (link && !link.startsWith("http"))
        link = `https://www.exito.com${link}`;

      const priceText =
        $el
          .find('div[data-fs-product-price-type="selling"]')
          .text()
          .split("$")[1] ||
        $el.find(".vtex-product-price-1-x-sellingPriceValue").text().trim();

      const price = parseInt((priceText || "0").replace(/\./g, "")) || 0;

      const image =
        $el.find('img[data-fs-image="true"]').attr("src") ||
        $el.find("img.vtex-product-summary-2-x-imageNormal").attr("src");

      if (price > 0) {
        results.push({
          id: `exito-${i}`,
          title,
          price,
          formattedPrice: `$ ${price.toLocaleString("es-CO")}`,
          store: "Éxito",
          link,
          image: image || "",
          rating: 4.2,
        });
      }
    });

    return results;
  }
}

module.exports = new ExitoScraper();
