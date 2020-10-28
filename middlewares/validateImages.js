const { fileTypeIsSupported } = require('../utils/utils');

const validateImage = (req, res, next) => {
  const hasFiles = req.files !== undefined
  && req.files !== null && Object.keys(req.files).length > 0;
  if (!hasFiles) {
    return res.status(400).json({ message: 'Please add image files for upload' });
  }
  if (!fileTypeIsSupported(req.files.uploadedImage.mimetype)) {
    return res.status(415).json({ message: 'Files must be jpeg, jpg, png iles' });
  }
  return next();
};

module.exports = validateImage;
