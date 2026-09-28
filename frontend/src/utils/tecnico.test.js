import { describe, it, expect } from 'vitest';
import { codigoTecnico } from './tecnico';

describe('Utilidades de Tecnico (tecnico.js)', () => {
    describe('codigoTecnico', () => {
        it('genera el codigo con el prefijo T y dos digitos', () => {
            expect(codigoTecnico(1)).toBe('T-01');
            expect(codigoTecnico(2)).toBe('T-02');
            expect(codigoTecnico(6)).toBe('T-06');
        });

        it('respeta el ancho minimo de dos digitos sin recortar', () => {
            expect(codigoTecnico(12)).toBe('T-12');
            expect(codigoTecnico(123)).toBe('T-123');
        });

        it('acepta ids que llegan como texto', () => {
            expect(codigoTecnico('4')).toBe('T-04');
        });

        it('devuelve null cuando no hay tecnico asignado', () => {
            expect(codigoTecnico(null)).toBeNull();
            expect(codigoTecnico(undefined)).toBeNull();
            expect(codigoTecnico('')).toBeNull();
        });

        it('devuelve null ante valores invalidos', () => {
            expect(codigoTecnico(0)).toBeNull();
            expect(codigoTecnico(-1)).toBeNull();
            expect(codigoTecnico(1.5)).toBeNull();
            expect(codigoTecnico('abc')).toBeNull();
            expect(codigoTecnico(NaN)).toBeNull();
        });
    });
});
