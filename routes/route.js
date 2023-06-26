const express = require ('express')
const router = express.Router()
const GeneratorController = require('../controllers/GeneratorController')

router.post('/generate', GeneratorController.generate)
router.post('/load-collections', GeneratorController.loadCollections)
router.post('/load-username',GeneratorController.loadUsername)
router.post('/remove-collection', GeneratorController.removeCollection)
router.post('/getSiteStatus', GeneratorController.getSiteStatus)
module.exports = router