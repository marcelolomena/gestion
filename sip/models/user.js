"use strict";
var bcrypt = require('bcryptjs');

module.exports = function (sequelize, DataTypes) {
	var User = sequelize.define('User', {
		uid: { primaryKey: true, type: DataTypes.INTEGER },
		uname: DataTypes.STRING,
		password: DataTypes.STRING,
		profile_image: DataTypes.STRING,
		first_name: DataTypes.STRING,
		last_name: DataTypes.STRING,
		division: DataTypes.INTEGER,
		gerencia: DataTypes.INTEGER,
		department: DataTypes.INTEGER,
		email: DataTypes.STRING,
		birth_date: DataTypes.DATE,
		office_number: DataTypes.STRING,
		joining_date: DataTypes.DATE,
		isadmin: DataTypes.INTEGER,
		isverify: DataTypes.INTEGER,
		verify_code: DataTypes.STRING,
		verify_date: DataTypes.DATE,
		status: DataTypes.INTEGER,
		added_date: DataTypes.DATE,
		rut_number: DataTypes.STRING,
		rate_hour: DataTypes.INTEGER,
		contact_number: DataTypes.STRING,
		user_type: DataTypes.INTEGER,
		work_hours: DataTypes.INTEGER,
		bonus_app: DataTypes.INTEGER,
		designation: DataTypes.INTEGER,
		user_profile: DataTypes.STRING
	}, { timestamps: false, tableName: 'art_user' }
	);

	return User
}