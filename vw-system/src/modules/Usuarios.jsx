import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase";

export default function Usuarios({ rol }) {

  const [usuarios, setUsuarios] =
    useState([]);

  const [grupos, setGrupos] =
    useState([]);

  if (rol !== "admin") {

    return (

      <div className="sap-card">

        <h2>Usuarios</h2>

        <p>
          No tienes acceso.
        </p>

      </div>

    );
  }

  const cargar = async () => {

    const usuariosSnap =
      await getDocs(
        collection(
          db,
          "Usuarios"
        )
      );

    const listaUsuarios =
      usuariosSnap.docs.map(
        doc => ({
          id: doc.id,
          ...doc.data()
        })
      );
      listaUsuarios.sort(
  (a, b) => {

    const orden = {
      admin: 1,
      gerente: 2,
      coordinador: 3,
      empleado: 4
    };

    return (
      (orden[a.rol] || 99) -
      (orden[b.rol] || 99)
    );

  }
);
    setUsuarios(
      listaUsuarios
    );

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
  };

  useEffect(() => {
    cargar();
  }, []);

const cambiarRol = async (
  id,
  nuevoRol
) => {

  const datosActualizar = {
    rol: nuevoRol
  };

  if (
    nuevoRol !== "empleado" &&
    nuevoRol !== "coordinador"
  ) {

    datosActualizar.grupoFirestoreId = "";
    datosActualizar.grupoId = "";
    datosActualizar.grupoNombre = "";

  }

  await updateDoc(
    doc(
      db,
      "Usuarios",
      id
    ),
    datosActualizar
  );

  cargar();

};
const cambiarGrupo = async (
  id,
  grupoFirestoreId
) => {

  if (!grupoFirestoreId) {

    await updateDoc(
      doc(
        db,
        "Usuarios",
        id
      ),
      {
        grupoFirestoreId: "",
        grupoId: "",
        grupoNombre: ""
      }
    );

    cargar();
    return;

  }
const usuarioActual =
  usuarios.find(
    usuario =>
      usuario.id === id
  );

if (
  usuarioActual?.rol ===
  "coordinador"
) {

  const coordinadorExistente =
    usuarios.find(
      usuario =>
        usuario.id !== id &&
        usuario.rol ===
          "coordinador" &&
        usuario.grupoFirestoreId ===
          grupoFirestoreId
    );

  if (coordinadorExistente) {

   alert(
  `El grupo ya tiene asignado a ${coordinadorExistente.nombre} ${coordinadorExistente.apellido}`
);

    return;

  }

}
  const grupoSeleccionado =
    grupos.find(
      grupo =>
        grupo.id ===
        grupoFirestoreId
    );

  await updateDoc(
    doc(
      db,
      "Usuarios",
      id
    ),
    {
      grupoFirestoreId,
      grupoId:
        grupoSeleccionado?.grupoId || "",
      grupoNombre:
        grupoSeleccionado?.nombreGrupo || ""
    }
  );

  cargar();

};

const eliminarUsuario =
  async (id) => {

    const confirmar =
      window.confirm(
        "¿Eliminar usuario?"
      );

    if (!confirmar)
      return;

    await deleteDoc(
      doc(
        db,
        "Usuarios",
        id
      )
    );

    cargar();

  };

  return (

    <div className="sap-card sap-card-full">
      <h2>
        Administración de Usuarios
      </h2>

     <div
  style={{
    overflowX: "auto"
  }}
>

  <table
    className="table"
    style={{
      width: "100%",
      
    }}
  >

    <thead>

          <tr>

            <th>
              Nombre
            </th>

            <th>
              Email
            </th>

            <th>
              Rol
            </th>

            <th>Grupo</th>
            <th>ID Grupo</th>
            <th>ID Firestore</th>
            <th>
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {usuarios.map(
            usuario => (

            <tr
              key={usuario.id}
            >

              <td>

                {usuario.nombre}
                {" "}
                {usuario.apellido}

              </td>

              <td>
                {usuario.email}
              </td>

              <td>

                  <select
                  value={
                  usuario.rol || "empleado"
                  }

                  onChange={(e)=>
                    cambiarRol(
                      usuario.id,
                      e.target.value
                    )
                  }
                >

                  <option value="empleado">
  Empleado
</option>

<option value="coordinador">
  Coordinador
</option>

<option value="gerente">
  Gerente
</option>

<option value="admin">
  Admin
</option>
                </select>

              </td>

              <td>

  {(
  usuario.rol === "empleado" ||
  usuario.rol === "coordinador"
) ? (
    <>
      <div
        style={{
          fontSize: "12px",
          marginBottom: "5px"
        }}
      >
        {usuario.grupoNombre || "Sin grupo"}
      </div>

      <select
       value={
  usuario.grupoFirestoreId || ""}
        onChange={(e) =>
          cambiarGrupo(
            usuario.id,
            e.target.value
          )
        }
      >
        <option value="">
          Seleccionar grupo
        </option>

        {grupos.map((grupo) => (

          <option
  key={grupo.id}
  value={grupo.id}
>
  {grupo.grupoId} - {grupo.nombreGrupo}
</option>

        ))}

      </select>

    </>

  ) : (
    "-"
  )}

</td>
<td
  style={{
    maxWidth: "250px",
    wordBreak: "break-all",
    fontSize: "12px"
  }}
>
  {usuario.grupoId || "-"}
</td>

<td
  style={{
    maxWidth: "250px",
    wordBreak: "break-all",
    fontSize: "11px"
  }}
>
  {usuario.grupoFirestoreId || "-"}
</td>

<td>
  <button
    onClick={() =>
      eliminarUsuario(
        usuario.id
      )
    }
  >
    Eliminar
  </button>
</td>

            </tr>

          ))}

        </tbody>

        </table>

    </div>

    </div>

  );
}