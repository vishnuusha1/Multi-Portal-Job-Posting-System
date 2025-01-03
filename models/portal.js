module.exports = (sequelize, DataTypes) => {
  const Portal = sequelize.define('Portal', {
    portalId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Generate UUID automatically
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active',
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING, 
      allowNull: true, 
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },{ timestamps: true,paranoid:true,indexes: [
    {
      fields: ['name'],
    },
    {
      fields: ['deletedAt'],
    }
  ],});

  Portal.associate = (models) => {
    Portal.hasMany(models.JobAd, {
      foreignKey: 'portalId',
      as: 'jobAds',
    });

    Portal.hasMany(models.Document, {
      foreignKey: 'portalId',  
      as: 'documents',       
    });
  };


  return Portal;
};
