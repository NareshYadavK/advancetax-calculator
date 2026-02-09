
import React, { useState, useEffect } from 'react';

interface HRACalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (amount: number) => void;
  initialSalary?: number;
}

const HRACalculatorModal: React.FC<HRACalculatorModalProps> = ({ isOpen, onClose, onApply, initialSalary = 0 }) => {
  const [basicSalary, setBasicSalary] = useState(initialSalary * 0.5); // Default to 50% of salary as a starting point
  const [actualHRA, setActualHRA] = useState(0);
  const [rentPaid, setRentPaid] = useState(0);
  const [isMetro, setIsMetro] = useState(false);
  const [result, setResult] = useState(0);

  useEffect(() => {
    // HRA Exemption logic (Rule 2A)
    // Minimum of:
    // 1. Actual HRA received
    // 2. 50% of (Basic+DA) for Metro, 40% for Non-metro
    // 3. Rent paid minus 10% of (Basic+DA)
    
    const rule1 = actualHRA;
    const rule2 = isMetro ? (basicSalary * 0.5) : (basicSalary * 0.4);
    const rule3 = Math.max(0, rentPaid - (basicSalary * 0.1));
    
    const calculatedExemption = Math.min(rule1, rule2, rule3);
    setResult(calculatedExemption);
  }, [basicSalary, actualHRA, rentPaid, isMetro]);

  if (!isOpen) return null;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">HRA Exemption Helper</h3>
            <p className="text-xs text-slate-500">Calculate your eligible HRA deduction</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Annual Basic Salary + DA</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input 
                type="number" 
                value={basicSalary || ''} 
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Actual HRA Received (from employer)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input 
                type="number" 
                value={actualHRA || ''} 
                onChange={(e) => setActualHRA(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Total Rent Paid (Annually)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input 
                type="number" 
                value={rentPaid || ''} 
                onChange={(e) => setRentPaid(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <input 
              type="checkbox" 
              id="isMetro" 
              checked={isMetro} 
              onChange={(e) => setIsMetro(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isMetro" className="text-sm font-medium text-slate-700 cursor-pointer">
              Living in a Metro City? (Mumbai, Delhi, Kolkata, Chennai)
            </label>
          </div>

          <div className="mt-8 p-6 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <div className="flex justify-between items-center">
              <span className="text-indigo-100 font-medium">Eligible HRA Exemption</span>
              <span className="text-2xl font-bold">{formatCurrency(result)}</span>
            </div>
            <div className="mt-2 text-[10px] text-indigo-200 uppercase tracking-widest font-bold">
              Calculated based on Section 10(13A)
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onApply(result);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
          >
            Apply Deduction
          </button>
        </div>
      </div>
    </div>
  );
};

export default HRACalculatorModal;
