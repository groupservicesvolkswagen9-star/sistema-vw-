import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoVWGS from "../assets/logo.png";

import {
  mapearCierrePDF
} from "./pdfMapper";

//----------------------------------------
// FUNCIONES AUXILIARES
//----------------------------------------
const colores = {
  azul: [10, 110, 209],
  verde: [0, 170, 0],
  amarillo: [255, 165, 0],
  rojo: [220, 0, 0],
  gris: [220, 220, 220]
};
const obtenerColorSemaforo =
(valor) => {

  if (valor >= 80)
    return colores.verde;

  if (valor >= 50)
    return colores.amarillo;

  return colores.rojo;

};
const dibujarBarra = (
  pdf,
  x,
  y,
  valor
) => {

  const anchoTotal = 120;

  const anchoProgreso =
    (Math.min(valor, 100) / 100) *
    anchoTotal;

pdf.setFillColor(
  ...colores.gris
);

pdf.roundedRect(
  x,
  y,
  anchoTotal,
  10,
  2,
  2,
  "F"
);

pdf.setFillColor(
  ...obtenerColorSemaforo(
    valor
  )
);

pdf.roundedRect(
  x,
  y,
  anchoProgreso,
  10,
  2,
  2,
  "F"
);

};
  
const dibujarTarjeta = (
  pdf,
  x,
  y,
  titulo,
  valor,
  color
) => {

  pdf.setFillColor(
    ...color
  );

  pdf.roundedRect(
    x,
    y,
    42,
    28,
    3,
    3,
    "F"
  );

  pdf.setTextColor(
    255,
    255,
    255
  );

  pdf.setFontSize(9);

  pdf.text(
    titulo,
    x + 21,
    y + 8,
    {
      align: "center"
    }
  );

  pdf.setFontSize(18);

  pdf.text(
    String(valor),
    x + 21,
    y + 20,
    {
      align: "center"
    }
  );

};
 const dibujarLogo = (
    pdf
  ) => {

  pdf.addImage(
    logoVWGS,
    "PNG",
    150,
    8,
    40,
    15
  );

};
const dibujarBloque = (
  pdf,
  titulo,
  contenido,
  y,
  color
) => {

  const texto =
    pdf.splitTextToSize(
      String(
  contenido || "-"
),
      160
    );

  const alturaTexto =
    texto.length * 5;

  const alturaCaja =
    22 + alturaTexto;

  // Fondo blanco

  pdf.setFillColor(
    255,
    255,
    255
  );

  pdf.setDrawColor(
    ...color
  );

  pdf.roundedRect(
    15,
    y,
    180,
    alturaCaja,
    3,
    3,
    "FD"
  );

  // Barra lateral

  pdf.setFillColor(
    ...color
  );
pdf.circle(
  30,
  y + 9,
  2,
  "F"
);
  pdf.rect(
    15,
    y,
    6,
    alturaCaja,
    "F"
  );

  // Título

  pdf.setTextColor(
    ...color
  );

  pdf.setFontSize(12);

  pdf.text(
    titulo,
    38,
    y + 10
  );

  // Línea separadora

  pdf.setDrawColor(
    220,
    220,
    220
  );

  pdf.line(
    28,
    y + 14,
    190,
    y + 14
  );

  // Texto

  pdf.setTextColor(
    60,
    60,
    60
  );

  pdf.setFontSize(10);

  pdf.text(
    texto,
    28,
    y + 24
  );

  return alturaCaja;

};
const dibujarPiePagina = (
  pdf
) => {

  const totalPaginas =
    pdf.getNumberOfPages();

  for (
    let i = 1;
    i <= totalPaginas;
    i++
  ) {

    pdf.setPage(i);

    pdf.setFontSize(8);

    pdf.setTextColor(
      100,
      100,
      100
    );

    pdf.text(
      "Volkswagen Group Services México",
      15,
      290
    );

    pdf.text(
      "INTERNAL",
      95,
      290
    );

    pdf.text(
      `Página ${i} de ${totalPaginas}`,
      160,
      290
    );

  }

};
//----------------------------------------
// Portada
//----------------------------------------
const dibujarPortada =
(
  pdf,
  datos
) => {

pdf.setFillColor(
  0,
  47,
  57
);

pdf.rect(
  0,
  0,
  210,
  297,
  "F"
);


 dibujarLogo(pdf);

  pdf.setTextColor(
    255,
    255,
    255
  );

  pdf.setFontSize(18);

  pdf.text(
    "VOLKSWAGEN GROUP SERVICES",
    20,
    18
  );



pdf.setFontSize(30);

pdf.text(
  `Reporte Mensual ${datos.meta.mes} ${datos.meta.anio}`,
  15,
  135
);

pdf.setFontSize(26);

pdf.text(
  `Grupo ${datos.meta.grupo}`,
  15,
  160
);
pdf.setFontSize(12);

pdf.text(
  datos.meta.empleado,
  15,
  195
);

pdf.text(
  datos.meta.correo,
  15,
  205
);
const estadoColor =
  datos.meta.estado
    ?.toLowerCase()
    ?.includes("aprob")
    ? [0,170,0]
    : [220,0,0];

pdf.setFillColor(
  ...estadoColor
);

pdf.roundedRect(
  15,
  218,
  45,
  12,
  3,
  3,
  "F"
);

pdf.setTextColor(
  255,
  255,
  255
);

pdf.setFontSize(10);

pdf.text(
  datos.meta.estado,
  22,
  226
);
pdf.setFontSize(10);

pdf.text(
  "Volkswagen Group Services México",
  15,
  275
);

pdf.text(
  "INTERNAL",
  15,
  285
);
};
//----------------------------------------
// Resumen ejecutivo
//----------------------------------------
const dibujarResumen =
(
  pdf,
  datos
) => {

  pdf.addPage();

  pdf.setFontSize(18);

pdf.setFontSize(22);

pdf.text(
  "Resumen",
  20,
  20
);
const anchoTarjeta = 42;
const espacio = 5;

const anchoTotal =
  (anchoTarjeta * 4) +
  (espacio * 3);

const inicioX =
  (210 - anchoTotal) / 2;

dibujarTarjeta(
  pdf,
  inicioX,
  40,
  "OBJ",
  datos.resumen.objetivos,
  [0,110,209]
);

dibujarTarjeta(
  pdf,
  inicioX + 47,
  40,
  "KR",
  datos.resumen.resultadosClave,
  [0,148,136]
);

dibujarTarjeta(
  pdf,
  inicioX + 94,
  40,
  "KPI",
  datos.resumen.kpis,
  [140,198,63]
);

dibujarTarjeta(
  pdf,
  inicioX + 141,
  40,
  "SLA",
  datos.resumen.slas,
  [255,165,0]
);

  const color =
    obtenerColorSemaforo(
      datos.resumen.avance
    );

  pdf.setFillColor(
    ...color
  );

  pdf.circle(
    105,
    120,
    25,
    "F"
  );
let estadoTexto =
  "ROJO";

if (
  datos.resumen.avance >= 80
) {
  estadoTexto = "VERDE";
}
else if (
  datos.resumen.avance >= 50
) {
  estadoTexto = "AMARILLO";
}
pdf.setFontSize(18);

pdf.setTextColor(
  ...color
);

pdf.setFontSize(20);

pdf.text(
  estadoTexto,
  105,
  155,
  {
    align:"center"
  }
);
  pdf.setFontSize(28);

pdf.setFontSize(32);

pdf.text(
  `${datos.resumen.avance}%`,
  105,
  175,
  {
    align:"center"
  }
);
pdf.setFontSize(12);

pdf.setTextColor(
  100,
  100,
  100
);

pdf.setFontSize(14);

pdf.text(
  "Avance General",
  105,
  190,
  {
    align:"center"
  }
);

dibujarBarra(
  pdf,
  45,
  205,
  datos.resumen.avance
);
pdf.setFontSize(10);

pdf.setTextColor(
  120,
  120,
  120
);

pdf.text(
  `Empleado: ${datos.meta.empleado}`,
  20,
  230
);

pdf.text(
  `Grupo: ${datos.meta.grupo}`,
  20,
  240
);

pdf.text(
  `${datos.meta.mes} ${datos.meta.anio}`,
  20,
  250
);
pdf.setTextColor(
  0,
  0,
  0
);
};
//----------------------------------------
// Pagina reporte mensual
//----------------------------------------
const dibujarReporteMensual =
(
  pdf,
  datos
) => {

  pdf.addPage();

pdf.setFontSize(22);

pdf.text(
  "Reporte Mensual",
  20,
  20
);

pdf.setDrawColor(
  0,
  148,
  136
);

pdf.line(
  20,
  26,
  190,
  26
);

autoTable(
  pdf,
  {
    theme: "grid",

    startY: 40,
    styles: {
  fontSize: 10,
  cellPadding: 4
},

    head: [[
      "Campo",
      "Valor"
    ]],

    headStyles: {
      fillColor: [0,148,136]
    },

    body: [
      [
        "SLA",
        datos.reporteMensual.sla
      ],
      [
        "Posición",
        datos.reporteMensual.posicion
      ],
      [
        "Periodo",
        datos.reporteMensual.periodo
      ]
    ]
  }
);
let y =
  pdf.lastAutoTable.finalY + 10;
let altura =
  dibujarBloque(
    pdf,
    "LOGROS",
    datos.reporteMensual.logros,
    y,
    [0,170,0]
  );

y += altura + 20;


altura =
  dibujarBloque(
    pdf,
    "PROBLEMAS",
    datos.reporteMensual.problemas,
    y,
    [220,0,0]
  );

y += altura + 20;

altura =
  dibujarBloque(
    pdf,
    "ACCIONES",
    datos.reporteMensual.acciones,
    y,
    [0,110,209]
  );
};
//----------------------------------------
// Pagina proyectos
//----------------------------------------
const dibujarProyectos =
(
  pdf,
  datos
) => {

  pdf.addPage();

pdf.setFontSize(22);

pdf.text(
  "Resumen Proyectos",
  20,
  20
);

pdf.setDrawColor(
  0,
  148,
  136
);

pdf.line(
  20,
  26,
  190,
  26
);

autoTable(
  pdf,
  {
    startY: 40,

    theme: "grid",

    styles: {
      fontSize: 10,
      cellPadding: 4
    },

    headStyles: {
      fillColor: [0,148,136],
      textColor: [255,255,255]
    },

    alternateRowStyles: {
      fillColor: [245,245,245]
    },

    head:[[
      "Proyecto",
      "Estado",
      "Avance",
      "Responsable"
    ]],

    body:
      datos.proyectos.map(
        proyecto => [

          proyecto.nombre,

          proyecto.estado,

          `${proyecto.avance}%`,

          proyecto.responsable

        ]
      )

  }
);
const y =
  pdf.lastAutoTable.finalY + 15;

pdf.setFontSize(12);

pdf.setTextColor(
  100,
  100,
  100
);

pdf.text(
  `Total proyectos: ${datos.proyectos.length}`,
  20,
  y
);
};
const dibujarDetalleProyectos =
(
  pdf,
  datos
) => {

  datos.proyectos.forEach(
    (proyecto) => {

      pdf.addPage();

      pdf.setFontSize(18);
      pdf.setFillColor(
  0,
  148,
  136
);

pdf.roundedRect(
  15,
  12,
  180,
  18,
  3,
  3,
  "F"
);

pdf.setTextColor(
  255,
  255,
  255
);

pdf.setFontSize(16);

pdf.text(
  proyecto.nombre,
  20,
  24
);
let currentY = 35;

      pdf.setFontSize(11);

pdf.text(
  `Responsable: ${proyecto.responsable}`,
  20,
  currentY
);
currentY += 10;
pdf.setFillColor(
  245,
  245,
  245
);
const resumenY = currentY;
pdf.roundedRect(
  15,
  currentY,
  180,
  40,
  3,
  3,
  "F"
);


const estadoColor =
  proyecto.estado === "Verde"
    ? [0,170,0]
    : proyecto.estado === "Amarillo"
    ? [255,165,0]
    : [220,0,0];

pdf.setFillColor(
  ...estadoColor
);

pdf.circle(
  24,
  resumenY + 10,
  3,
  "F"
);

pdf.setTextColor(
  60,
  60,
  60
);

pdf.text(
  proyecto.estado,
  32,
  resumenY + 11
);

pdf.setFontSize(12);

pdf.text(
  "Avance",
  20,
  resumenY + 25
);

pdf.setFontSize(18);

pdf.text(
  `${proyecto.avance}%`,
  20,
  resumenY + 34
);

dibujarBarra(
  pdf,
  60,
  resumenY + 29,
  proyecto.avance
);
const alturaResumen = 40;

currentY +=
  alturaResumen + 10;

const alturaDescripcion =
  dibujarBloque(
    pdf,
    "DESCRIPCION",
    proyecto.descripcion,
    currentY,
    [0,148,136]
  );
  currentY +=
  alturaDescripcion + 15;


      autoTable(
        pdf,
        {
  theme: "grid",

  styles: {
    fontSize: 10,
    cellPadding: 4
  },

  headStyles: {
    fillColor: [0,148,136],
    textColor: [255,255,255]
  },
  alternateRowStyles: {
  fillColor: [245,245,245]
},

          startY: currentY,

          head: [[
            "Hito",
            "SOLL",
            "IST"
          ]],

          body:
            (proyecto.hitos || []).map(
              (
                hito
              ) => [

                hito.nombre,

                hito.soll,

                hito.ist

              ]
            )
        }
        
      );
      currentY =
  pdf.lastAutoTable.finalY + 15;
    if (currentY > 240) {

  pdf.addPage();

  currentY = 20;

}
  const alturaRiesgos =
  dibujarBloque(
    pdf,
    "RIESGOS",
    Array.isArray(
  proyecto.riesgos
)
  ? proyecto.riesgos.join("\n")
  : proyecto.riesgos || "-",
    currentY,
    [220,0,0]
  );

currentY +=
  alturaRiesgos + 15;
  if (currentY > 240) {

  pdf.addPage();

  currentY = 20;

}
  dibujarBloque(
  pdf,
  "SIGUIENTES PASOS",
  Array.isArray(
  proyecto.siguientesPasos
)
  ? proyecto.siguientesPasos.join("\n")
  : proyecto.siguientesPasos || "-",
  currentY,
  [0,110,209]
);

    }
  );

};

//----------------------------------------
// Pagina Hitos
//----------------------------------------
const dibujarHitos =
(
  pdf,
  proyecto
) => {

  autoTable(
    pdf,
    {
      theme: "grid",

      head: [[
        "Hito",
        "SOLL",
        "IST"
      ]],

      body:
        (proyecto.hitos || []).map(
          (
            hito
          ) => [

            hito.nombre,

            hito.soll,

            hito.ist

          ]
        )
    }
  );

};
//----------------------------------------
// Pagina KPI
//----------------------------------------
const dibujarKPI = (
  pdf,
  datos
) => {

  pdf.addPage();

  pdf.setFontSize(22);

  pdf.text(
    "Indicadores KPI",
    20,
    20
  );

  pdf.setDrawColor(
    0,
    148,
    136
  );

  pdf.line(
    20,
    26,
    190,
    26
  );

  const kpis =
    datos.kpis || [];

  let currentY = 45;

  pdf.setFontSize(12);

  pdf.text(
    `Total KPI: ${kpis.length}`,
    20,
    currentY
  );

  currentY += 20;

  kpis.forEach(
    (kpi) => {

     pdf.setFillColor(
  245,
  245,
  245
);

pdf.roundedRect(
  15,
  currentY - 10,
  180,
  35,
  3,
  3,
  "F"
);

pdf.setFontSize(12);

pdf.setTextColor(
  0,
  0,
  0
);
const textoKPI =
  pdf.splitTextToSize(
    kpi.nombre,
    140
  );
pdf.text(
  textoKPI,
  20,
  currentY
);

pdf.setFontSize(10);

pdf.text(
  `Meta: ${kpi.meta}`,
  20,
  currentY + 10
);

pdf.text(
  `Actual: ${kpi.actual}`,
  80,
  currentY + 10
);

pdf.setFontSize(18);

pdf.text(
  `${kpi.cumplimiento}%`,
  165,
  currentY + 12
);

dibujarBarra(
  pdf,
  20,
  currentY + 16,
  kpi.cumplimiento
);

currentY += 50;

    }
  );

};
//----------------------------------------
// Pagina SLA
//----------------------------------------
const dibujarSLA = (
  pdf,
  datos
) => {

  pdf.addPage();

  pdf.setFontSize(22);

  pdf.text(
    "Indicadores SLA",
    20,
    20
  );

  pdf.setDrawColor(
    0,
    148,
    136
  );

  pdf.line(
    20,
    26,
    190,
    26
  );

  const slas =
    datos.slas || [];

  let currentY = 45;

  pdf.setFontSize(12);

  pdf.text(
    `Total SLA: ${slas.length}`,
    20,
    currentY
  );

  currentY += 20;

  slas.forEach(
    (sla) => {

    pdf.setFillColor(
  245,
  245,
  245
);

pdf.roundedRect(
  15,
  currentY - 10,
  180,
  35,
  3,
  3,
  "F"
);

pdf.setFontSize(12);

pdf.setTextColor(
  0,
  0,
  0
);
const textoSLA =
  pdf.splitTextToSize(
    sla.nombre,
    140
  );

pdf.text(
  textoSLA,
  20,
  currentY
);

pdf.setFontSize(10);

pdf.text(
  `Cliente: ${sla.cliente}`,
  20,
  currentY + 10
);
pdf.text(
  "Cumplimiento SLA",
  20,
  currentY + 18
);
pdf.setFontSize(18);

pdf.text(
  `${sla.cumplimiento}%`,
  155,
  currentY + 18
);

dibujarBarra(
  pdf,
  20,
  currentY + 24,
  sla.cumplimiento
);

currentY += 45;


    }
  );

};
//----------------------------------------
// Export principal
//----------------------------------------
export const generarPDF =
async (cierre) => {

  const datos =
    mapearCierrePDF(
      cierre
    );

  const pdf =
    new jsPDF();

  dibujarPortada(
    pdf,
    datos
  );

  dibujarResumen(
    pdf,
    datos
  );

  dibujarReporteMensual(
    pdf,
    datos
  );

dibujarProyectos(
  pdf,
  datos
);

dibujarDetalleProyectos(
  pdf,
  datos
);

dibujarKPI(
  pdf,
  datos
);

  dibujarSLA(
    pdf,
    datos
  );

dibujarPiePagina(
  pdf
);
const nombreArchivo =
  `Reporte_${datos.meta.empleado}_${datos.meta.mes}_${datos.meta.anio}.pdf`;

const blob =
  pdf.output("blob");

return {
  blob,
  nombreArchivo,
  datos
};

};
