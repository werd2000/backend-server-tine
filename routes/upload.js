var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Profesional = require('../models/profesional');
var CentroMedico = require('../models/centroMedico');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colección validos
    var tiposValidos = ['usuarios', 'profesionales', 'centros_medicos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida.',
            errors: { message: 'El tipo de colección no es válido.' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó ningún archivo.',
            errors: { message: 'No seleccionó ningún archivo.' }
        });
    }

    // obtener nombre de archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // sólo estas extensiones se aceptan
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida.',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${ extensionArchivo }`;

    // Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo.',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });


});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    err: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            });
        });
    }
    if (tipo === 'profesionales') {
        Profesional.findById(id, (err, profesional) => {

            if (!profesional) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Profesional no existe',
                    err: { message: 'Profesional no existe' }
                });
            }

            var pathViejo = './uploads/profesionales/' + profesional.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            profesional.img = nombreArchivo;

            profesional.save((err, profesionalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de profesional actualizada',
                    profesional: profesionalActualizado
                });
            });
        });

    }
    if (tipo === 'centros_medicos') {
        CentroMedico.findById(id, (err, centroMedico) => {

            if (!centroMedico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Centro Médico no existe',
                    err: { message: 'Centro Médico no existe' }
                });
            }
            var pathViejo = './uploads/centros_medicos/' + centroMedico.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            centroMedico.img = nombreArchivo;

            centroMedico.save((err, centroActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del Centro Médico actualizada',
                    centroMedico: centroActualizado
                });
            });
        });

    }
}

module.exports = app;