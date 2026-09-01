// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // Selecciona la imagen del sobre
    const envelope = document.querySelector('.envelope-img');

    if (envelope) {

        envelope.addEventListener('click', () => {

            // Obtener el código del invitado desde la URL
            const params = new URLSearchParams(window.location.search);

            const codigoInvitado = params.get('invitado');


            // Si existe código, conservarlo al ir a detalles
            if (codigoInvitado) {

                window.location.href =
                    `detalles.html?invitado=${encodeURIComponent(codigoInvitado)}`;

            } else {

                // Si alguien entra sin código
                window.location.href = 'detalles.html';

            }

        });

    }

});
