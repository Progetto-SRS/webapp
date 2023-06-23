const axios = require('axios');
require('dotenv').config()

// Funzione per effettuare la richiesta all'API di Google Images
async function searchImages(query) {
  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: process.env.GOOGLE_API_KEY, // Sostituisci con la tua API key di Google
        cx: 'e52e488c5b9b34253', // Sostituisci con il tuo search engine ID di Google
        q: query,
        searchType: 'image',
      },
    });

    if (response.data && response.data.items) {
        // Estrai gli URL delle immagini dai risultati della ricerca
        const imageUrls = response.data.items.map(item => item.link);
        return imageUrls;
      } else {
        console.error('Risposta API non valida:', response.data);
        return [];
      }
    
    }catch (error) {
        console.error('Errore durante la ricerca delle immagini:', error);
        return [];
    }
}
module.exports = {
    searchImages,
  };
  