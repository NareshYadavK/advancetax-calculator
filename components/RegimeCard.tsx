
import React from 'react';
import { TaxBreakdown } from '../types';

interface RegimeCardProps {
  title: string;
  data: TaxBreakdown;
  isBest: boolean;
  color: string;
}

const RegimeCard: React.FC<RegimeCardProps> = ({ title, data, isBest, color }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm regime-card-transition ${
      isBest 
        ? `ring-4 ring-${color}-500/20 border-${color}-500 scale-[1.02] shadow-xl z-10` 
        : 'border-slate-200 scale-100 grayscale-[0.2] opacity-90'
    }`}>
      {isBest && (
        <div className={`absolute top-0 right-0 bg-${color}-500 px-3 py-1 text-[10px] font-bold uppercase text-white rounded-bl-lg animate-in slide-in-from-top-2 duration-500`}>
          Recommended
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-4">
        <h3 className={`text-lg font-bold transition-colors duration-500 ${isBest ? `text-${color}-900` : 'text-slate-700'}`}>
          {title}
        </h3>
        {isBest && (
          <svg className={`w-5 h-5 text-${color}-500 animate-in zoom-in duration-500`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Taxable Slab Income</span>
          <span className="font-medium text-slate-900">{formatCurrency(data.taxableIncome)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Tax on Slab</span>
          <span className="font-medium text-slate-900">{formatCurrency(data.baseTax)}</span>
        </div>
        {data.capitalGainsTax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Capital Gains Tax</span>
            <span className="font-medium text-slate-900">{formatCurrency(data.capitalGainsTax)}</span>
          </div>
        )}
        {data.rebate87A > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600 font-medium">Rebate (87A)</span>
            <span className="font-medium text-emerald-600">-{formatCurrency(data.rebate87A)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Surcharge & Cess</span>
          <span className="font-medium text-slate-900">{formatCurrency(data.surcharge + data.cess)}</span>
        </div>
        
        <div className={`pt-3 border-t transition-colors duration-500 ${isBest ? `border-${color}-100` : 'border-slate-100'}`}>
          <div className="flex justify-between items-baseline">
            <span className="text-base font-bold text-slate-900">Total Tax</span>
            <span className={`text-2xl font-bold transition-all duration-500 ${isBest ? `text-${color}-600 scale-110` : 'text-slate-900 scale-100'}`}>
              {formatCurrency(data.totalTax)}
            </span>
          </div>
          <div className="text-[10px] text-right text-slate-400 mt-1">
            Effective Rate: {data.effectiveRate.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Slab Breakdown</p>
        <div className="space-y-1">
          {data.slabs.map((slab, i) => (
            <div key={i} className="flex justify-between text-[11px] text-slate-600">
              <span>{slab.range} ({slab.rate})</span>
              <span>{formatCurrency(slab.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegimeCard;
