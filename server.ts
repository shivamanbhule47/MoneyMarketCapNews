import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const POSTS_DIR = path.join(process.cwd(), 'posts');

// Ensure posts directory exists
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

// Seed INITIAL_POSTS if directory is empty so the user has examples
const INITIAL_POSTS = [
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
    status: "published"
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
    status: "published"
  }
];

function seedInitialFiles() {
  try {
    const existingFiles = fs.readdirSync(POSTS_DIR);
    if (existingFiles.filter(f => f.endsWith('.txt') || f.endsWith('.json')).length === 0) {
      console.log('Seeding initial posts into folder: ', POSTS_DIR);
      INITIAL_POSTS.forEach(post => {
        const safeTitle = post.title.replace(/[^a-zA-Z0-9-_ ]/g, '').slice(0, 50);
        const fileName = `${safeTitle}.txt`;
        const fileContent = `Title: ${post.title}
Category: ${post.category}
Excerpt: ${post.excerpt}
Thumbnail: ${post.image}
Author: ${post.author}
ReadingTime: ${post.readingTime}
Tags: ${post.tags.join(', ')}
Featured: ${post.featured}
Date: ${post.date}
Status: ${post.status}
AdsCode: <div style="border:1px dashed #ff6a1a; padding:10px; margin:15px 0; border-radius:12px; background-color:#ff6a1a10; text-align:center;"><p style="font-size:9px; font-weight:bold; color:#ff6a1a; margin:0 0 5px 0; letter-spacing:1px;">SPONSORED GOOGLE ADSENSE BANNER</p><a href="https://ai.studio/build" target="_blank" style="font-size:12px; font-weight:black; color:#1a1f36; text-decoration:none;">⚡ Monetize Your Content Instantly with MoneyMarketCap Ads ⚡</a></div>
---
${post.content.trim()}`;
        fs.writeFileSync(path.join(POSTS_DIR, fileName), fileContent, 'utf-8');
      });
      console.log('Successfully seeded sample post txt files!');
    }
  } catch (error) {
    console.error('Failed to seed initial post files:', error);
  }
}

seedInitialFiles();

// Middlewares for big JSON payload (base64 thumbnails)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serving Static Uploaded Thumbnail Images
app.use('/api/posts/assets', express.static(POSTS_DIR));

// Helper: Parse single blog file
function parsePostFile(fileName: string): any | null {
  try {
    const filePath = path.join(POSTS_DIR, fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    const stats = fs.statSync(filePath);
    
    // Parse ID from birthtime or use a hashed/hash-numeric string of filename
    let id = Math.round(stats.birthtimeMs);
    if (isNaN(id) || id <= 0) {
      id = Date.now();
    }

    if (fileName.endsWith('.json')) {
      const parsed = JSON.parse(content);
      parsed.id = parsed.id || id;
      parsed.fileName = fileName;
      return parsed;
    }

    // Default metadata values
    let title = path.basename(fileName, path.extname(fileName));
    let category = "crypto";
    let excerpt = "";
    let image = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800";
    let author = "Guest Author";
    let readingTime = "3 min read";
    let tags: string[] = [];
    let featured = false;
    let date = new Date(stats.birthtime).toISOString().split('T')[0];
    let status: 'draft' | 'scheduled' | 'published' = 'published';
    let adsCode = "";
    let body = content;

    // Check if there is metadata section
    if (content.includes('---')) {
      const parts = content.split('---');
      const headerPart = parts[0];
      body = parts.slice(1).join('---').trim();

      // Parse headers
      const lines = headerPart.split('\n');
      lines.forEach(line => {
        const index = line.indexOf(':');
        if (index > 0) {
          const key = line.slice(0, index).trim().toLowerCase();
          const val = line.slice(index + 1).trim();
          if (key === 'title') title = val;
          else if (key === 'category') category = val;
          else if (key === 'excerpt') excerpt = val;
          else if (key === 'thumbnail' || key === 'image') {
            if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:')) {
              image = val;
            } else {
              // Local asset in posts folder
              image = `/api/posts/assets/${val}`;
            }
          }
          else if (key === 'author') author = val;
          else if (key === 'readingtime') readingTime = val;
          else if (key === 'tags') tags = val.split(',').map(t => t.trim()).filter(Boolean);
          else if (key === 'featured') featured = val === 'true';
          else if (key === 'date') date = val;
          else if (key === 'status') status = val as any;
          else if (key === 'adscode' || key === 'ads') adsCode = val;
        }
      });
    }

    return {
      id,
      title,
      category,
      excerpt: excerpt || body.slice(0, 160).replace(/<[^>]*>/g, '') + '...',
      content: body,
      author,
      image,
      tags,
      readingTime,
      featured,
      date,
      status,
      createdAt: new Date(date).toISOString(),
      adsCode,
      fileName
    };
  } catch (err) {
    console.error(`Error parsing file ${fileName}:`, err);
    return null;
  }
}

// ----------------- API ENDPOINTS -----------------

// 1. Get List of Dynamic Articles from Folder
app.get('/api/posts', (req, res) => {
  try {
    const files = fs.readdirSync(POSTS_DIR);
    const parsedPosts = files
      .filter(file => file.endsWith('.txt') || file.endsWith('.md') || file.endsWith('.json'))
      .map(file => parsePostFile(file))
      .filter(Boolean);

    // Sort descending by date or id
    parsedPosts.sort((a, b) => b.id - a.id);
    res.json(parsedPosts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read articles directory' });
  }
});

// 2. Add or Edit Article (Write directly to Posts folder)
app.post('/api/posts', (req, res) => {
  try {
    const {
      title,
      category,
      excerpt,
      content,
      author,
      thumbnailName, // filename like "btc-chart.png"
      thumbnailBase64, // Base64 encoding
      thumbnailUrl, // Or a remote URL
      adsCode,
      tags,
      status,
      featured,
      date,
      fileName // if editing an existing file
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and Content are required.' });
    }

    // Determine target thumbnail image value
    let imageValue = thumbnailUrl || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800';

    if (thumbnailBase64 && thumbnailName) {
      // Clean thumbnail base64 string
      const base64Data = thumbnailBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(path.join(POSTS_DIR, thumbnailName), buffer);
      imageValue = thumbnailName; // Just write the relative name inside headers
    }

    const cleanTitle = title.trim();
    const safeTitle = cleanTitle.replace(/[^a-zA-Z0-9-_ ]/g, '').slice(0, 60);
    const targetFileName = fileName || `${safeTitle}.txt`;
    const finalDate = date || new Date().toISOString().split('T')[0];

    // Build the canonical plaintext structure requested by user
    const fileContent = `Title: ${cleanTitle}
Category: ${category || 'crypto'}
Excerpt: ${excerpt || ''}
Thumbnail: ${imageValue}
Author: ${author || 'System'}
ReadingTime: 4 min read
Tags: ${(tags || []).join(', ')}
Featured: ${featured || 'false'}
Date: ${finalDate}
Status: ${status || 'published'}
AdsCode: ${adsCode || ''}
---
${content}`;

    fs.writeFileSync(path.join(POSTS_DIR, targetFileName), fileContent, 'utf-8');

    // Parse back the written file to confirm and return it
    const writtenPost = parsePostFile(targetFileName);
    res.json(writtenPost);
  } catch (err) {
    console.error('Error saving article to folder:', err);
    res.status(500).json({ error: 'Failed to write post to files directory.' });
  }
});

// 3. Delete Dynamic Article from Folder
app.delete('/api/posts/:fileName', (req, res) => {
  try {
    const file = req.params.fileName;
    const filePath = path.join(POSTS_DIR, file);
    if (fs.existsSync(filePath)) {
      // Parse file first to see if there is a local thumbnail to clean up
      const post = parsePostFile(file);
      if (post && post.image && post.image.includes('/api/posts/assets/')) {
        const thumbName = post.image.split('/api/posts/assets/')[1];
        if (thumbName) {
          const thumbPath = path.join(POSTS_DIR, thumbName);
          if (fs.existsSync(thumbPath)) {
            fs.unlinkSync(thumbPath);
          }
        }
      }
      fs.unlinkSync(filePath);
      res.json({ success: true, message: `Successfully deleted physical file ${file}` });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// ----------------- VITE DEVELOPMENT & PRODUCTION INTEGRATION -----------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MoneyMarketCap dynamic Full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
