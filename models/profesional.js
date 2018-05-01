var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profesionalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre	es necesario'] },
    apellido: { type: String, required: [true, 'El apellido es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    centroMedico: {
        type: Schema.Types.ObjectId,
        ref: 'CentroMedico',
        required: [true, 'El id del Centro Médico es un campo obligatorio ']
    }
});

module.exports = mongoose.model('Profesional', profesionalSchema);