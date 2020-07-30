const express = require('express');
const router = express.Router();


const controller = require('../controllers/databases');

router.get('/', controller.getAll);

router.get('/download', controller.download);
router.post('/export', controller.export);

router.get('/getDatabase', controller.getDatabase);
router.get('/getTable', controller.getTable);
router.get('/getView', controller.getView);
router.get('/generateStatement', controller.generateStatement);

router.post('/deleteRow', controller.deleteRow);
router.post('/deleteTable', controller.deleteTable);
router.post('/deleteView', controller.deleteView);
router.post('/cloneTable', controller.cloneTable);
router.post('/executeStatement', controller.executeStatement);
router.post('/executeStatements', controller.executeStatements);
router.put('/updateRow', controller.updateRow);

router.post('/vacuum', controller.vacuum);
router.post('/import', controller.import);

module.exports = router;
