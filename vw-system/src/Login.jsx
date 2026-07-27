import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

import { auth, db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Login({ setUser }) {

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [crear, setCrear] = useState(false);

  // ✅ REGISTRO campos
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");
  const [genero, setGenero] = useState("");

  // ✅ VALIDACIÓN VW
  const validarVW = (correo) => {
    return correo.toLowerCase().endsWith("@vw.com.mx");
  };

  // ✅ LOGIN
  const login = async () => {

  try {

    if (!validarVW(email)) {
      alert("Solo correos @vw.com.mx");
      return;
    }

    const cred =
      await signInWithEmailAndPassword(
        auth,
        email,
        pass
      );

    setUser({
      email: cred.user.email,
      uid: cred.user.uid
    });

  } catch (error) {

    console.log(error);

    alert("Error en login");

  }

};

  // ✅ REGISTRO
  const registrar = async () => {

    try {

      if (!validarVW(email)) {
        alert("Solo correos @vw.com.mx");
        return;
      }

      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const fechaNacimiento = `${anio}-${mes}-${dia}`;
      await addDoc(
  collection(db, "Usuarios"),
  {
  nombre,
  apellido,
  email,
  fechaNacimiento,
  genero,

  rol: "empleado",

  grupo: "",

  activo: true,

  fechaCreacion: new Date()
}
);

      setUser({
  email: cred.user.email,
  nombre,
  apellido,
  grupo: ""
});

    } catch {
      alert("Error al registrar");
    }
  };

  // ✅ ===== VISTA FACEBOOK REGISTRO =====
  if (crear) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5"
      }}>

        <div style={{
          width: "400px",
          background: "white",
          padding: "20px",
          borderRadius: "12px"
        }}>

          <h2 style={{ marginBottom: "10px" }}>
            Crear cuenta
          </h2>

          {/* Nombre */}
          <div style={{ display: "flex", gap: "10px" }}>
            <input className="fb-input" placeholder="Nombre"
              onChange={e => setNombre(e.target.value)} />

            <input className="fb-input" placeholder="Apellido"
              onChange={e => setApellido(e.target.value)} />
          </div>

          {/* Fecha */}
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <input className="fb-input" placeholder="Día"
              onChange={e => setDia(e.target.value)} />

            <input className="fb-input" placeholder="Mes"
              onChange={e => setMes(e.target.value)} />

            <input className="fb-input" placeholder="Año"
              onChange={e => setAnio(e.target.value)} />
          </div>

          {/* Género */}
          <select className="fb-input" style={{ marginTop: "10px" }}
            onChange={e => setGenero(e.target.value)}>

            <option value="">Selecciona tu género</option>
            <option>Masculino</option>
            <option>Femenino</option>

          </select>

          {/* Correo */}
          <input
            className="fb-input"
            style={{ marginTop: "10px" }}
            placeholder="Correo electrónico @vw.com.mx"
            onChange={e => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            className="fb-input"
            placeholder="Contraseña"
            onChange={e => setPass(e.target.value)}
          />

          <button
            className="fb-btn"
            onClick={registrar}
          >
            Enviar
          </button>

          <button
            className="fb-btn-secondary"
            onClick={() => setCrear(false)}
          >
            Ya tengo una cuenta
          </button>

        </div>

      </div>
    );
  }

  // ✅ ===== LOGIN FACEBOOK STYLE =====
  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* IZQUIERDA (NO CAMBIAR) */}
    <div style={{ width: "50%" }}>
        <img
          src="/bg.jpg"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      </div>



      {/* DERECHA */}
      <div style={{
        width: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5"
      }}>

        <div style={{ width: "350px" }}>

          <h2 style={{ textAlign: "center" }}>
            Iniciar sesión en VWGSM
          </h2>

          <input
            className="fb-input"
            placeholder="Correo electrónico o número de celular"
            onChange={e => setEmail(e.target.value)}
          />

          <input
  type="password"
  className="fb-input"
  placeholder="Contraseña"
  onChange={(e) =>
    setPass(e.target.value)
  }
  onKeyDown={(e) => {

    if (e.key === "Enter") {

      login();

    }

  }}
/>

          <button className="fb-btn" onClick={login}>
            Iniciar sesión
          </button>

          <p style={{ textAlign: "center" }}>
            Bienvenido
          </p>

          <button
            className="fb-btn-secondary"
            onClick={() => setCrear(true)}
          >
            Crear cuenta nueva
          </button>

          <p style={{ textAlign: "center", marginTop: "10px" }}>
            VOLKSWAGEN GROUP SERVICES MEXICO
          </p>

        </div>

      </div>
    </div>
  );
}