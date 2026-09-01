const SUPABASE_URL = "https://qxuecqhwfzmepadrmibe.supabase.co";
const SUPABASE_KEY = "sb_publishable_xQ3k-t-PyR9HCLvMP4AzSQ_xRaAhs03";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", cargarInvitacion);

async function cargarInvitacion() {

    const params = new URLSearchParams(window.location.search);
    const codigo = params.get("invitado");

    const nombreGrupo = document.getElementById("nombre-grupo");
    const listaInvitados = document.getElementById("lista-invitados");
    const confirmacionInvitados = document.getElementById("confirmacion-invitados");
    const btnConfirmar = document.getElementById("btn-confirmar");


    // Si no viene código en la URL
    if (!codigo) {

        nombreGrupo.textContent = "Invitación no encontrada";

        listaInvitados.innerHTML = `
            <p class="itinerario-placeholder">
                Este enlace de invitación no contiene un código válido.
            </p>
        `;

        confirmacionInvitados.innerHTML = `
            <div class="itinerario-confirmacion-placeholder">
                <span>No fue posible cargar la invitación</span>
                <small>Verifica que estés usando el enlace correcto.</small>
            </div>
        `;

        btnConfirmar.disabled = true;

        return;
    }


    // =====================================================
    // 1. BUSCAR GRUPO
    // =====================================================

    const { data: grupo, error: errorGrupo } = await db
        .from("grupos_invitacion")
        .select("id, codigo, nombre_grupo")
        .eq("codigo", codigo)
        .maybeSingle();


    if (errorGrupo) {

        console.error("Error buscando grupo:", errorGrupo);

        nombreGrupo.textContent = "Error al cargar";

        return;
    }


    if (!grupo) {

        nombreGrupo.textContent = "Invitación no encontrada";

        listaInvitados.innerHTML = `
            <p class="itinerario-placeholder">
                El código de invitación no existe.
            </p>
        `;

        btnConfirmar.disabled = true;

        return;
    }


    // =====================================================
    // 2. MOSTRAR NOMBRE DEL GRUPO
    // =====================================================

    nombreGrupo.textContent = grupo.nombre_grupo;


    // =====================================================
    // 3. BUSCAR PERSONAS
    // =====================================================

    const { data: personas, error: errorPersonas } = await db
        .from("personas")
        .select("id, nombre, apellido, tipo")
        .eq("grupo_id", grupo.id)
        .order("id", {
            ascending: true
        });


    if (errorPersonas) {

        console.error(
            "Error buscando personas:",
            errorPersonas
        );

        listaInvitados.innerHTML = `
            <p class="itinerario-placeholder">
                No se pudieron cargar los invitados.
            </p>
        `;

        return;
    }


    if (!personas || personas.length === 0) {

        listaInvitados.innerHTML = `
            <p class="itinerario-placeholder">
                No hay personas registradas en esta invitación.
            </p>
        `;

        return;
    }


    // =====================================================
    // 4. MOSTRAR INVITADOS ARRIBA
    // =====================================================

    listaInvitados.innerHTML = "";


    personas.forEach(persona => {

        const nombreCompleto =
            `${persona.nombre} ${persona.apellido || ""}`.trim();


        const p = document.createElement("p");

        p.className =
            "itinerario-nombre-invitado";

        p.textContent =
            nombreCompleto;


        listaInvitados.appendChild(p);

    });


    console.log("Invitación cargada correctamente:");
    console.log("Grupo:", grupo);
    console.log("Personas:", personas);

}
