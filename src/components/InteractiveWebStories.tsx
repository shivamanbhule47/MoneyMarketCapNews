import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Sparkles, X, ChevronLeft, ChevronRight, Play, Pause, ExternalLink, ThumbsUp, Heart, Share2, Volume2, VolumeX, MessageSquare } from 'lucide-react';
import { AMPStory, AMPPage } from '../types';

interface InteractiveWebStoriesProps {
  stories: AMPStory[];
  onReadPost: (postId: number) => void;
}

export default function InteractiveWebStories({ stories, onReadPost }: InteractiveWebStoriesProps) {
  const [activeStory, setActiveStory] = useState<AMPStory | null>(null);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  // Interactive poll states keyed by "storyId-pageId" -> selection
  const [pollResponses, setPollResponses] = useState<Record<string, 'yes' | 'no'>>({});
  const [pollVotes, setPollVotes] = useState<Record<string, { yes: number, no: number }>>({});

  // Slide duration in ms
  const SLIDE_DURATION = 5000;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressStartTimeRef = useRef<number>(0);
  const [elapsedProgress, setElapsedProgress] = useState<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize simulated votes
  useEffect(() => {
    const initialVotes: Record<string, { yes: number, no: number }> = {};
    stories.forEach(story => {
      story.pages.forEach(page => {
        const key = `${story.id}-${page.id}`;
        // Deterministic but random-looking starting values based on IDs
        const seed = (story.id + page.id) % 100;
        initialVotes[key] = {
          yes: 40 + (seed % 35),
          no: 25 + (seed % 25)
        };
      });
    });
    setPollVotes(initialVotes);

    // Load user responses from localStorage
    const savedResponses = localStorage.getItem('moneymarketcap_story_polls');
    if (savedResponses) {
      try {
        setPollResponses(JSON.parse(savedResponses));
      } catch (e) {
        console.error(e);
      }
    }
  }, [stories]);

  // Handle slide timer and progression
  useEffect(() => {
    if (!activeStory) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    // Reset progress
    setElapsedProgress(0);
    const intervalTime = 50; // update every 50ms
    const step = (intervalTime / SLIDE_DURATION) * 100;

    progressIntervalRef.current = setInterval(() => {
      setElapsedProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressIntervalRef.current!);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    timerRef.current = setTimeout(() => {
      handleNextSlide();
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [activeStory, activePageIndex, isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeStory) return;
      if (e.key === 'ArrowRight') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'Escape') {
        handleCloseStory();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStory, activePageIndex]);

  const handleOpenStory = (story: AMPStory) => {
    setActiveStory(story);
    setActivePageIndex(0);
    setIsPlaying(true);
    setElapsedProgress(0);
  };

  const handleCloseStory = () => {
    setActiveStory(null);
    setActivePageIndex(0);
    setIsPlaying(false);
  };

  const handleNextSlide = () => {
    if (!activeStory) return;
    if (activePageIndex < activeStory.pages.length - 1) {
      setActivePageIndex(prev => prev + 1);
      setElapsedProgress(0);
    } else {
      // Find next story to auto-transition to
      const currentIdx = stories.findIndex(s => s.id === activeStory.id);
      if (currentIdx !== -1 && currentIdx < stories.length - 1) {
        setActiveStory(stories[currentIdx + 1]);
        setActivePageIndex(0);
        setElapsedProgress(0);
      } else {
        handleCloseStory();
      }
    }
  };

  const handlePrevSlide = () => {
    if (!activeStory) return;
    if (activePageIndex > 0) {
      setActivePageIndex(prev => prev - 1);
      setElapsedProgress(0);
    } else {
      // Go to previous story
      const currentIdx = stories.findIndex(s => s.id === activeStory.id);
      if (currentIdx > 0) {
        const prevStory = stories[currentIdx - 1];
        setActiveStory(prevStory);
        setActivePageIndex(prevStory.pages.length - 1);
        setElapsedProgress(0);
      }
    }
  };

  const handleVote = (storyId: number, pageId: number, option: 'yes' | 'no') => {
    const key = `${storyId}-${pageId}`;
    if (pollResponses[key]) return; // already voted

    const updatedResponses = { ...pollResponses, [key]: option };
    setPollResponses(updatedResponses);
    localStorage.setItem('moneymarketcap_story_polls', JSON.stringify(updatedResponses));

    // Increment votes
    setPollVotes(prev => {
      const current = prev[key] || { yes: 50, no: 30 };
      return {
        ...prev,
        [key]: {
          ...current,
          [option]: current[option] + 1
        }
      };
    });
  };

  const handleShareStory = (story: AMPStory) => {
    navigator.clipboard.writeText(`${window.location.origin}?story=${story.id}`);
    setCopiedId(story.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCTAClick = (ctaLink: string) => {
    // If the link is an article ID or starts with /posts or /article
    const numericMatch = ctaLink.match(/\d+/);
    if (numericMatch) {
      const postId = parseInt(numericMatch[0], 10);
      handleCloseStory();
      onReadPost(postId);
    } else {
      // Just fallback to the first article or generic navigation
      handleCloseStory();
      onReadPost(1718000000000); // default to first post
    }
  };

  if (stories.length === 0) return null;

  return (
    <div id="interactive-stories-section" className="bg-brand-canvas-soft border border-brand-ink/5 p-6 md:p-8 rounded-[32px] space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-[#ff6a1a]/10 text-[#ff6a1a] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#ff6a1a] fill-[#ff6a1a]/20" /> Visual Micro-Insights
          </span>
          <h3 className="font-display font-black text-xl text-brand-ink">
            Interactive Web Stories
          </h3>
          <p className="text-xs text-brand-mute max-w-xl">
            Swipe and tap through rapid visual digests. Cast your vote in community sentiment polls built directly inside each story slide!
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-brand-mute font-bold bg-white/60 border border-brand-ink/5 px-3 py-1.5 rounded-xl">
          <Smartphone className="w-4 h-4 text-brand-primary" /> Multi-touch compatible
        </div>
      </div>

      {/* Story Carousel Tray */}
      <div className="flex items-center gap-5 overflow-x-auto pb-4 scrollbar-none scroll-smooth">
        {stories.map((story) => {
          const coverPage = story.pages.find(p => p.type === 'cover') || story.pages[0];
          const isSelected = activeStory?.id === story.id;
          
          return (
            <div
              key={story.id}
              onClick={() => handleOpenStory(story)}
              className="flex-shrink-0 group cursor-pointer focus:outline-none"
            >
              {/* Elegant 9:16 Aspect Ratio Card Container */}
              <div className={`w-[144px] h-[256px] relative rounded-2xl overflow-hidden bg-brand-ink shadow-lg transition-all duration-300 flex flex-col justify-between border-2 ${
                isSelected 
                  ? 'border-[#ff6a1a] ring-4 ring-[#ff6a1a]/20 scale-102' 
                  : 'border-brand-ink/10 group-hover:border-brand-primary group-hover:scale-102'
              }`}>
                
                {/* Background Cover Image with Zoom Effect */}
                <img
                  src={coverPage?.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=300"}
                  alt={story.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=300";
                  }}
                />

                {/* Gradient scrim to guarantee high text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/35 to-transparent pointer-events-none" />

                {/* Top Badge: 9:16 Aspect Ratio and Page Count */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10 pointer-events-none">
                  <span className="bg-[#ff6a1a] text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
                    9:16
                  </span>
                  <span className="bg-brand-ink/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md border border-white/10 backdrop-blur-xs">
                    {story.pages.length} Pages
                  </span>
                </div>

                {/* Bottom-aligned Story Category & Title */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10 space-y-1 text-left">
                  <span className="text-[7.5px] font-black text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-1.5 py-0.5 rounded uppercase tracking-wider inline-block">
                    {story.category}
                  </span>
                  <h4 className="text-[11px] font-black text-white leading-tight line-clamp-3 group-hover:text-brand-primary transition">
                    {story.title}
                  </h4>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULLSCREEN IMMERSIVE MOBILE WEB STORY PLAYER MODAL */}
      {activeStory && (
        <div className="fixed inset-0 bg-brand-ink/95 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
          
          {/* Aspect ratio header badge */}
          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 rounded-full flex items-center gap-1.5 animate-fadeIn">
            <Smartphone className="w-3.5 h-3.5" /> 9:16 Immersive Mobile Format
          </div>

          {/* Main simulator container */}
          <div className="relative w-[360px] h-[640px] aspect-[9/16] bg-black rounded-[40px] border-[10px] border-neutral-900 shadow-2xl overflow-hidden flex flex-col justify-between">
            
            {/* Top Speaker / Sensor Notch overlay */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-5 bg-neutral-900 rounded-full z-40 flex items-center justify-center">
              <div className="w-12 h-1 bg-neutral-800 rounded-full" />
            </div>

            {/* Backing Slide Image Layer */}
            {activeStory.pages[activePageIndex]?.image && (
              <div 
                className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
                style={{ backgroundImage: `url(${activeStory.pages[activePageIndex].image})` }}
              >
                {/* Immersive gradient tint */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
              </div>
            )}
            {!activeStory.pages[activePageIndex]?.image && (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-ink via-slate-900 to-brand-ink z-0">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff6a1a_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>
            )}

            {/* Content Foreground Grid */}
            <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white select-none">
              
              {/* Header Segment (Progress indicator bars + controls) */}
              <div className="space-y-4 pt-4">
                {/* Horizontal progress segments */}
                <div className="flex gap-1.5">
                  {activeStory.pages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden relative cursor-pointer"
                      onClick={() => {
                        setActivePageIndex(idx);
                        setElapsedProgress(0);
                      }}
                    >
                      {idx < activePageIndex && (
                        <div className="absolute inset-0 bg-brand-primary" />
                      )}
                      {idx === activePageIndex && (
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-brand-primary transition-all duration-75 ease-linear"
                          style={{ width: `${elapsedProgress}%` }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Profile row, metadata and close buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center text-brand-ink font-black text-xs font-mono">
                      M
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider leading-none">MoneyMarketCap</p>
                      <p className="text-[8px] text-white/60 font-semibold mt-0.5">Live AMP Feed</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsPlaying(prev => !prev)}
                      className="p-1 hover:text-brand-primary transition"
                      title={isPlaying ? "Pause autoplay" : "Play autoplay"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white/10" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>
                    <button 
                      onClick={() => handleShareStory(activeStory)}
                      className="p-1 hover:text-brand-primary transition relative"
                      title="Copy Story Link"
                    >
                      <Share2 className="w-4 h-4" />
                      {copiedId === activeStory.id && (
                        <span className="absolute -top-8 right-0 bg-brand-primary text-brand-ink text-[8px] font-black py-0.5 px-2 rounded whitespace-nowrap animate-bounce">
                          Copied!
                        </span>
                      )}
                    </button>
                    <button 
                      onClick={handleCloseStory}
                      className="p-1 hover:text-brand-negative transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tapping zone (Split screen touch controller layers overlaying slide but behind text inputs) */}
              <div className="absolute inset-x-0 top-24 bottom-32 flex z-0">
                <div 
                  className="w-1/3 h-full cursor-w-resize" 
                  onClick={handlePrevSlide}
                  title="Previous slide"
                />
                <div 
                  className="w-2/3 h-full cursor-e-resize" 
                  onClick={handleNextSlide}
                  title="Next slide"
                />
              </div>

              {/* Centered slide-specific interactive templates (Taps and polls) */}
              <div className="z-10 flex-grow flex flex-col justify-end space-y-5 pb-4">
                
                {/* 1. COVER TEMPLATE */}
                {activeStory.pages[activePageIndex].type === 'cover' && (
                  <div className="space-y-3 bg-black/40 p-4 rounded-2xl backdrop-blur-xs border border-white/5">
                    <span className="inline-block text-[8px] bg-brand-primary text-brand-ink font-black px-2 py-0.5 rounded uppercase tracking-widest">
                      {activeStory.category}
                    </span>
                    <h2 className="font-display font-black text-xl leading-tight">
                      {activeStory.pages[activePageIndex].title}
                    </h2>
                    <p className="text-xs text-white/80 leading-relaxed font-medium">
                      {activeStory.pages[activePageIndex].subtitle}
                    </p>
                  </div>
                )}

                {/* 2. CONTENT TEMPLATE WITH INTERACTIVE POLLS */}
                {activeStory.pages[activePageIndex].type === 'content' && (
                  <div className="space-y-4">
                    <div className="bg-black/55 p-4 rounded-2xl backdrop-blur-xs border border-white/5 space-y-3">
                      <span className="inline-block text-[8px] bg-white/20 text-white font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        Insight Card
                      </span>
                      <h3 className="font-display font-bold text-sm text-brand-primary">
                        {activeStory.pages[activePageIndex].title}
                      </h3>
                      <p className="text-xs text-white/90 leading-relaxed font-medium">
                        {activeStory.pages[activePageIndex].content}
                      </p>
                    </div>

                    {/* Integrated Interactive Sentiment Poll Widget */}
                    <div className="bg-brand-ink/90 p-3.5 rounded-2xl border border-brand-primary/20 space-y-2.5">
                      <p className="text-[10px] font-black text-brand-primary uppercase tracking-wider flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-brand-primary" /> Live Community Sentiment
                      </p>
                      <p className="text-xs font-bold leading-tight">
                        Do you agree with this market insight outlook?
                      </p>
                      
                      {(() => {
                        const key = `${activeStory.id}-${activeStory.pages[activePageIndex].id}`;
                        const userVote = pollResponses[key];
                        const votes = pollVotes[key] || { yes: 50, no: 30 };
                        const total = votes.yes + votes.no;
                        const yesPct = Math.round((votes.yes / total) * 100);
                        const noPct = 100 - yesPct;

                        return (
                          <div className="space-y-2 pt-1">
                            {!userVote ? (
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => handleVote(activeStory.id, activeStory.pages[activePageIndex].id, 'yes')}
                                  className="bg-brand-primary hover:bg-brand-primary-active text-brand-ink font-bold py-1.5 px-3 rounded-xl text-xs transition duration-200 active:scale-95"
                                >
                                  Yes, Agree
                                </button>
                                <button
                                  onClick={() => handleVote(activeStory.id, activeStory.pages[activePageIndex].id, 'no')}
                                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-1.5 px-3 rounded-xl text-xs transition duration-200 active:scale-95 border border-white/10"
                                >
                                  Unsure / No
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2 animate-fadeIn">
                                {/* YES result */}
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px] font-bold">
                                    <span className="flex items-center gap-1 text-white/95">
                                      Agree {userVote === 'yes' && '✓'}
                                    </span>
                                    <span className="font-mono text-brand-primary">{yesPct}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-primary rounded-full transition-all duration-500" style={{ width: `${yesPct}%` }} />
                                  </div>
                                </div>

                                {/* NO result */}
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px] font-bold">
                                    <span className="flex items-center gap-1 text-white/70">
                                      Disagree {userVote === 'no' && '✓'}
                                    </span>
                                    <span className="font-mono text-white/80">{noPct}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-white/40 rounded-full transition-all duration-500" style={{ width: `${noPct}%` }} />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* 3. CTA CARD */}
                {activeStory.pages[activePageIndex].type === 'cta' && (
                  <div className="bg-black/60 p-5 rounded-2xl backdrop-blur-xs border border-brand-primary/30 text-center space-y-4 animate-scaleUp">
                    <span className="inline-block text-[8px] bg-brand-primary text-brand-ink font-black px-2.5 py-0.5 rounded uppercase tracking-widest">
                      Deep Dive
                    </span>
                    <h3 className="font-display font-black text-md leading-snug">
                      {activeStory.pages[activePageIndex].title || "Unlock the complete data analysis package on MoneyMarketCap."}
                    </h3>
                    <button
                      onClick={() => handleCTAClick(activeStory.pages[activePageIndex].ctaLink || '/')}
                      className="w-full bg-[#ff6a1a] hover:bg-[#ff5500] text-white font-display font-black text-xs py-3 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-98 shadow-md"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> {activeStory.pages[activePageIndex].ctaText || "Read Full Article"}
                    </button>
                  </div>
                )}

              </div>

              {/* Bottom footer bar navigation indicator buttons */}
              <div className="flex justify-between items-center text-[10px] text-white/50 border-t border-white/10 pt-3 z-10">
                <button 
                  onClick={handlePrevSlide}
                  className="flex items-center gap-0.5 hover:text-white transition"
                  disabled={activePageIndex === 0 && stories.findIndex(s => s.id === activeStory.id) === 0}
                >
                  <ChevronLeft className="w-3 h-3" /> Prev
                </button>
                <span className="font-mono font-bold text-white/80">
                  {activePageIndex + 1} / {activeStory.pages.length}
                </span>
                <button 
                  onClick={handleNextSlide}
                  className="flex items-center gap-0.5 hover:text-white transition"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              </div>

            </div>

            {/* Virtual Simulated Bottom Home Indicator swipe-bar */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/60 rounded-full z-40" />

          </div>

          {/* Desktop Left / Right Navigation controls beside smartphone simulator */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-12 hidden md:block">
            <button
              onClick={handlePrevSlide}
              className="bg-white/10 hover:bg-white/20 border border-white/15 p-4 rounded-full text-white transition hover:scale-110 active:scale-95"
              title="Previous Slide (or Left Arrow Key)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-12 hidden md:block">
            <button
              onClick={handleNextSlide}
              className="bg-white/10 hover:bg-white/20 border border-white/15 p-4 rounded-full text-white transition hover:scale-110 active:scale-95"
              title="Next Slide (or Right Arrow Key)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
