const SUPABASE_URL = "https://qxuecqhwfzmepadrmibe.supabase.co";
const SUPABASE_KEY = "sb_publishable_xQ3k-t-PyR9HCLvMP4AzSQ_xRaAhs03";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function probarPersonasDelGrupo() {

    console.log("Buscando grupo...");

    const codigoPrueba = "CHAR";


    // 1. Buscar grupo por código
    const { data: grupo, error: errorGrupo } = await db
        .from("grupos_invitacion")
        .select("id, codigo, nombre_grupo")
        .eq("codigo", codigoPrueba)
        .maybeSingle();


    if (errorGrupo) {
        console.error("Error buscando grupo:", errorGrupo);
        return;
    }


    if (!grupo) {
        console.log("No se encontró el grupo:", codigoPrueba);
        return;
    }


    console.log("Grupo encontrado:");
    console.log(grupo);


    // 2. Buscar personas que pertenecen al grupo
    console.log("Buscando personas del grupo...");

    const { data: personas, error: errorPersonas } = await db
        .from("personas")
        .select("id, grupo_id, nombre, apellido, tipo")
        .eq("grupo_id", grupo.id)
        .order("id", { ascending: true });


    if (errorPersonas) {
        console.error(
            "Error buscando personas:",
            errorPersonas
        );

        return;
    }


    console.log("Personas encontradas:");
    console.log(personas);


    // 3. Mostrar nombres uno por uno
    personas.forEach(persona => {

        const nombreCompleto =
            `${persona.nombre} ${persona.apellido || ""}`.trim();

        console.log(
            `Invitado: ${nombreCompleto} | Tipo: ${persona.tipo}`
        );

    });

}


document.addEventListener(
    "DOMContentLoaded",
    probarPersonasDelGrupo
);
