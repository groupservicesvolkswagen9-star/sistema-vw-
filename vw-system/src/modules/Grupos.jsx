import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";

import { db } from "../firebase";
export default function Grupos({ rol }) {

  const [nombreGrupo, setNombreGrupo] =
    useState("");

  const [coordinador, setCoordinador] =
    useState("");

  const [grupos, setGrupos] =
    useState([]);

  const [usuarios, setUsuarios] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [mensaje, setMensaje] =
    useState("");

  const [busqueda, setBusqueda] =
    useState("");

  const [modoEdicion, setModoEdicion] =
    useState(false);

  const [grupoEditarId, setGrupoEditarId] =
    useState(null);

  const [gerencias, setGerencias] =
  useState([]);

  const [gerenciaSeleccionada,
  setGerenciaSeleccionada] =
  useState("");

  const [idGrupo, setIdGrupo] =
  useState("");

  useEffect(() => {

    const unsubscribeGrupos =
      onSnapshot(

        collection(db, "Grupos"),

        (snapshot) => {

          const lista =
            snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

          setGrupos(lista);
          setLoading(false);

        },

        (error) => {

          console.error(error);

          setMensaje(
            "Error cargando grupos"
          );

        }

      );

    const unsubscribeUsuarios =
      onSnapshot(

        collection(db, "Usuarios"),

        (snapshot) => {

          const lista =
            snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

          setUsuarios(lista);

        },
        
        (error) => {

          console.error(error);

          setMensaje(
            "Error cargando usuarios"
          );

        }

      );
      const unsubscribeGerencias =
  onSnapshot(

    collection(
      db,
      "Gerencias"
    ),

    (snapshot) => {

      const lista =
        snapshot.docs.map(
          doc => ({
            id: doc.id,
            ...doc.data()
          })
        );

      setGerencias(
        lista
      );

    }

  );
     return () => {

     unsubscribeGrupos();
      unsubscribeUsuarios();
      unsubscribeGerencias();

      };

  }, []);

  const limpiarFormulario =
    () => {

      setNombreGrupo("");
      setCoordinador("");
      setGerenciaSeleccionada("");
      setModoEdicion(false);

      setGrupoEditarId(null);
      setIdGrupo("");
    };

  const crearGrupo =
    async () => {

      const nombre =
        nombreGrupo.trim();

      if (
        !nombre ||
         !coordinador ||
        !gerenciaSeleccionada
      )
      {
      setMensaje(
      "Completa todos los campos"
      );

     return;
    }

      try {

 const idDuplicado =
  grupos.some(
    grupo =>
      grupo.grupoId === idGrupo
  );

if (idDuplicado) {

  setMensaje(
    "Ya existe ese ID de grupo"
  );

  return;
}

        const coordinadorOcupado =
          grupos.some(
            grupo =>
              grupo.coordinadorEmail ===
              coordinador
          );

        if (coordinadorOcupado) {

          setMensaje(
            "El coordinador ya tiene un grupo"
          );

          return;

        }

        const usuarioCoordinador =
          usuarios.find(
            usuario =>
              usuario.email ===
              coordinador
          );

const gerenciaData =
  gerencias.find(
    g =>
      g.id ===
      gerenciaSeleccionada
  );

const nuevoGrupo =
  await addDoc(

    collection(
      db,
      "Grupos"
    ),

    {
      grupoId: idGrupo,

      nombreGrupo: nombre,

      gerenciaId:
        gerenciaSeleccionada,

      gerenciaNombre:
        gerenciaData
          ?.nombreGerencia || "",

      coordinadorEmail:
        coordinador,

      coordinadorId:
        usuarioCoordinador?.id || ""

    }

  );
        if (usuarioCoordinador) {

          await updateDoc(

          doc(
          db,
          "Usuarios",
          usuarioCoordinador.id
        ),

        {
          grupoFirestoreId:
          nuevoGrupo.id,

          grupoId:
         idGrupo,

         grupoNombre:
        nombre
       }

        );

        }

        limpiarFormulario();

        setMensaje(
          "Grupo creado correctamente"
        );

      } catch (error) {

        console.error(error);

        setMensaje(
          "Error al crear grupo"
        );

      }

    };

const editarGrupo =
  (grupo) => {

    setModoEdicion(true);

    setGrupoEditarId(
      grupo.id
    );

    setNombreGrupo(
      grupo.nombreGrupo
    );

    setCoordinador(
      grupo.coordinadorEmail
    );

    setIdGrupo(
      grupo.grupoId || ""
    );

    setGerenciaSeleccionada(
      grupo.gerenciaId || ""
    );

  };
  const guardarEdicion =
    async () => {

      try {

        const grupoActual =
          grupos.find(
            grupo =>
              grupo.id ===
              grupoEditarId
          );

        const gerenciaData =
  gerencias.find(
    g =>
      g.id ===
      gerenciaSeleccionada
  );

await updateDoc(

  doc(
    db,
    "Grupos",
    grupoEditarId
  ),

  {
    grupoId: idGrupo,

    nombreGrupo,

    gerenciaId:
      gerenciaSeleccionada,

    gerenciaNombre:
      gerenciaData
        ?.nombreGerencia || "",

    coordinadorEmail:
      coordinador
     }

        );

        const usuariosGrupo =
        usuarios.filter(
        usuario =>
       usuario.grupoFirestoreId ===
       grupoEditarId
       );

        for (
          const usuario
          of usuariosGrupo
        ) {

         await updateDoc(

         doc(
         db,
        "Usuarios",
      usuario.id
      ),

     {
      grupoId:
      idGrupo,

    grupoNombre:
      nombreGrupo
   }

  );

        }

        limpiarFormulario();

        setMensaje(
          "Grupo actualizado correctamente"
        );
        setIdGrupo("");

      } catch (error) {

        console.error(error);

        setMensaje(
          "Error actualizando grupo"
        );

      }

    };

  const eliminarGrupo =
    async (grupo) => {

      const confirmar =
        window.confirm(
          `¿Eliminar el grupo ${grupo.nombreGrupo}?`
        );

      if (!confirmar)
        return;

      try {

        const usuariosGrupo =
  usuarios.filter(
    usuario =>
      usuario.grupoFirestoreId ===
      grupo.id
  );

        for (
          const usuario
          of usuariosGrupo
        ) {

          await updateDoc(

            doc(
              db,
              "Usuarios",
              usuario.id
            ),

            {
             grupoFirestoreId: "",
              grupoId: "",
              grupoNombre: ""
            }

          );

        }

        await deleteDoc(

          doc(
            db,
            "Grupos",
            grupo.id
          )

        );

        setMensaje(
          "Grupo eliminado correctamente"
        );

      } catch (error) {

        console.error(error);

        setMensaje(
          "Error eliminando grupo"
        );

      }

    };

  if (rol !== "admin") {

    return (

      <div className="sap-card">
        <h2>Grupos</h2>
        <p>No tienes acceso.</p>
      </div>

    );

  }

  if (loading) {

    return (

      <div className="sap-card">
        Cargando grupos...
      </div>

    );

  }

  const coordinadores =
    usuarios.filter(
      usuario =>
        usuario.rol
          ?.toLowerCase() ===
        "coordinador"
    );

  const empleados =
    usuarios.filter(
      usuario =>
        usuario.rol
          ?.toLowerCase() ===
        "empleado"
    );

  const gruposFiltrados =
    grupos.filter(
      grupo =>
        grupo.nombreGrupo
          ?.toLowerCase()
          .includes(
            busqueda.toLowerCase()
          )
    );

  return (

    <div
  className="sap-card sap-card-full"
  style={{
    width: "100%",
    display: "block"
  }}
>

      <h2>
        Administración de Grupos
      </h2>

      {mensaje && (

        <div
          style={{
            background:
              "#e8f5e9",
            border:
              "1px solid #4caf50",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "4px"
          }}
        >
          {mensaje}
        </div>

      )}

<input
  className="fb-input"
  placeholder="Asignar ID"
  value={idGrupo}
  onChange={(e) =>
    setIdGrupo(
      e.target.value
    )
  }
/>

      <input
        className="fb-input"
        placeholder="Nombre grupo"
        value={nombreGrupo}
        onChange={(e) =>
          setNombreGrupo(
            e.target.value
          )
        }
      />
      <select
      className="fb-input"
     value={gerenciaSeleccionada}
     onChange={(e) =>
     setGerenciaSeleccionada(
      e.target.value
     )
     }
      >

      <option value="">
       Seleccionar gerencia
       </option>

       {gerencias.map(
       gerencia => (

      <option
      key={gerencia.id}
      value={gerencia.id}
      >
      {gerencia.gerenciaId} - {gerencia.nombreGerencia}
      </option>

       )
       )}

      </select>
      <select
        className="fb-input"
        value={coordinador}
        onChange={(e) =>
          setCoordinador(
            e.target.value
          )
        }
      >

        <option value="">
          Seleccionar coordinador
        </option>

        {coordinadores.map(
          coordinador => (

            <option
              key={coordinador.id}
              value={
                coordinador.email
              }
            >
              {coordinador.nombre}{" "}
              {coordinador.apellido}
            </option>

          )
        )}

      </select>

      <button
        className="fb-btn"
        onClick={
          modoEdicion
            ? guardarEdicion
            : crearGrupo
        }
      >
        {
          modoEdicion
            ? "Guardar cambios"
            : "Crear Grupo"
        }
      </button>

      <table
  className="table"
  style={{
    width: "100%",
    
  }}
>

        <thead>

<tr>
  <th>ID</th>
  <th>Grupo</th>
  <th>Gerencia</th>
  <th>Información</th>
  <th>Acciones</th>
</tr>

        </thead>

        <tbody>

          {gruposFiltrados.map(
            grupo => {

              const colaboradores =
              empleados.filter(
              empleado =>
             empleado.grupoFirestoreId ===
             grupo.id
              );
              return (

                <tr
                  key={grupo.id}
                >
                  <td>
                   {grupo.grupoId}
                  </td>
                  <td>
                    {grupo.nombreGrupo}
                  </td>
                  <td>
                  {grupo.gerenciaNombre || "-"}
                  </td>
                  <td>

                    <strong>
                      Coordinador
                    </strong>

                    <div>
                      {
                        grupo.coordinadorEmail
                      }
                    </div>

                    <strong>
                      Colaboradores (
                      {
                        colaboradores.length
                      }
                      )
                    </strong>

                    <ul>

                      {
                        colaboradores.length === 0
                          ? (
                            <li>
                              Sin empleados
                            </li>
                          )
                          : (
                            colaboradores.map(
                              emp => (

                                <li
                                  key={emp.id}
                                >
                                  {emp.nombre}{" "}
                                  {
                                    emp.apellido
                                  }
                                </li>

                              )
                            )
                          )
                      }

                    </ul>

                  </td>

                  <td>

                    <button
                      onClick={() =>
                        editarGrupo(
                          grupo
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        eliminarGrupo(
                          grupo
                        )
                      }
                    >
                      Eliminar
                    </button>

                  </td>

                </tr>

              );

            }
          )}

        </tbody>

      </table>

    </div>

  );

}