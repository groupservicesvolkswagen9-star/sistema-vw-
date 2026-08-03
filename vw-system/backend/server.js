const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bucket = require("./storage");
const PDFDocument =
  require("pdfkit");

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

//////////////////////////////////////////////////////
const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>{
  console.log("Servidor corriendo en puerto " + PORT);
});