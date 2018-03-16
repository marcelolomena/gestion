/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clausulas', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idsolicitudcotizacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'solicitudcotizacion',
        key: 'id'
      }
    },
    idplantillaclausula: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'plantillaclausula',
        key: 'id'
      }
    },
    idcuerpoclausula: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cuerpoclausula',
        key: 'id'
      }
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: true
    },    
    glosa: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombreadjunto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipoadjunto: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'clausulas'
  });
};
