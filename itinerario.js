const SUPABASE_URL = "https://qxuecqhwfzmepadrmibe.supabase.co";
const SUPABASE_KEY = "sb_publishable_xQ3k-t-PyR9HCLvMP4AzSQ_xRaAhs03";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function probarConexion() {
    console.log("Probando conexión con Supabase...");

    const { data, error } = await db
        .from("grupos_invitacion")
        .select("*")
        .limit(5);

    if (error) {
        console.error("Error de Supabase:", error);
        return;
    }

    console.log("Conexión correcta.");
    console.log("Datos recibidos:", data);
}

document.addEventListener("DOMContentLoaded", probarConexion);
