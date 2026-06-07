import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

import PDFViewer from "./PDFViewer";
import Firmas from "./Firmas";

export default function Solicitudes({ user, rol }) {

  const [file,setFile] = useState(null);
  const [lista,setLista] = useState([]);
  const [pdf,setPdf] = useState("");
  const [firma,setFirma] = useState(null);

  //////////////////////////////////////////////////////
  // ✅ CARGAR SOLICITUDES
  //////////////////////////////////////////////////////
  const cargar = async ()=>{
    const snap = await getDocs(collection(db,"solicitudes"));

    const arr=[];
    snap.forEach(d=>{
      arr.push({id:d.id,...d.data()});
    });

    setLista(arr);
  };

  useEffect(()=>{
    cargar();
  },[]);

  //////////////////////////////////////////////////////
  // ✅ BASE64
  //////////////////////////////////////////////////////
  const toBase64 = (file)=>{
    return new Promise((resolve)=>{
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = ()=>resolve(reader.result);
    });
  };

  //////////////////////////////////////////////////////
  // ✅ ENVIAR SOLICITUD (EMPLEADO)
  //////////////////////////////////////////////////////
  const enviar = async ()=>{
    if(!file) return;

    const base64 = await toBase64(file);

    await addDoc(collection(db,"solicitudes"),{
      usuario:user.email,
      archivo:base64,
      nombre:file.name,
      estado:"En proceso",
      firmado:false,
      fecha:new Date()
    });

    setFile(null);
    cargar();
  };

  //////////////////////////////////////////////////////
  // ✅ APROBAR
  //////////////////////////////////////////////////////
  const aprobar = async (sol)=>{
    setFirma(sol); // abre firma
  };

  //////////////////////////////////////////////////////
  // ✅ RECHAZAR (NUEVO)
  //////////////////////////////////////////////////////
  const rechazar = async (id)=>{
    await updateDoc(doc(db,"solicitudes",id),{
      estado:"Rechazada",
      firmado:false
    });

    cargar();
  };

  //////////////////////////////////////////////////////
  // ✅ FILTRO POR ROL
  //////////////////////////////////////////////////////
  const datosFiltrados = lista.filter(s=>{
    if(rol === "coordinador" || rol === "admin"){
      return true;
    }
    return s.usuario === user.email;
  });

  //////////////////////////////////////////////////////
  // ✅ COLOR ESTADO
  //////////////////////////////////////////////////////
  const colorEstado = (estado)=>{
    if(estado==="Aprobada") return "green";
    if(estado==="Rechazada") return "red";
    return "orange";
  };

  //////////////////////////////////////////////////////
  // ✅ UI
  //////////////////////////////////////////////////////
  return (
    <div className="card">

      <h2>📑 Solicitudes</h2>

      {/* ✅ EMPLEADO ENVÍA */}
      {rol === "empleado" && (
        <div style={{marginBottom:"15px"}}>

          <input
            type="file"
            accept="application/pdf"
            onChange={e=>setFile(e.target.files[0])}
          />

          <button onClick={enviar}>
            Enviar solicitud
          </button>

          {/* ✅ FORMATO (Excel) */}
          <button style={{marginLeft:"10px"}}>
            Ver formatos
          </button>

        </div>
      )}

      {/* ✅ TABLA */}
      <table>

        <thead>
          <tr>
            <th>Usuario</th>
            <th>Archivo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {datosFiltrados.map(s=>(
            <tr key={s.id}>

              <td>{s.usuario}</td>

              <td>{s.nombre}</td>

              <td style={{
                color: colorEstado(s.estado)
              }}>
                {s.estado}
              </td>

              <td>

                {/* ✅ VER */}
                <button onClick={()=>setPdf(s.archivo)}>
                  Ver
                </button>

                {/* ✅ COORDINADOR */}
                {(rol === "coordinador") && s.estado !== "Aprobada" && s.estado !== "Rechazada" && (
                  <>
                    <button onClick={()=>aprobar(s)}>
                      Aprobar
                    </button>

                    <button
                      onClick={()=>rechazar(s.id)}
                      style={{background:"red", color:"white", marginLeft:"5px"}}
                    >
                      Rechazar
                    </button>
                  </>
                )}

              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {/* ✅ VISOR */}
      {pdf && (
        <PDFViewer archivo={pdf}/>
      )}

      {/* ✅ FIRMA */}
      {firma && (
        <Firmas
          user={user}
          rol={rol}
          reporteSeleccionado={firma}
          onClose={()=>{
            setFirma(null);
            cargar();
          }}
        />
      )}

    </div>
  );
}