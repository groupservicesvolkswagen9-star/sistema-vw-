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

export default function Control({
  user,
  rol
}) {

  const [inicio, setInicio] =
    useState("");

  const [fin, setFin] =
    useState("");

  const [vacaciones,
    setVacaciones] =
    useState([]);

  useEffect(() => {
    cargarVacaciones();
  }, []);

  const cargarVacaciones =
    async () => {

      const snap =
        await getDocs(
          collection(
            db,
            "Vacaciones"
          )
        );

      const lista =
        snap.docs.map(
          item => ({
            id: item.id,
            ...item.data()
          })
        );

      setVacaciones(lista);
    };

  const solicitar =
    async () => {

      if (
        !inicio ||
        !fin
      ) {

        alert(
          "Selecciona fechas"
        );

        return;
      }

      await addDoc(
        collection(
          db,
          "Vacaciones"
        ),
        {
          usuario:
            user?.email,

          nombre:
            user?.nombre || "",

          apellido:
            user?.apellido || "",

          grupo:
            user?.grupo || "",

          inicio,

          fin,

          estado:
            "Pendiente",

          fechaCreacion:
            new Date()
              .toISOString()
        }
      );

      setInicio("");
      setFin("");

      cargarVacaciones();
    };

  const actualizarEstado =
    async (
      id,
      estado
    ) => {

      await updateDoc(
        doc(
          db,
          "Vacaciones",
          id
        ),
        {
          estado
        }
      );

      cargarVacaciones();
    };

  const eliminar =
    async (id) => {

      await deleteDoc(
        doc(
          db,
          "Vacaciones",
          id
        )
      );

      cargarVacaciones();
    };

  let datos = vacaciones;

  // EMPLEADO

  if (
    rol === "empleado"
  ) {

    datos =
      vacaciones.filter(
        item =>
          item.usuario ===
          user?.email
      );
  }

  // COORDINADOR

  else if (
    rol === "coordinador"
  ) {

    datos =
      vacaciones.filter(
        item =>
          item.grupo ===
          user?.grupo
      );
  }

  // ADMIN

  else if (
    rol === "admin"
  ) {

    datos = vacaciones;
  }

  return (

    <div className="sap-card">

      <h2>
        Vacaciones
      </h2>

      {rol === "empleado" && (

        <>

          <input
            type="date"
            value={inicio}
            onChange={(e) =>
              setInicio(
                e.target.value
              )
            }
          />

          <input
            type="date"
            value={fin}
            onChange={(e) =>
              setFin(
                e.target.value
              )
            }
            style={{
              marginLeft: "10px"
            }}
          />

          <button
            onClick={solicitar}
            style={{
              marginLeft: "10px"
            }}
          >
            Solicitar vacaciones
          </button>

        </>

      )}

      <table className="table">

        <thead>

          <tr>

            <th>
              Usuario
            </th>

            {rol !== "empleado" && (
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
              Inicio
            </th>

            <th>
              Fin
            </th>

            <th>
              Estado
            </th>

            {rol !== "empleado" && (
              <th>
                Acciones
              </th>
            )}

          </tr>

        </thead>

        <tbody>

          {datos.length === 0 ? (

            <tr>

              <td colSpan="8">
                No existen
                solicitudes
              </td>

            </tr>

          ) : (

            datos.map(
              item => (

                <tr
                  key={item.id}
                >

                  <td>
                    {item.usuario}
                  </td>

                  {rol !==
                    "empleado" && (
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
                    {item.inicio}
                  </td>

                  <td>
                    {item.fin}
                  </td>

                  <td>
                    {item.estado}
                  </td>

                  {rol ===
                    "coordinador" && (

                    <td>

                      <button
                        onClick={() =>
                          actualizarEstado(
                            item.id,
                            "Aprobado"
                          )
                        }
                      >
                        Aprobar
                      </button>

                      <button
                        onClick={() =>
                          actualizarEstado(
                            item.id,
                            "Rechazado"
                          )
                        }
                        style={{
                          marginLeft: "5px"
                        }}
                      >
                        Rechazar
                      </button>

                    </td>

                  )}

                  {rol ===
                    "admin" && (

                    <td>

                      <button
                        onClick={() =>
                          actualizarEstado(
                            item.id,
                            "Aprobado"
                          )
                        }
                      >
                        Aprobar
                      </button>

                      <button
                        onClick={() =>
                          actualizarEstado(
                            item.id,
                            "Rechazado"
                          )
                        }
                        style={{
                          marginLeft: "5px"
                        }}
                      >
                        Rechazar
                      </button>

                      <button
                        onClick={() =>
                          actualizarEstado(
                            item.id,
                            "Cancelado"
                          )
                        }
                        style={{
                          marginLeft: "5px"
                        }}
                      >
                        Cancelar
                      </button>

                      <button
                        onClick={() =>
                          eliminar(
                            item.id
                          )
                        }
                        style={{
                          marginLeft: "5px"
                        }}
                      >
                        Eliminar
                      </button>

                    </td>

                  )}

                </tr>

              )
            )

          )}

        </tbody>

      </table>

    </div>

  );
}