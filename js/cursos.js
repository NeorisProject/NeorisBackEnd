
//import { collection } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"
import { ref , uploadBytes, getDownloadURL, getStorage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";
import { db, getDocs, collection, serverTimestamp, query,app } from './firebase.js';
//import { getFirestore, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const storage = getStorage(app);


console.log('This should appear in the console');


async function fetchCoursesAndDisplay() {
  console.log('fetching courses...');
  const coursesCollectionRef = collection(db, 'courses');
  try {
    const coursesSnapshot = await getDocs(coursesCollectionRef);
    if (!coursesSnapshot.empty) {
      const coursesList = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Organize courses by category
      const coursesByCategory = organizeCoursesByCategory(coursesList);
      // Update DOM for each category
      updateDOMWithCourses(coursesByCategory);
    } else {
      console.log('No courses found.');
    }
  } catch (error) {
    console.error("Error fetching courses: ", error);
  }
}

function toggleLock(event, item, courseId) {
  event.stopPropagation();
  event.preventDefault();// Prevent link navigation

  const isLocked = item.getAttribute('data-locked') === 'true';
  item.setAttribute('data-locked', isLocked ? 'false' : 'true');

  const icon = item.querySelector('.lock-icon');
  icon.name = isLocked ? 'lock-open-outline' : 'lock-closed-outline';
  icon.className = isLocked ? 'lock-icon green' : 'lock-icon red';

  const db = firebase.firestore();

  db.collection('courses').doc(courseId).update({ publicado: !isLocked })
      .then(() => console.log(`Course ${isLocked ? 'unlocked' : 'locked'} in Firestore`))
      .catch(error => console.error('Error updating lock state:', error));
}

function createCourseElement(course) {
  const courseItem = document.createElement('a');
  courseItem.className = 'carousel-item';
  courseItem.href = course.hipervinculo;
  courseItem.dataset.id = course.id;
  
  courseItem.dataset.locked = course.publicado ? 'false' : 'true';

  const img = document.createElement('img');
  img.src = course.coursePicture;
  img.alt = course.nombre;

  const description = document.createElement('div');
  description.className = 'carousel-description';

  const h3 = document.createElement('h3');
  h3.textContent = course.nombre;

  const p = document.createElement('p');
  p.textContent = course.descripcion;

  const icon = document.createElement('ion-icon');
  icon.name = course.publicado ? 'lock-open-outline' : 'lock-closed-outline';
  icon.className = course.publicado ? 'lock-icon green' : 'lock-icon red'; // Set color

  icon.name = course.publicado ? 'lock-open-outline' : 'lock-closed-outline';
  icon.className = 'lock-icon';
  // Add event listener if necessary for toggleLock

  icon.addEventListener('click', (event) => toggleLock(event, courseItem, course.id));

  description.appendChild(h3);
  description.appendChild(p);
  description.appendChild(icon);

  courseItem.appendChild(img);
  courseItem.appendChild(description);

  return courseItem;
}


// Organiza los cursos por categoría
function organizeCoursesByCategory(coursesList) {
  return coursesList.reduce((acc, course) => {
    const category = course.categoria; // Make sure this matches your Firestore field
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(course);
    return acc;
  }, {});
}

function updateDOMWithCourses(coursesByCategory) {
  Object.keys(coursesByCategory).forEach(category => {
    const carouselId = `carouselSlide${category}`;
    const carouselElement = document.getElementById(carouselId);

    if (carouselElement) {
      carouselElement.innerHTML = ''; 
      coursesByCategory[category].forEach(course => {
        const courseElement = createCourseElement(course);
        carouselElement.appendChild(courseElement);
      });
      setupCarousel(carouselId, `prevBtn${category}`, `nextBtn${category}`);
    } else {
      console.log(`Carousel element not found for category: ${category}`);
    }
  });
}

//Configuracion de Carusell

function setupCarousel(carouselSlideId, prevBtnId, nextBtnId) {
  const carousel = document.getElementById(carouselSlideId);
  const prevButton = document.getElementById(prevBtnId);
  const nextButton = document.getElementById(nextBtnId);

  if (!carousel || !prevButton || !nextButton) {
    console.error(`Carousel or buttons not found for ${carouselSlideId}`);
    return;
  }

  let index = 0;
  const items = carousel.getElementsByClassName('carousel-item');
  const totalItems = items.length;

  function updateCarousel() {
    const itemWidth = items[0].offsetWidth;
    carousel.style.transform = `translateX(${-itemWidth * index}px)`;
  }

  prevButton.addEventListener('click', () => {
    index = (index > 0) ? index - 1 : totalItems - 1;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    index = (index < totalItems - 1) ? index + 1 : 0;
    updateCarousel();
  });
}
  
document.addEventListener('DOMContentLoaded', fetchCoursesAndDisplay);