const Collection = require('../models/Collections')
const { uploadToAzureStorage } = require('../azureStorage');
const jwt = require('jsonwebtoken')
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
require('dotenv').config()


const generate= (req, res, next) =>{


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
                fs.mkdirSyncy(siteDirectory,{ recursive: true })

                const templateDirectory = path.resolve(__dirname, '..', 'templates', collection.template); // Directory path for the template folder
                fsExtra.copySync(templateDirectory, siteDirectory);

                
                //GENERAZIONE --TODO


                const storageAccountName = collection.siteName
                const containerName = '$web';
                

                

                fs.readdir(siteDirectory, (err, files) => {
                    if (err) {
                        console.log('Errore durante la lettura della directory:', err);
                        return;
                    }

                    files.forEach((file) => {
                        const blobName = file
                        uploadToAzureStorage(storageAccountName, containerName, path.resolve(siteDirectory,file), blobName)
                        .then(() => {
                            console.log('Caricamento completato con successo.');
                        })
                        .catch((error) => {
                            console.error('Si è verificato un errore durante il caricamento:', error);
                        });
                    
                    });
                });
        
            

                res.json({
                    
                    message: 'Collection added succesfully'
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