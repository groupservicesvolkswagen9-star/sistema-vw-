import PptxGenJS from "pptxgenjs";
import logoVWGS from "../assets/logo.png";
export const generarPPTX =
async (
  cierresGrupo,
  contexto = {}
) => {

  const pptx =
    new PptxGenJS();
    console.log(
  "PPTX DATA",
  cierresGrupo
);


  pptx.layout =
    "LAYOUT_WIDE";

  pptx.author =
    "Volkswagen Group Services";

  pptx.company =
    "Volkswagen Group Services México";

  pptx.subject =
    "Reporte Ejecutivo";

  pptx.title =
    "Reporte Mensual Coordinación";
//----------------------------------------
// Elementos corporativos
//----------------------------------------

const agregarLogoCorporativo = (slide) => {
  slide.addImage({
    path: logoVWGS,
    x: 10.2,
    y: 0.08,
    w: 1.3,
    h: 0.55
  });
};

const agregarPiePagina = (slide, pagina) => {
  slide.addText(
    `Volkswagen Group Services México | Página ${pagina}`,
    {
      x: 0.3,
      y: 7.0,
      w: 11.3,
      h: 0.15,
      fontSize: 8,
      color: "808080",
      align: "right"
    }
  );
};
const grupo =
  cierresGrupo[0]?.grupo || "";
const tipoReporte =
  contexto.tipo ||
  "COORDINACION";

const responsableVWM =
  contexto.responsableVWM ||
  "";

const nombreGrupoVWM =
  contexto.grupo ||
  grupo;
const grupoId =
  cierresGrupo[0]?.grupoId || "";

if (!Array.isArray(cierresGrupo) || cierresGrupo.length === 0) {
  alert("No existen registros para generar el PPT");
  return;
}
const empleados =
  cierresGrupo.length;
const mes =
  cierresGrupo[0]?.mes || "";

const anio =
  cierresGrupo[0]?.anio || "";
const promedio =
  Math.round(

    cierresGrupo.reduce(
      (
        suma,
        cierre
      ) => {

        const okrs =
          cierre.okr?.okrs || [];

        const avance =
          okrs.length > 0
            ? (
                okrs.reduce(
                  (
                    total,
                    item
                  ) =>
                    total +
                    (
                      item.avance || 0
                    ),
                  0
                ) /
                okrs.length
              )
            : 0;

        return suma + avance;

      },
      0
    ) / empleados

  );

const objetivos =
  cierresGrupo.reduce(
    (
      total,
      cierre
    ) =>
      total +
      (
        cierre.okr?.okrs?.length || 0
      ),
    0
  );

const kr =
  cierresGrupo.reduce(
    (
      total,
      cierre
    ) =>
      total +
      (
        cierre.okr?.okrs || []
      ).reduce(
        (
          suma,
          okr
        ) =>
          suma +
          (
            okr.resultadosClave?.length || 0
          ),
        0
      ),
    0
  );
//----------------------------------------
// Portada
//----------------------------------------
const slide1 =
  pptx.addSlide();
slide1.addImage({
  path: logoVWGS,
  x: 8.8,
  y: 0.4,
  w: 2.8,
  h: 1.2
});
slide1.background = {
  color: "002F39"
};
slide1.addText(
  "VOLKSWAGEN GROUP SERVICES",
  {
    x: 0.5,
    y: 0.5,
    w: 6,
    h: 0.5,

    color: "FFFFFF",

    fontSize: 20,

    bold: true
  }
);
slide1.addText(
  tipoReporte === "GRUPO_VWM"
    ? `Reporte Mensual ${nombreGrupoVWM}`
    : `Reporte de Servicios ${grupo}`,
  {
    x: 0.5,
    y: 1.8,

    w: 8,

    h: 0.8,

    color: "FFFFFF",

    fontSize: 28,

    bold: true
  }
);
slide1.addText(

  tipoReporte === "GRUPO_VWM"
    ? `Grupo Volkswagen: ${nombreGrupoVWM}`
    : `Grupo Coordinación: ${grupoId}`,

  {
    x: 0.4,
    y: 3.4,
    w: 7,
    color: "FFFFFF",
    fontSize: 18,
    bold: true
  }

);

slide1.addText(

  tipoReporte === "GRUPO_VWM"
    ? `Especialistas VWGS: ${empleados}`
    : `Grupo Volkswagen Cliente: ${grupo}`,

  {
    x: 0.4,
    y: 4.0,
    w: 7,
    color: "FFFFFF",
    fontSize: 16
  }

);

if (
  tipoReporte === "GRUPO_VWM"
) {

  slide1.addText(
    `Responsable VWM: ${responsableVWM}`,
    {
      x: 0.4,
      y: 4.7,
      w: 7,
      color: "FFFFFF",
      fontSize: 16,
      bold: true
    }
  );

}
slide1.addText(

  tipoReporte === "GRUPO_VWM"
    ? `Reporte de ${nombreGrupoVWM}`
    : `Asistencia Avanzada y Sistemas Chasis [${grupo}]`,

  {
    x: 0.3,
    y: 5.1,
    color: "FFFFFF",
    fontSize: 14
  }

);
slide1.addText(
  `${mes} ${anio}`,
  {
    x: 0.3,
    y: 5.8,

    color: "FFFFFF",

    fontSize: 18,

    bold: true
  }
);



slide1.addText(
  `empleados: ${empleados}`,
  {
    x: 0.3,
    y: 6.8,

    color: "FFFFFF",

    fontSize: 14
  }
);

slide1.addText(
  `Avance promedio ${promedio}%`,
  {
    x: 2.5,
    y: 6.8,

    color: "FFFFFF",

    fontSize: 14
  }
);
//----------------------------------------
// Resumen Ejecutivo
//----------------------------------------

const slide2 = pptx.addSlide();
agregarLogoCorporativo(slide2);
agregarPiePagina(slide2, 2);
slide2.background = {
  color: "FFFFFF"
};

slide2.addText(
  "Resumen",
  {
    x: 0.4,
    y: 0.3,
    w: 4,
    h: 0.4,
    fontSize: 22,
    bold: true,
    color: "002F39"
  }
);

//----------------------------------------
// Conteo Semáforos
//----------------------------------------

let verdes = 0;
let amarillos = 0;
let rojos = 0;

cierresGrupo.forEach((cierre) => {
  (cierre.okr?.okrs || []).forEach((okr) => {
    if (okr.estadoSemaforo === "Verde") verdes++;
    else if (okr.estadoSemaforo === "Amarillo") amarillos++;
    else rojos++;
  });
});

//----------------------------------------
// Semáforo General
//----------------------------------------

let color = "DC0000";
let texto = "ROJO";

if (promedio >= 80) {
  color = "00AA00";
  texto = "VERDE";
}
else if (promedio >= 50) {
  color = "FFA500";
  texto = "AMARILLO";
}

//----------------------------------------
// Tarjetas KPI
//----------------------------------------

const tarjeta = (
  slide,
  titulo,
  valor,
  x
) => {

  slide.addShape(
    pptx.ShapeType.roundRect,
    {
      x,
      y: 1,
      w: 2,
      h: 1.1,
      radius: 0.08,
      fill: {
        color: "009688"
      },
      line: {
        color: "009688"
      }
    }
  );

  slide.addText(
    titulo,
    {
      x: x + 0.15,
      y: 1.15,
      w: 1.6,
      h: 0.2,
      color: "FFFFFF",
      fontSize: 10,
      bold: true
    }
  );

  slide.addText(
    String(valor),
    {
      x: x + 0.15,
      y: 1.45,
      w: 1.5,
      h: 0.3,
      color: "FFFFFF",
      fontSize: 20,
      bold: true
    }
  );
};

tarjeta(
  slide2,
  "Empleados",
  empleados,
  0.3
);

tarjeta(
  slide2,
  "Avance",
  `${promedio}%`,
  2.5
);

tarjeta(
  slide2,
  "Objetivos",
  objetivos,
  4.7
);

tarjeta(
  slide2,
  "KR",
  kr,
  6.9
);

tarjeta(
  slide2,
  "Semáforo",
  texto,
  9.1
);

//----------------------------------------
// Estado General Ejecutivo
//----------------------------------------

slide2.addText(
  tipoReporte === "GRUPO_VWM"
    ? "Estado General del Grupo Volkswagen"
    : "Estado General de la Coordinación",
  {
    x: 0.6,
    y: 2.6,
    w: 4,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: "002F39"
  }
);

slide2.addShape(
  pptx.ShapeType.ellipse,
  {
    x: 0.7,
    y: 3.1,
    w: 0.55,
    h: 0.55,
    fill: {
      color
    },
    line: {
      color
    }
  }
);

slide2.addText(
  texto,
  {
    x: 1.5,
    y: 3.15,
    w: 2,
    h: 0.3,
    fontSize: 22,
    bold: true,
    color
  }
);

slide2.addText(
  `Avance Global: ${promedio}%`,
  {
    x: 1.5,
    y: 3.6,
    w: 3,
    h: 0.3,
    fontSize: 14,
    color: "555555"
  }
);

//----------------------------------------
// Resumen Ejecutivo Automático
//----------------------------------------
const textoResumen =
  tipoReporte === "GRUPO_VWM"
    ? `El grupo Volkswagen ${nombreGrupoVWM} está conformado por ${empleados} colaborador(es). Durante ${mes} ${anio} se gestionaron ${objetivos} objetivos estratégicos y ${kr} resultados clave. El porcentaje promedio de avance alcanzado fue de ${promedio}% manteniendo un estatus general ${texto}.`
    : `La coordinación ${grupo} está conformada por ${empleados} colaborador(es). Durante ${mes} ${anio} se gestionaron ${objetivos} objetivos estratégicos y ${kr} resultados clave. El porcentaje promedio de avance alcanzado fue de ${promedio}% manteniendo un estatus general ${texto}.`;
slide2.addText(
  [{ text: textoResumen }],
  {
    x: 4.2,
    y: 2.5,
    w: 7,
    h: 1.5,
    fontSize: 12,
    color: "444444",
    valign: "mid"
  }
);

//----------------------------------------
// Distribución de Semáforos
//----------------------------------------

slide2.addText(
  "Distribución de OKRs",
  {
    x: 0.6,
    y: 4.4,
    w: 3,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: "002F39"
  }
);

slide2.addText(
  `🟢 Verde      ${verdes}`,
  {
    x: 0.8,
    y: 4.9,
    fontSize: 14,
    color: "008000",
    bold: true
  }
);

slide2.addText(
  `🟡 Amarillo   ${amarillos}`,
  {
    x: 0.8,
    y: 5.3,
    fontSize: 14,
    color: "D68910",
    bold: true
  }
);

slide2.addText(
  `🔴 Rojo       ${rojos}`,
  {
    x: 0.8,
    y: 5.7,
    fontSize: 14,
    color: "C0392B",
    bold: true
  }
);

//----------------------------------------
// Barra Ejecutiva de Avance
//----------------------------------------

slide2.addText(
  tipoReporte === "GRUPO_VWM"
    ? "Avance Global Grupo Volkswagen"
    : "Avance Global Coordinación",
  {
    x: 4.2,
    y: 4.4,
    w: 5,
    h: 0.25,
    align: "center",
    fontSize: 14,
    bold: true,
    color: "002F39"
  }
);

slide2.addShape(
  pptx.ShapeType.rect,
  {
    x: 4.2,
    y: 5.0,
    w: 6,
    h: 0.25,
    fill: {
      color: "DDDDDD"
    },
    line: {
      color: "DDDDDD"
    }
  }
);

slide2.addShape(
  pptx.ShapeType.rect,
  {
    x: 4.2,
    y: 5.0,
    w: (promedio / 100) * 6,
    h: 0.25,
    fill: {
      color
    },
    line: {
      color
    }
  }
);

slide2.addText(
  `${promedio}%`,
  {
    x: 6.7,
    y: 5.35,
    w: 1,
    h: 0.25,
    align: "center",
    bold: true,
    fontSize: 18,
    color
  }
);
//----------------------------------------
// Slide 3 - Equipo y Contribución
//----------------------------------------

const slide3 = pptx.addSlide();
agregarLogoCorporativo(slide3);
agregarPiePagina(slide3, 3);
slide3.background = {
  color: "FFFFFF"
};

slide3.addText(
  "Equipo y Contribución",
  {
    x: 0.4,
    y: 0.3,
    w: 4,
    h: 0.4,
    fontSize: 22,
    bold: true,
    color: "002F39"
  }
);

//----------------------------------------
// Calcular avance promedio por empleado
//----------------------------------------

const empleadosRanking =
  cierresGrupo
    .map((cierre) => {

      const okrs =
        Array.isArray(
          cierre?.okr?.okrs
        )
          ? cierre.okr.okrs
          : [];

      const avancePromedio =
        okrs.length > 0
          ? Math.round(
              okrs.reduce(
                (total, okr) =>
                  total +
                  Number(
                    okr?.avance || 0
                  ),
                0
              ) / okrs.length
            )
          : 0;

      return {
        nombre:
          `${cierre.nombre || ""} ${cierre.apellido || ""}`,
        avance:
          avancePromedio
      };

    })
    .sort(
      (a, b) =>
        b.avance - a.avance
    );

//----------------------------------------
// Encabezados
//----------------------------------------

slide3.addText(
  "Ranking de desempeño mensual",
  {
    x: 0.6,
    y: 1.0,
    w: 5,
    fontSize: 16,
    bold: true,
    color: "009688"
  }
);

//----------------------------------------
// Barras por empleado
//----------------------------------------

let y = 1.8;

empleadosRanking.forEach(
  (empleado, index) => {

    let colorBarra = "00AA00";

    if (empleado.avance < 80) {
      colorBarra = "FFA500";
    }

    if (empleado.avance < 50) {
      colorBarra = "DC0000";
    }

    slide3.addText(
      `${index + 1}. ${empleado.nombre}`,
      {
        x: 0.8,
        y,
        w: 3.5,
        h: 0.25,
        fontSize: 12,
        bold: true,
        color: "333333"
      }
    );

    // Barra fondo

    slide3.addShape(
      pptx.ShapeType.rect,
      {
        x: 4.0,
        y: y + 0.05,
        w: 5.0,
        h: 0.18,
        fill: {
          color: "E5E5E5"
        },
        line: {
          color: "E5E5E5"
        }
      }
    );

    // Barra avance

    slide3.addShape(
      pptx.ShapeType.rect,
      {
        x: 4.0,
        y: y + 0.05,
        w:
          (empleado.avance / 100) *
          5.0,
        h: 0.18,
        fill: {
          color: colorBarra
        },
        line: {
          color: colorBarra
        }
      }
    );

    slide3.addText(
      `${empleado.avance}%`,
      {
        x: 9.2,
        y: y - 0.02,
        w: 1,
        h: 0.3,
        fontSize: 12,
        bold: true,
        align: "right",
        color: colorBarra
      }
    );

    y += 0.65;

  }
);

//----------------------------------------
// Resumen inferior
//----------------------------------------

const mejorEmpleado =
  empleadosRanking[0];

if (mejorEmpleado) {

  slide3.addShape(
    pptx.ShapeType.roundRect,
    {
      x: 0.7,
      y: 5.8,
      w: 10,
      h: 0.8,
      fill: {
        color: "F5F7F9"
      },
      line: {
        color: "D9D9D9"
      }
    }
  );

  slide3.addText(
    `Top desempeño del período: ${mejorEmpleado.nombre} con ${mejorEmpleado.avance}% de avance promedio en sus objetivos.`,
    {
      x: 1.0,
      y: 6.0,
      w: 9.2,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: "002F39",
      align: "center"
    }
  );
  
}
//----------------------------------------
// Slide 4 - Portafolio de Objetivos
//----------------------------------------

const slide4 = pptx.addSlide();
agregarLogoCorporativo(slide4);
agregarPiePagina(slide4, 4);
slide4.background = {
  color: "FFFFFF"
};

slide4.addText(
  "Portafolio de Objetivos",
  {
    x: 0.4,
    y: 0.3,
    w: 5,
    h: 0.4,
    fontSize: 22,
    bold: true,
    color: "002F39"
  }
);

//----------------------------------------
// Construir filas
//----------------------------------------

const filasObjetivos = [];

cierresGrupo.forEach((cierre) => {

  const responsable =
    `${cierre.nombre || ""} ${cierre.apellido || ""}`.trim();

  (cierre.okr?.okrs || []).forEach((okr) => {

    filasObjetivos.push({
      objetivo:
        okr.objetivo || "Sin objetivo",
      responsable,
      avance:
        Number(okr.avance || 0),
      semaforo:
        okr.estadoSemaforo || "N/D"
    });

  });

});

//----------------------------------------
// Encabezados
//----------------------------------------

slide4.addShape(
  pptx.ShapeType.rect,
  {
    x: 0.4,
    y: 1.1,
    w: 11.7,
    h: 0.45,
    fill: {
      color: "002F39"
    },
    line: {
      color: "002F39"
    }
  }
);

slide4.addText(
  "Objetivo",
  {
    x: 0.5,
    y: 1.18,
    w: 4,
    fontSize: 12,
    bold: true,
    color: "FFFFFF"
  }
);

slide4.addText(
  "Responsable",
  {
    x: 4.6,
    y: 1.18,
    w: 2.2,
    fontSize: 12,
    bold: true,
    color: "FFFFFF"
  }
);

slide4.addText(
  "Avance",
  {
    x: 7,
    y: 1.18,
    w: 2,
    fontSize: 12,
    bold: true,
    color: "FFFFFF"
  }
);

slide4.addText(
  "Estado",
  {
    x: 10,
    y: 1.18,
    w: 1.5,
    fontSize: 12,
    bold: true,
    color: "FFFFFF"
  }
);

//----------------------------------------
// Filas
//----------------------------------------

let yObjetivos = 1.7;

filasObjetivos
  .slice(0, 12)
  .forEach((fila, index) => {

    const fondo =
      index % 2 === 0
        ? "F7F7F7"
        : "FFFFFF";

    slide4.addShape(
      pptx.ShapeType.rect,
      {
        x: 0.4,
       y: yObjetivos - 0.05,
        w: 11.7,
        h: 0.45,
        fill: {
          color: fondo
        },
        line: {
          color: fondo
        }
      }
    );

    slide4.addText(
      fila.objetivo,
      {
        x: 0.5,
        y: yObjetivos,
        w: 3.8,
        h: 0.25,
        fontSize: 10,
        color: "333333"
      }
    );

    slide4.addText(
      fila.responsable,
      {
        x: 4.6,
        y: yObjetivos,
        w: 2.2,
        h: 0.25,
        fontSize: 10,
        color: "333333"
      }
    );

    //----------------------------------------
    // Barra avance
    //----------------------------------------

    slide4.addShape(
      pptx.ShapeType.roundRect,
      {
        x: 7.0,
        y: yObjetivos + 0.05,
        w: 2.4,
        h: 0.15,
        fill: {
          color: "DDDDDD"
        },
        line: {
          color: "DDDDDD"
        }
      }
    );

    let colorBarra = "00AA00";

    if (fila.avance < 80) {
      colorBarra = "F39C12";
    }

    if (fila.avance < 50) {
      colorBarra = "DC0000";
    }

    slide4.addShape(
      pptx.ShapeType.roundRect,
      {
        x: 7.0,
        y: yObjetivos + 0.05,
        w: (fila.avance / 100) * 2.4,
        h: 0.15,
        fill: {
          color: colorBarra
        },
        line: {
          color: colorBarra
        }
      }
    );

    slide4.addText(
      `${fila.avance}%`,
      {
        x: 9.6,
        y: yObjetivos - 0.02,
        w: 0.8,
        h: 0.25,
        fontSize: 10,
        bold: true,
        color: colorBarra
      }
    );

    //----------------------------------------
    // Semáforo
    //----------------------------------------

    let icono = "⚪";
    let colorTexto = "666666";

    if (fila.semaforo === "Verde") {
      icono = "🟢";
      colorTexto = "00AA00";
    }

    if (fila.semaforo === "Amarillo") {
      icono = "🟡";
      colorTexto = "F39C12";
    }

    if (fila.semaforo === "Rojo") {
      icono = "🔴";
      colorTexto = "DC0000";
    }

    slide4.addText(
      `${icono} ${fila.semaforo}`,
      {
        x: 10,
         y: yObjetivos,
        w: 1.3,
        h: 0.25,
        fontSize: 10,
        bold: true,
        color: colorTexto
      }
    );

   yObjetivos += 0.48;
  });

//----------------------------------------
// Resumen inferior
//----------------------------------------

slide4.addText(
  `Total de objetivos monitoreados: ${filasObjetivos.length}`,
  {
    x: 0.5,
    y: 6.8,
    w: 4,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: "002F39"
  }
);
//----------------------------------------
// Slide 5 - KPIs Grupales
//----------------------------------------

//----------------------------------------
// Función KPI
//----------------------------------------

const calcularCumplimientoKPI = (kpi) => {

  // Caso 1:
  // Ya viene calculado

if (
  kpi?.cumplimiento !== undefined &&
  kpi?.cumplimiento !== null
) {
  return Math.min(
    Number(kpi.cumplimiento) || 0,
    100
  );
}


  // Caso 2:
  // Algunos registros guardan avance

if (
  kpi?.avance !== undefined &&
  kpi?.avance !== null
) {
  return Math.min(
    Number(kpi.avance) || 0,
    100
  );
}

  // Caso 3:
  // Actual y meta son exactamente iguales
  // Ejemplo: "3 semanas" vs "3 semanas"

  if (
    kpi?.actual &&
    kpi?.meta &&
    String(kpi.actual).trim() ===
    String(kpi.meta).trim()
  ) {
    return 100;
  }

  // Caso 4:
  // Intentar convertir a número

  const actual = parseFloat(
    String(kpi?.actual || "")
      .replace(",", ".")
  );

  const meta = parseFloat(
    String(kpi?.meta || "")
      .replace(",", ".")
  );

if (
  !isNaN(actual) &&
  !isNaN(meta) &&
  meta > 0
) {
  return Math.min(
    Math.round((actual / meta) * 100),
    100
  );
}
  // Caso 5:
  // No fue posible calcular

  return 0;

};

//----------------------------------------
// Consolidar KPIs
//----------------------------------------

const kpisAgrupados = {};

cierresGrupo.forEach((cierre) => {

  (cierre.okr?.okrs || []).forEach((okr) => {

    (okr.kpis || []).forEach((kpi) => {

      const nombre =
        kpi?.nombre ||
        "KPI Sin Nombre";

      const cumplimiento =
        calcularCumplimientoKPI(kpi);

      console.log(
        "KPI DEBUG",
        {
          nombre,
          actual: kpi.actual,
          meta: kpi.meta,
          avance: kpi.avance,
          cumplimiento
        }
      );

      if (!kpisAgrupados[nombre]) {

        kpisAgrupados[nombre] = {
          total: 0,
          cantidad: 0
        };

      }

      kpisAgrupados[nombre].total +=
        cumplimiento;

      kpisAgrupados[nombre].cantidad += 1;

    });

  });

});

//----------------------------------------
// Lista Consolidada
//----------------------------------------

const listaKPIs =
  Object.entries(
    kpisAgrupados
  )
  .map(
    ([nombre, valor]) => ({

      nombre,

      cumplimiento:
        valor.cantidad > 0
          ? Math.round(
              valor.total /
              valor.cantidad
            )
          : 0

    })
  )
  .sort(
    (a, b) =>
      b.cumplimiento -
      a.cumplimiento
  );

//----------------------------------------
// KPI Promedio
//----------------------------------------

const promedioKPI =
  listaKPIs.length > 0
    ? Math.round(
        listaKPIs.reduce(
          (total, item) =>
            total +
            item.cumplimiento,
          0
        ) /
        listaKPIs.length
      )
    : 0;
//----------------------------------------
// Slide
//----------------------------------------

const slide5 =
  pptx.addSlide();
agregarLogoCorporativo(slide5);
agregarPiePagina(slide5, 5);
slide5.background = {
  color: "FFFFFF"
};

slide5.addText(
  "KPIs Grupales",
  {
    x: 0.4,
    y: 0.3,
    w: 5,
    h: 0.4,
    fontSize: 22,
    bold: true,
    color: "002F39"
  }
);

//----------------------------------------
// Tarjetas superiores
//----------------------------------------

const colorKPI =
  promedioKPI >= 80
    ? "00AA00"
    : promedioKPI >= 50
    ? "F39C12"
    : "DC0000";

slide5.addShape(
  pptx.ShapeType.roundRect,
  {
    x: 0.5,
    y: 0.9,
    w: 2.5,
    h: 0.9,
    fill: {
      color: "009688"
    },
    line: {
      color: "009688"
    }
  }
);

slide5.addText(
  "KPIs Monitoreados",
  {
    x: 0.7,
    y: 1.1,
    w: 2,
    fontSize: 11,
    color: "FFFFFF",
    bold: true
  }
);

slide5.addText(
  String(listaKPIs.length),
  {
    x: 0.9,
    y: 1.35,
    w: 1,
    fontSize: 20,
    color: "FFFFFF",
    bold: true
  }
);

slide5.addShape(
  pptx.ShapeType.roundRect,
  {
    x: 3.3,
    y: 0.9,
    w: 2.5,
    h: 0.9,
    fill: {
      color: colorKPI
    },
    line: {
      color: colorKPI
    }
  }
);

slide5.addText(
  "Promedio KPI",
  {
    x: 3.5,
    y: 1.1,
    w: 2,
    fontSize: 11,
    color: "FFFFFF",
    bold: true
  }
);

slide5.addText(
  `${promedioKPI}%`,
  {
    x: 3.8,
    y: 1.35,
    w: 1.2,
    fontSize: 20,
    color: "FFFFFF",
    bold: true
  }
);

//----------------------------------------
// Tabla KPI
//----------------------------------------

slide5.addShape(
  pptx.ShapeType.rect,
  {
    x: 0.5,
    y: 2.1,
    w: 10.8,
    h: 0.45,
    fill: {
      color: "002F39"
    },
    line: {
      color: "002F39"
    }
  }
);

slide5.addText(
  "KPI",
  {
    x: 0.7,
    y: 2.18,
    w: 3,
    fontSize: 12,
    bold: true,
    color: "FFFFFF"
  }
);

slide5.addText(
  "Cumplimiento",
  {
    x: 8.5,
    y: 2.18,
    w: 2,
    fontSize: 12,
    bold: true,
    color: "FFFFFF"
  }
);

//----------------------------------------
// Filas KPI
//----------------------------------------

let yKpi = 2.7;

if (listaKPIs.length === 0) {

  slide5.addText(
    "No existen KPIs registrados.",
    {
      x: 1,
      y: 3.5,
      w: 5,
      h: 0.4,
      fontSize: 14,
      color: "666666"
    }
  );

}
else {

  listaKPIs
    .slice(0, 10)
    .forEach(
      (kpi, index) => {

        const fondo =
          index % 2 === 0
            ? "F7F7F7"
            : "FFFFFF";

        slide5.addShape(
          pptx.ShapeType.rect,
          {
            x: 0.5,
            y: yKpi - 0.05,
            w: 10.8,
            h: 0.45,
            fill: {
              color: fondo
            },
            line: {
              color: fondo
            }
          }
        );

        let colorBarra =
          "00AA00";

        if (
          kpi.cumplimiento < 80
        ) {
          colorBarra =
            "F39C12";
        }

        if (
          kpi.cumplimiento < 50
        ) {
          colorBarra =
            "DC0000";
        }

        slide5.addText(
          kpi.nombre,
          {
            x: 0.7,
            y: yKpi,
            w: 3.8,
            h: 0.25,
            fontSize: 10,
            color: "333333"
          }
        );

        slide5.addShape(
          pptx.ShapeType.rect,
          {
            x: 4.8,
            y: yKpi + 0.04,
            w: 3,
            h: 0.15,
            fill: {
              color: "DDDDDD"
            },
            line: {
              color: "DDDDDD"
            }
          }
        );

        slide5.addShape(
          pptx.ShapeType.rect,
          {
            x: 4.8,
            y: yKpi + 0.04,
            w:
              (kpi.cumplimiento / 100) * 3,
            h: 0.15,
            fill: {
              color: colorBarra
            },
            line: {
              color: colorBarra
            }
          }
        );

        slide5.addText(
          `${kpi.cumplimiento}%`,
          {
            x: 8.7,
            y: yKpi - 0.02,
            w: 1,
            h: 0.25,
            fontSize: 10,
            bold: true,
            color: colorBarra
          }
        );

        yKpi += 0.48;

      }
    );

}

//----------------------------------------
// Resumen inferior
//----------------------------------------

slide5.addText(
  `Total KPIs analizados: ${listaKPIs.length}`,
  {
    x: 0.6,
    y: 6.8,
    w: 3,
    h: 0.25,
    fontSize: 12,
    bold: true,
    color: "002F39"
  }
);
//----------------------------------------
// Slide 6 - SLAs Grupales
//----------------------------------------

//----------------------------------------
// Consolidar SLAs
//----------------------------------------

const slasAgrupados = {};

cierresGrupo.forEach((cierre) => {

  (cierre.okr?.okrs || []).forEach((okr) => {

    (okr.slas || []).forEach((sla) => {

      const nombre =
        sla?.nombre ||
        "SLA Sin Nombre";

      const cumplimiento =
        Number(
          sla?.cumplimiento || 0
        );

      if (!slasAgrupados[nombre]) {

        slasAgrupados[nombre] = {
          total: 0,
          cantidad: 0
        };

      }

      slasAgrupados[nombre].total +=
        cumplimiento;

      slasAgrupados[nombre].cantidad += 1;

    });

  });

});

//----------------------------------------
// Lista consolidada
//----------------------------------------

const listaSLAs =
  Object.entries(
    slasAgrupados
  )
    .map(
      ([nombre, valor]) => ({

        nombre,

        cumplimiento:
          valor.cantidad > 0
            ? Math.round(
                valor.total /
                valor.cantidad
              )
            : 0

      })
    )
    .sort(
      (a, b) =>
        b.cumplimiento -
        a.cumplimiento
    );

//----------------------------------------
// Promedio SLA
//----------------------------------------

const promedioSLA =
  listaSLAs.length > 0
    ? Math.round(
        listaSLAs.reduce(
          (total, item) =>
            total +
            item.cumplimiento,
          0
        ) /
        listaSLAs.length
      )
    : 0;

//----------------------------------------
// Slide 6
//----------------------------------------

const slide6 =
  pptx.addSlide();
agregarLogoCorporativo(slide6);
agregarPiePagina(slide6, 6);
slide6.background = {
  color: "FFFFFF"
};

slide6.addText(
  "SLAs Grupales",
  {
    x: 0.4,
    y: 0.3,
    w: 5,
    h: 0.4,
    fontSize: 22,
    bold: true,
    color: "002F39"
  }
);

//----------------------------------------
// Tarjetas
//----------------------------------------

const colorSLA =
  promedioSLA >= 95
    ? "00AA00"
    : promedioSLA >= 80
    ? "F39C12"
    : "DC0000";

slide6.addShape(
  pptx.ShapeType.roundRect,
  {
    x: 0.5,
    y: 0.9,
    w: 2.5,
    h: 0.9,
    fill: {
      color: "009688"
    },
    line: {
      color: "009688"
    }
  }
);

slide6.addText(
  "SLAs Monitoreados",
  {
    x: 0.7,
    y: 1.1,
    w: 2,
    fontSize: 11,
    color: "FFFFFF",
    bold: true
  }
);

slide6.addText(
  String(listaSLAs.length),
  {
    x: 0.9,
    y: 1.35,
    w: 1,
    fontSize: 20,
    color: "FFFFFF",
    bold: true
  }
);

slide6.addShape(
  pptx.ShapeType.roundRect,
  {
    x: 3.3,
    y: 0.9,
    w: 2.5,
    h: 0.9,
    fill: {
      color: colorSLA
    },
    line: {
      color: colorSLA
    }
  }
);

slide6.addText(
  "Promedio SLA",
  {
    x: 3.5,
    y: 1.1,
    w: 2,
    fontSize: 11,
    color: "FFFFFF",
    bold: true
  }
);

slide6.addText(
  `${promedioSLA}%`,
  {
    x: 3.8,
    y: 1.35,
    w: 1.5,
    fontSize: 20,
    color: "FFFFFF",
    bold: true
  }
);

//----------------------------------------
// Encabezado Tabla
//----------------------------------------

slide6.addShape(
  pptx.ShapeType.rect,
  {
    x: 0.5,
    y: 2.1,
    w: 10.8,
    h: 0.45,
    fill: {
      color: "002F39"
    },
    line: {
      color: "002F39"
    }
  }
);

slide6.addText(
  "SLA",
  {
    x: 0.7,
    y: 2.18,
    w: 3,
    fontSize: 12,
    bold: true,
    color: "FFFFFF"
  }
);

slide6.addText(
  "Cumplimiento",
  {
    x: 8.5,
    y: 2.18,
    w: 2,
    fontSize: 12,
    bold: true,
    color: "FFFFFF"
  }
);

//----------------------------------------
// Filas SLA
//----------------------------------------

let ySla = 2.7;

if (listaSLAs.length === 0) {

  slide6.addText(
    "No existen SLAs registrados.",
    {
      x: 1,
      y: 3.5,
      w: 5,
      h: 0.4,
      fontSize: 14,
      color: "666666"
    }
  );

}
else {

  listaSLAs
    .slice(0, 10)
    .forEach(
      (sla, index) => {

        const fondo =
          index % 2 === 0
            ? "F7F7F7"
            : "FFFFFF";

        slide6.addShape(
          pptx.ShapeType.rect,
          {
            x: 0.5,
            y: ySla - 0.05,
            w: 10.8,
            h: 0.45,
            fill: {
              color: fondo
            },
            line: {
              color: fondo
            }
          }
        );

        let colorBarra =
          "00AA00";

        if (
          sla.cumplimiento < 95
        ) {
          colorBarra =
            "F39C12";
        }

        if (
          sla.cumplimiento < 80
        ) {
          colorBarra =
            "DC0000";
        }

        slide6.addText(
          sla.nombre,
          {
            x: 0.7,
            y: ySla,
            w: 3.8,
            h: 0.25,
            fontSize: 10,
            color: "333333"
          }
        );

        slide6.addShape(
          pptx.ShapeType.rect,
          {
            x: 4.8,
            y: ySla + 0.04,
            w: 3,
            h: 0.15,
            fill: {
              color: "DDDDDD"
            },
            line: {
              color: "DDDDDD"
            }
          }
        );

        slide6.addShape(
          pptx.ShapeType.rect,
          {
            x: 4.8,
            y: ySla + 0.04,
            w:
              (sla.cumplimiento / 100) * 3,
            h: 0.15,
            fill: {
              color: colorBarra
            },
            line: {
              color: colorBarra
            }
          }
        );

        slide6.addText(
          `${sla.cumplimiento}%`,
          {
            x: 8.7,
            y: ySla - 0.02,
            w: 1,
            h: 0.25,
            fontSize: 10,
            bold: true,
            color: colorBarra
          }
        );

        ySla += 0.48;

      }
    );

}

//----------------------------------------
// Resumen Inferior
//----------------------------------------

slide6.addText(
  `Total SLAs analizados: ${listaSLAs.length}`,
  {
    x: 0.6,
    y: 6.8,
    w: 3.5,
    h: 0.25,
    fontSize: 12,
    bold: true,
    color: "002F39"
  }
);
//----------------------------------------
// Slide 7 - Logros Riesgos y Acciones
//----------------------------------------

const slide7 =
  pptx.addSlide();
agregarLogoCorporativo(slide7);
agregarPiePagina(slide7, 7);
slide7.background = {
  color: "FFFFFF"
};

slide7.addText(
  "Logros, Riesgos y Acciones",
  {
    x: 0.4,
    y: 0.3,
    w: 6,
    h: 0.4,
    fontSize: 22,
    bold: true,
    color: "002F39"
  }
);

//----------------------------------------
// Consolidar información
//----------------------------------------

const logros = [];
const riesgos = [];
const acciones = [];

cierresGrupo.forEach((cierre) => {

  const reporte =
    cierre.reporte || {};

  if (reporte.logros) {

    logros.push(
      `• ${cierre.nombre}\n${reporte.logros}`
    );

  }

  if (reporte.problemas) {

    riesgos.push(
      `• ${cierre.nombre}\n${reporte.problemas}`
    );

  }

  if (reporte.acciones) {

    acciones.push(
      `• ${cierre.nombre}\n${reporte.acciones}`
    );

  }

});

//----------------------------------------
// LOGROS
//----------------------------------------

slide7.addShape(
  pptx.ShapeType.roundRect,
  {
    x: 0.2,
    y: 0.9,
    w: 3.2,
    h: 5.6,
    fill: {
      color: "E8F5E9"
    },
    line: {
      color: "4CAF50"
    }
  }
);

slide7.addText(
  "✅ Logros",
  {
    x: 0.4,
    y: 1.05,
    w: 2,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: "2E7D32"
  }
);

slide7.addText(
  logros.length > 0
    ? logros.slice(0, 10).join("\n\n")
    : "Sin logros reportados",
  {
    x: 0.45,
    y: 1.55,
    w: 2.7,
    h: 4.7,
    fontSize: 9,
    color: "333333",
    valign: "top",
    margin: 0.05
  }
);

//----------------------------------------
// RIESGOS
//----------------------------------------

slide7.addShape(
  pptx.ShapeType.roundRect,
  {
    x: 4.0,
    y: 0.9,
    w: 3.2,
    h: 5.6,
    fill: {
      color: "FFF3E0"
    },
    line: {
      color: "FB8C00"
    }
  }
);

slide7.addText(
  "⚠ Riesgos",
  {
    x: 4.2,
    y: 1.05,
    w: 2,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: "EF6C00"
  }
);

slide7.addText(
  riesgos.length > 0
    ? riesgos.slice(0, 10).join("\n\n")
    : "Sin riesgos reportados",
  {
    x: 4.25,
    y: 1.55,
    w: 2.7,
    h: 4.7,
    fontSize: 9,
    color: "333333",
    valign: "top",
    margin: 0.05
  }
);

//----------------------------------------
// ACCIONES
//----------------------------------------

slide7.addShape(
  pptx.ShapeType.roundRect,
  {
    x: 7.8,
    y: 0.9,
    w: 3.2,
    h: 5.6,
    fill: {
      color: "E3F2FD"
    },
    line: {
      color: "1976D2"
    }
  }
);

slide7.addText(
  "▶ Acciones",
  {
    x: 8.0,
    y: 1.05,
    w: 2,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: "1565C0"
  }
);

slide7.addText(
  acciones.length > 0
    ? acciones.slice(0, 10).join("\n\n")
    : "Sin acciones reportadas",
  {
    x: 8.05,
    y: 1.55,
    w: 2.7,
    h: 4.7,
    fontSize: 9,
    color: "333333",
    valign: "top",
    margin: 0.05
  }
);

//----------------------------------------
// Resumen inferior
//----------------------------------------

slide7.addShape(
  pptx.ShapeType.rect,
  {
    x: 0.3,
    y: 6.75,
    w: 10.5,
    h: 0.25,
    fill: {
      color: "F3F5F7"
    },
    line: {
      color: "F3F5F7"
    }
  }
);

slide7.addText(
  `Logros: ${logros.length}   |   Riesgos: ${riesgos.length}   |   Acciones: ${acciones.length}`,
  {
    x: 0.5,
    y: 6.78,
    w: 8,
    h: 0.2,
    fontSize: 11,
    bold: true,
    color: "002F39"
  }
);
//----------------------------------------
// Slide 8 - Conclusiones y Próximos Pasos
//----------------------------------------

const slide8 =
  pptx.addSlide();
agregarLogoCorporativo(slide8);
agregarPiePagina(slide8, 8);
slide8.background = {
  color: "FFFFFF"
};

slide8.addText(
  "Conclusiones y Próximos Pasos",
  {
    x: 0.4,
    y: 0.3,
    w: 6,
    h: 0.4,
    fontSize: 22,
    bold: true,
    color: "002F39"
  }
);

//----------------------------------------
// Estado General
//----------------------------------------

let estadoFinal = "ROJO";
let colorFinal = "DC0000";

if (promedio >= 80) {

  estadoFinal = "VERDE";
  colorFinal = "00AA00";

}
else if (promedio >= 50) {

  estadoFinal = "AMARILLO";
  colorFinal = "F39C12";

}

slide8.addShape(
  pptx.ShapeType.roundRect,
  {
    x: 0.5,
    y: 1.0,
    w: 10.5,
    h: 1.0,
    fill: {
      color: "F5F7F9"
    },
    line: {
      color: "D9D9D9"
    }
  }
);

slide8.addText(
  `Estado General: ${estadoFinal}`,
  {
    x: 0.8,
    y: 1.25,
    w: 3,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: colorFinal
  }
);
const textoAvanceFinal =
  tipoReporte === "GRUPO_VWM"
    ? `Avance promedio del grupo: ${promedio}%`
    : `Avance promedio de la coordinación: ${promedio}%`;

slide8.addText(
  textoAvanceFinal,
  {
    x: 4.5,
    y: 1.25,
    w: 4,
    h: 0.3,
    fontSize: 14,
    color: "555555"
  }
);
//----------------------------------------
// Fortalezas
//----------------------------------------

slide8.addShape(
  pptx.ShapeType.roundRect,
  {
    x: 0.5,
    y: 2.4,
    w: 5,
    h: 2.5,
    fill: {
      color: "E8F5E9"
    },
    line: {
      color: "4CAF50"
    }
  }
);

slide8.addText(
  "✅ Fortalezas",
  {
    x: 0.8,
    y: 2.7,
    fontSize: 18,
    bold: true,
    color: "2E7D32"
  }
);

slide8.addText(
  [
    `• KPI promedio: ${promedioKPI}%`,
    `• SLA promedio: ${promedioSLA}%`,
    `• ${objetivos} objetivos monitoreados`,
    `• ${empleados} colaboradores participantes`
  ].join("\n"),
  {
    x: 0.8,
    y: 3.2,
    w: 4.2,
    h: 1.2,
    fontSize: 11,
    color: "333333"
  }
);

//----------------------------------------
// Próximos pasos
//----------------------------------------

slide8.addShape(
  pptx.ShapeType.roundRect,
  {
    x: 6.0,
    y: 2.4,
    w: 5,
    h: 2.5,
    fill: {
      color: "E3F2FD"
    },
    line: {
      color: "1976D2"
    }
  }
);

slide8.addText(
  "🎯 Próximos Pasos",
  {
    x: 6.3,
    y: 2.7,
    fontSize: 18,
    bold: true,
    color: "1565C0"
  }
);

slide8.addText(
  [
    "• Seguimiento a riesgos abiertos",
    "• Mantener cumplimiento SLA",
    "• Consolidar KPIs clave",
    "• Continuar ejecución de objetivos"
  ].join("\n"),
  {
    x: 6.3,
    y: 3.2,
    w: 4,
    h: 1.2,
    fontSize: 11,
    color: "333333"
  }
);

//----------------------------------------
// Mensaje final
//----------------------------------------

slide8.addText(
  "Volkswagen Group Services México",
  {
    x: 3.3,
    y: 6.2,
    w: 4,
    h: 0.3,
    align: "center",
    fontSize: 18,
    bold: true,
    color: "002F39"
  }
);

slide8.addText(
  "Reporte Ejecutivo Mensual",
  {
    x: 3.3,
    y: 6.55,
    w: 4,
    h: 0.3,
    align: "center",
    fontSize: 11,
    color: "666666"
  }
);
const nombreSeguro =
  (tipoReporte === "GRUPO_VWM"
    ? nombreGrupoVWM
    : grupo)
      .replace(/[\\/:*?"<>|]/g, "_");
const nombreArchivo =
  tipoReporte === "GRUPO_VWM"
    ? `Reporte_Grupo_${nombreSeguro}.pptx`
    : `Reporte_Coordinacion_${nombreSeguro}.pptx`;
await pptx.writeFile({
  fileName: nombreArchivo
});
};