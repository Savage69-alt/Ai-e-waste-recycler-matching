import React, { useState } from 'react';
import { History, Search, Calendar, ChevronRight, AlertOctagon, ShieldCheck, IndianRupee, RotateCcw } from 'lucide-react';
import { AnalysisResult } from '../types';

interface HistoryPageProps {
  historyList: AnalysisResult[];
  onSelectAnalysis: (item: AnalysisResult) => void;
  onNavigateToAnalyze: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  historyList,
  onSelectAnalysis,
  onNavigateToAnalyze,
}) => {
  const [filter, setFilter] = useState<'all' | 'safe' | 'hazardous'>('all');
  const [search, setSearch] = useState('');

  const filteredItems = historyList.filter((item) => {
    if (filter === 'safe' && item.safety.has_hazardous_components) return false;
    if (filter === 'hazardous' && !item.safety.has_hazardous_components) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchSummary = item.device_summary.toLowerCase().includes(q);
      const matchMaterials = item.materials.some((m) => m.name.toLowerCase().includes(q));
      return matchSummary || matchMaterials;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Scrap History Log
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {historyList.length} Total Records
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Analysis History
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Review previous e-waste assessments, material yield valuations, and safety flags.
          </p>
        </div>

        <button
          id="history-start-new-btn"
          onClick={onNavigateToAnalyze}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Scrap Analysis</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            id="history-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by component or material..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Hazard filter chips */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            id="history-filter-all-btn"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-emerald-100 text-emerald-900 font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Batches
          </button>
          <button
            id="history-filter-safe-btn"
            onClick={() => setFilter('safe')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'safe'
                ? 'bg-emerald-100 text-emerald-900 font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Safe Only
          </button>
          <button
            id="history-filter-haz-btn"
            onClick={() => setFilter('hazardous')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'hazardous'
                ? 'bg-rose-100 text-rose-900 font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Hazardous Flagged
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            id={`history-item-${item.id}`}
            onClick={() => onSelectAnalysis(item)}
            className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                <img
                  src={item.imageUrl}
                  alt="Scrap preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(item.timestamp).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.safety.has_hazardous_components
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.safety.has_hazardous_components ? '⚠ Hazardous' : '✓ Normal Scrap'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {item.device_summary}
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>Batch: {item.input_weight_kg ? `${item.input_weight_kg} kg` : '~1.5 kg'}</span>
                  <span>•</span>
                  <span>
                    Materials: {item.materials.slice(0, 3).map((m) => m.name).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Value & Arrow */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">
                  Estimated Value
                </span>
                <span className="text-lg font-extrabold text-emerald-700">
                  ₹{item.total_estimated_value.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No analysis records found</h3>
            <p className="text-xs mt-1">Start by analyzing your first batch of e-waste scrap.</p>
          </div>
        )}
      </div>
    </div>
  );
};
