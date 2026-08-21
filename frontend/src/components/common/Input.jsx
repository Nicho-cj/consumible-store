import React from 'react';

const Input = ({ label, error, helperText, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-xs font-semibold text-slate-700">
                    {label}
                </label>
            )}
            <input
                className={`w-full bg-white border border-[#E2E8F0] text-xs text-slate-800 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#97C719] focus:border-transparent transition-all placeholder:text-slate-400 disabled:bg-slate-100 disabled:cursor-not-allowed ${error ? 'border-red-500 focus:ring-red-500' : ''
                    } ${className}`}
                {...props}
            />
            {error ? (
                <span className="text-[11px] text-red-500 font-medium">{error}</span>
            ) : helperText ? (
                <span className="text-[11px] text-slate-400">{helperText}</span>
            ) : null}
        </div>
    );
};

export default Input;