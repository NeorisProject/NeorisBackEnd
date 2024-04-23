// Función para abrir el modal de edición
function openEditModal(courseId) {
    console.log("Abrir modal de edición para el curso ID:", courseId);
    var modal = document.getElementById('editCourseModal');
    modal.style.display = 'block';  // Asegúrate de que este ID corresponde al del modal de editar
  
    // Carga aquí los datos del curso si es necesario
    // Por ejemplo, podrías hacer una solicitud AJAX aquí para obtener los datos del curso y luego rellenar los campos del formulario
  }
  
  // Función para cerrar el modal de edición
  function closeEditModal() {
    var modal = document.getElementById('editCourseModal');
    modal.style.display = 'none';
  }
  
  // Evento para cerrar el modal al hacer clic en la cruz o fuera del modal
  window.onclick = function(event) {
    var modal = document.getElementById('editCourseModal');
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }
  