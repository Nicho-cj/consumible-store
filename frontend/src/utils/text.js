/**
 * Normaliza texto para comparaciones y búsquedas locales
 * (Remueve acentos, convierte a minúsculas y elimina espacios extra)
 */
export const normalizeText = (text = '') => {
    if (typeof text !== 'string') return '';
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
};

/**
 * Sanitiza campos de texto antes de enviarlos al Backend.
 * Convierte a minúsculas, remueve acentos y colapsa espacios dobles.
 */
export const sanitizeForApi = (value = '') => {
    if (typeof value !== 'string') return value;

    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Elimina acentos/tildes
        .toLowerCase()                   // Fuerza minúsculas
        .replace(/\s+/g, ' ')           // Convierte múltiples espacios en uno solo
        .trim();                        // Elimina espacios al inicio y final
};

/**
 * Sanitiza recursivamente un objeto completo antes de enviar al Backend.
 * Ideal para procesar los datos de un formulario de un solo golpe.
 */
export const sanitizePayload = (data = {}) => {
    const sanitized = { ...data };

    Object.keys(sanitized).forEach((key) => {
        const value = sanitized[key];

        if (typeof value === 'string') {
            sanitized[key] = sanitizeForApi(value);
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            sanitized[key] = sanitizePayload(value); // Sanitiza objetos anidados
        }
    });

    return sanitized;
};