import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {  getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"
import {app} from './firebase.js'

const db = getFirestore(app);
const auth = getAuth();

const editCourses = document.getElementById('addCourseForm');

const newCourseRef = firebase.firestore().collection('courses').doc(); 
const id = newCourseRef.id; 
newCourseRef.set({ /* datos del curso */ });



function editCourses(courseId) {
    const editCourseForm = document.getElementById('addCourseForm');
    editCourseForm.setAttribute('data-course-id', courseId);
  
    // Aquí deberías cargar los datos del curso en los campos del formulario
    // Utiliza firebase.firestore().collection('courses').doc(courseId).get() para obtener los datos
  }

document.getElementById('editCourseForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Esto evitará que el formulario se envíe y agregue los datos a la URL

    // Obtén el ID del curso que estás editando
    const courseId = e.target.getAttribute('data-course-id');
    
    // Obtén los valores del formulario
    const courseName = document.getElementById('editCourseName').value;
    const courseDescription = document.getElementById('editCourseDescription').value;
    const courseCategory = document.getElementById('editCourseCategory').value;
    const courseLink = document.getElementById('editLearningObjectives').value;
    const coursePublication = document.getElementById('toggleCoursePublication').checked;

    // Asegúrate de que el ID del curso esté presente
    if (courseId) {
        try {
            // Actualizar el curso en Firestore
            await firebase.firestore().collection('courses').doc(courseId).update({
                nombre: courseName,
                descripcion: courseDescription,
                categoria: courseCategory,
                hipervinculo: courseLink,
                publicado: coursePublication,
                fechaEdicion: new Date() // o firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Curso actualizado con éxito');
            const successMessage = document.createElement('div');
            successMessage.textContent = 'Creacion de curso exitoso';
            successMessage.className = 'success-message'; // Asegúrate de definir este estilo en tu CSS
            document.body.appendChild(successMessage);
    
            // Eliminar el mensaje después de 2 segundos
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 2000);
    
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2500); // Asegúrate de que este retraso sea mayor al del mensaje para que el usuario pueda leerlo
    
            signinForm.reset()
        } catch (error) {
            console.error('Error al actualizar el curso: ', error);
            // Maneja el error, por ejemplo, mostrando un mensaje al usuario
            // ...
        }
    } else {
        console.error('No se proporcionó el ID del curso para la actualización');
        // Maneja la falta de ID de curso aquí, tal vez mostrando un error al usuario
        // ...
    }
});
