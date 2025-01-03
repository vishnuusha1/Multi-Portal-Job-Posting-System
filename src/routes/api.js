

const express = require("express");
const logger = require("../shared/logger");
const Responder = require("../shared/responder");
const portalRouter=require('../modules/portal')
const jobRouter=require('../modules/job');
const authRouter=require('../modules/auth')
const portlarController = require("../modules/portal/controllers/portal.controller");
const jobController=require("../modules/job/controller/job.controller")



const router = express.Router();

router.get("/", (req, res) => {
  logger.info("API is working.....");
  const responder = new Responder(req, res);
  responder.success("API Route is working..", "OK");
});
 
router.get("/portal-usage-summary", portlarController.getPortalUsageSummary);
router.get("/jobad-summary/:timeframe", jobController.getJobAddSummary);

router.use('/auth',authRouter)
router.use('/portal',portalRouter)
router.use('/jobs',jobRouter)


module.exports = router; 
