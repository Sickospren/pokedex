document.addEventListener("DOMContentLoaded", function () {
    localStorage.clear();
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

    // Acción para el botón de inicio de sesión
    /*
    inicioBT.onclick = function(event) {
        iniciarSesion(event); 
    }
    */

    // Acción para alternar entre registro e inicio de sesión
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

    // Función para iniciar sesión
    async function iniciarSesion(event){
        console.log("login")

        event.preventDefault();
        
        const user = nombreUser.value.trim();
        const pass = textPass.value.trim();
        if(!user || !pass){
            errorMessage.textContent = "Faltan datos para iniciar sesión";
            errorMessage.style.display = "block";
        } else {
            errorMessage.style.display = "none";
            const result = await window.electronAPI.comprobarLogin(user, pass);
            if(result === true){
                localStorage.setItem('username', user);
                window.electronAPI.openInicio();
            } else {
                errorMessage.textContent = "Datos incorrectos para el inicio de sesión";
                errorMessage.style.display = "block";
            }
        }
    }

    // Función para registrarse
    async function registrarse(event){
        console.log("registro")
        event.preventDefault();
        const user = nombreUser.value.trim();
        const pass = textPass.value.trim();
        const pass2Value = textPass2.value.trim();
        if (!user || !pass || !pass2Value) {
            errorMessage.textContent = "Faltan datos para registrarse";
            errorMessage.style.display = "block";
            return;
        }
        if (pass !== pass2Value) {
            errorMessage.textContent = "Las contraseñas no coinciden";
            errorMessage.style.display = "block";
            return;
        }
        const result = await window.electronAPI.registrarUsuario(user, pass);
        if (result === true) {
            localStorage.setItem('username', user);
            window.electronAPI.openInicio();
        } else {
            errorMessage.textContent = "Error al registrar el usuario. Intenta nuevamente.";
            errorMessage.style.display = "block";
        }
    }

    if (registroBT) {
        registroBT.onclick = registrarse;
    }
});
