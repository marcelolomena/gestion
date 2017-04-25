/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('flujocotizacion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    
    idcotizacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cotizacionservicio',
        key: 'id'
      }
    },
    
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaitem: {
      type: DataTypes.STRING,
      allowNull: true
    },
    costoorigen: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
      schema: 'sic', timestamps: false, tableName: 'flujocotizacion'
    });
};
