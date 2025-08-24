import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { sampleTabs } from "../data/sampleTabs";
import CategoryColumn from "../components/CategoryColumn";
import TabModal from "../components/modals/TabModal";
import Header from "../components/Header";
import { useTabs } from "../hooks/useTabs";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Home() {
  // Agregar console.log para depuración
  console.log('Renderizando Home');
  
  const {
    tabs,
    categories,
    groupedTabs,
    columnPositions,
    addTab,
    updateTab,
    deleteTab,
    addCategory,
    updateCategory,
    deleteCategory,
    updateColumnPosition,
    moveTabToCategory
  } = useTabs(sampleTabs);

  // Mostrar datos en consola para depuración
  console.log('Categorías:', categories);
  console.log('Tabs:', tabs);
  console.log('Column Positions:', columnPositions);
  
  const [editingTab, setEditingTab] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: 'https://',
    category: categories[0] || ''
  });

  const handleAddTab = (category = '') => {
    setFormData({
      title: '',
      url: 'https://',
      category: category || categories[0] || ''
    });
    setEditingTab(null);
    setIsModalOpen(true);
  };

  const handleEditTab = (tab) => {
    setFormData({
      title: tab.title,
      url: tab.url,
      category: tab.category
    });
    setEditingTab(tab);
    setIsModalOpen(true);
  };

  const handleDeleteTab = (tabId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
      deleteTab(tabId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.url) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    try {
      new URL(formData.url);
    } catch (e) {
      alert('Por favor ingresa una URL válida');
      return;
    }
    
    if (editingTab) {
      updateTab(editingTab.id, formData);
    } else {
      addTab(formData);
    }
    
    setIsModalOpen(false);
  };

  const handleAddCategory = () => {
    const newCategory = window.prompt('Nombre de la nueva categoría:');
    if (newCategory) {
      addCategory(newCategory);
    }
  };

  const dragItem = useRef(null);
  const dragItemNode = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Usar directamente las posiciones de useTabs
  const [columns, setColumns] = useState(columnPositions);
  
  // Efecto para sincronizar con las posiciones globales
  useEffect(() => {
    if (Object.keys(columnPositions).length > 0) {
      setColumns(columnPositions);
    }
  }, [columnPositions]);

  // Manejador de movimiento del mouse
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !dragItemNode.current || !dragItem.current) return;
    
    // Obtener la posición del contenedor
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calcular la nueva posición relativa al contenedor
    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y;
    
    // Limitar la posición a los bordes del contenedor
    const boundedX = Math.max(0, Math.min(containerRect.width - 300, newX));
    const boundedY = Math.max(0, newY);
    
    // Actualizar la posición actual
    setCurrentPos({ x: boundedX, y: boundedY });
    
    // Aplicar la transformación al elemento
    if (dragItemNode.current) {
      dragItemNode.current.style.transform = `translate(${boundedX}px, ${boundedY}px)`;
    }
  }, [isDragging, dragOffset.x, dragOffset.y]);

  // Manejador para soltar el elemento
  const handleMouseUp = useCallback((e) => {
    if (!isDragging || !dragItem.current) return;
    
    // Obtener la posición del contenedor
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calcular la posición final relativa al contenedor (igual que en handleMouseMove)
    const finalX = e.clientX - containerRect.left - dragOffset.x;
    const finalY = e.clientY - containerRect.top - dragOffset.y;
    
    // Aplicar los mismos límites que en handleMouseMove
    const boundedX = Math.max(0, Math.min(containerRect.width - 300, finalX));
    const boundedY = Math.max(0, finalY);
    
    // Redondear la posición final
    const roundedX = Math.round(boundedX);
    const roundedY = Math.round(boundedY);
    
    console.log('Guardando posición final:', { roundedX, roundedY });
    
    // Actualizar directamente en el estado global
    updateColumnPosition(dragItem.current, { x: roundedX, y: roundedY });
    
    // Actualizar el estado local para reflejar el cambio inmediatamente
    setColumns(prev => ({
      ...prev,
      [dragItem.current]: { x: roundedX, y: roundedY }
    }));
    
    // Asegurar que la transformación final se aplique
    if (dragItemNode.current) {
      dragItemNode.current.style.transform = `translate(${roundedX}px, ${roundedY}px)`;
    }
    
    // Restablecer estados
    setIsDragging(false);
    
    // Limpiar referencias
    dragItem.current = null;
    dragItemNode.current = null;
  }, [isDragging, dragOffset.x, dragOffset.y, updateColumnPosition, containerRef]);

  // Efecto para manejar eventos globales de mouse
  useEffect(() => {
    const handleGlobalMouseUp = (e) => {
      if (isDragging && dragItem.current) {
        handleMouseUp(e);
      }
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.userSelect = 'none'; // Prevenir selección de texto durante el arrastre
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleMouseDown = (e, category) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    
    dragItem.current = category;
    dragItemNode.current = e.currentTarget;
    
    const rect = dragItemNode.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calcular la posición relativa al contenedor
    const elementX = rect.left - containerRect.left;
    const elementY = rect.top - containerRect.top;
    
    // Calcular el desplazamiento del mouse dentro del elemento
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    // Guardar el offset del mouse respecto al elemento
    setDragOffset({ x: offsetX, y: offsetY });
    
    // Actualizar la posición actual en el estado
    setCurrentPos({ x: elementX, y: elementY });
    
    // Establecer estilos iniciales
    if (dragItemNode.current) {
      dragItemNode.current.style.zIndex = '1000';
      dragItemNode.current.style.position = 'absolute';
      dragItemNode.current.style.transform = `translate(${elementX}px, ${elementY}px)`;
    }
    
    // Activar el arrastre después de configurar todo
    setIsDragging(true);
  };



  // Obtener las posiciones actuales de las columnas
  const positionedCategories = categories.map(category => ({
    name: category,
    ...(columns[category] || { x: 0, y: 0 })
  }));

  // Mostrar mensaje si no hay categorías
  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header onAddTab={handleAddTab} onAddCategory={handleAddCategory} />
        <div className="container mx-auto p-4">
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              No hay categorías. ¡Crea una para comenzar!
            </h2>
            <button
              onClick={handleAddCategory}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Crear Categoría
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Header 
        onAddTab={() => handleAddTab()} 
        onAddCategory={handleAddCategory}
        tabs={tabs}
        categories={categories}
      />
      
      <DndProvider backend={HTML5Backend}>
        <div 
          ref={containerRef}
          className="relative w-full min-h-[calc(100vh-150px)] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-auto p-4"
          style={{ cursor: isDragging ? 'grabbing' : 'default' }}
        >
          {positionedCategories.map(({ name: category, x, y }) => (
                <div 
                  key={category}
                  className="draggable-column w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 select-none"
                  style={{
                    zIndex: isDragging && dragItem.current === category ? 1000 : 1,
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    transform: isDragging && dragItem.current === category 
                      ? `translate3d(${currentPos.x}px, ${currentPos.y}px, 0)`
                      : `translate3d(${x}px, ${y}px, 0)`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease',
                    willChange: 'transform',
                    touchAction: 'none',
                    cursor: isDragging && dragItem.current === category ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    boxShadow: isDragging && dragItem.current === category 
                      ? '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' 
                      : '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, category)}
                >
                  <div 
                    className="drag-handle p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                    style={{ 
                      cursor: isDragging && dragItem.current === category ? 'grabbing' : 'grab',
                      userSelect: 'none'
                    }}
                  >
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category}
                      <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                        ({(groupedTabs[category] || []).length})
                      </span>
                    </h2>
                  </div>
                  <CategoryColumn
                    category={category}
                    tabs={groupedTabs[category] || []}
                    onAddTab={() => handleAddTab(category)}
                    onEditTab={handleEditTab}
                    onDeleteTab={handleDeleteTab}
                    onDeleteCategory={deleteCategory}
                    onEditCategory={(oldName) => {
                      const newName = window.prompt('Nuevo nombre para la categoría:', oldName);
                      if (newName && newName !== oldName) {
                        updateCategory(oldName, newName);
                      }
                    }}
                    moveTabToCategory={moveTabToCategory}
                  />
                </div>
          ))}
        </div>
      </DndProvider>
      
      <TabModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        isEditing={!!editingTab}
      />
    </div>
  );
}
