import { collection, query, where, onSnapshot, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { db } from './firebase.js';  // Asegúrate de que este importe sea correcto

document.addEventListener('DOMContentLoaded', async () => {
    const usersCollectionRef = collection(db, "users");

    // Obtener el total de usuarios registrados para definir el máximo de usuarios para el círculo completo
    let totalUsers = 0;
    const allUsersSnapshot = await getDocs(usersCollectionRef);
    totalUsers = allUsersSnapshot.size;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTodayTimestamp = Timestamp.fromDate(startOfToday);

    const activeTodayQuery = query(usersCollectionRef, where("lastActive", ">=", startOfTodayTimestamp));

    onSnapshot(activeTodayQuery, (snapshot) => {
        const activeUsersCount = snapshot.size;
        const percentage = (activeUsersCount / totalUsers) * 100;  // Usa el total de usuarios para calcular el porcentaje

        // Calcula la longitud de la circunferencia
        const circumference = 2 * Math.PI * 15.9155;

        // Calcula la longitud del trazo que representa los usuarios activos
        const strokeLength = (percentage / 100) * circumference;

        // Actualizar el DOM
        const activeUsersCountElement = document.getElementById('activeUsersCount');
        const activeUsersPercentageElement = document.getElementById('activeUsersPercentage');
        const circleElement = document.querySelector('.circular-chart .circle');

        if (activeUsersCountElement && activeUsersPercentageElement && circleElement) {
            activeUsersCountElement.textContent = activeUsersCount;
            activeUsersPercentageElement.textContent = percentage.toFixed(0) + '%';
            circleElement.setAttribute('stroke-dasharray', `${strokeLength}, ${circumference}`);
        }
    }, (error) => {
        console.error("Error al obtener usuarios activos:", error);
    });
});
