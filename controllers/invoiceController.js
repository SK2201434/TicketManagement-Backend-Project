
const easyinvoice = require("easyinvoice");
const fs = require("fs");
const cloudinary = require("../services/couldinary");
const InvoiceSchema = require("../models/invoiceSchema");
const clientSchema = require("../models/clientSchema");
const invoiceSchema = require("../models/invoiceSchema");
require("pdfjs-dist");

// Function to generate an invoice
const generateInvoice = async (invoiceData) => {
  // Validate the data
  const requiredFields = ["client", "products"];

  for (const field of requiredFields) {
    if (!invoiceData[field]) {
      throw new Error(`${field} field is required`);
    }
  }

  // Generate the PDF file
  const currentDate = new Date().toLocaleString();
  const data = {
    customize: {
      // "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
    },
    images: {
      // "logo": senderData.logo,
      // "background": senderData.background
    },
    sender: invoiceData.sender,
    client: invoiceData.client,
    information: {
      number: Date.now(),
      date: currentDate,
      "due-date": "",
    },
    products: invoiceData.products,
    "bottom-notice": "Kindly pay your invoice within 10 days.",
  };

  const invoice = new InvoiceSchema(data);
  const result = await easyinvoice.createInvoice(data);

  // Upload the PDF file to Cloudinary
  const timestamp = Date.now();
  const pdfFileName = `invoice_${timestamp}.pdf`;
  await fs.writeFileSync(pdfFileName, result.pdf, "base64");

  const cloudinaryPublicUrl = await uploadPdfToCloudinary(pdfFileName);

  // Store the PDF path in the database
  invoice.path = cloudinaryPublicUrl;
  await invoice.save();

  return {
    message: "Invoice generated successfully",
    pdfPath: cloudinaryPublicUrl,
  };
};

// Function to upload a PDF file to Cloudinary
const uploadPdfToCloudinary = async (pdfFileName) => {
  const result = await cloudinary.uploader.upload(pdfFileName);
  return result.secure_url;
};

// Controller function to generate an invoice
const genrateInvoiceController = async (req, res) => {
  try {
    // Get the invoice data from the request body
    const invoiceData = req.body;

    // Generate the invoice
    const result = await generateInvoice(invoiceData);

    // Return the PDF path
    res.status(200).json({
      success: true,
      message: result.message,
      pdfPath: result.pdfPath,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.stack,
    });
  }
};
// get all invoice ==========================================
const getAllInvoice = async (req, res) => {
  try {
    const allInvoice = await InvoiceSchema.find({});
    if (allInvoice) {
      res.status(200).json({
        success: true,
        message: "all Invoice list below",
        InvoiceList: allInvoice,
      });
    } else {
      res.status(404)({
        success: false,
        message: "no Invoice found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// get invoice by id==================================================
const getInvoicebyId = async (req, res) => {
  try {
    const { _id } = req.params;
    const allInvoice = await InvoiceSchema.find({ _id });
    if (allInvoice) {
      res.status(200).json({
        success: true,
        message: "all Project list below",
        InvoiceList: allInvoice,
      });
    } else {
      res.status(404)({
        success: false,
        message: "no Project found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllInvoiceByClientId = async (req, res) => {
  try {
    const clientId = req.params.cid;
    // console.log(clientId);
    const allInvoice = await InvoiceSchema.find({ "client.company": clientId });

    if (allInvoice) {
      res.status(200).json({
        success: true,
        message: "all Invoice list below1",
        InvoiceList: allInvoice,
      });
    } else {
      res.status(404)({
        success: false,
        message: "no Invoice found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  generateInvoice,
  genrateInvoiceController,
  getAllInvoice,
  getInvoicebyId,
  getAllInvoiceByClientId,
};
