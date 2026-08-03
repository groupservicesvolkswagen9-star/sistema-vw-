const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bucket = require("./storage");
const {
  graficaOKR,
  graficaSemaforo
} = require("./graficas");
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
  async (
    req,
    res
  ) => {

    try {

      const reporteSnap =
        await db
          .collection(
            "ReporteMensual"
          )
          .limit(1)
          .get();

      const okrSnap =
        await db
          .collection(
            "OKR"
          )
          .limit(1)
          .get();

      const reporte =
        reporteSnap.docs[0]
        .data();

      const okr =
        okrSnap.docs[0]
        .data();

      const imgPie =
        await graficaSemaforo(
          okr.okrs
        );

      const imgOKR =
        await graficaOKR(
          okr.okrs
        );

      const pdf =
        new PDFDocument({
          margin: 40,
          bufferPages:
            true
        });

      const buffers = [];

      pdf.on(
        "data",
        buffers.push.bind(
          buffers
        )
      );

      pdf.on(
        "end",
        async () => {

          const pdfBuffer =
            Buffer.concat(
              buffers
            );

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

      //////////////////////////////////////////////////
      // PAGINA 1 PORTADA
      //////////////////////////////////////////////////

      pdf.rect(
        0,
        0,
        612,
        120
      )
      .fill(
        "#003366"
      );

      pdf.image(
        "./assets/logo-vwgs.png",
        40,
        20,
        {
          width: 100
        }
      );

      pdf.fillColor(
        "white"
      );

      pdf.fontSize(24);

      pdf.text(
        "VOLKSWAGEN GROUP SERVICES",
        160,
        40
      );

      pdf.fillColor(
        "black"
      );

      pdf.moveDown(5);

      pdf.fontSize(28);

      pdf.text(
        "REPORTE EJECUTIVO",
        {
          align:
            "center"
        }
      );

      pdf.moveDown();

      pdf.fontSize(16);

      pdf.text(
        `${reporte.mes} ${reporte.anio}`,
        {
          align:
            "center"
        }
      );

      pdf.moveDown();

      pdf.text(
        `Grupo: ${reporte.grupoNombre}`,
        {
          align:
            "center"
        }
      );

      pdf.text(
        `${reporte.nombre} ${reporte.apellido}`,
        {
          align:
            "center"
        }
      );

      //////////////////////////////////////////////////
      // PAGINA 2 DASHBOARD
      //////////////////////////////////////////////////

      pdf.addPage();

      pdf.fontSize(20);

      pdf.text(
        "Dashboard Ejecutivo"
      );

      pdf.moveDown();

      pdf.image(
        imgPie,
        {
          fit: [
            350,
            250
          ],
          align:
            "center"
        }
      );

      pdf.moveDown();

      pdf.roundedRect(
        50,
        420,
        120,
        60,
        8
      )
      .fill(
        "#003366"
      );

      pdf.fillColor(
        "white"
      );

      pdf.text(
        `OKRs\n${okr.okrs.length}`,
        80,
        435
      );

      pdf.fillColor(
        "black"
      );

      //////////////////////////////////////////////////
      // PAGINA 3 RESUMEN
      //////////////////////////////////////////////////

      pdf.addPage();

      pdf.fontSize(20);

      pdf.fillColor(
        "#003366"
      );

      pdf.text(
        "Resumen Ejecutivo"
      );

      pdf.moveDown();

      pdf.fillColor(
        "black"
      );

      pdf.fontSize(12);

      pdf.text(
        `Logros\n\n${reporte.logros}`
      );

      pdf.moveDown();

      pdf.text(
        `Problemas\n\n${reporte.problemas}`
      );

      pdf.moveDown();

      pdf.text(
        `Acciones\n\n${reporte.acciones}`
      );

      //////////////////////////////////////////////////
      // PAGINA 4 GRAFICA OKR
      //////////////////////////////////////////////////

      pdf.addPage();

      pdf.fontSize(20);

      pdf.text(
        "Desempeño de OKR"
      );

      pdf.moveDown();

      pdf.image(
        imgOKR,
        {
          fit: [
            500,
            350
          ],
          align:
            "center"
        }
      );

      //////////////////////////////////////////////////
      // PAGINA 5 KPI
      //////////////////////////////////////////////////

      pdf.addPage();

      pdf.fontSize(20);

      pdf.text(
        "KPIs"
      );

      pdf.moveDown();

      okr.okrs.forEach(
        objetivo => {

          objetivo.kpis
          ?.forEach(
            kpi => {

              pdf.rect(
                40,
                pdf.y,
                520,
                70
              )
              .stroke();

              pdf.text(
                `KPI: ${kpi.nombre}`,
                50,
                pdf.y + 10
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

              pdf.moveDown(
                4
              );

            }
          );

        }
      );

      //////////////////////////////////////////////////
      // PAGINA 6 CONCLUSIONES
      //////////////////////////////////////////////////

      pdf.addPage();

      pdf.fontSize(20);

      pdf.fillColor(
        "#003366"
      );

      pdf.text(
        "Conclusiones"
      );

      pdf.moveDown();

      pdf.fillColor(
        "black"
      );

      const promedio =
        Math.round(
          okr.okrs.reduce(
            (
              suma,
              x
            ) =>
              suma +
              x.avance,
            0
          ) /
          okr.okrs.length
        );

      pdf.text(
        `Promedio de cumplimiento OKR: ${promedio}%`
      );

      pdf.moveDown();

      pdf.text(
        `Estado General: ${okr.estado}`
      );

      pdf.moveDown();

      pdf.text(
        "Documento generado automáticamente por Volkswagen Group Services."
      );

      //////////////////////////////////////////////////
      // FOOTER
      //////////////////////////////////////////////////

      const paginas =
        pdf
        .bufferedPageRange()
        .count;

      for (
        let i = 0;
        i < paginas;
        i++
      ) {

        pdf.switchToPage(
          i
        );

        pdf.fontSize(
          8
        );

        pdf.fillColor(
          "gray"
        );

        pdf.text(
          `VWGS | Página ${i + 1} de ${paginas}`,
          40,
          770
        );

      }

      pdf.end();

    }
    catch (
      error
    ) {

      console.error(
        error
      );

      res.status(
        500
      ).json({

        error:
          error.message

      });

    }

  }
);
//////////////////////////////////////////////////////
const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>{
  console.log("Servidor corriendo en puerto " + PORT);
});