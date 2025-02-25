document.addEventListener("DOMContentLoaded", function () {
    const cambioBT = document.getElementById("cambioBT");
    const inicioBT = document.getElementById("inicioBT");
    const registroBT = document.getElementById("registroBT");
    const pass2 = document.getElementById("pass2");
    const textPass2 = document.getElementById("pass2");
    const textPass = document.getElementById("pass");
    const nombreUser = document.getElementById("user");
    let registroActivo = false;

    // Contenedor para mostrar el mensaje de error
    const errorMessage = document.createElement("p");
    errorMessage.style.color = "red";
    errorMessage.style.display = "none";
    document.body.appendChild(errorMessage);

    inicioBT.onclick = function(event) {
        iniciarSesion(event); 
    }

    cambioBT.addEventListener("click", function (event) {
        event.preventDefault();
        registroActivo = !registroActivo;

        if (registroActivo) {
            pass2.style.display = "block";
            textPass2.style.display = "block";
            inicioBT.textContent = "Registrarse";
            inicioBT.id = "registroBT";
            cambioBT.textContent = "Ir a Iniciar sesión";
        } else {
            pass2.style.display = "none";
            textPass2.style.display = "none";
            inicioBT.textContent = "Iniciar sesión";
            inicioBT.id = "inicioBT";
            cambioBT.textContent = "Ir a Registrarse";
        }
    });

    function iniciarSesion(event){
        event.preventDefault();
        
        const user = nombreUser.value.trim();
        const pass = textPass.value.trim();
        if(!user || !pass){
            errorMessage.textContent = "Faltan datos para iniciar sesión";
            errorMessage.style.display = "block";
        } else {
            errorMessage.style.display = "none";
            window.electronAPI.openInicio(user);
        }
    }
});
