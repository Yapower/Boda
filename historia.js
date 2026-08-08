// Lightbox para la página de historia
// Al hacer clic en cualquier foto, se muestra ampliada.

document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const cerrar = document.querySelector('.lightbox-cerrar');

    // Todas las fotos con clase .foto
    const fotos = document.querySelectorAll('.foto');
    let fotoActual = 0;
    const fotosArray = Array.from(fotos);

function abrirFoto(index) {
        fotoActual = index;
        const foto = fotosArray[index];
        lightboxImg.src = foto.src;
        lightboxCaption.textContent = ''; // No mostrar el nombre de la foto
        lightbox.style.display = 'flex';
    }

    function cerrarLightbox() {
        lightbox.style.display = 'none';
    }

    // Clic en cada foto
    fotos.forEach((foto, i) => {
        foto.addEventListener('click', (e) => {
            e.preventDefault();
            abrirFoto(i);
        });
    });

    // Cerrar
    cerrar.addEventListener('click', cerrarLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) cerrarLightbox();
    });

// Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') cerrarLightbox();
            if (e.key === 'ArrowRight') {
                fotoActual = (fotoActual + 1) % fotosArray.length;
                abrirFoto(fotoActual);
            }
            if (e.key === 'ArrowLeft') {
                fotoActual = (fotoActual - 1 + fotosArray.length) % fotosArray.length;
                abrirFoto(fotoActual);
            }
        }
    });
});

// ==========================================
// CARRUSELES (slides automáticos)
// ==========================================
function inicializarCarruseles() {
    const carruseles = document.querySelectorAll('.carrusel');

    carruseles.forEach((carrusel) => {
        const track = carrusel.querySelector('.carrusel-track');
        const slides = carrusel.querySelectorAll('.carrusel-slide');
        // Tipo de carrusel: 'slide' (horizontal) o 'fade' (apilado)
        const tipo = carrusel.dataset.tipo || 'slide';

        if (!track || slides.length === 0) return;

        let indice = 0;
        const total = slides.length;
        let timer = null;

        // Para fade, la primera foto debe quedar visible al inicio
        if (tipo === 'fade') {
            slides[0].classList.add('activo');
        }

        function actualizar() {
            if (tipo === 'fade') {
                // Solo la foto activa es visible (apiladas con opacidad)
                slides.forEach((slide, i) => {
                    slide.classList.toggle('activo', i === indice);
                });
            } else {
                // Se desliza horizontalmente
                track.style.transform = `translateX(-${indice * 100}%)`;
            }
        }

        function irA(n) {
            indice = (n + total) % total;
            actualizar();
        }

        function siguiente() {
            irA(indice + 1);
        }

        // Autoplay siempre activo para ambos diseños
        const intervalo = parseInt(carrusel.dataset.interval) || 3000;

        function iniciarAutoplay() {
            timer = setInterval(siguiente, intervalo);
        }

        function detenerAutoplay() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        function reiniciarAutoplay() {
            detenerAutoplay();
            iniciarAutoplay();
        }

        // Pausar al pasar el mouse, reanudar al salir
        carrusel.addEventListener('mouseenter', detenerAutoplay);
        carrusel.addEventListener('mouseleave', iniciarAutoplay);

        // Toque en móvil (pausa temporal)
        carrusel.addEventListener('touchstart', detenerAutoplay, { passive: true });
        carrusel.addEventListener('touchend', iniciarAutoplay);

        actualizar();
        iniciarAutoplay();
    });
}

// Inicializar carruseles cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarCarruseles);
} else {
    inicializarCarruseles();
}

// ==========================================
// GALERÍA APILADA (efecto polaroid en abanico)
// ==========================================
function inicializarGaleriaStack() {
    const stacks = document.querySelectorAll('.galeria-stack');

    stacks.forEach((stack) => {
        const fotos = stack.querySelectorAll('.stack-foto');
        if (fotos.length === 0) return;

        // Marca la primera foto como la activa (al frente)
        fotos[0].classList.add('activa');

        let timer = null;
        const intervalo = parseInt(stack.dataset.interval) || 3000;

        // Rota la baraja: mueve la foto de arriba hacia abajo
        function siguiente() {
            const primera = stack.querySelector('.stack-foto');
            if (!primera) return;
            primera.classList.remove('activa');
            stack.appendChild(primera);
            // La nueva primera pasa a ser la activa
            stack.querySelector('.stack-foto').classList.add('activa');
        }

        function iniciar() {
            timer = setInterval(siguiente, intervalo);
        }

        function detener() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        // Pausa al pasar el mouse y al tocar en móvil
        stack.addEventListener('mouseenter', detener);
        stack.addEventListener('mouseleave', iniciar);
        stack.addEventListener('touchstart', detener, { passive: true });
        stack.addEventListener('touchend', iniciar);

        iniciar();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarGaleriaStack);
} else {
    inicializarGaleriaStack();
}

// ==========================================
// GALERÍA ABANICO (efecto Uiverse, cambia de adelante hacia atrás)
// ==========================================
function inicializarGaleriaFan() {
    const abanicos = document.querySelectorAll('.galeria-fan');

    abanicos.forEach((abanico) => {
        const stack = abanico.querySelector('.fan-stack');
        const fotos = abanico.querySelectorAll('.fan-foto');
        if (!stack || fotos.length === 0) return;

        let timer = null;
        const intervalo = parseInt(abanico.dataset.interval) || 3000;

        // Rota la baraja: la foto de adelante pasa al fondo
        function siguiente() {
            const primera = stack.querySelector('.fan-foto');
            if (!primera) return;
            stack.appendChild(primera);
        }

        function iniciar() {
            timer = setInterval(siguiente, intervalo);
        }

        function detener() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        // Pausa al pasar el mouse y al tocar en móvil
        abanico.addEventListener('mouseenter', detener);
        abanico.addEventListener('mouseleave', iniciar);
        abanico.addEventListener('touchstart', detener, { passive: true });
        abanico.addEventListener('touchend', iniciar);

        iniciar();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarGaleriaFan);
} else {
    inicializarGaleriaFan();
}

