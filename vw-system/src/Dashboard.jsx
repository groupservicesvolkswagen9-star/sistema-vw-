import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "./firebase";
import Sidebar from "./Sidebar";
import Grupos from "./modules/Grupos";
import Vacaciones from "./modules/Vacaciones";
import Solicitudes from "./modules/Solicitudes";
import Reportes from "./modules/Reportes";
import Sistemas from "./modules/Sistemas";
import Equipos from "./modules/Equipos";
import Usuarios from "./modules/Usuarios";
import Notificaciones from "./modules/Notificaciones";
import Gerencias from "./modules/Gerencias";

export default function Dashboard({
  user,
  rol,
  setUser
}) {

  const [menu, setMenu] = useState("home");
  const [theme, setTheme] = useState("light");

  const [notificaciones, setNotificaciones] =
    useState([]);

  const [showNotif, setShowNotif] =
    useState(false);

  useEffect(() => {
  cargarNotificaciones();
}, [
  rol,
  user?.email,
  user?.grupoFirestoreId
]);
const [notificacionesLeidas,
  setNotificacionesLeidas] =
  useState(false);
 
  const cargarNotificaciones = async () => {

    try {

      const snap = await getDocs(
        collection(
          db,
          "Notificaciones"
        )
      );

      const hoy = new Date();

      const lista = snap.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((item) => {

          // Validar fecha programada

          if (item.fechaProgramada) {

            const fechaNotif =
              new Date(
                item.fechaProgramada
              );

            if (fechaNotif > hoy) {
              return false;
            }
          }

          // ADMIN ve todo

          if (rol === "admin") {
            return true;
          }

          // EMPLEADO

          if (rol === "empleado") {

  return (

    item.destino === "empleado" ||

    item.destino === "todos" ||

    (
      item.destino === "grupo" &&
      item.grupoFirestoreId ===
      user?.grupoFirestoreId
    )

  );
}

          // COORDINADOR

if (rol === "coordinador") {

  return (

    item.destino === "coordinador" ||

    item.destino === "todos" ||

    (
      item.destino === "grupo" &&
      item.grupoFirestoreId ===
      user?.grupoFirestoreId
    )

  );
}
if (rol === "gerente") {

  return (

    item.destino === "gerente" ||

    item.destino === "todos"

  );

}
          return false;
        });

      setNotificaciones(lista);

    } catch (error) {

      console.error(error);

    }
  };

  const renderModulo = () => {

    switch (menu) {

      
      case "vac_solicitar":
      case "vac_mias":
      case "vac_aprobar":
      case "vac_empleados":
      case "vac_admin":

        return (
          <Vacaciones
            user={user}
            rol={rol}
            vista={menu}
          />
        );

      case "solicitudes":
        return (
          <Solicitudes
            user={user}
            rol={rol}
          />
        );

      case "reportes":
        return (
          <Reportes
            user={user}
            rol={rol}
          />
        );

      case "sistemas":
        return (
          <Sistemas
            user={user}
            rol={rol}
          />
        );

      case "equipos":
        return (
          <Equipos
            user={user}
            rol={rol}
          />
        );

      case "usuarios":
        return (
          <Usuarios
            rol={rol}
          />
        );


      case "notificaciones":
  return (
    <Notificaciones
      rol={rol}
      user={user}
    />
  );
     case "grupos":
  return (
    <Grupos
      rol={rol}
    />
  );
case "gerencias":
  return (
    <Gerencias
      rol={rol}
    />
  );
      default:

        return (

          <div className="sap-home fade">

            <div className="sap-banner">

              <h1>
                Hola {user?.nombre} {user?.apellido}
              </h1>

              <div className="avisos-card">

  <h3>
    📢 Avisos Corporativos
  </h3>

  {notificaciones.length === 0 ? (

    <p>
      No hay avisos disponibles.
    </p>

  ) : (

    notificaciones
      .slice(0, 5)
      .map((item) => (

        <div
          key={item.id}
          className="aviso-item"
        >

          <strong>
            {item.titulo}
          </strong>

          <p>
            {item.mensaje}
          </p>

        </div>

      ))

  )}

</div>
            </div>

            <div className="sap-cards">

              {rol === "empleado" && (
                <>
  <div
    className="sap-card"
    onClick={() =>
      setMenu("vac_solicitar")
    }
  >
    <h3>🗓 Vacaciones</h3>
    <p>Solicitar vacaciones</p>
  </div>

  <div
    className="sap-card"
    onClick={() =>
      setMenu("solicitudes")
    }
  >
    <h3>📄 Solicitudes</h3>
    <p>Enviar PDF o Excel</p>
  </div>

  <div
    className="sap-card"
    onClick={() =>
      setMenu("reportes")
    }
  >
    <h3>📊 Reportes</h3>
    <p>Enviar PDF o Excel</p>
  </div>

  <div
    className="sap-card"
    onClick={() =>
      setMenu("sistemas")
    }
  >
    <h3>💻 Sistemas</h3>
    <p>Registrar sistemas</p>
  </div>

  <div
    className="sap-card"
    onClick={() =>
      setMenu("equipos")
    }
  >
    <h3>🖥 Equipos</h3>
    <p>Registrar equipos</p>
  </div>
</>
              )}

              {rol === "coordinador" && (
                <>
  <div
    className="sap-card"
    onClick={() =>
      setMenu("vac_aprobar")
    }
  >
    <h3>🗓 Vacaciones</h3>
    <p>Aprobar vacaciones</p>
  </div>

  <div
    className="sap-card"
    onClick={() =>
      setMenu("solicitudes")
    }
  >
    <h3>📄 Solicitudes</h3>
    <p>Ver solicitudes empleados</p>
  </div>

  <div
    className="sap-card"
    onClick={() =>
      setMenu("reportes")
    }
  >
    <h3>📊 Reportes</h3>
    <p>Ver reportes empleados</p>
  </div>

  <div
    className="sap-card"
    onClick={() =>
      setMenu("sistemas")
    }
  >
    <h3>💻 Sistemas</h3>
    <p>Ver sistemas registrados</p>
  </div>

  <div
    className="sap-card"
    onClick={() =>
      setMenu("equipos")
    }
  >
    <h3>🖥 Equipos</h3>
    <p>Ver equipos registrados</p>
  </div>

  <div
    className="sap-card"
    onClick={() =>
      setMenu("notificaciones")
    }
  >
    <h3>🔔 Notificaciones</h3>
    <p>Administrar avisos</p>
  </div>
</>
              )}
{rol === "gerente" && (

  <>

    <div
      className="sap-card"
      onClick={() =>
        setMenu(
          "vac_aprobar"
        )
      }
    >
      <h3>
        🗓 Vacaciones
      </h3>

      <p>
        Aprobar coordinadores
      </p>
    </div>

    <div
      className="sap-card"
      onClick={() =>
        setMenu(
          "solicitudes"
        )
      }
    >
      <h3>
        📄 Solicitudes
      </h3>

      <p>
        Aprobar solicitudes
      </p>
    </div>

    <div
      className="sap-card"
      onClick={() =>
        setMenu(
          "reportes"
        )
      }
    >
      <h3>
        📊 Reportes
      </h3>

      <p>
        Consultar indicadores
      </p>
    </div>

    <div
      className="sap-card"
      onClick={() =>
        setMenu(
          "notificaciones"
        )
      }
    >
      <h3>
        🔔 Notificaciones
      </h3>

      <p>
        Ver avisos
      </p>
    </div>

  </>

)}
              {rol === "admin" && (
                <>
                <div
  className="sap-card"
  onClick={() =>
    setMenu("grupos")
  }
>
  <h3>👨‍👩‍👧‍👦 Grupos</h3>
  <p>
    Administrar grupos
  </p>
</div>
  <div
    className="sap-card"
    onClick={() =>
      setMenu("vac_admin")
    }
  >
    <h3>🗓 Vacaciones</h3>
    <p>Administrar vacaciones</p>
  </div>

  <div
    className="sap-card"
    onClick={() =>
      setMenu("solicitudes")
    }
  >
    <h3>📄 Solicitudes</h3>
    <p>Administrar solicitudes</p>
  </div>

  <div
    className="sap-card"
    onClick={() =>
      setMenu("reportes")
    }
  >
    <h3>📊 Reportes</h3>
    <p>Administrar reportes</p>
  </div>

  <div
    className="sap-card"
    onClick={() =>
      setMenu("sistemas")
    }
  >
    <h3>💻 Sistemas</h3>
    <p>Administrar sistemas</p>
  </div>

  <div
    className="sap-card"
    onClick={() =>
      setMenu("equipos")
    }
  >
    <h3>🖥 Equipos</h3>
    <p>Administrar equipos</p>
  </div>

  <div
    className="sap-card"
    onClick={() =>
      setMenu("usuarios")
    }
  >
    <h3>👥 Usuarios</h3>
    <p>Gestión de usuarios</p>
  </div>
<div
  className="sap-card"
  onClick={() =>
    setMenu(
      "gerencias"
    )
  }
>
  <h3>
    🏢 Gerencias
  </h3>

  <p>
    Administrar gerencias
  </p>

</div>
  <div

    className="sap-card"
    onClick={() =>
      setMenu("notificaciones")
    }
  >
    <h3>🔔 Notificaciones</h3>
    <p>Administrar avisos</p>
  </div>
</>
              )}

            </div>

          </div>

        );
    }
  };

  return (

    <div
      className={`dashboard ${theme}`}
    >

      <Sidebar
        rol={rol}
        setMenu={setMenu}
      />

      <div className="main">

        <div className="header">

          <div className="header-left">
            VOLKSWAGEN GROUP SERVICES MEXICO
          </div>

          <div className="header-right">

          <div
  className="bell"
  onClick={() => {

    setShowNotif(
      !showNotif
    );

    setNotificacionesLeidas(
      true
    );

  }}
>

              🔔

             {notificaciones.length > 0 &&
            !notificacionesLeidas && (

                <span className="notif">
                  {
                    notificaciones.length
                  }
                </span>

              )}

            </div>

            <button
              className="theme-btn"
              onClick={() =>
                setTheme(
                  theme === "light"
                    ? "dark"
                    : "light"
                )
              }
            >
              {theme === "light"
                ? "🌙"
                : "☀️"}
            </button>

            <span>
              {user?.email}
            </span>

            <button
             className="logout-btn"
              onClick={async () => {

              await signOut(auth);

              setUser(null);

             }}
            >
             Cerrar sesión
              </button>

          </div>

        </div>

        {showNotif && (

          <div className="notif-panel">

            <h3>
              Notificaciones
            </h3>

            {notificaciones.length === 0 ? (

              <p>
                No hay notificaciones.
              </p>

            ) : (

              notificaciones.map(
                (item) => (

                  <div
                    key={item.id}
                    className="notif-item"
                    
                  >

                    <strong>
                      {item.titulo}
                    </strong>

                    <p>
                      {item.mensaje}
                    </p>

                    <small>
                      Destino:
                      {" "}
                      {item.destino}
                    </small>
                   
                  </div>

                )
              )

            )}

          </div>

        )}

        <div className="content fade">
          {renderModulo()}
        </div>

      </div>

    </div>

  );
}