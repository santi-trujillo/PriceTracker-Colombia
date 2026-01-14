const BaseScraper = require("./baseScraper");

class FalabellaScraper extends BaseScraper {
  constructor() {
    super("Falabella");
  }

  async search(query) {
    const url = `https://www.falabella.com.co/falabella-co/search?Ntt=${encodeURIComponent(
      query
    )}`;
    const $ = await this.fetchHtml(url);

    if (!$) return [];

    const results = [];
    try {
      const nextData = $("#__NEXT_DATA__").html();
      if (nextData) {
        const json = JSON.parse(nextData);

        let products = json.props?.pageProps?.results || [];

        if (!products.length && json.props?.pageProps?.searchResult?.results) {
          products = json.props.pageProps.searchResult.results;
        }

        products.slice(0, 10).forEach((p) => {
          let price = 0;
          if (p.prices && p.prices.length > 0) {
            const cheapest = p.prices.reduce((min, curr) => {
              const val =
                parseInt(curr.price[0].replace(/\./g, "")) || 99999999;
              return val < min ? val : min;
            }, 99999999);
            if (cheapest !== 99999999) price = cheapest;
          }

          if (price > 0) {
            results.push({
              id: `fal-${p.skuId || p.productId}`,
              title: p.displayName,
              price,
              formattedPrice: `$ ${price.toLocaleString("es-CO")}`,
              store: "Falabella",
              link: p.url
                ? p.url.startsWith("http")
                  ? p.url
                  : `https://www.falabella.com.co${p.url}`
                : "",
              image: p.mediaUrls
                ? p.mediaUrls[0]
                : "https://via.placeholder.com/150",
              rating: p.rating || 4.0,
            });
          }
        });
      }
    } catch (e) {
      const logger = require("../utils/logger");
      logger.error("[Falabella] Error parsing JSON", e);
    }

    return results;
  }
}

module.exports = new FalabellaScraper();
