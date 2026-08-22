import { STATUS_CONFIG } from '../../utils/status';

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || {
        label: status,
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200',
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${config.bg} ${config.text} ${config.border}`}
        >
            {config.label}
        </span>
    );
};

export default StatusBadge;