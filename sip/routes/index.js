var fs = require('fs'),
    validFileTypes = ['js'];

var requireFiles = function (directory, app, passport) {

    fs.readdirSync(directory).forEach(function (fileName) {

        if (fs.lstatSync(directory + '/' + fileName).isDirectory()) {
            requireFiles(directory + '/' + fileName, app);
        } else {

            if (fileName === 'index.js' && directory === __dirname) return;

            if (validFileTypes.indexOf(fileName.split('.').pop()) === -1) return;

            var basename = fileName.split('.')[0];
            //console.log('/' + basename)
            //todas las rutas parten de la raiz
            app.use('/', require('./' + fileName)(passport));
        }
    })
}

module.exports = function (app, passport) {
    requireFiles(__dirname, app, passport);
}
