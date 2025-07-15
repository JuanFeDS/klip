import { useState } from 'react';
import { sampleTabs } from "../data/sampleTabs";
import CategoryColumn from "../components/CategoryColumn";
import TabModal from "../components/modals/TabModal";
import Header from "../components/Header";
import { useTabs } from "../hooks/useTabs";

export default function Home() {
  const {
    tabs,
    categories,
    groupedTabs,
    addTab,
    updateTab,
    deleteTab,
    addCategory,
    updateCategory,
    deleteCategory
  } = useTabs(sampleTabs);
  
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto p-4">
        <Header 
          onAddTab={() => handleAddTab()} 
          onAddCategory={handleAddCategory} 
        />
        
        <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4">
          {categories.map(category => (
            <CategoryColumn
              key={category}
              category={category}
              tabs={groupedTabs[category] || []}
              onAddTab={() => handleAddTab(category)}
              onEditTab={handleEditTab}
              onDeleteTab={handleDeleteTab}
              onEditCategory={(oldCategory) => {
                const newCategory = window.prompt('Nuevo nombre para la categoría:', oldCategory);
                if (newCategory) {
                  updateCategory(oldCategory, newCategory);
                }
              }}
              onDeleteCategory={deleteCategory}
            />
          ))}
        </div>
      </main>
      
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
