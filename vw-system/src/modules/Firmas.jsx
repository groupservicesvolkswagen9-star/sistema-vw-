import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase";

export default function Firmas({ rol }) {

  const [documentos, setDocumentos] = useState([]);

  const cargar = async () => {

    const snap = await getDocs(
      collection(db, "Solicitudes")
    );

    const lista = snap.docs.map(item => ({
      id: item.id,
      ...item.data()
    }));

    setDocumentos(lista);
  };

  useEffect(() => {
    cargar();
  }, []);

  if (
    rol !== "coordinador" &&
    rol !== "admin"
  ) {
    return (
      <div className="sap-card">
        <h2>Firmas PDF</h2>
        <p>No tienes permisos</p>
      </div>
    );
  }

  const firmar = async (id) => {

    await updateDoc(
      doc(db, "Solicitudes", id),
      {
        firmado: true,
        fechaFirma: new Date()
      }
    );

    cargar();
  };

  return (
    <div className="sap-card">

      <h2>Firmar solicitudes</h2>

      <table className="table">

        <thead>
          <tr>
            <th>Documento</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>

          {documentos.map(item => (

            <tr key={item.id}>

              <td>
                {item.archivo || "Documento"}
              </td>

              <td>
                {item.firmado
                  ? "Firmado"
                  : "Pendiente"}
              </td>

              <td>

                {!item.firmado && (

                  <button
                    onClick={() =>
                      firmar(item.id)
                    }
                  >
                    Firmar PDF
                  </button>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
