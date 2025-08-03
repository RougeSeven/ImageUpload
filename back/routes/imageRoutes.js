const File=require('../models/File');
const express=require('express');
const multer = require('multer');
const fs=require('fs');
const router = express.Router();

const destination='uploads/Images';

if(!fs.existsSync(destination))
{
    fs.mkdirSync(destination, {recursive: true});
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, destination), // carpeta uploads/
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});



const upload = multer({ storage });

router.post('/file', upload.single('file'),async (req, res) => {
try{
    const filePathRelative='/'+req.file.destination+'/'+req.file.filename;
    const newFile=new File({
        fileName : req.file.filename,
        filePath : filePathRelative
    });
    const savedFile= await newFile.save();
    res.status(200).json(savedFile, {message: 'file saved successfully'});
}
catch{
    res.status(500).json({message: "Error saving file"});
}
 console.log(req.body);
 console.log(req.file); 
});

router.get('/files', async(req, res)=>{
try{
    const files=await File.find();
    if(files.length==0)
    {
        res.status(404).json({message: 'No files found'});
    }
    else{
        res.status(200).json(files);
    }
}
catch{
    res.status(500).json({message: 'Error finding files'})
}
});
router.get('/file/:id', async(req, res)=>{
try{
    const fileResult=await File.findOne({fileId: req.params.id});
    if(!fileResult)
    {
        res.status(404).json({message: 'No file found'});
    }
    else{
        res.status(200).json(fileResult);
    }
}
catch{
    res.status(500).json({message: 'Error finding file'})
}
});
module.exports=router;