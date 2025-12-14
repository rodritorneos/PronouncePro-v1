/* ===========================================
   app.js — Funciones globales del frontend
   =========================================== */

const API_URL = "https://blogs-significantly-beatles-domains.trycloudflare.com"; // Cambia si tu backend usa otro puerto

// ===========================================
// === FUNCIONES GENERALES PARA EL FRONTEND ===
// ===========================================

// POST JSON
async function postData(endpoint, data) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Error en la solicitud");
    }
    return await response.json();
  } catch (error) {
    console.error("Error POST:", error);
    throw error;
  }
}

// PUT JSON
async function putData(endpoint, data) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Error en la solicitud PUT");
    }
    return await response.json();
  } catch (error) {
    console.error("Error PUT:", error);
    throw error;
  }
}

// POST FormData (archivos)
async function postFile(endpoint, formData) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Error al enviar archivo");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al subir archivo:", error);
    throw error;
  }
}

// GET
async function getData(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) throw new Error("Error al obtener datos");
    return await response.json();
  } catch (error) {
    console.error("Error GET:", error);
    throw error;
  }
}

// ===========================================
// === MANEJO DE SESIÓN ===
function saveSession(role, email) {
  localStorage.setItem("role", role);
  localStorage.setItem("email", email);
}

function getSession() {
  return {
    role: localStorage.getItem("role"),
    email: localStorage.getItem("email"),
  };
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ===========================================
// === ALERTAS / MENSAJES VISUALES ===
function showAlert(message, type = "info") {
  const alertBox = document.getElementById("alertBox");
  if (!alertBox) return;
  alertBox.innerHTML = `<div class="alert ${type}">${message}</div>`;
  setTimeout(() => {
    alertBox.innerHTML = "";
  }, 4000);
}

// ===========================================
// === FUNCIONES RELACIONADAS AL BACKEND ===

// --- Registrar usuario ---
async function registrarUsuario(username, email, password) {
  return await postData("/usuarios/registro", { username, email, password });
}

// --- Login usuario ---
async function loginUsuario(email, password) {
  return await postData("/usuarios/login", { email, password });
}

// --- Registrar docente ---
async function registrarDocente(username, email, password) {
  return await postData("/docentes/registro", { username, email, password });
}

// --- Login docente ---
async function loginDocente(email, password) {
  return await postData("/docentes/login", { email, password });
}

// --- Generar oración por tema ---
async function generarOracion(tema) {
  return await getData(`/generar_oracion/${encodeURIComponent(tema)}`);
}

// --- Enviar audio para análisis de pronunciación ---
async function analizarPronunciacion(audioBlob, oracionOriginal, usuario_email, tema) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "voz.wav");
  formData.append("frase", oracionOriginal);
  formData.append("usuario_email", usuario_email);
  formData.append("tema", tema);
  return await postFile("/analizar_pronunciacion_audio/", formData);
}

// ===========================================
// === VALIDACIÓN DE CONEXIÓN CON EL BACKEND ===
async function verificarConexion() {
  try {
    const res = await fetch(API_URL);
    if (res.ok) console.log("✅ Conexión con el backend establecida");
    else console.warn("⚠️ El backend respondió con error");
  } catch {
    console.error("❌ No se pudo conectar al backend");
  }
}

verificarConexion();