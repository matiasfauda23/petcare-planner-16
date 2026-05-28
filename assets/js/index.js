/**
 * Módulo de renderizado de tareas en la página de inicio
 * Lee tareas del storage y genera las tarjetas dinámicamente
 */
/**
 * Obtiene la fecha actual formateada como YYYY-MM-DD
 * @returns {string} Fecha actual
 */
function obtenerFechaActual() {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
/**
 * Compara la fecha de la tarea con la actual y devuelve la clase CSS correspondiente
 * @param {string} fechaTarea - Fecha de la tarea en formato YYYY-MM-DD
 * @returns {string} Clase CSS: tarea-vencida | tarea-hoy | tarea-futura
 */
function calcularClaseFecha(fechaTarea) {
  const fechaActual = obtenerFechaActual();
  if (fechaTarea < fechaActual) {
    return "tarea-vencida";
  } else if (fechaTarea === fechaActual) {
    return "tarea-hoy";
  }
  return "tarea-futura";
}
/**
 * Devuelve el texto del estado basado en la fecha de la tarea
 * @param {string} fechaTarea - Fecha de la tarea en formato YYYY-MM-DD
 * @returns {string} Texto: ATRASADA | PARA HOY | PRÓXIMA
 */
function obtenerTextoEstado(fechaTarea) {
  const clase = calcularClaseFecha(fechaTarea);
  if (clase === "tarea-vencida") return "ATRASADA";
  if (clase === "tarea-hoy") return "PARA HOY";
  return "PRÓXIMA";
}
/**
 * Convierte fecha YYYY-MM-DD a formato legible en español
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada (ej: "24 de Mayo de 2026")
 */
function formatearFecha(fecha) {
  const [year, month, day] = fecha.split("-");
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
}
/**
 * Genera el HTML de una tarjeta para una tarea
 * @param {Object} tarea - Objeto tarea con id, titulo, fecha, descripcion, estado
 * @returns {string} HTML de la tarjeta
 */
function generarTarjeta(tarea) {
  const claseFecha = calcularClaseFecha(tarea.fecha);
  const fechaFormateada = formatearFecha(tarea.fecha);
  const textoEstado = obtenerTextoEstado(tarea.fecha);
  return `
        <article class="tarjeta ${claseFecha}">
            <div class="tarjeta-header">
                <h3 class="tarjeta-titulo">${tarea.titulo}</h3>
                <span class="tarjeta-estado">${textoEstado}</span>
            </div>
            <div class="tarjeta-body">
                <p class="tarjeta-fecha">${fechaFormateada}</p>
                <p class="tarjeta-descripcion">${tarea.descripcion}</p>
            </div>
            <div class="tarjeta-footer">
                <button class="btn-ver" data-id="${tarea.id}">Ver detalle</button>
            </div>
        </article>
    `;
}
/**
 * Renderiza todas las tareas en el contenedor del DOM
 * @param {Array} tareas - Array de objetos tarea
 */
function renderizarTareas(tareas) {
  const contenedor = document.getElementById("proximas-tareas-container");
  if (!tareas || tareas.length === 0) {
    contenedor.innerHTML =
      '<p class="empty-state">No hay tareas pendientes por el momento.</p>';
    return;
  }
  const tareasOrdenadas = [...tareas].sort((a, b) =>
    a.fecha.localeCompare(b.fecha),
  );
  const tarjetasHTML = tareasOrdenadas
    .map((tarea) => generarTarjeta(tarea))
    .join("");
  contenedor.innerHTML = tarjetasHTML;
}
/**
 * Busca una tarea por su ID en el array de tareas
 * @param {number} id - ID de la tarea a buscar
 * @returns {Object|null} Objeto tarea o null si no la encuentra
 */
function buscarTareaPorId(id) {
  const tareas = obtenerTareas();
  return tareas.find((tarea) => tarea.id === id) || null;
}
/**
 * Inyecta el HTML del modal en el DOM (una sola vez)
 */
function crearModal() {
  const modalHTML = `
        <div id="modal-overlay" class="modal-overlay">
            <div id="modal" class="modal" role="dialog" aria-modal="true">
                <div class="modal-header">
                    <h2 id="modal-titulo" class="modal-titulo"></h2>
                    <button id="modal-close" class="modal-close" aria-label="Cerrar">×</button>
                </div>
                <div class="modal-body">
                    <p id="modal-fecha" class="modal-fecha"></p>
                    <p id="modal-descripcion" class="modal-descripcion"></p>
                </div>
                <div class="modal-footer">
                    <button id="modal-btn-cerrar" class="btn-cerrar">Cerrar</button>
                </div>
            </div>
        </div>
    `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}
/**
 * Abre el modal con los datos de la tarea especificada
 * @param {number} idTarea - ID de la tarea a mostrar
 */
function abrirModal(idTarea) {
  const tarea = buscarTareaPorId(idTarea);
  if (!tarea) return;

  const overlay = document.getElementById("modal-overlay");
  const titulo = document.getElementById("modal-titulo");
  const fecha = document.getElementById("modal-fecha");
  const descripcion = document.getElementById("modal-descripcion");

  const claseFecha = calcularClaseFecha(tarea.fecha);
  const fechaFormateada = formatearFecha(tarea.fecha);

  titulo.textContent = tarea.titulo;
  fecha.textContent = fechaFormateada;
  descripcion.textContent = tarea.descripcion;

  // Esto ahora va a funcionar porque el ID "modal" ya existe
  document.getElementById("modal").className = `modal ${claseFecha}`;

  overlay.classList.add("activo");
  document.body.style.overflow = "hidden";
}
/**
 * Cierra el modal y limpia el overflow del body
 */
function cerrarModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.remove("activo");
  document.body.style.overflow = "";
}
/**
 * Configura todos los eventos del modal (delegación de eventos)
 */
function inicializarEventosModal() {
  document.addEventListener("click", (e) => {
    if (e.target.matches(".btn-ver")) {
      const idTarea = parseInt(e.target.dataset.id, 10);
      abrirModal(idTarea);
    }
    if (
      e.target.matches("#modal-close") ||
      e.target.matches("#modal-btn-cerrar")
    ) {
      cerrarModal();
    }
    if (e.target.matches("#modal-overlay")) {
      cerrarModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarModal();
    }
  });
}
/**
 * Inicializa el módulo: obtiene tareas, las renderiza y configura eventos
 */
function init() {
  const tareas = obtenerTareas();
  renderizarTareas(tareas);
  crearModal();
  inicializarEventosModal();
}
document.addEventListener("DOMContentLoaded", init);
