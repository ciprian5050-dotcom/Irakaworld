import { X, Upload, Image } from 'lucide-react';
import { useState } from 'react';

interface ProductoFormProps {
  onClose: () => void;
  onSave: (producto: { nombre: string; categoria: string; precio: number; stock: number; imagen: string; descripcion?: string; iva?: number }) => void;
}

// URLs de imágenes reales de productos Wayuu
const imagenesWayuu = [
  { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800', categoria: 'Mochilas' },
  { url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', categoria: 'Bolsos' },
  { url: 'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800', categoria: 'Accesorios' },
  { url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800', categoria: 'Calzado' },
  { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', categoria: 'Hogar' },
  { url: '🎒', categoria: 'Emoji' },
  { url: '👜', categoria: 'Emoji' },
  { url: '💍', categoria: 'Emoji' },
  { url: '👟', categoria: 'Emoji' },
  { url: '🏠', categoria: 'Emoji' },
];

const categoriasWayuu = ['Mochilas', 'Bolsos', 'Accesorios', 'Calzado', 'Hogar', 'Especiales'];

export function ProductoForm({ onClose, onSave }: ProductoFormProps) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenSeleccionada, setImagenSeleccionada] = useState('');
  const [tipoImagen, setTipoImagen] = useState<'predefinida' | 'subida'>('predefinida');
  const [imagenSubida, setImagenSubida] = useState('');
  const [iva, setIva] = useState('19'); // Por defecto 19% IVA en Colombia

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Convertir a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagenSubida(base64String);
        setImagenSeleccionada(base64String);
        setTipoImagen('subida');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre && categoria && precio && stock && imagenSeleccionada) {
      onSave({
        nombre,
        categoria,
        precio: parseInt(precio),
        stock: parseInt(stock),
        imagen: imagenSeleccionada,
        descripcion: descripcion || undefined,
        iva: parseInt(iva) || undefined,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 flex items-center justify-between rounded-t-xl">
          <h3>Nuevo Producto</h3>
          <button onClick={onClose} className="p-1 hover:bg-amber-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Nombre del producto</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              placeholder="Ej: Mochila Wayuu Tradicional"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categoriasWayuu.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Precio (COP)</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              placeholder="150000"
              min="0"
              step="1000"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Stock inicial</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              placeholder="10"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">IVA (%)</label>
            <select
              value={iva}
              onChange={(e) => setIva(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              required
            >
              <option value="0">0% - Exento</option>
              <option value="5">5% - Reducido</option>
              <option value="19">19% - General (Colombia)</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Tarifa de IVA aplicable al producto</p>
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Descripción (opcional)</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
              placeholder="Descripción del producto..."
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-2">Imagen del producto</label>
            
            {/* Botón para subir foto */}
            <div className="mb-3">
              <label className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer hover:bg-amber-50 transition-colors bg-gradient-to-br from-amber-50 to-orange-50">
                <Upload className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-amber-700">Subir foto desde dispositivo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Vista previa de imagen subida */}
            {imagenSubida && (
              <div className="mb-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-600 mb-2">Vista previa:</p>
                <img 
                  src={imagenSubida} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Separador */}
            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs text-slate-400">o elige un ícono</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Íconos predefinidos */}
            <div className="grid grid-cols-5 gap-2">
              {imagenesWayuu.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => {
                    setImagenSeleccionada(img.url);
                    setTipoImagen('predefinida');
                  }}
                  className={`p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                    imagenSeleccionada === img.url && tipoImagen === 'predefinida'
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  {img.url.includes('https') ? (
                    <img src={img.url} alt={img.categoria} className="w-full h-10 object-cover rounded" />
                  ) : (
                    <span className="text-2xl">{img.url}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!imagenSeleccionada}
              className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}