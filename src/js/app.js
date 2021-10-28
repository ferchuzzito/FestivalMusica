document.addEventListener('DOMContentLoaded', function () {
    iniciarAPP();
});

function iniciarAPP() {
    crearGaleria();
    scrollNav();
    navegacionFija();
}

function crearGaleria() {
    const galeria = document.querySelector('.galeria-imagenes');

    for (let i = 1; i <= 12; i++) {
        const imagen = document.createElement('picture');
        const sourceAvif = document.createElement('source');
        sourceAvif.srcset = `build/assets/img/thumb/${i}.avif`;
        sourceAvif.type = 'image/avif';
        const sourceWebp = document.createElement('source');
        sourceWebp.srcset = `build/assets/img/thumb/${i}.webp`;
        sourceWebp.type = 'image/webp';
        const sourceimg = document.createElement('img');
        sourceimg.src = 'build/assets/img/thumb/${i}.img';
        sourceimg.alt = 'Imagen Galeria';
        imagen.appendChild(sourceAvif);
        imagen.appendChild(sourceWebp);
        imagen.appendChild(sourceimg);

        imagen.dataset.imagenId = i;
        // Añadir la función de mostrarImagen
        imagen.onclick = function () {
            mostrarImagen(i);
        };
        galeria.appendChild(imagen);
    }
}

function mostrarImagen(id) {
    // Generar la imagen
    const imagen = document.createElement('picture');
    const sourceAvif = document.createElement('source');
    sourceAvif.srcset = `build/assets/img/grande/${id}.avif`;
    sourceAvif.type = 'image/avif';
    const sourceWebp = document.createElement('source');
    sourceWebp.srcset = `build/assets/img/grande/${id}.webp`;
    sourceWebp.type = 'image/webp';
    const sourceimg = document.createElement('img');
    sourceimg.src = 'build/assets/img/grande/${id}.img';
    sourceimg.alt = 'Imagen Galeria';
    imagen.appendChild(sourceAvif);
    imagen.appendChild(sourceWebp);
    imagen.appendChild(sourceimg);

    const overlay = document.createElement('DIV');
    overlay.appendChild(imagen);
    overlay.classList.add('overlay');

    // Cuando se da click, cerrar la imagen
    overlay.onclick = function () {
        const body = document.querySelector('body');
        body.classList.remove('fijar-body');
        overlay.remove();
    }

    // Boton para cerrar la imagen
    const cerrarImagen = document.createElement('P');
    cerrarImagen.textContent = 'X';
    cerrarImagen.classList.add('btn-cerrar');

    // Cuando se presiona, se cierra la imagen
    cerrarImagen.onclick = function () {
        const body = document.querySelector('body');
        body.classList.remove('fijar-body');
        overlay.remove();
    }

    overlay.appendChild(cerrarImagen)

    // Mostrar en el HTML
    const body = document.querySelector('body');
    body.appendChild(overlay);
    body.classList.add('fijar-body');
}

function navegacionFija() {

    const barra = document.querySelector('.header');

    // Registrar el Intersection Observer
    const observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            barra.classList.remove('fijo');
        } else {
            barra.classList.add('fijo');
        }
    });

    // Elemento a observar
    observer.observe(document.querySelector('.sobre-festival'));
}

function scrollNav() {
    const enlaces = document.querySelectorAll('.navegacion-principal a');

    enlaces.forEach(function (enlace) {
        enlace.addEventListener('click', function (e) {
            e.preventDefault();
            const seccion = document.querySelector(e.target.attributes.href.value);

            seccion.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}