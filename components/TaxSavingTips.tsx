
import React from 'react';

const tips = [
  {
    category: 'Section 80C',
    limit: '₹1.5 Lakh',
    items: [
      { title: 'ELSS Funds', description: 'Equity Linked Savings Schemes offer the shortest lock-in period (3 years) and high return potential.' },
      { title: 'PPF', description: 'Public Provident Fund is a safe, long-term investment with EEE tax status.' },
      { title: 'EPF', description: 'Employee Provident Fund contributions are eligible for deduction.' },
      { title: 'Life Insurance', description: 'Premiums paid for self, spouse, and children are deductible.' }
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'indigo'
  },
  {
    category: 'Section 80D',
    limit: 'Up to ₹1 Lakh',
    items: [
      { title: 'Self/Family Insurance', description: 'Deduction up to ₹25,000 for premiums paid (₹50,000 if senior citizen).' },
      { title: 'Parents Insurance', description: 'Additional deduction up to ₹25,000 (₹50,000 if parents are senior citizens).' },
      { title: 'Preventive Checkups', description: 'Includes up to ₹5,000 for preventive health check-ups within the overall limit.' }
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'emerald'
  },
  {
    category: 'NPS (80CCD)',
    limit: 'Extra ₹50,000',
    items: [
      { title: 'Section 80CCD(1B)', description: 'Additional deduction of ₹50,000 over and above the ₹1.5L limit of 80C.' },
      { title: 'Employer Contribution', description: 'In the New Regime, employer contribution to NPS is still deductible.' }
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'amber'
  },
  {
    category: 'Other Savings',
    limit: 'Varies',
    items: [
      { title: 'Section 24(b)', description: 'Interest on home loan up to ₹2 Lakh for self-occupied property (Old Regime).' },
      { title: 'Section 80TTA/B', description: 'Interest on savings accounts (₹10k for non-seniors, ₹50k for seniors).' },
      { title: 'Standard Deduction', description: '₹75,000 flat deduction in New Regime (up from ₹50,000 in FY 24-25).' }
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'blue'
  }
];

const TaxSavingTips: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Advance Tax Optimization Tips</h2>
          <p className="text-slate-500 text-sm mt-1">Smart strategies to reduce your liability and interest penalties</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          Pro Tips
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tips.map((tip, idx) => (
          <div key={idx} className="group relative">
            <div className={`absolute -inset-1 bg-gradient-to-r from-${tip.color}-500 to-${tip.color}-400 rounded-2xl opacity-0 group-hover:opacity-10 transition duration-300 blur`}></div>
            <div className="relative bg-white border border-slate-100 rounded-xl p-6 h-full flex flex-col hover:border-slate-200 transition-colors shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-${tip.color}-50 text-${tip.color}-600`}>
                  {tip.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{tip.category}</h3>
                  <span className={`text-[10px] font-bold text-${tip.color}-600 uppercase tracking-widest`}>Limit: {tip.limit}</span>
                </div>
              </div>
              
              <div className="space-y-4 flex-1">
                {tip.items.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
        <p className="text-xs text-slate-500 italic">
          *Note: Paying Advance Tax on time helps avoid interest penalties under Section 234B/C.
        </p>
      </div>
    </div>
  );
};

export default TaxSavingTips;
