import { useState } from "react";

export default function Sidebar({
  rol,
  setMenu
}) {

  const [vacacionesOpen,
    setVacacionesOpen] =
    useState(false);

  return (

    <div className="sidebar">

      <div className="sidebar-logo">

  <img
    src="/logo.png"
    alt="Logo VW"
    style={{
      width: "140px",
      height: "auto",
      marginLeft: "-10px"
    }}
  />
 
</div>
      <div
        className="menu-item"
        onClick={() =>
          setMenu("home")
        }
      >
        🏠 Inicio
      </div>

      {/* VACACIONES */}

      <div
        className="menu-item"
        onClick={() =>
          setVacacionesOpen(
            !vacacionesOpen
          )
        }
      >
        🗓 Vacaciones
      </div>

      {vacacionesOpen && (

        <div className="submenu">

          {rol === "empleado" && (
            <>
              <div
                onClick={() =>
                  setMenu(
                    "vac_solicitar"
                  )
                }
              >
                Solicitar vacaciones
              </div>

              <div
                onClick={() =>
                  setMenu(
                    "vac_mias"
                  )
                }
              >
                Mis vacaciones
              </div>
            </>
          )}

          {(
            rol === "coordinador" ||
             rol === "gerente"
            ) && (
            <>
              <div
                onClick={() =>
                  setMenu(
                    "vac_aprobar"
                  )
                }
              >
               {
                rol === "gerente"
                 ? "Vacaciones de mi gerencia"
                  : "Vacaciones de mi grupo"
                }
              </div>
            </>
          )}

          {rol === "admin" && (
            <>
              <div
                onClick={() =>
                  setMenu(
                    "vac_admin"
                  )
                }
              >
                Administrar vacaciones
              </div>
            </>
          )}

        </div>

      )}

      <div
        className="menu-item"
        onClick={() =>
          setMenu(
            "solicitudes"
          )
        }
      >
        📄 Solicitudes
      </div>

      <div
        className="menu-item"
        onClick={() =>
          setMenu(
            "reportes"
          )
        }
      >
        📊 Reportes
      </div>

      <div
        className="menu-item"
        onClick={() =>
          setMenu(
            "sistemas"
          )
        }
      >
        💻 Sistemas
      </div>

      <div
        className="menu-item"
        onClick={() =>
          setMenu(
            "equipos"
          )
        }
      >
        🖥 Equipos
      </div>

      {(
  rol === "coordinador" ||
  rol === "gerente" ||
  rol === "admin"
) && (
        <div
          className="menu-item"
          onClick={() =>
            setMenu(
              "notificaciones"
            )
          }
        >
          🔔 Notificaciones
        </div>

      )}

{rol === "admin" && (

  <>

    <div
      className="menu-item"
      onClick={() =>
        setMenu(
          "grupos"
        )
      }
    >
      👨‍👩‍👧‍👦 Grupos
    </div>

    <div
      className="menu-item"
      onClick={() =>
        setMenu(
          "gerencias"
        )
      }
    >
      🏢 Gerencias
    </div>

    <div
      className="menu-item"
      onClick={() =>
        setMenu(
          "usuarios"
        )
      }
    >
      👥 Usuarios
    </div>

  </>

)}

    </div>

  );

}
