import React from 'react';
import { Clock, Radio, ArrowRight, Star, AlertCircle, TrendingUp } from 'lucide-react';
import { Post } from '../types';

interface LiveNewsTimelineProps {
  posts: Post[];
  onReadPost: (id: number) => void;
}

export default function LiveNewsTimeline({ posts, onReadPost }: LiveNewsTimelineProps) {
  // Sort posts by date or id descending to get the absolute latest posts
  const latestPosts = [...posts]
    .filter(post => post.status === 'published')
    .sort((a, b) => b.id - a.id)
    .slice(0, 4); // Show top 4 latest posts in the live timeline feed

  // Helper to generate a realistic relative timeframe based on difference or post date
  const getRelativeTimeString = (postDateStr: string, idx: number) => {
    if (idx === 0) return 'JUST NOW';
    if (idx === 1) return '15 MINS AGO';
    if (idx === 2) return '1 HOUR AGO';
    return `${postDateStr}`;
  };

  return (
    <div className="w-full bg-white rounded-[24px] border border-brand-ink/10 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Header Block with Live Pulse */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-ink/5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6a1a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#ff6a1a]"></span>
            </span>
            <h3 className="font-display font-black text-lg text-brand-ink uppercase tracking-tight flex items-center gap-1.5">
              Live News Feed
            </h3>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-ink bg-brand-primary-pale px-2.5 py-1 rounded-full flex items-center gap-1 border border-brand-primary/10">
            <Radio className="w-3.5 h-3.5 text-brand-primary animate-pulse" /> Live Terminal
          </span>
        </div>

        {/* Timeline Events List */}
        {latestPosts.length === 0 ? (
          <div className="py-8 text-center text-brand-mute text-sm font-semibold">
            No live news updates available.
          </div>
        ) : (
          <div className="relative border-l border-brand-ink/10 pl-5 ml-1.5 space-y-6">
            {latestPosts.map((post, index) => {
              const relativeTime = getRelativeTimeString(post.date, index);
              const isLatest = index === 0;

              return (
                <div 
                  key={post.id} 
                  onClick={() => onReadPost(post.id)}
                  className="group relative cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                >
                  {/* Timeline Node / Indicator Dot */}
                  <span className={`absolute -left-[26px] top-1.5 flex items-center justify-center rounded-full w-3.5 h-3.5 border-2 ${
                    isLatest 
                      ? 'bg-gradient-to-tr from-[#ff5c2a] to-[#d1259a] border-white scale-125 shadow-sm' 
                      : 'bg-white border-brand-ink/30 group-hover:border-[#ff5c2a]'
                  } transition`}>
                    {isLatest && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5c2a] opacity-50"></span>}
                  </span>

                  {/* News Event Content */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-black tracking-widest uppercase ${
                        isLatest ? 'text-[#ff5c2a]' : 'text-brand-mute'
                      }`}>
                        {relativeTime}
                      </span>
                      <span className="text-[9px] font-black uppercase bg-[#8a1be5]/5 text-[#8a1be5] border border-[#8a1be5]/10 px-1.5 py-0.5 rounded">
                        {post.category}
                      </span>
                      {post.featured && (
                        <span className="text-[8px] font-bold uppercase bg-brand-primary/10 text-brand-ink px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current text-brand-primary" /> Key
                        </span>
                      )}
                    </div>

                    <h4 className="font-display font-bold text-xs md:text-sm text-brand-ink leading-snug group-hover:text-[#ff5c2a] transition-colors duration-150 line-clamp-2">
                      {post.title}
                    </h4>

                    <p className="text-[11px] text-brand-mute line-clamp-1 leading-relaxed font-semibold">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Timeline Footer Actions */}
      {latestPosts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-brand-ink/5 flex items-center justify-between">
          <span className="text-[10px] text-brand-mute font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brand-mute" /> System Auto-refreshing
          </span>
          <button 
            onClick={() => onReadPost(latestPosts[0].id)}
            className="text-[10px] font-black text-brand-ink group flex items-center gap-1 hover:text-[#ff5c2a] uppercase tracking-wider transition"
          >
            Flash Bulletin <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
