import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { app } from './firebase.js';

const db = getFirestore(app);

// Asegúrate de que el código se ejecute solo después de que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  // Referencia a la colección de usuarios
  const usersCollectionRef = collection(db, "users");

  // Escuchar cambios en la colección de usuarios
  onSnapshot(usersCollectionRef, (snapshot) => {
    // Contar el total de usuarios
    const totalUsuarios = snapshot.size;

    // Actualizar el HTML con el total de usuarios
    const totalUsuariosElement = document.getElementById('totalUsuarios');
    if (totalUsuariosElement) {
        totalUsuariosElement.textContent = totalUsuarios;
    } else {
        console.error('Elemento totalUsuarios no encontrado');
    }
  }, (error) => {
    console.error("Error al obtener datos de usuarios para el totalUsuario:", error);
  });
});
