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
    const [
  filtroMes,
  setFiltroMes
] = useState("");

  const [
  filtroAnio,
  setFiltroAnio
  ] = useState("");
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
      if (!mes) {
      alert(
      "Seleccione un mes"
     );
       return;
      }
      const existe =
     reportes.some(
     item =>
      item.usuario === user.email &&
      item.mesClave === `${mes}-${anio}` &&
      item.estado !== "Cancelado"
    );

    if (existe) {
   alert(
    "Ya existe un reporte para ese mes"
   );
     return;
  }
      await addDoc(
        collection(
          db,
          "ReporteMensual"
        ),
        {
          mes,
          anio:Number(anio),
          mesClave:`${mes}-${anio}`,
          grupoId:
            user.grupoId,

          grupoNombre:
            user.grupoNombre,

          responsable:
          user.email,

          usuario:
          user.email,

          nombre:
          user.nombre || "",

          apellido:
          user.apellido || "",
          estado:
          "Capturado",
          cierreDisponible: true,
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
      setReporteSeleccionado(
     null
    );
      setMes("");
    setLogros("");
    setProblemas("");
    setAcciones("");
    setPeriodo("");
    setSla(""); 
    setPosicion("");
    setResponsables([
  {
    responsableVWM: "",
    rolResponsabilidad: "",
    grupo: "",
    expandido: true,
    proyectos: []
  }
]);
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
  rolResponsabilidad: "",
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
const agregarHito = (
  rIndex,
  pIndex
) => {

  const copia =
    [...responsables];

  copia[rIndex]
    .proyectos[pIndex]
    .hitos.push({
      nombre: "",
      soll: "",
      ist: ""
    });

  setResponsables(copia);

};
const eliminarHito = (
  rIndex,
  pIndex,
  hIndex
) => {

  const copia =
    [...responsables];

  copia[rIndex]
    .proyectos[pIndex]
    .hitos.splice(
      hIndex,
      1
    );

  setResponsables(copia);

};
const agregarRiesgo = (
 rIndex,
 pIndex
) => {

 const copia =
   [...responsables];

 copia[rIndex]
   .proyectos[pIndex]
   .riesgos.push("");

 setResponsables(copia);

};
const eliminarRiesgo = (
 rIndex,
 pIndex,
 riesgoIndex
) => {

 const copia =
   [...responsables];

 copia[rIndex]
   .proyectos[pIndex]
   .riesgos.splice(
     riesgoIndex,
     1
   );

 setResponsables(copia);

};
const agregarPaso = (
  rIndex,
  pIndex
) => {

  const copia =
    [...responsables];

  copia[rIndex]
    .proyectos[pIndex]
    .siguientesPasos.push(
      ""
    );

  setResponsables(
    copia
  );

};
const eliminarPaso = (
  rIndex,
  pIndex,
  pasoIndex
) => {

  const copia =
    [...responsables];

  copia[rIndex]
    .proyectos[pIndex]
    .siguientesPasos.splice(
      pasoIndex,
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
      rolResponsabilidad: "",
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

  estado: "Verde",

  avance: 0,

  siguientesPasos: [""],

  riesgos: [""],
  hitos: [
  {
    nombre: "",
    soll: "",
    ist: ""
  }
]

});

    setResponsables(
      copia
    );

  };
const [periodo,
  setPeriodo] =
  useState("");
let listaMostrar = reportes;

if (rol === "empleado") {

  listaMostrar =
    listaMostrar.filter(
      item =>
        item.usuario ===
        user.email
    );

}


if (filtroMes) {

  listaMostrar =
    listaMostrar.filter(
      item =>
        item.mes ===
        filtroMes
    );

}

if (filtroAnio) {

  listaMostrar =
    listaMostrar.filter(
      item =>
        Number(item.anio) ===
        Number(filtroAnio)
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
        Reporte Mensual
      </h2>
      
{
rol === "coordinador" && (
  <div
    className="sap-card"
    style={{
      marginTop: "20px"
    }}
  >
    Este módulo se administra
    desde Cierre Mensual.
  </div>
)
}
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
  placeholder="Rol / Responsabilidad"
  value={
    responsable.rolResponsabilidad
  }
  onChange={e => {

    const copia =
      [...responsables];

    copia[rIndex]
      .rolResponsabilidad =
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
<select
  className="fb-input"
  value={
    proyecto.estado
  }
  onChange={e => {

    const copia =
      [...responsables];

    copia[rIndex]
      .proyectos[pIndex]
      .estado =
      e.target.value;

    setResponsables(
      copia
    );

  }}
>

  <option>
    Verde
  </option>

  <option>
    Amarillo
  </option>

  <option>
    Rojo
  </option>

</select>
<label>

Avance:
{" "}
{
proyecto.avance
}%

</label>

<input
  type="range"
  min="0"
  max="100"
  value={
    proyecto.avance
  }
  onChange={e => {

    const copia =
      [...responsables];

    copia[rIndex]
      .proyectos[pIndex]
      .avance =
      Number(
        e.target.value
      );

    setResponsables(
      copia
    );

  }}
/>
<h6>Hitos</h6>

<button
  type="button"
  onClick={() =>
    agregarHito(
      rIndex,
      pIndex
    )
  }
>
  + Agregar Hito
</button>
{
proyecto.hitos.map(
(
 hito,
 hIndex
) => (

<div
 key={hIndex}
 className="sap-card"
>

<button
 type="button"
 onClick={() =>
   eliminarHito(
     rIndex,
     pIndex,
     hIndex
   )
 }
>
🗑️
</button>

<input
 className="fb-input"
 placeholder="Nombre del Hito"
 value={hito.nombre}
 onChange={e => {

   const copia =
     [...responsables];

   copia[rIndex]
     .proyectos[pIndex]
     .hitos[hIndex]
     .nombre =
     e.target.value;

   setResponsables(copia);

 }}
/>

<input
 className="fb-input"
 placeholder="SOLL"
 value={hito.soll}
 onChange={e => {

   const copia =
     [...responsables];

   copia[rIndex]
     .proyectos[pIndex]
     .hitos[hIndex]
     .soll =
     e.target.value;

   setResponsables(copia);

 }}
/>

<input
 className="fb-input"
 placeholder="IST"
 value={hito.ist}
 onChange={e => {

   const copia =
     [...responsables];

   copia[rIndex]
     .proyectos[pIndex]
     .hitos[hIndex]
     .ist =
     e.target.value;

   setResponsables(copia);

 }}
/>

</div>

))
}

<h6>
Siguientes Pasos
</h6>

<button
  type="button"
  onClick={() =>
    agregarPaso(
      rIndex,
      pIndex
    )
  }
>

+ Paso

</button>
{
proyecto.siguientesPasos.map(
(
  paso,
  pasoIndex
) => (

<div
  key={pasoIndex}
>

<input
  className="fb-input"
  placeholder="Paso"
  value={paso}
  onChange={e => {

    const copia =
      [...responsables];

    copia[rIndex]
      .proyectos[pIndex]
      .siguientesPasos[
        pasoIndex
      ] =
      e.target.value;

    setResponsables(
      copia
    );

  }}
/>

<button
  type="button"
  onClick={() =>
    eliminarPaso(
      rIndex,
      pIndex,
      pasoIndex
    )
  }
>

🗑️

</button>

</div>

))
}

<h6>
Riesgos
</h6>

<button
 type="button"
 onClick={() =>
   agregarRiesgo(
     rIndex,
     pIndex
   )
 }
>

+ Riesgo

</button>
{
proyecto.riesgos.map(
(
 riesgo,
 riesgoIndex
) => (

<div
 key={riesgoIndex}
>

<input
 className="fb-input"
 placeholder="Riesgo"
 value={riesgo}
 onChange={e => {

  const copia =
    [...responsables];

  copia[rIndex]
    .proyectos[pIndex]
    .riesgos[
      riesgoIndex
    ] =
    e.target.value;

  setResponsables(copia);

 }}
/>

<button
 type="button"
 onClick={() =>
   eliminarRiesgo(
     rIndex,
     pIndex,
     riesgoIndex
   )
 }
>

🗑️

</button>

</div>

))
}
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
Reporte mensual
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
Responsable VWM:
</b>

{" "}

{
responsable
.responsableVWM
}

</p>
<p>
<b>Rol:</b>
{" "}
{responsable.rolResponsabilidad}
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
  <b>Estado:</b>{" "}
  {proyecto.estado}
</p>

<p>
  <b>Avance:</b>{" "}
  {proyecto.avance}%
</p>

<p>
<b>Hitos:</b>
</p>

{
proyecto.hitos?.map(
(
  hito,
  index
) => (

<div key={index}>

<p>
{hito.nombre}
</p>

<p>
SOLL:
{hito.soll}
</p>

<p>
IST:
{hito.ist}
</p>

</div>

))
}
<p>
<b>Siguientes Pasos:</b>
</p>

{
proyecto.siguientesPasos?.map(
(paso,index)=>(
<p key={index}>
• {paso}
</p>
))
} l 
<p>
<b>Riesgos:</b>
</p>

{
proyecto.riesgos?.map(
(riesgo,index)=>(
<p key={index}>
• {riesgo}
</p>
))
}

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
  <b>Mes Clave:</b>{" "}
  {mes && anio
    ? `${mes}-${anio}`
    : ""}
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
{
(
  rol === "empleado" ||
  rol === "coordinador" ||
  rol === "gerente" ||
  rol === "admin"
) && (

    <div
  className="sap-card sap-card-full"
  style={{
    width: "100%",
    marginTop: "20px"
  }}
>
<div
style={{
  display:"flex",
  gap:"10px",
  marginBottom:"15px"
}}
>

<select
  value={filtroMes}
  onChange={e =>
    setFiltroMes(
      e.target.value
    )
  }
>

<option value="">
Todos los meses
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

<input
  type="number"
  placeholder="Año"
  value={filtroAnio}
  onChange={e =>
    setFiltroAnio(
      e.target.value
    )
  }
/>

</div>
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
{item.nombre} {item.apellido}
<br />
<small>{item.usuario}</small>
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

item.estado === "Aprobado"
? "green"

: item.estado === "Rechazado"
? "red"

: item.estado === "Cancelado"
? "gray"

: item.estado ===
"Capturado"
? "#0a6ed1"

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
  <b>Mes Clave:</b>{" "}
  {reporteSeleccionado.mesClave}
</p>
<p>
  <b>Mes:</b>{" "}
  {reporteSeleccionado.mes}
</p>
<p>
<b>Año:</b> {reporteSeleccionado.anio}
</p>

<p>
<b>Responsable:</b>{" "}
{reporteSeleccionado.nombre}
{" "}
{reporteSeleccionado.apellido}
</p>

<p>
<b>Correo:</b>{" "}
{reporteSeleccionado.usuario}
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
<p>
<b>Rol:</b>
{" "}
{responsable.rolResponsabilidad}
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
<b>Estado:</b>
{" "}
{proyecto.estado}
</p>

<p>
<b>Avance:</b>
{" "}
{proyecto.avance}%
</p>

<p>
<b>Hitos:</b>
</p>

{
proyecto.hitos?.map(
(
  hito,
  index
) => (

<div key={index}>

<p>
{hito.nombre}
</p>

<p>
SOLL:
{hito.soll}
</p>

<p>
IST:
{hito.ist}
</p>

</div>

))
}
<p>
<b>Riesgos:</b>
</p>

{
proyecto.riesgos?.map(
(riesgo,index)=>(
<p key={index}>
• {riesgo}
</p>
))
}
<p>
<b>Siguientes Pasos:</b>
</p>

{
proyecto.siguientesPasos?.map(
(paso,index)=>(
<p key={index}>
• {paso}
</p>
))
}

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
)}
    </div>
    
  );
}