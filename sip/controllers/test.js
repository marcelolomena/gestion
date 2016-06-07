var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

var log = function (inst) {
    console.dir(inst.get())
}

exports.test = function (req, res) {

    /*
        var subMenu = function (op, menu, callback) {
            return models.Menu.findAll({
                where: { 'pid': menu.id }
            }).then(function (submenu) {
                var opt = {}
                opt["menu"] = op
                var subsub = []
                submenu.forEach(function (opcion) {
                    //console.log("opcion-------------> " + opcion.descripcion)
                    subsub.push({ [opcion.id]: opcion.descripcion })
                });
                opt["submenu"] = subsub
                callback(opt)
            }).catch(function (err) {
                console.log("--------> " + err);
            });
        }
    */
    /*
        var Menu = function (user, callback) {
            try {
                var nombre = {}
                nombre["nombre"] = user.first_name + " " + user.last_name
                user.Rols.forEach(function (rol) {
                    rol.Menus.forEach(function (menu) {
                        //console.log("menu-------------> " + menu.id + " , " + menu.descripcion)
                        var item = {}
                        item["id"] = menu.id
                        item["menu"] = menu.descripcion;
    
                        subMenu(item, menu, function (submenu) {
                            callback(submenu)
                        });
                    });
                });
             } catch (e) {
                return callback(e);
            }
        }
    */

    var subMenu = function (op, menu, callback) {
        return models.Menu.findAll({
            where: { 'pid': menu.id }
        }).then(function (submenu) {
            var opt = {}
            opt["menu"] = op
            var subsub = []
            submenu.forEach(function (opcion) {
                //console.log("opcion-------------> " + opcion.descripcion)
                subsub.push({ [opcion.id]: opcion.descripcion })
            });
            opt["submenu"] = subsub
            callback(opt)
        }).catch(function (err) {
            console.log("--------> " + err);
        });
    }

    var Menu = function (user, callback) {
        try {
            var nombre = {}
            nombre["nombre"] = user.first_name + " " + user.last_name
            var promises = []
            user.Rols.forEach(function (rol) {

                rol.Menus.forEach(function (menu) {
                    //console.log("menu-------------> " + menu.id + " , " + menu.descripcion)

                    var item = {}
                    item["id"] = menu.id
                    item["menu"] = menu.descripcion;

                    var promise = new Promise(function (resolve, reject) {
                        subMenu(item, menu, function (submenu) {
                            resolve(submenu);
                        });
                    });
                    promises.push(promise);
                });
            });

            return Promise.all(promises).then(function (compromisos) {
                var compromisoPromises = [];
                for (var i = 0; i < compromisos.length; i++) {
                    compromisoPromises.push(compromisos[i]);
                }
                console.dir(compromisoPromises)
                return Promise.all(compromisoPromises);
            });

        } catch (e) {
            return callback(e);
        }
    }

    models.User.belongsToMany(models.Rol, { foreignKey: 'uid', through: models.UsrRol });
    models.Rol.belongsToMany(models.User, { foreignKey: 'rid', through: models.UsrRol });
    models.Rol.belongsToMany(models.Menu, { foreignKey: 'rid', through: models.RolFunc });
    models.Menu.belongsToMany(models.Rol, { foreignKey: 'mid', through: models.RolFunc });

    models.User.find({
        where: { 'uid': 1 },
        include: [
            {
                model: models.Rol,
                include: [{ model: models.Menu, where: { 'pid': { $eq: null } }, required: false }]
            }
        ]
    }).then(function (user) {
        console.log("usuario-------------> " + user.uname)

        Menu(user, function (menu) {
            console.log("pico " + menu)
            //console.dir(menu)
            //console.log(JSON.stringify(submenu))
        });


    }).catch(function (err) {
        console.log("--------> " + err);
    });
}