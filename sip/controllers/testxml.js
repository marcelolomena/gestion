var fs = require('fs');

var et = require('elementtree');

exports.xmltest = function (req, res) {
    var XML = et.XML;
    var ElementTree = et.ElementTree;
    var element = et.Element;
    var subElement = et.SubElement;

    var data, etree;

    data = fs.readFileSync('factura.xml').toString();
    console.log(data);
    etree = et.parse(data);
    console.log(etree.findtext('*/Documento/Referencia/FolioRef')); 
    //console.log(etree.findall('*/TenantId').length); // 2
    //console.log(etree.findtext('./entry/ServiceName')); // MaaS
    //console.log(etree.findall('./entry/category')[0].get('term')); // monitoring.entity.create
    //console.log(etree.findall('*/category/[@term="monitoring.entity.update"]').length); // 1
};