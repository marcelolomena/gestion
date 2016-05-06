/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('art_program', {
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    program_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    program_sub_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    program_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    program_code: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    projects_numbers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    system_code: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '((0.00))'
    },
    internal_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    pLevel: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    program_description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    work_flow_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    internal_state: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    demand_management_status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    demand_manager: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    program_manager: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    devison: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    management: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    department: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    impact_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    business_line: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    sap_code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_sap: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    completion_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '((0.00))'
    },
    state_gantt: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    initiation_planned_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    end_planned_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    baseline_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    clossing_date_gantt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    actual_release_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    closure_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    last_action_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    release_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    planned_hours: {
      type: 'NUMERIC',
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((1))'
    },
    estimated_cost: {
      type: 'NUMERIC',
      allowNull: true
    }
  }, {
    timestamps: false,tableName: 'art_program'
  });
};
