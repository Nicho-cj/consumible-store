import { describe, it, expect } from 'vitest';
import { normalizeOrden } from './mappers';

describe('normalizeOrden mapper', () => {
    it('maps equipoMarca and tipoEquipo to the brand and not the physical observations/description', () => {
        const rawBackendOrder = {
            id_orden: 10,
            codigo_orden: 'ORD-0010',
            estado: 'RECIBIDO',
            fecha_ingreso: '2026-09-24T10:00:00.000Z',
            fecha_salida: null,
            tipo_servicio: 'Revisión y Diagnóstico',
            falla_reportada: 'No enciende',
            id_cliente: 1,
            cliente_nombre: 'Juan Pérez',
            cliente_ci_rif: 'V-12345678',
            cliente_telefono: '04141234567',
            id_equipo: 5,
            equipo_serial: 'SN123456',
            equipo_marca: 'Epson',
            equipo_modelo: 'L3110',
            equipo_descripcion: 'Rayones en la carcasa, sin cable',
            nota_observaciones: 'Rayones en la carcasa, sin cable',
        };

        const normalized = normalizeOrden(rawBackendOrder);

        expect(normalized.equipoMarca).toBe('Epson');
        expect(normalized.equipoModelo).toBe('L3110');
        expect(normalized.equipoSerie).toBe('SN123456');
        expect(normalized.tipoEquipo).toBe('Epson');
        expect(normalized.tipoEquipo).not.toBe('Rayones en la carcasa, sin cable');
    });

    it('falls back to modelo or default when marca is not available', () => {
        const rawWithoutMarca = {
            id_orden: 11,
            codigo_orden: 'ORD-0011',
            equipo_marca: null,
            equipo_modelo: 'LaserJet 1020',
            equipo_descripcion: 'Sin tapa trasera',
        };

        const normalized = normalizeOrden(rawWithoutMarca);
        expect(normalized.tipoEquipo).toBe('LaserJet 1020');
    });
});
