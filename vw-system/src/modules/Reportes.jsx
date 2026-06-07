import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs
} from "firebase/firestore";

import PDFViewer from "./PDFViewer";
import Firmas from "./Firmas";

export default function Reportes({ user, rol }) {

  const [file,setFile] = useState(null);
  const [lista,setLista] = useState([]);
  const [pdf,setPdf] = useState("");
  const [firma,setFirma] = useState(null);

  //////////////////////////////////////////////////////
  // ✅ CARGAR DATOS
  //////////////////////////////////////////////////////
  const cargar = async ()=>{
    const snap = await getDocs(collection(db,"reportes"));

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
  // ✅ CONVERTIR PDF A BASE64
  //////////////////////////////////////////////////////
  const toBase64 = (file)=>{
    return new Promise((resolve)=>{
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = ()=>resolve(reader.result);
    });
  };

  //////////////////////////////////////////////////////
  // ✅ EMPLEADO SUBE REPORTE
  //////////////////////////////////////////////////////
  const subir = async ()=>{
    if(!file) return;

    const base64 = await toBase64(file);

    await addDoc(collection(db,"reportes"),{
      usuario:user.email,
      archivo:base64,
      nombre:file.name,
      estado:"pendiente",
      firmado:false,
      fecha:new Date()
    });

    setFile(null);
    cargar();
  };

  //////////////////////////////////////////////////////
  // ✅ FILTRO SEGÚN ROL
  //////////////////////////////////////////////////////
  const datosFiltrados = lista.filter(r=>{
    if(rol === "coordinador" || rol === "admin"){
      return true;
    }
    return r.usuario === user.email;
  });

  //////////////////////////////////////////////////////
  // ✅ UI
  //////////////////////////////////////////////////////
  return (
    <div className="card">

      <h2>📄 Reportes</h2>

      {/* ✅ SUBIR SOLO EMPLEADO */}
      {rol === "empleado" && (
        <div style={{marginBottom:"15px"}}>
          <input
            type="file"
            accept="application/pdf"
            onChange={e=>setFile(e.target.files[0])}
          />
          <button onClick={subir}>
            Enviar reporte
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

          {datosFiltrados.map(r=>(
            <tr key={r.id}>

              <td>{r.usuario}</td>

              <td>{r.nombre}</td>

              <td>
                {r.firmado ? "✅ Aprobado" : "⏳ Pendiente"}
              </td>

              <td>

                {/* ✅ VER PDF */}
                <button onClick={()=>setPdf(r.archivo)}>
                  Ver
                </button>

                {/* ✅ FIRMAR SOLO COORDINADOR */}
                {(rol === "coordinador") && !r.firmado && (
                  <button onClick={()=>setFirma(r)}>
                    Firmar
                  </button>
                )}

              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {/* ✅ VISOR PDF */}
      {pdf && (
        <PDFViewer archivo={pdf}/>
      )}

      {/* ✅ MODAL FIRMA */}
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