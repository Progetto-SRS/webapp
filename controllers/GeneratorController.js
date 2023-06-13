const Collection = require('../models/Collections')
const { uploadToAzureStorage } = require('../azureStorage');
const jwt = require('jsonwebtoken')
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
require('dotenv').config()


const generate= async(req, res, next) =>{


    const token = req.headers.authorization.substring('Bearer '.length);

    jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
        if(err){
            res.status(400).json({
                err
            })
        }
        else{

            const collection = new Collection({
                username: decode.name,
                siteName: req.body.siteName,
                siteType: req.body.siteType,
                template: req.body.template,
                settings: req.body.settings
            })
            
            collection.save()
            .then(collection =>{
                //Creazione cartella con sito
                const siteDirectory = path.resolve(__dirname, '..', 'sites', collection._id.toString());
                fs.mkdirSync(siteDirectory,{ recursive: true })
                console.log('Cartella creata:', siteDirectory);

                const templateDirectory = path.resolve(__dirname, '..', 'templates', collection.template); // Directory path for the template folder
                fsExtra.copySync(templateDirectory, siteDirectory);
                console.log('File copiati da:', templateDirectory);
                
                //GENERAZIONE --TODO


                const storageAccountName = collection.siteName
                const containerName = '$web';
                

                

                fs.readdir(siteDirectory, (err, files) => {
                    if (err) {
                        console.log('Errore durante la lettura della directory:', err);
                        return;
                    }
                    let uploadCount = 0
                    files.forEach((file) => {
                        const blobName = file
                        uploadToAzureStorage(storageAccountName, containerName, path.resolve(siteDirectory, file), blobName)
                            .then(() => {
                                console.log('Caricamento completato con successo per:', file);
                                uploadCount++; // Incrementa il contatore dei file caricati
                      
                                if (uploadCount === files.length) {
                                // Se tutti i file sono stati caricati, esegui res.json()
                                    console.log('Caricamento completato per tutti i file.');
                                    res.json({
                                        message: 'Collection added successfully'
                                    });
                                }
                            })
                            .catch((error)=>{
                                console.error('Si è verificato un errore durante il caricamento per:', file, error);
                                res.status(500).json({
                                    message: 'An error occurred',
                                    error: error.message,
                                });
                            })
                        
                    })
                        
                })       
                    
                
            })
            
                
            
        }
    })
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

module.exports= {
    generate, loadCollections, loadUsername
}