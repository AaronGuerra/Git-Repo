
// 1. Referencias a los elementos del HTML
const btn = document.getElementById('btnPersonaje');
const container = document.getElementById('character-container');
const charImg = document.getElementById('char-img');
const charName = document.getElementById('char-name');
const charStatus = document.getElementById('char-status');
const charSpecies = document.getElementById('char-species');

// 2. Función asíncrona para conectar con la API
async function obtenerPersonaje() {
    // Genero un ID aleatorio entre 1 y 826, para hacerlo más entrete (total de personajes en esta API)
    const idAleatorio = Math.floor(Math.random() * 826) + 1;
    const url = `https://rickandmortyapi.com/api/character/${idAleatorio}`;

    try {
        // Hago la petición al servidor
        const respuesta = await fetch(url);
        
        // Si la respuesta no es correcta (ej. error 404), lanza un error
        if (!respuesta.ok) {
            throw new Error('No se pudo conectar con la API');
        }

        // Convierte la respuesta a un objeto de JavaScript (JSON)
        const datos = await respuesta.json();

        // 3. Inserta los datos en el HTML
        charImg.src = datos.image;
        charName.textContent = datos.name;
        charStatus.textContent = datos.status;
        charSpecies.textContent = datos.species;

        // Muestra el contenedor (que inicialmente estaba oculto)
        container.style.display = "block";

        // 4. Guarda el estado en minúsculas para evitar problemas con mayúsculas
        const estado = datos.status.toLowerCase(); 

        // Limpia cualquier clase de estado previa para que no se acumulen al cambiar de personaje
        charStatus.className = ""; 

        // Evalúa el estado y aplica la clase correspondiente
        if (estado === 'alive') {
            charStatus.classList.add('status-alive');
        } else if (estado === 'dead') {
            charStatus.classList.add('status-dead');
        } else {
            charStatus.classList.add('status-unknown'); // Por si es 'unknown' o cualquier otro
        }

        // Finalmente, muestra el texto en el HTML
        charStatus.textContent = datos.status;

    } catch (error) {
        console.error('Hubo un problema:', error);
        alert('Error al cargar los datos. Inténtalo de nuevo.');
    }
}

// 4. Escuchar el click del botón para ejecutar la función
btn.addEventListener('click', obtenerPersonaje);