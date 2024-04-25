import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {  getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"
import {app} from './firebase.js'

const db = getFirestore(app);
const auth = getAuth(app);

const addCourseForm = document.getElementById('editCourseForm');

addCourseForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Esto evitará que el formulario se envíe y agregue los datos a la URL

    const courseNameInput = document.getElementById('editCourseName');
    const courseDescriptionInput = document.getElementById('editCourseDescription');
    const courseCategoryInput = document.getElementById('editCourseCategory');
    const courseLinkInput = document.getElementById('editLearningObjective');
    const coursePublishInput = document.getElementById('toggleCoursePublication')

    const name = courseNameInput.value;
    const description = courseDescriptionInput.value;
    const category = courseCategoryInput.value;
    const link = courseLinkInput.value;
    const publish = coursePublishInput.value;

    try{

        // Guarda la información adicional del usuario en Firestore
        await setDoc(doc(db, "courses", userCredential.user.uid), {
            name: name,
            description: description,
            category: category,
            link:link,
            publish:publish,
        });

        console.log('Courses information saved to Firestore');

        const successMessage = document.createElement('div');
        successMessage.textContent = 'Creación de cuenta exitosa';
        successMessage.className = 'success-message'; // Utiliza esta clase para el estilo en tu CSS
        document.body.appendChild(successMessage);

        setTimeout(() => {
            if (document.body.contains(successMessage)) {
                document.body.removeChild(successMessage);
            }
        }, 3000);



        signupForm.reset();
    }catch (error) {
        console.error('Error during creating a course:', error);
        // Manejo del error de registro
    }

});
