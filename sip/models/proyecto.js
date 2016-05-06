/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proyecto', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    codigoart: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombreproyecto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idpmo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pmo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechacreacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechavigencia: {
      type: DataTypes.DATE,
      allowNull: true
    },
    avance: {
      type: 'NUMERIC',
      allowNull: true
    },
    fechaultpago: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechapap: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pregasto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    preinversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    realgasto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    realinversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    compgasto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    compinversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    observacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    uidpmo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    presupuestogasto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    presupuestoinversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    comprometidogasto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    comprometidoinversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    saldogasto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    saldoinversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'proyecto'
  });
};
