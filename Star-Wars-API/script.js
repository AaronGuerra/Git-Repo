

function convertirARomanos(num) {
    // Crea una lista de equivalencias desde el número más grande al más chico
    const valores = [
        { valor: 1000, simbolo: 'M' }, { valor: 900, simbolo: 'CM' },
        { valor: 500, simbolo: 'D' },  { valor: 400, simbolo: 'CD' },
        { valor: 100, simbolo: 'C' },  { valor: 90, simbolo: 'XC' },
        { valor: 50, simbolo: 'L' },   { valor: 40, simbolo: 'XL' },
        { valor: 10, simbolo: 'X' },   { valor: 9, simbolo: 'IX' },
        { valor: 5, simbolo: 'V' },    { valor: 4, simbolo: 'IV' },
        { valor: 1, simbolo: 'I' }
    ]
    let resultado = '' // Aquí se irá armando el texto romano (empieza vacío)
    
    // Revisa uno por uno los números de la lista de arriba
    for (const item of valores) {
        // Mientras el número que yo quiero convertir sea mayor o igual al valor de la lista...
        while (num >= item.valor) {
            resultado += item.simbolo // Agrega la letra romana al resultado
            num -= item.valor // Le resta ese valor al número para seguir procesando el resto
        }
    }
    return resultado // Devuelve el número ya convertido en texto (ej: "III")
}

// Función para reordenar fecha del formato gringo (YYYY-MM-DD) al formato nuestro (DD-MM-YYYY)
function formatearFecha(fecha) {
    // Rompe el texto de la fecha cada vez que encuentra un guion '-' y guarda los tres pedazos en variables
    const [year, month, day] = fecha.split('-')
    // Devuelve los pedazos ordenados al revés y separados por guiones
    return `${day}-${month}-${year}`
}

function mostrarDatos(title, episode_id, director, release_date) {
    // Busca en el HTML la caja gris con el ID 'posts'
    const contenedorPost = document.querySelector('#posts')
    
    // Busca si ya he creado una lista ('ul'). Si no existe, crea una nueva en la memoria del navegador
    const lista = document.querySelector('#lista-peliculas') || document.createElement('ul')

    // Si la lista es nueva y no tiene nombre (ID)...
    if (!lista.id) {
        lista.id = 'lista-peliculas' // Le pone el nombre 'lista-peliculas'
        contenedorPost.appendChild(lista) // Mete la lista dentro de la caja gris
    }

    // Crea un renglón de lista ('li') totalmente vacío
    const itemLista = document.createElement('li')

    // Usa las funciones de arriba para transformar el número del episodio y la fecha
    const episodioRomano = convertirARomanos(episode_id)
    const fechaFormateada = formatearFecha(release_date)

    // Escribe el texto final que llevará el renglón con los datos de la película
    itemLista.textContent = `Episodio ${episodioRomano}: ${title} 
        | Director: ${director} 
        | Estreno: ${fechaFormateada}`

    // Agrega el renglón recién creado dentro de la lista
    lista.appendChild(itemLista)
}


// Me conecta a este enlace de internet que tiene la información (JSON) de Star Wars
fetch("https://swapi.info/api/films")
  // Cuando internet responda, transforma esa respuesta en un formato que JavaScript entienda (JSON)
  .then(response => response.json())
  // Ahora tengo los datos listos...
  .then(datos => {
    // Ordena las películas de menor a mayor según el número de episodio (a menos b)
    datos.sort((a, b) => a.episode_id - b.episode_id)

    // Por cada película que encuentro en los datos...
    datos.forEach(dato => {
        // Llama a la función 'mostrarDatos' pasándole el título, episodio, director y fecha de esa película
        mostrarDatos(dato.title, dato.episode_id, dato.director, dato.release_date)
    });
  })
  // Si el internet falla o el enlace no funciona, muestra el error en la consola del navegador para revisar qué pasó
  .catch(error => console.log(error))



/* function mostrarDatos(title, episode_id, director){
    const contenedorPost = document.querySelector('#posts')
    const desordenadaLista = document.createElement('ul')
    const itemLista = document.createElement('li')
    itemLista.textContent = title, episode_id, director
    desordenadaLista.appendChild(itemLista)
    contenedorPost.appendChild(desordenadaLista)
}


fetch("https://swapi.info/api/films")
  .then(response => response.json())
  .then(datos => {
    datos.forEach(dato => {
        mostrarDatos(dato.title)
        mostrarDatos(dato.episode_id)
        mostrarDatos(dato.director)
    });
  }) 
  .catch (error => console.log(error)) */