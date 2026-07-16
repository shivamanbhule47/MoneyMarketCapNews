import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Calendar,
  Zap,
  BarChart2,
  Trash2,
  Edit,
  CheckCircle,
  Eye,
  Plus,
  RefreshCw,
  TrendingUp,
  Globe,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Upload,
  Sparkles,
  X
} from 'lucide-react';
import { Post, AMPStory, AMPPage } from '../types';
import {
  slugify,
  generateIndexHtml,
  generateArticleHtml,
  generateAMPStoryHtml,
  generateSitemapXml,
  generateRobotsTxt,
  generateManifest,
  generateSearchJson,
  generateAdminLandingHtml,
  buildAndDownloadZip
} from '../lib/staticGenerator';

interface AdminPanelProps {
  posts: Post[];
  ampStories: AMPStory[];
  onUpdatePosts: (updatedPosts: Post[]) => void;
  onUpdateStories: (updatedStories: AMPStory[]) => void;
  onViewWebsite: () => void;
}

export default function AdminPanel({
  posts,
  ampStories,
  onUpdatePosts,
  onUpdateStories,
  onViewWebsite
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'create' | 'scheduled' | 'amp' | 'analytics' | 'github-pages'>('dashboard');
  const [selectedFile, setSelectedFile] = useState<string>('index.html');
  const [compiling, setCompiling] = useState<boolean>(false);
  
  // Create / Edit form states
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('crypto');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formReadingTime, setFormReadingTime] = useState('5 min read');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPublishDate, setFormPublishDate] = useState('');
  const [formStatus, setFormStatus] = useState<'draft' | 'scheduled' | 'published'>('published');
  const [formAdsCode, setFormAdsCode] = useState('');
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>('');
  const [uploadedImageName, setUploadedImageName] = useState<string>('');
  
  // Notification alert state
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);

  // AMP Story visualizer phone state
  const [selectedStory, setSelectedStory] = useState<AMPStory | null>(null);
  const [activeStoryPage, setActiveStoryPage] = useState<number>(0);

  // Custom Web Story Creator/Editor state
  const [isCreatingCustomStory, setIsCreatingCustomStory] = useState<boolean>(false);
  const [storyFormId, setStoryFormId] = useState<number | null>(null);
  const [storyFormTitle, setStoryFormTitle] = useState('');
  const [storyFormCategory, setStoryFormCategory] = useState('crypto');
  const [storyFormPages, setStoryFormPages] = useState<AMPPage[]>([
    { id: 1, type: 'cover', title: 'Cover Title', subtitle: 'Swipe up or tap to explore', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800' },
    { id: 2, type: 'content', title: 'Fascinating Insight', content: 'Type your deep market insights and data updates right here.', image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800' },
    { id: 3, type: 'cta', title: 'Take Action Now', ctaText: 'Read More', ctaLink: '/', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800' }
  ]);

  // Interactive SEO & Distribution Audit state
  const [auditPost, setAuditPost] = useState<Post | null>(null);
  const [auditKeyword, setAuditKeyword] = useState<string>('');
  const [auditKeywordDensity, setAuditKeywordDensity] = useState<number>(2.4); // percent
  const [auditInternalLinks, setAuditInternalLinks] = useState<number>(3);
  const [auditDwellScore, setAuditDwellScore] = useState<number>(3.2); // minutes read per visitor avg
  const [auditMobileResponsive, setAuditMobileResponsive] = useState<boolean>(true);
  const [auditFreshnessReset, setAuditFreshnessReset] = useState<boolean>(false);

  // Distribution variables
  const [auditClaps, setAuditClaps] = useState<number>(145);
  const [auditResponses, setAuditResponses] = useState<number>(18);
  const [auditShares, setAuditShares] = useState<number>(9);
  const [auditDaysSincePublish, setAuditDaysSincePublish] = useState<number>(2);
  const [auditCohortPhase, setAuditCohortPhase] = useState<number>(1); // 1 = 10% followers, 2 = 25% similar, 3 = full feed

  // Set default publish date to current time
  useEffect(() => {
    if (!formPublishDate) {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      setFormPublishDate(now.toISOString().slice(0, 16));
    }
  }, [formPublishDate]);

  const previewStory: AMPStory | null = isCreatingCustomStory 
    ? {
        id: storyFormId || 9999,
        title: storyFormTitle || 'Untitled Story Preview',
        category: storyFormCategory,
        pages: storyFormPages,
        createdAt: new Date().toISOString()
      }
    : selectedStory;

  const showAlert = (text: string, type: 'success' | 'danger' = 'success') => {
    setAlertMsg({ text, type });
    setTimeout(() => setAlertMsg(null), 3000);
  };

  // Reset fields
  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormTitle('');
    setFormCategory('crypto');
    setFormExcerpt('');
    setFormContent('');
    setFormAuthor('');
    setFormImage('');
    setFormTags('');
    setFormReadingTime('5 min read');
    setFormFeatured(false);
    const now = new Date();
    now.setHours(now.getHours() + 1);
    setFormPublishDate(now.toISOString().slice(0, 16));
    setFormStatus('published');
    setFormAdsCode('');
    setUploadedImageBase64('');
    setUploadedImageName('');
  };

  // Form submit (Save or Edit)
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formAuthor.trim() || !formExcerpt.trim() || !formContent.trim()) {
      showAlert('Please fill in all required fields.', 'danger');
      return;
    }

    const postData = {
      title: formTitle.trim(),
      category: formCategory,
      excerpt: formExcerpt.trim(),
      content: formContent.trim(),
      author: formAuthor.trim(),
      thumbnailName: uploadedImageName || undefined,
      thumbnailBase64: uploadedImageBase64 || undefined,
      thumbnailUrl: formImage.trim() || undefined,
      adsCode: formAdsCode.trim(),
      tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
      readingTime: formReadingTime.trim() || '5 min read',
      featured: formFeatured,
      date: formPublishDate.split('T')[0],
      status: formStatus,
      fileName: isEditing && editId ? posts.find(p => p.id === editId)?.fileName : undefined
    };

    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    })
    .then(async (res) => {
      if (res.ok) {
        const savedPost = await res.json();
        let updatedPosts;
        if (isEditing && editId) {
          updatedPosts = posts.map(p => p.id === editId ? savedPost : p);
          showAlert('Post written and saved physically in server folder!');
        } else {
          updatedPosts = [...posts, savedPost];
          showAlert('Post successfully written to server posts folder!');
        }
        onUpdatePosts(updatedPosts);
        resetForm();
        setActiveTab('posts');
      } else {
        const errorData = await res.json();
        showAlert(errorData.error || 'Failed to save post to folder.', 'danger');
      }
    })
    .catch(err => {
      console.error(err);
      // Local fallback
      const fallbackPost: Post = {
        id: isEditing && editId ? editId : Date.now(),
        title: formTitle.trim(),
        category: formCategory,
        excerpt: formExcerpt.trim(),
        content: formContent.trim(),
        author: formAuthor.trim(),
        image: formImage.trim() || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
        tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
        readingTime: formReadingTime.trim() || '5 min read',
        featured: formFeatured,
        date: formPublishDate.split('T')[0],
        status: formStatus,
        createdAt: new Date().toISOString(),
        adsCode: formAdsCode.trim()
      };
      
      let updatedPosts;
      if (isEditing && editId) {
        updatedPosts = posts.map(p => p.id === editId ? fallbackPost : p);
      } else {
        updatedPosts = [...posts, fallbackPost];
      }
      onUpdatePosts(updatedPosts);
      resetForm();
      setActiveTab('posts');
      showAlert('Post saved locally (offline mode).');
    });
  };

  // Edit action
  const handleEditClick = (post: Post) => {
    setIsEditing(true);
    setEditId(post.id);
    setFormTitle(post.title);
    setFormCategory(post.category);
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormAuthor(post.author);
    setFormImage(post.image);
    setFormTags(post.tags.join(', '));
    setFormReadingTime(post.readingTime);
    setFormFeatured(post.featured);
    setFormPublishDate(post.createdAt ? post.createdAt.slice(0, 16) : new Date().toISOString().slice(0, 16));
    setFormStatus(post.status);
    setFormAdsCode(post.adsCode || '');
    setUploadedImageBase64('');
    setUploadedImageName('');
    setActiveTab('create');
  };

  // Delete action
  const handleDeleteClick = (id: number) => {
    const postToDelete = posts.find(p => p.id === id);
    if (!postToDelete) return;

    if (window.confirm(`Are you sure you want to permanently delete the physical file "${postToDelete.fileName || postToDelete.title}" from the server posts directory?`)) {
      if (postToDelete.fileName) {
        fetch(`/api/posts/${encodeURIComponent(postToDelete.fileName)}`, {
          method: 'DELETE'
        })
        .then(res => {
          if (res.ok) {
            const updated = posts.filter(p => p.id !== id);
            onUpdatePosts(updated);
            showAlert('Physical post file deleted from server posts directory.');
          } else {
            showAlert('Failed to delete physical post file from server.', 'danger');
          }
        })
        .catch(err => {
          console.error(err);
          // Fallback delete locally
          const updated = posts.filter(p => p.id !== id);
          onUpdatePosts(updated);
          showAlert('Post deleted locally.');
        });
      } else {
        // Just local deletion
        const updated = posts.filter(p => p.id !== id);
        onUpdatePosts(updated);
        showAlert('Post deleted successfully!');
      }
    }
  };

  // Force publish scheduled post
  const handlePublishNow = (id: number) => {
    const updated = posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'published' as const,
          date: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    });
    onUpdatePosts(updated);
    showAlert('Post published immediately!');
  };

  const handleOpenSEOAudit = (post: Post) => {
    setAuditPost(post);
    // Extract primary keyword based on title & category
    const keywords = ['bitcoin', 'crypto', 'stocks', 'sec', 'fed', 'inflation', 'treasury', 'ethereum', 'trading', 'liquidity', 'gold', 'recession', 'bull market', 'bear market', 'etf', 'halving', 'altcoin'];
    const titleLower = post.title.toLowerCase();
    const foundKeyword = keywords.find(k => titleLower.includes(k)) || post.title.split(' ').slice(0, 2).join(' ').replace(/[^a-zA-Z ]/g, "");
    
    setAuditKeyword((foundKeyword || 'Market').toUpperCase());
    
    // Deterministic base stats based on post ID
    const baseDensity = 1.6 + ((post.id % 12) / 10); // 1.6% to 2.8%
    const baseLinks = (post.id % 4) + 2; // 2 to 5
    const baseDwell = 2.1 + ((post.content.length % 150) / 40); // 2.1 to 5.8 mins
    const baseClaps = 80 + (post.id % 320);
    const baseResponses = 6 + (post.id % 30);
    const baseShares = 3 + (post.id % 15);
    const baseDays = 1 + (post.id % 7);

    setAuditKeywordDensity(parseFloat(baseDensity.toFixed(1)));
    setAuditInternalLinks(baseLinks);
    setAuditDwellScore(parseFloat(baseDwell.toFixed(1)));
    setAuditMobileResponsive(true);
    setAuditFreshnessReset(false);
    
    setAuditClaps(baseClaps);
    setAuditResponses(baseResponses);
    setAuditShares(baseShares);
    setAuditDaysSincePublish(baseDays);
    
    const totalEng = (baseClaps * 1.5) + (baseResponses * 2.5) + (baseShares * 3.0);
    if (totalEng > 350) {
      setAuditCohortPhase(3);
    } else if (totalEng > 120) {
      setAuditCohortPhase(2);
    } else {
      setAuditCohortPhase(1);
    }
  };

  // Generate AMP Story automatically
  const handleCreateAMPStory = (post: Post) => {
    const newStory: AMPStory = {
      id: Date.now(),
      title: post.title,
      category: post.category,
      pages: [
        {
          id: 1,
          type: 'cover',
          title: post.title,
          subtitle: post.excerpt,
          image: post.image
        },
        {
          id: 2,
          type: 'content',
          title: "Market Deep Dive",
          content: post.excerpt,
          image: post.image
        },
        {
          id: 3,
          type: 'cta',
          title: "Get Full Live Report",
          ctaText: "Read Article",
          ctaLink: "/"
        }
      ],
      createdAt: new Date().toISOString()
    };

    const updated = [...ampStories, newStory];
    onUpdateStories(updated);
    setSelectedStory(newStory);
    setActiveStoryPage(0);
    showAlert('AMP Web Story auto-generated successfully!');
    setActiveTab('amp');
  };

  // Delete AMP Story
  const handleDeleteAMPStory = (id: number) => {
    if (window.confirm('Delete this AMP Web Story?')) {
      const updated = ampStories.filter(s => s.id !== id);
      onUpdateStories(updated);
      if (selectedStory?.id === id) {
        setSelectedStory(null);
      }
      showAlert('AMP Web Story deleted.');
    }
  };

  // Manual interactive story creation/editing handlers
  const handleStartCreateCustomStory = () => {
    setIsCreatingCustomStory(true);
    setStoryFormId(null);
    setStoryFormTitle('');
    setStoryFormCategory('crypto');
    setStoryFormPages([
      { id: 1, type: 'cover', title: 'New Story Title', subtitle: 'Swipe up or tap to explore', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800' },
      { id: 2, type: 'content', title: 'Fascinating Insight', content: 'Type your deep market insights and data updates right here.', image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800' },
      { id: 3, type: 'cta', title: 'Take Action Now', ctaText: 'Read More', ctaLink: '/', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800' }
    ]);
    setActiveStoryPage(0);
  };

  const handleStartEditCustomStory = (story: AMPStory) => {
    setIsCreatingCustomStory(true);
    setStoryFormId(story.id);
    setStoryFormTitle(story.title);
    setStoryFormCategory(story.category);
    setStoryFormPages(story.pages);
    setActiveStoryPage(0);
  };

  const handleSaveCustomStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyFormTitle.trim()) {
      showAlert('Please enter a story title', 'danger');
      return;
    }

    const storyData: AMPStory = {
      id: storyFormId ? storyFormId : Date.now(),
      title: storyFormTitle.trim(),
      category: storyFormCategory,
      pages: storyFormPages,
      createdAt: new Date().toISOString()
    };

    let updatedStories;
    if (storyFormId) {
      updatedStories = ampStories.map(s => s.id === storyFormId ? storyData : s);
      showAlert('Web Story updated successfully!');
    } else {
      updatedStories = [...ampStories, storyData];
      showAlert('Web Story created successfully!');
    }

    onUpdateStories(updatedStories);
    setIsCreatingCustomStory(false);
    setSelectedStory(storyData);
    setActiveStoryPage(0);
  };

  const getCompiledFileContent = (path: string): string => {
    switch (path) {
      case 'index.html':
        return generateIndexHtml(posts);
      case 'data/posts.json':
        return JSON.stringify(posts, null, 2);
      case 'data/categories.json':
        return JSON.stringify(['all', 'crypto', 'stocks', 'forex', 'economy', 'tech'], null, 2);
      case 'data/search.json':
        return generateSearchJson(posts);
      case 'sitemap.xml':
        return generateSitemapXml(posts, ampStories);
      case 'robots.txt':
        return generateRobotsTxt();
      case 'manifest.webmanifest':
        return generateManifest();
      case 'admin/index.html':
        return generateAdminLandingHtml();
      default:
        if (path.startsWith('posts/')) {
          const slug = path.split('/')[1];
          const post = posts.find(p => slugify(p.title) === slug);
          if (post) return generateArticleHtml(post, posts);
        }
        if (path.startsWith('stories/')) {
          const slug = path.split('/')[1];
          const story = ampStories.find(s => slugify(s.title) === slug);
          if (story) return generateAMPStoryHtml(story);
        }
        return '/* Binary Asset or Folder Structure */';
    }
  };

  // Counting stats
  const totalPosts = posts.length;
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* CMS Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-ink/10 pb-6 mb-8">
        <div>
          <span className="text-xs bg-brand-ink text-brand-primary px-3 py-1 font-bold rounded-full uppercase tracking-widest">
            CONTROL CENTER
          </span>
          <h1 className="font-display font-black text-3xl text-brand-ink mt-2">
            MoneyMarketCap CMS
          </h1>
        </div>

        <button
          onClick={onViewWebsite}
          className="bg-brand-primary hover:bg-brand-primary-active text-brand-on-primary font-bold px-6 py-2.5 rounded-full text-sm shadow-sm transition hover:scale-102 flex items-center gap-2 cursor-pointer"
        >
          <Eye className="w-4 h-4" /> View Live Website
        </button>
      </div>

      {/* Alert toast notifications */}
      {alertMsg && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-lg border text-sm font-bold animate-bounce flex items-center gap-2 ${
            alertMsg.type === 'success'
              ? 'bg-brand-primary-pale text-brand-ink-deep border-brand-primary/20'
              : 'bg-brand-negative/10 text-brand-negative border-brand-negative/20'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          {alertMsg.text}
        </div>
      )}

      {/* Workspace Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <nav className="lg:col-span-3 space-y-2 bg-white p-5 rounded-[24px] border border-brand-ink/5 shadow-sm h-fit">
          <p className="text-xs text-brand-mute font-bold tracking-wider px-3 mb-3 uppercase">
            Menu Panels
          </p>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'dashboard'
                ? 'bg-brand-primary text-brand-on-primary'
                : 'text-brand-ink hover:bg-brand-canvas-soft'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'posts'
                ? 'bg-brand-primary text-brand-on-primary'
                : 'text-brand-ink hover:bg-brand-canvas-soft'
            }`}
          >
            <FileText className="w-4 h-4" /> All Posts
          </button>

          <button
            onClick={() => {
              resetForm();
              setActiveTab('create');
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'create'
                ? 'bg-brand-primary text-brand-on-primary'
                : 'text-brand-ink hover:bg-brand-canvas-soft'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> {isEditing ? 'Edit Post' : 'Create Post'}
          </button>

          <button
            onClick={() => setActiveTab('scheduled')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'scheduled'
                ? 'bg-brand-primary text-brand-on-primary'
                : 'text-brand-ink hover:bg-brand-canvas-soft'
            }`}
          >
            <Calendar className="w-4 h-4" /> Scheduled ({scheduledCount})
          </button>

          <button
            onClick={() => setActiveTab('amp')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'amp'
                ? 'bg-brand-primary text-brand-on-primary'
                : 'text-brand-ink hover:bg-brand-canvas-soft'
            }`}
          >
            <Zap className="w-4 h-4" /> AMP Web Stories
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'analytics'
                ? 'bg-brand-primary text-brand-on-primary'
                : 'text-brand-ink hover:bg-brand-canvas-soft'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Analytics Heatmap
          </button>

          <button
            onClick={() => setActiveTab('github-pages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'github-pages'
                ? 'bg-brand-primary text-brand-on-primary'
                : 'text-brand-ink hover:bg-brand-canvas-soft'
            }`}
          >
            <Globe className="w-4 h-4" /> GitHub Pages Exporter
          </button>
        </nav>

        {/* Content Panel Area */}
        <main className="lg:col-span-9 bg-white rounded-[24px] border border-brand-ink/5 p-6 shadow-sm min-h-[500px]">
          
          {/* 1. DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="font-display font-bold text-xl text-brand-ink">
                  Publishing Overview
                </h2>
                <span className="text-xs text-brand-mute font-bold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin text-brand-primary" /> Auto-sync active
                </span>
              </div>

              {/* Counter grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-brand-canvas-soft p-5 rounded-[20px] border border-brand-ink/5 flex flex-col justify-between">
                  <span className="text-xs font-bold text-brand-mute uppercase tracking-wider">
                    Total Articles
                  </span>
                  <span className="text-4xl font-display font-black text-brand-ink mt-2">
                    {totalPosts}
                  </span>
                </div>

                <div className="bg-brand-primary-pale p-5 rounded-[20px] border border-brand-ink/5 flex flex-col justify-between">
                  <span className="text-xs font-bold text-brand-ink-deep uppercase tracking-wider">
                    Published
                  </span>
                  <span className="text-4xl font-display font-black text-brand-ink mt-2">
                    {publishedCount}
                  </span>
                </div>

                <div className="bg-orange-50 p-5 rounded-[20px] border border-brand-ink/5 flex flex-col justify-between">
                  <span className="text-xs font-bold text-orange-900/60 uppercase tracking-wider">
                    Scheduled
                  </span>
                  <span className="text-4xl font-display font-black text-brand-ink mt-2">
                    {scheduledCount}
                  </span>
                </div>

                <div className="bg-gray-100 p-5 rounded-[20px] border border-brand-ink/5 flex flex-col justify-between">
                  <span className="text-xs font-bold text-brand-mute uppercase tracking-wider">
                    Drafts
                  </span>
                  <span className="text-4xl font-display font-black text-brand-ink mt-2">
                    {draftCount}
                  </span>
                </div>
              </div>

              {/* Quick actions or hints */}
              <div className="bg-brand-primary-pale p-6 rounded-[20px] border border-brand-primary/10 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-brand-ink-deep text-md flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#ff6a1a] fill-[#ff6a1a]/20" /> Instant AMP Web Stories Creator
                  </h4>
                  <p className="text-xs text-brand-body leading-relaxed max-w-xl">
                    You can automatically generate visual, mobile-first Google AMP Web Stories straight from your written articles with a single click. Boost your organic SEO index rating instantly!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('posts')}
                  className="bg-brand-ink text-brand-primary hover:bg-brand-ink/90 font-bold px-4 py-2 rounded-xl text-xs flex-shrink-0 cursor-pointer"
                >
                  Generate story now
                </button>
              </div>

              {/* Recent Articles preview list */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-md text-brand-ink">
                  Recently Saved Items
                </h3>
                <div className="divide-y divide-brand-ink/5 border border-brand-ink/5 rounded-2xl overflow-hidden bg-white">
                  {posts.slice(0, 4).map((post) => (
                    <div key={post.id} className="p-4 flex items-center justify-between hover:bg-brand-canvas-soft/40 transition">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800";
                          }}
                        />
                        <div>
                          <p className="font-bold text-sm text-brand-ink line-clamp-1">{post.title}</p>
                          <p className="text-xs text-brand-mute">By {post.author} • {post.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          post.status === 'published'
                            ? 'bg-brand-primary-pale text-brand-ink-deep'
                            : post.status === 'scheduled'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenSEOAudit(post)}
                            className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
                            title="Medium Algorithmic SEO & Distribution Audit"
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditClick(post)}
                            className="p-1 text-brand-mute hover:text-brand-ink hover:bg-brand-canvas-soft rounded transition"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(post.id)}
                            className="p-1 text-brand-mute hover:text-brand-negative hover:bg-brand-negative/5 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. ALL POSTS TAB */}
          {activeTab === 'posts' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-display font-bold text-xl text-brand-ink">
                  Article Repository
                </h2>
                <button
                  onClick={() => {
                    resetForm();
                    setActiveTab('create');
                  }}
                  className="bg-brand-primary hover:bg-brand-primary-active text-brand-on-primary font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Article
                </button>
              </div>

              {/* Table wrapper */}
              <div className="overflow-x-auto border border-brand-ink/5 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-canvas-soft/60 border-b border-brand-ink/5">
                      <th className="p-4 text-xs font-bold text-brand-mute uppercase">Title</th>
                      <th className="p-4 text-xs font-bold text-brand-mute uppercase">Category</th>
                      <th className="p-4 text-xs font-bold text-brand-mute uppercase">Author</th>
                      <th className="p-4 text-xs font-bold text-brand-mute uppercase">Publish Date</th>
                      <th className="p-4 text-xs font-bold text-brand-mute uppercase">Status</th>
                      <th className="p-4 text-xs font-bold text-brand-mute uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-ink/5 text-sm">
                    {posts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-brand-mute">
                          No articles found. Write your first post!
                        </td>
                      </tr>
                    ) : (
                      posts.map((post) => (
                        <tr key={post.id} className="hover:bg-brand-canvas-soft/30 transition">
                          <td className="p-4 max-w-xs md:max-w-sm">
                            <div className="flex items-center gap-3">
                              <img
                                src={post.image}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800";
                                }}
                              />
                              <div>
                                <p className="font-bold text-brand-ink line-clamp-1">{post.title}</p>
                                <p className="text-[11px] text-brand-mute line-clamp-1">{post.excerpt}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-brand-ink uppercase text-xs tracking-wider">
                            {post.category}
                          </td>
                          <td className="p-4 font-semibold text-brand-ink">{post.author}</td>
                          <td className="p-4 text-xs text-brand-mute font-medium">{post.date}</td>
                          <td className="p-4">
                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                              post.status === 'published'
                                ? 'bg-brand-primary-pale text-brand-ink-deep'
                                : post.status === 'scheduled'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Option to create AMP Story */}
                              <button
                                onClick={() => handleCreateAMPStory(post)}
                                className="bg-brand-primary-pale hover:bg-brand-primary-neutral text-brand-ink-deep font-bold px-2 py-1 rounded-lg text-[10px] uppercase flex items-center gap-0.5"
                                title="Generate AMP Web Story"
                              >
                                <Zap className="w-3 h-3" /> AMP
                              </button>
                              <button
                                onClick={() => handleOpenSEOAudit(post)}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg text-[10px] uppercase flex items-center gap-0.5 border border-emerald-200/40"
                                title="Medium Algorithmic SEO & Distribution Audit"
                              >
                                <BarChart2 className="w-3 h-3" /> SEO Audit
                              </button>
                              <button
                                onClick={() => handleEditClick(post)}
                                className="p-1.5 text-brand-mute hover:text-brand-ink hover:bg-brand-canvas-soft rounded-lg transition"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(post.id)}
                                className="p-1.5 text-brand-mute hover:text-brand-negative hover:bg-brand-negative/5 rounded-lg transition"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. CREATE / EDIT POST TAB */}
          {activeTab === 'create' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-display font-bold text-xl text-brand-ink">
                {isEditing ? 'Edit Written Article' : 'Write Fresh Financial News'}
              </h2>

              <form onSubmit={handleSavePost} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-8 space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-xs font-bold text-brand-mute mb-1 uppercase tracking-wider">
                        Article Headline *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Bitcoin Crosses New Resistance Threshold"
                        className="w-full bg-white text-brand-ink border border-brand-ink/15 text-sm p-3.5 rounded-xl outline-none focus:border-brand-ink/30 transition-all shadow-sm"
                      />
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="block text-xs font-bold text-brand-mute mb-1 uppercase tracking-wider">
                        One-Sentence Excerpt / Hook *
                      </label>
                      <input
                        type="text"
                        required
                        value={formExcerpt}
                        onChange={(e) => setFormExcerpt(e.target.value)}
                        placeholder="A concise summary designed to capture reader attention instantly."
                        className="w-full bg-white text-brand-ink border border-brand-ink/15 text-sm p-3.5 rounded-xl outline-none focus:border-brand-ink/30 transition-all shadow-sm"
                      />
                    </div>

                    {/* Full Content */}
                    <div>
                      <label className="block text-xs font-bold text-brand-mute mb-1 uppercase tracking-wider">
                        Detailed Article Content (HTML tags supported) *
                      </label>
                      <textarea
                        required
                        rows={12}
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        placeholder="<h2>Sub-heading</h2><p>Your detailed financial analysis paragraph goes here...</p> <blockquote>Quote of interest</blockquote>"
                        className="w-full bg-white text-brand-ink font-mono border border-brand-ink/15 text-sm p-4 rounded-xl outline-none focus:border-brand-ink/30 transition-all shadow-sm"
                      />
                    </div>

                    {/* Ads Code / Monetization Block */}
                    <div className="pt-2">
                      <label className="block text-xs font-black text-[#ff6a1a] mb-1.5 uppercase tracking-wider flex items-center gap-1">
                        💵 Monetization Ads Code (e.g. Google AdSense or Banners)
                      </label>
                      <textarea
                        rows={5}
                        value={formAdsCode}
                        onChange={(e) => setFormAdsCode(e.target.value)}
                        placeholder="e.g. <div class='my-adsense-container'><ins class='adsbygoogle' ...></ins></div>"
                        className="w-full bg-white text-brand-ink font-mono border border-[#ff6a1a]/30 focus:border-[#ff6a1a] text-xs p-3.5 rounded-xl outline-none transition-all shadow-sm"
                      />
                      <p className="text-[10px] text-brand-mute mt-1 leading-relaxed font-semibold">
                        Pasted HTML or ad network script code will automatically execute and render at the top and bottom of the published article.
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-4 bg-brand-canvas-soft/40 p-5 rounded-2xl border border-brand-ink/5">
                    {/* Category */}
                    <div>
                      <label className="block text-xs font-bold text-brand-mute mb-1 uppercase tracking-wider">
                        Category *
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full bg-white text-brand-ink border border-brand-ink/15 text-sm p-3 rounded-xl outline-none cursor-pointer shadow-sm"
                      >
                        <option value="crypto">Cryptocurrency</option>
                        <option value="stocks">Stocks</option>
                        <option value="forex">Forex</option>
                        <option value="economy">Economy</option>
                        <option value="tech">Technology</option>
                      </select>
                    </div>

                    {/* Author */}
                    <div>
                      <label className="block text-xs font-bold text-brand-mute mb-1 uppercase tracking-wider">
                        Author Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white text-brand-ink border border-brand-ink/15 text-sm p-3 rounded-xl outline-none focus:border-brand-ink/30 transition shadow-sm"
                      />
                    </div>

                    {/* Custom .PNG Thumbnail File Uploader */}
                    <div>
                      <label className="block text-xs font-bold text-brand-mute mb-1.5 uppercase tracking-wider">
                        Custom PNG Thumbnail Upload
                      </label>
                      <div className="border border-dashed border-brand-ink/15 hover:border-[#ff6a1a]/50 rounded-xl p-3 bg-white flex flex-col items-center justify-center text-center cursor-pointer transition relative group min-h-[100px]">
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const name = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                              setUploadedImageName(name);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setUploadedImageBase64(reader.result as string);
                                setFormImage(`/api/posts/assets/${name}`);
                                showAlert(`PNG Thumbnail "${name}" loaded and ready!`);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        />
                        {uploadedImageBase64 ? (
                          <div className="space-y-1.5">
                            <img src={uploadedImageBase64} alt="Thumbnail preview" className="h-16 mx-auto object-cover rounded-lg border border-brand-ink/10" />
                            <span className="text-[9px] font-bold text-brand-ink block truncate max-w-[150px]">{uploadedImageName}</span>
                            <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">Image Loaded ✓</span>
                          </div>
                        ) : (
                          <div className="space-y-1 py-1">
                            <Upload className="w-5 h-5 mx-auto text-brand-mute group-hover:text-[#ff6a1a] transition" />
                            <p className="text-[10px] font-bold text-brand-ink group-hover:text-[#ff6a1a] transition">Choose custom PNG file</p>
                            <span className="text-[8px] text-brand-mute block">Drop your .png file here</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image URL with presets */}
                    <div>
                      <label className="block text-xs font-bold text-brand-mute mb-1 uppercase tracking-wider">
                        Feature Image URL / Path
                      </label>
                      <input
                        type="text"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-white text-brand-ink border border-brand-ink/15 text-xs p-3 rounded-xl outline-none focus:border-brand-ink/30 transition shadow-sm mb-2"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-brand-mute block">Quick Stock Presets:</span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => setFormImage('https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800')}
                            className="text-[9px] bg-white border border-brand-ink/10 px-1.5 py-0.5 rounded text-brand-ink font-semibold"
                          >
                            Crypto
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormImage('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800')}
                            className="text-[9px] bg-white border border-brand-ink/10 px-1.5 py-0.5 rounded text-brand-ink font-semibold"
                          >
                            Stocks
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormImage('https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800')}
                            className="text-[9px] bg-white border border-brand-ink/10 px-1.5 py-0.5 rounded text-brand-ink font-semibold"
                          >
                            Economy
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormImage('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800')}
                            className="text-[9px] bg-white border border-brand-ink/10 px-1.5 py-0.5 rounded text-brand-ink font-semibold"
                          >
                            Tech
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-xs font-bold text-brand-mute mb-1 uppercase tracking-wider">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        placeholder="Finance, Market, Trend"
                        className="w-full bg-white text-brand-ink border border-brand-ink/15 text-sm p-3 rounded-xl outline-none focus:border-brand-ink/30 transition shadow-sm"
                      />
                    </div>

                    {/* Reading Time */}
                    <div>
                      <label className="block text-xs font-bold text-brand-mute mb-1 uppercase tracking-wider">
                        Estimated Reading Time
                      </label>
                      <input
                        type="text"
                        value={formReadingTime}
                        onChange={(e) => setFormReadingTime(e.target.value)}
                        placeholder="5 min read"
                        className="w-full bg-white text-brand-ink border border-brand-ink/15 text-sm p-3 rounded-xl outline-none focus:border-brand-ink/30 transition shadow-sm"
                      />
                    </div>

                    {/* Status & Timing */}
                    <div>
                      <label className="block text-xs font-bold text-brand-mute mb-1 uppercase tracking-wider">
                        Save Status
                      </label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as any)}
                        className="w-full bg-white text-brand-ink border border-brand-ink/15 text-sm p-3 rounded-xl outline-none cursor-pointer shadow-sm mb-3"
                      >
                        <option value="published">Published</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>

                    {/* Date picker */}
                    <div>
                      <label className="block text-xs font-bold text-brand-mute mb-1 uppercase tracking-wider">
                        Release Date/Time
                      </label>
                      <input
                        type="datetime-local"
                        value={formPublishDate}
                        onChange={(e) => setFormPublishDate(e.target.value)}
                        className="w-full bg-white text-brand-ink border border-brand-ink/15 text-xs p-3 rounded-xl outline-none cursor-pointer shadow-sm"
                      />
                    </div>

                    {/* Featured check */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="featuredPost"
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        className="w-4 h-4 rounded border-brand-ink/15 accent-brand-primary"
                      />
                      <label htmlFor="featuredPost" className="text-xs font-bold text-brand-ink select-none cursor-pointer">
                        Mark as Featured Article
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-brand-ink/10">
                  <button
                    type="submit"
                    className="bg-brand-primary hover:bg-brand-primary-active text-brand-on-primary font-bold px-6 py-3 rounded-full text-sm shadow-sm transition hover:scale-102 cursor-pointer"
                  >
                    {isEditing ? 'Save Edits' : 'Publish Article'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab('posts');
                    }}
                    className="bg-brand-canvas-soft text-brand-ink hover:bg-brand-canvas-soft/80 font-bold px-6 py-3 rounded-full text-sm transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. SCHEDULED POSTS TAB */}
          {activeTab === 'scheduled' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-display font-bold text-xl text-brand-ink">
                Scheduled Articles
              </h2>

              <div className="overflow-x-auto border border-brand-ink/5 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-canvas-soft/60 border-b border-brand-ink/5">
                      <th className="p-4 text-xs font-bold text-brand-mute uppercase">Article</th>
                      <th className="p-4 text-xs font-bold text-brand-mute uppercase">Category</th>
                      <th className="p-4 text-xs font-bold text-brand-mute uppercase">Scheduled Timing</th>
                      <th className="p-4 text-xs font-bold text-brand-mute uppercase">Auto-Publish</th>
                      <th className="p-4 text-xs font-bold text-brand-mute uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-ink/5 text-sm">
                    {posts.filter(p => p.status === 'scheduled').length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-brand-mute">
                          No scheduled posts currently active.
                        </td>
                      </tr>
                    ) : (
                      posts.filter(p => p.status === 'scheduled').map((post) => (
                        <tr key={post.id} className="hover:bg-brand-canvas-soft/30 transition">
                          <td className="p-4">
                            <span className="font-bold text-brand-ink block">{post.title}</span>
                            <span className="text-[11px] text-brand-mute">By {post.author}</span>
                          </td>
                          <td className="p-4 text-xs uppercase font-semibold text-brand-ink">{post.category}</td>
                          <td className="p-4 text-xs text-brand-mute font-bold">{post.createdAt || post.date}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 text-xs text-brand-positive font-bold">
                              <span className="w-2 h-2 rounded-full bg-brand-positive animate-ping" /> Yes
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handlePublishNow(post.id)}
                                className="bg-brand-primary hover:bg-brand-primary-active text-brand-on-primary text-xs font-bold px-3 py-1.5 rounded-xl transition"
                              >
                                Publish Now
                              </button>
                              <button
                                onClick={() => handleEditClick(post)}
                                className="p-1 text-brand-mute hover:text-brand-ink transition"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. AMP WEB STORIES TAB WITH HANDS-ON SMARTPHONE VISUAL PREVIEW */}
          {activeTab === 'amp' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Story list / Custom Story Form */}
                <div className="md:col-span-7 space-y-6">
                  {isCreatingCustomStory ? (
                    <form onSubmit={handleSaveCustomStory} className="space-y-5 bg-white p-6 rounded-3xl border border-brand-ink/5 shadow-xs animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-brand-ink/5 pb-3">
                        <h3 className="font-display font-black text-sm text-brand-ink">
                          {storyFormId ? 'Edit Web Story' : 'Create Custom Web Story'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsCreatingCustomStory(false)}
                          className="text-xs text-brand-mute hover:text-brand-ink font-bold"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Title and Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-brand-ink uppercase tracking-wider">Story Title</label>
                            <input
                              type="text"
                              value={storyFormTitle}
                              onChange={(e) => setStoryFormTitle(e.target.value)}
                              placeholder="e.g. Bitcoin Crosses $100K"
                              required
                              className="w-full bg-brand-canvas-soft border border-brand-ink/10 rounded-xl px-3.5 py-2 text-xs font-semibold text-brand-ink outline-none focus:border-[#ff6a1a] focus:ring-1 focus:ring-[#ff6a1a]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-brand-ink uppercase tracking-wider">Category</label>
                            <select
                              value={storyFormCategory}
                              onChange={(e) => setStoryFormCategory(e.target.value)}
                              className="w-full bg-brand-canvas-soft border border-brand-ink/10 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-brand-ink outline-none focus:border-[#ff6a1a]"
                            >
                              <option value="crypto">Cryptocurrency</option>
                              <option value="stocks">Stock Market</option>
                              <option value="forex">Foreign Exchange</option>
                              <option value="economy">Economics</option>
                              <option value="tech">Technology</option>
                            </select>
                          </div>
                        </div>

                        {/* Slide Pages editor */}
                        <div className="space-y-3 pt-2 border-t border-brand-ink/5">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-brand-ink uppercase tracking-wider">Pages ({storyFormPages.length})</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newPageId = Date.now();
                                setStoryFormPages([...storyFormPages, {
                                  id: newPageId,
                                  type: 'content',
                                  title: 'New Page Caption',
                                  content: 'Add your insight and commentary here...',
                                  image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800'
                                }]);
                              }}
                              className="text-[10px] text-[#ff6a1a] font-black hover:underline"
                            >
                              + Add Page
                            </button>
                          </div>

                          <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                            {storyFormPages.map((page, idx) => (
                              <div key={page.id} className="p-4 bg-brand-canvas-soft rounded-2xl border border-brand-ink/5 space-y-3 relative">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-black text-[#ff6a1a] uppercase tracking-wider">Slide {idx + 1}</span>
                                  {storyFormPages.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => setStoryFormPages(storyFormPages.filter(p => p.id !== page.id))}
                                      className="text-[9px] text-brand-negative font-bold hover:underline"
                                    >
                                      Delete Slide
                                    </button>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-brand-mute uppercase">Slide Type</label>
                                    <select
                                      value={page.type}
                                      onChange={(e) => {
                                        const updated = storyFormPages.map(p => p.id === page.id ? { ...p, type: e.target.value as any } : p);
                                        setStoryFormPages(updated);
                                      }}
                                      className="w-full bg-white border border-brand-ink/10 rounded-lg px-2 py-1 text-[11px]"
                                    >
                                      <option value="cover">Cover (Title + Sub)</option>
                                      <option value="content">Content (Rich Text)</option>
                                      <option value="cta">CTA (Call-to-Action)</option>
                                    </select>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-brand-mute uppercase">Title / Caption</label>
                                    <input
                                      type="text"
                                      value={page.title}
                                      onChange={(e) => {
                                        const updated = storyFormPages.map(p => p.id === page.id ? { ...p, title: e.target.value } : p);
                                        setStoryFormPages(updated);
                                      }}
                                      placeholder="Slide caption"
                                      className="w-full bg-white border border-brand-ink/10 rounded-lg px-2 py-1 text-[11px]"
                                    />
                                  </div>
                                </div>

                                {page.type === 'cover' && (
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-brand-mute uppercase">Subtitle Description</label>
                                    <input
                                      type="text"
                                      value={page.subtitle || ''}
                                      onChange={(e) => {
                                        const updated = storyFormPages.map(p => p.id === page.id ? { ...p, subtitle: e.target.value } : p);
                                        setStoryFormPages(updated);
                                      }}
                                      placeholder="Secondary visual caption..."
                                      className="w-full bg-white border border-brand-ink/10 rounded-lg px-2 py-1 text-[11px]"
                                    />
                                  </div>
                                )}

                                {page.type === 'content' && (
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-brand-mute uppercase">Slide Content Paragraph</label>
                                    <textarea
                                      value={page.content || ''}
                                      onChange={(e) => {
                                        const updated = storyFormPages.map(p => p.id === page.id ? { ...p, content: e.target.value } : p);
                                        setStoryFormPages(updated);
                                      }}
                                      placeholder="Commentary on details..."
                                      rows={2}
                                      className="w-full bg-white border border-brand-ink/10 rounded-lg px-2 py-1 text-[11px] resize-none"
                                    />
                                  </div>
                                )}

                                {page.type === 'cta' && (
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-brand-mute uppercase">Button Text</label>
                                      <input
                                        type="text"
                                        value={page.ctaText || ''}
                                        onChange={(e) => {
                                          const updated = storyFormPages.map(p => p.id === page.id ? { ...p, ctaText: e.target.value } : p);
                                          setStoryFormPages(updated);
                                        }}
                                        placeholder="Read Article"
                                        className="w-full bg-white border border-brand-ink/10 rounded-lg px-2 py-1 text-[11px]"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-brand-mute uppercase">Link Redirect</label>
                                      <input
                                        type="text"
                                        value={page.ctaLink || ''}
                                        onChange={(e) => {
                                          const updated = storyFormPages.map(p => p.id === page.id ? { ...p, ctaLink: e.target.value } : p);
                                          setStoryFormPages(updated);
                                        }}
                                        placeholder="/posts/..."
                                        className="w-full bg-white border border-brand-ink/10 rounded-lg px-2 py-1 text-[11px]"
                                      />
                                    </div>
                                  </div>
                                )}

                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-brand-mute uppercase">Background Image URL</label>
                                  <input
                                    type="text"
                                    value={page.image || ''}
                                    onChange={(e) => {
                                      const updated = storyFormPages.map(p => p.id === page.id ? { ...p, image: e.target.value } : p);
                                      setStoryFormPages(updated);
                                    }}
                                    placeholder="Unsplash / standard image link"
                                    className="w-full bg-white border border-brand-ink/10 rounded-lg px-2 py-1 text-[11px]"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-[#ff6a1a] hover:bg-[#e05912] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex-grow cursor-pointer animate-pulse"
                        >
                          {storyFormId ? 'Save Updates' : 'Publish Story'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCreatingCustomStory(false)}
                          className="bg-brand-canvas hover:bg-brand-canvas-soft border border-brand-ink/10 text-brand-ink font-bold py-2.5 px-4 rounded-xl text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div>
                        <h2 className="font-display font-bold text-xl text-brand-ink">
                          AMP Web Stories Dashboard
                        </h2>
                        <p className="text-xs text-brand-mute leading-relaxed mt-1">
                          Visual, swipeable mobile story slides designed for near-instant indexing in Google Search carousel highlights.
                        </p>
                      </div>

                      <div className="bg-brand-canvas-soft p-5 rounded-[20px] border border-brand-ink/5 space-y-3">
                        <h3 className="font-display font-bold text-sm text-[#ff6a1a] flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-[#ff6a1a]" /> Bespoke Story Creator
                        </h3>
                        <p className="text-xs text-brand-body leading-relaxed">
                          You can generate stories automatically from any article in <strong>All Posts</strong>, or construct high-quality, bespoke story slides page-by-page right now!
                        </p>
                        <button
                          onClick={handleStartCreateCustomStory}
                          className="bg-[#ff6a1a] hover:bg-[#e05912] text-white text-xs font-black px-4 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Craft Web Story
                        </button>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-display font-bold text-sm text-brand-ink">
                          Active Web Stories ({ampStories.length})
                        </h3>
                        <div className="divide-y divide-brand-ink/5 border border-brand-ink/5 rounded-2xl overflow-hidden bg-white">
                          {ampStories.map((story) => (
                            <div
                              key={story.id}
                              className={`p-4 flex items-center justify-between hover:bg-brand-canvas-soft/30 transition cursor-pointer ${
                                selectedStory?.id === story.id ? 'bg-brand-primary-pale/40' : ''
                              }`}
                              onClick={() => {
                                setSelectedStory(story);
                                setActiveStoryPage(0);
                              }}
                            >
                              <div>
                                <p className="font-bold text-sm text-brand-ink line-clamp-1">{story.title}</p>
                                <p className="text-[10px] text-brand-mute font-bold uppercase mt-0.5">
                                  {story.pages.length} Slides • Category: {story.category}
                                </p>
                              </div>

                              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => handleStartEditCustomStory(story)}
                                  className="p-1.5 text-brand-mute hover:text-[#ff6a1a] transition"
                                  title="Edit Story Slides"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedStory(story);
                                    setActiveStoryPage(0);
                                  }}
                                  className="bg-brand-primary text-brand-on-primary hover:bg-brand-primary-active px-2.5 py-1 rounded-lg text-xs font-bold"
                                >
                                  Interact
                                </button>
                                <button
                                  onClick={() => handleDeleteAMPStory(story.id)}
                                  className="p-1 text-brand-mute hover:text-brand-negative"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* iPhone Virtual Visual Previewer Frame */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <span className="text-xs font-bold text-brand-mute uppercase tracking-widest flex items-center gap-1">
                    <Smartphone className="w-4 h-4" /> Visual Phone Simulator
                  </span>
                  <span className="text-[9px] font-black uppercase text-[#ff6a1a] tracking-wider mb-3">
                    Strict 9:16 aspect ratio
                  </span>

                  {previewStory ? (
                    <div className="w-[288px] h-[512px] aspect-[9/16] rounded-[36px] border-[8px] border-brand-ink bg-brand-on-primary shadow-2xl relative overflow-hidden flex flex-col justify-between">
                      {/* Speaker / Camera Notch */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-brand-ink rounded-full z-30" />

                      {/* Active story content */}
                      <div className="absolute inset-0 z-10 flex flex-col justify-between p-5 text-white">
                        {/* Slide status indicator bars at top */}
                        <div className="flex gap-1.5 mt-4">
                          {previewStory.pages.map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                idx === activeStoryPage ? 'bg-[#ff6a1a]' : 'bg-white/40'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Interactive Slide Body */}
                        <div className="flex-grow flex flex-col justify-end mb-8 space-y-3 z-20">
                          {previewStory.pages[activeStoryPage]?.type === 'cover' && (
                            <div className="space-y-2 text-shadow">
                              <span className="text-[9px] bg-brand-primary text-brand-on-primary font-black px-2 py-0.5 rounded-md uppercase">
                                {previewStory.category}
                              </span>
                              <h3 className="font-display font-black text-lg leading-tight text-white">
                                {previewStory.pages[activeStoryPage].title}
                              </h3>
                              <p className="text-[11px] text-white/80 line-clamp-3">
                                {previewStory.pages[activeStoryPage].subtitle}
                              </p>
                            </div>
                          )}

                          {previewStory.pages[activeStoryPage]?.type === 'content' && (
                            <div className="space-y-2 text-shadow bg-black/60 p-3 rounded-xl backdrop-blur-xs">
                              <h4 className="font-bold text-xs text-brand-primary">
                                {previewStory.pages[activeStoryPage].title}
                              </h4>
                              <p className="text-[11px] text-white/90 leading-relaxed">
                                {previewStory.pages[activeStoryPage].content}
                              </p>
                            </div>
                          )}

                          {previewStory.pages[activeStoryPage]?.type === 'cta' && (
                            <div className="space-y-4 text-center text-shadow bg-black/50 p-4 rounded-xl backdrop-blur-xs">
                              <h3 className="font-display font-bold text-sm text-white">
                                {previewStory.pages[activeStoryPage].title}
                              </h3>
                              <a
                                href={previewStory.pages[activeStoryPage].ctaLink || '#'}
                                onClick={(e) => e.preventDefault()}
                                className="inline-block bg-[#ff6a1a] text-white font-bold text-xs px-4 py-2 rounded-full w-full"
                              >
                                {previewStory.pages[activeStoryPage].ctaText || 'Read Article'}
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Interactive Left/Right tapping indicators */}
                        <div className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-w-resize" onClick={() => setActiveStoryPage(prev => Math.max(0, prev - 1))} />
                        <div className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-e-resize" onClick={() => setActiveStoryPage(prev => Math.min(previewStory.pages.length - 1, prev + 1))} />
                      </div>

                      {/* Slide background image representation */}
                      {previewStory.pages[activeStoryPage]?.image && (
                        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${previewStory.pages[activeStoryPage].image})` }}>
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
                        </div>
                      )}

                      {/* Simulated Home Indicator Bar */}
                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white rounded-full z-30" />
                    </div>
                  ) : (
                    <div className="w-[280px] h-[520px] rounded-[36px] border-[8px] border-brand-ink/40 bg-brand-canvas-soft flex items-center justify-center p-6 text-center">
                      <div className="space-y-2">
                        <Smartphone className="w-10 h-10 mx-auto text-brand-mute animate-pulse" />
                        <p className="text-xs text-brand-mute font-bold">Select a Web Story to interact on simulator</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* 6. ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="font-display font-bold text-xl text-brand-ink">
                  Article Performance Heatmap
                </h2>
                <p className="text-xs text-brand-mute mt-1">
                  Dynamic visualizers tracing click patterns, audience retention, and reading interest spikes.
                </p>
              </div>

              {/* View breakdown charts using styled CSS grids (Recharts vibe but ultra stable) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Views chart */}
                <div className="md:col-span-8 bg-brand-canvas-soft/30 p-5 rounded-2xl border border-brand-ink/5 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-brand-ink">Daily Unique Views (Simulated)</span>
                    <span className="text-brand-positive font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +24% this week
                    </span>
                  </div>

                  {/* HTML Bar Chart */}
                  <div className="h-44 flex items-end justify-between gap-2 pt-6">
                    {[
                      { day: 'Mon', val: 40 },
                      { day: 'Tue', val: 55 },
                      { day: 'Wed', val: 75 },
                      { day: 'Thu', val: 60 },
                      { day: 'Fri', val: 90 },
                      { day: 'Sat', val: 120 },
                      { day: 'Sun', val: 105 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-[10px] font-bold font-mono text-brand-ink-deep">{item.val}k</div>
                        <div
                          className="w-full bg-brand-primary rounded-t-lg transition-all duration-500 hover:bg-brand-primary-active"
                          style={{ height: `${(item.val / 130) * 120}px` }}
                        />
                        <span className="text-[10px] font-bold text-brand-mute">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category distribution */}
                <div className="md:col-span-4 bg-brand-canvas-soft/30 p-5 rounded-2xl border border-brand-ink/5 space-y-4">
                  <h3 className="text-xs font-bold text-brand-ink uppercase tracking-wider">
                    Views By Category
                  </h3>

                  <div className="space-y-3">
                    {[
                      { cat: 'Crypto', val: '45%', color: 'bg-brand-primary' },
                      { cat: 'Stocks', val: '28%', color: 'bg-accent-orange' },
                      { cat: 'Economy', val: '15%', color: 'bg-accent-cyan' },
                      { cat: 'Tech', val: '12%', color: 'bg-brand-mute' },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-brand-ink">
                          <span>{item.cat}</span>
                          <span>{item.val}</span>
                        </div>
                        <div className="w-full bg-brand-canvas h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: item.val }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Geographical or Device specs mock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 border border-brand-ink/5 rounded-2xl">
                  <span className="text-[10px] font-bold text-brand-mute uppercase tracking-widest block mb-1">
                    Primary Traffic Source
                  </span>
                  <span className="text-md font-display font-black text-brand-ink">
                    Google Search (AMP) 🔍
                  </span>
                </div>
                <div className="bg-white p-4 border border-brand-ink/5 rounded-2xl">
                  <span className="text-[10px] font-bold text-brand-mute uppercase tracking-widest block mb-1">
                    Mobile vs Desktop
                  </span>
                  <span className="text-md font-display font-black text-brand-ink">
                    78% Mobile Phone 📱
                  </span>
                </div>
                <div className="bg-white p-4 border border-brand-ink/5 rounded-2xl">
                  <span className="text-[10px] font-bold text-brand-mute uppercase tracking-widest block mb-1">
                    Avg Retention Period
                  </span>
                  <span className="text-md font-display font-black text-brand-ink">
                    4m 12s Per Session ⏱️
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* 7. GITHUB PAGES EXPORTER TAB */}
          {activeTab === 'github-pages' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-brand-ink">
                    GitHub Pages Static Exporter
                  </h2>
                  <p className="text-xs text-brand-mute mt-1">
                    Pre-render and bundle your offline-first dynamic CMS articles into an ultra-fast flat-file static structure.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    setCompiling(true);
                    try {
                      await buildAndDownloadZip(posts, ampStories);
                      showAlert('Static bundle compiled successfully!');
                    } catch (err) {
                      console.error(err);
                      showAlert('Compilation error occurred.', 'danger');
                    } finally {
                      setCompiling(false);
                    }
                  }}
                  disabled={compiling}
                  className="bg-brand-primary hover:bg-brand-primary-active disabled:bg-brand-mute text-brand-on-primary font-bold px-6 py-3 rounded-full text-sm shadow-sm transition hover:scale-102 flex items-center gap-2 cursor-pointer"
                >
                  {compiling ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Compiling...
                    </>
                  ) : (
                    <>
                      📦 Download Deployable ZIP Bundle
                    </>
                  )}
                </button>
              </div>

              {/* Layout description note */}
              <div className="bg-brand-primary-pale p-5 rounded-[20px] border border-brand-primary/10 flex items-start gap-3">
                <span className="text-lg">⚡</span>
                <div className="space-y-1 text-xs">
                  <h4 className="font-display font-bold text-brand-ink-deep">Instant static delivery with Zero server cost</h4>
                  <p className="text-brand-body leading-relaxed">
                    This compiler generates raw, SEO-primed HTML folders for every published article, structured static data streams for search queries, Google AMP pages for swipeable search carousels, and a valid sitemap. Ready to run completely serverless!
                  </p>
                </div>
              </div>

              {/* Dual Explorer Pane */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* File Tree Navigator */}
                <div className="lg:col-span-5 bg-brand-canvas-soft/40 p-4 rounded-2xl border border-brand-ink/5">
                  <span className="text-[10px] font-bold text-brand-mute uppercase tracking-widest block mb-4">
                    📁 Generated Directory Tree Layout
                  </span>

                  <div className="space-y-2 text-xs font-mono select-none">
                    {/* Root Folder item */}
                    <div className="flex items-center gap-1.5 font-bold text-brand-ink">
                      <span>📂</span> <span>root/</span>
                    </div>

                    <div className="pl-4 space-y-2 border-l border-brand-ink/10 ml-2">
                      {/* index.html */}
                      <div
                        onClick={() => setSelectedFile('index.html')}
                        className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer hover:bg-brand-canvas-soft/80 ${
                          selectedFile === 'index.html' ? 'bg-brand-primary-pale font-bold text-brand-ink-deep' : 'text-brand-body'
                        }`}
                      >
                        <span>📄 index.html</span>
                        <span className="text-[9px] text-brand-mute bg-white px-1.5 py-0.5 rounded border border-brand-ink/5 uppercase font-bold">Home Page</span>
                      </div>

                      {/* data folder */}
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-brand-ink py-1">
                          <span>📂</span> <span>data/</span>
                        </div>
                        <div className="pl-4 border-l border-brand-ink/10 ml-2 space-y-1">
                          {[
                            { name: 'posts.json', path: 'data/posts.json', type: 'JSON DB' },
                            { name: 'categories.json', path: 'data/categories.json', type: 'Config' },
                            { name: 'search.json', path: 'data/search.json', type: 'Search Index' },
                          ].map(f => (
                            <div
                              key={f.path}
                              onClick={() => setSelectedFile(f.path)}
                              className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer hover:bg-brand-canvas-soft/80 ${
                                selectedFile === f.path ? 'bg-brand-primary-pale font-bold text-brand-ink-deep' : 'text-brand-body'
                              }`}
                            >
                              <span>📄 {f.name}</span>
                              <span className="text-[9px] text-brand-mute bg-white px-1.5 py-0.5 rounded border border-brand-ink/5 uppercase font-bold">{f.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dynamic Articles Pre-rendered folders */}
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-brand-ink py-1">
                          <span>📂</span> <span>posts/</span>
                        </div>
                        <div className="pl-4 border-l border-brand-ink/10 ml-2 space-y-1 max-h-40 overflow-y-auto">
                          {posts.filter(p => p.status === 'published').map(post => {
                            const slug = slugify(post.title);
                            const path = `posts/${slug}`;
                            return (
                              <div
                                key={post.id}
                                onClick={() => setSelectedFile(path)}
                                className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer hover:bg-brand-canvas-soft/80 ${
                                  selectedFile === path ? 'bg-brand-primary-pale font-bold text-brand-ink-deep' : 'text-brand-body'
                                }`}
                              >
                                <span className="truncate pr-2">📄 {slug}/index.html</span>
                                <span className="text-[8px] text-brand-mute bg-white px-1 py-0.5 rounded border border-brand-ink/5 uppercase font-bold flex-shrink-0">Pre-rendered</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* AMP Stories folders */}
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-brand-ink py-1">
                          <span>📂</span> <span>stories/</span>
                        </div>
                        <div className="pl-4 border-l border-brand-ink/10 ml-2 space-y-1 max-h-40 overflow-y-auto">
                          {ampStories.map(story => {
                            const slug = slugify(story.title);
                            const path = `stories/${slug}`;
                            return (
                              <div
                                key={story.id}
                                onClick={() => setSelectedFile(path)}
                                className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer hover:bg-brand-canvas-soft/80 ${
                                  selectedFile === path ? 'bg-brand-primary-pale font-bold text-brand-ink-deep' : 'text-brand-body'
                                }`}
                              >
                                <span className="truncate pr-2">📄 {slug}/index.html</span>
                                <span className="text-[8px] text-[#ff6a1a] bg-orange-50 px-1 py-0.5 rounded border border-orange-200 uppercase font-bold flex-shrink-0">AMP Story</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* assets folder */}
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-brand-ink py-1">
                          <span>📂</span> <span>assets/</span>
                        </div>
                        <div className="pl-4 border-l border-brand-ink/10 ml-2 text-brand-mute space-y-1 italic text-[11px]">
                          <div>📂 css/ <span className="text-[9px] not-italic text-brand-mute">(styles.css)</span></div>
                          <div>📂 js/ <span className="text-[9px] not-italic text-brand-mute">(scripts.js)</span></div>
                          <div>📂 images/</div>
                          <div>📂 thumbnails/</div>
                        </div>
                      </div>

                      {/* SEO configuration items */}
                      <div className="pt-2 space-y-1">
                        {[
                          { name: 'sitemap.xml', path: 'sitemap.xml', type: 'SEO Sitemap' },
                          { name: 'robots.txt', path: 'robots.txt', type: 'SEO Rules' },
                          { name: 'manifest.webmanifest', path: 'manifest.webmanifest', type: 'PWA Meta' },
                        ].map(f => (
                          <div
                            key={f.path}
                            onClick={() => setSelectedFile(f.path)}
                            className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer hover:bg-brand-canvas-soft/80 ${
                              selectedFile === f.path ? 'bg-brand-primary-pale font-bold text-brand-ink-deep' : 'text-brand-body'
                            }`}
                          >
                            <span>📄 {f.name}</span>
                            <span className="text-[9px] text-brand-mute bg-white px-1.5 py-0.5 rounded border border-brand-ink/5 uppercase font-bold">{f.type}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>

                {/* Precompiled Content preview box */}
                <div className="lg:col-span-7 bg-brand-ink text-[#a9ff73] p-5 rounded-2xl font-mono text-[11px] overflow-hidden flex flex-col h-[520px]">
                  <div className="flex justify-between items-center border-b border-brand-primary/10 pb-3 mb-3 text-brand-mute font-bold uppercase tracking-wider">
                    <span>Previewing: {selectedFile}</span>
                    <button
                      onClick={() => {
                        const content = getCompiledFileContent(selectedFile);
                        navigator.clipboard.writeText(content);
                        showAlert('Code copied to clipboard!');
                      }}
                      className="bg-brand-primary text-brand-on-primary font-bold px-2.5 py-1 rounded-md text-[9px] hover:bg-brand-primary-active transition"
                    >
                      Copy Code
                    </button>
                  </div>
                  <pre className="overflow-auto flex-grow scrollbar-thin text-left leading-relaxed">
                    <code>{getCompiledFileContent(selectedFile)}</code>
                  </pre>
                </div>
              </div>

              {/* GitHub Pages Setup Guide */}
              <div className="border-t border-brand-ink/10 pt-6 space-y-4">
                <h3 className="font-display font-bold text-md text-brand-ink">
                  🚀 4-Step Deployment Guide for GitHub Pages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-white border border-brand-ink/5 p-4 rounded-xl space-y-2">
                    <div className="w-6 h-6 rounded-full bg-brand-ink text-brand-primary flex items-center justify-center font-bold">1</div>
                    <h4 className="font-bold text-brand-ink">Compile Bundle</h4>
                    <p className="text-brand-mute leading-relaxed">Click the Download ZIP button at the top to compile your custom folder bundle.</p>
                  </div>
                  <div className="bg-white border border-brand-ink/5 p-4 rounded-xl space-y-2">
                    <div className="w-6 h-6 rounded-full bg-brand-ink text-brand-primary flex items-center justify-center font-bold">2</div>
                    <h4 className="font-bold text-brand-ink">GitHub Repo</h4>
                    <p className="text-brand-mute leading-relaxed">Create a new public or private repository on GitHub (e.g. <code>money-news</code>).</p>
                  </div>
                  <div className="bg-white border border-brand-ink/5 p-4 rounded-xl space-y-2">
                    <div className="w-6 h-6 rounded-full bg-brand-ink text-brand-primary flex items-center justify-center font-bold">3</div>
                    <h4 className="font-bold text-brand-ink">Unpack & Push</h4>
                    <p className="text-brand-mute leading-relaxed">Extract the ZIP contents directly into your repo, and commit/push them to the main branch.</p>
                  </div>
                  <div className="bg-white border border-brand-ink/5 p-4 rounded-xl space-y-2">
                    <div className="w-6 h-6 rounded-full bg-brand-ink text-brand-primary flex items-center justify-center font-bold">4</div>
                    <h4 className="font-bold text-brand-ink">Activate Pages</h4>
                    <p className="text-brand-mute leading-relaxed">Go to Repo Settings &gt; Pages, set Source to <b>Deploy from branch</b>, choose main and root, and click save!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- MEDIUM SEO & DISTRIBUTION AUDIT MODAL ----------------- */}
          {auditPost && (() => {
            // Calculations for On-Page SEO Ranking Score
            // 1. Keyword Density Score
            let densityScore = 0;
            if (auditKeywordDensity >= 1.8 && auditKeywordDensity <= 3.2) {
              densityScore = 100;
            } else if (auditKeywordDensity < 1.8) {
              densityScore = Math.max(0, Math.round((auditKeywordDensity / 1.8) * 100));
            } else {
              densityScore = Math.max(0, Math.round(100 - (auditKeywordDensity - 3.2) * 50));
            }

            // 2. Internal Link Score
            const linkScore = Math.min(100, auditInternalLinks * 20);

            // 3. Dwell Score
            const dwellMultiplier = Math.min(100, Math.round(auditDwellScore * 25));

            // 4. Mobile Responsiveness Score
            const mobileScore = auditMobileResponsive ? 100 : 0;

            // Final Rank Formula:
            // Final Rank = (Keyword Density * 0.2) + (Internal Links * 0.3) + (Dwell Score * 0.3) + (Mobile Responsiveness * 0.2)
            const finalRankScore = Math.round(
              (densityScore * 0.2) + 
              (linkScore * 0.3) + 
              (dwellMultiplier * 0.3) + 
              (mobileScore * 0.2)
            );

            // Calculations for Distribution Engine
            // 1. Engagement Score
            const engagementScore = Math.round(
              (auditClaps * 1.5) + 
              (auditResponses * 2.5) + 
              (auditShares * 3.0)
            );

            // 2. Recency Decay Factor
            // Decay = 1 / (1 + DaysSincePublish * 0.08)
            const decayFactor = auditFreshnessReset ? 1.0 : parseFloat((1 / (1 + auditDaysSincePublish * 0.08)).toFixed(3));

            // 3. Final Distribution Rate
            const distributionRate = Math.round(engagementScore * decayFactor);

            // Determine badge rating
            let ratingBadge = "Bronze Index";
            let ratingColor = "bg-orange-100 text-orange-800 border-orange-200";
            if (finalRankScore >= 85 && distributionRate >= 500) {
              ratingBadge = "Medium Staff Pick / Viral Platinum";
              ratingColor = "bg-amber-100 text-amber-900 border-amber-300 animate-pulse";
            } else if (finalRankScore >= 75 || distributionRate >= 250) {
              ratingBadge = "Curated / Gold Index";
              ratingColor = "bg-emerald-100 text-emerald-950 border-emerald-300";
            } else if (finalRankScore >= 50) {
              ratingBadge = "Distributed / Silver Index";
              ratingColor = "bg-blue-100 text-blue-800 border-blue-200";
            }

            // Clean slug preview
            const cleanSlug = `/${auditKeyword.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

            return (
              <div className="fixed inset-0 bg-brand-ink/90 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md animate-fadeIn">
                <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-brand-ink/10 shadow-2xl p-6 md:p-8 space-y-6 scrollbar-thin">
                  
                  {/* Modal Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-brand-ink/5 pb-5">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-[#ff6a1a]/10 text-[#ff6a1a] px-3 py-1 rounded-full uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-[#ff6a1a]" /> Algorithmic Audit Sandbox
                      </span>
                      <h3 className="font-display font-black text-2xl text-brand-ink leading-tight">
                        Medium Feed Ranking & Distribution Engine
                      </h3>
                      <p className="text-xs text-brand-mute">
                        Auditing article: <span className="text-brand-ink font-bold">"{auditPost.title}"</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setAuditPost(null)}
                      className="bg-brand-canvas-soft hover:bg-brand-canvas-soft/80 text-brand-mute hover:text-brand-ink p-2 rounded-full transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Grid content split into Ranking (SEO) vs Distribution */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* COLUMN 1: ON-PAGE SEO RANKING (Part 2 of prompt) */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 border-b border-brand-ink/5 pb-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          1
                        </div>
                        <h4 className="font-display font-black text-sm text-emerald-800 uppercase tracking-wider">
                          On-Page SEO Ranking Engine
                        </h4>
                      </div>

                      {/* Top score meter */}
                      <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Calculated Rank Score</p>
                          <h5 className="text-3xl font-display font-black text-emerald-950 mt-1">{finalRankScore} / 100</h5>
                          <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded border mt-2 ${ratingColor}`}>
                            {ratingBadge}
                          </span>
                        </div>
                        <div className="w-20 h-20 relative flex items-center justify-center">
                          {/* Circular border progress */}
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="34" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                            <circle cx="40" cy="40" r="34" stroke="#10b981" strokeWidth="6" fill="transparent"
                              strokeDasharray={2 * Math.PI * 34}
                              strokeDashoffset={2 * Math.PI * 34 * (1 - finalRankScore / 100)}
                            />
                          </svg>
                          <span className="absolute font-mono font-bold text-emerald-950 text-sm">{finalRankScore}%</span>
                        </div>
                      </div>

                      {/* SEO parameters sliders */}
                      <div className="space-y-4">
                        <p className="text-[11px] font-black text-brand-ink uppercase tracking-wider">Algorithmic Variables:</p>

                        {/* Extracted Keyword */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-brand-body flex items-center gap-1">
                              Primary Keyword Phrase
                            </span>
                            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-mono">
                              Auto-Extracted
                            </span>
                          </div>
                          <input
                            type="text"
                            value={auditKeyword}
                            onChange={(e) => setAuditKeyword(e.target.value.toUpperCase())}
                            className="w-full bg-brand-canvas-soft border border-brand-ink/10 rounded-xl px-3.5 py-2 text-xs font-mono font-bold outline-none focus:border-brand-primary"
                            placeholder="ENTER PRIMARY KEYWORD"
                          />
                        </div>

                        {/* Canonical Slug */}
                        <div className="space-y-1 bg-brand-canvas-soft/40 p-3 rounded-xl border border-brand-ink/5">
                          <p className="text-[10px] font-bold text-brand-mute uppercase tracking-wider">Generated Canonical Slug Preview</p>
                          <p className="text-xs font-mono font-bold text-brand-ink-deep break-all">{cleanSlug}</p>
                        </div>

                        {/* Keyword Density Slider */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-brand-body">Keyword Density (%)</span>
                            <span className={`font-mono font-bold ${densityScore === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {auditKeywordDensity}% (Score: {densityScore}/100)
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="6.0"
                            step="0.1"
                            value={auditKeywordDensity}
                            onChange={(e) => setAuditKeywordDensity(parseFloat(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                          <span className="block text-[9px] text-brand-mute italic">Sweet spot: 1.8% to 3.2% keyword concentration inside core body markup.</span>
                        </div>

                        {/* Internal Links Slider */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-brand-body">Inbound Internal Medium Links</span>
                            <span className="font-mono font-bold text-brand-ink">
                              {auditInternalLinks} links (Score: {linkScore}/100)
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="8"
                            step="1"
                            value={auditInternalLinks}
                            onChange={(e) => setAuditInternalLinks(parseInt(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                        </div>

                        {/* Dwell Score Slider */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-brand-body">Dwell Score (Avg read time / Total words)</span>
                            <span className="font-mono font-bold text-brand-ink">
                              {auditDwellScore} (Score: {dwellMultiplier}/100)
                        </span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="5.0"
                            step="0.1"
                            value={auditDwellScore}
                            onChange={(e) => setAuditDwellScore(parseFloat(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                        </div>

                        {/* Mobile Responsiveness */}
                        <div className="flex items-center justify-between p-3.5 bg-brand-canvas-soft rounded-2xl border border-brand-ink/5">
                          <div>
                            <p className="text-xs font-bold text-brand-ink">Mobile Layout Optimization</p>
                            <p className="text-[10px] text-brand-mute">Responsive container aspect ratios and touch zones</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAuditMobileResponsive(!auditMobileResponsive)}
                            className={`w-11 h-6 rounded-full transition duration-300 relative ${
                              auditMobileResponsive ? 'bg-emerald-600' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${
                              auditMobileResponsive ? 'left-6' : 'left-1'
                            }`} />
                          </button>
                        </div>

                        {/* Meta Description Structure */}
                        <div className="space-y-1.5 bg-brand-canvas-soft/40 p-4 rounded-2xl border border-brand-ink/5">
                          <div className="flex justify-between items-center text-[10px] font-black text-brand-mute uppercase tracking-wider">
                            <span>Structured Meta Description Tag</span>
                            <span className="text-brand-primary">{Math.min(160, auditPost.excerpt.length)} / 160 characters</span>
                          </div>
                          <p className="text-xs font-semibold text-brand-ink leading-relaxed italic bg-white p-2.5 rounded-lg border border-brand-ink/5">
                            "{auditPost.excerpt.slice(0, 160)}"
                          </p>
                          <span className="block text-[8px] text-brand-mute leading-tight">Formatted canonical metadata for immediate ingestion by Google and Medium's search crawls.</span>
                        </div>

                        {/* Outline hierarchy structure preview */}
                        <div className="space-y-1.5 bg-brand-canvas-soft/40 p-4 rounded-2xl border border-brand-ink/5">
                          <p className="text-[10px] font-black text-brand-mute uppercase tracking-wider">Structured Outline Hierarchy (Parsed Tags)</p>
                          <div className="space-y-1.5 font-mono text-[10px] text-brand-ink-deep bg-white p-2.5 rounded-lg border border-brand-ink/5">
                            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                              <span>[H1]</span> <span>{auditPost.title}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold pl-3">
                              <span>[H2]</span> <span>1. Introduction to {auditKeyword} market indicators</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-600 pl-6">
                              <span>[H3]</span> <span>Historical precedent analysis</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold pl-3">
                              <span>[H2]</span> <span>2. Key take-away metrics and technical thresholds</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* COLUMN 2: DISTRIBUTION ENGINE (Part 1 of prompt) */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 border-b border-brand-ink/5 pb-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                          2
                        </div>
                        <h4 className="font-display font-black text-sm text-blue-800 uppercase tracking-wider">
                          Feed Distribution Engine
                        </h4>
                      </div>

                      {/* Top distribution score meter */}
                      <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">Feed Recommendation Index</p>
                          <h5 className="text-3xl font-display font-black text-blue-950 mt-1">{distributionRate} pts</h5>
                          <p className="text-[10px] font-bold text-brand-mute mt-1">
                            Velocity decay modifier is active ({decayFactor}x)
                          </p>
                        </div>
                        <div className="bg-blue-600 text-white rounded-full w-14 h-14 flex flex-col items-center justify-center shadow-lg font-display">
                          <TrendingUp className="w-5 h-5 text-blue-200" />
                          <span className="text-[10px] font-black mt-0.5 font-mono">{decayFactor}x</span>
                        </div>
                      </div>

                      {/* Cohort Testing visual timeline */}
                      <div className="bg-brand-canvas-soft/50 border border-brand-ink/5 p-4 rounded-2xl space-y-3">
                        <p className="text-[10px] font-black text-brand-ink uppercase tracking-wider">Live Cohort Testing Status:</p>
                        <div className="relative pt-2">
                          <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-brand-ink/5 z-0" />
                          
                          <div className="grid grid-cols-1 gap-3 relative z-10 text-xs">
                            {/* Phase 1 */}
                            <div className={`p-3 rounded-xl border flex items-start gap-3 transition-all duration-300 ${
                              auditCohortPhase === 1 
                                ? 'bg-amber-50 border-amber-300 shadow-xs scale-102' 
                                : 'bg-white border-brand-ink/5 opacity-60'
                            }`}>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                auditCohortPhase >= 1 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
                              }`}>1</div>
                              <div>
                                <p className="font-bold text-brand-ink">Phase 1: Followers Testing (10% Reach)</p>
                                <p className="text-[10px] text-brand-mute mt-0.5">Dispatched to most active immediate followers for initial feedback velocity validation.</p>
                              </div>
                            </div>

                            {/* Phase 2 */}
                            <div className={`p-3 rounded-xl border flex items-start gap-3 transition-all duration-300 ${
                              auditCohortPhase === 2 
                                ? 'bg-[#ff6a1a]/5 border-[#ff6a1a]/30 shadow-xs scale-102' 
                                : 'bg-white border-brand-ink/5 opacity-60'
                            }`}>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                auditCohortPhase >= 2 ? 'bg-[#ff6a1a] text-white' : 'bg-gray-100 text-gray-500'
                              }`}>2</div>
                              <div>
                                <p className="font-bold text-brand-ink">Phase 2: High Similarity Expansion (25%)</p>
                                <p className="text-[10px] text-brand-mute mt-0.5">Expanded to users who read matching tags ({auditPost.category.toUpperCase()}) but don't follow author.</p>
                              </div>
                            </div>

                            {/* Phase 3 */}
                            <div className={`p-3 rounded-xl border flex items-start gap-3 transition-all duration-300 ${
                              auditCohortPhase === 3 
                                ? 'bg-emerald-50 border-emerald-300 shadow-xs scale-102' 
                                : 'bg-white border-brand-ink/5 opacity-60'
                            }`}>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                auditCohortPhase >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                              }`}>3</div>
                              <div>
                                <p className="font-bold text-brand-ink">Phase 3: Universal Feed & Highlights</p>
                                <p className="text-[10px] text-brand-mute mt-0.5">High authority distribution index triggered. Placed on main feed recommendation sliders.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Distribution parameters sliders */}
                      <div className="space-y-4">
                        <p className="text-[11px] font-black text-brand-ink uppercase tracking-wider">Engagement & Recency Modifiers:</p>

                        {/* Engagement scorecard: Claps */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-brand-body">Claps (Weight: 1.5x)</span>
                            <span className="font-mono font-bold text-brand-ink-deep">{auditClaps} claps</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1000"
                            step="10"
                            value={auditClaps}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setAuditClaps(val);
                              const total = (val * 1.5) + (auditResponses * 2.5) + (auditShares * 3.0);
                              setAuditCohortPhase(total > 350 ? 3 : total > 120 ? 2 : 1);
                            }}
                            className="w-full accent-blue-600"
                          />
                        </div>

                        {/* Responses */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-brand-body">Comments / Responses (Weight: 2.5x)</span>
                            <span className="font-mono font-bold text-brand-ink-deep">{auditResponses} comments</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={auditResponses}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setAuditResponses(val);
                              const total = (auditClaps * 1.5) + (val * 2.5) + (auditShares * 3.0);
                              setAuditCohortPhase(total > 350 ? 3 : total > 120 ? 2 : 1);
                            }}
                            className="w-full accent-blue-600"
                          />
                        </div>

                        {/* Shares */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-brand-body">Social Outbound Shares (Weight: 3.0x)</span>
                            <span className="font-mono font-bold text-brand-ink-deep">{auditShares} shares</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={auditShares}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setAuditShares(val);
                              const total = (auditClaps * 1.5) + (auditResponses * 2.5) + (val * 3.0);
                              setAuditCohortPhase(total > 350 ? 3 : total > 120 ? 2 : 1);
                            }}
                            className="w-full accent-blue-600"
                          />
                        </div>

                        {/* Days since publish */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-brand-body">Age of Publication (Recency Decay)</span>
                            <span className="font-mono font-bold text-brand-ink-deep">{auditDaysSincePublish} days ago</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="30"
                            step="1"
                            disabled={auditFreshnessReset}
                            value={auditDaysSincePublish}
                            onChange={(e) => setAuditDaysSincePublish(parseInt(e.target.value))}
                            className={`w-full accent-blue-600 ${auditFreshnessReset ? 'opacity-30' : ''}`}
                          />
                        </div>

                        {/* Freshness Reset toggle */}
                        <div className="flex items-center justify-between p-3.5 bg-brand-primary-pale rounded-2xl border border-brand-primary/10">
                          <div>
                            <p className="text-xs font-bold text-brand-ink-deep">Freshness Reset Trigger</p>
                            <p className="text-[10px] text-brand-body">Resets gravity decay curve for older posts that trigger new immediate comment velocity spikes</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAuditFreshnessReset(!auditFreshnessReset)}
                            className={`w-11 h-6 rounded-full transition duration-300 relative ${
                              auditFreshnessReset ? 'bg-brand-primary' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${
                              auditFreshnessReset ? 'left-6' : 'left-1'
                            }`} />
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* MATHEMATICAL FORMULA EXPLANATION BANNER */}
                  <div className="bg-brand-canvas-soft/80 p-5 rounded-2xl border border-brand-ink/5 space-y-2.5">
                    <p className="text-xs font-black text-brand-ink-deep uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-brand-primary" /> Medium Engineering Algorithm Reference Formulas
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-mono text-brand-body leading-relaxed">
                      <div className="bg-white p-3 rounded-xl border border-brand-ink/5 space-y-1">
                        <p className="font-bold text-brand-ink">SEO Rank Index Formula:</p>
                        <p className="text-brand-primary font-black">
                          Final Rank = (Keyword Density × 0.2) + (Internal Links × 0.3) + (Dwell Score × 0.3) + (Mobile Responsiveness × 0.2)
                        </p>
                        <ul className="list-disc pl-3 mt-1.5 space-y-1 text-brand-mute font-sans">
                          <li><b>Keyword Density Score:</b> Caps at 100% when density is inside the perfect 1.8% - 3.2% distribution curve.</li>
                          <li><b>Internal Links:</b> Linear scaling of links * 20 (ideal counts are 5+ posts).</li>
                          <li><b>Dwell Score:</b> Computed via read time / article wordcount. Ideal avg read time target is 4.0+ min.</li>
                          <li><b>Mobile Responsiveness:</b> Binary multiplier (0 or 100 based on standard mobile view tests).</li>
                        </ul>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-brand-ink/5 space-y-1">
                        <p className="font-bold text-brand-ink">Distribution Velocity Formula:</p>
                        <p className="text-[#ff6a1a] font-black">
                          Distribution Index = Engagement Score × Decay Modifier
                        </p>
                        <p className="text-brand-ink">
                          Engagement = (Claps × 1.5) + (Responses × 2.5) + (Shares × 3.0)
                        </p>
                        <p className="text-brand-ink">
                          Decay Modifier = 1 / (1 + DaysSincePublish × 0.08)
                        </p>
                        <ul className="list-disc pl-3 mt-1.5 space-y-1 text-brand-mute font-sans">
                          <li><b>Cohort Testing:</b> Initial follower test must beat a velocity threshold of 120 pts to reach high similarity networks.</li>
                          <li><b>Freshness Reset:</b> Promoted older articles bypass the age decay if they spike in social clicks within a rolling 24-hour cycle.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

        </main>
      </div>
    </div>
  );
}
