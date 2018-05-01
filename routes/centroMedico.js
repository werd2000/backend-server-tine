var express = require('express');

var mdAtenticacion = require('../middlewares/autenticacion');

var app = express();

var CentroMedico = require('../models/centroMedico');

// ==================================
// Obtener todos los centros médicos
// ==================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    CentroMedico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, centrosMedicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Centros Médicos.',
                        errors: err
                    });
                }
                CentroMedico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        centrosMedicos: centrosMedicos
                    });
                });
            });
});

// ===========================
// Actualizar Centro Médico
// ===========================

app.put('/:id', mdAtenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    CentroMedico.findById(id, (err, centroMedico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Centro Médico.',
                errors: err
            });
        }

        if (!centroMedico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Centro Médico con el id ' + id + ' no existe.',
                errors: { message: 'No existe un Centro Médico con ese ID.' }
            });
        }

        centroMedico.nombre = body.nombre;
        centroMedico.usuario = req.usuario._id;

        centroMedico.save((err, centroGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Centro Médico.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                centroMedico: centroGuardado
            });
        });
    });

});


// ===========================
// Crear un nuevo Centro Médico
// ===========================
app.post('/', mdAtenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var centroMedico = new CentroMedico({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    centroMedico.save((err, centroGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Centro Médico.',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            centroMedico: centroGuardado,
        });
    });

});

// ===================================
// Eliminar un Centro Médico por el id
// ===================================
app.delete('/:id', mdAtenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    CentroMedico.findByIdAndRemove(id, (err, centroBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Centro Médico.',
                errors: err
            });
        }
        if (!centroBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Centro Médico con el id ' + id + ' no existe.',
                errors: { message: 'No existe un Centro Médico con ese ID.' }
            });
        }
        res.status(200).json({
            ok: true,
            centroMedico: centroBorrado
        });
    });
});


module.exports = app;