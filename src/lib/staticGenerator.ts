import JSZip from 'jszip';
import { Post, AMPStory } from '../types';

// Slug helper to generate beautiful directories
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

// Generates the primary index.html for the static home page
export const generateIndexHtml = (posts: Post[]): string => {
  const publishedPosts = posts.filter(p => p.status === 'published');
  const featured = publishedPosts.find(p => p.featured) || publishedPosts[0];
  const remaining = publishedPosts.filter(p => p.id !== (featured?.id || 0));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MoneyMarketCap - Global Markets Live Feed</title>
  <meta name="description" content="Lightning-fast financial insights, cryptocurrency trends, economy analysis, and interactive currency converter. Built for modern investors.">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%25239fe870' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/%3E%3C/svg%3E">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- Tailwind Script -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              primary: '#9fe870',
              'on-primary': '#0e0f0c',
              'primary-active': '#cdffad',
              'primary-neutral': '#c5edab',
              'primary-pale': '#e2f6d5',
              ink: '#0e0f0c',
              'ink-deep': '#163300',
              body: '#454745',
              mute: '#868685',
              canvas: '#ffffff',
              'canvas-soft': '#e8ebe6',
              positive: '#2ead4b',
              negative: '#d03238',
            },
            accent: {
              orange: '#ffc091',
              cyan: '#38c8ff',
            }
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Manrope', 'sans-serif'],
            serif: ['Lora', 'serif'],
          }
        }
      }
    }
  </script>
</head>
<body class="bg-brand-canvas-soft text-brand-ink min-h-screen flex flex-col font-sans antialiased">

  <!-- Market Stream Bar -->
  <div class="bg-brand-ink text-white py-2 px-4 text-xs font-semibold">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
        <span>📡 Static Market Stream Active (GitHub Pages)</span>
      </div>
      <div class="flex items-center gap-4">
        <span>BTC: <span class="text-brand-primary font-mono font-bold">$101,234</span></span>
        <span>ETH: <span class="text-brand-primary font-mono font-bold">$3,450</span></span>
        <span>Speed: <span class="text-brand-primary font-bold">0.02s ⚡</span></span>
      </div>
    </div>
  </div>

  <!-- Main Navigation Header -->
  <header class="sticky top-0 z-40 bg-white border-b border-brand-ink/5 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
      <a href="./" class="flex items-center gap-2 select-none">
        <div class="w-10 h-10 rounded-xl bg-brand-ink flex items-center justify-center shadow-md">
          <svg class="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div>
          <span class="font-display font-black text-lg tracking-tight text-brand-ink block leading-none">MoneyMarketCap</span>
          <span class="text-[10px] text-brand-mute font-bold tracking-widest uppercase">Wise Standard</span>
        </div>
      </a>

      <!-- Desktop Filter Controls -->
      <nav class="hidden lg:flex items-center gap-1">
        <button onclick="filterCategory('all')" id="tab-all" class="category-tab px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-ink text-brand-primary transition">All Market</button>
        <button onclick="filterCategory('crypto')" id="tab-crypto" class="category-tab px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-brand-ink hover:bg-brand-canvas-soft transition">Crypto</button>
        <button onclick="filterCategory('stocks')" id="tab-stocks" class="category-tab px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-brand-ink hover:bg-brand-canvas-soft transition">Stocks</button>
        <button onclick="filterCategory('forex')" id="tab-forex" class="category-tab px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-brand-ink hover:bg-brand-canvas-soft transition">Forex</button>
        <button onclick="filterCategory('economy')" id="tab-economy" class="category-tab px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-brand-ink hover:bg-brand-canvas-soft transition">Economy</button>
        <button onclick="filterCategory('tech')" id="tab-tech" class="category-tab px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-brand-ink hover:bg-brand-canvas-soft transition">Tech</button>
      </nav>

      <!-- Search Input -->
      <div class="relative flex items-center">
        <input
          type="text"
          id="search-box"
          oninput="handleSearch()"
          placeholder="Search insights..."
          class="bg-brand-canvas-soft border border-brand-ink/10 text-xs font-semibold px-4 py-2.5 rounded-full outline-none focus:border-brand-ink/30 transition-all w-48 shadow-inner"
        />
      </div>
    </div>

    <!-- Mobile Scroll Tab Header -->
    <div class="lg:hidden flex items-center gap-1.5 px-4 py-3 border-t border-brand-ink/5 overflow-x-auto bg-brand-canvas-soft/40 scrollbar-none">
      <button onclick="filterCategory('all')" id="m-tab-all" class="mobile-tab px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0 bg-brand-ink text-brand-primary transition">All</button>
      <button onclick="filterCategory('crypto')" id="m-tab-crypto" class="mobile-tab px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0 bg-white text-brand-ink border border-brand-ink/5 transition">Crypto</button>
      <button onclick="filterCategory('stocks')" id="m-tab-stocks" class="mobile-tab px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0 bg-white text-brand-ink border border-brand-ink/5 transition">Stocks</button>
      <button onclick="filterCategory('forex')" id="m-tab-forex" class="mobile-tab px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0 bg-white text-brand-ink border border-brand-ink/5 transition">Forex</button>
      <button onclick="filterCategory('economy')" id="m-tab-economy" class="mobile-tab px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0 bg-white text-brand-ink border border-brand-ink/5 transition">Economy</button>
      <button onclick="filterCategory('tech')" id="m-tab-tech" class="mobile-tab px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0 bg-white text-brand-ink border border-brand-ink/5 transition">Tech</button>
    </div>
  </header>

  <main class="flex-grow">
    
    <!-- Hero / Converter Split Banner -->
    <section class="bg-white border-b border-brand-ink/5 py-12 md:py-16">
      <div class="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <!-- Welcome Promo -->
        <div class="lg:col-span-7 space-y-6">
          <span class="inline-flex items-center gap-1.5 text-[10px] font-black bg-brand-primary-pale text-brand-ink-deep px-3 py-1 rounded-full uppercase tracking-widest">
            <span class="w-2.5 h-2.5 rounded-full bg-brand-primary animate-ping"></span> SECURE STATIC DEPLOYMENT
          </span>
          <h1 class="font-display font-black text-4xl md:text-6xl text-brand-ink leading-[1.05] tracking-tighter">
            Market Signals, <span class="text-[#ff6a1a]">Instantly Pre-Rendered.</span>
          </h1>
          <p class="text-base md:text-lg text-brand-body leading-relaxed max-w-xl font-medium">
            Browse our static-compiled publishing repository hosted secure and light. Supercharged speed and zero infrastructure costs.
          </p>
          ${featured ? `
          <div class="pt-2">
            <a href="./posts/${slugify(featured.title)}/" class="inline-block bg-brand-primary hover:bg-brand-primary-active text-brand-on-primary font-display font-black text-xs px-6 py-4 rounded-full uppercase tracking-wider shadow-sm transition-all hover:scale-102">
              Read Top Story →
            </a>
          </div>` : ''}
        </div>

        <!-- Static Converter widget (Fully Functional!) -->
        <div class="lg:col-span-5">
          <div class="w-full bg-white rounded-[24px] border border-brand-ink/10 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-display font-bold text-base text-brand-ink">💰 Static Converter</h3>
              <span class="text-[10px] bg-brand-primary-pale text-brand-ink-deep font-bold px-2 py-0.5 rounded-full">Calculated Rates</span>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-[11px] font-bold text-brand-mute mb-1">You Send</label>
                <div class="flex bg-brand-canvas-soft rounded-xl p-1 border border-transparent focus-within:border-brand-ink/20">
                  <input type="number" id="conv-amount" value="1000" oninput="runConversion()" class="w-full px-3 py-2 bg-transparent text-brand-ink font-bold text-lg outline-none" />
                  <select id="conv-from" onchange="runConversion()" class="bg-white text-brand-ink font-bold px-2.5 py-1.5 rounded-lg text-xs cursor-pointer shadow-sm">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="BTC">BTC (₿)</option>
                    <option value="ETH">ETH (Ξ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-brand-mute mb-1">You Receive</label>
                <div class="flex bg-brand-canvas-soft rounded-xl p-1">
                  <div id="conv-result" class="w-full px-3 py-2 bg-transparent text-brand-ink font-bold text-lg">0.009878</div>
                  <select id="conv-to" onchange="runConversion()" class="bg-white text-brand-ink font-bold px-2.5 py-1.5 rounded-lg text-xs cursor-pointer shadow-sm">
                    <option value="BTC">BTC (₿)</option>
                    <option value="ETH">ETH (Ξ)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-brand-ink/5 space-y-1.5 text-[11px] font-medium text-brand-mute">
              <div class="flex justify-between">
                <span>Calculated Rate</span>
                <span id="rate-text" class="font-bold text-brand-ink">1 USD = 0.0000098 BTC</span>
              </div>
              <div class="flex justify-between">
                <span>Processing Time</span>
                <span class="font-bold text-brand-positive">Static Native Instant ⚡</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Content Section Grid -->
    <section class="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div id="news-grid" class="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        <!-- Featured Article (Left side) -->
        ${featured ? `
        <div id="featured-hero-card" class="post-card lg:col-span-8 bg-white rounded-[24px] overflow-hidden border border-brand-ink/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer" data-category="${featured.category}" data-title="${featured.title.toLowerCase()}" onclick="window.location.href='./posts/${slugify(featured.title)}/'">
          <div class="aspect-video relative overflow-hidden bg-brand-canvas-soft">
            <img src="${featured.image}" alt="" class="w-full h-full object-cover group-hover:scale-101 transition duration-500" />
            <div class="absolute top-4 left-4 bg-[#ff6a1a] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
              ${featured.category}
            </div>
          </div>
          <div class="p-6 md:p-8 space-y-4 flex-grow">
            <span class="text-xs font-black text-brand-mute uppercase tracking-widest block">FEATURED INSIGHT</span>
            <h2 class="font-serif font-black text-xl md:text-3xl text-brand-ink leading-tight group-hover:text-[#ff6a1a] transition-colors">${featured.title}</h2>
            <p class="text-xs md:text-sm text-brand-body leading-relaxed line-clamp-3">${featured.excerpt}</p>
            <div class="flex justify-between items-center text-xs text-brand-mute font-semibold pt-4 border-t border-brand-ink/5">
              <span>✍️ ${featured.author}</span>
              <span>⏱️ ${featured.readingTime} • 📅 ${featured.date}</span>
            </div>
          </div>
        </div>` : ''}

        <!-- Stream Side Grid list (Right side) -->
        <div class="lg:col-span-4 space-y-6">
          <h3 class="font-display font-black text-lg text-brand-ink">📰 Quick Headlines</h3>
          <div id="quick-headlines-container" class="space-y-4">
            ${remaining.length === 0 ? '<p class="text-xs text-brand-mute">No secondary headlines</p>' : 
              remaining.slice(0, 3).map(post => `
              <div class="post-card bg-white rounded-2xl p-4 border border-brand-ink/5 shadow-xs hover:shadow-sm hover:translate-x-1 transition duration-200 cursor-pointer flex gap-4" data-category="${post.category}" data-title="${post.title.toLowerCase()}" onclick="window.location.href='./posts/${slugify(post.title)}/'">
                <img src="${post.image}" alt="" class="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-brand-canvas-soft" />
                <div class="flex flex-col justify-between py-0.5 min-w-0">
                  <span class="text-[9px] font-black text-[#ff6a1a] uppercase tracking-wider">${post.category}</span>
                  <h4 class="font-display font-bold text-xs text-brand-ink leading-snug line-clamp-2 hover:text-[#ff6a1a] transition">${post.title}</h4>
                  <span class="text-[10px] text-brand-mute font-medium">${post.date}</span>
                </div>
              </div>`).join('')
            }
          </div>
        </div>

      </div>

      <!-- General Grid (Sub-grid underneath) -->
      <div id="general-grid-section" class="mt-12 space-y-6">
        <h3 class="font-display font-black text-lg text-brand-ink">More Insights</h3>
        <div id="general-news-container" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${publishedPosts.slice(4).length === 0 ? '<p class="text-xs text-brand-mute col-span-3">End of feed</p>' : 
            publishedPosts.slice(4).map(post => `
            <div class="post-card bg-white rounded-[20px] overflow-hidden border border-brand-ink/5 p-4 shadow-xs hover:shadow-md transition duration-300 cursor-pointer flex flex-col justify-between group" data-category="${post.category}" data-title="${post.title.toLowerCase()}" onclick="window.location.href='./posts/${slugify(post.title)}/'">
              <div>
                <div class="relative aspect-video rounded-xl overflow-hidden mb-4 bg-brand-canvas-soft">
                  <img src="${post.image}" alt="" class="w-full h-full object-cover group-hover:scale-101 transition duration-500" />
                  <span class="absolute top-2 left-2 bg-[#ff6a1a] text-white text-[8px] font-bold uppercase px-2 py-0.5 rounded-md">${post.category}</span>
                </div>
                <h4 class="font-display font-bold text-sm text-brand-ink leading-snug line-clamp-2 group-hover:text-[#ff6a1a] transition mb-2">${post.title}</h4>
                <p class="text-xs text-brand-body leading-relaxed line-clamp-2 mb-4">${post.excerpt}</p>
              </div>
              <div class="text-[11px] text-brand-mute font-semibold pt-3 border-t border-brand-ink/5 flex justify-between">
                <span>By ${post.author}</span>
                <span>${post.date}</span>
              </div>
            </div>`).join('')
          }
        </div>
      </div>
    </section>

  </main>

  <!-- Dark Footer -->
  <footer class="bg-brand-ink text-brand-canvas-soft py-12 px-6 border-t border-brand-primary/10 mt-auto">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
            <svg class="w-5 h-5 text-brand-on-primary" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span class="font-display font-black text-md tracking-tight text-white">MoneyMarketCap</span>
        </div>
        <p class="text-xs text-brand-mute leading-relaxed max-w-xs">
          Pre-rendered, supercharged static financial indexing platform designed for flawless speed.
        </p>
      </div>

      <div>
        <h4 class="text-xs font-bold text-brand-primary uppercase tracking-widest mb-3">Categories</h4>
        <div class="flex flex-col gap-2 text-xs">
          <button onclick="filterCategory('crypto')" class="hover:text-brand-primary text-left transition text-brand-mute">Cryptocurrency</button>
          <button onclick="filterCategory('stocks')" class="hover:text-brand-primary text-left transition text-brand-mute">Stock Market</button>
          <button onclick="filterCategory('economy')" class="hover:text-brand-primary text-left transition text-brand-mute">Economics & Fed</button>
          <button onclick="filterCategory('tech')" class="hover:text-brand-primary text-left transition text-brand-mute">Technology Node</button>
        </div>
      </div>

      <div>
        <h4 class="text-xs font-bold text-brand-primary uppercase tracking-widest mb-3">Legal Disclaimer</h4>
        <p class="text-[10px] text-brand-mute leading-relaxed">
          The calculations, signals and index data pre-rendered on MoneyMarketCap static feed do not represent financial commitments. Past indices do not project future multipliers.
        </p>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto pt-8 mt-8 border-t border-white/5 text-center text-xs text-brand-mute">
      <p>© 2026 MoneyMarketCap. Fully pre-compiled for GitHub Pages hosting.</p>
    </div>
  </footer>

  <!-- Live Dynamic Converter & Filtering JavaScript -->
  <script>
    // Rates
    const RATES = {
      USD: 1,
      EUR: 1.09,
      GBP: 1.28,
      BTC: 101234,
      ETH: 3450
    };

    function runConversion() {
      const amount = parseFloat(document.getElementById('conv-amount').value) || 0;
      const from = document.getElementById('conv-from').value;
      const to = document.getElementById('conv-to').value;
      
      const amountInUSD = amount * RATES[from];
      const result = amountInUSD / RATES[to];
      
      const rounded = to === 'BTC' || to === 'ETH' ? result.toFixed(6) : result.toFixed(2);
      document.getElementById('conv-result').innerText = rounded;
      
      const unitRate = (RATES[from] / RATES[to]);
      const rateStr = "1 " + from + " = " + (to==='BTC' || to==='ETH' ? unitRate.toFixed(6) : unitRate.toFixed(4)) + " " + to;
      document.getElementById('rate-text').innerText = rateStr;
    }

    // Category Filter
    let currentCat = 'all';
    
    function filterCategory(cat) {
      currentCat = cat;
      
      // Update Tab Styles
      document.querySelectorAll('.category-tab').forEach(btn => {
        btn.className = "category-tab px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-brand-ink hover:bg-brand-canvas-soft transition";
      });
      document.querySelectorAll('.mobile-tab').forEach(btn => {
        btn.className = "mobile-tab px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0 bg-white text-brand-ink border border-brand-ink/5 transition";
      });
      
      const activeBtn = document.getElementById('tab-' + cat);
      if (activeBtn) activeBtn.className = "category-tab px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-ink text-brand-primary transition";
      
      const activeMobileBtn = document.getElementById('m-tab-' + cat);
      if (activeMobileBtn) activeMobileBtn.className = "mobile-tab px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0 bg-brand-ink text-brand-primary transition";

      applyFilters();
    }

    // Search and apply combined filters
    function handleSearch() {
      applyFilters();
    }

    function applyFilters() {
      const query = document.getElementById('search-box').value.toLowerCase().trim();
      const cards = document.querySelectorAll('.post-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const title = card.getAttribute('data-title');
        
        const matchCat = currentCat === 'all' || cat === currentCat;
        const matchQuery = query === '' || title.includes(query);

        if (matchCat && matchQuery) {
          card.style.display = "flex";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      // Handle visibility of general news grid heading
      const moreSection = document.getElementById('general-grid-section');
      if (moreSection) {
        if (currentCat !== 'all' || query !== '') {
          moreSection.querySelector('h3').innerText = "Matching Search Results";
        } else {
          moreSection.querySelector('h3').innerText = "More Insights";
        }
      }
    }

    // Run converter on startup
    runConversion();
  </script>
</body>
</html>`;
};

// Generates the static index.html for individual article pages
export const generateArticleHtml = (post: Post, allPosts: Post[]): string => {
  const publishedPosts = allPosts.filter(p => p.status === 'published');
  const related = publishedPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  // Structured Data Schema for rich snippet indexing
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "description": post.excerpt,
    "image": [post.image],
    "datePublished": post.createdAt || new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "author": [{
      "@type": "Person",
      "name": post.author,
      "jobTitle": "Financial Analyst"
    }]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} | MoneyMarketCap</title>
  
  <!-- Primary Meta Tags -->
  <meta name="description" content="${post.excerpt}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.excerpt}">
  <meta property="og:image" content="${post.image}">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="${post.title}">
  <meta property="twitter:description" content="${post.excerpt}">
  <meta property="twitter:image" content="${post.image}">

  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%25239fe870' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/%3E%3C/svg%3E">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- Schema.org JSON-LD structured metadata -->
  <script type="application/ld+json">
    ${JSON.stringify(schemaMarkup, null, 2)}
  </script>

  <!-- Tailwind Script -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              primary: '#9fe870',
              'on-primary': '#0e0f0c',
              'primary-active': '#cdffad',
              'primary-neutral': '#c5edab',
              'primary-pale': '#e2f6d5',
              ink: '#0e0f0c',
              'ink-deep': '#163300',
              body: '#454745',
              mute: '#868685',
              canvas: '#ffffff',
              'canvas-soft': '#e8ebe6',
              positive: '#2ead4b',
              negative: '#d03238',
            },
            accent: {
              orange: '#ffc091',
              cyan: '#38c8ff',
            }
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Manrope', 'sans-serif'],
            serif: ['Lora', 'serif'],
          }
        }
      }
    }
  </script>

  <style>
    /* Styling blockquotes inside article content */
    .article-content blockquote {
      border-left: 4px solid #9fe870;
      padding-left: 1.5rem;
      font-style: italic;
      color: #0e0f0c;
      font-weight: 600;
      margin: 2rem 0;
      font-family: 'Lora', serif;
      font-size: 1.15rem;
    }
    .article-content h2 {
      font-family: 'Manrope', sans-serif;
      font-weight: 800;
      font-size: 1.5rem;
      color: #0e0f0c;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      letter-spacing: -0.025em;
    }
    .article-content p {
      color: #454745;
      line-height: 1.75;
      margin-bottom: 1.5rem;
      font-size: 1.05rem;
    }
    .article-content ul, .article-content ol {
      margin-left: 1.5rem;
      margin-bottom: 1.5rem;
      list-style-type: cubic;
      line-height: 1.75;
    }
    .article-content li {
      margin-bottom: 0.5rem;
    }
  </style>
</head>
<body class="bg-brand-canvas-soft text-brand-ink min-h-screen flex flex-col font-sans antialiased">

  <!-- Progress Bar indicator -->
  <div id="progress-bar" class="fixed top-0 left-0 h-1 bg-brand-primary transition-all duration-75 z-50" style="width: 0%"></div>

  <!-- Header -->
  <header class="bg-white border-b border-brand-ink/5 shadow-sm sticky top-0 z-40">
    <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
      <a href="../../" class="flex items-center gap-1.5 font-bold text-sm text-brand-ink hover:text-brand-mute transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Home Feed
      </a>
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono font-bold bg-brand-canvas-soft px-3 py-1 rounded-full text-brand-ink-deep">Static Reader</span>
      </div>
    </div>
  </header>

  <!-- Main Grid container (Single column focus view) -->
  <main class="flex-grow py-8 px-4">
    <article class="max-w-3xl mx-auto bg-white rounded-[24px] border border-brand-ink/5 shadow-sm overflow-hidden p-6 md:p-10 space-y-6">
      
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-semibold text-brand-mute">
        <a href="../../" class="hover:text-brand-ink">Home</a>
        <span>/</span>
        <span class="text-brand-ink uppercase font-bold tracking-widest text-[10px]">${post.category}</span>
      </nav>

      <!-- Headline -->
      <h1 class="font-display font-black text-3xl md:text-5xl text-brand-ink tracking-tight leading-[1.1]">
        ${post.title}
      </h1>

      <p class="text-md md:text-lg text-brand-body font-medium italic border-l-2 border-brand-canvas-soft pl-4">
        ${post.excerpt}
      </p>

      <!-- Author and Metadata -->
      <div class="flex items-center justify-between border-y border-brand-ink/5 py-4 my-6 text-xs text-brand-mute font-semibold">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-brand-primary-pale text-brand-ink font-bold flex items-center justify-center">
            ${post.author.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p class="text-brand-ink font-bold leading-none">${post.author}</p>
            <p class="text-[10px] mt-0.5 font-medium text-brand-mute uppercase tracking-wider">Staff Writer</p>
          </div>
        </div>
        <div class="flex gap-4">
          <span>⏱️ ${post.readingTime}</span>
          <span>📅 ${post.date}</span>
        </div>
      </div>

      <!-- Feature Image -->
      <div class="rounded-2xl overflow-hidden aspect-video bg-brand-canvas-soft">
        <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover" />
      </div>

      <!-- Main Body Text -->
      <div class="article-content pt-4">
        ${post.content}
      </div>

      <!-- Share Box -->
      <div class="border-t border-brand-ink/5 pt-6 mt-8 flex flex-wrap items-center justify-between gap-4">
        <span class="text-xs font-bold text-brand-mute uppercase tracking-widest">Share this Analysis:</span>
        <div class="flex gap-2">
          <button onclick="shareSocial('twitter')" class="bg-brand-canvas-soft hover:bg-brand-canvas-soft/80 text-brand-ink text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
            X / Twitter
          </button>
          <button onclick="shareSocial('facebook')" class="bg-brand-canvas-soft hover:bg-brand-canvas-soft/80 text-brand-ink text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
            Facebook
          </button>
          <button onclick="copyLink()" class="bg-brand-primary text-brand-on-primary hover:bg-brand-primary-active text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
            Copy Link
          </button>
        </div>
      </div>

    </article>

    <!-- Interactive Comments Component (Static compatible LocalStorage powered!) -->
    <section class="max-w-3xl mx-auto mt-8 bg-white rounded-[24px] border border-brand-ink/5 shadow-sm p-6 md:p-10 space-y-6">
      <h3 class="font-display font-black text-xl text-brand-ink">Reader Consensus</h3>
      
      <form id="comment-form" onsubmit="postComment(event)" class="space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="text" id="comment-author" required placeholder="Your Pseudonym" class="bg-brand-canvas-soft border border-brand-ink/5 text-xs font-semibold p-3 rounded-xl outline-none focus:border-brand-ink/20" />
        </div>
        <textarea id="comment-text" required rows="3" placeholder="Share your insights or critique on this assessment..." class="w-full bg-brand-canvas-soft border border-brand-ink/5 text-xs p-3 rounded-xl outline-none focus:border-brand-ink/20 font-sans"></textarea>
        <button type="submit" class="bg-brand-ink hover:bg-brand-ink/90 text-brand-primary font-bold px-4 py-2 rounded-xl text-xs">
          Submit Commentary
        </button>
      </form>

      <!-- Loaded Comments stack -->
      <div id="comments-container" class="space-y-4 pt-4 border-t border-brand-ink/5">
        <!-- Static default commentary fallback -->
        <p class="text-xs text-brand-mute italic text-center py-4">No comments posted yet. Start the debate!</p>
      </div>
    </section>

    <!-- Related Articles -->
    ${related.length > 0 ? `
    <section class="max-w-3xl mx-auto mt-12 space-y-4">
      <h3 class="font-display font-black text-lg text-brand-ink">Related Analyses</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${related.map(item => `
        <a href="../${slugify(item.title)}/" class="bg-white rounded-2xl p-4 border border-brand-ink/5 shadow-xs hover:shadow-sm hover:translate-y-[-2px] transition duration-200 block group">
          <div class="aspect-video rounded-lg overflow-hidden mb-3 bg-brand-canvas-soft">
            <img src="${item.image}" alt="" class="w-full h-full object-cover" />
          </div>
          <span class="text-[8px] font-black uppercase text-[#ff6a1a] tracking-wider block mb-1">${item.category}</span>
          <h4 class="font-display font-bold text-xs text-brand-ink leading-snug line-clamp-2 group-hover:text-[#ff6a1a] transition">${item.title}</h4>
        </a>`).join('')}
      </div>
    </section>` : ''}

  </main>

  <footer class="bg-brand-ink text-brand-canvas-soft py-8 px-6 mt-16 border-t border-white/5">
    <div class="max-w-3xl mx-auto text-center text-xs text-brand-mute space-y-2">
      <p>Compiled by MoneyMarketCap CMS. Fully optimized for instant static loading.</p>
      <p>© 2026 MoneyMarketCap. All rights reserved.</p>
    </div>
  </footer>

  <script>
    // Reading Progress Indicator
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.getElementById('progress-bar').style.width = scrolled + '%';
    });

    // Share Helpers
    function shareSocial(network) {
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent("${post.title}");
      let targetUrl = '';
      if (network === 'twitter') targetUrl = "https://twitter.com/intent/tweet?url=" + url + "&text=" + title;
      if (network === 'facebook') targetUrl = "https://www.facebook.com/sharer/sharer.php?u=" + url;
      if (targetUrl) window.open(targetUrl, '_blank');
    }

    function copyLink() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Article link copied successfully!");
      });
    }

    // Static LocalStorage Commentary System
    const POST_ID = ${post.id};
    
    function loadComments() {
      const key = "comments_" + POST_ID;
      const stored = localStorage.getItem(key);
      const container = document.getElementById('comments-container');
      
      let comments = [];
      if (stored) {
        comments = JSON.parse(stored);
      } else {
        // Initial mock comments for default articles
        if (POST_ID === 1718000000000) {
          comments = [
            { author: "CryptoBull99", text: "Absolutely historic day! I've been holding since $3,000 in 2018. This feels surreal but highly deserved.", date: "July 15, 2026" },
            { author: "MacroTrader_X", text: "The institutional bid is the real deal this time. Unlike 2021 which was driven by retail margin, this leg is corporate reserves.", date: "July 15, 2026" }
          ];
        } else if (POST_ID === 1718000000001) {
          comments = [
            { author: "LendingPro", text: "This soft landing is amazing. Commercial mortgage rates are already dropping.", date: "July 14, 2026" }
          ];
        }
      }

      if (comments.length === 0) {
        container.innerHTML = '<p class="text-xs text-brand-mute italic text-center py-4">No commentary yet. Start the conversation!</p>';
        return;
      }

      container.innerHTML = comments.map(c => 
        '<div class="bg-brand-canvas-soft/30 rounded-xl p-4 border border-brand-ink/5 space-y-2">' +
          '<div class="flex items-center justify-between text-xs font-semibold">' +
            '<span class="text-brand-ink font-bold">💬 ' + c.author + '</span>' +
            '<span class="text-brand-mute font-medium">' + c.date + '</span>' +
          '</div>' +
          '<p class="text-xs text-brand-body leading-relaxed">' + c.text + '</p>' +
        '</div>'
      ).join('');
    }

    function postComment(e) {
      e.preventDefault();
      const authorInput = document.getElementById('comment-author');
      const textInput = document.getElementById('comment-text');
      
      const newComment = {
        author: authorInput.value.trim(),
        text: textInput.value.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      };

      if (!newComment.author || !newComment.text) return;

      const key = "comments_" + POST_ID;
      const stored = localStorage.getItem(key);
      let comments = stored ? JSON.parse(stored) : [];
      
      // Inject initial default comments first if empty and matching article
      if (comments.length === 0) {
        if (POST_ID === 1718000000000) {
          comments = [
            { author: "CryptoBull99", text: "Absolutely historic day! I've been holding since $3,000 in 2018. This feels surreal but highly deserved.", date: "July 15, 2026" },
            { author: "MacroTrader_X", text: "The institutional bid is the real deal this time. Unlike 2021 which was driven by retail margin, this leg is corporate reserves.", date: "July 15, 2026" }
          ];
        } else if (POST_ID === 1718000000001) {
          comments = [
            { author: "LendingPro", text: "This soft landing is amazing. Commercial mortgage rates are already dropping.", date: "July 14, 2026" }
          ];
        }
      }

      comments.push(newComment);
      localStorage.setItem(key, JSON.stringify(comments));

      authorInput.value = '';
      textInput.value = '';
      loadComments();
    }

    // Load initial comments on launch
    loadComments();
  </script>
</body>
</html>`;
};

// Generates a fully compliant, validated static Google AMP Story HTML file
export const generateAMPStoryHtml = (story: AMPStory): string => {
  const pagesHtml = story.pages.map((page, idx) => {
    let backgroundLayer = '';
    if (page.image) {
      backgroundLayer = `
      <amp-story-grid-layer template="fill">
        <amp-img src="${page.image}" width="720" height="1280" layout="responsive" alt=""></amp-img>
        <div class="scrim"></div>
      </amp-story-grid-layer>`;
    } else {
      backgroundLayer = `
      <amp-story-grid-layer template="fill">
        <div class="solid-bg"></div>
      </amp-story-grid-layer>`;
    }

    let mainLayer = '';
    if (page.type === 'cover') {
      mainLayer = `
      <amp-story-grid-layer template="vertical">
        <div class="content-wrapper cover-wrapper">
          <span class="category-badge">${story.category}</span>
          <h1 class="title font-display-heavy">${page.title}</h1>
          ${page.subtitle ? `<p class="subtitle">${page.subtitle}</p>` : ''}
        </div>
      </amp-story-grid-layer>`;
    } else if (page.type === 'content') {
      mainLayer = `
      <amp-story-grid-layer template="vertical">
        <div class="content-wrapper text-wrapper">
          <h2 class="sub-title">${page.title}</h2>
          <p class="story-body">${page.content || ''}</p>
        </div>
      </amp-story-grid-layer>`;
    } else if (page.type === 'cta') {
      mainLayer = `
      <amp-story-grid-layer template="vertical">
        <div class="content-wrapper cta-wrapper">
          <h2 class="cta-heading font-display-heavy">${page.title}</h2>
          <div class="swipe-indicator">
            <svg viewBox="0 0 24 24" class="arrow-up-icon">
              <path fill="currentColor" d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
            </svg>
            <p>Swipe up to view analysis</p>
          </div>
        </div>
      </amp-story-grid-layer>
      <amp-story-page-outlink layout="nodisplay">
        <a href="${page.ctaLink || '../'}" title="${page.ctaText || 'Read'}">${page.ctaText || 'Read Article'}</a>
      </amp-story-page-outlink>`;
    }

    return `
    <!-- Slide Page ${idx + 1} -->
    <amp-story-page id="page-${idx + 1}">
      ${backgroundLayer}
      ${mainLayer}
    </amp-story-page>`;
  }).join('');

  return `<!doctype html>
<html amp lang="en">
<head>
  <meta charset="utf-8">
  <title>${story.title} | Story</title>
  <link rel="canonical" href="../">
  <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui">
  
  <!-- AMP Boilerplate scripts -->
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>

  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
  <noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  
  <!-- Custom design CSS -->
  <style amp-custom>
    amp-story {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #fff;
    }
    .scrim {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 100%);
    }
    .solid-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #0e0f0c;
    }
    .content-wrapper {
      padding: 32px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 100%;
      box-sizing: border-box;
      z-index: 10;
    }
    .cover-wrapper {
      justify-content: flex-end;
      padding-bottom: 64px;
    }
    .category-badge {
      align-self: flex-start;
      background-color: #9fe870;
      color: #0e0f0c;
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 4px;
      margin-bottom: 12px;
      letter-spacing: 0.1em;
    }
    .title {
      font-size: 28px;
      font-weight: 900;
      line-height: 1.15;
      margin: 0 0 12px 0;
      letter-spacing: -0.02em;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    .subtitle {
      font-size: 14px;
      color: rgba(255,255,255,0.85);
      line-height: 1.4;
      margin: 0;
      text-shadow: 0 1px 2px rgba(0,0,0,0.4);
    }
    .text-wrapper {
      justify-content: center;
      background: rgba(0,0,0,0.65);
      backdrop-filter: blur(5px);
      padding: 40px 32px;
      height: fit-content;
      margin: auto 24px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .sub-title {
      color: #9fe870;
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 16px 0;
    }
    .story-body {
      font-size: 14px;
      line-height: 1.6;
      color: #e8ebe6;
      margin: 0;
    }
    .cta-wrapper {
      justify-content: center;
      align-items: center;
      text-align: center;
      padding-bottom: 80px;
    }
    .cta-heading {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 32px;
    }
    .swipe-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #9fe870;
    }
    .arrow-up-icon {
      width: 28px;
      height: 28px;
      margin-bottom: 4px;
      animation: bounce 1.5s infinite;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
  </style>
</head>
<body>
  <amp-story standalone
             title="${story.title}"
             publisher="MoneyMarketCap"
             publisher-logo-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%25239fe870' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/%3E%3C/svg%3E"
             poster-portrait-src="${story.pages[0]?.image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3'}">
    ${pagesHtml}
  </amp-story>
</body>
</html>`;
};

// Generates XML sitemap
export const generateSitemapXml = (posts: Post[], stories: AMPStory[]): string => {
  const dateStr = new Date().toISOString().split('T')[0];
  const domain = "https://yourusername.github.io/your-repository";

  const postsXml = posts
    .filter(p => p.status === 'published')
    .map(p => `
  <url>
    <loc>${domain}/posts/${slugify(p.title)}/</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>`).join('');

  const storiesXml = stories.map(s => `
  <url>
    <loc>${domain}/stories/${slugify(s.title)}/index.html</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.50</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}/</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.00</priority>
  </url>${postsXml}${storiesXml}
</urlset>`;
};

// Generates standard robots.txt file pointing to the sitemap XML
export const generateRobotsTxt = (): string => {
  const domain = "https://yourusername.github.io/your-repository";
  return `User-agent: *
Allow: /

Sitemap: ${domain}/sitemap.xml
`;
};

// Generates Web Manifest
export const generateManifest = (): string => {
  return JSON.stringify({
    "name": "MoneyMarketCap - Global Financial Index",
    "short_name": "MoneyMarketCap",
    "description": "Lightning-fast financial, cryptocurrency and economic indices feed.",
    "start_url": "/index.html",
    "display": "standalone",
    "background_color": "#0e0f0c",
    "theme_color": "#9fe870",
    "orientation": "any",
    "categories": ["finance", "news"],
    "icons": [
      {
        "src": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%25239fe870' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/%3E%3C/svg%3E",
        "sizes": "512x512",
        "type": "image/svg+xml",
        "purpose": "any maskable"
      }
    ]
  }, null, 2);
};

// Admin panel mockup redirect page
export const generateAdminLandingHtml = (): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CMS Management Console | MoneyMarketCap</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#e8ebe6] text-[#0e0f0c] font-sans antialiased min-h-screen flex items-center justify-center p-6">
  <div class="max-w-md w-full bg-white rounded-[24px] border border-black/5 p-8 shadow-sm text-center space-y-6">
    <div class="w-16 h-16 rounded-2xl bg-[#0e0f0c] text-[#9fe870] flex items-center justify-center mx-auto text-3xl font-black">
      MMC
    </div>
    <h1 class="font-bold text-2xl tracking-tight">Decentralized static console</h1>
    <p class="text-sm text-[#454745] leading-relaxed">
      This static GitHub Pages build utilizes an offline-first workspace. You can manage drafts, write stories, compile releases, and generate index structures safely directly from our AI Studio CMS interface.
    </p>
    <a href="../" class="inline-block bg-[#9fe870] hover:bg-[#cdffad] text-[#0e0f0c] font-bold text-sm px-6 py-3 rounded-full w-full transition">
      Back to Live Site
    </a>
  </div>
</body>
</html>`;
};

// Generates the search index JSON
export const generateSearchJson = (posts: Post[]): string => {
  const published = posts.filter(p => p.status === 'published');
  const index = published.map(p => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    slug: slugify(p.title),
    category: p.category,
    tags: p.tags,
    date: p.date,
    author: p.author
  }));
  return JSON.stringify(index, null, 2);
};

// Dynamic browser ZIP compilation bundle
export const buildAndDownloadZip = async (posts: Post[], stories: AMPStory[]): Promise<void> => {
  const zip = new JSZip();

  // 1. Root index.html
  zip.file('index.html', generateIndexHtml(posts));

  // 2. Render individual published articles inside 'posts' directory
  const postsFolder = zip.folder('posts');
  if (postsFolder) {
    posts.filter(p => p.status === 'published').forEach(post => {
      const slug = slugify(post.title);
      const postFolder = postsFolder.folder(slug);
      if (postFolder) {
        postFolder.file('index.html', generateArticleHtml(post, posts));
      }
    });
  }

  // 4. Render Google AMP Stories
  const storiesFolder = zip.folder('stories');
  if (storiesFolder) {
    stories.forEach(story => {
      const slug = slugify(story.title);
      const singleStoryFolder = storiesFolder.folder(slug);
      if (singleStoryFolder) {
        singleStoryFolder.file('index.html', generateAMPStoryHtml(story));
      }
    });
  }

  // 5. Assets structure
  const assetsFolder = zip.folder('assets');
  if (assetsFolder) {
    const cssFolder = assetsFolder.folder('css');
    if (cssFolder) {
      cssFolder.file('styles.css', `/* Pre-rendered styles */\nbody { font-family: 'Inter', sans-serif; }`);
    }
    assetsFolder.folder('js');
    assetsFolder.folder('images');
    assetsFolder.folder('thumbnails');
  }

  // 6. Data folder with JSONs
  const dataFolder = zip.folder('data');
  if (dataFolder) {
    dataFolder.file('posts.json', JSON.stringify(posts, null, 2));
    dataFolder.file('categories.json', JSON.stringify(['all', 'crypto', 'stocks', 'forex', 'economy', 'tech'], null, 2));
    dataFolder.file('search.json', generateSearchJson(posts));
  }

  // 7. Standard SEO helper files
  zip.file('sitemap.xml', generateSitemapXml(posts, stories));
  zip.file('robots.txt', generateRobotsTxt());
  zip.file('manifest.webmanifest', generateManifest());

  // 8. Generate zip content and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'moneymarketcap-github-pages-bundle.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
