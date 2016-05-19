/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Contrato', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tipocontrato: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipooc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    solicitudcontrato: {
      type: DataTypes.STRING,
      allowNull: true
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    anexo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idestadosol: {
      type: DataTypes.INTEGER,
      allowNull: true
    },    
    solicitudcontratoes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Proveedor',
        key: 'id'
      }
    },
    uidpmo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    codigoart: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fechainicontrato: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechatercontrato: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechacontrol: {
      type: DataTypes.DATE,
      allowNull: true
    },
    meses: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idestadocto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },    
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idplazocontrato: {
      type: DataTypes.INTEGER,
      allowNull: true
    },     
    plazocontrato: {
      type: DataTypes.STRING,
      allowNull: true
    },
    montototal: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    idcondicion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },    
    condicionnegociacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idfrecuencia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },       
    frecuenciafacturacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'contrato'
  });
};
