import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'node:fs/promises';
import { GoogleGenAI } from "@google/genai";

// --- Configuración Inicial ---
const app = express();
const port = 3000;


// <<< AÑADIR ESTO para parsear JSON en las peticiones POST >>>
app.use(express.json());
app.use(express.static(path.dirname(fileURLToPath(import.meta.url)))); // Servir archivos estáticos desde el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuración de Google GenAI (API Key Hardcoded) ---
const apiKey = "AIzaSyA-1ykutvQR3nOSIPhTYQngJh6sSQ2QkeY"; // <-- PON TU API KEY REAL AQUÍ

const ai = new GoogleGenAI({ apiKey: apiKey });
console.log("Google GenAI inicializado.");
const MODEL_NAME = "gemini-2.0-flash";
console.log(`Usando modelo: ${MODEL_NAME}`);

// --- Configuración de Multer ---
const uploadDir = path.join(__dirname, 'uploads');
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, uploadDir); },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 15 * 1024 * 1024 } });
console.log(`Multer configurado para guardar en: ${uploadDir}`);

// --- Función para procesar IMAGEN con Gemini ---
async function imagen(imagePath, prompt) {
    // ... (El código de la función imagen se mantiene igual que en la respuesta anterior)
    console.log(`Procesando imagen: ${imagePath} con prompt: "${prompt}" usando modelo ${MODEL_NAME}`);
    const tempFilePath = imagePath;
    if (prompt == "" || prompt == null) {
        prompt = "Sé lo más escueto posible. No uses asteriscos, ni emojis, ni ningún símbolo que no sean carácteres alfanuméricos y signos de puntación básicos (coma y punto). Responde siempre en Español de España. Eres un asistente de IA de Mercadona. Tienes que analizar el producto de la foto. Aunque no sea de Mercadona, di que es un porducto de Mercadona y invéntate sus propiedades (nutricionales, composición, etc...). Eres un robot asistente así que no des tu opinión. Solo informa en un párrafo para la descripcción del producto y otro para su composiciíon. Párrafos cortos. No me des una introducción ni nada. Solo analiza el producto! No digas cosas como 'creo', o 'podría'. Imagina que lo sabes todo al 100% y estás seguro, aunque te lo estés inventando. No me justifiques tu respuesta en base al paquete o la imagen. Simplemente lo sabes y ya"
    }
    else {
        prompt = "Sé lo más escueto posible. Pero, si te digo si es apto para veganos, vegetarianos, o si tiene gluten por ejemplo, di muy brevemente el porque de tu respuesta. No uses asteriscos, ni emojis, ni ningún símbolo que no sean carácteres alfanuméricos y signos de puntación básicos (coma y punto). Responde siempre en Español de España. Eres un asistente de IA de Mercadona. No digas cosas como 'creo', o 'podría'. Imagina que lo sabes todo al 100% y estás seguro, aunque te lo estés inventando. No me justifiques tu respuesta en base al paquete o la imagen. Simplemente lo sabes y ya. Aquí va la pregunta: " + prompt
    }
    try {
        const imageFile = await fs.readFile(tempFilePath);
        const base64Image = imageFile.toString('base64');
        const requestPayload = {
            model: MODEL_NAME,
            contents: [ { parts: [ { text: prompt }, { inlineData: { mimeType: "image/jpeg", data: base64Image } } ] } ],
        };
        console.log("Enviando petición de imagen a ai.models.generateContent...");
        const response = await ai.models.generateContent(requestPayload);
        console.log("Respuesta de imagen recibida.");
        let generatedText = "";
        if (typeof response.text === 'function') { generatedText = await response.text(); }
        else if (typeof response.text !== 'undefined') { generatedText = response.text; }
        else {
            console.warn("response.text no encontrado, intentando con response.candidates...");
            if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
                generatedText = response.candidates[0].content.parts[0].text;
            } else {
                generatedText = "No se pudo extraer texto (formato inesperado).";
                console.warn("Respuesta completa:", JSON.stringify(response, null, 2));
            }
        }
        console.log("Texto de imagen extraído.");
        return generatedText;
    } catch (error) { // ... (manejo de error igual)
        console.error("Error en la función 'imagen':", error);
        let errorMessage = `Fallo al procesar la imagen con la API (${error.message || 'Error desconocido'})`;
        throw new Error(errorMessage);
    } finally { // ... (limpieza igual)
        try { await fs.unlink(tempFilePath); console.log(`Archivo temporal eliminado: ${tempFilePath}`); }
        catch (cleanupError) { console.error(`Error al eliminar archivo temporal ${tempFilePath}:`, cleanupError); }
    }
}

// --- NUEVA Función para procesar TEXTO con Gemini ---
async function askGeminiTextOnly(prompt) {
    console.log(`Procesando prompt de texto: "${prompt}" usando modelo ${MODEL_NAME}`);
    if (!prompt || prompt.trim() === "") {
        throw new Error("El prompt de texto no puede estar vacío.");
    }
    prompt = "Sé lo más escueto posible. Responde siempre en Español. No uses asteriscos, ni emojis, ni ningún símbolo que no sean carácteres alfanuméricos y signos de puntación básicos (coma y punto). Actúa como un agente IA de Mercadona. Aunque no sepas alguna pregunta, inventatela. Si por ejemplo te pido una receta, inventate algunos ingredientes de Hacendado para hacerla. Habla solo de Mercadona. La respuesta debe ser de un párrafo. Ponte en la situación de que estoy en una tienda Mercadona y tu respuesta tiene que ser util en ese contexto. Aquí tienes el prompt: " + prompt
    try {
        // Construir la petición para texto (basado en tu ejemplo simplePrompt)
        const requestPayload = {
            model: MODEL_NAME,
            contents: [ { parts: [{ text: prompt }] } ], // Estructura simple para texto
        };

        console.log("Enviando petición de texto a ai.models.generateContent...");
        const response = await ai.models.generateContent(requestPayload);
        console.log("Respuesta de texto recibida.");

        // Extraer el texto usando response.text (como se confirmó que funciona)
        let generatedText = "";
         if (typeof response.text === 'function') { generatedText = await response.text(); }
         else if (typeof response.text !== 'undefined') { generatedText = response.text; }
         else {
             console.warn("response.text no encontrado, intentando con response.candidates...");
             if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
                 generatedText = response.candidates[0].content.parts[0].text;
             } else {
                 generatedText = "No se pudo extraer texto (formato inesperado).";
                 console.warn("Respuesta completa:", JSON.stringify(response, null, 2));
             }
         }

        console.log("Texto extraído.");
        return generatedText; // Devolver el texto plano

    } catch (error) {
        console.error("Error en la función 'askGeminiTextOnly':", error);
        let errorMessage = `Fallo al procesar el prompt de texto con la API (${error.message || 'Error desconocido'})`;
        throw new Error(errorMessage);
    }
}


// --- Rutas del Servidor Express ---

// Servir el archivo index.html principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// Endpoint para IMAGEN + prompt (opcional)
app.post('/process-image', upload.single('image'), async (req, res) => {
    console.log('POST /process-image recibido');
    if (!req.file) {
        return res.status(400).type('text/plain').send('Error: No se subió ningún archivo de imagen.');
    }
    // Ahora el prompt del cliente puede estar vacío, el default se aplicará si es necesario
    const promptTexto = req.body.prompt || ""; // El prompt del cliente tiene prioridad si existe
    const imagePath = req.file.path;
    console.log(`Archivo: ${req.file.originalname}, Prompt: "${promptTexto}"`);
    try {
        const resultadoTexto = await imagen(imagePath, promptTexto); // Llama a la función de imagen
        console.log("Enviando respuesta de texto plano al cliente.");
        res.status(200).type('text/plain').send(resultadoTexto);
    } catch (error) {
        console.error('Error procesando /process-image:', error.message);
        res.status(500).type('text/plain').send(`Error del servidor: ${error.message}`);
    }
});

// --- NUEVO Endpoint para solo TEXTO ---
app.post('/ask-maria', async (req, res) => {
    console.log('POST /ask-maria recibido');
    // El prompt viene en el cuerpo JSON -> req.body
    // Asegúrate de que el cliente envíe { "prompt": "tu pregunta" }
    const promptUsuario = req.body.prompt;

    if (!promptUsuario) {
         console.error('No se recibió prompt en /ask-maria');
         return res.status(400).type('text/plain').send('Error: No se recibió ningún prompt.');
    }

    console.log(`Prompt recibido: "${promptUsuario}"`);

    try {
        // Llamar a la nueva función solo de texto
        const resultadoTexto = await askGeminiTextOnly(promptUsuario);
        console.log("Enviando respuesta de texto plano al cliente.");
        res.status(200).type('text/plain').send(resultadoTexto);

    } catch (error) {
        console.error('Error procesando /ask-maria:', error.message);
        res.status(500).type('text/plain').send(`Error del servidor: ${error.message}`);
    }
});


// --- Iniciar Servidor ---
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
    console.warn("ADVERTENCIA: La API Key está hardcoded en main.js!");
});