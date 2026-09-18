import { useEffect, useState } from "react";
import {
  generarPDF
}
from "../services/pdfGenerator";
import {
  generarPPTX
} from "../services/pptGenerator";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase";

export default function CierreMensual({
  rol,
  user
}) {

  const [cierres, setCierres] =
    useState([]);


const [
  grupoVWMSeleccionado,
  setGrupoVWMSeleccionado
] = useState("");


const [
  filtroMes,
  setFiltroMes
] = useState("");

const [
  filtroAnio,
  setFiltroAnio
] = useState("");

const [
  cierreSeleccionado,
  setCierreSeleccionado
] = useState(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    cargarCierres();

  }, []);
const [pdfPreview, setPdfPreview] =
  useState(null);

const [pdfBlob, setPdfBlob] =
  useState(null);

const [nombrePDF, setNombrePDF] =
  useState("");

const [
  mostrarPreviewPDF,
  setMostrarPreviewPDF
] = useState(false);
  const cargarCierres =
    async () => {

      try {

        const reportesSnap =
  await getDocs(
    collection(
      db,
      "ReporteMensual"
    )
  );

const okrSnap =
  await getDocs(
    collection(
      db,
      "OKR"
    )
  );

        const reportes =
          reportesSnap.docs.map(
            doc => ({
              id: doc.id,
              ...doc.data()
            })
          );

        const okrs =
          okrSnap.docs.map(
            doc => ({
              id: doc.id,
              ...doc.data()
            })
          );

        const cierresTemp = [];

        reportes.forEach(
          reporte => {

            const okr =
            okrs.find(
            item =>
          item?.usuario === reporte?.usuario &&
            item?.mesClave === reporte?.mesClave
         );

            if (okr) {

              cierresTemp.push({

                usuario:
                  reporte.usuario,

                nombre:
                  reporte.nombre || "",

                apellido:
                  reporte.apellido || "",

                grupo:
                  reporte.grupoNombre || "",

                grupoId:
                  reporte.grupoId || "",

                mes:
                  reporte.mes || "",

                anio:
                  reporte.anio || "",

                reporteId:
                  reporte.id,

                okrId:
                  okr.id,

                reporte:
                  reporte,

                okr:
                  okr,
estado:
  okr.estado ||
  reporte.estado ||
  "Capturado"

              });

            }

          }
        );

        setCierres(
          cierresTemp
        );

      } catch (error) {

        console.error(
          "Error cargando cierres:",
          error
        );

      } finally {

        setLoading(false);

      }

    };
const aprobarCierre =
async (item) => {

  try {

    await updateDoc(
      doc(
        db,
        "ReporteMensual",
        item.reporteId
      ),
      {
        estado: "Aprobado"
      }
    );

    await updateDoc(
      doc(
        db,
        "OKR",
        item.okrId
      ),
      {
        estado: "Aprobado"
      }
    );

    alert(
      "Cierre aprobado"
    );

    cargarCierres();

  } catch (error) {

    console.error(error);

    alert(
      "Error al aprobar"
    );

  }

};
const rechazarCierre =
async (item) => {

  try {

    await updateDoc(
      doc(
        db,
        "ReporteMensual",
        item.reporteId
      ),
      {
        estado: "Rechazado"
      }
    );

    await updateDoc(
      doc(
        db,
        "OKR",
        item.okrId
      ),
      {
        estado: "Rechazado"
      }
    );

    alert(
      "Cierre rechazado"
    );

    cargarCierres();

  } catch (error) {

    console.error(error);

    alert(
      "Error al rechazar"
    );

  }

};
  if (loading) {

    return (
      <div className="sap-card">
        <h2>
          📊 Cierre Mensual
        </h2>

        <p>
          Cargando...
        </p>
      </div>
    );

  }
    let listaMostrar = cierres;
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
        item.usuario ===
        user.email
    );

}
else if (
  rol === "coordinador"
) {

  listaMostrar =
    listaMostrar.filter(
      item =>
        item.grupoId ===
        user.grupoId
    );

}
else if (
  rol === "gerente"
) {

  listaMostrar =
    listaMostrar.filter(
      item =>
        item.estado ===
        "Aprobado"
    );

}
const cierresGrupoFiltrados =
  listaMostrar.filter(
    item =>
      item.grupoId ===
      user.grupoId
  );
const todosAprobadosGrupo =
  cierresGrupoFiltrados.length > 0 &&
  cierresGrupoFiltrados.every(
    item =>
      item.estado === "Aprobado"
  );
const generarPPTCoordinacion = () => {

  if (
    cierresGrupoFiltrados.length === 0
  ) {
    alert(
      "No existen cierres para generar el PPT."
    );
    return;
  }

  generarPPTX(
    cierresGrupoFiltrados,
    {
      tipo: "COORDINACION"
    }
  );

};
const previewPDF =
async () => {

  try {

    const resultado =
      await generarPDF(
        cierreSeleccionado
      );

    const url =
      URL.createObjectURL(
        resultado.blob
      );

    setPdfPreview(url);

    setPdfBlob(
      resultado.blob
    );

    setNombrePDF(
      resultado.nombreArchivo
    );

    setMostrarPreviewPDF(true);

  }
  catch(error){

    console.error(error);

    alert(
      "Error generando PDF"
    );

  }

};
const descargarPDF = () => {

  const link =
    document.createElement("a");

  link.href =
    pdfPreview;

  link.download =
    nombrePDF;

  link.click();

};
const guardarPDFCloud =
  async () => {

    try {

      if (!pdfBlob) {

        alert(
          "No existe PDF para guardar."
        );

        return;

      }

      const formData =
        new FormData();

      formData.append(
        "archivo",
        pdfBlob,
        nombrePDF
      );
      formData.append(
  "mes",
  cierreSeleccionado.mes
);

formData.append(
  "anio",
  cierreSeleccionado.anio
);

formData.append(
  "usuario",
  cierreSeleccionado.usuario
);

formData.append(
  "grupo",
  cierreSeleccionado.grupo
);
      const response =
        await fetch(
          `${import.meta.env.VITE_API_URL}/subir-pdf`,
          {
            method: "POST",
            body: formData
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.error
        );

      }

      alert(
        "✅ PDF guardado correctamente"
      );

      console.log(
        "Archivo guardado:",
        data
      );

    }
    catch(error){

      console.error(error);

      alert(
        "❌ Error al guardar PDF"
      );

    }

};
const generarPPTGrupoVWM = () => {

  if (!grupoVWMSeleccionado) {

    alert(
      "Seleccione un Grupo VWM."
    );

    return;

  }

  const responsable =
    cierreSeleccionado.reporte.responsables.find(
      item =>
        item.grupo ===
        grupoVWMSeleccionado
    );

  if (!responsable) {

    alert(
      "No se encontró el grupo seleccionado."
    );

    return;

  }

  generarPPTX(
    [cierreSeleccionado],
    {
      tipo: "GRUPO_VWM",
      grupo:
        responsable.grupo,
      responsableVWM:
        responsable.responsableVWM
    }
  );

};
  return (

    <div
      className="sap-card sap-card-full"
    >

      <h2>
        📊 Cierre Mensual
      </h2>

      <p>
        Reportes que ya cuentan
        con Reporte Mensual y
        OKR capturados.
      </p>
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
      <table
        className="sap-table"
        style={{
          width: "100%"
        }}
      >

        <thead>

          <tr>

            <th>
              Mes
            </th>

            <th>
              Año
            </th>

            <th>
              Empleado
            </th>

            <th>
              Grupo
            </th>

            <th>
              Estado
            </th>

          </tr>

        </thead>

        <tbody>

          {
            listaMostrar.length === 0
            ? (

              <tr>

                <td
                  colSpan="5"
                  style={{
                    textAlign:
                      "center"
                  }}
                >

                  No existen
                  cierres
                  disponibles

                </td>

              </tr>

            )
            : (

              listaMostrar.map(
                (
                  item,
                  index
                ) => (

                  <tr
  key={index}
  onClick={() => {

    if (
      cierreSeleccionado
        ?.reporteId ===
      item.reporteId
    ) {

      setCierreSeleccionado(
  null
);

setGrupoVWMSeleccionado("");

    } else {

  setCierreSeleccionado(
  item
);

setGrupoVWMSeleccionado("");

    }

  }}
  style={{
    cursor: "pointer",
    backgroundColor:
      cierreSeleccionado
        ?.reporteId ===
      item.reporteId
        ? "#e3f2fd"
        : ""
  }}
>

                    <td>
                      {item.mes}
                    </td>

                    <td>
                      {item.anio}
                    </td>

                    <td>

                      {
                        item.nombre
                      }

                      {" "}

                      {
                        item.apellido
                      }

                    </td>

                    <td>
                      {item.grupo}
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
                      : "#f39c12"
                      }}
                    >

                        {
                          item.estado
                        }

                      </span>

                    </td>

                  </tr>

                )
              )

            )
          }

        </tbody>

      </table>
            {
cierreSeleccionado && (

<div
  className="sap-card sap-card-full"
  style={{
    marginTop: "20px"
  }}
>

<h3>
Detalle de Cierre
</h3>

<p>
<b>Mes:</b>{" "}
{cierreSeleccionado.mes}
</p>

<p>
<b>Año:</b>{" "}
{cierreSeleccionado.anio}
</p>

<p>
<b>Empleado:</b>{" "}
{cierreSeleccionado.nombre}
{" "}
{cierreSeleccionado.apellido}
</p>

<p>
<b>Correo:</b>{" "}
{cierreSeleccionado.usuario}
</p>

<p>
<b>Grupo:</b>{" "}
{cierreSeleccionado.grupo}
</p>

<hr />

<h3>
Reporte Mensual
</h3>

<p>
<b>SLA:</b>{" "}
{
cierreSeleccionado
.reporte?.sla
}
</p>

<p>
<b>Posición:</b>{" "}
{
cierreSeleccionado
.reporte?.posicion
}
</p>

<p>
<b>Periodo:</b>{" "}
{
cierreSeleccionado
.reporte?.periodo
}
</p>

<p>
<b>Logros:</b>{" "}
{
cierreSeleccionado
.reporte?.logros
}
</p>

<p>
<b>Problemas:</b>{" "}
{
cierreSeleccionado
.reporte?.problemas
}
</p>

<p>
<b>Acciones:</b>{" "}
{
cierreSeleccionado
.reporte?.acciones
}
</p>

<hr />

<h3>
OKR
</h3>

{
cierreSeleccionado.okr?.okrs?.map(
(
  okr,
  index
) => (

<div
  key={index}
  style={{
    borderTop:
      "1px solid #ddd",
    marginTop: "10px",
    paddingTop: "10px"
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
<b>Resultados Clave:</b>
</p>

{
Array.isArray(
  okr.resultadosClave
) &&
okr.resultadosClave.map(
(
  kr,
  krIndex
) => (
<p key={krIndex}>
• {kr.descripcion}
({kr.avance}%)
</p>
))
}
<p>
<b>Impacto:</b>{" "}
{okr.impacto}
</p>
<p>
<b>Riesgo:</b>{" "}
{okr.riesgo}
</p>
<p
  style={{
    fontWeight: "bold",
    color:
      okr.estadoSemaforo === "Verde"
        ? "green"
        : okr.estadoSemaforo === "Amarillo"
        ? "orange"
        : "red"
  }}
>
  <b>Semáforo:</b>{" "}
  {
    okr.estadoSemaforo === "Verde"
      ? "🟢 Verde"
      : okr.estadoSemaforo === "Amarillo"
      ? "🟡 Amarillo"
      : "🔴 Rojo"
  }
</p>
<h5>KPIs</h5>

{
Array.isArray(
  okr.kpis
) &&
okr.kpis.map(
(
  kpi,
  kIndex
) => (
<div key={kIndex}>
<p>
• {kpi.nombre}
(
{kpi.actual}
/
{kpi.meta}
{kpi.unidad}
)
</p>
</div>
))
}
<h5>SLAs</h5>

{
Array.isArray(
  okr.slas
) &&
okr.slas.map(
(
  sla,
  sIndex
) => (
<div key={sIndex}>
<p>
• {sla.nombre}
({sla.cumplimiento}%)
</p>
</div>
))
}
<p>
<b>Prioridad:</b>{" "}
{okr.prioridad}
</p>

<p>
<b>Avance:</b>{" "}
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
<p>
<b>Comentarios:</b>{" "}
{okr.comentarios}
</p>

</div>

)
)
}
{
(
  rol === "coordinador" ||
  rol === "admin"
) && (

<div
  style={{
    marginTop: "20px",
    display: "flex",
    gap: "10px"
  }}
>
{
rol === "coordinador" &&
cierreSeleccionado?.reporte?.responsables?.length > 0 && (

<select
  className="fb-input"
  value={grupoVWMSeleccionado}
  onChange={(e) =>
    setGrupoVWMSeleccionado(
      e.target.value
    )
  }
>

  <option value="">
    Seleccionar Grupo VWM
  </option>

  {
    cierreSeleccionado.reporte.responsables.map(
      (
        responsable,
        index
      ) => (

        <option
          key={index}
          value={responsable.grupo}
        >
          {responsable.grupo}
        </option>

      )
    )
  }

</select>

)
}
{
cierreSeleccionado.estado !==
"Aprobado" && (

<button
  className="fb-btn"
  style={{
    background: "green",
    color: "white"
  }}
  onClick={() =>
    aprobarCierre(
      cierreSeleccionado
    )
  }
>
  ✅ Aprobar
</button>

)
}

{
cierreSeleccionado.estado !==
"Rechazado" && (

<button
  className="fb-btn"
  style={{
    background: "red",
    color: "white"
  }}
  onClick={() =>
    rechazarCierre(
      cierreSeleccionado
    )
  }
>
  ❌ Rechazar
</button>

)
}
{
cierreSeleccionado.estado ===
"Aprobado" && (

<button
  className="fb-btn"
  style={{
    background: "#0a6ed1",
    color: "white"
  }}
  onClick={previewPDF}
>
  📄 Generar PDF
</button>

)
}
{
rol === "coordinador" &&
todosAprobadosGrupo && (

<button
  className="fb-btn"
  style={{
    background: "#8e44ad",
    color: "white"
  }}
  onClick={generarPPTCoordinacion}
>
 📊 Generar Reporte Coordinacion
</button>

)
}
{
rol === "coordinador" &&
cierreSeleccionado?.estado ===
"Aprobado" && (

<button
  className="fb-btn"
  style={{
    background: "#16a085",
    color: "white"
  }}
  onClick={generarPPTGrupoVWM}
>
  🏢 Generar Reporte Grupo VWM
</button>

)
}
</div>

)
}
</div>

)
}
{
mostrarPreviewPDF && (

<div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "rgba(0,0,0,0.7)",
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}
>

  <div
    style={{
      width: "90%",
      height: "90%",
      background: "white",
      borderRadius: "8px",
      padding: "15px"
    }}
  >

    <h2>
      Vista previa PDF
    </h2>

   <iframe
  src={pdfPreview}
  title="Vista previa PDF"
  width="100%"
  height="70%"
  style={{
    border: "1px solid #ddd",
}}
/>

    <div
      style={{
        marginTop: "15px",
        display: "flex",
        gap: "10px"
      }}
    >
<button
  className="fb-btn"
  style={{
    background: "#27ae60",
    color: "white"
  }}
  onClick={guardarPDFCloud}
>
  ☁ Guardar Cloud
</button>
      <button
        className="fb-btn"
        onClick={descargarPDF}
      >
        ⬇ Descargar
      </button>

      <button
        className="fb-btn"
onClick={() => {

  URL.revokeObjectURL(pdfPreview);

  setPdfPreview(null);

  setPdfBlob(null);

  setNombrePDF("");

  setMostrarPreviewPDF(false);

}}
      >
        Cerrar
      </button>

    </div>

  </div>

</div>

)
}
    </div>
  

  );

}