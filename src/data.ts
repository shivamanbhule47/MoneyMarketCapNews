import { Post, AMPStory } from './types';

export const INITIAL_POSTS: Post[] = [
  {
    id: 1718000000000,
    title: "Bitcoin Surges Past $100,000 as Institutional Inflows Break All Historical Records",
    category: "crypto",
    excerpt: "The world's leading cryptocurrency has crossed the six-figure milestone, driven by regulatory clarity, ETF inflows, and global corporate treasury adoption.",
    content: `
<h2>The Six-Figure Milestone</h2>
<p>Bitcoin has made history by surging past the $100,000 mark, establishing a new all-time high that many analysts are calling a watershed moment for digital assets. The rally has been fueled by a combination of unprecedented institutional investment, regulatory optimism, and a growing consensus that digital gold is a core macro hedge asset.</p>

<blockquote>"Crossing $100,000 is not just a psychological victory; it is the ultimate validation of Bitcoin as a major global asset class." — Marcus Thorne, Lead Cryptography Analyst at MoneyMarketCap</blockquote>

<p>According to recent blockchain telemetry, over $4.2 billion in net capital has flowed into spot Bitcoin ETFs over the last fortnight alone. Furthermore, major corporations are following the micro-treasury playbook, committing a portion of their balance sheets to decentralized reserves as a shield against monetary inflation.</p>

<h2>What Is Driving the Capital Inflows?</h2>
<p>The primary catalysts behind this explosive growth include:</p>
<ul>
  <li><strong>Institutional Custody Integration:</strong> Major global custodian banks have officially launched enterprise-grade cold-storage services.</li>
  <li><strong>ETF Momentum:</strong> Spot Bitcoin exchange-traded products are seeing compounding reinvestments from pension funds and family offices.</li>
  <li><strong>Macroeconomic Uncertainties:</strong> Persistent fiscal deficits in G7 nations are leading investors to seek sovereign-neutral collateral.</li>
</ul>

<h2>The Road Ahead: Forecast for 2026</h2>
<p>While some short-term profit-taking is expected, long-term indicators suggest that the current structural floor is firmly established near $95,000. Traders are now eyeing the $120,000 resistance level, supported by bullish derivatives activity and declining exchange reserves. As liquid supply continues to dry up, any increase in demand is expected to have a highly reflexive upward impact on price.</p>
    `,
    author: "Sarah Mitchell",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800",
    tags: ["Bitcoin", "Crypto Rally", "Institutions", "Finance"],
    readingTime: "4 min read",
    featured: true,
    date: "2026-07-15",
    status: "published",
    createdAt: "2026-07-15T12:00:00.000Z"
  },
  {
    id: 1718000000001,
    title: "Federal Reserve Adjusts Benchmarks Amid Softening Consumer Pricing Indices",
    category: "economy",
    excerpt: "The central bank signals a shift in monetary strategy as Core PCE data stabilizes close to the targeted 2% threshold, promising relief for mortgage rates.",
    content: `
<h2>A Balanced Pivot</h2>
<p>In a highly anticipated press conference, the Federal Open Market Committee (FOMC) has signaled a strategic recalibration of its benchmark interest rates. With Core PCE inflation metrics returning consistent readings of 2.1% annualized, policymakers are expressing confidence that the monetary tightening cycle has successfully contained consumer demand without triggering a labor recession.</p>

<p>Economists are interpreting the Fed's statement as a green light for commercial lenders to begin easing credit conditions. Yields on the 10-year Treasury bond dropped immediately by 14 basis points, sparking a rally in interest-sensitive sectors including real estate, construction, and regional banking.</p>

<blockquote>"We are witnessing the classic soft landing that many argued was impossible. The transition to a neutral rate environment is now underway." — Dr. Helen Vance, Chief Economic Adviser</blockquote>

<h2>Key Impact Sectors</h2>
<p>The transition from restrictive to neutral interest rates will heavily impact several key areas:</p>
<ol>
  <li><strong>Mortgage and Housing Markets:</strong> Rates are expected to fall to a three-year low, unlocking millions of sidelined buyers and stimulating builder sentiment.</li>
  <li><strong>Consumer Credit:</strong> Auto loan approvals and credit card interest structures will see gradual downward adjustments.</li>
  <li><strong>Emerging Markets:</strong> A softening US Dollar will relieve debt service burdens on foreign nations borrowing in USD.</li>
</ol>
    `,
    author: "Robert Chen",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800",
    tags: ["Fed", "Inflation", "Economy", "Macro"],
    readingTime: "5 min read",
    featured: false,
    date: "2026-07-14",
    status: "published",
    createdAt: "2026-07-14T10:30:00.000Z"
  },
  {
    id: 1718000000002,
    title: "AI Infrastructure Supercycle Gains Fresh Momentum as Next-Gen Silicon Hits Production",
    category: "tech",
    excerpt: "Nvidia, TSMC, and major fab operators report surging bookings for next-generation 2nm artificial intelligence chips, signaling that computing demand remains voracious.",
    content: `
<h2>The 2nm Silicon Revolution</h2>
<p>Rumors of an artificial intelligence infrastructure slowdown have been thoroughly debunked as leading semiconductor fabricators announce capacity bookings running through late 2027. The catalyst is the debut of the new 2nm node design architecture, delivering 45% compute acceleration while cutting energy consumption by half.</p>

<p>Hyperscalers including Microsoft, Google Cloud, and Amazon Web Services are locked in bidding wars to secure first-batch allocations of these physical processors. The investments confirm that the cloud computing industry expects the LLM training and real-time reasoning demand to expand exponentially over the next decade.</p>

<blockquote>"We are no longer looking at a software bubble; this is a physical industrial expansion. Computing power is the new oil, and the pipelines are running at maximum capacity." — Aris Thorne, Silicon Analyst</blockquote>
    `,
    author: "Aris Thorne",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    tags: ["Chips", "Nvidia", "Tech", "Artificial Intelligence"],
    readingTime: "3 min read",
    featured: false,
    date: "2026-07-13",
    status: "published",
    createdAt: "2026-07-13T16:45:00.000Z"
  },
  {
    id: 1718000000003,
    title: "S&P 500 Reaches Record Heights as Blue-Chip Earnings Eclipse Wall Street Projections",
    category: "stocks",
    excerpt: "Eighty-two percent of index companies outperform EPS forecasts in the second quarter, leading to a major stock market rally led by healthcare, energy, and retail giants.",
    content: `
<h2>A Stellar Corporate Season</h2>
<p>Wall Street is in a celebratory mood as the S&P 500 pushes deep into uncharted territory. Corporate profitability has defied skepticism, driven by strong operational efficiencies, robust consumer spending, and the cooling of supply-chain input costs.</p>

<p>Tech giants are not the only ones pulling the weight this quarter. Industrials, consumer cyclicals, and medical providers have all posted surprise double-digit growth numbers, highlighting a broad-based economic resilience that is reassuring to long-term index investors.</p>
    `,
    author: "David Pierce",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
    tags: ["Stocks", "S&P 500", "Earnings", "Wall Street"],
    readingTime: "3 min read",
    featured: false,
    date: "2026-07-12",
    status: "published",
    createdAt: "2026-07-12T09:15:00.000Z"
  },
  {
    id: 1718000000004,
    title: "Forex Heatmap: Swiss Franc and US Dollar Lead Flight to Safe Havens",
    category: "forex",
    excerpt: "Geopolitical tensions in Eastern Europe and rising Asian trade tariffs trigger currency repositioning, strengthening sovereign reserve currencies.",
    content: `
<h2>Sovereign Flight</h2>
<p>Currency desks are witnessing high-volume capital reallocations as global risk parameters rise. The Swiss Franc (CHF) has climbed to a five-month high against the Euro, while the US Dollar Index (DXY) regained strength to hover near 104.8.</p>

<p>Conversely, emerging market carry-trade pairs are facing heavy liquidations. Investors are locking in profits and returning cash to highly liquid G10 sovereign bonds, seeking security over yield in anticipation of tariff negotiations scheduled for late summer.</p>
    `,
    author: "Elena Rostova",
    image: "https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&q=80&w=800",
    tags: ["Forex", "USD", "CHF", "Currencies"],
    readingTime: "4 min read",
    featured: false,
    date: "2026-07-10",
    status: "published",
    createdAt: "2026-07-10T14:20:00.000Z"
  }
];

export const INITIAL_STORIES: AMPStory[] = [
  {
    id: 1001,
    title: "Bitcoin at $100K: The Ultimate Asset Validation",
    category: "crypto",
    pages: [
      {
        id: 1,
        type: 'cover',
        title: "Bitcoin Crosses $100,000 Milestone!",
        subtitle: "The digital asset enters six-figure territory for the first time in history.",
        image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: 2,
        type: 'content',
        title: "What Drove the Rise?",
        content: "A massive influx of institutional capital, fueled by spot Bitcoin ETFs and corporate treasury allocations worldwide, drove this historic breakout.",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: 3,
        type: 'cta',
        title: "Read Our Full Market Analysis",
        ctaText: "Explore More",
        ctaLink: "/"
      }
    ],
    createdAt: "2026-07-15T12:00:00.000Z"
  },
  {
    id: 1002,
    title: "S&P 500 Outperforms Expectations Again",
    category: "stocks",
    pages: [
      {
        id: 1,
        type: 'cover',
        title: "S&P 500 Record Heights!",
        subtitle: "Blue-chip corporate earnings shatter cautious Wall Street estimates.",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: 2,
        type: 'content',
        title: "Broad Market Rally",
        content: "Led by healthcare, consumer products, and energy, 82% of tracked companies outpaced quarterly profit forecasts.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: 3,
        type: 'cta',
        title: "Check Top Gaining Stocks Now",
        ctaText: "View Gains",
        ctaLink: "/"
      }
    ],
    createdAt: "2026-07-14T10:30:00.000Z"
  }
];

export const INITIAL_COMMENTS = [
  {
    id: 1,
    postId: 1718000000000,
    author: "CryptoBull99",
    text: "Absolutely historic day! I've been holding since $3,000 in 2018. This feels incredibly surreal but highly deserved. Next stop is $150K!",
    date: "2026-07-15T13:10:00.000Z"
  },
  {
    id: 2,
    postId: 1718000000000,
    author: "MacroTrader_X",
    text: "The institutional bid is the real deal this time. Unlike 2021 which was driven by levered retail, this leg is corporate reserves and high net worth family office assets. Very solid floor here.",
    date: "2026-07-15T14:45:00.000Z"
  },
  {
    id: 3,
    postId: 1718000000001,
    author: "LendingPro",
    text: "This soft landing is amazing. Commercial mortgage rates are already dropping. High-quality bank stocks should fly from here.",
    date: "2026-07-14T11:20:00.000Z"
  }
];
