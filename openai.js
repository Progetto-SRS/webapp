const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



const generateContent = async (prompt) => {
  try {
    const gptResponse = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 40,
      n: 1,
      temperature: 0.7,
    });

    const generatedText = gptResponse.choices[0].text.trim();

    return generatedText;
  } catch (error) {
    console.error('Si è verificato un errore durante la generazione del contenuto:', error);
    throw error;
  }
};

module.exports = {
  generateContent,
};
