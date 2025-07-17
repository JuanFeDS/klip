import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_CATEGORIES = ["Trabajo", "Personal", "Entretenimiento", "Educación"];

// Posiciones iniciales para las columnas
const getInitialPositions = (categories) => {
  return categories.reduce((acc, category, index) => {
    acc[category] = { x: index * 320, y: 0 }; // 320px de ancho por columna
    return acc;
  }, {});
};

export function useTabs(initialTabs = []) {
  const [tabs, setTabs] = useState(() => {
    const savedTabs = localStorage.getItem('klip-tabs');
    // Si hay tabs guardados, usarlos. Si no, usar initialTabs solo si no es undefined
    return savedTabs ? JSON.parse(savedTabs) : (initialTabs || []);
  });
  
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('klip-categories');
    return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
  });

  // Estado para las posiciones de las columnas
  const [columnPositions, setColumnPositions] = useState(() => {
    const savedPositions = localStorage.getItem('klip-column-positions');
    return savedPositions 
      ? JSON.parse(savedPositions) 
      : getInitialPositions(categories);
  });

  // Actualizar posiciones cuando cambian las categorías
  useEffect(() => {
    // Solo actualizar si hay categorías
    if (!categories.length) return;
    
    setColumnPositions(prevPositions => {
      // Si ya hay posiciones guardadas y hay categorías, no hacer cambios innecesarios
      if (Object.keys(prevPositions).length > 0) {
        return prevPositions;
      }
      
      // Solo inicializar posiciones si no hay ninguna guardada
      const newPositions = {};
      categories.forEach((category, index) => {
        newPositions[category] = { x: index * 320, y: 0 };
      });
      
      return newPositions;
    });
  }, [categories]);

  // Guardar en localStorage cuando cambien los estados
  useEffect(() => {
    localStorage.setItem('klip-tabs', JSON.stringify(tabs));
  }, [tabs]);
  
  useEffect(() => {
    localStorage.setItem('klip-categories', JSON.stringify(categories));
  }, [categories]);
  
  useEffect(() => {
    localStorage.setItem('klip-column-positions', JSON.stringify(columnPositions));
  }, [columnPositions]);

  // Agrupar pestañas por categoría
  const groupedTabs = tabs.reduce((acc, tab) => {
    acc[tab.category] = acc[tab.category] || [];
    acc[tab.category].push(tab);
    return acc;
  }, {});

  const addTab = (tabData) => {
    const newTab = {
      id: uuidv4(),
      ...tabData,
      createdAt: new Date().toISOString()
    };
    setTabs([...tabs, newTab]);
  };

  const updateTab = (tabId, updates) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    ));
  };

  const deleteTab = (tabId) => {
    setTabs(tabs.filter(tab => tab.id !== tabId));
  };

  const addCategory = (categoryName) => {
    if (categoryName && !categories.includes(categoryName)) {
      setCategories([...categories, categoryName]);
    }
  };

  const updateCategory = (oldName, newName) => {
    if (!newName || newName === oldName) return;
    
    // Actualizar categorías
    setCategories(categories.map(cat => 
      cat === oldName ? newName : cat
    ));
    
    // Actualizar pestañas con la categoría antigua
    setTabs(tabs.map(tab => 
      tab.category === oldName ? { ...tab, category: newName } : tab
    ));
    
    // Actualizar posiciones de columnas
    setColumnPositions(prevPositions => {
      if (prevPositions[oldName]) {
        const newPositions = { ...prevPositions };
        newPositions[newName] = newPositions[oldName];
        delete newPositions[oldName];
        return newPositions;
      }
      return prevPositions;
    });
  };

  const deleteCategory = (categoryName) => {
    if (!categoryName) return;
    
    // Preguntar confirmación si hay pestañas en la categoría
    const tabsInCategory = tabs.filter(tab => tab.category === categoryName);
    
    if (tabsInCategory.length > 0) {
      const confirmMessage = `¿Estás seguro de que quieres eliminar la categoría "${categoryName}" y sus ${tabsInCategory.length} pestañas?`;
      if (!window.confirm(confirmMessage)) return;
      
      // Eliminar las pestañas de la categoría
      setTabs(tabs.filter(tab => tab.category !== categoryName));
    }
    
    // Eliminar la categoría
    setCategories(categories.filter(cat => cat !== categoryName));
  };

  // Función para actualizar la posición de una columna
  const updateColumnPosition = useCallback((category, position) => {
    setColumnPositions(prevPositions => ({
      ...prevPositions,
      [category]: position
    }));
  }, []);

  // Función para mover un klip a otra categoría
  const moveTabToCategory = useCallback((tabId, newCategory) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, category: newCategory } : tab
    ));
  }, [tabs]);

  return {
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
  };
}
