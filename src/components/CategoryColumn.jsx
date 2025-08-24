import { useState, useRef } from 'react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import { useDrop } from 'react-dnd';
import DraggableTabCard from "./DraggableTabCard";
import { ItemTypes } from '../utils/dragTypes';

export default function CategoryColumn({ 
  category, 
  tabs = [], 
  onAddTab, 
  onEditTab,
  onDeleteTab,
  onDeleteCategory,
  onEditCategory,
  moveTabToCategory
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useRef(null);
  
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.KLIP,
    drop: (item, monitor) => {
      if (!monitor.didDrop() && moveTabToCategory) {
        moveTabToCategory(item.id, category);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    })
  });
  
  // Conectar el ref del contenedor con el drop target
  drop(ref);
  
  return (
    <div 
      ref={ref}
      className={`w-72 flex-shrink-0 h-full flex flex-col rounded-lg bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 ${
        isOver ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : ''
      }`}
    >
      <div className="py-2 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {category}
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({tabs.length})
            </span>
          </h2>
          
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddTab?.(category);
              }}
              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Añadir tarjeta"
            >
              <FaPlus size={16} />
            </button>
            
            <div className="relative">
              <button
                onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
                className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Más opciones"
              >
                <FaEllipsisV size={16} />
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEditCategory?.(category);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                  >
                    Editar categoría
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      if (onDeleteCategory) {
                        onDeleteCategory(category);
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-opacity-50 rounded"
                  >
                    Eliminar categoría
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-2" style={{ scrollBehavior: 'smooth' }}>
        <div className="space-y-3">
        {tabs.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <p>No hay tarjetas en esta categoría</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddTab?.(category);
              }}
              className="mt-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              + Añadir tarjeta
            </button>
          </div>
        ) : (
          tabs.map((tab) => (
            <DraggableTabCard
              key={tab.id}
              id={tab.id}
              title={tab.title}
              url={tab.url}
              category={tab.category}
              createdAt={tab.createdAt || new Date().toISOString()}
              onEdit={() => onEditTab?.(tab)}
              onDelete={() => onDeleteTab?.(tab.id)}
            />
          ))
        )}
        </div>
      </div>
      
      <div className="px-2 pb-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddTab?.(category);
          }}
          onMouseDown={(e) => e.preventDefault()}
          className="w-full flex items-center justify-center gap-2 p-2 text-sm font-medium text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <FaPlus size={14} />
          <span>Añadir una tarjeta</span>
        </button>
      </div>
    </div>
  );
}
