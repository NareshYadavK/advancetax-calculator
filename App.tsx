
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { 
  Calculator, Receipt, ShieldCheck, Wallet, ArrowRightLeft, 
  ChevronRight, Building2, Briefcase, TrendingUp, Info
} from 'lucide-react';
import { TaxRegime, IncomeData, DeductionsData, ComparisonResult } from './types';
import { calculateTax } from './utils/taxCalculator';
import InputGroup from './components/InputGroup';
import TaxAssistant from './components/TaxAssistant';
import QuarterlyCard from './components/QuarterlyCard';

const App: React.FC = () => {
  const [income, setIncome] = useState<IncomeData>({
    salary: 0,
    houseProperty: 0,
    businessProfession: 0,
    capitalGainsSTCG: 0,
    capitalGainsLTCG: 0,
    otherSources: 0,
    tdsTcs: 0,
  });

  const [deductions, setDeductions] = useState<DeductionsData>({
    section80C: 0,
    section80D: 0,
    section80CCD1B: 0,
    section80E: 0,
    section80G: 0,
    section80TTA: 0,
    hra: 0,
    otherDeductions: 0,
  });

  const results: ComparisonResult = useMemo(() => {
    const oldRes = calculateTax(income, deductions, TaxRegime.OLD);
    const newRes = calculateTax(income, deductions, TaxRegime.NEW);
    
    const bestRegime = oldRes.totalTaxLiability < newRes.totalTaxLiability ? TaxRegime.OLD : TaxRegime.NEW;
    const savings = Math.abs(oldRes.totalTaxLiability - newRes.totalTaxLiability);

    return {
      oldRegime: oldRes,
      newRegime: newRes,
      bestRegime,
      savings
    };
  }, [income, deductions]);

  const [manualScheduleRegime, setManualScheduleRegime] = useState<TaxRegime | null>(null);
  const activeScheduleRegime = manualScheduleRegime || results.bestRegime;

  const updateIncome = (key: keyof IncomeData, val: number) => {
    setIncome(prev => ({ ...prev, [key]: val }));
  };

  const updateDeduction = (key: keyof DeductionsData, val: number) => {
    setDeductions(prev => ({ ...prev, [key]: val }));
  };

  const chartData = [
    { name: 'Old Regime', tax: results.oldRegime.totalTaxLiability },
    { name: 'New Regime', tax: results.newRegime.totalTaxLiability },
  ];

  const sourceData = [
    { name: 'Salary', value: income.salary },
    { name: 'House', value: income.houseProperty },
    { name: 'Business', value: income.businessProfession },
    { name: 'Gains', value: income.capitalGainsSTCG + income.capitalGainsLTCG },
    { name: 'Others', value: income.otherSources },
  ].filter(d => d.value > 0);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-slate-900 text-white py-8 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Calculator className="w-8 h-8 text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">TaxAdvance Pro</h1>
              <p className="text-slate-400 text-sm">FY 2025-26 | Assessment Year 2026-27</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-800 p-2 rounded-xl border border-slate-700">
            <div className="px-4 py-2">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Best Regime</div>
              <div className="text-xl font-bold text-emerald-400">
                {results.bestRegime} Regime
              </div>
            </div>
            <div className="h-10 w-px bg-slate-700" />
            <div className="px-4 py-2">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Potential Savings</div>
              <div className="text-xl font-bold text-white">
                ₹{results.savings.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: INPUTS */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
              <Receipt className="text-emerald-600 w-5 h-5" />
              <h2 className="text-lg font-bold text-slate-800">Income Sources</h2>
            </div>
            
            <InputGroup 
              label="Gross Salary" 
              value={income.salary} 
              onChange={(v) => updateIncome('salary', v)} 
              icon={<Briefcase className="w-4 h-4" />}
              description="Before standard deduction"
            />
            <InputGroup 
              label="House Property (Net)" 
              value={income.houseProperty} 
              onChange={(v) => updateIncome('houseProperty', v)} 
              icon={<Building2 className="w-4 h-4" />}
              description="Rental income minus taxes/interest"
            />
            <InputGroup 
              label="Business/Profession" 
              value={income.businessProfession} 
              onChange={(v) => updateIncome('businessProfession', v)} 
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <InputGroup 
              label="Short Term Capital Gains" 
              value={income.capitalGainsSTCG} 
              onChange={(v) => updateIncome('capitalGainsSTCG', v)} 
            />
            <InputGroup 
              label="Long Term Capital Gains" 
              value={income.capitalGainsLTCG} 
              onChange={(v) => updateIncome('capitalGainsLTCG', v)} 
            />
            <InputGroup 
              label="Income from Other Sources" 
              value={income.otherSources} 
              onChange={(v) => updateIncome('otherSources', v)} 
              description="Interest, Dividends, etc."
            />
            <InputGroup 
              label="TDS/TCS Already Paid" 
              value={income.tdsTcs} 
              onChange={(v) => updateIncome('tdsTcs', v)} 
              icon={<ShieldCheck className="w-4 h-4" />}
              description="Deducted at source"
            />
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
              <Wallet className="text-blue-600 w-5 h-5" />
              <h2 className="text-lg font-bold text-slate-800">Deductions (Old Regime)</h2>
            </div>
            <InputGroup 
              label="Section 80C" 
              value={deductions.section80C} 
              onChange={(v) => updateDeduction('section80C', v)} 
              description="LIC, PPF, ELSS, etc. (Max 1.5L)"
            />
            <InputGroup 
              label="Section 80D (Health)" 
              value={deductions.section80D} 
              onChange={(v) => updateDeduction('section80D', v)} 
              description="Self + Family Insurance"
            />
            <InputGroup 
              label="80CCD(1B) - NPS" 
              value={deductions.section80CCD1B} 
              onChange={(v) => updateDeduction('section80CCD1B', v)} 
              description="Additional NPS (Max 50k)"
            />
            <InputGroup 
              label="HRA / Rent Allowance" 
              value={deductions.hra} 
              onChange={(v) => updateDeduction('hra', v)} 
            />
          </section>

          <TaxAssistant data={results} />
        </div>

        {/* RIGHT COLUMN: DASHBOARD & RESULTS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* COMPARISON CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl border-2 transition-all ${results.bestRegime === TaxRegime.NEW ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${results.bestRegime === TaxRegime.NEW ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  New Regime
                </span>
                {results.bestRegime === TaxRegime.NEW && <ShieldCheck className="text-emerald-600 w-6 h-6" />}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Gross Total Income</span>
                  <span>₹{results.newRegime.grossTotalIncome.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Total Deductions</span>
                  <span>₹{results.newRegime.totalDeductions.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-end">
                  <span className="font-semibold text-slate-700">Tax Liability</span>
                  <span className="text-2xl font-bold text-slate-900">₹{results.newRegime.totalTaxLiability.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border-2 transition-all ${results.bestRegime === TaxRegime.OLD ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${results.bestRegime === TaxRegime.OLD ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  Old Regime
                </span>
                {results.bestRegime === TaxRegime.OLD && <ShieldCheck className="text-emerald-600 w-6 h-6" />}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Gross Total Income</span>
                  <span>₹{results.oldRegime.grossTotalIncome.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Total Deductions</span>
                  <span>₹{results.oldRegime.totalDeductions.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-end">
                  <span className="font-semibold text-slate-700">Tax Liability</span>
                  <span className="text-2xl font-bold text-slate-900">₹{results.oldRegime.totalTaxLiability.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ADVANCE TAX SCHEDULE */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="text-emerald-600" />
                  Advance Tax Schedule
                </h2>
                <p className="text-slate-500 text-sm mt-1">Quarterly installments for FY 2025-26</p>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl border border-slate-100">
                <button 
                  onClick={() => setManualScheduleRegime(TaxRegime.NEW)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeScheduleRegime === TaxRegime.NEW ? 'bg-white shadow-sm text-emerald-600 border border-slate-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'}`}
                >
                  New Regime
                </button>
                <button 
                  onClick={() => setManualScheduleRegime(TaxRegime.OLD)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeScheduleRegime === TaxRegime.OLD ? 'bg-white shadow-sm text-emerald-600 border border-slate-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'}`}
                >
                  Old Regime
                </button>
              </div>

              <div className="hidden xl:block text-right">
                <div className="text-xs text-slate-400 font-bold uppercase">Net Payable After TDS</div>
                <div className="text-xl font-bold text-slate-900">
                  ₹{results[activeScheduleRegime === TaxRegime.NEW ? 'newRegime' : 'oldRegime'].netPayableAfterTDS.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <QuarterlyCard 
                title="Q1 Installment" 
                date="June 15, 2025" 
                percentage="15%" 
                amount={results[activeScheduleRegime === TaxRegime.NEW ? 'newRegime' : 'oldRegime'].quarterlyPayments.june}
                cumulative={false}
              />
              <QuarterlyCard 
                title="Q2 Installment" 
                date="Sept 15, 2025" 
                percentage="45%" 
                amount={results[activeScheduleRegime === TaxRegime.NEW ? 'newRegime' : 'oldRegime'].quarterlyPayments.september}
                cumulative={true}
              />
              <QuarterlyCard 
                title="Q3 Installment" 
                date="Dec 15, 2025" 
                percentage="75%" 
                amount={results[activeScheduleRegime === TaxRegime.NEW ? 'newRegime' : 'oldRegime'].quarterlyPayments.december}
                cumulative={true}
              />
              <QuarterlyCard 
                title="Q4 Installment" 
                date="Mar 15, 2026" 
                percentage="100%" 
                amount={results[activeScheduleRegime === TaxRegime.NEW ? 'newRegime' : 'oldRegime'].quarterlyPayments.march}
                cumulative={true}
              />
            </div>

            {results[activeScheduleRegime === TaxRegime.NEW ? 'newRegime' : 'oldRegime'].netPayableAfterTDS < 10000 && (
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                <Info className="text-amber-600 w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <span className="font-bold">Note:</span> Advance tax is not applicable if your total tax liability after TDS is less than ₹10,000. You can pay this at the time of filing your return (Self Assessment Tax).
                </p>
              </div>
            )}
          </section>

          {/* VISUALIZATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-slate-400" />
                Regime Comparison
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Tax']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="tax" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.tax === Math.min(...chartData.map(d => d.tax)) ? '#10b981' : '#94a3b8'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Income Distribution</h3>
              <div className="h-64">
                {sourceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 italic text-sm">
                    Enter some income to see breakdown
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 mt-12 text-center text-slate-400 text-xs">
        <p>© 2025 TaxAdvance Pro. All calculations are estimates based on standard interpretation of the Indian Income Tax Act. Please consult a qualified Chartered Accountant for professional tax advice.</p>
      </footer>
    </div>
  );
};

export default App;
