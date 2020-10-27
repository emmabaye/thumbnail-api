const express = require('express');
const fileUpload = require('express-fileupload');
const Thumbnail = require('thumbnail');
// const sharp = require('sharp');

const app = express();

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles : true,
  tempFileDir : './tmp/'
}));

const thumbnail = new Thumbnail('./tmp', './thumbnails');

  thumbnail.ensureThumbnail('tmp-1-1603790935118.jpg', 100, 100, function (err, filename) {
    // "filename" is the name of the thumb in '/path/to/thumbnails'
    console.log('filename ', filename);
    console.log('error ', err);
});

app.post('/upload', (req, res) => {
  console.log('req files', req.files);
  const hasFiles = req.files !== undefined && req.files !== null && Object.keys(req.files).length > 0;
  if(!hasFiles) {
    return res.json({ message: 'Please add files for upload'});
  }

  const thumbnail = new Thumbnail(req.files.profile.tempFilePath, './thumbnails');

  thumbnail.ensureThumbnail(req.files.profile.tempFilePath.slice(4), 100, 100, function (err, filename) {
    // "filename" is the name of the thumb in '/path/to/thumbnails'
    console.log('filename ', filename);
  });
  
  return res.json({message: 'image received'});
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log('SERVER STARTED ON PORT ', PORT);
});