import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { app } from './firebase.js'

const db = getFirestore(app);
const auth = getAuth();

// Define la función typeWriter dentro del contexto donde se usa
function typeWriter(fullText, elementId, typingSpeed) {
    let currentIndex = 0;
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID '${elementId}' not found.`);
        return;
    }
    element.textContent = ''; // Iniciar con el contenido vacío
  
    function typeNextLetter() {
        if (currentIndex < fullText.length) {
            element.textContent += fullText.charAt(currentIndex);
            currentIndex++;
            setTimeout(typeNextLetter, typingSpeed);
        }
    }
  
    typeNextLetter();
}

function updateIndexProfilePicture(user) {
    const userDocRef = doc(db, "users", user.uid);

    getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.profilePicture) {
                document.getElementById('indexProfileImg').src = userData.profilePicture;
            }
        } else {
            console.log("No se encontraron datos del usuario.");
        }
    }).catch((error) => {
        console.error("Error al obtener datos de usuario", error);
    });
}

    function updateIndexUserName(user) {
        const userDocRef = doc(db, "users", user.uid);

    getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.name) {
                typeWriter(`Bienvenido, ${userData.name}`, 'welcomeText', 150);
            }
        } else {
            console.log("No se encontraron datos del usuario.");
        }
    }).catch((error) => {
        console.error("Error al obtener datos de usuario", error);
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        updateIndexProfilePicture(user);
        updateIndexUserName(user);
    } else {
        // Handle user not logged in or not found
    }
});
