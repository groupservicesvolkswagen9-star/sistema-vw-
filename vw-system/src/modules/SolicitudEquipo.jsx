import { useState } from "react";

import {
  addDoc,
  collection
} from "firebase/firestore";

import { db } from "../firebase";

export default function SolicitudEquipo({
  user,
  volver
}) {

  const [tipoEquipo,
    setTipoEquipo] =
    useState("");

  const [modeloEquipo,
    setModeloEquipo] =
    useState("");

  const [motivo,
    setMotivo] =
    useState("");

  const [justificacion,
    setJustificacion] =
    useState("");

  const [nave,
    setNave] =
    useState("");

  const [ubicacion,
    setUbicacion] =
    useState("");

  const [rentaAnual,
    setRentaAnual] =
    useState("");

  const [licenciamiento,
    setLicenciamiento] =
    useState("");

  const [transferencia,
    setTransferencia] =
    useState("");

  const [telefono,
    setTelefono] =
    useState("");

  const [centroCostos,
    setCentroCostos] =
    useState("");

  const [sitioEntrega,
    setSitioEntrega] =
    useState("");

  const enviar =
    async () => {

      if (
        !tipoEquipo ||
        !modeloEquipo ||
        !motivo ||
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
    "equipo",

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

  sitioEntrega,

  tipoEquipo,

  modeloEquipo,

  motivo,

  justificacion,

  nave,

  ubicacion,

  rentaAnual,

  licenciamiento,

  transferencia,

  estado:
    "Pendiente Coordinador",

  fechaCreacion:
    new Date()
      .toISOString()

}

      );

      alert(
        "Solicitud de equipo enviada"
      );

      volver();

    };

  return (

    <div className="sap-card">

      <h2>
        💻 Solicitud de Equipo
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
        onChange={(e)=>
          setTelefono(
            e.target.value
          )
        }
      />

      <input
        className="fb-input"
        placeholder="Centro de Costos"
        value={centroCostos}
        onChange={(e)=>
          setCentroCostos(
            e.target.value
          )
        }
      />

      <hr />

      <h3>
        Usuario Final
      </h3>

      <select
        className="fb-input"
        value={sitioEntrega}
        onChange={(e)=>
          setSitioEntrega(
            e.target.value
          )
        }
      >
        <option value="">
          Lugar de entrega
        </option>

        <option>
          Puebla
        </option>

        <option>
          Silao
        </option>

      </select>

      <hr />

      <h3>
        Información del Equipo
      </h3>

      <select
        className="fb-input"
        value={tipoEquipo}
        onChange={(e)=>
          setTipoEquipo(
            e.target.value
          )
        }
      >
        <option value="">
          Tipo de Equipo
        </option>

        <option>
          Laptop
        </option>

        <option>
          Desktop
        </option>

        <option>
          Workstation
        </option>

        <option>
          Tablet
        </option>

      </select>

      <select
        className="fb-input"
        value={modeloEquipo}
        onChange={(e)=>
          setModeloEquipo(
            e.target.value
          )
        }
      >
        <option value="">
          Modelo de Equipo
        </option>

        <option>
          Dell
        </option>

        <option>
          HP
        </option>

        <option>
          Lenovo
        </option>

      </select>

      <select
        className="fb-input"
        value={motivo}
        onChange={(e)=>
          setMotivo(
            e.target.value
          )
        }
      >
        <option value="">
          Motivo de la Solicitud
        </option>

        <option>
          Nuevo Ingreso
        </option>

        <option>
          Reemplazo
        </option>

        <option>
          Proyecto
        </option>

        <option>
          Daño de Equipo
        </option>

      </select>

      <textarea
        className="fb-input"
        placeholder="Justificación"
        value={justificacion}
        onChange={(e)=>
          setJustificacion(
            e.target.value
          )
        }
      />

      <input
        className="fb-input"
        placeholder="Nave"
        value={nave}
        onChange={(e)=>
          setNave(
            e.target.value
          )
        }
      />

      <input
        className="fb-input"
        placeholder="Ubicación Física"
        value={ubicacion}
        onChange={(e)=>
          setUbicacion(
            e.target.value
          )
        }
      />

      <hr />

      <h3>
        Costos
      </h3>

      <input
        type="number"
        className="fb-input"
        placeholder="Costo renta anual USD"
        value={rentaAnual}
        onChange={(e)=>
          setRentaAnual(
            e.target.value
          )
        }
      />

      <input
        type="number"
        className="fb-input"
        placeholder="Costo licenciamiento anual USD"
        value={licenciamiento}
        onChange={(e)=>
          setLicenciamiento(
            e.target.value
          )
        }
      />

      <input
        type="number"
        className="fb-input"
        placeholder="Costo a transferir USD"
        value={transferencia}
        onChange={(e)=>
          setTransferencia(
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