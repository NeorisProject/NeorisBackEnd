import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
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


});