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

export default function Vacaciones({
  user,
  rol,
  vista
}) {

  const [inicio, setInicio] =
    useState("");

  const [fin, setFin] =
    useState("");

  const [vacaciones,
    setVacaciones] =
    useState([]);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {

    const snap =
      await getDocs(
        collection(
          db,
          "Vacaciones"
        )
      );

    const lista =
      snap.docs.map(
        (item) => ({
          id: item.id,
          ...item.data()
        })
      );

    setVacaciones(lista);
  };

  const solicitar = async () => {

    if (!inicio || !fin) {

      alert(
        "Selecciona fechas"
      );

      return;
    }
console.log(
  "USER VACACIONES:",
  user
);
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

        grupoFirestoreId:
       user?.grupoFirestoreId || "",

       grupoId:
        user?.grupoId || "",

        grupoNombre:
       user?.grupoNombre || "",
        inicio,

        fin,

        estado:
  rol === "coordinador"
    ? "Pendiente Gerente"
    : "Pendiente",
      solicitanteRol:
       rol,

      fechaSolicitud:
      new Date()
     .toISOString()
       }
     );

    setInicio("");
    setFin("");

    cargar();
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

      cargar();
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

      cargar();
    };

  let datos = vacaciones;

  // EMPLEADO

  if (
    rol === "empleado"
  ) {

    datos =
      vacaciones.filter(
        (item) =>
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
        item.grupoFirestoreId ===
        user?.grupoFirestoreId
    );

}
// GERENTE
else if (
  rol === "gerente"
) {

  datos =
    vacaciones.filter(
      item =>

        item.solicitanteRol ===
          "coordinador"

        ||

        item.solicitanteRol ===
          "empleado"
    );

}

  // ADMIN

  else if (
    rol === "admin"
  ) {

    datos = vacaciones;
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
        Vacaciones
      </h2>

      {vista ===
        "vac_solicitar" && (

        <>

          <h4>
            Solicitud de vacaciones
          </h4>

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
              marginLeft:
                "10px"
            }}
          />

          <button
            onClick={
              solicitar
            }
            style={{
              marginLeft:
                "10px"
            }}
          >
            Solicitar
          </button>

        </>

      )}
{
rol === "gerente" && (

<div>

<h3>
Vacaciones Empleados
</h3>

{
Object.values(

datos
.filter(
 item =>
 item.solicitanteRol ===
 "empleado"
 )
.reduce(
  (acc, item) => {

   const grupo =
    item.grupoNombre ||
    "Sin Grupo";

   if (!acc[grupo]) {
    acc[grupo] = [];
   }

   acc[grupo].push(item);

   return acc;

  },
  {}
 )

).map(
 grupo => (

 <div
  key={
   grupo[0]
   ?.grupoNombre
  }
  className="sap-card"
 >

 <h4>
 {
  grupo[0]
  ?.grupoNombre
 }
 </h4>

 <ul>

 {
 grupo.map(
  vac => (

  <li
  key={vac.id}
>

  {vac.nombre}
  {" "}
  {vac.apellido}

  {" | "}

  {vac.inicio}

  {" a "}

  {vac.fin}

  {" | Estado: "}

  {vac.estado}

</li>
  )
 )
 }

 </ul>

 </div>

 )
)

}

<h3>
Vacaciones Coordinadores
</h3>

<ul>

{
datos
.filter(
 item =>
 item.solicitanteRol ===
 "coordinador"
)
.map(
 item => (

<li key={item.id}>

  {item.nombre}
  {" "}
  {item.apellido}

  {" | Grupo: "}

  {item.grupoNombre}

  {" | "}

  {item.inicio}

  {" a "}

  {item.fin}

  {" | Estado: "}

  {item.estado}

  {item.estado ===
    "Pendiente Gerente" && (

    <>

      <button
        style={{
          marginLeft: "10px"
        }}
        onClick={() =>
          actualizarEstado(
            item.id,
            "Aprobada"
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
          actualizarEstado(
            item.id,
            "Rechazada"
          )
        }
      >
        Rechazar
      </button>

    </>

  )}

</li>

)
)
}

</ul>

</div>

)
}
      {rol !== "gerente" && (

<table className="table">

        <thead>

          <tr>

            <th>
              Usuario
            </th>

            {(rol !==
              "empleado") && (
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
                <th>
               Tipo
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

            {rol !==
              "empleado" && (
              <th>
                Acciones
              </th>
            )}

          </tr>

        </thead>

        <tbody>

          {datos.length ===
          0 ? (

            <tr>

              <td colSpan="8">
                No existen
                solicitudes
              </td>

            </tr>

          ) : (

            datos.map(
              (item) => (

                <tr
                  key={item.id}
                >

                  <td>
                    {
                      item.usuario
                    }
                  </td>

                  {(rol !==
                    "empleado") && (
                    <>
                      <td>
                        {
                          item.nombre
                        }
                      </td>

                      <td>
                        {
                          item.apellido
                        }
                      </td>

                     <td>
                    {
                    item.grupoNombre
                    }
                    </td>
                    <td>
                   {item.solicitanteRol}
                    </td>
                    </>
                  )}

                  <td>
                    {
                      item.inicio
                    }
                  </td>

                  <td>
                    {
                      item.fin
                    }
                  </td>

                 <td>

  <span
    style={{
      fontWeight: "bold",
      color:
        item.estado === "Aprobada"
          ? "green"
          : item.estado === "Rechazada"
          ? "red"
          : item.estado === "Cancelada"
          ? "gray"
          : "orange"
    }}
  >
    {item.estado}
  </span>

</td>

                  {rol === "coordinador" &&
 item.solicitanteRol === "empleado" &&
 item.estado === "Pendiente" && (
                    <td>

                      <button
                        onClick={() =>
                          actualizarEstado(
                            item.id,
                            "Aprobada"
                          )
                        }
                      >
                        Aprobar
                      </button>

                      <button
                        onClick={() =>
                          actualizarEstado(
                            item.id,
                            "Rechazada"
                          )
                        }
                        style={{
                          marginLeft:
                            "5px"
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
                            "Cancelada"
                          )
                        }
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
                          marginLeft:
                            "5px"
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
)}
    </div>

  );

}