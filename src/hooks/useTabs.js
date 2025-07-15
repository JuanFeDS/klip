import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_CATEGORIES = ["Trabajo", "Personal", "Entretenimiento", "Educación"];

export function useTabs(initialTabs = []) {
  const [tabs, setTabs] = useState(() => {
    const savedTabs = localStorage.getItem('klip-tabs');
    return savedTabs ? JSON.parse(savedTabs) : initialTabs;
  });
  
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('klip-categories');
    return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
  });

  // Guardar en localStorage cuando cambien las pestañas o categorías
  useEffect(() => {
    localStorage.setItem('klip-tabs', JSON.stringify(tabs));
  }, [tabs]);
  
  useEffect(() => {
    localStorage.setItem('klip-categories', JSON.stringify(categories));
  }, [categories]);

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

  return {
    tabs,
    categories,
    groupedTabs,
    addTab,
    updateTab,
    deleteTab,
    addCategory,
    updateCategory,
    deleteCategory
  };
}
