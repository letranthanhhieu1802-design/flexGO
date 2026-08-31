import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Truck, Ship, Plane, Building2, FileText, FileSpreadsheet, Flame } from 'lucide-react';
import { CurrentView } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: CurrentView) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickItems = [
    {
      title: 'Hot Promotions - Tuyến Cước Khuyến Mãi & Flash Sale Logistics',
      category: 'Hot Promotion',
      icon: Flame,
      target: { type: 'public', tab: 'hot-promotion' } as CurrentView,
    },
    {
      title: 'My Rates - Logistics Rate Card & Bảng Biểu Giá Dịch Vụ',
      category: 'Rate Card',
      icon: FileSpreadsheet,
      target: { type: 'workspace', view: 'customer-rates' } as CurrentView,
    },
    {
      title: 'HCMC → Hanoi Trucking Service (FG-2608250001)',
      category: 'Inquiry',
      icon: Truck,
      target: { type: 'workspace', view: 'customer-inquiry-detail', contextId: 'inq-01' } as CurrentView,
    },
    {
      title: 'Compare Quotes: HCMC → Hanoi (3 Quotes)',
      category: 'Comparison',
      icon: FileText,
      target: { type: 'workspace', view: 'customer-compare' } as CurrentView,
    },
    {
      title: 'VinaTrans Logistics JSC (Verified Supplier)',
      category: 'Supplier',
      icon: Building2,
      target: { type: 'public', tab: 'supplier-profile' } as CurrentView,
    },
    {
      title: 'Hai Phong Port → Da Nang Factory (FG-2608250002)',
      category: 'Inquiry',
      icon: Ship,
      target: { type: 'workspace', view: 'customer-inquiries' } as CurrentView,
    },
    {
      title: 'Supplier Lead: ABC Manufacturing 500M VND (FG-2608250001)',
      category: 'Lead',
      icon: Truck,
      target: { type: 'workspace', view: 'supplier-leads' } as CurrentView,
    },
    {
      title: 'Tan Son Nhat (SGN) → Narita (NRT) Air Express',
      category: 'Air Freight',
      icon: Plane,
      target: { type: 'public', tab: 'lead-board' } as CurrentView,
    },
  ];

  const filtered = quickItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        id="command-palette-modal"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            id="command-palette-input"
            type="text"
            placeholder="Search inquiries, suppliers, quotations, routes, or leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden"
            autoFocus
          />
          <button 
            id="close-command-palette-btn"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5">
            Quick Suggestions & Navigation
          </div>
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No matching records found for "{searchTerm}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  id={`cmd-item-${idx}`}
                  onClick={() => {
                    onNavigate(item.target);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-indigo-50/80 text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-950">
                        {item.title}
                      </p>
                      <span className="text-xs text-slate-400 font-normal">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-slate-400 group-hover:text-indigo-600 font-medium">
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px]">ESC</span>
            <span>to close</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px]">⌘K</span>
            <span>quick command search</span>
          </div>
        </div>
      </div>
    </div>
  );
};
