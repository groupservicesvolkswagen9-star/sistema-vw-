const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

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
app.listen(3001, ()=>{
  console.log("Servidor corriendo en http://localhost:3001");
});