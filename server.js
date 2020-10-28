const express = require('express');
const fileUpload = require('express-fileupload');
const validateImage = require('./middlewares/validateImages');
const { handleImageUpload, getAllImages } = require('./controllers/imageControllers');

const app = express();

app.use('/static/images', express.static('images'));

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: './temp/',
}));

app.get('/', (req, res) => res.status(200).json({message: 'Welcome to Image upload API'}));

// Use key "uploadedImage" to upload image value from API client
app.post('/api/upload', validateImage, handleImageUpload);

app.get('/api/all-images', getAllImages);

const PORT = 3000;

app.listen(PORT, () => {
  console.log('Server listening on port ', PORT);
});
