var login = require('./login');
var models = require('../models');
var sequelize = require('../models/index').sequelize;

module.exports = function(passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        done(null, user.uid);
    });

    passport.deserializeUser(function(id, done) {

        var subMenu = function(op, menu, callback) {
            /*agregar query completa*/

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
                //console.log("--------> " + err);
            });
        }

        var NeoMenu = function(user, callback) {
            var sql_menu = `
                        select distinct e.id,e.descripcion from art_user a
                        join sip.usr_rol b on a.uid = b.uid
                        join sip.rol c on b.rid = c.id
                        join sip.rol_func d on d.rid = c.id
                        join sip.menu e on e.id = d.mid
                        where a.uid=:uid and pid is null
                      `
            var sql_submenu = `
                        select distinct e.id,e.descripcion from art_user a
                        join sip.usr_rol b on a.uid = b.uid
                        join sip.rol c on b.rid = c.id
                        join sip.rol_func d on d.rid = c.id
                        join sip.menu e on e.id = d.mid
                        where a.uid=:uid and pid=:pid
                      `
            sequelize.query(sql_menu,
                {
                    replacements: { uid: user.uid },
                    type: sequelize.QueryTypes.SELECT
                }
            ).then(function(rows) {
                var todo = []
                rows.forEach(function(menu) {
                    var item = {}
                    item["id"] = menu.id
                    item["menu"] = menu.descripcion
                    //console.log(menu.id)

                    sequelize.query(sql_submenu,
                        {
                            replacements: { uid: user.uid, pid: menu.id },
                            type: sequelize.QueryTypes.SELECT
                        }
                    ).then(function(submenu) {
                        var opt = {}
                        opt["menu"] = item
                        var subsub = []
                        submenu.forEach(function(opcion) {
                            subsub.push({ "opt": opcion.descripcion, "url": opcion.url })
                        });
                        opt["submenu"] = subsub
                        todo.push(opt);
                    }).catch(function(err) {
                        callback(err, 'undefined');
                    });

                });
                callback('undefined', todo);
            }).catch(function(err) {
                callback(err, 'undefined');
            });
        }

        var Menu = function(user, callback) {
            try {
                var promises = []
                //console.log("--->>>>>>> " + user.Rols.length);
                //console.dir(user.Rols[0])
                var rol = user.rols[0];
                //user.Rols[0].forEach(function (rol) {

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
                //});

                return Promise.all(promises).then(function(items) {
                    var menuPromises = [];
                    for (var i = 0; i < items.length; i++) {
                        menuPromises.push(items[i]);
                    }
                    //return Promise.all(menuPromises);
                    callback(menuPromises);
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
            where: { 'uid': id },
            include: [
                {
                    model: models.rol,
                    include: [{ model: models.menu, where: { 'pid': { $eq: null } }, required: false }]
                }
            ]
            //group: ['[User].[first_name]', '[User].[last_name]', '[Rols.Menus].[descripcion]' , '[Rols.Menus].[url]' ]
        }).then(function(usr) {
            var usuario = []
            var nombre = {}
            nombre["nombre"] = usr.first_name + " " + usr.last_name
            nombre["uid"] = usr.uid
            nombre["rid"] = usr.rols[0].id
            usuario.push(nombre)


            NeoMenu(usr, function(algo) {
                console.dir(algo)
            });            

            Menu(usr, function(menu) {
                var menus = {}
                menus["menus"] = menu
                var user = usuario.concat(menus);
                //console.dir(user[1].menus)
                done(null, user);
            });



        }).catch(function(err) {
            console.log("--------> " + err);
            done(err, null)
        });

    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);

}