const SUPABASE_URL = "https://qxuecqhwfzmepadrmibe.supabase.co";
const SUPABASE_KEY = "sb_publishable_xQ3k-t-PyR9HCLvMP4AzSQ_xRaAhs03";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function probarGrupo() {

    console.log("Buscando grupo de prueba...");

    const codigoPrueba = "CHAR";

    const { data, error } = await db
        .from("grupos_invitacion")
        .select("*")
        .eq("codigo", codigoPrueba)
        .maybeSingle();

    if (error) {
        console.error("Error buscando grupo:", error);
        return;
    }

    if (!data) {
        console.log("No se encontró el grupo:", codigoPrueba);
        return;
    }

    console.log("Grupo encontrado:");
    console.log(data);

}

document.addEventListener(
    "DOMContentLoaded",
    probarGrupo
);
