/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('IniciativaFecha', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idiniciativaprograma: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'IniciativaPrograma',
        key: 'id'
      }
    },
    tipofecha: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'iniciativafecha'
  });
};
