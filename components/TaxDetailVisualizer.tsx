
import React from 'react';
import { TaxBreakdown } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface TaxDetailVisualizerProps {
  newRegime: TaxBreakdown;
  oldRegime: TaxBreakdown;
}

const TaxDetailVisualizer: React.FC<TaxDetailVisualizerProps> = ({ newRegime, oldRegime }) => {
  const data = [
    {
      name: 'Old Regime',
      'Net Base Tax': Math.max(0, oldRegime.baseTax - oldRegime.rebate87A),
      'Surcharge': oldRegime.surcharge,
      'Cess': oldRegime.cess,
      rebate: oldRegime.rebate87A,
    },
    {
      name: 'New Regime',
      'Net Base Tax': Math.max(0, newRegime.baseTax - newRegime.rebate87A),
      'Surcharge': newRegime.surcharge,
      'Cess': newRegime.cess,
      rebate: newRegime.rebate87A,
    },
  ];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Detailed Tax Composition
        </h3>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Net Base
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div> Surcharge
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div> Cess
            </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} 
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              formatter={(val: number) => formatCurrency(val)}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="Net Base Tax" stackId="tax" fill="#6366f1" radius={[0, 0, 0, 0]} barSize={50} />
            <Bar dataKey="Surcharge" stackId="tax" fill="#f59e0b" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Cess" stackId="tax" fill="#f43f5e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        {oldRegime.rebate87A > 0 && (
          <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Old Regime Rebate</span>
            </div>
            <span className="text-sm font-bold text-emerald-600">-{formatCurrency(oldRegime.rebate87A)}</span>
          </div>
        )}
        {newRegime.rebate87A > 0 && (
          <div className="flex-1 bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">New Regime Rebate</span>
            </div>
            <span className="text-sm font-bold text-indigo-600">-{formatCurrency(newRegime.rebate87A)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxDetailVisualizer;
