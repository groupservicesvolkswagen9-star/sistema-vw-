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
      resultadoClave: "",

      prioridad: "Media",

      fechaObjetivo: "",

      comentarios: "",

      avance: 0,

      expandido: true,

      slas: [""],

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
  const aprobarOKR =
async (id) => {

  if (
    !window.confirm(
      "¿Aprobar OKR?"
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
        "Aprobado"
    }
  );

  cargar();

};
const rechazarOKR =
async (id) => {

  if (
    !window.confirm(
      "¿Rechazar OKR?"
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
        "Rechazado"
    }
  );

  cargar();

};
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
        resultadoClave: "",
        prioridad: "Media",
        fechaObjetivo: "",
        comentarios: "",
        avance: 0,
        expandido: true,
        slas: [""],
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
  const agregarSLA =
  (indexOKR) => {

    const copia =
      [...okrsFormulario];

    copia[indexOKR]
      .slas
      .push("");

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
      !okr.resultadoClave
  );

if (hayVacios) {

  alert(
    "Completa todos los Objetivos y Resultados Clave"
  );

  return;

}


    await addDoc(
      collection(
        db,
        "OKR"
      ),
      {

        grupoId:
          user.grupoId,

        grupoNombre:
          user.grupoNombre,
        responsable:
          user.email,
        responsableNombre:
        `${user.nombre || ""}
       ${user.apellido || ""}`,

      okrs:
     okrsFormulario,
        estado:
        "Pendiente Coordinador",
fecha:
  new Date()
  .toISOString()
      }
      
    );
    alert(
  "OKR guardado correctamente"
);
   
   setOkrsFormulario([
  {
    objetivo: "",
    resultadoClave: "",

    prioridad: "Media",

    fechaObjetivo: "",

    comentarios: "",

    avance: 0,

    expandido: true,

    slas: [""],

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
    cargar();

  };
let listaMostrar = okrs;

if (rol === "empleado") {

  listaMostrar =
    okrs.filter(
      item =>
        item.responsable ===
        user.email
    );

}

else if (
  rol === "coordinador"
) {

  listaMostrar =
    okrs.filter(
      item =>
        item.grupoNombre ===
        user.grupoNombre
    );

}
else if (
  rol === "gerente"
) {

  listaMostrar = okrs;

}
else if (
  rol === "admin"
) {

  listaMostrar = okrs;

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
rol === "empleado" && (
<>
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
) => (

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

<input
  className="fb-input"
  placeholder="Resultado Clave"

  value={
    okr.resultadoClave
  }

  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .resultadoClave =
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
okr.kpis.map(
(
 kpi,
 kIndex
) => (

<div
  key={index}
  className="sap-card sap-card-full"
  style={{
    width: "100%",
    display: "block"
  }}
>

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
okr.slas.map(
(
 slaItem,
 sIndex
) => (

<input
  key={sIndex}

  className="fb-input"

  placeholder="SLA"

  value={slaItem}

  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .slas[sIndex] =
      e.target.value;

    setOkrsFormulario(
      copia
    );

  }}
/>

))
}
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

<label>

Porcentaje de Avance

</label>

<input
  type="range"
  min="0"
  max="100"

  value={
    okr.avance
  }

  onChange={e => {

    const copia =
      [...okrsFormulario];

    copia[index]
      .avance =
      Number(
        e.target.value
      );

    setOkrsFormulario(
      copia
    );

  }}
/>

<p>

{
okr.avance
}%

</p>
</>

)}
</div>

))
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
) => (

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
KR:
</b>
{" "}
{okr.resultadoClave}
</p>

<p>
<b>
Prioridad:
</b>
{" "}
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
<b>
Comentarios:
</b>
{" "}
{okr.comentarios}
</p>

</div>

))
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
      <table className="table">

        <thead>
          <tr>
          <th>Acciones</th>
          <th>Grupo</th>
          <th>Responsable</th>
          <th>Estado</th>
          <th>Fecha</th>
        </tr>
        </thead>

        <tbody>

{listaMostrar.length === 0 ? (

  <tr>

    <td colSpan="5">

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
rol === "coordinador" &&
item.estado ===
"En Progreso" && (

<>

<button
onClick={() =>
aprobarOKR(
item.id
)
}
>
✅
</button>

<button
onClick={() =>
rechazarOKR(
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
  {
    item.responsableNombre ||
    item.responsable
  }
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
<b>Resultado Clave:</b>{" "}
{okr.resultadoClave}
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
okr.slas?.map(
(
  sla,
  sIndex
) => (

<p
  key={sIndex}
>
{sla}
</p>

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

  );

}