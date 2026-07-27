import { useState, useEffect } from "react";

import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase";

import SolicitudViaje from "./SolicitudViaje";
import SolicitudPrima from "./SolicitudPrima";
import SolicitudEquipo from "./SolicitudEquipo";
import SolicitudSistema from "./SolicitudSistemas";

export default function Solicitudes({
  user,
  rol
}) {

  const [tipo, setTipo] =
    useState("");

  const [solicitudes,
    setSolicitudes] =
    useState([]);

  useEffect(() => {

    obtenerSolicitudes();

  }, []);

  const obtenerSolicitudes =
    async () => {

      try {

        const snapshot =
          await getDocs(
            collection(
              db,
              "Solicitudes"
            )
          );

        const datos =
          snapshot.docs.map(
            item => ({
              id: item.id,
              ...item.data()
            })
          );

        setSolicitudes(
          datos
        );

      } catch (error) {

        console.error(error);

      }

    };

const aprobar = async (
  id,
  estadoActual
) => {

  let nuevoEstado =
    "Aprobada";

  if (
    estadoActual ===
    "Pendiente Coordinador"
  ) {

    nuevoEstado =
      "Pendiente Gerente";

  }

  await updateDoc(

    doc(
      db,
      "Solicitudes",
      id
    ),

    {
      estado:
        nuevoEstado
    }

  );

  obtenerSolicitudes();

  };

  const rechazar = async (id) => {

    await updateDoc(

      doc(
        db,
        "Solicitudes",
        id
      ),

      {
        estado:
          "Rechazada"
      }

    );

    obtenerSolicitudes();

  };

  const eliminar = async (id) => {

    await deleteDoc(

      doc(
        db,
        "Solicitudes",
        id
      )

    );

    obtenerSolicitudes();

  };

  let listaMostrar =
    solicitudes;

  if (
    rol === "empleado"
  ) {

    listaMostrar =
      solicitudes.filter(
        item =>
          item.usuario ===
          user?.email
      );

  }

 else if (
  rol === "coordinador"
) {

  listaMostrar =
    solicitudes.filter(
      item =>
        item.grupoFirestoreId ===
        user?.grupoFirestoreId
    );

}
  else if (
  rol === "gerente"
) {

  listaMostrar =
    solicitudes.filter(
      item =>

        item.estado ===
          "Pendiente Gerente"

        ||

        item.estado ===
          "Aprobada"

        ||

        item.estado ===
          "Rechazada"
    );

}
  if (
    tipo === "viaje"
  ) {

    return (

      <SolicitudViaje
        user={user}
        volver={() =>
          setTipo("")
        }
      />

    );

  }

  if (
    tipo === "prima"
  ) {

    return (

      <SolicitudPrima
        user={user}
        volver={() =>
          setTipo("")
        }
      />

    );

  }

  if (
    tipo === "equipo"
  ) {

    return (

      <SolicitudEquipo
        user={user}
        volver={() =>
          setTipo("")
        }
      />

    );

  }

  if (
    tipo === "sistema"
  ) {

    return (

      <SolicitudSistema
        user={user}
        volver={() =>
          setTipo("")
        }
      />

    );

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
        Solicitudes
      </h2>

      {rol === "empleado" && (

        <div
          className="sap-cards"
        >

          <div
            className="sap-card"
            onClick={() =>
              setTipo(
                "viaje"
              )
            }
          >
            <h3>
              ✈ Solicitud Viaje
            </h3>
          </div>

          <div
            className="sap-card"
            onClick={() =>
              setTipo(
                "prima"
              )
            }
          >
            <h3>
              💰 Solicitud Prima
            </h3>
          </div>

          <div
            className="sap-card"
            onClick={() =>
              setTipo(
                "equipo"
              )
            }
          >
            <h3>
              💻 Solicitud Equipo
            </h3>
          </div>

          <div
            className="sap-card"
            onClick={() =>
              setTipo(
                "sistema"
              )
            }
          >
            <h3>
              🖥 Solicitud Sistema
            </h3>
          </div>

        </div>

      )}
{rol === "empleado" && (

  <>
  
    <h3
      style={{
        marginTop: "25px",
        marginBottom: "10px"
      }}
    >
      Mis Solicitudes
    </h3>

    <table className="table">

      ...

    </table>

  </>

)}
{rol === "empleado" && (

  <table className="table">

    <thead>
      <tr>
        <th>Categoría</th>
        <th>Estado</th>
        <th>Fecha</th>
      </tr>
    </thead>

    <tbody>

      {listaMostrar.length === 0 ? (

        <tr>
          <td colSpan="3">
            No tienes solicitudes
          </td>
        </tr>

      ) : (

        listaMostrar.map(item => (

          <tr key={item.id}>

            <td>{item.tipo}</td>

            <td>
              <span
                style={{
                  fontWeight: "bold",
                  color:
                    item.estado === "Aprobada"
                      ? "green"
                      : item.estado === "Rechazada"
                      ? "red"
                      : "orange"
                }}
              >
                {item.estado}
              </span>
            </td>

            <td>
              {item.fechaCreacion
                ? new Date(
                    item.fechaCreacion
                  ).toLocaleDateString()
                : ""
              }
            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

)}
      {rol !== "empleado" && (

        <table className="table">

          <thead>

            <tr>

              <th>
              Categoría
              </th>

              <th>
                Correo
              </th>

              <th>
                Nombre
              </th>

              <th>
                Grupo
              </th>
              <th>
              Nivel
              </th>
              <th>
                Estado
              </th>

              <th>
                Fecha
              </th>

              <th>
                Acciones
              </th>
            </tr>

          </thead>

          <tbody>

            {listaMostrar.length === 0 ? (

              <tr>

                <td colSpan="8">

                  No existen solicitudes

                </td>

              </tr>

            ) : (

              listaMostrar.map(
                item => (

                  <tr
                    key={item.id}
                  >

                    <td>
                      {
                        item.tipo
                      }
                    </td>

                    <td>
                      {
                        item.usuario
                      }
                    </td>

                    <td>
                      {item.nombre}
                      {" "}
                      {item.apellido}
                    </td>

                    <td>
                    {item.grupoNombre}
                    </td>
                     
                      <td>

                      {
                      item.estado ===
                      "Pendiente Coordinador"

                      ? "Coordinador"

                     : item.estado ===
                      "Pendiente Gerente"

                     ? "Gerente"

                    : "-"
                     }

                    </td>
                    <td>

                 <span
               style={{
              fontWeight: "bold",
                color:

                item.estado ===
                    "Aprobada"

                    ? "green"

                   : item.estado ===
                      "Rechazada"

                         ? "red"

                      : "orange"
                      }}
                       >
                      {item.estado}
                     </span>

                    </td>

                    <td>
                      {item.fechaCreacion
                        ? new Date(
                            item.fechaCreacion
                          )
                            .toLocaleDateString()
                        : ""
                      }
                    </td>

                    <td>


{rol === "coordinador" &&
 item.estado ===
 "Pendiente Coordinador" && (

 <>
   <button
     onClick={() =>
       aprobar(
         item.id,
         item.estado
       )
     }
   >
     Aprobar
   </button>

   <button
     style={{
       marginLeft: "5px"
     }}
     onClick={() =>
       rechazar(
         item.id
       )
     }
   >
     Rechazar
   </button>
 </>
)}
{rol === "gerente" &&
 item.estado ===
 "Pendiente Gerente" && (

 <>
   <button
     onClick={() =>
       aprobar(
         item.id,
         item.estado
       )
     }
   >
     Aprobar
   </button>

   <button
     style={{
       marginLeft: "5px"
     }}
     onClick={() =>
       rechazar(
         item.id
       )
     }
   >
     Rechazar
   </button>
 </>
)}
  {rol === "admin" && (

    <button
      style={{
        marginLeft: "5px"
      }}
      onClick={() =>
        eliminar(
          item.id
        )
      }
    >
      Eliminar
    </button>

  )}

</td>

                  </tr>

                )

              )

            )}

          </tbody>

        </table>

      )}

    </div>

  );

}