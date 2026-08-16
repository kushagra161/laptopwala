/**
 * ApexTech Laptops - Application Engine & Interactivity
 * Handles filtering, search, sorting, comparison tool, recommendation quiz,
 * free URL metadata auto-scraper, and server sync.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Master Combined Laptops Dataset
  let ALL_LAPTOPS = [...LAPTOPS_DATA];

  // State Store
  const state = {
    selectedCategory: "all",
    selectedSubcategory: "all",
    selectedBudget: "all",
    searchQuery: "",
    sortBy: "recommended",
    comparedLaptopIds: new Set(),
    quizStep: 1,
    quizAnswers: {
      useCase: "",
      subWorkload: "",
      budget: ""
    },
    currentScrapedProduct: null
  };

  // DOM Elements Cache
  const productsGrid = document.getElementById("productsGrid");
  const resultsCountEl = document.getElementById("resultsCount");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const categoryCards = document.querySelectorAll(".category-card");
  const budgetPills = document.querySelectorAll(".budget-pill");
  
  // Comparison Elements
  const comparisonBar = document.getElementById("comparisonBar");
  const compareCountBadge = document.getElementById("compareCountBadge");
  const openCompareModalBtn = document.getElementById("openCompareModalBtn");
  const compareModal = document.getElementById("compareModal");
  const closeCompareModalBtn = document.getElementById("closeCompareModalBtn");
  const compareTableWrapper = document.getElementById("compareTableWrapper");
  const clearCompareBtn = document.getElementById("clearCompareBtn");

  // Quiz Modal Elements
  const quizModal = document.getElementById("quizModal");
  const openQuizBtns = document.querySelectorAll(".trigger-quiz");
  const closeQuizModalBtn = document.getElementById("closeQuizModalBtn");
  const quizProgressBar = document.getElementById("quizProgressBar");
  const quizSteps = document.querySelectorAll(".quiz-step");
  const quizResultsContainer = document.getElementById("quizResultsContainer");

  // URL Scraper Modal Elements
  const urlScraperModal = document.getElementById("urlScraperModal");
  const openScraperBtns = document.querySelectorAll(".trigger-url-scraper");
  const closeUrlScraperModalBtn = document.getElementById("closeUrlScraperModalBtn");
  const scraperUrlInput = document.getElementById("scraperUrlInput");
  const startScrapeBtn = document.getElementById("startScrapeBtn");
  const scrapeStatusMessage = document.getElementById("scrapeStatusMessage");
  const scrapedPreviewContainer = document.getElementById("scrapedPreviewContainer");
  const saveScrapedProductBtn = document.getElementById("saveScrapedProductBtn");

  // Mobile Nav Elements
  const mobileNavToggle = document.getElementById("mobileNavToggle");
  const navLinks = document.getElementById("navLinks");

  // Load persistent custom laptops from server (if available)
  async function loadCustomLaptopsFromServer() {
    try {
      const res = await fetch('/api/laptops');
      if (res.ok) {
        const customList = await res.json();
        if (Array.isArray(customList) && customList.length > 0) {
          ALL_LAPTOPS = [...customList, ...LAPTOPS_DATA];
          renderProducts();
        }
      }
    } catch (e) {
      console.log("Static mode active or server custom laptops loaded.");
    }
  }

  // Helper SVG Laptop Graphic Generator
  function getLaptopGraphicSVG() {
    return `
      <svg class="laptop-graphic-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 14C12 11.7909 13.7909 10 16 10H48C50.2091 10 52 11.7909 52 14V38H12V14Z" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="2"/>
        <path d="M16 14H48V34H16V14Z" fill="#090d16"/>
        <rect x="22" y="18" width="20" height="12" rx="2" fill="currentColor" fill-opacity="0.3"/>
        <path d="M4 44C4 41.7909 5.79086 40 8 40H56C58.2091 40 60 41.7909 60 44V46C60 48.2091 58.2091 50 56 50H8C5.79086 50 4 48.2091 4 46V44Z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/>
        <path d="M26 42H38" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
  }

  // Helper Affiliate Link Sanitizer
  function getAffiliateUrl(rawUrl) {
    if (!rawUrl || rawUrl === "YOUR_AFFILIATE_LINK_HERE") {
      return AFFILIATE_CONFIG.defaultLink;
    }
    return rawUrl;
  }

  // Core Filtering Logic
  function getFilteredLaptops() {
    return ALL_LAPTOPS.filter(laptop => {
      if (state.selectedCategory !== "all" && !laptop.categories.includes(state.selectedCategory)) {
        return false;
      }
      if (state.selectedSubcategory !== "all" && !laptop.subcategories.includes(state.selectedSubcategory)) {
        return false;
      }
      if (state.selectedBudget !== "all" && laptop.budgetTier !== state.selectedBudget) {
        return false;
      }
      if (state.searchQuery.trim() !== "") {
        const query = state.searchQuery.toLowerCase();
        const matchesName = laptop.name.toLowerCase().includes(query);
        const matchesBrand = laptop.brand.toLowerCase().includes(query);
        const matchesBadge = laptop.bestForBadge.toLowerCase().includes(query);
        const matchesCpu = laptop.specs.cpu.toLowerCase().includes(query);
        const matchesGpu = laptop.specs.gpu.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesBadge && !matchesCpu && !matchesGpu) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (state.sortBy === "price-low") {
        return a.numericPrice - b.numericPrice;
      } else if (state.sortBy === "price-high") {
        return b.numericPrice - a.numericPrice;
      } else if (state.sortBy === "rating") {
        return b.rating - a.rating;
      } else {
        return b.numericPrice - a.numericPrice;
      }
    });
  }

  // Render Product Cards Grid
  function renderProducts() {
    const laptops = getFilteredLaptops();
    resultsCountEl.textContent = laptops.length;

    if (laptops.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-results">
          <h3>No Laptops Matched Your Filters</h3>
          <p>Try resetting your budget or search terms to see available recommendations.</p>
          <button id="resetFiltersBtn" class="btn-primary">Reset Filters</button>
        </div>
      `;
      document.getElementById("resetFiltersBtn")?.addEventListener("click", resetAllFilters);
      return;
    }

    productsGrid.innerHTML = laptops.map(laptop => {
      const isCompared = state.comparedLaptopIds.has(laptop.id);
      const affLink = getAffiliateUrl(laptop.affiliateUrl);

      return `
        <article class="product-card" id="card-${laptop.id}">
          <div class="product-card-top">
            <span class="best-for-badge">${laptop.bestForBadge}</span>
            <span class="rating-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ${laptop.rating} (${laptop.recommendationScore})
            </span>
          </div>

          <div class="product-image-container">
            ${getLaptopGraphicSVG()}
          </div>

          <h3 class="product-title">${laptop.name}</h3>
          <p class="product-description">${laptop.description}</p>

          <div class="product-specs-grid">
            <div class="spec-item">
              <span class="spec-label">Processor</span>
              <span class="spec-value" title="${laptop.specs.cpu}">${laptop.specs.cpu}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Graphics</span>
              <span class="spec-value" title="${laptop.specs.gpu}">${laptop.specs.gpu}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">RAM</span>
              <span class="spec-value">${laptop.specs.ram}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Storage</span>
              <span class="spec-value">${laptop.specs.storage}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Display</span>
              <span class="spec-value" title="${laptop.specs.display}">${laptop.specs.display}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Battery</span>
              <span class="spec-value">${laptop.specs.battery}</span>
            </div>
          </div>

          <div class="product-card-footer">
            <div class="price-row">
              <span class="price-label">Approx. Price</span>
              <span class="price-amount">${laptop.price}</span>
            </div>
            <div class="cta-actions">
              <a href="${affLink}" target="_blank" rel="noopener sponsored" class="btn-check-price">
                Check Price
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <label class="compare-checkbox-label">
                <input type="checkbox" class="compare-checkbox" data-id="${laptop.id}" ${isCompared ? "checked" : ""}>
                Compare
              </label>
            </div>
          </div>
        </article>
      `;
    }).join("");

    attachCompareCheckboxListeners();
  }

  // Compare Checkbox Manager
  function attachCompareCheckboxListeners() {
    const checkboxes = document.querySelectorAll(".compare-checkbox");
    checkboxes.forEach(chk => {
      chk.addEventListener("change", (e) => {
        const id = e.target.getAttribute("data-id");
        if (e.target.checked) {
          if (state.comparedLaptopIds.size >= 3) {
            alert("You can compare a maximum of 3 laptops at once.");
            e.target.checked = false;
            return;
          }
          state.comparedLaptopIds.add(id);
        } else {
          state.comparedLaptopIds.delete(id);
        }
        updateComparisonBar();
      });
    });
  }

  // Update Comparison Sticky Bottom Bar State
  function updateComparisonBar() {
    const count = state.comparedLaptopIds.size;
    compareCountBadge.textContent = count;
    if (count > 0) {
      comparisonBar.classList.add("active");
    } else {
      comparisonBar.classList.remove("active");
    }
  }

  // Render Side-by-Side Comparison Table Modal
  function renderComparisonModal() {
    const compareIds = Array.from(state.comparedLaptopIds);
    const laptops = ALL_LAPTOPS.filter(l => compareIds.includes(l.id));

    if (laptops.length === 0) {
      compareTableWrapper.innerHTML = `<p style="text-align:center; padding: 2rem; color: var(--text-secondary);">Select at least 1 laptop using the 'Compare' checkbox on any product card to see side-by-side specs.</p>`;
      return;
    }

    let tableHtml = `
      <table class="compare-table">
        <thead>
          <tr>
            <th>Spec / Model</th>
            ${laptops.map(laptop => `
              <th>
                <div class="compare-product-header">${laptop.name}</div>
                <div style="font-size:0.8rem; color: var(--accent-cyan); margin-bottom: 0.5rem;">${laptop.bestForBadge}</div>
                <div style="font-size:1.2rem; font-weight:800; color:#fff;">${laptop.price}</div>
              </th>
            `).join("")}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Processor (CPU)</th>
            ${laptops.map(l => `<td><strong>${l.specs.cpu}</strong></td>`).join("")}
          </tr>
          <tr>
            <th>Graphics (GPU)</th>
            ${laptops.map(l => `<td><strong>${l.specs.gpu}</strong></td>`).join("")}
          </tr>
          <tr>
            <th>RAM</th>
            ${laptops.map(l => `<td>${l.specs.ram}</td>`).join("")}
          </tr>
          <tr>
            <th>Storage</th>
            ${laptops.map(l => `<td>${l.specs.storage}</td>`).join("")}
          </tr>
          <tr>
            <th>Display</th>
            ${laptops.map(l => `<td>${l.specs.display}</td>`).join("")}
          </tr>
          <tr>
            <th>Battery Life</th>
            ${laptops.map(l => `<td>${l.specs.battery}</td>`).join("")}
          </tr>
          <tr>
            <th>Weight</th>
            ${laptops.map(l => `<td>${l.specs.weight}</td>`).join("")}
          </tr>
          <tr>
            <th>Top Highlights</th>
            ${laptops.map(l => `
              <td>
                <ul style="padding-left:1rem; font-size:0.82rem; color: var(--text-secondary);">
                  ${l.pros.map(pro => `<li>${pro}</li>`).join("")}
                </ul>
              </td>
            `).join("")}
          </tr>
          <tr>
            <th>Action</th>
            ${laptops.map(l => `
              <td>
                <a href="${getAffiliateUrl(l.affiliateUrl)}" target="_blank" rel="noopener sponsored" class="btn-check-price" style="width:100%; text-align:center;">
                  Check Price
                </a>
              </td>
            `).join("")}
          </tr>
        </tbody>
      </table>
    `;

    compareTableWrapper.innerHTML = tableHtml;
  }

  // Filter Reset Helper
  function resetAllFilters() {
    state.selectedCategory = "all";
    state.selectedSubcategory = "all";
    state.selectedBudget = "all";
    state.searchQuery = "";
    state.sortBy = "recommended";

    searchInput.value = "";
    sortSelect.value = "recommended";

    categoryCards.forEach(c => c.classList.remove("active"));
    document.querySelector('.category-card[data-category="all"]')?.classList.add("active");

    budgetPills.forEach(p => p.classList.remove("active"));
    document.querySelector('.budget-pill[data-budget="all"]')?.classList.add("active");

    renderProducts();
  }

  // Category Filter Events
  categoryCards.forEach(card => {
    card.addEventListener("click", () => {
      categoryCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      state.selectedCategory = card.getAttribute("data-category");
      state.selectedSubcategory = "all";
      renderProducts();
    });
  });

  // Budget Filter Events
  budgetPills.forEach(pill => {
    pill.addEventListener("click", () => {
      budgetPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.selectedBudget = pill.getAttribute("data-budget");
      renderProducts();
    });
  });

  // Search & Sort Events
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderProducts();
  });

  sortSelect.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderProducts();
  });

  // Comparison Triggers
  openCompareModalBtn.addEventListener("click", () => {
    renderComparisonModal();
    compareModal.classList.add("active");
  });

  closeCompareModalBtn.addEventListener("click", () => {
    compareModal.classList.remove("active");
  });

  clearCompareBtn.addEventListener("click", () => {
    state.comparedLaptopIds.clear();
    updateComparisonBar();
    compareModal.classList.remove("active");
    renderProducts();
  });

  // 100% FREE URL PRODUCT SCRAPER EVENT HANDLERS
  openScraperBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      urlScraperModal.classList.add("active");
    });
  });

  closeUrlScraperModalBtn?.addEventListener("click", () => {
    urlScraperModal.classList.remove("active");
  });

  startScrapeBtn?.addEventListener("click", async () => {
    const targetUrl = scraperUrlInput.value.trim();
    if (!targetUrl) {
      alert("Please paste a product URL first.");
      return;
    }

    scrapeStatusMessage.style.display = "block";
    scrapeStatusMessage.textContent = "⏳ Fetching page metadata & auto-extracting specs...";
    scrapedPreviewContainer.style.display = "none";
    startScrapeBtn.disabled = true;

    try {
      const res = await fetch("/api/scrape-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to auto-scrape page");
      }

      const item = data.laptop;
      state.currentScrapedProduct = item;

      // Populate Preview Fields
      document.getElementById("previewTitle").value = item.name;
      document.getElementById("previewPrice").value = item.price;
      document.getElementById("previewCpu").value = item.specs.cpu;
      document.getElementById("previewGpu").value = item.specs.gpu;
      document.getElementById("previewCategory").value = item.categories[0] || "work";
      document.getElementById("previewAffiliateUrl").value = item.affiliateUrl;

      scrapeStatusMessage.textContent = "✅ Product metadata auto-extracted successfully!";
      scrapedPreviewContainer.style.display = "block";

    } catch (err) {
      scrapeStatusMessage.textContent = `⚠️ Scraper Note: ${err.message}. You can fill in the preview fields below.`;
      
      // Fallback object for manual addition
      const fallbackItem = {
        id: "laptop-manual-" + Date.now(),
        name: "Custom Laptop Model",
        brand: "Custom",
        categories: ["work"],
        subcategories: ["custom"],
        budgetTier: "midrange",
        price: "$999",
        numericPrice: 999,
        rating: 4.8,
        recommendationScore: "95%",
        bestForBadge: "Custom Import",
        description: "High performance custom added laptop recommendation.",
        specs: {
          cpu: "High Speed Processor",
          gpu: "Integrated Graphics",
          ram: "16GB RAM",
          storage: "512GB SSD",
          display: "15.6\" FHD",
          battery: "8+ Hours",
          weight: "3.5 lbs"
        },
        pros: ["Handpicked Custom Laptop"],
        affiliateUrl: targetUrl
      };

      state.currentScrapedProduct = fallbackItem;
      document.getElementById("previewTitle").value = fallbackItem.name;
      document.getElementById("previewPrice").value = fallbackItem.price;
      document.getElementById("previewCpu").value = fallbackItem.specs.cpu;
      document.getElementById("previewGpu").value = fallbackItem.specs.gpu;
      document.getElementById("previewAffiliateUrl").value = targetUrl;
      scrapedPreviewContainer.style.display = "block";
    } finally {
      startScrapeBtn.disabled = false;
    }
  });

  saveScrapedProductBtn?.addEventListener("click", async () => {
    if (!state.currentScrapedProduct) return;

    // Grab updated inputs from preview editor
    const editedTitle = document.getElementById("previewTitle").value;
    const editedPrice = document.getElementById("previewPrice").value;
    const editedCpu = document.getElementById("previewCpu").value;
    const editedGpu = document.getElementById("previewGpu").value;
    const editedCat = document.getElementById("previewCategory").value;
    const editedAffUrl = document.getElementById("previewAffiliateUrl").value;

    const numPrice = parseFloat(editedPrice.replace(/[^0-9.]/g, '')) || 999;
    let bTier = "midrange";
    if (numPrice < 700) bTier = "budget";
    else if (numPrice >= 1400) bTier = "premium";

    const finalProduct = {
      ...state.currentScrapedProduct,
      name: editedTitle,
      price: editedPrice.startsWith('$') ? editedPrice : `$${editedPrice}`,
      numericPrice: numPrice,
      budgetTier: bTier,
      categories: [editedCat],
      affiliateUrl: editedAffUrl,
      specs: {
        ...state.currentScrapedProduct.specs,
        cpu: editedCpu,
        gpu: editedGpu
      }
    };

    // Save to server & master dataset
    try {
      await fetch('/api/add-laptop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProduct)
      });
    } catch (e) {
      console.log("Added to local memory.");
    }

    ALL_LAPTOPS.unshift(finalProduct);
    urlScraperModal.classList.remove("active");
    renderProducts();
    alert(`🎉 Successfully added "${finalProduct.name}" to your live catalog!`);
  });

  // Quiz Modal Logic
  openQuizBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      state.quizStep = 1;
      state.quizAnswers = { useCase: "", subWorkload: "", budget: "" };
      updateQuizUI();
      quizModal.classList.add("active");
    });
  });

  closeQuizModalBtn?.addEventListener("click", () => {
    quizModal.classList.remove("active");
  });

  document.querySelectorAll(".quiz-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const step = parseInt(btn.getAttribute("data-quiz-step"));
      const value = btn.getAttribute("data-quiz-value");

      if (step === 1) {
        state.quizAnswers.useCase = value;
        state.quizStep = 2;
      } else if (step === 2) {
        state.quizAnswers.subWorkload = value;
        state.quizStep = 3;
      } else if (step === 3) {
        state.quizAnswers.budget = value;
        state.quizStep = 4;
        renderQuizResults();
      }
      updateQuizUI();
    });
  });

  function updateQuizUI() {
    quizSteps.forEach(stepEl => {
      const stepNum = parseInt(stepEl.getAttribute("data-step"));
      if (stepNum === state.quizStep) {
        stepEl.classList.add("active");
      } else {
        stepEl.classList.remove("active");
      }
    });

    const progressPercent = (state.quizStep / 4) * 100;
    quizProgressBar.style.width = `${progressPercent}%`;
  }

  function renderQuizResults() {
    const { useCase, budget } = state.quizAnswers;
    const matched = ALL_LAPTOPS.filter(l => {
      const matchCat = useCase === "all" || l.categories.includes(useCase);
      const matchBudget = budget === "all" || l.budgetTier === budget;
      return matchCat && matchBudget;
    }).slice(0, 2);

    const displayMatches = matched.length > 0 ? matched : ALL_LAPTOPS.slice(0, 2);

    quizResultsContainer.innerHTML = `
      <div style="text-align:center; margin-bottom: 1.5rem;">
        <h3 style="font-size:1.4rem; color:#fff; margin-bottom:0.4rem;">Top Match Recommendation</h3>
        <p style="color:var(--text-secondary); font-size:0.9rem;">Based on your selected workload & budget criteria:</p>
      </div>
      <div style="display:flex; flex-direction:column; gap:1rem;">
        ${displayMatches.map(laptop => `
          <div style="background:var(--bg-dark); border:1px solid var(--border-color); padding:1.25rem; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap;">
            <div>
              <span class="best-for-badge" style="font-size:0.7rem;">${laptop.bestForBadge}</span>
              <h4 style="font-size:1.1rem; color:#fff; margin:0.3rem 0;">${laptop.name}</h4>
              <p style="font-size:0.8rem; color:var(--text-secondary);">${laptop.specs.cpu} | ${laptop.specs.gpu} | ${laptop.specs.ram}</p>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.5rem;">
              <span style="font-size:1.3rem; font-weight:800; color:#fff;">${laptop.price}</span>
              <a href="${getAffiliateUrl(laptop.affiliateUrl)}" target="_blank" rel="noopener sponsored" class="btn-check-price" style="font-size:0.85rem; padding:0.5rem 0.9rem;">
                Check Price
              </a>
            </div>
          </div>
        `).join("")}
      </div>
      <button id="applyQuizToCatalogBtn" class="btn-secondary" style="width:100%; margin-top:1.5rem; justify-content:center;">
        View Matches in Main Catalog
      </button>
    `;

    document.getElementById("applyQuizToCatalogBtn")?.addEventListener("click", () => {
      state.selectedCategory = useCase;
      state.selectedBudget = budget;
      
      categoryCards.forEach(c => {
        if (c.getAttribute("data-category") === useCase) c.classList.add("active");
        else c.classList.remove("active");
      });

      budgetPills.forEach(p => {
        if (p.getAttribute("data-budget") === budget) p.classList.add("active");
        else p.classList.remove("active");
      });

      quizModal.classList.remove("active");
      renderProducts();
      document.getElementById("catalogSection")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Mobile Navigation
  mobileNavToggle?.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Close Modals Backdrop Click
  window.addEventListener("click", (e) => {
    if (e.target === compareModal) compareModal.classList.remove("active");
    if (e.target === quizModal) quizModal.classList.remove("active");
    if (e.target === urlScraperModal) urlScraperModal.classList.remove("active");
  });

  // Init Boot
  loadCustomLaptopsFromServer();
  renderProducts();
});
