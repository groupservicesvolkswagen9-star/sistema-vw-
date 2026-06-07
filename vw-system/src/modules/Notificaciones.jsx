import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc
} from "firebase/firestore";

export default function Notificaciones({ user, rol }) {

  const [notis,setNotis] = useState([]);
  const [open,setOpen] = useState(false);
  const [mensaje,setMensaje] = useState("");

  /////////////////////////////////////////////////////
  // ✅ TIEMPO REAL SOLO DEL USUARIO
  /////////////////////////////////////////////////////
  useEffect(()=>{
    const unsub = onSnapshot(collection(db,"notificaciones"),(snap)=>{

      const arr = [];

      snap.forEach(d=>{
        const data = {id:d.id,...d.data()};

        // ✅ SOLO MIS NOTIFICACIONES
        if(data.para === user.email){
          arr.push(data);
        }
      });

      setNotis(arr);

    });

    return ()=>unsub();
  },[user]);

  /////////////////////////////////////////////////////
  // ✅ CONTADOR
  /////////////////////////////////////////////////////
  const unread = notis.filter(n=>!n.leido).length;

  /////////////////////////////////////////////////////
  // ✅ MARCAR LEIDAS (OPTIMIZADO)
  /////////////////////////////////////////////////////
  const marcar = async ()=>{
    const pendientes = notis.filter(n=>!n.leido);

    for(const n of pendientes){
      await updateDoc(doc(db,"notificaciones",n.id),{
        leido:true
      });
    }
  };

  /////////////////////////////////////////////////////
  // ✅ ENVIAR MENSAJE (COORDINADOR / ADMIN)
  /////////////////////////////////////////////////////
  const enviar = async ()=>{

    if(!mensaje) return;

    await addDoc(collection(db,"notificaciones"),{
      mensaje,
      para: "todos", // puedes mejorar esto luego
      leido:false,
      fecha: new Date()
    });

    setMensaje("");
  };

  /////////////////////////////////////////////////////
  // ✅ UI
  /////////////////////////////////////////////////////
  return (
    <div style={{position:"relative"}}>

      {/* 🔔 ICONO */}
      <div
        onClick={()=>{
          setOpen(!open);
          marcar();
        }}
        style={{
          cursor:"pointer",
          position:"relative",
          fontSize:"20px"
        }}
      >
        🔔

        {unread > 0 && (
          <span style={{
            position:"absolute",
            top:"-5px",
            right:"-10px",
            background:"red",
            color:"white",
            borderRadius:"50%",
            padding:"3px 6px",
            fontSize:"12px"
          }}>
            {unread}
          </span>
        )}

      </div>

      {/* 📦 POPUP */}
      {open && (
        <div style={{
          position:"absolute",
          top:"35px",
          right:"0",
          width:"320px",
          background:"white",
          color:"#111",
          boxShadow:"0 5px 15px rgba(0,0,0,0.3)",
          borderRadius:"8px",
          zIndex:999
        }}>

          <h4 style={{
            padding:"10px",
            borderBottom:"1px solid #ddd"
          }}>
            Notificaciones
          </h4>

          {/* ✅ MENSAJES */}
          <div style={{maxHeight:"300px",overflowY:"auto"}}>
            {notis.length === 0 && (
              <p style={{padding:"10px"}}>Sin notificaciones</p>
            )}

            {notis.map(n=>(
              <div key={n.id} style={{
                padding:"10px",
                borderBottom:"1px solid #eee",
                background:n.leido ? "#fff" : "#e3f2fd"
              }}>
                {n.mensaje}
              </div>
            ))}
          </div>

          {/* ✅ ENVIAR SOLO COORDINADOR / ADMIN */}
          {(rol === "coordinador" || rol === "admin") && (
            <div style={{padding:"10px", borderTop:"1px solid #ddd"}}>

              <input
                className="input"
                placeholder="Nuevo aviso"
                value={mensaje}
                onChange={e=>setMensaje(e.target.value)}
                style={{width:"100%", marginBottom:"5px"}}
              />

              <button onClick={enviar}>
                Enviar
              </button>

            </div>
          )}

        </div>
      )}

    </div>
  );
}