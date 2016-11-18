/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('iniciativafecha', {
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
        model: 'iniciativaprograma',
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
    },
    comentario: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idtipofecha: {
      type: DataTypes.STRING,
      allowNull: true
    }    
  }, {
    schema: 'sip',timestamps: false,tableName: 'iniciativafecha'
  });
};
