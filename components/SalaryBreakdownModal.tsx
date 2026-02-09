
import React, { useState, useEffect } from 'react';

interface SalaryBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (amount: number) => void;
  currentSalary: number;
}

const SalaryBreakdownModal: React.FC<SalaryBreakdownModalProps> = ({ isOpen, onClose, onApply, currentSalary }) => {
  const [monthlyBasic, setMonthlyBasic] = useState(Math.round((currentSalary * 0.5) / 12));
  const [monthlyHRA, setMonthlyHRA] = useState(Math.round((currentSalary * 0.2) / 12));
  const [monthlySpecial, setMonthlySpecial] = useState(Math.round((currentSalary * 0.3) / 12));
  const [annualBonus, setAnnualBonus] = useState(0);
  const [annualTotal, setAnnualTotal] = useState(currentSalary);

  useEffect(() => {
    const total = (monthlyBasic + monthlyHRA + monthlySpecial) * 12 + annualBonus;
    setAnnualTotal(total);
  }, [monthlyBasic, monthlyHRA, monthlySpecial, annualBonus]);

  if (!isOpen) return null;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Salary Breakdown</h3>
            <p className="text-xs text-slate-500">Construct your annual salary from monthly components</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Monthly Basic</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                <input 
                  type="number" 
                  value={monthlyBasic || ''} 
                  onChange={(e) => setMonthlyBasic(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Monthly HRA</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                <input 
                  type="number" 
                  value={monthlyHRA || ''} 
                  onChange={(e) => setMonthlyHRA(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Monthly Special Allowance / Others</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
              <input 
                type="number" 
                value={monthlySpecial || ''} 
                onChange={(e) => setMonthlySpecial(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Annual Performance Bonus / One-time</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
              <input 
                type="number" 
                value={annualBonus || ''} 
                onChange={(e) => setAnnualBonus(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                placeholder="0"
              />
            </div>
          </div>

          <div className="mt-6 p-5 bg-slate-900 rounded-2xl text-white shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-0.5">Calculated Annual CTC</span>
                <span className="text-2xl font-bold text-indigo-400">{formatCurrency(annualTotal)}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-0.5">Monthly Take-home*</span>
                <span className="text-lg font-semibold text-slate-200">{formatCurrency(Math.round(annualTotal / 12))}</span>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-slate-500 italic">*Excluding tax and PF deductions</p>
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
              onApply(annualTotal);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl font-bold bg-slate-900 text-white hover:bg-black shadow-md transition-all"
          >
            Update Annual Salary
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalaryBreakdownModal;
