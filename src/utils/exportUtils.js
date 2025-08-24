/**
 * Exporta los datos de los tabs a un archivo CSV
 * @param {Array} tabs - Lista de tabs a exportar
 * @param {Array} categories - Lista de categorías
 */
export const exportToCSV = (tabs, categories) => {
  // Crear el contenido CSV
  const headers = ['Categoría', 'Título', 'URL', 'Fecha de creación'];
  
  // Mapear los datos a filas de CSV
  const rows = [];
  
  // Si no hay categorías, exportar como lista plana
  if (!categories || categories.length === 0) {
    tabs.forEach(tab => {
      rows.push([
        `"${tab.category || 'Sin categoría'}"`,
        `"${tab.title}"`,
        `"${tab.url}"`,
        `"${new Date(tab.createdAt || Date.now()).toISOString()}"`
      ]);
    });
  } else {
    // Agrupar por categoría
    categories.forEach(category => {
      const categoryTabs = tabs.filter(tab => tab.category === category);
      
      if (categoryTabs.length > 0) {
        // Agregar fila de categoría
        rows.push([`"=== ${category} ==="`, '', '', '']);
        
        // Agregar tabs de esta categoría
        categoryTabs.forEach(tab => {
          rows.push([
            '', // Categoría vacía ya que está agrupada
            `"${tab.title}"`,
            `"${tab.url}"`,
            `"${new Date(tab.createdAt || Date.now()).toISOString()}"`
          ]);
        });
        
        // Agregar línea en blanco entre categorías
        rows.push(['', '', '', '']);
      }
    });
    
    // Agregar tabs sin categoría al final si existen
    const uncategorizedTabs = tabs.filter(tab => !tab.category || tab.category === '');
    if (uncategorizedTabs.length > 0) {
      rows.push(['"=== Sin categoría ==="', '', '', '']);
      uncategorizedTabs.forEach(tab => {
        rows.push([
          '',
          `"${tab.title}"`,
          `"${tab.url}"`,
          `"${new Date(tab.createdAt || Date.now()).toISOString()}"`
        ]);
      });
    }
  }
  
  // Crear el contenido final del CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Crear un blob con el contenido
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Crear un enlace temporal y hacer clic en él para descargar
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `klips_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exporta los datos de los tabs a un archivo JSON
 * @param {Array} tabs - Lista de tabs a exportar
 * @param {Array} categories - Lista de categorías
 */
export const exportToJSON = (tabs, categories) => {
  // Estructura de datos para el JSON
  const exportData = {
    meta: {
      exportDate: new Date().toISOString(),
      totalTabs: tabs.length,
      totalCategories: categories.length
    },
    categories: {}
  };
  
  // Agrupar por categoría
  categories.forEach(category => {
    const categoryTabs = tabs.filter(tab => tab.category === category);
    if (categoryTabs.length > 0) {
      exportData.categories[category] = categoryTabs.map(({ id, ...tab }) => ({
        ...tab,
        // Asegurarse de que las fechas estén en formato ISO
        createdAt: tab.createdAt ? new Date(tab.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: tab.updatedAt ? new Date(tab.updatedAt).toISOString() : new Date().toISOString()
      }));
    }
  });
  
  // Agregar tabs sin categoría si existen
  const uncategorizedTabs = tabs.filter(tab => !tab.category || tab.category === '');
  if (uncategorizedTabs.length > 0) {
    exportData.categories['Sin categoría'] = uncategorizedTabs.map(({ id, ...tab }) => ({
      ...tab,
      createdAt: tab.createdAt ? new Date(tab.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: tab.updatedAt ? new Date(tab.updatedAt).toISOString() : new Date().toISOString()
    }));
  }
  
  // Crear un blob con el contenido JSON
  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Crear un enlace temporal y hacer clic en él para descargar
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `klips_export_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
