import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {app} from './firebase.js'

const db = getFirestore(app);
const auth = getAuth();

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

// Define la función fuera del onAuthStateChanged para poder llamarla después
function typeWriter(fullText, elementId, typingSpeed) {
    let currentIndex = 0;
    const element = document.getElementById(elementId);
    element.textContent = ''; // Iniciar con el contenido vacío
  
    const typeNextLetter = () => {
      if (currentIndex < fullText.length) {
        // Agregar la siguiente letra al contenido actual
        element.textContent += fullText.charAt(currentIndex);
        // Incrementar el índice para la siguiente letra
        currentIndex++;
        // Llamar a la función nuevamente después de un cierto tiempo
        setTimeout(typeNextLetter, typingSpeed);
      }
    };
  
    // Iniciar la animación de escritura
    typeNextLetter();
  }

function updateIndexUserName(user) {
    const userDocRef = doc(db, "users", user.uid);

    getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.name) {
                const fullName = `Bienvenido, ${userData.name}`;
                //document.getElementById('welcomeText').textContent = `Bienvenido, ${userData.name}`;
                typeWriter(fullName, 'welcomeText', 150);
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
    }
});
