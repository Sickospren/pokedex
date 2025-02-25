document.addEventListener("DOMContentLoaded", function () {
    localStorage.clear();

    // Elementos del DOM
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const loginBT = document.getElementById("loginBT");
    const registerBT = document.getElementById("registerBT");
    const switchToRegister = document.getElementById("switchToRegister");
    const switchToLogin = document.getElementById("switchToLogin");

    const loginUser = document.getElementById("loginUser");
    const loginPass = document.getElementById("loginPass");

    const registerUser = document.getElementById("registerUser");
    const registerPass = document.getElementById("registerPass");
    const registerPass2 = document.getElementById("registerPass2");

    // Contenedor para mostrar mensajes de error
    const errorMessage = document.createElement("p");
    errorMessage.style.color = "red";
    errorMessage.style.display = "none";
    document.body.appendChild(errorMessage);

    // Alternar formularios
    switchToRegister.addEventListener("click", function () {
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");
        errorMessage.style.display = "none"; // Ocultar mensajes de error al cambiar de vista
    });

    switchToLogin.addEventListener("click", function () {
        registerForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
        errorMessage.style.display = "none";
    });

    // Función para iniciar sesión
    async function iniciarSesion(event) {

        event.preventDefault();
        console.log("Intentando iniciar sesión...");
        const user = loginUser.value.trim();
        const pass = loginPass.value.trim();
        if (!user || !pass) {
            errorMessage.textContent = "Faltan datos para iniciar sesión";
            errorMessage.style.display = "block";
            return;
        }
        errorMessage.style.display = "none";
        const result = await window.electronAPI.comprobarLogin(user, pass);
        if (result === true) {
            localStorage.setItem('username', user);
            window.electronAPI.openInicio();
        } else {
            errorMessage.textContent = "Datos incorrectos para el inicio de sesión";
            errorMessage.style.display = "block";
        }
    }

    // Función para registrarse
    async function registrarse(event) {
        event.preventDefault();
        console.log("Intentando registrarse...");
        const user = registerUser.value.trim();
        const pass = registerPass.value.trim();
        const pass2Value = registerPass2.value.trim();
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
        errorMessage.style.display = "none";
        const result = await window.electronAPI.registrarUsuario(user, pass);
        console.log(result);

        if (result === true) {
            localStorage.setItem('username', user);
            window.electronAPI.openInicio();
        } else {
            errorMessage.textContent = "Error al registrar el usuario. Intenta nuevamente.";
            errorMessage.style.display = "block";
        }
    }

    // Asignar eventos a botones
    loginBT.addEventListener("click", iniciarSesion);
    registerBT.addEventListener("click", registrarse);
});
