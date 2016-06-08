/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contrato', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tipocontrato: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipodocumento: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    solicitudcontrato: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idtiposolicitud: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tiposolicitud: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idestadosol: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estadosolicitud: {
      type: DataTypes.STRING,
      allowNull: true
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
        key: 'id'
      }
    },
    uidpmo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pmoresponsable: {
      type: DataTypes.STRING,
      allowNull: true
    },    
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'contrato'
  });
};
