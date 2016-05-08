/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('iniciativaprograma', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idiniciativa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'iniciativa',
        key: 'id'
      }
    },
    codigoart: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idestado: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'parametro',
        key: 'id'
      }
    },
    fechacreacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'art_program',
        key: 'program_id'
      }
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'iniciativaprograma'
  });
};
