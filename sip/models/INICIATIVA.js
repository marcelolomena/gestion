/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Iniciativa', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    codigoart: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombreproyecto: {
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
      allowNull: true
    },
    gerenteresponsable: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idpmo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'PMO',
        key: 'id'
      }
    },
    pmoresponsable: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idtipo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'TIPOINICIATIVA',
        key: 'id'
      }
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idcategoria: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'CATEGORIA',
        key: 'id'
      }
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
    pptoestimadousd: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
      timestamps: false, tableName: 'INICIATIVA'
    });
};
