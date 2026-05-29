/**
 * Lógica para la gestión del perfil de la mascota
 */

document.addEventListener("DOMContentLoaded", () => {
    const petForm = document.getElementById("pet-form");
    const profileContent = document.getElementById("profile-content");

    // Al cargar la página, mostramos las mascotas ya guardadas
    renderizarMascotas();

    petForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(petForm);
        const newPet = Object.fromEntries(formData);

        saveMascotaParaAgenda(newPet);
        renderizarMascotas();
        petForm.reset();
    });
});

function renderizarMascotas() {
    const profileContent = document.getElementById("profile-content");
    const mascotas = getMascotas();

    if (!mascotas || mascotas.length === 0) {
        profileContent.innerHTML = "<p>Aún no has guardado ninguna ficha.</p>";
        return;
    }

    profileContent.innerHTML = mascotas.map((m) => `
        <div class="card-mascota-individual">
            <div class="card-mascota-header">
                <h3>${m.emoji || "🐾"} ${m.nombre || m.full_name}</h3>
                <button class="btn-eliminar-mascota" data-id="${m.id}">🗑 Eliminar</button>
            </div>
            <p><strong>Género:</strong> ${m.gender}</p>
            <p><strong>Especie:</strong> ${m.species}</p>
            <p><strong>Raza:</strong> ${m.race}</p>
            <p><strong>Fecha Nac:</strong> ${m.birth_date}</p>
            <p><strong>Peso:</strong> ${m.weight} kg</p>
            <p><strong>Vacunas:</strong> ${m.vaccines === "si" ? "Sí" : "No"}</p>
            <p><strong>Observaciones:</strong> ${m.observations || "Ninguna"}</p>
        </div>
    `).join("");

    // Eventos para eliminar
    profileContent.querySelectorAll(".btn-eliminar-mascota").forEach((btn) => {
        btn.addEventListener("click", () => {
            if (!confirm("¿Eliminar esta mascota?")) return;
            eliminarMascota(btn.dataset.id);
            renderizarMascotas();
        });
    });
}

function eliminarMascota(id) {
    const STORAGE_KEY = "petcare_mascotas";
    const mascotas = getMascotas().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mascotas));
}

function saveMascotaParaAgenda(mascotaForm) {
    const STORAGE_KEY = "petcare_mascotas";
    const mascotas = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const mascotaIntegrada = {
        id: Date.now().toString(),
        nombre: mascotaForm.full_name,
        emoji: "🐾",
        ...mascotaForm,
    };

    mascotas.push(mascotaIntegrada);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mascotas));
}
