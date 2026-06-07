import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import Notificaciones from "./modules/Notificaciones";
import Vacaciones from "./modules/Vacaciones";
import Solicitudes from "./modules/Solicitudes";
import Reportes from "./modules/Reportes";
import Control from "./modules/Control";
import Sistemas from "./modules/Sistemas";
import Equipos from "./modules/Equipos";
import Usuarios from "./modules/Usuarios";

import { FaBars } from "react-icons/fa";

export default function Dashboard({ user, setUser }) {

  const [rol,setRol] = useState("");
  const [menu,setMenu] = useState(true);
  const [modulo,setModulo] = useState("vacaciones");
  const [sub,setSub] = useState("");

  //////////////////////////////////////////////////////
  // ✅ OBTENER ROL
  //////////////////////////////////////////////////////
  useEffect(()=>{
    const obtenerRol = async ()=>{
      const q = query(collection(db,"Usuarios"), where("email","==",user.email));
      const snap = await getDocs(q);
      snap.forEach(d=>setRol(d.data().rol));
    };
    obtenerRol();
  },[user]);

  //////////////////////////////////////////////////////
  // ✅ LOGOUT
  //////////////////////////////////////////////////////
  const logout = async ()=>{
    await signOut(auth);
    setUser(null);
  };

  //////////////////////////////////////////////////////
  // ✅ MENÚ EXCEL
  //////////////////////////////////////////////////////
  const submenus = {
    empleado: {
      vacaciones:["Solicitar","Lista"],
      solicitudes:["Enviar","Formatos","Lista"],
      reportes:["Enviar","Lista"],
      sistemas:["Agregar","Lista"],
      equipos:["Agregar","Lista"]
    },
    coordinador:{
      vacaciones:["Aprobar"],
      solicitudes:["Firmar","Ver"],
      reportes:["Ver","Control"],
      sistemas:["Lista"],
      equipos:["Lista"],
      avisos:["Enviar"]
    },
    admin:{
      vacaciones:["Todo"],
      solicitudes:["Todo"],
      reportes:["Todo"],
      sistemas:["Todo"],
      equipos:["Todo"],
      usuarios:["Ver","Agregar"]
    }
  };

  //////////////////////////////////////////////////////
  // ✅ RENDER VISTA REAL
  //////////////////////////////////////////////////////
  const renderVista = ()=>{

    // 🔥 CASO ESPECIAL CONTROL
    if(modulo === "reportes" && sub === "Control"){
      return <Control rol={rol}/>;
    }

    switch(modulo){

      case "vacaciones":
        return <Vacaciones user={user} rol={rol}/>;

      case "solicitudes":
        return <Solicitudes user={user} rol={rol}/>;

      case "reportes":
        return <Reportes user={user} rol={rol}/>;

      case "sistemas":
        return <Sistemas user={user} rol={rol}/>;

      case "equipos":
        return <Equipos user={user} rol={rol}/>;

      case "usuarios":
        return <Usuarios rol={rol}/>;

      default:
        return <h2>Inicio</h2>;
    }
  };

  //////////////////////////////////////////////////////
  // ✅ UI
  //////////////////////////////////////////////////////
  return (
    <div className="app">

      {/* HEADER */}
      <div className="header">

        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <FaBars onClick={()=>setMenu(!menu)} style={{cursor:"pointer"}}/>
          <b>VW System</b>
        </div>

        <div style={{display:"flex",gap:"15px"}}>
          <Notificaciones user={user} rol={rol}/>
          <span>{user.email}</span>

          <button onClick={logout}>
            Cerrar sesión
          </button>
        </div>

      </div>

      {/* BODY */}
      <div style={{display:"flex",flex:1}}>

        {/* SIDEBAR */}
        {menu && (
          <div className="sidebar">

            <div className="sidebar-menu">
              {Object.keys(submenus[rol] || {}).map(m=>(
                <MenuBtn
                  key={m}
                  text={m}
                  setModulo={(val)=>{
                    setModulo(val);
                    setSub(""); // reset submenu
                  }}
                />
              ))}
            </div>

          </div>
        )}

        {/* SUBMENU */}
        <div className="submenu">

          {(submenus[rol]?.[modulo] || []).map(s=>(
            <SubBtn key={s} text={s} setSub={setSub}/>
          ))}

        </div>

        {/* CONTENT */}
        <div className="content">
          {renderVista()}
        </div>

      </div>

    </div>
  );
}

//////////////////////////////////////////////////////
// 🔥 BOTONES
//////////////////////////////////////////////////////

function MenuBtn({text,setModulo}){
  return (
    <div
      className="menu-item"
      onClick={()=>setModulo(text)}
    >
      {text}
    </div>
  );
}

function SubBtn({text,setSub}){
  return (
    <div
      className="sub-item"
      onClick={()=>setSub(text)}
    >
      {text}
    </div>
  );
}