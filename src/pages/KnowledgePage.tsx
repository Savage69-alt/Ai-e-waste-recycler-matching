import React, { useState } from 'react';
import {
  ShieldAlert,
  Flame,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Search,
  Sparkles,
  Layers,
  Scale,
  IndianRupee,
} from 'lucide-react';
import { E_WASTE_KNOWLEDGE_BASE } from '../data/knowledge';

export const KnowledgePage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredKnowledge = E_WASTE_KNOWLEDGE_BASE.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.recyclable_materials.some((m) => m.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Worker Protection & Guidance
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Occupational Health Standard
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Safety Protocols & E-Waste Knowledge Base
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Essential workplace safety instructions and reference material yields designed specifically for informal e-waste collectors and scrap shop owners.
        </p>
      </div>

      {/* 5 Golden Rules of Safe Scrap Handling */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">5 Golden Rules for Scrap-Shop Safety</h2>
            <p className="text-xs text-slate-400">Prevent occupational poisoning, explosions, and severe respiratory injury</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Rule 1 */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <span>Rule 1</span>
              <span>•</span>
              <span>Never Open-Burn Cables or Plastic</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Open burning of PVC insulation produces carcinogenic dioxins, furans, and toxic lead fumes that severely damage worker lungs and nearby communities. Stripping cables mechanically or selling whole to authorized cable granulators preserves higher copper weight and purity.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <span>Rule 2</span>
              <span>•</span>
              <span>Isolate Lithium-Ion Batteries in Sand</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Puncturing, crushing, or heating lithium pouch batteries triggers immediate thermal runaway (temperatures exceeding 600°C) and violent fire. Always detach batteries with plastic pry tools and store swollen units in a metal bucket filled with dry sand.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <span>Rule 3</span>
              <span>•</span>
              <span>No Acid-Leaching in Informal Workshops</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Using nitric acid, aqua regia, or cyanide salts to strip gold from pins and ICs produces lethal nitrogen dioxide fumes and permanent lung scarring. Sell high-grade PCBs intact to licensed hydrometallurgical smelters with certified fume scrubbers.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <span>Rule 4</span>
              <span>•</span>
              <span>Wear Cut-Resistant Gloves & Eye Protection</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Broken CRT glass containing lead, stamped steel internal brackets, and fractured PCB fiberglass cause deep lacerations and lead contamination through skin breaks. Always maintain leather or Level 5 cut-resistant gloves during dismantling.
            </p>
          </div>
        </div>

        {/* Rule 5 Banner */}
        <div className="bg-emerald-950/60 border border-emerald-700/50 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-200">
          <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block text-sm font-bold">Rule 5: Segregate Toxic Components Before Selling Scrap</strong>
            Keep mercury backlight tubes (from older LCDs), lead-acid UPS batteries, and oil-filled high-voltage capacitors segregated in labeled bins. Hand them over only to authorized hazardous waste recyclers with manifest receipts.
          </div>
        </div>
      </div>

      {/* Interactive E-Waste Knowledge Base */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              E-Waste Identification & Yield Reference
            </h2>
            <p className="text-xs text-slate-500">
              Reference guide for component extraction, reusable parts, and typical material recovery values.
            </p>
          </div>

          {/* Search */}
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="knowledge-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by scrap type or metal..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Grid of Knowledge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredKnowledge.map((kb) => (
            <div
              key={kb.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    {kb.category}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                    ~{kb.typical_weight_range_kg}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mb-1">{kb.name}</h3>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">{kb.description}</p>

                {/* Recyclable materials */}
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Recoverable Scrap:</span>
                  <div className="flex flex-wrap gap-1">
                    {kb.recyclable_materials.map((mat, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md font-medium"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reusable Parts */}
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Reusable High-Value Parts:</span>
                  <p className="text-xs text-slate-700 font-medium">{kb.reusable_components.join(', ')}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-medium text-slate-500">Benchmark Worth:</span>
                  <span className="font-bold text-emerald-800">{kb.reference_value_range}</span>
                </div>
                <div className="p-2 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                  <strong>Safety:</strong> {kb.basic_safety_notes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
