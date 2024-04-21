import {app} from './firebase.js'
import { getAuth , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";



const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();

let selectedFile;

// Preparar el archivo para subirlo y mostrar una vista previa
function handleFileInput() {
    const fileInput = document.getElementById('profilePic');
    selectedFile = fileInput.files[0];
    
    if (selectedFile) {
        // Mostrar una vista previa de la imagen
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImgPreview').src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
    }
}

// Esta función se dispara cuando se hace clic en el botón de actualizar foto y abre el diálogo de selección de archivos
function uploadProfilePicture() {
    document.getElementById('profilePic').click();
}

// Esta función maneja la subida inmediata del archivo seleccionado
function uploadSelectedFile() {
    if (!selectedFile) {
        alert('Por favor, selecciona un archivo antes de intentar actualizar la foto.');
        return;
    }

    const user = auth.currentUser;
    if (user) {
        const storageReference = storageRef(storage, `profile_images/${user.uid}/${selectedFile.name}`);
        uploadBytes(storageReference, selectedFile).then((snapshot) => {
            console.log('Uploaded a image file!', snapshot);

            // Obtener la URL de descarga y actualizar el documento del usuario
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                console.log('image available at', downloadURL);

                // Actualizar la imagen del perfil en Firestore
                const userDocRef = doc(db, "users", user.uid);
                updateDoc(userDocRef, {
                    profilePicture: downloadURL
                });

                // Actualizar la imagen en la interfaz de usuario
                document.getElementById('profileImgPreview').src = downloadURL;
            });
        }).catch((error) => {
            console.error("Error uploading file", error);
        });
    } else {
        console.log('User not logged in');
    }
}



// Function to update user profile details in the DOM
function updateUserProfile(user) {
    const userDocRef = doc(db, "users", user.uid);
    getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            document.getElementById('profileName').textContent = userData.name || 'Nombre no disponible';
            document.getElementById('profileEmail').textContent = user.email;
            // Not advisable to display passwords in the frontend
            document.getElementById('profilePassword').textContent = user.password;
            const linkedInEl = document.getElementById('profileLinkedIn');
            if (linkedInEl) {
                linkedInEl.href = userData.linkedin || '#';
                linkedInEl.textContent = userData.linkedin ? 'Ver perfil de LinkedIn' : 'No proporcionado';
            }
            //document.getElementById().href = userData.linkedin;
            //document.getElementById().textContent = 'Perfil de LinkedIn';
            document.getElementById('profileBirthday').textContent = userData.birthday || 'Fecha de nacimiento no disponible' ;
            document.getElementById('profileDepartment').textContent = userData.department || 'Departamento no disponible';
            console.log("URL de la imagen del perfil: ", userData.profilePicture); 
            const profileImg = document.getElementById('profileImgPreview');
            if (docSnap.exists()) {
                const userData = docSnap.data();
                console.log("Datos del usuario: ", userData);  // Imprimir todos los datos del usuario para diagnóstico
                // ...
            }
            if (userData.profilePicture) {
                const timeStamp = new Date().getTime();
                profileImg.src = `${userData.profilePicture}?${timeStamp}`;
            }else {
                profileImg.src = '/img/customer01.jpg'; // imagen por defecto
                console.log('No se encontro imagen');
            }

        } else {
            console.log("No se encontraron datos del usuario");
        }
    }).catch((error) => {
        console.error("ERROR AL OBTENER DATOS DE USUARIO", error);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('profilePic').addEventListener('change', handleFileInput);
    document.getElementById('saveProfilePicture').addEventListener('click', uploadSelectedFile);
    document.getElementById('updateProfilePicture').addEventListener('click', uploadProfilePicture);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            updateUserProfile(user);
        } else {
            // El usuario no ha iniciado sesión. Redirigirlos a la página de inicio de sesión.
            window.location.href = 'login.html';
        }
    });

});