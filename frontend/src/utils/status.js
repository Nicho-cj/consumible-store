export const ORDER_STATUS = {
    RECIBIDO: 'Recibido',
    EN_DIAGNOSTICO: 'En Diagnóstico',
    ESPERANDO_APROBACION: 'Esperando Aprobación',
    EN_REPARACION: 'En Reparación',
    LISTO_ENTREGA: 'Listo para Entrega',
    ENTREGADO: 'Entregado / Finalizado',
};

export const STATUS_CONFIG = {
    [ORDER_STATUS.RECIBIDO]: {
        label: 'Recibido',
        bg: 'bg-[#F1F5F9]',
        text: 'text-[#475569]',
        border: 'border-[#CBD5E1]',
    },
    [ORDER_STATUS.EN_DIAGNOSTICO]: {
        label: 'En Diagnóstico',
        bg: 'bg-[#EFF6FF]',
        text: 'text-[#2563EB]',
        border: 'border-[#BFDBFE]',
    },
    [ORDER_STATUS.ESPERANDO_APROBACION]: {
        label: 'Esperando Aprobación',
        bg: 'bg-[#FEF3C7]',
        text: 'text-[#D97706]',
        border: 'border-[#FDE68A]',
    },
    [ORDER_STATUS.EN_REPARACION]: {
        label: 'En Reparación',
        bg: 'bg-[#F3E8FF]',
        text: 'text-[#9333EA]',
        border: 'border-[#DDD6FE]',
    },
    [ORDER_STATUS.LISTO_ENTREGA]: {
        label: 'Listo para Entrega',
        bg: 'bg-[#ECFDF5]',
        text: 'text-[#059669]',
        border: 'border-[#A7F3D0]',
    },
    [ORDER_STATUS.ENTREGADO]: {
        label: 'Entregado / Finalizado',
        bg: 'bg-[#F0FDF4]',
        text: 'text-[#15803D]',
        border: 'border-[#BBF7D0]',
    },
};