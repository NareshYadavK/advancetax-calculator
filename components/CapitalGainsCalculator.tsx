
import React from 'react';
import InputGroup from './InputGroup';
import { TaxInputs } from '../types';

interface CapitalGainsCalculatorProps {
  inputs: TaxInputs;
  onUpdate: (key: keyof TaxInputs, val: number) => void;
}

const CapitalGainsCalculator: React.FC<CapitalGainsCalculatorProps> = ({ inputs, onUpdate }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Capital Gains
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Equity & Mutual Funds (Listed)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputGroup 
              label="STCG (Short Term)" 
              value={inputs.equitySTCG} 
              onChange={(v) => onUpdate('equitySTCG', v)} 
              tooltip="Holding period < 1 year. Taxed at 20%." 
            />
            <InputGroup 
              label="LTCG (Long Term)" 
              value={inputs.equityLTCG} 
              onChange={(v) => onUpdate('equityLTCG', v)} 
              tooltip="Holding period > 1 year. Taxed at 12.5% after ₹1.25L exemption." 
            />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Real Estate & Property</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputGroup 
              label="STCG (Short Term)" 
              value={inputs.propertySTCG} 
              onChange={(v) => onUpdate('propertySTCG', v)} 
              tooltip="Holding period < 2 years. Taxed at slab rates." 
            />
            <InputGroup 
              label="LTCG (Long Term)" 
              value={inputs.propertyLTCG} 
              onChange={(v) => onUpdate('propertyLTCG', v)} 
              tooltip="Holding period > 2 years. Taxed at 12.5% without indexation." 
            />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Debt Funds & Others</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputGroup 
              label="Debt STCG" 
              value={inputs.debtSTCG} 
              onChange={(v) => onUpdate('debtSTCG', v)} 
              tooltip="Holding period < 3 years (for older funds). Generally taxed at slab." 
            />
            <InputGroup 
              label="Debt LTCG" 
              value={inputs.debtLTCG} 
              onChange={(v) => onUpdate('debtLTCG', v)} 
              tooltip="Holding period > 3 years. Mostly taxed at slab for funds bought after 2023." 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapitalGainsCalculator;
