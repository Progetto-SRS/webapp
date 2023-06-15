const Collection = require('../models/Collections')
const { uploadToAzureStorage } = require('../azureStorage');
const jwt = require('jsonwebtoken')
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const axios = require('axios')
const util = require('util');

require('dotenv').config()

const verifyJwt = util.promisify(jwt.verify);

const generate= async(req, res, next) =>{
    try{
        const token = req.headers.authorization.substring('Bearer '.length);
        const decode = await verifyJwt(token, process.env.SECRET_KEY);
        const collection = new Collection({
            username: decode.name,
            siteName: req.body.siteName,
            siteType: req.body.siteType,
            template: req.body.template,
            settings: req.body.settings
        })

        const storageAccountName = collection.siteName

        //Creazione storageAccount
        const azureFunctionUrl = 'https://dev-functions-srs.azurewebsites.net/api/create-account-storage';
        const requestBody = { nomeSito: storageAccountName };

        let azureFunctionSuccess = false
        try{
            const response = await axios.post(azureFunctionUrl, requestBody);

            if (response.status === 200) {
            console.log('Richiesta alla Azure Function riuscita');
            azureFunctionSuccess = true
            } else {
            console.log('Richiesta alla Azure Function non riuscita');
            // Gestisci l'errore
            return
            }  
        }catch(error){
            console.error('Si è verificato un errore durante la richiesta alla Azure Function', error);
        }

        if(azureFunctionSuccess){
            //Creazione cartella con sito
            const siteDirectory = path.resolve(__dirname, '..', 'sites', collection._id.toString());
            fs.mkdirSync(siteDirectory,{ recursive: true })
            console.log('Cartella creata:', siteDirectory);

            const templateDirectory = path.resolve(__dirname, '..', 'templates', collection.template); // Directory path for the template folder
            fsExtra.copySync(templateDirectory, siteDirectory);
            console.log('File copiati da:', templateDirectory);
            
            //GENERAZIONE --TODO

            const containerName = '$web';

            fs.readdir(siteDirectory, (err, files) => {
                if (err) {
                console.log('Errore durante la lettura della directory:', err);
                return;
                }

                let uploadCount = 0;
                let errorOccurred = false;

                files.forEach((file) => {
                const blobName = file;
                uploadToAzureStorage(storageAccountName, containerName, path.resolve(siteDirectory, file), blobName)
                    .then(() => {
                    console.log('Caricamento completato con successo per:', file);
                    uploadCount++;

                    if (uploadCount === files.length && !errorOccurred) {
                        console.log('Caricamento completato per tutti i file.');
                        collection.save()
                        .then(() => {
                            fsExtra.remove(siteDirectory)
                            .then(() => {
                                console.log('Rimozione cartella completata.');
                                res.json({
                                message: 'Collection added successfully',
                                });
                            })
                            .catch((error) => {
                                console.error('Si è verificato un errore durante la rimozione della cartella:', error);
                                res.status(500).json({
                                message: 'An error occurred',
                                error: error.message,
                                });
                            });
                        })
                        .catch((error) => {
                            console.error('Si è verificato un errore durante il salvataggio della collezione:', error);
                            res.status(500).json({
                            message: 'An error occurred',
                            error: error.message,
                            });
                        });
                    }
                    })
                    .catch((error) => {
                        console.error('Si è verificato un errore durante il caricamento per:', file, error);
                        res.status(500).json({
                            message: 'An error occurred',
                            error: error.message,
                        });
                    });
                });
            });
        } else {
            res.status(500).json({
                message: 'An error occurred in Azure Function',
            });
        }
    }catch(err){
        res.status(400).json({
            err
        }) 
    }
}

const loadCollections =(req,res,next) =>{
    const token = req.headers.authorization.substring('Bearer '.length);

    jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
        if(err){
            res.status(400).json({
                err
            })
        }
        else{
            Collection.find({username: decode.name})
            .then(collection =>{
                res.json({
                    collection
                })
            })
            .catch(error =>{
                res.json({
                    message: 'An error occurred',
                    error
                })
            })
                
            
        }
    } )

}

const loadUsername = (req,res,next) =>{
    const token = req.headers.authorization.substring('Bearer '.length);
    jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
        if(err){
            res.status(400).json({
                message: 'An error occurred',
                err
            })
        }
        else{
            
            res.status(200).json({
                username: decode.name
            })
                
            
        }
    } )
}


const removeCollection =(req,res,next) =>{
    const token = req.headers.authorization.substring('Bearer '.length);
    jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
        if(err){
            res.status(400).json({
                message: 'An error occurred',
                err
            })
        }
        else{
            const collectionId = req.body.collectionId;
            Collection.findOneAndRemove({ _id: collectionId, username: decode.name })
            .then(() => {
                res.status(200).json({
                    message: 'Collection removed successfully'
                });
            })
            .catch(error => {
                res.status(500).json({
                    message: 'An error occurred. Impossible to remove collection',
                    error: error.message
            });
        });
        }
    })
}

module.exports= {
    generate, loadCollections, loadUsername, removeCollection
}