const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const config = require("./config");
const logger = require("./utils/logger");
const browserManager = require("./utils/browserManager");

const app = express();
const PORT = config.server.port;

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

const limiter = rateLimit({
  windowMs: config.server.rateLimit.windowMs,
  max: config.server.rateLimit.max,
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

app.get("/health", (req, res) => {
  res.send("PriceTracker Colombia API is running");
});

const amazonScraper = require("./scrapers/amazon");
const mlScraper = require("./scrapers/mercadolibre");
const exitoScraper = require("./scrapers/exito");
const falabellaScraper = require("./scrapers/falabella");
const alkostoScraper = require("./scrapers/alkosto");

app.post("/api/search", async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  if (query.length > 100) {
    return res.status(400).json({ error: "Query too long (max 100 chars)" });
  }

  const safeQuery = query.replace(/[^\w\s\u00C0-\u00FF]/g, "").trim();

  if (!safeQuery) {
    return res.status(400).json({ error: "Invalid query" });
  }

  logger.info(`Searching`, { query: safeQuery });

  try {
    const results = await Promise.allSettled([
      amazonScraper.search(safeQuery),
      mlScraper.search(safeQuery),
      exitoScraper.search(safeQuery),
      falabellaScraper.search(safeQuery),
      alkostoScraper.search(safeQuery),
    ]);

    let allProducts = [];
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        allProducts = [...allProducts, ...result.value];
      } else {
        logger.error("Scraper failed", result.reason);
      }
    });

    allProducts.sort((a, b) => {
      if (!a.price) return 1;
      if (!b.price) return -1;
      return a.price - b.price;
    });

    res.json({ results: allProducts });
  } catch (error) {
    logger.error("Global search error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const server = app.listen(PORT, async () => {
  logger.info(`Server running`, { url: `http://localhost:${PORT}` });
  try {
    await browserManager.init();
    logger.info("Background browser initialized");
  } catch (e) {
    logger.error("Failed to init browser", e);
  }
});

process.on("SIGINT", async () => {
  logger.info("SIGINT signal received");
  server.close(async () => {
    await browserManager.close();
    logger.info("Server and browser closed");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received");
  server.close(async () => {
    await browserManager.close();
    process.exit(0);
  });
});
