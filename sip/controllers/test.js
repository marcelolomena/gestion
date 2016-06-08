var models = require('../models');

var log = function (inst) {
    console.dir(inst.get())
}

exports.test = function (req, res) {

    var subMenu = function (op, menu, callback) {
        return models.menu.findAll({
            where: { 'pid': menu.id }
        }).then(function (submenu) {
            var opt = {}
            opt["menu"] = op
            var subsub = []
            submenu.forEach(function (opcion) {
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
            var promises = []
            user.rols.forEach(function (rol) {

                rol.menus.forEach(function (menu) {
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
                //return Promise.all(compromisoPromises);
                callback(compromisoPromises);
            });

        } catch (e) {
            return callback(e);
        }
    }

    models.user.belongsToMany(models.rol, { foreignKey: 'uid', through: models.usrrol });
    models.rol.belongsToMany(models.user, { foreignKey: 'rid', through: models.usrrol });
    models.rol.belongsToMany(models.menu, { foreignKey: 'rid', through: models.rolfunc });
    models.menu.belongsToMany(models.rol, { foreignKey: 'mid', through: models.rolfunc });

    models.user.find({
        where: { 'uid': 1 },
        include: [
            {
                model: models.rol,
                include: [{ model: models.menu, where: { 'pid': { $eq: null } }, required: false }]
            }
        ]
    }).then(function (user) {
        var usuario = []
        var nombre = {}
        nombre["nombre"] = user.first_name + " " + user.last_name
        usuario.push(nombre)

        Menu(user, function (menu) {
            var menus = {}
            menus["menus"] = menu
            var toti = usuario.concat(menus);
            console.log(JSON.stringify(toti))
        });

    }).catch(function (err) {
        console.log("--------> " + err);
    });
}