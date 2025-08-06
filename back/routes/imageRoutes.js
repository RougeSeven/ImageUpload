const File=require('../models/File');
const express=require('express');
const multer = require('multer');
const router = express.Router();
const {cloudinary, storage} = require('../cloudinaryConfig');


const destination='uploads/Images';


const upload = multer({storage});

function createSignedURL(imageId, durationSeconds)
{
    const signedUrl = cloudinary.url(imageId, {
      sign_url: true, 
      secure: true,
      type: 'authenticated',
      expires_at: Math.floor(Date.now() / 1000) + durationSeconds, 
    });
    return signedUrl;
}

router.post('/file', upload.single('file'),async (req, res) => {
try{
    const newFile=new File({
        fileName : req.file.filename,
        filePath : req.file.path
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
        const imageResponse={
            fileName: fileResult.fileName,
            filePath: createSignedURL(fileResult.fileName, 120)
        }
        console.log(imageResponse);
        res.status(200).json(imageResponse);
    }
}
catch{
    res.status(500).json({message: 'Error finding file'})
}
});
module.exports=router;