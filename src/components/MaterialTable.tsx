import React from 'react';
import { MaterialBreakdown } from '../types';
import { Layers, HelpCircle } from 'lucide-react';

interface MaterialTableProps {
  materials: MaterialBreakdown[];
}

export const MaterialTable: React.FC<MaterialTableProps> = ({ materials }) => {
  const totalWeight = materials.reduce((acc, m) => acc + (m.estimated_weight_kg || 0), 0);
  const totalSum = materials.reduce((acc, m) => acc + (m.estimated_value || 0), 0);

  return (
    <div id="material-breakdown-table" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Material & Component Valuation Breakdown</h3>
            <p className="text-xs text-slate-500">Deterministic price calculation per recoverable scrap category</p>
          </div>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 self-start sm:self-auto">
          Indicative Reference Prices (INR / kg)
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 sm:px-6 py-3">
                Recoverable Material
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3">
                Estimated Weight
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3">
                Indicative Reference Price
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-right">
                Estimated Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {materials.map((mat, index) => (
              <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 sm:px-6 py-3.5 font-semibold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>{mat.name}</span>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-3.5 text-slate-600 font-medium">
                  {mat.estimated_weight_kg.toFixed(2)} kg
                </td>
                <td className="px-4 sm:px-6 py-3.5 text-slate-600 font-medium">
                  ₹{mat.indicative_price_per_kg.toLocaleString('en-IN')}{' '}
                  <span className="text-xs text-slate-400">/ kg</span>
                </td>
                <td className="px-4 sm:px-6 py-3.5 text-right font-bold text-emerald-800">
                  ₹{mat.estimated_value.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50/80 font-bold border-t border-slate-200 text-slate-900">
            <tr>
              <td className="px-4 sm:px-6 py-3.5">Total Estimated Yield</td>
              <td className="px-4 sm:px-6 py-3.5 text-slate-700">{totalWeight.toFixed(2)} kg</td>
              <td className="px-4 sm:px-6 py-3.5 text-xs text-slate-500 font-normal">
                Weighted baseline calculation
              </td>
              <td className="px-4 sm:px-6 py-3.5 text-right text-base text-emerald-900">
                ₹{totalSum.toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="px-4 sm:px-6 py-3 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
        <span>* All rates are benchmark indicative reference prices for hackathon modeling.</span>
        <span>Deterministic Rule: Value = Weight × Reference Price</span>
      </div>
    </div>
  );
};
