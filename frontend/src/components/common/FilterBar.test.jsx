import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterBar from './FilterBar';

describe('Componente FilterBar', () => {
    it('renderiza inputs de texto, fecha y select correctamente', () => {
        const handleSearchChange = vi.fn();
        const handleDateChange = vi.fn();
        const handleSelectChange = vi.fn();
        const handleReset = vi.fn();

        const fields = [
            {
                id: 'search',
                label: 'Buscar',
                type: 'text',
                placeholder: 'Buscar orden...',
                value: '',
                onChange: handleSearchChange,
            },
            {
                id: 'startDate',
                label: 'Fecha Desde',
                type: 'date',
                value: '2026-08-01',
                onChange: handleDateChange,
            },
            {
                id: 'tecnico',
                label: 'Técnico',
                type: 'select',
                value: 'ALL',
                onChange: handleSelectChange,
                options: [
                    { label: 'Todos los Técnicos', value: 'ALL' },
                    { label: 'Hector Luis', value: 'Hector Luis' }
                ],
            },
        ];

        render(<FilterBar fields={fields} onReset={handleReset} />);

        // Verificar labels
        expect(screen.getByText('Buscar')).toBeInTheDocument();
        expect(screen.getByText('Fecha Desde')).toBeInTheDocument();
        expect(screen.getByText('Técnico')).toBeInTheDocument();

        // Probar cambio en input de texto
        const searchInput = screen.getByPlaceholderText('Buscar orden...');
        fireEvent.change(searchInput, { target: { value: 'ORD-2026' } });
        expect(handleSearchChange).toHaveBeenCalledWith('ORD-2026');

        // Probar botón de limpiar
        const resetButton = screen.getByText('Limpiar Filtros');
        expect(resetButton).toBeInTheDocument();
        fireEvent.click(resetButton);
        expect(handleReset).toHaveBeenCalledTimes(1);
    });
});
