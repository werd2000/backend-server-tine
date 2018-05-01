var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var centroMedicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'centros_medicos' });

module.exports = mongoose.model('CentroMedico', centroMedicoSchema);