const targetDate = new Date("2027-01-24T16:30:00").getTime();

function updateCountdown() {

    const now = new Date().getTime();

    const distance = targetDate - now;

    if (distance <= 0) {

        clearInterval(interval);

        document.getElementById("days").innerText = "0";
        document.getElementById("hours").innerText = "0";
        document.getElementById("minutes").innerText = "0";
        document.getElementById("seconds").innerText = "0";

        document.getElementById("mensaje").innerHTML =
            "¡Hoy es el gran día!";

        return;

    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60)) /
        1000
    );

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

}

updateCountdown();

const interval = setInterval(updateCountdown, 1000);


//agregar calendario//

function agregarCalendario(){

const evento = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Boda Yoab & Daniela
DESCRIPTION:Celebración de nuestra boda
DTSTART:20270124T163000
DTEND:20270125T000000
LOCATION:
END:VEVENT
END:VCALENDAR
`;

    const blob = new Blob([evento], {
        type:"text/calendar"
    });


    const url = URL.createObjectURL(blob);


    const enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = "Boda_Yoab_Daniela.ics";

    document.body.appendChild(enlace);

    enlace.click();

document.body.removeChild(enlace);


}

// Al hacer clic en el botón de fecha, se agrega el evento al calendario
document.getElementById('guardar-fecha').addEventListener('click', (e) => {
    e.preventDefault();
    agregarCalendario();
});


/* ==========================================================
   CONSERVAR CÓDIGO DEL INVITADO EN LOS ENLACES
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Obtener ?invitado=XXXX de la URL actual
    const params =
        new URLSearchParams(window.location.search);

    const codigoInvitado =
        params.get("invitado");


    // Si no hay código, no hacemos nada
    if (!codigoInvitado) {
        return;
    }


    /*
        Buscar todos los enlaces de la página.

        Esto funciona aunque tengas enlaces hacia:

        itinerario.html
        histori.html
        historia.html
        historia3.html

        No necesitamos poner IDs especiales.
    */

    const enlaces =
        document.querySelectorAll("a[href]");


    enlaces.forEach(enlace => {

        const href =
            enlace.getAttribute("href");


        // Ignorar enlaces vacíos
        if (!href) {
            return;
        }


        // Ignorar anclas internas
        if (href.startsWith("#")) {
            return;
        }


        // Ignorar javascript
        if (href.startsWith("javascript:")) {
            return;
        }


        // Ignorar enlaces externos
        if (
            href.startsWith("http://")
            ||
            href.startsWith("https://")
            ||
            href.startsWith("mailto:")
            ||
            href.startsWith("tel:")
        ) {
            return;
        }


        // Solo modificar páginas HTML
        if (!href.includes(".html")) {
            return;
        }


        const separador =
            href.includes("?")
                ? "&"
                : "?";


        enlace.href =
            `${href}${separador}invitado=${encodeURIComponent(codigoInvitado)}`;

    });

});
