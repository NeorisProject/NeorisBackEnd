
/*import { ref , uploadBytes, getDownloadURL, getStorage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";
import { db, getDocs, collection, serverTimestamp, query,app } from './firebase.js';

document.addEventListener('DOMContentLoaded', function() {
    restoreLockStates();

    const items = document.querySelectorAll('.carousel-item');
    items.forEach(item => {
        item.addEventListener('click', function(event) {
            checkLock(event, this);
        });
    });
});
function toggleLock(event, icon) {
    event.stopPropagation();
    event.preventDefault(); // Prevent link navigation

    const item = icon.closest('.carousel-item');
    const itemId = item.getAttribute('data-id');
    const isLocked = item.getAttribute('data-locked') === 'true';

    const db = firebase.firestore(); // Ensure this import is at the top of the file

    // Update both lock state and published state
    if (isLocked) {
        icon.name = 'lock-open-outline';
        icon.classList.replace('locked', 'unlocked');
        item.setAttribute('data-locked', 'false');
        localStorage.setItem('locked_' + itemId, 'false');

        db.collection('courses').doc(itemId).update({ locked: false, publicado: true })
        .then(() => console.log("Course unlocked and published in Firestore"))
        .catch((error) => console.error("Error updating lock state: ", error));
    } else {
        icon.name = 'lock-closed-outline';
        icon.classList.replace('unlocked', 'locked');
        item.setAttribute('data-locked', 'true');
        localStorage.setItem('locked_' + itemId, 'true');

        db.collection('courses').doc(itemId).update({ locked: true, publicado: false })
        .then(() => console.log("Course locked and unpublished in Firestore"))
        .catch((error) => console.error("Error updating lock state: ", error));
    }
}


function checkLock(event, item) {
    const isLocked = item.getAttribute('data-locked') === 'true';
    if (isLocked) {
        event.preventDefault();
        item.classList.add('shake'); // Agregar la clase 'shake' para iniciar la animación
        setTimeout(() => item.classList.remove('shake'), 500); // Eliminar la clase después de que la animación haya terminado
    } else {
        // Si el curso no está bloqueado, puedes proceder como de costumbre
        window.location.href = item.getAttribute('href');
    }
}


function restoreLockStates() {
    const db = firebase.firestore(); // Ensure this import is at the top of the file
    const items = document.querySelectorAll('.carousel-item');

    db.collection('courses').get().then(querySnapshot => {
        const courseData = {};
        querySnapshot.forEach(doc => {
            courseData[doc.id] = doc.data();
        });

        items.forEach(item => {
            const itemId = item.getAttribute('data-id');
            const isLocked = courseData[itemId] && courseData[itemId].locked;

            const icon = item.querySelector('.lock-icon');
            if (isLocked) {
                icon.name = 'lock-closed-outline';
                icon.classList.add('locked');
                icon.classList.remove('unlocked');
                item.setAttribute('data-locked', 'true');
            } else {
                icon.name = 'lock-open-outline';
                icon.classList.add('unlocked');
                icon.classList.remove('locked');
                item.setAttribute('data-locked', 'false');
            }
        });
    }).catch(error => console.error("Error retrieving lock states: ", error));
}
*/