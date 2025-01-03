

const baseService = require("@services/baseService");
const db = require("@models");
const logger = require("@logger");
const { Op } = require("sequelize");

const JobAd = db.JobAd;

const jobAdService=baseService(JobAd)

  /**
   * Retrieve a summary of job ads for the given timeframe.
   * 
   * The summary will include the total number of job ads, the number of active job ads, 
   * and the number of closed job ads for each portal.
   * 
   * @param {string} timeframe - The timeframe for the summary. Can be 'year', 'month', or 'week'.
   * @param {string} startDate - The start date of the timeframe.
   * @param {string} endDate - The end date of the timeframe.
   * 
   * @returns {Promise<Array<Object>>} - A promise that resolves to an array of objects with the following properties:
   *  - portalId {string}
   *  - name {string}
   *  - total_jobs {integer}
   *  - active_jobs {integer}
   *  - closed_jobs {integer}
   */
jobAdService.jobAdSummary = async (timeframe,startDate,endDate) => {
    try {
      const results = await JobAd.findAll({
        attributes: [
          'Portal.portalId', 
          'Portal.name', 
          [db.sequelize.fn('COUNT', db.sequelize.col('JobAd.jobId')), 'total_jobs'],
          [
            db.sequelize.fn(
              'SUM',
              db.sequelize.literal("CASE WHEN JobAd.status = 'active' THEN 1 ELSE 0 END")
            ),
            'active_jobs'
          ],
          [
            db.sequelize.fn(
              'SUM',
              db.sequelize.literal("CASE WHEN JobAd.status = 'closed' THEN 1 ELSE 0 END")
            ),
            'closed_jobs'
          ]
        ],
        include: [
          {
            model: db.Portal,
            as:'portal',
            attributes: []
          }
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        },
        group: ['Portal.portalId', 'Portal.name'],
        raw:true
      });

  return results
    
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };
  

module.exports=jobAdService;