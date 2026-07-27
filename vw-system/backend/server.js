const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bucket = require("./storage");

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
const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>{
  console.log("Servidor corriendo en puerto " + PORT);
});