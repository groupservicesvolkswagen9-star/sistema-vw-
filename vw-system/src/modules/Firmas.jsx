import { useRef, useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function Firmas({ user, rol, reporteSeleccionado, onClose }) {

  const canvasRef = useRef(null);
  const [dibujando,setDibujando] = useState(false);

  ////////////////////////////////////////////////////
  // ✅ SOLO COORDINADOR
  ////////////////////////////////////////////////////
  if(rol !== "coordinador"){
    return <h3>No autorizado</h3>;
  }

  ////////////////////////////////////////////////////
  // ✅ CANVAS
  ////////////////////////////////////////////////////
  useEffect(()=>{

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let drawing = false;

    const start = (e)=>{
      drawing = true;
      ctx.moveTo(e.offsetX, e.offsetY);
    };

    const stop = ()=>{
      drawing = false;
      ctx.beginPath();
    };

    const draw = (e)=>{
      if(!drawing) return;

      ctx.lineWidth = 2;
      ctx.lineCap = "round";

      ctx.lineTo(e.offsetX,e.offsetY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(e.offsetX,e.offsetY);
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mousemove", draw);

    return ()=>{
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mouseup", stop);
      canvas.removeEventListener("mousemove", draw);
    };

  },[]);

  ////////////////////////////////////////////////////
  // ✅ LIMPIAR FIRMA
  ////////////////////////////////////////////////////
  const limpiar = ()=>{
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
  };

  ////////////////////////////////////////////////////
  // ✅ GUARDAR FIRMA EN REPORTE
  ////////////////////////////////////////////////////
  const guardar = async ()=>{

    if(!reporteSeleccionado) return;

    const canvas = canvasRef.current;

    const firmaBase64 = canvas.toDataURL();

    await updateDoc(doc(db,"reportes",reporteSeleccionado.id),{
      firma: firmaBase64,
      firmado: true,
      estado: "aprobado",
      firmadoPor: user.email,
      fechaFirma: new Date()
    });

    alert("✅ Documento firmado correctamente");

    onClose();
  };

  ////////////////////////////////////////////////////
  // ✅ UI
  ////////////////////////////////////////////////////
  return (
    <div className="card">

      <h2>Firma de Documento</h2>

      <p>
        Reporte: {reporteSeleccionado?.nombre}
      </p>

      <canvas
        ref={canvasRef}
        width="400"
        height="150"
        style={{
          border:"1px solid black",
          marginBottom:"10px"
        }}
      />

      <br />

      <button onClick={limpiar}>
        Limpiar
      </button>

      <button onClick={guardar} style={{marginLeft:"10px"}}>
        Firmar documento
      </button>

      <button onClick={onClose} style={{marginLeft:"10px"}}>
        Cancelar
      </button>

    </div>
  );
}