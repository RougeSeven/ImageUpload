import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages]=useState([]);
  const [shownImage, setShownImage]=useState(null);
  const [message, setMessage] = useState('');
  const BaseURI='http://localhost:3000';

  const setImageSource = async (fileId) =>{
    const chosenFile= await handleGetSingleFile(fileId);
    setShownImage(chosenFile.filePath);
  }

  const handleGetFileList = async () =>{
    const response = await fetch('http://localhost:3000/filesystem/files');
    if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    const result= await response.json();
    setImages(result);
  };
  const handleGetSingleFile = async (fileId) =>{
    const response = await fetch('http://localhost:3000/filesystem/file/'+fileId);
    if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    const result= await response.json();
    return result;
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const upload = async () => {
    if (!file) {
      setMessage('Por favor selecciona una imagen antes de subir.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setMessage('');
      const response = await axios.post('http://localhost:3000/filesystem/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Imagen subida correctamente.');
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      setMessage('Error al subir la imagen.');
    } finally {
      setUploading(false);
      handleGetFileList();
    }
  };

  useEffect(() => {
          handleGetFileList();
      }, []);

  return (
    <div className="container m-auto w-fit text-center justify-center items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Formulario de subida de imágenes</h1>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      <br />

      <button
        type="button"
        onClick={upload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? 'Subiendo...' : 'Enviar'}
      </button>

      {message && (
        <p className="mt-4 text-gray-800 font-semibold">{message}</p>
      )}
      <select onChange={(e)=>setImageSource(e.target.value)}>
        {images.map((imagen)=>(
          <option key={imagen.fileId} value={imagen.fileId}>{imagen.fileId}</option>
        ) 
        )
        }
      </select>
      <div className='m-auto border-dashed border-white w-fit min-w-1/12 h-fit min-h-1/12'>
        <img src={shownImage} title='imagen' />
      </div>
    </div>
  );
}

export default App;