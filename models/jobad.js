module.exports = (sequelize, DataTypes) => {
  const JobAd = sequelize.define('JobAd', {
    jobId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Generate UUID automatically
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('open', 'closed', 'expired'),
      defaultValue: 'open',
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },{ timestamps: true,paranoid:true,indexes: [
    {
      fields: ['title'], 
    },
    {
      fields: ['deletedAt'],
    }
  ],});

  JobAd.associate = (models) => {
    JobAd.belongsTo(models.Portal, {
      foreignKey: 'portalId',
      as: 'portal',
    });

    JobAd.hasMany(models.Document, {
      foreignKey: 'jobId', 
      as: 'documents',    
    });
  };

  return JobAd;
};
