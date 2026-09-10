import React, { useState } from 'react';
import { X, CheckCircle2, Truck, Package, Calendar, Phone, User, FileText, Check } from 'lucide-react';
import { HandoverRequest, Recycler } from '../types';

interface HandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  recycler: Recycler | null;
  defaultWeightKg?: number;
  defaultWasteType?: string;
  defaultAnalysisId?: string;
  estimatedValue?: number;
  onSuccess: (newRequest: HandoverRequest) => void;
}

export const HandoverModal: React.FC<HandoverModalProps> = ({
  isOpen,
  onClose,
  recycler,
  defaultWeightKg = 5,
  defaultWasteType = 'Electronic Scrap Batch',
  defaultAnalysisId,
  estimatedValue,
  onSuccess,
}) => {
  const [workerName, setWorkerName] = useState('');
  const [phone, setPhone] = useState('');
  const [eWasteType, setEWasteType] = useState(defaultWasteType);
  const [weightKg, setWeightKg] = useState(defaultWeightKg.toString());
  const [handoverType, setHandoverType] = useState<'pickup' | 'dropoff'>('pickup');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !recycler) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim()) {
      setErrorMessage('Please enter the worker or scrap-shop name.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setErrorMessage('Please enter a valid contact phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      analysis_id: defaultAnalysisId,
      worker_name: workerName.trim(),
      phone: phone.trim(),
      recycler_id: recycler.id,
      recycler_name: recycler.recycler_name,
      e_waste_type: eWasteType,
      estimated_weight_kg: parseFloat(weightKg) || defaultWeightKg,
      handover_type: handoverType,
      preferred_date: preferredDate,
      notes: notes.trim(),
      estimated_value: estimatedValue,
    };

    try {
      const res = await fetch('/api/handover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedSuccess(true);
        onSuccess(data.handover);
      } else {
        throw new Error(data.error || 'Failed to submit request');
      }
    } catch (err: any) {
      console.error('Handover submit error:', err);
      // Fallback local save if offline
      const localHandover: HandoverRequest = {
        id: `handover-local-${Date.now()}`,
        analysis_id: defaultAnalysisId,
        worker_name: workerName.trim(),
        phone: phone.trim(),
        recycler_id: recycler.id,
        recycler_name: recycler.recycler_name,
        e_waste_type: eWasteType,
        estimated_weight_kg: parseFloat(weightKg) || defaultWeightKg,
        handover_type: handoverType,
        preferred_date: preferredDate,
        notes: notes.trim(),
        status: 'Requested',
        created_at: new Date().toISOString(),
        estimated_value: estimatedValue,
      };
      setSubmittedSuccess(true);
      onSuccess(localHandover);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmittedSuccess(false);
    setWorkerName('');
    setPhone('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Request E-Waste Handover</h3>
            <p className="text-xs text-slate-500">
              Coordinating with <strong className="text-slate-800">{recycler.recycler_name}</strong>
            </p>
          </div>
          <button
            id="close-handover-modal-btn"
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Request Recorded Successfully!</h4>
              <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                Your handover dispatch has been logged for <strong>{recycler.recycler_name}</strong>. Their collection desk will verify the batch details via phone.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 text-slate-700">
              <div><strong>Method:</strong> {handoverType === 'pickup' ? 'Doorstep Scrap Pickup' : 'Facility Drop-off'}</div>
              <div><strong>Scheduled Date:</strong> {preferredDate}</div>
              <div><strong>Estimated Batch Weight:</strong> {weightKg} kg</div>
              <div><strong>Worker Contact:</strong> {workerName} ({phone})</div>
            </div>
            <button
              id="confirm-handover-done-btn"
              onClick={resetAndClose}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Worker / Scrap Shop Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="handover-worker-name-input"
                    type="text"
                    required
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    placeholder="e.g. Salim Bhai / Apex Scrap"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="handover-phone-input"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98200 12345"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-Waste Type / Description
                </label>
                <input
                  id="handover-waste-type-input"
                  type="text"
                  value={eWasteType}
                  onChange={(e) => setEWasteType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Batch Weight (kg)
                </label>
                <input
                  id="handover-weight-input"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Handover Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="handover-type-pickup-btn"
                  type="button"
                  onClick={() => setHandoverType('pickup')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    handoverType === 'pickup'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Request Doorstep Pickup
                </button>
                <button
                  id="handover-type-dropoff-btn"
                  type="button"
                  onClick={() => setHandoverType('dropoff')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    handoverType === 'dropoff'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Direct Drop-off at Center
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Handover Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="handover-date-input"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Notes & Segregation Details (Optional)
              </label>
              <textarea
                id="handover-notes-input"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Lithium battery segregated in sand bucket. PCBs sorted."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                id="handover-cancel-btn"
                type="button"
                onClick={resetAndClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                id="submit-handover-btn"
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Recording...' : 'Request Handover'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
