(() => {
  "use strict";

  const C = window.CONFIG || {};
  const $ = (sel) => document.querySelector(sel);
  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const nombreElla = C.nombreElla || "Amor";
  const tuNombre = C.tuNombre || "";
  const fotos = Array.isArray(C.fotos) ? C.fotos : [];
  const razones = Array.isArray(C.razones) ? C.razones : [];
  const carta = Array.isArray(C.carta) ? C.carta : [];

  const capitalizar = (t) => t.charAt(0).toUpperCase() + t.slice(1);

  /* ---------- Fechas (escritas a mano porque Safari es estricto con new Date("...")) ---------- */

  function leerFecha(texto) {
    const m = String(texto || "").match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?$/);
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
  }

  function sumarMeses(fecha, n) {
    const d = new Date(fecha.getFullYear(), fecha.getMonth() + n, 1, fecha.getHours(), fecha.getMinutes());
    const ultimo = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(fecha.getDate(), ultimo));
    return d;
  }

  let inicio = leerFecha(C.fechaInicio);
  if (!inicio) {
    console.warn('fechaInicio no es válida. Usa el formato AAAA-MM-DD, por ejemplo "2025-01-15".');
    inicio = new Date();
  }

  function mesesYDias(ahora) {
    let meses = (ahora.getFullYear() - inicio.getFullYear()) * 12 + (ahora.getMonth() - inicio.getMonth());
    if (sumarMeses(inicio, meses) > ahora) meses -= 1;
    meses = Math.max(0, meses);
    const dias = Math.max(0, Math.floor((ahora - sumarMeses(inicio, meses)) / 86400000));
    return { meses, dias };
  }

  const PALABRAS = ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
    "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho",
    "diecinueve", "veinte", "veintiún", "veintidós", "veintitrés", "veinticuatro"];

  function tituloMeses(n) {
    if (n === 0) return "Nuestros primeros días";
    const palabra = n < PALABRAS.length ? PALABRAS[n] : String(n);
    return `${capitalizar(palabra)} ${n === 1 ? "mes" : "meses"} contigo`;
  }

  /* ---------- Hoja de calendario y portada ---------- */

  const hoy = new Date();
  const ultimoDiaDelMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
  const diaCumples = Math.min(inicio.getDate(), ultimoDiaDelMes);
  const fechaCumples = new Date(hoy.getFullYear(), hoy.getMonth(), diaCumples);

  $("#introMes").textContent = capitalizar(fechaCumples.toLocaleDateString("es", { month: "long" }));
  $("#introDia").textContent = diaCumples;
  $("#introSemana").textContent = capitalizar(fechaCumples.toLocaleDateString("es", { weekday: "long" }));

  const { meses, dias } = mesesYDias(hoy);
  $("#titulo").textContent = tituloMeses(meses);
  $("#saludo").textContent = `Feliz cumplemes, ${nombreElla}.`;
  $("#desde").textContent = "Desde el " + inicio.toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });
  $("#resumen").textContent =
    `Van ${meses} ${meses === 1 ? "mes" : "meses"} y ${dias} ${dias === 1 ? "día" : "días"} desde que empezamos.`;
  document.title = `Feliz cumplemes, ${nombreElla}`;

  if (C.fotoPortada) {
    const arco = new Image();
    arco.className = "arco";
    arco.alt = "";
    arco.addEventListener("error", () => arco.remove());
    arco.src = C.fotoPortada;
    $("#portada").prepend(arco);
  }

  /* ---------- Contador en vivo ---------- */

  const elDias = $("#cDias");
  const elHoras = $("#cHoras");
  const elMin = $("#cMin");
  const elSeg = $("#cSeg");
  const dos = (n) => String(n).padStart(2, "0");

  function tic() {
    const s = Math.max(0, Math.floor((Date.now() - inicio.getTime()) / 1000));
    elDias.textContent = Math.floor(s / 86400);
    elHoras.textContent = dos(Math.floor((s % 86400) / 3600));
    elMin.textContent = dos(Math.floor((s % 3600) / 60));
    elSeg.textContent = dos(s % 60);
  }
  tic();
  setInterval(tic, 1000);

  /* ---------- Galería ---------- */

  const galeria = $("#galeria");
  const carrusel = $("#carrusel");
  const contadorFotos = $("#contadorFotos");
  const cargadas = new Set();

  const visor = $("#visor");
  const visorImg = $("#visorImg");
  const visorPie = $("#visorPie");
  const visorNum = $("#visorNum");
  const visorCerrar = $("#visorCerrar");
  let visorIndice = -1;
  let origenVisor = null;

  if (!fotos.length) {
    galeria.remove();
  } else {
    fotos.forEach((f, i) => {
      const fig = document.createElement("figure");
      fig.className = "foto";

      const marco = document.createElement("button");
      marco.type = "button";
      marco.className = "foto__marco";
      marco.setAttribute("aria-label", f.pie ? `Ampliar foto: ${f.pie}` : `Ampliar foto ${i + 1}`);

      const img = new Image();
      img.alt = f.pie || `Foto ${i + 1}`;
      img.decoding = "async";
      img.addEventListener("load", () => cargadas.add(i));
      img.addEventListener("error", () => {
        const vacio = document.createElement("span");
        vacio.className = "sin-foto";
        const titulo = document.createElement("strong");
        titulo.textContent = "Aquí va tu foto";
        const ruta = document.createElement("span");
        ruta.textContent = f.src;
        vacio.append(titulo, ruta);
        img.replaceWith(vacio);
        marco.disabled = true;
      });
      img.src = f.src;

      marco.append(img);
      marco.addEventListener("click", () => abrirVisor(i, marco));
      fig.append(marco);

      if (f.pie) {
        const cap = document.createElement("figcaption");
        cap.textContent = f.pie;
        fig.append(cap);
      }
      carrusel.append(fig);
    });

    const indiceActual = () => {
      const c = carrusel.getBoundingClientRect();
      const centro = c.left + c.width / 2;
      let mejor = 0;
      let distancia = Infinity;
      Array.from(carrusel.children).forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - centro);
        if (d < distancia) { distancia = d; mejor = i; }
      });
      return mejor;
    };

    const actualizarContador = () => {
      contadorFotos.textContent = fotos.length > 1 ? `${indiceActual() + 1} de ${fotos.length}` : "";
    };

    let pendiente = false;
    carrusel.addEventListener("scroll", () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => { pendiente = false; actualizarContador(); });
    }, { passive: true });
    actualizarContador();
  }

  /* ---------- Visor de fotos ---------- */

  const listaVisor = () => Array.from(cargadas).sort((a, b) => a - b);

  function verFoto(i) {
    const f = fotos[i];
    visorIndice = i;
    visorImg.src = f.src;
    visorImg.alt = f.pie || `Foto ${i + 1}`;
    visorPie.textContent = f.pie || "";
    const lista = listaVisor();
    visorNum.textContent = lista.length > 1 ? `${lista.indexOf(i) + 1} de ${lista.length}` : "";
  }

  function abrirVisor(i, origen) {
    origenVisor = origen;
    verFoto(i);
    visor.hidden = false;
    document.documentElement.classList.add("con-visor");
    visorCerrar.focus();
  }

  function cerrarVisor() {
    if (visor.hidden) return;
    visor.hidden = true;
    document.documentElement.classList.remove("con-visor");
    visorImg.removeAttribute("src");
    const tarjeta = carrusel.children[visorIndice];
    if (tarjeta) {
      carrusel.scrollLeft = tarjeta.offsetLeft - (carrusel.clientWidth - tarjeta.offsetWidth) / 2;
    }
    if (origenVisor) origenVisor.focus({ preventScroll: true });
  }

  function pasarFoto(direccion) {
    const lista = listaVisor();
    if (lista.length < 2) return;
    const pos = lista.indexOf(visorIndice);
    verFoto(lista[(pos + direccion + lista.length) % lista.length]);
  }

  let toqueInicial = null;
  visor.addEventListener("touchstart", (e) => { toqueInicial = e.changedTouches[0].clientX; }, { passive: true });
  visor.addEventListener("touchend", (e) => {
    if (toqueInicial === null) return;
    const dx = e.changedTouches[0].clientX - toqueInicial;
    toqueInicial = null;
    if (Math.abs(dx) > 50) pasarFoto(dx < 0 ? 1 : -1);
  }, { passive: true });
  visor.addEventListener("click", (e) => { if (e.target === visor) cerrarVisor(); });
  visorCerrar.addEventListener("click", cerrarVisor);
  document.addEventListener("keydown", (e) => {
    if (visor.hidden) return;
    if (e.key === "Escape") cerrarVisor();
    if (e.key === "ArrowRight") pasarFoto(1);
    if (e.key === "ArrowLeft") pasarFoto(-1);
  });

  /* ---------- Razones ---------- */

  if (!razones.length) {
    $("#razones").remove();
  } else {
    const texto = $("#razonTexto");
    const num = $("#razonNum");
    const boton = $("#otraRazon");
    let actual = -1;

    boton.addEventListener("click", () => {
      actual = (actual + 1) % razones.length;
      texto.textContent = razones[actual];
      num.textContent = `${actual + 1} de ${razones.length}`;
      boton.textContent = "Otra razón";
      texto.classList.remove("nueva");
      void texto.offsetWidth; // reinicia la animación
      texto.classList.add("nueva");
    });
  }

  /* ---------- Carta ---------- */

  if (!carta.length) {
    $("#cartaSeccion").remove();
  } else {
    const papel = $("#carta");
    carta.forEach((parrafo) => {
      const p = document.createElement("p");
      p.textContent = parrafo;
      papel.append(p);
    });
    if (tuNombre) {
      const firma = document.createElement("p");
      firma.className = "firma";
      firma.append("Con cariño,");
      const nombre = document.createElement("strong");
      nombre.textContent = tuNombre;
      firma.append(nombre);
      papel.append(firma);
    }
  }

  /* ---------- Corazones ---------- */

  const corazon = $("#corazon");
  const lluvia = $("#lluvia");
  const SVG_CORAZON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

  function lanzarCorazones(x, y) {
    for (let i = 0; i < 7; i++) {
      const c = document.createElement("span");
      c.className = "vuela";
      c.innerHTML = SVG_CORAZON;
      c.style.left = `${x}px`;
      c.style.top = `${y}px`;
      c.style.setProperty("--dx", `${Math.round(Math.random() * 170 - 85)}px`);
      c.style.setProperty("--s", (0.7 + Math.random() * 0.9).toFixed(2));
      c.style.animationDelay = `${i * 70}ms`;
      c.addEventListener("animationend", () => c.remove());
      lluvia.append(c);
    }
  }

  corazon.addEventListener("click", () => {
    corazon.classList.remove("latido");
    void corazon.offsetWidth;
    corazon.classList.add("latido");
    if (reducirMovimiento) return;
    const r = corazon.getBoundingClientRect();
    lanzarCorazones(r.left + r.width / 2, r.top + r.height / 2);
  });

  /* ---------- Música (opcional) ---------- */

  const botonMusica = $("#musica");
  let audio = null;

  function marcarMusica(sonando) {
    botonMusica.setAttribute("aria-pressed", String(sonando));
  }

  if (C.musica) {
    audio = new Audio(C.musica);
    audio.loop = true;
    botonMusica.hidden = false;
    botonMusica.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().then(() => marcarMusica(true)).catch(() => marcarMusica(false));
      } else {
        audio.pause();
        marcarMusica(false);
      }
    });
  }

  /* ---------- Abrir la hoja del calendario ---------- */

  const intro = $("#intro");
  let abierta = false;

  function abrir() {
    if (abierta) return;
    abierta = true;

    // iPhone solo permite reproducir audio dentro de un toque del usuario: por eso va aquí.
    if (audio) audio.play().then(() => marcarMusica(true)).catch(() => marcarMusica(false));

    intro.classList.add("abriendo");
    document.body.classList.remove("cerrado");
    window.scrollTo(0, 0);

    setTimeout(() => {
      intro.remove();
      $("#titulo").focus({ preventScroll: true });
    }, reducirMovimiento ? 300 : 1150);
  }

  intro.addEventListener("click", abrir);
})();
