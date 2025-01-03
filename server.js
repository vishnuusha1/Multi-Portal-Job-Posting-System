
require('module-alias/register');

const express = require("express");
const app = express();
const startCronJob = require('./src/cron-jobs/jobExpire.cron');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const apiDocs = require('./docs/api-docs');



app.use(express.json());

startCronJob()


const swaggerDefinition = apiDocs

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to your route files (can be adjusted as needed)
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Serve Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const api_router=require("./src/routes/api");

app.use('/api',api_router)

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
