const BaseScraper = require("./baseScraper");

class MercadoLibreScraper extends BaseScraper {
  constructor() {
    super("MercadoLibre");
  }

  async search(query) {
    const logger = require("../utils/logger");
    const url = `https://listado.mercadolibre.com.co/${encodeURIComponent(
      query,
    )}`;
    const $ = await this.fetchHtml(url);

    if (!$) return [];

    const results = [];

    const selectors = [".ui-search-layout__item", ".poly-card", ".andes-card"];

    let cards = $();
    for (const sel of selectors) {
      cards = $(sel);
      if (cards.length > 0) {
        logger.info(`[MercadoLibre] Using selector: ${sel}`);
        break;
      }
    }

    if (cards.length === 0) {
      logger.warn("[MercadoLibre] No products found with any selector");
      return [];
    }

    cards.slice(0, 10).each((i, el) => {
      const $el = $(el);

      const title =
        $el.find(".ui-search-item__title").text().trim() ||
        $el.find(".poly-component__title").text().trim();

      if (!title) return;

      let link =
        $el.find("a.ui-search-link").attr("href") || $el.find("a").attr("href");

      let image =
        $el.find("img.ui-search-result-image__element").attr("data-src") ||
        $el.find("img.ui-search-result-image__element").attr("src") ||
        $el.find(".poly-component__picture").attr("src");

      const priceContainer = $el.find(".ui-search-price__second-line").first();
      let priceText = priceContainer
        .find(".andes-money-amount__fraction")
        .text()
        .trim();

      if (!priceText) {
        priceText = $el
          .find(".poly-price__current .andes-money-amount__fraction")
          .first()
          .text()
          .trim();
      }

      const price = parseInt(priceText.replace(/\./g, "")) || 0;

      if (price > 0 && link) {
        results.push({
          id: `ml-${i}`,
          title,
          price,
          formattedPrice: `$ ${price.toLocaleString("es-CO")}`,
          store: "MercadoLibre",
          link,
          image: image || "https://via.placeholder.com/150",
          rating: 4.5,
        });
      }
    });

    return results;
  }
}

module.exports = new MercadoLibreScraper();
