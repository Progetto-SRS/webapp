// azureStorage.js

const { BlobServiceClient } = require('@azure/storage-blob');
const { DefaultAzureCredential } = require("@azure/identity");

async function uploadToAzureStorage(storageAccountName, containerName, localFilePath, blobName) {

  // storageAccountName = nome sito web utente
  // containerName = $web (container di default se voglio caricare file relativi al sito web)

  // Connessione all'account di Azure Storage
  const credential = new DefaultAzureCredential();
  const blobServiceClient = BlobServiceClient("https://%22+storageaccountname+%22.blob.core.windows.net/", credential);

  // Ottenere il riferimento al contenitore (se non esiste, verrà creato)
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Creare un riferimento al blob nel contenitore
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Caricare il file sul blob
  await blockBlobClient.uploadFile(localFilePath);

  console.log('File caricato con successo su Azure Storage.');
}
module.exports = {
  uploadToAzureStorage
};
