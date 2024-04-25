import { collection, query, where, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getFirestore, Timestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { app } from './firebase.js';

const db = getFirestore(app);

// Asegúrate de que el código se ejecute solo después de que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Referencia a la colección de usuarios
    const usersCollectionRef = collection(db, "users");

    // Escuchar cambios en la colección de usuarios para contar el total de usuarios
    onSnapshot(usersCollectionRef, (snapshot) => {
        const totalUsuariosElement = document.getElementById('totalUsuarios');
        if (totalUsuariosElement) {
            totalUsuariosElement.textContent = snapshot.size;
        } else {
            console.error('Elemento totalUsuarios no encontrado');
        }
    }, (error) => {
        console.error("Error al obtener datos de usuarios:", error);
    });

    // Obtiene la fecha actual al inicio del día
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Convertir la fecha de inicio del día en un objeto Timestamp de Firestore
    const startOfTodayTimestamp = Timestamp.fromDate(startOfToday);

    // Escuchar solo los documentos creados hoy para contar los nuevos usuarios del día
    const queryNewUsersToday = query(usersCollectionRef, where("createdAt", ">=", startOfTodayTimestamp));
    onSnapshot(queryNewUsersToday, (snapshot) => {
        const nuevosUsuariosElement = document.getElementById('nuevosUsuarios');
        if (nuevosUsuariosElement) {
            nuevosUsuariosElement.textContent = snapshot.size;
        } else {
            console.error('Elemento nuevosUsuarios no encontrado');
        }
    }, (error) => {
        console.error("Error al obtener nuevos usuarios de hoy:", error);
    });

    // Referencia a la colección de usuarios y la consulta para los activos hoy
  const queryActiveUsersToday = query(usersCollectionRef, where("lastActive", ">=", startOfTodayTimestamp));

  // Escuchar los documentos de usuarios activos hoy
  onSnapshot(queryActiveUsersToday, (snapshot) => {
    const activosUsuariosElement = document.getElementById('activosUsuarios');
    if (activosUsuariosElement) {
        activosUsuariosElement.textContent = snapshot.size;
    } else {
        console.error('Elemento activosUsuarios no encontrado');
    }
  }, (error) => {
    console.error("Error al obtener usuarios activos de hoy:", error);
  });

  // Escuchar cambios en la colección de usuarios para actualizar la tabla
  onSnapshot(usersCollectionRef, (snapshot) => {
    const tableBody = document.querySelector('#users_table .table__body tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de rellenarla

    snapshot.forEach(doc => {
        const user = doc.data();
        const userId = doc.id; // ID del documento de Firestore
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${userId}</td>
            <td><img src="${user.profilePicture || 'img/table/customer02.jpg'}" alt="">${user.name}</td>
            <td>${user.email || 'Email no encontrado'}</td>
            <td class="centered">${user.coins || 0}</td>
            <td class="centered">${user.unlockedCourses || 0}</td>
            <td class="centered"><ion-icon name="trash-outline" data-id="${userId}" class="delete-icon"></ion-icon></td>
        `;
        tableBody.appendChild(row);
    });
}, error => {
    console.error("Error al obtener datos de usuarios para la tabla:", error);
});

// Agregar manejador de eventos para botones de eliminar
document.querySelector('#users_table').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-icon')) {
        const userId = event.target.getAttribute('data-id');
        if (userId && confirm("¿Estás seguro de que quieres eliminar este usuario?")) {  // Confirmación antes de eliminar
            deleteDocument(userId);
        }
    }
});

// Función para eliminar un documento de usuario
function deleteDocument(userId) {
    const userDocRef = doc(db, "users", userId);
    deleteDoc(userDocRef)
        .then(() => {
            console.log("Documento eliminado con éxito");
            // El documento se elimina de Firestore y la tabla se actualizará automáticamente a través del listener onSnapshot si está configurado para escuchar cambios
        })
        .catch((error) => {
            console.error("Error eliminando documento:", error);
        });
}


});