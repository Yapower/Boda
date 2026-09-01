/* ==========================================================
   CONFIGURACIÓN SUPABASE
========================================================== */

const SUPABASE_URL =
    "https://qxuecqhwfzmepadrmibe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_xQ3k-t-PyR9HCLvMP4AzSQ_xRaAhs03";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* ==========================================================
   FECHA LÍMITE PARA CONFIRMAR
========================================================== */

/*
    A partir del 25 de diciembre de 2026
    ya NO podrán crear ni modificar confirmaciones.

    -06:00 corresponde al horario que estamos usando
    para la fecha límite.
*/

const FECHA_LIMITE =
    new Date("2026-12-25T00:00:00-06:00");


function confirmacionesCerradas() {

    const ahora = new Date();

    return ahora >= FECHA_LIMITE;

}


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
    document.getElementById(
        "confirmacion-invitados"
    );


const btnConfirmar =
    document.getElementById(
        "btn-confirmar"
    );


/* ==========================================================
   OBTENER CÓDIGO DESDE LA URL
========================================================== */

function obtenerCodigo() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return params.get(
        "invitado"
    );

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

    const codigo =
        obtenerCodigo();


    /* ======================================================
       VALIDAR CÓDIGO
    ====================================================== */

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
            .from(
                "grupos_invitacion"
            )
            .select(
                "id, codigo, nombre_grupo"
            )
            .eq(
                "codigo",
                codigo
            )
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


        /* ==================================================
           MOSTRAR NOMBRE DEL GRUPO
        ================================================== */

        nombreGrupo.textContent =
            grupo.nombre_grupo;



        /* ==================================================
           2. BUSCAR PERSONAS
        ================================================== */

        const {
            data: personas,
            error: errorPersonas
        } = await db
            .from(
                "personas"
            )
            .select(
                "id, grupo_id, nombre, apellido, tipo"
            )
            .eq(
                "grupo_id",
                grupo.id
            )
            .order(
                "id",
                {
                    ascending: true
                }
            );


        if (errorPersonas) {

            throw errorPersonas;

        }


        if (
            !personas
            ||
            personas.length === 0
        ) {

            mostrarError(
                "Esta invitación no tiene personas registradas."
            );


            return;

        }


        personasGrupo =
            personas;



        /* ==================================================
           3. MOSTRAR NOMBRES ARRIBA
        ================================================== */

        mostrarInvitados();



        /* ==================================================
           4. CARGAR CONFIRMACIONES EXISTENTES
        ================================================== */

        await cargarConfirmaciones();



        /* ==================================================
           5. GENERAR FORMULARIO SÍ / NO
        ================================================== */

        mostrarFormularioConfirmacion();



        /* ==================================================
           6. VERIFICAR FECHA LÍMITE
        ================================================== */

        if (
            confirmacionesCerradas()
        ) {

            mostrarConfirmacionesCerradas();

        }
        else {

            comprobarFormulario();

        }



        /* ==================================================
           CONSOLA
        ================================================== */

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


        console.log(
            "Fecha límite:",
            FECHA_LIMITE
        );


        console.log(
            "Confirmaciones cerradas:",
            confirmacionesCerradas()
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

    listaInvitados.innerHTML =
        "";


    personasGrupo.forEach(
        persona => {

            const nombreCompleto =
                `${persona.nombre} ${persona.apellido || ""}`
                    .trim();


            const p =
                document.createElement(
                    "p"
                );


            p.className =
                "itinerario-nombre-invitado";


            p.textContent =
                nombreCompleto;


            listaInvitados.appendChild(
                p
            );

        }
    );

}


/* ==========================================================
   CARGAR CONFIRMACIONES EXISTENTES
========================================================== */

async function cargarConfirmaciones() {

    respuestas = {};


    const idsPersonas =
        personasGrupo.map(
            persona =>
                persona.id
        );


    const {
        data: confirmaciones,
        error
    } = await db
        .from(
            "confirmaciones"
        )
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


    if (!confirmaciones) {

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

    confirmacionInvitados.innerHTML =
        "";


    const cerrado =
        confirmacionesCerradas();


    personasGrupo.forEach(
        persona => {

            const nombreCompleto =
                `${persona.nombre} ${persona.apellido || ""}`
                    .trim();



            /* ==============================================
               FILA
            ============================================== */

            const fila =
                document.createElement(
                    "div"
                );


            fila.className =
                "itinerario-confirmacion-fila";



            /* ==============================================
               NOMBRE
            ============================================== */

            const nombre =
                document.createElement(
                    "span"
                );


            nombre.className =
                "nombre";


            nombre.textContent =
                nombreCompleto;



            /* ==============================================
               CONTENEDOR DE OPCIONES
            ============================================== */

            const opciones =
                document.createElement(
                    "div"
                );


            opciones.className =
                "itinerario-confirmacion-opciones";



            /* ==============================================
               BOTÓN SÍ
            ============================================== */

            const btnSi =
                document.createElement(
                    "button"
                );


            btnSi.type =
                "button";


            btnSi.className =
                "itinerario-opcion";


            btnSi.textContent =
                "Sí";



            /* ==============================================
               BOTÓN NO
            ============================================== */

            const btnNo =
                document.createElement(
                    "button"
                );


            btnNo.type =
                "button";


            btnNo.className =
                "itinerario-opcion";


            btnNo.textContent =
                "No";



            /* ==============================================
               MOSTRAR RESPUESTA EXISTENTE
            ============================================== */

            if (
                respuestas[
                    persona.id
                ] === "si"
            ) {

                btnSi.classList.add(
                    "seleccionada"
                );

            }


            if (
                respuestas[
                    persona.id
                ] === "no"
            ) {

                btnNo.classList.add(
                    "seleccionada"
                );

            }



            /* ==============================================
               SI YA PASÓ LA FECHA LÍMITE
            ============================================== */

            if (cerrado) {

                btnSi.disabled =
                    true;


                btnNo.disabled =
                    true;


                btnSi.classList.add(
                    "opcion-bloqueada"
                );


                btnNo.classList.add(
                    "opcion-bloqueada"
                );

            }



            /* ==============================================
               CLICK SÍ
            ============================================== */

            btnSi.addEventListener(
                "click",
                () => {

                    if (
                        confirmacionesCerradas()
                    ) {

                        mostrarAvisoFechaLimite();

                        return;

                    }


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



            /* ==============================================
               CLICK NO
            ============================================== */

            btnNo.addEventListener(
                "click",
                () => {

                    if (
                        confirmacionesCerradas()
                    ) {

                        mostrarAvisoFechaLimite();

                        return;

                    }


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



            /* ==============================================
               AGREGAR ELEMENTOS
            ============================================== */

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

        }
    );

}


/* ==========================================================
   MOSTRAR ESTADO CERRADO
========================================================== */

function mostrarConfirmacionesCerradas() {

    btnConfirmar.disabled =
        true;


    btnConfirmar.textContent =
        "Confirmaciones cerradas";


    /* Evitar duplicar el aviso */

    if (
        document.querySelector(
            ".confirmacion-cerrada"
        )
    ) {

        return;

    }


    const aviso =
        document.createElement(
            "div"
        );


    aviso.className =
        "confirmacion-cerrada";


    aviso.innerHTML = `

        <strong>
            El periodo de confirmación ha finalizado.
        </strong>

        <span>
            La fecha límite para confirmar o modificar
            la asistencia fue el 24 de diciembre de 2026.
        </span>

    `;


    confirmacionInvitados.appendChild(
        aviso
    );

}


/* ==========================================================
   AVISO SI INTENTAN MODIFICAR
========================================================== */

function mostrarAvisoFechaLimite() {

    alert(
        "El periodo para confirmar o modificar la asistencia ha finalizado."
    );

}


/* ==========================================================
   COMPROBAR QUE TODOS CONTESTARON
========================================================== */

function comprobarFormulario() {

    /* ======================================================
       SI YA CERRÓ → BOTÓN BLOQUEADO
    ====================================================== */

    if (
        confirmacionesCerradas()
    ) {

        btnConfirmar.disabled =
            true;


        btnConfirmar.textContent =
            "Confirmaciones cerradas";


        return;

    }



    /* ======================================================
       COMPROBAR RESPUESTAS
    ====================================================== */

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
       SEGUNDA VALIDACIÓN DE FECHA
    ====================================================== */

    if (
        confirmacionesCerradas()
    ) {

        throw new Error(
            "CONFIRMACIONES_CERRADAS"
        );

    }



    /* ======================================================
       BUSCAR SI YA EXISTE
    ====================================================== */

    const {
        data: existente,
        error: errorBuscar
    } = await db
        .from(
            "confirmaciones"
        )
        .select(
            "id"
        )
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
            .from(
                "confirmaciones"
            )
            .update({

                respuesta:
                    respuesta

            })
            .eq(
                "id",
                existente.id
            );


        if (
            errorActualizar
        ) {

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
            .from(
                "confirmaciones"
            )
            .insert({

                persona_id:
                    personaId,

                respuesta:
                    respuesta

            });


        if (
            errorInsertar
        ) {

            throw errorInsertar;

        }

    }

}


/* ==========================================================
   GUARDAR TODAS LAS CONFIRMACIONES
========================================================== */

async function guardarConfirmaciones() {

    /* ======================================================
       VALIDAR FECHA ANTES DE HACER NADA
    ====================================================== */

    if (
        confirmacionesCerradas()
    ) {

        mostrarAvisoFechaLimite();


        mostrarConfirmacionesCerradas();


        return;

    }



    const textoOriginal =
        btnConfirmar.textContent;


    btnConfirmar.disabled =
        true;


    btnConfirmar.textContent =
        "Guardando...";


    try {

        /* ==================================================
           GUARDAR CADA PERSONA
        ================================================== */

        for (
            const persona
            of personasGrupo
        ) {

            /* Verificar nuevamente la fecha */

            if (
                confirmacionesCerradas()
            ) {

                throw new Error(
                    "CONFIRMACIONES_CERRADAS"
                );

            }


            await guardarRespuesta(

                persona.id,

                respuestas[
                    persona.id
                ]

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



        /* ==================================================
           DESPUÉS DE 2.5 SEGUNDOS
        ================================================== */

        setTimeout(
            () => {

                btnConfirmar.classList.remove(
                    "confirmacion-exitosa"
                );


                /*
                    Si durante esos segundos
                    se alcanzó la fecha límite,
                    cerrar el formulario.
                */

                if (
                    confirmacionesCerradas()
                ) {

                    mostrarConfirmacionesCerradas();


                    return;

                }


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


        /* ==================================================
           ERROR POR FECHA CERRADA
        ================================================== */

        if (
            error.message
            ===
            "CONFIRMACIONES_CERRADAS"
        ) {

            mostrarAvisoFechaLimite();


            mostrarConfirmacionesCerradas();


            return;

        }



        /* ==================================================
           OTRO ERROR
        ================================================== */

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
