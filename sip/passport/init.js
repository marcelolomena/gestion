var login = require('./login');
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var co = require('co');

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        done(null, user.uid);
    });

    passport.deserializeUser(function (id, done) {

        var NeoSubMenu = function (op, user, menu, callback) {
            var sql_submenu = `
                        select distinct e.id,e.descripcion,e.url from art_user a
                        join sip.usr_rol b on a.uid = b.uid
                        join sip.rol c on b.rid = c.id
                        join sip.rol_func d on d.rid = c.id
                        join sip.menu e on e.id = d.mid
                        where a.uid=:uid and pid=:pid
                      `
            sequelize.query(sql_submenu,
                {
                    replacements: { uid: user.uid, pid: menu.id },
                    type: sequelize.QueryTypes.SELECT
                }
            ).then(function (submenu) {
                var opt = {}
                opt["menu"] = op
                var subsub = []

                submenu.forEach(function (subopcion) {
                    subsub.push({ "opt": subopcion.descripcion, "url": subopcion.url })
                });
                opt["submenu"] = subsub
                callback(undefined, opt)

            }).catch(function (err) {
                callback(err, undefined)
            });

        }

        var NeoMenu = function (user, callback) {
            var promises = []
            var sql_menu = `
                        select distinct e.id,e.descripcion from art_user a
                        join sip.usr_rol b on a.uid = b.uid
                        join sip.rol c on b.rid = c.id
                        join sip.rol_func d on d.rid = c.id
                        join sip.menu e on e.id = d.mid
                        where a.uid=:uid and pid is null
                      `
            co(function* () {

                var menu = yield sequelize.query(sql_menu,
                    {
                        replacements: { uid: user.uid },
                        type: sequelize.QueryTypes.SELECT
                    }
                ).catch(function (err) {
                    console.log(err)
                    callback(err, 'undefined');
                });
                var todo = []
                menu.forEach(function (menu) {
                    var item = {}
                    item["id"] = menu.id
                    item["menu"] = menu.descripcion

                    var promise = new Promise(function (resolve, reject) {
                        NeoSubMenu(item, user, menu, function (err, submenu) {
                            if (submenu)
                                resolve(submenu);
                            else
                                reject(err)
                        });
                    });
                    promises.push(promise);
                });

                return Promise.all(promises).then(function (items) {
                    var menuPromises = [];
                    for (var i = 0; i < items.length; i++) {
                        menuPromises.push(items[i]);
                    }

                    callback(menuPromises);
                });

            }).catch(function (err) {
                callback(err, 'undefined');
                console.log(err);
            });

        }

        /*
                var subMenu = function(op, menu, callback) {
                    return models.menu.findAll({
                        where: { 'pid': menu.id }
                    }).then(function(submenu) {
                        var opt = {}
                        opt["menu"] = op
                        var subsub = []
                        submenu.forEach(function(opcion) {
                            subsub.push({ "opt": opcion.descripcion, "url": opcion.url })
                        });
                        opt["submenu"] = subsub
                        callback(undefined, opt)
                    }).catch(function(err) {
                        callback(err, undefined)
                    });
                }        
        
                var Menu = function(user, callback) {
                    try {
                        var promises = []
                        var rol = user.rols[0];
        
                        rol.menus.forEach(function(menu) {
                            var item = {}
                            item["id"] = menu.id
                            item["menu"] = menu.descripcion;
        
                            var promise = new Promise(function(resolve, reject) {
                                subMenu(item, menu, function(err, submenu) {
                                    if (submenu)
                                        resolve(submenu);
                                    else
                                        reject(err)
                                });
                            });
                            promises.push(promise);
                        });
        
                        return Promise.all(promises).then(function(items) {
                            var menuPromises = [];
                            for (var i = 0; i < items.length; i++) {
                                menuPromises.push(items[i]);
                            }
                            callback(menuPromises);
                        });
                    } catch (e) {
                        return callback(e);
                    }
                }
        */
        models.user.belongsToMany(models.rol, { foreignKey: 'uid', through: models.usrrol });
        models.rol.belongsToMany(models.user, { foreignKey: 'rid', through: models.usrrol });
        models.rol.belongsToMany(models.menu, { foreignKey: 'rid', through: models.rolfunc });
        models.menu.belongsToMany(models.rol, { foreignKey: 'mid', through: models.rolfunc });

        co(function* () {
            var _rolnegocio = yield models.rol_negocio.find({
                where: { 'uid': id }
            }).catch(function (err) {
                console.log(err)
            });

            models.user.find({
                where: { 'uid': id },
                include: [
                    {
                        model: models.rol,
                        include: [{ model: models.menu, where: { 'pid': { $eq: null } }, required: false }]
                    }
                ]
            }).then(function (usr) {
                //console.log(_rolnegocio.rolnegocio);
                var usuario = []
                var nombre = {}
                nombre["nombre"] = usr.first_name + " " + usr.last_name
                nombre["uid"] = usr.uid
                //nombre["rid"] = usr.rols[0].id
                nombre["rid"] = _rolnegocio.rolnegocio
                usuario.push(nombre)
                NeoMenu(usr, function (menu) {
                    var supermenu = [];
                    menu.forEach(function (opt) {
                        if (opt.submenu.length != 0) {
                            supermenu.push(opt)
                        }
                    });
                    var menus = {}
                    menus["menus"] = supermenu
                    var user = usuario.concat(menus);
                    done(null, user);
                });


            }).catch(function (err) {
                callback(err, 'undefined');
                console.log(err);
            });





            /*
                        Menu(usr, function(menu) {
                            var menus = {}
                            menus["menus"] = menu
                            var user = usuario.concat(menus);
                            //console.dir(user[1].menus)
                            done(null, user);
                        });
            */


        }).catch(function (err) {
            console.log("--------> " + err);
            done(err, null)
        });

    });

    login(passport);

}