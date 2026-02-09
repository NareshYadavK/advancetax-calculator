
import React from 'react';

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  tooltip?: string;
  prefix?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, tooltip, prefix = "₹" }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {tooltip && <span className="ml-1 text-xs text-slate-400 cursor-help" title={tooltip}>ⓘ</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-slate-500 sm:text-sm">{prefix}</span>
        </div>
        <input
          type="number"
          value={value === 0 ? '' : value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="block w-full rounded-lg border-slate-300 pl-7 pr-4 py-2 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          placeholder="0"
        />
      </div>
    </div>
  );
};

export default InputGroup;
