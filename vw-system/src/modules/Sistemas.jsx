import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";

export default function Sistemas({ user, rol }) {

  const [nombre,setNombre] = useState("");
  const [lista,setLista] = useState([]);

  //////////////////////////////////////////////////////
  // ✅ CARGAR DATOS
  //////////////////////////////////////////////////////
  const cargar = async ()=>{
    const snap = await getDocs(collection(db,"sistemas"));

    const arr = [];
    snap.forEach(d=>{
      arr.push({ id:d.id, ...d.data() });
    });

    setLista(arr);
  };

  useEffect(()=>{
    cargar();
  },[]);

  //////////////////////////////////////////////////////
  // ✅ EMPLEADO AGREGA SISTEMA
  //////////////////////////////////////////////////////
  const agregar = async ()=>{
    if(!nombre) return;

    await addDoc(collection(db,"sistemas"),{
      usuario:user.email,
      sistema:nombre,
      estado:"lo necesita"   // 👈 según Excel
    });

    setNombre("");
    cargar();
  };

  //////////////////////////////////////////////////////
  // ✅ CAMBIAR ESTADO (COORDINADOR / ADMIN)
  //////////////////////////////////////////////////////
  const cambiarEstado = async (id,estado)=>{
    await updateDoc(doc(db,"sistemas",id),{
      estado
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
  // ✅ UI
  //////////////////////////////////////////////////////
  return (
    <div className="card">

      <h2>🖥️ Sistemas</h2>

      {/* ✅ SOLO EMPLEADO AGREGA */}
      {rol === "empleado" && (
        <div style={{marginBottom:"15px"}}>
          <input
            className="input"
            placeholder="Nombre del sistema"
            value={nombre}
            onChange={(e)=>setNombre(e.target.value)}
          />

          <button onClick={agregar} style={{marginLeft:"10px"}}>
            Agregar sistema
          </button>
        </div>
      )}

      {/* ✅ TABLA EMPRESA */}
      <table>

        <thead>
          <tr>
            <th>Usuario</th>
            <th>Sistema</th>
            <th>Estado</th>

            {(rol === "coordinador" || rol === "admin") && (
              <th>Acción</th>
            )}

          </tr>
        </thead>

        <tbody>

          {datosFiltrados.map(s=>(
            <tr key={s.id}>

              <td>{s.usuario}</td>

              <td>{s.sistema}</td>

              <td style={{
                color:
                  s.estado === "aprobado" ? "green" :
                  s.estado === "en proceso" ? "orange" :
                  "red"
              }}>
                {s.estado}
              </td>

              {/* ✅ CAMBIO DE ESTADO */}
              {(rol === "coordinador" || rol === "admin") && (
                <td>

                  <select
                    value={s.estado}
                    onChange={(e)=>cambiarEstado(s.id,e.target.value)}
                  >
                    <option value="lo necesita">Lo necesita</option>
                    <option value="en proceso">En proceso</option>
                    <option value="aprobado">Aprobado</option>
                  </select>

                </td>
              )}

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}