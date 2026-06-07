import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth, db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Login({ setUser }) {

  const [email,setEmail] = useState("");
  const [pass,setPass] = useState("");
  const [modo,setModo] = useState("login"); // login | registro

  //////////////////////////////////////////////////////
  // ✅ LOGIN
  //////////////////////////////////////////////////////
  const login = async ()=>{
    try{
      const cred = await signInWithEmailAndPassword(auth,email,pass);
      setUser(cred.user);
    }catch(err){
      alert("Error de login");
    }
  };

  //////////////////////////////////////////////////////
  // ✅ REGISTRO
  //////////////////////////////////////////////////////
  const registrar = async ()=>{
    try{
      const cred = await createUserWithEmailAndPassword(auth,email,pass);

      // ✅ guardar en Firestore con rol
      await addDoc(collection(db,"Usuarios"),{
        email: email,
        rol: "empleado"   // 👈 por default
      });

      setUser(cred.user);

    }catch(err){
      alert("Error al registrar");
    }
  };

  //////////////////////////////////////////////////////
  // ✅ UI
  //////////////////////////////////////////////////////
  return (
    <div style={{ display:"flex", height:"100vh" }}>

      {/* ✅ IZQUIERDA */}
      <div style={{ width:"50%" }}>
        <img
          src="/bg.jpg"
          style={{
            width:"100%",
            height:"100%",
            objectFit:"cover"
          }}
        />
      </div>

      {/* ✅ DERECHA */}
      <div style={{
        width:"50%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"#f5f5f5",
        position:"relative"
      }}>

        {/* ✅ LOGO */}
        <div style={{
          position:"absolute",
          top:"20px",
          left:"20px",
          display:"flex",
          alignItems:"center",
          gap:"10px"
        }}>
          <img src="/logo.png" style={{width:"120px"}} />
          <b style={{color:"#1d4ed8"}}>VW System</b>
        </div>

        {/* ✅ FORM */}
        <div className="card fade-in"
          style={{
            padding:"30px",
            width:"320px"
          }}
        >

          <h2 style={{textAlign:"center", marginBottom:"20px"}}>
            {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h2>

          <input
            className="input"
            placeholder="Correo"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            style={{width:"100%", marginBottom:"10px"}}
          />

          <input
            type="password"
            className="input"
            placeholder="Contraseña"
            value={pass}
            onChange={(e)=>setPass(e.target.value)}
            style={{width:"100%", marginBottom:"15px"}}
          />

          {/* ✅ BOTÓN PRINCIPAL */}
          {modo === "login" ? (
            <button onClick={login} style={{width:"100%", background:"#1d4ed8", color:"white"}}>
              Entrar
            </button>
          ) : (
            <button onClick={registrar} style={{width:"100%", background:"#16a34a", color:"white"}}>
              Registrarse
            </button>
          )}

          {/* ✅ CAMBIO DE MODO */}
          <p style={{marginTop:"10px", textAlign:"center"}}>

            {modo === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <span
                  style={{color:"#1d4ed8", cursor:"pointer"}}
                  onClick={()=>setModo("registro")}
                >
                  Crear cuenta
                </span>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <span
                  style={{color:"#1d4ed8", cursor:"pointer"}}
                  onClick={()=>setModo("login")}
                >
                  Iniciar sesión
                </span>
              </>
            )}

          </p>

        </div>

      </div>

    </div>
  );
}
