import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, MessageCircle, Share2, Twitter, Linkedin, Facebook, Bookmark, BookmarkCheck, Clock } from 'lucide-react';
import { Post, Comment } from '../types';

function AdBlock({ code }: { code?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!code || !containerRef.current) return;
    
    // Clear and set HTML content
    containerRef.current.innerHTML = code;
    
    // Extract and run any <script> tags to ensure Google Ads or custom scripts execute
    const scripts = containerRef.current.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const oldScript = scripts[i];
      const newScript = document.createElement('script');
      
      // Copy attributes
      Array.from(oldScript.attributes).forEach((attr: any) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    }
  }, [code]);

  if (!code) return null;

  return (
    <div className="my-8 p-4 bg-brand-canvas-soft border border-dashed border-[#ff6a1a]/25 rounded-[20px] flex flex-col items-center justify-center overflow-hidden min-h-[90px] text-center shadow-xs">
      <span className="text-[9px] font-black text-[#ff6a1a] bg-[#ff6a1a]/10 border border-[#ff6a1a]/20 px-2 py-0.5 rounded uppercase tracking-widest mb-3 block">🎯 SPONSORED MONETIZATION BANNER</span>
      <div ref={containerRef} className="w-full flex justify-center text-center max-w-full" />
    </div>
  );
}

interface ArticleReaderProps {
  post: Post;
  allPosts: Post[];
  onBack: () => void;
  onReadPost: (postId: number) => void;
}

export default function ArticleReader({ post, allPosts, onBack, onReadPost }: ArticleReaderProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load comments and bookmark status
  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem('moneymarketcap_comments') || '[]');
    setComments(storedComments.filter((c: Comment) => c.postId === post.id));

    const storedBookmarks = JSON.parse(localStorage.getItem('moneymarketcap_bookmarks') || '[]');
    setIsBookmarked(storedBookmarks.includes(post.id));

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post.id]);

  const handleToggleBookmark = () => {
    const storedBookmarks = JSON.parse(localStorage.getItem('moneymarketcap_bookmarks') || '[]');
    let updatedBookmarks;
    if (isBookmarked) {
      updatedBookmarks = storedBookmarks.filter((id: number) => id !== post.id);
      setIsBookmarked(false);
    } else {
      updatedBookmarks = [...storedBookmarks, post.id];
      setIsBookmarked(true);
    }
    localStorage.setItem('moneymarketcap_bookmarks', JSON.stringify(updatedBookmarks));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentAuthor.trim() || !newCommentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      postId: post.id,
      author: newCommentAuthor.trim(),
      text: newCommentText.trim(),
      date: new Date().toISOString()
    };

    const storedComments = JSON.parse(localStorage.getItem('moneymarketcap_comments') || '[]');
    const updatedComments = [...storedComments, newComment];
    localStorage.setItem('moneymarketcap_comments', JSON.stringify(updatedComments));

    setComments(updatedComments.filter((c: Comment) => c.postId === post.id));
    setNewCommentAuthor('');
    setNewCommentText('');
  };

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook' | 'copy') => {
    const url = window.location.href;
    const title = post.title;
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(`${title} - ${url}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      return;
    }

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  // Find related articles (same category or general)
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.status === 'published')
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      {/* Back button and breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-brand-ink hover:text-brand-mute font-bold text-sm bg-white border border-brand-ink/10 px-4 py-2 rounded-full shadow-sm hover:scale-102 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="flex items-center gap-2 text-xs text-brand-mute font-semibold uppercase tracking-wider">
          <span>Home</span>
          <span>/</span>
          <span className="text-brand-ink">{post.category}</span>
        </div>
      </div>

      {/* Main header block */}
      <header className="mb-8">
        <span className="inline-block bg-[#ff6a1a] text-white px-3 py-1 text-xs font-black uppercase tracking-wider rounded-[8px] mb-4">
          {post.category}
        </span>
        
        <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-brand-ink leading-tight tracking-tight mb-6">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-ink/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center font-display font-black text-brand-on-primary">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="font-display font-bold text-sm text-brand-ink">{post.author}</p>
              <p className="text-xs text-brand-mute font-medium">Published on {formatDate(post.date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 bg-brand-canvas-soft border border-brand-ink/10 text-brand-ink rounded-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-mute" /> {post.readingTime}
            </span>

            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-full border transition hover:scale-105 ${
                isBookmarked 
                  ? 'bg-brand-primary border-brand-primary text-brand-on-primary' 
                  : 'bg-white border-brand-ink/10 text-brand-ink'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Save article'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Featured image */}
      <div className="relative rounded-[24px] overflow-hidden mb-10 shadow-sm border border-brand-ink/5">
        <img
          src={post.image}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full max-h-[480px] object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800";
          }}
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none font-sans text-brand-ink/90 leading-relaxed space-y-6">
        <p className="font-semibold text-lg md:text-xl text-brand-ink leading-relaxed mb-6">
          {post.excerpt}
        </p>

        {/* Dynamic Monetization Ad Code block (Top Placement) */}
        {post.adsCode && <AdBlock code={post.adsCode} />}

        {/* Clean content rendering */}
        <div 
          className="article-body-content text-base md:text-lg space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Dynamic Monetization Ad Code block (Bottom Placement) */}
        {post.adsCode && <AdBlock code={post.adsCode} />}
      </div>

      {/* Social Sharing block */}
      <div className="mt-12 pt-6 border-t border-brand-ink/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-brand-ink">
          <Share2 className="w-4 h-4" /> Share this article
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleShare('twitter')}
            className="flex items-center gap-2 bg-brand-canvas hover:bg-brand-canvas-soft border border-brand-ink/10 text-brand-ink px-3 py-2 rounded-xl text-xs font-bold transition"
          >
            <Twitter className="w-4 h-4 text-[#1da1f2]" /> Twitter
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="flex items-center gap-2 bg-brand-canvas hover:bg-brand-canvas-soft border border-brand-ink/10 text-brand-ink px-3 py-2 rounded-xl text-xs font-bold transition"
          >
            <Linkedin className="w-4 h-4 text-[#0a66c2]" /> LinkedIn
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="flex items-center gap-2 bg-brand-canvas hover:bg-brand-canvas-soft border border-brand-ink/10 text-brand-ink px-3 py-2 rounded-xl text-xs font-bold transition"
          >
            <Facebook className="w-4 h-4 text-[#1877f2]" /> Facebook
          </button>
          <button
            onClick={() => handleShare('copy')}
            className="bg-brand-primary text-brand-on-primary px-3 py-2 rounded-xl text-xs font-bold hover:bg-brand-primary-active transition"
          >
            {copiedLink ? 'Copied! ✓' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Related Articles section */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 pt-10 border-t border-brand-ink/10">
          <h3 className="font-display font-bold text-xl text-brand-ink mb-6">
            Recommended Reading
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => (
              <div
                key={related.id}
                onClick={() => onReadPost(related.id)}
                className="bg-white rounded-[20px] overflow-hidden border border-brand-ink/5 p-4 shadow-sm hover:shadow-md transition duration-300 cursor-pointer flex flex-col h-full"
              >
                <img
                  src={related.image}
                  alt={related.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover rounded-[12px] mb-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                <span className="text-[10px] text-[#ff6a1a] font-bold uppercase tracking-wider mb-2 block">
                  {related.category}
                </span>
                <h4 className="font-display font-bold text-sm text-brand-ink leading-snug line-clamp-2 mb-2 flex-grow">
                  {related.title}
                </h4>
                <div className="text-[11px] text-brand-mute font-medium flex justify-between items-center mt-2">
                  <span>By {related.author}</span>
                  <span>{related.readingTime}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Comments section */}
      <section className="mt-16 pt-10 border-t border-brand-ink/10">
        <h3 className="font-display font-bold text-xl text-brand-ink mb-6 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> Comments ({comments.length})
        </h3>

        {/* Comment listing */}
        <div className="space-y-4 mb-8">
          {comments.length === 0 ? (
            <p className="text-brand-mute text-sm bg-white rounded-2xl p-6 border border-brand-ink/5 text-center">
              No comments yet. Be the first to join the conversation!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-2xl p-5 border border-brand-ink/5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-primary-pale text-brand-ink-deep font-bold flex items-center justify-center text-xs">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-display font-bold text-sm text-brand-ink">{comment.author}</span>
                  </div>
                  <span className="text-xs text-brand-mute font-medium">
                    {new Date(comment.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-brand-body leading-relaxed">{comment.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Add comment form */}
        <div className="bg-brand-canvas-soft border border-brand-ink/10 rounded-[24px] p-6">
          <h4 className="font-display font-bold text-md text-brand-ink mb-4">Add your comment</h4>
          <form onSubmit={handleAddComment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-mute mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={newCommentAuthor}
                  onChange={(e) => setNewCommentAuthor(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-white text-brand-ink border border-brand-ink/10 text-sm p-3 rounded-xl outline-none focus:border-brand-ink/30 transition-all shadow-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-mute mb-1">Your Message *</label>
              <textarea
                required
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write your constructive thoughts..."
                rows={4}
                className="w-full bg-white text-brand-ink border border-brand-ink/10 text-sm p-3 rounded-xl outline-none focus:border-brand-ink/30 transition-all shadow-sm resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-brand-primary hover:bg-brand-primary-active text-brand-on-primary font-bold px-6 py-2.5 rounded-full text-sm shadow-sm hover:scale-102 transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" /> Submit Comment
            </button>
          </form>
        </div>
      </section>
    </article>
  );
}
