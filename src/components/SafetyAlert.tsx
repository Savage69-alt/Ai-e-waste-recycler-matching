import React from 'react';
import { AlertTriangle, ShieldCheck, Flame, Info, CheckCircle2, AlertOctagon } from 'lucide-react';
import { SafetyAssessment } from '../types';

interface SafetyAlertProps {
  safety: SafetyAssessment;
}

export const SafetyAlert: React.FC<SafetyAlertProps> = ({ safety }) => {
  const isHighRisk = safety.risk_level === 'HIGH' || safety.has_hazardous_components;
  const isMediumRisk = safety.risk_level === 'MEDIUM';

  return (
    <div
      id="safety-assessment-card"
      className={`rounded-2xl border p-5 transition-all ${
        isHighRisk
          ? 'bg-rose-50/80 border-rose-300 text-rose-950 shadow-xs'
          : isMediumRisk
          ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-xs'
          : 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isHighRisk
                ? 'bg-rose-600 text-white'
                : isMediumRisk
                ? 'bg-amber-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isHighRisk ? (
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            ) : isMediumRisk ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Safety Protocol Status
              </span>
              <span
                id="safety-status-badge"
                className={`text-xs font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap ${
                  isHighRisk
                    ? 'bg-rose-200 text-rose-900 border border-rose-300'
                    : isMediumRisk
                    ? 'bg-amber-200 text-amber-900 border border-amber-300'
                    : 'bg-emerald-200 text-emerald-900 border border-emerald-300'
                }`}
              >
                {isHighRisk
                  ? 'REQUIRES SPECIAL HANDLING'
                  : isMediumRisk
                  ? 'CAUTION: CONTROLLED DISASSEMBLY'
                  : 'SAFE TO HANDLE WITH NORMAL PRECAUTIONS'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {isHighRisk ? '⚠ Safety Alert: Hazardous E-Waste Detected' : 'Handling & Occupational Safety Guidance'}
            </h3>
          </div>
        </div>
        <div className="text-xs font-semibold text-slate-600 bg-white/70 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0 self-start sm:self-auto">
          Risk Level: <strong className="text-slate-900">{safety.risk_level}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
        {/* Warnings */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-600" />
            Specific Hazards Identified
          </h4>
          <ul className="space-y-2">
            {safety.warnings && safety.warnings.length > 0 ? (
              safety.warnings.map((warn, i) => (
                <li
                  key={i}
                  className="text-sm font-medium text-slate-800 flex items-start gap-2 bg-white/60 p-2.5 rounded-xl border border-black/5"
                >
                  <span className="text-rose-600 font-bold shrink-0 mt-0.5">•</span>
                  <span>{warn}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-600 italic">No acute toxic or explosive hazard detected.</li>
            )}
          </ul>
        </div>

        {/* Recommended Safe Handling Protocol */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Recommended Worker Handling Protocol
          </h4>
          <ul className="space-y-2">
            {safety.recommended_handling && safety.recommended_handling.length > 0 ? (
              safety.recommended_handling.map((rec, i) => (
                <li
                  key={i}
                  className="text-sm font-medium text-slate-800 flex items-start gap-2 bg-white/60 p-2.5 rounded-xl border border-black/5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-600">Standard cut-resistant gloves recommended.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-black/10 flex items-center gap-2 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-500 shrink-0" />
        <span>
          Never puncture lithium batteries, open burn wires, or attempt acid-leaching in scrap shops. Connect directly with an authorized hazardous recycler.
        </span>
      </div>
    </div>
  );
};
