import { FaPlus, FaLayerGroup, FaTags, FaLink, FaFileExport, FaFileCsv, FaFileCode } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';

export default function Header({ onAddTab, onAddCategory, tabs = [], categories = [] }) {
  // Estados para el menú de exportación
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);
  
  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Calcular estadísticas
  const totalTabs = tabs.length;
  const totalCategories = categories.length;
  const httpLinks = tabs.filter(tab => tab.url && tab.url.startsWith('http:')).length;
  const httpsLinks = tabs.filter(tab => tab.url && tab.url.startsWith('https:')).length;
  
  // Calcular estadísticas de antigüedad
  const now = new Date();
  const agesInDays = tabs
    .map(tab => {
      const createdAt = tab.createdAt ? new Date(tab.createdAt) : new Date();
      return Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    })
    .filter(age => !isNaN(age));
    
  const averageAge = agesInDays.length > 0 
    ? Math.round(agesInDays.reduce((a, b) => a + b, 0) / agesInDays.length) 
    : 0;
    
  // Encontrar el klip más reciente
  const newestTab = tabs.length > 0 
    ? tabs.reduce((newest, tab) => {
        const tabDate = tab.createdAt ? new Date(tab.createdAt) : new Date(0);
        const newestDate = newest ? new Date(newest.createdAt || 0) : new Date(0);
        return tabDate > newestDate ? tab : newest;
      }, null)
    : null;
    
  // Calcular días desde el más reciente
  const daysSinceNewest = newestTab 
    ? Math.floor((now - new Date(newestTab.createdAt || now)) / (1000 * 60 * 60 * 24))
    : null;
    
  const oldestTab = tabs.length > 0 
    ? Math.max(...tabs
        .map(tab => tab.createdAt ? new Date(tab.createdAt) : now)
        .map(date => Math.floor((now - date) / (1000 * 60 * 60 * 24))))
    : 0;
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Klip
          </h1>
          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
            Beta
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAddCategory}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors flex items-center gap-1"
          >
            <FaPlus size={12} /> Categoría
          </button>
          <button
            onClick={onAddTab}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors flex items-center gap-1"
          >
            <FaPlus size={12} /> Nuevo Klip
          </button>
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors flex items-center gap-1"
            >
              <FaFileExport size={12} /> Exportar
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    exportToCSV(tabs, categories);
                    setShowExportMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaFileCsv className="mr-2 text-green-500" /> Exportar a CSV
                </button>
                <button
                  onClick={() => {
                    exportToJSON(tabs, categories);
                    setShowExportMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaFileCode className="mr-2 text-blue-500" /> Exportar a JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Panel de estadísticas integrado */}
      <div className="flex w-full gap-2 mb-3">
        {/* Total de tarjetas */}
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FaLayerGroup className="text-sm" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Total</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{totalTabs}</p>
            </div>
          </div>
        </div>
        
        {/* Klip más antiguo */}
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <FaLayerGroup className="text-sm" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Más antigua</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                {oldestTab === 0 ? 'N/A' : 
                 oldestTab === 1 ? 'Ayer' : 
                 oldestTab < 30 ? `Hace ${oldestTab} días` : 
                 Math.floor(oldestTab/30) === 1 ? 'Hace 1 mes' : 
                 `Hace ${Math.floor(oldestTab/30)} meses`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Klip más reciente */}
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FaLayerGroup className="text-sm" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Más reciente</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                {!newestTab ? 'N/A' : 
                 daysSinceNewest === 0 ? 'Hoy' :
                 daysSinceNewest === 1 ? 'Ayer' : 
                 daysSinceNewest < 30 ? `Hace ${daysSinceNewest} días` : 
                 Math.floor(daysSinceNewest/30) === 1 ? 'Hace 1 mes' : 
                 `Hace ${Math.floor(daysSinceNewest/30)} meses`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Total de categorías */}
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FaTags className="text-sm" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Categorías</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{totalCategories}</p>
            </div>
          </div>
        </div>
        
        {/* Enlaces seguros */}
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <FaLink className="text-sm" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Enlaces seguros</p>
              <div className="flex gap-2">
                <span className="text-xs font-medium text-green-500">{httpsLinks} HTTPS</span>
                {httpLinks > 0 && (
                  <span className="text-xs font-medium text-amber-500">{httpLinks} HTTP</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
