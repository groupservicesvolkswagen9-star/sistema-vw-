import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

export default function Vacaciones({ user, rol }) {

  const [vista,setVista] = useState("lista");
  const [lista,setLista] = useState([]);
  const [fi,setFi] = useState("");
  const [ff,setFf] = useState("");

  //////////////////////////////////////////////////////
  // ✅ CARGAR
  //////////////////////////////////////////////////////
  const cargar = async ()=>{
    const snap = await getDocs(collection(db,"vacaciones"));

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
  // ✅ ENVIAR SOLICITUD
  //////////////////////////////////////////////////////
  const enviar = async ()=>{

    if(!fi || !ff){
      alert("Selecciona fechas");
      return;
    }

    if(fi > ff){
      alert("Fecha inválida");
      return;
    }

    await addDoc(collection(db,"vacaciones"),{
      usuario: user.email,
      fechaInicio: fi,
      fechaFin: ff,
      estado: "En proceso",
      fecha: new Date()
    });

    setFi("");
    setFf("");

    alert("✅ Solicitud enviada");
    cargar();
  };

  //////////////////////////////////////////////////////
  // ✅ APROBAR
  //////////////////////////////////////////////////////
  const aprobar = async (id)=>{
    await updateDoc(doc(db,"vacaciones",id),{
      estado:"Aprobada"
    });
    cargar();
  };

  //////////////////////////////////////////////////////
  // ✅ RECHAZAR
  //////////////////////////////////////////////////////
  const rechazar = async (id)=>{
    await updateDoc(doc(db,"vacaciones",id),{
      estado:"Rechazada"
    });
    cargar();
  };

  //////////////////////////////////////////////////////
  // ✅ FILTRO
  //////////////////////////////////////////////////////
  const datos = lista.filter(v=>{
    if(rol === "empleado"){
      return v.usuario === user.email;
    }
    return true;
  });

  //////////////////////////////////////////////////////
  // ✅ COLOR ESTADO
  //////////////////////////////////////////////////////
  const color = (estado)=>{
    if(estado === "Aprobada") return "green";
    if(estado === "Rechazada") return "red";
    return "orange";
  };

  //////////////////////////////////////////////////////
  // ✅ UI
  //////////////////////////////////////////////////////
  return (
    <div className="card">

      <h2>🏖️ Vacaciones</h2>

      {/* ✅ MENU */}
      {rol === "empleado" ? (
        <div style={{marginBottom:"15px"}}>

          <button onClick={()=>setVista("crear")}>
            Solicitar
          </button>

          <button onClick={()=>setVista("lista")} style={{marginLeft:"10px"}}>
            Mis solicitudes
          </button>

        </div>
      ) : (
        <div style={{marginBottom:"15px"}}>
          <button onClick={()=>setVista("lista")}>
            Solicitudes empleados
          </button>
        </div>
      )}

      {/* ✅ FORMULARIO */}
      {vista === "crear" && rol === "empleado" && (

        <div className="card" style={{maxWidth:"400px"}}>

          <h3>Solicitar Vacaciones</h3>

          <input
            className="input"
            type="date"
            value={fi}
            onChange={e=>setFi(e.target.value)}
          />

          <br/><br/>

          <input
            className="input"
            type="date"
            value={ff}
            onChange={e=>setFf(e.target.value)}
          />

          <br/><br/>

          <button onClick={enviar}>
            Enviar solicitud
          </button>

        </div>

      )}

      {/* ✅ TABLA */}
      {vista === "lista" && (

        <table>

          <thead>
            <tr>
              <th>Usuario</th>
              <th>Fechas</th>
              <th>Estado</th>
              {(rol !== "empleado") && <th>Acciones</th>}
            </tr>
          </thead>

          <tbody>

            {datos.map(v=>(
              <tr key={v.id}>

                <td>{v.usuario}</td>

                <td>
                  {v.fechaInicio} - {v.fechaFin}
                </td>

                <td style={{color:color(v.estado)}}>
                  {v.estado}
                </td>

                {(rol !== "empleado") && (
                  <td>

                    <button onClick={()=>aprobar(v.id)}>
                      ✅
                    </button>

                    <button
                      onClick={()=>rechazar(v.id)}
                      style={{marginLeft:"5px", background:"red", color:"white"}}
                    >
                      ❌
                    </button>

                  </td>
                )}

              </tr>
            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}
