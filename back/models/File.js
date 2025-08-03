const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const fileSchema = new mongoose.Schema({
  fileName: String,
  filePath: String
});

// Agrega el plugin para que evidenceId sea autoincremental
fileSchema.plugin(AutoIncrement, { inc_field: 'fileId' });

module.exports = mongoose.model('File', fileSchema, 'file');
