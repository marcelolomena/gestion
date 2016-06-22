/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('art_project_master', {
    pId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    project_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    program: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    project_mode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    project_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    project_manager: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    final_release_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    budget_approved: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    sap_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    total_sap: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    completion_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    budget_approved_contractor: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    budget_approved_hardware: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    budget_approved_software: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    ppm_number: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    work_flow_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    baseline: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    planned_hours: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'dbo', timestamps: false, tableName: 'art_project_master'
  });
};
