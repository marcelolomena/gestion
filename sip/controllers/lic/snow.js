'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');
var pug = require('pug');
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var logger = require('../../utils/logger');

var entity = models.producto;
entity.hasMany(models.traduccion, { as: 'traducciones', sourceKey: 'id', foreignKey: 'idProducto' });
var includes = [
    {
        model: models.traduccion
    }
];
function map(req) {
    return {
        id: req.body.id || 0,
    }
}
function mapper(data) {
    return _.map(data, function (item) {
        return item;
    });
}


function list(req, res) {
    base.list(req, res, entity, includes, mapper);
}

function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            return base.create(entity, map(req), res);
        case 'edit':
            return base.update(entity, map(req), res);
        case 'del':
            return base.destroy(entity, req.body.id, res);
    }
}
function get(req, res) {
    var tmpl = pug.renderFile('views/lic/upload.pug', {
        title: 'platapapannn'
    });
    return res.render('lic/home', {
        user: req.user,
        data: req.session.passport.sidebar,
        page: req.params.opt,
        title: 'title',
        type: 'upload',
        idtype: 999,
        html: tmpl,
        script: '',
        html: tmpl
    });
}
function xupload(req, res) {
    var busboy = new Busboy({ headers: req.headers });
    var awaitId = new Promise(function (resolve, reject) {
        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
            if (fieldname === 'id') {
                try {
                    resolve(val)
                } catch (err) {
                    return reject(err);
                }
            } else {
                return;
            }
        });
    });

    var awaitParent = new Promise(function (resolve, reject) {
        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
            if (fieldname === 'parent') {
                try {
                    resolve(val)
                } catch (err) {
                    return reject(err);
                }
            } else {
                return;
            }
        });
    });

    function copyFile(source, target) {
        return new Promise(function (resolve, reject) {
            var rd = fs.createReadStream(source);
            rd.on('error', rejectCleanup);
            var wr = fs.createWriteStream(target);
            wr.on('error', rejectCleanup);
            function rejectCleanup(err) {
                rd.destroy();
                wr.end();
                reject(err);
            }
            wr.on('finish', resolve);
            rd.pipe(wr);
        });
    }

    function checkDirectorySync(directory) {
        try {
            fs.statSync(directory);
        } catch (e) {
            fs.mkdirSync(directory);
        }
    }

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        var saveTo = path.join(__dirname, '../../', 'docs', filename);
        file.pipe(fs.createWriteStream(saveTo));
        awaitParent
            .then(function (idParent) {
                var dir = path.join(__dirname, '../../', 'public/docs/' + idParent);
                checkDirectorySync(dir);
                var dest = path.join(__dirname, '../../', 'public/docs/' + idParent, filename);
                copyFile(saveTo, dest)
                awaitId
                    .then(function (idDetail) {
                        models.documentoscotizacion.update({
                            nombrearchivo: filename
                        }, {
                                where: {
                                    id: idDetail
                                }
                            }).then(function (documentoscotizacion) {
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ id: 0, message: err.message, success: false });
                            });
                    }).catch(function (err) {
                        res.json({ error_code: 1, message: err.message, success: false });
                        logger.error(err)
                    });
            }).catch(function (err) {
                res.json({ error_code: 1, message: err.message, success: false });
                logger.error(err)
            });
    });

    busboy.on('finish', function () {
        logger.debug("Finalizo la transferencia del archivo")
        res.json({ error_code: 0, message: 'Archivo guardado', success: true });
    });

    return req.pipe(busboy);
};
function upload(req,res){
    var data = [];
    var head = false;
    var header;
    var rows = [];
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var saveTo = path.join(__dirname, '../../', 'docs', filename);
        file.pipe(fs.createWriteStream(saveTo));
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      file.on('data', function(chunk) {
        var lines = _.split(chunk, '\r\n');
        _.each(lines, function (line) {
            var record = _.split(line, ';');
            if (head) {
                if (record[0] !== '') {
                    data.push(record);
                }
            } else {
                head = true;
                header = record;
            }
        });
        console.log('File [' + fieldname + '] got ' + chunk.length + ' bytes');
      });
      file.on('end', function() {
          _.each(data, function(value, key){
              var row = {};
            _.each(header, function(v,k){
                row[_.replace(v,/"/g,'')] = _.replace(value[k],/"/g,'');
            });
            rows.push(row);
          });
        console.log('File [' + fieldname + '] Finished');
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      res.writeHead(200, { Connection: 'close', Location: '/' });
      res.end();
    });
    req.pipe(busboy);

}
module.exports = {
    list: list,
    action: action,
    upload: upload,
    get: get
}