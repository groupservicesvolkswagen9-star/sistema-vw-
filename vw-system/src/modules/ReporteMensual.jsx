import {
  useState,
  useEffect
} from "react";

import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

import { db } from "../firebase";

export default function ReporteMensual({
  user, rol
}) {
  const [reportes,
  setReportes] =
  useState([]);
  const [mes,
    setMes] =
    useState("");
  const [
  reporteSeleccionado,
  setReporteSeleccionado
  ] = useState(null);
  const [anio,
    setAnio] =
    useState(
      new Date()
      .getFullYear()
    );

  const [logros,
    setLogros] =
    useState("");

  const [problemas,
    setProblemas] =
    useState("");

  const [acciones,
    setAcciones] =
    useState("");

  const guardar =
    async () => {

      await addDoc(
        collection(
          db,
          "ReporteMensual"
        ),
        {
          mes,
          anio,

          grupoId:
            user.grupoId,

          grupoNombre:
            user.grupoNombre,

          responsable:
  user.email,

estado:
  "Pendiente Coordinador",
          sla,

        posicion,

        especialistaVWGS,

        responsables,
        periodo,
          logros,
          problemas,
          acciones,

        
          fecha:
          new Date()
          .toISOString()
        }
      );

      alert(
        "Reporte guardado"
        
      );
      setMes("");
    setLogros("");
    setProblemas("");
    setAcciones("");
    setPeriodo("");
    setSla(""); 
    setPosicion("");

    await cargarReportes();
    };const cargarReportes =
async () => {

  const snap =
    await getDocs(
      collection(
        db,
        "ReporteMensual"
      )
    );

 const datos =
  snap.docs.map(
    doc => ({
      id: doc.id,
      ...doc.data()
    })
  );

datos.sort(
  (a, b) =>
    new Date(b.fecha) -
    new Date(a.fecha)
);

setReportes(datos);

};

useEffect(() => {

  cargarReportes();

}, []);

const aprobarReporte =
async (id) => {

  if (
    !window.confirm(
      "¿Aprobar reporte?"
    )
  ) {
    return;
  }

  await updateDoc(
    doc(
      db,
      "ReporteMensual",
      id
    ),
    {
      estado:
      "Aprobado"
    }
  );
  alert(
  "Reporte aprobado"
);
  cargarReportes();

};
const rechazarReporte =
async (id) => {
  if (
    !window.confirm(
      "¿Rechazar reporte?"
    )
  ) {
    return;
  }
  await updateDoc(
    doc(
      db,
      "ReporteMensual",
      id
    ),
    {
      estado:
        "Rechazado"
    }
  );
  alert(
  "Reporte rechazado"
);
  cargarReportes();

};
const cancelarReporte =
async (id) => {

  if (
    !window.confirm(
      "¿Cancelar reporte?"
    )
  ) {
    return;
  }

  await updateDoc(
    doc(
      db,
      "ReporteMensual",
      id
    ),
    {
      estado:
        "Cancelado"
    }
  );
  alert(
  "Reporte cancelado"
);
  cargarReportes();

};
const eliminarReporte =
async (id) => {

  if (
    !window.confirm(
      "¿Eliminar reporte definitivamente?"
    )
  ) {
    return;
  }

  await deleteDoc(
    doc(
      db,
      "ReporteMensual",
      id
    )
  );

  cargarReportes();

};

const agregarResponsable =
  () => {

    setResponsables(
      [
        ...responsables,

        {
  responsableVWM: "",
  grupo: "",
  expandido: true,
  proyectos: []
}
      ]
    );

  };
  const eliminarResponsable =
  (index) => {

    if (
      !window.confirm(
        "¿Eliminar Responsable VWM?"
      )
    ) {
      return;
    }

    const copia =
      [...responsables];

    copia.splice(
      index,
      1
    );

    setResponsables(
      copia
    );

  };
  const toggleResponsable =
  (index) => {

    const copia =
      [...responsables];

    copia[index]
      .expandido =
      !copia[index]
        .expandido;

    setResponsables(
      copia
    );

  };
  const eliminarProyecto =
(
  rIndex,
  pIndex
) => {

  const copia =
    [...responsables];

  copia[rIndex]
    .proyectos
    .splice(
      pIndex,
      1
    );

  setResponsables(
    copia
  );

};
const [sla,
  setSla] =
  useState("");

const [posicion,
  setPosicion] =
  useState("");

const [especialistaVWGS,
  setEspecialistaVWGS] =
  useState(
    `${user?.nombre || ""}
     ${user?.apellido || ""}`
  );
const [responsables,
  setResponsables] =
  useState([
    {
      responsableVWM: "",
      grupo: "",

      expandido: true,

      proyectos: []
    }
  ]);
const agregarProyecto =
  (indexResponsable) => {

    const copia =
      [...responsables];

    copia[
      indexResponsable
    ].proyectos.push({

      proyecto: "",

      descripcion: "",

      hito1Soll: "",
      hito2Soll: "",
      hito3Soll: "",
      hito4Soll: "",
      hito5Soll: "",

      hito1Ist: "",
      hito2Ist: "",
      hito3Ist: "",
      hito4Ist: "",
      hito5Ist: "",

      siguientesPasos: "",

      riesgos: ""

    });

    setResponsables(
      copia
    );

  };
const [periodo,
  setPeriodo] =
  useState("");
let listaMostrar =
  reportes;
  if (
  rol ===
  "empleado"
) {

  listaMostrar =
    reportes.filter(
      item =>
        item.responsable ===
        user.email
    );

}
else if (
  rol ===
  "coordinador"
) {

  listaMostrar =
    reportes.filter(
      item =>
        item.grupoNombre ===
        user.grupoNombre
    );

}
else {

  listaMostrar =
    reportes;

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
        Reporte Mensual
      </h2>
      {
rol === "empleado" && (
<>
      <select
      
  className="fb-input"
  value={mes}
  onChange={e =>
    setMes(
      e.target.value
    )
  }
>

<option value="">
Seleccionar Mes
</option>

<option>Enero</option>
<option>Febrero</option>
<option>Marzo</option>
<option>Abril</option>
<option>Mayo</option>
<option>Junio</option>
<option>Julio</option>
<option>Agosto</option>
<option>Septiembre</option>
<option>Octubre</option>
<option>Noviembre</option>
<option>Diciembre</option>

</select>
<h3>
Responsables VWM
</h3>

<button
  type="button"
  onClick={agregarResponsable}
>
  + Agregar Responsable
</button>
{
responsables.map(
(
  responsable,
  rIndex
) => (

<div
  key={rIndex}
  className="sap-card sap-card-full"
  style={{
    width: "100%",
    display: "block"
  }}
>

<div
  style={{
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center"
  }}
>

<h4>

Responsable VWM

</h4>

<div>

<button
  type="button"
  onClick={() =>
    toggleResponsable(
      rIndex
    )
  }
>

{
responsable.expandido
? "🔼"
: "🔽"
}

</button>

<button
  type="button"
  onClick={() =>
    eliminarResponsable(
      rIndex
    )
  }
>

🗑️

</button>

</div>
</div>
{responsable.expandido && (

<>

<input
  className="fb-input"
  placeholder="Responsable Técnico VWM"

  value={
    responsable.responsableVWM
  }
  
  onChange={e => {

    const copia =
      [...responsables];

    copia[rIndex]
      .responsableVWM =
      e.target.value;

    setResponsables(
      copia
    );

  }}
/>

<input
  className="fb-input"
  placeholder="Grupo"

  value={
    responsable.grupo
  }

  onChange={e => {

    const copia =
      [...responsables];

    copia[rIndex]
      .grupo =
      e.target.value;

    setResponsables(
      copia
    );

  }}
/>

<button
  type="button"

  onClick={() =>
    agregarProyecto(
      rIndex
    )
  }
>

+ Proyecto

</button>
{
  
responsable.proyectos.map(
(
  proyecto,
  pIndex
) => (
<div
  key={pIndex}
  className="sap-card sap-card-full"
  style={{
    width: "100%",
    display: "block"
  }}
>

<h5>
Proyecto
</h5>
<button
  type="button"
  onClick={() =>
    eliminarProyecto(
      rIndex,
      pIndex
    )
  }
>

🗑️ Eliminar Proyecto

</button>
<input
  className="fb-input"
  placeholder="Proyecto"

  value={
    proyecto.proyecto
  }

  onChange={e => {

    const copia =
      [...responsables];

    copia[rIndex]
      .proyectos[pIndex]
      .proyecto =
      e.target.value;

    setResponsables(
      copia
    );

  }}
/>

<input
  className="fb-input"
  placeholder="Descripción"

  value={
    proyecto.descripcion
  }

  onChange={e => {

    const copia =
      [...responsables];

    copia[rIndex]
      .proyectos[pIndex]
      .descripcion =
      e.target.value;

    setResponsables(
      copia
    );

  }}
/>

<input
  className="fb-input"
  placeholder="Hito 1 SOLL"

  value={
    proyecto.hito1Soll
  }

  onChange={e => {

    const copia =
      [...responsables];

    copia[rIndex]
      .proyectos[pIndex]
      .hito1Soll =
      e.target.value;

    setResponsables(
      copia
    );

  }}
/>

<input
  className="fb-input"
  placeholder="Hito 2 SOLL"

  value={
    proyecto.hito2Soll
  }

  onChange={e => {

    const copia =
      [...responsables];

    copia[rIndex]
      .proyectos[pIndex]
      .hito2Soll =
      e.target.value;

    setResponsables(
      copia
    );

  }}
/>

<input
  className="fb-input"
  placeholder="Hito 3 SOLL"
/>

<input
  className="fb-input"
  placeholder="Hito 4 SOLL"
/>

<input
  className="fb-input"
  placeholder="Hito 5 SOLL"
/>

<input
  className="fb-input"
  placeholder="Hito 1 IST"
/>

<input
  className="fb-input"
  placeholder="Hito 2 IST"
/>

<input
  className="fb-input"
  placeholder="Hito 3 IST"
/>

<input
  className="fb-input"
  placeholder="Hito 4 IST"
/>

<input
  className="fb-input"
  placeholder="Hito 5 IST"
/>

<textarea
  className="fb-input"
  placeholder="Siguientes Pasos"
/>

<textarea
  className="fb-input"
  placeholder="Posibles Riesgos"
/>

</div>

)

)
}
</>

)}
</div>

)
)
}
<input
  className="fb-input"
  placeholder="SLA"
  value={sla}
  onChange={e =>
    setSla(
      e.target.value
    )
  }
/>

<input
  className="fb-input"
  placeholder="Posición"
  value={posicion}
  onChange={e =>
    setPosicion(
      e.target.value
    )
  }
/>

<input
  className="fb-input"
  placeholder="Especialista VWGS"
  value={especialistaVWGS}
  onChange={e =>
    setEspecialistaVWGS(
      e.target.value
    )
  }
/>


<input
  className="fb-input"
  placeholder="Periodo de reporte"
  value={periodo}
  onChange={e =>
    setPeriodo(
      e.target.value
    )
  }
/>
      <textarea
        placeholder="Logros"
        value={logros}
        onChange={e =>
          setLogros(
            e.target.value
          )
        }
      />

      <textarea
        placeholder="Problemas"
        value={problemas}
        onChange={e =>
          setProblemas(
            e.target.value
          )
        }
      />

      <textarea
        placeholder="Acciones"
        value={acciones}
        onChange={e =>
          setAcciones(
            e.target.value
          )
        }
      />
      <div
  className="sap-card sap-card-full"
  style={{
    width: "100%",
    display: "block"
  }}
>

<h3>
Vista Previa
</h3>

  <h4>
Responsables
</h4>

{
responsables.map(
(
 responsable,
 index
) => (

<div key={index}>

<p>

<b>
Responsable:
</b>

{" "}

{
responsable
.responsableVWM
}

</p>

<p>

<b>
Grupo:
</b>

{" "}

{
responsable.grupo
}

</p>

{
responsable.proyectos.map(
(proyecto,p) => (

<div
 key={p}
>

<p>

<b>
Proyecto:
</b>

{" "}

{
proyecto.proyecto
}

</p>

<p>

<b>
Descripción:
</b>

{" "}

{
proyecto.descripcion
}

</p>
<p>

<b>
Hito 1 SOLL:
</b>

{" "}

{
proyecto.hito1Soll
}

</p>
<p>

<b>
Hito 2 SOLL:
</b>

{" "}

{
proyecto.hito2Soll
}

</p>
</div>

))
}

</div>

))
}
<p>
<b>SLA:</b>
{" "}
{sla}
</p>

<p>
<b>Posición:</b>
{" "}
{posicion}
</p>

<p>
<b>Especialista VWGS:</b>
{" "}
{especialistaVWGS}
</p>

<p>
<b>Periodo:</b>
{" "}
{periodo}
</p>
<p>
<b>Mes:</b> {mes}
</p>

<p>
<b>Año:</b> {anio}
</p>

<p>
<b>Grupo:</b>
{" "}
{user.grupoNombre}
</p>

<p>
<b>Logros:</b>
{" "}
{logros}
</p>

<p>
<b>Problemas:</b>
{" "}
{problemas}
</p>

<p>
<b>Acciones:</b>
{" "}
{acciones}
</p>



</div>
      <button
        className="fb-btn"
        onClick={guardar}
      >
        Guardar
      </button>
</>

)}

    <div
  className="sap-card sap-card-full"
  style={{
    width: "100%",
    marginTop: "20px"
  }}
>

<h3>
Historial de Reportes
</h3>

<table className="table">

<thead>

<tr>
<th>
Acciones
</th>
<th>Mes</th>

<th>Año</th>

<th>Responsable</th>

<th>Grupo</th>

<th>Estado</th>

<th>Fecha</th>

</tr>

</thead>

<tbody>

{
listaMostrar.length === 0
?

<tr>

<td colSpan="7">

No hay reportes

</td>

</tr>

:

listaMostrar.map(
item => (

<tr
  key={item.id}
  onClick={() => {

    if (
      reporteSeleccionado?.id ===
      item.id
    ) {

      setReporteSeleccionado(
        null
      );

    } else {

      setReporteSeleccionado(
        item
      );

    }

  }}
  style={{
    cursor: "pointer",
    backgroundColor:
      reporteSeleccionado?.id ===
      item.id
        ? "#e3f2fd"
        : ""
  }}
>
<td>

{
rol === "coordinador" &&
item.estado === "Pendiente Coordinador" && (

<>
<button
  onClick={() =>
    aprobarReporte(
      item.id
    )
  }
>
✅
</button>

<button
  onClick={() =>
    rechazarReporte(
      item.id
    )
  }
>
❌
</button>
</>

)
}
{
rol === "admin" &&
item.estado !== "Cancelado" && (

<>
<button
  onClick={() =>
    cancelarReporte(
      item.id
    )
  }
>
🚫
</button>

<button
  onClick={() =>
    eliminarReporte(
      item.id
    )
  }
>
🗑️
</button>
</>

)
}

</td>

<td>
{item.mes}
</td>

<td>
{item.anio}
</td>

<td>
{item.responsable}
</td>

<td>
{item.grupoNombre}
</td>

<td>

<span
  style={{
    fontWeight:
      "bold",
    color:
  item.estado ===
  "Aprobado"
  ? "green"
  : item.estado ===
    "Rechazado"
  ? "red"
  : item.estado ===
    "Cancelado"
  ? "gray"
  : "orange"
  }}
>

{item.estado}

</span>

</td>

<td>

{
item.fecha
?
new Date(
item.fecha
).toLocaleDateString()
:
""
}

</td>
</tr>

))
}

</tbody>

</table>
{
reporteSeleccionado && (

<div
  className="sap-card sap-card-full"
  style={{
    marginTop: "20px"
  }}
>

<h3>
Detalle del Reporte
</h3>

<p>
<b>Mes:</b> {reporteSeleccionado.mes}
</p>

<p>
<b>Año:</b> {reporteSeleccionado.anio}
</p>

<p>
<b>Responsable:</b>{" "}
{reporteSeleccionado.responsable}
</p>

<p>
<b>Grupo:</b>{" "}
{reporteSeleccionado.grupoNombre}
</p>

<p>
<b>SLA:</b>{" "}
{reporteSeleccionado.sla}
</p>

<p>
<b>Posición:</b>{" "}
{reporteSeleccionado.posicion}
</p>

<p>
<b>Especialista VWGS:</b>{" "}
{reporteSeleccionado.especialistaVWGS}
</p>

<p>
<b>Periodo:</b>{" "}
{reporteSeleccionado.periodo}
</p>

<p>
<b>Logros:</b>{" "}
{reporteSeleccionado.logros}
</p>

<p>
<b>Problemas:</b>{" "}
{reporteSeleccionado.problemas}
</p>

<p>
<b>Acciones:</b>{" "}
{reporteSeleccionado.acciones}
</p>

<h4>
Responsables VWM
</h4>

{
reporteSeleccionado.responsables?.map(
(responsable, rIndex) => (

<div
  key={rIndex}
  style={{
    borderTop:
      "1px solid #ddd",
    marginTop: "10px",
    paddingTop: "10px"
  }}
>

<p>
<b>Responsable:</b>{" "}
{responsable.responsableVWM}
</p>

<p>
<b>Grupo:</b>{" "}
{responsable.grupo}
</p>

{
responsable.proyectos?.map(
(proyecto, pIndex) => (

<div
  key={pIndex}
  style={{
    marginLeft: "20px"
  }}
>

<p>
<b>Proyecto:</b>{" "}
{proyecto.proyecto}
</p>

<p>
<b>Descripción:</b>{" "}
{proyecto.descripcion}
</p>

<p>
<b>Hito 1 SOLL:</b>{" "}
{proyecto.hito1Soll}
</p>

<p>
<b>Hito 2 SOLL:</b>{" "}
{proyecto.hito2Soll}
</p>

<p>
<b>Siguientes Pasos:</b>{" "}
{proyecto.siguientesPasos}
</p>

<p>
<b>Riesgos:</b>{" "}
{proyecto.riesgos}
</p>

</div>

)
)

}

</div>

)
)

}

</div>

)
}
</div>
    </div>
    
  );
}