module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'addm', {
      id:{
        field:"id",
        type:DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Type: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      publishers: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      version: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      fullVersion: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      fullVersionProvenance: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      hostname: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      hostOS: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      vendor: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      scannedVia: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      virtual: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    }, {
      schema: 'lic',
      timestamps: false,
      tableName: 'addm'
    });
};