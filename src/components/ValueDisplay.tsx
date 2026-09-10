import React from 'react';
import { IndianRupee, Info, TrendingUp, HelpCircle } from 'lucide-react';

interface ValueDisplayProps {
  totalEstimatedValue: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  confidenceNote: string;
  isDemo?: boolean;
}

export const ValueDisplay: React.FC<ValueDisplayProps> = ({
  totalEstimatedValue,
  confidenceLevel,
  confidenceNote,
  isDemo,
}) => {
  const badgeColors = {
    High: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Medium: 'bg-amber-100 text-amber-800 border-amber-300',
    Low: 'bg-slate-100 text-slate-800 border-slate-300',
  };

  return (
    <div
      id="value-display-card"
      className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-emerald-800/40 relative overflow-hidden"
    >
      <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Deterministic Valuation Engine
            </span>
            {isDemo && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                Demo Sample
              </span>
            )}
          </div>
          <h2 className="text-sm font-semibold text-slate-300 mt-1">Estimated E-Waste Value</h2>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center">
              ₹{totalEstimatedValue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-semibold text-emerald-300/90 uppercase tracking-wider">
              Indicative
            </span>
          </div>
        </div>

        {/* Confidence Badge & Note */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 max-w-sm">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Analysis Confidence
            </span>
            <span
              id="confidence-level-badge"
              className={`text-xs font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${badgeColors[confidenceLevel]}`}
            >
              {confidenceLevel} Confidence
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{confidenceNote}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-start gap-2 text-xs text-slate-300">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong>Indicative estimate:</strong> Calculated deterministically using verified baseline reference prices multiplied by detected component yields. Actual recycler purchase offers vary by regional batch volume, moisture, and final assay testing.
        </p>
      </div>
    </div>
  );
};
