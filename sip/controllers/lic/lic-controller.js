'use strict';
var logger = require('../../utils/logger');

function create(entity,data,res){
    entity.create(data)
    .then( function(created){
         res.json({ error: 0, glosa: '' });
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1, glosa: err.message });
    });
}
function update(entity,data,res){
    entity.update(data, {
        where: {
            id: data.id
        }
    })
    .then(function (updated) {
        res.json({ error: 0, glosa: '' });
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1, glosa: err.message });
    });
}
function destroy(entity,id,res){
   entity.destroy({
        where:{
            id:id
        }
    }).then(function (rowDeleted) {
        if (rowDeleted === 1) {
            logger.debug('Deleted successfully');
        }
        res.json({ success: true, glosa: '' });
    }).catch(function (err) {
        logger.error(err);
        res.json({ success: false, glosa: err.message });
    });
}

module.exports = {
    create: create,
    update: update,
    destroy:destroy
};