import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export default function Sidebar({ rol, setModulo, setSub, setUser }) {

  const [menuActivo,setMenuActivo] = useState("");

  //////////////////////////////////////////////////////
  // ✅ LOGOUT
  //////////////////////////////////////////////////////
  const logout = async ()=>{
    await signOut(auth);
    setUser(null);
  };

  //////////////////////////////////////////////////////
  // ✅ MENÚ SEGÚN EXCEL
  //////////////////////////////////////////////////////
  const menu = {
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
  // ✅ UI
  //////////////////////////////////////////////////////
  return (
    <div className="sidebar">

      {/* 🔥 HEADER */}
      <div className="sidebar-header">
        <b>VW System</b>
      </div>

      {/* 🔥 MENU */}
      <div className="sidebar-menu">

        {Object.keys(menu[rol] || {}).map((item)=>(

          <div key={item}>

            {/* ✅ MENU PRINCIPAL */}
            <div
              className="menu-item"
              onClick={()=>{
                setMenuActivo(item);
                setModulo(item);     // 🔥 CLAVE
                setSub("");          // reset sub
              }}
            >
              {item}
            </div>

            {/* ✅ SUBMENU */}
            {menuActivo === item && (

              <div className="submenu">

                {menu[rol][item].map((sub)=>(

                  <div
                    key={sub}
                    className="sub-item"
                    onClick={()=>{
                      setSub(sub);    // 🔥 CLAVE
                      setModulo(item);
                    }}
                  >
                    {sub}
                  </div>

                ))}

              </div>

            )}

          </div>

        ))}

      </div>

      {/* 🔥 LOGOUT */}
      <div style={{padding:"10px"}}>
        <button
          onClick={logout}
          style={{
            width:"100%",
            background:"#ea4335",
            color:"white"
          }}
        >
          Cerrar sesión
        </button>
      </div>

    </div>
  );
}