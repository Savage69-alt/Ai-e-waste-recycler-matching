import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Scale,
  ShieldCheck,
  Truck,
  IndianRupee,
  Layers,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { AnalysisResult, HandoverRequest } from '../types';

interface DashboardPageProps {
  historyList: AnalysisResult[];
  handoversList: HandoverRequest[];
  onNavigateToAnalyze: () => void;
  onNavigateToRecyclers: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  historyList,
  handoversList,
  onNavigateToAnalyze,
  onNavigateToRecyclers,
}) => {
  // Aggregate Metrics
  const totalAnalyses = historyList.length;
  const totalValue = historyList.reduce((acc, h) => acc + (h.total_estimated_value || 0), 0);
  const totalWeightKg = historyList.reduce(
    (acc, h) => acc + (h.input_weight_kg || h.materials.reduce((mSum, m) => mSum + m.estimated_weight_kg, 0)),
    0
  );
  const hazardousCount = historyList.filter((h) => h.safety.has_hazardous_components).length;
  const totalHandovers = handoversList.length;

  // Material aggregates
  const materialAggregates: Record<string, { weight: number; value: number }> = {};
  historyList.forEach((h) => {
    h.materials.forEach((m) => {
      if (!materialAggregates[m.name]) {
        materialAggregates[m.name] = { weight: 0, value: 0 };
      }
      materialAggregates[m.name].weight += m.estimated_weight_kg;
      materialAggregates[m.name].value += m.estimated_value;
    });
  });

  const sortedMaterials = Object.entries(materialAggregates)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Scrap Shop Operations & Impact
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Live Overview
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Worker Impact Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Monitor recovered scrap values, hazardous safety interceptions, and scheduled recycler collections.
          </p>
        </div>

        <button
          id="dashboard-analyze-cta-btn"
          onClick={onNavigateToAnalyze}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <span>Analyze Next Batch</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Analyzed</span>
            <LayoutDashboard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalAnalyses}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Scrap batches inspected</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Value</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">₹{totalValue.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Recoverable metal potential</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">E-Waste Yield</span>
            <Scale className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalWeightKg.toFixed(1)} kg</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Segregated scrap volume</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Hazards Flagged</span>
            <ShieldCheck className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700">{hazardousCount}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Batteries & toxic items</span>
        </div>

        {/* Metric 5 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Handovers Logged</span>
            <Truck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-700">{totalHandovers}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Dispatched to recyclers</span>
        </div>
      </div>

      {/* Grid: Material Yield Breakdown + Handover Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recovered Material Distribution */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-base text-slate-900">Scrap Material Distribution</h3>
            </div>
            <span className="text-xs text-slate-400">By estimated recovery value</span>
          </div>

          <div className="space-y-3">
            {sortedMaterials.slice(0, 6).map((mat, i) => {
              const pct = totalValue > 0 ? Math.round((mat.value / totalValue) * 100) : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{mat.name}</span>
                    <span className="text-slate-600 font-medium">
                      {mat.weight.toFixed(2)} kg • <strong>₹{mat.value.toLocaleString('en-IN')}</strong> ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {sortedMaterials.length === 0 && (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                Analyze your first scrap photo to see material yield statistics.
              </p>
            )}
          </div>
        </div>

        {/* Right: Scheduled Recycler Handovers */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-base text-slate-900">Scheduled Handover Dispatches</h3>
            </div>
            <button
              id="dashboard-view-recyclers-link"
              onClick={onNavigateToRecyclers}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              Book New Pickup
            </button>
          </div>

          <div className="space-y-3">
            {handoversList.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{req.recycler_name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {req.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span>Method: <strong>{req.handover_type === 'pickup' ? 'Door Pickup' : 'Drop-off'}</strong></span>
                  <span>•</span>
                  <span>Date: <strong>{req.preferred_date}</strong></span>
                  <span>•</span>
                  <span>Weight: <strong>{req.estimated_weight_kg} kg</strong></span>
                </div>
                {req.notes && (
                  <p className="text-[11px] text-slate-500 italic">"{req.notes}"</p>
                )}
              </div>
            ))}

            {handoversList.length === 0 && (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No handovers requested yet. Match recyclers from analysis to schedule.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
