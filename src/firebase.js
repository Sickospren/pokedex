const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, query, where, setDoc, doc, getDoc, deleteDoc, updateDoc, addDoc } = require("firebase/firestore");
const bcrypt = require("bcryptjs");
const process = require("process")
require("dotenv").config();

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);

async function comprobarLogin(username, contrasena) {
    try {
        const db = getFirestore(firebaseApp);
        const usuariosRef = collection(db, "usuarios");
        // Buscar al usuario por nombre de usuario
        const qUsername = query(usuariosRef, where("nombre_usuario", "==", username));
        const querySnapshot = await getDocs(qUsername);
        if (querySnapshot.empty) {
            console.log("Usuario no encontrado.");
            return null;
        }
        const usuario = querySnapshot.docs[0].data();
        // Comparar la contraseña ingresada con la contraseña hasheada en la base de datos
        const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!passwordMatch) {
            console.log("Contraseña incorrecta.");
            return false;
        }
        return true;

    } catch (error) {
        console.error("Error en la autenticación:", error);
        return false;
    }
}

async function registrarUsuario(nombre_usuario, contrasena) {
    const db = getFirestore(firebaseApp);
    const usuariosRef = collection(db, "usuarios");
    try {
        const docSnap = await getDocs(query(usuariosRef, where("nombre_usuario", "==", nombre_usuario)));
        if (!docSnap.empty) {
            console.log("El nombre de usuario ya está en uso.");
            return false;
        }
        // Hashear la contraseña con un salt de 10
        const salt = await bcrypt.genSalt(10);
        const contrasenaHasheada = await bcrypt.hash(contrasena, salt);
        // Crear el documento con el nombre de usuario y la contraseña hasheada
        const docRef = doc(db, "usuarios", nombre_usuario);
        const usuarioData = {
            nombre_usuario,
            contrasena: contrasenaHasheada,
        };
        await setDoc(docRef, usuarioData);
        console.log("Usuario registrado exitosamente.");
        return true;
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return false;
    }
}

async function annadirEquipo(pokemonArray, user) {
    const db = getFirestore(firebaseApp);
    const equiposRef = collection(db, "equipos");
    try {
        // Recoge el json del equipo y añade el nombre de usuario
        const equipoData = {
            equipo: pokemonArray,
            usuario: user
        };
        const docRef = await addDoc(equiposRef, equipoData);
        console.log("Equipo añadido exitosamente con ID: ", docRef.id);
        return true;
    } catch (error) {
        console.error("Error al añadir equipo:", error);
        return false;
    }
}

async function eliminarEquipo(docId) {
    const db = getFirestore(firebaseApp);
    const equipoDocRef = doc(db, "equipos", docId);
    try {
        // Recibe el id del documento para borrarlo
        await deleteDoc(equipoDocRef);
        console.log("Equipo eliminado exitosamente.");
        return true;
    } catch (error) {
        console.error("Error al eliminar el equipo:", error);
        return false;
    }
}

async function obtenerEquiposDeUsuario(user) {
    const db = getFirestore(firebaseApp);
    const equiposRef = collection(db, "equipos");
    try {
        // Devuelve el json de cada equipo, juntando todos los equipos en un mismo json
        const q = query(equiposRef, where("usuario", "==", user));
        const querySnapshot = await getDocs(q);
        const equipos = {};
        querySnapshot.forEach((docSnapshot) => {
            const equipoData = docSnapshot.data().equipo;
            equipos[docSnapshot.id] = equipoData;
        });

        return equipos;
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
        return {};
    }
}

module.exports = { comprobarLogin, registrarUsuario, annadirEquipo, eliminarEquipo, obtenerEquiposDeUsuario };