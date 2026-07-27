import { useState } from "react";

import {
  addDoc,
  collection
} from "firebase/firestore";

import { db } from "../firebase";

export default function SolicitudPrima({
  user,
  volver
}) {

  const [servicio,
    setServicio] =
    useState("");

  const [proyecto,
    setProyecto] =
    useState("");

  const [area,
    setArea] =
    useState("");

  const [descripcionServicio,
    setDescripcionServicio] =
    useState("");

  const [descripcionRealizada,
    setDescripcionRealizada] =
    useState("");

  const [fecha1,
    setFecha1] =
    useState("");

  const [fecha2,
    setFecha2] =
    useState("");

  const [fecha3,
    setFecha3] =
    useState("");

  const [horario,
    setHorario] =
    useState("");

  const [horas,
    setHoras] =
    useState("");

  const [equipoTrabajo,
    setEquipoTrabajo] =
    useState("");

  const [justificacion,
    setJustificacion] =
    useState("");

  const enviar = async () => {

    if (
      !servicio ||
      !descripcionServicio ||
      !fecha1
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

        tipo: "prima",

        usuario:
          user?.email,

        nombre:
          user?.nombre || "",

        apellido:
          user?.apellido || "",

        grupo:
          user?.grupo || "",

        servicio,

        proyecto,

        area,

        descripcionServicio,

        descripcionRealizada,

        fecha1,

        fecha2,

        fecha3,

        horario,

        horas,

        equipoTrabajo,

        justificacion,

        estado:
          "Pendiente",

        fechaCreacion:
          new Date()
            .toISOString()

      }

    );

    alert(
      "Solicitud de prima enviada"
    );

    volver();

  };

  return (

    <div className="sap-card">

      <h2>
        💰 Solicitud de Prima
      </h2>

      <h3>
        Información General
      </h3>

      <input
        className="fb-input"
        placeholder="Servicio solicitado"
        value={servicio}
        onChange={(e) =>
          setServicio(
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
        placeholder="Área que realizará el servicio"
        value={area}
        onChange={(e) =>
          setArea(
            e.target.value
          )
        }
      />

      <hr />

      <h3>
        Descripción
      </h3>

      <textarea
        className="fb-input"
        placeholder="Descripción del servicio"
        value={descripcionServicio}
        onChange={(e) =>
          setDescripcionServicio(
            e.target.value
          )
        }
      />

      <textarea
        className="fb-input"
        placeholder="Descripción del servicio realizado / entregado"
        value={descripcionRealizada}
        onChange={(e) =>
          setDescripcionRealizada(
            e.target.value
          )
        }
      />

      <hr />

      <h3>
        Fechas y Horarios
      </h3>

      <label>
        Fecha 1
      </label>

      <input
        type="date"
        className="fb-input"
        value={fecha1}
        onChange={(e) =>
          setFecha1(
            e.target.value
          )
        }
      />

      <label>
        Fecha 2
      </label>

      <input
        type="date"
        className="fb-input"
        value={fecha2}
        onChange={(e) =>
          setFecha2(
            e.target.value
          )
        }
      />

      <label>
        Fecha 3
      </label>

      <input
        type="date"
        className="fb-input"
        value={fecha3}
        onChange={(e) =>
          setFecha3(
            e.target.value
          )
        }
      />

      <input
        className="fb-input"
        placeholder="Horario (Ej. 08:00 - 17:00)"
        value={horario}
        onChange={(e) =>
          setHorario(
            e.target.value
          )
        }
      />

      <input
        className="fb-input"
        placeholder="Horas invertidas"
        value={horas}
        onChange={(e) =>
          setHoras(
            e.target.value
          )
        }
      />

      <hr />

      <h3>
        Recursos
      </h3>

      <input
        className="fb-input"
        placeholder="Equipo de trabajo"
        value={equipoTrabajo}
        onChange={(e) =>
          setEquipoTrabajo(
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