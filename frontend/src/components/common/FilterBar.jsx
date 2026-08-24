import { Search, Calendar, RefreshCw } from 'lucide-react';
import Card from './Card';
import Button from './Button';

/**
 * FilterBar Component
 * @param {Array} fields Configuración de inputs [{ id, label, type, value, onChange, placeholder, options }]
 * @param {Function} onReset Función al hacer clic en Limpiar
 */
const FilterBar = ({ fields = [], onReset }) => {
    return (
        <Card className="p-4">
            <div className="flex flex-col lg:flex-row items-end justify-between gap-4">

                {/* Renderizado de campos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full lg:w-auto flex-1">
                    {fields.map((field) => {
                        const { id, label, type, value, onChange, placeholder, options } = field;

                        return (
                            <div key={id} className="w-full">
                                {label && (
                                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                                        {label}
                                    </label>
                                )}

                                {/* Input de Texto / Búsqueda */}
                                {type === 'text' && (
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            placeholder={placeholder || 'Buscar...'}
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            className="w-full bg-white border border-[#E2E8F0] text-xs text-slate-800 rounded-md pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-[#97C719] focus:border-transparent transition-all placeholder:text-slate-400"
                                        />
                                        <Search size={15} className="absolute left-2.5 text-slate-400" />
                                    </div>
                                )}

                                {/* Input de Fecha */}
                                {type === 'date' && (
                                    <div className="relative flex items-center">
                                        <input
                                            type="date"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            className="w-full bg-white border border-[#E2E8F0] text-xs text-slate-800 rounded-md pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-[#97C719] focus:border-transparent transition-all"
                                        />
                                        <Calendar size={15} className="absolute left-2.5 text-slate-400" />
                                    </div>
                                )}

                                {/* Select / Desplegable */}
                                {type === 'select' && (
                                    <select
                                        value={value}
                                        onChange={(e) => onChange(e.target.value)}
                                        className="w-full bg-white border border-[#E2E8F0] text-xs text-slate-800 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#97C719] focus:border-transparent transition-all"
                                    >
                                        {options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Acciones del Filtro */}
                {onReset && (
                    <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                        <Button
                            variant="secondary"
                            icon={RefreshCw}
                            onClick={onReset}
                            className="text-xs"
                        >
                            Limpiar Filtros
                        </Button>
                    </div>
                )}

            </div>
        </Card>
    );
};

export default FilterBar;