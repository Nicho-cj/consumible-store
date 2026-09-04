export const ORDER_STATUS = {
    REGISTRADO: 'REGISTRADO',
    EN_DIAGNOSTICO: 'EN_DIAGNOSTICO',
    SOLUCION_COTIZACION: 'SOLUCION_COTIZACION',
    PROCESO_TECNICO: 'PROCESO_TECNICO',
    LISTO_ENTREGA: 'LISTO_ENTREGA',
    ENTREGADO: 'ENTREGADO',
    CANCELADO: 'CANCELADO',
};

export const STATUS_FLOW = [
    ORDER_STATUS.REGISTRADO,
    ORDER_STATUS.EN_DIAGNOSTICO,
    ORDER_STATUS.SOLUCION_COTIZACION,
    ORDER_STATUS.PROCESO_TECNICO,
    ORDER_STATUS.LISTO_ENTREGA,
    ORDER_STATUS.ENTREGADO,
];

export const TECHNICIAN_TRANSITIONS = {
    [ORDER_STATUS.REGISTRADO]: ORDER_STATUS.EN_DIAGNOSTICO,
    [ORDER_STATUS.EN_DIAGNOSTICO]: ORDER_STATUS.SOLUCION_COTIZACION,
    [ORDER_STATUS.PROCESO_TECNICO]: ORDER_STATUS.LISTO_ENTREGA,
};

export const ADMIN_TRANSITIONS = {
    [ORDER_STATUS.SOLUCION_COTIZACION]: {
        approve: ORDER_STATUS.PROCESO_TECNICO,
        reject: ORDER_STATUS.CANCELADO,
    },
    [ORDER_STATUS.LISTO_ENTREGA]: {
        deliver: ORDER_STATUS.ENTREGADO,
    },
};

export const STATUS_CONFIG = {
    [ORDER_STATUS.REGISTRADO]: {
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
    [ORDER_STATUS.SOLUCION_COTIZACION]: {
        label: 'Esperando Aprobación',
        bg: 'bg-[#FEF3C7]',
        text: 'text-[#D97706]',
        border: 'border-[#FDE68A]',
    },
    [ORDER_STATUS.PROCESO_TECNICO]: {
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
        label: 'Entregado / Cerrado',
        bg: 'bg-[#F0FDF4]',
        text: 'text-[#15803D]',
        border: 'border-[#BBF7D0]',
    },
    [ORDER_STATUS.CANCELADO]: {
        label: 'Cancelado',
        bg: 'bg-[#FEF2F2]',
        text: 'text-[#DC2626]',
        border: 'border-[#FECACA]',
    },
};

export const TECHNICIAN_STATUS = {
    ACTIVE: 'ACTIVE',
    ON_BREAK: 'ON_BREAK',
    OFF_DUTY: 'OFF_DUTY',
};
