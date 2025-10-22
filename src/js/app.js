// --- CLASE PARA MANEJAR LA GALERÍA Y EL MODAL ---
class Galeria {
    constructor(selectorGaleria, cantidadImagenes) {
        this.galeria = document.querySelector(selectorGaleria);
        this.CANTIDAD_IMAGENES = cantidadImagenes;
        if (this.galeria) {
            this.crearGaleria();
        }
    }

    // Método para crear el elemento <picture> de forma segura
    crearPictureElement(path, index) {
        const imagen = document.createElement('PICTURE');
        imagen.innerHTML = `
            <source srcset="build/img/gallery/${path}/${index}.avif" type="image/avif">
            <source srcset="build/img/gallery/${path}/${index}.webp" type="image/webp">
            <img loading="lazy" width="200" height="300" src="build/img/gallery/${path}/${index}.jpg" alt="Imagen galeria ${index}">
        `;
        return imagen;
    }

    // Método principal para construir la galería de miniaturas
    crearGaleria() {
        for (let i = 1; i <= this.CANTIDAD_IMAGENES; i++) {
            const imagen = this.crearPictureElement('thumb', i);
            imagen.classList.add('galeria__imagen'); // Clase opcional para estilos

            // Asignar el event handler para mostrar la imagen completa
            imagen.addEventListener('click', () => this.mostrarImagen(i));
            
            this.galeria.appendChild(imagen);
        }
    }

    // Método para crear y mostrar el modal
    mostrarImagen(i) {
        const imagenCompleta = this.crearPictureElement('full', i);
        
        // 1. Generar Modal
        const modal = document.createElement('DIV');
        modal.classList.add('overlay');
        modal.addEventListener('click', this.cerrarModal);

        // 2. Botón cerrar modal
        const cerrarModalBtn = document.createElement('BUTTON');
        cerrarModalBtn.textContent = 'X';
        cerrarModalBtn.classList.add('btn-cerrar');
        cerrarModalBtn.addEventListener('click', this.cerrarModal);

        modal.append(imagenCompleta, cerrarModalBtn);

        // 3. Agregar al HTML
        const body = document.body;
        body.classList.add('overflow-hidden');
        body.appendChild(modal);
    }

    // Método para cerrar el modal (estático para que mantenga el contexto de la llamada)
    cerrarModal() {
        // Usar 'this' para acceder al evento o enlazar la clase no funciona, 
        // por lo que se accede al elemento del DOM.
        const modal = document.querySelector('.overlay');
        if (!modal) return;

        modal.classList.add('fade-out');

        setTimeout(() => {
            modal.remove();
            document.body.classList.remove('overflow-hidden');
        }, 500);
    }
}

// --- FUNCIONES DE NAVEGACIÓN Y UTILIDADES ---

/**
 * Función para fijar la navegación usando Intersection Observer (recomendado).
 * Corrige el "salto" o "desaparición" del header al manejar la visibilidad del elemento.
 */
function navegacionFija() {
    const header = document.querySelector('.header');
    const sobreFestival = document.querySelector('.sobre-festival');
    
    if (!header || !sobreFestival) return;

    // Opciones del observador: observa la posición del elemento 'sobreFestival'
    const observerOptions = {
        // Se activa cuando 0 píxeles del elemento observado están visibles (sale del viewport)
        threshold: 0, 
        // El rootMargin de -1px asegura que el observer se dispara justo
        // cuando el elemento sale o toca la parte superior de la pantalla.
        rootMargin: '0px 0px 0px 0px' 
    };

    const observer = new IntersectionObserver(entries => {
        // 'isIntersecting' es true si el elemento todavía está visible (antes de salir)
        if (entries[0].isIntersecting) {
            // El elemento está visible: la navegación NO debe estar fija.
            header.classList.remove('fijo');
        } else {
            // El elemento ha salido de la vista: la navegación DEBE estar fija.
            // Esta activación no causa un salto, ya que ocurre cuando el elemento
            // de referencia ya ha pasado el límite superior.
            header.classList.add('fijo');
        }
    }, observerOptions);

    // Comenzar a observar el elemento '.sobre-festival'
    observer.observe(sobreFestival);
}

// Nota: La clase 'fijo' en CSS debe contener:
// .header.fijo {
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     z-index: 1000;
// }

/**
 * Resalta el enlace de navegación activo usando Intersection Observer.
 */
function resaltarEnlace() {
    const navLinks = document.querySelectorAll('.navegacion-principal a');

    // Función para limpiar la clase 'active' de todos los enlaces
    const limpiarClaseActiva = () => navLinks.forEach(link => link.classList.remove('active'));

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Obtener el ID de la sección que está intersectando
                const actualId = entry.target.id;
                
                limpiarClaseActiva();
                
                // Buscar el enlace que apunta a este ID y activarlo
                const enlace = document.querySelector(`.navegacion-principal a[href="#${actualId}"]`);
                enlace?.classList.add('active');
            }
        });
    }, {
        // Se activa cuando la sección entra o sale del 25% superior de la vista (para mejor detección)
        rootMargin: '-25% 0px -75% 0px', 
        threshold: 0 // Ajustado a 0, pero el rootMargin es el importante
    });

    // Observar cada sección
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Implementa el desplazamiento suave al hacer clic en los enlaces de navegación.
 */
function scrollNav() {
    document.querySelectorAll('.navegacion-principal a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const sectionScroll = e.currentTarget.getAttribute('href');
            document.querySelector(sectionScroll)?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// --- INICIALIZACIÓN DE LA APLICACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar funciones de navegación y utilidades
    navegacionFija();
    resaltarEnlace();
    scrollNav();

    // Inicializar la galería usando la nueva clase
    new Galeria('.galeria-imagenes', 16); 
});
