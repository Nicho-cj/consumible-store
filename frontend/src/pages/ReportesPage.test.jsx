import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportesPage from './ReportesPage';

describe('Página ReportesPage - Detalle de Servicios para Liquidación', () => {
    it('renderiza las métricas y encabezados de los 7 campos requeridos', () => {
        render(<ReportesPage />);

        // Encabezado
        expect(screen.getByText('Liquidación y Reportes de Servicios')).toBeInTheDocument();

        // Métricas
        expect(screen.getByText('Total Monto Cobrado')).toBeInTheDocument();
        expect(screen.getByText('Servicios en el Reporte')).toBeInTheDocument();
        expect(screen.getByText('Ticket Promedio')).toBeInTheDocument();

        // Columnas de la tabla (los 7 campos solicitados en pantalla y en plantilla de impresión)
        expect(screen.getAllByText('N° Orden').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Técnico Responsable').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Cliente').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Equipo y Serial').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Trabajo Realizado').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Fecha Ingreso').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Monto Cobrado').length).toBeGreaterThan(0);

        // Verificar que NO exista columna de comisión de técnico por ahora
        expect(screen.queryByText('Comisión Técnico')).not.toBeInTheDocument();
        expect(screen.queryByText('Comisiones por Liquidar')).not.toBeInTheDocument();
    });

    it('abre el modal de Vista Previa al hacer clic en Vista Previa', () => {
        render(<ReportesPage />);

        const previewButton = screen.getByText('Vista Previa');
        fireEvent.click(previewButton);

        expect(screen.getByText('Vista Previa de Reporte de Liquidación (PDF)')).toBeInTheDocument();
        expect(screen.getAllByText('CONSUMIBLE STORE, C.A.').length).toBeGreaterThan(0);
    });

    it('llama a window.print al hacer clic en Imprimir / Guardar PDF', () => {
        const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
        render(<ReportesPage />);

        const printButtons = screen.getAllByText('Imprimir / Guardar PDF');
        fireEvent.click(printButtons[0]);

        expect(printSpy).toHaveBeenCalled();
        printSpy.mockRestore();
    });
});
