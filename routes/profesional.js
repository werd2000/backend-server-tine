var express = require('express');

var mdAtenticacion = require('../middlewares/autenticacion');

var app = express();

var Profesional = require('../models/profesional');

// ==================================
// Obtener todos los profesionales
// ==================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Profesional.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('centroMedico')
        .exec(
            (err, profesionales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Profesionales.',
                        errors: err
                    });
                }
                Profesional.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        profesionales: profesionales
                    });
                })
            });
});

// ===========================
// Actualizar Profesional
// ===========================

app.put('/:id', mdAtenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Profesional.findById(id, (err, profesional) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Profesional.',
                errors: err
            });
        }

        if (!profesional) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Profesional con el id ' + id + ' no existe.',
                errors: { message: 'No existe un Profesional con ese ID.' }
            });
        }

        profesional.nombre = body.nombre;
        profesional.apellido = body.apellido;
        profesional.centroMedico = body.centroMedico;

        profesional.save((err, profesionalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Profesional.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                profesional: profesionalGuardado
            });
        });
    });

});


// ===========================
// Crear un nuevo Profesional
// ===========================
app.post('/', mdAtenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var profesional = new Profesional({
        nombre: body.nombre,
        apellido: body.apellido,
        centroMedico: body.centroMedico,
        usuario: req.usuario._id
    });

    profesional.save((err, profesionalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Profesional.',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            profesional: profesionalGuardado,
            usuarioToken: req.usuario
        });
    });

});

// ===================================
// Eliminar un Profesional por el id
// ===================================
app.delete('/:id', mdAtenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Profesional.findByIdAndRemove(id, (err, profesionalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Profesional.',
                errors: err
            });
        }
        if (!profesionalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Profesional con el id ' + id + ' no existe.',
                errors: { message: 'No existe un Profesional con ese ID.' }
            });
        }
        res.status(200).json({
            ok: true,
            profesional: profesionalBorrado
        });
    });
});


module.exports = app;