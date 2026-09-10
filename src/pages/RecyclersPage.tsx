import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  MapPin,
  ShieldCheck,
  Truck,
  AlertOctagon,
  Phone,
  Filter,
  CheckCircle2,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Recycler, HandoverRequest } from '../types';
import { DEMO_RECYCLERS } from '../data/recyclers';
import { HandoverModal } from '../components/HandoverModal';

interface RecyclersPageProps {
  onSelectRecycler: (recycler: Recycler) => void;
  onRecordHandover: (handover: HandoverRequest) => void;
}

export const RecyclersPage: React.FC<RecyclersPageProps> = ({
  onSelectRecycler,
  onRecordHandover,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [filterHazardousOnly, setFilterHazardousOnly] = useState(false);
  const [filterPickupOnly, setFilterPickupOnly] = useState(false);

  const [handoverModalOpen, setHandoverModalOpen] = useState(false);
  const [activeRecyclerForHandover, setActiveRecyclerForHandover] = useState<Recycler | null>(null);

  // Extract unique cities
  const uniqueCities = useMemo(() => {
    const cities = new Set(DEMO_RECYCLERS.map((r) => r.city));
    return ['All', ...Array.from(cities).sort()];
  }, []);

  // Filtered recyclers
  const filteredRecyclers = useMemo(() => {
    return DEMO_RECYCLERS.filter((rec) => {
      if (selectedCity !== 'All' && rec.city !== selectedCity) {
        return false;
      }
      if (filterHazardousOnly && !rec.hazardous_waste_capability) {
        return false;
      }
      if (filterPickupOnly && !rec.pickup_available) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = rec.recycler_name.toLowerCase().includes(query);
        const matchesCity = rec.city.toLowerCase().includes(query);
        const matchesMaterial = rec.accepted_materials.some((m) => m.toLowerCase().includes(query));
        const matchesType = rec.accepted_e_waste_types.some((t) => t.toLowerCase().includes(query));
        return matchesName || matchesCity || matchesMaterial || matchesType;
      }
      return true;
    });
  }, [searchQuery, selectedCity, filterHazardousOnly, filterPickupOnly]);

  const handleOpenHandover = (rec: Recycler) => {
    setActiveRecyclerForHandover(rec);
    setHandoverModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Recycler Marketplace
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            25 Registered Facilities
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Authorized E-Waste Recycler Directory
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Connect directly with licensed dismantlers, PCB smelters, and safe hazardous waste management plants across India.
        </p>
      </div>

      {/* Demo Notice Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Demo Recycler Profiles:</strong> High-fidelity benchmark data for hackathon evaluation. Real-world deployments can seamlessly ingest regional CPCB / SPCB state registry databases.
          </span>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shrink-0">
          Showing {filteredRecyclers.length} of {DEMO_RECYCLERS.length}
        </span>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              id="recycler-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by facility name, material (e.g. Copper, PCB), or category..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* City Dropdown */}
          <div className="sm:col-span-3">
            <select
              id="recycler-city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city === 'All' ? 'All Cities & States' : city}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Toggles */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <button
              id="toggle-hazardous-filter-btn"
              type="button"
              onClick={() => setFilterHazardousOnly(!filterHazardousOnly)}
              className={`flex-1 py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                filterHazardousOnly
                  ? 'bg-rose-50 text-rose-900 border-rose-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Hazardous Auth</span>
            </button>

            <button
              id="toggle-pickup-filter-btn"
              type="button"
              onClick={() => setFilterPickupOnly(!filterPickupOnly)}
              className={`flex-1 py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                filterPickupOnly
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Free Pickup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recyclers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecyclers.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {rec.recycler_name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rec.city}, {rec.state}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 whitespace-nowrap">
                  Min {rec.minimum_quantity_kg} kg
                </span>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {rec.verification_status}
                </span>
                {rec.hazardous_waste_capability && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                    <AlertOctagon className="w-3 h-3 text-rose-600" />
                    Hazardous Licensed
                  </span>
                )}
                {rec.pickup_available && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    <Truck className="w-3 h-3 text-teal-600" />
                    Doorstep Pickup
                  </span>
                )}
              </div>

              {/* Accepted Materials */}
              <div className="space-y-1 mb-3 text-xs">
                <span className="text-[11px] font-semibold text-slate-500">Materials:</span>
                <div className="flex flex-wrap gap-1">
                  {rec.accepted_materials.slice(0, 5).map((m, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {m}
                    </span>
                  ))}
                  {rec.accepted_materials.length > 5 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{rec.accepted_materials.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div className="text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl">
                <strong>Indicative Price Tier:</strong> {rec.price_range_indicator}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                id={`directory-handover-btn-${rec.id}`}
                onClick={() => handleOpenHandover(rec)}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Request Handover</span>
              </button>

              <button
                id={`directory-profile-btn-${rec.id}`}
                onClick={() => onSelectRecycler(rec)}
                className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRecyclers.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No recyclers matched your search criteria</h3>
          <p className="text-xs mt-1">Try resetting city filters or searching for different material streams.</p>
        </div>
      )}

      {/* Handover Request Modal */}
      <HandoverModal
        isOpen={handoverModalOpen}
        onClose={() => setHandoverModalOpen(false)}
        recycler={activeRecyclerForHandover}
        defaultWeightKg={activeRecyclerForHandover?.minimum_quantity_kg || 10}
        defaultWasteType="Electronic Scrap Batch"
        onSuccess={(handover) => {
          onRecordHandover(handover);
        }}
      />
    </div>
  );
};
