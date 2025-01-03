const Responder = require("@shared/responder");
const logger = require("@logger");
const jobAdService = require("../service/job.service");
const buildQueryOptions = require("@shared/buildQueryParams");
const { Op } = require("sequelize");
const db = require("@models");
const moment = require("moment");

/**
 * @api {post} /jobs Create a new job ad
 * @apiName createJobAd
 * @apiGroup Job Ads
 * @apiParam {String} title Title of the job ad
 * @apiParam {String} description Description of the job ad
 * @apiParam {File} file File for the job ad
 * @apiParam {String} portalId ID of the portal where the job ad is being created
 *
 * @apiSuccess {Object} JobAd Created job ad object
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError {Object} 500 Something went wrong when creating the job ad
 */
const createJobAd = async (req, res) => {
  const responder = new Responder(req, res);
  try {
    const { title, description, file, portalId } = req.body;
    const newJobAd = await jobAdService.create({
      title,
      description,
      file,
      portalId,
    });
   return responder.success(newJobAd);
  } catch (error) {
    logger.log(error.message);
    return responder.error();
  }
};

/**
 * @api {put} /jobs/:id Update a job ad
 * @apiName updateJobAd
 * @apiGroup Job Ads
 * @apiParam {String} id ID of the job ad to update
 * @apiParam {String} title Title of the job ad
 * @apiParam {String} description Description of the job ad
 * @apiParam {File} file File for the job ad
 * @apiParam {String} portalId ID of the portal where the job ad is being updated
 * @apiParam {String} status Status of the job ad
 *
 * @apiSuccess {Object} JobAd Updated job ad object
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError {Object} 404 JobAd not found
 * @apiError {Object} 500 Something went wrong when updating the job ad
 */
const updateJobAd = async (req, res) => {
  const responder = new Responder(req, res);
  try {
    const { id } = req.params;
    const { title, description, file, portalId, status } = req.body;
    const [updatedRows, [updatedJobAd]] = await jobAdService.update(
      { title, description, file, portalId, status },
      { jobId: id }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "JobAd not found" });
    }
    responder.success(updatedJobAd);
  } catch (error) {
    console.log(error);
    // logger.log(error.message);
    responder.error();
  }
};

/**
 * @api {delete} /jobs/:id Delete a job ad
 * @apiName deleteJobAd
 * @apiGroup Job Ads
 * @apiParam {String} id ID of the job ad to delete
 *
 * @apiSuccess {Object} 204
 * @apiError {Object} 404 JobAd not found
 * @apiError {Object} 500 Something went wrong when deleting the job ad
 */
const deleteJobAd = async (req, res) => {
  const responder = new Responder(req, res);
  try {
    const { id } = req.params;
    const deletedRows = await jobAdService.delete({ jobId:id });

    if (deletedRows === 0) {
      responder.error("JobAd not found", null, 404);
    }
    return responder.success();
  } catch (error) {
    logger.log(error.message);
    return responder.error();
  }
};

/**
 * @api {get} /jobs Get all job ads
 * @apiName getAllJobAds
 * @apiGroup Job Ads
 * @apiParam {String} [search] Search term to filter job ad title
 * @apiUse pagination
 *
 * @apiSuccess {Object} JobAds List of job ads with applied filters and pagination
 * @apiError {Object} 500 Something went wrong when getting the job ads
 */
const getAllJobAds = async (req, res) => {
  const responder = new Responder(req, res);
  try {
    const { search, ...queryOptions } = buildQueryOptions(req.query);
    const JobAds = await jobAdService.findAndCount({
      where: {
        [Op.or]: {
          title: { [Op.like]: `%${search}%` },
        },
      },
      ...queryOptions,
      include: [{ model: db.Portal, as: "portal", attributes: ["name"] }],
    });
    return responder.success(JobAds);
  } catch (error) {
    logger.error(error.message);
    return responder.error();
  }
};

/**
 * @api {get} /jobs/summary/:timeframe Get job ad summary for the given timeframe
 * @apiName getJobAddSummary
 * @apiGroup Job Ads
 * @apiParam {String} timeframe The timeframe for the summary. Can be 'year', 'month', or 'week'.
 * 
 * @apiSuccess {Object} A JSON object with the following properties:
 *  - timeframe {string} The timeframe used for the summary
 *  - period_start {string} The start date of the period
 *  - period_end {string} The end date of the period
 *  - summary {Object[]} An array containing summary data
 *    - total_jobs {integer} Total number of jobs
 *    - active_jobs {integer} Number of active jobs
 *    - closed_jobs {integer} Number of closed jobs
 *
 * @apiError {Object} 400 Invalid timeframe. Use 'year', 'month', or 'week'.
 * @apiError {Object} 500 Something went wrong when getting the job ads
 */
const getJobAddSummary = async (req, res) => {
  const responder = new Responder(req, res);
  const { timeframe } = req.params;
  let startDate, endDate;
  if (!["year", "month", "week"].includes(timeframe)) {
    return res
      .status(400)
      .json({ error: "Invalid timeframe. Use 'year', 'month', or 'week'." });
  }

  const now = moment();
  if (timeframe === "year") {
    startDate = now.startOf("year").format("YYYY-MM-DD");
    endDate = now.endOf("year").format("YYYY-MM-DD");
  } else if (timeframe === "month") {
    startDate = now.startOf("month").format("YYYY-MM-DD");
    endDate = now.endOf("month").format("YYYY-MM-DD");
  } else if (timeframe === "week") {
    startDate = now.startOf("week").format("YYYY-MM-DD");
    endDate = now.endOf("week").format("YYYY-MM-DD");
  }
  const summary=
    await jobAdService.jobAdSummary(timeframe, startDate, endDate);
  const results = {
    timeframe,
    period_start: startDate,
    period_end: endDate,
    summary
  };
  return responder.success(results);
};

module.exports = {
  createJobAd,
  updateJobAd,
  deleteJobAd,
  getAllJobAds,
  getJobAddSummary,
};
