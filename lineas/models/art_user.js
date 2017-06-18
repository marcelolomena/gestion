/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user', {
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    division: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    gerencia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    department: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    office_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    joining_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isadmin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isverify: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    verify_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    verify_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '((1))'
    },
    added_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    rut_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rate_hour: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contact_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    work_hours: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    bonus_app: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    designation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    user_profile: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
      schema: 'dbo', timestamps: false, tableName: 'art_user'
    });
};
