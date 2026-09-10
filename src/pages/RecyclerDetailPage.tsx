import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  AlertOctagon,
  Truck,
  ArrowLeft,
  Calendar,
  Shield,
  Layers,
  FileCheck,
} from 'lucide-react';
import { Recycler, HandoverRequest } from '../types';
import { HandoverModal } from '../components/HandoverModal';

interface RecyclerDetailPageProps {
  recycler: Recycler;
  onBack: () => void;
  onRecordHandover: (handover: HandoverRequest) => void;
}

export const RecyclerDetailPage: React.FC<RecyclerDetailPageProps> = ({
  recycler,
  onBack,
  onRecordHandover,
}) => {
  const [handoverModalOpen, setHandoverModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back Button */}
      <button
        id="detail-back-btn"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Recyclers Directory</span>
      </button>

      {/* Main Recycler Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {recycler.verification_status}
              </span>
              {recycler.hazardous_waste_capability && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  Hazardous Waste Authorized
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {recycler.recycler_name}
            </h1>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {recycler.city}, {recycler.state}
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-mono text-xs text-slate-500">
                Lat: {recycler.latitude}, Lng: {recycler.longitude}
              </span>
            </div>
          </div>

          <button
            id="detail-request-handover-top-btn"
            onClick={() => setHandoverModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all self-start sm:self-auto"
          >
            <Truck className="w-4 h-4" />
            <span>Request Handover</span>
          </button>
        </div>

        {/* Operational Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs text-slate-500 font-semibold block">Minimum Batch</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
              {recycler.minimum_quantity_kg} kg
            </span>
            <span className="text-[11px] text-slate-500">Shop lots accepted</span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs text-slate-500 font-semibold block">Pickup Logistics</span>
            <span className="text-xl font-extrabold text-emerald-700 mt-0.5 block">
              {recycler.pickup_available ? 'Available' : 'Drop-off Only'}
            </span>
            <span className="text-[11px] text-slate-500">Doorstep vehicle dispatch</span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs text-slate-500 font-semibold block">Pricing Benchmark</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
              {recycler.price_range_indicator}
            </span>
            <span className="text-[11px] text-slate-500">Competitive regional rates</span>
          </div>
        </div>

        {/* Accepted Materials List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Accepted Material Streams
          </h3>
          <div className="flex flex-wrap gap-2">
            {recycler.accepted_materials.map((mat, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold"
              >
                {mat}
              </span>
            ))}
          </div>
        </div>

        {/* Accepted E-Waste Device Types */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            Accepted E-Waste Product Types
          </h3>
          <div className="flex flex-wrap gap-2">
            {recycler.accepted_e_waste_types.map((type, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Compliance & Verification Info */}
        <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200 space-y-2 text-xs text-emerald-950">
          <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
            <FileCheck className="w-4 h-4 text-emerald-700" />
            <span>Audited & Regulatory Compliance</span>
          </div>
          <p>
            Facility verification verified on <strong>{recycler.last_verified_date}</strong>. Valid state environmental authorization for electronic scrap processing, mechanical separation, and high-temperature hydrometallurgical recovery.
          </p>
        </div>

        {/* Direct Contact Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
            <a
              id="call-facility-link"
              href={`tel:${recycler.contact_phone}`}
              className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800"
            >
              <Phone className="w-4 h-4" />
              <span>{recycler.contact_phone}</span>
            </a>
            <span className="text-slate-300">|</span>
            <a
              id="email-facility-link"
              href={`mailto:${recycler.contact_email}`}
              className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900"
            >
              <Mail className="w-4 h-4" />
              <span>{recycler.contact_email}</span>
            </a>
          </div>

          <button
            id="detail-request-handover-bottom-btn"
            onClick={() => setHandoverModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Dispatch Handover Request
          </button>
        </div>
      </div>

      {/* Handover Modal */}
      <HandoverModal
        isOpen={handoverModalOpen}
        onClose={() => setHandoverModalOpen(false)}
        recycler={recycler}
        defaultWeightKg={recycler.minimum_quantity_kg}
        defaultWasteType="Scrap Batch Collection"
        onSuccess={(handover) => {
          onRecordHandover(handover);
        }}
      />
    </div>
  );
};
