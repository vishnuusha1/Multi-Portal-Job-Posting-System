'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Documents', {
      docId: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      fileName: {
        type: Sequelize.STRING
      },
      filePath: {
        type: Sequelize.STRING
      },
      fileType: {
        type: Sequelize.STRING
      },
      fileSize: {
        type: Sequelize.INTEGER
      },
      jobId: {
        type: Sequelize.UUID
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
    await queryInterface.addIndex('Documents', ['deletedAt']);

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Documents');
  }
};