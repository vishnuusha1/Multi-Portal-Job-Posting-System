'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Portals', {
      portalId: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      status: {
       type: Sequelize.ENUM('active', 'inactive', 'suspended'),
       defaultValue: 'active'
      },
      logo: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue:Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue:Sequelize.NOW
      },
      deletedAt: { 
        type: Sequelize.DATE,
        allowNull: true
      }
     
    });

    await queryInterface.addIndex('Portals', ['name']);

    await queryInterface.addIndex('Portals', ['deletedAt']);

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Portals');
  }
};