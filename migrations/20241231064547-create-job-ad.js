'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JobAds', {
      jobId: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      status: {
        type:Sequelize.ENUM('open','closed','expired'),
        defaultValue: 'open'
      },
      file: {
        type: Sequelize.STRING
      },
      portalId: {
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.NOW
      },
      deletedAt: { 
        type: Sequelize.DATE,
        allowNull: true
      }
    });
    await queryInterface.addIndex('JobAds', ['title']);

    await queryInterface.addIndex('JobAds', ['deletedAt']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('JobAds');
  }
};