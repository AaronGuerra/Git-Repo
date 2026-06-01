const API_BASE_URL = "https://rickandmortyapi.com/api/character";
const TOTAL_PERSONAJES = 826; 

let bootstrapModal;

document.addEventListener("DOMContentLoaded", () => {
    bootstrapModal = new bootstrap.Modal(document.getElementById('modalDetalles'));
    
    // Configurar evento Buscar
    document.getElementById('btn-buscar').addEventListener('click', () => {
        const termino = document.getElementById('input-busqueda').value.trim();
        if (termino !== "") {
            obtenerPersonajes(`?name=${encodeURIComponent(termino)}`);
        } else {
            mostrarError("Por favor, escribe un nombre para iniciar la búsqueda.");
        }
    });

    // Configurar evento Aleatorio
    document.getElementById('btn-todos').addEventListener('click', () => {
        document.getElementById('input-busqueda').value = "";
        obtenerPersonajeAleatorio();
    });

    // ADAPTADO: Escuchador para el botón limpiar nativo del HTML
    document.getElementById('btn-limpiar').addEventListener('click', () => {
        document.getElementById('input-busqueda').value = "";
        mostrarMensajeInicio();
    });

    mostrarMensajeInicio();
});

function mostrarMensajeInicio() {
    const contenedor = document.getElementById('contenedor-tarjetas');
    contenedor.innerHTML = `
        <div class="text-center w-100 my-5 text-muted">
            <p class="fs-5 fst-italic">Archivo interdimensional listo.</p>
            <p class="small text-secondary">Escribe en el buscador o genera un espécimen aleatorio.</p>
        </div>
    `;
}

async function obtenerPersonajes(queryParams) {
    limpiarHTML();
    const contenedor = document.getElementById('contenedor-tarjetas');
    contenedor.innerHTML = "<p class='text-center w-100 text-muted fst-italic'>Accediendo al servidor de la Ciudadela...</p>";

    try {
        const respuesta = await fetch(`${API_BASE_URL}${queryParams}`);
        if (!respuesta.ok) throw new Error("No se encontraron coincidencias.");

        const datos = await respuesta.json();
        limpiarHTML();

        datos.results.forEach(personaje => {
            crearTarjeta(personaje);
        });
    } catch (error) {
        mostrarError(error.message);
    }
}

async function obtenerPersonajeAleatorio() {
    const idAleatorio = Math.floor(Math.random() * TOTAL_PERSONAJES) + 1;

    try {
        const respuesta = await fetch(`${API_BASE_URL}/${idAleatorio}`);
        if (!respuesta.ok) throw new Error("Error al obtener el espécimen.");

        const personaje = await respuesta.json();
        verDetallesPersonaje(personaje, true);
    } catch (error) {
        alert("No se pudo conectar con la base de datos aleatoria.");
    }
}

function crearTarjeta(personaje) {
    const contenedor = document.getElementById('contenedor-tarjetas');
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta');

    let claseEstado = "unknown";
    if (personaje.status === "Alive") claseEstado = "vivo";
    if (personaje.status === "Dead") claseEstado = "muerto";

    const estadoTraducido = personaje.status === "Alive" ? "vivo" : personaje.status === "Dead" ? "muerto" : "Desconocido";
    const imagenFallback = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400";

    tarjeta.innerHTML = `
        <img src="${personaje.image}" alt="${personaje.name}" class="imagen-personaje" onerror="this.onerror=null; this.src='${imagenFallback}';">
        <div class="contenido-tarjeta">
            <div>
                <h3>${personaje.name}</h3>
                <p><strong>Especie:</strong> ${personaje.species}</p>
                <p><strong>Género:</strong> ${personaje.gender === 'Male' ? 'Masculino' : personaje.gender === 'Female' ? 'Femenino' : 'Desconocido'}</p>
            </div>
            <div>
                <span class="badge-ui ${claseEstado}">${estadoTraducido}</span>
                <button class="btn-detalles">Ver detalles</button>
            </div>
        </div>
    `;

    tarjeta.querySelector('.btn-detalles').addEventListener('click', () => {
        verDetallesPersonaje(personaje, false);
    });

    contenedor.appendChild(tarjeta);
}

function limpiarHTML() {
    document.getElementById('contenedor-tarjetas').innerHTML = "";
}

// ADAPTADO: Limpieza de HTML inline para delegar completamente al CSS
function mostrarError(mensaje) {
    limpiarHTML();
    const contenedor = document.getElementById('contenedor-tarjetas');
    
    const err = document.createElement('p');
    err.className = "text-center w-100 texto-error-critico"; // Clase asignada desde el archivo style.css
    err.textContent = mensaje;
    
    contenedor.appendChild(err);
}

function verDetallesPersonaje(personaje, incluirImagen = false) {
    document.getElementById('modal-titulo').textContent = personaje.name;

    // --- NUEVO: Lógica de Estado Adaptada (Igual a tus tarjetas) ---
    let claseEstado = "unknown";
    if (personaje.status === "Alive") claseEstado = "vivo";
    if (personaje.status === "Dead") claseEstado = "muerto";

    const estadoTraducido = personaje.status === "Alive" ? "vivo" : personaje.status === "Dead" ? "muerto" : "Desconocido";
    // -------------------------------------------------------------

    const numerosEpisodios = personaje.episode.map(url => {
        const partes = url.split('/');
        return partes[partes.length - 1];
    });

    const listaHtml = numerosEpisodios.map(num => `<span class="badge bg-dark m-1 text-info">Capítulo ${num}</span>`).join('');

    const bloqueImagen = incluirImagen 
        ? `<div class="col-md-5 text-center mb-3 mb-md-0">
                <img src="${personaje.image}" alt="${personaje.name}" class="imagen-modal-escala">
           </div>`
        : '';

    const claseContenedorDatos = incluirImagen ? 'col-md-7' : 'col-12';

    document.getElementById('modal-cuerpo').innerHTML = `
        <div class="row align-items-center">
            ${bloqueImagen}
            <div class="${claseContenedorDatos}">
                <!-- NUEVO: Fila de Estado agregada aquí -->
                <p class="mb-2"><strong>Estado:</strong> <span class="badge-ui ${claseEstado}">${estadoTraducido}</span></p>
                
                <p class="mb-2"><strong>Origen del personaje:</strong> ${personaje.origin.name}</p>
                <p class="mb-3"><strong>Ubicación actual:</strong> ${personaje.location.name}</p>
              
                <h6 class="text-info mt-3 mb-2">Lista de episodios donde aparece:</h6>
                <div class="lista-episodios-scroll">
                    ${listaHtml || '<p class="small text-muted">Ninguno registrado.</p>'}
                </div>
            </div>
        </div>
    `;
    
    bootstrapModal.show();
}