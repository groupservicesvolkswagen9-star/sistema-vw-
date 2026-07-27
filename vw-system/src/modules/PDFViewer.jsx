import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase";

export default function PDFViewer({ rol }) {

  const [pdfs, setPdfs] = useState([]);

  const cargar = async () => {

    const snap = await getDocs(
      collection(db, "Solicitudes")
    );

    const lista = snap.docs.map(item => ({
      id: item.id,
      ...item.data()
    }));

    setPdfs(lista);
  };

  useEffect(() => {
    cargar();
  }, []);

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

      <h2>Solicitudes PDF</h2>

      <table className="table">

        <thead>
          <tr>
            <th>Archivo</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>

          {pdfs.map(item => (

            <tr key={item.id}>

              <td>
                {item.archivo}
              </td>

              <td>
                {item.firmado
                  ? "Firmado"
                  : "Pendiente"}
              </td>

              <td>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver PDF
                  </a>
                )}

                {(rol === "coordinador" ||
                  rol === "admin") &&
                  !item.firmado && (
                  <button
                    onClick={() => firmar(item.id)}
                  >
                    Firmar
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