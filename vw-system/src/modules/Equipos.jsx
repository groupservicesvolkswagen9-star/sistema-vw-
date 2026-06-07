import { useEffect, useState } from "react";
import { db } from "../firebase";
import { getDocs, collection } from "firebase/firestore";

export default function Control({ rol }) {

  const [reportes,setReportes] = useState([]);
  const [pdf,setPdf] = useState("");
  const [mes,setMes] = useState("");

  //////////////////////////////////////
  // ✅ CARGAR REPORTES
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
  // ✅ FILTRO POR MES
  //////////////////////////////////////
  const filtrados = reportes.filter(r=>{
    if(!mes) return true;
    return (r.nombre || "").toLowerCase().includes(mes.toLowerCase());
  });

  //////////////////////////////////////
  // ✅ VALIDAR ROL
  //////////////////////////////////////
  if(rol !== "coordinador"){
    return <h2>No autorizado</h2>;
  }

  //////////////////////////////////////
  // ✅ UI
  //////////////////////////////////////
  return (
    <div>

      <h2>Control de Reportes</h2>

      {/* ✅ BUSCADOR */}
      <input
        className="input"
        placeholder="Filtrar por mes (ej: marzo)"
        value={mes}
        onChange={e=>setMes(e.target.value)}
        style={{marginBottom:"15px"}}
      />

      {/* ✅ TABLA */}
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

              <td>{r.firmado ? "✅ Firmado" : "⏳ Pendiente"}</td>

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

      {/* ✅ RESUMEN */}
      <div style={{marginTop:"20px"}}>
        <p>✅ Entregados: {reportes.filter(r=>r.firmado).length}</p>
        <p>❌ Pendientes: {reportes.filter(r=>!r.firmado).length}</p>
      </div>

      {/* ✅ VISOR PDF (FIX ERROR) */}
      {pdf && (
        {pdf}
      )}

    </div>
  );
}