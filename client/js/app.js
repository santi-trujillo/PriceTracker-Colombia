const API_URL = "/api/search";

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const resultsSection = document.getElementById("results-section");
  const loadingState = document.getElementById("loading-state");
  const resultsGrid = document.getElementById("results-grid");
  const queryDisplay = document.getElementById("query-display");
  const sortSelect = document.getElementById("sort-select");

  let currentResults = [];
  let currentAbortController = null;

  const searchBtn = searchForm.querySelector(".search-btn");
  const searchBtnText = searchBtn.querySelector("span");
  const originalBtnText = searchBtnText.textContent;

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    searchBtn.disabled = true;
    searchBtnText.textContent = "Buscando...";
    searchBtn.style.opacity = "0.7";
    searchBtn.style.cursor = "not-allowed";

    if (currentAbortController) {
      currentAbortController.abort();
    }
    currentAbortController = new AbortController();

    currentResults = [];
    resultsGrid.innerHTML = "";
    resultsSection.classList.remove("hidden");
    loadingState.classList.remove("hidden");
    resultsGrid.classList.add("hidden");
    queryDisplay.textContent = query;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: currentAbortController.signal,
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      if (data.results) {
        currentResults = data.results;
        renderResults(currentResults, query);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
      resultsGrid.innerHTML = "";

      const errorContainer = document.createElement("div");
      errorContainer.className = "empty-state";
      errorContainer.innerHTML = `
                <div class="empty-icon">⚠️</div>
                <h3>Algo salió mal</h3>
                <p>Hubo un problema al buscar. Por favor intenta de nuevo.</p>
            `;
      errorContainer.style.gridColumn = "1/-1";
      resultsGrid.appendChild(errorContainer);
    } finally {
      if (!currentAbortController.signal.aborted) {
        loadingState.classList.add("hidden");
        resultsGrid.classList.remove("hidden");

        searchBtn.disabled = false;
        searchBtnText.textContent = originalBtnText;
        searchBtn.style.opacity = "1";
        searchBtn.style.cursor = "pointer";
      }
    }
  });

  sortSelect.addEventListener("change", (e) => {
    const sortType = e.target.value;
    sortResults(sortType);
  });

  function sortResults(type) {
    if (!currentResults.length) return;

    let sorted = [...currentResults];
    if (type === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (type === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    }
    renderResults(sorted);
  }

  function renderResults(products, query = "") {
    resultsGrid.innerHTML = "";

    if (products.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.style.gridColumn = "1/-1";
      emptyState.innerHTML = `
                <div class="empty-icon">🔍</div>
                <h3>Sin resultados para "${query}"</h3>
                <p>Intenta con palabras más generales o revisa la ortografía.</p>
            `;
      resultsGrid.appendChild(emptyState);
      return;
    }

    // Find min price to highlight
    const minPrice = Math.min(
      ...products.map((p) => p.price).filter((p) => p > 0)
    );

    const frag = document.createDocumentFragment();

    products.forEach((product) => {
      const isBestPrice = product.price === minPrice && minPrice > 0;
      const card = document.createElement("div");
      card.className = `product-card ${isBestPrice ? "best-price" : ""}`;

      // Image Container
      const imgContainer = document.createElement("div");
      imgContainer.className = "card-image-container";

      const badge = document.createElement("span");
      badge.className = "store-badge";
      badge.textContent = product.store;
      const badgeStyle = getStoreColor(product.store);
      badge.style.cssText = `background-color: ${badgeStyle.split(";")[0]}; ${
        badgeStyle.split(";")[1] || ""
      }`;

      const img = document.createElement("img");
      img.src =
        product.image && product.image.startsWith("https://")
          ? product.image
          : "https://via.placeholder.com/200?text=Sin+Imagen";
      img.alt = product.title;
      img.className = "card-image";
      img.loading = "lazy";

      img.onerror = function () {
        this.onerror = null;
        this.src = "https://via.placeholder.com/200?text=No+Disponible";
      };

      imgContainer.appendChild(badge);
      imgContainer.appendChild(img);

      // Content Container
      const content = document.createElement("div");
      content.className = "card-content";

      const title = document.createElement("h3");
      title.className = "card-title";
      title.title = product.title;
      title.textContent = product.title;

      const price = document.createElement("div");
      price.className = "card-price";
      price.textContent = product.formattedPrice;

      content.appendChild(title);
      content.appendChild(price);

      if (isBestPrice) {
        const bestTag = document.createElement("small");
        bestTag.style.color = "var(--brand-secondary)";
        bestTag.style.fontWeight = "600";
        bestTag.textContent = "🔥 Mejor Precio";
        content.appendChild(bestTag);
      }

      const link = document.createElement("a");
      if (
        product.link &&
        (product.link.startsWith("https://") ||
          product.link.startsWith("http://"))
      ) {
        link.href = product.link;
      } else {
        link.href = "#";
      }
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "view-btn";
      link.textContent = "Ver en Tienda";

      content.appendChild(link);

      card.appendChild(imgContainer);
      card.appendChild(content);

      frag.appendChild(card);
    });

    resultsGrid.appendChild(frag);
  }

  function getStoreColor(storeName) {
    const colors = {
      MercadoLibre: "#ffe600; color: #333",
      Amazon: "#ff9900",
      Falabella: "#a5d802; color: #333",
      Éxito: "#ffe600; color: #333",
      Alkosto: "#eb5e28",
    };
    return colors[storeName] || "#333";
  }
});
