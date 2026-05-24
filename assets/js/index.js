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
  return `
        <article class="tarjeta ${claseFecha}">
            <div class="tarjeta-header">
                <h3 class="tarjeta-titulo">${tarea.titulo}</h3>
                <span class="tarjeta-estado">${tarea.estado}</span>
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
  const tarjetasHTML = tareas.map((tarea) => generarTarjeta(tarea)).join("");
  contenedor.innerHTML = tarjetasHTML;
}
/**
 * Inicializa el módulo: obtiene tareas y las renderiza
 */
function init() {
  const tareas = obtenerTareas();
  renderizarTareas(tareas);
}
document.addEventListener("DOMContentLoaded", init);
