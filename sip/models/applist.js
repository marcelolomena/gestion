module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        'applist$', {
      id:{
        field:"id",
        type:DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      traduccion: {
        field: "Traduccion",
        type: DataTypes.STRING(255),
      },
      aplicacion: {
        field:'aplicacion',
        type: DataTypes.STRING(255)
      },
      fabricante: {
        field:'Fabricante',
        type: DataTypes.STRING(255)
      },
      categoria: {
        field:'Categoria',
        type: DataTypes.STRING(255)
      },
      instalaciones: {
        field:'Instalaciones',
        type: DataTypes.INTEGER
      },
      usuarios: {
        field:'Usuarios',
        type: DataTypes.INTEGER
      },
      licencia: {
        field:'Licencia',
        type: DataTypes.STRING(255)
      },
      formlicencia: {
        field:'FormularioLicencia',
        type: DataTypes.STRING(255)
      },
      paquete: {
        field:'Paquete',
        type: DataTypes.STRING(255)
      }
    }, {
      schema: 'lic',timestamps: false,tableName: 'applist$'
    });
  };
  