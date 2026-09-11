import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportesPage from './ReportesPage';

vi.mock('react-to-print', () => ({
    useReactToPrint: () => vi.fn(),
}));

const reporteMock = [
    {
        id_orden: 1,
        codigo_orden: 'ORD-2026-001',
        tecnico_nombre: 'Pedro Martínez',
        id_tecnico: 1,
        cliente_nombre: 'Juan Pérez',
        marca: 'HP',
        modelo: 'LaserJet Pro M404n',
        nro_serial: 'SN-HP-2023-01',
        trabajo_realizado: 'Cambio de fusor',
        diagnostico_falla: 'Fusor gastado',
        fecha_ingreso: '2026-09-01T14:00:00.000Z',
        monto_cobro: '95.50',
    },
    {
        id_orden: 2,
        codigo_orden: 'ORD-2026-002',
        tecnico_nombre: 'Pedro Martínez',
        id_tecnico: 1,
        cliente_nombre: 'Maria Lopez',
        marca: 'Epson',
        modelo: 'L6150',
        nro_serial: 'SN-EPS-02',
        trabajo_realizado: 'Limpieza de cabezales',
        fecha_ingreso: '2026-09-02T10:00:00.000Z',
        monto_cobro: '40.00',
    },
];

vi.mock('../api/reportes', () => ({
    reporteServicios: vi.fn(() => Promise.resolve(reporteMock)),
    listAuditoria: vi.fn(() =>
        Promise.resolve([
            {
                id_log: 1,
                fecha_creacion: '2026-09-09T15:30:00.000Z',
                usuario_nombre: 'jesus',
                rol: 'ADMIN_RECEPCION',
                modulo: 'Seguridad / Sistema',
                accion: 'Inicio de sesión',
                detalles: 'Login exitoso',
            },
            {
                id_log: 2,
                fecha_creacion: '2026-09-09T15:31:00.000Z',
                usuario_nombre: 'Pedro Martínez',
                rol: 'TECNICO',
                modulo: 'Órdenes',
                accion: 'Cambio de estatus',
                detalles: 'ORD-2026-001',
            },
        ])
    ),
    descargarBackup: vi.fn(() => Promise.resolve('-- PostgreSQL database dump')),
}));

vi.mock('../api/entidades', () => ({
    listTecnicosPublicos: vi.fn(() =>
        Promise.resolve([{ id: 1, nombre: 'Pedro Martínez' }])
    ),
}));

describe('Página ReportesPage - Detalle de Servicios para Liquidación', () => {
    it('renderiza las métricas y encabezados de los 7 campos requeridos', async () => {
        render(<ReportesPage />);

        expect(await screen.findByText('Pagos y Reportes de Servicios')).toBeInTheDocument();

        // Métricas (valores calculados desde el reporte real mockeado)
        expect(await screen.findByText('Total Monto Cobrado')).toBeInTheDocument();
        expect(screen.getAllByText('$135.50').length).toBeGreaterThan(0);
        expect(screen.getByText('Servicios en el Reporte')).toBeInTheDocument();
        expect(screen.getByText('Ticket Promedio')).toBeInTheDocument();
        expect(screen.getAllByText('$67.75').length).toBeGreaterThan(0);

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

    it('abre el modal de Vista Previa al hacer clic en Vista Previa', async () => {
        render(<ReportesPage />);

        await screen.findByText('Pagos y Reportes de Servicios');

        const previewButton = screen.getByText('Vista Previa');
        fireEvent.click(previewButton);

        expect(screen.getByText('Vista Previa de Reporte de Liquidación (PDF)')).toBeInTheDocument();
        expect(screen.getAllByText('CONSUMIBLE STORE, C.A.').length).toBeGreaterThan(0);
    });

    it('ejecuta la impresión del reporte sin romper la vista', async () => {
        render(<ReportesPage />);

        await screen.findByText('Pagos y Reportes de Servicios');

        const printButtons = screen.getAllByText('Imprimir / Guardar PDF');
        expect(printButtons.length).toBeGreaterThan(0);
        fireEvent.click(printButtons[0]);

        expect(screen.getByText('Pagos y Reportes de Servicios')).toBeInTheDocument();
    });

    it('muestra los LOGS reales de /auditoria en el tab Historial', async () => {
        render(<ReportesPage />);

        await screen.findByText('Pagos y Reportes de Servicios');

        fireEvent.click(screen.getByText('Registro de Actividad y Auditoría'));

        expect(await screen.findByText('LOG-1')).toBeInTheDocument();
        expect(screen.getByText('LOG-2')).toBeInTheDocument();
        expect(screen.getAllByText('Inicio de sesión').length).toBeGreaterThan(0);
        expect(screen.queryByText('Historial Cronológico de Movimientos')).toBeInTheDocument();
    });
});