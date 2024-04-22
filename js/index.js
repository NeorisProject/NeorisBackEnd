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

onAuthStateChanged(auth, (user) => {
    if (user) {
        updateIndexProfilePicture(user);
    }
});
