import { useEffect, useState } from "react";
import { db } from "../firebase";
import { getDocs, collection } from "firebase/firestore";

export default function Control(){

  const [reportes,setReportes] = useState([]);
  const [pdf,setPdf] = useState("");
  const [mes,setMes] = useState("");

  //////////////////////////////////////
  // ✅ Cargar reportes
  //////////////////////////////////////
  const cargar = async ()=>{
    const snap = await getDocs(collection(db,"reportes"));

    const arr = [];
    snap.forEach(d=>{
      arr.push({ id:d.id, ...d.data() });
    });

    setReportes(arr);
  };

  useEffect(()=>{
    cargar();
  },[]);

  //////////////////////////////////////
  // ✅ Filtro por mes
  //////////////////////////////////////
  const filtrados = reportes.filter(r=>{
    if(!mes) return true;
    return (r.nombre || "").toLowerCase().includes(mes.toLowerCase());
  });

  //////////////////////////////////////
  // ✅ UI
  //////////////////////////////////////
  return (
    <div>

      <h2>Control de Reportes</h2>

      {/* 🔍 FILTRO */}
      <input
        placeholder="Filtrar por mes (ej: marzo)"
        value={mes}
        onChange={e=>setMes(e.target.value)}
        style={{marginBottom:"15px", padding:"8px"}}
      />

      {/* 📊 TABLA */}
      <table>

        <thead>
          <tr>
            <th>Usuario</th>
            <th>Archivo</th>
            <th>Estado</th>
            <th>Entrega</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>

          {filtrados.map(r=>(
            <tr key={r.id}>
              <td>{r.usuario}</td>
              <td>{r.nombre || "Sin nombre"}</td>

              <td>
                {r.firmado ? "✅ Firmado" : "⏳ Pendiente"}
              </td>

              <td style={{
                color: r.firmado ? "green" : "red"
              }}>
                {r.firmado ? "Entregado" : "Falta"}
              </td>

              <td>
                <button onClick={()=>setPdf(r.archivo)}>
                  Ver
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {/* 📊 RESUMEN */}
      <div style={{marginTop:"20px"}}>

        <p>
          ✅ Entregados: {reportes.filter(r=>r.firmado).length}
        </p>

        <p>
          ❌ Pendientes: {reportes.filter(r=>!r.firmado).length}
        </p>

      </div>

      {/* ✅ VISOR PDF (FIX PRINCIPAL) */}
      {pdf && (
        <iframe
          src={pdf}
          width="100%"
          height="500"
          style={{marginTop:"20px", border:"1px solid #ccc"}}
        ></iframe>
      )}

    </div>
  );
}