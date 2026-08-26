import { describe, it, expect } from 'vitest';
import { normalizeText, sanitizeForApi, sanitizePayload } from './text';

describe('Utilidades de Texto (text.js)', () => {
    describe('normalizeText', () => {
        it('elimina acentos y convierte a minúsculas', () => {
            expect(normalizeText('Impresión L3110')).toBe('impresion l3110');
            expect(normalizeText('  CÓDIGO-001  ')).toBe('codigo-001');
        });

        it('maneja valores no string de forma segura', () => {
            expect(normalizeText(null)).toBe('');
            expect(normalizeText(undefined)).toBe('');
            expect(normalizeText(123)).toBe('');
        });
    });

    describe('sanitizeForApi', () => {
        it('normaliza y colapsa espacios dobles', () => {
            expect(sanitizeForApi('  Mantenimiento   Preventivo  ')).toBe('mantenimiento preventivo');
        });
    });

    describe('sanitizePayload', () => {
        it('sanitiza recursivamente un objeto', () => {
            const payload = {
                nombre: '  Juan Pérez  ',
                detalles: {
                    falla: '  No Enciende   bien  ',
                    edad: 30
                }
            };
            const resultado = sanitizePayload(payload);
            expect(resultado.nombre).toBe('juan perez');
            expect(resultado.detalles.falla).toBe('no enciende bien');
            expect(resultado.detalles.edad).toBe(30);
        });
    });
});
