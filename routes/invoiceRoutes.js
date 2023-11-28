const express = require('express');
const router = express.Router()
const upload = require('../middleware/multer')
const bodyParser = require('body-parser');
const invoiceController = require('../controllers/invoiceController');
const { isAdmin, isClient } = require('../middleware/authorization');

router.use(bodyParser.json());

// Router: Route to generate an invoice
router.post('/generate-invoice/:userRole?',upload.array(),isAdmin ,invoiceController.genrateInvoiceController );
router.get('/getallinvoice/:userRole?',isAdmin ,invoiceController.getAllInvoice);
router.get('/getinvoicebyid/:_id/:userRole?',isClient ,invoiceController.getInvoicebyId);
router.get('/getallinvoicebyclientid/:cid/:userRole?',isClient ,invoiceController.getAllInvoiceByClientId);




module.exports = router;