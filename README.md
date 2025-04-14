# MarIA- Asistente IA Fullstack (Frontend + Node.js Backend) 🧀🚀

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

Este repositorio contiene una **aplicación web fullstack** conceptual diseñada para actuar como un asistente inteligente dentro de una tienda (inspirado en el entorno de Mercadona). Combina un frontend interactivo con un backend Node.js/Express que se integra con la API de Google Gemini para procesar imágenes y texto.

La aplicación permite a los usuarios interactuar mediante visión artificial, preguntas de texto, escaneo de códigos de barras y una simulación de llamada a empleados, utilizando Text-to-Speech (TTS) para las respuestas.

**⚠️ Advertencia:** Este proyecto utiliza una API Key de Google GenAI. Asegúrate de reemplazar la clave placeholder en `main.js` con tu propia clave válida y **nunca subas tu clave secreta a repositorios públicos.** Se recomienda encarecidamente usar variables de entorno para gestionar las claves API en un entorno real.

## 📂 Estructura del Proyecto

/
├── index.html         # Frontend HTML principal
├── main.js            # Servidor Backend (Node.js/Express) y lógica de API
├── package.json       # Dependencias de Node.js
├── package-lock.json  # Lockfile de dependencias
├── uploads/           # Directorio para subidas temporales de imágenes (creado automáticamente)
└── README.md          # Este archivo


## ✨ Características

* **Menú Lanzador:** Interfaz principal para seleccionar las diferentes herramientas.
* **📷 MariaVision (Foto + Prompt):**
    * Accede a la cámara, captura fotos y permite añadir prompts.
    * Sube la imagen al backend (`/process-image`).
    * El backend procesa la imagen y el prompt usando **Google Gemini Pro Vision**.
    * Muestra la respuesta y la lee con TTS.
* **❓ Preguntar a MarIA (Texto):**
    * Permite escribir preguntas.
    * Envía la pregunta al backend (`/ask-maria`).
    * El backend procesa el texto usando **Google Gemini Pro**.
    * Muestra la respuesta y la lee con TTS.
    * Incluye botón para mostrar/ocultar mapa GIF.
* **🅱️ Escanear Código Barras:**
    * Escanea códigos de barras con la cámara usando `ZXingJS`.
    * Consulta la API de **Open Food Facts** para obtener el nombre del producto.
    * Envía el nombre al backend (`/ask-maria`) para obtener una descripción generada por IA.
    * Muestra la información y la lee con TTS.
* **🔔 Llamar a un Empleado (Simulado):**
    * Simula una llamada mostrando estados ("Llamando...", "¡Gabriel va en camino!").
    * Lee los estados en voz alta con TTS.

## 💻 Tecnologías Utilizadas

**Frontend:**

* HTML5
* CSS3 (Estilos generales, Flexbox, Transiciones/Animaciones)
* JavaScript (ES6+)
    * Manipulación del DOM
    * `Workspace` API
    * `navigator.mediaDevices.getUserMedia`
    * Web Speech API (`window.speechSynthesis`)
    * Librería `ZXingJS` (`@zxing/library`)

**Backend:**
* Node.js
* Express.js (Framework web)
* Multer (Middleware para subida de archivos - imágenes)
* `@google/genai` (SDK oficial de Google GenAI para Node.js)

**APIs Externas:**

* Google Gemini API (Vision y Text)
* Open Food Facts API

## 🚀 Instalación y Ejecución

**Pre-requisitos:**

* Node.js y npm instalados: [Descargar Node.js](https://nodejs.org/)

**Pasos:**

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/provolone-launcher.git](https://github.com/tu-usuario/provolone-launcher.git)
    cd provolone-launcher
    ```
    *(Reemplaza `tu-usuario/provolone-launcher` con la URL real)*

2.  **Instala las dependencias del backend:**
    ```bash
    npm install
    ```

3.  **Configura tu API Key de Google GenAI:**
    * Abre el archivo `main.js` en un editor de texto.
    * Busca la línea:
        ```javascript
        const apiKey = "AIzaSyA-1ykutvQR3nOSIPhTYQngJh6sSQ2QkeY"; // <-- PON TU API KEY REAL AQUÍ
        ```
    * **IMPORTANTE:** Reemplaza el valor `"AIzaSyA-..."` con tu **API Key real** obtenida de Google AI Studio o Google Cloud Console.
    * **(Recomendación)** Para mayor seguridad, considera usar variables de entorno (ej. con el paquete `dotenv`) en lugar de pegar la clave directamente en el código, especialmente si planeas compartir o desplegar el proyecto.

4.  **Inicia el servidor backend:**
    ```bash
    node main.js
    ```
    Deberías ver mensajes en la consola indicando que el servidor está escuchando en `http://localhost:3000` y que Google GenAI se ha inicializado.

5.  **Abre la aplicación:**
    Abre tu navegador web y navega a:
    ```
    http://localhost:3000
    ```
    El backend Node.js servirá directamente el archivo `index.html`.

6.  **Permisos:** La aplicación te pedirá permiso para acceder a la cámara (y micrófono, aunque no se use para entrada). Asegúrate de concederlos.

## 🎮 Uso

1.  Abre `http://localhost:3000` en tu navegador.
2.  Selecciona una opción del menú principal.
3.  Sigue las instrucciones en pantalla para cada función (capturar foto, escribir pregunta, escanear código, observar llamada simulada).
4.  Escucha las respuestas leídas por el sistema TTS.
5.  Usa los botones "← Volver al Menú" para regresar.

## Endpoints API (Gestionados por `main.js`)

* `POST /process-image`: Recibe una imagen (`image`) y un prompt de texto (`prompt`) opcional vía `multipart/form-data`. Devuelve una descripción generada por IA (Gemini Vision).
* `POST /ask-maria`: Recibe un prompt de texto (`prompt`) vía JSON. Devuelve una respuesta generada por IA (Gemini Text).
* `GET /`: Sirve el archivo `index.html`.

## 📸 Screenshots (Opcional)

## 💡 Posibles Mejoras Futuras

* Usar variables de entorno para la API Key.
* Implementar entrada de voz real para "Preguntar a MarIA".
* Mejorar la robustez y el manejo de errores (backend y frontend).
* Añadir feedback visual durante las cargas/procesamiento de IA.
* Optimizar el manejo de prompts para Gemini.
* Refinar la interfaz de usuario.
* Añadir pruebas unitarias/integración.

## 📄 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

---

*Concepto desarrollado en Valencia (España), Abril 2025.*
