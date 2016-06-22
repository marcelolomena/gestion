/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('art_task', {
    tId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    task_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    task_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    plan_start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    plan_end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    task_description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    plan_time: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '((0.00))'
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    task_status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((0))'
    },
    task_discipline: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    completion_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    },
    task_depend: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    dependencies_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    stage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    user_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    deliverable: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    task_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((0))'
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'dbo', timestamps: false, tableName: 'art_task'
  });
};
