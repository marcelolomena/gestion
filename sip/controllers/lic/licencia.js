var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");

module.exports = {
    list:function(req,resp){
        var page = req.query.page;
        var rows = req.query.rows;
        var filters = req.query.filters;
        var sidx = req.query.sidx || 'numerorfp';
        var sord = req.query.sord || 'desc';

        var orden = "[licencia]." + sidx + " " + sord;

    },
    action:function(req,res){}
};