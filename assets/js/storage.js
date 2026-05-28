/**
 * Módulo de almacenamiento para tareas de mascotas
 * Gestiona lectura/escritura de tareas en localStorage
 */
const TAREA_KEY = "petcare_tareas";
/**
 * Obtiene las tareas desde localStorage.
 * Si no existe ninguna, crea un set de datos iniciales de prueba.
 * @returns {Array} Array de objetos tarea
 */
function obtenerTareas() {
  const stored = localStorage.getItem(TAREA_KEY);
  if (stored && stored.trim() !== "") {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error al parsear tareas:", e);
      return [];
    }
  }
  const tareasDefault = [
    {
      id: 1,
      titulo: "Vacuna Antirrábica",
      fecha: "2026-05-20",
      descripcion: "Llevar a la veterinaria para la vacuna anual",
      estado: "pendiente",
    },
    {
      id: 2,
      titulo: "Desparasitación",
      fecha: "2026-05-24",
      descripcion: "Aplicar tratamiento antiparasitario",
      estado: "pendiente",
    },
    {
      id: 3,
      titulo: "Corte de pelo",
      fecha: "2026-05-28",
      descripcion: "Separar turno con el estilista canino",
      estado: "pendiente",
    },
    {
      id: 4,
      titulo: "Revisión dental",
      fecha: "2026-06-05",
      descripcion: "Chequeo anual de dentadura",
      estado: "pendiente",
    },
  ];
  localStorage.setItem(TAREA_KEY, JSON.stringify(tareasDefault));
  return tareasDefault;
}
const guardarMascota = (nuevaMascota) => {
    // 1. Obtenemos lo que ya existe (o un array vacío si no hay nada)
    const mascotas = obtenerMascotas();
    
    // 2. Agregamos la nueva mascota al array
    mascotas.push(nuevaMascota);
    
    // 3. Guardamos el array completo de nuevo
    localStorage.setItem("misMascotas", JSON.stringify(mascotas));
};

const obtenerMascotas = () => {
    const datos = localStorage.getItem("misMascotas");
    return datos ? JSON.parse(datos) : []; // Si es null, devuelve []
};
 /**Local storage del perfil de las mascotas  */
/** Módulo para gestionar el almacenamiento local
*¨*/
const STORAGE_KEY = "misMascotas";

// Obtiene todas las mascotas guardadas
const getMascotas = () => {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? JSON.parse(datos) : [];
};

// Guarda una nueva mascota en el array existente
const saveMascota = (mascota) => {
    const mascotas = getMascotas();
    mascotas.push(mascota);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mascotas));
};

