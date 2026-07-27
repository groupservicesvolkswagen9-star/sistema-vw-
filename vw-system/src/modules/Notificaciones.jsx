import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase";

export default function Notificaciones({
  rol,
  user
}) {

  const [titulo, setTitulo] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  const [destino, setDestino] =
    useState("empleado");

  const [grupo, setGrupo] =
    useState("");

  const [grupos, setGrupos] =
    useState([]);

  const [fechaProgramada,
    setFechaProgramada] =
    useState("");

  const [notificaciones,
    setNotificaciones] =
    useState([]);

  const cargar = async () => {

    try {

      const gruposSnap =
        await getDocs(
          collection(
            db,
            "Grupos"
          )
        );

      const listaGrupos =
        gruposSnap.docs.map(
          doc => ({
            id: doc.id,
            ...doc.data()
          })
        );

      setGrupos(
        listaGrupos
      );

      const snap =
        await getDocs(
          collection(
            db,
            "Notificaciones"
          )
        );

      const hoy =
        new Date();

      const lista =
        snap.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter((item) => {

            if (
              item.fechaProgramada
            ) {

              const fechaNotif =
                new Date(
                  item.fechaProgramada
                );

              if (
                fechaNotif > hoy
              ) {
                return false;
              }
            }

            // ADMIN

            if (
              rol === "admin"
            ) {

              return true;

            }

            // COORDINADOR

            if (
              rol ===
              "coordinador"
            ) {

              return (

                item.destino ===
                  "coordinador" ||

                item.destino ===
                  "todos" ||

                (
                  item.destino ===
                    "grupo" &&

                  item.grupo ===
                    user?.grupo
                )

              );

            }

            // EMPLEADO

            if (
              rol ===
              "empleado"
            ) {

              return (

                item.destino ===
                  "empleado" ||

                item.destino ===
                  "todos" ||

                (
                  item.destino ===
                    "grupo" &&

                  item.grupo ===
                    user?.grupo
                )

              );

            }

            return false;

          });

      setNotificaciones(
        lista
      );

    } catch (error) {

      console.error(error);

    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const enviar = async () => {

    try {

      if (
        !titulo.trim() ||
        !mensaje.trim()
      ) {

        alert(
          "Completa los campos"
        );

        return;

      }

      await addDoc(
        collection(
          db,
          "Notificaciones"
        ),
        {
          titulo,
          mensaje,
          destino,

          grupo:
            destino ===
            "grupo"
              ? grupo
              : "",

          fechaProgramada,

          creadoPor:
            user?.email ||
            rol,

          fechaCreacion:
            new Date()
              .toISOString()
        }
      );

      setTitulo("");
      setMensaje("");
      setFechaProgramada("");
      setGrupo("");

      await cargar();

      alert(
        "Notificación creada"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Error al crear notificación"
      );

    }
  };
const eliminarNotificacion = async (id) => {

  try {

    await deleteDoc(
      doc(
        db,
        "Notificaciones",
        id
      )
    );

    await cargar();

  } catch (error) {

    console.error(error);

    alert(
      "Error al eliminar notificación"
    );

  }

};
  return (

    <div className="sap-card">

      <h2>
        Notificaciones
      </h2>

      {(rol === "admin" ||
        rol ===
          "coordinador") && (

        <>

          <input
            className="fb-input"
            placeholder="Título"
            value={titulo}
            onChange={(e) =>
              setTitulo(
                e.target.value
              )
            }
          />

          <textarea
            className="fb-input"
            placeholder="Mensaje"
            value={mensaje}
            onChange={(e) =>
              setMensaje(
                e.target.value
              )
            }
          />

          <select
            className="fb-input"
            value={destino}
            onChange={(e) =>
              setDestino(
                e.target.value
              )
            }
          >

            <option value="empleado">
              Empleados
            </option>

            <option value="coordinador">
              Coordinadores
            </option>

            <option value="todos">
              Todos
            </option>

            <option value="grupo">
              Grupo
            </option>

          </select>

          {destino ===
            "grupo" && (

            <select
              className="fb-input"
              value={grupo}
              onChange={(e) =>
                setGrupo(
                  e.target.value
                )
              }
            >

              <option value="">
                Seleccionar grupo
              </option>

              {grupos.map(
                (grupoItem) => (

                <option
                  key={
                    grupoItem.id
                  }
                  value={
                    grupoItem.nombreGrupo
                  }
                >
                  {
                    grupoItem.nombreGrupo
                  }
                </option>

              ))}

            </select>

          )}

          <input
            type="date"
            className="fb-input"
            value={
              fechaProgramada
            }
            onChange={(e) =>
              setFechaProgramada(
                e.target.value
              )
            }
          />

          <button
            className="fb-btn"
            onClick={enviar}
          >
            Enviar notificación
          </button>

        </>

      )}

      <div
        style={{
          marginTop: "20px"
        }}
      >

        {notificaciones.length ===
        0 ? (

          <p>
            No hay notificaciones.
          </p>

        ) : (

          notificaciones.map(
            (item) => (

              <div
                key={item.id}
                className="sap-card"
                style={{
                  marginTop:
                    "10px"
                }}
              >

                <h4>
                  {item.titulo}
                </h4>

                <p>
                  {item.mensaje}
                </p>

                <small>
                  Destino:
                  {" "}
                  {item.destino}
                </small>

                {item.grupo && (
                  <>
                    <br />
                    <small>
                      Grupo:
                      {" "}
                      {item.grupo}
                    </small>
                  </>
                )}

                <br />

                <small>
                  Fecha:
                  {" "}
                  {item.fechaProgramada ||
                    "Inmediata"}
                </small>
                  {(rol === "admin" || rol === "coordinador")&& (

  <button
    onClick={() =>
      eliminarNotificacion(
        item.id
      )
    }
    style={{
      background: "#d32f2f",
      color: "white",
      border: "none",
      padding: "5px 10px",
      borderRadius: "5px",
      marginTop: "5px",
      cursor: "pointer"
    }}
  >
    Eliminar
  </button>

)}
              </div>

            )
          )

        )}

      </div>

    </div>

  );

}