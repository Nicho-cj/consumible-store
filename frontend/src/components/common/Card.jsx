import React from 'react';

// Contenedor principal de tarjeta
export const Card = ({ children, className = '', onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-lg border border-[#E2E8F0] p-5 shadow-sm transition-all ${onClick ? 'cursor-pointer hover:border-slate-300' : ''
                } ${className}`}
        >
            {children}
        </div>
    );
};

// Subcomponente específico para Métricas / KPIS
export const MetricCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendLabel = 'vs mes anterior',
    color = 'primary', // 'primary' | 'blue' | 'amber' | 'emerald'
}) => {
    const ICON_COLORS = {
        primary: 'bg-[#97C719]/10 text-[#97C719]',
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        emerald: 'bg-emerald-50 text-emerald-600',
    };

    return (
        <Card>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        {title}
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>

                    {trend && (
                        <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                            <span className={trend > 0 ? 'text-emerald-600 font-semibold' : 'text-red-500 font-semibold'}>
                                {trend > 0 ? `+${trend}%` : `${trend}%`}
                            </span>
                            <span>{trendLabel}</span>
                        </p>
                    )}
                </div>

                {Icon && (
                    <div className={`p-3 rounded-lg ${ICON_COLORS[color] || ICON_COLORS.primary}`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default Card;