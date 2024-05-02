import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, where, orderBy, onSnapshot ,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { addDoc, app } from './firebase.js'

const db = getFirestore(app);
const auth = getAuth();

// Funciones adicionales para manejo de UI
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
function updateIndexCoins(user) {
    const userDocRef = doc(db, "users", user.uid);

    getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const coins = userData.coins || 500; // Valor predeterminado de 500 monedas si no está presente
            document.getElementById('index-coins').textContent = coins;
        } else {
            console.log("No se encontraron datos del usuario.");
        }
    }).catch((error) => {
        console.error("Error al obtener datos de usuario", error);
    });
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
            console.log("No user data found.");
        }
    }).catch((error) => {
        console.error("Error fetching user data", error);
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

function cargarDatosGrafica(userId) {
    const q = query(collection(db, "userSessions"), where("userId", "==", userId), orderBy("timestamp", "asc"));

    onSnapshot(q, (querySnapshot) => {
        const sesiones = {};
        querySnapshot.forEach((doc) => {
            const fecha = doc.data().timestamp.toDate().toLocaleDateString();
            if (sesiones[fecha]) {
                sesiones[fecha] += 1;
            } else {
                sesiones[fecha] = 1;
            }
        });

        actualizarGrafica(Object.keys(sesiones), Object.values(sesiones));
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        updateIndexProfilePicture(user);
        updateIndexUserName(user);
        cargarDatosGrafica(user.uid); 
        updateIndexCoins(user);
        
        // Registra la sesión en Firestore
        addDoc(collection(db, "userSessions"), {
            userId: user.uid,
            timestamp: serverTimestamp(),
        }).then(() => {
            console.log('Session logged');
        }).catch((error) => {
            console.error('Error logging session:', error);
        });
    } else {
        // Handle user not logged in or not found
    }
});

/*
exports.onUserCreate = functions.firestore
    .document('users/{userId}')
    .onCreate(async (snap, context) => {
        const userDocRef = snap.ref;

        // Obtener todos los cursos existentes
        const coursesSnapshot = await admin.firestore().collection('courses').get();

        const coursesData = {};
        coursesSnapshot.forEach(courseDoc => {
            coursesData[courseDoc.id] = { unlocked: false };
        });

        // Añadir la información de los cursos al documento del usuario
        await userDocRef.set({ courses: coursesData }, { merge: true });
    });

exports.onCourseCreate = functions.firestore
    .document('courses/{courseId}')
    .onCreate(async (snap, context) => {
        const newCourseId = context.params.courseId;

        // Obtener todos los usuarios existentes
        const usersSnapshot = await admin.firestore().collection('users').get();

        usersSnapshot.forEach(async userDoc => {
            await userDoc.ref.update({
                [`courses.${newCourseId}`]: { unlocked: false }
            });
        });
    });
    */
