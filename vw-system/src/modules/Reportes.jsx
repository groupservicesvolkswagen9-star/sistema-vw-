import { useState, useEffect } from "react";
import ReporteMensual from "./ReporteMensual";
import OKR from "./OKR";

export default function Reportes({
  rol,
  user,
}) {

  const [vista,
  setVista] =
  useState(
    "reporteMensual"
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
    : "OKR"
}
</h2>

<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  }}
>

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
    setVista("reporteMensual")
  }
>
  Reporte Mensual
</button>



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
  OKR
</button>

</div>

{
vista ===
"reporteMensual" && (

<ReporteMensual
  user={user}
  rol={rol}
/>

)
}

{
vista === "okr" && (

<OKR
  user={user}
  rol={rol}
/>

)
}

</div>

);
}