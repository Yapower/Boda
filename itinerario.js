const SUPABASE_URL = "https://qxuecqhwfzmepadrmibe.supabase.co";
const SUPABASE_KEY = "sb_publishable_xQ3k-t-PyR9HCLvMP4AzSQ_xRaAhs03";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* ==========================================================
   VARIABLES
========================================================== */

let personasGrupo = [];
let respuestas = {};


/* ==========================================================
   ELEMENTOS DEL HTML
========================================================== */

const nombreGrupo =
    document.getElementById("nombre-grupo");

const listaInvitados =
    document.getElementById("lista-invitados");

const confirmacionInvitados =
    document.getElementById("confirmacion-invitados");

const btnConfirmar =
    document.getElementById("btn-confirmar");


/* ==========================================================
   OBTENER CÓDIGO DESDE LA URL
========================================================== */

function obtenerCodigo() {

    const params =
        new URLSearchParams(window.location.search);

    return params.get("invitado");

}


/* ==========================================================
   MOSTRAR ERROR
========================================================== */

function mostrarError(mensaje) {

    nombreGrupo.textContent =
        "Invitación no encontrada";

    listaInvitados.innerHTML = `
        <p class="itinerario-placeholder">
            ${mensaje}
        </p>
    `;

    confirmacionInvitados.innerHTML = `
        <div class="itinerario-confirmacion-placeholder">

            <span>
                No fue posible cargar la invitación
            </span>

            <small>
                Verifica que estés usando el enlace correcto.
            </small>

        </div>
    `;

    btnConfirmar.disabled = true;

}


/* ==========================================================
   CARGAR INVITACIÓN
========================================================== */

async function cargarInvitacion() {

    const codigo = obtenerCodigo();


    if (!codigo) {

        mostrarError(
            "Este enlace no contiene un código de invitación."
        );

        return;

    }


    try {

        /* ==================================================
           1. BUSCAR GRUPO
        ================================================== */

        const {
            data: grupo,
            error: errorGrupo
        } = await db
            .from("grupos_invitacion")
            .select("id, codigo, nombre_grupo")
            .eq("codigo", codigo)
            .maybeSingle();


        if (errorGrupo) {
            throw errorGrupo;
        }


        if (!grupo) {

            mostrarError(
                "El código de invitación no existe."
            );

            return;

        }


        nombreGrupo.textContent =
            grupo.nombre_grupo;



        /* ==================================================
           2. BUSCAR PERSONAS
        ================================================== */

        const {
            data: personas,
            error: errorPersonas
        } = await db
            .from("personas")
            .select(
                "id, grupo_id, nombre, apellido, tipo"
            )
            .eq("grupo_id", grupo.id)
            .order(
                "id",
                { ascending: true }
            );


        if (errorPersonas) {
            throw errorPersonas;
        }


        if (!personas || personas.length === 0) {

            mostrarError(
                "Esta invitación no tiene personas registradas."
            );

            return;

        }


        personasGrupo = personas;



        /* ==================================================
           3. MOSTRAR NOMBRES ARRIBA
        ================================================== */

        mostrarInvitados();



        /* ==================================================
           4. BUSCAR CONFIRMACIONES YA GUARDADAS
        ================================================== */

        await cargarConfirmaciones();



        /* ==================================================
           5. GENERAR BOTONES SÍ / NO
        ================================================== */

        mostrarFormularioConfirmacion();


        comprobarFormulario();


        console.log(
            "Invitación cargada correctamente:",
            grupo
        );

        console.log(
            "Personas:",
            personasGrupo
        );

        console.log(
            "Respuestas:",
            respuestas
        );

    }
    catch (error) {

        console.error(
            "Error cargando invitación:",
            error
        );

        mostrarError(
            "Ocurrió un problema al cargar la invitación."
        );

    }

}


/* ==========================================================
   MOSTRAR NOMBRES ARRIBA
========================================================== */

function mostrarInvitados() {

    listaInvitados.innerHTML = "";


    personasGrupo.forEach(persona => {

        const nombreCompleto =
            `${persona.nombre} ${persona.apellido || ""}`
                .trim();


        const p =
            document.createElement("p");


        p.className =
            "itinerario-nombre-invitado";


        p.textContent =
            nombreCompleto;


        listaInvitados.appendChild(p);

    });

}


/* ==========================================================
   CARGAR CONFIRMACIONES EXISTENTES
========================================================== */

async function cargarConfirmaciones() {

    respuestas = {};


    const idsPersonas =
        personasGrupo.map(
            persona => persona.id
        );


    const {
        data: confirmaciones,
        error
    } = await db
        .from("confirmaciones")
        .select(
            "id, persona_id, respuesta"
        )
        .in(
            "persona_id",
            idsPersonas
        );


    if (error) {

        console.error(
            "Error cargando confirmaciones:",
            error
        );

        return;

    }


    confirmaciones.forEach(
        confirmacion => {

            respuestas[
                confirmacion.persona_id
            ] =
                confirmacion.respuesta;

        }
    );

}


/* ==========================================================
   MOSTRAR FORMULARIO
========================================================== */

function mostrarFormularioConfirmacion() {

    confirmacionInvitados.innerHTML = "";


    personasGrupo.forEach(persona => {

        const nombreCompleto =
            `${persona.nombre} ${persona.apellido || ""}`
                .trim();



        /* ==================================================
           FILA
        ================================================== */

        const fila =
            document.createElement("div");


        fila.className =
            "itinerario-confirmacion-fila";



        /* ==================================================
           NOMBRE
        ================================================== */

        const nombre =
            document.createElement("span");


        nombre.className =
            "nombre";


        nombre.textContent =
            nombreCompleto;



        /* ==================================================
           CONTENEDOR BOTONES
        ================================================== */

        const opciones =
            document.createElement("div");


        opciones.className =
            "itinerario-confirmacion-opciones";



        /* ==================================================
           BOTÓN SÍ
        ================================================== */

        const btnSi =
            document.createElement("button");


        btnSi.type =
            "button";


        btnSi.className =
            "itinerario-opcion";


        btnSi.textContent =
            "Sí";



        /* ==================================================
           BOTÓN NO
        ================================================== */

        const btnNo =
            document.createElement("button");


        btnNo.type =
            "button";


        btnNo.className =
            "itinerario-opcion";


        btnNo.textContent =
            "No";



        /* ==================================================
           RESPUESTA YA EXISTENTE
        ================================================== */

        if (
            respuestas[persona.id] === "si"
        ) {

            btnSi.classList.add(
                "seleccionada"
            );

        }


        if (
            respuestas[persona.id] === "no"
        ) {

            btnNo.classList.add(
                "seleccionada"
            );

        }



        /* ==================================================
           CLICK SÍ
        ================================================== */

        btnSi.addEventListener(
            "click",
            () => {

                respuestas[
                    persona.id
                ] = "si";


                btnSi.classList.add(
                    "seleccionada"
                );


                btnNo.classList.remove(
                    "seleccionada"
                );


                comprobarFormulario();

            }
        );



        /* ==================================================
           CLICK NO
        ================================================== */

        btnNo.addEventListener(
            "click",
            () => {

                respuestas[
                    persona.id
                ] = "no";


                btnNo.classList.add(
                    "seleccionada"
                );


                btnSi.classList.remove(
                    "seleccionada"
                );


                comprobarFormulario();

            }
        );



        opciones.appendChild(
            btnSi
        );


        opciones.appendChild(
            btnNo
        );


        fila.appendChild(
            nombre
        );


        fila.appendChild(
            opciones
        );


        confirmacionInvitados.appendChild(
            fila
        );

    });

}


/* ==========================================================
   COMPROBAR QUE TODOS CONTESTARON
========================================================== */

function comprobarFormulario() {

    const todosRespondieron =
        personasGrupo.every(
            persona => {

                return (
                    respuestas[
                        persona.id
                    ] === "si"
                    ||
                    respuestas[
                        persona.id
                    ] === "no"
                );

            }
        );


    btnConfirmar.disabled =
        !todosRespondieron;

}


/* ==========================================================
   GUARDAR UNA CONFIRMACIÓN
========================================================== */

async function guardarRespuesta(
    personaId,
    respuesta
) {

    /* ======================================================
       BUSCAR SI YA EXISTE
    ====================================================== */

    const {
        data: existente,
        error: errorBuscar
    } = await db
        .from("confirmaciones")
        .select("id")
        .eq(
            "persona_id",
            personaId
        )
        .maybeSingle();


    if (errorBuscar) {
        throw errorBuscar;
    }



    /* ======================================================
       SI YA EXISTE → ACTUALIZAR
    ====================================================== */

    if (existente) {

        const {
            error: errorActualizar
        } = await db
            .from("confirmaciones")
            .update({
                respuesta: respuesta
            })
            .eq(
                "id",
                existente.id
            );


        if (errorActualizar) {
            throw errorActualizar;
        }

    }


    /* ======================================================
       SI NO EXISTE → CREAR
    ====================================================== */

    else {

        const {
            error: errorInsertar
        } = await db
            .from("confirmaciones")
            .insert({
                persona_id:
                    personaId,

                respuesta:
                    respuesta
            });


        if (errorInsertar) {
            throw errorInsertar;
        }

    }

}


/* ==========================================================
   GUARDAR TODAS LAS CONFIRMACIONES
========================================================== */

async function guardarConfirmaciones() {

    const textoOriginal =
        btnConfirmar.textContent;


    btnConfirmar.disabled = true;


    btnConfirmar.textContent =
        "Guardando...";


    try {

        for (
            const persona
            of personasGrupo
        ) {

            await guardarRespuesta(
                persona.id,
                respuestas[persona.id]
            );

        }


        /* ==================================================
           ÉXITO
        ================================================== */

        btnConfirmar.textContent =
            "¡Asistencia guardada!";


        btnConfirmar.classList.add(
            "confirmacion-exitosa"
        );


        setTimeout(
            () => {

                btnConfirmar.textContent =
                    "Actualizar asistencia";


                btnConfirmar.disabled =
                    false;

            },
            2500
        );

    }
    catch (error) {

        console.error(
            "Error guardando asistencia:",
            error
        );


        alert(
            "No fue posible guardar la confirmación. Intenta nuevamente."
        );


        btnConfirmar.textContent =
            textoOriginal;


        btnConfirmar.disabled =
            false;

    }

}


/* ==========================================================
   EVENTO DEL BOTÓN PRINCIPAL
========================================================== */

btnConfirmar.addEventListener(
    "click",
    guardarConfirmaciones
);


/* ==========================================================
   INICIAR
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    cargarInvitacion
);
