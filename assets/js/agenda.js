const STORAGE_MASCOTAS = 'petcare_mascotas';
const STORAGE_TAREAS   = 'petcare_tareas';
let filtroActivo = 'todas';
function getFechaHoy() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const día = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${día}`;
}
function clasificarTarea(tarea) {
    if (tarea.realizada) return 'realizada';
    const hoy = getFechaHoy();
    if (tarea.fecha < hoy)  return 'vencida';
    if (tarea.fecha === hoy) return 'hoy';
    return 'futura';
}
function formatearFecha(fechaISO) {
    if (!fechaISO) return 'Sin fecha';
    const [año, mes, día] = fechaISO.split('-');
    return `${día}/${mes}/${año}`;
}
const TIPOS = {
    vacuna:       { emoji: '💉', label: 'Vacuna' },
    paseo:        { emoji: '🦮', label: 'Paseo' },
    comida:       { emoji: '🍖', label: 'Comida' },
    baño:         { emoji: '🛁', label: 'Baño' },
    medicamento:  { emoji: '💊', label: 'Medicamento' },
    veterinario:  { emoji: '🏥', label: 'Veterinario' },
    otro:         { emoji: '📝', label: 'Otro' },
};
const ESTADO_LABELS = {
    vencida:  '⚠ Vencida',
    hoy:      '📅 Hoy',
    futura:   '🗓 Próxima',
    realizada:'✔ Realizada',
};
function renderTareas() {
    const container = document.getElementById('tareas-container');
    const emptyMsg  = document.getElementById('empty-msg');
    const tareas = obtenerTareas();
    const mascotas  = getMascotas();
    const filtradas = tareas.filter(t => {
        const estado = clasificarTarea(t);
        if (filtroActivo === 'todas')     return true;
        if (filtroActivo === 'pendiente') return estado !== 'realizada';
        if (filtroActivo === 'realizada') return estado === 'realizada';
        if (filtroActivo === 'vencida')   return estado === 'vencida';
        return true;
    });
    container.querySelectorAll('.tarea-card').forEach(el => el.remove());
    if (filtradas.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }
    emptyMsg.style.display = 'none';
    const orden = { vencida: 0, hoy: 1, futura: 2, realizada: 3 };
    filtradas.sort((a, b) => {
        const ea = clasificarTarea(a);
        const eb = clasificarTarea(b);
        if (orden[ea] !== orden[eb]) return orden[ea] - orden[eb];
        return a.fecha.localeCompare(b.fecha);
    });
    filtradas.forEach(tarea => {
        const estado   = clasificarTarea(tarea);
        const tipo     = TIPOS[tarea.tipo] || TIPOS.otro;
        const mascota  = mascotas.find(m => m.id === tarea.mascotaId);
        const nombreMascota = mascota ? `${mascota.emoji || '🐾'} ${mascota.nombre}` : '🐾 Sin mascota';
        const card = document.createElement('div');
        card.classList.add('tarea-card', estado);
        card.dataset.id = tarea.id;
        card.innerHTML = `
<div class="tarea-info">
                <div class="tarea-meta">
                    <span class="tarea-tipo-badge">${tipo.emoji} ${tipo.label}</span>
                    <span class="tarea-mascota-nombre">${nombreMascota}</span>
                </div>
                <p class="tarea-descripcion ${tarea.realizada ? 'tachada' : ''}">
                    ${tarea.descripcion || 'Sin descripción'}
                </p>
                <p class="tarea-fecha">📆 ${formatearFecha(tarea.fecha)}</p>
                <span class="estado-tag">${ESTADO_LABELS[estado]}</span>
            </div>
            <div class="tarea-acciones">
                ${!tarea.realizada
                    ? `<button class="btn-icono btn-completar" data-id="${tarea.id}">✔ Completar</button>`
                    : `<button class="btn-icono btn-deshacer"  data-id="${tarea.id}">↩ Deshacer</button>`
                }
                <button class="btn-icono btn-editar"   data-id="${tarea.id}">✏ Editar</button>
                <button class="btn-icono btn-eliminar" data-id="${tarea.id}">🗑 Eliminar</button>
            </div>
        `;
        container.appendChild(card);
    });
}
function abrirModal(tarea = null) {
    const overlay = document.getElementById('modal-overlay');
    const titulo  = document.getElementById('modal-titulo');
    const selectMascota = document.getElementById('tarea-mascota');
    const mascotas = getMascotas();
    selectMascota.innerHTML = '<option value="">-- Seleccioná una mascota --</option>';
    mascotas.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.emoji || '🐾'} ${m.nombre}`;
        selectMascota.appendChild(opt);
    });
    if (tarea) {
        titulo.textContent = 'Editar Tarea';
        document.getElementById('tarea-id').value          = tarea.id;
        document.getElementById('tarea-mascota').value     = tarea.mascotaId || '';
        document.getElementById('tarea-tipo').value        = tarea.tipo;
        document.getElementById('tarea-descripcion').value = tarea.descripcion;
        document.getElementById('tarea-fecha').value       = tarea.fecha;
    } else {
        titulo.textContent = 'Nueva Tarea';
        document.getElementById('tarea-id').value          = '';
        document.getElementById('tarea-mascota').value     = '';
        document.getElementById('tarea-tipo').value        = 'vacuna';
        document.getElementById('tarea-descripcion').value = '';
        document.getElementById('tarea-fecha').value       = getFechaHoy();
    }
    overlay.classList.add('visible');
}
function cerrarModal() {
    document.getElementById('modal-overlay').classList.remove('visible');
}
function guardarTarea() {
    const id          = document.getElementById('tarea-id').value;
    const mascotaId   = document.getElementById('tarea-mascota').value;
    const tipo        = document.getElementById('tarea-tipo').value;
    const descripcion = document.getElementById('tarea-descripcion').value.trim();
    const fecha       = document.getElementById('tarea-fecha').value;
    if (!fecha) {
        alert('Por favor seleccioná una fecha.');
        return;
    }
    const tareas = obtenerTareas();
    if (id) {
        const idx = tareas.findIndex(t => t.id === id);
        if (idx !== -1) {
            tareas[idx] = { ...tareas[idx], mascotaId, tipo, descripcion, fecha };
        }
    } else {
        const nueva = {
            id: Date.now().toString(),
            mascotaId,
            tipo,
            descripcion,
            fecha,
            realizada: false,
        };
        tareas.push(nueva);
    }
    saveTareas(tareas);
    cerrarModal();
    renderTareas();
}
function marcarRealizada(id) {
    const tareas = obtenerTareas();
    const tarea  = tareas.find(t => t.id === id);
    if (tarea) tarea.realizada = true;
    saveTareas(tareas);
    renderTareas();
}
function deshacerRealizada(id) {
    const tareas = obtenerTareas();
    const tarea  = tareas.find(t => t.id === id);
    if (tarea) tarea.realizada = false;
    saveTareas(tareas);
    renderTareas();
}
function editarTarea(id) {
    const tarea = obtenerTareas().find(t => t.id === id);
    if (tarea) abrirModal(tarea);
}
function eliminarTarea(id) {
    showConfirmModal(
        '¿Eliminar esta tarea?',
        'Esta acción no se puede deshacer',
        () => {
            const tareas = obtenerTareas().filter(t => t.id !== id);
            saveTareas(tareas);
            renderTareas();
        }
    );
}
function activarFiltro(filtro) {
    filtroActivo = filtro;
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filtro === filtro);
    });
    renderTareas();
}
document.getElementById('btn-nueva-tarea').addEventListener('click', () => abrirModal());
document.getElementById('btn-cerrar-modal').addEventListener('click', cerrarModal);
document.getElementById('btn-cancelar').addEventListener('click', cerrarModal);
document.getElementById('btn-guardar-tarea').addEventListener('click', guardarTarea);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) cerrarModal();
});
document.getElementById('tareas-container').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.classList.contains('btn-completar')) marcarRealizada(id);
    if (btn.classList.contains('btn-deshacer'))  deshacerRealizada(id);
    if (btn.classList.contains('btn-editar'))    editarTarea(id);
    if (btn.classList.contains('btn-eliminar'))  eliminarTarea(id);
});
document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => activarFiltro(btn.dataset.filtro));
});

document.addEventListener('DOMContentLoaded', renderTareas);
