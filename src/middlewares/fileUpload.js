const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { FileSizeLimit, FileTypeConfig,AllowedFileTypes } = require('../enums'); 

// Function to create upload directories if they don't exist
const createUploadDirectory = (uploadPath) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};

// Function to handle file upload for any field name
const fileUpload = (fieldName) => {
  // Determine the file path based on the field name
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadPath = `./uploads/${FileTypeConfig.DOCUMENT}`;  // Default path for documents

      if (fieldName === FileTypeConfig.LOGO) {
        uploadPath = `./uploads/${FileTypeConfig.LOGO}`;  // Path for logo uploads
      }

      // Create directory if it doesn't exist
      createUploadDirectory(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const filename = `${timestamp}${fileExtension}`;
      cb(null, filename);
    },
  });

  // File filter based on field name
  const fileFilter = (req, file, cb) => {
    let allowedTypes;
    switch (fieldName) {
      case FileTypeConfig.DOCUMENT:
        allowedTypes = AllowedFileTypes.DOCUMENT;
        break;
      case FileTypeConfig.LOGO:
        allowedTypes = AllowedFileTypes.LOGO;
        break;
      default:
        return cb(new Error('Unknown field'));
    }

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      return cb(new Error(`Invalid file type. Only ${allowedTypes.join(', ')} files are allowed for ${fieldName}.`));
    }
  };

  // Multer configuration based on field name and enums
  let fileSizeLimit;
  switch (fieldName) {
    case 'document':
      fileSizeLimit = FileSizeLimit.DOCUMENT;
      break;
    case 'logo':
      fileSizeLimit = FileSizeLimit.LOGO;
      break;
    default:
      throw new Error('Unknown field');
  }

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: fileSizeLimit },
  }).single(fieldName);
};

module.exports = fileUpload;
