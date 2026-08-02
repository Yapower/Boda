// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // Selecciona la imagen del sobre mediante su clase CSS
    const envelope = document.querySelector('.envelope-img');

    // Escucha el evento de clic o toque en el celular
    if (envelope) {
        envelope.addEventListener('click', () => {
            // Redirige a la página de detalles (puedes cambiar 'detalles.html' por el nombre que uses)
            window.location.href = 'detalles.html';
        });
    }
});