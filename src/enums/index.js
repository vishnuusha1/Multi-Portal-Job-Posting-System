
const FileSizeLimit = Object.freeze({
    DOCUMENT: 5 * 1024 * 1024, 
    LOGO: 2 * 1024 * 1024,    
  });
  
  const AllowedFileTypes= Object.freeze({
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    LOGO: ['image/jpeg', 'image/png'],
  });

  const  FileTypeConfig = Object.freeze({
    DOCUMENT: 'document',
    LOGO: 'logo',
  });
  
  module.exports = { FileSizeLimit, FileTypeConfig ,AllowedFileTypes};
  