/**
 * ApexTech Laptops - Express Server & Render Integration
 * - Static file server for frontend
 * - 100% Free URL Product Scraper (No Amazon/Meta API key required)
 * - Self-Pinging Keep-Alive timer to prevent Render free-tier idle sleep (15 min timeout)
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;
const CUSTOM_DATA_PATH = path.join(__dirname, 'data', 'custom_laptops.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Ensure data folder exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(CUSTOM_DATA_PATH)) {
  fs.writeFileSync(CUSTOM_DATA_PATH, JSON.stringify([]));
}

// -------------------------------------------------------------------
// 1. RENDER ANTI-SLEEP AUTO-PING KEEP-ALIVE SYSTEM (100% FREE)
// Pings the server every 14 minutes to prevent Render free container sleep
// -------------------------------------------------------------------
const PING_INTERVAL = 14 * 60 * 1000; // 14 Minutes

function keepAlivePing() {
  const externalUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  const pingEndpoint = `${externalUrl}/ping`;

  console.log(`[Auto-Ping] Pinging keep-alive endpoint: ${pingEndpoint}`);

  const client = pingEndpoint.startsWith('https') ? https : http;
  
  client.get(pingEndpoint, (res) => {
    console.log(`[Auto-Ping] Keep-alive response status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.warn(`[Auto-Ping] Keep-alive ping warning: ${err.message}`);
  });
}

// Start keep-alive loop
setInterval(keepAlivePing, PING_INTERVAL);

// Health check / ping endpoint
app.get('/ping', (req, res) => {
  res.json({
    status: 'active',
    service: 'ApexTech Laptops Engine',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => res.redirect('/ping'));

// -------------------------------------------------------------------
// 2. 100% FREE URL PRODUCT SCRAPER (NO API KEYS REQUIRED)
// Parses OpenGraph, Meta Tags, JSON-LD, & Amazon/Retailer HTML
// -------------------------------------------------------------------
app.post('/api/scrape-product', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Valid URL is required' });
    }

    console.log(`[Scraper] Scraping product metadata from: ${url}`);
    
    // Fetch raw HTML using fetch with browser user-agent
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Could not fetch URL (HTTP ${response.status}). The page may require manual entry.`
      });
    }

    const html = await response.text();

    // Utility Regex Parsers
    const getMetaContent = (propertyOrName) => {
      const match = html.match(new RegExp(`<meta\\s+(?:property|name)=["']${propertyOrName}["']\\s+content=["'](.*?)["']`, 'i')) ||
                    html.match(new RegExp(`<meta\\s+content=["'](.*?)["']\\s+(?:property|name)=["']${propertyOrName}["']`, 'i'));
      return match ? match[1].trim() : null;
    };

    // Title Extraction
    let title = getMetaContent('og:title') || getMetaContent('twitter:title');
    if (!title) {
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i) || html.match(/<span\s+id=["']productTitle["'][^>]*>(.*?)<\/span>/i);
      title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : 'Scraped Laptop Model';
    }
    // Clean up typical titles
    title = title.replace(/\s*:\s*Amazon\..*$/i, '').replace(/\s*-\s*Best Buy.*$/i, '');

    // Description Extraction
    let description = getMetaContent('og:description') || getMetaContent('description') || getMetaContent('twitter:description');
    if (!description) {
      description = title;
    } else {
      description = description.replace(/<[^>]*>?/gm, '').trim();
    }

    // Image Extraction
    let image = getMetaContent('og:image') || getMetaContent('twitter:image');
    if (!image) {
      const imgMatch = html.match(/data-old-hires=["'](.*?)["']/i) || html.match(/<img[^>]+id=["']landingImage["'][^>]+src=["'](.*?)["']/i);
      image = imgMatch ? imgMatch[1] : '';
    }

    // Price Extraction
    let priceStr = getMetaContent('og:price:amount') || getMetaContent('product:price:amount');
    if (!priceStr) {
      // Try JSON-LD Schema price
      const jsonLdMatch = html.match(/"price"\s*:\s*"?([0-9\.]+)"?/i);
      if (jsonLdMatch) priceStr = jsonLdMatch[1];
    }
    if (!priceStr) {
      // Try HTML dollar pattern match
      const dollarMatch = html.match(/\$([0-9]{2,4}(?:\.[0-9]{2})?)/);
      if (dollarMatch) priceStr = dollarMatch[1];
    }

    let numericPrice = priceStr ? parseFloat(priceStr.toString().replace(/,/g, '')) : 999;
    if (isNaN(numericPrice) || numericPrice <= 0) numericPrice = 999;
    const formattedPrice = `$${numericPrice.toLocaleString()}`;

    // Spec Inference Engine via Title & Description Regex
    const fullText = (title + ' ' + description).toLowerCase();

    // CPU Detection
    let cpu = "High Performance Processor";
    if (fullText.includes("m3 max")) cpu = "Apple M3 Max";
    else if (fullText.includes("m3 pro")) cpu = "Apple M3 Pro";
    else if (fullText.includes("m3")) cpu = "Apple M3";
    else if (fullText.includes("m2")) cpu = "Apple M2";
    else if (/i9[- ]\d+/i.test(fullText)) cpu = "Intel Core i9";
    else if (/i7[- ]\d+/i.test(fullText)) cpu = "Intel Core i7";
    else if (/i5[- ]\d+/i.test(fullText)) cpu = "Intel Core i5";
    else if (/ryzen 9/i.test(fullText)) cpu = "AMD Ryzen 9";
    else if (/ryzen 7/i.test(fullText)) cpu = "AMD Ryzen 7";
    else if (/ryzen 5/i.test(fullText)) cpu = "AMD Ryzen 5";

    // GPU Detection
    let gpu = "Integrated High-Speed Graphics";
    if (fullText.includes("rtx 4090")) gpu = "NVIDIA GeForce RTX 4090 (16GB)";
    else if (fullText.includes("rtx 4080")) gpu = "NVIDIA GeForce RTX 4080 (12GB)";
    else if (fullText.includes("rtx 4070")) gpu = "NVIDIA GeForce RTX 4070 (8GB)";
    else if (fullText.includes("rtx 4060")) gpu = "NVIDIA GeForce RTX 4060 (8GB)";
    else if (fullText.includes("rtx 4050")) gpu = "NVIDIA GeForce RTX 4050 (6GB)";
    else if (fullText.includes("rtx 3050")) gpu = "NVIDIA GeForce RTX 3050 (6GB)";
    else if (fullText.includes("radeon")) gpu = "AMD Radeon Graphics";
    else if (fullText.includes("iris xe")) gpu = "Intel Iris Xe Graphics";

    // RAM Detection
    let ram = "16GB DDR5";
    if (fullText.includes("64gb")) ram = "64GB RAM";
    else if (fullText.includes("32gb")) ram = "32GB RAM";
    else if (fullText.includes("16gb")) ram = "16GB RAM";
    else if (fullText.includes("8gb")) ram = "8GB RAM";

    // Storage Detection
    let storage = "512GB NVMe SSD";
    if (fullText.includes("2tb")) storage = "2TB PCIe NVMe SSD";
    else if (fullText.includes("1tb")) storage = "1TB PCIe NVMe SSD";
    else if (fullText.includes("512gb")) storage = "512GB PCIe SSD";
    else if (fullText.includes("256gb")) storage = "256GB SSD";

    // Display Detection
    let display = "15.6\" FHD IPS Display";
    if (fullText.includes("oled")) display = "15.6\" 2.8K OLED Display";
    else if (fullText.includes("240hz")) display = "16\" QHD+ 240Hz Gaming Screen";
    else if (fullText.includes("144hz")) display = "15.6\" FHD 144Hz Screen";
    else if (fullText.includes("retina")) display = "14.2\" Liquid Retina XDR";

    // Category Inference
    let primaryCategory = "work";
    if (gpu.includes("RTX")) primaryCategory = "gaming";
    else if (fullText.includes("code") || fullText.includes("developer") || cpu.includes("M3") || ram.includes("32GB")) primaryCategory = "coding";
    else if (fullText.includes("edit") || fullText.includes("studio") || fullText.includes("oled")) primaryCategory = "editing";
    else if (numericPrice < 700) primaryCategory = "study";

    // Budget Tier
    let budgetTier = "midrange";
    if (numericPrice < 700) budgetTier = "budget";
    else if (numericPrice >= 1400) budgetTier = "premium";

    // Construct Scraped Product Object
    const scrapedLaptop = {
      id: "laptop-url-" + Date.now(),
      name: title.slice(0, 50),
      brand: title.split(' ')[0] || "Custom",
      categories: [primaryCategory],
      subcategories: ["scraped", "custom"],
      budgetTier: budgetTier,
      price: formattedPrice,
      numericPrice: numericPrice,
      rating: 4.8,
      recommendationScore: "95%",
      bestForBadge: `Auto-Scraped for ${primaryCategory.toUpperCase()}`,
      description: description.slice(0, 140) + "...",
      image: image || "",
      specs: {
        cpu,
        gpu,
        ram,
        storage,
        display,
        battery: "Up to 8+ Hours Battery",
        weight: "3.8 lbs"
      },
      pros: ["Auto-Imported via Product URL", `${ram} Memory`, `${cpu} Power`],
      affiliateUrl: url
    };

    res.json({ success: true, laptop: scrapedLaptop });

  } catch (err) {
    console.error(`[Scraper Error] ${err.message}`);
    res.status(500).json({ error: "Could not auto-scrape page. You can still manually enter the laptop details." });
  }
});

// -------------------------------------------------------------------
// 3. PERSISTENT CUSTOM LAPTOPS API
// -------------------------------------------------------------------
app.get('/api/laptops', (req, res) => {
  try {
    const raw = fs.readFileSync(CUSTOM_DATA_PATH, 'utf-8');
    res.json(JSON.parse(raw));
  } catch (e) {
    res.json([]);
  }
});

app.post('/api/add-laptop', (req, res) => {
  try {
    const newLaptop = req.body;
    if (!newLaptop || !newLaptop.name) {
      return res.status(400).json({ error: "Invalid laptop data" });
    }

    const raw = fs.readFileSync(CUSTOM_DATA_PATH, 'utf-8');
    const list = JSON.parse(raw);
    list.unshift(newLaptop);
    fs.writeFileSync(CUSTOM_DATA_PATH, JSON.stringify(list, null, 2));

    res.json({ success: true, laptop: newLaptop, count: list.length });
  } catch (err) {
    res.status(500).json({ error: "Could not save custom laptop" });
  }
});

// Serve main index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 ApexTech Laptops Server active on port ${PORT}`);
  console.log(`🔗 Anti-Sleep Auto-Ping interval set to 14 minutes`);
  console.log(`====================================================`);
});
