import { FileText, Download, Eye, Loader2, Check, X, Printer, FileDown } from 'lucide-react';
import { formatCOP } from '../../utils/currency';
import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { toast } from 'sonner@2.0.3';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Factura {
  id: string;
  pedidoId: string;
  clienteId: string;
  fecha: string;
  subtotal: number;
  iva: number;
  envio?: number; // Costo de envío
  total: number;
  estado: string;
}

interface Cliente {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

interface FacturaConDetalles extends Factura {
  clienteNombre: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  clienteDireccion?: string;
}

interface LineaPedido {
  id: string;
  pedidoId: string;
  productoId: string;
  productoNombre?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export function FacturaScreen() {
  const [facturas, setFacturas] = useState<FacturaConDetalles[]>([]);
  const [loading, setLoading] = useState(true);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<FacturaConDetalles | null>(null);
  const [generandoPDF, setGenerandoPDF] = useState(false);

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      
      const [facturasData, clientesData] = await Promise.all([
        api.facturas.getAll().catch(() => []),
        api.clientes.getAll().catch(() => []),
      ]);

      // Crear mapa de clientes
      const clientesMap = new Map<string, Cliente>();
      if (Array.isArray(clientesData)) {
        clientesData.forEach((c: Cliente) => {
          clientesMap.set(c.id, c);
        });
      }

      // Combinar datos
      const facturasConDetalles: FacturaConDetalles[] = [];
      if (Array.isArray(facturasData)) {
        facturasData.forEach((factura: Factura) => {
          const cliente = clientesMap.get(factura.clienteId);
          facturasConDetalles.push({
            ...factura,
            clienteNombre: cliente?.nombre || 'Cliente Desconocido',
            clienteEmail: cliente?.email,
            clienteTelefono: cliente?.telefono,
            clienteDireccion: cliente?.direccion,
          });
        });
      }

      // Ordenar por fecha (más recientes primero)
      facturasConDetalles.sort((a, b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );

      setFacturas(facturasConDetalles);
      
    } catch (error) {
      console.error('Error cargando facturas:', error);
      toast.error('Error al cargar facturas');
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = async (factura: FacturaConDetalles) => {
    try {
      setGenerandoPDF(true);
      toast.info('Generando factura PDF...');

      // Obtener líneas del pedido
      const lineasPedido: LineaPedido[] = await api.lineasPedido.getByPedido(factura.pedidoId).catch(() => []);

      // Crear documento PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Colores
      const colorPrimario = [255, 152, 0]; // Ámbar/Naranja
      const colorSecundario = [245, 127, 23];
      const colorTexto = [51, 51, 51];
      const colorGris = [107, 114, 128];

      // ========== HEADER ==========
      // Logo y nombre de la empresa
      doc.setFillColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('IRAKAWORLD', 15, 15);
      
      doc.setFontSize(10);
      doc.text('Artesanías Wayuu Auténticas', 15, 22);
      doc.text('NIT: 900.123.456-7', 15, 27);

      // Información de la factura (derecha)
      doc.setFontSize(16);
      doc.text('FACTURA', pageWidth - 15, 15, { align: 'right' });
      
      doc.setFontSize(10);
      doc.text(`No. ${factura.id.slice(0, 12).toUpperCase()}`, pageWidth - 15, 22, { align: 'right' });
      doc.text(`Fecha: ${new Date(factura.fecha).toLocaleDateString('es-CO')}`, pageWidth - 15, 27, { align: 'right' });

      // ========== INFORMACIÓN DEL CLIENTE ==========
      let currentY = 45;
      
      doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
      doc.setFontSize(12);
      doc.text('INFORMACIÓN DEL CLIENTE', 15, currentY);
      
      currentY += 8;
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(factura.clienteNombre, 15, currentY);
      
      currentY += 5;
      doc.setFont(undefined, 'normal');
      doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
      
      if (factura.clienteEmail) {
        doc.text(`Email: ${factura.clienteEmail}`, 15, currentY);
        currentY += 5;
      }
      if (factura.clienteTelefono) {
        doc.text(`Teléfono: ${factura.clienteTelefono}`, 15, currentY);
        currentY += 5;
      }
      if (factura.clienteDireccion) {
        doc.text(`Dirección: ${factura.clienteDireccion}`, 15, currentY);
        currentY += 5;
      }

      // Estado de la factura
      currentY += 3;
      const estadoColor = factura.estado === 'Pagada' ? [34, 197, 94] : [251, 146, 60];
      doc.setFillColor(estadoColor[0], estadoColor[1], estadoColor[2]);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      const estadoWidth = doc.getTextWidth(factura.estado) + 8;
      doc.roundedRect(15, currentY, estadoWidth, 6, 2, 2, 'F');
      doc.text(factura.estado, 19, currentY + 4.5);

      // ========== TABLA DE PRODUCTOS ==========
      currentY += 15;
      
      doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);

      const tableData = lineasPedido.map((linea, index) => [
        (index + 1).toString(),
        linea.productoNombre || `Producto ${linea.productoId.slice(0, 8)}`,
        linea.cantidad.toString(),
        formatCOP(linea.precioUnitario),
        formatCOP(linea.subtotal)
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['#', 'Producto', 'Cant.', 'Precio Unit.', 'Subtotal']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: colorPrimario,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
        },
        bodyStyles: {
          textColor: colorTexto,
          fontSize: 9,
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 35, halign: 'right' },
          4: { cellWidth: 35, halign: 'right' },
        },
        margin: { left: 15, right: 15 },
      });

      // ========== TOTALES ==========
      currentY = (doc as any).lastAutoTable.finalY + 10;

      const totalesX = pageWidth - 75;
      
      doc.setFontSize(10);
      doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
      
      doc.text('Subtotal:', totalesX, currentY);
      doc.text(formatCOP(factura.subtotal), pageWidth - 15, currentY, { align: 'right' });
      
      currentY += 6;
      doc.text('IVA (0%):', totalesX, currentY);
      doc.text(formatCOP(factura.iva), pageWidth - 15, currentY, { align: 'right' });
      
      if (factura.envio) {
        currentY += 8;
        doc.text('Envío:', totalesX, currentY);
        doc.text(formatCOP(factura.envio), pageWidth - 15, currentY, { align: 'right' });
      }
      
      currentY += 8;
      doc.setLineWidth(0.5);
      doc.setDrawColor(colorGris[0], colorGris[1], colorGris[2]);
      doc.line(totalesX, currentY, pageWidth - 15, currentY);
      
      currentY += 8;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
      doc.text('TOTAL:', totalesX, currentY);
      doc.text(formatCOP(factura.total), pageWidth - 15, currentY, { align: 'right' });

      // ========== PIE DE PÁGINA ==========
      const pageHeight = doc.internal.pageSize.height;
      currentY = pageHeight - 30;

      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
      
      doc.text('Gracias por tu compra', pageWidth / 2, currentY, { align: 'center' });
      currentY += 5;
      doc.text('Irakaworld - Artesanías Wayuu Auténticas', pageWidth / 2, currentY, { align: 'center' });
      currentY += 4;
      doc.text('www.irakaworld.com | contacto@irakaworld.com', pageWidth / 2, currentY, { align: 'center' });

      // Guardar PDF
      const nombreArchivo = `Factura_${factura.id.slice(0, 8)}_${factura.clienteNombre.replace(/\s+/g, '_')}.pdf`;
      doc.save(nombreArchivo);

      toast.success('Factura descargada exitosamente');
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar el PDF');
    } finally {
      setGenerandoPDF(false);
    }
  };

  const imprimirFactura = async (factura: FacturaConDetalles) => {
    try {
      setGenerandoPDF(true);
      toast.info('Preparando para imprimir...');

      // Obtener líneas del pedido
      const lineasPedido: LineaPedido[] = await api.lineasPedido.getByPedido(factura.pedidoId).catch(() => []);

      // Crear documento PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Colores
      const colorPrimario = [255, 152, 0];
      const colorSecundario = [245, 127, 23];
      const colorTexto = [51, 51, 51];
      const colorGris = [107, 114, 128];

      // ========== HEADER ==========
      // Logo y nombre de la empresa
      doc.setFillColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('IRAKAWORLD', 15, 15);
      
      doc.setFontSize(10);
      doc.text('Artesanías Wayuu Auténticas', 15, 22);
      doc.text('NIT: 900.123.456-7', 15, 27);

      // Información de la factura (derecha)
      doc.setFontSize(16);
      doc.text('FACTURA', pageWidth - 15, 15, { align: 'right' });
      
      doc.setFontSize(10);
      doc.text(`No. ${factura.id.slice(0, 12).toUpperCase()}`, pageWidth - 15, 22, { align: 'right' });
      doc.text(`Fecha: ${new Date(factura.fecha).toLocaleDateString('es-CO')}`, pageWidth - 15, 27, { align: 'right' });

      // ========== INFORMACIÓN DEL CLIENTE ==========
      let currentY = 45;
      
      doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
      doc.setFontSize(12);
      doc.text('INFORMACIÓN DEL CLIENTE', 15, currentY);
      
      currentY += 8;
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(factura.clienteNombre, 15, currentY);
      
      currentY += 5;
      doc.setFont(undefined, 'normal');
      doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
      
      if (factura.clienteEmail) {
        doc.text(`Email: ${factura.clienteEmail}`, 15, currentY);
        currentY += 5;
      }
      if (factura.clienteTelefono) {
        doc.text(`Teléfono: ${factura.clienteTelefono}`, 15, currentY);
        currentY += 5;
      }
      if (factura.clienteDireccion) {
        doc.text(`Dirección: ${factura.clienteDireccion}`, 15, currentY);
        currentY += 5;
      }

      // Estado de la factura
      currentY += 3;
      const estadoColor = factura.estado === 'Pagada' ? [34, 197, 94] : [251, 146, 60];
      doc.setFillColor(estadoColor[0], estadoColor[1], estadoColor[2]);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      const estadoWidth = doc.getTextWidth(factura.estado) + 8;
      doc.roundedRect(15, currentY, estadoWidth, 6, 2, 2, 'F');
      doc.text(factura.estado, 19, currentY + 4.5);

      // ========== TABLA DE PRODUCTOS ==========
      currentY += 15;
      
      doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);

      const tableData = lineasPedido.map((linea, index) => [
        (index + 1).toString(),
        linea.productoNombre || `Producto ${linea.productoId.slice(0, 8)}`,
        linea.cantidad.toString(),
        formatCOP(linea.precioUnitario),
        formatCOP(linea.subtotal)
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['#', 'Producto', 'Cant.', 'Precio Unit.', 'Subtotal']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: colorPrimario,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
        },
        bodyStyles: {
          textColor: colorTexto,
          fontSize: 9,
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 35, halign: 'right' },
          4: { cellWidth: 35, halign: 'right' },
        },
        margin: { left: 15, right: 15 },
      });

      // ========== TOTALES ==========
      currentY = (doc as any).lastAutoTable.finalY + 10;

      const totalesX = pageWidth - 75;
      
      doc.setFontSize(10);
      doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
      
      doc.text('Subtotal:', totalesX, currentY);
      doc.text(formatCOP(factura.subtotal), pageWidth - 15, currentY, { align: 'right' });
      
      currentY += 6;
      doc.text('IVA (0%):', totalesX, currentY);
      doc.text(formatCOP(factura.iva), pageWidth - 15, currentY, { align: 'right' });
      
      if (factura.envio) {
        currentY += 8;
        doc.text('Envío:', totalesX, currentY);
        doc.text(formatCOP(factura.envio), pageWidth - 15, currentY, { align: 'right' });
      }
      
      currentY += 8;
      doc.setLineWidth(0.5);
      doc.setDrawColor(colorGris[0], colorGris[1], colorGris[2]);
      doc.line(totalesX, currentY, pageWidth - 15, currentY);
      
      currentY += 8;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
      doc.text('TOTAL:', totalesX, currentY);
      doc.text(formatCOP(factura.total), pageWidth - 15, currentY, { align: 'right' });

      // ========== PIE DE PÁGINA ==========
      const pageHeight = doc.internal.pageSize.height;
      currentY = pageHeight - 30;

      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
      
      doc.text('Gracias por tu compra', pageWidth / 2, currentY, { align: 'center' });
      currentY += 5;
      doc.text('Irakaworld - Artesanías Wayuu Auténticas', pageWidth / 2, currentY, { align: 'center' });
      currentY += 4;
      doc.text('www.irakaworld.com | contacto@irakaworld.com', pageWidth / 2, currentY, { align: 'center' });

      // Abrir ventana de impresión
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');

      toast.success('Abriendo ventana de impresión...');
      
    } catch (error) {
      console.error('Error imprimiendo factura:', error);
      toast.error('Error al imprimir la factura');
    } finally {
      setGenerandoPDF(false);
    }
  };

  const cambiarEstado = async (facturaId: string, nuevoEstado: string) => {
    try {
      await api.facturas.update(facturaId, { estado: nuevoEstado });
      toast.success('Estado actualizado');
      await cargarFacturas();
      setFacturaSeleccionada(null);
    } catch (error) {
      console.error('Error actualizando estado:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'Sin fecha';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalFacturado = facturas.reduce((acc, f) => acc + (Number(f.total) || 0), 0);
  const pagadas = facturas.filter(f => f.estado === 'Pagada').length;
  const pendientes = facturas.filter(f => f.estado === 'Pendiente').length;

  // Modal de detalles de factura
  if (facturaSeleccionada) {
    return (
      <div className="p-4 space-y-4 overflow-y-auto h-full" style={{ backgroundColor: '#F4F6F8' }}>
        <button
          onClick={() => setFacturaSeleccionada(null)}
          className="text-amber-600 text-sm hover:text-amber-700 transition-colors"
        >
          ← Volver a Facturas
        </button>

        <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
          {/* Header de Factura */}
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-lg">Factura #{facturaSeleccionada.id.slice(0, 8)}</h2>
                <p className="text-xs text-slate-500 mt-1">Pedido #{facturaSeleccionada.pedidoId.slice(0, 8)}</p>
              </div>
              <div className={`${
                facturaSeleccionada.estado === 'Pagada' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              } px-3 py-1 rounded-full text-xs flex items-center gap-1`}>
                {facturaSeleccionada.estado === 'Pagada' ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <X className="w-3 h-3" />
                )}
                {facturaSeleccionada.estado}
              </div>
            </div>
            <p className="text-sm text-slate-600">{formatearFecha(facturaSeleccionada.fecha)}</p>
          </div>

          {/* Información del Cliente */}
          <div>
            <p className="text-xs text-slate-500 mb-1">CLIENTE</p>
            <p className="text-sm">{facturaSeleccionada.clienteNombre}</p>
          </div>

          {/* Desglose de Costos */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span>{formatCOP(facturaSeleccionada.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">IVA (0%)</span>
              <span>{formatCOP(facturaSeleccionada.iva)}</span>
            </div>
            {facturaSeleccionada.envio && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Envío</span>
                <span>{formatCOP(facturaSeleccionada.envio)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span>Total</span>
              <span className="text-lg text-amber-600">{formatCOP(facturaSeleccionada.total)}</span>
            </div>
          </div>

          {/* Cambiar Estado */}
          {facturaSeleccionada.estado !== 'Pagada' && (
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-3">ACCIONES</p>
              <button
                onClick={() => cambiarEstado(facturaSeleccionada.id, 'Pagada')}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Marcar como Pagada
              </button>
            </div>
          )}

          {/* Botones de Descargar e Imprimir */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-3">DESCARGAR E IMPRIMIR</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => generarPDF(facturaSeleccionada)}
                disabled={generandoPDF}
                className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generandoPDF ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Descargar PDF
              </button>
              
              <button
                onClick={() => imprimirFactura(facturaSeleccionada)}
                disabled={generandoPDF}
                className="bg-slate-600 text-white py-3 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generandoPDF ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Printer className="w-4 h-4" />
                )}
                Imprimir
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full" style={{ backgroundColor: '#F4F6F8' }}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6 text-amber-600" />
        <h2>Facturas</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-lg text-amber-600">{facturas.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-green-600">Pagadas</p>
          <p className="text-lg text-green-700">{pagadas}</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-amber-600">Pend.</p>
          <p className="text-lg text-amber-700">{pendientes}</p>
        </div>
      </div>

      {/* Total Facturado */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
        <p className="text-sm opacity-90">Total Facturado</p>
        <p className="text-xl mt-1">{formatCOP(totalFacturado)}</p>
      </div>

      {/* Facturas List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-3" />
          <p className="text-sm text-slate-500">Cargando facturas...</p>
        </div>
      ) : facturas.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-md">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-2">No hay facturas registradas</p>
          <p className="text-xs text-slate-400">Las facturas se generan automáticamente al finalizar pedidos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {facturas.map((factura) => {
            const estadoColor = 
              factura.estado === 'Pagada' ? 'bg-green-100 text-green-700' :
              factura.estado === 'Pendiente' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700';

            return (
              <div key={factura.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm">Factura #{factura.id.slice(0, 8)}</h3>
                    <p className="text-xs text-slate-500 mt-1 truncate">{factura.clienteNombre}</p>
                    <p className="text-xs text-slate-400 mt-1">Pedido #{factura.pedidoId.slice(0, 8)}</p>
                  </div>
                  <div className={`${estadoColor} px-2 py-1 rounded-full text-xs flex-shrink-0 ml-2`}>
                    {factura.estado}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-600">
                    <p>{formatearFecha(factura.fecha)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-amber-600">{formatCOP(factura.total)}</p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setFacturaSeleccionada(factura)}
                    className="w-full bg-amber-50 text-amber-600 py-2 rounded-lg text-xs hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-3 h-3" />
                    Ver Detalles
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}