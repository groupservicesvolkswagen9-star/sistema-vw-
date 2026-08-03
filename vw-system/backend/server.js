const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bucket = require("./storage");
const PDFDocument =
  require("pdfkit");
const { PassThrough } =
  require("stream");
const PptxGenJS =
  require("pptxgenjs");

const {
  db
} = require(
  "./firebase-admin"
);
const app = express();

app.use(cors());
app.use(express.json());
const upload =
  multer({
    storage:
      multer.memoryStorage()
  });
//////////////////////////////////////////////////////
// ✅ TEST
//////////////////////////////////////////////////////
app.get("/", (req,res)=>{
  res.send("API funcionando ✅");
});

//////////////////////////////////////////////////////
// ✅ EJEMPLO PDF
//////////////////////////////////////////////////////
app.post("/generar-pdf", async (req,res)=>{

  // aquí irá tu lógica real
  res.send("PDF generado ✅");

});
//////////////////////////////////////////////////////
// ✅ GENERAR DOCUMENTO PDF
//////////////////////////////////////////////////////
app.post(
  "/generar-documentos",
  async (req, res) => {

    try {

      const {
        reporteId,
        okrId
      } = req.body;

      const reporteDoc =
        await db
          .collection(
            "ReporteMensual"
          )
          .doc(
            reporteId
          )
          .get();

      const okrDoc =
        await db
          .collection(
            "OKR"
          )
          .doc(
            okrId
          )
          .get();

      if (
        !reporteDoc.exists ||
        !okrDoc.exists
      ) {
        return res
          .status(404)
          .json({
            error:
            "Documento no encontrado"
          });
      }

      const reporte =
        reporteDoc.data();

      const okr =
        okrDoc.data();

      res.json({
        ok: true,
        reporte,
        okr
      });

    } catch (error) {

      console.error(
        error
      );

      res.status(500)
      .json({
        error:
          error.message
      });

    }

  }
);
//////////////////////////////////////////////////////
// ✅ FIRMA (ejemplo)
//////////////////////////////////////////////////////
app.post("/firmar", async (req,res)=>{

  const { documento } = req.body;

  // aquí irá firma real
  res.json({
    mensaje:"Documento firmado ✅",
    documento
  });

});

//////////////////////////////////////////////////////
// TEST STORAGE
//////////////////////////////////////////////////////

app.get(
  "/test-storage",
  async (req, res) => {

    try {

      const archivo =
        bucket.file(
          "prueba.txt"
        );

      await archivo.save(
        "Hola Google Cloud"
      );

      res.send(
        "Archivo subido correctamente ✅"
      );

    } catch (error) {

      console.error(error);

      res.status(500).send(
        error.message
      );

    }

  }
);
//////////////////////////////////////////////////////
// TEST 3
//////////////////////////////////////////////////////
app.get(
  "/test-firestore",
  async (req, res) => {

    try {

      const snap =
        await db
          .collection(
            "ReporteMensual"
          )
          .limit(1)
          .get();

      const documento =
        snap.docs[0];

      res.json({
        ok: true,
        id: documento.id,
        datos:
          documento.data()
      });

    } catch (error) {

      res.status(500)
      .json({
        error:
          error.message
      });

    }

  }
);
app.get(
  "/test-okr",
  async (req, res) => {

    try {

      const snap =
        await db
          .collection("OKR")
          .limit(1)
          .get();

      const documento =
        snap.docs[0];

      res.json({
        ok: true,
        id: documento.id,
        datos:
          documento.data()
      });

    } catch (error) {

      res.status(500)
      .json({
        error:
          error.message
      });

    }

  }
);
app.get(
  "/generar-pdf-prueba",
  async (req, res) => {

    try {

      const reporteSnap =
        await db
          .collection("ReporteMensual")
          .limit(1)
          .get();

      const okrSnap =
        await db
          .collection("OKR")
          .limit(1)
          .get();

      const reporte =
        reporteSnap.docs[0].data();

      const okr =
        okrSnap.docs[0].data();

      const pdf =
        new PDFDocument({
          bufferPages: true,
          margin: 50
        });

      const buffers = [];

      pdf.on(
        "data",
        buffers.push.bind(buffers)
      );

      pdf.on(
        "end",
        async () => {

          const pdfBuffer =
            Buffer.concat(buffers);

          const ruta =
            `documentos/pdf/${reporte.anio}/${reporte.mes}/${reporte.usuario}.pdf`;

          await bucket
            .file(ruta)
            .save(pdfBuffer);

          res.json({
            ok: true,
            ruta
          });

        }
      );

      ////////////////////////////////////////////////////
      // PORTADA
      ////////////////////////////////////////////////////

      pdf.rect(
        0,
        0,
        612,
        80
      ).fill("#003366");

      pdf.fillColor("white");

      pdf.fontSize(24)
         .text(
           "VOLKSWAGEN GROUP SERVICES",
           40,
           25
         );

      pdf.fillColor("black");

      pdf.moveDown(4);

      pdf.fontSize(20)
         .text(
           "Reporte Mensual Ejecutivo"
         );

      pdf.moveDown();

      pdf.fontSize(14);

      pdf.text(
        `Mes: ${reporte.mes}`
      );

      pdf.text(
        `Año: ${reporte.anio}`
      );

      pdf.text(
        `Grupo: ${reporte.grupoNombre}`
      );

      pdf.text(
        `Especialista: ${reporte.nombre} ${reporte.apellido}`
      );

      pdf.text(
        `Correo: ${reporte.usuario}`
      );

      ////////////////////////////////////////////////////
      // RESUMEN EJECUTIVO
      ////////////////////////////////////////////////////

      pdf.addPage();

      pdf.fontSize(18)
         .fillColor("#003366")
         .text(
           "Resumen Ejecutivo"
         );

      pdf.moveDown();

      pdf.fillColor("black");

      pdf.fontSize(12);

      pdf.text(
        `Logros:\n${reporte.logros}`
      );

      pdf.moveDown();

      pdf.text(
        `Problemas:\n${reporte.problemas}`
      );

      pdf.moveDown();

      pdf.text(
        `Acciones:\n${reporte.acciones}`
      );

      ////////////////////////////////////////////////////
      // DASHBOARD OKR
      ////////////////////////////////////////////////////

      pdf.addPage();

      pdf.fontSize(18)
         .fillColor("#003366")
         .text(
           "Dashboard OKR"
         );

      pdf.moveDown();

      okr.okrs.forEach(
        (item, index) => {

          let color = "red";
          let semaforo = "🔴";

          if (
            item.avance >= 80
          ) {

            color = "green";
            semaforo = "🟢";

          } else if (
            item.avance >= 50
          ) {

            color = "orange";
            semaforo = "🟡";

          }

          pdf.fillColor(color);

          pdf.fontSize(14)
             .text(
               `Objetivo ${index + 1}`
             );

          pdf.fillColor("black");

          pdf.text(
            `Objetivo: ${item.objetivo}`
          );

          pdf.text(
            `Resultado Clave: ${item.resultadoClave}`
          );

          pdf.text(
            `Avance: ${item.avance}%`
          );

          pdf.text(
            `Estado: ${semaforo}`
          );

          pdf.moveDown();

          ////////////////////////////////////////////////////
          // Barra de avance
          ////////////////////////////////////////////////////

          const anchoBarra =
            300;

          const progreso =
            (item.avance / 100)
            * anchoBarra;

          pdf.rect(
            50,
            pdf.y,
            anchoBarra,
            15
          )
          .stroke();

          pdf.rect(
            50,
            pdf.y,
            progreso,
            15
          )
          .fill(color);

          pdf.moveDown(2);

        }
      );

      ////////////////////////////////////////////////////
      // KPI
      ////////////////////////////////////////////////////

      pdf.addPage();

      pdf.fontSize(18)
         .fillColor("#003366")
         .text(
           "Indicadores KPI"
         );

      pdf.moveDown();

      okr.okrs.forEach(
        objetivo => {

          objetivo.kpis?.forEach(
            kpi => {

              pdf.fontSize(12)
                 .fillColor("black");

              pdf.text(
                `KPI: ${kpi.nombre}`
              );

              pdf.text(
                `Meta: ${kpi.meta}`
              );

              pdf.text(
                `Actual: ${kpi.actual}`
              );

              pdf.text(
                `Unidad: ${kpi.unidad}`
              );

              pdf.moveDown();

            }
          );

        }
      );

      ////////////////////////////////////////////////////
      // CONCLUSIONES
      ////////////////////////////////////////////////////

      pdf.addPage();

      pdf.fontSize(18)
         .fillColor("#003366")
         .text(
           "Conclusiones"
         );

      pdf.moveDown();

      pdf.fillColor("black");

      pdf.text(
        `Estado General: ${okr.estado}`
      );

      pdf.text(
        `Grupo: ${reporte.grupoNombre}`
      );

      pdf.text(
        `Periodo: ${reporte.mes} ${reporte.anio}`
      );

      pdf.moveDown();

      pdf.text(
        "Documento generado automáticamente por VWGS."
      );

      ////////////////////////////////////////////////////
      // PIE DE PÁGINA
      ////////////////////////////////////////////////////

      const totalPages =
        pdf.bufferedPageRange().count;

      for (
        let i = 0;
        i < totalPages;
        i++
      ) {

        pdf.switchToPage(i);

        pdf.fontSize(8);

        pdf.fillColor("gray");

        pdf.text(
          `VWGS Reporte Ejecutivo | Página ${i + 1} de ${totalPages}`,
          50,
          760
        );

      }

      pdf.end();

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: error.message
      });

    }

  }
);
//////////////////////////////////////////////////////
const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>{
  console.log("Servidor corriendo en puerto " + PORT);
});