import { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import {
    Printer,
    MessageCircle,
    CheckCircle2,
    Copy,
    Check
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const OrdenEnvioModal = ({ isOpen, onClose, order }) => {
    const barcodeRef = useRef(null);
    const [copied, setCopied] = useState(false);

    // Valores por defecto seguros si algún campo viene vacío
    const orderData = {
        id: order?.codigo || order?.id || '0001960',
        fecha: order?.fecha || new Date().toLocaleDateString('es-VE'),
        clientName: order?.cliente?.nombre || order?.clienteNombre || 'Cliente General',
        telefono: order?.cliente?.telefono || '',
        equipment: `${order?.equipo?.marca || ''} ${order?.equipo?.modelo || ''}`.trim() || order?.tipoEquipo || 'Equipo Técnico',
        serial: order?.equipo?.serial || order?.serial || 'S/N-000000',
        serviceType: order?.tipoServicio || 'Revisión y Diagnóstico',
        initialCounter: order?.contadorInicial || order?.contadorBN || 0,
        reportedFault: order?.equipo?.falla || order?.falla || 'Revisión general',
        technician: order?.tecnicoAsignado || order?.tecnico || 'Asignado en Taller',
        observaciones: order?.equipo?.observaciones || order?.observaciones || 'Ninguna'
    };

    // Generar el Código de Barras ajustado para 55mm x 40mm basado en el SERIAL del equipo
    const barcodeValue = orderData.serial && orderData.serial !== 'S/N-000000' ? orderData.serial : (orderData.serial || orderData.id);

    useEffect(() => {
        if (isOpen && barcodeRef.current && barcodeValue) {
            try {
                JsBarcode(barcodeRef.current, String(barcodeValue).trim(), {
                    format: 'CODE128',
                    lineColor: '#000000',
                    width: 1.2,
                    height: 22,
                    displayValue: true,
                    fontSize: 9,
                    font: 'monospace',
                    margin: 0
                });
            } catch (err) {
                console.error('Error generando código de barras:', err);
            }
        }
    }, [isOpen, barcodeValue]);

    // Construcción del mensaje para WhatsApp
    const buildWhatsAppMessage = () => {
        return `🛠️ *Consumible Store - Orden de Servicio #${orderData.id}*\n\n` +
            `👤 *Cliente:* ${orderData.clientName}\n` +
            `💻 *Equipo:* ${orderData.equipment}\n` +
            `🔢 *Serial:* ${orderData.serial}\n` +
            `📋 *Servicio:* ${orderData.serviceType}\n` +
            `👨‍🔧 *Técnico:* ${orderData.technician}\n` +
            `⚠️ *Falla Reportada:* ${orderData.reportedFault}\n\n` +
            `_Comprobante digital de recepción. Consulte el estado de su equipo con su número de orden o serial, pasado el tiempo estimado de 1 mes de avisado , no nos hacemos responsable por equipos en abandono._`;
    };

    const handleSendWhatsApp = () => {
        const message = buildWhatsAppMessage();
        let cleanPhone = orderData.telefono.replace(/[^0-9]/g, '');

        // Si el número empieza por 0 (ej: 04141234567), le quitamos el 0 y agregamos +58 por defecto
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '58' + cleanPhone.substring(1);
        }

        const whatsappUrl = cleanPhone
            ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
            : `https://wa.me/?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    };

    const handleCopyMessage = () => {
        navigator.clipboard.writeText(buildWhatsAppMessage());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => {
        window.print();
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Comprobante de Recepción de Orden" maxWidth="max-w-xl">
            <div className="space-y-5">

                {/* Banner de Éxito */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-3 text-emerald-800">
                    <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                    <div>
                        <h4 className="text-xs font-bold">¡Orden registrada con éxito!</h4>
                        <p className="text-[11px] text-emerald-700">Comprobante listo para enviar al cliente e imprimir etiqueta (55x40mm).</p>
                    </div>
                </div>

                {/* BOTONES PRINCIPALES DE ACCIÓN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 no-print">
                    <button
                        onClick={handleSendWhatsApp}
                        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-2.5 px-4 rounded-md text-xs transition-all shadow-sm cursor-pointer active:scale-95"
                    >
                        <MessageCircle size={17} />
                        <span>Enviar por WhatsApp</span>
                    </button>

                    <Button
                        variant="primary"
                        onClick={handlePrint}
                        className="w-full py-2.5 text-xs"
                    >
                        <Printer size={17} />
                        <span>Imprimir Etiqueta</span>
                    </Button>
                </div>

                {/* BOTÓN SECUNDARIO */}
                <div className="flex justify-end no-print">
                    <button
                        onClick={handleCopyMessage}
                        className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                        {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        <span>{copied ? '¡Mensaje copiado!' : 'Copiar texto de WhatsApp'}</span>
                    </button>
                </div>

                {/* ETIQUETA / COMPROBANTE 55mm x 40mm */}
                <div className="flex justify-center bg-slate-100 p-4 rounded-lg">
                    <div
                        id="printable-receipt"
                        className="bg-white text-black p-1.5 border border-slate-300 shadow-sm flex flex-col justify-between box-border overflow-hidden"
                        style={{ width: '55mm', height: '40mm' }}
                    >
                        {/* Fila 1: N° Orden y Fecha */}
                        <div className="flex justify-between items-center text-[9px] font-bold border-b border-black pb-0.5 leading-none">
                            <span>ORDEN DE SERVICIO: {orderData.id}</span>
                            <span className="font-normal text-[8px]">{orderData.fecha}</span>
                        </div>

                        {/* Fila 2: Datos Técnicos */}
                        <div className="text-[8px] leading-tight space-y-0.5 my-auto">
                            <div className="truncate">
                                <span className="font-bold">Técnico: {orderData.technician}</span>
                            </div>
                            <div className="truncate">
                                <span className="font-bold">Equipo: {orderData.equipment}</span>
                            </div>
                            <div className="truncate">
                                <span className="font-bold">Serial: {orderData.serial}</span>
                            </div>
                            <div className="truncate">
                                <span className="font-bold">Cliente: {orderData.clientName}</span>
                            </div>
                        </div>

                        {/* Fila 3: Código de Barras */}
                        <div className="flex justify-center items-center pt-0.5 border-t border-black">
                            <svg ref={barcodeRef} className="max-w-full block"></svg>
                        </div>
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="flex justify-end pt-2 no-print">
                    <Button variant="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </div>

            {/* CSS de Impresión para formato 55mm x 40mm */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: 55mm 40mm;
                        margin: 0;
                    }
                    html, body {
                        width: 55mm;
                        height: 40mm;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: hidden !important;
                    }
                    body * {
                        visibility: hidden;
                    }
                    #printable-receipt, #printable-receipt * {
                        visibility: visible;
                    }
                    #printable-receipt {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 50mm !important;
                        height: 40mm !important;
                        padding: 2mm !important;
                        margin: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        background: white !important;
                        page-break-after: avoid !important;
                        page-break-inside: avoid !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}} />
        </Modal>
    );
};

export default OrdenEnvioModal;