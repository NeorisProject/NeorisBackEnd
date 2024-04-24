import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {  getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"
import {app} from './firebase.js'

const db = getFirestore(app);

const buttons = document.querySelectorAll('button');

buttons.forEach( button =>{
    button.addEventListener('click',()=>{
        const faq = button.nextElementSibling;
        const icon = button.children[1];

        faq.classList.toggle('show');
        icon.classList.toggle('rotate');
        
    })
} )