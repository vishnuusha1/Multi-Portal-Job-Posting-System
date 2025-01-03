const express = require("express");
const portalController=require('./controllers/portal.controller');
const fileUpload = require("../../middlewares/fileUpload");
const authGuard = require("../../middlewares/auth.guard");
const Responder = require("../../shared/responder");

const router = express.Router();

router.post('/', authGuard,(req, res, next) => {
    const responder = new Responder(req, res);
    fileUpload('logo')(req, res, (err) => {
      if (err) {
        return responder.error({ message: err.message || "Error occurred during file upload." });
      }
      next();
    });
  }, portalController.createPortal);
router.put('/:id',authGuard,(req, res, next) => {
  const responder = new Responder(req, res);
  fileUpload('logo')(req, res, (err) => {
    if (err) {
      responder.error({ message: err.message || "Error occurred during file upload." });
    }
    next();
  });
}, portalController.updatePortal)
router.delete('/:id',authGuard,portalController.deletePortal)
router.get('/',authGuard,portalController.getAllPortals)
router.get('/',authGuard,portalController.getPortalUsageSummary)


module.exports=router


