import express  from "express";
import cors from 'cors';
import cookie from 'cookie-parser';
import connectDB from './config/db';
import employeeRoutes from './routes/employeeRoutes';
import YAML from 'yamljs'
import {OpenAPIV3} from 'openapi-types'
import swaggerUI from'swagger-ui-express'
import fs from 'fs'

const app = express();

app.use(cors(
  { 
    origin: true,
    credentials: true
  }
));
app.use(cookie());

app.use(express.json());
const yamlContent = fs.readFileSync('./swagger.yaml', 'utf8');

// Parse the YAML content using js-yaml
const parsedSwaggerSpecs:OpenAPIV3.Document = YAML.parse(yamlContent);

// Routes
app.use('/', employeeRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(parsedSwaggerSpecs)); 

// Start the server
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
