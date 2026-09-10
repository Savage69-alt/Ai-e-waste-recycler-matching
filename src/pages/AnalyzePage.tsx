import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  Trash2,
  Sparkles,
  MapPin,
  Scale,
  Cpu,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { CameraCaptureModal } from '../components/CameraCaptureModal';
import { AnalysisResult } from '../types';
import { activeVisionProvider } from '../services/visionProvider';

interface AnalyzePageProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  onLaunchDemo: () => void;
}

const POPULAR_CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad'];

const E_WASTE_CATEGORIES = [
  'Auto-detect',
  'Laptop',
  'Mobile phone',
  'PCB',
  'Hard disk',
  'Battery',
  'Keyboard',
  'Mouse',
  'Charger',
  'Cable',
  'Mixed e-waste',
  'Other',
];

const LOADING_STEPS = [
  'Processing image...',
  'Identifying components...',
  'Analyzing materials...',
  'Checking safety & hazardous indicators...',
  'Estimating indicative value...',
  'Finding suitable recyclers...',
];

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onAnalysisComplete, onLaunchDemo }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [weightKg, setWeightKg] = useState<string>('1.5');
  const [city, setCity] = useState<string>('Mumbai');
  const [state, setState] = useState<string>('Maharashtra');
  const [pincode, setPincode] = useState<string>('');
  const [category, setCategory] = useState<string>('Auto-detect');

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStageIndex, setLoadingStageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPEG, WebP).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('Image size is too large (max 20MB). Please choose a smaller photo.');
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) {
      setErrorMessage('Please upload or snap a photo of the e-waste first.');
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);
    setLoadingStageIndex(0);

    // Progressive stage animation
    const stageInterval = setInterval(() => {
      setLoadingStageIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      const declaredWeight = parseFloat(weightKg) || undefined;
      const locationString = pincode ? `${city}, ${state} - ${pincode}` : `${city}, ${state}`;

      const result = await activeVisionProvider.analyzeImage({
        base64: imagePreview,
        mimeType: 'image/jpeg',
        declaredCategory: category,
        declaredWeight,
        declaredLocation: locationString,
      });

      clearInterval(stageInterval);
      setIsAnalyzing(false);
      onAnalysisComplete(result);
    } catch (err: any) {
      clearInterval(stageInterval);
      setIsAnalyzing(false);
      console.error('Analysis failed:', err);
      setErrorMessage(
        err.message || 'AI analysis is temporarily unavailable. You can use Demo Mode to explore the workflow.'
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title Header */}
      <div className="text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Step 1 • AI Vision Assessment
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Analyze E-Waste
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Upload or photograph scrap to detect valuable materials, check hazard safety, and find recyclers.
          </p>
        </div>

        {/* 1-Click Demo Shortcut */}
        <button
          id="analyze-load-demo-btn"
          type="button"
          onClick={onLaunchDemo}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold text-xs transition-colors self-start sm:self-auto shadow-xs"
          title="Instant realistic demo without uploading"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Load Demo Analysis</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Analysis Notice</p>
              <p className="text-xs text-rose-800 mt-0.5">{errorMessage}</p>
            </div>
          </div>
          <button
            id="fallback-to-demo-btn"
            onClick={onLaunchDemo}
            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shrink-0"
          >
            Explore in Demo Mode
          </button>
        </div>
      )}

      {/* Main Upload Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            1. E-Waste Photograph *
          </label>

          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 aspect-16/10 flex items-center justify-center group">
              <img
                src={imagePreview}
                alt="Selected E-Waste"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  id="replace-image-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-md"
                >
                  Change Photo
                </button>
                <button
                  id="remove-image-btn"
                  onClick={() => setImagePreview(null)}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              id="drag-drop-upload-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 shadow-xs">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Drag and drop your e-waste photo here
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                or click to browse files from your computer or phone gallery (PNG, JPEG, max 20MB)
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                  📁 Choose File
                </span>
                <span className="text-xs text-slate-400">or</span>
                <button
                  id="open-camera-trigger-btn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCameraOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Take Live Photo
                </button>
              </div>
            </div>
          )}

          <input
            id="hidden-file-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />
        </div>

        {/* Privacy Message */}
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            <strong>Privacy Note:</strong> Images are used for AI vision analysis. Avoid uploading personal documents or sensitive information.
          </span>
        </div>

        {/* Additional Scrap Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Weight */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-slate-500" />
              Batch Weight (kg)
            </label>
            <input
              id="analyze-weight-input"
              type="number"
              step="0.1"
              min="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="e.g. 2.5"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">Estimated or scaled weight</span>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-slate-500" />
              E-Waste Category
            </label>
            <select
              id="analyze-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {E_WASTE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Helps narrow material yield</span>
          </div>

          {/* Location City */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Scrap Shop City
            </label>
            <input
              id="analyze-city-input"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (e.g. Mumbai)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">For local recycler matching</span>
          </div>
        </div>

        {/* Quick City Selector Chips */}
        <div>
          <span className="text-xs font-semibold text-slate-500 mr-2">Quick Cities:</span>
          <div className="inline-flex flex-wrap gap-1.5 mt-1">
            {POPULAR_CITIES.map((c) => (
              <button
                key={c}
                id={`city-chip-${c.toLowerCase()}`}
                type="button"
                onClick={() => {
                  setCity(c);
                  if (c === 'Mumbai' || c === 'Pune') setState('Maharashtra');
                  if (c === 'Delhi') setState('Delhi NCR');
                  if (c === 'Bengaluru') setState('Karnataka');
                  if (c === 'Hyderabad') setState('Telangana');
                  if (c === 'Chennai') setState('Tamil Nadu');
                  if (c === 'Ahmedabad') setState('Gujarat');
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  city.toLowerCase() === c.toLowerCase()
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Progress State */}
        {isAnalyzing ? (
          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
                <span className="font-bold text-base">Examining your e-waste...</span>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                Step {loadingStageIndex + 1} of {LOADING_STEPS.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${((loadingStageIndex + 1) / LOADING_STEPS.length) * 100}%` }}
              />
            </div>

            <p className="text-sm text-emerald-300 font-medium">
              {LOADING_STEPS[loadingStageIndex]}
            </p>
          </div>
        ) : (
          /* Main CTA */
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              id="start-ai-analysis-btn"
              type="button"
              onClick={handleAnalyze}
              disabled={!imagePreview}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Sparkles className="w-5 h-5 text-emerald-200" />
              <span>Analyze with AI</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              id="analyze-page-demo-sample-btn"
              type="button"
              onClick={onLaunchDemo}
              className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors"
            >
              Use Demo Sample
            </button>
          </div>
        )}
      </div>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(capturedBase64) => {
          setImagePreview(capturedBase64);
        }}
      />
    </div>
  );
};
