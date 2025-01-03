

const baseService = require("@services/baseService");
const db = require("@models");


const Document = db.Document;

const documentService=baseService(Document)


module.exports=documentService;