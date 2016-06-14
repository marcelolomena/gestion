/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proyectosenvuelo', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codigoart: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estructuracui',
        key: 'id'
      }
    },
    cui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    porcentajeavance: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    fechainicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechapap: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechacierresap: {
      type: DataTypes.DATE,
      allowNull: true
    },
    uidlider: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    liderproyecto: {
      type: DataTypes.STRING,
      allowNull: true
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
    schema: 'sip',timestamps: false,tableName: 'proyectosenvuelo'
  });
};
