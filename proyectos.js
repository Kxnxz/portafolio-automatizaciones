const catalogo = document.querySelector('#catalogo');

function elemento(etiqueta, clase, contenido) {
  const nodo = document.createElement(etiqueta);
  if (clase) nodo.className = clase;
  if (contenido !== undefined) nodo.textContent = contenido;
  return nodo;
}

function tarjeta(proyecto) {
  const articulo = elemento('article', 'card');
  const diagrama = elemento('div', 'diagram');
  diagrama.setAttribute('role', 'img');
  diagrama.setAttribute('aria-label', proyecto.nodos.join(', luego '));
  proyecto.nodos.forEach((nombre, indice) => {
    if (indice) diagrama.append(elemento('span', 'connector'));
    diagrama.append(elemento('span', 'node', nombre));
  });
  const detalles = elemento('details');
  detalles.append(
    elemento('summary', '', 'Ver salida del flujo'),
    elemento('pre', '', JSON.stringify(proyecto.salida, null, 2)),
  );
  const descarga = elemento('a', 'button', 'Descargar workflow');
  descarga.href = proyecto.archivo;
  descarga.download = '';
  descarga.setAttribute('aria-label', 'Descargar workflow ' + proyecto.nombre);
  articulo.append(
    elemento('p', 'author', proyecto.autor),
    elemento('h3', '', proyecto.nombre),
    elemento('p', '', proyecto.descripcion),
    diagrama, detalles, descarga,
  );
  return articulo;
}

async function cargarProyectos() {
  try {
    const respuesta = await fetch('proyectos.json');
    if (!respuesta.ok) throw new Error('Catálogo no disponible');
    const proyectos = await respuesta.json();
    catalogo.replaceChildren(...proyectos.map(tarjeta));
  } catch {
    catalogo.replaceChildren(elemento('p', '', 'No se pudo cargar el catálogo. Recarga la página para intentarlo de nuevo.'));
  }
}

cargarProyectos();
