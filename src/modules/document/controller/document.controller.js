const logger = require("../../../shared/logger");
const Responder = require("../../../shared/responder");
const jobAdService = require("../../job/service/job.service");
const portalService = require("../../portal/services/portal.service");
const documentService = require("../service/document.service");

  /**
   * Upload a document to a job for a specific portal.
   *
   * The document is stored in the "uploads/documents" directory.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   *
   * @returns {Promise} - A promise which resolves to a DocumentResponse object
   *   containing the created document.
   */
const uploadJobDocument = async (req, res) => {
    const responder = new Responder(req, res);
    const { id: jobId, portalId } = req.params;
  
    if (!req.file) return responder.error("No document uploaded");
  
    try {
      const [job, portal] = await Promise.all([
        jobAdService.findByPk(jobId),
        portalService.findByPk(portalId),
      ]);
  
      if (!job) return responder.error("Job not found");
      if (!portal) return responder.error("Portal not found");
  
      const { originalname, path: filePath, mimetype, size: fileSize } = req.file;
      const fileType = mimetype.split("/")[1];  // Extract file type (pdf, docx, etc.)
  
      const document = await documentService.create({
        jobId,
        portalId,
        fileName: originalname,
        filePath,
        fileType,
        fileSize,
      });
  
      return responder.success(document);
    } catch (err) {
      console.log(err)
      //logger.error(err.message);
      return responder.error("Error uploading document");
    }
  };
  

module.exports = { uploadJobDocument };
