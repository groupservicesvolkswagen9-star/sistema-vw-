import { useState } from "react";

import {
  addDoc,
  collection
} from "firebase/firestore";

import { db } from "../firebase";

export default function SolicitudViaje({
  user,
  volver
}) {

  const [fechaSalida, setFechaSalida] =
    useState("");

  const [fechaRegreso, setFechaRegreso] =
    useState("");

  const [destino, setDestino] =
    useState("");

  const [centroCosto, setCentroCosto] =
    useState("");

  const [nc, setNc] =
    useState("");

  const [proyecto, setProyecto] =
    useState("");

  const [componente, setComponente] =
    useState("");

  const [leyNorma, setLeyNorma] =
    useState("");

  const [cliente, setCliente] =
    useState("");

  const [justificacion, setJustificacion] =
    useState("");

  const [observaciones, setObservaciones] =
    useState("");

  const enviar = async () => {

    if (
      !fechaSalida ||
      !fechaRegreso ||
      !destino ||
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
  tipo: "viaje",

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

  fechaSalida,

  fechaRegreso,

  destino,

  centroCosto,

  nc,

  proyecto,

  componente,

  leyNorma,

  cliente,

  justificacion,

  observaciones,

  estado:
    "Pendiente Coordinador",

  fechaCreacion:
    new Date()
      .toISOString()

}
    );

    alert(
      "Solicitud enviada correctamente"
    );

    volver();

  };

  return (

    <div className="sap-card">

      <h2>
        ✈ Solicitud de Viaje
      </h2>

      <h3>
        Datos del Viaje
      </h3>

      <input
        type="date"
        className="fb-input"
        value={fechaSalida}
        onChange={(e) =>
          setFechaSalida(
            e.target.value
          )
        }
      />

      <input
        type="date"
        className="fb-input"
        value={fechaRegreso}
        onChange={(e) =>
          setFechaRegreso(
            e.target.value
          )
        }
      />

      <input
        className="fb-input"
        placeholder="Destino"
        value={destino}
        onChange={(e) =>
          setDestino(
            e.target.value
          )
        }
      />

      <input
        className="fb-input"
        placeholder="Punto de financiamiento / CC"
        value={centroCosto}
        onChange={(e) =>
          setCentroCosto(
            e.target.value
          )
        }
      />

      <hr />

      <h3>
        Datos del Proyecto
      </h3>

      <input
        className="fb-input"
        placeholder="NC"
        value={nc}
        onChange={(e) =>
          setNc(
            e.target.value
          )
        }
      />

      <input
        className="fb-input"
        placeholder="Proyecto"
        value={proyecto}
        onChange={(e) =>
          setProyecto(
            e.target.value
          )
        }
      />

      <input
        className="fb-input"
        placeholder="Componente"
        value={componente}
        onChange={(e) =>
          setComponente(
            e.target.value
          )
        }
      />

      <input
        className="fb-input"
        placeholder="Ley / Norma"
        value={leyNorma}
        onChange={(e) =>
          setLeyNorma(
            e.target.value
          )
        }
      />

      <input
        className="fb-input"
        placeholder="Cliente solicitante"
        value={cliente}
        onChange={(e) =>
          setCliente(
            e.target.value
          )
        }
      />

      <textarea
        className="fb-input"
        placeholder="Justificación"
        value={justificacion}
        onChange={(e) =>
          setJustificacion(
            e.target.value
          )
        }
      />

      <textarea
        className="fb-input"
        placeholder="Observaciones"
        value={observaciones}
        onChange={(e) =>
          setObservaciones(
            e.target.value
          )
        }
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px"
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