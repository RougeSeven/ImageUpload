require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const fileRoutes = require('./routes/imageRoutes');
app.use('/filesystem', fileRoutes);
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://webback-sable.vercel.app'],
    credentials: true,
  })
);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `🚀 Servidor corriendo en el puerto ${process.env.PORT || 3000}`
      );
    });
  })
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));