import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

export default function Usuarios({ rol }) {

  const [users,setUsers] = useState([]);
  const [nuevoEmail,setNuevoEmail] = useState("");
  const [nuevoRol,setNuevoRol] = useState("empleado");

  //////////////////////////////////////////////////////
  // ✅ SOLO ADMIN
  //////////////////////////////////////////////////////
  if(rol !== "admin"){
    return <h2>No autorizado</h2>;
  }

  //////////////////////////////////////////////////////
  // ✅ CARGAR USUARIOS
  //////////////////////////////////////////////////////
  const cargar = async ()=>{
    const snap = await getDocs(collection(db,"Usuarios"));

    const arr=[];
    snap.forEach(d=>{
      arr.push({id:d.id,...d.data()});
    });

    setUsers(arr);
  };

  useEffect(()=>{
    cargar();
  },[]);

  //////////////////////////////////////////////////////
  // ✅ AGREGAR USUARIO
  //////////////////////////////////////////////////////
  const agregar = async ()=>{
    if(!nuevoEmail) return;

    await addDoc(collection(db,"Usuarios"),{
      email: nuevoEmail,
      rol: nuevoRol
    });

    setNuevoEmail("");
    setNuevoRol("empleado");

    cargar();
  };

  //////////////////////////////////////////////////////
  // ✅ CAMBIAR ROL
  //////////////////////////////////////////////////////
  const cambiarRol = async (id,rolNuevo)=>{
    await updateDoc(doc(db,"Usuarios",id),{
      rol:rolNuevo
    });

    cargar();
  };

  //////////////////////////////////////////////////////
  // ✅ ELIMINAR USUARIO
  //////////////////////////////////////////////////////
  const eliminar = async (id)=>{
    await deleteDoc(doc(db,"Usuarios",id));
    cargar();
  };

  //////////////////////////////////////////////////////
  // ✅ UI
  //////////////////////////////////////////////////////
  return (
    <div className="card">

      <h2>👥 Usuarios</h2>

      {/* ✅ AGREGAR USUARIO */}
      <div style={{marginBottom:"15px"}}>

        <input
          className="input"
          placeholder="Correo"
          value={nuevoEmail}
          onChange={e=>setNuevoEmail(e.target.value)}
        />

        <select
          value={nuevoRol}
          onChange={e=>setNuevoRol(e.target.value)}
          style={{marginLeft:"5px"}}
        >
          <option value="empleado">Empleado</option>
          <option value="coordinador">Coordinador</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={agregar} style={{marginLeft:"5px"}}>
          Agregar
        </button>

      </div>

      {/* ✅ TABLA */}
      <table>

        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {users.map(u=>(
            <tr key={u.id}>

              <td>{u.email}</td>

              <td>
                <select
                  value={u.rol}
                  onChange={(e)=>cambiarRol(u.id,e.target.value)}
                >
                  <option value="empleado">Empleado</option>
                  <option value="coordinador">Coordinador</option>
                  <option value="admin">Admin</option>
                </select>
              </td>

              <td>
                <button
                  onClick={()=>eliminar(u.id)}
                  style={{background:"red", color:"white"}}
                >
                  Eliminar
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}