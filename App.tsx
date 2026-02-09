
import React, { useState, useMemo, useEffect } from 'react';
import { TaxInputs, CalculationResult } from './types';
import { calculateTax } from './services/calculatorService';
import { getTaxAdvice } from './services/geminiService';
import { generateTaxPDF } from './services/pdfService';
import InputGroup from './components/InputGroup';
import RegimeCard from './components/RegimeCard';
import HRACalculatorModal from './components/HRACalculatorModal';
import SalaryBreakdownModal from './components/SalaryBreakdownModal';
import TaxSavingTips from './components/TaxSavingTips';
import TaxDetailVisualizer from './components/TaxDetailVisualizer';
import CapitalGainsCalculator from './components/CapitalGainsCalculator';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<TaxInputs>({
    salary: 1200000,
    houseRent: 0,
    bonus: 0,
    interestIncome: 0,
    rentalIncome: 0,
    otherIncome: 0,
    standardDeduction: 75000,
    deduction80C: 150000,
    deduction80D: 25000,
    deductionHRA: 0,
    deduction80TTA: 0,
    homeLoanInterest: 0,
    otherDeductions: 0,
    age: 'below60',
    equitySTCG: 0,
    equityLTCG: 0,
    debtSTCG: 0,
    debtLTCG: 0,
    propertySTCG: 0,
    propertyLTCG: 0,
  });

  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isHraModalOpen, setIsHraModalOpen] = useState(false);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);

  const results = useMemo(() => calculateTax(inputs), [inputs]);

  const handleAiConsult = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    const response = await getTaxAdvice(aiQuery, {
      grossIncome: inputs.salary + inputs.bonus + inputs.interestIncome + inputs.rentalIncome + inputs.otherIncome + inputs.equitySTCG + inputs.equityLTCG + inputs.debtSTCG + inputs.debtLTCG + inputs.propertySTCG + inputs.propertyLTCG,
      newRegime: results.newRegime,
      oldRegime: results.oldRegime,
      age: inputs.age
    });
    setAiResponse(response);
    setIsAiLoading(false);
  };

  const updateInput = (key: keyof TaxInputs, val: any) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  const betterRegime = results.newRegime.totalTax <= results.oldRegime.totalTax ? 'new' : 'old';
  const taxSavings = Math.abs(results.newRegime.totalTax - results.oldRegime.totalTax);

  const ageOptions = [
    { id: 'below60', label: 'Below 60', sub: 'General' },
    { id: '60to80', label: '60 - 80', sub: 'Senior' },
    { id: 'above80', label: 'Above 80', sub: 'Super Senior' },
  ];

  const interestDeductionLabel = inputs.age === 'below60' ? 'Section 80TTA (Savings Interest)' : 'Section 80TTB (Interest Income)';
  const interestDeductionTooltip = inputs.age === 'below60' ? 'Max ₹10,000 for savings account interest' : 'Max ₹50,000 for all bank interest';

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const totalLiability = betterRegime === 'new' ? results.newRegime.totalTax : results.oldRegime.totalTax;
  const isAdvanceTaxRequired = totalLiability > 10000;

  const installments = [
    { label: '1st Installment', date: 'June 15, 2025', percent: '15%', amount: totalLiability * 0.15, icon: '🌱' },
    { label: '2nd Installment', date: 'Sept 15, 2025', percent: '45%', amount: totalLiability * 0.45, icon: '☀️' },
    { label: '3rd Installment', date: 'Dec 15, 2025', percent: '75%', amount: totalLiability * 0.75, icon: '🍂' },
    { label: '4th Installment', date: 'Mar 15, 2026', percent: '100%', amount: totalLiability * 1.00, icon: '❄️' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <HRACalculatorModal 
        isOpen={isHraModalOpen} 
        onClose={() => setIsHraModalOpen(false)} 
        onApply={(val) => updateInput('deductionHRA', val)}
        initialSalary={inputs.salary}
      />

      <SalaryBreakdownModal
        isOpen={isSalaryModalOpen}
        onClose={() => setIsSalaryModalOpen(false)}
        onApply={(val) => updateInput('salary', val)}
        currentSalary={inputs.salary}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Advance TaxPro <span className="text-indigo-600">2025-26</span></h1>
          </div>
          <div className="hidden sm:block text-sm text-slate-500 font-medium">
            Assessment Year: 2026-27
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Age Category
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {ageOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateInput('age', opt.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
                      inputs.age === opt.id
                        ? 'bg-indigo-50 border-indigo-600 ring-1 ring-indigo-600 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${inputs.age === opt.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {opt.sub}
                    </span>
                    <span className={`text-xs font-semibold ${inputs.age === opt.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Income Sources
              </h2>
              <div className="relative group">
                <InputGroup label="Annual Salary" value={inputs.salary} onChange={(v) => updateInput('salary', v)} />
                <button 
                  onClick={() => setIsSalaryModalOpen(true)}
                  className="absolute right-0 top-0 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded hover:bg-indigo-100 transition-colors"
                >
                  BREAKDOWN
                </button>
              </div>
              <InputGroup label="Bonus/Performance Pay" value={inputs.bonus} onChange={(v) => updateInput('bonus', v)} />
              <InputGroup label="Interest Income" value={inputs.interestIncome} onChange={(v) => updateInput('interestIncome', v)} />
              <InputGroup label="Rental Income" value={inputs.rentalIncome} onChange={(v) => updateInput('rentalIncome', v)} />
              <InputGroup label="Other Income" value={inputs.otherIncome} onChange={(v) => updateInput('otherIncome', v)} />
            </div>

            <CapitalGainsCalculator inputs={inputs} onUpdate={updateInput} />

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Deductions (Old Regime)
                </h2>
              </div>
              <InputGroup label="Section 80C (LIC, PF, ELSS)" value={inputs.deduction80C} onChange={(v) => updateInput('deduction80C', v)} tooltip="Max ₹1.5L" />
              <InputGroup label="Section 80D (Health Insurance)" value={inputs.deduction80D} onChange={(v) => updateInput('deduction80D', v)} tooltip="Max ₹25k - ₹1L" />
              
              <div className="relative group">
                <InputGroup label="HRA Exemption" value={inputs.deductionHRA} onChange={(v) => updateInput('deductionHRA', v)} />
                <button 
                  onClick={() => setIsHraModalOpen(true)}
                  className="absolute right-0 top-0 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded hover:bg-indigo-100 transition-colors"
                >
                  CALCULATE
                </button>
              </div>

              <InputGroup label={interestDeductionLabel} value={inputs.deduction80TTA} onChange={(v) => updateInput('deduction80TTA', v)} tooltip={interestDeductionTooltip} />
              <InputGroup label="Home Loan Interest (24b)" value={inputs.homeLoanInterest} onChange={(v) => updateInput('homeLoanInterest', v)} tooltip="Max ₹2L" />
              <InputGroup label="Other Deductions" value={inputs.otherDeductions} onChange={(v) => updateInput('otherDeductions', v)} />
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Advance Tax Summary Banner */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Estimated Total Liability</h2>
                    <div className="text-4xl font-extrabold text-slate-900 tabular-nums animate-in fade-in duration-500">
                      {formatCurrency(totalLiability)}
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                        {isAdvanceTaxRequired 
                            ? "You are required to pay Advance Tax as your liability exceeds ₹10,000."
                            : "No Advance Tax liability (Total tax is less than ₹10,000)."}
                    </p>
                </div>
                <div className="flex-none w-px bg-slate-100 hidden md:block"></div>
                <div className="flex-1 flex flex-col justify-center">
                  <button 
                    onClick={() => generateTaxPDF(inputs, results)}
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Detailed Report
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-wider">Generated for FY 2025-26</p>
                </div>
            </div>

            {/* Recommendation Banner with Smooth Switching */}
            <div className={`rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border transition-all duration-700 ease-in-out ${
              betterRegime === 'new' 
                ? 'bg-indigo-50 border-indigo-100 shadow-inner' 
                : 'bg-emerald-50 border-emerald-100 shadow-inner'
            }`}>
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className={`p-3 rounded-xl transition-colors duration-700 ${betterRegime === 'new' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                  <svg className="w-8 h-8 text-white animate-in zoom-in duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Optimal Choice: <span className="uppercase">{betterRegime}</span> Regime
                  </h3>
                  <div key={taxSavings} className="text-slate-600 text-sm animate-pulse-once">
                    Potential Savings with this choice: <span className={`font-extrabold ${betterRegime === 'new' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                      {formatCurrency(taxSavings)}
                    </span>
                  </div>
                </div>
              </div>
              {taxSavings === 0 && (
                <div className="bg-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Both Equal
                </div>
              )}
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <RegimeCard 
                title="New Tax Regime" 
                data={results.newRegime} 
                isBest={betterRegime === 'new'} 
                color="indigo"
              />
              <RegimeCard 
                title={`Old Tax Regime (${inputs.age === 'below60' ? 'Individual' : inputs.age === '60to80' ? 'Senior' : 'Super Senior'})`} 
                data={results.oldRegime} 
                isBest={betterRegime === 'old'} 
                color="emerald"
              />
            </div>

            {/* Prominent Advance Tax Installment Schedule */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Advance Tax Payment Schedule</h2>
                  <p className="text-slate-500 text-sm mt-1">Calculated based on your <span className={`font-bold uppercase tracking-tight ${betterRegime === 'new' ? 'text-indigo-600' : 'text-emerald-600'}`}>{betterRegime} Regime</span> liability.</p>
                </div>
                {!isAdvanceTaxRequired && (
                  <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    NOT REQUIRED
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
                
                {installments.map((inst, i) => (
                  <div key={i} className={`relative z-10 bg-white border regime-card-transition ${isAdvanceTaxRequired ? 'border-slate-200' : 'border-slate-100 grayscale opacity-60'} rounded-2xl p-5 hover:border-indigo-300 transition-all hover:shadow-lg group`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl transition-transform group-hover:scale-125 duration-300">{inst.icon}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-1 rounded-lg uppercase tracking-widest ${betterRegime === 'new' ? 'text-indigo-600 bg-indigo-50' : 'text-emerald-600 bg-emerald-50'}`}>{inst.percent}</span>
                    </div>
                    <div className="space-y-1 mb-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{inst.label}</p>
                      <h4 className="text-sm font-bold text-slate-800">{inst.date}</h4>
                    </div>
                    <div className="pt-4 border-t border-slate-50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Cumulative Target</p>
                      <p className={`text-lg font-extrabold tabular-nums transition-colors duration-500 ${isAdvanceTaxRequired ? 'text-slate-900' : 'text-slate-400'}`}>
                        {formatCurrency(inst.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-start gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <svg className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-indigo-800 leading-relaxed">
                  <strong>Important:</strong> These are cumulative payment targets. For example, if you already paid the 1st installment, you only need to pay the difference by the 2nd installment date. Delay in payments may attract interest penalties under Section 234B and 234C.
                </p>
              </div>
            </section>

            <TaxDetailVisualizer 
              newRegime={results.newRegime} 
              oldRegime={results.oldRegime} 
            />

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 shadow-xl text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">AI Assistant</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Advance Tax Consultant</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="e.g. When is my next advance tax installment due?"
                    className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 placeholder:text-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                  <button 
                    onClick={handleAiConsult}
                    disabled={isAiLoading}
                    className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isAiLoading ? (
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Consult AI
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
                
                {aiResponse && (
                  <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-indigo-50 leading-relaxed text-sm whitespace-pre-wrap animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-2 rounded-lg mt-1">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        {aiResponse}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <TaxSavingTips />

          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        <div className="bg-slate-200/50 rounded-2xl p-6 text-center text-slate-500 text-xs leading-relaxed">
          <p className="font-semibold mb-2">Disclaimer & Info</p>
          <p>This calculator provides estimates for Advance Tax for FY 2025-26. While we use the latest slab rules, actual liability depends on your final annual income and deductions. Please consult a tax professional for precise tax planning.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
