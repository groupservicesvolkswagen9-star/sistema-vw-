import { useState } from "react";

import {
  addDoc,
  collection
} from "firebase/firestore";

import { db } from "../firebase";

export default function SolicitudSistema({
  user,
  volver
}) {

  const [telefono,
    setTelefono] =
    useState("");

  const [centroCostos,
    setCentroCostos] =
    useState("");

  const [software,
    setSoftware] =
    useState("");

  const [computerId,
    setComputerId] =
    useState("");

  const [justificacion,
    setJustificacion] =
    useState("");

  const [lugarEntrega,
    setLugarEntrega] =
    useState("");

  const enviar = async () => {

    if (
      !software ||
      !computerId ||
      !justificacion
    ) {

      alert(
        "Completa los campos obligatorios"
      );

      return;

    }

    await addDoc(

      collection(
        db,
        "Solicitudes"
      ),

      {
  tipo:
    "sistema",

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

  solicitanteRol:
    user?.rol || "empleado",

  telefono,

  centroCostos,

  software,

  computerId,

  justificacion,

  lugarEntrega,

  estado:
    "Pendiente Coordinador",

  fechaCreacion:
    new Date()
      .toISOString()

}

    );

    alert(
      "Solicitud de software enviada"
    );

    volver();

  };

  return (

    <div className="sap-card">

      <h2>
        🖥 Solicitud de Software
      </h2>

      <h3>
        Solicitante
      </h3>

      <input
        className="fb-input"
        value={`${user?.nombre || ""} ${user?.apellido || ""}`}
        disabled
      />

      <input
        className="fb-input"
        value={user?.email || ""}
        disabled
      />

      <input
        className="fb-input"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) =>
          setTelefono(
            e.target.value
          )
        }
      />

      <input
        className="fb-input"
        placeholder="Centro de Costos"
        value={centroCostos}
        onChange={(e) =>
          setCentroCostos(
            e.target.value
          )
        }
      />

      <hr />

      <h3>
        Usuario Final
      </h3>

      <input
        className="fb-input"
        value={`${user?.nombre || ""} ${user?.apellido || ""}`}
        disabled
      />

      <input
        className="fb-input"
        value={user?.email || ""}
        disabled
      />

      <hr />

      <h3>
        Software Solicitado
      </h3>

      <select
        className="fb-input"
        value={software}
        onChange={(e) =>
          setSoftware(
            e.target.value
          )
        }
      >

        <option value="">
          Selecciona software
        </option>

        <option>
          Microsoft Office
        </option>

        <option>
          MATLAB
        </option>

        <option>
          CANoe
        </option>

        <option>
          CANalyzer
        </option>

        <option>
          ETAS INCA
        </option>

        <option>
          ADTF
        </option>

        <option>
          Jira
        </option>

        <option>
          Confluence
        </option>

        <option>
          Instalación de Software
        </option>

        <option>
          Otro
        </option>

      </select>

      <input
        className="fb-input"
        placeholder="Computer ID"
        value={computerId}
        onChange={(e) =>
          setComputerId(
            e.target.value
          )
        }
      />

      <textarea
        className="fb-input"
        placeholder="Justificación de la instalación"
        value={justificacion}
        onChange={(e) =>
          setJustificacion(
            e.target.value
          )
        }
      />

      <hr />

      <h3>
        Lugar de Entrega
      </h3>

      <select
        className="fb-input"
        value={lugarEntrega}
        onChange={(e) =>
          setLugarEntrega(
            e.target.value
          )
        }
      >

        <option value="">
          Seleccionar ubicación
        </option>

        <option>
          Puebla
        </option>

        <option>
          Silao
        </option>

      </select>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px"
        }}
      >

        <button
          className="fb-btn"
          onClick={enviar}
        >
          Enviar Solicitud
        </button>

        <button
          className="fb-btn-secondary"
          onClick={volver}
        >
          Regresar
        </button>

      </div>

    </div>

  );

}