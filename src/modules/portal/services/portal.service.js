const baseService = require("@services/baseService");
const db = require("../../../../models");
const logger = require("../../../shared/logger");

const Portal = db.Portal;

const portalService = baseService(Portal);

/**
 * Fetches all portals with usage data, including the number of jobs posted
 * and documents uploaded to each portal.
 *
 * @returns {Promise<Array<Portal>>} List of portals with usage data
 * @throws {Error} If database query fails
 */
portalService.portalsWithUsage = async () => {
  try {
    const portalsWithUsage = await db.Portal.findAll({
      attributes: [
        "portalId",
        "name",
        [
          db.sequelize.fn("COUNT", db.sequelize.col("jobAds.jobId")),
          "jobsPosted",
        ],
        [
          db.sequelize.fn("COUNT", db.sequelize.col("documents.docId")),
          "documentsUploaded",
        ],
      ],
      include: [
        {
          model: db.JobAd,
          as: "jobAds",
          attributes: [],
          required: false,
        },
        {
          model: db.Document,
          as: "documents",
          attributes: [],
          required: false,
        },
      ],
      group: ["Portal.portalId", "Portal.name"],
    });
    return portalsWithUsage;
  } catch (error) {
    logger.error(error.message)
    throw error;
  }
};

module.exports = portalService;
