const limpiar = (
  valor,
  defecto = ""
) => {

  if (
    valor === null ||
    valor === undefined
  ) {
    return defecto;
  }

  return String(valor).trim();

};

const numero = (
  valor,
  defecto = 0
) => {

  const n = Number(valor);

  return Number.isFinite(n)
    ? n
    : defecto;

};
const calcularCumplimiento = (
  meta,
  actual
) => {

  const metaNum =
    Number(
      String(meta)
        .replace(/[^\d.]/g, "")
    );

  const actualNum =
    Number(
      String(actual)
        .replace(/[^\d.]/g, "")
    );

  if (
    Number.isFinite(metaNum) &&
    metaNum > 0 &&
    Number.isFinite(actualNum)
  ) {

    return Math.min(
      Math.round(
        (actualNum / metaNum) * 100
      ),
      100
    );

  }

  return
    limpiar(meta) ===
    limpiar(actual)
      ? 100
      : 0;

};
export const mapearCierrePDF =
(cierre) => {

  const proyectos = [];
  const riesgosGlobales = [];
  const siguientesPasosGlobales = [];

  (
    cierre.reporte?.responsables || []
  ).forEach(
    (responsable) => {

      (
        responsable.proyectos || []
      ).forEach(
        (proyecto) => {

          proyectos.push({

            responsable:
              limpiar(
                responsable.responsableVWM
              ),

            rol:
              limpiar(
                responsable.rolResponsabilidad
              ),

            grupo:
              limpiar(
                responsable.grupo
              ),

            nombre:
              limpiar(
                proyecto.proyecto
              ),

            descripcion:
              limpiar(
                proyecto.descripcion
              ),

            estado:
              limpiar(
                proyecto.estado
              ),

            avance:
              numero(
                proyecto.avance
              ),

            hitos:
              (
                proyecto.hitos || []
              ).map(
                (hito) => ({
                  nombre:
                    limpiar(
                      hito.nombre
                    ),
                  soll:
                    limpiar(
                      hito.soll
                    ),
                  ist:
                    limpiar(
                      hito.ist
                    )
                })
              ),

            riesgos:
              proyecto.riesgos || [],

            siguientesPasos:
              proyecto.siguientesPasos || []

          });

          (
            proyecto.riesgos || []
          ).forEach(
            (riesgo) => {

              if (riesgo) {
                riesgosGlobales.push(
                  riesgo
                );
              }

            }
          );

          (
            proyecto.siguientesPasos || []
          ).forEach(
            (paso) => {

              if (paso) {
                siguientesPasosGlobales.push(
                  paso
                );
              }

            }
          );

        }
      );

    }
  );

  const okrs =
    cierre.okr?.okrs || [];
  const kpis = [];

okrs.forEach(
  (okr) => {

    (okr.kpis || []).forEach(
      (kpi) => {

        kpis.push({

          nombre:
            limpiar(
              kpi.nombre ||
              kpi.indicador
            ),

          meta:
            limpiar(
              kpi.meta
            ),

          actual:
            limpiar(
              kpi.actual
            ),

cumplimiento:
  numero(
    kpi.cumplimiento ??
    kpi.avance ??
    calcularCumplimiento(
      kpi.meta,
      kpi.actual
    )
  )

        });

      }
    );

  }
);
const slas = [];

okrs.forEach(
  (okr) => {

    (okr.slas || []).forEach(
      (sla) => {

slas.push({

  nombre:
    limpiar(
      sla.nombre
    ),

  cliente:
    limpiar(
      sla.cliente
    ),

  cumplimiento:
    numero(
      sla.cumplimiento
    )

});

      }
    );

  }
);
  const totalObjetivos =
    okrs.length;

  const totalKR =
    okrs.reduce(
      (
        total,
        okr
      ) =>
        total +
        (
          okr.resultadosClave
            ?.length || 0
        ),
      0
    );

  const totalKPI =
    okrs.reduce(
      (
        total,
        okr
      ) =>
        total +
        (
          okr.kpis?.length || 0
        ),
      0
    );

  const totalSLA =
    okrs.reduce(
      (
        total,
        okr
      ) =>
        total +
        (
          okr.slas?.length || 0
        ),
      0
    );

  const avancePromedio =
    totalObjetivos > 0
      ? Math.round(
          okrs.reduce(
            (
              suma,
              okr
            ) =>
              suma +
              (
                okr.avance || 0
              ),
            0
          ) /
          totalObjetivos
        )
      : 0;
console.log(
  "KPI ORIGINAL",
  okrs[0]?.kpis
);

console.log(
  "SLA ORIGINAL",
  okrs[0]?.slas
);
  return {

    meta: {

      titulo:
        "Reporte Mensual",

      empleado:
        `${cierre.nombre} ${cierre.apellido}`,

      correo:
        cierre.usuario,

      grupo:
        cierre.grupo,

      mes:
        cierre.mes,

      anio:
        cierre.anio,

      estado:
        cierre.estado

    },

    resumen: {

      objetivos:
        totalObjetivos,

      resultadosClave:
        totalKR,

      kpis:
        totalKPI,

      slas:
        totalSLA,

      avance:
        avancePromedio

    },

    reporteMensual: {

      sla:
        cierre.reporte?.sla || "",

      posicion:
        cierre.reporte?.posicion || "",

      periodo:
        cierre.reporte?.periodo || "",

      logros:
        cierre.reporte?.logros || "",

      problemas:
        cierre.reporte?.problemas || "",

      acciones:
        cierre.reporte?.acciones || ""

    },

proyectos,

riesgos:
  riesgosGlobales,

siguientesPasos:
  siguientesPasosGlobales,

kpis,

slas,

okrs

  };

};