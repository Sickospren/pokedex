const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, query, where, setDoc, doc, getDoc, deleteDoc, updateDoc } = require("firebase/firestore");
const bcrypt = require("bcryptjs");

/*
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};
*/

const firebaseConfig = {
    apiKey: "AIzaSyBRX96uDEDS66JnVDXJ12JB0FTiwoorVFs",
    authDomain: "pokedex-8c2b4.firebaseapp.com",
    projectId: "pokedex-8c2b4",
    storageBucket: "pokedex-8c2b4.firebasestorage.app",
    messagingSenderId: "899715103342",
    appId: "1:899715103342:web:1e221aba36686b7ce9847f",
    measurementId: "G-2EXFRSH3ZL"
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

async function comprobarEquipoExistente(ids, user) {
    const db = getFirestore(firebaseApp);
    const equiposRef = collection(db, "equipo");
    try {
        // Buscar todos los equipos del usuario
        const q = query(equiposRef, where("username", "==", user));
        const querySnapshot = await getDocs(q);
        // Comprobar si ya existe un equipo con los mismos IDs (sin importar el orden)
        for (const docSnapshot of querySnapshot.docs) {
            const equipoData = docSnapshot.data();
            const equipoIds = [
                equipoData.poke1,
                equipoData.poke2,
                equipoData.poke3,
                equipoData.poke4,
                equipoData.poke5,
                equipoData.poke6
            ];
            // Ordenamos ambos arrays de IDs para compararlos sin importar el orden
            const idsOrdenados = [...ids].sort((a, b) => a - b);
            const equipoIdsOrdenados = [...equipoIds].sort((a, b) => a - b);

            if (JSON.stringify(idsOrdenados) === JSON.stringify(equipoIdsOrdenados)) {
                console.log("Ya existe un equipo igual para este usuario.");
                return false;
            }
        }
        console.log("No existe un equipo igual para este usuario.");
        return true;
    } catch (error) {
        console.error("Error al comprobar si el equipo existe:", error);
        return false;
    }
}

async function annadirEquipo(ids, user) {
    const equipoExistente = await comprobarEquipoExistente(ids, user);

    if (!equipoExistente) {
        console.log("No se puede añadir el equipo porque ya existe uno igual.");
        return false;
    }
    const db = getFirestore(firebaseApp);
    const equiposRef = collection(db, "equipo");
    try {
        const equipoData = {
            poke1: ids[0],
            poke2: ids[1],
            poke3: ids[2],
            poke4: ids[3],
            poke5: ids[4],
            poke6: ids[5],
            username: user
        };
        await setDoc(doc(equiposRef), equipoData);
        console.log("Equipo añadido exitosamente.");
        return true;
    } catch (error) {
        console.error("Error al añadir el equipo:", error);
        return false;
    }
}

async function eliminarEquipo(ids, user) {
    const db = getFirestore(firebaseApp);
    const equiposRef = collection(db, "equipo");
    try {
        // Buscar todos los equipos del usuario
        const q = query(equiposRef, where("username", "==", user));
        const querySnapshot = await getDocs(q);
        // Recorrer los documentos para encontrar el que coincide con los IDs
        for (const docSnapshot of querySnapshot.docs) {
            const equipoData = docSnapshot.data();
            const equipoIds = [
                equipoData.poke1,
                equipoData.poke2,
                equipoData.poke3,
                equipoData.poke4,
                equipoData.poke5,
                equipoData.poke6
            ];
            // Ordenamos ambos arrays de IDs para compararlos sin importar el orden
            const idsOrdenados = [...ids].sort((a, b) => a - b);
            const equipoIdsOrdenados = [...equipoIds].sort((a, b) => a - b);
            if (JSON.stringify(idsOrdenados) === JSON.stringify(equipoIdsOrdenados)) {
                // Eliminar el documento
                await deleteDoc(docSnapshot.ref);
                console.log("Equipo eliminado exitosamente.");
                return true;
            }
        }
        console.log("No se encontró un equipo igual para este usuario.");
        return false;
    } catch (error) {
        console.error("Error al eliminar el equipo:", error);
        return false;
    }
}


module.exports = { comprobarLogin, registrarUsuario, annadirEquipo, eliminarEquipo };