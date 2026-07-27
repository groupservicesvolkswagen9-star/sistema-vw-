import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase";

export default function Equipos({
  user,
  rol,
  vista
}) {
const [editando, setEditando] =
  useState(null);
  const [equipo, setEquipo] =
    useState("");

  const [serie, setSerie] =
    useState("");

  const [equipos, setEquipos] =
    useState([]);

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {

    try {

      const snap = await getDocs(
        collection(
          db,
          "Equipos"
        )
      );
const eliminar = async (id) => {

  try {

    await deleteDoc(
      doc(
        db,
        "Equipos",
        id
      )
    );

    await cargarEquipos();

  } catch (error) {

    console.error(error);

  }

};
      const lista = snap.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data()
        })
      );

      setEquipos(lista);

    } catch (error) {

      console.error(error);

    }

  };

  const guardarEquipo = async () => {

    try {

      if (
        !equipo.trim() ||
        !serie.trim()
      ) {

        alert(
          "Completa los campos"
        );

        return;

      }

      await addDoc(
        collection(
          db,
          "Equipos"
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

          equipo,

          serie,

          fecha:
            new Date()
              .toISOString()
        }
      );

      setEquipo("");
      setSerie("");

      await cargarEquipos();

      alert(
        "Equipo registrado"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Error al registrar equipo"
      );

    }

  };

  let listaMostrar = equipos;

  // EMPLEADO

  if (rol === "empleado") {

    listaMostrar =
      equipos.filter(
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
      equipos.filter(
        (item) =>
          item.grupo ===
          user?.grupo
      );

  }

  // ADMIN

  else if (
    rol === "admin"
  ) {

    listaMostrar = equipos;

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
        Equipos
      </h2>

      {rol === "empleado" &&
        vista !== "mis_equipos" && (

        <>

          <input
            className="fb-input"
            placeholder="Nombre del equipo"
            value={equipo}
            onChange={(e) =>
              setEquipo(
                e.target.value
              )
            }
          />

          <input
            className="fb-input"
            placeholder="Número de serie"
            value={serie}
            onChange={(e) =>
              setSerie(
                e.target.value
              )
            }
          />

          <button
            className="fb-btn"
            onClick={
              guardarEquipo
            }
          >
            Registrar equipo
          </button>

        </>

      )}

      <table className="table">

        <thead>

          <tr>

            <th>
              Correo
            </th>

            {(rol !== "empleado" ||
              vista ===
                "mis_equipos") && (
              <>
                <th>
                  Nombre
                </th>

                <th>
                  Apellido
                </th>

                <th>
                  Grupo
                </th>
              </>
            )}

            <th>
              Equipo
            </th>

            <th>
              Serie
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
                No existen equipos registrados
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
                    vista === "mis_equipos") && (
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
                    {item.equipo}
                  </td>

                  <td>
                    {item.serie}
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
