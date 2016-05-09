/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RecursosHumanos', {
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    numRut: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dve: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sexo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codCargoAct: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaCargoAct: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    centroCosto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    codUni9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    codDivision: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaDivision: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codArea: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaArea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codDepartamento: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaDepartamento: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codZona: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    zona: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codSeccion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaSeccion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    unidadCuipr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaUnidad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nivelFunc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fechaNacim: {
      type: DataTypes.DATE,
      allowNull: true
    },
    edadAgno: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mesesAgno: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecIngreso: {
      type: DataTypes.DATE,
      allowNull: true
    },
    antiguedadAgno: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    antiguedadMes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecReconocimiento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    antAgnoReconoci: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    antMesReconoci: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sindicato: {
      type: DataTypes.STRING,
      allowNull: true
    },
    art346: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipoRenta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipoRentaOld: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codNegocia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    proNegoc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    timbra: {
      type: DataTypes.STRING,
      allowNull: true
    },
    turno: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jornada: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipoContrato: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rentaBrutaContr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rentaLiqContr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sueldoBase: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    porcentGrati: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    asignaCasa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    asignacCasaUf: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalHaberes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rentaBrutaTot: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rentaLiqTotal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    heTotalMinExt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    heValorMes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    heMinRetro: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    heValorRetro: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    heInformadas: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    codSucursal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaSucursal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    region: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    codOrigen: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaOrigen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosaOrigenExt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaEmpresa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rutJefe: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dv: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombreJefe: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cargoJefe: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailJefe: {
      type: DataTypes.STRING,
      allowNull: true
    },
    convenio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rutConsultor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailTrab: {
      type: DataTypes.STRING,
      allowNull: true
    },
    anexoTrab: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefonoTrab: {
      type: DataTypes.STRING,
      allowNull: true
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: true
    },
    apellidoJefe: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'RecursosHumanos'
  });
};
