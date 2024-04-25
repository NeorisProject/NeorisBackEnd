import { doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"
import { getAuth , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
//import firebase from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import {app} from './firebase.js'
import { db, addDoc, serverTimestamp,collection } from './firebase.js';
import {query, getDocs} from './firebase.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

//const db = getFirestore(app);
const storage = getStorage(app);

console.log('javascript running');
const auth = getAuth();

function openAddCourseModal() {
    console.log('Intentando abrir el modal');
    document.getElementById('modalBackground').style.display = 'block'; 
}

function closeAddCourseModal() {
    console.log('Intentando cerrar el modal');
    document.getElementById('modalBackground').style.display = 'none'; 

}

let selectedFile;

// Preparar el archivo para subirlo y mostrar una vista previa
function handleFileInput() {
    const fileInput = document.getElementById('coursePic');
    selectedFile = fileInput.files[0];
    
    if (selectedFile) {
        // Mostrar una vista previa de la imagen
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('courseImgPreview').src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
    }
}

window.handleFileInput = function handleFileInput() {
    const fileInput = document.getElementById('coursePic');
    selectedFile = fileInput.files[0];
    
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('courseImgPreview').src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
    }else{
      document.getElementById('courseImgPreview').src = "/img/cursos-portada/curso1.jpg";
    }
};




// Esta función maneja la subida inmediata del archivo seleccionado
function uploadSelectedFile() {
    if (!selectedFile) {
        alert('Por favor, selecciona un archivo antes de intentar actualizar la foto.');
        return;
    }
    // Referencia de almacenamiento con el ID del usuario y el nombre del archivo seleccionado.
    const storageReference = storageRef(storage, `courses_images/${docRef.id}/${selectedFile.name}`);
    
    // Subir el archivo a Firebase Storage.
    uploadBytes(storageReference, selectedFile).then((snapshot) => {
        console.log('Uploaded an image file!', snapshot);

        // Obtener la URL de descarga del archivo subido.
        return getDownloadURL(snapshot.ref);
    })
    .then((downloadURL) => {
        console.log('Image available at', downloadURL);

        // Actualizar el perfil de courses en Firestore con la nueva URL de la imagen.
        const userDocRef = doc(db, "courses",  docRef.id);
        return updateDoc(userDocRef, {
          coursePicture: downloadURL // Asegúrate de que este campo coincida con el de Firestore.
        });
    })
    .then(() => {
        // Aquí, después de que la URL se ha guardado en Firestore,
        // puedes llamar a la función para actualizar la información del perfil
        // para asegurarte de que la imagen se actualiza en la interfaz de usuario.
        console.log('Profile image URL updated in Firestore');
        updateUserProfile(user); // Esta línea es para actualizar la interfaz de usuario.
    })
    .catch((error) => {
        console.error("Error uploading file or updating Firestore", error);
    });
}

// Manejador de eventos para el formulario de edición
document.getElementById('addCourseForm').addEventListener('submit',async function(e) {
    e.preventDefault();
    console.log('Formulario enviado');

    // Captura los valores de los campos del formulario
    const courseName = document.getElementById('addCourseName').value;
    const courseDescription = document.getElementById('addCourseDescription').value;
    const courseCategory = document.getElementById('addCourseCategory').value;
    const courseLink = document.getElementById('addLearningObjectives').value;
    const coursePublication = document.getElementById('toggleCoursePublication').checked;
    
    const fileInput = document.getElementById('coursePic');
    const selectedFile = fileInput.files[0];

    // Construye el objeto con los datos del curso
    const courseData = {
      nombre: courseName,
      descripcion: courseDescription,
      categoria: courseCategory,
      hipervinculo: courseLink,
      publicado: coursePublication,
      fechaCreacion: serverTimestamp()
    };

    try {
      // Añade el nuevo curso a Firestore
      // Dentro de tu evento de 'submit'
      const docRef = await addDoc(collection(db, 'courses'), courseData);
      console.log('Curso añadido con ID: ', docRef.id);

      document.getElementById('addCourseForm').reset();
      displaySuccessMessage();

      if (selectedFile) {
        // Suponiendo que usas Firebase Storage para subir la imagen
        const storageReference = storageRef(storage, `courses_images/${docRef.id}/${selectedFile.name}`);
        const uploadResult = await uploadBytes(storageReference, selectedFile);
        const downloadURL = await getDownloadURL(uploadResult.ref);
        await updateDoc(doc(db, "courses", docRef.id), { coursePicture: downloadURL });
        console.log('Course image and details updated successfully');
        // Aquí puedes limpiar el formulario o cerrar el modal si así lo deseas
      }
    }catch (error) {
      console.error('Error al añadir el curso: ', error);
  }
});
function displaySuccessMessage() {
  const successMessage = document.createElement('div');
  successMessage.textContent = 'Creacion de Curso Exitoso';
  closeAddCourseModal();
  successMessage.className = 'success-message'; // Asegúrate de definir este estilo en tu CSS
  document.body.appendChild(successMessage);

  // Eliminar el mensaje después de 2 segundos
  setTimeout(() => {
      document.body.removeChild(successMessage);
  }, 2000);
}


// Dentro de tu archivo gestionarCursos.js
document.addEventListener('DOMContentLoaded', () => {
    const addIcon = document.querySelector('.add-icon'); // Asegúrate de que este selector apunte al botón correcto
    if (addIcon) {
      addIcon.addEventListener('click', openAddCourseModal);
    }else {
      console.error('El icono de añadir curso no se encontró en el DOM');
  }
});
  
document.querySelector('.close').addEventListener('click', closeAddCourseModal);

  
// Función para actualizar el número total de cursos
async function updateTotalCourses() {
  try {
    // Referencia a la colección de cursos
    const coursesCollectionRef = collection(db, 'courses');
    // Crea una consulta para obtener todos los documentos de la colección de cursos
    const q = query(coursesCollectionRef);
    
    // Ejecuta la consulta y obtén los resultados
    const querySnapshot = await getDocs(q);
    const totalCourses = querySnapshot.docs.length; // La longitud del array docs es el total de cursos
    
    // Selecciona el elemento que muestra el número de cursos y actualízalo
    const cardNumberElement = document.querySelector('.card-number');
    cardNumberElement.textContent = totalCourses; // Actualiza el contenido del elemento con el número real
  } catch (error) {
    console.error("Error al obtener el total de cursos: ", error);
  }
}
// Función para eliminar un curso
async function deleteCourse(courseId) {
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      console.log(`Curso con ID ${courseId} ha sido eliminado.`);
      loadCourses(); // Recarga la lista de cursos después de la eliminación para reflejar los cambios
    } catch (error) {
      console.error("Error al eliminar curso: ", error);
    }
  }
  

// Función para cargar y mostrar los cursos
// Función para cargar y mostrar los cursos
async function loadCourses() {
    const coursesCollectionRef = collection(db, 'courses');
    const querySnapshot = await getDocs(coursesCollectionRef);
  
    const tableBody = document.querySelector('section.table__body table tbody');
    tableBody.innerHTML = ''; // Limpia el contenido actual del tbody
  
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${doc.id}</td>
        <td>${data.nombre}</td>
        <td class="centered">${data.categoria}</td>
        <td class="centered">${data.fechaCreacion.toDate().toLocaleDateString()}</td>
        <td class="center-icon"></td>
      `;
  
      // Crea un nuevo elemento ion-icon para el botón de eliminar
      const deleteIcon = document.createElement('ion-icon');
      deleteIcon.setAttribute('name', 'trash-outline');
      deleteIcon.classList.add('delete-icon');
      deleteIcon.setAttribute('data-id', doc.id); // Añade un data-id para identificar qué curso eliminar
  
      // Agrega evento de clic al icono de eliminar que incluye confirmación
      deleteIcon.addEventListener('click', () => {
        if (confirm(`¿Estás seguro de que quieres eliminar el curso ${data.nombre}?`)) {
          deleteCourse(doc.id);  // Llama a la función de eliminación si el usuario confirma
        }
      });
  
      // Encuentra la celda de acción que acabamos de crear y añade el icono de eliminar
      const actionCell = row.children[row.children.length - 1];
      actionCell.appendChild(deleteIcon);
  
      tableBody.appendChild(row);
    });
  }
  


document.addEventListener('DOMContentLoaded', () => {
  updateTotalCourses();
  loadCourses();
});