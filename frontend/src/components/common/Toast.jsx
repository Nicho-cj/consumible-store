import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onDismiss }) => {
    if (!message) return null;

    const isSuccess = type === 'success';
    return (
        <div
            role="status"
            className={`fixed top-4 right-4 z-[120] flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-xs font-semibold transition-all ${
                isSuccess
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-700'
            }`}
        >
            {isSuccess ? <CheckCircle2 size={17} className="shrink-0" /> : <AlertCircle size={17} className="shrink-0" />}
            <span>{message}</span>
            <button onClick={onDismiss} className="ml-1 text-current opacity-60 hover:opacity-100" aria-label="Cerrar aviso">
                <X size={14} />
            </button>
        </div>
    );
};

export default Toast;