/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('iniciativaprograma', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idiniciativa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'iniciativa',
        key: 'id'
      }
    },
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'art_program',
        key: 'program_id'
      }
    },
    codigoart: {
      type: DataTypes.INTEGER,
      allowNull: true
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
      allowNull: true
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
      allowNull: true,
      references: {
        model: 'parametro',
        key: 'id'
      }
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
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechacreacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    subcategoria: {
      type: DataTypes.STRING,
      allowNull: true
    },
    duracionprevista: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pptoestimadoprevisto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    mesinicioprevisto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    anoinicioprevisto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pptoaprobadogasto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    pptoaprobadoinversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    pptoaprobadoprevisto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    pptoaprobadodolares: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    idetapa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'parametro',
        key: 'id'
      }
    },
  }, {
      schema: 'sip', timestamps: false, tableName: 'iniciativaprograma'
    });
};
