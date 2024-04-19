import { signInWithGoogle,signUpWithGoogle} from './firebase.js'
import {registerWithEmail , signInWithEmail,app} from './firebase.js'
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {  getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"

//import {saveUserLogin , getUserSignUp, saveUserSignUp,getUserSignUp} from './firebase.js'
const db = getFirestore(app);

const signinForm = document.getElementById('signin-form');
const googleSignUpButton  = document.getElementById("signupGoogle");
const googleLoginButton  = document.getElementById("loginGoogle");
const container = document.getElementById('container');
const signupForm = document.getElementById('signup-form');

const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
/*
window.addEventListener('DOMContentLoaded', async()=>{
    const querySnapshot = await getUserLogin()
    //para ver bien los datos en json
    querySnapshot.forEach(doc => {
        console.log(doc.data())
    })
});
*/
    
signinForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Esto evitará que el formulario se envíe y agregue los datos a la URL

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    const email = emailInput.value;
    const password = passwordInput.value;



    // Call the saveUserLogin function and pass the email and password
    signInWithEmail(email, password)
    .then((userCredential) => {
        console.log('User Logged In Correctly !', userCredential.user);

        const successMessage = document.createElement('div');
        successMessage.textContent = 'Inicio de sesión exitoso';
        successMessage.className = 'success-message'; // Asegúrate de definir este estilo en tu CSS
        document.body.appendChild(successMessage);

        // Eliminar el mensaje después de 2 segundos
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 2000);

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2500); // Asegúrate de que este retraso sea mayor al del mensaje para que el usuario pueda leerlo

        signinForm.reset()
    })
    .catch((error) => {
        console.error('Error writing document to Firestore: ', error);
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Usuario o contraseña incorrectos';
        errorMessage.className = 'error-message'; // Asegúrate de definir este estilo en tu CSS
        document.body.appendChild(errorMessage);

        setTimeout(() => {
            document.body.removeChild(errorMessage);
        }, 2000);
    });
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Esto evitará que el formulario se envíe y agregue los datos a la URL

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const birthdayInput = document.getElementById('fechaNac');
    const departmentInput = document.getElementById('departamento');

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const birthday = birthdayInput.value;
    const department = departmentInput.value;

    try{
        const userCredential = await registerWithEmail(email,password);
        console.log('User registered with email and password', userCredential.user);

        // Guarda la información adicional del usuario en Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            name: name,
            birthday: birthday,
            department: department
        });

        console.log('User additional information saved to Firestore');

        const successMessage = document.createElement('div');
        successMessage.textContent = 'Creación de cuenta exitosa';
        successMessage.className = 'success-message'; // Utiliza esta clase para el estilo en tu CSS
        document.body.appendChild(successMessage);

        setTimeout(() => {
            if (document.body.contains(successMessage)) {
                document.body.removeChild(successMessage);
            }
        }, 3000);

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2500); // Asegúrate de que este retraso sea mayor al del mensaje para que el usuario pueda leerlo


        signupForm.reset();
    }catch (error) {
        console.error('Error during signup:', error);
        // Manejo del error de registro
    }

});






googleSignUpButton.addEventListener("click", (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del botón (navegar a un enlace).
    signUpWithGoogle()
    .then((result) => {
        // Aquí puedes manejar la redirección del usuario o la actualización de la UI.
        console.log('User signed in with Google:', result.user);
    })
    .catch((error) => {
        console.error('Error during sign in with Google:', error);
    });
});

//


googleLoginButton.addEventListener("click", (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del botón (navegar a un enlace).
    signInWithGoogle()
    .then((result) => {
        // Aquí puedes manejar la redirección del usuario o la actualización de la UI.
        console.log('User signed in with Google:', result.user);
    })
    .catch((error) => {
        console.error('Error during sign in with Google:', error);
    });
});
    // Aquí podrías llamar a saveUserLogin o cualquier otra función que maneje los datos
    //saveUserLogin(emailInput.value, passwordInput.value);
    //signinForm.reset();
//salvamos todo lo que estab antes en login 