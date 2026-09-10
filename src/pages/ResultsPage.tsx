import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Building2,
  Phone,
  Truck,
  RotateCcw,
  MessageSquare,
  Share2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { AnalysisResult, Recycler, HandoverRequest } from '../types';
import { SafetyAlert } from '../components/SafetyAlert';
import { ValueDisplay } from '../components/ValueDisplay';
import { MaterialTable } from '../components/MaterialTable';
import { HandoverModal } from '../components/HandoverModal';
import { ItemChatbot } from '../components/ItemChatbot';
import { matchRecyclers } from '../utils/matchingEngine';

interface ResultsPageProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
  onOpenAssistant: () => void;
  onSelectRecycler: (recycler: Recycler) => void;
  onNavigateToRecyclers: () => void;
  onRecordHandover: (handover: HandoverRequest) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  result,
  onNewAnalysis,
  onOpenAssistant,
  onSelectRecycler,
  onNavigateToRecyclers,
  onRecordHandover,
}) => {
  const [topRecyclers, setTopRecyclers] = useState<Recycler[]>([]);
  const [selectedRecyclerForHandover, setSelectedRecyclerForHandover] = useState<Recycler | null>(null);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [expandedReasonIndex, setExpandedReasonIndex] = useState<number | null>(null);

  useEffect(() => {
    // Run deterministic recycler matching
    const materials = result.materials.map((m) => m.name);
    const types = [result.input_category || 'Mixed e-waste'];
    const matched = matchRecyclers({
      detectedMaterials: materials,
      eWasteTypes: types,
      weightKg: result.input_weight_kg || 5,
      locationCity: result.input_location?.split(',')[0]?.trim() || 'Mumbai',
      hasHazardousComponents: result.safety.has_hazardous_components,
    });
    setTopRecyclers(matched);
  }, [result]);

  const handleOpenHandover = (recycler: Recycler) => {
    setSelectedRecyclerForHandover(recycler);
    setIsHandoverModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Analysis Results & Recommendations
            </span>
            <span
              id="analysis-type-badge"
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                result.is_demo
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-teal-50 text-teal-800 border-teal-300'
              }`}
            >
              {result.is_demo ? 'Verified Demo Sample' : 'AI-Assisted Vision'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            E-Waste Assessment Report
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyzed on {new Date(result.timestamp).toLocaleString()} • Batch ID: {result.id}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="results-ask-assistant-btn"
            onClick={onOpenAssistant}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold shadow-xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ask EcoValue AI</span>
          </button>
          <button
            id="results-new-analysis-btn"
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Uploaded Photo Preview */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 aspect-4/3 flex items-center justify-center p-2 shadow-xs">
            <img
              src={result.imageUrl}
              alt="Analyzed E-Waste"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1 text-slate-600">
            <div><strong>Declared Batch Weight:</strong> {result.input_weight_kg ? `${result.input_weight_kg} kg` : 'Estimated from photo'}</div>
            <div><strong>Location:</strong> {result.input_location || 'Not specified'}</div>
            <div><strong>Identified Components:</strong> {result.detected_items.length} items</div>
          </div>
        </div>

        {/* Right: AI Summary & Value Display */}
        <div className="lg:col-span-8 space-y-5">
          {/* Summary Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Device Assessment</h3>
            </div>
            <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed">
              {result.device_summary}
            </p>
            {result.overall_assessment && (
              <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                {result.overall_assessment}
              </p>
            )}
          </div>

          {/* Value Display Card */}
          <ValueDisplay
            totalEstimatedValue={result.total_estimated_value}
            confidenceLevel={result.confidence_level}
            confidenceNote={result.confidence_note}
            isDemo={result.is_demo}
          />
        </div>
      </div>

      {/* Safety Alert Component */}
      <SafetyAlert safety={result.safety} />

      {/* Identified Components Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600" />
              Identified Components ({result.detected_items.length})
            </h3>
            <p className="text-xs text-slate-500">
              AI-assisted visual detection with physical condition analysis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.detected_items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {item.name}
                  </h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 whitespace-nowrap">
                    {item.confidence}% Conf.
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 mb-3">
                  <div><strong>Material:</strong> {item.material}</div>
                  <div><strong>Condition:</strong> {item.condition}</div>
                  <div><strong>Qty:</strong> {item.quantity} {item.estimated_weight_kg ? `• ~${item.estimated_weight_kg} kg` : ''}</div>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.hazardous
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {item.hazardous ? '⚠ Hazardous' : '✓ Non-Hazardous'}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.reusable
                        ? 'bg-teal-100 text-teal-800 border border-teal-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.reusable ? 'Potential Reusable' : 'Scrap / Smelting'}
                  </span>
                </div>

                {item.reason && (
                  <p className="text-[11px] text-slate-500 italic mt-2 line-clamp-2">
                    "{item.reason}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Material Breakdown Table */}
      <MaterialTable materials={result.materials} />

      {/* Matched Recyclers Section */}
      <div id="matched-recyclers-section" className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Step 2 • Authorized Recycler Matching
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Weighted Match Engine
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Top Ranked Recyclers for this Batch
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by material compatibility (35%), hazardous license (10%), location, and minimum batch requirements.
            </p>
          </div>

          <button
            id="view-all-recyclers-btn"
            onClick={onNavigateToRecyclers}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-bold transition-colors self-start sm:self-auto shadow-xs"
          >
            <span>Explore All 25 Recyclers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topRecyclers.map((rec, idx) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header with match score badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Rank #{idx + 1}</span>
                    <h4 className="font-bold text-base text-slate-900 leading-snug">
                      {rec.recycler_name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {rec.city}, {rec.state} {rec.distance_km ? `• ~${rec.distance_km} km away` : ''}
                    </p>
                  </div>
                  <div className="text-center shrink-0">
                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        (rec.match_score || 80) >= 85
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-teal-100 text-teal-900 border border-teal-300'
                      }`}
                    >
                      {rec.match_score || 85}% Match
                    </span>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium">{rec.verification_status}</span>
                </div>

                {/* "Why this recycler?" reasons box */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 mb-3 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Why this match?
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1">
                    {rec.match_reasons?.map((reason, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span className="line-clamp-1">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Accepted Materials Chips */}
                <div className="space-y-1 mb-4">
                  <span className="text-[11px] font-semibold text-slate-500">Accepted Materials:</span>
                  <div className="flex flex-wrap gap-1">
                    {rec.accepted_materials.slice(0, 4).map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  id={`results-handover-btn-${rec.id}`}
                  onClick={() => handleOpenHandover(rec)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Request Handover</span>
                </button>

                <button
                  id={`results-details-btn-${rec.id}`}
                  onClick={() => onSelectRecycler(rec)}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image-Aware Item Chatbot: Discuss this item with EcoValue AI */}
      <ItemChatbot analysis={result} matchedRecyclers={topRecyclers} />

      {/* Handover Modal */}
      <HandoverModal
        isOpen={isHandoverModalOpen}
        onClose={() => setIsHandoverModalOpen(false)}
        recycler={selectedRecyclerForHandover}
        defaultWeightKg={result.input_weight_kg || 1.6}
        defaultWasteType={result.device_summary.slice(0, 40)}
        defaultAnalysisId={result.id}
        estimatedValue={result.total_estimated_value}
        onSuccess={(handover) => {
          onRecordHandover(handover);
        }}
      />
    </div>
  );
};
