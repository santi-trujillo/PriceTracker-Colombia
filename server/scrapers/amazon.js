const BaseScraper = require("./baseScraper");

class AmazonScraper extends BaseScraper {
  constructor() {
    super("Amazon");
  }

  async search(query) {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
    let $ = await this.fetchHtml(url);

    if (!$ || $('div[data-component-type="s-search-result"]').length === 0) {
      const logger = require("../utils/logger");
      logger.info("[Amazon] Axios blocked or empty. Switching to Puppeteer...");
      $ = await this.fetchWithPuppeteer(
        url,
        'div[data-component-type="s-search-result"]',
      );
    }

    if (!$) return [];

    const results = [];
    const cards = $('div[data-component-type="s-search-result"]');

    cards.slice(0, 10).each((i, el) => {
      const $el = $(el);

      const title = $el.find("h2 span").first().text().trim();
      if (!title) return;

      let link = $el.find("h2 a").attr("href");
      if (link && !link.startsWith("http")) {
        link = `https://www.amazon.com${link}`;
      }

      const image = $el.find("img.s-image").attr("src");

      const priceText =
        $el.find(".a-price .a-offscreen").first().text().trim() ||
        $el.find(".a-price-whole").first().text().trim();

      const price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;

      if (link) {
        results.push({
          id: `amz-${i}`,
          title,
          price,
          formattedPrice: priceText || "N/A",
          store: "Amazon",
          link,
          image: image || "https://via.placeholder.com/150",
          rating: 4.0,
        });
      }
    });

    return results;
  }
}

module.exports = new AmazonScraper();
