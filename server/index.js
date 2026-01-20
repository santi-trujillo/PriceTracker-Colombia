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
  }),
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
  const { query } = req.body || {};

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
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Global search timeout")),
        config.server.globalTimeout,
      ),
    );

    const searchPromise = Promise.allSettled([
      amazonScraper.search(safeQuery),
      mlScraper.search(safeQuery),
      exitoScraper.search(safeQuery),
      falabellaScraper.search(safeQuery),
      alkostoScraper.search(safeQuery),
    ]);

    const results = await Promise.race([searchPromise, timeoutPromise]);

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

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} signal received`);

  const timeout = setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);

  server.close(async () => {
    try {
      await browserManager.close();
      clearTimeout(timeout);
      logger.info("Server and browser closed gracefully");
      process.exit(0);
    } catch (e) {
      logger.error("Error during shutdown", e);
      clearTimeout(timeout);
      process.exit(1);
    }
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
