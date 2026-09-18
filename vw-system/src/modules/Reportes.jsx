import { useState, useEffect } from "react";
import ReporteMensual from "./ReporteMensual";
import OKR from "./OKR";
import CierreMensual from "./CierreMensual";
export default function Reportes({
  rol,
  user,
}) {

const [vista,
setVista] =
useState(

  rol === "coordinador" ||
  rol === "gerente"

    ? "cierreMensual"

    : "reporteMensual"

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
📊 {
  vista === "reporteMensual"
    ? "Reporte Mensual"
    : vista === "okr"
    ? "OKR"
    : "Cierre Mensual"
}
</h2>

<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  }}
>

{
(
  rol === "empleado" ||
  rol === "admin"
) && (

<button
  className="fb-btn"
  style={{
    background:
      vista === "reporteMensual"
        ? "#0a6ed1"
        : "#e0e0e0",
    color:
      vista === "reporteMensual"
        ? "white"
        : "black"
  }}
  onClick={() =>
    setVista(
      "reporteMensual"
    )
  }
>
📝 Reporte Mensual
</button>

)
}


{
(
  rol === "empleado" ||
  rol === "admin"
) && (

<button
  className="fb-btn"
  style={{
    background:
      vista === "okr"
        ? "#0a6ed1"
        : "#e0e0e0",
    color:
      vista === "okr"
        ? "white"
        : "black"
  }}
  onClick={() =>
    setVista("okr")
  }
>
🎯 OKR
</button>

)
}
{
(
  rol === "coordinador" ||
  rol === "gerente" ||
  rol === "admin"
) && (

<button
  className="fb-btn"
  style={{
    background:
      vista === "cierreMensual"
        ? "#0a6ed1"
        : "#e0e0e0",
    color:
      vista === "cierreMensual"
        ? "white"
        : "black"
  }}
  onClick={() =>
    setVista("cierreMensual")
  }
>
  Cierre Mensual
</button>

)}
</div>

{
(
  rol === "empleado" ||
  rol === "admin"
) &&
vista ===
"reporteMensual" && (

<ReporteMensual
  user={user}
  rol={rol}
/>

)
}

{
(
  rol === "empleado" ||
  rol === "admin"
) &&
vista === "okr" && (

<OKR
  user={user}
  rol={rol}
/>

)
}
{
(
  rol === "coordinador" ||
  rol === "gerente" ||
  rol === "admin"
) &&
vista === "cierreMensual" && (

<CierreMensual
  user={user}
  rol={rol}
/>

)
}
</div>

);
}