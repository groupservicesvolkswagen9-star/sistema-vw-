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

export default function Gerencias({ rol }) {

  const [gerenciaId,
    setGerenciaId] =
    useState("");

  const [nombreGerencia,
    setNombreGerencia] =
    useState("");

  const [gerenteEmail,
    setGerenteEmail] =
    useState("");

  const [gerencias,
    setGerencias] =
    useState([]);

  const [usuarios,
    setUsuarios] =
    useState([]);

  const [grupos,
    setGrupos] =
    useState([]);

  const [mensaje,
    setMensaje] =
    useState("");

  const [modoEdicion,
    setModoEdicion] =
    useState(false);

  const [gerenciaEditarId,
    setGerenciaEditarId] =
    useState(null);

  if (rol !== "admin") {

    return (

     <div
  className="sap-card sap-card-full"
  style={{
    width: "100%",
    display: "block"
  }}
>
        <h2>Gerencias</h2>
        <p>No tienes acceso.</p>
      </div>

    );

  }

  useEffect(() => {

    const unsubGerencias =
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

          setGerencias(lista);

        }

      );

    const unsubUsuarios =
      onSnapshot(

        collection(
          db,
          "Usuarios"
        ),

        (snapshot) => {

          const lista =
            snapshot.docs.map(
              doc => ({
                id: doc.id,
                ...doc.data()
              })
            );

          setUsuarios(lista);

        }

      );

    const unsubGrupos =
      onSnapshot(

        collection(
          db,
          "Grupos"
        ),

        (snapshot) => {

          const lista =
            snapshot.docs.map(
              doc => ({
                id: doc.id,
                ...doc.data()
              })
            );

          setGrupos(lista);

        }

      );

    return () => {

      unsubGerencias();
      unsubUsuarios();
      unsubGrupos();

    };

  }, []);

  const limpiarFormulario =
    () => {

      setGerenciaId("");
      setNombreGerencia("");
      setGerenteEmail("");

      setModoEdicion(false);
      setGerenciaEditarId(null);
    };

  const crearGerencia =
    async () => {

      if (
        !gerenciaId ||
        !nombreGerencia ||
        !gerenteEmail
      ) {

        setMensaje(
          "Completa todos los campos"
        );

        return;
      }

      const existe =
        gerencias.some(
          gerencia =>
            gerencia.gerenciaId ===
            gerenciaId
        );

      if (existe) {

        setMensaje(
          "Ya existe ese ID de gerencia"
        );

        return;
      }

      try {

        await addDoc(

          collection(
            db,
            "Gerencias"
          ),

          {
            gerenciaId,
            nombreGerencia,
            gerenteEmail
          }

        );

        limpiarFormulario();

        setMensaje(
          "Gerencia creada correctamente"
        );

      } catch (error) {

        console.error(error);

        setMensaje(
          "Error creando gerencia"
        );

      }

    };

  const editarGerencia =
    (gerencia) => {

      setModoEdicion(true);

      setGerenciaEditarId(
        gerencia.id
      );

      setGerenciaId(
        gerencia.gerenciaId
      );

      setNombreGerencia(
        gerencia.nombreGerencia
      );

      setGerenteEmail(
        gerencia.gerenteEmail
      );

    };

  const guardarEdicion =
    async () => {

      try {

        await updateDoc(

          doc(
            db,
            "Gerencias",
            gerenciaEditarId
          ),

          {
            gerenciaId,
            nombreGerencia,
            gerenteEmail
          }

        );

        limpiarFormulario();

        setMensaje(
          "Gerencia actualizada"
        );

      } catch (error) {

        console.error(error);

        setMensaje(
          "Error actualizando gerencia"
        );

      }

    };

  const eliminarGerencia =
    async (gerencia) => {

      const confirmar =
        window.confirm(
          `¿Eliminar ${gerencia.nombreGerencia}?`
        );

      if (!confirmar)
        return;

      try {

        await deleteDoc(

          doc(
            db,
            "Gerencias",
            gerencia.id
          )

        );

        setMensaje(
          "Gerencia eliminada"
        );

      } catch (error) {

        console.error(error);

        setMensaje(
          "Error eliminando gerencia"
        );

      }

    };

  const gerentes =
    usuarios.filter(
      usuario =>
        usuario.rol ===
        "gerente"
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
        Administración de Gerencias
      </h2>

      {mensaje && (

        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            background: "#e8f5e9",
            border:
              "1px solid #4caf50"
          }}
        >
          {mensaje}
        </div>

      )}

      <input
        className="fb-input"
        placeholder="ID Gerencia"
        value={gerenciaId}
        onChange={(e) =>
          setGerenciaId(
            e.target.value
          )
        }
      />

      <input
        className="fb-input"
        placeholder="Nombre Gerencia"
        value={nombreGerencia}
        onChange={(e) =>
          setNombreGerencia(
            e.target.value
          )
        }
      />

      <select
        className="fb-input"
        value={gerenteEmail}
        onChange={(e) =>
          setGerenteEmail(
            e.target.value
          )
        }
      >

        <option value="">
          Seleccionar gerente
        </option>

        {gerentes.map(
          gerente => (

            <option
              key={gerente.id}
              value={
                gerente.email
              }
            >
              {gerente.nombre}{" "}
              {gerente.apellido}
            </option>

          )
        )}

      </select>

      <button
        className="fb-btn"
        onClick={
          modoEdicion
            ? guardarEdicion
            : crearGerencia
        }
      >
        {
          modoEdicion
            ? "Guardar cambios"
            : "Crear Gerencia"
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

            <th>Gerencia</th>

            <th>Gerente</th>

            <th>Grupos</th>

            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          {gerencias.map(
            gerencia => {

              const gruposGerencia =
                grupos.filter(
                  grupo =>
                    grupo.gerenciaId ===
                    gerencia.id
                );

              return (

                <tr
                  key={gerencia.id}
                >

                  <td>
                    {
                      gerencia.gerenciaId
                    }
                  </td>

                  <td>
                    {
                      gerencia.nombreGerencia
                    }
                  </td>

                  <td>
                    {
                      gerencia.gerenteEmail
                    }
                  </td>

                  <td>

                    {
                      gruposGerencia.length
                    }

                    <ul>

                      {
                        gruposGerencia.map(
                          grupo => (

                            <li
                              key={grupo.id}
                            >
                              {
                                grupo.grupoId
                              }
                              {" - "}
                              {
                                grupo.nombreGrupo
                              }
                            </li>

                          )
                        )
                      }

                    </ul>

                  </td>

                  <td>

                    <button
                      onClick={() =>
                        editarGerencia(
                          gerencia
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        eliminarGerencia(
                          gerencia
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