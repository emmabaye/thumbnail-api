const fs = require('fs');
const uuid = require('short-uuid');

const createFilename = (path, filename) => {
  if (!fs.existsSync(path + filename)) {
    return filename;
  }

  const filenameDetails = filename.split('.');
  filenameDetails[0] = `${filenameDetails[0]}_${uuid.generate()}`;
  const newFileName = filenameDetails.join('.');

  return createFilename(path, newFileName);
};

const getThumbnailFilename = (filename) => {
  const filenameArr = filename.split('.');
  const ext = filenameArr.pop();
  filenameArr[filenameArr.length - 1] = `${filenameArr[filenameArr.length - 1]}_thumbnail.${ext}`;
  return filenameArr.join('.');
};

const saveImageLinks = (filename) => {
  let arr;
  fs.readFile(
    './storage/all_images.json',
    'utf8',
    (err, imageLinks) => {
      if (err) throw err;
      arr = JSON.parse(imageLinks);
      arr.push({
        image: encodeURI(`/static/images/${filename}`),
        thumbnail: encodeURI(`/static/images/${getThumbnailFilename(filename)}`),
      });

      fs.writeFile(
        './storage/all_images.json',
        JSON.stringify(arr),
        'utf8',
        (error) => {
          if (error) throw err;
        },
      );
    },
  );
};

const fileTypeIsSupported = (mimetype) => {
  const mimetypes = ['image/jpeg', 'image/png'];
  return mimetypes.includes(mimetype);
};

module.exports = {
  createFilename,
  getThumbnailFilename,
  saveImageLinks,
  fileTypeIsSupported,
};
