'use strict';
var logger = require('../../utils/logger');
var base = require('./lic-controller');



function listAll(req, res) {
   return res.json([{id:1,nombre:'Versión'},{id:2,nombre:'Suite'}]);
}
module.exports = {
    listAll: listAll
};