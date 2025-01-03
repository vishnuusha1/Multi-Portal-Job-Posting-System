const express = require("express");
const jobAdController=require('./controller/job.controller');
const { FileTypeConfig } = require("../../enums");
const documentController=require('../document/controller/document.controller');
const fileUpload = require("../../middlewares/fileUpload");
const Responder = require("../../shared/responder");

const router = express.Router();

router.post('/',jobAdController.createJobAd)
router.post('/:id/documents/:portalId', (req, res, next) => {
    fileUpload(FileTypeConfig.DOCUMENT)(req, res, (err) => {
    const responder = new Responder(req, res);
        
      if (err) {
        return responder.error(err.message || "Error occurred during file upload.");
      }
      next();
    });
  }, documentController.uploadJobDocument);

router.put('/:id',jobAdController.updateJobAd)
router.delete('/:id',jobAdController.deleteJobAd)
router.get('/',jobAdController.getAllJobAds)

module.exports=router


