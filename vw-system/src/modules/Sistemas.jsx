import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs
} from "firebase/firestore";

import { db } from "../firebase";

export default function Sistemas({
  rol,
  user,
  vista
}) {

  const [nombreSistema, setNombreSistema] =
    useState("");

  const [numeroParte, setNumeroParte] =
    useState("");

  const [sistemas, setSistemas] =
    useState([]);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {

    try {

      const snap = await getDocs(
        collection(db, "Sistemas")
      );

      const lista = snap.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data()
        })
      );

      setSistemas(lista);

    } catch (error) {

      console.error(error);

    }

  };

  const guardarSistema = async () => {

    try {

      if (
        !nombreSistema.trim() ||
        !numeroParte.trim()
      ) {

        alert(
          "Completa todos los campos"
        );

        return;

      }

      await addDoc(
        collection(
          db,
          "Sistemas"
        ),
        {
          usuario:
            user?.email || "",

          nombre:
            user?.nombre || "",

          apellido:
            user?.apellido || "",

          grupo:
            user?.grupo || "",

          sistema:
            nombreSistema,

          numeroParte,

          estatus:
            "En revisión",

          fecha:
            new Date()
              .toISOString()
        }
      );

      setNombreSistema("");
      setNumeroParte("");

      await cargar();

      alert(
        "Sistema registrado"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Error al registrar sistema"
      );

    }

  };

  let listaMostrar = sistemas;

  // EMPLEADO
  if (rol === "empleado") {

    listaMostrar =
      sistemas.filter(
        (item) =>
          item.usuario ===
          user?.email
      );

  }

  // COORDINADOR
  else if (
    rol === "coordinador"
  ) {

    listaMostrar =
      sistemas.filter(
        (item) =>
          item.grupo ===
          user?.grupo
      );

  }

  // ADMIN
  else if (
    rol === "admin"
  ) {

    listaMostrar =
      sistemas;

  }

  return (

    <div
  className="sap-card sap-card-full"
  style={{
    width: "100%",
    display: "block"
  }}
>
      <h2>
        Sistemas
      </h2>

      {rol === "empleado" &&
        vista !== "mis_sistemas" && (

        <>

          <input
            className="fb-input"
            value={nombreSistema}
            placeholder="Nombre del sistema"
            onChange={(e) =>
              setNombreSistema(
                e.target.value
              )
            }
          />

          <input
            className="fb-input"
            value={numeroParte}
            placeholder="Número de parte"
            onChange={(e) =>
              setNumeroParte(
                e.target.value
              )
            }
          />

          <button
            className="fb-btn"
            onClick={
              guardarSistema
            }
          >
            Registrar sistema
          </button>

        </>

      )}

      <table className="table">

        <thead>

          <tr>

            <th>Correo</th>

            {(rol !== "empleado" ||
              vista === "mis_sistemas") && (
              <>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Grupo</th>
              </>
            )}

            <th>Sistema</th>

            <th>
              Número Parte
            </th>

            <th>
              Estatus
            </th>

            <th>
              Fecha
            </th>

          </tr>

        </thead>

        <tbody>

          {listaMostrar.length === 0 ? (

            <tr>

              <td colSpan="8">
                No existen sistemas
                registrados
              </td>

            </tr>

          ) : (

            listaMostrar.map(
              (item) => (

                <tr
                  key={item.id}
                >

                  <td>
                    {item.usuario}
                  </td>

                  {(rol !== "empleado" ||
                    vista === "mis_sistemas") && (
                    <>
                      <td>
                        {item.nombre || ""}
                      </td>

                      <td>
                        {item.apellido || ""}
                      </td>

                      <td>
                        {item.grupo || ""}
                      </td>
                    </>
                  )}

                  <td>
                    {item.sistema}
                  </td>

                  <td>
                    {item.numeroParte}
                  </td>

                  <td>
                    {item.estatus}
                  </td>

                  <td>
                    {item.fecha
                      ? new Date(
                          item.fecha
                        ).toLocaleDateString()
                      : ""}
                  </td>

                </tr>

              )
            )

          )}

        </tbody>

      </table>

    </div>

  );

}