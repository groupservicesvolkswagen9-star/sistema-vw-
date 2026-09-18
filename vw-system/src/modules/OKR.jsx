import {
  useState,
  useEffect
} from "react";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

import { db }
from "../firebase";

export default function OKR({
  user,
  rol
}) {

 const [okrsFormulario,
  setOkrsFormulario] =
  useState([
    {
  objetivo: "",

  resultadosClave: [
    {
      descripcion: "",
      avance: 0
    }
  ],

  riesgo: "",
  impacto: "",

      prioridad: "Media",

      fechaObjetivo: "",

      comentarios: "",


      expandido: true,

     slas: [
  {
    nombre: "",
    cliente: "",
    cumplimiento: 0
  }
],

  kpis: [
      {
        nombre: "",
        meta: "",
        actual: "",
        unidad: ""
      }
      ]   
    }
  ]);
  const [okrs,
    setOkrs] =
    useState([]);
  const [
  okrSeleccionado,
    setOkrSeleccionado
    ] = useState(null);
const cargar =
  async () => {

    const snap =
      await getDocs(
        collection(
          db,
          "OKR"
        )
      );

    const datos =
      snap.docs.map(
        item => ({
          id: item.id,
          ...item.data()
        })
      );

    datos.sort(
      (a, b) =>
        new Date(b.fecha) -
        new Date(a.fecha)
    );

    setOkrs(datos);

  };

  useEffect(() => {

    cargar();

  }, []);
  const [mes, setMes] =
  useState("");
const [
  filtroMes,
  setFiltroMes
] = useState("");

const [
  filtroAnio,
  setFiltroAnio
] = useState("");
const [anio, setAnio] =
  useState(
    new Date()
      .getFullYear()
  );

const cancelarOKR =
async (id) => {

  if (
    !window.confirm(
      "¿Cancelar OKR?"
    )
  ) {
    return;
  }

  await updateDoc(
    doc(
      db,
      "OKR",
      id
    ),
    {
      estado:
        "Cancelado"
    }
  );

  cargar();

};
const eliminarOKRRegistro =
async (id) => {

  if (
    !window.confirm(
      "¿Eliminar OKR?"
    )
  ) {
    return;
  }

  await deleteDoc(
    doc(
      db,
      "OKR",
      id
    )
  );

  cargar();

};
const agregarOKR =
  () => {

    setOkrsFormulario([
      ...okrsFormulario,

      {
       objetivo: "",

        resultadosClave: [
       {
       descripcion: "",
       avance: 0
        }
       ],

        riesgo: "",
        impacto: "",
        prioridad: "Media",
        fechaObjetivo: "",
        comentarios: "",
        expandido: true,
        slas: [
  {
    nombre: "",
    cliente: "",
    cumplimiento: 0
  }
],
        kpis: [
          {
            nombre: "",
            meta: "",
            actual: "",
            unidad: "",
          }
        ]
      }
    ]);

  };
  const eliminarOKR =
  (index) => {

    if (
      !window.confirm(
        "¿Eliminar OKR?"
      )
    ) {
      return;
    }

    const copia =
      [...okrsFormulario];

    copia.splice(
      index,
      1
    );

    setOkrsFormulario(
      copia
    );

  };
  const toggleOKR =
  (index) => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .expandido =
      !copia[index]
        .expandido;

    setOkrsFormulario(
      copia
    );

  };
  const agregarKPI =
  (indexOKR) => {

    const copia =
      [...okrsFormulario];

    copia[indexOKR]
      .kpis
      .push({

        
  nombre: "",
  meta: "",
  actual: "",
  unidad: ""

      });

    setOkrsFormulario(
      copia
    );

  };
const agregarResultadoClave =
(indexOKR) => {

  const copia =
    [...okrsFormulario];

  copia[indexOKR]
    .resultadosClave
    .push({
      descripcion: "",
      avance: 0
    });

  setOkrsFormulario(
    copia
  );

};
const agregarSLA =
(indexOKR) => {

  const copia =
    [...okrsFormulario];

  copia[indexOKR]
    .slas
    .push({
      nombre: "",
      cliente: "",
      cumplimiento: 0
    });

  setOkrsFormulario(
    copia
  );
};
const eliminarResultadoClave =
(
  indexOKR,
  krIndex
) => {

  const copia =
    [...okrsFormulario];

  if (
    copia[indexOKR]
      .resultadosClave.length === 1
  ) {
    alert(
      "Debe existir al menos un Resultado Clave"
    );
    return;
  }

  copia[indexOKR]
    .resultadosClave
    .splice(
      krIndex,
      1
    );

  setOkrsFormulario(
    copia
  );

};
const eliminarKPI =
(
  indexOKR,
  kIndex
) => {

  const copia =
    [...okrsFormulario];

  if (
    copia[indexOKR]
      .kpis.length === 1
  ) {
    alert(
      "Debe existir al menos un KPI"
    );
    return;
  }

  copia[indexOKR]
    .kpis
    .splice(
      kIndex,
      1
    );

  setOkrsFormulario(
    copia
  );

};
const eliminarSLA =
(
  indexOKR,
  sIndex
) => {

  const copia =
    [...okrsFormulario];

  if (
    copia[indexOKR]
      .slas.length === 1
  ) {
    alert(
      "Debe existir al menos un SLA"
    );
    return;
  }

  copia[indexOKR]
    .slas
    .splice(
      sIndex,
      1
    );

  setOkrsFormulario(
    copia
  );

};

const guardar =
  async () => {

   
const hayVacios =
  okrsFormulario.some(
    okr =>
      !okr.objetivo ||
      okr.resultadosClave.length === 0||
      okr.resultadosClave.some(
        kr =>
          !kr.descripcion
      )
  );
if (!mes) {
  alert(
    "Seleccione un mes"
  );
  return;
}

const existe =
  okrs.some(
    item =>
      item.usuario ===
        user.email &&
      item.mesClave ===
        `${mes}-${anio}` &&
      item.estado !==
        "Cancelado"
  );

if (existe) {
  alert(
    "Ya existe un OKR para ese mes"
  );
  return;
}
if (hayVacios) {

  alert(
    "Completa todos los Objetivos y Resultados Clave"
  );

  return;

}
const okrsActualizados =
  okrsFormulario.map(
    okr => {

      const avancePromedio =
      Math.round(

     okr.resultadosClave
      .reduce(
        (sum,kr)=>
          sum + kr.avance,
        0
      ) /

    (
      okr.resultadosClave
        .length || 1
    )

    );

      return {
        ...okr,
        avance:
          avancePromedio
      };

    }
  );
const okrsConSemaforo =
 okrsActualizados.map(
    okr => ({
      ...okr,

      estadoSemaforo:
        okr.avance >= 80
          ? "Verde"
          : okr.avance >= 50
          ? "Amarillo"
          : "Rojo"
    })
  );

await addDoc(
  collection(
    db,
    "OKR"
  ),
  {

    mes,

    anio:
      Number(anio),

    mesClave:
      `${mes}-${anio}`,

    grupoId:
      user.grupoId,

    grupoNombre:
      user.grupoNombre,

    usuario:
      user.email,

    nombre:
      user.nombre || "",

    apellido:
      user.apellido || "",

    responsable:
      user.email,

    responsableNombre:
      `${user.nombre || ""}
       ${user.apellido || ""}`,

    okrs:
  okrsConSemaforo,

    estado:
      "Capturado",

    cierreDisponible:
      true,

    fecha:
      new Date()
      .toISOString()
  }
);
    alert(
  "OKR guardado correctamente"
);
   setOkrSeleccionado(
  null
);
   setOkrsFormulario([
  {
     objetivo: "",

     resultadosClave: [
     {
      descripcion: "",
      avance: 0
       }
      ],

    riesgo: "",
    impacto: "",

    prioridad: "Media",

    fechaObjetivo: "",

    comentarios: "",

    expandido: true,

  slas: [
  {
    nombre: "",
    cliente: "",
    cumplimiento: 0
  }
],

    kpis: [
      {
        nombre: "",
        meta: "",
        actual: "",
        unidad: "",
      }
    ]
  }
]);
setMes("");
    cargar();

  };
let listaMostrar = okrs;
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
if (rol === "empleado") {

  listaMostrar =
  listaMostrar.filter(
    item =>
      item.responsable ===
      user.email
  );
}

else if (
  rol === "coordinador"
) {

  listaMostrar =
  listaMostrar.filter(
    item =>
      item.grupoNombre ===
      user.grupoNombre
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

      <h2>OKR</h2>
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
      <button
  type="button"
  onClick={agregarOKR}
>
  + Agregar OKR
</button>
{
okrsFormulario.map(
(
  okr,
  index
) => {

const avanceCalculado =
Math.round(
  (
    okr.resultadosClave || []
  ).reduce(
    (sum, kr) =>
      sum + kr.avance,
    0
  ) /
  (
    okr.resultadosClave?.length ||
    1
  )
);

return (
<div
  key={index}
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

<h3>

{
okr.objetivo
  ? okr.objetivo
  : `OKR ${index + 1}`
}

</h3>

<div>

<button
  type="button"
  onClick={() =>
    toggleOKR(
      index
    )
  }
>

{
okr.expandido
? "🔼"
: "🔽"
}

</button>

<button
  type="button"
  onClick={() =>
    eliminarOKR(
      index
    )
  }
>

🗑️

</button>

</div>

</div>
{
okr.expandido && (

<>

<input
  className="fb-input"
  placeholder="Objetivo"

  value={
    okr.objetivo
  }

  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .objetivo =
      e.target.value;

    setOkrsFormulario(
      copia
    );

  }}
/>
<h4>
Resultados Clave
</h4>

<button
  type="button"
  onClick={() =>
    agregarResultadoClave(
      index
    )
  }
>
+ Resultado Clave
</button>

{
Array.isArray(
  okr.resultadosClave
) &&
okr.resultadosClave.map(
(
  kr,
  krIndex
) => (

<div
  key={krIndex}
  className="sap-card"
>
<div
  style={{
    display: "flex",
    justifyContent: "flex-end"
  }}
>
  <button
    type="button"
    onClick={() =>
      eliminarResultadoClave(
        index,
        krIndex
      )
    }
  >
    🗑️
  </button>
</div>
<input
  className="fb-input"
  placeholder="Resultado Clave"
  value={kr.descripcion}
  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .resultadosClave[
        krIndex
      ]
      .descripcion =
      e.target.value;

    setOkrsFormulario(
      copia
    );

  }}
/>

<label>
Avance KR:
{kr.avance}%
</label>

<input
  type="range"
  min="0"
  max="100"
  value={kr.avance}
  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .resultadosClave[
        krIndex
      ]
      .avance =
      Number(
        e.target.value
      );

    setOkrsFormulario(
      copia
    );

  }}
/>

</div>

))
}
<input
  className="fb-input"
  placeholder="Impacto Esperado"
  value={okr.impacto}
  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .impacto =
      e.target.value;

    setOkrsFormulario(
      copia
    );

  }}
/>

<input
  className="fb-input"
  placeholder="Riesgo Principal"
  value={okr.riesgo}
  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .riesgo =
      e.target.value;

    setOkrsFormulario(
      copia
    );

  }}
/>
<h4>
KPIs
</h4>

<button
  type="button"
  onClick={() =>
    agregarKPI(index)
  }
>

+ KPI

</button>
{
Array.isArray(
  okr.kpis
) &&
okr.kpis.map(
(
 kpi,
 kIndex
) => (

<div
  key={kIndex}
  className="sap-card sap-card-full"
  style={{
    width: "100%",
    display: "block"
  }}
>
<div
  style={{
    display: "flex",
    justifyContent: "flex-end"
  }}
>
  <button
    type="button"
    onClick={() =>
      eliminarKPI(
        index,
        kIndex
      )
    }
  >
    🗑️ KPI
  </button>
</div>
<input
  className="fb-input"
  placeholder="Nombre KPI"

  value={kpi.nombre}

  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .kpis[kIndex]
      .nombre =
      e.target.value;

    setOkrsFormulario(
      copia
    );

  }}
/>

<input
  className="fb-input"
  placeholder="Meta"

  value={kpi.meta}

  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .kpis[kIndex]
      .meta =
      e.target.value;

    setOkrsFormulario(
      copia
    );

  }}
/>

<input
  className="fb-input"
  placeholder="Actual"

  value={kpi.actual}

  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .kpis[kIndex]
      .actual =
      e.target.value;

    setOkrsFormulario(
      copia
    );

  }}
/>

<input
  className="fb-input"
  placeholder="Unidad"

  value={kpi.unidad}

  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .kpis[kIndex]
      .unidad =
      e.target.value;

    setOkrsFormulario(
      copia
    );

  }}
/>

</div>

))
}

<h4>
SLA Relacionados
</h4>

<button
  type="button"
  onClick={() =>
    agregarSLA(index)
  }
>
+ SLA
</button>
{
Array.isArray(
  okr.slas
) &&
okr.slas.map(
(
  slaItem,
  sIndex
) => (

<div
  key={sIndex}
  className="sap-card"
>
<div
  style={{
    display: "flex",
    justifyContent: "flex-end"
  }}
>
  <button
    type="button"
    onClick={() =>
      eliminarSLA(
        index,
        sIndex
      )
    }
  >
    🗑️ SLA
  </button>
</div>
<input
  className="fb-input"
  placeholder="Nombre SLA"
  value={slaItem.nombre}
  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .slas[sIndex]
      .nombre =
      e.target.value;

    setOkrsFormulario(
      copia
    );

  }}
/>

<input
  className="fb-input"
  placeholder="Cliente"
  value={slaItem.cliente}
  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .slas[sIndex]
      .cliente =
      e.target.value;

    setOkrsFormulario(
      copia
    );

  }}
/>
<label>
  Cumplimiento SLA:
  {slaItem.cumplimiento}%
</label>

<input
  type="range"
  
  min="0"
  max="100"
  value={slaItem.cumplimiento}
  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .slas[sIndex]
      .cumplimiento =
      Number(
        e.target.value
      );

    setOkrsFormulario(
      copia
    );

  }}
/>
<div
  style={{
    width: "200px",
    background: "#ddd",
    borderRadius: "10px",
    height: "12px",
    marginTop: "5px"
  }}
>
  <div
    style={{
      width: `${slaItem.cumplimiento}%`,
      height: "12px",
      borderRadius: "10px",
      background:
        slaItem.cumplimiento >= 80
          ? "green"
          : slaItem.cumplimiento >= 50
          ? "orange"
          : "red"
    }}
  />
</div>
</div>

))
}
<label>
Prioridad del Objetivo
</label>

<select
  value={
    okr.prioridad
  }

  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .prioridad =
      e.target.value;

    setOkrsFormulario(
      copia
    );

  }}
>

<option>
Alta
</option>

<option>
Media
</option>

<option>
Baja
</option>

</select>

<input
  type="date"

  value={
    okr.fechaObjetivo
  }

  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .fechaObjetivo =
      e.target.value;

    setOkrsFormulario(
      copia
    );

  }}
/>

<textarea
  className="fb-input"
  placeholder="Comentarios"

  value={
    okr.comentarios
  }

  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .comentarios =
      e.target.value;

    setOkrsFormulario(
      copia
    );

  }}
/>
<p>
<b>
Avance Calculado:
</b>
{" "}
{
Math.round(
  okr.resultadosClave.reduce(
    (sum,kr)=>
      sum + kr.avance,
    0
  ) /
  (
    okr.resultadosClave.length ||
    1
  )
)
}%
</p>

</>

)}
</div>

);
})
}


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
OKRs
</h4>

{
okrsFormulario.map(
(
  okr,
  index
) => {

const avanceCalculado =
Math.round(
(
  okr.resultadosClave || []
).reduce(
  (sum, kr) =>
    sum + kr.avance,
  0
) /
(
  okr.resultadosClave?.length ||
  1
)
);

return (

<div key={index}>

<p>
<b>
Objetivo:
</b>
{" "}
{okr.objetivo}
</p>

<p>
<b>
Resultados Clave:
</b>
</p>

{
Array.isArray(
  okr.resultadosClave
) &&
okr.resultadosClave.map(
(
  kr,
  index
)=>(

<p key={index}>
• {kr.descripcion}
({kr.avance}%)
</p>

))
}
<p>
<b>Impacto:</b>
{" "}
{okr.impacto}
</p>

<p>
<b>Riesgo:</b>
{" "}
{okr.riesgo}
</p>
<p>
<b>
Prioridad:
</b>
{" "}
{okr.prioridad}
</p>
<p>
<b>KPIs:</b>
</p>

{
Array.isArray(
  okr.kpis
) &&
okr.kpis.map(
(
  kpi,
  index
)=>(
<p key={index}>
• {kpi.nombre}
(
{kpi.actual}
/
{kpi.meta}
{kpi.unidad}
)
</p>
))
}
<p>
<b>SLAs:</b>
</p>

{
Array.isArray(
  okr.slas
) &&
okr.slas.map(
(
  sla,
  index
)=>(

<p key={index}>
• {sla.nombre}
 ({sla.cumplimiento}%)
</p>

))
}

<div
  style={{
    marginTop: "10px"
  }}
>

<p>
<b>Avance:</b>
{" "}
{
Math.round(
  okr.resultadosClave.reduce(
    (sum,kr)=>sum + kr.avance,
    0
  ) /
  (
    okr.resultadosClave.length ||
    1
  )
)
}%
</p>


<div
  style={{
    width: "250px",
    background: "#ddd",
    borderRadius: "10px",
    height: "16px"
  }}
>

<div
  style={{
    width: `${avanceCalculado}%`,
    height: "16px",
    borderRadius: "10px",
    background:
      avanceCalculado >= 80
        ? "green"
        :avanceCalculado >= 50
        ? "orange"
        : "red"
  }}
/>

</div>

<p
  style={{
    fontWeight: "bold",
    marginTop: "5px",
    color:
      avanceCalculado >= 80
        ? "green"
        : avanceCalculado >= 50
        ? "orange"
        : "red"
  }}
>
{
  avanceCalculado >= 80
    ? "🟢 Verde"
    : avanceCalculado >= 50
    ? "🟡 Amarillo"
    : "🔴 Rojo"
}
</p>

</div>

<p>
<b>
Comentarios:
</b>
{" "}
{okr.comentarios}
</p>

</div>

);
})
}
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
  rol === "admin"
) && (
<>
  <div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
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
      <table className="table">

        <thead>
          <tr>
          <th>Acciones</th>
          <th>Grupo</th>
          <th>Responsable</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Mes</th>
          <th>Año</th>
        </tr>
        </thead>

        <tbody>

{listaMostrar.length === 0 ? (

  <tr>

    <td colSpan="7">

      No existen OKRs registrados

    </td>

  </tr>

) : (

  listaMostrar.map(
    item => (

      <tr
  key={item.id}
  onClick={() => {

    if (
      okrSeleccionado?.id ===
      item.id
    ) {

      setOkrSeleccionado(
        null
      );

    } else {

      setOkrSeleccionado(
        item
      );

    }

  }}
>
<td>

{
rol === "admin" &&
item.estado !==
"Cancelado" && (

<>

<button
onClick={() =>
cancelarOKR(
item.id
)
}
>
🚫
</button>

<button
onClick={() =>
eliminarOKRRegistro(
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
        {item.grupoNombre}
</td>

        <td>
       {item.nombre}
         {" "}
        {item.apellido}
        <br />
        <small>
        {item.usuario}
       </small>
        </td>

      <td>
        <span
        style={{
        fontWeight: "bold",
       color:
        item.estado === "Aprobado"
        ? "green"
        : item.estado === "Rechazado"
        ? "red"
        : item.estado === "Cancelado"
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
        ? new Date(
          item.fecha
        ).toLocaleDateString()
         : ""
      }
      </td>
      <td>{item.mes}</td>
      <td>{item.anio}</td>
      </tr>

    )
  )

)}

</tbody>

      </table>
    {
okrSeleccionado && (  

<div
  className="sap-card sap-card-full"
  style={{
    marginTop: "20px"
  }}
>

<h3>
Detalle OKR
</h3>
<p>
  <b>Mes:</b>{" "}
  {okrSeleccionado.mes}
</p>

<p>
  <b>Mes Clave:</b>{" "}
  {okrSeleccionado.mesClave}
</p>

<p>
  <b>Año:</b>{" "}
  {okrSeleccionado.anio}
</p>
<p>
<b>Grupo:</b>{" "}
{okrSeleccionado.grupoNombre}
</p>

<p>
<b>Responsable:</b>{" "}
{
okrSeleccionado.responsableNombre ||
okrSeleccionado.responsable
}
</p>
<p>
  <b>Correo:</b>{" "}
  {okrSeleccionado.usuario}
</p>
<p>
<b>Estado:</b>{" "}
{okrSeleccionado.estado}
</p>

<p>
<b>Fecha:</b>{" "}
{
okrSeleccionado.fecha
? new Date(
    okrSeleccionado.fecha
  ).toLocaleDateString()
: ""
}
</p>

{
okrSeleccionado.okrs?.map(
(
  okr,
  index
) => (

<div
  key={index}
  style={{
    borderTop:
      "1px solid #ddd",
    paddingTop:
      "10px",
    marginTop:
      "10px"
  }}
>

<h4>
Objetivo {index + 1}
</h4>

<p>
<b>Objetivo:</b>{" "}
{okr.objetivo}
</p>

<p>
<b>
Resultados Clave:
</b>
</p>

{
Array.isArray(
  okr.resultadosClave
) &&
okr.resultadosClave.map(
(
  kr,
  index
)=>(

<p key={index}>
• {kr.descripcion}
({kr.avance}%)
</p>

))
}
<p>
<b>Impacto:</b>
{" "}
{okr.impacto}
</p>

<p>
<b>Riesgo:</b>
{" "}
{okr.riesgo}
</p>
<p>
<b>Prioridad:</b>{" "}
{okr.prioridad}
</p>

<div
  style={{
    marginTop: "10px"
  }}
>

<p>
<b>Avance:</b>
{" "}
{okr.avance}%
</p>

<div
  style={{
    width: "250px",
    background: "#ddd",
    borderRadius: "10px",
    height: "16px"
  }}
>

<div
  style={{
    width: `${okr.avance}%`,
    height: "16px",
    borderRadius: "10px",
    background:
      okr.avance >= 80
        ? "green"
        : okr.avance >= 50
        ? "orange"
        : "red"
  }}
/>

</div>

<p
  style={{
    fontWeight: "bold",
    marginTop: "5px",
    color:
      okr.avance >= 80
        ? "green"
        : okr.avance >= 50
        ? "orange"
        : "red"
  }}
>
{
  okr.avance >= 80
    ? "🟢 Verde"
    : okr.avance >= 50
    ? "🟡 Amarillo"
    : "🔴 Rojo"
}
</p>

</div>

<p>
<b>Comentarios:</b>{" "}
{okr.comentarios}
</p>

<h5>
KPIs
</h5>

{
okr.kpis?.map(
(
  kpi,
  kIndex
) => (

<div
  key={kIndex}
  style={{
    marginLeft:
      "20px"
  }}
>

<p>
<b>Nombre:</b>{" "}
{kpi.nombre}
</p>

<p>
<b>Meta:</b>{" "}
{kpi.meta}
</p>

<p>
<b>Actual:</b>{" "}
{kpi.actual}
</p>

<p>
<b>Unidad:</b>{" "}
{kpi.unidad}
</p>

</div>

)
)
}

<h5>
SLAs
</h5>

{
Array.isArray(
  okr.slas
) &&
okr.slas.map(
(
  sla,
  sIndex
) => (

<div
  key={sIndex}
  style={{
    marginLeft:"20px"
  }}
>

<p>
<b>SLA:</b>
{" "}
{sla.nombre}
</p>

<p>
<b>Cliente:</b>
{" "}
{sla.cliente}
</p>

<p>
<b>Cumplimiento:</b>
{" "}
{sla.cumplimiento}%
</p>

</div>

))
}

</div>

)
)
}

</div>

)
}
</>
)}
    </div>

  );

}