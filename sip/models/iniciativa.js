/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Iniciativa', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    iddivision: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    divisionsponsor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    uidsponsor1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sponsor1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    uidsponsor2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sponsor2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    uidgerente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'art_user',
        key: 'uid'
      }
    },
    gerenteresponsable: {
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
    idtipo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idcategoria: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    anoq: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    q1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    q2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    q3: {
      type: DataTypes.STRING,
      allowNull: true
    },
    q4: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechacomite: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'moneda',
        key: 'id'
      }
    },
    pptoestimadogasto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    pptoestimadoinversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    idestado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'iniciativa'
  });
};
