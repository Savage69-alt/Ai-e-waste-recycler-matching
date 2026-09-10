import React from 'react';
import { Recycle, ShieldAlert, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold">EcoValue AI</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AI for Social Good
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Empowering informal e-waste collectors and scrap-shop workers with multimodal AI vision, deterministic component valuation, occupational hazard alerts, and responsible recycler matching.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium pt-1">
              <span>Tagline: Turn E-Waste Into Safe, Smart Value</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Workflow Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  id="footer-nav-analyze"
                  onClick={() => onNavigate('analyze')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Analyze E-Waste
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-recyclers"
                  onClick={() => onNavigate('recyclers')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Recycler Marketplace
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-history"
                  onClick={() => onNavigate('history')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Analysis History
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-dashboard"
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Worker Impact Dashboard
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-knowledge"
                  onClick={() => onNavigate('knowledge')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Safety Protocol & Knowledge Base
                </button>
              </li>
            </ul>
          </div>

          {/* Social Good & Honesty Principles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Honesty & Compliance</h4>
            <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <li>• <strong>AI-Assisted Vision:</strong> Model outputs require physical inspection confirmation.</li>
              <li>• <strong>Indicative Pricing:</strong> Benchmark reference rates; actual offers depend on scrap volume & assays.</li>
              <li>• <strong>Demo Recycler Data:</strong> Seeded test profiles for hackathon evaluation.</li>
              <li>• <strong>Safety First:</strong> Never burn cables or breach lithium batteries.</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} EcoValue AI. Built for the AI for Social Good Hackathon.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400/90 font-medium">Protecting Informal Workers & the Environment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
