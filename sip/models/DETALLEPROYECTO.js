/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DETALLEPROYECTO', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idproyecto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'PROYECTO',
        key: 'id'
      }
    },
    numerotarea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombretarea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechacreacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechainicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechacierre: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cui: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idcuentacontable: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'DETALLEPROYECTO'
  });
};
