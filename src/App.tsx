import React, { useState, useEffect } from 'react';
import { Search, Globe, RefreshCw, LayoutGrid, Calendar, BookOpen, Clock, Tag, TrendingUp, Sparkles, LineChart, Sliders, Cpu } from 'lucide-react';
import { Post, AMPStory } from './types';
import { INITIAL_POSTS, INITIAL_STORIES, INITIAL_COMMENTS } from './data';
import Logo from './components/Logo';
import LiveNewsTimeline from './components/LiveNewsTimeline';
import ArticleReader from './components/ArticleReader';
import AdminPanel from './components/AdminPanel';
import InteractiveWebStories from './components/InteractiveWebStories';

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [ampStories, setAmpStories] = useState<AMPStory[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'admin'>('home');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updateTime, setUpdateTime] = useState<string>('07:16');
  const [searchActive, setSearchActive] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    // Fetch live posts from physical server directory with localStorage fallback
    const fetchDynamicPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPosts(data);
            localStorage.setItem('moneymarketcap_posts', JSON.stringify(data));
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch dynamic physical posts, falling back to cached state:', err);
      }

      // Local Fallback
      const storedPosts = localStorage.getItem('moneymarketcap_posts');
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        localStorage.setItem('moneymarketcap_posts', JSON.stringify(INITIAL_POSTS));
        setPosts(INITIAL_POSTS);
      }
    };

    fetchDynamicPosts();

    // AMP Stories
    const storedStories = localStorage.getItem('moneymarketcap_amp_stories');
    if (storedStories) {
      setAmpStories(JSON.parse(storedStories));
    } else {
      localStorage.setItem('moneymarketcap_amp_stories', JSON.stringify(INITIAL_STORIES));
      setAmpStories(INITIAL_STORIES);
    }

    // Comments
    const storedComments = localStorage.getItem('moneymarketcap_comments');
    if (!storedComments) {
      localStorage.setItem('moneymarketcap_comments', JSON.stringify(INITIAL_COMMENTS));
    }

    // Update timestamp
    const now = new Date();
    setUpdateTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
  }, []);

  // Hidden keydown listener for CMS toggle (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'A' || e.key === 'a') && e.shiftKey && e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
        setCurrentView(prev => prev === 'admin' ? 'home' : 'admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdatePosts = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('moneymarketcap_posts', JSON.stringify(updatedPosts));
  };

  const handleUpdateStories = (updatedStories: AMPStory[]) => {
    setAmpStories(updatedStories);
    localStorage.setItem('moneymarketcap_amp_stories', JSON.stringify(updatedStories));
  };

  const handleReadPost = (postId: number) => {
    setSelectedPostId(postId);
    setCurrentView('article');
  };

  // Filter published posts for home page rendering
  const activePosts = posts.filter(p => p.status === 'published');

  // Search and Category filtering
  const filteredPosts = activePosts.filter((post) => {
    const matchesCategory = currentCategory === 'all' || post.category.toLowerCase() === currentCategory.toLowerCase();
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Featured post selection
  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  
  // Secondary posts (remaining search results omitting the active featured one)
  const secondaryPosts = filteredPosts.filter(p => p.id !== (featuredPost?.id || 0)).slice(0, 3);
  
  // Latest general items grid (omitting featured and secondary list)
  const latestGridPosts = filteredPosts.filter(p => p.id !== (featuredPost?.id || 0) && !secondaryPosts.some(s => s.id === p.id));

  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink flex flex-col font-sans transition-all">
      


      {/* Wise-Inspired Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-brand-ink/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* SVG Gradient Logo Component */}
          <div 
            className="cursor-pointer select-none" 
            onClick={() => { setCurrentView('home'); setCurrentCategory('all'); setSearchQuery(''); }}
            onDoubleClick={() => { setCurrentView('admin'); }}
            title="MoneyMarketCap Home"
          >
            <Logo />
          </div>

          {/* Navigation Category Links (Desktop) */}
          {currentView === 'home' && (
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: 'All Market', value: 'all' },
                { label: 'Crypto', value: 'crypto' },
                { label: 'Stocks', value: 'stocks' },
                { label: 'Forex', value: 'forex' },
                { label: 'Economy', value: 'economy' },
                { label: 'Tech', value: 'tech' }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setCurrentCategory(tab.value)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                    currentCategory === tab.value
                      ? 'bg-brand-ink text-brand-primary'
                      : 'text-brand-ink hover:bg-brand-canvas-soft'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          )}

          {/* Header Action Items */}
          <div className="flex items-center gap-3">
            {/* Instant search input */}
            {currentView === 'home' && (
              <div className="relative flex items-center">
                <div className={`flex items-center transition-all duration-300 ease-out rounded-full border ${
                  searchActive || searchQuery 
                    ? 'w-64 bg-white border-[#ff6a1a] shadow-md px-3 py-1.5 ring-2 ring-[#ff6a1a]/10' 
                    : 'w-10 h-10 bg-brand-canvas-soft border-transparent hover:bg-brand-canvas-soft/80 justify-center p-0'
                }`}>
                  <button
                    onClick={() => setSearchActive(!searchActive)}
                    className="flex-shrink-0 transition-transform active:scale-95 duration-150 cursor-pointer flex items-center justify-center w-8 h-8"
                    title="Search articles"
                  >
                    <Search className={`w-4 h-4 transition-colors duration-200 ${searchActive || searchQuery ? 'text-[#ff6a1a]' : 'text-brand-ink'}`} />
                  </button>
                  
                  {(searchActive || searchQuery) && (
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setSearchQuery('');
                          setSearchActive(false);
                        }
                      }}
                      placeholder="Search market insights..."
                      className="ml-2 w-full bg-transparent text-xs font-semibold outline-none text-brand-ink placeholder-brand-mute"
                    />
                  )}
                  
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-[10px] bg-brand-canvas-soft hover:bg-brand-canvas-soft-active hover:scale-105 text-brand-mute hover:text-brand-ink font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center transition ml-1 cursor-pointer"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* CMS Panel Switcher button - Exit button only visible when inside Admin Panel */}
            {currentView === 'admin' && (
              <button
                onClick={() => setCurrentView('home')}
                className="bg-brand-ink hover:bg-brand-ink/90 text-brand-primary font-display font-black text-xs px-5 py-2.5 rounded-full uppercase tracking-wider transition hover:scale-102 cursor-pointer"
              >
                Exit Console
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation categories scroll-container */}
        {currentView === 'home' && (
          <div className="lg:hidden flex items-center gap-1 px-4 py-3 border-t border-brand-ink/5 overflow-x-auto scrollbar-none bg-brand-canvas-soft/40">
            {[
              { label: 'All', value: 'all' },
              { label: 'Crypto', value: 'crypto' },
              { label: 'Stocks', value: 'stocks' },
              { label: 'Forex', value: 'forex' },
              { label: 'Economy', value: 'economy' },
              { label: 'Tech', value: 'tech' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setCurrentCategory(tab.value)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0 transition ${
                  currentCategory === tab.value
                    ? 'bg-brand-ink text-brand-primary'
                    : 'bg-white text-brand-ink border border-brand-ink/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Body */}
      <main className="flex-grow">
        
        {/* 1. PUBLIC HOME VIEW */}
        {currentView === 'home' && (
          <div className="space-y-12 animate-fadeIn pb-16">
            
            {/* Wise Hero split band */}
            <section className="bg-white border-b border-brand-ink/5 py-12 md:py-16">
              <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                {/* Left Side: Bold Header display */}
                <div className="lg:col-span-7 space-y-6">
                  <span className="inline-flex items-center gap-1 text-xs font-black bg-brand-primary-pale text-brand-ink-deep px-3 py-1 rounded-full uppercase tracking-widest">
                    <Globe className="w-3.5 h-3.5 animate-spin text-brand-primary" /> GLOBAL MARKETS LIVE
                  </span>
                  
                  <h2 className="font-display font-black text-4xl md:text-6xl text-brand-ink leading-[1.05] tracking-tighter">
                    Financial Insights, <span className="text-[#ff6a1a]">Redefined.</span>
                  </h2>
                  
                  <p className="text-base md:text-lg text-brand-body leading-relaxed max-w-xl font-medium">
                    Analyze, track, and decode global markets with lightning-fast updates, cryptocurrency trends, and a fully customizable publishing suite.
                  </p>

                  {featuredPost && (
                    <div className="pt-2">
                      <button
                        onClick={() => handleReadPost(featuredPost.id)}
                        className="bg-brand-primary hover:bg-brand-primary-active text-brand-on-primary font-display font-black text-sm px-6 py-3.5 rounded-full uppercase tracking-wider transition hover:scale-102 shadow-sm cursor-pointer"
                      >
                        Read Featured Article →
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Side: Live News Timeline feed */}
                <div className="lg:col-span-5">
                  <LiveNewsTimeline posts={posts} onReadPost={handleReadPost} />
                </div>

              </div>
            </section>

            {/* Main news structure */}
            <section className="max-w-7xl mx-auto px-4 md:px-6">
              
              {/* If no articles match query */}
              {filteredPosts.length === 0 ? (
                <div className="bg-white rounded-[24px] border border-brand-ink/5 p-12 text-center max-w-xl mx-auto my-12 shadow-xs">
                  <Search className="w-12 h-12 text-brand-mute/40 mx-auto mb-4" />
                  <h3 className="font-display font-bold text-lg text-brand-ink mb-2">No Articles Match Your Search</h3>
                  <p className="text-brand-mute text-sm max-w-sm mx-auto mb-6">
                    Try modifying your spelling, selecting another category tab, or creating a fresh article in the Admin panel!
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setCurrentCategory('all'); }}
                    className="bg-brand-primary hover:bg-brand-primary-active text-brand-on-primary font-bold px-5 py-2.5 rounded-full text-xs"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="space-y-12">
                  
                  {/* Featured & Trending section split */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Big Featured Card */}
                    {featuredPost && (
                      <div
                        onClick={() => handleReadPost(featuredPost.id)}
                        className="lg:col-span-8 bg-white rounded-[24px] overflow-hidden border border-brand-ink/5 shadow-xs hover:shadow-md hover:scale-[1.005] transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                      >
                        <div className="relative overflow-hidden aspect-video max-h-[360px]">
                          <img
                            src={featuredPost.image}
                            alt={featuredPost.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800";
                            }}
                          />
                          <div className="absolute top-4 left-4 bg-[#ff6a1a] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                            {featuredPost.category}
                          </div>
                        </div>

                        <div className="p-6 md:p-8 space-y-4 flex-grow">
                          <h3 className="font-serif font-black text-2xl md:text-3xl text-brand-ink leading-tight tracking-tight group-hover:text-[#ff6a1a] transition-colors">
                            {featuredPost.title}
                          </h3>
                          <p className="text-sm md:text-base text-brand-body leading-relaxed line-clamp-3">
                            {featuredPost.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-brand-mute pt-4 border-t border-brand-ink/5 font-semibold">
                            <span>By {featuredPost.author}</span>
                            <div className="flex gap-4 items-center">
                              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-brand-mute/80" /> {featuredPost.date}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-mute/80" /> {featuredPost.readingTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Trending Sidebar List */}
                    <div className="lg:col-span-4 space-y-6">
                      <h3 className="font-display font-black text-lg text-brand-ink flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#ff6a1a]" /> Trending Inside {currentCategory.toUpperCase()}
                      </h3>

                      <div className="space-y-4">
                        {secondaryPosts.length === 0 ? (
                          <div className="bg-white/50 border border-dashed border-brand-ink/10 rounded-2xl p-6 text-center text-brand-mute text-xs font-semibold">
                            No trending secondary articles.
                          </div>
                        ) : (
                          secondaryPosts.map((post) => (
                            <div
                              key={post.id}
                              onClick={() => handleReadPost(post.id)}
                              className="bg-white rounded-2xl p-4 border border-brand-ink/5 shadow-xs hover:shadow-sm hover:translate-x-1 transition duration-200 cursor-pointer flex gap-4"
                            >
                              <img
                                src={post.image}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800";
                                }}
                              />
                              <div className="flex flex-col justify-between py-0.5">
                                <span className="text-[9px] font-black text-[#ff6a1a] uppercase tracking-wider">
                                  {post.category}
                                </span>
                                <h4 className="font-display font-bold text-xs text-brand-ink leading-snug line-clamp-2 hover:text-[#ff6a1a] transition">
                                  {post.title}
                                </h4>
                                <span className="text-[10px] text-brand-mute font-medium">
                                  {post.date} • {post.readingTime}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Interactive Web Stories */}
                  <InteractiveWebStories stories={ampStories} onReadPost={handleReadPost} />

                  {/* Latest general stories list grid */}
                  {latestGridPosts.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="font-display font-black text-lg text-brand-ink flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-brand-mute" /> More Market Headlines
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {latestGridPosts.map((post) => (
                          <div
                            key={post.id}
                            onClick={() => handleReadPost(post.id)}
                            className="bg-white rounded-[20px] overflow-hidden border border-brand-ink/5 p-4 shadow-xs hover:shadow-md transition duration-300 cursor-pointer flex flex-col justify-between group"
                          >
                            <div>
                              <div className="relative aspect-video rounded-[12px] overflow-hidden mb-4">
                                <img
                                  src={post.image}
                                  alt={post.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-102 transition"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800";
                                  }}
                                />
                                <span className="absolute top-2 left-2 bg-[#ff6a1a] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-md">
                                  {post.category}
                                </span>
                              </div>
                              <h4 className="font-display font-bold text-sm text-brand-ink line-clamp-2 leading-snug group-hover:text-[#ff6a1a] transition mb-2">
                                {post.title}
                              </h4>
                              <p className="text-xs text-brand-body line-clamp-2 leading-relaxed mb-4">
                                {post.excerpt}
                              </p>
                            </div>

                            <div className="text-[11px] text-brand-mute font-semibold pt-3 border-t border-brand-ink/5 flex justify-between items-center">
                              <span>By {post.author}</span>
                              <span>{post.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </section>

          </div>
        )}

        {/* 2. DYNAMIC READER VIEW */}
        {currentView === 'article' && selectedPostId !== null && (
          <div className="bg-white border-b border-brand-ink/5">
            {(() => {
              const activePost = posts.find(p => p.id === selectedPostId);
              if (!activePost) {
                return (
                  <div className="text-center p-12">
                    <p>Article not found.</p>
                    <button onClick={() => setCurrentView('home')} className="bg-brand-primary text-brand-on-primary px-4 py-2 rounded-full">
                      Back Home
                    </button>
                  </div>
                );
              }
              return (
                <ArticleReader
                  post={activePost}
                  allPosts={posts}
                  onBack={() => setCurrentView('home')}
                  onReadPost={handleReadPost}
                />
              );
            })()}
          </div>
        )}

        {/* 3. ADMIN PANEL SYSTEM */}
        {currentView === 'admin' && (
          <AdminPanel
            posts={posts}
            ampStories={ampStories}
            onUpdatePosts={handleUpdatePosts}
            onUpdateStories={handleUpdateStories}
            onViewWebsite={() => setCurrentView('home')}
          />
        )}

      </main>

      {/* Wise Dark Ink Footer */}
      <footer className="bg-brand-ink text-brand-canvas-soft py-16 px-6 border-t border-brand-primary/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          
          {/* Column 1: Logo & Tagline */}
          <div className="space-y-4 col-span-2 md:col-span-3 lg:col-span-2">
            <div 
              className="cursor-pointer select-none max-w-full" 
              onDoubleClick={() => { setCurrentView('admin'); }}
              title="MoneyMarketCap Logo (Double click for Admin CMS)"
            >
              <Logo inverse />
            </div>
            <p className="text-xs text-brand-mute leading-relaxed max-w-sm">
              MoneyMarketCap provides premium real-time financial tracking, deep market analysis, and cryptocurrency updates.
            </p>
          </div>

          {/* Column 2: About */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest">
              About
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <span className="text-brand-mute hover:text-brand-primary transition cursor-pointer">About MoneyMarketCap</span>
              <span className="text-brand-mute hover:text-brand-primary transition cursor-pointer">Our Mission</span>
              <span className="text-brand-mute hover:text-brand-primary transition cursor-pointer">Team</span>
              <span className="text-brand-mute hover:text-brand-primary transition cursor-pointer">Contact Us</span>
            </div>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest">
              Categories
            </h4>
            <div className="flex flex-col gap-2 text-xs text-brand-mute">
              <button 
                onClick={() => { setCurrentCategory('crypto'); setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="hover:text-brand-primary text-left transition text-brand-mute cursor-pointer"
              >
                Cryptocurrency
              </button>
              <button 
                onClick={() => { setCurrentCategory('stocks'); setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="hover:text-brand-primary text-left transition text-brand-mute cursor-pointer"
              >
                Stock Market
              </button>
              <button 
                onClick={() => { setCurrentCategory('forex'); setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="hover:text-brand-primary text-left transition text-brand-mute cursor-pointer"
              >
                Forex
              </button>
              <button 
                onClick={() => { setCurrentCategory('economy'); setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="hover:text-brand-primary text-left transition text-brand-mute cursor-pointer"
              >
                Economics
              </button>
              <button 
                onClick={() => { setCurrentCategory('tech'); setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="hover:text-brand-primary text-left transition text-brand-mute cursor-pointer"
              >
                Technology
              </button>
            </div>
          </div>

          {/* Column 4: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest">
              Resources
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <span className="text-brand-mute hover:text-brand-primary transition cursor-pointer">Market Data API</span>
              <span className="text-brand-mute hover:text-brand-primary transition cursor-pointer">Mobile App</span>
              <span className="text-brand-mute hover:text-brand-primary transition cursor-pointer">Browser Extension</span>
              <span className="text-brand-mute hover:text-brand-primary transition cursor-pointer">Contact Support</span>
            </div>
          </div>

          {/* Column 5: Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest">
              Legal
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <span className="text-brand-mute hover:text-brand-primary transition cursor-pointer">Privacy Policy</span>
              <span className="text-brand-mute hover:text-brand-primary transition cursor-pointer">Terms of Service</span>
              <span className="text-brand-mute hover:text-brand-primary transition cursor-pointer">Cookie Policy</span>
              <span className="text-brand-mute hover:text-brand-primary transition cursor-pointer font-semibold text-[#ff6a1a]">Disclaimer</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-12 border-t border-brand-canvas-soft/10 text-center text-xs text-brand-mute flex items-center justify-between flex-wrap gap-4">
          <p>© 2026 MoneyMarketCap. All rights reserved.</p>
          <p className="text-[10px] text-brand-mute/60 max-w-lg text-right hidden lg:block leading-relaxed">
            All investment trends, financial forecasts, and calculations computed inside MoneyMarketCap are intended for educational and testing purposes only. Seek professional legal or financial counsel prior to capital commitment.
          </p>
        </div>
      </footer>

    </div>
  );
}
