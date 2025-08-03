const File=require('../models/File');
const express=require('express');
const multer = require('multer');
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // carpeta uploads/
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });
// 🔐 Crear evidencia (protegido)
router.post('/file', async (req, res) => {
  try {
    const {fileType, fileName, filePath } = req.body;
    // Crear nueva evidencia
    const newFile = new File({
      fileType,
      fileName,
      filePath,
    });
    const saved = await newFile.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports=router;