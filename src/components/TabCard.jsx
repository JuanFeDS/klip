import { FaExternalLinkAlt, FaTrashAlt, FaEdit, FaCopy } from 'react-icons/fa';

export default function TabCard({ title, url, category, onEdit, onDelete }) {
  const handleCopyUrl = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      // Opcional: Mostrar un mensaje de confirmación
      const copyBtn = e.currentTarget;
      const originalText = copyBtn.getAttribute('aria-label');
      copyBtn.setAttribute('aria-label', '¡Copiado!');
      setTimeout(() => {
        copyBtn.setAttribute('aria-label', originalText);
      }, 2000);
    } catch (err) {
      console.error('Error al copiar la URL: ', err);
    }
  };
  const domain = new URL(url).hostname.replace('www.', '');
  
  return (
    <div className="group relative">
      <div className="relative">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 pr-14 rounded-xl shadow bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200 border border-transparent hover:border-primary/20 relative z-10"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0 w-3 h-3 rounded-full bg-blue-500"></div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {domain}
              </p>
              {category && (
                <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                  {category}
                </span>
              )}
            </div>
            <FaExternalLinkAlt className="flex-shrink-0 text-gray-400 group-hover:text-primary transition-colors" />
          </div>
        </a>
        
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-1 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-20 scale-95 group-hover:scale-100">
          <button
            onClick={handleCopyUrl}
            className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:text-gray-400 dark:hover:bg-blue-900/20 rounded transition-colors relative"
            aria-label="Copiar URL"
            title="Copiar enlace"
          >
            <FaCopy size={14} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
            aria-label="Editar"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            aria-label="Eliminar"
          >
            <FaTrashAlt size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}