module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    docId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Generate UUID automatically
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING, // 'pdf', 'docx', etc.
      allowNull: false,
    },
    jobId: {
      type: DataTypes.UUID, 
      allowNull: false,
    },
    portalId: {
      type: DataTypes.UUID, 
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },{ timestamps: true,paranoid:true,indexes: [
    {
      fields: ['deletedAt'], 
    }
  ]});

  Document.associate = (models) => {
    Document.belongsTo(models.JobAd, {
      foreignKey: 'jobId',
      as: 'jobAd',
    });

    Document.belongsTo(models.Portal, {
      foreignKey: 'portalId',
      as: 'portal',
    });
  };

  return Document;
};
