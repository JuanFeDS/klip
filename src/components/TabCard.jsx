import { FaExternalLinkAlt, FaTrashAlt, FaEdit, FaCopy, FaClock } from 'react-icons/fa';

// Función para calcular los días de antigüedad y el color correspondiente
const getDaysAgoInfo = (dateString) => {
  const createdDate = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Determinar el color basado en los días
  let colorClass = 'bg-blue-500';
  if (diffDays > 30) colorClass = 'bg-red-500';
  else if (diffDays > 7) colorClass = 'bg-amber-500';
  else if (diffDays > 1) colorClass = 'bg-green-500';
  
  // Formatear la fecha
  const formatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
  let displayText;
  
  if (diffDays < 1) {
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours < 1) {
      const diffMinutes = Math.ceil(diffTime / (1000 * 60));
      displayText = `Hace ${diffMinutes} min`;
    } else {
      displayText = `Hace ${diffHours} h`;
    }
  } else if (diffDays < 7) {
    displayText = formatter.format(-diffDays, 'day');
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    displayText = formatter.format(-weeks, 'week');
  } else {
    const months = Math.floor(diffDays / 30);
    displayText = formatter.format(-months, 'month');
  }
  
  return { days: diffDays, colorClass, displayText };
};

export default function TabCard({ title, url, category, onEdit, onDelete, createdAt }) {
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
  const { colorClass, displayText } = createdAt ? getDaysAgoInfo(createdAt) : { colorClass: 'bg-gray-400', displayText: 'Nuevo' };
  
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
            <div className="relative group/indicator">
              <div className={`w-3 h-3 rounded-full ${colorClass} transition-all duration-300 group-hover/indicator:scale-125`}></div>
              <span className="absolute left-1/2 -translate-x-1/2 -top-6 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/indicator:opacity-100 pointer-events-none transition-opacity duration-200">
                {displayText}
              </span>
            </div>
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
              <div className="flex items-center mt-1 text-xs text-gray-400">
                <FaClock className="mr-1" size={10} />
                <span>{displayText}</span>
              </div>
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