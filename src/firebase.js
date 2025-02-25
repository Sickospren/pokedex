import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, query, where, setDoc, doc, getDoc, deleteDoc,updateDoc } from "firebase/firestore";
import bcrypt from 'bcryptjs';

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};


const firebaseApp = initializeApp(firebaseConfig);

export async function comprobarLogin(username, contrasena) {
    try {
        const db = getFirestore();
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


export async function registrarUsuario(nombre_usuario, contrasena) {
    const db = getFirestore();
    const usuariosRef = collection(db, "usuarios");
    try {
        const docSnap = await getDocs(query(usuariosRef, where("nombre_usuario", "==", nombre_usuario)));
        if (!docSnap.empty) {
            console.log("El nombre de usuario ya está en uso.");
            return { error: "El nombre de usuario ya está en uso." };
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