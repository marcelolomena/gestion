var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var log = function (inst) {
    console.dir(inst.get())
}

exports.test = function (req, res) {

    var Menu = function (id, desc, callback) {
        var opt = [];
        var item = {}
        item["menu"] = desc;
        opt.push(item);

        try {
            return models.Menu.findAll({
                where: { 'pid': id }
            }).then(function (submenu) {
                var sub = []
                submenu.forEach(function (opcion) {
                    //console.log("opcion-------------> " + opcion.descripcion)
                    sub.push({ [opcion.id]: opcion.descripcion })
                });
                opt.push(sub);
                callback(opt)
            }).catch(function (err) {
                console.log("--------> " + err);
            });
        } catch (e) {
            return callback(e);
        }
    }

    var subMenu = function (op, menu, callback) {
        return models.Menu.findAll({
            where: { 'pid': menu.id }
        }).then(function (submenu) {
            var sub = []
            var subsub = []
            sub.push(op)
            submenu.forEach(function (opcion) {
                //console.log("opcion-------------> " + opcion.descripcion)
                subsub.push({ [opcion.id]: opcion.descripcion })
            });
            sub.push(subsub)
            //opt.push(sub);
            callback(sub)
        }).catch(function (err) {
            console.log("--------> " + err);
        });
    }

    var SuperMenu = function (user, callback) {
        var opt = [];
        var tot = [];
        try {
            var i = 0
            var nombre = {}
            nombre["nombre"] = user.first_name + " " + user.last_name
            tot[0] = nombre
            //console.dir(tot)
            user.Rols.forEach(function (rol) {
                //console.log("Rol-------------> " + rol.glosarol)

                rol.Menus.forEach(function (menu) {
                    //console.log("menu-------------> " + menu.id + " , " + menu.descripcion)
                    var item = {}
                    item["id"] = menu.id
                    item["menu"] = menu.descripcion;

                    subMenu(item, menu, function (submenu) {
                        //console.dir(submenu)
                        //opt.push( submenu );
                        callback(submenu)
                    });

                });
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
        SuperMenu(user, function (submenu) {
            console.dir(submenu)
        });
        /*
                user.Rols.forEach(function (rol) {
                    //console.log("Rol-------------> " + rol.glosarol)
                    rol.Menus.forEach(function (menu) {
                        //console.log("menu-------------> " + menu.id + " , " + menu.descripcion)
                        Menu(menu.id, menu.descripcion, function (submenu) {
                            console.dir(submenu)
                        });
                    });
                });
        */
    }).catch(function (err) {
        console.log("--------> " + err);
    });

}