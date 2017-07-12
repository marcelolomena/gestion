/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detallecompromiso', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    iddetalleserviciocto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'detalleserviciocto',
        key: 'id'
      }
    },
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    valorcuota: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montoorigen: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    costoorigen: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    costopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estadopago: {
      type: DataTypes.STRING,
      allowNull: true
    },
    saldopago: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    }    
  }, {
    schema: 'sip',timestamps: false,tableName: 'detallecompromiso'
  });
};
