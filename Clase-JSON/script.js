

// Función para convertir números a romanos
function convertirARomanos(num) {
    const valores = [
        { valor: 1000, simbolo: 'M' },
        { valor: 900, simbolo: 'CM' },
        { valor: 500, simbolo: 'D' },
        { valor: 400, simbolo: 'CD' },
        { valor: 100, simbolo: 'C' },
        { valor: 90, simbolo: 'XC' },
        { valor: 50, simbolo: 'L' },
        { valor: 40, simbolo: 'XL' },
        { valor: 10, simbolo: 'X' },
        { valor: 9, simbolo: 'IX' },
        { valor: 5, simbolo: 'V' },
        { valor: 4, simbolo: 'IV' },
        { valor: 1, simbolo: 'I' }
    ]
    let resultado = ''
    for (const item of valores) {
        while (num >= item.valor) {
            resultado += item.simbolo
            num -= item.valor
        }
    }
    return resultado
}

// Función para reordenar fecha YYYY-MM-DD → DD-MM-YYYY
function formatearFecha(fecha) {
    const [year, month, day] = fecha.split('-')
    return `${day}-${month}-${year}`
}

function mostrarDatos(title, episode_id, director, release_date) {
    const contenedorPost = document.querySelector('#posts')
    const lista = document.querySelector('#lista-peliculas') || document.createElement('ul')

    if (!lista.id) {
        lista.id = 'lista-peliculas'
        contenedorPost.appendChild(lista)
    }

    const itemLista = document.createElement('li')

    const episodioRomano = convertirARomanos(episode_id)
    const fechaFormateada = formatearFecha(release_date)

    itemLista.textContent = `Episodio ${episodioRomano}: ${title} 
        | Director: ${director} 
        | Estreno: ${fechaFormateada}`

    lista.appendChild(itemLista)
}

fetch("https://swapi.info/api/films")
  .then(response => response.json())
  .then(datos => {
    datos.sort((a, b) => a.episode_id - b.episode_id)

    datos.forEach(dato => {
        mostrarDatos(dato.title, dato.episode_id, dato.director, dato.release_date)
    });
  })
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