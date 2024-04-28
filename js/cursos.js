//import { collection } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"
import { ref , uploadBytes, getDownloadURL, getStorage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";
import { db, getDocs, collection, serverTimestamp, query,app } from './firebase.js';
//import { getFirestore, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const storage = getStorage(app);


console.log('This should appear in the console');

/*
const storageRef = ref(storage, 'courses_images/' + file.name);
uploadBytes(storageRef, file).then((snapshot) => {
  getDownloadURL(snapshot.ref).then((downloadURL) => {
    // Guarda esta URL en Firestore asociada con el curso
    console.log('File available at', downloadURL);
  });
});*/
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

function createCourseElement(course) {
  const courseItem = document.createElement('a');
  courseItem.className = 'carousel-item';
  courseItem.href = course.hipervinculo;
  courseItem.dataset.id = course.id;
  courseItem.dataset.locked = 'false'; // You can modify this as necessary

  const img = document.createElement('img');
  img.src = course.coursePicture;
  img.alt = course.nombre;

  const carouselDescription = document.createElement('div');
  carouselDescription.className = 'carousel-description';

  const h3 = document.createElement('h3');
  h3.textContent = course.nombre;

  const p = document.createElement('p');
  p.textContent = course.descripcion;

  const icon = document.createElement('ion-icon');
  icon.name = 'lock-open-outline';
  icon.className = 'lock-icon';
  // Add event listener if necessary for toggleLock

  carouselDescription.appendChild(h3);
  carouselDescription.appendChild(p);
  carouselDescription.appendChild(icon);

  courseItem.appendChild(img);
  courseItem.appendChild(carouselDescription);

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
    } else {
      console.log(`Carousel element not found for category: ${category}`);
    }
  });
}
/*
//Configuracion de Carusell
function setupCarousel(carouselSlideId, prevBtnId, nextBtnId) {
    const imageWrapper = document.querySelector(`#${carouselSlideId}`);
    let imageItems = imageWrapper.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    const delay = 2000;
    const perView = 3;
  
    for (let i = 0; i < perView; i++) {
      const clone = imageItems[i].cloneNode(true);
      imageWrapper.appendChild(clone);
    }
  
    const itemWidth = imageItems[0].offsetWidth + parseInt(getComputedStyle(imageItems[0]).marginRight);
  
    function updateCarousel() {
      imageWrapper.style.transition = 'transform 0.3s ease-out';
      imageWrapper.style.transform = `translateX(${-itemWidth * currentIndex}px)`;
    }
  
    imageWrapper.addEventListener('transitionend', () => {
      imageItems = imageWrapper.querySelectorAll('.carousel-item');
      if (currentIndex >= imageItems.length - perView) {
        imageWrapper.style.transition = 'none';
        currentIndex = 0;
        imageWrapper.style.transform = `translateX(${0}px)`;
      }
    });
  
    let autoScroll = setInterval(() => {
      currentIndex++;
      updateCarousel();
    }, delay);
  
    imageWrapper.addEventListener('mouseenter', () => clearInterval(autoScroll));
    imageWrapper.addEventListener('mouseleave', () => autoScroll = setInterval(() => {
      currentIndex++;
      updateCarousel();
    }, delay));
  
    document.getElementById(prevBtnId).addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + imageItems.length) % imageItems.length;
      updateCarousel();
    });
  
    document.getElementById(nextBtnId).addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % imageItems.length;
      updateCarousel();
    });
  }
  
  // Setup the first carousel
  setupCarousel('carouselSlide', 'prevBtn', 'nextBtn');
  // Setup the second carousel
  setupCarousel('carouselSlide2', 'prevBtn2', 'nextBtn2');
  // Setup the third carousel
  setupCarousel('carouselSlide3', 'prevBtn3', 'nextBtn3');
*/
  fetchCoursesAndDisplay();