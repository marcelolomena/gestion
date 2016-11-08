/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('recursoshumanos$', {
    num_rut: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    dve: {
      type: DataTypes.STRING,
      allowNull: true
    },
    apellidos_colaborador: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre_colaborador: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sexo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosa_cargo_act: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cui: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    cod_division: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    glosa_division: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cod_area: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    glosa_area: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cod_departamento: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    glosa_departamento: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cod_seccion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    glosa_seccion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cod_unidad: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    glosa_unidad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rut_jefe: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    dv: {
      type: DataTypes.STRING,
      allowNull: true
    },
    apellidos_jefe: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre_jefe: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cargo_jefe: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email_jefe: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email_trab: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefono_trab: {
      type: DataTypes.STRING,
      allowNull: true
    },
    anexo_trab: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosa_empresa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosa_sucursal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    region: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    timestamps: false,tableName: 'RecursosHumanos$'
  });
};
