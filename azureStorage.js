// azureStorage.js

const { BlobServiceClient } = require('@azure/storage-blob');
const { DefaultAzureCredential } = require("@azure/identity");

async function uploadToAzureStorage(storageAccountName, containerName, localFilePath, blobName, contentType) {

  // storageAccountName = nome sito web utente
  // containerName = $web (container di default se voglio caricare file relativi al sito web)

  // Connessione all'account di Azure Storage
  const credential = new DefaultAzureCredential();
  const blobServiceClient = new BlobServiceClient("https://"+storageAccountName+".blob.core.windows.net/", credential);

  // Ottenere il riferimento al contenitore (se non esiste, verrà creato)
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Creare un riferimento al blob nel contenitore
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Opzioni per il caricamento del blob
  const options = {
    blobHTTPHeaders: {
      blobContentType: contentType // Imposta il Content-Type corretto
    }
  };


  // Caricare il file sul blob
  await blockBlobClient.uploadFile(localFilePath, options);

  console.log('File caricato con successo su Azure Storage.');
}
module.exports = {
  uploadToAzureStorage
};
