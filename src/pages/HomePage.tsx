import React from 'react';
import { ArrowRight, Sparkles, Shield, Cpu, Scale, Building2, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onLaunchDemo: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onLaunchDemo }) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-10 bg-gradient-to-b from-emerald-50/70 via-white to-white border-b border-emerald-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-emerald-800 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI for Social Good Hackathon • Informal Scrap Worker Empowerment</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Turn Scrap Into <span className="text-emerald-600">Value.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                AI-powered e-waste identification, value estimation and recycler matching for safer and smarter recycling.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="hero-analyze-cta-btn"
                  onClick={() => onNavigate('analyze')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base shadow-sm hover:shadow-md transition-all group"
                >
                  <span>Analyze E-Waste</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  id="hero-recyclers-cta-btn"
                  onClick={() => onNavigate('recyclers')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-xs transition-colors"
                >
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <span>Find Recyclers</span>
                </button>

                <button
                  id="hero-demo-mode-btn"
                  onClick={onLaunchDemo}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-sm border border-emerald-200 transition-colors"
                  title="Loads a realistic e-waste motherboard & battery sample in 1 click"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Try Demo Mode</span>
                </button>
              </div>

              {/* Key Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Multimodal Vision Detection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Deterministic Value Engine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Hazard Warnings & Protocol</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-5 shadow-xl border border-emerald-100 relative">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live System Simulation</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Active Demo
                  </span>
                </div>

                {/* Simulated Detection Preview */}
                <div className="mt-4 space-y-3">
                  <div className="bg-slate-900 rounded-2xl p-4 text-white">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span>Detected: Disassembled Laptop</span>
                      <span className="text-emerald-400 font-mono font-bold">94% Confidence</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">High-Grade Motherboard PCB</span>
                        <span className="font-bold text-white">0.45 kg • ₹189</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Copper Heatsink & Heatpipe</span>
                        <span className="font-bold text-white">0.18 kg • ₹130</span>
                      </div>
                      <div className="flex justify-between text-sm text-rose-300">
                        <span>Lithium Battery Pack (Hazardous)</span>
                        <span className="font-bold text-rose-400">0.30 kg • Flagged</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Total Indicative Value</span>
                      <span className="text-xl font-extrabold text-emerald-400">₹412</span>
                    </div>
                  </div>

                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-900">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Safety Alert Triggered:</strong> Lithium battery detected. Special handling required. Isolated storage advised.
                    </span>
                  </div>

                  <button
                    id="hero-preview-try-btn"
                    onClick={onLaunchDemo}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Complete Sample Analysis</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Benefit Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            Built for Scrap-Shop Workers
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Three Powerful Capabilities in One Flow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Identify */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">1. Identify</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">Understand what's inside your e-waste.</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Take a photograph of discarded electronics. Our multimodal AI identifies complex circuit boards, copper coils, heatsinks, and dangerous batteries even in mixed piles.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <span>Automatic component tagging</span>
            </div>
          </div>

          {/* Card 2: Estimate */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">2. Estimate</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">Get an indicative material and component value.</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Never undersell high-grade e-scrap. Our deterministic value engine multiplies calculated material weights by reference scrap commodity prices to give you a fair baseline.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-teal-700 flex items-center gap-1">
              <span>Deterministic pricing rules</span>
            </div>
          </div>

          {/* Card 3: Match */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">3. Match</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">Find suitable recyclers based on material, location and requirements.</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect directly with verified recyclers licensed to handle your specific batch, whether you need doorstep collection, small batch minimums, or hazardous permits.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <span>Weighted multi-factor matching</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (5 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              End-To-End Scrap Flow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              How EcoValue AI Works in 5 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { num: '1', title: 'Upload', desc: 'Snap photo with your mobile or drop an e-scrap image.' },
              { num: '2', title: 'Analyze', desc: 'AI detects components, conditions, and safety flags.' },
              { num: '3', title: 'Estimate', desc: 'Deterministic engine calculates indicative scrap worth.' },
              { num: '4', title: 'Match', desc: 'Algorithm ranks top authorized recyclers near your city.' },
              { num: '5', title: 'Handover', desc: 'Book a safe door pickup or drop-off with 1 click.' },
            ].map((step, idx) => (
              <div key={idx} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mb-3">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-base text-white">{step.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              id="how-it-works-start-btn"
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-md transition-all"
            >
              <span>Start Analyzing Scrap Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
