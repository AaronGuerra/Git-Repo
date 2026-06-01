

// 1. Empeieza con el usuario número 1
let usuarioActual = 1; 
const TOTAL_USUARIOS = 10; // La API de JSONPlaceholder solo tiene 10 usuarios

// 2. Obtiene las referencias de los elementos del HTML
const nameSpan = document.getElementById('user-name');
const emailSpan = document.getElementById('user-email');
const phoneSpan = document.getElementById('user-phone');

const nextBtn = document.getElementById('next-btn');
const randomBtn = document.getElementById('random-btn');


// 3. Función principal para hacer el GET (ahora recibe un ID por parámetro)
async function cargarUsuario(id) {
    // Construye la URL dinámicamente usando Template Literals (comillas invertidas ``)
    const url = `https://jsonplaceholder.typicode.com/users/${id}`;
    
    // Pone un texto temporal mientras carga la nueva petición
    nameSpan.textContent = "Cargando...";

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error('Usuario no encontrado');
        

        // Convierte la respuesta cruda en un objeto manipulable
        const usuario = await respuesta.json();

        // Inyectamos los datos en el HTML
        nameSpan.textContent = usuario.name;
        emailSpan.textContent = usuario.email;
        phoneSpan.textContent = usuario.phone;

    } catch (error) {
        console.error('Error:', error);
        nameSpan.textContent = 'Error al cargar';
        emailSpan.textContent = 'No disponible';
        phoneSpan.textContent = 'No disponible';
    }
}

// ==========================================
// 4. LÓGICA DE LOS BOTONES
// ==========================================

// BOTÓN SIGUIENTE
nextBtn.addEventListener('click', () => {
    usuarioActual++; // Suma 1 al ID actual
    
    // Si pasa del usuario 10, vuelve al 1
    if (usuarioActual > TOTAL_USUARIOS) {
        usuarioActual = 1;
    }
    
    // Llama a la función con el nuevo ID
    cargarUsuario(usuarioActual);
});

// BOTÓN ALEATORIO
randomBtn.addEventListener('click', () => {
    // Genera un número entero aleatorio entre 1 y 10
    const idAleatorio = Math.floor(Math.random() * TOTAL_USUARIOS) + 1;
    
    // Actuasliza la variable global para que el botón "Siguiente" sepa dónde quedó
    usuarioActual = idAleatorio; 
    
    cargarUsuario(usuarioActual);
});



// 3. Crea la función asíncrona encargada de hacer el GET
// async function cargarUsuario(id) {
//     try {
//         // fetch() por defecto hace una petición de tipo GET
//         const respuesta = await fetch(url);

//         if (!respuesta.ok) {
//             throw new Error('Error al obtener los datos del usuario');
//         }

//         // Convierte la respuesta cruda en un objeto manipulable
//         const usuario = await respuesta.json();

//         // 4. Inyecta los datos específicos que pide el ejercicio
//         nameSpan.textContent = usuario.name;
//         emailSpan.textContent = usuario.email;
//         phoneSpan.textContent = usuario.phone;

//     } catch (error) {
//         console.error('Error:', error);
//         nameSpan.textContent = 'Error al cargar';
//         emailSpan.textContent = 'No disponible';
//         phoneSpan.textContent = 'No disponible';
//     }
// }

// 5. ESCUCHAR LA CARGA DE LA PÁGINA
// Este evento se dispara automáticamente cuando todo el HTML ha sido procesado
// 5. Carga inicial apenas abre la página (carga el usuario 1)
// 5. Carga inicial apenas abre la página (carga el usuario 1)
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuario(usuarioActual);
});