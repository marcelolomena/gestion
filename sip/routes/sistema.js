var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var logger = require("../utils/logger");
var menu = require('../utils/menu');
var models = require('../models');
var pug = require('pug');
var sequelize = require('../models/index').sequelize;

module.exports = function (passport) {

    router.get('/', function (req, res) {
        res.render('index', {
            message: req.flash('message')
        });
    });

    const redirects = {
        failureRedirect: '/',
        failureFlash: true
    };

    router.post('/login', passport.authenticate('local', redirects),
        function (req, res) {
            var idsistema = req.body.sistema ? req.body.sistema : 1;

            menu.builUserdMenu(req, function (err, data) {
                if (data) {
          
                   // console.log(data);
                    req.session.save(function() {
                        req.session.passport.sidebar = data;
                        

                        var sql = "SELECT pagina.id AS p_id, pagina.nombre AS p_nombre, pagina.title AS p_title, pagina.script AS p_script, "+
                            " pagina.borrado AS borrado, sistema.id AS s_id, sistema.sistema AS s_sistema, sistema.glosasistema AS s_glosasistema, "+
                            " sistema.pagina AS s_pagina, contenido.id AS c_id, contenido.nombre AS c_nombre, contenido.plantilla AS c_plantilla "+
                            " FROM sip.pagina AS pagina LEFT OUTER JOIN sip.sistema AS sistema ON pagina.idsistema = sistema.id "+
                            " LEFT OUTER JOIN sip.contenido AS contenido ON pagina.idcontenido = contenido.id "+
                            " WHERE sistema.id =" + idsistema +" "+
                            " ORDER BY p_id OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY; ";
                      
                        sequelize.query(sql)
                          .spread(function (proyecto) {            
                            for (var i = 0; i < proyecto.length; i++) {
                      
                              a = { p_id : proyecto[i].p_id,
                                p_nombre :proyecto[i].p_nombre,
                                p_title: proyecto[i].p_title,
                                p_script: proyecto[i].p_script,
                                borrado: proyecto[i].borrado,
                                s_id:proyecto[i].s_id,
                                s_sistema:proyecto[i].s_sistema,
                                s_glosasistema: proyecto[i].s_glosasistema,
                                s_pagina: proyecto[i].s_pagina,
                                c_id: proyecto[i].c_id,
                                c_nombre: proyecto[i].c_nombre,
                                c_plantilla:proyecto[i].c_plantilla
                              };
                            }
                            return a;
                            }).then(function () {

                                //console.log(a);
                                var tmpl = pug.renderFile(a.c_plantilla, {
                                    title: a.p_title
                                });

                                var script = "";
                                if (a.p_script)
                                    script = pug.render(a.p_script);

                                return res.render(a.s_pagina, {
                                    user: req.user,
                                    data: data,
                                    page: a.s_pagina,
                                    title: a.p_title,
                                    type: a.c_nombre,
                                    idtype: a.c_id,
                                    html: tmpl,
                                    script: script
                                });
                            })
                            .catch(function (err) {
                                logger.error(err);
                            });
                        });
                    } else {
                        res.render('index', {
                        message: err
                    });
                }
            });
        });

    router.get('/menu/:opt', isAuthenticated, function (req, res, next) {
        var idsistema = req.session.passport.sidebar[0].sistema
        if (req.params.opt === 'signout') {
            req.session.destroy(function (err) {
                if (err) {
                    logger.error(err);
                } else {
                    req.logout();
                    res.redirect('/');
                }
            });
        } else {

            var sql = "SELECT pagina.id AS p_id, pagina.nombre AS p_nombre, pagina.title AS p_title, pagina.script AS p_script, "+
                            " pagina.borrado AS borrado, sistema.id AS s_id, sistema.sistema AS s_sistema, sistema.glosasistema AS s_glosasistema, "+
                            " sistema.pagina AS s_pagina, contenido.id AS c_id, contenido.nombre AS c_nombre, contenido.plantilla AS c_plantilla "+
                            " FROM sip.pagina AS pagina LEFT OUTER JOIN sip.sistema AS sistema ON pagina.idsistema = sistema.id "+
                            " LEFT OUTER JOIN sip.contenido AS contenido ON pagina.idcontenido = contenido.id "+
                            " WHERE sistema.id =" + idsistema +" "+
                            " ORDER BY p_id OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY; ";
                      
                        sequelize.query(sql)
                          .spread(function (proyecto) {            
                            for (var i = 0; i < proyecto.length; i++) {
                      
                              a = { p_id : proyecto[i].p_id,
                                p_nombre :proyecto[i].p_nombre,
                                p_title: proyecto[i].p_title,
                                p_script: proyecto[i].p_script,
                                borrado: proyecto[i].borrado,
                                s_id:proyecto[i].s_id,
                                s_sistema:proyecto[i].s_sistema,
                                s_glosasistema: proyecto[i].s_glosasistema,
                                s_pagina: proyecto[i].s_pagina,
                                c_id: proyecto[i].c_id,
                                c_nombre: proyecto[i].c_nombre,
                                c_plantilla:proyecto[i].c_plantilla
                              };
                            }
                            return a })
                .then(function (pagina) {
                    var tmpl = pug.renderFile(c_plantilla, {
                        title: p_title
                    });
                    var script = pug.render(pagina.script);
                    return res.render(a.s_pagina, {
                        user: req.user,
                        data: req.session.passport.sidebar,
                        page: req.params.opt,
                        title: p_title,
                        type: c_nombre,
                        idtype: c_id,
                        html: tmpl,
                        script: script
                    });

            }).catch(function (err) {
                logger.error(err);
                return next(err)
            });
        }
    });

    return router;
}