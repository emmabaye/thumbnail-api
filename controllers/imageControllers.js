const fs = require('fs');
const { thumb } = require('node-thumbnail');
const { createFilename, saveImageLinks } = require('../utils/utils');

const handleImageUpload = (req, res) => {
  const destinationFilename = createFilename('./images/', req.files.uploadedImage.name);

  return fs.copyFile(`./${req.files.uploadedImage.tempFilePath}`, `./images/${destinationFilename}`, (error) => {
    if (error) throw error;
    thumb({
      source: `./images/${destinationFilename}`,
      destination: './images',
      width: 50,
      suffix: '_thumbnail',
    }, (files, err) => {
      if (err) throw err;

      saveImageLinks(destinationFilename);

      return res.status(200).json({
        status: 'Image saved successfully',
        image: encodeURI(`/static/images/${destinationFilename}`),
      });
    });
  });
};

const getAllImages = (req, res) => res.status(200).sendFile(`${process.cwd()}/storage/all_images.json`);

module.exports = {
  handleImageUpload,
  getAllImages,
};
