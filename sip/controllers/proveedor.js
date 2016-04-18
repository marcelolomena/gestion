var Proveedor = require('../models/proveedor');

// Create endpoint /api/proveedores for POST
exports.postProveedores = function(req, res) {
  // Create a new instance of the Proveedor model
  var proveedor = new Proveedor();

  // Set the proveedor properties that came from the POST data
  proveedor.razonsocial = req.body.razonsocial;
  proveedor.numrut = req.body.numrut;
  proveedor.dvrut = req.body.dvrut;

  // Save the proveedor and check for errors
  proveedor.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Proveedor added!', data: proveedor });
  });
};

// Create endpoint /api/proveedores for GET
exports.getProveedores = function(req, res) {
  // Use the Proveedores model to find all proveedores
  Proveedor.find({ }, function(err, proveedores) {
    if (err)
      res.send(err);

    res.json(proveedores);
  });
};

// Create endpoint /api/proveedores for GET
exports.getProveedoresPaginados = function(req, res) {
  // Use the Proveedores model to find all proveedores
  
    var page = req.params.page || 2;
    var rowsPerPage = req.params.perpage || 30;

    if(rowsPerPage > 100){ 
        rowsPerPage = 100; //this limits how many per page
    }
  
    var theQuery = 'declare @rowsPerPage as bigint; '+
            'declare @pageNum as bigint;'+
            'set @rowsPerPage='+rowsPerPage+'; '+
            'set @pageNum='+page+';   '+
            'With SQLPaging As   ( '+
            'Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY ID asc) '+
            'as resultNum, * '+
            'FROM proveedor )'+
            'select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);';


    sequelize.sequelize.query(theQuery) 
     .spread(function(result) {
        res.json({result: result});
      });
};

// Create endpoint /api/proveedores/:id for GET
exports.getProveedor = function(req, res) {
  // Use the Proveedor model to find a specific proveedor
  Proveedor.find({ id: req.params.id }, function(err, proveedor) {
    if (err)
      res.send(err);

    res.json(proveedor);
  });
};

// Create endpoint /api/proveedores/:id for PUT
exports.putProveedor = function(req, res) {
  // Use the Proveedor model to find a specific proveedor
  Proveedor.update({ id: req.params.id }, function(err, num, raw) {
    if (err)
      res.send(err);

    res.json({ message: num + ' updated' });
  });
};

// Create endpoint /api/proveedores/:id for DELETE
exports.deleteProveedor = function(req, res) {
  // Use the Proveedor model to find a specific proveedor and remove it
  Proveedor.remove({ id: req.params.id }, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Proveedor removed!' });
  });
};