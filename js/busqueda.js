function removeHighlights() {
    document.querySelectorAll('.highlighted').forEach((highlightedElement) => {
      highlightedElement.outerHTML = highlightedElement.innerHTML; // Elimina el elemento span, dejando solo el texto
    });
  }
  
  function highlight(searchTerm) {
    removeHighlights(); // Elimina los resaltados previos antes de agregar nuevos
  
    if (!searchTerm) {
      return; // Si no hay término de búsqueda, no hace nada
    }
  
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const textNodes = getTextNodes(document.body); // Obtiene todos los nodos de texto en el cuerpo del documento
  
    textNodes.forEach(node => {
      const matches = []; // Guarda las posiciones de los términos encontrados
      let match;
      while ((match = regex.exec(node.nodeValue)) !== null) {
        matches.push(match);
      }
  
      matches.reverse().forEach(match => {
        const span = document.createElement('span'); // Crea un nuevo elemento span para el resaltado
        span.className = 'highlighted';
        span.textContent = match[0]; // Establece el texto encontrado
  
        const afterNode = node.splitText(match.index); // Divide el nodo de texto en la posición de inicio del término encontrado
        afterNode.nodeValue = afterNode.nodeValue.substring(match[0].length); // Actualiza el nodo de texto con el contenido después del término
        node.parentNode.insertBefore(span, afterNode); // Inserta el nuevo span antes del nodo de texto actualizado
      });
    });
  }
  
  function getTextNodes(node) {
    const textNodes = [];
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node); // Si es un nodo de texto, lo añade a la lista
    } else {
      node.childNodes.forEach(child => {
        textNodes.push(...getTextNodes(child)); // Llamada recursiva para los hijos del nodo actual
      });
    }
    return textNodes;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        highlight(searchBar.value);
      }
    });
  });
  