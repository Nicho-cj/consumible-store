const VARIANTS = {

    primary: 'bg-[#97C719] text-white hover:bg-[#86b116] shadow-[0px_1px_3px_rgba(15,23,42,0.08)]',

    secondary: 'bg-transparent border border-[#E2E8F0] text-[#1E293B] hover:bg-slate-100 bg-white',

    danger: 'bg-[#EF4444] text-white hover:bg-red-600 shadow-sm',

    ghost: 'bg-transparent text-slate-400 hover:bg-white/10 hover:text-white',
};

const SIZES = {
    sm: 'py-1.5 px-3 text-[11px]',
    md: 'py-2 px-4 text-xs',
    lg: 'py-2.5 px-5 text-sm',
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    className = '',
    type = 'button',
    onClick,
    ...props
}) => {
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`
                inline-flex items-center justify-center space-x-2 rounded font-semibold 
                transition-all duration-150 active:scale-95 cursor-pointer disabled:opacity-50 
                disabled:cursor-not-allowed disabled:active:scale-100
                ${VARIANTS[variant] || VARIANTS.primary}
                ${SIZES[size] || SIZES.md}
                ${className}
            `}
            {...props}
        >
            {/* Indicador de carga si esta activo */}
            {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}

            {children}
        </button>
    );
};

export default Button;