const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const thumb = require('node-thumbnail').thumb;
const uuid = require('short-uuid');

const app = express();

app.use('/static/images', express.static('images'));

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles : true,
  tempFileDir : './temp/'
}));

const createFilename = (path, filename) => {
  try {
    if (!fs.existsSync(path + filename)) {
      return filename;
    }

    let filenameDetails = filename.split('.');
    filenameDetails[0] = filenameDetails[0] + '_' + uuid.generate();
    const newFileName = filenameDetails.join('.');
    return createFilename(path, newFileName)
  } catch(err) {
    console.error(err)
  }
}

const saveImageLinks = (filename) => {
  let arr;
  fs.readFile(
    "./storage/all_images.json",
    "utf8",
    (err, imageLinks) => {
      if (err) throw err;
      arr = JSON.parse(imageLinks);
      arr.push({
        image: `/static/images/${filename}`,
        thumbnail: `/static/images/${filename.split('.')[0]}_thumbnail.${filename.split('.')[1]}`,
      });

      fs.writeFile(
        "./storage/all_images.json",
        JSON.stringify(arr),
        "utf8",
        (err) => {
          if (err) throw err;
        }
      );
    }
  );
}

app.post('/api/upload', (req, res) => {
  const hasFiles = req.files !== undefined && req.files !== null && Object.keys(req.files).length > 0;
  if(!hasFiles) {
    return res.json({ message: 'Please add files for upload'});
  }

  const destinationFilename = createFilename(`./images/`,req.files.uploadedImage.name);

  return fs.copyFile(`./${req.files.uploadedImage.tempFilePath}`, `./images/${destinationFilename}`, (error) => {
    if(error) throw error;
      thumb({
        source: `./images/${destinationFilename}`, 
        destination: './images',
        width: 50,
        suffix: '_thumbnail',
      }, (files, err, stdout, stderr) => {
        if(err) throw err;
      
        saveImageLinks(destinationFilename);
        return res.sendFile(`${process.cwd()}/images/${destinationFilename}`);
      })
  });
});

app.get('/api/all-images', (req, res) => {
  res.sendFile(`${process.cwd()}/storage/all_images.json`)
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log('SERVER STARTED ON PORT ', PORT);
});