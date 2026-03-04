
import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface QuarterlyCardProps {
  title: string;
  date: string;
  percentage: string;
  amount: number;
  cumulative: boolean;
}

const QuarterlyCard: React.FC<QuarterlyCardProps> = ({ title, date, percentage, amount, cumulative }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            {percentage}
          </span>
        </div>
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-400 mb-3">{date}</p>
      </div>
      
      <div className="mt-auto">
        <div className="text-2xl font-bold text-slate-900">
          ₹{amount.toLocaleString('en-IN')}
        </div>
        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          {cumulative ? 'Cumulative liability' : 'Net installment'}
        </div>
      </div>
    </div>
  );
};

export default QuarterlyCard;
