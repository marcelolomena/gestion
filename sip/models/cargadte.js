/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cargadte', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    horainicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    horafin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'art_user',
        key: 'uid'
      }
    },
    archivo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idfactura: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'factura',
        key: 'id'
      }
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'cargadte'
  });
};
