// ✅ IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, query, where } 
from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

// ✅ CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC9zIxmhXIiLf-H4Kb-JzrygJYQkUp-84g",
  authDomain: "vwgsm353.firebaseapp.com",
  projectId: "vwgsm353",
  storageBucket: "vwgsm353.firebasestorage.app",
  messagingSenderId: "574778184422",
  appId: "1:574778184422:web:a4e30ab36b91d65cc26127",
  measurementId: "G-3DP7XDHB12"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let usuarioActual = null;
let rolUsuario = null;

// ✅ LOGIN
onAuthStateChanged(auth, async (user) => {
  if(user){
    usuarioActual = user;
    usuario.innerText = user.email;
    await obtenerRol(user.email);
    generarMenu();
  }else{
    window.location = "index.html";
  }
});

// ✅ ROL
async function obtenerRol(email){
  const q = query(collection(db,"Usuarios"), where("email","==",email));
  const snap = await getDocs(q);
  snap.forEach(d => rolUsuario = d.data().rol);
}

//////////////////////////////////////////////////////
// ✅ MENU LATERAL PRO 🔥
//////////////////////////////////////////////////////

function generarMenu(){

  let html = "";

  // EMPLEADO
  if(rolUsuario === "empleado"){
    html += `<button onclick="menuVacaciones()">Vacaciones</button>`;
    html += `<button onclick="menuReportes()">Reportes</button>`;
    html += `<button onclick="menuFormularios()">Formularios</button>`;
  }

  // COORDINADOR / ADMIN
  if(rolUsuario !== "empleado"){
    html += `<button onclick="menuVacaciones()">Vacaciones</button>`;
    html += `<button onclick="menuSolicitudes()">Solicitudes</button>`;
    html += `<button onclick="menuControl()">Control</button>`;
  }

  // ADMIN
  if(rolUsuario === "admin"){
    html += `<button onclick="mostrarUsuarios()">Usuarios</button>`;
  }

  html += `<button onclick="logout()">Cerrar sesión</button>`;

  menu.innerHTML = html;
}
//////////////////////////////////////////////////////
// ✅ VACACIONES (CORREGIDO 🔥)
//////////////////////////////////////////////////////
// ✅ MENÚ VACACIONES
window.menuVacaciones = function(){
  let html = "<h2>Vacaciones</h2>";
  if(rolUsuario === "empleado"){
    html += `
      <button onclick="mostrarSolicitud()">Solicitar Vacaciones</button>
      <button onclick="mostrarMisVac()">Mis Vacaciones</button>
    `;
  } else {
    html += `
      <button onclick="verSolicitudesVac()">Solicitudes</button>
      <button onclick="verEquipo()">Equipo</button>
    `;
  }
  document.getElementById("contenido").innerHTML = html;
};
// ✅ ENVIAR SOLICITUD
window.enviarVacacion = async function(){
  let fi = document.getElementById("fi").value;
  let ff = document.getElementById("ff").value;
  if(!fi || !ff){
    alert("Selecciona fechas");
    return;
  }
  let dias = Math.ceil((new Date(ff) - new Date(fi))/(1000*60*60*24)) + 1;
  await addDoc(collection(db,"solicitudes"),{
    usuario: usuarioActual.email,
    fechaInicio: fi,
    fechaFin: ff,
    dias: dias,
    estado: "pendiente"
  });
  alert("Solicitud enviada ✅");
};
// ✅ FORMULARIO
window.mostrarSolicitud = function(){
  document.getElementById("contenido").innerHTML = `
    <h2>Solicitar Vacaciones</h2>
    <input type="date" id="fi"><br><br>
    <input type="date" id="ff"><br><br>
    <button onclick="enviarVacacion()">Enviar</button>
  `;
};
// ✅ VER MIS VACACIONES
window.mostrarMisVac = async function(){
  let html = `
    <h2>Mis Vacaciones</h2>
    <table border="1">
      <tr>
        <th>Días</th>
        <th>Fechas</th>
      </tr>
  `;
  const snap = await getDocs(collection(db,"vacaciones"));
  snap.forEach(d=>{
    const v = d.data();
    if(v.usuario === usuarioActual.email){
      html += `
        <tr>
          <td>${v.dias}</td>
          <td>${v.fechaInicio} a ${v.fechaFin}</td>
        </tr>
      `;
    }
  });
  html += "</table>";
  document.getElementById("contenido").innerHTML = html;
};
// ✅ COORDINADOR / ADMIN → SOLICITUDES
window.verSolicitudesVac = async function(){
  let html = "<h2>Solicitudes</h2><table border='1'>";
  const snap = await getDocs(collection(db,"solicitudes"));
  snap.forEach(d=>{
    const s = d.data();
    html += `
      <tr>
        <td>${s.usuario}</td>
        <td>${s.dias}</td>
        <td>${s.fechaInicio} a ${s.fechaFin}</td>
        <td>
          <button onclick="aprobar('${d.id}', this)">✅</button>
          <button onclick="rechazar('${d.id}')">❌</button>
        </td>
      </tr>
    `;
  });
  html += "</table>";
  document.getElementById("contenido").innerHTML = html;
};

// ✅ VER EQUIPO
window.verEquipo = async function(){
  let html = "<h2>Equipo</h2><table border='1'>";
  const snap = await getDocs(collection(db,"vacaciones"));
  snap.forEach(d=>{
    const v = d.data();
    html += `
      <tr>
        <td>${v.usuario}</td>
        <td>${v.dias}</td>
      </tr>
    `;
  });
  html += "</table>";
  document.getElementById("contenido").innerHTML = html;
};
//////////////////////////////////////////////////////
// ✅ SUBMENÚ SOLICITUDES 🔥
//////////////////////////////////////////////////////

window.menuSolicitudes = function(){
  contenido.innerHTML = `
    <h2>Solicitudes</h2>

    <button onclick="verSolicitudes()">Solicitudes recibidas</button>
  `;
};

window.verSolicitudes = async function(){

  let html = "<h3>Solicitudes</h3><div>";

  const snap = await getDocs(collection(db,"formularios"));

  snap.forEach(d=>{
    const s = d.data();

    html += `
      <div class="card">
        <p>${s.usuario}</p>

        <button onclick="verPDF('${s.url}')">Ver documento</button>
        <button onclick="firmarUI('${d.id}')">Firmar</button>
      </div>
    `;
  });

  html += "</div>";

  contenido.innerHTML = html;
};
//////////////////////////////////////////////////////
// ✅ FORMULARIOS
//////////////////////////////////////////////////////
window.menuFormularios = function(){
  contenido.innerHTML = `
    <h2>Formularios</h2>
    <button onclick="verPlantillas()">Plantillas</button>
    <button onclick="subirSolicitud()">Subir solicitud</button>
  `;
};
window.subirSolicitud = function(){
  contenido.innerHTML = `
    <h2>Subir solicitud</h2>
    <input type="file" id="solicitudFile">
    <button onclick="guardarSolicitud()">Enviar</button>
  `;
};
window.guardarSolicitud = async function(){
  const file = document.getElementById("solicitudFile").files[0];
  const storageRef = ref(storage, "solicitudes/" + file.name);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  await addDoc(collection(db,"formularios"),{
    usuario: usuarioActual.email,
    url: url,
    estado: "pendiente"
  });
  alert("Solicitud enviada ✅");
};
window.verPlantillas = async function(){
  let html = "<h2>Plantillas</h2>";
  contenido.innerHTML = html;
};
//////////////////////////////////////////////////////
// ✅ SOLICITUDES (COORDINADOR)
//////////////////////////////////////////////////////
window.menuSolicitudes = function(){
  verSolicitudes();
};
window.verSolicitudes = async function(){
  let html = "<h2>Solicitudes recibidas</h2><table border='1'>";
  const snap = await getDocs(collection(db,"formularios"));
  snap.forEach(d=>{
    const s = d.data();
    html += `
      <tr>
        <td>${s.usuario}</td>
        <td><a href="${s.url}" target="_blank">Descargar</a></td>
        <td>
          <button onclick="firmarUI('${d.id}')">Firmar</button>
        </td>
      </tr>`;
  });
  html += "</table>";
  contenido.innerHTML = html;
};
window.firmarUI = function(id){
  contenido.innerHTML = `
    <h2>Subir firmado</h2>
    <input type="file" id="fileFirmado">
    <button onclick="guardarFirma('${id}')">Subir firmado</button>
  `;
};
//////////////////////////////////////////////////////
// ✅ SUBMENÚ CONTROL 🔥
//////////////////////////////////////////////////////

window.menuControl = function(){
  contenido.innerHTML = `
    <h2>Control</h2>

    <button onclick="mostrarControl()">Ver reportes</button>
  `;
};

window.mostrarControl = async function(){

  let html = "<h3>Reportes empleados</h3>";

  const snap = await getDocs(collection(db,"reportes"));

  snap.forEach(d=>{
    const r = d.data();

    html += `
      <div class="card">
        <p>${r.usuario}</p>

        <button onclick="verPDF('${r.url}')">Ver reporte</button>
      </div>
    `;
  });

  contenido.innerHTML = html;
};

//////////////////////////////////////////////////////
// ✅ REPORTES (EMPLEADO)
//////////////////////////////////////////////////////

window.menuReportes = function(){
  contenido.innerHTML = `
    <h2>Reportes</h2>

    <button onclick="subirReporteUI()">Subir PDF</button>
    <button onclick="verReportes()">Mis reportes</button>
  `;
};

window.subirReporteUI = function(){
  contenido.innerHTML = `
    <h2>Subir</h2>

    <input type="file" id="archivo">
    <button onclick="subirPDF()">Subir</button>
  `;
};

window.subirPDF = async function(){

  const file = archivo.files[0];

  const refStorage = ref(storage,"reportes/"+file.name);
  await uploadBytes(refStorage,file);

  const url = await getDownloadURL(refStorage);

  await addDoc(collection(db,"reportes"),{
    usuario: usuarioActual.email,
    url: url
  });

  alert("Subido ✅");
};

window.verReportes = async function(){

  let html = "<h2>Mis reportes</h2>";

  const snap = await getDocs(collection(db,"reportes"));

  snap.forEach(d=>{
    const r = d.data();

    if(r.usuario === usuarioActual.email){
      html += `
        <div class="card">
          <button onclick="verPDF('${r.url}')">Ver</button>
        </div>
      `;
    }
  });

  contenido.innerHTML = html;
};

//////////////////////////////////////////////////////
// ✅ VISOR + FIRMA
//////////////////////////////////////////////////////

window.verPDF = function(url){
  visorPDF.src = url;
  visorModal.style.display = "block";
};

window.cerrarModal = function(){
  visorModal.style.display = "none";
};

window.firmarUI = function(){
  visorModal.style.display = "block";
};

//////////////////////////////////////////////////////
// ✅ LOGOUT
//////////////////////////////////////////////////////

window.logout = ()=>{
  signOut(auth);
  window.location = "index.html";
};