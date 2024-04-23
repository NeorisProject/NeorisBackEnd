document.addEventListener('DOMContentLoaded', function() {
    restoreLockStates();

    const items = document.querySelectorAll('.carousel-item');
    items.forEach(item => {
        item.addEventListener('click', function(event) {
            checkLock(event, this);
        });
    });
});

function toggleLock(event, icon) {
    event.stopPropagation();
    event.preventDefault(); // Añade esto para prevenir que el enlace se siga
    const item = icon.closest('.carousel-item');
    const itemId = item.getAttribute('data-id');
    const isLocked = item.getAttribute('data-locked') === 'true';

    if (isLocked) {
        icon.name = 'lock-open-outline';
        icon.classList.replace('locked', 'unlocked');
        item.setAttribute('data-locked', 'false');
        localStorage.setItem('locked_' + itemId, 'false');
    } else {
        icon.name = 'lock-closed-outline';
        icon.classList.replace('unlocked', 'locked');
        item.setAttribute('data-locked', 'true');
        localStorage.setItem('locked_' + itemId, 'true');
    }
}


function checkLock(event, item) {
    const isLocked = item.getAttribute('data-locked') === 'true';
    if (isLocked) {
        event.preventDefault();
        item.classList.add('shake'); // Agregar la clase 'shake' para iniciar la animación
        setTimeout(() => item.classList.remove('shake'), 500); // Eliminar la clase después de que la animación haya terminado
    } else {
        // Si el curso no está bloqueado, puedes proceder como de costumbre
        window.location.href = item.getAttribute('href');
    }
}


function restoreLockStates() {
    const items = document.querySelectorAll('.carousel-item');
    items.forEach(item => {
        const itemId = item.getAttribute('data-id');
        const isLocked = localStorage.getItem('locked_' + itemId) === 'true';
        const icon = item.querySelector('.lock-icon');
        if (isLocked) {
            icon.name = 'lock-closed-outline';
            icon.classList.add('locked');
            icon.classList.remove('unlocked');
            item.setAttribute('data-locked', 'true');
        } else {
            icon.name = 'lock-open-outline';
            icon.classList.add('unlocked');
            icon.classList.remove('locked');
            item.setAttribute('data-locked', 'false');
        }
    });
}
