/**
 * Lógica para la gestión del perfil de la mascota
 */

document.addEventListener("DOMContentLoaded", () => {
    const petForm = document.getElementById("pet-form");
    const profileContent = document.getElementById("profile-content");

    petForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Previene recarga de página

        // 1. Capturamos todo el formulario de golpe usando FormData
        const formData = new FormData(petForm);
        const newPet = Object.fromEntries(formData); // Convierte a objeto { nombre: "...", genero: "..." }

        // 2. Guardamos en el localStorage
        saveMascota(newPet);

        // 3. Renderizamos la tarjeta ( es decir reemplaza el texto inicial por los datos)
        profileContent.innerHTML = `
            <div class="card-mascota-individual">
                <p><strong>Nombre:</strong> ${newPet.full_name}</p>
                <p><strong>Género:</strong> ${newPet.gender}</p>
                <p><strong>Especie:</strong> ${newPet.species}</p>
                <p><strong>Raza:</strong> ${newPet.race}</p>
                <p><strong>Fecha Nac:</strong> ${newPet.birth_date}</p>
                <p><strong>Peso:</strong> ${newPet.weight} kg</p>
                <p><strong>Vacunas:</strong> ${newPet.vaccines === 'si' ? 'Sí' : 'No'}</p>
                <p><strong>Observaciones:</strong> ${newPet.observations || "Ninguna"}</p>
            </div>
        `;

        // 4. Limpiamos el formulario (esto resetea los selects a "Selecciona una opción")
        petForm.reset();
    });
});