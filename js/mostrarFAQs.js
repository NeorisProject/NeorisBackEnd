// En tu archivo JavaScript que está conectado a faq.html
import { db } from './firebase.js';
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Función para obtener y mostrar las FAQs
async function mostrarFAQs() {
    try {
        const querySnapshot = await getDocs(collection(db, "faqs"));
        const questionsContainer = document.querySelector('.questions-container');
        
        // Limpiar preguntas predeterminadas
        questionsContainer.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const faq = doc.data();
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question');
            
            // Agregar la pregunta y la respuesta sin necesidad de desplegarlas
            questionDiv.innerHTML = `
                <div class="faq-question">${faq.pregunta}</div>
                <div class="faq-answer">${faq.respuesta}</div>
            `; // Los estilos de estas clases los debes definir en tu CSS

            questionsContainer.appendChild(questionDiv);
        });
    } catch (error) {
        console.error("Error al cargar FAQs:", error);
    }
}

// Llamar a mostrarFAQs cuando la ventana se cargue
window.onload = mostrarFAQs;
