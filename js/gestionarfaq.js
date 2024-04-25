import { db } from './firebase.js';
import { collection, getDocs, addDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// La función que se activa para mostrar el modal de eliminación y cargar las FAQs
window.activarModalEliminar = async function activarModalEliminar() {
    try {
      // Limpiar opciones existentes
      const select = document.getElementById('seleccionarFAQ');
      select.innerHTML = '';
  
      // Obtener FAQs de Firestore y llenar el dropdown
      const querySnapshot = await getDocs(collection(db, "faqs"));
      querySnapshot.forEach((doc) => {
        var option = document.createElement('option');
        option.value = doc.id;
        option.textContent = doc.data().pregunta;
        select.appendChild(option);
      });
  
      // Mostrar el modal
      document.getElementById('modalEliminarFAQ').style.display = 'block';
    } catch (error) {
      console.error("Error al cargar FAQs:", error);
    }
  }


// Agregar una nueva FAQ a Firebase
function agregarFAQ(pregunta, respuesta) {
    addDoc(collection(db, "faqs"), {
        pregunta: pregunta,
        respuesta: respuesta
    })
    .then(function(docRef) {
        console.log("FAQ agregada con ID:", docRef.id);
        alert('FAQ agregada correctamente!');
    })
    .catch(function(error) {
        console.error("Error al agregar FAQ:", error);
        alert('Error al agregar FAQ. Por favor, intente de nuevo.');
    });
}


async function eliminarFAQ(faqId) {
    try {
      // Utilizar el faqId para eliminar el documento de Firestore
      await deleteDoc(doc(db, "faqs", faqId));
      console.log("FAQ eliminada correctamente");
      alert('FAQ eliminada correctamente!');
      
      // Eliminar el elemento del DOM
      const faqElement = document.querySelector(`.faq-question[data-id="${faqId}"]`);
      if (faqElement) {
        faqElement.parentElement.remove(); // Esto elimina el div de la pregunta y la respuesta
      }
    } catch (error) {
      console.error("Error al eliminar FAQ:", error);
      alert('Error al eliminar FAQ. Por favor, intente de nuevo.');
    }
}


// Evento submit para el formulario de agregar FAQ
document.getElementById('formularioFAQ').addEventListener('submit', function(event) {
    event.preventDefault();
    var pregunta = document.getElementById('preguntaFAQ').value;
    var respuesta = document.getElementById('respuestaFAQ').value;
    agregarFAQ(pregunta, respuesta);
});

// Evento submit para el formulario de eliminar FAQ
document.getElementById('formularioEliminarFAQ').addEventListener('submit', function(event) {
    event.preventDefault();
    var faqId = document.getElementById('seleccionarFAQ').value;
    eliminarFAQ(faqId); // Llamar a eliminarFAQ con el ID de la FAQ seleccionada
});