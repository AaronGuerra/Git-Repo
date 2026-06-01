// Catálogo local integrado (Garantiza que la app NUNCA se rompa ni se quede vacía)
const FRASES_RESPALDO = [
    { texto: "La complejidad es tu enemiga. Cualquier tonto puede hacer algo complicado. Lo difícil es hacer algo simple.", autor: "Bill Gates" },
    { texto: "Hablar es barato. Muéstrame el código.", autor: "Linus Torvalds" },
    { texto: "Los programas deben ser escritos para que las personas los lean, y solo para que las máquinas los ejecuten.", autor: "Harold Abelson" },
    { texto: "La mejor forma de predecir el futuro es inventarlo.", autor: "Alan Kay" },
    { texto: "Primero, resuelve el problema. Luego, escribe el código.", autor: "John Johnson" },
    { texto: "Hazlo simple, tan simple como sea posible, pero no más.", autor: "Albert Einstein" },
    { texto: "El único modo de hacer un gran trabajo es amar lo que haces.", autor: "Steve Jobs" },
    { texto: "Tu pensamiento es tu frontera.", autor: "Ada Lovelace" },
    { texto: "No temo a los ordenadores. Lo que temo es la falta de ellos.", autor: "Isaac Asimov" },
    { texto: "La tecnología es tecnología solo para las personas que nacieron antes de que se inventara.", autor: "Alan Kay" }
];

// API alternativa de respaldo en español (alojada en servidores CDN ultra estables)
const URL_API_ESPANOL = 'https://raw.githubusercontent.com/fisenko/facts-as-a-service/master/src/facts/es.json';

// Variables globales para el control interno
let bancoDeFrases = [...FRASES_RESPALDO]; // Iniciamos con las frases integradas por seguridad
let ultimoIndice = -1;

// Referencias del HTML
const quoteAuthorH3 = document.getElementById('quote-author');
const quoteTextP = document.querySelector('.quote-text');
const btnNewQuote = document.getElementById('new-quote-btn');
const quoteImg = document.getElementById('quote-img');

// FUNCIÓN AUXILIAR: Conectar con Wikipedia para buscar la foto
async function obtenerFotoWikipedia(nombreAutor) {
    if (!nombreAutor || nombreAutor === "Anónimo" || nombreAutor.toLowerCase() === "proverbio") return null;
    
    const nombreLimpio = nombreAutor.split('(')[0].trim();
    const nombreFormateado = nombreLimpio.replace(/ /g, '_');
    const urlWiki = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nombreFormateado)}`;
    
    try {
        const respuesta = await fetch(urlWiki);
        if (!respuesta.ok) return null; 
        const datos = await respuesta.json();
        return datos.original ? datos.original.source : (datos.thumbnail ? datos.thumbnail.source : null);
    } catch (error) {
        console.error("Error silencioso en Wikipedia API:", error);
        return null;
    }
}

// FUNCIÓN: Intenta expandir el catálogo descargando más frases de internet
async function cargarFrasesExternas() {
    try {
        const respuesta = await fetch(URL_API_ESPANOL);
        if (!respuesta.ok) throw new Error('Servidor externo no disponible');
        
        const datos = await respuesta.json();
        
        // Formateamos y limpiamos las nuevas frases que llegaron de internet
        const frasesNuevas = datos.map(item => {
            if (item.includes('—')) {
                const partes = item.split('—');
                return { texto: partes[0].trim(), autor: partes[1].trim() };
            }
            if (item.includes('-')) {
                const partes = item.split('-');
                return { texto: partes[0].trim(), autor: partes[1].trim() };
            }
            return { texto: item, autor: "Anónimo" };
        });

        // Combinamos las frases que ya teníamos con las nuevas de internet
        bancoDeFrases = [...FRASES_RESPALDO, ...frasesNuevas];
        console.log(`¡Conexión exitosa! Catálogo expandido a ${bancoDeFrases.length} frases.`);

    } catch (error) {
        // Si hay un bloqueo de red o error de servidor, se ejecuta este bloque de forma SILENCIOSA
        console.warn('Servidor de frases bloqueado por tu red/navegador. Usando catálogo integrado seguro.');
    } finally {
        // Sin importar si la API externa funcionó o no, mostramos la primera frase en pantalla inmediatamente
        await mostrarSiguienteFrase();
    }
}

// FUNCIÓN PRINCIPAL: Renderiza la frase en pantalla y busca al autor
async function mostrarSiguienteFrase() {
    try {
        // Bloqueamos interfaz para evitar clics dobles mientras procesa Wikipedia
        btnNewQuote.disabled = true;
        quoteImg.style.display = 'none';
        quoteAuthorH3.textContent = '';
        quoteTextP.textContent = '"Buscando retrato del autor..."';

        // Seleccionar una frase al azar del banco (sea el integrado o el expandido)
        let indiceAleatorio;
        do {
            indiceAleatorio = Math.floor(Math.random() * bancoDeFrases.length);
        } while (indiceAleatorio === ultimoIndice && bancoDeFrases.length > 1);
        
        ultimoIndice = indiceAleatorio;
        const fraseSeleccionada = bancoDeFrases[indiceAleatorio];

        // Buscar foto en Wikipedia
        const urlFoto = await obtenerFotoWikipedia(fraseSeleccionada.autor);

        // Inyectar datos directamente en el DOM
        quoteAuthorH3.textContent = fraseSeleccionada.autor;
        quoteTextP.textContent = `"${fraseSeleccionada.texto}"`;

        if (urlFoto) {
            quoteImg.src = urlFoto;
            quoteImg.onload = () => quoteImg.style.display = 'block';
        } else {
            // Silueta por defecto
            quoteImg.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
            quoteImg.onload = () => quoteImg.style.display = 'block';
        }

    } catch (error) {
        console.error('Error al mostrar la frase:', error);
        quoteTextP.textContent = '"Ocurrió un error al renderizar la frase."';
    } finally {
        // Liberamos el botón
        btnNewQuote.disabled = false;
    }
}

// Eventos de inicio y acción
document.addEventListener('DOMContentLoaded', cargarFrasesExternas);
btnNewQuote.addEventListener('click', mostrarSiguienteFrase);