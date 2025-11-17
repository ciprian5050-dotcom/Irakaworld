import { X, Download } from 'lucide-react';
import { formatCOP } from '../utils/currency';
import { toast } from "sonner@2.0.3";
import logoIrakaworld from 'figma:asset/95c19a5ca5cd7a987b45131d4fca3837e0919929.png';
import jsPDF from 'jspdf';

// Extender el tipo jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

interface FacturaDetailProps {
  factura: {
    id: string;
    pedidoId: number;
    cliente: string;
    fecha: string;
    total: number;
    estado: string;
  };
  onClose: () => void;
}

// Datos de ejemplo para los items de la factura
const getFacturaItems = (facturaId: string) => {
  const items = {
    'F-2041': [
      { id: '1', producto: 'Bolso Artesanal Grande', cantidad: 2, precioUnitario: 180000, total: 360000 },
      { id: '2', producto: 'Sombrero Vueltiao', cantidad: 4, precioUnitario: 100000, total: 400000 },
    ],
    'F-2040': [
      { id: '1', producto: 'Mochila Wayuu', cantidad: 1, precioUnitario: 145000, total: 145000 },
      { id: '2', producto: 'Hamaca Artesanal', cantidad: 1, precioUnitario: 237000, total: 237000 },
    ],
    'F-2039': [
      { id: '1', producto: 'Sombrero Vueltiao', cantidad: 3, precioUnitario: 100000, total: 300000 },
      { id: '2', producto: 'Ruana de Lana', cantidad: 2, precioUnitario: 220000, total: 440000 },
      { id: '3', producto: 'Set de Manillas', cantidad: 15, precioUnitario: 12000, total: 180000 },
      { id: '4', producto: 'Bolso Artesanal Grande', cantidad: 3, precioUnitario: 180000, total: 540000 },
      { id: '5', producto: 'Canasta Tejida', cantidad: 7, precioUnitario: 39000, total: 273000 },
    ],
    'F-2038': [
      { id: '1', producto: 'Ruana de Lana', cantidad: 1, precioUnitario: 220000, total: 220000 },
      { id: '2', producto: 'Mochila Wayuu', cantidad: 2, precioUnitario: 145000, total: 290000 },
      { id: '3', producto: 'Set de Manillas', cantidad: 10, precioUnitario: 12000, total: 120000 },
    ],
    'F-2037': [
      { id: '1', producto: 'Hamaca Artesanal', cantidad: 2, precioUnitario: 237000, total: 474000 },
      { id: '2', producto: 'Bolso Artesanal Grande', cantidad: 3, precioUnitario: 180000, total: 540000 },
      { id: '3', producto: 'Canasta Tejida', cantidad: 2, precioUnitario: 39000, total: 78000 },
    ],
  };
  
  return items[facturaId as keyof typeof items] || [];
};

export function FacturaDetail({ factura, onClose }: FacturaDetailProps) {
  const items = getFacturaItems(factura.id);
  
  const subtotal = factura.total / 1.19; // Asumiendo IVA del 19%
  const iva = factura.total - subtotal;

  const handleGeneratePDF = async () => {
    try {
      toast.info('Generando PDF...');

      // Crear un nuevo documento PDF
      const doc = new jsPDF();

      // Convertir la imagen a base64 para poder usarla en el PDF
      const loadImageAsBase64 = (src: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = () => {
            // Si falla, continuamos sin la imagen
            resolve('');
          };
          img.src = src;
        });
      };

      // Intentar cargar el logo
      const logoBase64 = await loadImageAsBase64(logoIrakaworld);
      
      // Si tenemos el logo, agregarlo
      if (logoBase64) {
        try {
          doc.addImage(logoBase64, 'PNG', 10, 10, 20, 20);
        } catch (e) {
          console.log('No se pudo agregar el logo');
        }
      }
      
      doc.setFontSize(20);
      doc.setTextColor(217, 119, 6); // Color ámbar
      doc.text('Irakaworld', 35, 18);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('Productos Artesanales de Calidad', 35, 24);
      doc.text('NIT: 900.123.456-7', 35, 28);
      doc.text('Carrera 10 #20-30, Bogotá, Colombia', 35, 32);
      doc.text('Tel: +57 310 123 4567', 35, 36);

      // Línea divisoria
      doc.setDrawColor(217, 119, 6);
      doc.setLineWidth(0.5);
      doc.line(10, 42, 200, 42);

      // Agregar el título de la factura
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('FACTURA DE VENTA', 105, 52, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(217, 119, 6);
      doc.text(`#${factura.id}`, 105, 60, { align: 'center' });

      // Agregar la información de la factura
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text('FECHA:', 15, 72);
      doc.text(new Date(factura.fecha).toLocaleDateString('es-CO', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }), 40, 72);
      
      doc.text('ESTADO:', 15, 79);
      doc.text(factura.estado, 40, 79);
      
      doc.text('CLIENTE:', 15, 86);
      doc.text(factura.cliente, 40, 86);

      // Dibujar la tabla de items manualmente
      let currentY = 95;
      
      // Header de la tabla
      doc.setFillColor(217, 119, 6); // Color ámbar
      doc.rect(15, currentY, 180, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Producto', 17, currentY + 5);
      doc.text('Cant.', 130, currentY + 5, { align: 'center' });
      doc.text('Precio Unit.', 160, currentY + 5, { align: 'right' });
      doc.text('Total', 193, currentY + 5, { align: 'right' });
      
      currentY += 8;
      
      // Filas de items
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      
      items.forEach((item, index) => {
        // Alternar color de fondo
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(15, currentY, 180, 7, 'F');
        }
        
        // Líneas de la tabla
        doc.setDrawColor(200, 200, 200);
        doc.line(15, currentY, 195, currentY);
        
        // Texto del item
        const productName = item.producto.length > 35 ? item.producto.substring(0, 35) + '...' : item.producto;
        doc.text(productName, 17, currentY + 5);
        doc.text(item.cantidad.toString(), 130, currentY + 5, { align: 'center' });
        doc.text(formatCOP(item.precioUnitario), 160, currentY + 5, { align: 'right' });
        doc.text(formatCOP(item.total), 193, currentY + 5, { align: 'right' });
        
        currentY += 7;
      });
      
      // Línea final de la tabla
      doc.setDrawColor(200, 200, 200);
      doc.line(15, currentY, 195, currentY);

      // Agregar los totales
      const finalY = currentY + 10;
      
      const rightAlign = 195;
      const labelX = 140;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      doc.text('Subtotal:', labelX, finalY);
      doc.text(formatCOP(subtotal), rightAlign, finalY, { align: 'right' });
      
      doc.text('IVA (19%):', labelX, finalY + 6);
      doc.text(formatCOP(iva), rightAlign, finalY + 6, { align: 'right' });
      
      // Línea antes del total
      doc.setDrawColor(100, 100, 100);
      doc.line(labelX, finalY + 9, rightAlign, finalY + 9);
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('TOTAL:', labelX, finalY + 15);
      doc.setTextColor(217, 119, 6);
      doc.text(formatCOP(factura.total), rightAlign, finalY + 15, { align: 'right' });

      // Agregar el footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont(undefined, 'normal');
      doc.text('¡Gracias por su compra!', 105, finalY + 28, { align: 'center' });
      doc.text('www.irakaworld.com | info@irakaworld.com', 105, finalY + 34, { align: 'center' });
      
      doc.setFontSize(8);
      doc.text('Este documento es una representación impresa de la factura electrónica', 105, finalY + 42, { align: 'center' });

      // Guardar el PDF
      doc.save(`Factura_${factura.id}.pdf`);
      
      toast.success('PDF generado exitosamente!', {
        description: `Factura_${factura.id}.pdf descargado`
      });
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar PDF', {
        description: 'Por favor intenta nuevamente'
      });
    }
  };

  return (
    <>
      {/* Modal visible en pantalla */}
      <div className="factura-modal-overlay fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 print:hidden">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-amber-600">
            <h2 className="text-white">Factura {factura.id}</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-amber-700 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Logo y Empresa */}
            <div className="text-center border-b border-slate-200 pb-4">
              <img
                src={logoIrakaworld}
                alt="Irakaworld"
                className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
              />
              <h3 className="text-amber-600">Irakaworld</h3>
              <p className="text-xs text-slate-600">Productos Artesanales de Calidad</p>
              <p className="text-xs text-slate-500 mt-1">NIT: 900.123.456-7</p>
            </div>

            {/* Info Factura */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Número</p>
                <p className="text-slate-800">{factura.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Fecha</p>
                <p className="text-slate-800">{new Date(factura.fecha).toLocaleDateString('es-CO')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Cliente</p>
                <p className="text-slate-800">{factura.cliente}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Estado</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  factura.estado === 'Pagada' ? 'bg-green-100 text-green-700' :
                  factura.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {factura.estado}
                </span>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-sm text-slate-700 mb-2 pb-1 border-b border-slate-200">Items</h4>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="text-slate-800">{item.producto}</p>
                      <p className="text-xs text-slate-500">
                        {item.cantidad} x {formatCOP(item.precioUnitario)}
                      </p>
                    </div>
                    <p className="text-slate-800">{formatCOP(item.total)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totales */}
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal:</span>
                <span className="text-slate-800">{formatCOP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">IVA (19%):</span>
                <span className="text-slate-800">{formatCOP(iva)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-700">Total:</span>
                <span className="text-amber-600">{formatCOP(factura.total)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-200">
              <p>¡Gracias por su compra!</p>
              <p className="mt-1">www.irakaworld.com</p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <button
              onClick={handleGeneratePDF}
              className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Estilos para imprimir */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          * {
            box-shadow: none !important;
          }
        }
      `}</style>
    </>
  );
}