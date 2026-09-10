import React from 'react';
import { ShieldCheck, Sparkles, History, Users, LayoutDashboard, BookOpen, Menu, X, Recycle } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLaunchDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onLaunchDemo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'analyze', label: 'Analyze E-Waste', highlight: true },
    { id: 'recyclers', label: 'Recyclers' },
    { id: 'history', label: 'History' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'knowledge', label: 'Safety & Guide' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-200 group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">EcoValue</span>
                <span className="font-extrabold text-lg text-emerald-600">AI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Hackathon MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Turn E-Waste Into Safe, Smart Value</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : item.highlight
                      ? 'text-emerald-700 hover:bg-emerald-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Demo Button + CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              id="nav-quick-demo-btn"
              onClick={onLaunchDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors shadow-xs"
              title="Loads realistic sample e-waste immediately"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demo Mode</span>
            </button>
            <button
              id="nav-analyze-cta-btn"
              onClick={() => handleNavClick('analyze')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm transition-all"
            >
              Analyze E-Waste
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-demo-btn"
              onClick={onLaunchDemo}
              className="px-2.5 py-1 text-xs font-semibold rounded-md border border-emerald-300 bg-emerald-50 text-emerald-800"
            >
              Demo
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-link-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-medium ${
                currentPage === item.id
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              id="mobile-drawer-demo-btn"
              onClick={() => {
                onLaunchDemo();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-50 text-emerald-800 font-medium border border-emerald-200 text-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Load Demo Analysis
            </button>
            <button
              id="mobile-drawer-analyze-btn"
              onClick={() => handleNavClick('analyze')}
              className="w-full px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-center text-sm shadow-sm"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
