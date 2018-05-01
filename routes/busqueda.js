var express = require('express');

var app = express();

var CentroMedico = require('../models/centroMedico');
var Profesional = require('../models/profesional');
var Usuario = require('../models/usuario');

// ============================================
// Búsqueda por colección
// ============================================
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'usuario':
            promesa = buscarUsuario(busqueda, regex)
            break;

        case 'profesional':
            promesa = buscarProfesional(busqueda, regex)
            break;

        case 'centro_medico':
            promesa = buscarCentrosMedicos(busqueda, regex)
            break;
        default:
            res.status(400).json({
                ok: false,
                mensaje: 'No se puede realizar la busqueda por ' + tabla + '.',
                error: { message: 'Colección no valido.' }
            });
            break;
    }

    promesa.then(respuestas => {
        res.status(200).json({
            ok: true,
            [tabla]: respuestas
        });

    });

});

// ============================================
// Búsqueda general
// ============================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarCentrosMedicos(busqueda, regex),
        buscarProfesional(busqueda, regex),
        buscarUsuario(busqueda, regex)
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            centrosMedicos: respuestas[0],
            profesionales: respuestas[1],
            usuarios: respuestas[2]
        });

    });

});

function buscarCentrosMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {

        CentroMedico.find({ nombre: regex })
            .populate('usuario', 'nombre apellido email')
            .exec((err, centros) => {
                if (err) {
                    reject('Error al cargar Centros Médicos', err);
                } else {
                    resolve(centros);
                }
            });
    });
}

function buscarProfesional(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Profesional.find({ nombre: regex })
            .populate('usuario', 'nombre apellido email')
            .populate('centroMedico')
            .exec((err, profesionales) => {
                if (err) {
                    reject('Error al cargar profesionales', err);
                } else {
                    resolve(profesionales);
                }
            });
    });
}

function buscarUsuario(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre apellido email role')
            .or([{ 'nombre': regex, 'apellido': regex, 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;