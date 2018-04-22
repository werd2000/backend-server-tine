// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// Conexción a la BD
// mongoose.connect('mongodb://localhost:27017/tineDb')
mongoose.connection.openUri('mongodb://localhost:27017/tineDb', (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});