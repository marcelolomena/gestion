'use strict';
var logger = require('../../utils/logger');
var base = require('./lic-controller');


var entity = models.tipo;

function listAll(req, res) {
   return [{id:1,nombre:'Versión'},{id:1,nombre:'Swite'}];
}
module.exports = {
    listAll: listAll
};