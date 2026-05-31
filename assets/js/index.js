/*
 * Módulo de renderizado de tareas en la página de inicio
 */

const TIPOS = {
  vacuna: "💉 Vacuna",
  paseo: "🦮 Paseo",
  comida: "🍖 Comida especial",
  baño: "🛁 Baño",
  medicamento: "💊 Medicamento",
  veterinario: "🏥 Veterinario",
  otro: "📝 Otro",
};

function obtenerFechaActual() {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calcularClaseFecha(fechaTarea) {
  const fechaActual = obtenerFechaActual();
  if (fechaTarea < fechaActual) return "tarea-vencida";
  if (fechaTarea === fechaActual) return "tarea-hoy";
  return "tarea-futura";
}

function obtenerTextoEstado(fechaTarea, realizada) {
  if (realizada) return "✔ Realizada";
  const clase = calcularClaseFecha(fechaTarea);
  if (clase === "tarea-vencida") return "⚠ Atrasada";
  if (clase === "tarea-hoy") return "📅 Para hoy";
  return "🗓 Próxima";
}

function formatearFecha(fecha) {
  const [year, month, day] = fecha.split("-");
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
}

function generarTarjeta(tarea) {
  const claseFecha = calcularClaseFecha(tarea.fecha);
  const fechaFormateada = formatearFecha(tarea.fecha);
  const textoEstado = obtenerTextoEstado(tarea.fecha, tarea.realizada);
  const titulo = tarea.titulo || TIPOS[tarea.tipo] || "Tarea";
  const descripcion = tarea.descripcion || "Sin descripción";

  return `
    <article class="tarjeta ${claseFecha}">
      <div class="tarjeta-header">
        <h3 class="tarjeta-titulo">${titulo}</h3>
        <span class="tarjeta-estado">${textoEstado}</span>
      </div>
      <div class="tarjeta-body">
        <p class="tarjeta-fecha">${fechaFormateada}</p>
        <p class="tarjeta-descripcion">${descripcion}</p>
      </div>
      <div class="tarjeta-footer">
        <button class="btn-ver" data-id="${tarea.id}">Ver detalle</button>
      </div>
    </article>
  `;
}

function renderizarTareas(tareas) {
  const contenedor = document.getElementById("proximas-tareas-container");
  if (!tareas || tareas.length === 0) {
    contenedor.innerHTML = '<p class="empty-state">No hay tareas pendientes por el momento.</p>';
    return;
  }
  const tareasOrdenadas = [...tareas].sort((a, b) => a.fecha.localeCompare(b.fecha));
  contenedor.innerHTML = tareasOrdenadas.map((tarea) => generarTarjeta(tarea)).join("");
}

function buscarTareaPorId(id) {
  const tareas = obtenerTareas();
  return tareas.find((tarea) => tarea.id === id) || null;
}

function crearModal() {
  const modalHTML = `
    <div id="modal-overlay" class="modal-overlay">
      <div id="modal" class="modal" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h2 id="modal-titulo" class="modal-titulo"></h2>
          <button id="modal-close" class="modal-close" aria-label="Cerrar">×</button>
        </div>
        <div class="modal-body" id="modal-body">
        </div>
        <div class="modal-footer">
          <button id="modal-btn-cerrar" class="btn-cerrar">Cerrar</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function abrirModal(idTarea) {
  const tarea = buscarTareaPorId(idTarea);
  if (!tarea) return;

  const mascotas = getMascotas();
  const mascota = mascotas.find(m => m.id === tarea.mascotaId);
  const nombreMascota = mascota ? `${mascota.emoji || "🐾"} ${mascota.nombre}` : "🐾 Sin mascota asignada";

  const titulo = tarea.titulo || TIPOS[tarea.tipo] || "Tarea";
  const descripcion = tarea.descripcion || "Sin descripción";
  const textoEstado = obtenerTextoEstado(tarea.fecha, tarea.realizada);
  const fechaFormateada = formatearFecha(tarea.fecha);
  const tipoLabel = TIPOS[tarea.tipo] || "📝 Otro";

  document.getElementById("modal-titulo").textContent = titulo;
  document.getElementById("modal").className = `modal ${calcularClaseFecha(tarea.fecha)}`;

  document.getElementById("modal-body").innerHTML = `
    <ul class="modal-detalle">
      <li><span class="modal-label">🐾 Mascota:</span> ${nombreMascota}</li>
      <li><span class="modal-label">📋 Tipo:</span> ${tipoLabel}</li>
      <li><span class="modal-label">📝 Descripción:</span> ${descripcion}</li>
      <li><span class="modal-label">📆 Fecha:</span> ${fechaFormateada}</li>
      <li><span class="modal-label">🔖 Estado:</span> ${textoEstado}</li>
    </ul>
  `;

  document.getElementById("modal-overlay").classList.add("activo");
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  document.getElementById("modal-overlay").classList.remove("activo");
  document.body.style.overflow = "";
}

function inicializarEventosModal() {
  document.addEventListener("click", (e) => {
    if (e.target.matches(".btn-ver")) {
      abrirModal(e.target.dataset.id);
    }
    if (e.target.matches("#modal-close") || e.target.matches("#modal-btn-cerrar")) {
      cerrarModal();
    }
    if (e.target.matches("#modal-overlay")) {
      cerrarModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModal();
  });
}

function init() {
  const tareas = obtenerTareas();
  renderizarTareas(tareas);
  crearModal();
  inicializarEventosModal();
}

document.addEventListener("DOMContentLoaded", init);