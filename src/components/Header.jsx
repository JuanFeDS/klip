import { FaPlus } from 'react-icons/fa';

export default function Header({ onAddTab, onAddCategory }) {
  return (
    <div className="flex items-center justify-between mb-6">
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
          className="px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors flex items-center gap-1"
        >
          <FaPlus size={14} /> Categoría
        </button>
        <button
          onClick={onAddTab}
          className="ml-2 px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors flex items-center gap-1"
        >
          <FaPlus size={14} /> Nuevo Klip
        </button>
      </div>
    </div>
  );
}
