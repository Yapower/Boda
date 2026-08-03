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
DTSTART:20270124T100000
DTEND:20270124T170000
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
