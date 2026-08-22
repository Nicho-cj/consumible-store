import React from 'react';

const Table = ({ columns = [], data = [], isLoading = false, emptyMessage = 'No hay registros disponibles.' }) => {
    return (
        <div className="w-full overflow-x-auto rounded-lg border border-[#E2E8F0] bg-white">
            <table className="w-full text-left border-collapse">
                {/* Encabezado */}
                <thead>
                    <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                        {columns.map((col, index) => (
                            <th
                                key={col.key || index}
                                className={`py-3 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${col.className || ''}`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Cuerpo de la tabla */}
                <tbody className="divide-y divide-[#E2E8F0] text-xs text-slate-700">
                    {isLoading ? (

                        <tr>
                            <td colSpan={columns.length} className="py-8 text-center text-slate-400">
                                <div className="flex justify-center items-center space-x-2">
                                    <div className="w-2 h-2 bg-[#97C719] rounded-full animate-ping"></div>
                                    <span>Cargando datos...</span>
                                </div>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        // Estado Vacío
                        <tr>
                            <td colSpan={columns.length} className="py-8 text-center text-slate-400">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        // Filas con datos
                        data.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className="hover:bg-slate-50/80 transition-colors"
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={col.key || colIndex} className={`py-3 px-4 ${col.className || ''}`}>
                                        {/* Permite renderizar celdas personalizadas o datos planos */}
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;