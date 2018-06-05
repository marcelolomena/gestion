/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('solicitudcotizacion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estructuracui',
        key: 'id'
      }
    },
    idtecnico: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    tipocontrato: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'programa',
        key: 'program_id'
      }
    },
    codigoart: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codigosolicitud: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idclasificacionsolicitud: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'valores',
        key: 'id'
      }
    },
    idnegociador: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    correonegociador: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fononegociador: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    direccionnegociador: {
      type: DataTypes.STRING,
      allowNull: true
    },
    numerorfp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fechaenviorfp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    nombreinterlocutor1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    correointerlocutor1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fonointerlocutor1: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    nombreinterlocutor2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    correointerlocutor2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fonointerlocutor2: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idtipo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipoclausula',
        key: 'id'
      }
    },
    idgrupo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'valores',
        key: 'id'
      }
    },
    colorestado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idestado: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'valores',
        key: 'id'
      }
    },
    idadministracion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    fechaasignacionadmin: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
      schema: 'sic', timestamps: false, tableName: 'solicitudcotizacion'
    });
};
