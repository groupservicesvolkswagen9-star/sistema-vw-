import { useState, useEffect } from "react";
import {
  onAuthStateChanged
} from "firebase/auth";

import { auth } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "./firebase";

import Login from "./Login";
import Dashboard from "./Dashboard";

import "./App.css";

export default function App() {

  const [user, setUser] =
    useState(null);

  const [rol, setRol] =
    useState(null);

  const [loading, setLoading] =
    useState(false);
  useEffect(() => {

  const unsubscribe =
    onAuthStateChanged(
      auth,
      (firebaseUser) => {

        if (firebaseUser) {

          setUser({
            email:
              firebaseUser.email,

            uid:
              firebaseUser.uid
          });

        } else {

          setUser(null);

        }

      }
    );

  return () =>
    unsubscribe();

}, []);
  useEffect(() => {

    const obtenerRol = async () => {

      if (!user?.email) return;

      try {

        setLoading(true);

        const q = query(
          collection(
            db,
            "Usuarios"
          ),
          where(
            "email",
            "==",
            user.email
          )
        );

        const snap =
          await getDocs(q);

        if (!snap.empty) {

          const datos =
            snap.docs[0].data();

          setRol(
            datos.rol ||
            "empleado"
          );

          setUser(prev => ({
  ...prev,

  rol:
    datos.rol || "empleado",

  nombre:
    datos.nombre || "",

  apellido:
    datos.apellido || "",

  grupoFirestoreId:
    datos.grupoFirestoreId || "",

  grupoId:
    datos.grupoId || "",

  grupoNombre:
    datos.grupoNombre || ""
}));

        } else {

          setRol(
            "empleado"
          );

        }

      } catch (error) {

        console.error(
          error
        );

      } finally {

        setLoading(
          false
        );

      }

    };

    obtenerRol();

  }, [user?.email]);

  if (!user) {

    return (
      <Login
        setUser={setUser}
      />
    );

  }

  if (loading) {

    return (

      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        Cargando usuario...
      </div>

    );

  }

  return (

    <Dashboard
      user={user}
      rol={rol}
      setUser={setUser}
    />

  );

}
