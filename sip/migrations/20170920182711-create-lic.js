'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('licencia', {
      id: {
        type:DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    idFabricante: {
        field:'idfabricante',
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'fabricante',
            key: 'id'
        }
    },
    idTipoInstalacion: {
        field:'idtipoinstalacion',
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'tipoInstalacion',
            key: 'id'
        }
    },
    idClasificacion: {
        field:'idclasificacion',
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'clasificacion',
            key: 'id'
        }
    },
    idTipoLicenciamiento: {
        field:'idtipolicenciamiento',
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'tipoLicenciamiento',
            key: 'id'
        }
    },
    licStock: {
        field:'licstock',
        type: DataTypes.INTEGER,
        allowNull: true
    },
    licDisponible: {
        field:'licdisponible',
        type: DataTypes.INTEGER,
        allowNull: true
    },
    idAlertaRenovacion: {
        field:'idalertarenovacion',
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'parametro',
            key: 'id'
        }
    },
    utilidad: {
        type: DataTypes.STRING,
        allowNull: true
    },
    comentarios: {
        type: DataTypes.STRING,
        allowNull: true
    },
    borrado: {
        type: DataTypes.STRING,
        allowNull: true
    },
    software: {
        type: DataTypes.STRING,
        allowNull: true
    }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('licencia');
  }
};