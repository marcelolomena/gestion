var login = require('./login');
var models = require('../models');

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        done(null, user.uid);
    });

    passport.deserializeUser(function (id, done) {


        var subMenu = function (op, menu, callback) {
            return models.menu.findAll({
                where: { 'pid': menu.id }
            }).then(function (submenu) {
                var opt = {}
                opt["menu"] = op
                var subsub = []
                submenu.forEach(function (opcion) {
                    subsub.push({ "opt": opcion.descripcion, "url": opcion.url })
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
                //console.log("--->>>>>>> " + user.Rols.length);
                //console.dir(user.Rols[0])
                var rol = user.rols[0];
                //user.Rols[0].forEach(function (rol) {

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
                //});

                return Promise.all(promises).then(function (items) {
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
                    model: models.Rol,
                    include: [{ model: models.menu, where: { 'pid': { $eq: null } }, required: false }]
                }
            ]
            //group: ['[User].[first_name]', '[User].[last_name]', '[Rols.Menus].[descripcion]' , '[Rols.Menus].[url]' ]
        }).then(function (usr) {
            var usuario = []
            var nombre = {}
            nombre["nombre"] = usr.first_name + " " + usr.last_name
            usuario.push(nombre)

            Menu(usr, function (menu) {
                var menus = {}
                menus["menus"] = menu
                var user = usuario.concat(menus);
                console.log(JSON.stringify(user))
                done(null, user);
            });

        }).catch(function (err) {
            console.log("--------> " + err);
            done(err, null)
        });

    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);

}