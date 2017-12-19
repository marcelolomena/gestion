module.exports = function (sequelize, DataTypes) {
  return sequelize.define('instalacion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idUsuario: {
      field: 'idusuario',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'art_user',
        key: 'id'
      }
    },
    fechaSolicitud: {
      field: 'fechasolicitud',
      type: DataTypes.DATE,
      allowNull: true
    },
    idProducto: {
      field: 'idproducto',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'producto',
        key: 'id'
      }
    },
    codAutorizacion: {
      field: 'codautorizacion',
      type: DataTypes.STRING,
      allowNull: true
    },
    informacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechaInstalacion: {
      field: 'fechainstalacion',
      type: DataTypes.DATE,
      allowNull: true
    },
    instalador: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idTipoInstalacion: {
      field: 'idtipoinstalacion',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipoinstalacion',
        key: 'id'
      }
    },
    fechaVisacion: {
      field: 'fechavisacion',
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaModificacion: {
      field: 'fechamodificacion',
      type: DataTypes.DATE,
      allowNull: true
    },
    comentariovisiacion: {
      field: 'comentarioVisiacion',
      type: DataTypes.STRING,
      allowNull: true
    },
    comentarioinstalacion: {
      field: 'comentarioInstalacion',
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'lic',
    timestamps: false,
    tableName: 'instalacion'
  });
};