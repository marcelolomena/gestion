/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('art_sub_task', {
    sub_task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
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
    actual_start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    actual_end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    added_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    completion_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '((0.00))'
    },
    task_complete: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((0))'
    },
    sub_task_depend: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    dependencies_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    catalogue_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    actual_end_date_final: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'art_sub_task'
  });
};
