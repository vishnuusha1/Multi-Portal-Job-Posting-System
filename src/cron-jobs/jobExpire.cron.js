const cron = require('node-cron');
const moment = require('moment');
const { Op } = require('sequelize');
const db = require('../../models');

// Function to update job statuses
const updateJobStatuses = async () => {
  try {
    const twoMonthsAgo = moment().subtract(2, 'months').toDate();

    // Update the status of jobs that were last updated more than 2 months ago
    const updatedRows = await db.JobAd.update(
      { status: 'open' },
      {
        where: {
          updatedAt: { [Op.lt]: twoMonthsAgo },
          status: { [Op.ne]: 'expired' }
        }
      }
    );

    console.log(`Cron Job: Updated ${updatedRows[0]} jobs to 'expired' status.`);
  } catch (error) {
    console.error('Cron Job Error:', error);
  }
};

// Schedule the cron job to run every 10 seconds
const startCronJob = () => {
  cron.schedule('0 23 * * *', () => {
    console.log('Running Cron Job for job status updates every 11 pm');
    updateJobStatuses();
  });
};

module.exports = startCronJob;
