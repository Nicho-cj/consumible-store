/**
 * Codigo fijo por tecnico, usado en la etiqueta imprimible con codigo de
 * barras y en el mensaje de WhatsApp enviado al cliente.
 *
 * Se deriva del id_tecnico, que es un SERIAL: los ids nunca se reutilizan,
 * asi que un tecnico conserva siempre el mismo codigo y no hace falta
 * agregar ninguna columna en la base de datos.
 */
export const codigoTecnico = (idTecnico) => {
    if (idTecnico === null || idTecnico === undefined || idTecnico === '') return null;
    const n = Number(idTecnico);
    if (!Number.isInteger(n) || n <= 0) return null;
    return `T-${String(n).padStart(2, '0')}`;
};
