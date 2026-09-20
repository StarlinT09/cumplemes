/* ==========================================================
   AQUÍ EDITAS TODO. No necesitas tocar nada más.
   Cambia los textos entre comillas y guarda el archivo.
   ========================================================== */

window.CONFIG = {

  /* 1. Nombres */
  nombreElla: "Brecken (Meu Menina)",          // Cómo le dices a ella. Aparece en "Feliz cumplemes, ..."
  tuNombre: "Starlin Javier (Tu prieto)",       // Aparece al final de la carta

  /* 2. Fecha en que empezaron: año-mes-día (AAAA-MM-DD)
        Con hora es opcional: "2025-01-15 20:30"
        La página calcula sola los meses, días, horas y segundos. */
  fechaInicio: "2025-07-21",

  /* 3. Foto grande de portada (opcional).
        Si no existe el archivo, simplemente no se muestra. */
  fotoPortada: "fotos/portada.jpeg",

  /* 4. Tus fotos. Copia los archivos a la carpeta "fotos" y escribe aquí sus nombres.
        Agrega o quita líneas como quieras. Si una foto no existe todavía,
        verás un recuadro con el nombre del archivo que falta. */
  fotos: [
    { src: "fotos/foto01.jpeg", pie: "Nuestro primer paseo" },
    { src: "fotos/foto02.jpeg", pie: "Cuando haciamos un plan que no recuerdo que era" },
    { src: "fotos/foto03.jpeg", pie: "Cuando salimos a comer y tus padres nos esperaban" },
    { src: "fotos/foto04.jpeg", pie: "Contigo, siempre" }
  ],

  /* 5. Razones (se muestran una por una al tocar el botón).
        Déjalo como [] si no quieres esta sección. */
  razones: [
    "Porque me haces reír incluso en los días difíciles.",
    "Porque contigo hasta esperar se siente bien.",
    "Porque eres tú misma incluso cuando nadie mira.",
    "Porque cuidas de mí sin que te lo pida.",
    "Porque me encanta cómo te ríes."
  ],

  /* 6. Tu carta. Cada línea entre comillas es un párrafo.
        Cámbiala por tus propias palabras. Déjalo como [] si no quieres carta. */
  carta: [
    "Cada mes contigo me recuerda lo bonito que es tenerte cerca.",
    "Gracias por tu paciencia, por tu risa y por hacer que los días comunes se sientan especiales.",
    "Esta página es pequeña comparada con lo que siento, pero quería que tuvieras un lugar al que volver para vernos así, juntos."
  ],

  /* 7. Música (opcional). Pon tu archivo en la carpeta "musica" y escribe su ruta,
        por ejemplo: "musica/cancion.mp3". Déjalo vacío ("") si no quieres música.
        En iPhone empieza cuando ella toca la hoja del calendario. */
  musica: ""
};
