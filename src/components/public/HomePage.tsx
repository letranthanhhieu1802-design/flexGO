import React, { useEffect, useRef, useState } from 'react';
import { 
  ChevronsRight, 
  Search, 
  Truck, 
  Ship, 
  Plane, 
  Warehouse, 
  Landmark, 
  Snowflake, 
  Navigation, 
  Package, 
  FileText, 
  Shield, 
  Zap, 
  CheckCircle2, 
  Coins, 
  Plus, 
  Linkedin, 
  Twitter, 
  Instagram,
  Lock
} from 'lucide-react';
import { CurrentView, UserPersona } from '../../types';

interface HomePageProps {
  currentUser: UserPersona;
  onNavigate: (view: CurrentView) => void;
  onOpenCreateInquiry: () => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentUser: _currentUser,
  onNavigate,
  onOpenCreateInquiry,
  onOpenAuthModal
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeValueTab, setActiveValueTab] = useState<'group-1' | 'group-2' | 'group-3'>('group-1');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  // Problem-Solution Hover Pairing handlers (direct DOM pairing matching original template, zero re-renders)
  const handlePairEnter = (pairNum: number, e: React.MouseEvent<HTMLDivElement>) => {
    const group = e.currentTarget.closest('.value-group');
    if (!group) return;
    const cards = group.querySelectorAll(`[data-pair="${pairNum}"]`);
    cards.forEach((c) => c.classList.add('pair-active'));
  };

  const handlePairLeave = (pairNum: number, e: React.MouseEvent<HTMLDivElement>) => {
    const group = e.currentTarget.closest('.value-group');
    if (!group) return;
    const cards = group.querySelectorAll(`[data-pair="${pairNum}"]`);
    cards.forEach((c) => c.classList.remove('pair-active'));
  };

  // Spotlight mousemove handler for cards
  const handleSpotlightMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Canvas Scroll Animation Engine (441 frames: 270 trucks + 171 planes)
  useEffect(() => {
    const canvas = canvasRef.current;
    const block = containerRef.current;
    if (!canvas || !block) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const sequence = [
      { folder: '/trucks', prefix: 'ezgif-frame', count: 270 },
      { folder: '/planes', prefix: 'ezgif-frame', count: 171 }
    ];

    const totalFrames = sequence.reduce((acc, curr) => acc + curr.count, 0);
    const images: HTMLImageElement[] = [];
    let imagesLoaded = 0;
    let currentFrame = 0;
    let targetFrame = 0;
    let animationFrameId: number;
    let isDisposed = false;

    // Load images
    for (let s = 0; s < sequence.length; s++) {
      const config = sequence[s];
      for (let i = 1; i <= config.count; i++) {
        const img = new Image();
        const frameNum = i.toString().padStart(3, '0');
        img.src = `${config.folder}/${config.prefix}-${frameNum}.jpg`;
        img.onload = () => {
          imagesLoaded++;
          if (imagesLoaded === 1 && !isDisposed) {
            resizeCanvas();
          }
        };
        images.push(img);
      }
    }

    const drawCover = (img: HTMLImageElement) => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const drawCurrentFrame = () => {
      const frameIndex = Math.min(totalFrames - 1, Math.max(0, Math.round(currentFrame)));
      const img = images[frameIndex];
      if (img && img.complete && img.naturalWidth > 0) {
        drawCover(img);
      }
    };

    const resizeCanvas = () => {
      if (!canvas) return;
      if (images[0] && images[0].complete && images[0].naturalWidth > 0) {
        canvas.width = images[0].naturalWidth;
        canvas.height = images[0].naturalHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      drawCurrentFrame();
    };

    const updateFrame = () => {
      if (isDisposed) return;
      const diff = targetFrame - currentFrame;
      currentFrame += diff * 0.1;
      drawCurrentFrame();
      animationFrameId = requestAnimationFrame(updateFrame);
    };

    const onScroll = () => {
      if (!block) return;
      const rect = block.getBoundingClientRect();
      const scrollDistance = rect.height - window.innerHeight;
      if (scrollDistance <= 0) return;

      let progress = -rect.top / scrollDistance;
      progress = Math.max(0, Math.min(1, progress));
      targetFrame = progress * (totalFrames - 1);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial sizing and kickstart
    resizeCanvas();
    onScroll();
    updateFrame();

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', onScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          (entry.target as HTMLElement).setAttribute('data-visible', 'true');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Ensure cards in active tab are marked visible immediately on tab switch
  useEffect(() => {
    const activeGroup = document.getElementById(activeValueTab);
    if (activeGroup) {
      const items = activeGroup.querySelectorAll('.animate-on-scroll');
      items.forEach((item) => {
        item.classList.add('is-visible');
        (item as HTMLElement).setAttribute('data-visible', 'true');
      });
    }
  }, [activeValueTab]);

  return (
    <div className="bg-[#061218] text-white min-h-screen selection:bg-brand-orange selection:text-white font-['Montserrat',sans-serif] w-full relative">
      {/* ========================================================================= */}
      {/* 1. ANIMATION BLOCK 1 (CANVAS TRUCKS & PLANES + HERO + VALUES + CATEGORIES + TEAMS) */}
      {/* ========================================================================= */}
      <div className="animation-block" id="block-1" ref={containerRef}>
        {/* Sticky Canvas Wrapper */}
        <div className="sticky-canvas-wrapper">
          <canvas id="scroll-image-1" ref={canvasRef} className="scroll-canvas"></canvas>
        </div>

        {/* UI Overlay (Standard Scroll Flow) */}
        <div className="relative z-10 -mt-[100vh]">

          {/* ------------------------------------------------------------- */}
          {/* SECTION 1: HERO SECTION */}
          {/* ------------------------------------------------------------- */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 md:py-24 relative overflow-hidden">
            {/* Tag */}
            <div className="animate-on-scroll fade-up mb-8">
              <span className="inline-block bg-brand-orange text-white text-xs md:text-sm font-bold tracking-[0.15em] uppercase px-6 py-2.5 rounded-sm cursor-default hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,107,0,0.4)] hover:bg-[#e04f0e] transition-all duration-300">
                Always best price
              </span>
            </div>

            <h2 className="animate-on-scroll fade-up delay-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-xl max-w-4xl leading-tight">
              Logistics Services Procurement Platform
            </h2>

            <div className="animate-on-scroll fade-in delay-200 flex items-center justify-center gap-3 mb-6 w-full max-w-lg">
              <div className="h-px flex-grow border-t border-dashed border-white/60"></div>
            </div>

            <div className="animate-on-scroll fade-up delay-300 inline-flex items-center justify-center px-4 py-2 mx-auto max-w-full drop-shadow-xl mb-10">
              <p className="text-lg md:text-xl font-semibold text-white whitespace-normal md:whitespace-nowrap text-center drop-shadow-md">
                A digital platform that closes the gap between customers and Logistics providers
              </p>
            </div>

            {/* CTAs */}
            <div className="animate-on-scroll fade-up delay-400 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                id="hero-become-customer-btn"
                onClick={onOpenCreateInquiry}
                className="bg-transparent border border-white/40 text-white px-8 py-4 font-bold text-sm tracking-widest flex items-center gap-2 hover:bg-white/10 hover:border-white hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,255,255,0.15)] transition-all duration-300 shadow-lg rounded-sm cursor-pointer uppercase"
              >
                <ChevronsRight className="w-4 h-4" /> Become Customer
              </button>
              <button
                id="hero-become-supplier-btn"
                onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
                className="bg-transparent border border-white/40 text-white px-8 py-4 font-bold text-sm tracking-widest flex items-center gap-2 hover:bg-white/10 hover:border-white hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,255,255,0.15)] transition-all duration-300 shadow-lg rounded-sm cursor-pointer uppercase"
              >
                <ChevronsRight className="w-4 h-4" /> Become Supplier
              </button>
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 2: VALUES SECTION */}
          {/* ------------------------------------------------------------- */}
          <section className="min-h-screen bg-transparent py-16 md:py-24 px-4 md:px-10 lg:px-20 border-t border-white/10 overflow-hidden">
            <div className="text-center mb-16">
              <h2 className="animate-on-scroll fade-up delay-100 text-3xl md:text-5xl font-black text-white tracking-tight">
                Digital Platform That Connects<br />All Logistics Needs
              </h2>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col gap-10">
              {/* Tab Navigation */}
              <div className="flex justify-center mb-10">
                <div className="inline-flex flex-wrap justify-center p-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md gap-1">
                  <button
                    onClick={() => setActiveValueTab('group-1')}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer ${
                      activeValueTab === 'group-1'
                        ? 'bg-brand-orange text-white shadow-md'
                        : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    For Shippers & Traders
                  </button>
                  <button
                    onClick={() => setActiveValueTab('group-2')}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer ${
                      activeValueTab === 'group-2'
                        ? 'bg-brand-orange text-white shadow-md'
                        : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    For Forwarders & Agencies
                  </button>
                  <button
                    onClick={() => setActiveValueTab('group-3')}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer ${
                      activeValueTab === 'group-3'
                        ? 'bg-brand-orange text-white shadow-md'
                        : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    For Carriers & Warehouses
                  </button>
                </div>
              </div>

              {/* Group 1: Shippers & Traders */}
              <div id="group-1" className={`value-group ${activeValueTab === 'group-1' ? 'flex' : 'hidden'} flex-col gap-10 relative`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
                  {/* Row 1: Left Category Card */}
                  <div 
                    onMouseMove={handleSpotlightMouseMove}
                    className="spotlight-card problem-card animate-on-scroll fade-up bg-white/95 backdrop-blur-md border border-white/50 rounded-3xl p-6 flex flex-col justify-center self-center h-[180px] shadow-xl relative overflow-hidden group"
                  >
                    <h3 className="text-3xl md:text-4xl font-black text-brand-navy mb-2 relative z-10">The Problems</h3>
                    <p className="text-sm font-medium text-brand-navy/70 leading-relaxed relative z-10">
                      Challenges that shaped our approach
                    </p>
                  </div>

                  {/* Problem 1 */}
                  <div
                    data-pair="1"
                    onMouseEnter={(e) => handlePairEnter(1, e)}
                    onMouseLeave={(e) => handlePairLeave(1, e)}
                    className="animate-on-scroll fade-up delay-100 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Manual Rate Checking
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Wasting days asking for shipping rates via chat apps and emails.
                    </p>
                  </div>

                  {/* Problem 2 */}
                  <div
                    data-pair="2"
                    onMouseEnter={(e) => handlePairEnter(2, e)}
                    onMouseLeave={(e) => handlePairLeave(2, e)}
                    className="animate-on-scroll fade-up delay-200 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Hidden Markups
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Paying overpriced charges and hidden fees to old logistics providers.
                    </p>
                  </div>

                  {/* Problem 3 */}
                  <div
                    data-pair="3"
                    onMouseEnter={(e) => handlePairEnter(3, e)}
                    onMouseLeave={(e) => handlePairLeave(3, e)}
                    className="animate-on-scroll fade-up delay-300 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Spam Calls
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Getting spammed by unwanted broker calls when searching for prices.
                    </p>
                  </div>

                  {/* Row 2: Solutions Left Category Card */}
                  <div 
                    onMouseMove={handleSpotlightMouseMove}
                    className="spotlight-card solution-card animate-on-scroll fade-up bg-white/95 backdrop-blur-md border border-brand-orange/30 rounded-3xl p-6 flex flex-col justify-center self-center h-[180px] shadow-xl relative overflow-hidden group"
                  >
                    <h3 className="text-3xl md:text-4xl font-black text-brand-orange mb-2 relative z-10">FlexGO Solutions</h3>
                    <p className="text-sm font-medium text-brand-navy/70 leading-relaxed relative z-10">
                      How we turn challenges into results
                    </p>
                  </div>

                  {/* Solution 1 */}
                  <div
                    data-pair="1"
                    onMouseEnter={(e) => handlePairEnter(1, e)}
                    onMouseLeave={(e) => handlePairLeave(1, e)}
                    className="animate-on-scroll fade-up delay-100 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Smart & Anonymous Forms
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Create requests in seconds and get 3-5 transparent quotes without exposing your phone number.
                    </p>
                  </div>

                  {/* Solution 2 */}
                  <div
                    data-pair="2"
                    onMouseEnter={(e) => handlePairEnter(2, e)}
                    onMouseLeave={(e) => handlePairLeave(2, e)}
                    className="animate-on-scroll fade-up delay-200 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      AI Price Auditor
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Upload old quotes, and our AI instantly spots overpriced fees to save you money.
                    </p>
                  </div>

                  {/* Solution 3 */}
                  <div
                    data-pair="3"
                    onMouseEnter={(e) => handlePairEnter(3, e)}
                    onMouseLeave={(e) => handlePairLeave(3, e)}
                    className="animate-on-scroll fade-up delay-300 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Verified Partners
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Compare bids easily and work only with trusted companies holding verified business licenses.
                    </p>
                  </div>
                </div>
              </div>

              {/* Group 2: Forwarders & Agencies */}
              <div id="group-2" className={`value-group ${activeValueTab === 'group-2' ? 'flex' : 'hidden'} flex-col gap-10 relative`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
                  {/* Row 1: Left Category Card */}
                  <div 
                    onMouseMove={handleSpotlightMouseMove}
                    className="spotlight-card problem-card animate-on-scroll fade-up bg-white/95 backdrop-blur-md border border-white/50 rounded-3xl p-6 flex flex-col justify-center self-center h-[180px] shadow-xl relative overflow-hidden group"
                  >
                    <h3 className="text-3xl md:text-4xl font-black text-brand-navy mb-2 relative z-10">The Problems</h3>
                    <p className="text-sm font-medium text-brand-navy/70 leading-relaxed relative z-10">
                      Challenges that shaped our approach
                    </p>
                  </div>

                  {/* Problem 1 */}
                  <div
                    data-pair="1"
                    onMouseEnter={(e) => handlePairEnter(1, e)}
                    onMouseLeave={(e) => handlePairLeave(1, e)}
                    className="animate-on-scroll fade-up delay-100 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Ineffective Cold Calls
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Wasting time and money on cold calls that customers ignore.
                    </p>
                  </div>

                  {/* Problem 2 */}
                  <div
                    data-pair="2"
                    onMouseEnter={(e) => handlePairEnter(2, e)}
                    onMouseLeave={(e) => handlePairLeave(2, e)}
                    className="animate-on-scroll fade-up delay-200 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Lead Shortage
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Struggling to find new companies that are ready to ship right now.
                    </p>
                  </div>

                  {/* Problem 3 */}
                  <div
                    data-pair="3"
                    onMouseEnter={(e) => handlePairEnter(3, e)}
                    onMouseLeave={(e) => handlePairLeave(3, e)}
                    className="animate-on-scroll fade-up delay-300 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Blind Bidding
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Losing deals because you do not know the prices your competitors are offering.
                    </p>
                  </div>

                  {/* Row 2: Solutions Left Category Card */}
                  <div 
                    onMouseMove={handleSpotlightMouseMove}
                    className="spotlight-card solution-card animate-on-scroll fade-up bg-white/95 backdrop-blur-md border border-brand-orange/30 rounded-3xl p-6 flex flex-col justify-center self-center h-[180px] shadow-xl relative overflow-hidden group"
                  >
                    <h3 className="text-3xl md:text-4xl font-black text-brand-orange mb-2 relative z-10">FlexGO Solutions</h3>
                    <p className="text-sm font-medium text-brand-navy/70 leading-relaxed relative z-10">
                      How we turn challenges into results
                    </p>
                  </div>

                  {/* Solution 1 */}
                  <div
                    data-pair="1"
                    onMouseEnter={(e) => handlePairEnter(1, e)}
                    onMouseLeave={(e) => handlePairLeave(1, e)}
                    className="animate-on-scroll fade-up delay-100 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Live Lead Board
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Access a real-time list of hot shipping requests and get instant alerts for your best routes.
                    </p>
                  </div>

                  {/* Solution 2 */}
                  <div
                    data-pair="2"
                    onMouseEnter={(e) => handlePairEnter(2, e)}
                    onMouseLeave={(e) => handlePairLeave(2, e)}
                    className="animate-on-scroll fade-up delay-200 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      AI Storefront
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Let AI create a professional, searchable company profile for you in 60 seconds to attract clients online.
                    </p>
                  </div>

                  {/* Solution 3 */}
                  <div
                    data-pair="3"
                    onMouseEnter={(e) => handlePairEnter(3, e)}
                    onMouseLeave={(e) => handlePairLeave(3, e)}
                    className="animate-on-scroll fade-up delay-300 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Market Intelligence
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Use credits to reveal the buyer's contact info and see exactly what competitors are quoting.
                    </p>
                  </div>
                </div>
              </div>

              {/* Group 3: Carriers & Warehouses */}
              <div id="group-3" className={`value-group ${activeValueTab === 'group-3' ? 'flex' : 'hidden'} flex-col gap-10 relative`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
                  {/* Row 1: Left Category Card */}
                  <div 
                    onMouseMove={handleSpotlightMouseMove}
                    className="spotlight-card problem-card animate-on-scroll fade-up bg-white/95 backdrop-blur-md border border-white/50 rounded-3xl p-6 flex flex-col justify-center self-center h-[180px] shadow-xl relative overflow-hidden group"
                  >
                    <h3 className="text-3xl md:text-4xl font-black text-brand-navy mb-2 relative z-10">The Problems</h3>
                    <p className="text-sm font-medium text-brand-navy/70 leading-relaxed relative z-10">
                      Challenges that shaped our approach
                    </p>
                  </div>

                  {/* Problem 1 */}
                  <div
                    data-pair="1"
                    onMouseEnter={(e) => handlePairEnter(1, e)}
                    onMouseLeave={(e) => handlePairLeave(1, e)}
                    className="animate-on-scroll fade-up delay-100 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Empty Backhauls
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Losing money driving empty trucks on return trips.
                    </p>
                  </div>

                  {/* Problem 2 */}
                  <div
                    data-pair="2"
                    onMouseEnter={(e) => handlePairEnter(2, e)}
                    onMouseLeave={(e) => handlePairLeave(2, e)}
                    className="animate-on-scroll fade-up delay-200 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Idle Capacity
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Having empty warehouse spaces that generate no daily income.
                    </p>
                  </div>

                  {/* Problem 3 */}
                  <div
                    data-pair="3"
                    onMouseEnter={(e) => handlePairEnter(3, e)}
                    onMouseLeave={(e) => handlePairLeave(3, e)}
                    className="animate-on-scroll fade-up delay-300 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Costly Middlemen
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Paying high commissions to brokers just to get simple orders.
                    </p>
                  </div>

                  {/* Row 2: Solutions Left Category Card */}
                  <div 
                    onMouseMove={handleSpotlightMouseMove}
                    className="spotlight-card solution-card animate-on-scroll fade-up bg-white/95 backdrop-blur-md border border-brand-orange/30 rounded-3xl p-6 flex flex-col justify-center self-center h-[180px] shadow-xl relative overflow-hidden group"
                  >
                    <h3 className="text-3xl md:text-4xl font-black text-brand-orange mb-2 relative z-10">FlexGO Solutions</h3>
                    <p className="text-sm font-medium text-brand-navy/70 leading-relaxed relative z-10">
                      How we turn challenges into results
                    </p>
                  </div>

                  {/* Solution 1 */}
                  <div
                    data-pair="1"
                    onMouseEnter={(e) => handlePairEnter(1, e)}
                    onMouseLeave={(e) => handlePairLeave(1, e)}
                    className="animate-on-scroll fade-up delay-100 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Return Cargo Matching
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Find real-time cargo that matches your return trips to keep your trucks full both ways.
                    </p>
                  </div>

                  {/* Solution 2 */}
                  <div
                    data-pair="2"
                    onMouseEnter={(e) => handlePairEnter(2, e)}
                    onMouseLeave={(e) => handlePairLeave(2, e)}
                    className="animate-on-scroll fade-up delay-200 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Asset Listing
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Build a clear profile showing your empty warehouse space or available trucks so customers can search for you.
                    </p>
                  </div>

                  {/* Solution 3 */}
                  <div
                    data-pair="3"
                    onMouseEnter={(e) => handlePairEnter(3, e)}
                    onMouseLeave={(e) => handlePairLeave(3, e)}
                    className="animate-on-scroll fade-up delay-300 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent"
                  >
                    <h4 className="text-base font-bold text-brand-orange group-hover:text-brand-navy transition-colors duration-300 leading-tight mb-3 flex items-center gap-2">
                      Direct Connection
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      Deal directly with real manufacturers and exporters to skip brokers and keep 100% of your profit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 3: CATEGORIES SECTION (Explore Inquiry) */}
          {/* ------------------------------------------------------------- */}
          <section className="min-h-screen bg-transparent py-16 md:py-24 px-4 md:px-10 lg:px-20 border-t border-white/10 flex flex-col justify-center relative">
            <div className="max-w-7xl mx-auto w-full">
              <div className="text-center mb-16">
                <h2 className="animate-on-scroll fade-up delay-100 text-3xl md:text-5xl font-black text-brand-orange mb-6 tracking-tight drop-shadow-md">
                  Explore Inquiry
                </h2>
                <div className="animate-on-scroll fade-up delay-200 inline-flex items-center justify-center px-8 md:px-12 py-3 md:py-4 mx-auto max-w-full drop-shadow-xl">
                  <p className="text-sm md:text-base font-semibold text-white whitespace-normal md:whitespace-nowrap text-center drop-shadow-md">
                    Real shippers. Hot leads. Ready for your quotes
                  </p>
                </div>
              </div>

              {/* Grid 8 Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
                {/* Item 1 */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
                  className="animate-on-scroll fade-up bg-[#061218]/60 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-[0_20px_40px_-10px_rgba(255,107,53,0.3)] hover:-translate-y-3 hover:scale-[1.03] hover:bg-[#061218]/90 hover:border-brand-orange transition-all duration-500 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-5 group-hover:bg-brand-orange group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Truck className="w-6 h-6 text-[#1e40af] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-[13px] md:text-sm font-bold text-white mb-1.5 text-center">Domestic Transport</h3>
                  <p className="text-[11px] font-semibold text-white/60 flex items-center justify-center gap-1 mt-0.5">
                    <FileText className="w-3.5 h-3.5" /> 245 Inquiries
                  </p>
                </div>

                {/* Item 2 */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
                  className="animate-on-scroll fade-up bg-[#061218]/60 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-[0_20px_40px_-10px_rgba(255,107,53,0.3)] hover:-translate-y-3 hover:scale-[1.03] hover:bg-[#061218]/90 hover:border-brand-orange transition-all duration-500 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-5 group-hover:bg-brand-orange group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Ship className="w-6 h-6 text-[#1e40af] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-[13px] md:text-sm font-bold text-white mb-1.5 text-center">International Shipping</h3>
                  <p className="text-[11px] font-semibold text-white/60 flex items-center justify-center gap-1 mt-0.5">
                    <FileText className="w-3.5 h-3.5" /> 189 Inquiries
                  </p>
                </div>

                {/* Item 3 */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
                  className="animate-on-scroll fade-up bg-[#061218]/60 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-[0_20px_40px_-10px_rgba(255,107,53,0.3)] hover:-translate-y-3 hover:scale-[1.03] hover:bg-[#061218]/90 hover:border-brand-orange transition-all duration-500 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-5 group-hover:bg-brand-orange group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Warehouse className="w-6 h-6 text-[#1e40af] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-[13px] md:text-sm font-bold text-white mb-1.5 text-center">Warehousing</h3>
                  <p className="text-[11px] font-semibold text-white/60 flex items-center justify-center gap-1 mt-0.5">
                    <FileText className="w-3.5 h-3.5" /> 156 Inquiries
                  </p>
                </div>

                {/* Item 4 */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
                  className="animate-on-scroll fade-up bg-[#061218]/60 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-[0_20px_40px_-10px_rgba(255,107,53,0.3)] hover:-translate-y-3 hover:scale-[1.03] hover:bg-[#061218]/90 hover:border-brand-orange transition-all duration-500 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-5 group-hover:bg-brand-orange group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Landmark className="w-6 h-6 text-[#1e40af] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-[13px] md:text-sm font-bold text-white mb-1.5 text-center">Customs</h3>
                  <p className="text-[11px] font-semibold text-white/60 flex items-center justify-center gap-1 mt-0.5">
                    <FileText className="w-3.5 h-3.5" /> 98 Inquiries
                  </p>
                </div>

                {/* Item 5 */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
                  className="animate-on-scroll fade-up bg-[#061218]/60 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-[0_20px_40px_-10px_rgba(255,107,53,0.3)] hover:-translate-y-3 hover:scale-[1.03] hover:bg-[#061218]/90 hover:border-brand-orange transition-all duration-500 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-5 group-hover:bg-brand-orange group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Plane className="w-6 h-6 text-[#1e40af] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-[13px] md:text-sm font-bold text-white mb-1.5 text-center">Forwarding</h3>
                  <p className="text-[11px] font-semibold text-white/60 flex items-center justify-center gap-1 mt-0.5">
                    <FileText className="w-3.5 h-3.5" /> 134 Inquiries
                  </p>
                </div>

                {/* Item 6 */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
                  className="animate-on-scroll fade-up bg-[#061218]/60 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-[0_20px_40px_-10px_rgba(255,107,53,0.3)] hover:-translate-y-3 hover:scale-[1.03] hover:bg-[#061218]/90 hover:border-brand-orange transition-all duration-500 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-5 group-hover:bg-brand-orange group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Snowflake className="w-6 h-6 text-[#1e40af] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-[13px] md:text-sm font-bold text-white mb-1.5 text-center">Cold Chain</h3>
                  <p className="text-[11px] font-semibold text-white/60 flex items-center justify-center gap-1 mt-0.5">
                    <FileText className="w-3.5 h-3.5" /> 87 Inquiries
                  </p>
                </div>

                {/* Item 7 */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
                  className="animate-on-scroll fade-up bg-[#061218]/60 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-[0_20px_40px_-10px_rgba(255,107,53,0.3)] hover:-translate-y-3 hover:scale-[1.03] hover:bg-[#061218]/90 hover:border-brand-orange transition-all duration-500 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-5 group-hover:bg-brand-orange group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Navigation className="w-6 h-6 text-[#1e40af] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-[13px] md:text-sm font-bold text-white mb-1.5 text-center">Last Mile</h3>
                  <p className="text-[11px] font-semibold text-white/60 flex items-center justify-center gap-1 mt-0.5">
                    <FileText className="w-3.5 h-3.5" /> 203 Inquiries
                  </p>
                </div>

                {/* Item 8 */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
                  className="animate-on-scroll fade-up bg-[#061218]/60 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-[0_20px_40px_-10px_rgba(255,107,53,0.3)] hover:-translate-y-3 hover:scale-[1.03] hover:bg-[#061218]/90 hover:border-brand-orange transition-all duration-500 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-5 group-hover:bg-brand-orange group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Package className="w-6 h-6 text-[#1e40af] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-[13px] md:text-sm font-bold text-white mb-1.5 text-center">Project Cargo</h3>
                  <p className="text-[11px] font-semibold text-white/60 flex items-center justify-center gap-1 mt-0.5">
                    <FileText className="w-3.5 h-3.5" /> 78 Inquiries
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 4: TOP SUPPLIER (8 MEMBERS FULL SHOWCASE) */}
          {/* ------------------------------------------------------------- */}
          <section className="min-h-screen bg-transparent py-16 md:py-24 px-4 md:px-10 lg:px-20 flex flex-col justify-center relative">
            <div className="max-w-7xl mx-auto w-full relative z-10">
              <div className="text-center mb-16">
                <h2 className="animate-on-scroll fade-up delay-100 text-3xl md:text-5xl font-black text-brand-orange mb-6 tracking-tight drop-shadow-md">
                  Top Supplier
                </h2>
                <div className="animate-on-scroll fade-up delay-200 inline-flex items-center justify-center px-8 md:px-12 py-3 md:py-4 mx-auto max-w-full drop-shadow-xl">
                  <p className="text-sm md:text-base font-semibold text-white whitespace-normal md:whitespace-nowrap text-center drop-shadow-md">
                    Celebrating this month’s top suppliers across every logistics category on flexGO.
                  </p>
                </div>
              </div>

              {/* Grid 8 Supplier Members */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
                {/* Member 1: Lisa Thompson (DHL) */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'supplier-profile' })}
                  className="animate-on-scroll fade-up flex flex-col group items-start text-left bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:-translate-y-2 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop"
                    alt="Lisa Thompson"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-5 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 ring-4 ring-white/10"
                  />
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-gray-900 transition-colors duration-300 mb-1.5">
                    Lisa Thompson
                  </h3>
                  <p className="text-[11px] md:text-xs font-bold text-brand-orange uppercase tracking-wider mb-4">
                    DHL
                  </p>
                  <ul className="w-full space-y-2 mb-5">
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Profile Views:</span>
                      <span className="font-bold">85,200</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Inquiries:</span>
                      <span className="font-bold">8,946</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Quotes:</span>
                      <span className="font-bold">5,547</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Orders:</span>
                      <span className="font-bold">1,941</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Revenue:</span>
                      <span className="font-bold">$6.8M</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Top Service:</span>
                      <span className="font-bold">Domestic Transport</span>
                    </li>
                  </ul>
                  <div className="flex gap-4 text-white/40 group-hover:text-gray-400 transition-colors duration-300">
                    <span className="hover:text-brand-orange transition"><Linkedin className="w-4 h-4" /></span>
                    <span className="hover:text-brand-orange transition"><Twitter className="w-4 h-4" /></span>
                  </div>
                </div>

                {/* Member 2: Laura Davis (FedEx) */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'supplier-profile' })}
                  className="animate-on-scroll fade-up delay-100 flex flex-col group items-start text-left bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:-translate-y-2 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop"
                    alt="Laura Davis"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-5 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 ring-4 ring-white/10"
                  />
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-gray-900 transition-colors duration-300 mb-1.5">
                    Laura Davis
                  </h3>
                  <p className="text-[11px] md:text-xs font-bold text-brand-orange uppercase tracking-wider mb-4">
                    FedEx
                  </p>
                  <ul className="w-full space-y-2 mb-5">
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Profile Views:</span>
                      <span className="font-bold">72,150</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Inquiries:</span>
                      <span className="font-bold">7,576</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Quotes:</span>
                      <span className="font-bold">4,697</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Orders:</span>
                      <span className="font-bold">1,644</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Revenue:</span>
                      <span className="font-bold">$13.5M</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Top Service:</span>
                      <span className="font-bold">International Shipping</span>
                    </li>
                  </ul>
                  <div className="flex gap-4 text-white/40 group-hover:text-gray-400 transition-colors duration-300">
                    <span className="hover:text-brand-orange transition"><Linkedin className="w-4 h-4" /></span>
                  </div>
                </div>

                {/* Member 3: Tom White (UPS) */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'supplier-profile' })}
                  className="animate-on-scroll fade-up delay-200 flex flex-col group items-start text-left bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:-translate-y-2 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
                    alt="Tom White"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-5 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 ring-4 ring-white/10"
                  />
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-gray-900 transition-colors duration-300 mb-1.5">
                    Tom White
                  </h3>
                  <p className="text-[11px] md:text-xs font-bold text-brand-orange uppercase tracking-wider mb-4">
                    UPS
                  </p>
                  <ul className="w-full space-y-2 mb-5">
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Profile Views:</span>
                      <span className="font-bold">68,400</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Inquiries:</span>
                      <span className="font-bold">7,182</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Quotes:</span>
                      <span className="font-bold">4,453</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Orders:</span>
                      <span className="font-bold">1,559</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Revenue:</span>
                      <span className="font-bold">$2.3M</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Top Service:</span>
                      <span className="font-bold">Warehousing</span>
                    </li>
                  </ul>
                  <div className="flex gap-4 text-white/40 group-hover:text-gray-400 transition-colors duration-300">
                    <span className="hover:text-brand-orange transition"><Linkedin className="w-4 h-4" /></span>
                  </div>
                </div>

                {/* Member 4: James Wilson (Maersk) */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'supplier-profile' })}
                  className="animate-on-scroll fade-up delay-300 flex flex-col group items-start text-left bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:-translate-y-2 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&h=200&auto=format&fit=crop"
                    alt="James Wilson"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-5 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 ring-4 ring-white/10"
                  />
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-gray-900 transition-colors duration-300 mb-1.5">
                    James Wilson
                  </h3>
                  <p className="text-[11px] md:text-xs font-bold text-brand-orange uppercase tracking-wider mb-4">
                    Maersk
                  </p>
                  <ul className="w-full space-y-2 mb-5">
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Profile Views:</span>
                      <span className="font-bold">54,900</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Inquiries:</span>
                      <span className="font-bold">5,765</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Quotes:</span>
                      <span className="font-bold">3,574</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Orders:</span>
                      <span className="font-bold">1,251</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Revenue:</span>
                      <span className="font-bold">$1.5M</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Top Service:</span>
                      <span className="font-bold">Customs</span>
                    </li>
                  </ul>
                  <div className="flex gap-4 text-white/40 group-hover:text-gray-400 transition-colors duration-300">
                    <span className="hover:text-brand-orange transition"><Linkedin className="w-4 h-4" /></span>
                  </div>
                </div>

                {/* Member 5: Sarah Williams (DB Schenker) */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'supplier-profile' })}
                  className="animate-on-scroll fade-up flex flex-col group items-start text-left bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:-translate-y-2 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=format&fit=crop"
                    alt="Sarah Williams"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-5 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 ring-4 ring-white/10"
                  />
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-gray-900 transition-colors duration-300 mb-1.5">
                    Sarah Williams
                  </h3>
                  <p className="text-[11px] md:text-xs font-bold text-brand-orange uppercase tracking-wider mb-4">
                    DB Schenker
                  </p>
                  <ul className="w-full space-y-2 mb-5">
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Profile Views:</span>
                      <span className="font-bold">49,200</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Inquiries:</span>
                      <span className="font-bold">5,166</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Quotes:</span>
                      <span className="font-bold">3,203</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Orders:</span>
                      <span className="font-bold">1,121</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Revenue:</span>
                      <span className="font-bold">$5.0M</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Top Service:</span>
                      <span className="font-bold">Forwarding</span>
                    </li>
                  </ul>
                  <div className="flex gap-4 text-white/40 group-hover:text-gray-400 transition-colors duration-300">
                    <span className="hover:text-brand-orange transition"><Linkedin className="w-4 h-4" /></span>
                  </div>
                </div>

                {/* Member 6: David Miller (Kuehne+Nagel) */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'supplier-profile' })}
                  className="animate-on-scroll fade-up delay-100 flex flex-col group items-start text-left bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:-translate-y-2 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&auto=format&fit=crop"
                    alt="David Miller"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-5 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 ring-4 ring-white/10"
                  />
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-gray-900 transition-colors duration-300 mb-1.5">
                    David Miller
                  </h3>
                  <p className="text-[11px] md:text-xs font-bold text-brand-orange uppercase tracking-wider mb-4">
                    Kuehne+Nagel
                  </p>
                  <ul className="w-full space-y-2 mb-5">
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Profile Views:</span>
                      <span className="font-bold">41,500</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Inquiries:</span>
                      <span className="font-bold">4,358</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Quotes:</span>
                      <span className="font-bold">2,702</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Orders:</span>
                      <span className="font-bold">946</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Revenue:</span>
                      <span className="font-bold">$5.2M</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Top Service:</span>
                      <span className="font-bold">Cold Chain</span>
                    </li>
                  </ul>
                  <div className="flex gap-4 text-white/40 group-hover:text-gray-400 transition-colors duration-300">
                    <span className="hover:text-brand-orange transition"><Linkedin className="w-4 h-4" /></span>
                    <span className="hover:text-brand-orange transition"><Twitter className="w-4 h-4" /></span>
                  </div>
                </div>

                {/* Member 7: Emily Johnson (XPO Logistics) */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'supplier-profile' })}
                  className="animate-on-scroll fade-up delay-200 flex flex-col group items-start text-left bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:-translate-y-2 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop"
                    alt="Emily Johnson"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-5 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 ring-4 ring-white/10"
                  />
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-gray-900 transition-colors duration-300 mb-1.5">
                    Emily Johnson
                  </h3>
                  <p className="text-[11px] md:text-xs font-bold text-brand-orange uppercase tracking-wider mb-4">
                    XPO Logistics
                  </p>
                  <ul className="w-full space-y-2 mb-5">
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Profile Views:</span>
                      <span className="font-bold">36,800</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Inquiries:</span>
                      <span className="font-bold">3,864</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Quotes:</span>
                      <span className="font-bold">2,396</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Orders:</span>
                      <span className="font-bold">839</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Revenue:</span>
                      <span className="font-bold">$671K</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Top Service:</span>
                      <span className="font-bold">Last Mile</span>
                    </li>
                  </ul>
                  <div className="flex gap-4 text-white/40 group-hover:text-gray-400 transition-colors duration-300">
                    <span className="hover:text-brand-orange transition"><Linkedin className="w-4 h-4" /></span>
                    <span className="hover:text-brand-orange transition"><Twitter className="w-4 h-4" /></span>
                    <span className="hover:text-brand-orange transition"><Instagram className="w-4 h-4" /></span>
                  </div>
                </div>

                {/* Member 8: Jillie Bernard (C.H. Robinson) */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'supplier-profile' })}
                  className="animate-on-scroll fade-up delay-300 flex flex-col group items-start text-left bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:-translate-y-2 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=200&h=200&auto=format&fit=crop"
                    alt="Jillie Bernard"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-5 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 ring-4 ring-white/10"
                  />
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-gray-900 transition-colors duration-300 mb-1.5">
                    Jillie Bernard
                  </h3>
                  <p className="text-[11px] md:text-xs font-bold text-brand-orange uppercase tracking-wider mb-4">
                    C.H. Robinson
                  </p>
                  <ul className="w-full space-y-2 mb-5">
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Profile Views:</span>
                      <span className="font-bold">29,400</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Inquiries:</span>
                      <span className="font-bold">3,087</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Quotes:</span>
                      <span className="font-bold">1,914</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Orders:</span>
                      <span className="font-bold">670</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Revenue:</span>
                      <span className="font-bold">$8.4M</span>
                    </li>
                    <li className="flex items-center justify-between text-xs text-white/80 group-hover:text-gray-900 transition-colors duration-300">
                      <span className="text-white/50 group-hover:text-gray-600 transition-colors duration-300">Top Service:</span>
                      <span className="font-bold">Project Cargo</span>
                    </li>
                  </ul>
                  <div className="flex gap-4 text-white/40 group-hover:text-gray-400 transition-colors duration-300">
                    <span className="hover:text-brand-orange transition"><Linkedin className="w-4 h-4" /></span>
                    <span className="hover:text-brand-orange transition"><Twitter className="w-4 h-4" /></span>
                    <span className="hover:text-brand-orange transition"><Instagram className="w-4 h-4" /></span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 5: WHY US? SECTION & STATS ROW */}
          {/* ------------------------------------------------------------- */}
          <section className="min-h-screen bg-black/30 py-16 md:py-24 px-4 md:px-10 lg:px-20 border-t border-white/10 flex flex-col justify-center relative">
            <div className="max-w-7xl mx-auto w-full">
              <div className="text-center mb-16">
                <h2 className="animate-on-scroll fade-up delay-100 text-3xl md:text-5xl font-black text-brand-orange mb-6 tracking-tight drop-shadow-md">
                  Why Us?
                </h2>
                <div className="animate-on-scroll fade-up delay-200 inline-flex items-center justify-center px-8 md:px-12 py-3 md:py-4 mx-auto max-w-full drop-shadow-xl">
                  <p className="text-sm md:text-base font-semibold text-white whitespace-normal md:whitespace-nowrap text-center drop-shadow-md">
                    Building a more connected and transparent logistics ecosystem.
                  </p>
                </div>
              </div>

              {/* 4 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="animate-on-scroll fade-up bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col hover:bg-white hover:-translate-y-2 hover:shadow-xl transition-all duration-500 group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-6 group-hover:bg-brand-orange transition-colors duration-500">
                    <Shield className="w-6 h-6 text-brand-orange group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gray-900 transition-colors duration-500 mb-3">
                    100% Neutral Platform
                  </h3>
                  <p className="text-sm text-white/60 group-hover:text-gray-700 transition-colors duration-500 leading-relaxed font-medium">
                    We don't sell freight. We provide the pure infrastructure to connect, never to compete.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="animate-on-scroll fade-up delay-100 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col hover:bg-white hover:-translate-y-2 hover:shadow-xl transition-all duration-500 group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-6 group-hover:bg-brand-orange transition-colors duration-500">
                    <Zap className="w-6 h-6 text-brand-orange group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gray-900 transition-colors duration-500 mb-3">
                    More Choices
                  </h3>
                  <p className="text-sm text-white/60 group-hover:text-gray-700 transition-colors duration-500 leading-relaxed font-medium">
                    Discover and compare multiple logistics providers for every requirement.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="animate-on-scroll fade-up delay-200 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col hover:bg-white hover:-translate-y-2 hover:shadow-xl transition-all duration-500 group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-6 group-hover:bg-brand-orange transition-colors duration-500">
                    <CheckCircle2 className="w-6 h-6 text-brand-orange group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gray-900 transition-colors duration-500 mb-3">
                    Verified Network
                  </h3>
                  <p className="text-sm text-white/60 group-hover:text-gray-700 transition-colors duration-500 leading-relaxed font-medium">
                    Transact with confidence. Every partner is strictly vetted with our "Blue Badge" verification.
                  </p>
                </div>

                {/* Card 4 */}
                <div className="animate-on-scroll fade-up delay-300 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col hover:bg-white hover:-translate-y-2 hover:shadow-xl transition-all duration-500 group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-6 group-hover:bg-brand-orange transition-colors duration-500">
                    <Coins className="w-6 h-6 text-brand-orange group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gray-900 transition-colors duration-500 mb-3">
                    Zero Commissions
                  </h3>
                  <p className="text-sm text-white/60 group-hover:text-gray-700 transition-colors duration-500 leading-relaxed font-medium">
                    Free for shippers. Micro-credits for suppliers. Keep 100% of your margins with zero hidden markups.
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center w-full">
                <div className="animate-on-scroll fade-up flex flex-col items-center justify-center">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-1 flex items-baseline">
                    <span className="text-brand-orange drop-shadow-md">25K+</span>
                  </h2>
                  <p className="text-[11px] md:text-sm lg:text-base font-bold text-white tracking-widest mt-2">
                    Inquiries per month
                  </p>
                </div>
                <div className="animate-on-scroll fade-up delay-100 flex flex-col items-center justify-center">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-1 flex items-baseline">
                    <span className="text-brand-orange drop-shadow-md">5K+</span>
                  </h2>
                  <p className="text-[11px] md:text-sm lg:text-base font-bold text-white tracking-widest mt-2">
                    Regular Clients
                  </p>
                </div>
                <div className="animate-on-scroll fade-up delay-200 flex flex-col items-center justify-center">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-1 flex items-baseline">
                    <span className="text-brand-orange drop-shadow-md">1.5K+</span>
                  </h2>
                  <p className="text-[11px] md:text-sm lg:text-base font-bold text-white tracking-widest mt-2">
                    Verified Logistics provider
                  </p>
                </div>
                <div className="animate-on-scroll fade-up delay-300 flex flex-col items-center justify-center">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-1 flex items-baseline">
                    <span className="text-brand-orange drop-shadow-md">10K/mo</span>
                  </h2>
                  <p className="text-[11px] md:text-sm lg:text-base font-bold text-white tracking-widest mt-2">
                    Matching Inquiries per month
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 6: PRICING SECTION */}
          {/* ------------------------------------------------------------- */}
          <section className="min-h-screen bg-transparent py-16 md:py-24 px-4 md:px-10 lg:px-20 flex flex-col items-center justify-center border-b border-white/10 relative">
            <div className="max-w-7xl mx-auto w-full relative z-10">
              <div className="text-center mb-16">
                <h2 className="animate-on-scroll fade-up delay-100 text-3xl md:text-5xl font-black text-brand-orange mb-6 tracking-tight drop-shadow-md">
                  Pricing
                </h2>
                <div className="animate-on-scroll fade-up delay-200 inline-flex items-center justify-center px-8 md:px-12 py-3 md:py-4 mx-auto max-w-full drop-shadow-xl">
                  <p className="text-sm md:text-base font-semibold text-white text-center drop-shadow-md">
                    <span className="font-black text-brand-orange text-lg drop-shadow-md">Free for Shippers.</span> Flexible plans for Suppliers, pay as you grow.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {/* Plan 1: STARTER */}
                <div className="animate-on-scroll fade-up bg-black/40 backdrop-blur-md border-2 border-brand-orange shadow-[0_0_40px_rgba(255,94,20,0.15)] rounded-3xl p-8 flex flex-col relative md:-translate-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-brand-orange/20 text-brand-orange px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      STARTER
                    </span>
                    <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">
                      MOST POPULAR
                    </span>
                  </div>
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-black text-brand-orange">$0.9</span>
                    <span className="text-white/50 text-sm ml-1">/ month</span>
                  </div>
                  <p className="text-white/70 text-sm mb-8">Start winning on FlexGO</p>

                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-start gap-3 text-sm text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Create supplier profile
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Browse relevant leads
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Receive lead notifications
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Submit quotes
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Supplier verification
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Basic analytics
                    </li>
                  </ul>

                  <div className="text-brand-orange/80 text-xs font-semibold mb-4 text-center">
                    Contact unlock: $1.9 each
                  </div>
                  <button 
                    onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : null}
                    className="mt-auto w-full py-4 rounded-xl bg-brand-orange hover:bg-[#e04b06] text-white font-bold transition-all text-sm shadow-[0_0_20px_rgba(255,94,20,0.4)] cursor-pointer"
                  >
                    Get Started
                  </button>
                </div>

                {/* Plan 2: PRO */}
                <div className="animate-on-scroll fade-up delay-100 bg-black/40 backdrop-blur-md border-2 border-white/10 shadow-none hover:shadow-[0_0_40px_rgba(255,94,20,0.15)] rounded-3xl p-8 flex flex-col group hover:border-brand-orange hover:-translate-y-4 transition-all duration-500 relative">
                  <span className="bg-white/10 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 self-start">
                    PRO
                  </span>
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-black text-white">$19</span>
                    <span className="text-white/50 text-sm ml-1">/ month</span>
                  </div>
                  <p className="text-white/70 text-sm mb-8">Win more business with more reach</p>

                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      15 contact unlocks included
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Priority listing
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Verified Supplier badge
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Smart lead matching
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Advanced insights
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Priority notifications
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      1× profile promotion/month
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Priority support
                    </li>
                  </ul>

                  <div className="text-white/60 text-xs font-semibold mb-4 text-center">
                    Additional unlock: $1.5
                  </div>
                  <button 
                    onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : null}
                    className="mt-auto w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all text-sm cursor-pointer"
                  >
                    Developing
                  </button>
                </div>

                {/* Plan 3: BUSINESS */}
                <div className="animate-on-scroll fade-up delay-200 bg-black/40 backdrop-blur-md border-2 border-white/10 shadow-none hover:shadow-[0_0_40px_rgba(255,94,20,0.15)] rounded-3xl p-8 flex flex-col group hover:border-brand-orange hover:-translate-y-4 transition-all duration-500 relative">
                  <span className="bg-white/10 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 self-start">
                    BUSINESS
                  </span>
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-black text-white">$49</span>
                    <span className="text-white/50 text-sm ml-1">/ month</span>
                  </div>
                  <p className="text-white/70 text-sm mb-8">Scale faster with FlexGO</p>

                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      50 contact unlocks included
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Top placement
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Featured Supplier profile
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      AI-powered lead matching
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Advanced analytics
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Priority access to leads
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      4× profile promotion/month
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Multiple team members
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Dedicated support
                    </li>
                  </ul>

                  <div className="text-white/60 text-xs font-semibold mb-4 text-center">
                    Additional unlock: $1.0
                  </div>
                  <button 
                    onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : null}
                    className="mt-auto w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all text-sm cursor-pointer"
                  >
                    Developing
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 7: TRUSTED BY / NETWORK GRAPH SECTION */}
          {/* ------------------------------------------------------------- */}
          <section className="w-full bg-transparent py-16 md:py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="text-center mb-16 animate-on-scroll fade-up">
                <h2 className="text-3xl md:text-5xl font-black text-brand-orange drop-shadow-md mb-4 tracking-tight">
                  Trusted By
                </h2>
                <div className="animate-on-scroll fade-up delay-200 inline-flex items-center justify-center px-8 md:px-12 py-3 md:py-4 mx-auto drop-shadow-xl">
                  <p className="text-sm md:text-base font-semibold text-white whitespace-nowrap drop-shadow-md">
                    Where businesses meet trusted logistics partners.
                  </p>
                </div>
              </div>

              {/* Network Graph Layout (Desktop) */}
              <div className="relative w-full aspect-[4/3] md:aspect-[2/1] max-w-7xl mx-auto hidden md:block animate-on-scroll fade-up delay-100 mt-10">
                {/* SVG Connecting Lines (Single Origin Point per side radiating to 40 logos) */}
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
                  {/* Origin Pulse Anchor Nodes */}
                  <circle cx="42" cy="50" r="1" fill="#ff5e14" />
                  <circle cx="58" cy="50" r="1" fill="#ff5e14" />

                  <g stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" fill="none" strokeDasharray="4 4">
                    {/* Left Carriers (20 Lines - All Starting from Single Origin: X=42, Y=50) */}
                    {/* Row 1 (Y = 10%) */}
                    <path d="M 42 50 C 34 26, 10 12, 5 10" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 C 36 29, 19 14, 15 10" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 C 38 32, 28 16, 25 10" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 C 40 35, 37 18, 35 10" vectorEffect="non-scaling-stroke" />

                    {/* Row 2 (Y = 30%) */}
                    <path d="M 42 50 C 31 36, 10 31, 5 30" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 C 34 38, 19 32, 15 30" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 C 37 40, 28 33, 25 30" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 C 40 42, 37 34, 35 30" vectorEffect="non-scaling-stroke" />

                    {/* Row 3 (Y = 50%) */}
                    <path d="M 42 50 C 33 46, 11 47, 5 50" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 C 35 47, 19 48, 15 50" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 C 37 48, 28 49, 25 50" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 L 35 50" vectorEffect="non-scaling-stroke" />

                    {/* Row 4 (Y = 70%) */}
                    <path d="M 42 50 C 31 64, 10 69, 5 70" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 C 34 62, 19 68, 15 70" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 C 37 60, 28 67, 25 70" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 C 40 58, 37 66, 35 70" vectorEffect="non-scaling-stroke" />

                    {/* Row 5 (Y = 90%) */}
                    <path d="M 42 50 C 34 74, 10 88, 5 90" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 C 36 71, 19 86, 15 90" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 C 38 68, 28 84, 25 90" vectorEffect="non-scaling-stroke" />
                    <path d="M 42 50 C 40 65, 37 82, 35 90" vectorEffect="non-scaling-stroke" />

                    {/* Right Shippers (20 Lines - All Starting from Single Origin: X=58, Y=50) */}
                    {/* Row 1 (Y = 10%) */}
                    <path d="M 58 50 C 66 26, 90 12, 95 10" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 C 64 29, 81 14, 85 10" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 C 62 32, 72 16, 75 10" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 C 60 35, 63 18, 65 10" vectorEffect="non-scaling-stroke" />

                    {/* Row 2 (Y = 30%) */}
                    <path d="M 58 50 C 69 36, 90 31, 95 30" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 C 66 38, 81 32, 85 30" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 C 63 40, 72 33, 75 30" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 C 60 42, 63 34, 65 30" vectorEffect="non-scaling-stroke" />

                    {/* Row 3 (Y = 50%) */}
                    <path d="M 58 50 C 67 46, 89 47, 95 50" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 C 65 47, 81 48, 85 50" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 C 63 48, 72 49, 75 50" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 L 65 50" vectorEffect="non-scaling-stroke" />

                    {/* Row 4 (Y = 70%) */}
                    <path d="M 58 50 C 69 64, 90 69, 95 70" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 C 66 62, 81 68, 85 70" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 C 63 60, 72 67, 75 70" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 C 60 58, 63 66, 65 70" vectorEffect="non-scaling-stroke" />

                    {/* Row 5 (Y = 90%) */}
                    <path d="M 58 50 C 66 74, 90 88, 95 90" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 C 64 71, 81 86, 85 90" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 C 62 68, 72 84, 75 90" vectorEffect="non-scaling-stroke" />
                    <path d="M 58 50 C 60 65, 63 82, 65 90" vectorEffect="non-scaling-stroke" />
                  </g>
                </svg>

                {/* Center Block (flexGO Text) */}
                <div 
                  onClick={() => onNavigate({ type: 'public', tab: 'home' })}
                  className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20 cursor-pointer"
                >
                  <h1 className="font-black text-white text-3xl lg:text-4xl tracking-tighter drop-shadow-2xl mb-2 hover:text-brand-orange hover:scale-110 transition-all duration-300">
                    flex<span className="font-bold">GO</span>
                  </h1>
                  <p className="font-bold text-white/80 text-[10px] lg:text-xs tracking-[0.3em] uppercase drop-shadow-md">
                    Always Best Price
                  </p>
                </div>

                {/* Left Nodes (Shippers) - 20 Nodes */}
                <div className="absolute left-[5%] top-[10%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#FFCC00] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-[#D40511] italic text-[8px] lg:text-[11px] tracking-tighter">DHL</span>
                </div>
                <div className="absolute left-[15%] top-[10%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-[#4D148C] text-[8px] lg:text-[11px] tracking-tighter">Fed<span className="text-[#FF6600]">Ex</span></span>
                </div>
                <div className="absolute left-[25%] top-[10%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#351C15] rounded-xl shadow-lg border border-[#FFB500]/50 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-[#FFB500] text-[8px] lg:text-[11px] lowercase tracking-widest">ups</span>
                </div>
                <div className="absolute left-[35%] top-[10%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#42B4E6] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-white text-[7px] lg:text-[9px] tracking-widest">MAERSK</span>
                </div>
                <div className="absolute left-[5%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#FFD100] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-black text-[8px] lg:text-[11px] tracking-tighter">MSC</span>
                </div>
                <div className="absolute left-[15%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#003366] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-white text-[8px] lg:text-[11px]">DSV</span>
                </div>
                <div className="absolute left-[25%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#002A54] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-white text-[7px] lg:text-[9px] leading-tight text-center tracking-widest">CMA<br />CGM</span>
                </div>
                <div className="absolute left-[35%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-black rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-white text-[6px] lg:text-[8px] leading-tight text-center">DB<br />SCHENKER</span>
                </div>
                <div className="absolute left-[5%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#F37021] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-[#004A8F] text-[7px] lg:text-[9px] leading-tight text-center tracking-tighter">Hapag<br />Lloyd</span>
                </div>
                <div className="absolute left-[15%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#003366] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-white text-[8px] lg:text-[11px]">K+N</span>
                </div>
                <div className="absolute left-[25%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#E60012] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-white text-[7px] lg:text-[9px] tracking-tight">NIPPON</span>
                </div>
                <div className="absolute left-[35%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#004B87] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-white text-[8px] lg:text-[11px] tracking-widest">C.H.R</span>
                </div>
                <div className="absolute left-[5%] top-[70%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-black text-[7px] lg:text-[9px] italic">Expeditors</span>
                </div>
                <div className="absolute left-[15%] top-[70%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#003C71] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-white text-[7px] lg:text-[9px]">PANALPINA</span>
                </div>
                <div className="absolute left-[25%] top-[70%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#0055A4] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-white text-[8px] lg:text-[11px]">GEODIS</span>
                </div>
                <div className="absolute left-[35%] top-[70%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#00893F] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-white text-[8px] lg:text-[11px]">TOLL</span>
                </div>
                <div className="absolute left-[5%] top-[90%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#E31837] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-white text-[8px] lg:text-[11px] italic">XPO</span>
                </div>
                <div className="absolute left-[15%] top-[90%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#006039] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-white text-[7px] lg:text-[9px] tracking-widest">EVERGREEN</span>
                </div>
                <div className="absolute left-[25%] top-[90%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-xl shadow-lg border border-[#ED1B24] border-b-[4px] flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-black text-[8px] lg:text-[11px] italic">OOCL</span>
                </div>
                <div className="absolute left-[35%] top-[90%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#005596] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-white text-[8px] lg:text-[11px]">ZIM</span>
                </div>

                {/* Right Nodes (Suppliers) - 20 Nodes */}
                <div className="absolute left-[65%] top-[10%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-black text-[7px] lg:text-[10px]">amazon</span>
                </div>
                <div className="absolute left-[75%] top-[10%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#0071CE] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-white text-[7px] lg:text-[10px] tracking-wide">Walmart</span>
                </div>
                <div className="absolute left-[85%] top-[10%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#FF6A00] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-white text-[8px] lg:text-[11px] italic">Alibaba</span>
                </div>
                <div className="absolute left-[95%] top-[10%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#95BF47] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-white text-[8px] lg:text-[11px]">Shopify</span>
                </div>
                <div className="absolute left-[65%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#CC0000] rounded-full shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <div className="w-4 h-4 lg:w-6 lg:h-6 rounded-full border-[3px] border-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-white"></div>
                  </div>
                </div>
                <div className="absolute left-[75%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-black italic text-[8px] lg:text-[11px] tracking-tighter">NIKE</span>
                </div>
                <div className="absolute left-[85%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#0051BA] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-[#FFCC00] text-[8px] lg:text-[11px] tracking-widest">IKEA</span>
                </div>
                <div className="absolute left-[95%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-[12px] lg:text-[16px] tracking-tighter leading-none">
                    <span className="text-[#E53238]">e</span><span className="text-[#0064D2]">b</span><span className="text-[#F5AF02]">a</span><span className="text-[#86B817]">y</span>
                  </span>
                </div>
                <div className="absolute left-[65%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#1428A0] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-white text-[7px] lg:text-[9px] tracking-tight">SAMSUNG</span>
                </div>
                <div className="absolute left-[75%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-light text-blue-600 text-[8px] lg:text-[11px] tracking-widest">DELL</span>
                </div>
                <div className="absolute left-[85%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#0046BE] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-[#FFF200] text-[7px] lg:text-[9px] text-center leading-none">BEST<br />BUY</span>
                </div>
                <div className="absolute left-[95%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#F96302] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-white text-[7px] lg:text-[9px] text-center leading-none">HOME<br />DEPOT</span>
                </div>
                <div className="absolute left-[65%] top-[70%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-[#CC0000] text-[8px] lg:text-[11px]">CVS</span>
                </div>
                <div className="absolute left-[75%] top-[70%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#E31837] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-white text-[7px] lg:text-[9px] italic">Walgreens</span>
                </div>
                <div className="absolute left-[85%] top-[70%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-xl shadow-lg border border-[#0054A4] border-[2px] flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-[#0054A4] text-[8px] lg:text-[11px]">Kroger</span>
                </div>
                <div className="absolute left-[95%] top-[70%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-[#E31837] text-[8px] lg:text-[11px]">COSTCO</span>
                </div>
                <div className="absolute left-[65%] top-[90%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#004890] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-white text-[8px] lg:text-[10px]">LOWE'S</span>
                </div>
                <div className="absolute left-[75%] top-[90%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#E2231A] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-black text-white text-[8px] lg:text-[11px]">JD.com</span>
                </div>
                <div className="absolute left-[85%] top-[90%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#BF0000] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-white text-[8px] lg:text-[10px]">Rakuten</span>
                </div>
                <div className="absolute left-[95%] top-[90%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-14 lg:h-14 bg-[#EE4D2D] rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer z-10">
                  <span className="font-bold text-white text-[8px] lg:text-[11px]">Shopee</span>
                </div>
              </div>

              {/* Mobile Fallback Grid */}
              <div className="md:hidden flex flex-col gap-8 mt-8 animate-on-scroll fade-up delay-100">
                <div className="text-center">
                  <div className="grid grid-cols-5 gap-2 px-2">
                    <div className="aspect-square bg-[#FFCC00] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-[#D40511] italic text-[10px] tracking-tighter">DHL</span>
                    </div>
                    <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-[#4D148C] text-[8px] tracking-tighter">Fed<span className="text-[#FF6600]">Ex</span></span>
                    </div>
                    <div className="aspect-square bg-[#351C15] rounded-xl shadow-lg border border-[#FFB500]/50 flex items-center justify-center">
                      <span className="font-bold text-[#FFB500] text-[10px] lowercase tracking-widest">ups</span>
                    </div>
                    <div className="aspect-square bg-[#42B4E6] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-white text-[7px] tracking-widest">MAERSK</span>
                    </div>
                    <div className="aspect-square bg-[#FFD100] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-black text-[10px] tracking-tighter">MSC</span>
                    </div>
                    <div className="aspect-square bg-[#003366] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-white text-[10px]">DSV</span>
                    </div>
                    <div className="aspect-square bg-[#002A54] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-white text-[7px] leading-tight text-center tracking-widest">CMA<br />CGM</span>
                    </div>
                    <div className="aspect-square bg-black rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-white text-[6px] leading-tight text-center">DB<br />SCHENKER</span>
                    </div>
                    <div className="aspect-square bg-[#F37021] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-[#004A8F] text-[7px] leading-tight text-center tracking-tighter">Hapag<br />Lloyd</span>
                    </div>
                    <div className="aspect-square bg-[#003366] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-white text-[8px]">K+N</span>
                    </div>
                    <div className="aspect-square bg-[#E60012] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-white text-[7px] tracking-tight">NIPPON</span>
                    </div>
                    <div className="aspect-square bg-[#004B87] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-white text-[7px] tracking-widest">C.H.R</span>
                    </div>
                    <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-black text-[6px] italic">Expeditors</span>
                    </div>
                    <div className="aspect-square bg-[#003C71] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-white text-[6px]">PANALPINA</span>
                    </div>
                    <div className="aspect-square bg-[#0055A4] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-white text-[7px]">GEODIS</span>
                    </div>
                    <div className="aspect-square bg-[#00893F] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-white text-[7px]">TOLL</span>
                    </div>
                    <div className="aspect-square bg-[#E31837] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-white text-[8px] italic">XPO</span>
                    </div>
                    <div className="aspect-square bg-[#006039] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-white text-[6px] tracking-widest">EVERGREEN</span>
                    </div>
                    <div className="aspect-square bg-white rounded-xl shadow-lg border-b-[2px] border-[#ED1B24] flex items-center justify-center">
                      <span className="font-black text-black text-[7px] italic">OOCL</span>
                    </div>
                    <div className="aspect-square bg-[#005596] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-white text-[8px]">ZIM</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center my-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <h1 className="font-black text-white text-4xl tracking-tighter drop-shadow-2xl mb-1">
                      flex<span className="font-bold">GO</span>
                    </h1>
                    <p className="font-bold text-white/80 text-[10px] tracking-[0.25em] uppercase drop-shadow-md">
                      Always Best Price
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="grid grid-cols-5 gap-2 px-2">
                    <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-black text-[10px]">amazon</span>
                    </div>
                    <div className="aspect-square bg-[#0071CE] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-white text-[7px] tracking-wide">Walmart</span>
                    </div>
                    <div className="aspect-square bg-[#FF6A00] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-white text-[8px] italic">Alibaba</span>
                    </div>
                    <div className="aspect-square bg-[#95BF47] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-white text-[8px]">Shopify</span>
                    </div>
                    <div className="aspect-square bg-[#CC0000] rounded-full shadow-lg flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full border-[2px] border-white flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-white"></div>
                      </div>
                    </div>
                    <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-black italic text-[10px] tracking-tighter">NIKE</span>
                    </div>
                    <div className="aspect-square bg-[#0051BA] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-[#FFCC00] text-[9px] tracking-widest">IKEA</span>
                    </div>
                    <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-[10px] tracking-tighter leading-none">
                        <span className="text-[#E53238]">e</span><span className="text-[#0064D2]">b</span><span className="text-[#F5AF02]">a</span><span className="text-[#86B817]">y</span>
                      </span>
                    </div>
                    <div className="aspect-square bg-[#1428A0] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-white text-[7px] tracking-tight">SAMSUNG</span>
                    </div>
                    <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-light text-blue-600 text-[9px] tracking-widest">DELL</span>
                    </div>
                    <div className="aspect-square bg-[#0046BE] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-[#FFF200] text-[7px] text-center leading-none">BEST<br />BUY</span>
                    </div>
                    <div className="aspect-square bg-[#F96302] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-white text-[6px] text-center leading-none">HOME<br />DEPOT</span>
                    </div>
                    <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-[#CC0000] text-[9px]">CVS</span>
                    </div>
                    <div className="aspect-square bg-[#E31837] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-white text-[7px] italic">Walgreens</span>
                    </div>
                    <div className="aspect-square bg-white rounded-xl shadow-lg border border-[#0054A4] flex items-center justify-center">
                      <span className="font-bold text-[#0054A4] text-[7px]">Kroger</span>
                    </div>
                    <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-[#E31837] text-[7px]">COSTCO</span>
                    </div>
                    <div className="aspect-square bg-[#004890] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-white text-[7px]">LOWE'S</span>
                    </div>
                    <div className="aspect-square bg-[#E2231A] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-black text-white text-[7px]">JD.com</span>
                    </div>
                    <div className="aspect-square bg-[#BF0000] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-white text-[7px]">Rakuten</span>
                    </div>
                    <div className="aspect-square bg-[#EE4D2D] rounded-xl shadow-lg flex items-center justify-center">
                      <span className="font-bold text-white text-[7px]">Shopee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 8: MISSION & VISION CARDS (DARK THEME) */}
          {/* ------------------------------------------------------------- */}
          <section className="min-h-screen bg-transparent py-16 md:py-24 px-4 md:px-10 lg:px-20 flex flex-col items-center justify-center">
            <div className="max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[500px]">
                {/* Left Content Box: Our Mission */}
                <div className="group rounded-xl bg-black/40 backdrop-blur-md border border-white/10 p-10 md:p-12 shadow-2xl flex flex-col h-full hover:bg-white transition-all duration-300 cursor-default">
                  <h3 className="text-3xl md:text-4xl font-black text-brand-orange leading-tight uppercase mb-8 drop-shadow-md">
                    OUR<br />MISSION
                  </h3>
                  <p className="text-sm text-white/70 group-hover:text-gray-900 transition-colors duration-300 leading-relaxed mb-6 font-medium">
                    To transform B2B logistics by providing a seamless, transparent, and AI-driven platform. We empower businesses to connect real shipping needs with verified capacity in minutes, rather than days.
                  </p>
                  <p className="text-sm text-white/70 group-hover:text-gray-900 transition-colors duration-300 leading-relaxed font-medium">
                    We are deeply committed to eliminating market chaos and hidden markups. By reducing supply chain complexities through smart technology, we build a fair, fast, and secure ecosystem where every player thrives.
                  </p>
                </div>

                {/* Middle Spacer */}
                <div className="hidden md:block"></div>

                {/* Right Content Box: Our Vision */}
                <div className="group rounded-xl bg-black/40 backdrop-blur-md border border-white/10 p-10 md:p-12 shadow-2xl flex flex-col h-full hover:bg-white transition-all duration-300 cursor-default">
                  <h3 className="text-3xl md:text-4xl font-black text-brand-orange leading-tight uppercase mb-8 drop-shadow-md">
                    OUR<br />VISION
                  </h3>
                  <p className="text-sm text-white/70 group-hover:text-gray-900 transition-colors duration-300 leading-relaxed mb-6 font-medium">
                    FlexGo aims to be the core digital infrastructure for Southeast Asia's logistics. We are building the ultimate operating system where every B2B freight transaction flows seamlessly through a single, intelligent network.
                  </p>
                  <p className="text-sm text-white/70 group-hover:text-gray-900 transition-colors duration-300 leading-relaxed font-medium">
                    By replacing manual processes with AI-driven matching, we unlock the full potential of regional trade. We believe transparent logistics will elevate Vietnam's position on the global stage, helping businesses scale smarter.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 9: OUR CREW / LEADERSHIP TEAM */}
          {/* ------------------------------------------------------------- */}
          <section className="min-h-screen bg-transparent py-16 md:py-24 px-4 md:px-10 lg:px-20 flex flex-col items-center relative">
            <div className="max-w-7xl mx-auto w-full flex flex-col justify-between h-full flex-grow">
              <div className="text-center">
                <h2 className="animate-on-scroll fade-up delay-100 text-3xl md:text-5xl font-black text-brand-orange mb-6 tracking-tight drop-shadow-md">
                  Our Crew
                </h2>
                <div className="animate-on-scroll fade-up delay-200 inline-flex items-center justify-center px-8 md:px-12 py-3 md:py-4 mx-auto drop-shadow-xl">
                  <p className="text-sm md:text-base font-semibold text-white whitespace-nowrap drop-shadow-md">
                    We believe transparent logistics powered by AI will elevate Vietnam’s true potential to the world.
                  </p>
                </div>
              </div>

              {/* Team Grid */}
              <div className="relative w-full mt-24 md:mt-32 mb-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 lg:gap-20 relative z-10 px-4">
                  {/* Person 1: Jay */}
                  <div className="animate-on-scroll fade-up relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden group shadow-2xl hover:shadow-[0_20px_50px_rgba(255,107,0,0.15)] bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none"></div>

                    <div className="absolute bottom-0 left-0 w-full grid grid-cols-3 z-10">
                      <div className="aspect-square bg-black/40 backdrop-blur-md border-t border-r border-white/20 p-2 sm:p-4 flex flex-col justify-between hover:bg-black/60 transition-colors">
                        <span className="text-white text-[10px] sm:text-xs font-semibold leading-tight text-left">
                          7+ Yrs<br />Exp
                        </span>
                        <span className="text-brand-orange font-light text-lg leading-none text-left">+</span>
                      </div>
                      <div className="aspect-square bg-brand-orange p-2 sm:p-4 flex flex-col justify-between">
                        <span className="text-black/50 font-black uppercase text-[8px] sm:text-[9px] tracking-wider text-left">
                          CFO
                        </span>
                        <h3 className="text-white font-bold text-[10px] sm:text-xs md:text-sm leading-tight text-left whitespace-nowrap">
                          Hi,<br />I'm Jay
                        </h3>
                      </div>
                      <div className="aspect-square bg-black/40 backdrop-blur-md border-t border-l border-white/20 p-2 sm:p-4 flex flex-col justify-between hover:bg-black/60 transition-colors">
                        <span className="text-white text-[10px] sm:text-xs font-semibold leading-tight text-left">
                          Fundraising<br />& Financing
                        </span>
                        <span className="text-brand-orange font-light text-lg leading-none text-left">+</span>
                      </div>
                    </div>
                  </div>

                  {/* Person 2: Hieu */}
                  <div className="animate-on-scroll fade-up delay-100 relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden group shadow-2xl hover:shadow-[0_20px_50px_rgba(255,107,0,0.15)] bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none"></div>

                    <div className="absolute bottom-0 left-0 w-full grid grid-cols-3 z-10">
                      <div className="aspect-square bg-black/40 backdrop-blur-md border-t border-r border-white/20 p-2 sm:p-4 flex flex-col justify-between hover:bg-black/60 transition-colors">
                        <span className="text-white text-[10px] sm:text-xs font-semibold leading-tight text-left">
                          5+ Yrs<br />Exp
                        </span>
                        <span className="text-brand-orange font-light text-lg leading-none text-left">+</span>
                      </div>
                      <div className="aspect-square bg-brand-orange p-2 sm:p-4 flex flex-col justify-between">
                        <span className="text-black/50 font-black uppercase text-[8px] sm:text-[9px] tracking-wider text-left">
                          Founder
                        </span>
                        <h3 className="text-white font-bold text-[10px] sm:text-xs md:text-sm leading-tight text-left whitespace-nowrap">
                          Hi,<br />I'm Hieu
                        </h3>
                      </div>
                      <div className="aspect-square bg-black/40 backdrop-blur-md border-t border-l border-white/20 p-2 sm:p-4 flex flex-col justify-between hover:bg-black/60 transition-colors">
                        <span className="text-white text-[10px] sm:text-xs font-semibold leading-tight text-left">
                          Growth<br />Expert
                        </span>
                        <span className="text-brand-orange font-light text-lg leading-none text-left">+</span>
                      </div>
                    </div>
                  </div>

                  {/* Person 3: Steven */}
                  <div className="animate-on-scroll fade-up delay-200 relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden group shadow-2xl hover:shadow-[0_20px_50px_rgba(255,107,0,0.15)] bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none"></div>

                    <div className="absolute bottom-0 left-0 w-full grid grid-cols-3 z-10">
                      <div className="aspect-square bg-black/40 backdrop-blur-md border-t border-r border-white/20 p-2 sm:p-4 flex flex-col justify-between hover:bg-black/60 transition-colors">
                        <span className="text-white text-[10px] sm:text-xs font-semibold leading-tight text-left">
                          8+ Yrs<br />Exp
                        </span>
                        <span className="text-brand-orange font-light text-lg leading-none text-left">+</span>
                      </div>
                      <div className="aspect-square bg-brand-orange p-2 sm:p-4 flex flex-col justify-between">
                        <span className="text-black/50 font-black uppercase text-[8px] sm:text-[9px] tracking-wider text-left">
                          CTO
                        </span>
                        <h3 className="text-white font-bold text-[10px] sm:text-xs md:text-sm leading-tight text-left whitespace-nowrap tracking-tight">
                          Hi,<br />I'm Steven
                        </h3>
                      </div>
                      <div className="aspect-square bg-black/40 backdrop-blur-md border-t border-l border-white/20 p-2 sm:p-4 flex flex-col justify-between hover:bg-black/60 transition-colors">
                        <span className="text-white text-[10px] sm:text-xs font-semibold leading-tight text-left">
                          Software<br />Engineering
                        </span>
                        <span className="text-brand-orange font-light text-lg leading-none text-left">+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATISTICS BANNER (LIGHT BANNER) */}
      {/* ========================================================================= */}
      <section className="bg-[#f8f9fa] py-8 relative z-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* Stat 1 */}
            <div className="animate-on-scroll fade-up flex flex-col items-center justify-center p-4 md:py-3 text-center group">
              <h3 className="text-2xl lg:text-3xl font-black text-[#0f172a] hover:text-white hover:bg-brand-orange px-4 py-1 mb-1 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 cursor-pointer">
                Faster
              </h3>
              <p className="text-[10px] md:text-xs font-bold text-gray-500 tracking-wide uppercase">
                Supplier Discovery
              </p>
            </div>

            {/* Stat 2 */}
            <div className="animate-on-scroll fade-up delay-100 flex flex-col items-center justify-center p-4 md:py-3 text-center group">
              <h3 className="text-2xl lg:text-3xl font-black text-[#0f172a] hover:text-white hover:bg-brand-orange px-4 py-1 mb-1 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 cursor-pointer">
                Compare
              </h3>
              <p className="text-[10px] md:text-xs font-bold text-gray-500 tracking-wide uppercase">
                Supplier Quotes
              </p>
            </div>

            {/* Stat 3 */}
            <div className="animate-on-scroll fade-up delay-200 flex flex-col items-center justify-center p-4 md:py-3 text-center group">
              <h3 className="text-2xl lg:text-3xl font-black text-[#0f172a] hover:text-white hover:bg-brand-orange px-4 py-1 mb-1 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 cursor-pointer">
                More
              </h3>
              <p className="text-[10px] md:text-xs font-bold text-gray-500 tracking-wide uppercase">
                Potential Customers
              </p>
            </div>

            {/* Stat 4 */}
            <div className="animate-on-scroll fade-up delay-300 flex flex-col items-center justify-center p-4 md:py-3 text-center group">
              <h3 className="text-2xl lg:text-3xl font-black text-[#0f172a] hover:text-white hover:bg-brand-orange px-4 py-1 mb-1 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 cursor-pointer">
                Free
              </h3>
              <p className="text-[10px] md:text-xs font-bold text-gray-500 tracking-wide uppercase">
                Digital Presence
              </p>
            </div>

            {/* Stat 5 */}
            <div className="animate-on-scroll fade-up delay-400 flex flex-col items-center justify-center p-4 md:py-3 text-center group">
              <h3 className="text-2xl lg:text-3xl font-black text-[#0f172a] hover:text-white hover:bg-brand-orange px-4 py-1 mb-1 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 cursor-pointer">
                Lower
              </h3>
              <p className="text-[10px] md:text-xs font-bold text-gray-500 tracking-wide uppercase">
                Cost per Lead
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FREQUENTLY ASKED QUESTIONS (FAQ SECTION - ALL 7 FULL ITEMS) */}
      {/* ========================================================================= */}
      <section 
        className="py-16 md:py-24 px-4 md:px-10 lg:px-20 relative z-20 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/es1xmnxh/image/upload/v1786194975/ChatGPT_Image_Aug_8_2026_08_11_11_PM_omozcq.png')`
        }}
      >
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-xl">
              Frequently<br />Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* FAQ Item 1 (Highlighted) */}
            <div 
              onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
              className={`faq-item animate-on-scroll fade-up rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer relative ${
                openFaqIndex === 0 
                  ? 'is-open bg-brand-orange/15 backdrop-blur-sm border border-brand-orange/50 shadow-[0_0_20px_rgba(255,107,0,0.15)]' 
                  : 'bg-brand-orange/5 backdrop-blur-sm border border-brand-orange/50 hover:bg-brand-orange/10'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/0 via-brand-orange/10 to-brand-orange/0 pointer-events-none"></div>
              <div className="faq-header flex justify-between items-center px-6 py-5 md:px-8 md:py-6 gap-4 relative z-10">
                <h3 className="text-base md:text-lg font-bold text-white drop-shadow-sm transition-colors faq-title">
                  Can I promote my logistics services on FlexGo for free?
                </h3>
                <div className={`w-10 h-10 rounded-full bg-brand-orange text-white border border-brand-orange flex items-center justify-center flex-shrink-0 transition-transform duration-300 shadow-lg ${
                  openFaqIndex === 0 ? 'rotate-45' : ''
                }`}>
                  <Plus className="w-4 h-4" />
                </div>
              </div>
              <div className="faq-content px-6 md:px-8 relative z-10">
                <div className="overflow-hidden">
                  <p className="text-sm md:text-base text-white/90 leading-relaxed pr-8 md:pr-12 font-medium pb-6 md:pb-8 faq-text">
                    Yes. Create your free business profile, showcase your services, attract potential customers, and receive inquiries directly through your profile — with no credits or pay-per-lead fees.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div 
              onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
              className={`faq-item animate-on-scroll fade-up bg-black/10 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:bg-white/5 cursor-pointer ${
                openFaqIndex === 1 ? 'is-open' : ''
              }`}
            >
              <div className="faq-header flex justify-between items-center px-6 py-5 md:px-8 md:py-6 gap-4">
                <h3 className="text-base md:text-lg font-bold text-brand-orange drop-shadow-sm transition-colors faq-title">
                  How does FlexGo match businesses with logistics providers?
                </h3>
                <div className={`w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                  openFaqIndex === 1 ? 'rotate-45' : ''
                }`}>
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="faq-content px-6 md:px-8">
                <div className="overflow-hidden">
                  <p className="text-sm md:text-base text-white/80 leading-relaxed pr-8 md:pr-12 font-medium pb-6 md:pb-8 faq-text">
                    Businesses submit their logistics requirements, and FlexGo uses service categories, capabilities, locations, and other information to identify relevant providers.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div 
              onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
              className={`faq-item animate-on-scroll fade-up bg-black/10 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:bg-white/5 cursor-pointer ${
                openFaqIndex === 2 ? 'is-open' : ''
              }`}
            >
              <div className="faq-header flex justify-between items-center px-6 py-5 md:px-8 md:py-6 gap-4">
                <h3 className="text-base md:text-lg font-bold text-brand-orange drop-shadow-sm transition-colors faq-title">
                  Can I post a logistics inquiry on FlexGo?
                </h3>
                <div className={`w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                  openFaqIndex === 2 ? 'rotate-45' : ''
                }`}>
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="faq-content px-6 md:px-8">
                <div className="overflow-hidden">
                  <p className="text-sm md:text-base text-white/80 leading-relaxed pr-8 md:pr-12 font-medium pb-6 md:pb-8 faq-text">
                    Yes. Businesses can post their requirements and connect with logistics providers that are interested and able to serve them.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div 
              onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}
              className={`faq-item animate-on-scroll fade-up bg-black/10 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:bg-white/5 cursor-pointer ${
                openFaqIndex === 3 ? 'is-open' : ''
              }`}
            >
              <div className="faq-header flex justify-between items-center px-6 py-5 md:px-8 md:py-6 gap-4">
                <h3 className="text-base md:text-lg font-bold text-brand-orange drop-shadow-sm transition-colors faq-title">
                  Can I work with my existing logistics providers through FlexGo?
                </h3>
                <div className={`w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                  openFaqIndex === 3 ? 'rotate-45' : ''
                }`}>
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="faq-content px-6 md:px-8">
                <div className="overflow-hidden">
                  <p className="text-sm md:text-base text-white/80 leading-relaxed pr-8 md:pr-12 font-medium pb-6 md:pb-8 faq-text">
                    Yes. You can invite your existing logistics partners to join FlexGo and continue working with them through the platform.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 5 */}
            <div 
              onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? null : 4)}
              className={`faq-item animate-on-scroll fade-up bg-black/10 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:bg-white/5 cursor-pointer ${
                openFaqIndex === 4 ? 'is-open' : ''
              }`}
            >
              <div className="faq-header flex justify-between items-center px-6 py-5 md:px-8 md:py-6 gap-4">
                <h3 className="text-base md:text-lg font-bold text-brand-orange drop-shadow-sm transition-colors faq-title">
                  How do I choose the right logistics provider?
                </h3>
                <div className={`w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                  openFaqIndex === 4 ? 'rotate-45' : ''
                }`}>
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="faq-content px-6 md:px-8">
                <div className="overflow-hidden">
                  <p className="text-sm md:text-base text-white/80 leading-relaxed pr-8 md:pr-12 font-medium pb-6 md:pb-8 faq-text">
                    You can review provider profiles, services, capabilities, locations, and other relevant information before deciding who to contact.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 6 */}
            <div 
              onClick={() => setOpenFaqIndex(openFaqIndex === 5 ? null : 5)}
              className={`faq-item animate-on-scroll fade-up bg-black/10 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:bg-white/5 cursor-pointer ${
                openFaqIndex === 5 ? 'is-open' : ''
              }`}
            >
              <div className="faq-header flex justify-between items-center px-6 py-5 md:px-8 md:py-6 gap-4">
                <h3 className="text-base md:text-lg font-bold text-brand-orange drop-shadow-sm transition-colors faq-title">
                  Does FlexGo handle the actual logistics service?
                </h3>
                <div className={`w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                  openFaqIndex === 5 ? 'rotate-45' : ''
                }`}>
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="faq-content px-6 md:px-8">
                <div className="overflow-hidden">
                  <p className="text-sm md:text-base text-white/80 leading-relaxed pr-8 md:pr-12 font-medium pb-6 md:pb-8 faq-text">
                    No. FlexGo connects businesses and logistics providers. The logistics service and commercial agreement are handled directly between the two parties.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 7 */}
            <div 
              onClick={() => setOpenFaqIndex(openFaqIndex === 6 ? null : 6)}
              className={`faq-item animate-on-scroll fade-up bg-black/10 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:bg-white/5 cursor-pointer ${
                openFaqIndex === 6 ? 'is-open' : ''
              }`}
            >
              <div className="faq-header flex justify-between items-center px-6 py-5 md:px-8 md:py-6 gap-4">
                <h3 className="text-base md:text-lg font-bold text-brand-orange drop-shadow-sm transition-colors faq-title">
                  Why use FlexGo instead of contacting logistics providers directly?
                </h3>
                <div className={`w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                  openFaqIndex === 6 ? 'rotate-45' : ''
                }`}>
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="faq-content px-6 md:px-8">
                <div className="overflow-hidden">
                  <p className="text-sm md:text-base text-white/80 leading-relaxed pr-8 md:pr-12 font-medium pb-6 md:pb-8 faq-text">
                    FlexGo brings multiple providers, real business inquiries, service information, and opportunities together in one place, making it easier to discover and connect with the right logistics partner.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FOOTER SECTION (NEWSLETTER CARD + BRAND INFO + 3 COLUMNS) */}
      {/* ========================================================================= */}
      <footer className="bg-[#061218] relative z-20 py-20 px-4 md:px-10 lg:px-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          {/* Newsletter Card in Brand Navy (#1c235a) */}
          <div className="bg-brand-navy rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 mb-20 shadow-2xl border border-white/5 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="md:w-1/2 relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Join the flexGO Waitlist</h3>
              <p className="text-sm text-white/60 leading-relaxed max-w-sm">
                Be the first to access flexGO when we launch. Join the waitlist to receive the latest feature updates and early access.
              </p>
            </div>
            <div className="md:w-1/2 w-full flex flex-col items-start md:items-end relative z-10">
              <span className="text-xs font-bold tracking-widest uppercase text-white/50 mb-3 block">
                Get early access
              </span>
              {waitlistSubmitted ? (
                <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-full px-6 py-3.5 text-emerald-300 font-bold text-sm w-full max-w-md text-center">
                  ✓ Thank you! You are on the flexGO waitlist.
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (waitlistEmail.trim()) {
                      setWaitlistSubmitted(true);
                    }
                  }}
                  className="flex w-full max-w-md gap-3"
                >
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-white/10 border border-white/20 rounded-full px-6 py-4 w-full text-sm text-white focus:outline-hidden focus:border-brand-orange transition placeholder-white/40"
                  />
                  <button
                    type="submit"
                    className="bg-brand-orange text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#e04f0e] transition flex-shrink-0 shadow-lg cursor-pointer"
                  >
                    Join Waitlist
                  </button>
                </form>
              )}
              <p className="text-[10px] text-white/40 mt-3 md:text-right w-full max-w-md">
                By joining you agree to our{' '}
                <button 
                  onClick={() => onNavigate({ type: 'public', tab: 'company', params: { subTab: 'trust' } })}
                  className="underline hover:text-white transition cursor-pointer"
                >
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">
            {/* Brand Info */}
            <div className="lg:w-1/3">
              <div 
                onClick={() => onNavigate({ type: 'public', tab: 'home' })}
                className="flex items-center gap-1 cursor-pointer mb-6"
              >
                <img src="/icon-192.png" alt="flexGO Logo" className="w-12 h-12 object-contain mr-2" />
                <div className="flex flex-col">
                  <h1 className="text-3xl font-extrabold tracking-tight text-white leading-none">flexGO</h1>
                  <span className="text-[10px] tracking-widest text-white/70 font-bold uppercase mt-1">
                    Always best price
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/50 max-w-xs leading-relaxed">
                Make your complicated supply chain and freight logistics more simple.
              </p>
            </div>

            {/* Link Columns */}
            <div className="lg:w-2/3 flex flex-wrap md:flex-nowrap justify-between gap-10">
              <div className="flex flex-col gap-4">
                <h4 className="text-white font-bold mb-2">Features</h4>
                <button onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })} className="text-sm text-white/50 hover:text-brand-orange transition text-left cursor-pointer">Payment</button>
                <button onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })} className="text-sm text-white/50 hover:text-brand-orange transition text-left cursor-pointer">Card</button>
                <button onClick={() => onNavigate({ type: 'public', tab: 'company', params: { subTab: 'pricing' } })} className="text-sm text-white/50 hover:text-brand-orange transition text-left cursor-pointer">Pricing</button>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-white font-bold mb-2">Support</h4>
                <button onClick={() => onNavigate({ type: 'public', tab: 'company', params: { subTab: 'resources' } })} className="text-sm text-white/50 hover:text-brand-orange transition text-left cursor-pointer">Help</button>
                <button onClick={() => window.scrollTo({ top: document.body.scrollHeight - 1000, behavior: 'smooth' })} className="text-sm text-white/50 hover:text-brand-orange transition text-left cursor-pointer">FAQ</button>
                <button onClick={() => onNavigate({ type: 'public', tab: 'company', params: { subTab: 'contact' } })} className="text-sm text-white/50 hover:text-brand-orange transition text-left cursor-pointer">Contact</button>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-white font-bold mb-2">Legal</h4>
                <button onClick={() => onNavigate({ type: 'public', tab: 'company', params: { subTab: 'trust' } })} className="text-sm text-white/50 hover:text-brand-orange transition text-left cursor-pointer">Privacy Policy</button>
                <button onClick={() => onNavigate({ type: 'public', tab: 'company', params: { subTab: 'trust' } })} className="text-sm text-white/50 hover:text-brand-orange transition text-left cursor-pointer">Terms of Services</button>
                <button onClick={() => onNavigate({ type: 'public', tab: 'company', params: { subTab: 'trust' } })} className="text-sm text-white/50 hover:text-brand-orange transition text-left cursor-pointer">Cookies</button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Decorative Bar (Fixed Bottom Bar matching FlexGO brand template) */}
      <div className="w-full h-1.5 md:h-2 bg-brand-orange fixed bottom-0 left-0 z-50 pointer-events-none shadow-[0_-2px_10px_rgba(255,94,20,0.5)]" />
    </div>
  );
};
