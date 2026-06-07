export default function PDFViewer({ archivo }) {

  ////////////////////////////////////////////////
  // ✅ VALIDACIÓN
  ////////////////////////////////////////////////
  if(!archivo){
    return <p>No hay documento seleccionado</p>;
  }

  ////////////////////////////////////////////////
  // ✅ UI
  ////////////////////////////////////////////////
  return (
    <div className="card">

      <h3>Vista de Documento</h3>

      <iframe
        src={archivo}
        width="100%"
        height="500"
        style={{
          border:"1px solid #ccc",
          borderRadius:"8px"
        }}
        title="PDF"
      ></iframe>

    </div>
  );
}