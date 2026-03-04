
import React from 'react';

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  icon?: React.ReactNode;
  placeholder?: string;
  description?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, icon, placeholder, description }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
        <input
          type="number"
          value={value === 0 ? '' : value}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={placeholder || "0"}
          className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-800"
        />
      </div>
      {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
    </div>
  );
};

export default InputGroup;
