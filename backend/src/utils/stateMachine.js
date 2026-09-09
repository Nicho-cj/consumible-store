// @REVISAR: maquina de estados de la orden de servicio
// Configuracion de transiciones secuenciales (RN-02) y condiciones especiales (RN-03, RN-04)

export const ESTADO_ORDEN = {
  REGISTRADO: 'REGISTRADO',
  EN_DIAGNOSTICO: 'EN_DIAGNOSTICO',
  SOLUCION_COTIZACION: 'SOLUCION_COTIZACION',
  PROCESO_TECNICO: 'PROCESO_TECNICO',
  LISTO_ENTREGA: 'LISTO_ENTREGA',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
};

// RN-02: transiciones permitidas. El estado solo avanza en secuencia (o cancela)
const TRANSICIONES = {
  [ESTADO_ORDEN.REGISTRADO]: [ESTADO_ORDEN.EN_DIAGNOSTICO, ESTADO_ORDEN.CANCELADO],
  [ESTADO_ORDEN.EN_DIAGNOSTICO]: [ESTADO_ORDEN.SOLUCION_COTIZACION, ESTADO_ORDEN.CANCELADO],
  [ESTADO_ORDEN.SOLUCION_COTIZACION]: [ESTADO_ORDEN.PROCESO_TECNICO, ESTADO_ORDEN.CANCELADO],
  [ESTADO_ORDEN.PROCESO_TECNICO]: [ESTADO_ORDEN.LISTO_ENTREGA, ESTADO_ORDEN.CANCELADO],
  [ESTADO_ORDEN.LISTO_ENTREGA]: [ESTADO_ORDEN.ENTREGADO, ESTADO_ORDEN.CANCELADO],
  [ESTADO_ORDEN.ENTREGADO]: [],
  [ESTADO_ORDEN.CANCELADO]: [],
};

// Valida si una transicion de estado es permitida segun RN-02
export function validarTransicion(estadoActual, nuevoEstado) {
  const permitidos = TRANSICIONES[estadoActual] || [];
  if (!permitidos.includes(nuevoEstado)) {
    return `Transición no permitida: ${estadoActual} → ${nuevoEstado}. Debe seguir la secuencia: Registrado → En Diagnóstico → Solución/Cotización → Proceso Técnico → Listo para Entrega → Entregado (o Cancelado).`;
  }
  return null;
}

// RN-03: no puede pasar a PROCESO_TECNICO si el cliente no aprobó la cotización
export function validarAprobacionCotizacion(estadoActual, nuevoEstado, cotizacionAprobada) {
  if (estadoActual === ESTADO_ORDEN.SOLUCION_COTIZACION &&
      nuevoEstado === ESTADO_ORDEN.PROCESO_TECNICO &&
      cotizacionAprobada !== true) {
    return 'RN-03: La orden no puede pasar a Proceso Técnico si el cliente no aprobó previamente el presupuesto (Solución y Cotización).';
  }
  return null;
}

// RN-04: no puede pasar a ENTREGADO sin datos operativos completos (diagnóstico, contador final, monto)
// El contador final y el monto de cobro se registran en la orden al momento de la entrega (decision de negocio)
export function validarCierreCompleto(nuevoEstado, nota, orden) {
  if (nuevoEstado === ESTADO_ORDEN.ENTREGADO) {
    const sinDiagnostico = !nota || !nota.diagnostico_falla || !nota.trabajo_realizado;
    const sinContador = orden.contador_final === null || orden.contador_final === undefined;
    const sinMonto = orden.monto_cobro === null || orden.monto_cobro === undefined;

    const faltan = [];
    if (sinDiagnostico) faltan.push('diagnóstico y trabajo realizado');
    if (sinContador) faltan.push('contador de impresiones final');
    if (sinMonto) faltan.push('monto de cobro');

    if (faltan.length > 0) {
      return `RN-04: Para entregar la orden faltan datos obligatorios: ${faltan.join(', ')}.`;
    }
  }
  return null;
}

// Estados validos para validar en el schema de PATCH
export const ESTADOS_VALIDOS = Object.values(ESTADO_ORDEN);
