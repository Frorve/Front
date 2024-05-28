const fetch = require('node-fetch');

const API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY;
const API_URL = "https://api-inference.huggingface.co/models/gpt2";

async function sendMessage(msg) {
  const apiRequestBody = {
    inputs: msg,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(apiRequestBody),
  });

  const data = await response.json();
  if (response.ok) {
    return data[0]?.generated_text; // Asegurándonos de acceder correctamente a la respuesta generada
  } else {
    throw new Error(data.error || "Error fetching from Hugging Face API");
  }
}

module.exports = { sendMessage };
